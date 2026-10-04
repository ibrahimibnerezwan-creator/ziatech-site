import { db, writeTransaction } from '@/db';
import { storeSettings } from '@/db/schema';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { PUBLIC_SETTING_KEYS, PRIVATE_SETTING_KEYS } from '@/lib/settings';
import { errorResponse, InputError, textValue } from '@/lib/validation';
import { revalidatePath } from 'next/cache';
export const dynamic = 'force-dynamic';
export async function GET() {
  if (!(await isAuthenticatedAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const rows = await db.select().from(storeSettings);
    const settings = Object.fromEntries(rows.map(r => [r.key, r.value]));
    return Response.json(settings, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return errorResponse(error, 'Failed to fetch settings'); }
}
export async function POST(request: Request) {
  if (!(await isAuthenticatedAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const data = await request.json();
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new InputError('Invalid settings.');
    const allowed: readonly string[] = [...PUBLIC_SETTING_KEYS, ...PRIVATE_SETTING_KEYS];
    const rows = Object.entries(data).map(([key, value]) => {
      if (!allowed.includes(key)) throw new InputError('Unknown setting.');
      const clean = textValue(value, key, 2000, false);
      if (['facebook', 'instagram', 'youtube', 'tiktok'].includes(key) && clean && !/^https:\/\//.test(clean)) throw new InputError('Social links must start with https://');
      if (['bkash_number', 'nagad_number'].includes(key) && clean && !/^01[3-9]\d{8}$/.test(clean.replace(/[\s-]/g, ''))) throw new InputError('Payment numbers must be valid Bangladeshi mobile numbers.');
      return { key, value: clean, updatedAt: new Date() };
    });
    await writeTransaction(async tx => {
      for (const row of rows) await tx.insert(storeSettings).values(row).onConflictDoUpdate({ target: storeSettings.key, set: { value: row.value, updatedAt: row.updatedAt } });
    });
    revalidatePath('/', 'layout');
    return Response.json({ success: true });
  } catch (error) { return errorResponse(error, 'Failed to save settings'); }
}
