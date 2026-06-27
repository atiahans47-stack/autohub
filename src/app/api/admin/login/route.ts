import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import type { UserProfile, SingleResult } from '@/types/database';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const supabaseAdmin = getSupabaseAdmin();

    const { data: user, error } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name, role, password_hash, is_verified, profile_photo')
      .eq('email', email.trim().toLowerCase())
      .single() as SingleResult<Pick<UserProfile, 'id' | 'email' | 'full_name' | 'role' | 'password_hash' | 'is_verified' | 'profile_photo'>>;

    if (error || !user || !user.password_hash) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. This account is not an administrator account.' },
        { status: 403 }
      );
    }

    await supabaseAdmin
      .from('profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    const response = NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.full_name,
        profile_photo: user.profile_photo,
      }
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
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
