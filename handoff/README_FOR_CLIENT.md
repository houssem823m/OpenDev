# OpenDev - Client Guide

## Project Overview

OpenDev is a modern web application for managing development services and showcasing projects. The platform allows you to:

- Display your services to potential clients
- Showcase completed projects in a portfolio
- Accept and manage client orders through a contact form
- Manage all content through an intuitive admin dashboard

## Quick Start - Preview Locally

To preview the project on your computer:

1. **Install Node.js** (version 20 or higher) from [nodejs.org](https://nodejs.org/)

2. **Open Terminal/Command Prompt** and navigate to the project folder

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`
   - Fill in the required values (see Developer Guide for details)

5. **Seed the database:**
   ```bash
   npm run seed
   ```
   This creates an admin user and sample data.

6. **Start the development server:**
   ```bash
   npm run dev
   ```

7. **Open your browser** and go to: `http://localhost:3000`

## Accessing the Application

### Staging/Production URLs

- **Staging:** [Your staging URL here]
- **Production:** [Your production URL here]

### Admin Access

**Default Admin Credentials** (created by seed script):
- **Email:** `admin@opendev.com`
- **Password:** `admin123`

⚠️ **IMPORTANT:** Change these credentials immediately after first login!

**To change admin password:**
1. Log in to the admin panel
2. Go to Admin → Users
3. Find your admin user
4. Click Edit and update the password

## Managing Content

### Creating a New Service

1. Log in to the admin panel at `/admin`
2. Navigate to **Services** → **Add Service**
3. Fill in:
   - **Title:** Name of your service
   - **Slug:** URL-friendly identifier (auto-generated from title)
   - **Description:** Detailed description
   - **Image:** Upload a service image
4. Click **Create Service**

### Creating a New Project

1. Go to **Projects** → **Add Project**
2. Fill in project details:
   - Title, Category, Description
   - Main image
   - External link (if applicable)
3. After creating, you can add multiple gallery images
4. Click **Create Project**

### Uploaded Images

All uploaded images are stored securely via UploadThing. You can:
- View uploaded images in the admin panel
- Delete images from the gallery
- Replace images by uploading new ones

### Editing Site Content

1. Go to **Admin** → **Content**
2. Edit sections:
   - **Hero:** Main banner text and image
   - **About:** Company description
   - **Advantages:** List of key benefits
   - **Footer:** Contact information
3. Click **Save** to apply changes

## Managing Orders

1. Go to **Admin** → **Orders**
2. View all client orders
3. Use filters to find specific orders:
   - Filter by status (Pending, In Progress, Done, Cancelled)
   - Search by customer name or email
   - Filter by service
   - Filter by date range
4. Update order status as you work on them
5. Export orders to CSV for record-keeping

## Archiving Services/Projects

Instead of deleting, you can archive items:

1. Go to Services or Projects list
2. Click **Archived** tab to see archived items
3. Click **Archive** to hide from public site
4. Click **Restore** to make them visible again
5. Click **Delete** to permanently remove

## Support & Contact

For technical support or questions:

- **Email:** [Your support email]
- **Documentation:** See `handoff/DEVELOPER_ONBOARDING.md` for technical details

## Important Notes

- Always backup your database before making major changes
- Test changes on staging before deploying to production
- Keep your admin credentials secure
- Regularly review and update your services and projects

---

**Last Updated:** [Current Date]
**Version:** 1.0.0

