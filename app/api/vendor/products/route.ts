import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all products for the authenticated vendor
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let vendorId = searchParams.get("vendorId");

    if (!vendorId) {
      const session = await getServerSession(authOptions);
      if (session?.user?.email) {
        const vendorUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          include: { vendor: true }
        });
        if (vendorUser?.vendor) {
          vendorId = vendorUser.vendor.id;
        }
      }
    }

    if (!vendorId) {
      return NextResponse.json({ error: "Missing vendorId parameter or unauthenticated vendor session" }, { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: {
        vendorId: vendorId
      },
      include: {
        images: true,
        culturalStory: true,
        approvalWorkflow: {
          include: {
            comments: true
          }
        }
      },
      orderBy: {
        updatedAt: "desc"
      }
    });

    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST to create a new product or draft
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, 
      description, 
      price, 
      stock, 
      sku, 
      categoryId, 
      districtId, 
      status, // Draft, Submitted
      story, // History, origin details
      images // Image URLs array
    } = body;
    let vendorId = body.vendorId;

    if (!vendorId) {
      const session = await getServerSession(authOptions);
      if (session?.user?.email) {
        const vendorUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          include: { vendor: true }
        });
        if (vendorUser?.vendor) {
          vendorId = vendorUser.vendor.id;
        }
      }
    }

    if (!vendorId || !name || !sku) {
      return NextResponse.json({ error: "Missing required fields (vendorId, name, sku)" }, { status: 400 });
    }

    // Lookup fallbacks for categoryId and districtId
    let finalCategoryId = categoryId;
    let finalDistrictId = districtId;

    if (!finalCategoryId) {
      const firstCat = await prisma.category.findFirst();
      if (firstCat) finalCategoryId = firstCat.id;
    }
    if (!finalDistrictId) {
      const firstDist = await prisma.district.findFirst();
      if (firstDist) finalDistrictId = firstDist.id;
    }

    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;

    // Create the product in the database
    const product = await prisma.product.create({
      data: {
        vendorId,
        name,
        slug,
        description: description || "No description provided.",
        price: parseFloat(price) || 0.0,
        stock: parseInt(stock) || 0,
        sku,
        categoryId: finalCategoryId,
        districtId: finalDistrictId,
        isActive: status === "Published", // Published only after workflow completion
        images: {
          create: (images || []).map((url: string) => ({ url }))
        }
      }
    });

    // If story elements are provided, create story record
    if (story) {
      await prisma.culturalStory.create({
        data: {
          productId: product.id,
          artisanName: story.artisanName || "Traditional Cooperative",
          artisanLocation: story.artisanLocation || "Regional Cluster",
          history: story.history || "",
          culturalSignificance: story.culturalSignificance || "",
          productionMethod: story.productionMethod || ""
        }
      });
    }

    // Initialize Approval Workflow stage if status is Submitted
    if (status === "Submitted") {
      await prisma.approvalWorkflow.create({
        data: {
          productId: product.id,
          currentStage: "VERIFICATION_REVIEW"
        }
      });

      await prisma.productStatusHistory.create({
        data: {
          productId: product.id,
          fromStatus: "Draft",
          toStatus: "Submitted",
          remarks: "Initial product submission to workflow."
        }
      });
    }

    return NextResponse.json({ message: "Product created successfully", product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
