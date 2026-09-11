import { NextResponse } from 'next/server';
import { isAuthenticatedAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const isAdmin = await isAuthenticatedAdmin();
    return NextResponse.json({ isAuthenticated: isAdmin });
  } catch {
    return NextResponse.json({ isAuthenticated: false });
  }
}
