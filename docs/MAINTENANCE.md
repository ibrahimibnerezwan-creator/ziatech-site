# Maintainer Guide

> [!IMPORTANT]
> This document is for YOU (the vendor/developer). The shop owner should never see this.

## Project Architecture
- **Repo:** GitHub (bipu-bgra/nexus-ecommerce)
- **Hosting:** Vercel (Production)
- **Database:** Neon (PostgreSQL Serverless)
- **Mobile:** Capacitor Android APK wrapping the Vercel URL

## Standard Operating Procedures

### 1. Database Migrations
Always run migrations locally, then deploy to Neon.
```bash
npx prisma generate
npx prisma migrate dev --name <migration_name>
npx prisma migrate deploy # Updates Neon DB
```

### 2. Emergency Access
If the client locks themselves out of the admin panel, you can reset their access directly in the Neon SQL console or using a local Prisma Studio connected to the production URL.

### 3. Deployments
Pushes to the `main` branch on GitHub automatically trigger Vercel deployments. The client's APK will automatically load the new version.

### 4. Account Management
- **Never transfer ownership** of Vercel or Neon to the client. Keep them under your developer account to ensure uptime and simplify maintenance.
- **Domain Renewal:** Ensure the custom domain (e.g. ziastech.shop) is renewed annually to prevent downtime.
