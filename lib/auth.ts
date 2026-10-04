import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

function sessionKey() {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) throw new Error('JWT_SECRET must contain at least 32 characters.');
    return new TextEncoder().encode(secret);
}
export async function checkAdminPassword(password: unknown) {
    if (typeof password !== 'string' || !password || password.length > 200) return false;
    if (process.env.ADMIN_PASSWORD_HASH) return bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) return false;
    const { timingSafeEqual, createHash } = await import('node:crypto');
    return timingSafeEqual(createHash('sha256').update(password).digest(), createHash('sha256').update(expected).digest());
}

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export async function encrypt(payload: JWTPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(sessionKey());
}

export async function decrypt(input: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(input, sessionKey(), {
            algorithms: ['HS256'],
        });
        if (typeof payload.userId !== 'string' || typeof payload.name !== 'string' || !['admin', 'customer'].includes(String(payload.role))) return null;
        return payload;
    } catch (error) {
        return null;
    }
}

export async function createSession(userId: string, name: string, role: string) {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const sessionCookie = await encrypt({ userId, name, role, expires });

    const cookieStore = await cookies();
    cookieStore.set('session', sessionCookie, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}

export async function getSession() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    
    if (!sessionCookie) return null;
    return await decrypt(sessionCookie);
}

export async function getCurrentUser() {
    const session = await getSession();
    if (!session) return null;

    return {
        id: session.userId as string,
        name: session.name as string,
        role: session.role as string,
    };
}

export async function isAuthenticatedAdmin(): Promise<boolean> {
    const user = await getCurrentUser();
    return !!user && user.role === 'admin';
}

export async function requireAdmin() {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
        throw new Error('Unauthorized');
    }
    return user;
}
