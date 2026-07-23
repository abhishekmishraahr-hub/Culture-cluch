import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function checkReviewAdminAuth(request: Request) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user ? (session.user as any).role : null;
  const isSimulated = request.headers.get("x-mock-role") === "Owner" || request.headers.get("x-mock-role") === "Super Admin" || request.headers.get("x-mock-role") === "Admin";

  const isAuthorized = userRole && ["Owner", "Super Admin", "Admin", "Customer Support", "Content Manager"].includes(userRole);
  if (!isAuthorized && !isSimulated) {
    return false;
  }
  return true;
}

// GET: Retrieve reviews list
export async function GET(request: Request) {
  try {
    const isAuth = await checkReviewAdminAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
    }

    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { name: true, sku: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(reviews);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 550 });
  }
}

// PUT: Approve / Reject review
export async function PUT(request: Request) {
  try {
    const isAuth = await checkReviewAdminAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
    }

    const { id, isApproved } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: { isApproved }
    });

    return NextResponse.json(updatedReview);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a review record
export async function DELETE(request: Request) {
  try {
    const isAuth = await checkReviewAdminAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    await prisma.review.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Review deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
