import { NextResponse } from 'next/server';
import { db } from '@/db';
import { storeSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { isAuthenticatedAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await db.select().from(storeSettings);
    const settings: Record<string, string> = {};
    for (const r of rows) {
      settings[r.key] = r.value;
    }
    return NextResponse.json(settings, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const isAdmin = await isAuthenticatedAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const now = new Date();

    for (const [key, value] of Object.entries(payload)) {
      if (typeof value === 'string') {
        const existing = await db
          .select()
          .from(storeSettings)
          .where(eq(storeSettings.key, key))
          .limit(1);

        if (existing.length > 0) {
          await db.update(storeSettings).set({ value, updatedAt: now }).where(eq(storeSettings.key, key));
        } else {
          await db.insert(storeSettings).values({ key, value, updatedAt: now });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save settings' }, { status: 500 });
  }
}
