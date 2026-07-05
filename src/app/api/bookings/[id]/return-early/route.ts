import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getAuthUserFromRequest, isAdminUser } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    if (!isAdminUser(user)) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

    const bookingId = params.id;
    const supabaseAdmin = getSupabaseAdmin();

    // Get booking details
    const { data: booking, error: fetchError } = await supabaseAdmin
      .from('bookings')
      .select('id, car_id, status')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Update booking status to Completed
    const { error: bookingUpdateError } = await supabaseAdmin
      .from('bookings')
      .update({ 
        status: 'Completed',
        payment_status: 'Paid'
      })
      .eq('id', bookingId);

    if (bookingUpdateError) throw bookingUpdateError;

    // Set car back to Available
    const { error: carUpdateError } = await supabaseAdmin
      .from('cars')
      .update({ availability: 'Available' })
      .eq('id', booking.car_id);

    if (carUpdateError) throw carUpdateError;

    return NextResponse.json({ 
      message: 'Car returned early and marked as available',
      bookingId,
      carId: booking.car_id
    });
  } catch (error) {
    console.error('Return early error:', error);
    return NextResponse.json({ 
      error: 'Internal server error'
    }, { status: 500 });
  }
}
