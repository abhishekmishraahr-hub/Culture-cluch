# Authentication Report: AURAIC

This report summarizes the security audits, role configurations, session token mappings, and route protection systems verified on the AURAIC platform.

---

## 1. NextAuth Credentials & OTP Configuration
*   **File**: `lib/auth.ts`
*   **Verification**: 
    *   **Credentials Provider**: Validates email/password credentials against database hashed passwords using bcrypt. Includes bypass configurations for mock tests (`owner@auraic.in` and `aarav@gmail.com`).
    *   **OTP Provider**: Authorizes users based on phone profiles and mock code verification keys.
    *   **Token Mapping**: JWT and session callback hooks store user IDs, names, emails, roles, and permissions, ensuring session details persist across page reloads.

---

## 2. Next.js 16 Named Proxy Route Guard
*   **File**: `proxy.ts`
*   **Verification**: Conform to Next.js 16 guidelines by replacing the old default-export middleware structure with a named `proxy` function exporting:
    ```typescript
    export async function proxy(request: NextRequest) { ... }
    ```
    This Named Proxy validates cookie tokens, decodes JWT payloads, and enforces access control checks on admin and vendor dashboards.

---

## 3. Dynamic UI Guards & Mobile Hydration Repair
*   **Verification**:
    *   **UI Controls**: Administrative options are blocked for users holding a `Customer` session role.
    *   **Hydration Clicks**: Modified `app/admin/dashboard/page.tsx` to initialize default setting states with static values. This resolves React 19 client/server hydration errors on mobile settings reload, keeping all event handlers active.
