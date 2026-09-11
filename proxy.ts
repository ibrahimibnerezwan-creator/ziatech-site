import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  // Define route groups
  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const isProtectedUserRoute = pathname.startsWith('/my-orders');

  // Handle protected customer routes
  if (!session) {
    if (isProtectedUserRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  const payload = await decrypt(session);

  if (!payload) {
    // Session is invalid, clear it
    if (isProtectedUserRoute) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('session');
      return response;
    }
    return NextResponse.next();
  }

  // If customer is already logged in, redirect away from login/register
  if (isAuthRoute && payload.role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/my-orders/:path*'],
};
