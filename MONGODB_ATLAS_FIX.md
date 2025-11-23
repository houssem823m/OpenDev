# Fix MongoDB Atlas Connection - IP Whitelist

## Problem

Render can't connect to MongoDB Atlas because Render's IP addresses are not whitelisted in MongoDB Atlas.

## Solution: Allow All IPs in MongoDB Atlas

### Step 1: Go to MongoDB Atlas

1. Go to https://cloud.mongodb.com
2. Sign in to your account
3. Select your cluster: **Cluster0**

### Step 2: Configure Network Access

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"** button (top right)
3. In the modal that appears:
   - Click **"Allow Access from Anywhere"**
   - This will add `0.0.0.0/0` (allows all IPs)
4. Click **"Confirm"**

**Important:** This allows access from any IP address. For production, this is acceptable if you have:
- Strong database password
- Database user with limited permissions (not admin)
- Connection string is secure

### Step 3: Wait for Changes

- MongoDB Atlas may take 1-2 minutes to apply the changes
- Wait a moment after adding the IP

### Step 4: Restart Render Service

1. Go to Render dashboard → Your service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Or just wait - Render will retry automatically

## Alternative: Whitelist Specific Render IPs (More Secure)

If you want to be more specific, you can find Render's IP ranges, but **allowing 0.0.0.0/0 is the standard approach** for cloud deployments.

## Verify Connection

After whitelisting:

1. Check Render logs - should see: `✅ MongoDB connected successfully`
2. Visit: https://opendev.onrender.com/api/health
   - Should return: `{"status":"healthy","database":"connected"}`

## Current MongoDB Connection String

Make sure this is set in Render environment variables:

```
MONGODB_URI=mongodb+srv://opendev2023_db_user:m8vDLIvcWRq8BZHM@cluster0.exw6ywf.mongodb.net/opendev?retryWrites=true&w=majority
```

**Important parts:**
- `/opendev` - database name (required)
- `?retryWrites=true&w=majority` - connection options (recommended)

## Troubleshooting

### Still Can't Connect?

1. **Verify Network Access:**
   - MongoDB Atlas → Network Access
   - Should see `0.0.0.0/0` in the list
   - Status should be "Active"

2. **Check Database User:**
   - MongoDB Atlas → Database Access
   - Verify `opendev2023_db_user` exists
   - User should have "Atlas Admin" or "Read and write to any database" permissions

3. **Verify Connection String:**
   - Check password is correct: `m8vDLIvcWRq8BZHM`
   - Check cluster name: `cluster0.exw6ywf.mongodb.net`
   - Check database name: `/opendev`

4. **Check Render Environment Variables:**
   - Render → Your service → Environment
   - Verify `MONGODB_URI` is set correctly
   - No extra spaces or quotes

## Security Note

Allowing `0.0.0.0/0` is safe if:
- ✅ You have a strong database password
- ✅ Database user has appropriate permissions
- ✅ Connection string is stored securely (not in code)
- ✅ You're using MongoDB Atlas authentication

---

**After whitelisting IPs, your app should connect successfully!** ✅

