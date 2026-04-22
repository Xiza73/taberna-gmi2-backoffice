# Backoffice Backend API Documentation

## Overview

The backoffice frontend consumes a NestJS ecommerce backend API. This document outlines all endpoints, data models, and conventions the frontend must follow.

### Backend Stack
- **Framework:** NestJS 11 + TypeORM
- **Database:** PostgreSQL 16
- **Base URL:** `http://localhost:3000/api/v1`
- **Auth:** JWT with refresh token rotation
- **External Services:** Cloudinary (images), MercadoPago (payments), Elasticsearch 8 (search)

### Key Conventions

**Response Envelope:**
All API responses follow a consistent envelope structure:
```json
{
  "success": boolean,
  "data": T | null,
  "message": string | null
}
```

**Prices:**
All monetary values are stored and transmitted as integers in **cents**.
- Example: `1500` = $15.00
- Client is responsible for formatting (e.g., divide by 100, apply locale formatting)

**Pagination:**
Paginated endpoints accept:
- `page`: number (starting from 1, default: 1)
- `limit`: number (1-100, default: 20)

Response includes:
```json
{
  "success": true,
  "data": {
    "items": T[],
    "total": number,
    "page": number,
    "limit": number,
    "pages": number
  }
}
```

---

## Authentication

### Login
**POST** `/auth/login`

Request body:
```json
{
  "email": "admin@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "email": "admin@example.com",
      "name": "Admin Name",
      "role": "admin"
    }
  }
}
```

**Token lifetimes:**
- Access token: 300 seconds (5 minutes)
- Refresh token: 7 days

### Refresh Token
**POST** `/auth/refresh`

Request body:
```json
{
  "refreshToken": "eyJhbGc..."
}
```

Returns new `accessToken` and `refreshToken` (rotation).

### Logout
**POST** `/auth/logout`

Request body:
```json
{
  "refreshToken": "eyJhbGc..."
}
```

Invalidates the refresh token server-side.

### Current User
**GET** `/auth/me`

Returns the authenticated user's profile.

**Authorization:** Requires valid `Authorization: Bearer <accessToken>` header.

---

## Endpoints

All admin endpoints require `Authorization: Bearer <accessToken>` header and admin role.

### Dashboard

#### Dashboard Metrics
**GET** `/admin/dashboard`

Returns high-level metrics: total sales, order count, top products, recent activity.

Response:
```json
{
  "success": true,
  "data": {
    "totalSales": 150000,
    "orderCount": 45,
    "activeProducts": 120,
    "activeUsers": 200,
    "recentOrders": [...],
    "topProducts": [...]
  }
}
```

#### Sales Report
**GET** `/admin/dashboard/sales`

Query parameters:
- `startDate`: ISO 8601 date (required)
- `endDate`: ISO 8601 date (required)

Returns aggregated sales data by day/week.

#### Top Products
**GET** `/admin/dashboard/top-products`

Query parameters:
- `limit`: 1-50 (default: 10)

Returns bestselling products.

---

### Products

#### List Products
**GET** `/admin/products`

Query parameters:
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `search`: string (optional, searches name/SKU)
- `category`: uuid (optional)
- `active`: boolean (optional, include inactive)

Returns paginated list of products (including inactive).

#### Get Product Detail
**GET** `/admin/products/:id`

Path parameters:
- `id`: product UUID

#### Create Product
**POST** `/admin/products`

Request body:
```json
{
  "name": "Product Name",
  "slug": "product-name",
  "description": "Product description...",
  "price": 1500,
  "compareAtPrice": 2000,
  "sku": "SKU123",
  "stock": 50,
  "categoryId": "uuid",
  "images": ["url1", "url2"],
  "isActive": true
}
```

#### Update Product
**PATCH** `/admin/products/:id`

Accepts partial fields. All fields optional.

#### Delete Product
**DELETE** `/admin/products/:id`

#### Adjust Stock
**PATCH** `/admin/products/:id/stock`

