# API Documentation - WasteBin

Complete REST API documentation for the WasteBin Smart Waste Management System.

## 🔐 Authentication

All API endpoints require authentication via NextAuth v5 session cookies, except where noted.

### Headers
```
Cookie: next-auth.session-token=<token>
Content-Type: application/json
```

---

## 📍 Authentication Endpoints

### POST /api/auth/signin
Login with credentials.

**Request Body:**
```json
{
  "email": "admin@waste.com",
  "password": "admin123"
}
```

**Response:** `302 Redirect` to dashboard

---

### POST /api/auth/signout
Logout current user.

**Response:** `302 Redirect` to login page

---

## 🗑️ Bins API

### GET /api/bins
Get all bins with optional filters.

**Query Parameters:**
- `category` (optional): `PLASTIC`, `PAPER`, `METAL`, `ORGANIC`, `GLASS`, `EWASTE`
- `status` (optional): `LOW`, `MEDIUM`, `HIGH`
- `search` (optional): Search by binId or location

**Example:**
```
GET /api/bins?category=PLASTIC&status=HIGH
```

**Response:** `200 OK`
```json
[
  {
    "id": "cm123...",
    "binId": "BIN-001",
    "category": "PLASTIC",
    "location": "Main Street Plaza",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "capacity": 100,
    "currentLevel": 85.5,
    "status": "HIGH",
    "lastEmptied": "2025-11-20T10:30:00.000Z",
    "createdAt": "2025-11-15T08:00:00.000Z",
    "updatedAt": "2025-11-20T14:30:00.000Z"
  }
]
```

---

### POST /api/bins
Create a new bin (Admin only).

**Request Body:**
```json
{
  "binId": "BIN-016",
  "category": "PLASTIC",
  "location": "Central Park",
  "latitude": 40.7829,
  "longitude": -73.9654,
  "capacity": 100
}
```

**Validation:**
- `binId`: String, unique, required
- `category`: Enum (PLASTIC, PAPER, METAL, ORGANIC, GLASS, EWASTE), required
- `location`: String, min 3 chars, required
- `latitude`: Number, optional
- `longitude`: Number, optional
- `capacity`: Number, default 100

**Response:** `201 Created`
```json
{
  "id": "cm456...",
  "binId": "BIN-016",
  "category": "PLASTIC",
  "location": "Central Park",
  "latitude": 40.7829,
  "longitude": -73.9654,
  "capacity": 100,
  "currentLevel": 0,
  "status": "LOW",
  "lastEmptied": "2025-11-20T15:00:00.000Z",
  "createdAt": "2025-11-20T15:00:00.000Z",
  "updatedAt": "2025-11-20T15:00:00.000Z"
}
```

**Errors:**
- `400`: Validation failed or bin ID already exists
- `401`: Unauthorized
- `403`: Forbidden (not admin)

---

### GET /api/bins/[id]
Get a single bin with recent requests.

**Response:** `200 OK`
```json
{
  "id": "cm123...",
  "binId": "BIN-001",
  "category": "PLASTIC",
  "location": "Main Street Plaza",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "capacity": 100,
  "currentLevel": 85.5,
  "status": "HIGH",
  "lastEmptied": "2025-11-20T10:30:00.000Z",
  "requests": [
    {
      "id": "req123...",
      "type": "MANUAL_PICKUP",
      "description": "Bin almost full",
      "priority": "HIGH",
      "status": "PENDING",
      "createdAt": "2025-11-20T14:00:00.000Z",
      "user": {
        "name": "John Doe",
        "email": "user@waste.com"
      }
    }
  ]
}
```

**Errors:**
- `404`: Bin not found

---

### PUT /api/bins/[id]
Update a bin (Admin only).

**Request Body:**
```json
{
  "location": "Updated Location",
  "latitude": 40.7580,
  "longitude": -73.9855,
  "capacity": 120
}
```

**Response:** `200 OK` (Updated bin object)

**Errors:**
- `403`: Forbidden (not admin)
- `404`: Bin not found

---

### DELETE /api/bins/[id]
Delete a bin (Admin only).

**Response:** `200 OK`
```json
{
  "message": "Bin deleted successfully"
}
```

**Errors:**
- `403`: Forbidden (not admin)
- `404`: Bin not found

---

### PATCH /api/bins/[id]/level
Update bin fill level (Used by IoT simulation - no auth required).

**Request Body:**
```json
{
  "currentLevel": 87.3
}
```

**Response:** `200 OK` (Updated bin with auto-calculated status)

**Status Auto-Calculation:**
- `currentLevel` ≤ 50 → `status = LOW`
- 50 < `currentLevel` ≤ 80 → `status = MEDIUM`
- `currentLevel` > 80 → `status = HIGH`

---

## 📝 Requests API

### GET /api/requests
Get all requests (filtered by role).

**Query Parameters:**
- `status` (optional): `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`
- `type` (optional): `MANUAL_PICKUP`, `MAINTENANCE`, `HAZARDOUS_WASTE`
- `priority` (optional): `LOW`, `NORMAL`, `HIGH`, `URGENT`

**Example:**
```
GET /api/requests?status=PENDING&priority=HIGH
```

**Response:** `200 OK`
```json
[
  {
    "id": "req123...",
    "type": "MANUAL_PICKUP",
    "description": "Bin is overflowing, urgent pickup needed",
    "priority": "HIGH",
    "status": "PENDING",
    "userId": "usr123...",
    "binId": "bin123...",
    "createdAt": "2025-11-20T14:00:00.000Z",
    "updatedAt": "2025-11-20T14:00:00.000Z",
    "user": {
      "name": "John Doe",
      "email": "user@waste.com"
    },
    "bin": {
      "binId": "BIN-001",
      "category": "PLASTIC",
      "location": "Main Street Plaza"
    }
  }
]
```

