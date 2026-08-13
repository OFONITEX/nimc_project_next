import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json();
    const { nin, phone_number, firstname, lastname, dob, gender, bvn, verification_type, slip_type, download_type } = body;

    const ageApiKey = process.env.AGE_VERIFY_API_KEY || 'av_live_68735df178f2441999252efebf0fdfcf';
    
    // Determine cost
    let serviceCost = 300;
    const isSlipDownload = !!download_type || slip_type === 'basic' || slip_type === 'plastic' || slip_type === 'regular_pro' || slip_type === 'vnin';
    
    if (isSlipDownload) {
      serviceCost = 300;
    } else if (verification_type === 'bvn' || !!bvn) {
      const st = (slip_type || 'basic').toLowerCase();
      if (st === 'plastic' || st === 'regular_pro') serviceCost = 300;
      else serviceCost = 200;
    } else {
      serviceCost = 300;
    }

    // Call AgeVerify API
    let payload = {};
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
        'Authorization': `Bearer ${ageApiKey}`
      },
      body: JSON.stringify(payload)
    });

    const ageData = await ageRes.json();

    if (!ageRes.ok || !ageData.success) {
      return NextResponse.json(
        { success: false, error: ageData.message || ageData.error || 'Verification query failed' },
        { status: ageRes.status || 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ageData.data || ageData,
      amount_charged: serviceCost
    });

  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
