import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const categorySlug = searchParams.get("category") || "";
    const stateCode = searchParams.get("state") || "";
    const districtId = searchParams.get("district") || "";
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "999999");
    const sort = searchParams.get("sort") || "newest"; // newest, price-asc, price-desc, rating
    const isFeatured = searchParams.get("featured") === "true";
    const isTrending = searchParams.get("trending") === "true";

    // Build Prisma query filter
    const whereClause: any = {
      isActive: true,
      price: {
        gte: minPrice,
        lte: maxPrice
      }
    };

    if (isFeatured) whereClause.isFeatured = true;
    if (isTrending) whereClause.isTrending = true;

    if (query) {
      whereClause.OR = [
        { name: { contains: query } }, // Case insensitive searches default in SQLite Prisma
        { description: { contains: query } },
        { sku: { contains: query } }
      ];
    }

    if (categorySlug) {
      whereClause.category = {
        slug: categorySlug
      };
    }

    if (districtId) {
      whereClause.districtId = districtId;
    } else if (stateCode) {
      whereClause.district = {
        state: {
          code: stateCode.toUpperCase()
        }
      };
    }

    // Sorting
    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-asc") {
      orderBy = { price: "asc" };
    } else if (sort === "price-desc") {
      orderBy = { price: "desc" };
    } else if (sort === "popular") {
      orderBy = { isTrending: "desc" };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        images: true,
        category: true,
        district: {
          include: {
            state: true
          }
        },
        variants: true,
        culturalStory: true,
        reviews: {
          where: { isApproved: true }
        }
      },
      orderBy
    });

    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
