import { NextRequest, NextResponse } from 'next/server';
import { initiatePayment } from '@/lib/fapshi';

export async function POST(request: NextRequest) {
  try {
    const { amount, email, redirectUrl, userId, externalId, message, phone, name } = await request.json();

    // Validate required fields
    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Amount must be at least 100 XAF' },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!redirectUrl) {
      return NextResponse.json(
        { error: 'Redirect URL is required' },
        { status: 400 }
      );
    }

    // Call Fapshi API to initiate payment
    const data = await initiatePayment({
      amount,
      phone: phone || '',
      name: name || '',
      email: email || '',
      message: message || 'Payment for car rental/sale',
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/confirmed`,
    });

    if (data.error) {
      console.error('Fapshi API error:', data);
      return NextResponse.json(
        { error: data.message || 'Failed to initiate payment' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Payment initiated successfully',
      paymentLink: data.link,
      transactionId: data.transId,
      dateInitiated: data.dateInitiated,
    });
  } catch (error) {
    console.error('Initiate payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
