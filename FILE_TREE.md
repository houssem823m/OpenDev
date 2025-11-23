# Complete File Tree - Database Models & API Routes

## 📁 Database Models (`/lib/models/`)

```
lib/models/
├── User.ts              # User model (name, email, password, role, isBanned, createdAt)
├── Service.ts           # Service model (title, description, image, slug, createdAt)
├── Project.ts           # Project model (title, category, description, mainImage, externalLink, createdAt)
├── ProjectImage.ts      # ProjectImage model (projectId ref, imageUrl)
└── Order.ts             # Order model (serviceId ref, name, email, message, fileUrl, status, createdAt)
```

## 📁 Validation Schemas (`/lib/validations.ts`)

- `createServiceSchema` - Service creation validation
- `updateServiceSchema` - Service update validation
- `createProjectSchema` - Project creation validation
- `updateProjectSchema` - Project update validation
- `createProjectImageSchema` - ProjectImage creation validation
- `createOrderSchema` - Order creation validation
- `updateOrderSchema` - Order status update validation
- `updateUserSchema` - User update validation

## 📁 API Routes (`/app/api/`)

### Services API
```
app/api/services/
├── route.ts                    # GET (list), POST (create)
├── [slug]/
│   └── route.ts                # GET (by slug)
└── [id]/
    └── route.ts                # PUT (update), DELETE (delete)
```

### Projects API
```
app/api/projects/
├── route.ts                    # GET (list), POST (create)
└── [id]/
    └── route.ts                # GET (by id), PUT (update), DELETE (delete)
```

### Project Images API
```
app/api/project-images/
├── route.ts                    # POST (create)
├── [projectId]/
│   └── route.ts                # GET (list by projectId)
└── [id]/
    └── route.ts                # DELETE (delete)
```

### Orders API
```
app/api/orders/
├── route.ts                    # GET (list), POST (create)
└── [id]/
    └── route.ts                # GET (by id), PUT (update status), DELETE (delete)
```

### Users API
```
app/api/users/
├── route.ts                    # GET (list)
└── [id]/
    └── route.ts                # PUT (update role/ban), DELETE (delete)
```

## 📊 Summary

**Total Models:** 5
- User
- Service
- Project
- ProjectImage
- Order

**Total API Routes:** 15 route files
- Services: 3 routes (list, by slug, by id)
- Projects: 2 routes (list, by id)
- Project Images: 3 routes (create, by projectId, delete)
- Orders: 2 routes (list, by id)
- Users: 2 routes (list, by id)

**HTTP Methods Implemented:**
- GET: 8 endpoints
- POST: 5 endpoints
- PUT: 5 endpoints
- DELETE: 5 endpoints

**Features:**
✅ All models use safe import pattern: `mongoose.models.ModelName || mongoose.model(...)`
✅ Zod validation on all POST/PUT routes
✅ Consistent JSON response format: `{ success, data, message }`
✅ Proper error handling with status codes
✅ MongoDB connection using existing utility
✅ ObjectId validation on all dynamic routes
✅ Population of references (orders → services)
✅ Password exclusion in user list responses

