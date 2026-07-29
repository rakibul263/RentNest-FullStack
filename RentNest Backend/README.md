# RentNest API

Rental Property Marketplace Backend API built with TypeScript, Express.js, Prisma, PostgreSQL, and Stripe.

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js 5
- **ORM:** Prisma 7
- **Database:** PostgreSQL (via Prisma Postgres / Neon)
- **Auth:** JWT (jsonwebtoken + bcryptjs)
- **Payments:** Stripe
- **Validation:** express-validator
- **Deployment:** Vercel (serverless)

## Base URL

| Environment | URL |
|-------------|-----|
| Local | `http://localhost:5050` |
| Production | `https://rentnest-api.vercel.app` |

## Response Format

All endpoints return JSON with this structure:

```json
{
  "success": true,
  "message": "Operation message",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 42
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errorDetails": { ... }
}
```

## Setup

```bash
# 1. Clone and install
npm install

# 2. Create .env (see .env.example)
cp .env.example .env

# 3. Build Prisma client & run migration
npm run prisma:build
npx prisma migrate dev

# 4. Start dev server
npm run dev
```

### Environment Variables

```env
PORT=5050
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
ADMIN_EMAIL=admin@rentnest.com
ADMIN_PASSWORD=Admin@123
NODE_ENV=development
```

### Default Admin

- **Email:** admin@rentnest.com
- **Password:** Admin@123

---

## API Endpoints

### Health Check

#### GET /api/health

Check if the API is running.

**Response:**
```json
{
  "success": true,
  "message": "RentNest API is running"
}
```

---

### Auth

#### POST /api/auth/register

Register a new user.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "tenant",
  "phone": "+8801712345678"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid-here",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "tenant",
      "phone": "+8801712345678",
      "isBanned": false,
      "createdAt": "2026-07-07T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST /api/auth/login

Login with email and password.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-here",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "tenant",
      "phone": "+8801712345678",
      "isBanned": false
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### GET /api/auth/me

