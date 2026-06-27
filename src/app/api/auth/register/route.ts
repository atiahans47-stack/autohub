import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { randomUUID } from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, full_name, phone, preferred_language, date_of_birth } = body;

    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: 'Email, password and full name are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Generate ID manually since we're not using Supabase Auth
    const id = randomUUID();

    // Create profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert({
        id,
        email: email.trim().toLowerCase(),
        password_hash,
        full_name: full_name.trim() || email.split('@')[0],
        phone: phone || '',
        preferred_language: preferred_language || 'en',
        date_of_birth: date_of_birth || null,
        country: 'Cameroon',
        role: 'customer',
        is_verified: false,
        email_notifications: true,
        sms_notifications: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single() as {
        data: { id: string; email: string; role: string; full_name: string } | null;
        error: unknown;
      };

    if (error || !profile) {
      console.error('Register error:', error);
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }

    // Create JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new SignJWT({
      id: profile.id,
      email: profile.email,
      role: profile.role,
      full_name: profile.full_name,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret);

    const response = NextResponse.json({
      success: true,
      user: profile,
      redirect: '/',
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;

  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}