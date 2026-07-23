# Cultural Clutch: Content Management System (CMS) Documentation

This document explains the flat-file and database-backed Content Management System (CMS) that allows administrators to update the Cultural Clutch platform without modifying code.

---

## 1. CMS Core File System

Global website variables (theme accents, metadata settings, policies copy) are managed centrally in:
📁 `public/data/settings.json`

This file is tracked as a dynamic, editable database. The server loads it at startup and exposes it to the header, footer, and compliance page templates.

### Structure Payload Example
```json
{
  "site_name": "Cultural Clutch",
  "logo_url": "/logo.jpg",
  "theme_palette": "saffron",
  "contact_email": "support@culturalclutch.com",
  "currency": "INR",
  "gstin": "09AAAAA0000A1Z1",
  "faq_items": [
    {
      "q": "What is ODOP?",
      "a": "One District One Product is a Government of India initiative to promote local heritage crafts."
    }
  ],
  "policies": {
    "privacy": "This site collects minimal cookie sessions details for login stability...",
    "terms": "By accessing this marketplace, you agree to our local artisan seller policies..."
  }
}
```

---

## 2. Admin Console Editors

Admins can modify these values directly using the **Website Settings Console** in the Admin Portal (`/admin/dashboard?module=settings`).

### Operations Workflow
1. **Fetch Config**: On tab select, the UI requests `/api/admin/settings` and displays configurations in a clean flat table.
2. **Modify Key**: Admin selects a key (e.g. `site_name` or `theme_palette`) and inputs a new string value.
3. **Commit Changes**: Upon submission, the UI POSTs the complete key-value dictionary to `/api/admin/settings`.
4. **Instant Update**: The settings API verifies credentials, parses the payload, updates `public/data/settings.json`, and triggers a page content reload.

---

## 3. Dynamic Page Templates

The following pages require zero code edits to modify copy text, as they pull string payloads directly from the CMS:

1. **Header Component** ([Header.tsx](file:///c:/MY%20PROJECT/components/Header.tsx)) - Resolves site title, brand logo, and active color theme dynamically.
2. **Footer Component** ([Footer.tsx](file:///c:/MY%20PROJECT/components/Footer.tsx)) - Resolves legal copyright notices, email support contact, and GST details.
3. **Privacy Policy Page** ([privacy/page.tsx](file:///c:/MY%20PROJECT/app/privacy/page.tsx)) - Renders compliance copy blocks from `policies.privacy`.
4. **Terms Page** ([terms/page.tsx](file:///c:/MY%20PROJECT/app/terms/page.tsx)) - Renders legal terms copy from `policies.terms`.
5. **Shipping Policy Page** ([shipping-returns/page.tsx](file:///c:/MY%20PROJECT/app/shipping-returns/page.tsx)) - Renders shipping details from `policies.shipping`.
6. **FAQ Page** ([faq/page.tsx](file:///c:/MY%20PROJECT/app/faq/page.tsx)) - Renders dynamic list arrays.
