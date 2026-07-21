import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("admin") === "true";

    const categories = await prisma.category.findMany({
      where: includeInactive ? undefined : { isActive: true },
      include: {
        subcategories: {
          where: includeInactive ? undefined : { isActive: true },
          orderBy: { name: "asc" }
        }
      },
      orderBy: { name: "asc" }
    });

    // Return only root categories (those without parentId) when fetching a hierarchical tree
    const rootCategories = categories.filter(c => c.parentId === null);

    return NextResponse.json(rootCategories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
