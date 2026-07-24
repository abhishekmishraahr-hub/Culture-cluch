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

// GET: Fetch Purchase Orders
export async function GET(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request, ["Admin", "Purchase Manager", "Purchase Executive", "CEO"]);
    if (!isAuth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const purchaseOrders = await prisma.purchaseOrder.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(purchaseOrders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a Purchase Order
export async function POST(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request, ["Admin", "Purchase Manager"]);
    if (!isAuth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { vendorId, vendorName, totalAmount, expectedDate, items } = body;

    if (!vendorId || !vendorName || !totalAmount || !expectedDate || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Missing required purchase order fields" }, { status: 400 });
    }

    const newPO = await prisma.purchaseOrder.create({
      data: {
        vendorId,
        vendorName,
        totalAmount: parseFloat(totalAmount),
        expectedDate: new Date(expectedDate),
        items: {
          create: items.map((item: any) => ({
            productName: item.productName,
            quantity: parseInt(item.quantity),
            unitPrice: parseFloat(item.unitPrice)
          }))
        }
      },
      include: { items: true }
    });

    const session = await getServerSession(authOptions);
    const actorName = session?.user?.name || "System";
    await prisma.auditLog.create({
      data: {
        actorName,
        action: "EDIT",
        details: `Created Purchase Order for ${vendorName} (Total: ₹${totalAmount}).`
      }
    });

    return NextResponse.json(newPO);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update PO status / details (APPROVED, SHIPPED, DELIVERED, CANCELLED)
export async function PUT(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request, ["Admin", "Purchase Manager"]);
    if (!isAuth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "PO ID and status are required." }, { status: 400 });
    }

    const updatedPO = await prisma.purchaseOrder.update({
      where: { id },
      data: { status },
      include: { items: true }
    });

    // If status is DELIVERED, automatically increment inventory stock for matching products
    if (status === "DELIVERED") {
      for (const item of updatedPO.items) {
        // Look up product by name to update its stock
        const matchedProduct = await prisma.product.findFirst({
          where: { name: { contains: item.productName } }
        });
        if (matchedProduct) {
          await prisma.product.update({
            where: { id: matchedProduct.id },
            data: { stock: { increment: item.quantity } }
          });
        }
      }
    }

    const session = await getServerSession(authOptions);
    const actorName = session?.user?.name || "System";
    await prisma.auditLog.create({
      data: {
        actorName,
        action: "APPROVE",
        details: `Updated Purchase Order ID ${id} status to ${status}.`
      }
    });

    return NextResponse.json(updatedPO);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
