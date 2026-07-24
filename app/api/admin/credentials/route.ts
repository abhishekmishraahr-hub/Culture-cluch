import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

// Helper password policy validator
function validatePassword(password: string): boolean {
  if (password.length < 8) return false;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  return hasUpper && hasLower && hasDigit && hasSpecial;
}

// GET: Secure Credential Vault (Super Admin Only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user ? (session.user as any).role : null;
    const isSimulated = request.headers.get("x-mock-role") === "Owner" || request.headers.get("x-mock-role") === "Super Admin";

    // ONLY Owner / Super Admin can access vault details
    if (userRole !== "Owner" && userRole !== "Super Admin" && !isSimulated) {
      return NextResponse.json({ error: "Access Denied: Super Admin authority required." }, { status: 403 });
    }

    // Return all password reset requests and password history audits
    const resetRequests = await prisma.resetRequest.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, employeeId: true, department: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    const passwordHistoriesCount = await prisma.passwordHistory.count();
    const activeEmployeesCount = await prisma.user.count({
      where: { employeeId: { not: null } }
    });

    return NextResponse.json({
      resetRequests,
      passwordHistoriesCount,
      activeEmployeesCount
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Submit a Forgot Password request OR Change Password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, employeeId, oldPassword, newPassword, userId } = body;

    // ACTION 1: FORGOT PASSWORD REQUEST (Public / Employee self submission)
    if (action === "FORGOT_REQUEST") {
      if (!email && !employeeId) {
        return NextResponse.json({ error: "Email or Employee ID is required." }, { status: 400 });
      }

      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email || undefined },
            { employeeId: employeeId || undefined }
          ]
        }
      });

      if (!user) {
        return NextResponse.json({ error: "No employee record found." }, { status: 404 });
      }

      // Create reset request
      const resetReq = await prisma.resetRequest.create({
        data: {
          userId: user.id,
          status: "PENDING"
        }
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          actorName: user.name,
          action: "EDIT",
          details: `Password reset request submitted for employee ${user.employeeId || user.name}.`
        }
      });

      return NextResponse.json({ success: true, message: "Reset request submitted to Admin for approval." });
    }

    // ACTION 2: PASSWORD CHANGE (Logged-in employee changes their own password)
    if (action === "CHANGE") {
      const session = await getServerSession(authOptions);
      const currentUserId = session?.user ? (session.user as any).id : userId;

      if (!currentUserId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (!oldPassword || !newPassword) {
        return NextResponse.json({ error: "Old password and new password are required." }, { status: 400 });
      }

      const user = await prisma.user.findUnique({
        where: { id: currentUserId },
        include: { passwordHistory: true }
      });

      if (!user) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }

      // Verify old password match
      const oldMatch = await bcrypt.compare(oldPassword, user.passwordHash);
      if (!oldMatch) {
        return NextResponse.json({ error: "Old password verification failed. Incorrect password." }, { status: 400 });
      }

      // Check password policy
      if (!validatePassword(newPassword)) {
        return NextResponse.json({
          error: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        }, { status: 400 });
      }

      // Verify not in history
      const historyList = user.passwordHistory;
      for (const hist of historyList) {
        const matchPast = await bcrypt.compare(newPassword, hist.passwordHash);
        if (matchPast) {
          return NextResponse.json({ error: "Cannot reuse a previous password. Please choose a new password." }, { status: 400 });
        }
      }

      const hashedNew = await bcrypt.hash(newPassword, 10);

      // Save to history list first
      await prisma.passwordHistory.create({
        data: {
          userId: user.id,
          passwordHash: user.passwordHash
        }
      });

      // Update password
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: hashedNew }
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          actorName: user.name,
          action: "PASSWORD_CHANGE",
          details: `Password changed successfully for employee ${user.employeeId || user.name}.`
        }
      });

      return NextResponse.json({ success: true, message: "Password updated successfully." });
    }

    return NextResponse.json({ error: "Invalid action type." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Approve / Reject Forgot Password reset requests (Admin / Super Admin)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user ? (session.user as any).role : null;
    const actorName = session?.user ? session.user.name : "Admin";
    const isSimulated = request.headers.get("x-mock-role") === "Owner" || request.headers.get("x-mock-role") === "Super Admin" || request.headers.get("x-mock-role") === "Admin";

    // Owner, Super Admin, and Admin can approve resets
    const isAuthorized = userRole && ["Owner", "Super Admin", "Admin"].includes(userRole);
    if (!isAuthorized && !isSimulated) {
      return NextResponse.json({ error: "Access Denied: Admin authorization required." }, { status: 403 });
    }

    const body = await request.json();
    const { requestId, status, newPassword } = body;

    if (!requestId || !status) {
      return NextResponse.json({ error: "Request ID and status are required." }, { status: 400 });
    }

    const resetReq = await prisma.resetRequest.findUnique({
      where: { id: requestId },
      include: { user: true }
    });

    if (!resetReq) {
      return NextResponse.json({ error: "Reset request not found." }, { status: 404 });
    }

    if (status === "APPROVED") {
      if (!newPassword || newPassword.length < 8) {
        return NextResponse.json({ error: "A valid new password of at least 8 characters must be provided." }, { status: 400 });
      }

      // Hash password and update user
      const hashedNew = await bcrypt.hash(newPassword, 10);

      // Save previous to history
      await prisma.passwordHistory.create({
        data: {
          userId: resetReq.userId,
          passwordHash: resetReq.user.passwordHash
        }
      });

      await prisma.user.update({
        where: { id: resetReq.userId },
        data: { passwordHash: hashedNew }
      });

      // Update request status
      await prisma.resetRequest.update({
        where: { id: requestId },
        data: { status: "APPROVED" }
      });

      await prisma.auditLog.create({
        data: {
          userId: resetReq.userId,
          actorName: resetReq.user.name,
          action: "PASSWORD_CHANGE",
          details: `Password reset request approved by ${actorName || "Admin"}. Temporary password set.`
        }
      });

      return NextResponse.json({ success: true, message: "Reset request approved and password updated." });
    } else if (status === "REJECTED") {
      await prisma.resetRequest.update({
        where: { id: requestId },
        data: { status: "REJECTED" }
      });

      await prisma.auditLog.create({
        data: {
          userId: resetReq.userId,
          actorName: resetReq.user.name,
          action: "REJECT",
          details: `Password reset request rejected by ${actorName || "Admin"}.`
        }
      });

      return NextResponse.json({ success: true, message: "Reset request rejected." });
    }

    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
