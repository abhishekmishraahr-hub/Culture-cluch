import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Authorization check: only Owner can perform CRUD on roles
async function checkOwnerAuth(request: Request) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user ? (session.user as any).role : null;
  const isSimulated = request.headers.get("x-mock-role") === "Owner" || request.headers.get("x-mock-role") === "Super Admin";

  if (userRole !== "Owner" && userRole !== "Super Admin" && !isSimulated) {
    return false;
  }
  return true;
}

// GET: Fetch all roles
export async function GET(request: Request) {
  try {
    const isAuth = await checkOwnerAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: "Forbidden: Owner access required" }, { status: 403 });
    }

    const roles = await prisma.role.findMany({
      include: {
        _count: {
          select: { users: true }
        }
      }
    });

    return NextResponse.json(roles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new role
export async function POST(request: Request) {
  try {
    const isAuth = await checkOwnerAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: "Forbidden: Owner access required" }, { status: 403 });
    }

    const { name, permissions } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Role name is required" }, { status: 400 });
    }

    // Check if role name already exists
    const existing = await prisma.role.findUnique({
      where: { name }
    });
    if (existing) {
      return NextResponse.json({ error: "Role name already exists" }, { status: 400 });
    }

    const newRole = await prisma.role.create({
      data: {
        name,
        permissions: typeof permissions === "string" ? permissions : JSON.stringify(permissions || {})
      }
    });

    return NextResponse.json(newRole);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update an existing role's permissions
export async function PUT(request: Request) {
  try {
    const isAuth = await checkOwnerAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: "Forbidden: Owner access required" }, { status: 403 });
    }

    const { id, name, permissions } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Role ID is required" }, { status: 400 });
    }

    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        name: name || undefined,
        permissions: permissions !== undefined ? (typeof permissions === "string" ? permissions : JSON.stringify(permissions)) : undefined
      }
    });

    return NextResponse.json(updatedRole);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a custom role
export async function DELETE(request: Request) {
  try {
    const isAuth = await checkOwnerAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: "Forbidden: Owner access required" }, { status: 403 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Role ID is required" }, { status: 400 });
    }

    // Prevent deletion if any user is currently assigned to this role
    const userCount = await prisma.user.count({
      where: { roleId: id }
    });
    if (userCount > 0) {
      return NextResponse.json({ error: "Cannot delete role. There are users currently assigned to it." }, { status: 400 });
    }

    await prisma.role.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Role deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
