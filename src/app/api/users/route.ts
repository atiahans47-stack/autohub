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

    // Transform data to match frontend expectations
    const transformedUsers = users?.map((profile: any) => ({
      _id: profile.id,
      id: profile.id,
      name: profile.full_name || 'Unknown',
      email: profile.email,
      phone: profile.phone || '',
      role: profile.role || 'customer',
      status: profile.is_verified ? 'Active' : 'Inactive',
      totalBookings: 0, // Would need to aggregate from bookings table
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
