# Developer Onboarding Guide

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.4+
- **Styling:** TailwindCSS + Shadcn UI
- **Database:** MongoDB with Mongoose
- **Authentication:** NextAuth (JWT)
- **File Upload:** UploadThing
- **Forms:** React Hook Form + Zod
- **Data Fetching:** SWR
- **Testing:** Vitest (unit) + Playwright (E2E)
- **Monitoring:** Sentry
- **Email:** SendGrid (optional)

## Local Development Setup

### 1. Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Git

### 2. Clone & Install

```bash
# Clone repository
git clone [repository-url]
cd OpenDev

# Install dependencies
npm install
```

### 3. Environment Setup

```bash
# Copy example env file
cp .env.example .env.local
```

**Required Environment Variables:**

```env
# Database
MONGODB_URI=mongodb://localhost:27017/opendev

# Authentication
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=generate-with-openssl-rand-base64-32

# UploadThing
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id

# Optional - Email
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Optional - Monitoring
SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Environment
NODE_ENV=development
```

**Generate secrets:**
```bash
openssl rand -base64 32
```

### 4. Seed Database

```bash
npm run seed
```

This creates:
- Admin user: `admin@opendev.com` / `admin123`
- Sample services
- Sample projects
- Default site content

### 5. Start Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

## Common Tasks & Commands

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run typecheck

# Run all checks
npm run check
```

### Testing

```bash
# Unit tests
npm run test:unit

# E2E tests
npm run test:e2e

# Run specific test
npm run test:unit -- ServiceCard.test.tsx
```

### Database

```bash
# Seed database
npm run seed

# Backup database
./scripts/backup-db.sh

# Restore from backup
mongorestore --uri="$MONGODB_URI" backups/backup_name/
```

### Build & Deploy

```bash
# Production build
npm run build

# Start production server
npm start

# Docker build
docker build -t opendev:latest .

# Docker run
docker-compose up -d
```

## Project Structure

```
app/              # Next.js App Router pages
├── admin/        # Admin dashboard pages
├── api/          # API routes
├── services/     # Public services pages
└── projects/     # Public projects pages

components/        # React components
├── admin/        # Admin-specific components
├── ui/           # Shadcn UI components
└── ...           # Shared components

lib/
├── models/       # Mongoose models
├── middleware/   # Rate limiting, security
└── utils/        # Utility functions

services/         # API service functions
types/            # TypeScript definitions
tests/            # Test files
scripts/          # Utility scripts
```

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/opendev` |
| `NEXTAUTH_SECRET` | Secret for NextAuth session encryption | `[32-char random string]` |
| `NEXTAUTH_URL` | Base URL of your application | `http://localhost:3000` |
| `JWT_SECRET` | Secret for JWT token signing | `[32-char random string]` |
| `UPLOADTHING_SECRET` | UploadThing API secret | From UploadThing dashboard |
| `UPLOADTHING_APP_ID` | UploadThing app ID | From UploadThing dashboard |
| `SENDGRID_API_KEY` | SendGrid API key (optional) | From SendGrid dashboard |
| `SENDGRID_FROM_EMAIL` | Email address for sending | `noreply@yourdomain.com` |
| `ADMIN_EMAIL` | Admin email for notifications | `admin@yourdomain.com` |
| `SENTRY_DSN` | Sentry DSN for error tracking | From Sentry dashboard |

## Running Tests

### Unit Tests (Vitest)

```bash
# Run all tests
npm run test:unit

# Watch mode
npm run test:unit -- --watch

# Coverage
npm run test:unit -- --coverage
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test
npx playwright test tests/e2e/admin/create-service.spec.ts

# Run in UI mode
npx playwright test --ui
```

## Database Operations

### Seed Script

The seed script (`scripts/seed.ts`) creates:
- Admin user
- Sample services
- Sample projects
- Default site content

**Run:**
```bash
npm run seed
# or
ts-node scripts/seed.ts
```

### Backup

```bash
# Manual backup
./scripts/backup-db.sh

# Automated (add to crontab)
0 2 * * * /path/to/scripts/backup-db.sh
```

### Restore

```bash
# Extract backup
tar -xzf backups/opendev_backup_YYYYMMDD_HHMMSS.tar.gz

# Restore
mongorestore --uri="$MONGODB_URI" backups/opendev_backup_YYYYMMDD_HHMMSS/
```

## Docker Usage

### Development

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Build

```bash
# Build image
docker build -t opendev:latest .

# Run container
docker run -p 3000:3000 --env-file .env.production opendev:latest
```

## API Development

### API Routes

All API routes are in `app/api/`:
- `/api/services` - Service CRUD
- `/api/projects` - Project CRUD
- `/api/orders` - Order management
- `/api/users` - User management
- `/api/content` - Site content
- `/api/health` - Health check

### Testing API

```bash
# Using curl
curl http://localhost:3000/api/health

# Using httpie
http GET http://localhost:3000/api/services
```

## Troubleshooting

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Issues

- Verify `MONGODB_URI` is correct
- Check MongoDB is running
- Verify network access

### Type Errors

```bash
# Regenerate types
npm run typecheck

# Check for missing types
npm install --save-dev @types/[package-name]
```

## Next Steps

1. Read `API_DOCUMENTATION.md` for API details
2. Review `SECURITY.md` for security best practices
3. Check `MAINTENANCE.md` for maintenance procedures
4. See `DEPLOYMENT_CHECKLIST.md` for deployment steps

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Mongoose Documentation](https://mongoosejs.com/docs)
- [Shadcn UI](https://ui.shadcn.com)
- [UploadThing Docs](https://docs.uploadthing.com)

---

**Questions?** Contact the development team or refer to the project documentation.

