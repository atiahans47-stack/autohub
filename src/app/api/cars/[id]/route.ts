import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAuthUserFromRequest, isAdminUser } from '@/lib/auth';
import type { Car, SingleResult } from '@/types/database';

// GET single car
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: car, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .single() as SingleResult<Car>;

    if (error || !car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      );
    }

    // Normalize features from comma-separated string to array
    if (car.features && typeof car.features === 'string') {
      car.features = car.features.split(',').map((f: string) => f.trim()).filter(Boolean);
    }

    return NextResponse.json({ car });
  } catch (error) {
    console.error('Get car error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update car (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    const { data: car, error } = await (supabase.from('cars') as any)
      .update(carData)
      .eq('id', id)
      .select()
      .single();

    if (error || !car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Car updated successfully',
      car,
    });
  } catch (error) {
    console.error('Update car error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE car (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Car deleted successfully',
    });
  } catch (error) {
    console.error('Delete car error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
