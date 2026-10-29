import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, getSupabaseServer } from '@/lib/supabase/server';
import { deductUserWallet, refundUserWallet } from '@/lib/supabase/wallet';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nin,
      phone_number,
      firstname,
      lastname,
      dob,
      gender,
      bvn,
      verification_type,
      slip_type,
      download_type,
    } = body;

    const ageApiKey = process.env.AGE_VERIFY_API_KEY || 'av_live_68735df178f2441999252efebf0fdfcf';

    // Identify if this is BVN retrieval with phone number
    const isBvnPhoneRetrieval =
      verification_type === 'bvn_phone' ||
      (verification_type === 'bvn' && !!phone_number && !bvn) ||
      (verification_type === 'bvn' && !!phone_number) ||
      !!body.bvn_phone_number;

    const isBvn = verification_type === 'bvn' || !!bvn || isBvnPhoneRetrieval;

    // 1. Determine service pricing
    let defaultServiceCost = 300;
    const isSlipDownload =
      !!download_type ||
      slip_type === 'basic' ||
      slip_type === 'plastic' ||
      slip_type === 'regular_pro' ||
      slip_type === 'vnin';

    if (isSlipDownload) {
      defaultServiceCost = 300;
    } else if (isBvn) {
      const st = (slip_type || 'basic').toLowerCase();
      if (st === 'plastic' || st === 'regular_pro') defaultServiceCost = 300;
      else defaultServiceCost = 200;
    } else {
      defaultServiceCost = 300;
    }

    // 2. Identify authenticated user
    const authUser = await getAuthenticatedUser(request);
    let debitedAmount = 0;
    let newBalanceAfterDebit: number | undefined;

    if (authUser) {
      let costToCharge = defaultServiceCost;
      if (isBvn && authUser.agent_bvn_price && authUser.agent_bvn_price > 0) {
        costToCharge = authUser.agent_bvn_price;
      } else if (!isBvn && authUser.agent_nin_price && authUser.agent_nin_price > 0) {
        costToCharge = authUser.agent_nin_price;
      }

      // Check balance and deduct before hitting external gateway
      const debitResult = await deductUserWallet(authUser.id, costToCharge);
      if (!debitResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: debitResult.error || 'Insufficient wallet balance. Please fund your wallet.',
          },
          { status: 402 }
        );
      }

      debitedAmount = costToCharge;
      newBalanceAfterDebit = debitResult.new_balance;
    }

    // 3. Prepare API Gateway Payload
    let payload: Record<string, unknown> = {};
    if (isBvnPhoneRetrieval) {
      payload = {
        phone_number: phone_number || nin,
        service: 'bvn',
        type: 'bvn_phone',
        slip_type: slip_type || 'basic',
      };
    } else if (verification_type === 'phone' || !!phone_number) {
      payload = { phone_number };
    } else if (verification_type === 'demo' || (firstname && lastname && dob)) {
      payload = { firstname, lastname, dob, gender: gender || 'male' };
    } else if (isBvn) {
      payload = { bvn: bvn || nin, slip_type: slip_type || 'basic' };
    } else {
      payload = { nin, slip_type: slip_type || 'standard' };
    }

    const endpoints = isBvnPhoneRetrieval
      ? [
          'https://ageverify.com.ng/api/v1/verify',
          'https://ageverify.com.ng/api/v1/nin_phone_verify.php',
        ]
      : isBvn
      ? ['https://ageverify.com.ng/api/v1/verify']
      : [
          'https://ageverify.com.ng/api/v1/verify',
          'https://ageverify.com.ng/api/v1/nin_phone_verify.php',
        ];

    let ageRes: Response | null = null;
    let ageData: any = null;
    let fetchError: Error | null = null;

    for (let i = 0; i < endpoints.length; i++) {
      const endpoint = endpoints[i];
      try {
        ageRes = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ageApiKey}`,
            'x-api-key': ageApiKey,
          },
          body: JSON.stringify({
            api_key: ageApiKey,
            ...payload,
            phone: phone_number,
            number: phone_number || nin || bvn,
          }),
        });

        ageData = await ageRes.json();
        if (
          ageRes.ok &&
          (ageData.success ||
            ageData.status === true ||
            ageData.status === 'success' ||
            (ageData.data && !ageData.error))
        ) {
          break;
        }
      } catch (e: any) {
        fetchError = e;
        // try fallback endpoint if available
      }
    }

    const isSuccess =
      ageRes &&
      ageRes.ok &&
      (ageData?.success === true ||
        ageData?.status === true ||
        ageData?.status === 'success' ||
        (ageData?.data && !ageData?.error));

    // 4. Handle FAILURE & AUTO-REFUND
    if (!isSuccess) {
      const rawErrMsg =
        ageData?.message ||
        ageData?.error ||
        fetchError?.message ||
        'Verification query failed at gateway';
      const cleanErrMsg = String(rawErrMsg).replace(/ageverify(\.com\.ng)?/gi, 'verification gateway');

      // AUTO-REFUND POLICY:
      // Applies ONLY to BVN retrieval with phone number (and IPE services via ipe-status)
      // The refund is credited strictly to the submitted account email (authUser.id / authUser.email)
      const isEligibleForAutoRefund =
        isBvnPhoneRetrieval &&
        authUser &&
        debitedAmount > 0;

      let refundDetails: { amount: number; new_balance: number; reason: string } | null = null;

      if (isEligibleForAutoRefund && authUser) {
        // EXACT amount that was debited is refunded to the submitted account
        const refundRes = await refundUserWallet(
          authUser.id,
          debitedAmount,
          `Failed BVN retrieval with phone number from API provider (${cleanErrMsg})`
        );

        if (refundRes.success && refundRes.new_balance !== undefined) {
          refundDetails = {
            amount: debitedAmount,
            new_balance: refundRes.new_balance,
            reason: 'Failed BVN retrieval with phone number from API provider',
          };
        }
      }

      // Log failed/refunded verification to Supabase history
      if (authUser) {
        try {
          const supabase = getSupabaseServer();
          await supabase.from('verification_history').insert({
            user_id: authUser.id,
            user_email: authUser.email,
            service_type: isBvnPhoneRetrieval
              ? 'bvn_phone'
              : isBvn
              ? 'bvn'
              : verification_type || 'nin',
            verification_type: isBvnPhoneRetrieval
              ? 'bvn_phone'
              : isBvn
              ? 'bvn'
              : verification_type || 'nin',
            query_value: phone_number || bvn || nin || firstname || 'query',
            amount_charged: debitedAmount,
            status: refundDetails ? 'refunded' : 'failed',
            refunded: !!refundDetails,
            refund_reason: refundDetails ? cleanErrMsg : null,
            refunded_at: refundDetails ? new Date().toISOString() : null,
            created_at: new Date().toISOString(),
          });
        } catch (logErr) {
          console.warn('Could not log failed verification to history:', logErr);
        }
      }

      return NextResponse.json(
        {
          success: false,
          error: refundDetails
            ? `${cleanErrMsg} — ₦${refundDetails.amount} has been automatically refunded to your wallet (${authUser?.email}).`
            : cleanErrMsg,
          refunded: !!refundDetails,
          refund: refundDetails || undefined,
          new_balance: refundDetails ? refundDetails.new_balance : newBalanceAfterDebit,
        },
        { status: ageRes?.status || 400 }
      );
    }

    // 5. Handle SUCCESS
    if (authUser && debitedAmount > 0) {
      try {
        const supabase = getSupabaseServer();
        await supabase.from('verification_history').insert({
          user_id: authUser.id,
          user_email: authUser.email,
          service_type: isBvnPhoneRetrieval
            ? 'bvn_phone'
            : isBvn
            ? 'bvn'
            : verification_type || 'nin',
          verification_type: isBvnPhoneRetrieval
            ? 'bvn_phone'
            : isBvn
            ? 'bvn'
            : verification_type || 'nin',
          query_value: phone_number || bvn || nin || firstname || 'query',
          amount_charged: debitedAmount,
          status: 'success',
          refunded: false,
          created_at: new Date().toISOString(),
        });
      } catch (logErr) {
        console.warn('Could not log success verification to history:', logErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: ageData.data || ageData,
      amount_charged: debitedAmount,
      new_balance: newBalanceAfterDebit,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
