import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  // Define route groups
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isProtectedUserRoute = pathname.startsWith('/my-orders') || pathname.startsWith('/checkout');

  // Handle protected routes
  if (!session) {
    if (isAdminRoute || isProtectedUserRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  const payload = await decrypt(session);

  if (!payload) {
    // Session is invalid, clear it
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session');
    return response;
  }

  // Handle auth routes (login/register) when already logged in
  if (isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Admin access control
  if (isAdminRoute && payload.role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Next.js 16 (Nexus Fork) uses proxy.ts instead of middleware.ts
export const config = {
  matcher: ['/admin/:path*', '/login', '/register', '/my-orders', '/checkout'],
};
