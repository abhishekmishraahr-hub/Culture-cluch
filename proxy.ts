import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only run proxy logic on /admin and /api/admin routes
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApiRoute = pathname.startsWith("/api/admin");

  if (!isAdminRoute && !isAdminApiRoute) {
    return NextResponse.next();
  }

  // Allow anonymous GET requests to public config endpoints (footer/homepage)
  const isPublicConfigGet =
    (pathname === "/api/admin/footer" || pathname === "/api/admin/homepage") &&
    request.method === "GET";

  if (isPublicConfigGet) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If no token exists, redirect to login or return 401
  if (!token) {
    if (isAdminApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = token.role as string | undefined;
  const rawPermissions = token.permissions as string | undefined;

  // 1. Owner / Super Admin has absolute bypass access
  if (userRole === "Owner" || userRole === "Super Admin") {
    return NextResponse.next();
  }

  // 2. Reject simple Customer role from all admin resources
  if (userRole === "Customer") {
    if (isAdminApiRoute) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // 3. Dynamic JSON Permissions Enforcement
  if (rawPermissions && rawPermissions.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(rawPermissions);
      
      // Enforce API Route Access
      if (isAdminApiRoute) {
        const allowedApis = Array.isArray(parsed.apis) ? parsed.apis : [];
        const isAllowed = allowedApis.some((api: string) => pathname.startsWith(api) || api === "*");
        if (!isAllowed) {
          return NextResponse.json({ error: "Forbidden: Access to this API route is restricted by your role" }, { status: 403 });
        }
      }

      // Enforce Page Route Access
      if (isAdminRoute) {
        const allowedPages = Array.isArray(parsed.pages) ? parsed.pages : [];
        const isAllowed = allowedPages.some((page: string) => pathname.startsWith(page) || page === "*");
        if (!isAllowed) {
          return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
      }
      
      return NextResponse.next();
    } catch (e) {
      // JSON parse error - fall back to legacy checks
    }
  }

  const userPermissions = typeof rawPermissions === "string"
    ? rawPermissions.split(",").map(p => p.trim())
    : (Array.isArray(token.permissions) ? token.permissions : []);

  // 4. Price restriction rules (Only Owner, Super Admin, and Admin can access pricing routes/APIs)
  const isPricingRoute = pathname.includes("/price") || pathname.includes("/pricing");
  if (isPricingRoute) {
    const hasPricePermission = userRole === "Admin" || userPermissions.includes("PRICES:WRITE");
    if (!hasPricePermission) {
      if (isAdminApiRoute) {
        return NextResponse.json(
          { error: "Forbidden: Only Admin/Owner can alter pricing configuration" },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // 5. Product Manager access rules
  const isProductWriteRoute = pathname.includes("/products") && (request.method === "POST" || request.method === "PUT" || request.method === "DELETE");
  if (isProductWriteRoute) {
    const hasProductWrite = userRole === "Admin" || userRole === "Product Manager" || userPermissions.includes("PRODUCTS:WRITE");
    if (!hasProductWrite) {
      return NextResponse.json({ error: "Forbidden: Insufficient privileges" }, { status: 403 });
    }
  }

  return NextResponse.next();
}
