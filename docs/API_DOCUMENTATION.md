# Cultural Clutch: API Documentation

This document outlines the REST API endpoints exposed by the Cultural Clutch backend for portals integration.

---

## 1. Authentication Gateways

### POST `/api/auth/signin`
Authenticate a client and establish secure cookie sessions.
- **Payload**:
  ```json
  {
    "email": "owner@auraic.in",
    "password": "AuraicOwner2026"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "user": {
      "name": "Super Admin",
      "email": "owner@auraic.in",
      "role": "Owner"
    }
  }
  ```

### POST `/api/auth/signout`
Invalidate credentials cookies and clear active session logs.
- **Response (200 OK)**:
  ```json
  {
    "success": true
  }
  ```

---

## 2. Admin & Settings API

### GET `/api/admin/settings`
Fetch global settings configurations (theme colors, logo paths, and policy variables).
- **Response (200 OK)**:
  ```json
  {
    "site_name": "Cultural Clutch",
    "logo_url": "/logo.jpg",
    "theme_palette": "saffron",
    "gstin": "09AAAAA0000A1Z1"
  }
  ```

### POST `/api/admin/settings`
Update site configurations dynamically.
- **Headers**: Requires admin authorization token or edge cookie bypass.
- **Payload**:
  ```json
  {
    "site_name": "Cultural Clutch Luxury",
    "theme_palette": "emerald"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "updatedKeys": ["site_name", "theme_palette"]
  }
  ```

---

## 3. Product Catalog API

### GET `/api/admin/products`
Retrieve a complete list of catalog items from the database.
- **Response (200 OK)**:
  ```json
  [
    {
      "id": "prod-102",
      "name": "Jaipur Blue Pottery Pots",
      "price": 2500,
      "stock": 15,
      "isActive": true
    }
  ]
  ```

### POST `/api/admin/products`
Onboard a new craft product to the registry.
- **Payload**:
  ```json
  {
    "name": "Madhubani Frame",
    "sku": "CC-BIH-MAD-9018",
    "slug": "madhubani-art-frame",
    "price": 4500,
    "stock": 25
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "id": "prod-204",
    "name": "Madhubani Frame",
    "sku": "CC-BIH-MAD-9018"
  }
  ```

### PUT `/api/admin/products`
Update product pricing, status, or stock counts.
- **Payload**:
  ```json
  {
    "id": "prod-102",
    "stock": 20
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "id": "prod-102",
    "stock": 20
  }
  ```

---

## 4. User Directory API

### GET `/api/admin/users`
Fetch registered user accounts.
- **Response (200 OK)**:
  ```json
  [
    {
      "id": "user-801",
      "name": "Aarav Sharma",
      "email": "aarav@gmail.com",
      "isSuspended": false,
      "role": { "name": "Customer" }
    }
  ]
  ```

### POST `/api/admin/users`
Register a new corporate employee in the database.
- **Payload**:
  ```json
  {
    "name": "Sneha Sen",
    "email": "sneha@auraic.in",
    "password": "SecurePassword123",
    "roleId": "role-finance-manager"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "id": "user-902",
    "name": "Sneha Sen",
    "email": "sneha@auraic.in"
  }
  ```
