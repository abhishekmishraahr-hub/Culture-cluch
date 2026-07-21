import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // 1. Total revenue
    const paidOrders = await prisma.order.findMany({
      where: {
        OR: [
          { status: "PAID" },
          { status: "DELIVERED" }
        ]
      }
    });
    
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.netAmount, 0);
    const totalOrdersCount = await prisma.order.count();
    const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

    // 2. Low stock items (stock < 20)
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: {
          lt: 20
        }
      },
      include: {
        district: true
      },
      take: 10,
      orderBy: { stock: "asc" }
    });

    // 3. User lists with roles
    const users = await prisma.user.findMany({
      include: {
        role: true
      },
      orderBy: { name: "asc" }
    });

    // 4. Role options
    const roles = await prisma.role.findMany({
      orderBy: { name: "asc" }
    });

    // 5. Chart data (sales aggregated by date)
    const salesByDate: Record<string, number> = {};
    paidOrders.forEach((order) => {
      const dateStr = new Date(order.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric"
      });
      salesByDate[dateStr] = (salesByDate[dateStr] || 0) + order.netAmount;
    });

    const chartData = Object.keys(salesByDate).map((date) => ({
      date,
      revenue: salesByDate[date]
    })).slice(-10); // Last 10 days

    // 6. Recent Orders
    const recentOrders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } }
      },
      take: 5,
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalOrdersCount,
        avgOrderValue,
        lowStockCount: lowStockProducts.length
      },
      lowStockProducts,
      users,
      roles,
      chartData,
      recentOrders
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
