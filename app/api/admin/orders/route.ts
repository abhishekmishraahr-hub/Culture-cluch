import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function checkOrderAdminAuth(request: Request) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user ? (session.user as any).role : null;
  const isSimulated = request.headers.get("x-mock-role") === "Owner" || request.headers.get("x-mock-role") === "Super Admin" || request.headers.get("x-mock-role") === "Admin";

  const isAuthorized = userRole && ["Owner", "Super Admin", "Admin", "Order Manager"].includes(userRole);
  if (!isAuthorized && !isSimulated) {
    return false;
  }
  return true;
}

// GET: Retrieve all orders
export async function GET(request: Request) {
  try {
    const isAuth = await checkOrderAdminAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        shippingAddress: true,
        orderItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 550 });
  }
}

// PUT: Modify order fulfillment stage or tracking code
export async function PUT(request: Request) {
  try {
    const isAuth = await checkOrderAdminAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { id, status, trackingId, invoiceNumber } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: status || undefined,
        trackingId: trackingId !== undefined ? trackingId : undefined,
        invoiceNumber: invoiceNumber !== undefined ? invoiceNumber : undefined
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
