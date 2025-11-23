# PowerShell script to create final archive (Windows)
# Usage: .\scripts\create_final_archive.ps1

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$archiveName = "FINAL_ARCHIVE_$timestamp.zip"
$tempDir = New-TemporaryFile | ForEach-Object { Remove-Item $_; New-Item -ItemType Directory -Path $_ }

Write-Host "Creating final archive: $archiveName"
Write-Host "Using temp directory: $tempDir"

# Copy source files (exclude node_modules, .next, etc.)
Write-Host "Copying source files..."
Get-ChildItem -Path . -Recurse -Exclude node_modules,.next,.git,backups,*.log,.env*,*.zip,coverage,playwright-report,test-results | 
    Copy-Item -Destination $tempDir -Recurse -Force

# Copy handoff folder if it exists
if (Test-Path "handoff") {
    Write-Host "Copying handoff folder..."
    Copy-Item -Path "handoff" -Destination "$tempDir\handoff" -Recurse -Force
}

# Create PROD_ENV_SAMPLE.env
Write-Host "Creating PROD_ENV_SAMPLE.env..."
@"
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
"@ | Out-File -FilePath "$tempDir\PROD_ENV_SAMPLE.env" -Encoding utf8

# Create DB_SEED.json
Write-Host "Creating DB_SEED.json..."
@"
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
"@ | Out-File -FilePath "$tempDir\DB_SEED.json" -Encoding utf8

# Create ZIP archive
Write-Host "Creating ZIP archive..."
Compress-Archive -Path "$tempDir\*" -DestinationPath $archiveName -Force

# Cleanup
Remove-Item -Path $tempDir -Recurse -Force

$archiveSize = (Get-Item $archiveName).Length / 1MB
Write-Host "`n✅ Archive created: $archiveName"
Write-Host "📦 Archive size: $([math]::Round($archiveSize, 2)) MB"
Write-Host ""
Write-Host "Archive contains:"
Write-Host "  - Source code (excluding node_modules, .next, etc.)"
Write-Host "  - handoff/ folder with documentation"
Write-Host "  - PROD_ENV_SAMPLE.env"
Write-Host "  - DB_SEED.json"
Write-Host ""
Write-Host "To extract:"
Write-Host "  Expand-Archive -Path $archiveName -DestinationPath ."

