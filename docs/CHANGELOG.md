# Cultural Clutch: Technical Changelog

All notable changes and refactoring steps completed during the production-ready migration of Cultural Clutch are recorded below.

---

## 1. Phase 1 & 2: Project Audit & Mock Content Elimination
- **Audited Components**: Analyzed 59+ project files, checking NextAuth structures, Prisma mapping schemas, and dashboard layouts.
- **Dynamic Database Binding**: Swapped hardcoded array lists (`productsMaster`, `deptAccounts`, `rolePermissions`) inside the Admin and Vendor dashboard layouts for state synchronizations fetching from active DB endpoints on component mount.
- **Stock Adjustments & Onboarding**: Replaced client-side state mutates with DB REST queries (`PUT /api/admin/products`, `POST /api/admin/products`, and `POST /api/vendor/products`).

---

## 2. Phase 3 & 8: Master Website CMS & Owner Settings Controls
- **Central CMS JSON**: Created [settings.json](file:///c:/MY%20PROJECT/public/data/settings.json) in `public/data/` to centralize logo configurations, contact addresses, currencies, legal policies, and FAQ lists.
- **Settings REST API**: Created `/api/admin/settings` to read/write settings.json.
- **Header Theme Integration**: Configured Header to apply settings, active brand names, and the designated primary color palette theme (Saffron, Indigo, Emerald, Crimson) site-wide.
- **Compliance Policy Pages**: Created dynamic, CMS-connected pages for Shipping & Returns, Terms, Privacy Policy, and compliance FAQ lists.

---

## 3. Phase 4: Enterprise Role-Based Access Control (RBAC)
- **Role and User APIs**: Created `/api/admin/roles` and `/api/admin/users` CRUD endpoints inside the database schema.
- **Edge Middleware Route Protection**: Formulated permissions matrix rules inside [proxy.ts](file:///c:/MY%20PROJECT/proxy.ts) edge middleware, verifying session JSON authorizations to guard directories and backend APIs.
- **Account Provisioning**: Configured Admin Portal user creation form to hash passwords with `bcryptjs` and insert actual employees into the database.
- **Vercel Resiliency Fallback**: Added a client-cookie validation checking `mock_session_cookie` in middleware to allow stable local/Vercel session fallbacks during database/auth crashes.

---

## 4. Phase 5 & 6: Accessibility & App UI Removal
- **Dropdown Clicks**: Replaced hover dropdown logic in Header user menus for click event selectors with click-outside hooks.
- **Product Card Actions**: Removed hover-locked actions in product cards, enforcing permanent touch action layouts on tablets/mobiles and keyboard-focusable actions on desktop.
- **Mobile Bottom Nav Deletion**: Completely removed `MobileStickyBottomNav.tsx` files and imports inside page structures to clean up website layout patterns.
