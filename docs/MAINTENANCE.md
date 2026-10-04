# ZiaTech maintenance

Current release workflow, October 2026.

- Repository: `ibrahimibnerezwan-creator/ziatech-site`, production branch `main`.
- Hosting: existing `ziatech-site` project in Ibrahim's Vercel account. Keep ownership and domain placement unchanged.
- Database: Turso/libSQL with Drizzle (`db/schema.ts`). Images: Cloudflare R2.
- Admin login: `/admin`. Existing `ADMIN_PASSWORD` is supported; `ADMIN_PASSWORD_HASH` takes precedence if configured. `JWT_SECRET` must be random and at least 32 characters. Rotating it signs everybody out.
- Use a distinct, random `CRON_SECRET` for `/api/cron/sync-orders`. Pass `Authorization: Bearer <secret>`. The endpoint is available for a scheduler; this repository does not assume a recurring job is configured.

## Release

Run commerce tests, browser tests, typecheck and production build before release. See README for commands. Check remote `main` before pushing and preserve newer work.

Before the first deployment of request limiting, apply the additive migration with the intended database credentials:

```sh
node --env-file=.env.production.audit --import tsx scripts/migrate.ts
```

The migration only creates `request_limits` if absent. It does not rebuild or clear store tables. This env filename is an example for a private local release file, never something to commit.

Push the verified commit to `main`, or deploy using the explicitly linked ZiaTech Vercel project. Check the custom domain after Vercel reports ready. Verify login, public settings privacy, catalogue/media, checkout and admin reads. A temporary audit order must use COD, be undispatched, then be cancelled and deleted by exact ID. Verify stock and existing records remain intact. Delete only the exact image object created by an upload test.

## Integrations and failure recovery

- bKash/Nagad are manual payment instructions. Saving a transaction ID does not prove payment. Confirm payment in the merchant account, then mark it `VERIFIED` before dispatching.
- Set Steadfast API/secret keys in Store Settings. Blank credentials leave manual order management available. Public checkout never dispatches automatically; an admin explicitly clicks **Dispatch with Steadfast**.
- A timeout or unclear courier response keeps a pending marker to prevent duplicates. Check the Steadfast portal before retrying. After a minute, record the returned tracking code, or clear the marker only after confirming no consignment exists.
- Cancel pending, undispatched orders to restore stock once. Shipped/dispatched cancellations do not restock parcels still in transit; inspect returned goods before adjusting stock. Cancelled orders cannot reopen. Order-history products cannot be deleted.
- Gemini is optional. Chat uses live catalogue and contact facts when no AI key is configured. AI description generation reports its unavailable state.
- R2 upload is authenticated multipart, up to 4 MB, with allowed image types and signature checks. Removing a product-image association preserves shared storage objects.

Keep secrets in private credential storage. Vercel sensitive environment variables cannot be recovered with `env pull`. No real courier dispatch, payment transfer or customer messaging belongs in an automated smoke test.
