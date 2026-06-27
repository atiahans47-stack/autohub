import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { randomUUID } from 'crypto';

const adminAccessCode = process.env.ADMIN_ACCESS_CODE!;

export async function POST(request: Request) {
  try {
    const { email, password, fullName, accessCode } = await request.json();

    if (accessCode !== adminAccessCode) {
      return NextResponse.json(
        { error: 'Invalid admin access code' },
        { status: 401 }
      );
    }

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle();

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = randomUUID();

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        email: email.trim().toLowerCase(),
        password_hash: passwordHash,
        full_name: fullName,
        role: 'admin',
        is_verified: true,
        admin_created_at: new Date().toISOString(),
        admin_notes: 'Created via admin registration portal',
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return NextResponse.json(
        { error: 'Failed to create profile' },
        { status: 500 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new SignJWT({
      id: userId,
      email: email.trim().toLowerCase(),
      role: 'admin',
      fullName: fullName,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    const response = NextResponse.json({ 
      success: true,
      message: 'Admin account created successfully',
      redirect: '/admin/dashboard'
    });

    response.cookies.set('auth-token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Admin registration error:', error);
    return NextResponse.json(
      { error: 'Server error during registration' },
      { status: 500 }
    );
  }
}
