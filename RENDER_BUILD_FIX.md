# Fix for Render Build Error

## Problem

Render is trying to use Docker (or there's a build issue) and can't find the `app` directory during build.

## Solution 1: Ensure Render Uses Node.js (Not Docker)

### Step 1: Check Render Configuration

1. Go to https://dashboard.render.com
2. Click on your `opendev` service
3. Go to **"Settings"** tab
4. Scroll to **"Docker"** section
5. **Make sure "Docker" is NOT enabled**
6. It should say **"Native"** or **"Node"**

### Step 2: Verify Build Settings

In Render dashboard → Your service → **"Settings"**:

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment**: `Node`

**NOT:**
- ❌ Don't use Docker
- ❌ Don't use `docker-compose`

## Solution 2: If Using Docker (Not Recommended for Render)

If you must use Docker, the Dockerfile has been fixed. But **Render works better with native Node.js builds**.

## Solution 3: Clear Build Cache

1. Go to Render dashboard → Your service
2. Click **"Manual Deploy"**
3. Select **"Clear build cache & deploy"**
4. Click **"Deploy latest commit"**

## Recommended: Use Native Node.js Build

**For Render, use these settings:**

### Build Configuration:
```
Build Command: npm install && npm run build
Start Command: npm start
Environment: Node
Node Version: 20.x (or latest)
```

### Don't Use:
- ❌ Docker
- ❌ Dockerfile
- ❌ docker-compose.yml

## Why This Happens

The error occurs because:
1. Render might be detecting `Dockerfile` and trying to use it
2. Or there's a cached build configuration
3. The Dockerfile tries to build before copying source code

## Quick Fix

1. **Disable Docker in Render settings**
2. **Use native Node.js build**
3. **Clear build cache**
4. **Redeploy**

## Verify Fix

After redeploying, check logs:
- Should see: `npm install` running
- Then: `npm run build` running
- Then: `npm start` running
- Should see: `Ready on http://localhost:XXXX`

**No Docker errors!**

---

**The `.renderignore` file has been created to prevent Render from using Docker files.**

