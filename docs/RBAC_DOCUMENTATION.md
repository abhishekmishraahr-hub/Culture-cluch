# Cultural Clutch: Role-Based Access Control (RBAC) Documentation

This document explains the enterprise-grade Role-Based Access Control (RBAC) matrix that protects resources in Cultural Clutch.

---

## 1. System Roles Directory

1. **Owner / Super Admin**: Has absolute bypass authority. Can modify permissions, settings, and read/write all datasets.
2. **Admin**: General manager. Access to all dashboards except role overrides and security settings.
3. **Vendor Manager**: Assigned to oversee vendor verification, payouts, and commissions.
4. **Product Manager**: Can read/write the product catalog, adjust pricing tables, and review artisan listings.
5. **Category Manager**: Restricts operations to categories and subcategories configurations.
6. **Order Manager**: Full access to the shipping queues, delivery partner selection, and order tracking APIs.
7. **Finance Manager**: Oversees invoice logs, ledger balance reports, GST filing models, and payouts releases.
8. **Customer / Guest**: Restrained strictly to public routing (`/`, `/products`, `/checkout`, `/orders`). Protected directories (`/admin/*`, `/vendor/*`) are blocked.

---

## 2. Permissions Authorization Matrix

Permissions are structured as a JSON configuration matrix serialized inside the SQLite/Postgres `Role` table:

```json
{
  "pages": ["/admin/dashboard", "/admin/settings"],
  "apis": ["/api/admin/products", "/api/admin/orders"],
  "actions": ["Read", "Create", "Update"]
}
```

### Action Capabilities Mapping

| Role | View / Read | Create / Onboard | Edit / Update | Delete / Invalidate | Approve / Release |
|---|:---:|:---:|:---:|:---:|:---:|
| **Owner / Super Admin** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Finance Manager** | ✅ | ❌ | ✅ | ❌ | ✅ (Payments only) |
| **Product Manager** | ✅ | ✅ | ✅ | ❌ | ✅ (Artisan products only) |
| **Customer Support** | ✅ | ❌ | ✅ (Tickets only) | ❌ | ❌ |

---

## 3. Enforcement Layers

Authorization constraints are verified at two distinct layers:

### Layer A: Edge Middleware Redirects (`proxy.ts`)
Before a client requests a page or API from Next.js, the middleware interceptor retrieves their JWT:
- Checks if the user's role is authenticated.
- Compares the request URL pathname against the `allowedPages` and `allowedApis` array patterns in their permissions JSON payload.
- Denies block headers and redirects unauthorized requests to `/unauthorized`.

### Layer B: REST API Handler Validations
Inside endpoint routing scripts (e.g., `/api/admin/users/route.ts`), check logic blocks Customer role modifications:
```typescript
const isAuth = await checkAdminAuth(request);
if (!isAuth) {
  return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
}
```
This double-layered setup ensures that API bypass actions are prevented.
