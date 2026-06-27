import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getSupabaseAdmin } from '@/lib/supabase';

// GET messages for a room
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }

    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id as string;

    const supabaseAdmin = getSupabaseAdmin();

    // Verify user has access to this room (room belongs to user)
    const { data: room } = await supabaseAdmin
      .from('chat_rooms')
      .select('created_by')
      .eq('id', roomId)
      .single();

    if (!room || room.created_by !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: messages, error } = await supabaseAdmin
      .from('chat_messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ messages: messages || [] });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Internal server error', messages: [] },
      { status: 500 }
    );
  }
}

// POST send a message
export async function POST(request: NextRequest) {
  try {
    const { room_id, sender_id, sender_type, message } = await request.json();

    if (!room_id || !sender_id || !sender_type || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (sender_type !== 'customer' && sender_type !== 'admin') {
      return NextResponse.json(
        { error: 'Invalid sender type' },
        { status: 400 }
      );
    }

    const { data: messageData, error } = await (supabase.from('chat_messages') as any)
      .insert({
        room_id,
        sender_id,
        sender_type,
        message,
        read: false,
      })
      .select()
      .single();

    if (error) throw error;

    // Update room updated_at timestamp
    await (supabase.from('chat_rooms') as any)
      .update({ updated_at: new Date().toISOString() })
      .eq('id', room_id);

    return NextResponse.json({
      message: 'Message sent successfully',
      data: messageData,
    }, { status: 201 });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
