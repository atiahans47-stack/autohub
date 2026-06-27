import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAuthUserFromRequest, isAdminUser } from '@/lib/auth';
import type { ChatRoom, SingleResult } from '@/types/database';

// GET all chat rooms (admin) or own room (customer)
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    let userId: string | null = user?.id || null;
    let isAdmin = isAdminUser(user);

    if (isAdmin) {
      const { data: rooms, error } = await supabase
        .from('chat_rooms')
        .select('*, chat_messages(count)')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json({ rooms: rooms || [] });
    } else if (userId) {
      const { data: rooms, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('customer_id', userId)
        .single() as SingleResult<ChatRoom>;

      if (error) throw error;
      return NextResponse.json({ room: rooms });
    } else {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Get chat rooms error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new chat room
export async function POST(request: NextRequest) {
  try {
    const { customer_id, customer_name, customer_email } = await request.json();

    if (!customer_id || !customer_name) {
      return NextResponse.json(
        { error: 'Customer ID and name are required' },
        { status: 400 }
      );
    }

    // Check if room already exists
    const { data: existingRoom } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('customer_id', customer_id)
      .single() as SingleResult<ChatRoom>;

    if (existingRoom) {
      return NextResponse.json({ room: existingRoom });
    }

    // Create new room
    const { data: room, error } = await (supabase.from('chat_rooms') as any)
      .insert({
        customer_id,
        customer_name,
        customer_email,
        status: 'open',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: 'Chat room created successfully',
      room,
    }, { status: 201 });
  } catch (error) {
    console.error('Create chat room error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
