# 🔍 How to Check Authentication Logs on Render

## Step 1: View Render Logs

1. Go to **https://dashboard.render.com**
2. Click on your **OpenDev** service
3. Click on the **"Logs"** tab (top navigation)
4. You should see real-time logs from your application

## Step 2: Try to Login

1. Open your app: **https://opendev.onrender.com/login**
2. Enter credentials:
   - Email: `admin@opendev.com`
   - Password: `admin123`
3. Click "Se connecter"

## Step 3: Check the Logs

In the Render logs, you should now see detailed authentication logs with `[AUTH]` prefix:

```
🔐 [AUTH] Starting authentication...
📧 [AUTH] Email received: admin@opendev.com
📧 [AUTH] Normalized email: admin@opendev.com
✅ [AUTH] Database connected
👤 [AUTH] User lookup result: User found
👤 [AUTH] User details: { ... }
🔑 [AUTH] Comparing password...
🔑 [AUTH] Password comparison result: ❌ INVALID
```

## Step 4: Run Diagnosis Script

If you see errors in the logs, run the diagnosis script:

1. Go to Render Dashboard → Your service → **"Shell"** tab
2. Run:
```bash
npm run diagnose-auth
```

This will show you:
- ✅ If user exists
- ✅ Password hash format
- ✅ Password match test
- ✅ Email verification status
- ✅ Ban status
- ✅ All issues found

## Step 5: Fix Issues

Based on the diagnosis, run the fix script:

```bash
npm run verify-admin
```

This will automatically fix:
- ❌ Wrong password hash → ✅ Correct hash
- ❌ isVerified: false → ✅ isVerified: true
- ❌ isBanned: true → ✅ isBanned: false
- ❌ Wrong role → ✅ role: admin

## Common Issues and Solutions

### Issue 1: "User NOT found"
**Solution:** Run `npm run verify-admin` to create the user

### Issue 2: "Password hash format is invalid"
**Solution:** The hash in MongoDB is wrong. Run `npm run verify-admin` to fix it.

### Issue 3: "Password does not match"
**Solution:** The hash doesn't match "admin123". Run `npm run verify-admin` to regenerate it.

### Issue 4: "Email not verified"
**Solution:** Set `isVerified: true` in MongoDB Atlas, or run `npm run verify-admin`

### Issue 5: "User is banned"
**Solution:** Set `isBanned: false` in MongoDB Atlas, or run `npm run verify-admin`

## Quick Fix Command

If you're not sure what's wrong, just run:

```bash
npm run verify-admin
```

This will fix everything automatically! 🎉

