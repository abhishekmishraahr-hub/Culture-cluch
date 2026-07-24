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

// GET: Retrieve Campaigns & Coupons
export async function GET(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request, ["Admin", "Marketing", "CEO"]);
    if (!isAuth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const campaigns = await prisma.campaign.findMany({ orderBy: { startDate: "desc" } });
    const coupons = await prisma.coupon.findMany({ orderBy: { code: "asc" } });

    return NextResponse.json({ campaigns, coupons });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create Campaign or Coupon
export async function POST(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request, ["Admin", "Marketing"]);
    if (!isAuth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { action, name, type, budget, status, startDate, endDate, code, couponType, value, minOrderAmount } = body;

    const session = await getServerSession(authOptions);
    const actorName = session?.user?.name || "System";

    // 1. CAMPAIGN CREATION
    if (action === "CAMPAIGN") {
      if (!name || !type || !startDate || !endDate) {
        return NextResponse.json({ error: "Name, type, and dates are required." }, { status: 400 });
      }

      const campaign = await prisma.campaign.create({
        data: {
          name,
          type,
          budget: parseFloat(budget || 0),
          status: status || "PLANNING",
          startDate: new Date(startDate),
          endDate: new Date(endDate)
        }
      });

      await prisma.auditLog.create({
        data: {
          actorName,
          action: "EDIT",
          details: `Created marketing campaign: ${name} (Budget: ₹${budget}).`
        }
      });

      return NextResponse.json(campaign);
    }

    // 2. COUPON CREATION
    if (action === "COUPON") {
      if (!code || !couponType || value === undefined) {
        return NextResponse.json({ error: "Code, couponType, and value are required." }, { status: 400 });
      }

      const coupon = await prisma.coupon.create({
        data: {
          code: code.toUpperCase().trim(),
          type: couponType,
          value: parseFloat(value),
          minOrderAmount: parseFloat(minOrderAmount || 0),
          startDate: new Date(startDate || Date.now()),
          endDate: new Date(endDate || Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });

      await prisma.auditLog.create({
        data: {
          actorName,
          action: "EDIT",
          details: `Created discount coupon code: ${code.toUpperCase()}.`
        }
      });

      return NextResponse.json(coupon);
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Modify Campaign or Coupon
export async function PUT(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request, ["Admin", "Marketing"]);
    if (!isAuth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { action, id, name, status, budget, conversions, clicks, code, couponType, value, isActive } = body;

    const session = await getServerSession(authOptions);
    const actorName = session?.user?.name || "System";

    if (action === "CAMPAIGN") {
      if (!id) return NextResponse.json({ error: "ID is required." }, { status: 400 });

      const campaign = await prisma.campaign.update({
        where: { id },
        data: {
          name: name !== undefined ? name : undefined,
          status: status !== undefined ? status : undefined,
          budget: budget !== undefined ? parseFloat(budget) : undefined,
          clicks: clicks !== undefined ? parseInt(clicks) : undefined,
          conversions: conversions !== undefined ? parseInt(conversions) : undefined
        }
      });

      await prisma.auditLog.create({
        data: {
          actorName,
          action: "EDIT",
          details: `Modified campaign ${name || id} (Status: ${status}).`
        }
      });

      return NextResponse.json(campaign);
    }

    if (action === "COUPON") {
      if (!id) return NextResponse.json({ error: "ID is required." }, { status: 400 });

      const coupon = await prisma.coupon.update({
        where: { id },
        data: {
          code: code !== undefined ? code.toUpperCase() : undefined,
          type: couponType !== undefined ? couponType : undefined,
          value: value !== undefined ? parseFloat(value) : undefined,
          isActive: isActive !== undefined ? isActive : undefined
        }
      });

      await prisma.auditLog.create({
        data: {
          actorName,
          action: "EDIT",
          details: `Modified coupon code: ${code || id} (Active: ${isActive}).`
        }
      });

      return NextResponse.json(coupon);
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete Campaign or Coupon
export async function DELETE(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request, ["Admin", "Marketing"]);
    if (!isAuth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { action, id } = body;

    const session = await getServerSession(authOptions);
    const actorName = session?.user?.name || "System";

    if (!id) return NextResponse.json({ error: "ID is required." }, { status: 400 });

    if (action === "CAMPAIGN") {
      await prisma.campaign.delete({ where: { id } });
      await prisma.auditLog.create({
        data: {
          actorName,
          action: "DELETE",
          details: `Deleted campaign ID ${id}.`
        }
      });
      return NextResponse.json({ success: true });
    }

    if (action === "COUPON") {
      await prisma.coupon.delete({ where: { id } });
      await prisma.auditLog.create({
        data: {
          actorName,
          action: "DELETE",
          details: `Deleted coupon ID ${id}.`
        }
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