Request body:
```json
{
  "adjustment": 10
}
```

Positive or negative adjustment. Server validates sufficient stock before decrementing.

---

### Categories

#### List Categories
**GET** `/admin/categories`

Returns all categories with product counts.

Response includes:
```json
{
  "id": "uuid",
  "name": "Electronics",
  "slug": "electronics",
  "description": "...",
  "parentId": null,
  "isActive": true,
  "productCount": 25,
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-01-01T00:00:00Z"
}
```

#### Get Category Detail
**GET** `/admin/categories/:id`

#### Create Category
**POST** `/admin/categories`

Request body:
```json
{
  "name": "Electronics",
  "slug": "electronics",
  "description": "Electronic devices",
  "parentId": null,
  "isActive": true
}
```

#### Update Category
**PATCH** `/admin/categories/:id`

#### Delete Category
**DELETE** `/admin/categories/:id`

---

### Orders

#### List Orders
**GET** `/admin/orders`

Query parameters:
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `status`: enum (pending | paid | processing | shipped | delivered | cancelled | refunded)
- `startDate`: ISO 8601 (optional)
- `endDate`: ISO 8601 (optional)
- `search`: customer name/email/order number (optional)

Returns paginated order list.

#### Get Order Detail
**GET** `/admin/orders/:id`

Returns full order with items, payment, and shipment details.

Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD-2026-001",
    "userId": "uuid",
    "status": "processing",
    "subtotal": 3000,
    "discount": 500,
    "shippingCost": 200,
    "total": 2700,
    "couponId": "uuid | null",
    "couponCode": "SAVE10 | null",
    "couponDiscount": 500,
    "shippingAddressSnapshot": {...},
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+1234567890",
    "notes": "Gift wrap requested",
    "adminNotes": "Contact customer about shipping",
    "items": [
      {
        "id": "uuid",
        "productName": "Product A",
        "quantity": 2,
        "unitPrice": 1500,
        "subtotal": 3000
      }
    ],
    "payment": {...},
    "shipment": {...} | null,
    "createdAt": "2026-01-01T10:30:00Z",
    "updatedAt": "2026-01-01T12:00:00Z"
  }
}
```

#### Get Payment Details
**GET** `/admin/orders/:id/payment`

Returns detailed payment info including MercadoPago transaction ID and status.

Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderId": "uuid",
    "mercadopagoId": "12345678",
    "status": "approved",
    "amount": 2700,
    "paymentMethod": "credit_card",
    "createdAt": "2026-01-01T10:30:00Z"
  }
}
```

#### Update Order Status
**PATCH** `/admin/orders/:id/status`

Request body:
```json
{
  "status": "shipped"
}
```

Allowed status transitions (state machine):
- `pending` → `paid | cancelled`
- `paid` → `processing | cancelled`
- `processing` → `shipped | cancelled`
- `shipped` → `delivered | cancelled`
- `delivered` → (terminal, no transitions)
- `cancelled` → (terminal, no transitions)
- `refunded` → (terminal, no transitions)

#### Add/Update Admin Notes
**PATCH** `/admin/orders/:id/notes`

Request body:
```json
{
  "adminNotes": "Customer requested rush delivery"
}
```

#### Create Shipment
**POST** `/admin/orders/:id/shipment`

Request body:
```json
{
  "carrier": "shalom",
  "trackingNumber": "TRACK123456"
}
```

Allowed carriers: `shalom`, `serpost`, `olva`, `dhl`

#### Update Shipment
**PATCH** `/admin/orders/:id/shipment`

Request body:
```json
{
  "status": "in_transit"
}
```

Shipment statuses: `pending | in_transit | delivered | failed`

---

### Users

#### List Users
**GET** `/admin/users`

Query parameters:
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `search`: name/email (optional)
- `role`: enum (customer | admin) (optional)

Returns paginated user list.

#### Get User Detail
**GET** `/admin/users/:id`

