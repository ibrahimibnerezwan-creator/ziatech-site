# 🚀 Vendor Launchpad: Z's Tech Shop

This document serves as your central command center for Z's Tech Shop. Keep this open to quickly jump between all your managed services.

> [!TIP]
> Your Cloudflare R2 connection status and Image Uploader are now active in the Admin Dashboard!

## 📦 Core Infrastructure (One Profile, Many Clients)

| Service | Client URL / Context | Status |
|---|---|---|
| **Vercel** | [ziatech.vercel.app](https://vercel.com/ibrahimibnerezwan-creators-projects) | ✅ Connected to Github |
| **Turso (DB)** | `ziatech-db` (Tokyo) | ✅ Schema Pushed |
| **Cloudflare (R2)** | Bucket: `ziatech-images` | ✅ Configured |
| **GitHub**| [ziatech-site](https://github.com/ibrahimibnerezwan-creator) | ⚠️ Ready to Push |

## 🛠️ Developer SOPs

### 1. Database Updates
Whenever you change the schema in `db/schema.ts`, run:
```bash
npm run db:push
```

### 2. Deployment
To push updates to production:
```bash
git add .
git commit -m "Update Zia Tech Shop"
git push origin main
```

### 3. Local Development
```bash
npm run dev
```

## 🔐 Final Handover Checklist
- [x] Add `CF_ACCOUNT_ID` to `.env`
- [x] Add `CF_ACCESS_KEY_ID` & `CF_SECRET_ACCESS_KEY` to `.env`
- [x] Add `CF_PUBLIC_DOMAIN` to `.env`
- [ ] Point user's domain (e.g., `zias-tech.shop`) to Vercel
- [ ] Build & Deliver APK via Capacitor
