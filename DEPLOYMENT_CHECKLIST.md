# Deployment Checklist

## Pre-Deployment

### 1. Environment Variables
- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `NEXTAUTH_SECRET` - Strong random secret (generate with `openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` - Production URL (e.g., `https://opendev.com`)
- [ ] `JWT_SECRET` - JWT signing secret
- [ ] `SENTRY_DSN` - Sentry DSN for error tracking
- [ ] `UPLOADTHING_SECRET` - UploadThing secret key
- [ ] `UPLOADTHING_APP_ID` - UploadThing app ID
- [ ] `NODE_ENV=production`

### 2. Database Setup
- [ ] MongoDB instance created and accessible
- [ ] Database indexes created (run seed script)
- [ ] Initial admin user created (run seed script)
- [ ] Backup strategy configured

### 3. Security
- [ ] All secrets stored in environment variables (not in code)
- [ ] Rate limiting configured
- [ ] CORS settings verified
- [ ] File upload restrictions verified
- [ ] Security headers configured

## Deployment Steps

### Option A: Vercel Deployment

1. **Connect Repository**
   - [ ] Push code to GitHub/GitLab
   - [ ] Import project in Vercel dashboard
   - [ ] Connect repository

2. **Configure Build Settings**
   - [ ] Build Command: `npm run build`
   - [ ] Output Directory: `.next`
   - [ ] Install Command: `npm ci`

3. **Set Environment Variables**
   - [ ] Add all required environment variables in Vercel dashboard
   - [ ] Verify all variables are set correctly

4. **Deploy**
   - [ ] Trigger deployment
   - [ ] Monitor build logs
   - [ ] Verify deployment success

### Option B: Docker Deployment

1. **Build Docker Image**
   ```bash
   docker build -t opendev:latest .
   ```

2. **Run Container**
   ```bash
   docker-compose up -d
   ```

3. **Verify**
   - [ ] Container is running
   - [ ] Application is accessible
   - [ ] Health check endpoint responds

### Option C: Custom Server Deployment

1. **Server Setup**
   - [ ] Node.js 20+ installed
   - [ ] PM2 or similar process manager installed
   - [ ] Nginx or reverse proxy configured

2. **Deploy Application**
   - [ ] Clone repository
   - [ ] Install dependencies: `npm ci --production`
   - [ ] Build application: `npm run build`
   - [ ] Start application: `npm start` or `pm2 start`

3. **Configure Reverse Proxy**
   - [ ] Nginx/Apache configured
   - [ ] SSL certificate installed (Let's Encrypt)
   - [ ] Domain DNS configured

## Post-Deployment

### 1. Verification
- [ ] Application loads correctly
- [ ] Health check endpoint: `/api/health` returns 200
- [ ] Database connection verified
- [ ] Authentication works
- [ ] File uploads work
- [ ] Admin panel accessible

### 2. Monitoring
- [ ] Sentry error tracking active
- [ ] Application logs monitored
- [ ] Database performance monitored
- [ ] Uptime monitoring configured

### 3. Security
- [ ] HTTPS enabled and working
- [ ] Security headers verified
- [ ] Rate limiting active
- [ ] Admin routes protected

### 4. Performance
- [ ] Lighthouse score > 90
- [ ] Page load times acceptable
- [ ] Image optimization working
- [ ] Caching configured

### 5. Backup
- [ ] Automated backups configured
- [ ] Backup restoration tested
- [ ] Backup retention policy set

## Rollback Plan

If deployment fails:
1. [ ] Identify the issue
2. [ ] Revert to previous version
3. [ ] Verify application works
4. [ ] Document the issue
5. [ ] Fix and redeploy

## Maintenance

- [ ] Schedule regular backups
- [ ] Monitor error rates
- [ ] Review security logs
- [ ] Update dependencies regularly
- [ ] Test disaster recovery procedures

