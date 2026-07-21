import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { cartItems, address, paymentMethod, totals, couponCode } = await request.json();

    if (!cartItems || cartItems.length === 0 || !address) {
      return NextResponse.json({ error: "Invalid checkout request data" }, { status: 400 });
    }

    // 1. Get user context
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required. Please sign in to place an order." }, { status: 401 });
    }
    const userId = (session.user as any).id;

    // 2. Save shipping address
    const newAddress = await prisma.address.create({
      data: {
        userId,
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country || "India",
        isDefault: false
      }
    });

    // 3. Verify stock availability and deduct
    for (const item of cartItems) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product "${product?.name || 'Unknown'}"` },
          { status: 400 }
        );
      }

      // Deduct main stock
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });

      // Deduct variant stock if selected
      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } }
        });
      }
    }

    // 4. Generate random tracking ID and Invoice Number
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `AUR-${new Date().getFullYear()}-${randomSeq}`;
    const trackingId = `TRK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // 5. Create Order
    const newOrder = await prisma.order.create({
      data: {
        userId,
        totalAmount: totals.subtotal,
        taxAmount: totals.taxTotal,
        discountAmount: totals.discountTotal,
        shippingAmount: totals.shippingTotal,
        netAmount: totals.netTotal,
        status: paymentMethod === "COD" ? "PENDING" : "PAID",
        shippingAddressId: newAddress.id,
        invoiceNumber,
        trackingId,
        orderItems: {
          create: cartItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            taxRate: item.taxRate
          }))
        }
      },
      include: {
        orderItems: true
      }
    });

    // 6. Record Payment
    await prisma.payment.create({
      data: {
        orderId: newOrder.id,
        gateway: paymentMethod,
        transactionId: paymentMethod === "COD" ? null : `TXN-${Math.random().toString(36).substr(2, 10).toUpperCase()}`,
        status: paymentMethod === "COD" ? "PENDING" : "SUCCESS",
        amount: totals.netTotal
      }
    });

    // 7. Increment Coupon use count if applicable
    if (couponCode) {
      await prisma.coupon.update({
        where: { code: couponCode.toUpperCase() },
        data: { usedCount: { increment: 1 } }
      }).catch(() => {}); // Suppress coupon not found error
    }

    return NextResponse.json({ success: true, orderId: newOrder.id, invoiceNumber });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
