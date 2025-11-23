# Production Environment Variables Template

Copy these variables to your Render dashboard → Environment tab.

## Required Variables

```bash
# Node Environment
NODE_ENV=production

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/opendev?retryWrites=true&w=majority

# NextAuth Configuration
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-super-secret-nextauth-key-32-chars-minimum
NEXTAUTH_URL=https://your-app-name.onrender.com

# API Configuration
NEXT_PUBLIC_API_URL=https://your-app-name.onrender.com/api

# UploadThing (Get from https://uploadthing.com/dashboard)
UPLOADTHING_SECRET=sk_live_xxxxxxxxxxxxx
UPLOADTHING_APP_ID=xxxxxxxxxxxxx

# JWT Secret for Email Verification
# Generate with: openssl rand -base64 32
JWT_SECRET=your-jwt-secret-for-email-verification
```

## Optional Variables

```bash
# SendGrid Email Service (Optional)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@opendev.com

# Admin Email for Notifications
ADMIN_EMAIL=admin@opendev.com

# Email Verification Requirement
REQUIRE_EMAIL_VERIFICATION=false

# Sentry Error Tracking (Optional)
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_ORG=your-org-name
SENTRY_PROJECT=opendev
SENTRY_AUTH_TOKEN=your-sentry-auth-token
```

## How to Generate Secrets

### On Linux/Mac:
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32
```

### On Windows (PowerShell):
```powershell
# Generate NEXTAUTH_SECRET
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Generate JWT_SECRET
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Online Generator:
Visit: https://generate-secret.vercel.app/32

## Important Notes

1. **Never commit these values to Git**
2. **Use different secrets for production and development**
3. **NEXTAUTH_URL must match your Render app URL exactly** (no trailing slash)
4. **NEXT_PUBLIC_* variables are exposed to the browser** - don't put secrets here
5. **Update NEXTAUTH_URL if you add a custom domain**

## Variable Descriptions

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ Yes |
| `NEXTAUTH_SECRET` | Secret for encrypting NextAuth sessions | ✅ Yes |
| `NEXTAUTH_URL` | Your app's public URL | ✅ Yes |
| `NEXT_PUBLIC_API_URL` | Public API base URL | ✅ Yes |
| `UPLOADTHING_SECRET` | UploadThing API secret | ✅ Yes |
| `UPLOADTHING_APP_ID` | UploadThing application ID | ✅ Yes |
| `JWT_SECRET` | Secret for JWT token signing | ✅ Yes |
| `SENDGRID_API_KEY` | SendGrid API key for emails | ❌ Optional |
| `ADMIN_EMAIL` | Admin email for notifications | ❌ Optional |
| `REQUIRE_EMAIL_VERIFICATION` | Enable email verification | ❌ Optional |
| `SENTRY_*` | Sentry error tracking config | ❌ Optional |

