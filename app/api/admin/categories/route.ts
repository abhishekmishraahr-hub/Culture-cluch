import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST: Add new Category (supports nesting via parentId)
export async function POST(request: Request) {
  try {
    const { name, slug, description, image, parentId } = await request.json();

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug: slug.toLowerCase().trim(),
        description,
        image,
        parentId: parentId || null,
        isActive: true
      }
    });

    return NextResponse.json(newCategory);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Edit existing Category
export async function PUT(request: Request) {
  try {
    const { id, name, slug, description, image, parentId, isActive } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug: slug ? slug.toLowerCase().trim() : undefined,
        description,
        image,
        parentId: parentId !== undefined ? (parentId || null) : undefined,
        isActive
      }
    });

    return NextResponse.json(updatedCategory);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete category
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    // 1. Check if category has subcategories
    const subcategoryCount = await prisma.category.count({
      where: { parentId: id }
    });
    if (subcategoryCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete Category. Please delete its subcategories first." },
        { status: 400 }
      );
    }

    // 2. Check if category has active products
    const productCount = await prisma.product.count({
      where: { categoryId: id }
    });
    if (productCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete Category. There are active products assigned to it." },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
