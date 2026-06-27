import { NextRequest, NextResponse } from 'next/server';
import { supabase, getSupabaseAdmin } from '@/lib/supabase';
import { getAuthUserFromRequest, isAdminUser } from '@/lib/auth';
import type { Review } from '@/types/database';

// GET all reviews (admin only) or approved reviews (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const carId = searchParams.get('carId');
    const status = searchParams.get('status');
    const isAdmin = searchParams.get('admin') === 'true';

    // Use admin client to avoid RLS policy recursion issues
    const supabaseAdmin = getSupabaseAdmin();

    let query = supabaseAdmin.from('reviews').select('*');

    if (isAdmin) {
      const user = await getAuthUserFromRequest(request);
      if (!user || !isAdminUser(user)) {
        return NextResponse.json(
          { error: 'Unauthorized. Admin access required.' },
          { status: 401 }
        );
      }

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
    } else {
      query = query.eq('status', 'Approved');
    }

    if (carId) {
      query = query.eq('car_id', carId);
    }

    query = query.order('created_at', { ascending: false });

    const { data: reviews, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ reviews: reviews || [] });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error', reviews: [] },
      { status: 500 }
    );
  }
}

// POST create new review
export async function POST(request: NextRequest) {
  try {
    const reviewData = await request.json() as Partial<Review>;

    // Use admin client to avoid RLS policy recursion issues
    const supabaseAdmin = getSupabaseAdmin();

    // Remove user_id from the data to avoid foreign key constraint issues
    // The user_id is stored for reference but doesn't need to be a foreign key
    const { user_id, ...reviewDataWithoutUserId } = reviewData;

    const { data: review, error } = await (supabaseAdmin.from('reviews') as any)
      .insert({
        ...reviewDataWithoutUserId,
        user_id: user_id || null, // Store as plain text, not a foreign key
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: 'Review created successfully',
      review,
    }, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
