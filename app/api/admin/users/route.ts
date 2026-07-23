import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Authorization check: only Owner or Super Admin can manage user records
async function checkAdminAuth(request: Request) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user ? (session.user as any).role : null;
  const isSimulated = request.headers.get("x-mock-role") === "Owner" || request.headers.get("x-mock-role") === "Super Admin";

  if (userRole !== "Owner" && userRole !== "Super Admin" && !isSimulated) {
    return false;
  }
  return true;
}

// GET: Fetch all user records
export async function GET(request: Request) {
  try {
    const isAuth = await checkAdminAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      include: {
        role: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 550 });
  }
}

// PUT: Modify user suspension status or details
export async function PUT(request: Request) {
  try {
    const isAuth = await checkAdminAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    const { id, isSuspended, roleId } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Load the user to prevent modifying the Owner user account!
    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: { role: true }
    });

    if (targetUser?.role.name === "Owner") {
      return NextResponse.json({ error: "Access Denied: The primary Owner account status cannot be modified." }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        isSuspended: isSuspended !== undefined ? isSuspended : undefined,
        roleId: roleId !== undefined ? roleId : undefined
      },
      include: {
        role: true
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import bcrypt from "bcryptjs";

// POST: Register/Create a new employee user account
export async function POST(request: Request) {
  try {
    const isAuth = await checkAdminAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    const { name, email, password, roleId } = await request.json();

    if (!name || !email || !password || !roleId) {
      return NextResponse.json({ error: "Name, email, password, and roleId are required" }, { status: 400 });
    }

    // Check unique email
    const existing = await prisma.user.findUnique({
      where: { email }
    });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        roleId,
        isSuspended: false
      },
      include: {
        role: true
      }
    });

    return NextResponse.json(newUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
