import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Testimonial, SingleResult } from '@/types/database';

export async function GET() {
  try {
    const { data: testimonials, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('status', 'Approved')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      message: 'Testimonials retrieved successfully',
      data: testimonials,
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, rating, testimonial } = body;

    if (!name || !email || !rating || !testimonial) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const { data: testimonialData, error } = await (supabase.from('testimonials') as any)
      .insert({
        name,
        email,
        rating,
        testimonial,
        verified: false,
        status: 'Pending',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        message: 'Testimonial submitted successfully',
        data: testimonialData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create testimonial error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
