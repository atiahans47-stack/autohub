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

    const supabaseAdmin = getSupabaseAdmin();
    const { id: sessionId } = await params;

    // Mark all messages in this room as seen by admin
    const { error } = await supabaseAdmin
      .from('chat_messages')
      .update({ admin_seen_at: new Date().toISOString() })
      .eq('room_id', sessionId)
      .is('admin_seen_at', null);

    if (error) {
      console.error('Mark messages seen error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark messages seen error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
