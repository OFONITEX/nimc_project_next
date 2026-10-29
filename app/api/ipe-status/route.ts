import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, getSupabaseServer } from '@/lib/supabase/server';
import { refundUserWallet } from '@/lib/supabase/wallet';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tracking_id, reference, batch_id } = body;

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
    const storedBatchId = (batch_id || reference || submission?.reference || '').trim();

    // 3. Query external NIMC / AgeVerify Gateway source
    const ageApiKey = process.env.AGE_VERIFY_API_KEY || 'av_live_68735df178f2441999252efebf0fdfcf';
    let gatewayData: any = null;

    const isSpecialSubmission =
      submission?.service_type === 'ipe_special' ||
      /hit|abis|block|special/i.test(String(submission?.category || submission?.reply || ''));

    try {
      // 1. Check Special IPE status endpoint
      const batchQuery = storedBatchId && !storedBatchId.startsWith('IPE-') ? `&batch_id=${encodeURIComponent(storedBatchId)}` : '';
      const specialUrl = `https://ageverify.com.ng/api/v1/ipe_special_status.php?api_key=${encodeURIComponent(ageApiKey)}${batchQuery}&tracking_ids=${encodeURIComponent(cleanId)}`;
      let res = await fetch(specialUrl, {
        headers: { 'x-api-key': ageApiKey, Authorization: `Bearer ${ageApiKey}` },
      });
      if (res.ok) {
        const text = await res.text();
        try {
          const parsed = JSON.parse(text);
          if (parsed && (parsed.status || parsed.data)) {
            gatewayData = parsed;
          }
        } catch {}
      }

      // Fallback: Special IPE without batch_id if first query returned no requests
      if (!gatewayData?.data?.requests?.length && !gatewayData?.requests?.length) {
        const specialFallbackUrl = `https://ageverify.com.ng/api/v1/ipe_special_status.php?api_key=${encodeURIComponent(ageApiKey)}&tracking_ids=${encodeURIComponent(cleanId)}`;
        const resFb = await fetch(specialFallbackUrl, {
          headers: { 'x-api-key': ageApiKey, Authorization: `Bearer ${ageApiKey}` },
        });
        if (resFb.ok) {
          const textFb = await resFb.text();
          try {
            const parsedFb = JSON.parse(textFb);
            if (parsedFb?.data?.requests?.length || parsedFb?.requests?.length) {
              gatewayData = parsedFb;
            }
          } catch {}
        }
      }

      // 2. If not found in Special IPE endpoint, query Standard IPE clearance status endpoint
      const hasSpecialMatch =
        gatewayData?.data?.requests?.some((r: any) => String(r.tracking_id || '').toUpperCase() === cleanId) ||
        gatewayData?.requests?.some((r: any) => String(r.tracking_id || '').toUpperCase() === cleanId);

      if (!hasSpecialMatch) {
        const clearanceRes = await fetch('https://ageverify.com.ng/api/v1/ipe_clearance_status.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': ageApiKey, Authorization: `Bearer ${ageApiKey}` },
          body: JSON.stringify({
            api_key: ageApiKey,
            tracking_id: cleanId,
            batch_id: storedBatchId || cleanId,
          }),
        });
        if (clearanceRes.ok) {
          const clText = await clearanceRes.text();
          try {
            const clJson = JSON.parse(clText);
            if (clJson && (clJson.status || clJson.data || clJson.records)) {
              gatewayData = clJson;
            }
          } catch {}
        }
      }
    } catch (netErr) {
      console.warn('Gateway connection error in IPE status check:', netErr);
    }

    // 4. Extract matched record directly from provider payload
    let matchedReq: any = null;
    if (gatewayData?.data?.requests && Array.isArray(gatewayData.data.requests)) {
      matchedReq = gatewayData.data.requests.find(
        (r: any) => String(r.tracking_id || '').toUpperCase() === cleanId
      );
    } else if (gatewayData?.requests && Array.isArray(gatewayData.requests)) {
      matchedReq = gatewayData.requests.find(
        (r: any) => String(r.tracking_id || '').toUpperCase() === cleanId
      );
    } else if (gatewayData?.data?.records && Array.isArray(gatewayData.data.records)) {
      matchedReq = gatewayData.data.records.find(
        (r: any) => String(r.tracking_id || r.tracking_no || '').toUpperCase() === cleanId
      );
    } else if (gatewayData?.records && Array.isArray(gatewayData.records)) {
      matchedReq = gatewayData.records.find(
        (r: any) => String(r.tracking_id || r.tracking_no || '').toUpperCase() === cleanId
      );
    } else if (gatewayData?.data && typeof gatewayData.data === 'object' && !Array.isArray(gatewayData.data)) {
      matchedReq = gatewayData.data;
    }

    // 5. Determine direct provider lifecycle status
    // Status Meanings from Documentation:
    // - pending: Received and waiting to be processed (Queued). refunded: false
    // - processing: Being worked on (In Progress). refunded: false
    // - completed: Finished. admin_reply contains result (Cleared). refunded: false
    // - failed: Could not be processed. Amount refunded (Failed / Refunded). refunded: true
    const rawStatus = String(matchedReq?.status || '').toLowerCase().trim();
    const isProviderRefunded = matchedReq?.refunded === true || String(matchedReq?.refunded) === 'true';
    const adminReply = matchedReq?.admin_reply || matchedReq?.reply || matchedReq?.message || '';

    let currentStatus = 'pending';
    let replyText = '';
    let isProviderFailed = false;

    if (rawStatus === 'completed' || rawStatus === 'cleared') {
      currentStatus = 'cleared';
      replyText = adminReply ? `Clearance Completed: ${adminReply}` : 'IPE Clearance completed successfully.';
    } else if (rawStatus === 'processing' || rawStatus === 'in progress') {
      currentStatus = 'processing';
      replyText = 'IPE clearance is in progress and currently being worked on.';
    } else if (rawStatus === 'pending' || rawStatus === 'queued') {
      currentStatus = 'pending';
      replyText = 'IPE clearance request received and queued waiting to be processed.';
    } else if (rawStatus === 'failed' || isProviderRefunded) {
      // Must come directly from the provider!
      currentStatus = 'refunded';
      isProviderFailed = true;
      replyText = adminReply ? `IPE clearance failed: ${adminReply}` : 'IPE clearance could not be processed and was refunded by provider.';
    } else {
      // If provider endpoint did not return a match (e.g. gateway query miss or still indexing),
      // DO NOT fail or refund! Preserve the current database status (defaulting to 'pending' / Queued).
      currentStatus = submission?.status || 'pending';
      replyText = submission?.reply || 'IPE clearance request received and queued waiting to be processed.';
    }

    // 6. AUTO-REFUND POLICY:
    // Only refunded when the API source confirms failed or refunded directly from the provider!
    let refundDetails: { amount: number; new_balance: number; reason: string } | null = null;

    if (isProviderFailed) {
      const targetUserId = submission?.user_id || authUser.id;
      const targetUserEmail = submission?.user_email || authUser.email;
      const defaultPrice = isSpecialSubmission ? 1000 : 350;
      const debitedAmount =
        submission?.amount_charged !== undefined ? submission.amount_charged : defaultPrice;
      const alreadyRefunded = submission?.refunded === true;

      if (!alreadyRefunded && debitedAmount > 0 && targetUserId) {
        const refundRes = await refundUserWallet(
          targetUserId,
          debitedAmount,
          `Refund: Failed IPE Clearance (${cleanId})`
        );

        if (refundRes.success && refundRes.new_balance !== undefined) {
          refundDetails = {
            amount: debitedAmount,
            new_balance: refundRes.new_balance,
            reason: adminReply || 'Failed IPE clearance confirmed by provider',
          };

          if (submission?.id) {
            await supabase
              .from('verification_history')
              .update({
                status: 'refunded',
                refunded: true,
                refund_reason: adminReply || 'Failed IPE clearance confirmed by provider',
                refunded_at: new Date().toISOString(),
                reply: `IPE clearance failed (${adminReply || 'Could not be processed'}). ₦${debitedAmount} refunded to ${targetUserEmail}.`,
              })
              .eq('id', submission.id);
          }
        }
      }

      const isCurrentSubmitter = authUser.id === targetUserId;
      replyText = refundDetails
        ? isCurrentSubmitter
          ? `IPE clearance failed: ${adminReply || 'Could not be processed'}. ₦${refundDetails.amount} has been automatically refunded to your wallet.`
          : `IPE clearance failed: ${adminReply || 'Could not be processed'}. ₦${refundDetails.amount} has been refunded to ${targetUserEmail}.`
        : alreadyRefunded
        ? `IPE clearance failed. This request was already previously refunded to ${targetUserEmail}.`
        : `IPE clearance failed: ${adminReply || 'Could not be processed'}.`;

      return NextResponse.json({
        success: false,
        status: 'refunded',
        tracking_id: cleanId,
        reference: submission?.reference || cleanId,
        reply: replyText,
        refund: isCurrentSubmitter ? refundDetails || undefined : undefined,
      });
    }

    // 7. Update verification_history if status changed to cleared or processing
    if (submission?.id && currentStatus !== submission.status) {
      await supabase
        .from('verification_history')
        .update({
          status: currentStatus,
          reply: replyText,
        })
        .eq('id', submission.id);
    }

    return NextResponse.json({
      success: true,
      status: currentStatus,
      tracking_id: cleanId,
      reference: submission?.reference || cleanId,
      reply: replyText,
      download_url: gatewayData?.download_url || gatewayData?.pdf_url || null,
      data: matchedReq || null,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
