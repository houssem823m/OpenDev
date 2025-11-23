# Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/opendev
   NEXTAUTH_SECRET=your-secret-key-here-change-in-production
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   UPLOADTHING_SECRET=your-uploadthing-secret
   UPLOADTHING_APP_ID=your-uploadthing-app-id
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── services/          # Services pages
│   ├── projects/          # Projects pages
│   └── ...
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── Navbar.tsx        # Navigation component
│   ├── Footer.tsx        # Footer component
│   └── Container.tsx     # Layout container
├── lib/                  # Utility functions
│   ├── auth.ts          # NextAuth configuration
│   ├── mongodb.ts       # MongoDB connection
│   └── utils.ts         # Utility functions
├── hooks/                # Custom React hooks
├── types/                # TypeScript definitions
└── services/             # API service functions
```

## Features Implemented

✅ Next.js 14 with App Router
✅ TypeScript configuration
✅ TailwindCSS with custom theme
✅ Shadcn UI setup
✅ Lucide Icons
✅ Framer Motion ready
✅ Axios configured
✅ React Hook Form + Zod ready
✅ UploadThing configured
✅ NextAuth (JWT) setup
✅ MongoDB/Mongoose ready
✅ React Hot Toast
✅ SWR ready
✅ Path aliases configured
✅ Responsive Navbar & Footer
✅ All page routes created
✅ Global styling with Poppins & Nunito fonts
✅ Pastel/cartoon theme

## Next Steps

1. Implement authentication logic in `lib/auth.ts`
2. Create MongoDB models in `lib/models/`
3. Build out page components with actual content
4. Add form components using React Hook Form
5. Implement file upload functionality
6. Set up admin dashboard features

