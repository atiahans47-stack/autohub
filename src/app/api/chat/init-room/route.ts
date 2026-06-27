import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    if (!payload.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Trust the verified JWT, not anything the client sends in the body.
    const userId = payload.id as string;
    const fullName = (payload.full_name as string) || 'User';
    const email = (payload.email as string) || '';

    const supabaseAdmin = getSupabaseAdmin();

    const { data: existing, error: lookupError } = await supabaseAdmin
      .from('chat_rooms')
      .select('id')
      .eq('created_by', userId)
      .maybeSingle();

    if (lookupError) {
      console.error('Chat room lookup error:', lookupError);
      return NextResponse.json({ error: lookupError.message }, { status: 500 });
    }

    if (existing?.id) {
      return NextResponse.json({ roomId: existing.id });
    }

    const { data: newRoom, error } = await supabaseAdmin
      .from('chat_rooms')
      .insert({
        created_by: userId,
        name: `${fullName} - Support`,
        type: 'direct',
        status: 'Open',
        user_name: fullName,
        user_email: email,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Chat room create error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ roomId: newRoom.id });
  } catch (err) {
    console.error('init-room error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}