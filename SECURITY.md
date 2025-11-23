# Security Policy

## Security Settings

### Authentication
- JWT tokens with secure secrets
- Session timeout configured
- Password hashing with bcrypt (10 rounds)
- Admin routes protected with role checks

### Rate Limiting
- Login: 5 attempts per 15 minutes
- Signup: 3 attempts per hour
- Order creation: 10 per hour

### File Uploads
- Maximum file size: 10MB
- Allowed types: JPEG, PNG, WebP, GIF, PDF
- Files stored securely via UploadThing
- MIME type validation

### Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

### Content Security Policy (CSP)
Configure in `next.config.js`:
```javascript
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
}
```

## Environment Variables

Never commit these to version control:
- `NEXTAUTH_SECRET`
- `JWT_SECRET`
- `MONGODB_URI`
- `SENTRY_DSN`
- `UPLOADTHING_SECRET`

## Database Security

- Use MongoDB authentication
- Restrict network access
- Enable SSL/TLS connections
- Regular backups
- Principle of least privilege

## API Security

- Input validation with Zod
- SQL injection prevention (using Mongoose)
- XSS prevention (React auto-escaping)
- CSRF protection (NextAuth built-in)

## Admin Security

- Admin routes require authentication
- Role-based access control
- Audit logging for admin actions
- Confirmation dialogs for destructive actions

## Reporting Security Issues

If you discover a security vulnerability:
1. Do NOT open a public issue
2. Email security@yourdomain.com
3. Include details and steps to reproduce
4. We will respond within 48 hours

## Security Best Practices

1. **Keep dependencies updated**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Regular security audits**
   - Review access logs
   - Check for suspicious activity
   - Review admin actions

3. **Monitor for vulnerabilities**
   - Set up Sentry alerts
   - Monitor failed login attempts
   - Track unusual API usage

4. **Backup security**
   - Encrypt backups
   - Store backups securely
   - Test backup restoration

## Compliance

- GDPR: User data handling
- Data retention policies
- Right to deletion
- Privacy policy required

