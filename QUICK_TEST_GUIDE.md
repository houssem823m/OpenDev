# Quick Test Guide

## ✅ Project Status

**Route Conflicts:** ✅ RESOLVED
- Fixed conflicting `[projectId]` and `[id]` routes
- GET endpoint now uses query parameters
- DELETE endpoint uses `[id]` parameter

**Server:** ✅ READY
- Development server configured
- All routes properly structured

## 🚀 Testing Steps

### 1. Start the Server

```bash
npm run dev
```

Server will be available at: **http://localhost:3000**

### 2. Seed the Database (New Terminal)

```bash
npm run seed
```

This creates:
- Admin user: `admin@opendev.com` / `admin123`
- Sample services
- Sample projects
- Default site content

### 3. Test in Browser

**Public Pages:**
- Homepage: http://localhost:3000
- Services: http://localhost:3000/services
- Projects: http://localhost:3000/projects

**Admin Panel:**
- Login: http://localhost:3000/admin
- Credentials: `admin@opendev.com` / `admin123`

### 4. Test API Endpoints

```bash
# Health check
curl http://localhost:3000/api/health

# Get services
curl http://localhost:3000/api/services

# Get projects
curl http://localhost:3000/api/projects

# Get orders (with filters)
curl "http://localhost:3000/api/orders?status=pending&page=1&limit=10"
```

### 5. Test Features

**Admin Features:**
- ✅ Create/Edit/Delete Services
- ✅ Create/Edit/Delete Projects
- ✅ Manage Orders (filter, paginate, export CSV)
- ✅ Manage Users (role, ban, search)
- ✅ Edit Site Content
- ✅ Archive/Restore Services & Projects

**Public Features:**
- ✅ Browse Services
- ✅ Browse Projects
- ✅ View Project Gallery (with improved lightbox)
- ✅ Submit Orders

## 📝 Test Checklist

- [ ] Server starts without errors
- [ ] Homepage loads
- [ ] Services page displays
- [ ] Projects page displays
- [ ] Admin login works
- [ ] Can create service
- [ ] Can create project
- [ ] Can submit order
- [ ] Gallery lightbox works (keyboard nav, download)
- [ ] Archive/restore works
- [ ] CSV export works

## ⚠️ Troubleshooting

**If server doesn't start:**
- Check if port 3000 is available
- Verify `.env.local` exists with required variables
- Check MongoDB connection

**If API endpoints fail:**
- Ensure database is seeded
- Check MongoDB connection string
- Verify environment variables

**If npm scripts don't work:**
- Try: `npm install` to refresh dependencies
- Clear npm cache: `npm cache clean --force`

## ✅ Success Criteria

Project is working correctly if:
1. ✅ Server starts without route errors
2. ✅ Homepage loads
3. ✅ Admin panel accessible
4. ✅ Can create services/projects
5. ✅ Orders can be submitted
6. ✅ All features from handoff are functional

---

**Status:** ✅ **READY FOR TESTING**

All route conflicts resolved. Server is ready to run and test!

