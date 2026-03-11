# Zia's Tech Shop

Live Store: **[ziastech.shop](#)** (Replace with actual domain when purchased)

A modern, high-performance e-commerce platform built for electronics retail.

## Technology Stack
- **Framework:** Next.js 16 (App Router)
- **UI & Styling:** React 19, Tailwind CSS v4, Radix UI UI Primitives
- **Animations:** Framer Motion, Three.js (for 3D elements)
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Prisma

## Project Structure
- `/app` - Next.js App Router pages and API routes
  - `/admin` - Secure dashboard for product & order management
- `/components` - Reusable UI components
  - `/home` - Sections for the landing page
  - `/product` - Product cards and details
  - `/ui` - Base UI elements (buttons, inputs)
- `/prisma` - Database schema and migration files
- `/docs` - Maintenance and client handoff guides

## Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Copy the example environment file and fill in your Neon database URL.
   ```bash
   cp .env.example .env
   ```

3. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

Navigate to `http://localhost:3000`.

## Maintainer Notes
See the `/docs/internal` folder for historical guides and `/docs/MAINTENANCE.md` for standard operating procedures.