**Access Control:**
- **Users**: See only their own requests
- **Admins**: See all requests

---

### POST /api/requests
Create a new request.

**Request Body:**
```json
{
  "type": "MANUAL_PICKUP",
  "description": "Bin is full and needs immediate pickup",
  "priority": "HIGH",
  "binId": "bin123..." // optional
}
```

**Validation:**
- `type`: Enum (MANUAL_PICKUP, MAINTENANCE, HAZARDOUS_WASTE), required
- `description`: String, min 10 chars, required
- `priority`: Enum (NORMAL, HIGH, URGENT), required
- `binId`: String, optional (must exist if provided)

**Response:** `201 Created`
```json
{
  "id": "req456...",
  "type": "MANUAL_PICKUP",
  "description": "Bin is full and needs immediate pickup",
  "priority": "HIGH",
  "status": "PENDING",
  "userId": "usr123...",
  "binId": "bin123...",
  "createdAt": "2025-11-20T15:00:00.000Z",
  "updatedAt": "2025-11-20T15:00:00.000Z",
  "user": {
    "name": "John Doe",
    "email": "user@waste.com"
  },
  "bin": {
    "binId": "BIN-001",
    "category": "PLASTIC",
    "location": "Main Street Plaza"
  }
}
```

**Errors:**
- `400`: Validation failed
- `404`: Bin not found (if binId provided)

---

### GET /api/requests/[id]
Get a single request.

**Response:** `200 OK` (Request object with bin and user details)

**Access Control:**
- **Users**: Can only view own requests
- **Admins**: Can view all requests

**Errors:**
- `403`: Forbidden (not your request)
- `404`: Request not found

---

### PATCH /api/requests/[id]
Update request status (Admin only).

**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "adminNotes": "Pickup scheduled for tomorrow" // optional
}
```

**Validation:**
- `status`: Enum (PENDING, IN_PROGRESS, COMPLETED, CANCELLED), required
- `adminNotes`: String, optional

**Response:** `200 OK` (Updated request object)

**Errors:**
- `403`: Forbidden (not admin)
- `404`: Request not found

---

### DELETE /api/requests/[id]
Delete a request.

**Access Control:**
- **Users**: Can delete own PENDING requests
- **Admins**: Can delete any request

**Response:** `200 OK`
```json
{
  "message": "Request deleted successfully"
}
```

**Errors:**
- `403`: Forbidden
- `404`: Request not found

---

## 🤖 Simulation API

### POST /api/simulation
Run one simulation iteration (updates all bins).

**Response:** `200 OK`
```json
{
  "stats": {
    "totalBins": 15,
    "averageFillLevel": 65.3,
    "binsNeedingAttention": 3,
    "categoryCounts": {
      "PLASTIC": 3,
      "PAPER": 3,
      "METAL": 2,
      "ORGANIC": 3,
      "GLASS": 2,
      "EWASTE": 2
    }
  },
  "updates": [
    {
      "binId": "BIN-001",
      "oldLevel": 45.2,
      "newLevel": 47.8,
      "change": 2.6,
      "status": "MEDIUM"
    }
  ]
}
```

**Simulation Logic:**
- Runs every 15 seconds when active
- Uses 30-second time increments
- Fill rates: 6-12x faster than realistic (demo mode)
- Auto-empties bins at 95%+
- Peak hour multipliers (1.5x during 8-10 AM, 12-2 PM, 6-8 PM)

---

### GET /api/simulation
Get current simulation statistics.

**Response:** `200 OK`
```json
{
  "totalBins": 15,
  "averageFillLevel": 65.3,
  "binsNeedingAttention": 3,
  "categoryCounts": {
    "PLASTIC": 3,
    "PAPER": 3,
    "METAL": 2,
    "ORGANIC": 3,
    "GLASS": 2,
    "EWASTE": 2
  }
}
```

---

## 📊 Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "too_small",
      "minimum": 10,
      "path": ["description"],
      "message": "Description must be at least 10 characters"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "error": "Bin not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## 🔧 Rate Limiting

Currently no rate limiting implemented. Recommended for production:
- 100 requests per 15 minutes per IP
- 1000 requests per hour for authenticated users

---

## 📈 Pagination

Currently not implemented. All endpoints return full results.

Recommended for production:
```
GET /api/bins?page=1&limit=20
```

---

## 🔍 Testing with cURL

### Login
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@waste.com","password":"admin123"}' \
  -c cookies.txt
```

### Get Bins
```bash
curl http://localhost:3000/api/bins \
  -b cookies.txt
```

### Create Request
```bash
curl -X POST http://localhost:3000/api/requests \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "type": "MANUAL_PICKUP",
    "description": "Test request from API",
    "priority": "HIGH"
  }'
```

### Update Bin Level
```bash
curl -X PATCH http://localhost:3000/api/bins/[id]/level \
  -H "Content-Type: application/json" \
  -d '{"currentLevel": 75.5}'
```

---

## 🎯 Best Practices

1. **Always validate input** with Zod schemas
2. **Check authentication** on protected endpoints
3. **Use transactions** for multi-step operations
4. **Handle errors gracefully** with appropriate status codes
5. **Log errors** for debugging (console.error)
6. **Return consistent responses** with proper HTTP codes

---

## 📚 Additional Resources

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [NextAuth.js](https://next-auth.js.org/)
- [Zod Validation](https://zod.dev/)

---

**API Version:** 1.0  
**Last Updated:** November 20, 2025
