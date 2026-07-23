# Cultural Clutch: Project Architecture

This document details the unified backend, multi-portal system architecture designed for Cultural Clutch—India's Premium Cultural Marketplace.

---

## 1. System Vision & Paradigm
Cultural Clutch is engineered as a **Unified Modular Monolith** matching the operational standard of platforms like Shopify Admin and Flipkart Seller Hub. It uses Next.js 16 (App Router) to serve three distinct portals from a single unified server instance and codebase, sharing a database layer (SQLite for development/read-heavy Vercel caches, Postgres for production).

```mermaid
graph TD
    subgraph Client Viewports
        C_User[Customer Mobile/Desktop]
        V_User[Vendor Mobile/Desktop]
        A_User[Admin/Owner Terminal]
    end

    subgraph Next.js Monolithic Server
        direction TB
        subgraph Middleware
            Edge_Guard[proxy.ts Edge Guard / NextAuth JWT Checks]
        end

        subgraph Portals Route Divisions
            Cust_Portal[app/* - Customer Experience]
            Vend_Portal[app/vendor/* - Business Console]
            Admin_Portal[app/admin/* - System Controller]
        end

        subgraph Unified Backend APIs
            API_Auth[/api/auth/*]
            API_Admin[/api/admin/*]
            API_Vendor[/api/vendor/*]
            API_Public[/api/products, /api/categories]
        end
    end

    subgraph Shared Persistence Layer
        DB[(Prisma ORM / SQLite / Postgres)]
        JSON_CMS[public/data/settings.json]
    end

    C_User -->|Public HTTP| Cust_Portal
    C_User -->|Public HTTP| API_Public
    
    V_User -->|HTTP Requests| Edge_Guard
    A_User -->|HTTP Requests| Edge_Guard

    Edge_Guard -->|Pass| Vend_Portal
    Edge_Guard -->|Pass| Admin_Portal
    Edge_Guard -->|Pass| API_Admin
    Edge_Guard -->|Pass| API_Vendor

    Cust_Portal --> DB
    Vend_Portal --> DB
    Admin_Portal --> DB
    Admin_Portal --> JSON_CMS
    
    API_Auth --> DB
    API_Admin --> DB
    API_Vendor --> DB
    API_Public --> DB
```

---

## 2. Directory Divisions

The project directory structure is organized as follows:

### Portals Routing (`app/` Directory)
1. **Customer Portal (`app/`)**: Handles public client-facing ecommerce views including homepage, categories lists, product detail pages, checkout flow, search exploration, and user profiles.
2. **Vendor Portal (`app/vendor/`)**: Encapsulates vendor catalog onboarding, inventory counts trackers, and sales order fulfillment dashboards.
3. **Admin / Owner Portal (`app/admin/`)**: Consolidates enterprise role managers, flat-file settings CMS, finance ledger trackers, and audit trail monitors.

### Shared Modules (`shared/` Directory equivalents)
- **Reusable UI Components (`components/`)**: Houses maps, quick views, and design buttons.
- **Client hooks (`hooks/`)**: Centralizes theme preference managers and language controllers.
- **Backend Utilities (`lib/`)**: Hosts global Prisma ORM database pools (`lib/db.ts`) and next-auth credentials parameters (`lib/auth.ts`).

---

## 3. Data Flow and Component Architecture

### Page Load & SSR
1. Customer requests a product path (e.g., `/products/banarasi-silk-saree`).
2. Next.js retrieves the product data and cultural story details from the Prisma client.
3. The page compiles on the server and loads instantly.

### Dashboard Mount Sync
1. Admin opens `/admin/dashboard`.
2. The page fires parallel fetch requests to `/api/admin/settings` and `/api/admin/dashboard`.
3. If NextAuth session checks succeed, the middleware permits the database read. 
4. The dashboard states update dynamically.

### State Modification (Writes)
1. Owner adjusts system configurations in the Settings Console.
2. The dashboard updates local states and fires a POST request to `/api/admin/settings`.
3. The backend updates `public/data/settings.json`.
4. The site header and policy page templates render with updated strings on the next refresh.
