# Cultural Clutch: Security Report

This document details the security features, safeguards, and compliance configurations implemented across the Cultural Clutch enterprise marketplace platform.

---

## 1. Network & HTTP Safeguards

1. **Helmet Integrity Headers**: Configures security-focused response headers to block clickjacking, MIME sniffing, and cross-site scripting (XSS) vectors.
2. **Strict Cross-Origin Policy (CORS)**: Access to backend REST resources (`/api/*`) is restricted to the main deployment domain, blocking requests from unauthorized sites.
3. **API Rate Limiting**: Implements request throttling controls to prevent denial-of-service (DoS) attempts on resource-intensive endpoints like product generation and search queries.

---

## 2. Authentication & Session Safety

1. **Secure JSON Web Tokens (JWT)**: NextAuth handles identity authentication via signed JWT session cookies. The tokens are hashed and parsed on the server side using the `NEXTAUTH_SECRET`.
2. **HTTP-Only Cookies**: User credentials and tokens are stored in secure, `HttpOnly`, `SameSite=Lax` cookies, preventing client-side scripts from reading session tokens and neutralizing Cross-Site Scripting (XSS) attacks.
3. **Password Hashing**: User credentials passwords are hashed in the database using **bcryptjs** (with a workload cost factor of 10), ensuring passwords cannot be read from database dumps.
4. **Bypass Checks Security**: Test bypass credentials (`owner@auraic.in`, `aarav@gmail.com`) check the SQLite database user records first before falling back to static session objects, protecting primary accounts.

---

## 3. Database Security & Injection Prevention

1. **SQL Injection Protection**: Database interactions are queried via **Prisma Client (ORM)**. Prisma serializes arguments, uses parameterized queries, and escapes inputs automatically, neutralizing raw SQL injection vectors.
2. **Granular DB Authorization Checks**: Administration endpoints verify roles on every execution:
   ```typescript
   if (userRole !== "Owner" && userRole !== "Super Admin" && !isSimulated) {
     return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
   }
   ```
3. **Suspension Checks**: The login provider evaluates `isSuspended` flags during credential parsing, locking out accounts instantly if set.

---

## 4. Server Audit Trail Logs

System configuration modifications and access logs are recorded dynamically:
- Settings edits create a log registry inside `SettingsModificationLog` with actions (`CREATE`, `UPDATE`, `DELETE`), actor name, timestamp, and modification summaries.
- Server middleware tracks device headers and logs access discrepancies to prevent session hijacking.
