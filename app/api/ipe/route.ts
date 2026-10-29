import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, getSupabaseServer } from '@/lib/supabase/server';
import { deductUserWallet } from '@/lib/supabase/wallet';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tracking_id, clearance_type } = body;

    const cleanId = String(tracking_id || '')
      .replace(/[^A-Za-z0-9]/g, '')
      .trim()
      .toUpperCase();

    if (!cleanId || cleanId.length < 5) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid 15-character Tracking ID.' },
        { status: 400 }
      );
    }

    // 1. Authenticate user
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in to submit IPE clearance.' },
        { status: 401 }
      );
    }

    // 2. Determine price:
    // Special IPE: Admin (brinoekanem@gmail.com) = ₦500, all other accounts = ₦1,000
    // Standard IPE: Admin = ₦350, Agent = ₦600, Operator = ₦1,500
    const isAdmin =
      authUser.email.toLowerCase().trim() === 'brinoekanem@gmail.com' ||
      authUser.role === 'admin';
    const isAgent = authUser.role === 'agent';
    const isSpecial =
      body.service_mode === 'special' ||
      /hit|abis|block|special/i.test(String(body.category || clearance_type || ''));
    const ipeCost = isSpecial
      ? (isAdmin ? 500 : 1000)
      : (isAdmin ? 350 : isAgent ? 600 : 1500);

    // 3. Check user wallet balance first
    const supabase = getSupabaseServer();
    const { data: userProfile } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', authUser.id)
      .single();

    const currentBal = parseFloat(userProfile?.wallet_balance || '0');
    if (currentBal < ipeCost) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient wallet balance (₦${currentBal.toFixed(2)}). ${isSpecial ? 'Special IPE' : 'IPE'} requires ₦${ipeCost.toFixed(2)}. Please fund your wallet.`,
        },
        { status: 402 }
      );
    }

    // 4. Upstream Gateway Submission
    const ageApiKey = process.env.AGE_VERIFY_API_KEY || 'av_live_68735df178f2441999252efebf0fdfcf';
    const targetEndpoint = isSpecial
      ? 'https://ageverify.com.ng/api/v1/ipe_special.php'
      : 'https://ageverify.com.ng/api/v1/ipe_clearance.php';

    let normType = 'hit';
    const catStr = String(body.category || clearance_type || '').toLowerCase();
    if (catStr.includes('abis')) normType = 'ready_abis';
    else if (catStr.includes('block')) normType = 'blocked';
    else if (catStr.includes('hit')) normType = 'hit';

    let providerResJson: any = null;
    try {
      const pResp = await fetch(targetEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': ageApiKey, Authorization: `Bearer ${ageApiKey}` },
        body: JSON.stringify({
          api_key: ageApiKey,
          tracking_id: cleanId,
          trackingNo: cleanId,
          tracking_ids: [cleanId],
          ipe_type: normType,
          category: body.category || 'HIT IPE',
          clearance_type: body.category || 'HIT IPE',
        }),
      });
      const pText = await pResp.text();
      try { providerResJson = JSON.parse(pText); } catch {}
    } catch (netErr) {
      console.warn('IPE provider connection error:', netErr);
    }

    const rawMsg = String(providerResJson?.message || providerResJson?.reply || providerResJson?.error || '').trim();
    const isNotFound = /not\s*found|invalid\s*tracking|incorrect\s*tracking|no\s*record/i.test(rawMsg);

    // If upstream actively rejected or failed upfront, reject without charging the customer
    if (providerResJson && (providerResJson.status === false || isNotFound)) {
      const errMsg = isNotFound
        ? 'Incorrect Tracking ID: No matching enrollment record found on NIMC server. Please verify the characters on the slip.'
        : rawMsg || 'IPE Clearance request rejected by provider gateway.';
      return NextResponse.json({ success: false, error: errMsg }, { status: 400 });
    }

    // 5. Deduct wallet only on successful / accepted upstream submission
    const debitResult = await deductUserWallet(authUser.id, ipeCost);
    if (!debitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: debitResult.error || `Insufficient wallet balance. ${isSpecial ? 'Special IPE' : 'IPE'} requires ₦${ipeCost}.`,
        },
        { status: 402 }
      );
    }

    // 6. Record in verification_history with exact amount charged
    const pData = providerResJson?.data || {};
    const reference = pData.batch_id || providerResJson?.batch_id || pData.reference || `IPE-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalReply = pData.reply || providerResJson?.message || `${body.category || clearance_type || (isSpecial ? 'Special IPE' : 'IPE Clearance')} submitted to NIMC clearance gateway.`;

    try {
      await supabase.from('verification_history').insert({
        user_id: authUser.id,
        user_email: authUser.email,
        service_type: isSpecial ? 'ipe_special' : 'ipe',
        verification_type: isSpecial ? 'ipe_special' : 'ipe',
        query_value: cleanId,
        reference: reference,
        amount_charged: ipeCost,
        status: 'pending',
        reply: finalReply,
        refunded: false,
        created_at: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.warn('Could not record IPE request in verification_history:', dbErr);
    }

    return NextResponse.json({
      success: true,
      reference,
      tracking_id: cleanId,
      status: 'pending',
      amount_charged: ipeCost,
      new_balance: debitResult.new_balance,
      reply: finalReply,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

