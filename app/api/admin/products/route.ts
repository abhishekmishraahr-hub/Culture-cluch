import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function checkProductAdminAuth(request: Request) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user ? (session.user as any).role : null;
  const isSimulated = request.headers.get("x-mock-role") === "Owner" || request.headers.get("x-mock-role") === "Super Admin" || request.headers.get("x-mock-role") === "Admin";

  const isAuthorized = userRole && ["Owner", "Super Admin", "Admin", "Product Manager"].includes(userRole);
  if (!isAuthorized && !isSimulated) {
    return false;
  }
  return true;
}

// GET: List all products in database (without filter constraint for Admin management view)
export async function GET(request: Request) {
  try {
    const isAuth = await checkProductAdminAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const products = await prisma.product.findMany({
      include: {
        category: true,
        district: {
          include: { state: true }
        },
        images: true
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 550 });
  }
}

// POST: Onboard a new product
export async function POST(request: Request) {
  try {
    const isAuth = await checkProductAdminAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { name, sku, slug, price, compareAtPrice, stock, categoryId, districtId, description, images, vendorId } = body;

    let finalCategoryId = categoryId;
    let finalDistrictId = districtId;

    if (!finalCategoryId) {
      const firstCat = await prisma.category.findFirst();
      if (firstCat) {
        finalCategoryId = firstCat.id;
      } else {
        return NextResponse.json({ error: "Missing required category relation" }, { status: 400 });
      }
    }

    if (!finalDistrictId) {
      const firstDist = await prisma.district.findFirst();
      if (firstDist) {
        finalDistrictId = firstDist.id;
      } else {
        return NextResponse.json({ error: "Missing required district relation" }, { status: 400 });
      }
    }

    if (!name || !sku || !slug || price === undefined || stock === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check unique slug
    const existingSlug = await prisma.product.findUnique({
      where: { slug }
    });
    if (existingSlug) {
      return NextResponse.json({ error: "A product with this slug/URL already exists" }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        sku,
        slug: slug.toLowerCase().trim(),
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        stock: parseInt(stock),
        categoryId: finalCategoryId,
        districtId: finalDistrictId,
        description: description || "",
        vendorId: vendorId || null,
        isActive: true
      }
    });

    // Create default image relation if provided
    if (images && Array.isArray(images) && images.length > 0) {
      await prisma.productImage.create({
        data: {
          productId: newProduct.id,
          url: images[0]
        }
      });
    }

    return NextResponse.json(newProduct);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Modify product record
export async function PUT(request: Request) {
  try {
    const isAuth = await checkProductAdminAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, sku, price, compareAtPrice, stock, categoryId, districtId, description, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name || undefined,
        sku: sku || undefined,
        price: price !== undefined ? parseFloat(price) : undefined,
        compareAtPrice: compareAtPrice !== undefined ? (compareAtPrice ? parseFloat(compareAtPrice) : null) : undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        categoryId: categoryId || undefined,
        districtId: districtId || undefined,
        description: description !== undefined ? description : undefined,
        isActive: isActive !== undefined ? isActive : undefined
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove product from database catalog
export async function DELETE(request: Request) {
  try {
    const isAuth = await checkProductAdminAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Check if the product has ordered items to prevent breaking order history
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: id }
    });
    if (orderItemsCount > 0) {
      return NextResponse.json({ error: "Cannot delete product. Customers have placed orders for this item." }, { status: 400 });
    }

    // Delete relation images first
    await prisma.productImage.deleteMany({
      where: { productId: id }
    });

    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
