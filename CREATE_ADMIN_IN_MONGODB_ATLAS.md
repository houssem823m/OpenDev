# 🗄️ How to Create Admin User in MongoDB Atlas

## Step-by-Step Instructions

### Step 1: Access MongoDB Atlas

1. Go to **https://cloud.mongodb.com**
2. Log in to your account
3. Select your cluster: **Cluster0**

### Step 2: Open Database Browser

1. Click on **"Browse Collections"** button (or go to **"Database"** → **"Browse Collections"**)
2. Select your database: **`opendev`** (or the database name you're using)
3. Find the collection: **`users`**
   - If it doesn't exist, click **"Create Collection"** and name it `users`

### Step 3: Insert Admin User Document

1. Click on the **`users`** collection
2. Click **"Insert Document"** button (top right)
3. Click **"{}"** (JSON view) if not already selected
4. **Delete** the default `_id` field (MongoDB will auto-generate it)
5. **Paste** this JSON document:

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

**⚠️ IMPORTANT:** 
- The password hash above is a **PLACEHOLDER** - it won't work!
- You need to generate a REAL hash using the script: `npm run verify-admin` on Render
- OR use the script to create/fix the admin user automatically

### Step 4: Save the Document

1. Click **"Insert"** button
2. You should see the document appear in the collection

### Step 5: Verify the User

1. The document should appear in the `users` collection
2. Check that:
   - `email`: `admin@opendev.com`
   - `role`: `admin`
   - `isVerified`: `true`
   - `isBanned`: `false`

---

## 🔐 Default Admin Credentials

After creating the user, you can login with:

- **Email**: `admin@opendev.com`
- **Password**: `admin123`
- **Role**: `admin`

**⚠️ SECURITY WARNING:** Change the password immediately after first login!

---

## 🔄 Alternative: Generate Your Own Password Hash

If you want to use a different password, you need to generate a bcrypt hash:

### Option A: Using Node.js (in your project)

```bash
npm run generate-hash YOUR_PASSWORD
```

Or create a temporary script:

```javascript
// temp-hash.js
const bcrypt = require('bcryptjs');
bcrypt.hash('YOUR_PASSWORD', 10).then(hash => {
  console.log('Hash:', hash);
});
```

Run: `node temp-hash.js`

### Option B: Online Tool (Less Secure)

Use an online bcrypt generator (not recommended for production):
- https://bcrypt-generator.com/
- Use **10 rounds**

---

## 📋 Complete Document Structure

Here's what each field means:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | ✅ Yes | User's full name |
| `email` | String | ✅ Yes | Unique email address (lowercase) |
| `password` | String | ✅ Yes | Bcrypt hashed password (10 rounds) |
| `role` | String | ✅ Yes | Either `"user"` or `"admin"` |
| `isBanned` | Boolean | ✅ Yes | `false` for active users |
| `isVerified` | Boolean | ✅ Yes | `true` to skip email verification |
| `createdAt` | Date | ✅ Yes | Creation timestamp |
| `verificationToken` | String | ❌ No | Optional (for email verification) |
| `verificationTokenExpiry` | Date | ❌ No | Optional (for email verification) |

---

## ✅ Verification Checklist

After creating the user:

- [ ] User document exists in `users` collection
- [ ] Email is `admin@opendev.com`
- [ ] Role is `admin`
- [ ] `isVerified` is `true`
- [ ] `isBanned` is `false`
- [ ] Can login at: `https://opendev.onrender.com/login`

---

## 🐛 Troubleshooting

### Error: "E11000 duplicate key error"
- **Solution**: An admin user with this email already exists. Either delete it first or use a different email.

### Error: "Validation failed"
- **Solution**: Make sure all required fields are present and `role` is exactly `"admin"` (lowercase).

### Can't login after creating user
- **Solution**: 
  1. Check that `isVerified` is `true`
  2. Verify the password hash is correct (60 characters starting with `$2a$10$`)
  3. Check MongoDB connection in your app logs

---

## 📝 Quick Copy-Paste JSON

```json
{
  "name": "Admin User",
  "email": "admin@opendev.com",
  "password": "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  "role": "admin",
  "isBanned": false,
  "isVerified": true,
  "createdAt": {
    "$date": "2024-01-01T00:00:00.000Z"
  }
}
```

**Password for this hash:** `admin123`

---

**That's it! Your admin user is now ready to use! 🎉**

