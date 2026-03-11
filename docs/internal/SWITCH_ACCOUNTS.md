# 🔄 How to Switch GitHub Account & Vercel

If you connected the wrong GitHub account or want to move the project, follow these steps.

## 1. Switch GitHub Repository

First, create a **new empty repository** on your desired GitHub account (e.g., "zias-tech-shop").

Then, run these commands in your terminal (replace `YOUR_NEW_USERNAME` and `YOUR_NEW_REPO`):

```bash
# 1. Remove the old link
git remote remove origin

# 2. Add the new link
git remote add origin https://github.com/YOUR_NEW_USERNAME/YOUR_NEW_REPO.git

# 3. Push your code to the new account
git push -u origin main
```

> **Note:** If it asks for a password, use a [Personal Access Token](https://github.com/settings/tokens) if you haven't set up SSH.

---

## 2. Switch Vercel Account / Project

If Vercel is linked to the wrong account, you can reset it.

### Option A: Just Relink Project (Same Vercel Account)
If you just want to link this folder to a different Vercel project:

```bash
rm -rf .vercel
vercel link
```
*Follow the prompts to create a new project or link to an existing one.*

### Option B: Switch Vercel User (Different Vercel Account)
If you are logged into the wrong *Vercel* user entirely:

```bash
# 1. Logout
vercel logout

# 2. Login with the correct account
vercel login

# 3. Deploy/Link again
vercel
```

---

## 3. Connect Vercel to New GitHub Repo (For CI/CD)

1. Go to your **Vercel Dashboard** (website).
2. Go to the **Project Settings** > **Git**.
3. If a repo is connected, click **Disconnect**.
4. Click **Connect Git Repository**.
5. Select your **NEW** GitHub repository.

Now, every time you `git push`, Vercel will deploy automatically!
