# Quick Deploy Guide - 5 Minutes

This is a condensed version of the full deployment guide. For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Prerequisites Checklist

- [ ] GitHub repository with code pushed
- [ ] MongoDB Atlas account
- [ ] Render account
- [ ] UploadThing account

---

## Step 1: MongoDB Atlas (2 minutes)

1. Create cluster at https://www.mongodb.com/cloud/atlas
2. **Database Access**: Create user (save username/password)
3. **Network Access**: Allow from anywhere (or add Render IPs)
4. **Connect**: Get connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with `opendev`

**Connection string format:**
```
mongodb+srv://username:password@cluster.mongodb.net/opendev?retryWrites=true&w=majority
```

---

## Step 2: Render Deployment (3 minutes)

### 2.1 Create Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub → Select repository
4. Configure:
   - **Name**: `opendev`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 2.2 Add Environment Variables

Click **"Environment"** tab, add these:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/opendev?retryWrites=true&w=majority
NEXTAUTH_SECRET=<generate-random-32-chars>
NEXTAUTH_URL=https://your-app-name.onrender.com
NEXT_PUBLIC_API_URL=https://your-app-name.onrender.com/api
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id
JWT_SECRET=<generate-random-32-chars>
```

**Generate secrets:**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 2.3 Deploy

1. Click **"Create Web Service"**
2. Wait for build (5-10 minutes)
3. Your app: `https://your-app-name.onrender.com`

---

## Step 3: Seed Database

After deployment succeeds:

1. Go to Render dashboard → Your service → **"Shell"** tab
2. Run:
```bash
npm run seed
```

Or run locally with production MongoDB URI in `.env.local`

---

## Step 4: Verify

1. **Health Check**: `https://your-app-name.onrender.com/api/health`
   - Should show: `{"status":"healthy","database":"connected"}`

2. **Homepage**: `https://your-app-name.onrender.com`
   - Should load without errors

3. **Admin Login**: `https://your-app-name.onrender.com/login`
   - Email: `admin@opendev.com`
   - Password: `admin123` (change after first login!)

---

## Common Issues

**Build fails?**
- Check Render logs for errors
- Ensure all dependencies in `package.json`
- Run `npm run build` locally first

**Database connection fails?**
- Verify MongoDB Atlas Network Access allows all IPs
- Check connection string format
- Verify username/password are correct

**App crashes?**
- Check environment variables are all set
- Verify `NEXTAUTH_URL` matches your Render URL exactly
- Check Render logs for specific errors

---

## Next Steps

- [ ] Change admin password
- [ ] Configure custom domain (optional)
- [ ] Set up email notifications (SendGrid, optional)
- [ ] Set up error tracking (Sentry, optional)
- [ ] Configure health check monitoring

---

**Full Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

