import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getAuthUserFromRequest, isAdminUser } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdminUser(user)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { sender, message } = await req.json();

    if (!message || !sender) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { id: sessionId } = await params;

    // Get the chat room to find the user ID
    const { data: room, error: roomError } = await supabaseAdmin
      .from('chat_rooms')
      .select('created_by')
      .eq('id', sessionId)
      .single();

    if (roomError || !room) {
      return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
    }

    // For admin messages, use the actual admin user ID from JWT
    // For client messages, use the room's created_by (the user who started the chat)
    const senderId = sender === 'admin' ? user.id : room.created_by;

    // Insert the message
    const { data: newMessage, error: insertError } = await supabaseAdmin
      .from('chat_messages')
      .insert({
        room_id: sessionId,
        sender_id: senderId,
        message,
        is_read: false,
        admin_seen_at: sender === 'admin' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Message insert error:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Update room's updated_at
    await supabaseAdmin
      .from('chat_rooms')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Admin send message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
