import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getAuthUserFromRequest, isAdminUser } from '@/lib/auth';

// GET all users (admin only)
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
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    const supabaseAdmin = getSupabaseAdmin();
    let query = supabaseAdmin.from('profiles').select('*');

    if (role && role !== 'all') {
      query = query.eq('role', role);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    query = query.order('created_at', { ascending: false });

    const { data: users, error } = await query;

    if (error) {
      throw error;
    }

    // Get booking counts for each user
    const userIds = users?.map((u: any) => u.id) || [];
    let bookingCounts: Record<string, number> = {};

    if (userIds.length > 0) {
      const { data: bookings } = await supabaseAdmin
        .from('bookings')
        .select('customer_id')
        .in('customer_id', userIds);

      if (bookings) {
        bookingCounts = bookings.reduce((acc: Record<string, number>, booking: any) => {
          acc[booking.customer_id] = (acc[booking.customer_id] || 0) + 1;
          return acc;
        }, {});
      }
    }

    // Transform data to match frontend expectations
    const transformedUsers = users?.map((profile: any) => ({
      _id: profile.id,
      id: profile.id,
      name: profile.full_name || 'Unknown',
      email: profile.email,
      phone: profile.phone || '',
      role: profile.role || 'customer',
      status: profile.is_verified ? 'Active' : 'Inactive',
      totalBookings: bookingCounts[profile.id] || 0,
      totalPurchases: 0, // Would need to aggregate from sales table
      joinedDate: profile.created_at,
      lastActive: profile.last_login || profile.created_at,
    })) || [];

    return NextResponse.json({ users: transformedUsers });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error', users: [] },
      { status: 500 }
    );
  }
}

// POST create new user (admin only)
export async function POST(request: NextRequest) {
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

    const userData = await request.json();

    const supabaseAdmin = getSupabaseAdmin();
    const { data: newUser, error } = await supabaseAdmin
      .from('profiles')
      .insert(userData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: newUser,
    }, { status: 201 });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
