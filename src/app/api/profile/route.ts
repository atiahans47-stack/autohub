import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ProfileUpdateBody {
  full_name?: string;
  phone?: string;
  date_of_birth?: string;
  profile_photo?: string;
  city?: string;
  quartier?: string;
  address?: string;
  country?: string;
  cni_number?: string;
  cni_front?: string;
  cni_back?: string;
  permis_number?: string;
  permis_expiry?: string;
  permis_front?: string;
  permis_back?: string;
  mtn_momo_number?: string;
  orange_money_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  email_notifications?: boolean;
  sms_notifications?: boolean;
  updated_at?: string;
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    const body: ProfileUpdateBody = await req.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('profiles')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', payload.id as string);

    if (error) throw error;

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
