import { db, writeTransaction } from '@/db';
import { sql } from 'drizzle-orm';
import { createHash } from 'node:crypto';
import { headers } from 'next/headers';
import { InputError } from './validation';

export async function rateLimit(namespace: string, maximum = 15, minutes = 15) {
  const h = await headers();
  const ip = h.get('x-vercel-forwarded-for') || h.get('x-real-ip') || h.get('x-forwarded-for')?.split(',')[0] || 'local';
  const windowSeconds = minutes * 60;
  const now = Math.floor(Date.now() / 1000);
  const bucket = Math.floor(now / windowSeconds);
  const key = createHash('sha256').update(`${namespace}:${ip}:${bucket}`).digest('hex');
  const result = await writeTransaction(async tx => {
  const inserted = await tx.run(sql`INSERT INTO request_limits (key, attempts, expires_at) VALUES (${key}, 1, ${(bucket + 1) * windowSeconds}) ON CONFLICT(key) DO UPDATE SET attempts = attempts + 1 RETURNING attempts`);
  await tx.run(sql`DELETE FROM request_limits WHERE expires_at < ${now}`);
  return inserted;
  });
  if (Number(result.rows[0]?.attempts) > maximum) throw new InputError('Too many attempts. Please wait a few minutes and try again.', 429);
}
