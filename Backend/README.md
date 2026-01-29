# Backend Folder — README

## Overview

This folder contains the backend implementation for **`backend-platform`**, a multi-tenant cloud-native system for user and organization management.

The backend uses:

* **Express.js** as the HTTP server framework
* **Supabase** for authentication (JWT) and database (Postgres)
* **Modular middleware** for authentication and tenant-based access control
* **Controller-driven routes** for clean separation of concerns

All database access is **tenant-scoped** to enforce strict isolation between organizations. The system is built to **fail fast** on missing or invalid permissions, avoiding accidental cross-tenant leaks.

---

## Folder Structure

```
Backend/
│
├── server.js             # Main entry point; sets up Express app, middleware, and routes
├── package.json          # Node package configuration
├── .env                  # Secrets: SUPABASE_URL, SUPABASE_SERVICE_KEY
├── controllers/          # Business logic handlers for routes
│   └── userController.js # Example: listUsers, tenant-scoped user queries
├── middleware/           # Express middleware
│   ├── auth.js           # JWT verification
│   └── orgAccess.js      # Tenant membership verification
└── utils/                # Utilities
    ├── supabaseClient.js # Supabase client initialization
    └── tenantQuery.js    # Helper for tenant-scoped queries
```

---

## Key Concepts

### 1. Authentication (auth.js)

* Verifies **Supabase-issued JWTs** in the `Authorization` header
* Attaches verified `user` object to `req.user`
* Rejects invalid or expired tokens with `401 Unauthorized`

### 2. Tenant Access Control (orgAccess.js)

* Validates presence of `org_id` in route parameters
* Confirms the organization exists and user is a member
* Attaches `req.org = { id, role }` for controllers
* Centralizes **authorization logic** to prevent accidental cross-tenant access

### 3. Controller Layer (userController.js)

* Handles **business logic** separate from Express routes
* Example: `listUsers()` retrieves users for a tenant using `getTenantQuery()`
* Controllers **consume middleware context** (`req.user` / `req.org`)
* Returns JSON responses with proper HTTP status codes

### 4. Tenant Query Helper (tenantQuery.js)

* Ensures **all queries are filtered by `org_id`**
* Throws an error if the org context is missing or invalid
* Centralizes tenant enforcement to avoid repetition

### 5. Supabase Client (supabaseClient.js)

* Singleton client connecting to Supabase via service key
* Ensures **secure backend-only database access**

---

## Example Routes

**Home:**

```http
GET /
200 OK
"This is the home page"
```

**Protected user route:**

```http
GET /orgs/:org_id/protected
Headers: Authorization: Bearer <JWT>
Response: [
  {
    "role": "member",
    "user": { "id": "...", "email": "..." }
  }
]
```

**Notes:**

* Uses **JWT middleware → orgAccess middleware → controller**
* Tenant isolation enforced at middleware + query level

---
