# ZiaTech

Storefront: https://ziatech.shopbd.app — Admin: https://ziatech.shopbd.app/admin

Next.js 16 and React 19 storefront with a Turso/libSQL database, Drizzle ORM, Cloudflare R2 images, customer accounts and an authenticated merchant dashboard.

## Development

1. Run `npm ci` with Node.js 20.19+.
2. Copy `.env.example` to `.env.local`. Set your database, admin credentials, and a random `JWT_SECRET` of at least 32 characters. Keep environment files private.
3. For a new local database, use Drizzle schema push with local credentials. Never use schema push on a populated production database without reviewing its proposed changes.
4. Run `npm run dev` and open http://localhost:3000.

## Verification

`npm test` creates a disposable SQLite database under `.audit/` and checks checkout, inventory, order transitions and catalogue changes.

`npm run test:e2e` creates separate synthetic fixtures and starts the site on port 3187. Install Chromium with `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_PATH=/usr/bin/chromium`. Stop any server using that port first. Browser tests disable real storage, courier and AI credentials; the upload UI test uses a mock response.

Run `npm run typecheck` and `npm run build` with development environment values. Real R2 uploads and production environment settings require separate release checks.

## Operations

See [merchant guide](docs/CLIENT_GUIDE.md) and [maintenance guide](docs/MAINTENANCE.md). Older documents under `docs/internal/` are historical and may describe superseded hosting, database or access arrangements.
