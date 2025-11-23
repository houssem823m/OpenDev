# 🔧 Fix Admin Login 401 Error

## Problem
You're getting a 401 (Unauthorized) error when trying to login with the admin user created in MongoDB Atlas.

## Root Causes
1. **Incorrect password hash** - The hash I provided might not match "admin123"
2. **Email format** - MongoDB might have stored it differently (case/whitespace)
3. **Missing fields** - Some required fields might be missing
4. **isVerified flag** - If `REQUIRE_EMAIL_VERIFICATION=true`, user must have `isVerified: true`

## Solution: Use the Fix Script

### Option 1: Run Fix Script on Render (Recommended)

1. Go to **Render Dashboard** → Your service → **"Shell"** tab
2. Run:
```bash
npm run verify-admin
```

This script will:
- ✅ Find your existing admin user
- ✅ Test if the password hash is correct
- ✅ Fix the password if it's wrong
- ✅ Set `isVerified: true` if needed
- ✅ Set `isBanned: false` if needed
- ✅ Ensure role is "admin"

### Option 2: Delete and Recreate in MongoDB Atlas

1. **Delete the existing user:**
   - Go to MongoDB Atlas → Browse Collections → `users`
   - Find the user with email `admin@opendev.com`
   - Click the trash icon to delete it

2. **Create new user with correct format:**

   In MongoDB Atlas, click "Insert Document" and paste this **EXACT** JSON:

```json
{
  "name": "Admin User",
  "email": "admin@opendev.com",
  "password": "$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq",
  "role": "admin",
  "isBanned": false,
  "isVerified": true,
  "createdAt": {
    "$date": "2024-01-01T00:00:00.000Z"
  }
}
```

**⚠️ WAIT!** The hash above is a placeholder. You need to generate a REAL hash.

### Option 3: Generate Correct Hash and Update

**On Render Shell:**
```bash
npm run generate-hash admin123
```

This will output a hash like:
```
$2a$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUV
```

**Then in MongoDB Atlas:**
1. Find your admin user
2. Click "Edit" (pencil icon)
3. Replace the `password` field with the NEW hash
4. Make sure `isVerified` is `true`
5. Make sure `isBanned` is `false`
6. Click "Update"

## Quick Fix Steps (MongoDB Atlas)

1. **Go to MongoDB Atlas** → Browse Collections → `users`

2. **Find your admin user** (email: `admin@opendev.com`)

3. **Click "Edit"** (pencil icon)

4. **Check these fields:**
   - `email`: Must be exactly `"admin@opendev.com"` (lowercase, no spaces)
   - `role`: Must be exactly `"admin"` (lowercase)
   - `isBanned`: Must be `false`
   - `isVerified`: Must be `true` ⚠️ **IMPORTANT!**

5. **For the password field:**
   - The hash should be 60 characters long
   - Should start with `$2a$10$`
   - If it looks wrong, you need to generate a new one

6. **Click "Update"**

## Generate Hash Locally (Alternative)

If you have Node.js locally:

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(h => console.log(h));"
```

Or create a file `hash.js`:
```javascript
const bcrypt = require('bcryptjs');
bcrypt.hash('admin123', 10).then(hash => {
  console.log('Hash:', hash);
});
```

Run: `node hash.js`

## Verify the Fix

After fixing, try logging in again:
- **URL**: https://opendev.onrender.com/login
- **Email**: `admin@opendev.com`
- **Password**: `admin123`

## Common Issues

### Issue 1: "Identifiants incorrects"
- ✅ Check that `isVerified: true`
- ✅ Check that password hash is correct (60 chars, starts with `$2a$10$`)
- ✅ Check that email is exactly `admin@opendev.com` (lowercase)

### Issue 2: "Ce compte a été suspendu"
- ✅ Set `isBanned: false`

### Issue 3: "Veuillez vérifier votre email"
- ✅ Set `isVerified: true`

### Issue 4: Still getting 401
- ✅ Check Render logs for detailed error
- ✅ Verify MongoDB connection is working
- ✅ Try deleting and recreating the user

## Best Solution: Use the Script

The easiest way is to run the fix script on Render:

```bash
npm run verify-admin
```

This will automatically fix all issues! 🎉

