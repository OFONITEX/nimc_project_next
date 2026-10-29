import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, getSupabaseServer } from '@/lib/supabase/server';
import { refundUserWallet } from '@/lib/supabase/wallet';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tracking_id } = body;

    const cleanId = String(tracking_id || '')
      .replace(/[^A-Za-z0-9]/g, '')
      .trim()
      .toUpperCase();

    if (!cleanId) {
      return NextResponse.json(
        { success: false, error: 'Tracking ID is required.' },
        { status: 400 }
      );
    }

    // 1. Authenticate user
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const supabase = getSupabaseServer();

    // 2. Query verification_history to find the original IPE submission
    const { data: historyItems } = await supabase
      .from('verification_history')
      .select('*')
      .eq('query_value', cleanId)
      .ilike('service_type', '%ipe%')
      .order('created_at', { ascending: false })
      .limit(1);

    const submission = historyItems && historyItems.length > 0 ? historyItems[0] : null;

    // 3. Query external NIMC / Gateway source if configured
    const ageApiKey = process.env.AGE_VERIFY_API_KEY || 'av_live_68735df178f2441999252efebf0fdfcf';
    let gatewayData: any = null;
    let isGatewayConnected = false;

    const isSpecialSubmission =
      submission?.service_type === 'ipe_special' ||
      /hit|abis|block|special/i.test(String(submission?.category || submission?.reply || ''));

    try {
      // 1. If special IPE or unknown, try Special IPE status endpoint
      const specialUrl = `https://ageverify.com.ng/api/v1/ipe_special_status.php?api_key=${encodeURIComponent(ageApiKey)}&tracking_id=${encodeURIComponent(cleanId)}`;
      let res = await fetch(specialUrl, {
        headers: { 'x-api-key': ageApiKey, Authorization: `Bearer ${ageApiKey}` },
      });
      if (res.ok) {
        const text = await res.text();
        try { gatewayData = JSON.parse(text); isGatewayConnected = true; } catch {}
      }

      // 2. If not special or not found in special endpoint, try clearance status endpoint
      if (!gatewayData || gatewayData.status === false || !gatewayData.data) {
        const clearanceRes = await fetch('https://ageverify.com.ng/api/v1/ipe_clearance_status.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': ageApiKey, Authorization: `Bearer ${ageApiKey}` },
          body: JSON.stringify({ api_key: ageApiKey, tracking_id: cleanId, batch_id: submission?.reference || cleanId }),
        });
        if (clearanceRes.ok) {
          const clText = await clearanceRes.text();
          try {
            const clJson = JSON.parse(clText);
            if (clJson && (clJson.status || clJson.data || clJson.records)) {
              gatewayData = clJson;
              isGatewayConnected = true;
            }
          } catch {}
        }
      }
    } catch {
      // Gateway error / unreachable
    }

    // Determine if source reported "no record found", "failed", "rejected", etc.
    const rawReply =
      gatewayData?.data?.admin_reply ||
      gatewayData?.data?.reply ||
      gatewayData?.reply ||
      gatewayData?.message ||
      gatewayData?.error ||
      submission?.reply ||
      '';
    const lowerReply = String(rawReply).toLowerCase();

    // Check indicator of failed or no record found
    const isFailedOrNoRecord =
      lowerReply.includes('no record') ||
      lowerReply.includes('not found') ||
      lowerReply.includes('not exist') ||
      lowerReply.includes('invalid tracking') ||
      lowerReply.includes('no active record') ||
      lowerReply.includes('could not be cleared') ||
      lowerReply.includes('cannot be cleared') ||
      lowerReply.includes('failed') ||
      lowerReply.includes('rejected') ||
      lowerReply.includes('declined') ||
      lowerReply.includes('unsuccessful') ||
      (isGatewayConnected && gatewayData?.status === false && !gatewayData?.data);

    // 4. AUTO-REFUND POLICY:
    // Applies to Special IPE & Standard IPE when source reports failure or no record found.
    // The refund is credited strictly to the SUBMITTED account email.
    if (isFailedOrNoRecord) {
      // Target user is the submitted account (submission.user_id), fallback to current user
      const targetUserId = submission?.user_id || authUser.id;
      const targetUserEmail = submission?.user_email || authUser.email;
      const defaultPrice = isSpecialSubmission ? 1000 : 350;
      const debitedAmount =
        submission?.amount_charged !== undefined ? submission.amount_charged : defaultPrice;
      const alreadyRefunded = submission?.refunded === true;

      let refundDetails: { amount: number; new_balance: number; reason: string } | null = null;

      if (!alreadyRefunded && debitedAmount > 0 && targetUserId) {
        // Refund EXACT debited amount back to the submitted account's wallet
        const refundRes = await refundUserWallet(
          targetUserId,
          debitedAmount,
          `Auto-refund: Failed/No record after IPE check for ${cleanId}`
        );

        if (refundRes.success && refundRes.new_balance !== undefined) {
          refundDetails = {
            amount: debitedAmount,
            new_balance: refundRes.new_balance,
            reason: 'No active IPE record found from source',
          };

          // Mark submission as refunded in verification_history
          if (submission?.id) {
            await supabase
              .from('verification_history')
              .update({
                status: 'no_record',
                refunded: true,
                refund_reason: 'No record found or failed IPE clearance at source',
                refunded_at: new Date().toISOString(),
                reply: `No active IPE record found. ₦${debitedAmount} refunded to ${targetUserEmail}.`,
              })
              .eq('id', submission.id);
          }
        }
      }

      const isCurrentSubmitter = authUser.id === targetUserId;

      const replyText = refundDetails
        ? isCurrentSubmitter
          ? `No active IPE record found from source. ₦${refundDetails.amount} has been automatically refunded to your wallet.`
          : `No active IPE record found from source. ₦${refundDetails.amount} has been automatically refunded to the submitted account (${targetUserEmail}).`
        : alreadyRefunded
        ? `No active IPE record found. This request was already previously refunded to ${targetUserEmail}.`
        : 'No active IPE record found for this tracking ID.';

      return NextResponse.json({
        success: false,
        status: 'no_record',
        tracking_id: cleanId,
        reference: submission?.reference || cleanId,
        reply: replyText,
        // Only return new_balance to client if the current user is the submitted account being credited
        refund: isCurrentSubmitter ? refundDetails || undefined : undefined,
      });
    }

    // 5. If cleared or record exists
    const isCleared =
      lowerReply.includes('cleared') ||
      lowerReply.includes('approved') ||
      lowerReply.includes('completed') ||
      (gatewayData && gatewayData.success && gatewayData.data);

    if (isCleared) {
      if (submission?.id && submission.status !== 'cleared') {
        await supabase
          .from('verification_history')
          .update({
            status: 'cleared',
            reply: 'IPE Clearance request cleared and completed.',
          })
          .eq('id', submission.id);
      }

      return NextResponse.json({
        success: true,
        status: 'cleared',
        tracking_id: cleanId,
        reference: submission?.reference || cleanId,
        reply: 'IPE Clearance request cleared and completed.',
        download_url: gatewayData?.download_url || gatewayData?.pdf_url || null,
        data: gatewayData?.data || null,
      });
    }

    // Default status (pending / processing)
    return NextResponse.json({
      success: true,
      status: submission?.status || 'processing',
      tracking_id: cleanId,
      reference: submission?.reference || cleanId,
      reply:
        rawReply ||
        'Your IPE clearance request has been forwarded to the NIMC verification gateway and is being processed.',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
