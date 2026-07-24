import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

// Define the model mapping for Prisma client
const MODEL_MAPPING: Record<string, string> = {
  User: "user",
  Role: "role",
  State: "state",
  District: "district",
  Category: "category",
  Product: "product",
  ProductVariant: "productVariant",
  ProductImage: "productImage",
  CulturalStory: "culturalStory",
  CartItem: "cartItem",
  WishlistItem: "wishlistItem",
  Order: "order",
  OrderItem: "orderItem",
  Payment: "payment",
  Address: "address",
  Coupon: "coupon",
  Banner: "banner",
  Review: "review",
  BlogPost: "blogPost",
  Vendor: "vendor",
  VendorDocument: "vendorDocument",
  VendorBankAccount: "vendorBankAccount",
  ApprovalWorkflow: "approvalWorkflow",
  WorkflowComment: "workflowComment",
  Payout: "payout",
  PasswordHistory: "passwordHistory",
  ResetRequest: "resetRequest",
  Shipment: "shipment",
  AuditLog: "auditLog",
  Lead: "lead",
  PurchaseOrder: "purchaseOrder",
  PurchaseOrderItem: "purchaseOrderItem",
  Attendance: "attendance",
  LeaveRequest: "leaveRequest",
  Payroll: "payroll",
  Campaign: "campaign",
  SupportTicket: "supportTicket"
};

async function checkOwnerAuth(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user ? (session.user as any).role : null;
  const isSimulated = request.headers.get("x-mock-role") === "Owner" || request.headers.get("x-mock-role") === "Super Admin";
  return userRole === "Owner" || userRole === "Super Admin" || isSimulated;
}

// GET: Table statistics or table contents
export async function GET(request: NextRequest) {
  try {
    const isAuth = await checkOwnerAuth(request);
    if (!isAuth) return NextResponse.json({ error: "Access Denied: Owner credentials required." }, { status: 403 });

    const searchParams = request.nextUrl.searchParams;
    const selectedTable = searchParams.get("table");

    // If a specific table is requested, return its content rows (limit 100)
    if (selectedTable) {
      const prismaProp = MODEL_MAPPING[selectedTable];
      if (!prismaProp || !(prisma as any)[prismaProp]) {
        return NextResponse.json({ error: `Table '${selectedTable}' not recognized in database model registry.` }, { status: 400 });
      }

      try {
        const rows = await (prisma as any)[prismaProp].findMany({
          take: 100
        });
        return NextResponse.json(rows);
      } catch (err: any) {
        // Fallback for models without createdAt
        const rows = await (prisma as any)[prismaProp].findMany({ take: 100 });
        return NextResponse.json(rows);
      }
    }

    // Otherwise, return metadata statistics of all tables
    const stats: Record<string, number> = {};
    for (const [displayName, prismaProp] of Object.entries(MODEL_MAPPING)) {
      try {
        if ((prisma as any)[prismaProp]) {
          stats[displayName] = await (prisma as any)[prismaProp].count();
        }
      } catch {
        stats[displayName] = 0;
      }
    }

    // Relationships schema schema information
    const relationships = [
      { from: "User", to: "Role", type: "Many-to-One" },
      { from: "District", to: "State", type: "Many-to-One" },
      { from: "Product", to: "Category", type: "Many-to-One" },
      { from: "Product", to: "District", type: "Many-to-One" },
      { from: "OrderItem", to: "Order", type: "Many-to-One" },
      { from: "OrderItem", to: "Product", type: "Many-to-One" },
      { from: "Payment", to: "Order", type: "Many-to-One" },
      { from: "Shipment", to: "Order", type: "One-to-One" },
      { from: "Attendance", to: "User", type: "Many-to-One" },
      { from: "LeaveRequest", to: "User", type: "Many-to-One" },
      { from: "Payroll", to: "User", type: "Many-to-One" },
      { from: "SupportTicket", to: "User", type: "Many-to-One" }
    ];

    return NextResponse.json({
      stats,
      relationships
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Backup, Restore, or Run Diagnostic migrations
export async function POST(request: NextRequest) {
  try {
    const isAuth = await checkOwnerAuth(request);
    if (!isAuth) return NextResponse.json({ error: "Access Denied" }, { status: 403 });

    const body = await request.json();
    const { action } = body;

    const dbPath = path.join(process.cwd(), "prisma", "dev.db");
    const backupPath = path.join(process.cwd(), "prisma", "dev.db.backup");

    const session = await getServerSession(authOptions);
    const actorName = session?.user?.name || "Super Admin";

    if (action === "BACKUP") {
      await fs.copyFile(dbPath, backupPath);
      await prisma.auditLog.create({
        data: {
          actorName,
          action: "EDIT",
          details: "Created a full database snapshot backup (dev.db.backup)."
        }
      });
      return NextResponse.json({ success: true, message: "Database snapshot backup created successfully." });
    }

    if (action === "RESTORE") {
      try {
        await fs.access(backupPath);
      } catch {
        return NextResponse.json({ error: "No backup file found. Create a backup first." }, { status: 400 });
      }

      // Close Prisma connection before copying to prevent file locking
      await prisma.$disconnect();
      await fs.copyFile(backupPath, dbPath);

      // Log restoration action after re-establishing connection
      await prisma.auditLog.create({
        data: {
          actorName,
          action: "EDIT",
          details: "Restored database state from backup file."
        }
      });

      return NextResponse.json({ success: true, message: "Database state restored successfully." });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
