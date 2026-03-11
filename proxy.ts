import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    // Only protect the /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const basicAuth = request.headers.get('authorization')
        const url = request.nextUrl

        // If no auth header, prompt for it
        if (!basicAuth) {
            return new NextResponse('Auth required', {
                status: 401,
                headers: {
                    'WWW-Authenticate': 'Basic realm="Secure Admin Panel"',
                },
            })
        }

        // Decode basic auth
        const authValue = basicAuth.split(' ')[1]
        const [user, pwd] = atob(authValue).split(':')

        // Get credentials from env, fallback to simple defaults if not set
        const validUser = process.env.ADMIN_USER || 'admin'
        const validPwd = process.env.ADMIN_PASSWORD || 'secret'

        // If credentials don't match, reject and prompt again
        if (user !== validUser || pwd !== validPwd) {
            return new NextResponse('Auth required', {
                status: 401,
                headers: {
                    'WWW-Authenticate': 'Basic realm="Secure Admin Panel"',
                },
            })
        }
    }

    // Continue to page
    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
