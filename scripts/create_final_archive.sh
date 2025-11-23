#!/bin/bash

# Create Final Archive Script
# This script creates a production-ready archive of the project

ARCHIVE_NAME="FINAL_ARCHIVE"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FINAL_ARCHIVE="${ARCHIVE_NAME}_${TIMESTAMP}.zip"

echo "Creating final archive: $FINAL_ARCHIVE"

# Create temporary directory
TEMP_DIR=$(mktemp -d)
echo "Using temp directory: $TEMP_DIR"

# Copy source code (exclude node_modules, .next, etc.)
echo "Copying source files..."
rsync -av \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude 'backups' \
  --exclude '*.log' \
  --exclude '.env*' \
  --exclude '*.zip' \
  --exclude 'coverage' \
  --exclude 'playwright-report' \
  --exclude 'test-results' \
  . "$TEMP_DIR/"

# Copy handoff folder
if [ -d "handoff" ]; then
  echo "Copying handoff folder..."
  cp -r handoff "$TEMP_DIR/"
fi

# Create PROD_ENV_SAMPLE.env
echo "Creating PROD_ENV_SAMPLE.env..."
cat > "$TEMP_DIR/PROD_ENV_SAMPLE.env" << 'EOF'
# Production Environment Variables Sample
# Copy this to .env.production and fill in your values

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/opendev

# Authentication
NEXTAUTH_SECRET=CHANGE_THIS_GENERATE_WITH_openssl_rand_base64_32
NEXTAUTH_URL=https://yourdomain.com
JWT_SECRET=CHANGE_THIS_GENERATE_WITH_openssl_rand_base64_32

# UploadThing
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id

# Email (Optional)
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Monitoring (Optional)
SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Environment
NODE_ENV=production
REQUIRE_EMAIL_VERIFICATION=false
EOF

# Create DB_SEED.json sample
echo "Creating DB_SEED.json..."
cat > "$TEMP_DIR/DB_SEED.json" << 'EOF'
{
  "admin": {
    "email": "admin@opendev.com",
    "password": "[HASHED_PASSWORD_PLACEHOLDER]",
    "name": "Admin User",
    "role": "admin"
  },
  "services": [
    {
      "title": "Développement Web",
      "slug": "developpement-web",
      "description": "Création de sites web modernes"
    }
  ],
  "projects": [
    {
      "title": "Site E-commerce",
      "category": "E-commerce",
      "description": "Plateforme e-commerce complète"
    }
  ]
}
EOF

# Create archive
echo "Creating ZIP archive..."
cd "$TEMP_DIR"
zip -r "../$FINAL_ARCHIVE" . -q
cd - > /dev/null

# Cleanup
rm -rf "$TEMP_DIR"

echo "✅ Archive created: $FINAL_ARCHIVE"
echo "📦 Archive size: $(du -h $FINAL_ARCHIVE | cut -f1)"
echo ""
echo "Archive contains:"
echo "  - Source code (excluding node_modules, .next, etc.)"
echo "  - handoff/ folder with documentation"
echo "  - PROD_ENV_SAMPLE.env"
echo "  - DB_SEED.json"
echo ""
echo "To extract:"
echo "  unzip $FINAL_ARCHIVE"

