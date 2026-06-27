import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getAuthUserFromRequest, isAdminUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdminUser(user)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Get all chat rooms with user info and latest message
    const { data: rooms, error: roomsError } = await supabaseAdmin
      .from('chat_rooms')
      .select(`
        id,
        name,
        status,
        created_at,
        updated_at,
        created_by,
        user_name,
        user_email,
        profiles:created_by (
          full_name,
          email
        ),
        chat_messages (
          id,
          sender_id,
          message,
          is_read,
          client_seen_at,
          admin_seen_at,
          created_at
        )
      `)
      .order('updated_at', { ascending: false });

    if (roomsError) {
      console.error('Chat rooms fetch error:', roomsError);
      return NextResponse.json({ error: roomsError.message }, { status: 500 });
    }

    // Format the response
    const sessions = rooms?.map((room: any) => ({
      id: room.id,
      userName: room.profiles?.full_name || room.user_name || room.name || 'Unknown',
      userEmail: room.profiles?.email || room.user_email || '',
      status: room.status || 'Open',
      lastActivity: room.updated_at,
      messages: (room.chat_messages || []).map((msg: any) => ({
        id: msg.id,
        sessionId: room.id,
        sender: msg.sender_id === room.created_by ? 'client' : 'admin',
        message: msg.message,
        clientSeenAt: msg.client_seen_at,
        adminSeenAt: msg.admin_seen_at,
        createdAt: msg.created_at,
      })),
    })) || [];

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Admin chat sessions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
