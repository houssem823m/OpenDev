# Environment Variables for Render - Copy These Values

Copy these **exact values** into your Render dashboard → Environment tab:

## Required Variables

```bash
NODE_ENV=production

MONGODB_URI=mongodb+srv://opendev2023_db_user:m8vDLIvcWRq8BZHM@cluster0.exw6ywf.mongodb.net/opendev?retryWrites=true&w=majority

NEXTAUTH_URL=https://opendev.onrender.com

NEXT_PUBLIC_API_URL=https://opendev.onrender.com/api
```

## Generate These Secrets

### NEXTAUTH_SECRET

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Copy the output** and use as:
```bash
NEXTAUTH_SECRET=<paste-generated-value-here>
```

### JWT_SECRET

Generate **another** random string (different from NEXTAUTH_SECRET):

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Copy the output** and use as:
```bash
JWT_SECRET=<paste-generated-value-here>
```

## UploadThing Variables

1. Go to https://uploadthing.com/dashboard
2. Create an app (if you haven't)
3. Copy the **Secret** and **App ID**
4. Add to Render:

```bash
UPLOADTHING_SECRET=<your-uploadthing-secret-from-dashboard>
UPLOADTHING_APP_ID=<your-uploadthing-app-id-from-dashboard>
```

## Complete Example (After Generating Secrets)

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://opendev2023_db_user:m8vDLIvcWRq8BZHM@cluster0.exw6ywf.mongodb.net/opendev?retryWrites=true&w=majority
NEXTAUTH_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz1234567890==
NEXTAUTH_URL=https://opendev.onrender.com
NEXT_PUBLIC_API_URL=https://opendev.onrender.com/api
UPLOADTHING_SECRET=sk_live_xxxxxxxxxxxxx
UPLOADTHING_APP_ID=xxxxxxxxxxxxx
JWT_SECRET=XyZaBcDeFgHiJkLmNoPqRsTuVwXyZ9876543210==
```

## Important Notes

⚠️ **Never commit these values to Git!**
- They're only for Render dashboard
- Keep them secret
- Generate new secrets for production (don't reuse development secrets)

## Quick Steps

1. **Generate NEXTAUTH_SECRET** (run command above, copy output)
2. **Generate JWT_SECRET** (run command again, copy different output)
3. **Get UploadThing credentials** (from dashboard)
4. **Add all to Render** → Environment tab
5. **Deploy!**

---

**After adding these, your app should deploy successfully!** ✅

