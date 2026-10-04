import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';
export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/') && !['GET','HEAD','OPTIONS'].includes(request.method)) {
    const origin = request.headers.get('origin');
    if (origin) {
      let sameOrigin = false;
      try { const url = new URL(origin); sameOrigin = ['http:', 'https:'].includes(url.protocol) && url.host === request.headers.get('host'); } catch {}
      if (!sameOrigin) return NextResponse.json({error:'Invalid request origin'},{status:403});
    }
  }
  const session = request.cookies.get('session')?.value;
  const payload = session ? await decrypt(session) : null;
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/admin/') && payload?.role !== 'admin') return NextResponse.redirect(new URL('/admin',request.url));
  if ((pathname === '/login' || pathname === '/register') && payload) return NextResponse.redirect(new URL(payload.role === 'admin' ? '/admin' : '/',request.url));
  const response=NextResponse.next();
  if (session && !payload) response.cookies.delete('session');
  if (pathname.startsWith('/admin')) {
    response.headers.set('Cache-Control','private, no-store');
    response.headers.set('X-Robots-Tag','noindex, nofollow');
  }
  return response;
}
export const config={matcher:['/login','/register','/admin/:path*','/api/:path*']};
