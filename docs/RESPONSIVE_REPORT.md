# Cultural Clutch: Responsive Design Report

This document reports viewport scaling layouts, navigation adapters, and cross-device interactions designed for the Cultural Clutch marketplace platform.

---

## 1. Viewport Adaptation System (Breakpoints)

The UI leverages Tailwind CSS breakpoints to adapt fluidly across all devices:

- **Mobile viewports (`xs` / `< 640px`)**: Single-column product listings, simplified top header nav drawer, full-screen login layout, and persistent quick-action cart icons.
- **Tablets (`sm` to `md` / `640px - 1023px`)**: Double-column grids, horizontal layout profile tabs, scrollable product carousels.
- **Desktops (`lg` to `xl` / `1024px - 1280px+`)**: Multi-column grids (4+ columns), side-by-side dashboards, absolute visual overlays, and detailed analytics layout panels.

---

## 2. Accessibility-First Viewport Interactions

To support both touchscreens, keyboard navigation, and mouse clicks:

1. **No Hover-Only Menus**: All dropdown controls (Header User Profile, Categories Selector, Language Toggles) are triggered using explicit React state-driven **click-tap listeners** instead of CSS `:hover` states.
2. **Touchscreen Accessibility**: Focus-within styles are used to show overlays on hoverless mobile and tablet screens.
3. **Keyboard Tab Navigation**: Links and buttons use sequential `tabIndex` focus parameters with `focus-visible` outline offsets, allowing screen readers and keyboard users to navigate panels cleanly.

---

## 3. Modular Interface Scaling

- **Unified Header**: Uses a hamburger-menu drawer layout on mobile views, while expanding to a top navbar row on tablet and desktop viewports.
- **Admin & Vendor Sidebar**: Converts to a collapsible hamburger drawer layout on smaller viewports, saving space for primary data tables.
- **Cart/Checkout Flow**: Multi-step vertical layouts stack on mobile viewports while displaying a side-by-side order summary on desktop viewports.
