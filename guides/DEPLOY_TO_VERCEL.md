# 🚀 Deploy NEXUS to Vercel - Step by Step Guide

## ✅ Internet Status: WORKING PERFECTLY

Your internet connection is good:
- Google: 36ms average ping ✅
- Vercel: 52ms average ping ✅
- Unsplash (images): Accessible ✅

**Your ISP is correct - everything is fine!**

---

## 📋 What You Need:

✅ Vercel account: https://vercel.com/2251101011-2904s-projects  
✅ Neon account: https://console.neon.tech/app/org-restless-bush-20864412/welcome  

---

## 🗄️ Step 1: Set Up Neon Database (PostgreSQL)

### 1.1 - Create a New Database

1. Go to: https://console.neon.tech/app/org-restless-bush-20864412/welcome
2. Click **"Create Project"**
3. Name it: `nexus-ecommerce`
4. Select region: **Singapore** (closest to Bangladesh)
5. Click **"Create Project"**

### 1.2 - Get Your Database Connection String

After project is created:
1. You'll see **"Connection String"** on the dashboard
2. It looks like:
   ```
   postgresql://username:password@ep-xxx-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
3. **COPY THIS ENTIRE STRING** - you'll need it in Step 2!

---

## 🔧 Step 2: Update Your Project for Production

I'll do this for you! I need to:
- Switch from SQLite to PostgreSQL in the schema
- Update Prisma configuration
- Add production environment variables

**IMPORTANT:** After I make these changes, do NOT run `npm run dev` locally until I'm done!

---

## 🚀 Step 3: Deploy to Vercel

### 3.1 - Push Code to GitHub (Required)

**IMPORTANT:** Vercel needs your code on GitHub first!

Run these commands in your terminal:

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create a new repository on GitHub:
# Go to: https://github.com/new
# Name: nexus-ecommerce
# Click "Create repository"

# Then run (replace YOUR-USERNAME):
git remote add origin https://github.com/YOUR-USERNAME/nexus-ecommerce.git
git branch -M main
git push -u origin main
```

### 3.2 - Deploy on Vercel

1. Go to: https://vercel.com/2251101011-2904s-projects
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your **nexus-ecommerce** repository
5. Click **"Import"**

### 3.3 - Add Environment Variables

Before clicking "Deploy", add this:

1. Scroll to **"Environment Variables"**
2. Add:
   - **Name:** `DATABASE_URL`
   - **Value:** (Paste the Neon connection string from Step 1.2)
3. Click **"Add"**

### 3.4 - Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. You'll get a live URL like: `nexus-ecommerce.vercel.app`

---

## 🔄 Step 4: Run Database Migrations on Production

After deployment succeeds:

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Copy your `DATABASE_URL` value
4. Run locally:

```bash
# Set the production database URL temporarily
DATABASE_URL="your-neon-connection-string-here" npx prisma migrate deploy

# Seed production database
DATABASE_URL="your-neon-connection-string-here" npx tsx prisma/seed-simple.ts
```

---

## ✨ Step 5: Test Your Live Site!

Visit your Vercel URL and check:
- ✅ Homepage loads
- ✅ Products show
- ✅ Images load
- ✅ Product pages work
- ✅ Admin dashboard works (`/admin`)

---

## 🐛 Common Issues:

### "Build Failed"
- Check Vercel build logs
- Make sure all dependencies are in `package.json`

### "Database Connection Error"
- Verify your `DATABASE_URL` is correct
- Make sure you ran migrations (Step 4)

### "Images Not Loading"
- Check if Unsplash is accessible from Vercel
- May need to add more domains to `next.config.ts`

---

## 📝 What I Need to Do First:

Before you can deploy, I need to:

1. ✅ Test internet connection (DONE - All Good!)
2. ⏳ Convert schema from SQLite to PostgreSQL
3. ⏳ Update Prisma configuration
4. ⏳ Test build for production
5. ⏳ Create deployment-ready environment

**Should I proceed with these changes now?**

After I'm done, you'll run the GitHub and Vercel steps above!

---

**Note:** Once deployed, your local `npm run dev` will still work with SQLite. Production will use PostgreSQL on Neon.
