import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('auth-token')?.value;

  const adminRoutes = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
  const dashboardRoutes = pathname.startsWith('/dashboard');

  if (!adminRoutes && !dashboardRoutes) {
    return NextResponse.next();
  }

  if (!token) {
    if (adminRoutes) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    return NextResponse.redirect(new URL(`/auth/login?returnTo=${pathname}`, req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    if (adminRoutes && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login?error=unauthorized', req.url));
    }

    return NextResponse.next();
  } catch {
    if (adminRoutes) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    return NextResponse.redirect(new URL(`/auth/login?returnTo=${pathname}`, req.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
