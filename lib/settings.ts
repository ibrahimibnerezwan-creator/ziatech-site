import { db } from '@/db';
import { storeSettings } from '@/db/schema';
import { inArray } from 'drizzle-orm';
export const PUBLIC_SETTING_KEYS = ['storeName', 'phone', 'email', 'address', 'whatsapp', 'facebook', 'instagram', 'youtube', 'tiktok', 'bkash_number', 'nagad_number'] as const;
export const PRIVATE_SETTING_KEYS = ['steadfast_api_key', 'steadfast_secret_key'] as const;
export async function publicSettings() {
  const rows = await db.select().from(storeSettings).where(inArray(storeSettings.key, [...PUBLIC_SETTING_KEYS]));
  return Object.fromEntries(rows.map(r => [r.key, r.value]));
}
export async function courierCredentials() {
  const rows = await db.select().from(storeSettings).where(inArray(storeSettings.key, [...PRIVATE_SETTING_KEYS]));
  const saved = Object.fromEntries(rows.map(r => [r.key, r.value]));
  return { apiKey: saved.steadfast_api_key || process.env.STEADFAST_API_KEY, secretKey: saved.steadfast_secret_key || process.env.STEADFAST_SECRET_KEY };
}
