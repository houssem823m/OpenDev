# 🚀 Deploy Now - Step by Step

Follow these exact steps to deploy your OpenDev application to Render.

## Step 1: Push Code to GitHub

If you haven't pushed your code yet:

```bash
git add .
git commit -m "Production deployment ready"
git push origin main
```

Verify your code is at: https://github.com/houssem823m/OpenDev

## Step 2: Deploy to Render

### 2.1 Create Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect GitHub"** (if not already connected)
4. Select repository: **`houssem823m/OpenDev`**
5. Click **"Connect"**

### 2.2 Configure Service Settings

Fill in these **exact** values:

- **Name**: `opendev`
- **Region**: Choose closest to you (e.g., `Oregon (US West)`)
- **Branch**: `main`
- **Root Directory**: (leave empty)
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: `Free` (or `Starter` for better performance)

### 2.3 Add Environment Variables

Click **"Environment"** tab, then add these variables one by one:

#### Copy-Paste These Values:

```bash
NODE_ENV=production

MONGODB_URI=mongodb+srv://opendev2023_db_user:m8vDLIvcWRq8BZHM@cluster0.exw6ywf.mongodb.net/opendev?retryWrites=true&w=majority

NEXTAUTH_URL=https://opendev.onrender.com

NEXT_PUBLIC_API_URL=https://opendev.onrender.com/api
```

#### Generate These Secrets:

**NEXTAUTH_SECRET** - Generate a secure random string:

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

Copy the output and add as:
```bash
NEXTAUTH_SECRET=<paste-generated-value-here>
```

**JWT_SECRET** - Generate another one (different from NEXTAUTH_SECRET):
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Add as:
```bash
JWT_SECRET=<paste-generated-value-here>
```

#### UploadThing Variables:

Get these from https://uploadthing.com/dashboard:

```bash
UPLOADTHING_SECRET=<your-uploadthing-secret>
UPLOADTHING_APP_ID=<your-uploadthing-app-id>
```

#### Optional Variables:

```bash
ADMIN_EMAIL=admin@opendev.com
REQUIRE_EMAIL_VERIFICATION=false
```

### 2.4 Deploy

1. Scroll down and click **"Create Web Service"**
2. Render will start building (this takes 5-10 minutes)
3. Watch the build logs for any errors
4. When complete, your app will be at: **https://opendev.onrender.com**

## Step 3: Seed Database

After deployment succeeds:

1. In Render dashboard, go to your `opendev` service
2. Click **"Shell"** tab (top menu)
3. Wait for shell to connect
4. Run:
```bash
npm run seed
```

You should see:
```
✅ Admin user created
✅ Services created
✅ Projects created
✅ Site content initialized
🎉 Seeding completed!
```

## Step 4: Verify Deployment

### 4.1 Health Check

Visit: https://opendev.onrender.com/api/health

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2024-...",
  "database": "connected"
}
```

### 4.2 Homepage

Visit: https://opendev.onrender.com

Should load without errors.

### 4.3 Admin Login

1. Visit: https://opendev.onrender.com/login
2. Login with:
   - **Email**: `admin@opendev.com`
   - **Password**: `admin123`
3. **⚠️ IMPORTANT**: Change password immediately after first login!

## Step 5: Configure UploadThing (If Not Done)

1. Go to https://uploadthing.com/dashboard
2. Create a new app (if you haven't)
3. Copy the `Secret` and `App ID`
4. Add to Render environment variables:
   - `UPLOADTHING_SECRET`
   - `UPLOADTHING_APP_ID`
5. Restart the service in Render

## Troubleshooting

### Build Fails

**Check Render logs:**
- Go to your service → "Logs" tab
- Look for error messages
- Common issues:
  - Missing dependencies → Check `package.json`
  - TypeScript errors → Run `npm run typecheck` locally first
  - Build timeout → Upgrade to Starter plan

### Database Connection Fails

**Check MongoDB Atlas:**
1. Go to https://cloud.mongodb.com
2. **Network Access** → Ensure `0.0.0.0/0` is allowed
3. **Database Access** → Verify user `opendev2023_db_user` exists
4. Test connection string format

### App Crashes After Deployment

**Check environment variables:**
- All required variables are set
- `NEXTAUTH_URL` is exactly: `https://opendev.onrender.com` (no trailing slash)
- Secrets are generated (not empty)

### Slow First Load

- Render free tier spins down after 15 min inactivity
- First request after spin-down takes 30-60 seconds
- This is normal for free tier
- Consider upgrading to Starter plan for always-on

## Success Checklist

- [ ] Code pushed to GitHub
- [ ] Render service created
- [ ] All environment variables set
- [ ] Build completed successfully
- [ ] Database seeded
- [ ] Health check returns healthy
- [ ] Homepage loads
- [ ] Admin login works
- [ ] Admin password changed
- [ ] File uploads work (if UploadThing configured)

## Your Deployment URLs

- **App**: https://opendev.onrender.com
- **Health Check**: https://opendev.onrender.com/api/health
- **Admin**: https://opendev.onrender.com/login
- **GitHub**: https://github.com/houssem823m/OpenDev
- **Render Dashboard**: https://dashboard.render.com

## Next Steps

1. ✅ Deploy to Render
2. ✅ Seed database
3. ✅ Verify everything works
4. 🔄 Change admin password
5. 🔄 Configure custom domain (optional)
6. 🔄 Set up monitoring (health checks)
7. 🔄 Configure email notifications (SendGrid, optional)

---

**Need help?** Check the full guide: [DEPLOYMENT.md](./DEPLOYMENT.md)

