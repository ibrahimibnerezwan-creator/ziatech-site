import { mkdirSync, rmSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';

const browser = process.argv[2] === 'browser';
mkdirSync('.audit', { recursive: true });
const database = resolve('.audit', browser ? 'browser-test.db' : 'commerce-test.db');
for (const suffix of ['', '-wal', '-shm']) rmSync(database + suffix, { force: true });
const env = { ...process.env,
  TURSO_DATABASE_URL: 'file:' + database, TURSO_AUTH_TOKEN: '',
  JWT_SECRET: randomBytes(48).toString('hex'), ADMIN_PASSWORD: randomBytes(24).toString('hex'),
  ADMIN_PASSWORD_HASH: '', ADMIN_USER: 'audit@example.test', CRON_SECRET: randomBytes(24).toString('hex'),
  CF_ACCESS_KEY_ID: '', CF_SECRET_ACCESS_KEY: '', CF_ACCOUNT_ID: '', CF_PUBLIC_DOMAIN: '',
  STEADFAST_API_KEY: '', STEADFAST_SECRET_KEY: '', GEMINI_API_KEY: '', GOOGLE_API_KEY: '',
  NEXT_TELEMETRY_DISABLED: '1'
};
function run(command, args) {
  const result = spawnSync(command, args, { env, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}
// Never reads a production env file. Both schema and fixtures target this disposable database.
run(process.execPath, ['node_modules/drizzle-kit/bin.cjs', 'push', '--config', 'scripts/drizzle-test.config.ts', '--force']);
if (browser) {
  run(process.execPath, ['--import', 'tsx', 'scripts/seed-browser.ts']);
  run(process.execPath, ['node_modules/@playwright/test/cli.js', 'test', ...process.argv.slice(3)]);
} else {
  run(process.execPath, ['--import', 'tsx', '--test', ...readdirSync('tests').filter(f => f.endsWith('.test.ts')).map(f => 'tests/' + f)]);
}
