import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    if (!payload.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { roomId, senderId, message } = await req.json();

    if (payload.id !== senderId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Verify the room belongs to this user before inserting
    const { data: room } = await supabaseAdmin
      .from('chat_rooms')
      .select('created_by')
      .eq('id', roomId)
      .single();

    if (!room || room.created_by !== senderId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: savedMessage, error } = await supabaseAdmin
      .from('chat_messages')
      .insert({
        room_id: roomId,
        sender_id: senderId,
        message: message,
        is_read: false,
        client_seen_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabaseAdmin
      .from('chat_rooms')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', roomId);

    return NextResponse.json({ success: true, message: savedMessage });
  } catch (err) {
    console.error('send-message error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
