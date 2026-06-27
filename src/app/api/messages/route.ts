import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAuthUserFromRequest, isAdminUser } from '@/lib/auth';
import type { Message } from '@/types/database';

// GET all messages (admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    if (!isAdminUser(user)) {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    let query = supabase.from('messages').select('*');

    if (conversationId) {
      query = query.eq('conversation_id', conversationId);
    }

    query = query.order('created_at', { ascending: true });

    const { data: messages, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ messages: messages || [] });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Internal server error', messages: [] },
      { status: 500 }
    );
  }
}

// POST create new message
export async function POST(request: NextRequest) {
  try {
    const messageData = await request.json() as Partial<Message>;

    const { data: message, error } = await (supabase.from('messages') as any)
      .insert(messageData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: 'Message created successfully',
      data: message,
    }, { status: 201 });
  } catch (error) {
    console.error('Create message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}