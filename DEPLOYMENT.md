# Deployment Guide - OpenDev to Render

This guide will walk you through deploying your Next.js application to Render with MongoDB Atlas.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Render Deployment](#render-deployment)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment](#post-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- GitHub account with your code pushed to a repository
- MongoDB Atlas account (free tier available)
- Render account (free tier available)
- UploadThing account (for file uploads)
- SendGrid account (optional, for email notifications)

---

## Step 1: MongoDB Atlas Setup

### 1.1 Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click **"Create a Cluster"**
4. Choose **FREE (M0)** tier
5. Select a cloud provider and region (choose closest to your Render region)
6. Click **"Create Cluster"**

### 1.2 Configure Database Access

1. Go to **Database Access** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Create a username and strong password (save these!)
5. Set user privileges to **"Atlas Admin"** or **"Read and write to any database"**
6. Click **"Add User"**

### 1.3 Configure Network Access

1. Go to **Network Access** in the left sidebar
2. Click **"Add IP Address"**
3. For production, click **"Allow Access from Anywhere"** (or add Render's IP ranges)
4. Click **"Confirm"**

### 1.4 Get Connection String

1. Go to **Database** → **Connect**
2. Choose **"Connect your application"**
3. Select **Node.js** and version **5.5 or later**
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `opendev` (or your preferred database name)

**Example connection string:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/opendev?retryWrites=true&w=majority
```

---

## Step 2: Render Deployment

### 2.1 Connect GitHub Repository

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select your repository
5. Click **"Connect"**

### 2.2 Configure Web Service

Fill in the following settings:

- **Name**: `opendev` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main` (or your production branch)
- **Root Directory**: Leave empty (or `./` if your project is in root)
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 2.3 Set Environment Variables

In the Render dashboard, go to **Environment** tab and add:

#### Required Variables:

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://opendev2023_db_user:m8vDLIvcWRq8BZHM@cluster0.exw6ywf.mongodb.net/opendev?retryWrites=true&w=majority
NEXTAUTH_SECRET=<GENERATE-THIS-BELOW>
NEXTAUTH_URL=https://opendev.onrender.com
NEXT_PUBLIC_API_URL=https://opendev.onrender.com/api
UPLOADTHING_SECRET=<GET-FROM-UPLOADTHING-DASHBOARD>
UPLOADTHING_APP_ID=<GET-FROM-UPLOADTHING-DASHBOARD>
JWT_SECRET=<GENERATE-THIS-BELOW>
```

#### Optional Variables:

```bash
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@opendev.com
ADMIN_EMAIL=admin@opendev.com
REQUIRE_EMAIL_VERIFICATION=false
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=your-sentry-project
SENTRY_AUTH_TOKEN=your-sentry-auth-token
```

#### Generate Secrets:

**For NEXTAUTH_SECRET and JWT_SECRET**, generate secure random strings:

**On Linux/Mac:**
```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Or use an online generator:**
- Visit: https://generate-secret.vercel.app/32

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Render will start building your application
3. Wait for the build to complete (5-10 minutes for first build)
4. Your app will be available at `https://your-app-name.onrender.com`

---

## Step 3: Environment Variables Details

### 3.1 MongoDB Atlas (`MONGODB_URI`)

- Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
- Get from MongoDB Atlas → Connect → Connect your application
- Replace `<password>` and `<dbname>` with actual values

### 3.2 NextAuth (`NEXTAUTH_SECRET`)

- Required for session encryption
- Generate a secure random 32+ character string
- Keep this secret and never commit to Git

### 3.3 NextAuth URL (`NEXTAUTH_URL`)

- Must match your Render app URL exactly
- Format: `https://your-app-name.onrender.com`
- No trailing slash

### 3.4 API URL (`NEXT_PUBLIC_API_URL`)

- Usually: `https://your-app-name.onrender.com/api`
- Used by client-side API calls
- Must be publicly accessible

### 3.5 UploadThing

1. Go to [UploadThing Dashboard](https://uploadthing.com/dashboard)
2. Create a new app
3. Copy `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID`
4. Add to Render environment variables

### 3.6 SendGrid (Optional)

1. Go to [SendGrid](https://sendgrid.com/)
2. Create an account and verify your email
3. Go to Settings → API Keys
4. Create a new API key with "Full Access"
5. Copy the key and add as `SENDGRID_API_KEY`
6. Set `SENDGRID_FROM_EMAIL` to your verified email

---

## Step 4: Post-Deployment

### 4.1 Seed Database

After deployment, you need to seed your database with initial data:

**Option 1: Using Render Shell**

1. Go to your Render service dashboard
2. Click **"Shell"** tab
3. Run:
```bash
npm run seed
```

**Option 2: Using Local Machine**

1. Create `.env.local` with production variables:
```bash
MONGODB_URI=your-production-mongodb-uri
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-app-name.onrender.com
# ... other variables
```

2. Run locally:
```bash
npm run seed
```

### 4.2 Verify Deployment

1. **Health Check**: Visit `https://your-app-name.onrender.com/api/health`
   - Should return: `{"status":"healthy","database":"connected"}`

2. **Homepage**: Visit `https://your-app-name.onrender.com`
   - Should load without errors

3. **Admin Login**: Visit `https://your-app-name.onrender.com/login`
   - Use admin credentials from seed script

### 4.3 Test Key Features

- ✅ View services page
- ✅ View projects page
- ✅ Submit contact form
- ✅ Admin login
- ✅ Create/edit services (admin)
- ✅ Upload images

---

## Step 5: Custom Domain (Optional)

### 5.1 Add Custom Domain in Render

1. Go to your Render service
2. Click **"Settings"** → **"Custom Domains"**
3. Add your domain
4. Follow DNS configuration instructions

### 5.2 Update Environment Variables

After adding custom domain, update:
- `NEXTAUTH_URL=https://yourdomain.com`
- `NEXT_PUBLIC_API_URL=https://yourdomain.com/api`

---

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Ensure all dependencies are in `package.json`
- Check that `node_modules` is not committed to Git
- Try clearing Render's build cache

**Error: "TypeScript errors"**
- Run `npm run typecheck` locally to fix errors
- Ensure all types are properly defined

### Database Connection Issues

**Error: "MongoNetworkError"**
- Check MongoDB Atlas Network Access allows Render IPs
- Verify connection string is correct
- Ensure database user has correct permissions

**Error: "Authentication failed"**
- Verify username and password in connection string
- Check database user exists and is not expired

### App Crashes After Deployment

**Check Logs:**
1. Go to Render dashboard → Your service → **"Logs"**
2. Look for error messages
3. Common issues:
   - Missing environment variables
   - Database connection timeout
   - Port binding issues (Render handles this automatically)

### Environment Variables Not Working

- Ensure variables are set in Render dashboard (not just `.env` file)
- Restart service after adding new variables
- Check variable names match exactly (case-sensitive)
- Verify `NEXT_PUBLIC_*` variables are accessible client-side

### Slow Cold Starts

- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Consider upgrading to paid plan for always-on service

---

## Production Checklist

Before going live, verify:

- [ ] All environment variables are set correctly
- [ ] Database is seeded with admin user
- [ ] Health check endpoint returns healthy status
- [ ] Admin login works
- [ ] File uploads work (UploadThing configured)
- [ ] Email notifications work (if using SendGrid)
- [ ] CORS is configured correctly
- [ ] Security headers are in place
- [ ] Error tracking is set up (Sentry, optional)
- [ ] Custom domain is configured (if applicable)
- [ ] SSL certificate is active (automatic with Render)

---

## Monitoring & Maintenance

### Health Monitoring

Set up health check monitoring:
- URL: `https://your-app-name.onrender.com/api/health`
- Use a service like UptimeRobot to ping every 5 minutes
- This keeps free tier service awake

### Database Backups

MongoDB Atlas provides automatic backups:
1. Go to MongoDB Atlas → Clusters
2. Enable **"Backup"** (available on paid tiers)
3. Or use `mongodump` script in `scripts/backup-db.sh`

### Log Monitoring

- Monitor Render logs for errors
- Set up Sentry for error tracking
- Check MongoDB Atlas logs for database issues

---

## Support

- **Render Docs**: https://render.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/

---

## Quick Reference

**Render Service URL Format:**
```
https://your-app-name.onrender.com
```

**Health Check:**
```
https://your-app-name.onrender.com/api/health
```

**Admin Login:**
```
https://your-app-name.onrender.com/login
```

**Default Admin Credentials** (from seed script):
- Email: `admin@opendev.com`
- Password: `admin123` (change in production!)

---

**Last Updated**: 2024
**Next.js Version**: 14.2.0
**Node Version**: 20.x (recommended)

