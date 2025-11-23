# ✅ CORRECT Environment Variables for Render

## ❌ Problems in Your Current Values

1. **MONGODB_URI** has `<db_password>` placeholder - needs actual password
2. **MONGODB_URI** is missing database name `/opendev` at the end
3. **UPLOADTHING_SECRET** and **UPLOADTHING_APP_ID** have placeholders

## ✅ CORRECT Values to Use

Copy these **EXACT** values to Render → Environment tab:

```bash
NODE_ENV=production

MONGODB_URI=mongodb+srv://opendev2023_db_user:m8vDLIvcWRq8BZHM@cluster0.exw6ywf.mongodb.net/opendev?retryWrites=true&w=majority

NEXTAUTH_URL=https://opendev.onrender.com

NEXT_PUBLIC_API_URL=https://opendev.onrender.com/api

NEXTAUTH_SECRET=8cj8c0FNod09ME7YHVqcKIOU8HBNdhicQWlPUPl+u20=

JWT_SECRET=kxi6aEYtBoniJpAIzmyBqHCtd05SenAlk8WZaiZaLCc=

UPLOADTHING_SECRET=<GET-FROM-UPLOADTHING-DASHBOARD>

UPLOADTHING_APP_ID=<GET-FROM-UPLOADTHING-DASHBOARD>
```

## 🔧 What to Fix

### 1. MONGODB_URI - Fix This!

**❌ WRONG:**
```
mongodb+srv://opendev2023_db_user:<db_password>@cluster0.exw6ywf.mongodb.net/?appName=Cluster0
```

**✅ CORRECT:**
```
mongodb+srv://opendev2023_db_user:m8vDLIvcWRq8BZHM@cluster0.exw6ywf.mongodb.net/opendev?retryWrites=true&w=majority
```

**Changes:**
- Replace `<db_password>` with: `m8vDLIvcWRq8BZHM`
- Add `/opendev` before the `?` (database name)
- Change `?appName=Cluster0` to `?retryWrites=true&w=majority`

### 2. Remove Quotes (Optional but Recommended)

In Render, you **don't need quotes** around values. But if you use them, that's okay too.

**Without quotes (recommended):**
```
MONGODB_URI=mongodb+srv://opendev2023_db_user:m8vDLIvcWRq8BZHM@cluster0.exw6ywf.mongodb.net/opendev?retryWrites=true&w=majority
```

**With quotes (also works):**
```
MONGODB_URI="mongodb+srv://opendev2023_db_user:m8vDLIvcWRq8BZHM@cluster0.exw6ywf.mongodb.net/opendev?retryWrites=true&w=majority"
```

### 3. UploadThing - Get Real Values

1. Go to: https://uploadthing.com/dashboard
2. Sign in or create account
3. Create a new app
4. Copy:
   - **Secret** → Use as `UPLOADTHING_SECRET`
   - **App ID** → Use as `UPLOADTHING_APP_ID`

## 📋 Complete List (Copy-Paste Ready)

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://opendev2023_db_user:m8vDLIvcWRq8BZHM@cluster0.exw6ywf.mongodb.net/opendev?retryWrites=true&w=majority
NEXTAUTH_URL=https://opendev.onrender.com
NEXT_PUBLIC_API_URL=https://opendev.onrender.com/api
NEXTAUTH_SECRET=8cj8c0FNod09ME7YHVqcKIOU8HBNdhicQWlPUPl+u20=
JWT_SECRET=kxi6aEYtBoniJpAIzmyBqHCtd05SenAlk8WZaiZaLCc=
UPLOADTHING_SECRET=<get-from-uploadthing-dashboard>
UPLOADTHING_APP_ID=<get-from-uploadthing-dashboard>
```

## ✅ Checklist

- [ ] MONGODB_URI has real password (not `<db_password>`)
- [ ] MONGODB_URI includes `/opendev` database name
- [ ] MONGODB_URI has `?retryWrites=true&w=majority` (not `?appName=Cluster0`)
- [ ] NEXTAUTH_SECRET is set (✅ correct)
- [ ] JWT_SECRET is set (✅ correct)
- [ ] UPLOADTHING_SECRET is from dashboard (not placeholder)
- [ ] UPLOADTHING_APP_ID is from dashboard (not placeholder)

---

**Fix MONGODB_URI and get UploadThing credentials, then you're done!** ✅

