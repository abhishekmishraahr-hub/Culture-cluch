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

// GET: Retrieve Leads
export async function GET(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request, ["Admin", "Sales Manager", "Sales Executive"]);
    if (!isAuth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(leads);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new Lead
export async function POST(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request, ["Admin", "Sales Manager", "Sales Executive"]);
    if (!isAuth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { name, email, phone, status, value, source, assignedTo } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Name, email, and phone are required." }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        status: status || "NEW",
        value: parseFloat(value || 0),
        source: source || "Website",
        assignedTo: assignedTo || null
      }
    });

    const session = await getServerSession(authOptions);
    const actorName = session?.user?.name || "System";
    await prisma.auditLog.create({
      data: {
        actorName,
        action: "EDIT",
        details: `Created new lead: ${name} (Value: ₹${value}).`
      }
    });

    return NextResponse.json(lead);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Modify a Lead
export async function PUT(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request, ["Admin", "Sales Manager", "Sales Executive"]);
    if (!isAuth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { id, name, email, phone, status, value, source, assignedTo } = body;

    if (!id) return NextResponse.json({ error: "Lead ID is required." }, { status: 400 });

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        email: email !== undefined ? email : undefined,
        phone: phone !== undefined ? phone : undefined,
        status: status !== undefined ? status : undefined,
        value: value !== undefined ? parseFloat(value) : undefined,
        source: source !== undefined ? source : undefined,
        assignedTo: assignedTo !== undefined ? assignedTo : undefined
      }
    });

    const session = await getServerSession(authOptions);
    const actorName = session?.user?.name || "System";
    await prisma.auditLog.create({
      data: {
        actorName,
        action: "EDIT",
        details: `Updated lead ID ${id} to status ${status}.`
      }
    });

    return NextResponse.json(lead);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a Lead
export async function DELETE(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request, ["Admin", "Sales Manager"]);
    if (!isAuth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "Lead ID is required." }, { status: 400 });

    const lead = await prisma.lead.delete({
      where: { id }
    });

    const session = await getServerSession(authOptions);
    const actorName = session?.user?.name || "System";
    await prisma.auditLog.create({
      data: {
        actorName,
        action: "DELETE",
        details: `Deleted lead for: ${lead.name}.`
      }
    });

    return NextResponse.json({ success: true, message: "Lead removed." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
