# Maintenance Guide

## Regular Tasks

### Daily
- Monitor error logs in Sentry
- Check application health endpoint
- Review order submissions

### Weekly
- Review database growth
- Check backup integrity
- Review security logs
- Update dependencies (if needed)

### Monthly
- Full backup restoration test
- Security audit
- Performance review
- Dependency updates

## Database Maintenance

### Backup Schedule
```bash
# Daily backup (add to crontab)
0 2 * * * /path/to/scripts/backup-db.sh

# Weekly full backup
0 3 * * 0 /path/to/scripts/backup-db.sh --full
```

### Database Growth Monitoring
```bash
# Check database size
mongosh $MONGODB_URI --eval "db.stats()"

# Check collection sizes
mongosh $MONGODB_URI --eval "db.getCollectionNames().forEach(c => print(c + ': ' + db[c].countDocuments()))"
```

### Index Maintenance
- Review query performance
- Add indexes for slow queries
- Remove unused indexes

## Secret Rotation

### Rotating NEXTAUTH_SECRET
1. Generate new secret: `openssl rand -base64 32`
2. Update environment variable
3. Restart application
4. Users will need to log in again

### Rotating JWT_SECRET
1. Generate new secret
2. Update environment variable
3. Restart application
4. All existing sessions invalidated

### Rotating Database Password
1. Update MongoDB user password
2. Update `MONGODB_URI` environment variable
3. Restart application
4. Verify connection

## Cron Jobs

### Example crontab
```cron
# Daily backup at 2 AM
0 2 * * * /path/to/scripts/backup-db.sh

# Weekly cleanup of old backups (keep last 30 days)
0 3 * * 0 find /path/to/backups -name "*.tar.gz" -mtime +30 -delete

# Daily health check notification
0 9 * * * curl -f https://yourdomain.com/api/health || echo "Health check failed" | mail -s "Alert" admin@example.com
```

## Dependency Updates

### Check for updates
```bash
npm outdated
```

### Update dependencies
```bash
# Update patch versions
npm update

# Update major versions (review changelogs first)
npm install package@latest
```

### Security updates
```bash
npm audit
npm audit fix
```

## Performance Monitoring

### Key Metrics
- Response times
- Error rates
- Database query performance
- Memory usage
- CPU usage

### Tools
- Sentry for error tracking
- Vercel Analytics (if using Vercel)
- MongoDB Atlas monitoring
- Server monitoring (if self-hosted)

## Disaster Recovery

### Backup Restoration
```bash
# Extract backup
tar -xzf backups/opendev_backup_YYYYMMDD_HHMMSS.tar.gz

# Restore to MongoDB
mongorestore --uri="$MONGODB_URI" backups/opendev_backup_YYYYMMDD_HHMMSS/
```

### Database Recovery
1. Stop application
2. Restore from latest backup
3. Verify data integrity
4. Restart application
5. Test critical functionality

## Troubleshooting

### Application won't start
1. Check environment variables
2. Verify database connection
3. Check application logs
4. Verify port availability

### High error rate
1. Check Sentry for error details
2. Review recent code changes
3. Check database performance
4. Review server resources

### Slow performance
1. Check database indexes
2. Review query performance
3. Check server resources
4. Review caching strategy

## Support Contacts

- **Technical Issues**: [Your support email]
- **Security Issues**: [Security email]
- **Hosting Provider**: [Provider support]

