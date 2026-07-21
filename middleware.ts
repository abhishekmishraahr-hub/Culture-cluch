import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only run middleware on /admin and /api/admin routes
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

  const userRole = token.role as string;
  const userPermissions = token.permissions as string;

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

  // 3. Price restriction rules (Only Owner, Super Admin, and Admin can access pricing routes/APIs)
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

  // 4. Product Manager access rules
  const isProductWriteRoute = pathname.includes("/products") && (request.method === "POST" || request.method === "PUT" || request.method === "DELETE");
  if (isProductWriteRoute) {
    const hasProductWrite = userRole === "Admin" || userRole === "Product Manager" || userPermissions.includes("PRODUCTS:WRITE");
    if (!hasProductWrite) {
      return NextResponse.json({ error: "Forbidden: Insufficient privileges" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
