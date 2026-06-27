import { NextRequest, NextResponse } from 'next/server';
import { supabase, getSupabaseAdmin } from '@/lib/supabase';
import { getAuthUserFromRequest, isAdminUser } from '@/lib/auth';
import type { Car } from '@/types/database';

// GET all cars
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const availability = searchParams.get('availability');
    const location = searchParams.get('location');

    let query = supabase.from('cars').select('*');

    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    if (availability && availability !== 'all') {
      query = query.eq('availability', availability);
    }

    if (location && location !== 'all') {
      query = query.eq('location', location);
    }

    query = query.order('created_at', { ascending: false });

    const { data: cars, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    // Normalize features from comma-separated string to array
    const normalizedCars = (cars || []).map((car: any) => {
      if (car.features && typeof car.features === 'string') {
        car.features = car.features.split(',').map((f: string) => f.trim()).filter(Boolean);
      }
      return car;
    });

    return NextResponse.json({ cars: normalizedCars });
  } catch (error) {
    console.error('Get cars error:', error);
    return NextResponse.json(
      { error: 'Internal server error', cars: [] },
      { status: 500 }
    );
  }
}

// POST create new car (admin only)
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

    const body = await request.json();

    // Explicitly map form fields → DB columns
    const carData = {
      name: body.name,
      brand: body.brand ?? null,
      type: body.type,
      price: body.price,
      transmission: body.transmission ?? null,
      fuel_type: body.fuelType ?? null,
      seats: body.seats ?? null,
      availability: body.availability ?? 'Available',
      location: body.location ?? null,
      image: body.image ?? null,
      image2: body.image2 ?? null,
      image3: body.image3 ?? null,
      mileage: body.mileage ?? null,
      year: body.year ?? null,
      condition: body.condition ?? null,
      engine: body.engine ?? null,
      horsepower: body.horsepower ?? null,
      fuel_consumption: body.fuelConsumption ?? null,
      deposit: body.deposit ?? null,
      mileage_limit: body.mileageLimit ?? null,
      fuel_policy: body.fuelPolicy ?? null,
      return_condition: body.returnCondition ?? null,
      features: body.features ?? null,
    };

    // Use admin client — bypasses RLS, safe because auth is verified above
    const supabaseAdmin = getSupabaseAdmin();
    const { data: car, error } = await supabaseAdmin
      .from('cars')
      .insert(carData)
      .select()
      .single();

    if (error) {
      console.error('Create car error:', error);
      throw error;
    }

    return NextResponse.json({ message: 'Car created successfully', car }, { status: 201 });
  } catch (error) {
    console.error('Create car error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
