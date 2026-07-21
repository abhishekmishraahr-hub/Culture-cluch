import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Authorization check: only Owner or Super Admin can assign roles!
    if (!session || (session.user as any).role !== "Owner" && (session.user as any).role !== "Super Admin") {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions to modify roles" }, { status: 403 });
    }

    const { userId, roleId } = await request.json();

    if (!userId || !roleId) {
      return NextResponse.json({ error: "userId and roleId are required" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { roleId },
      include: { role: true }
    });

    // Write to audit log (simulate winston logger or console)
    console.log(`[AUDIT LOG] User Role Changed: Executor: ${(session.user as any).email}, Target User: ${updatedUser.email}, New Role: ${updatedUser.role.name}`);

    return NextResponse.json({
      success: true,
      message: `Role for ${updatedUser.name} successfully changed to ${updatedUser.role.name}`,
      user: updatedUser
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
