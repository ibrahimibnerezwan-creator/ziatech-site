import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, { schema });

// Serialize writes within a worker; SQL transactions still enforce consistency across workers.
type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
let writeQueue = Promise.resolve();
export async function writeTransaction<T>(work: (tx: Transaction) => Promise<T>): Promise<T> {
  const previous = writeQueue;
  let release!: () => void;
  writeQueue = new Promise<void>(resolve => { release = resolve; });
  await previous;
  try { return await db.transaction(work); }
  finally { release(); }
}
