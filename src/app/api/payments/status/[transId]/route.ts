import { NextRequest, NextResponse } from 'next/server';

const FAPSHI_API_URL = process.env.FAPSHI_MODE === 'live' 
  ? 'https://api.fapshi.com' 
  : 'https://sandbox.fapshi.com';

const FAPSHI_API_USER = process.env.FAPSHI_API_USER!;
const FAPSHI_API_KEY = process.env.FAPSHI_API_KEY!;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ transId: string }> }
) {
  try {
    const { transId } = await params;

    if (!transId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Call Fapshi API to check payment status
    const response = await fetch(`${FAPSHI_API_URL}/payment-status/${transId}`, {
      method: 'GET',
      headers: {
        'apikey': FAPSHI_API_KEY,
        'apiuser': FAPSHI_API_USER,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Fapshi API error:', data);
      return NextResponse.json(
        { error: data.message || 'Failed to check payment status' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      transactionId: data.transId,
      status: data.status,
      amount: data.amount,
      revenue: data.revenue,
      payerName: data.payerName,
      email: data.email,
      paymentMethod: data.paymentMethod,
      dateInitiated: data.dateInitiated,
      dateConfirmed: data.dateConfirmed,
      externalId: data.externalId,
    });
  } catch (error) {
    console.error('Check payment status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
