# 🔧 Fix Admin Password Without Shell Access

Since Render Shell is a paid feature, here's how to fix the admin password without using the shell.

## Solution: Use the API Endpoint

I've created a temporary API endpoint that will fix the admin password for you.

### Step 1: Visit the Fix Endpoint

Open this URL in your browser:

```
https://opendev.onrender.com/api/fix-admin-password?secret=fix-admin-2024
```

### Step 2: Check the Response

You should see a JSON response like:

```json
{
  "success": true,
  "message": "Admin password fixed successfully!",
  "details": {
    "email": "admin@opendev.com",
    "role": "admin",
    "isVerified": true,
    "isBanned": false,
    "passwordTest": "✅ VALID"
  }
}
```

### Step 3: Try Logging In

Now try to login:
- **URL**: https://opendev.onrender.com/login
- **Email**: `admin@opendev.com`
- **Password**: `admin123`

### Step 4: Delete the Endpoint (IMPORTANT!)

After successful login, **DELETE** the file:
- `app/api/fix-admin-password/route.ts`

This endpoint should not remain in production for security reasons!

---

## Alternative: Fix Manually in MongoDB Atlas

If the API endpoint doesn't work, you can fix it manually:

### Step 1: Generate Password Hash Locally

On your local machine, run:

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

This will output a hash like:
```
$2a$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUV
```

### Step 2: Update in MongoDB Atlas

1. Go to **MongoDB Atlas** → **Browse Collections** → `users`
2. Find the user with email: `admin@opendev.com`
3. Click **"Edit"** (pencil icon)
4. Find the `password` field
5. Replace it with the NEW hash you generated
6. Make sure:
   - `isVerified`: `true`
   - `isBanned`: `false`
   - `role`: `"admin"`
7. Click **"Update"**

### Step 3: Test Login

Try logging in again with:
- Email: `admin@opendev.com`
- Password: `admin123`

---

## Quick Summary

**Easiest method:** Visit this URL:
```
https://opendev.onrender.com/api/fix-admin-password?secret=fix-admin-2024
```

Then delete the endpoint file after successful login! 🔒

