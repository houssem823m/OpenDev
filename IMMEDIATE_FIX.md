# 🚨 Immediate Fix for Restart Loop

Your app is restarting because of missing configuration. Follow these steps **right now**:

## Step 1: Check Render Logs (2 minutes)

1. Go to https://dashboard.render.com
2. Click on **"opendev"** service
3. Click **"Logs"** tab
4. **Look for red error messages** - this tells you what's wrong

**Common errors you'll see:**
- `Missing MONGODB_URI` → Environment variable not set
- `connect ECONNREFUSED` → MongoDB connection failed
- `NEXTAUTH_SECRET is not set` → Missing secret
- `Out of memory` → Need to upgrade plan

## Step 2: Fix Environment Variables (5 minutes)

Go to Render dashboard → Your service → **"Environment"** tab

### Add/Verify These Variables:

```bash
NODE_ENV=production

MONGODB_URI=mongodb+srv://opendev2023_db_user:m8vDLIvcWRq8BZHM@cluster0.exw6ywf.mongodb.net/opendev?retryWrites=true&w=majority

NEXTAUTH_URL=https://opendev.onrender.com

NEXT_PUBLIC_API_URL=https://opendev.onrender.com/api
```

### Generate Missing Secrets:

**NEXTAUTH_SECRET** - Run this in PowerShell:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Copy the output and add:
```bash
NEXTAUTH_SECRET=<paste-here>
```

**JWT_SECRET** - Generate another one:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Add:
```bash
JWT_SECRET=<paste-here>
```

**UPLOADTHING** - Get from https://uploadthing.com/dashboard:
```bash
UPLOADTHING_SECRET=<your-secret>
UPLOADTHING_APP_ID=<your-app-id>
```

## Step 3: Fix MongoDB Atlas (2 minutes)

1. Go to https://cloud.mongodb.com
2. Click **"Network Access"** (left sidebar)
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
5. Click **"Confirm"**

**This is critical!** Render can't connect if MongoDB blocks the IP.

## Step 4: Restart Service (1 minute)

1. In Render dashboard → Your service
2. Click **"Manual Deploy"** (top right)
3. Select **"Clear build cache & deploy"**
4. Click **"Deploy latest commit"**

Wait 5-10 minutes for deployment.

## Step 5: Verify It Works

1. **Check Health:**
   - Visit: https://opendev.onrender.com/api/health
   - Should return: `{"status":"healthy","database":"connected"}`

2. **Check Homepage:**
   - Visit: https://opendev.onrender.com
   - Should load (not restart)

3. **Check Logs:**
   - Should see: `Ready on http://localhost:XXXX`
   - No error messages
   - No restart loops

## If Still Restarting

### Check Logs Again

Look for the **exact error message** in Render logs. Common fixes:

**"Missing MONGODB_URI"**
→ Add `MONGODB_URI` to environment variables

**"connect ECONNREFUSED"**
→ MongoDB Atlas Network Access not configured (Step 3)

**"NEXTAUTH_SECRET is not set"**
→ Generate and add secret (Step 2)

**"Out of memory"**
→ Upgrade to Starter plan ($7/month) or optimize app

**"Module not found"**
→ Clear build cache and redeploy (Step 4)

## Quick Checklist

Before redeploying, verify:

- [ ] All environment variables are set (no empty values)
- [ ] `MONGODB_URI` includes `/opendev` at the end
- [ ] `NEXTAUTH_URL` is exactly `https://opendev.onrender.com` (no trailing slash)
- [ ] MongoDB Atlas allows access from `0.0.0.0/0`
- [ ] `NEXTAUTH_SECRET` and `JWT_SECRET` are generated (not empty)
- [ ] `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID` are set

## Most Common Issue

**90% of restart loops are caused by:**
1. Missing `MONGODB_URI` environment variable
2. MongoDB Atlas Network Access blocking Render's IPs

**Fix both of these and your app will work!**

---

**After fixing, your app should stay running!** ✅

If you're still having issues, share the **exact error message** from Render logs and I'll help you fix it.

