# OpenDev

A modern Next.js 14 application with TypeScript, TailwindCSS, and a comprehensive tech stack.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + Shadcn UI
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **File Upload**: UploadThing
- **Authentication**: NextAuth (JWT)
- **Database**: MongoDB with Mongoose
- **Notifications**: React Hot Toast
- **Data Fetching**: SWR

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file with:
```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/             # Utility functions and configurations
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
├── services/        # API services
└── public/          # Static assets
```

## Features

- Modern, responsive design with cartoon/pastel theme
- Complete authentication system
- File upload capabilities
- Admin dashboard
- Service and project management
- Order management system

## Deployment

This application is ready for production deployment on Render with MongoDB Atlas.

### Quick Deploy

See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for a 5-minute deployment guide.

### Full Deployment Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions including:
- MongoDB Atlas setup
- Render configuration
- Environment variables
- Post-deployment steps
- Troubleshooting

### Production Environment Variables

See [PRODUCTION_ENV_TEMPLATE.md](./PRODUCTION_ENV_TEMPLATE.md) for all required environment variables.

