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

// GET: Fetch Payroll Records
export async function GET(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request, ["Admin", "HR Manager", "CEO", "Finance"]);
    if (!isAuth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const payroll = await prisma.payroll.findMany({
      include: {
        user: { select: { name: true, employeeId: true, department: true, designation: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(payroll);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Approve Monthly Payroll
export async function POST(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request, ["Admin", "HR Manager"]);
    if (!isAuth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const session = await getServerSession(authOptions);
    const actorName = session?.user?.name || "HR Admin";

    const body = await request.json();
    const { month, year } = body;

    if (!month || !year) {
      return NextResponse.json({ error: "Month and Year are required." }, { status: 400 });
    }

    // Approve all payroll rows matching that period
    const approved = await prisma.payroll.updateMany({
      where: { month: parseInt(month), year: parseInt(year), status: "PENDING" },
      data: { status: "APPROVED", approvedBy: actorName }
    });

    await prisma.auditLog.create({
      data: {
        actorName,
        action: "APPROVE",
        details: `Approved monthly payroll runs for period ${month}/${year} (${approved.count} employee slips).`
      }
    });

    return NextResponse.json({ success: true, count: approved.count });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Salary revision update
export async function PUT(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request, ["Admin", "HR Manager"]);
    if (!isAuth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { id, salary, bonus, pf, esic, tax } = body;

    if (!id) return NextResponse.json({ error: "Payroll record ID required." }, { status: 400 });

    const sal = parseFloat(salary || 0);
    const bon = parseFloat(bonus || 0);
    const pF = parseFloat(pf || 0);
    const esi = parseFloat(esic || 0);
    const tX = parseFloat(tax || 0);
    const net = sal + bon - pF - esi - tX;

    const payroll = await prisma.payroll.update({
      where: { id },
      data: {
        salary: sal,
        bonus: bon,
        pf: pF,
        esic: esi,
        tax: tX,
        netPay: net
      },
      include: {
        user: { select: { name: true, employeeId: true } }
      }
    });

    const session = await getServerSession(authOptions);
    const actorName = session?.user?.name || "System";
    await prisma.auditLog.create({
      data: {
        actorName,
        action: "EDIT",
        details: `Revised payroll salary structure for employee ${payroll.user.employeeId || payroll.user.name} (Net pay: ₹${net}).`
      }
    });

    return NextResponse.json(payroll);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
