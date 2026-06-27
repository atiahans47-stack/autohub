import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAuthUserFromRequest, isAdminUser } from '@/lib/auth';
import type { Booking, Sale } from '@/types/database';

// GET admin dashboard KPIs (admin only)
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

    // Get total bookings count
    const { count: totalBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });

    // Get active rentals count
    const { count: activeRentals } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Active');

    // Get total revenue from bookings
    const { data: bookings } = await supabase
      .from('bookings')
      .select('total_price')
      .eq('payment_status', 'Paid') as { data: Pick<Booking, 'total_price'>[] | null; error: unknown };

    const totalRevenue = bookings?.reduce((sum, booking) => sum + (booking.total_price || 0), 0) || 0;

    // Get total cars count
    const { count: totalCars } = await supabase
      .from('cars')
      .select('*', { count: 'exact', head: true });

    // Get available cars count
    const { count: availableCars } = await supabase
      .from('cars')
      .select('*', { count: 'exact', head: true })
      .eq('availability', 'Available');

    // Get total sales count
    const { count: totalSales } = await supabase
      .from('sales')
      .select('*', { count: 'exact', head: true });

    // Get total sales revenue
    const { data: sales } = await supabase
      .from('sales')
      .select('total_price')
      .eq('payment_status', 'Paid') as { data: Pick<Sale, 'total_price'>[] | null; error: unknown };

    const totalSalesRevenue = sales?.reduce((sum, sale) => sum + (sale.total_price || 0), 0) || 0;

    // Get total users count
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Get pending reviews count
    const { count: pendingReviews } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Pending');

    return NextResponse.json({
      stats: {
        totalBookings: totalBookings || 0,
        activeRentals: activeRentals || 0,
        totalRevenue,
        totalCars: totalCars || 0,
        availableCars: availableCars || 0,
        totalSales: totalSales || 0,
        totalSalesRevenue,
        totalUsers: totalUsers || 0,
        pendingReviews: pendingReviews || 0,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
