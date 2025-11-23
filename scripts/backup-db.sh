#!/bin/bash

# MongoDB Backup Script
# Usage: ./scripts/backup-db.sh

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="opendev_backup_${DATE}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# MongoDB connection string from environment
MONGODB_URI="${MONGODB_URI:-mongodb://localhost:27017/opendev}"

echo "Starting backup: $BACKUP_NAME"

# Extract database name from URI
DB_NAME=$(echo $MONGODB_URI | sed -n 's/.*\/\([^?]*\).*/\1/p')

# Run mongodump
mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/$BACKUP_NAME"

if [ $? -eq 0 ]; then
    echo "✅ Backup completed: $BACKUP_DIR/$BACKUP_NAME"
    
    # Compress backup
    tar -czf "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" -C "$BACKUP_DIR" "$BACKUP_NAME"
    rm -rf "$BACKUP_DIR/$BACKUP_NAME"
    
    echo "✅ Backup compressed: $BACKUP_DIR/${BACKUP_NAME}.tar.gz"
    
    # Keep only last 7 backups
    ls -t "$BACKUP_DIR"/*.tar.gz | tail -n +8 | xargs rm -f
    
    echo "✅ Old backups cleaned"
else
    echo "❌ Backup failed"
    exit 1
fi

