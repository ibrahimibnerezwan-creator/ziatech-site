import { NextResponse } from 'next/server';
import { createSession, deleteSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { password, username } = await request.json();
    const expectedPassword = process.env.ADMIN_PASSWORD || 'ziacit901';
    const expectedUser = process.env.ADMIN_USER || 'admin';

    // Allow login if password matches, or if both username & password match
    const isValid = password === expectedPassword && (!username || username === expectedUser);

    if (!isValid) {
      return NextResponse.json({ error: 'Incorrect credentials' }, { status: 401 });
    }

    await createSession('admin-platform', 'Administrator', 'admin');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await deleteSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
