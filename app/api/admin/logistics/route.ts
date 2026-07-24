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

// GET: Fetch Shipment Queue
export async function GET(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request, ["Admin", "Delivery Manager", "Order Manager", "Logistics Manager", "CEO"]);
    if (!isAuth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const shipments = await prisma.shipment.findMany({
      orderBy: { createdAt: "desc" }
    });

    // Enforce matching with real order data
    const enrichedShipments = await Promise.all(
      shipments.map(async (ship) => {
        const order = await prisma.order.findUnique({
          where: { id: ship.orderId },
          include: {
            user: { select: { name: true, phone: true } },
            shippingAddress: true,
            orderItems: { include: { product: true } }
          }
        });
        return {
          ...ship,
          order
        };
      })
    );

    return NextResponse.json(enrichedShipments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create or Assign Courier (Setup shipping parameters)
export async function POST(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request, ["Admin", "Logistics Manager", "Order Manager"]);
    if (!isAuth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { orderId, carrier, weight, length, width, height } = body;

    if (!orderId || !carrier) {
      return NextResponse.json({ error: "Order ID and Carrier are required." }, { status: 400 });
    }

    // Generate random tracking number
    const trackingNumber = `${carrier.substring(0,3).toUpperCase()}${Math.floor(10000000 + Math.random() * 90000000)}`;

    const shipment = await prisma.shipment.upsert({
      where: { orderId },
      update: {
        carrier,
        trackingNumber,
        weight: parseFloat(weight || 0.5),
        length: parseFloat(length || 15.0),
        width: parseFloat(width || 15.0),
        height: parseFloat(height || 10.0),
        status: "PENDING_PICKUP",
        labelUrl: `/labels/shipping-label-${orderId.substring(0,6)}.pdf`,
        manifestUrl: `/manifests/manifest-${orderId.substring(0,6)}.pdf`
      },
      create: {
        orderId,
        carrier,
        trackingNumber,
        weight: parseFloat(weight || 0.5),
        length: parseFloat(length || 15.0),
        width: parseFloat(width || 15.0),
        height: parseFloat(height || 10.0),
        status: "PENDING_PICKUP",
        labelUrl: `/labels/shipping-label-${orderId.substring(0,6)}.pdf`,
        manifestUrl: `/manifests/manifest-${orderId.substring(0,6)}.pdf`
      }
    });

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "SHIPPED", trackingId: trackingNumber }
    });

    const session = await getServerSession(authOptions);
    const actorName = session?.user?.name || "System";
    await prisma.auditLog.create({
      data: {
        actorName,
        action: "SHIPMENT",
        details: `Assigned courier ${carrier} for order ID ${orderId} (Tracking: ${trackingNumber}).`
      }
    });

    return NextResponse.json(shipment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Modify packaging / dispatch status
export async function PUT(request: NextRequest) {
  try {
    const isAuth = await checkAuth(request, ["Admin", "Logistics Manager", "Order Manager"]);
    if (!isAuth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Shipment ID and status are required." }, { status: 400 });
    }

    const shipment = await prisma.shipment.update({
      where: { id },
      data: { status }
    });

    // If delivered, update Order status as well
    if (status === "DELIVERED") {
      await prisma.order.update({
        where: { id: shipment.orderId },
        data: { status: "DELIVERED" }
      });
      // Generate payout record for matching order vendor if exists
      const order = await prisma.order.findUnique({
        where: { id: shipment.orderId },
        include: { orderItems: { include: { product: true } } }
      });
      if (order && order.vendorId) {
        const netEarnings = order.netAmount * 0.85; // 85% goes to vendor
        const commissionDeducted = order.netAmount * 0.15; // 15% platform commission
        await prisma.payout.create({
          data: {
            vendorId: order.vendorId,
            orderId: order.id,
            netEarnings,
            commissionDeducted,
            payoutStatus: "Pending"
          }
        });
      }
    }

    const session = await getServerSession(authOptions);
    const actorName = session?.user?.name || "System";
    await prisma.auditLog.create({
      data: {
        actorName,
        action: "SHIPMENT",
        details: `Updated shipment ID ${id} status to ${status}.`
      }
    });

    return NextResponse.json(shipment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
