# 📋 Copy These Exact Values to Render

## Step 1: Generate Secrets

Open PowerShell and run these commands:

### Generate NEXTAUTH_SECRET:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Copy the output** (it will look like: `AbCdEfGhIjKlMnOpQrStUvWxYz1234567890==`)

### Generate JWT_SECRET:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Copy the output** (it will be different from NEXTAUTH_SECRET)

---

## Step 2: Copy These Exact Values to Render

Go to: **Render Dashboard → Your Service → Environment Tab**

### Copy and paste these EXACTLY (one by one):

```bash
NODE_ENV
production
```

```bash
MONGODB_URI
mongodb+srv://opendev2023_db_user:m8vDLIvcWRq8BZHM@cluster0.exw6ywf.mongodb.net/opendev?retryWrites=true&w=majority
```

```bash
NEXTAUTH_URL
https://opendev.onrender.com
```

```bash
NEXT_PUBLIC_API_URL
https://opendev.onrender.com/api
```

```bash
NEXTAUTH_SECRET
<paste-the-first-generated-secret-here>
```

```bash
JWT_SECRET
<paste-the-second-generated-secret-here>
```

```bash
UPLOADTHING_SECRET
<get-from-uploadthing-dashboard>
```

```bash
UPLOADTHING_APP_ID
<get-from-uploadthing-dashboard>
```

---

## Step 3: Get UploadThing Credentials

1. Go to: https://uploadthing.com/dashboard
2. Sign in or create account
3. Create a new app (if needed)
4. Copy:
   - **Secret** → Use as `UPLOADTHING_SECRET`
   - **App ID** → Use as `UPLOADTHING_APP_ID`

---

## Complete Example (After You Generate Secrets)

After running the PowerShell commands and getting UploadThing credentials, your complete list should look like:

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://opendev2023_db_user:m8vDLIvcWRq8BZHM@cluster0.exw6ywf.mongodb.net/opendev?retryWrites=true&w=majority
NEXTAUTH_URL=https://opendev.onrender.com
NEXT_PUBLIC_API_URL=https://opendev.onrender.com/api
NEXTAUTH_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz1234567890==
JWT_SECRET=XyZaBcDeFgHiJkLmNoPqRsTuVwXyZ9876543210==
UPLOADTHING_SECRET=sk_live_xxxxxxxxxxxxx
UPLOADTHING_APP_ID=xxxxxxxxxxxxx
```

**Note:** Replace the example secrets above with your actual generated values!

---

## Quick Checklist

- [ ] Generated NEXTAUTH_SECRET (PowerShell command)
- [ ] Generated JWT_SECRET (PowerShell command, different value)
- [ ] Got UploadThing Secret from dashboard
- [ ] Got UploadThing App ID from dashboard
- [ ] Added all 8 variables to Render Environment tab
- [ ] Saved/Redeployed

---

**After adding all variables, your app should deploy successfully!** ✅

