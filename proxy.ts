import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  // Define route groups
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  // If no session, continue
  if (!session) {
    return NextResponse.next();
  }

  const payload = await decrypt(session);

  if (!payload) {
    const response = NextResponse.next();
    response.cookies.delete('session');
    return response;
  }

  // If customer is already logged in, redirect away from login/register
  if (isAuthRoute && payload.role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register'],
};
