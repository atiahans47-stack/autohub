import { NextRequest, NextResponse } from 'next/server';

// This endpoint is designed to be called by a cron job (e.g., Vercel Cron Jobs)
// It checks for expired bookings and updates their status
// To set up in Vercel, add to vercel.json:
// {
//   "crons": [{
//     "path": "/api/cron/check-expired-bookings",
//     "schedule": "0 * * * *"
//   }]
// }

export async function GET(request: NextRequest) {
  try {
    // Verify this is called by cron (optional security check)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Call the check-expired endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/bookings/check-expired`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Expired bookings checked successfully',
      ...data,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      success: false
    }, { status: 500 });
  }
}
