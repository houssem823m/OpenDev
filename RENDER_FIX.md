# Fix for Render Restart Loop Issue

If your app on Render keeps restarting, follow these steps:

## Common Causes

1. **Missing Environment Variables** - App crashes on startup
2. **Database Connection Fails** - MongoDB connection error causes restart
3. **Memory Issues** - Free tier has limited memory
4. **Build Errors** - Silent build failures

## Step 1: Check Render Logs

1. Go to https://dashboard.render.com
2. Click on your `opendev` service
3. Click **"Logs"** tab
4. Look for error messages (especially red text)

**Common errors to look for:**
- `MONGODB_URI is not set`
- `NEXTAUTH_SECRET is not set`
- `Error: connect ECONNREFUSED` (database connection)
- `Error: listen EADDRINUSE` (port issue)
- `Out of memory` (memory issue)

## Step 2: Verify Environment Variables

Go to Render dashboard → Your service → **"Environment"** tab

**Required variables (must all be set):**
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://opendev2023_db_user:m8vDLIvcWRq8BZHM@cluster0.exw6ywf.mongodb.net/opendev?retryWrites=true&w=majority
NEXTAUTH_SECRET=<must-have-value>
NEXTAUTH_URL=https://opendev.onrender.com
NEXT_PUBLIC_API_URL=https://opendev.onrender.com/api
UPLOADTHING_SECRET=<must-have-value>
UPLOADTHING_APP_ID=<must-have-value>
JWT_SECRET=<must-have-value>
```

**Check:**
- [ ] All variables are set (no empty values)
- [ ] `NEXTAUTH_URL` is exactly `https://opendev.onrender.com` (no trailing slash)
- [ ] `MONGODB_URI` includes `/opendev` database name
- [ ] Secrets are generated (not placeholder text)

## Step 3: Fix MongoDB Connection

### 3.1 Verify MongoDB Atlas Network Access

1. Go to https://cloud.mongodb.com
2. Click **"Network Access"** in left sidebar
3. Ensure **"Allow Access from Anywhere"** is enabled (IP: `0.0.0.0/0`)
4. If not, click **"Add IP Address"** → **"Allow Access from Anywhere"**

### 3.2 Verify Database User

1. Go to **"Database Access"** in MongoDB Atlas
2. Verify user `opendev2023_db_user` exists
3. Ensure user has **"Atlas Admin"** or **"Read and write to any database"** permissions

### 3.3 Test Connection String

The connection string should be:
```
mongodb+srv://opendev2023_db_user:m8vDLIvcWRq8BZHM@cluster0.exw6ywf.mongodb.net/opendev?retryWrites=true&w=majority
```

**Important parts:**
- `/opendev` - database name (required)
- `?retryWrites=true&w=majority` - connection options (recommended)

## Step 4: Fix Build Configuration

### 4.1 Update Build Command

In Render dashboard → Your service → **"Settings"**:

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

### 4.2 Remove Postinstall Script

The `postinstall` script has been removed from `package.json` to prevent build issues.

## Step 5: Check Memory Usage

Free tier on Render has **512MB RAM**. If your app uses more, it will crash.

**To check:**
1. Go to Render dashboard → Your service → **"Metrics"** tab
2. Check memory usage
3. If consistently above 400MB, consider:
   - Upgrading to Starter plan ($7/month)
   - Optimizing your app

## Step 6: Manual Restart

After fixing issues:

1. Go to Render dashboard → Your service
2. Click **"Manual Deploy"** → **"Clear build cache & deploy"**
3. Wait for new deployment

## Step 7: Verify Fix

After deployment:

1. **Check Health Endpoint:**
   ```
   https://opendev.onrender.com/api/health
   ```
   Should return: `{"status":"healthy","database":"connected"}`

2. **Check Homepage:**
   ```
   https://opendev.onrender.com
   ```
   Should load without errors

3. **Check Logs:**
   - Should see: `Ready on http://localhost:XXXX`
   - No error messages
   - No restart loops

## Common Error Messages & Solutions

### Error: "MONGODB_URI is not set"
**Solution:** Add `MONGODB_URI` to environment variables

### Error: "connect ECONNREFUSED"
**Solution:** 
- Check MongoDB Atlas Network Access allows all IPs
- Verify connection string is correct
- Check database user exists

### Error: "NEXTAUTH_SECRET is not set"
**Solution:** Generate and add `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### Error: "Out of memory"
**Solution:**
- Upgrade to Starter plan
- Or optimize your app (reduce dependencies, use smaller images)

### Error: "Module not found"
**Solution:**
- Clear build cache in Render
- Redeploy
- Check `package.json` has all dependencies

## Still Having Issues?

1. **Check Render Logs** - Look for the exact error message
2. **Test Locally** - Run `npm run build && npm start` locally to catch errors
3. **Contact Support** - Render support is helpful: support@render.com

## Quick Checklist

- [ ] All environment variables set in Render
- [ ] MongoDB Atlas Network Access allows all IPs
- [ ] Connection string includes `/opendev` database name
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm start`
- [ ] No postinstall script in package.json
- [ ] Health endpoint returns healthy
- [ ] Logs show no errors

---

**After fixing, your app should stay running!** 🎉

