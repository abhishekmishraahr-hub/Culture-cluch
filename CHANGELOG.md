# Changelog: AURAIC Production Upgrades

All notable changes to the AURAIC project are documented here.

---

## [1.2.0] - 2026-07-22

### Added
- **Mobile Menu Stacking Decoupling**: Closed the `<header>` element early and rendered the mobile drawer sliding panel, settings popup, and toast indicators as sibling nodes to solve height clipping caused by backdrop-blur context restrictions.
- **Client-Side Hydration Guard**: Added a `mounted` state toggle inside `Header.tsx` to safely evaluate `userRole` after mount, preventing Next.js compilation/client DOM mismatches.
- **Top Priority Dashboard Mapping**: Promoted `admin-dashboard` and `vendor-dashboard` links to the top of the global `NAVIGATION_ITEMS` configuration.
- **Unified Key Translation Mappings**: Mapped kebab-case configuration keys dynamically inside `t()` for multi-lingual routing.

## [1.1.0] - 2026-07-21

### Added
- **Shared Navigation Config**: Created `navigation/navigationConfig.ts` to hold a single source of truth for all public and administrative route lists.
- **Dynamic Welcome & Redirect Card**: Added a prominent gradient dashboard redirect welcome card inside `app/profile/page.tsx` for `Admin` and `Owner` user roles.
- **Virtual Page Redirect Routes**: Created routing files for missing endpoints under `app/admin/` (`/admin`, `products`, `orders`, `vendors`, `users`, `reports`, `settings`, `districts`) to redirect client agents to their respective ERP dashboard modules.
- **Focus Trap Drawer Accessibility**: Implemented keyboard traps in `Header.tsx` to trap tabs inside the mobile menu drawer.

### Changed
- **Header Component Menu Mapping**: Refactored `components/Header.tsx` to dynamically query and map header menus from the shared configuration, automatically closing the menu on navigate clicks.
- **Bottom Navigation Config**: Modified `components/MobileStickyBottomNav.tsx` to filter its customer-focused links directly from the shared configuration.
- **Dynamic Profile Sidebar Options**: Overhauled `app/profile/page.tsx` sidebar layout to render dynamic tab lists based on Customer, Admin, and Owner session permissions.
- **Query Parameter Dashboard Routing**: Updated `app/admin/dashboard/page.tsx` to read `?module=XXX` from search parameters on render to load the matching modular tab.
- **Logo Optimization**: Replaced the HTML `<img>` tag in `Header.tsx` with Next.js's `<Image>` wrapper for responsive sizing and loading priority.

### Removed
- **Unused Declarations & Handlers**: Deleted unused icons (`Bell`, `Wallet`), state variables (`emailUpdates`, `smsAlerts`, etc.), and click handlers from `app/profile/page.tsx` and `components/Header.tsx`, resolving ESLint warnings.
- **Duplicate Navigation Arrays**: Cleared separate route maps in menus, referencing the shared config instead.