#### Update User
**PATCH** `/admin/users/:id`

Request body:
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "phone": "+1234567890",
  "role": "customer"
}
```

Email and role changes may require additional validation.

#### Suspend User
**POST** `/admin/users/:id/suspend`

Request body (optional):
```json
{
  "reason": "Suspicious activity"
}
```

Sets `isActive` to `false`.

#### Activate User
**POST** `/admin/users/:id/activate`

Sets `isActive` to `true`.

---

### Banners

#### List Banners
**GET** `/admin/banners`

Returns all banners ordered by position.

#### Create Banner
**POST** `/admin/banners`

Request body:
```json
{
  "title": "Summer Sale",
  "imageUrl": "https://cloudinary.../image.jpg",
  "linkUrl": "/products/sale",
  "isActive": true,
  "position": 1
}
```

#### Update Banner
**PATCH** `/admin/banners/:id`

#### Delete Banner
**DELETE** `/admin/banners/:id`

---

### Coupons

#### List Coupons
**GET** `/admin/coupons`

Query parameters:
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `active`: boolean (optional)

Returns paginated coupon list.

#### Create Coupon
**POST** `/admin/coupons`

Request body:
```json
{
  "code": "SAVE10",
  "type": "percentage",
  "value": 10,
  "maxUses": 100,
  "minOrderAmount": 5000,
  "startDate": "2026-01-01T00:00:00Z",
  "endDate": "2026-12-31T23:59:59Z",
  "isActive": true
}
```

Coupon types:
- `percentage`: value is 0-100
- `fixed`: value is in cents

#### Update Coupon
**PATCH** `/admin/coupons/:id`

#### Delete Coupon
**DELETE** `/admin/coupons/:id`

---

### Reviews

#### List Pending Reviews
**GET** `/admin/reviews`

Query parameters:
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `approved`: boolean (default: false, shows pending only)

Returns reviews awaiting approval.

#### Approve Review
**POST** `/admin/reviews/:id/approve`

Sets `isApproved` to `true`.

#### Delete Review
**DELETE** `/admin/reviews/:id`

Removes review permanently.

---

### Search

#### Reindex Elasticsearch
**POST** `/admin/search/reindex`

Triggers full reindex of Elasticsearch for products and orders. Long-running operation (may take minutes).

Response:
```json
{
  "success": true,
  "message": "Reindexing started"
}
```

---

## Data Models (TypeScript Interfaces)

These interfaces represent the database entities and API response shapes. Use these in `src/types/` to maintain type safety.

### User
```typescript
interface User {
  id: string; // UUID
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "admin";
  isActive: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Product
```typescript
interface Product {
  id: string; // UUID
  name: string;
  slug: string; // Unique
  description: string;
  price: number; // Cents (e.g., 1500 = $15.00)
  compareAtPrice?: number; // Cents, optional
  sku?: string;
  stock: number;
  images: string[]; // Cloudinary URLs
  categoryId: string; // UUID
  isActive: boolean;
  averageRating?: number; // 0-5
  totalReviews: number;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Category
```typescript
interface Category {
  id: string; // UUID
  name: string;
  slug: string; // Unique
  description?: string;
  parentId?: string; // UUID, optional (for subcategories)
  isActive: boolean;
  productCount?: number; // Returned in list endpoint
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Order
```typescript
interface Order {
  id: string; // UUID
  orderNumber: string; // Unique, e.g., "ORD-2026-001"
  userId: string; // UUID
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  subtotal: number; // Cents
  discount: number; // Cents
  shippingCost: number; // Cents
  total: number; // Cents
  couponId?: string; // UUID, optional
  couponCode?: string;
  couponDiscount?: number; // Cents
  shippingAddressSnapshot: Record<string, any>; // Full address object (JSON)
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  notes?: string; // Customer notes at checkout
  adminNotes?: string; // Internal notes from admin
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### OrderItem
```typescript
interface OrderItem {
  id: string; // UUID
  orderId: string; // UUID
  productName: string; // Snapshot of product name
  quantity: number;
  unitPrice: number; // Cents
  subtotal: number; // Cents (quantity * unitPrice)
}
```

### Payment
```typescript
interface Payment {
  id: string; // UUID
  orderId: string; // UUID
  mercadopagoId?: string; // MercadoPago transaction ID
  status: "pending" | "approved" | "failed" | "refunded";
  amount: number; // Cents
  paymentMethod: string; // "credit_card", "debit_card", "bank_transfer", etc.
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Shipment
```typescript
interface Shipment {
  id: string; // UUID
  orderId: string; // UUID
  carrier: "shalom" | "serpost" | "olva" | "dhl";
  trackingNumber: string;
  status: "pending" | "in_transit" | "delivered" | "failed";
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Coupon
```typescript
interface Coupon {
  id: string; // UUID
  code: string; // Unique, uppercase
  type: "percentage" | "fixed";
  value: number; // Percentage (0-100) or cents for fixed
  maxUses?: number;
  currentUses: number;
  minOrderAmount?: number; // Cents, optional minimum
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  isActive: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Review
```typescript
interface Review {
  id: string; // UUID
  productId: string; // UUID
  userId: string; // UUID
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  isApproved: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Banner
```typescript
interface Banner {
  id: string; // UUID
  title: string;
  imageUrl: string; // Cloudinary URL
  linkUrl?: string; // Optional internal or external link
  isActive: boolean;
  position: number; // Display order
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

---

## Error Handling

All error responses follow the envelope format with `success: false`:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes

| Status | Scenario |
|--------|----------|
| 200    | Successful request |
| 201    | Resource created |
| 204    | No content (successful delete) |
| 400    | Bad request (validation error) |
| 401    | Unauthorized (missing/invalid token) |
| 403    | Forbidden (insufficient permissions) |
| 404    | Not found |
| 409    | Conflict (e.g., duplicate slug/code) |
| 422    | Unprocessable entity (business logic error) |
| 429    | Too many requests (rate limit exceeded) |
| 500    | Server error |

### Validation Errors

400 response with detailed field errors:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "price": "Price must be positive"
  }
}
```

### Authentication Errors

401 response:
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

When access token expires, client must call `/auth/refresh` with the refresh token.

### Rate Limiting

429 response:
```json
{
  "success": false,
  "message": "Too many requests"
}
```

Include retry-after header.

---

## Rate Limiting

| Endpoint Category | Limit |
|-------------------|-------|
| Global            | 1500 req/60s |
| Auth              | 3-10 req/min |
| Orders            | 5 req/hour |

Responses include rate-limit headers:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

---

## Environment Configuration

Set these environment variables in `.env.local`:

```bash
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

This URL is used by all HTTP client calls via TanStack Query. Ensure the backend is running before starting the dev server.

---

## Notes

### Dates and Times
- All timestamps are ISO 8601 format (e.g., `2026-01-01T12:30:45Z`)
- Frontend should parse with native `Date` constructor or date library (e.g., date-fns)
- Queries accept ISO 8601 for date filtering

### Images
- All image URLs are hosted on Cloudinary
- Frontend receives read-only URLs; image upload/management is not yet in scope

### Payments
- Payments are processed via MercadoPago integration (backend handles webhook)
- Frontend displays payment status and transaction details only

### Future Integrations
- Google OAuth (in development)
- Additional shipping carriers (TBD)
- Advanced reporting and analytics (phase 2+)

### Backend Status
- Endpoints listed here are confirmed implemented
- Some endpoints (Google Auth) are in development and not yet available
- Check with backend team for breaking changes or new endpoints

---

## References

- Backend repo: (link to be provided)
- NestJS docs: https://docs.nestjs.com
- TypeORM docs: https://typeorm.io
- PostgreSQL docs: https://www.postgresql.org/docs/
