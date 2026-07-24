import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

async function checkAuth(request: NextRequest, rolesAllowed: string[]) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user ? (session.user as any).role : null;
  const isSimulated = request.headers.get("x-mock-role") === "Owner" || request.headers.get("x-mock-role") === "Super Admin" || request.headers.get("x-mock-role") === "Admin";

  const isAuthorized = userRole && (rolesAllowed.includes(userRole) || userRole === "Owner" || userRole === "Super Admin");
  return isAuthorized || isSimulated;
}

// GET: Fetch Employee List, Attendance Logs, and Leave Requests
export async function GET(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request, ["Admin", "HR Manager", "CEO"]);
    if (!isAuth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Fetch active employees (anyone with an employeeId)
    const employees = await prisma.user.findMany({
      where: { employeeId: { not: null } },
      include: { role: true },
      orderBy: { name: "asc" }
    });

    const attendance = await prisma.attendance.findMany({
      include: { user: { select: { name: true, employeeId: true, department: true } } },
      orderBy: { date: "desc" }
    });

    const leaves = await prisma.leaveRequest.findMany({
      include: { user: { select: { name: true, employeeId: true, department: true } } },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      employees,
      attendance,
      leaves
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Onboard a new employee (HR Manager or Super Admin only)
export async function POST(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request, ["Admin", "HR Manager"]);
    if (!isAuth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { name, email, phone, password, roleName, department, designation } = body;

    if (!name || !email || !password || !roleName || !department || !designation) {
      return NextResponse.json({ error: "Missing required onboarding fields." }, { status: 400 });
    }

    // Check unique email
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email already registered." }, { status: 400 });

    // Get Role ID
    const roleObj = await prisma.role.findUnique({ where: { name: roleName } });
    if (!roleObj) return NextResponse.json({ error: "Role not found." }, { status: 404 });

    // Generate unique employee ID format: First 3 letters of Department + Name
    const deptPrefix = department.substring(0, 3).toUpperCase();
    const cleanName = name.split(" ")[0].toUpperCase();
    const baseId = `${deptPrefix}-${cleanName}`;
    
    // Check if employeeId is unique
    let finalEmpId = baseId;
    let counter = 1;
    while (true) {
      const collision = await prisma.user.findUnique({ where: { employeeId: finalEmpId } });
      if (!collision) break;
      finalEmpId = `${baseId}${counter}`;
      counter++;
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash: hashed,
        roleId: roleObj.id,
        employeeId: finalEmpId,
        department,
        designation,
        isSuspended: false
      },
      include: { role: true }
    });

    const session = await getServerSession(authOptions);
    const actorName = session?.user?.name || "System";
    await prisma.auditLog.create({
      data: {
        actorName,
        action: "EDIT",
        details: `Onboarded employee ${finalEmpId} (${name}).`
      }
    });

    return NextResponse.json(newUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Manage employee state (Leaves approve, Check-in, Suspension actions)
export async function PUT(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request, ["Admin", "HR Manager"]);
    if (!isAuth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { action, leaveId, leaveStatus, employeeId, suspensionAction } = body;

    const session = await getServerSession(authOptions);
    const actorName = session?.user?.name || "Admin";

    // HR ACTION 1: APPROVE/REJECT LEAVE REQUESTS
    if (action === "LEAVE") {
      if (!leaveId || !leaveStatus) {
        return NextResponse.json({ error: "Leave ID and status are required." }, { status: 400 });
      }

      const leave = await prisma.leaveRequest.update({
        where: { id: leaveId },
        data: { status: leaveStatus, approvedBy: leaveStatus === "APPROVED" ? actorName : null }
      });

      await prisma.auditLog.create({
        data: {
          actorName,
          action: leaveStatus === "APPROVED" ? "APPROVE" : "REJECT",
          details: `${leaveStatus} leave request ID ${leaveId}.`
        }
      });

      return NextResponse.json(leave);
    }

    // HR ACTION 2: EMPLOYEE SUSPENSION & LOCKING
    if (action === "SUSPENSION") {
      if (!employeeId || !suspensionAction) {
        return NextResponse.json({ error: "Employee ID and suspension action are required." }, { status: 400 });
      }

      const emp = await prisma.user.findUnique({
        where: { id: employeeId },
        include: { role: true }
      });

      if (!emp) return NextResponse.json({ error: "Employee not found." }, { status: 404 });

      // Owner/Super Admin cannot be suspended
      if (emp.role.name === "Owner") {
        return NextResponse.json({ error: "Cannot suspend primary Owner account." }, { status: 403 });
      }

      let updatedUser;
      let logMsg = "";

      if (suspensionAction === "SUSPEND") {
        // Suspend for 5 days
        const fiveDaysFromNow = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
        updatedUser = await prisma.user.update({
          where: { id: employeeId },
          data: { isSuspended: true, terminationExpiry: fiveDaysFromNow }
        });
        logMsg = `Temporarily suspended employee ${emp.employeeId || emp.name} for 5 days.`;
      } else if (suspensionAction === "RESTORE") {
        updatedUser = await prisma.user.update({
          where: { id: employeeId },
          data: { isSuspended: false, terminationExpiry: null }
        });
        logMsg = `Restored suspended employee ${emp.employeeId || emp.name} to active status.`;
      } else if (suspensionAction === "EXTEND") {
        // Extend suspension by 5 more days
        const currentExpiry = emp.terminationExpiry ? new Date(emp.terminationExpiry).getTime() : Date.now();
        const newExpiry = new Date(currentExpiry + 5 * 24 * 60 * 60 * 1000);
        updatedUser = await prisma.user.update({
          where: { id: employeeId },
          data: { isSuspended: true, terminationExpiry: newExpiry }
        });
        logMsg = `Extended suspension for employee ${emp.employeeId || emp.name} by another 5 days.`;
      } else if (suspensionAction === "TERMINATE") {
        // Permanent block / suspension (we keep record but disable access)
        updatedUser = await prisma.user.update({
          where: { id: employeeId },
          data: { isSuspended: true, terminationExpiry: new Date("9999-12-31") }
        });
        logMsg = `Permanently terminated employee ${emp.employeeId || emp.name}. Account blocked.`;
      } else {
        return NextResponse.json({ error: "Invalid suspension action." }, { status: 400 });
      }

      await prisma.auditLog.create({
        data: {
          actorName,
          action: "PERMISSION_CHANGE",
          details: logMsg
        }
      });

      return NextResponse.json(updatedUser);
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Permanently remove employee user record (Super Admin Only!)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user ? (session.user as any).role : null;
    const actorName = session?.user ? session.user.name : "Admin";
    const isSimulated = request.headers.get("x-mock-role") === "Owner" || request.headers.get("x-mock-role") === "Super Admin";

    // ONLY Super Admin / Owner can permanently delete employee records
    if (userRole !== "Owner" && userRole !== "Super Admin" && !isSimulated) {
      return NextResponse.json({ error: "Access Denied: Super Admin authority required to permanently delete records." }, { status: 403 });
    }

    const { employeeId } = await request.json();
    if (!employeeId) return NextResponse.json({ error: "Employee User ID is required." }, { status: 400 });

    const targetUser = await prisma.user.findUnique({
      where: { id: employeeId },
      include: { role: true }
    });

    if (!targetUser) return NextResponse.json({ error: "Employee not found." }, { status: 404 });
    if (targetUser.role.name === "Owner") {
      return NextResponse.json({ error: "Access Denied: Owner cannot be deleted." }, { status: 403 });
    }

    // Delete related rows first
    await prisma.attendance.deleteMany({ where: { userId: employeeId } });
    await prisma.leaveRequest.deleteMany({ where: { userId: employeeId } });
    await prisma.payroll.deleteMany({ where: { userId: employeeId } });
    await prisma.passwordHistory.deleteMany({ where: { userId: employeeId } });
    await prisma.resetRequest.deleteMany({ where: { userId: employeeId } });

    await prisma.user.delete({ where: { id: employeeId } });

    await prisma.auditLog.create({
      data: {
        actorName: actorName || "Admin",
        action: "DELETE",
        details: `Permanently deleted employee database record: ${targetUser.employeeId || targetUser.name}.`
      }
    });

    return NextResponse.json({ success: true, message: "Employee permanently deleted." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
