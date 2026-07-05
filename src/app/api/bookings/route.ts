// src/app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getAuthUserFromRequest, isAdminUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    if (!isAdminUser(user)) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const supabaseAdmin = getSupabaseAdmin();
    let query = supabaseAdmin.from('bookings').select('*');

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: bookings, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    // Fetch related data separately to avoid JOIN issues
    const userIds = bookings?.map(b => b.user_id).filter(Boolean) || [];
    const carIds = bookings?.map(b => b.car_id).filter(Boolean) || [];

    let profilesMap: Record<string, any> = {};
    let carsMap: Record<string, any> = {};

    if (userIds.length > 0) {
      const { data: profiles } = await supabaseAdmin
        .from('profiles')
        .select('id, full_name, email, phone')
        .in('id', userIds);
      profilesMap = (profiles || []).reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
    }

    if (carIds.length > 0) {
      const { data: cars } = await supabaseAdmin
        .from('cars')
        .select('id, name, image')
        .in('id', carIds);
      carsMap = (cars || []).reduce((acc, c) => ({ ...acc, [c.id]: c }), {});
    }

    // Transform data to match frontend expectations
    const transformedBookings = bookings?.map((booking: any) => ({
      _id: booking.id,
      id: booking.id,
      customerName: profilesMap[booking.customer_id]?.full_name || booking.customer_name || 'Unknown',
      customerEmail: profilesMap[booking.customer_id]?.email || booking.customer_email || '',
      customerPhone: profilesMap[booking.customer_id]?.phone || booking.customer_phone || '',
      carName: carsMap[booking.car_id]?.name || booking.car_name || 'Unknown',
      carImage: carsMap[booking.car_id]?.image || '',
      startDate: booking.start_date,
      endDate: booking.end_date,
      location: booking.location,
      amount: booking.amount,
      status: booking.status,
      createdAt: booking.created_at,
    })) || [];

    return NextResponse.json({ bookings: transformedBookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json({ error: 'Internal server error', bookings: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();
    const supabaseAdmin = getSupabaseAdmin();

    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Booking created successfully', booking }, { status: 201 });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}