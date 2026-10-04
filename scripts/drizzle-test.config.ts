import { defineConfig } from 'drizzle-kit';
if (!/^file:.*\/\.audit\/(commerce|browser)-test\.db$/.test(process.env.TURSO_DATABASE_URL || '')) throw new Error('Only a disposable audit database is allowed.');
export default defineConfig({schema:'./db/schema.ts',dialect:'sqlite',dbCredentials:{url:process.env.TURSO_DATABASE_URL!}});
