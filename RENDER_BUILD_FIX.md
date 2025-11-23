# Fix for Render Build - Missing Dependencies

## Problem

Render is not installing devDependencies during build, causing:
- ESLint not found
- @types/jsonwebtoken not found

## Solution

### Option 1: Update Build Command in Render Dashboard (Recommended)

1. Go to Render dashboard → Your service → **Settings**
2. Find **"Build Command"**
3. Change from:
   ```
   npm install && npm run build
   ```
   To:
   ```
   npm ci && npm run build
   ```
4. **Save** and redeploy

### Option 2: Use npm install with --include=dev

Change build command to:
```
npm install --include=dev && npm run build
```

### Why This Happens

- `npm install` in production mode (NODE_ENV=production) skips devDependencies
- `npm ci` installs all dependencies including devDependencies
- ESLint and TypeScript types are in devDependencies and needed for build

## Updated render.yaml

The `render.yaml` file has been updated to use `npm ci` instead of `npm install`.

## After Fixing

1. Update build command in Render dashboard
2. Or push the updated `render.yaml` and redeploy
3. Build should now succeed

---

**The build command has been updated in render.yaml. Update it in Render dashboard or redeploy!**
