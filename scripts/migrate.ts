import 'dotenv/config';
import { createClient } from '@libsql/client';
async function main() {
const client = createClient({url:process.env.TURSO_DATABASE_URL!,authToken:process.env.TURSO_AUTH_TOKEN});
await client.execute('CREATE TABLE IF NOT EXISTS request_limits (key TEXT PRIMARY KEY NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, expires_at INTEGER NOT NULL)');
console.log('Request-limiting table ready.');
client.close();

}
main().catch(()=>{console.error('Database migration failed.');process.exitCode=1;});
