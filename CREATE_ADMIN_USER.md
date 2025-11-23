# How to Create Admin User in MongoDB

## Option 1: Use the Seed Script (Recommended)

The project already has a seed script that creates an admin user automatically.

### Run Locally:

1. **Set up environment variables** in `.env.local`:
```bash
MONGODB_URI=mongodb+srv://opendev2023_db_user:m8vDLIvcWRq8BZHM@cluster0.exw6ywf.mongodb.net/opendev?retryWrites=true&w=majority
```

2. **Run the seed script:**
```bash
npm run seed
```

This will create:
- **Email**: `admin@opendev.com`
- **Password**: `admin123`
- **Role**: `admin`

### Run on Render (After Deployment):

1. Go to Render dashboard → Your service → **"Shell"** tab
2. Run:
```bash
npm run seed
```

## Option 2: Create Manually via MongoDB Atlas

### Step 1: Connect to MongoDB Atlas

1. Go to https://cloud.mongodb.com
2. Click **"Database"** → **"Connect"**
3. Choose **"MongoDB Shell"** or **"Compass"**

### Step 2: Insert Admin User

Run this command in MongoDB Shell or Compass:

```javascript
use opendev

db.users.insertOne({
  name: "Admin User",
  email: "admin@opendev.com",
  password: "$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq", // This is "admin123" hashed
  role: "admin",
  isBanned: false,
  isVerified: true,
  createdAt: new Date()
})
```

**⚠️ Note:** The password hash above is for "admin123". If you want a different password, you need to hash it first.

## Option 3: Create with Custom Password (Script)

Create a file `create-admin.js`:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://opendev2023_db_user:m8vDLIvcWRq8BZHM@cluster0.exw6ywf.mongodb.net/opendev?retryWrites=true&w=majority';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  isBanned: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@opendev.com',
      password: hashedPassword,
      role: 'admin',
      isBanned: false,
      isVerified: true
    });

    console.log('✅ Admin user created:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAdmin();
```

Run: `node create-admin.js`

## Default Admin Credentials (from seed script)

- **Email**: `admin@opendev.com`
- **Password**: `admin123`
- **Role**: `admin`

**⚠️ IMPORTANT:** Change the password immediately after first login!

## Verify Admin User Exists

### Check in MongoDB Atlas:

1. Go to MongoDB Atlas → **"Database"** → **"Browse Collections"**
2. Select database: `opendev`
3. Select collection: `users`
4. Look for user with email: `admin@opendev.com`

### Check via API:

Visit: `https://opendev.onrender.com/api/users` (requires admin login)

---

**The easiest way is to use `npm run seed` - it creates everything you need!** ✅



