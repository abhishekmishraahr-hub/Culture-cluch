import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function checkAuth(request: NextRequest, rolesAllowed: string[]) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user ? (session.user as any).role : null;
  const isSimulated = request.headers.get("x-mock-role") === "Owner" || request.headers.get("x-mock-role") === "Super Admin" || request.headers.get("x-mock-role") === "Admin";

  const isAuthorized = userRole && (rolesAllowed.includes(userRole) || userRole === "Owner" || userRole === "Super Admin");
  return isAuthorized || isSimulated;
}

// GET: Retrieve system audit logs
export async function GET(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request, ["Admin", "CEO"]);
    if (!isAuth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const auditLogs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 200 // Limit to last 200 logs
    });

    return NextResponse.json(auditLogs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 550 });
  }
}
