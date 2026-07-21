import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import PDFDocument from "pdfkit";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, props: Params) {
  try {
    const params = await props.params;
    const { id: orderId } = params;

    // Fetch order details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { name: true, email: true } },
        shippingAddress: true,
        orderItems: {
          include: {
            product: { select: { name: true, sku: true } }
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Generate PDF document in memory
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const chunks: Buffer[] = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      // 1. Header with Cultural Aesthetics
      doc
        .fillColor("#1D2A44")
        .fontSize(26)
        .font("Helvetica-Bold")
        .text("CULTURAL CLUTCH", 50, 50);

      doc
        .fillColor("#C85A32")
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("VOCAL FOR LOCAL  •  ONE DISTRICT ONE PRODUCT (ODOP)", 50, 80);

      doc
        .strokeColor("#E5A93C")
        .lineWidth(1)
        .moveTo(50, 95)
        .lineTo(545, 95)
        .stroke();

      // 2. Billing & Shipping Metadata Grid
      doc
        .fillColor("#1F1F1F")
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("INVOICE METADATA", 50, 115)
        .font("Helvetica")
        .text(`Invoice ID: ${order.invoiceNumber || "N/A"}`, 50, 135)
        .text(`Order Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`, 50, 150)
        .text(`Tracking Ref: ${order.trackingId || "N/A"}`, 50, 165);

      const address = order.shippingAddress;
      doc
        .font("Helvetica-Bold")
        .text("SHIPPING DETAILS", 300, 115)
        .font("Helvetica")
        .text(`Customer: ${order.user.name}`, 300, 135)
        .text(`Street: ${address.street}`, 300, 150)
        .text(`City: ${address.city}, ${address.state} - ${address.pincode}`, 300, 165)
        .text("Country: India", 300, 180);

      doc
        .strokeColor("#F0EDE6")
        .lineWidth(1)
        .moveTo(50, 205)
        .lineTo(545, 205)
        .stroke();

      // 3. Itemized Table
      let y = 220;
      
      // Table Header
      doc
        .fillColor("#1D2A44")
        .font("Helvetica-Bold")
        .text("S.No", 50, y)
        .text("Heritage Item Description", 90, y)
        .text("Tax", 330, y)
        .text("Qty", 380, y)
        .text("Base Price", 420, y)
        .text("Net Total", 490, y);

      doc
        .strokeColor("#1D2A44")
        .lineWidth(1)
        .moveTo(50, y + 15)
        .lineTo(545, y + 15)
        .stroke();

      y += 25;
      doc.fillColor("#1F1F1F").font("Helvetica");

      // Table Rows
      order.orderItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        
        doc
          .text(`${index + 1}`, 50, y)
          .text(`${item.product.name}`, 90, y, { width: 230, lineGap: 2 })
          .text(`${item.taxRate}%`, 330, y)
          .text(`${item.quantity}`, 380, y)
          .text(`₹${item.price.toFixed(2)}`, 420, y)
          .text(`₹${itemTotal.toFixed(2)}`, 490, y);

        y += 30;
      });

      doc
        .strokeColor("#F0EDE6")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(545, y)
        .stroke();

      y += 15;

      // 4. Summaries Calculations Align Right
      doc
        .font("Helvetica")
        .text("Order Subtotal:", 350, y)
        .text(`₹${order.totalAmount.toFixed(2)}`, 480, y);

      y += 15;
      doc
        .text("GST Tax Amount:", 350, y)
        .text(`₹${order.taxAmount.toFixed(2)}`, 480, y);

      y += 15;
      doc
        .text("Shipping & Handling:", 350, y)
        .text(order.shippingAmount === 0 ? "FREE" : `₹${order.shippingAmount.toFixed(2)}`, 480, y);

      if (order.discountAmount > 0) {
        y += 15;
        doc
          .fillColor("green")
          .text("Applied Coupon Discount:", 350, y)
          .text(`-₹${order.discountAmount.toFixed(2)}`, 480, y);
      }

      y += 20;
      doc
        .fillColor("#C85A32")
        .font("Helvetica-Bold")
        .text("Invoice Total Net Amount:", 350, y)
        .text(`₹${order.netAmount.toFixed(2)}`, 480, y);

      // 5. Digital Footer
      doc
        .fillColor("gray")
        .fontSize(8)
        .font("Helvetica-Oblique")
        .text(
          "Thank you for supporting Local Craftsmanship. This is a computer-generated GST tax invoice. No signature required.",
          50,
          740,
          { align: "center", width: 495 }
        );

      doc.end();
    });
    // Return the streaming PDF response
    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=Invoice-${order.invoiceNumber}.pdf`,
        "Content-Length": pdfBuffer.length.toString()
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
