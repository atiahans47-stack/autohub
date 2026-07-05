import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get total cars
    const { count: totalCars } = await supabase
      .from('cars')
      .select('*', { count: 'exact', head: true });

    // Get total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Get total bookings
    const { count: totalBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });

    // Get total sales
    const { count: totalSales } = await supabase
      .from('sales')
      .select('*', { count: 'exact', head: true });

    // Get total revenue from bookings
    const { data: bookings } = await supabase
      .from('bookings')
      .select('total_price')
      .eq('status', 'confirmed');

    const bookingRevenue = bookings?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0;

    // Get total revenue from sales
    const { data: sales } = await supabase
      .from('sales')
      .select('sale_price')
      .eq('status', 'completed');

    const salesRevenue = sales?.reduce((sum, s) => sum + (s.sale_price || 0), 0) || 0;

    // Get unread chat messages (like WhatsApp)
    const { count: unreadChats } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .is('admin_seen_at', null)
      .eq('sender', 'client');

    const totalRevenue = bookingRevenue + salesRevenue;

    return NextResponse.json({
      totalCars: totalCars || 0,
      totalUsers: totalUsers || 0,
      totalBookings: totalBookings || 0,
      totalSales: totalSales || 0,
      totalRevenue,
      pendingMessages: unreadChats || 0,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
