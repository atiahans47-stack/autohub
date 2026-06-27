import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ user: null });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, phone, profile_photo')
      .eq('id', payload.id as string)
      .single() as { data: { id: string; email: string; full_name: string; role: string; phone: string; profile_photo: string } | null; error: unknown };

    return NextResponse.json({ user: profile });
  } catch {
    return NextResponse.json({ user: null });
  }
}
