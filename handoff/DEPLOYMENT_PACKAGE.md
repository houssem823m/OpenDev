# Deployment Package

## Environment Variables (Production)

**Required Variables:**

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/opendev
NEXTAUTH_SECRET=[generate-32-char-secret]
NEXTAUTH_URL=https://yourdomain.com
JWT_SECRET=[generate-32-char-secret]
UPLOADTHING_SECRET=[from-uploadthing-dashboard]
UPLOADTHING_APP_ID=[from-uploadthing-dashboard]
NODE_ENV=production
```

**Optional Variables:**

```env
SENDGRID_API_KEY=[for-email-notifications]
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
SENTRY_DSN=[for-error-tracking]
NEXT_PUBLIC_SENTRY_DSN=[for-client-error-tracking]
REQUIRE_EMAIL_VERIFICATION=false
```

## Vercel Deployment

### Settings

1. **Framework Preset:** Next.js
2. **Build Command:** `npm run build`
3. **Output Directory:** `.next` (default)
4. **Install Command:** `npm ci`
5. **Node Version:** 20.x

### Steps

1. Connect GitHub repository to Vercel
2. Import project
3. Add all environment variables
4. Deploy

### Custom Domain

1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to match your domain

## Docker Deployment

### Build & Run

```bash
# Build image
docker build -t opendev:latest .

# Run with docker-compose
docker-compose up -d

# Or run standalone
docker run -d \
  -p 3000:3000 \
  --name opendev \
  --env-file .env.production \
  opendev:latest
```

### Docker Compose (Production)

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      # ... other env vars
    restart: unless-stopped
    depends_on:
      - mongo
  
  mongo:
    image: mongo:7
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

volumes:
  mongo_data:
```

## VM/Server Deployment

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Build application
npm run build

# Start with PM2
pm2 start npm --name "opendev" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### Using Systemd

Create `/etc/systemd/system/opendev.service`:

```ini
[Unit]
Description=OpenDev Next.js App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/opendev
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable opendev
sudo systemctl start opendev
```

## Database Migration & Seed

### Staging

```bash
# Connect to staging MongoDB
export MONGODB_URI="mongodb://staging-host:27017/opendev"

# Run seed
npm run seed
```

### Production

```bash
# Connect to production MongoDB
export MONGODB_URI="mongodb+srv://prod-connection-string"

# Run seed (creates admin user)
npm run seed

# Verify admin user created
mongosh $MONGODB_URI --eval "db.users.findOne({email: 'admin@opendev.com'})"
```

**⚠️ Important:** Change admin password immediately after seeding!

## Rollback Procedure

### Vercel

1. Go to Deployments tab
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

### Docker

```bash
# Stop current container
docker stop opendev

# Run previous image
docker run -d \
  -p 3000:3000 \
  --name opendev \
  --env-file .env.production \
  opendev:previous-version
```

### Database Rollback

```bash
# Restore from backup
mongorestore --uri="$MONGODB_URI" \
  --drop \
  backups/opendev_backup_YYYYMMDD_HHMMSS/
```

## Post-Deployment Checklist

- [ ] Health check: `GET /api/health` returns 200
- [ ] Admin login works
- [ ] Public pages load correctly
- [ ] File uploads work
- [ ] Email notifications work (if configured)
- [ ] Sentry error tracking active
- [ ] SSL certificate valid
- [ ] Database backups configured
- [ ] Monitoring alerts set up

## Monitoring

### Health Checks

```bash
# Check application health
curl https://yourdomain.com/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected"
}
```

### Logs

**Vercel:**
- View logs in Vercel dashboard → Deployments → Logs

**Docker:**
```bash
docker logs opendev -f
```

**PM2:**
```bash
pm2 logs opendev
```

## Scaling

### Horizontal Scaling

- Use load balancer (e.g., AWS ALB, Cloudflare)
- Deploy multiple instances
- Use shared MongoDB instance
- Configure sticky sessions if needed

### Database Scaling

- Use MongoDB Atlas for managed scaling
- Configure read replicas for read-heavy workloads
- Monitor connection pool usage

## Security Checklist

- [ ] All secrets in environment variables (not in code)
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting active
- [ ] File upload restrictions enforced
- [ ] Admin routes protected
- [ ] Database access restricted
- [ ] Regular security updates

---

**For detailed deployment steps, see `DEPLOYMENT_CHECKLIST.md`**

