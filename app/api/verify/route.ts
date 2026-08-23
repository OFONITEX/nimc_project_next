import { NextRequest, NextResponse } from 'next/server';

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

    // Determine service pricing
    let serviceCost = 300;
    const isSlipDownload =
      !!download_type ||
      slip_type === 'basic' ||
      slip_type === 'plastic' ||
      slip_type === 'regular_pro' ||
      slip_type === 'vnin';

    if (isSlipDownload) {
      serviceCost = 300;
    } else if (verification_type === 'bvn' || !!bvn) {
      const st = (slip_type || 'basic').toLowerCase();
      if (st === 'plastic' || st === 'regular_pro') serviceCost = 300;
      else serviceCost = 200;
    } else {
      serviceCost = 300;
    }

    // Prepare API Gateway Payload
    let payload: Record<string, unknown> = {};
    if (verification_type === 'phone' || !!phone_number) {
      payload = { phone_number };
    } else if (verification_type === 'demo' || (firstname && lastname && dob)) {
      payload = { firstname, lastname, dob, gender: gender || 'male' };
    } else if (verification_type === 'bvn' || !!bvn) {
      payload = { bvn: bvn || nin, slip_type: slip_type || 'basic' };
    } else {
      payload = { nin, slip_type: slip_type || 'standard' };
    }

    const ageRes = await fetch('https://ageverify.com.ng/api/v1/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ageApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const ageData = await ageRes.json();

    if (!ageRes.ok || !ageData.success) {
      const rawErrMsg = ageData.message || ageData.error || 'Verification query failed';
      const cleanErrMsg = String(rawErrMsg).replace(/ageverify(\.com\.ng)?/gi, 'verification gateway');
      return NextResponse.json(
        { success: false, error: cleanErrMsg },
        { status: ageRes.status || 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ageData.data || ageData,
      amount_charged: serviceCost,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
