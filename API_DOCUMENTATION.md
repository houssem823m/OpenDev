# API Documentation

## Base URL
`/api`

## Authentication
Most endpoints require authentication via NextAuth JWT. Admin endpoints require `role: "admin"`.

## Response Format
All responses follow this structure:
```json
{
  "success": boolean,
  "data": any,
  "message": string,
  "errors"?: array
}
```

## Endpoints

### Services

#### GET /api/services
List all services.

**Response:**
```json
{
  "success": true,
  "data": [Service],
  "message": "Services retrieved successfully"
}
```

#### GET /api/services/[slug]
Get service by slug.

**Response:**
```json
{
  "success": true,
  "data": Service,
  "message": "Service retrieved successfully"
}
```

#### GET /api/services/[id]
Get service by ID (admin).

**Response:**
```json
{
  "success": true,
  "data": Service,
  "message": "Service retrieved successfully"
}
```

#### POST /api/services
Create service (admin).

**Body:**
```json
{
  "title": string,
  "description": string,
  "slug": string,
  "image"?: string
}
```

#### PUT /api/services/[id]
Update service (admin).

**Body:**
```json
{
  "title"?: string,
  "description"?: string,
  "slug"?: string,
  "image"?: string
}
```

#### DELETE /api/services/[id]
Delete service (admin).

---

### Orders

#### GET /api/orders
List orders with filtering and pagination.

**Query Parameters:**
- `status` (optional): `pending` | `in_progress` | `done` | `cancelled`
- `serviceId` (optional): Filter by service ID
- `q` (optional): Search by name, email, or message
- `from` (optional): ISO date - filter from date
- `to` (optional): ISO date - filter to date
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [Order],
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number
  },
  "message": "Orders retrieved successfully"
}
```

**Example:**
```
GET /api/orders?status=pending&page=1&limit=10&q=john
```

#### GET /api/orders/[id]
Get order by ID.

#### POST /api/orders
Create order.

**Body:**
```json
{
  "serviceId": string,
  "name": string,
  "email": string,
  "message": string,
  "fileUrl"?: string
}
```

#### PUT /api/orders/[id]
Update order status (admin).

**Body:**
```json
{
  "status": "pending" | "in_progress" | "done" | "cancelled"
}
```

#### DELETE /api/orders/[id]
Delete order (admin).

---

### Users

#### GET /api/users
List users with search and pagination.

**Query Parameters:**
- `search` (optional): Search by name or email
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [User],
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number
  },
  "message": "Users retrieved successfully"
}
```

#### PUT /api/users/[id]
Update user (admin).

**Body:**
```json
{
  "role"?: "user" | "admin",
  "isBanned"?: boolean
}
```

#### PUT /api/users/[id]/role
Change user role (admin).

**Body:**
```json
{
  "role": "user" | "admin"
}
```

#### PUT /api/users/[id]/ban
Toggle user ban (admin).

**Body:**
```json
{
  "isBanned": boolean
}
```

#### DELETE /api/users/[id]
Delete user (admin).

---

### Content

#### GET /api/content
Get site content.

**Response:**
```json
{
  "success": true,
  "data": {
    "hero": {...},
    "about": {...},
    "advantages": [...],
    "footer": {...},
    "siteImages": [...]
  },
  "message": "Content retrieved successfully"
}
```

#### PUT /api/content
Update site content (admin).

**Body:** Full site content object.

---

### Admin Actions

#### GET /api/admin-actions
Get recent admin actions (admin only).

**Query Parameters:**
- `limit` (optional): Number of actions (default: 50)

#### POST /api/admin-actions
Log admin action (internal use).

---

### Health Check

#### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy" | "unhealthy",
  "timestamp": "ISO date",
  "database": "connected" | "disconnected"
}
```

---

## Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
- `503` - Service Unavailable

## Rate Limiting

- Login: 5 attempts per 15 minutes
- Signup: 3 attempts per hour
- Order creation: 10 per hour

Rate limit headers:
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset time (Unix timestamp)
