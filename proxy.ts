import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'ziatech-dev-secret-key-change-me';
const key = new TextEncoder().encode(secretKey);

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only apply to /admin routes
    if (pathname.startsWith('/admin')) {
        const session = request.cookies.get('session')?.value;

        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            await jwtVerify(session, key, {
                algorithms: ['HS256'],
            });
            return NextResponse.next();
        } catch (error) {
            // Invalid session
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

// Next.js 16 (Nexus Fork) uses proxy.ts instead of middleware.ts
export const config = {
    matcher: ['/admin/:path*'],
};