Get the currently authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "tenant",
    "phone": "+8801712345678",
    "isBanned": false,
    "createdAt": "2026-07-07T10:00:00.000Z"
  }
}
```

---

### Categories

#### GET /api/categories

Get all property categories.

**Response (200):**
```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Apartment",
      "description": "Modern apartment units",
      "createdAt": "2026-07-07T10:00:00.000Z"
    },
    {
      "id": "uuid",
      "name": "House",
      "description": "Independent houses",
      "createdAt": "2026-07-07T10:00:00.000Z"
    },
    {
      "id": "uuid",
      "name": "Studio",
      "description": "Studio apartments",
      "createdAt": "2026-07-07T10:00:00.000Z"
    },
    {
      "id": "uuid",
      "name": "Condo",
      "description": "Condominium units",
      "createdAt": "2026-07-07T10:00:00.000Z"
    },
    {
      "id": "uuid",
      "name": "Duplex",
      "description": "Duplex homes",
      "createdAt": "2026-07-07T10:00:00.000Z"
    }
  ]
}
```

---

### Properties (Public)

#### GET /api/properties

Get all available properties with filters.

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `city` | string | Filter by city (partial match) |
| `location` | string | Search city, address, or state |
| `minPrice` | number | Minimum price |
| `maxPrice` | number | Maximum price |
| `category` | string | Category name (partial match) |
| `bedrooms` | number | Exact bedroom count |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |

**Response (200):**
```json
{
  "success": true,
  "message": "Properties fetched successfully",
  "data": [
    {
      "id": "uuid",
      "title": "Modern 2BR Apartment in Gulshan",
      "description": "A beautiful modern apartment...",
      "price": 25000,
      "address": "123 Gulshan Avenue",
      "city": "Dhaka",
      "state": "Dhaka",
      "zipCode": "1212",
      "lat": 23.7805,
      "lng": 90.4142,
      "bedrooms": 2,
      "bathrooms": 2,
      "area": 1200,
      "amenities": ["WiFi", "Parking", "Gym", "Pool"],
      "images": ["https://example.com/img1.jpg"],
      "isAvailable": true,
      "createdAt": "2026-07-07T10:00:00.000Z",
      "updatedAt": "2026-07-07T10:00:00.000Z",
      "landlord": {
        "id": "uuid",
        "name": "Landlord Name",
        "email": "landlord@example.com",
        "phone": "+8801712345678"
      },
      "category": {
        "id": "uuid",
        "name": "Apartment"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

#### GET /api/properties/:id

Get a single property with reviews.

**Response (200):**
```json
{
  "success": true,
  "message": "Property fetched successfully",
  "data": {
    "id": "uuid",
    "title": "Modern 2BR Apartment in Gulshan",
    "description": "A beautiful modern apartment...",
    "price": 25000,
    "address": "123 Gulshan Avenue",
    "city": "Dhaka",
    "state": "Dhaka",
    "zipCode": "1212",
    "lat": 23.7805,
    "lng": 90.4142,
    "bedrooms": 2,
    "bathrooms": 2,
    "area": 1200,
    "amenities": ["WiFi", "Parking", "Gym", "Pool"],
    "images": ["https://example.com/img1.jpg"],
    "isAvailable": true,
    "createdAt": "2026-07-07T10:00:00.000Z",
    "updatedAt": "2026-07-07T10:00:00.000Z",
    "landlord": {
      "id": "uuid",
      "name": "Landlord Name",
      "email": "landlord@example.com",
      "phone": "+8801712345678"
    },
    "category": {
      "id": "uuid",
      "name": "Apartment"
    },
    "reviews": [
      {
        "id": "uuid",
        "rating": 5,
        "comment": "Great place!",
        "createdAt": "2026-07-07T12:00:00.000Z",
        "tenant": {
          "id": "uuid",
          "name": "John Doe"
        }
      }
    ]
  }
}
```

---

### Landlord

All landlord endpoints require `Authorization: Bearer <token>` header and the user must have role `landlord`.

#### POST /api/landlord/properties

Create a new property listing.

**Request:**
```json
{
  "title": "Modern 2BR Apartment in Gulshan",
  "description": "A beautiful modern apartment with all amenities in the heart of Gulshan.",
  "categoryId": "category-uuid",
  "price": 25000,
  "address": "123 Gulshan Avenue",
  "city": "Dhaka",
  "state": "Dhaka",
  "zipCode": "1212",
  "bedrooms": 2,
  "bathrooms": 2,
  "area": 1200,
  "amenities": ["WiFi", "Parking", "Gym"],
  "images": ["https://example.com/img1.jpg"]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Property created successfully",
  "data": {
    "id": "uuid",
    "title": "Modern 2BR Apartment in Gulshan",
    "description": "A beautiful modern apartment...",
    "price": 25000,
    "address": "123 Gulshan Avenue",
    "city": "Dhaka",
    "state": "Dhaka",
    "zipCode": "1212",
    "bedrooms": 2,
    "bathrooms": 2,
    "area": 1200,
    "amenities": ["WiFi", "Parking", "Gym"],
    "images": ["https://example.com/img1.jpg"],
    "isAvailable": true,
    "landlordId": "landlord-uuid",
    "categoryId": "category-uuid",
    "createdAt": "2026-07-07T10:00:00.000Z",
    "updatedAt": "2026-07-07T10:00:00.000Z",
    "category": {
      "id": "uuid",
      "name": "Apartment"
    }
  }
}
```

#### PUT /api/landlord/properties/:id

Update your own property (partial update allowed).

**Request:**
```json
{
  "price": 27000,
  "isAvailable": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Property updated successfully",
  "data": { "...same structure as create..." }
}
```

#### DELETE /api/landlord/properties/:id

Delete your own property.

**Response (200):**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

#### GET /api/landlord/requests

Get all rental requests for your properties.

**Response (200):**
```json
{
  "success": true,
  "message": "Rental requests fetched successfully",
  "data": [
    {
      "id": "uuid",
      "status": "pending",
      "message": "I'm interested in renting this property.",
      "startDate": "2026-08-01T00:00:00.000Z",
      "endDate": "2027-07-31T00:00:00.000Z",
      "createdAt": "2026-07-07T10:00:00.000Z",
      "updatedAt": "2026-07-07T10:00:00.000Z",
      "tenant": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+8801712345678"
      },
      "property": {
        "id": "uuid",
        "title": "Modern 2BR Apartment in Gulshan",
        "price": 25000,
        "address": "123 Gulshan Avenue",
        "city": "Dhaka"
      }
    }
  ]
}
```

#### PATCH /api/landlord/requests/:id

Approve or reject a rental request.

**Request:**
```json
{
  "status": "approved"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Rental request approved successfully",
  "data": {
    "id": "uuid",
    "status": "approved",
    "message": "I'm interested...",
    "startDate": "2026-08-01T00:00:00.000Z",
    "endDate": "2027-07-31T00:00:00.000Z",
    "tenant": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "property": {
      "id": "uuid",
      "title": "Modern 2BR Apartment in Gulshan"
    }
  }
}
```

---

### Rentals

All rental endpoints require `Authorization: Bearer <token>` header.

#### POST /api/rentals

Submit a rental request (tenant only).

**Request:**
```json
{
  "propertyId": "property-uuid",
  "startDate": "2026-08-01",
  "endDate": "2027-07-31",
  "message": "I'm interested in renting this property."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Rental request submitted successfully",
  "data": {
    "id": "uuid",
    "status": "pending",
    "message": "I'm interested in renting this property.",
    "startDate": "2026-08-01T00:00:00.000Z",
    "endDate": "2027-07-31T00:00:00.000Z",
    "createdAt": "2026-07-07T10:00:00.000Z",
    "updatedAt": "2026-07-07T10:00:00.000Z",
    "tenantId": "tenant-uuid",
    "propertyId": "property-uuid",
    "landlordId": "landlord-uuid",
    "property": {
      "id": "uuid",
      "title": "Modern 2BR Apartment in Gulshan",
      "price": 25000
    }
  }
}
```

#### GET /api/rentals

Get all rental requests for the authenticated user (tenant sees their own, landlord sees requests on their properties via different endpoint).

**Response (200):**
```json
{
  "success": true,
  "message": "Rental requests fetched successfully",
  "data": [
    {
      "id": "uuid",
      "status": "pending",
      "message": "I'm interested...",
      "startDate": "2026-08-01T00:00:00.000Z",
      "endDate": "2027-07-31T00:00:00.000Z",
      "createdAt": "2026-07-07T10:00:00.000Z",
      "updatedAt": "2026-07-07T10:00:00.000Z",
      "property": {
        "id": "uuid",
        "title": "Modern 2BR Apartment in Gulshan",
        "price": 25000,
        "address": "123 Gulshan Avenue",
        "city": "Dhaka",
        "images": ["https://example.com/img1.jpg"]
      },
      "landlord": {
        "id": "uuid",
        "name": "Landlord Name",
        "email": "landlord@example.com",
        "phone": "+8801712345678"
      }
    }
  ]
}
```

#### GET /api/rentals/:id

Get a specific rental request by ID (tenant or landlord of that request).

**Response (200):**
```json
{
  "success": true,
  "message": "Rental request fetched successfully",
  "data": {
    "id": "uuid",
    "status": "approved",
    "message": "I'm interested...",
    "startDate": "2026-08-01T00:00:00.000Z",
    "endDate": "2027-07-31T00:00:00.000Z",
    "createdAt": "2026-07-07T10:00:00.000Z",
    "updatedAt": "2026-07-08T10:00:00.000Z",
    "property": {
      "id": "uuid",
      "title": "Modern 2BR Apartment in Gulshan",
      "price": 25000,
      "address": "123 Gulshan Avenue",
      "city": "Dhaka",
      "state": "Dhaka",
      "zipCode": "1212",
      "bedrooms": 2,
      "bathrooms": 2,
      "area": 1200,
      "amenities": ["WiFi", "Parking"],
      "images": ["https://example.com/img1.jpg"],
      "isAvailable": true,
      "landlordId": "landlord-uuid",
      "categoryId": "category-uuid",
      "createdAt": "2026-07-06T10:00:00.000Z",
      "updatedAt": "2026-07-06T10:00:00.000Z",
      "category": {
        "id": "uuid",
        "name": "Apartment"
      }
    },
    "landlord": {
      "id": "uuid",
      "name": "Landlord Name",
      "email": "landlord@example.com",
      "phone": "+8801712345678"
    },
    "payments": [
      {
        "id": "uuid",
        "amount": 25000,
        "method": "card",
        "provider": "stripe",
        "transactionId": "pi_xxx",
        "status": "completed",
        "paidAt": "2026-07-08T12:00:00.000Z",
        "createdAt": "2026-07-08T11:00:00.000Z"
      }
    ]
  }
}
```

---

### Payments

All payment endpoints require `Authorization: Bearer <token>` header.

#### POST /api/payments/create-payment-intent

Create a Stripe payment intent for an approved rental request (tenant only).

**Request:**
```json
{
  "rentalRequestId": "rental-request-uuid"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Payment intent created",
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "paymentId": "payment-uuid",
    "amount": 25000
  }
}
```

#### POST /api/payments/confirm

Confirm a payment after Stripe checkout succeeds (tenant only).

**Request:**
```json
{
  "paymentId": "payment-uuid",
  "transactionId": "pi_xxx"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment confirmed successfully",
  "data": {
    "id": "payment-uuid",
    "amount": 25000,
    "method": "card",
    "provider": "stripe",
    "transactionId": "pi_xxx",
    "status": "completed",
    "paidAt": "2026-07-08T12:00:00.000Z",
    "createdAt": "2026-07-08T11:00:00.000Z",
    "tenantId": "tenant-uuid",
    "rentalRequestId": "rental-request-uuid"
  }
}
```

#### GET /api/payments

Get payment history for the authenticated user.

**Response (200):**
```json
{
  "success": true,
  "message": "Payment history fetched",
  "data": [
    {
      "id": "payment-uuid",
      "amount": 25000,
      "method": "card",
      "provider": "stripe",
      "transactionId": "pi_xxx",
      "status": "completed",
      "paidAt": "2026-07-08T12:00:00.000Z",
      "createdAt": "2026-07-08T11:00:00.000Z",
      "rentalRequest": {
        "id": "uuid",
        "status": "active",
        "property": {
          "id": "uuid",
          "title": "Modern 2BR Apartment in Gulshan",
          "price": 25000
        }
      }
    }
  ]
}
```

#### GET /api/payments/:id

Get a specific payment by ID.

**Response (200):**
```json
{
  "success": true,
  "message": "Payment fetched",
  "data": {
    "id": "payment-uuid",
    "amount": 25000,
    "method": "card",
    "provider": "stripe",
    "transactionId": "pi_xxx",
    "status": "completed",
    "paidAt": "2026-07-08T12:00:00.000Z",
    "createdAt": "2026-07-08T11:00:00.000Z",
    "rentalRequest": {
      "id": "uuid",
      "status": "active",
      "startDate": "2026-08-01T00:00:00.000Z",
      "endDate": "2027-07-31T00:00:00.000Z",
      "property": {
        "id": "uuid",
        "title": "Modern 2BR Apartment in Gulshan",
        "price": 25000,
        "address": "123 Gulshan Avenue",
        "city": "Dhaka",
        "state": "Dhaka",
        "zipCode": "1212",
        "bedrooms": 2,
        "bathrooms": 2,
        "area": 1200,
        "amenities": ["WiFi", "Parking"],
        "images": ["https://example.com/img1.jpg"],
        "isAvailable": true,
        "landlordId": "landlord-uuid",
        "categoryId": "category-uuid"
      },
      "landlord": {
        "id": "uuid",
        "name": "Landlord Name",
        "email": "landlord@example.com"
      }
    }
  }
}
```

---

### Reviews

#### GET /api/reviews

Get all reviews, optionally filtered by property.

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `propertyId` | string | Filter reviews for a specific property |

**Response (200):**
```json
{
  "success": true,
  "message": "Reviews fetched successfully",
  "data": [
    {
      "id": "uuid",
      "rating": 5,
      "comment": "Excellent property! Very clean and well-maintained.",
      "createdAt": "2026-07-08T14:00:00.000Z",
      "tenant": {
        "id": "uuid",
        "name": "John Doe"
      }
    }
  ]
}
```

#### POST /api/reviews

Create a review for a property you have rented (tenant only, requires auth).

**Request:**
```json
{
  "propertyId": "property-uuid",
  "rentalRequestId": "rental-request-uuid",
  "rating": 5,
  "comment": "Excellent property! Very clean and well-maintained."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "id": "uuid",
    "rating": 5,
    "comment": "Excellent property! Very clean and well-maintained.",
    "createdAt": "2026-07-08T14:00:00.000Z",
    "tenantId": "tenant-uuid",
    "propertyId": "property-uuid",
    "rentalRequestId": "rental-request-uuid",
    "tenant": {
      "id": "uuid",
      "name": "John Doe"
    }
  }
}
```

#### GET /api/reviews/my

Get all reviews by the authenticated tenant.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Your reviews fetched successfully",
  "data": [
    {
      "id": "uuid",
      "rating": 5,
      "comment": "Excellent property!",
      "createdAt": "2026-07-08T14:00:00.000Z",
      "property": {
        "id": "uuid",
        "title": "Modern 2BR Apartment in Gulshan"
      }
    }
  ]
}
```

---

### Admin

All admin endpoints require `Authorization: Bearer <token>` header and the user must have role `admin`.

#### GET /api/admin/users

Get all users with pagination.

**Query Parameters:** `page` (default: 1), `limit` (default: 20)

**Response (200):**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "tenant",
      "phone": "+8801712345678",
      "isBanned": false,
      "createdAt": "2026-07-07T10:00:00.000Z",
      "_count": {
        "properties": 0,
        "rentalRequests": 3,
        "reviews": 1
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 15
  }
}
```

#### PATCH /api/admin/users/:id

Ban or unban a user.

**Request:**
```json
{
  "isBanned": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User banned successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "tenant",
    "isBanned": true
  }
}
```

#### GET /api/admin/properties

Get all properties with pagination (including unavailable).

**Query Parameters:** `page` (default: 1), `limit` (default: 20)

**Response (200):**
```json
{
  "success": true,
  "message": "Properties fetched successfully",
  "data": [
    {
      "id": "uuid",
      "title": "Modern 2BR Apartment",
      "description": "...",
      "price": 25000,
      "address": "123 Gulshan Avenue",
      "city": "Dhaka",
      "bedrooms": 2,
      "bathrooms": 2,
      "area": 1200,
      "isAvailable": true,
      "createdAt": "2026-07-07T10:00:00.000Z",
      "updatedAt": "2026-07-07T10:00:00.000Z",
      "landlord": {
        "id": "uuid",
        "name": "Landlord Name",
        "email": "landlord@example.com"
      },
      "category": {
        "id": "uuid",
        "name": "Apartment"
      },
      "_count": {
        "rentalRequests": 5,
        "reviews": 2
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 50
  }
}
```

#### GET /api/admin/rentals

Get all rental requests with pagination.

**Response (200):**
```json
{
  "success": true,
  "message": "Rental requests fetched successfully",
  "data": [
    {
      "id": "uuid",
      "status": "pending",
      "message": null,
      "startDate": "2026-08-01T00:00:00.000Z",
      "endDate": "2027-07-31T00:00:00.000Z",
      "createdAt": "2026-07-07T10:00:00.000Z",
      "updatedAt": "2026-07-07T10:00:00.000Z",
      "tenant": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "landlord": {
        "id": "uuid",
        "name": "Landlord Name",
        "email": "landlord@example.com"
      },
      "property": {
        "id": "uuid",
        "title": "Modern 2BR Apartment",
        "price": 25000
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 30
  }
}
```

#### POST /api/admin/categories

Create a new category.

**Request:**
```json
{
  "name": "Penthouse",
  "description": "Luxury penthouse apartments"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "uuid",
    "name": "Penthouse",
    "description": "Luxury penthouse apartments",
    "createdAt": "2026-07-08T15:00:00.000Z"
  }
}
```

#### DELETE /api/admin/categories/:id

Delete a category.

**Response (200):**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## Enums

### UserRole
| Value | Description |
|-------|-------------|
| `tenant` | Can browse properties, submit rental requests, make payments, write reviews |
| `landlord` | Can create/manage properties, approve/reject rental requests |
| `admin` | Can manage users, properties, categories |

### RentalStatus
| Value | Description |
|-------|-------------|
| `pending` | Awaiting landlord approval |
| `approved` | Landlord approved, awaiting payment |
| `rejected` | Landlord rejected |
| `active` | Payment completed, rental active |
| `completed` | Rental period ended |
| `cancelled` | Cancelled by tenant/landlord |

### PaymentStatus
| Value | Description |
|-------|-------------|
| `pending` | Payment intent created, awaiting confirmation |
| `completed` | Payment successful |
| `failed` | Payment failed |

### PaymentProvider
| Value | Description |
|-------|-------------|
| `stripe` | Stripe payment |
| `sslcommerz` | SSLCommerz payment |

---

## Error Codes

| HTTP Status | Meaning |
|-------------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/expired token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Project Structure

```
src/
├── app.ts                          # Express app entry
├── server.ts                       # Server bootstrap
├── config/
│   ├── db.ts                       # Database connection
│   └── prisma.ts                   # Prisma client singleton
├── middleware/
│   ├── auth.ts                     # JWT authenticate + authorize
│   ├── errorHandler.ts             # Global error handler
│   └── validate.ts                 # express-validator wrapper
├── types/
│   └── index.ts                    # Shared types and enums
├── utils/
│   ├── AppError.ts                 # Custom error class
│   ├── catchAsync.ts               # Async error wrapper
│   └── sendResponse.ts             # Standardized response helper
└── modules/
    ├── auth/                       # Registration, login, profile
    ├── property/                   # Property listing, details
    ├── landlord/                   # Landlord CRUD + request mgmt
    ├── rental/                     # Rental request submission
    ├── payment/                    # Stripe payment integration
    ├── review/                     # Property reviews
    └── admin/                      # Admin dashboard endpoints

prisma/
├── schemas/                        # Individual schema files
│   ├── _base.prisma                # Generator, datasource, enums
│   ├── user.prisma
│   ├── category.prisma
│   ├── property.prisma
│   ├── rental-request.prisma
│   ├── payment.prisma
│   └── review.prisma
├── combine.js                      # Schema concatenation script
├── schema.prisma                   # Combined schema (auto-generated)
└── migrations/                     # Database migrations

api/
└── index.ts                        # Vercel serverless entry point
```
