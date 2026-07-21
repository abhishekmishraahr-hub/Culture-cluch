import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST: Add new State or District
export async function POST(request: Request) {
  try {
    const { type, ...data } = await request.json();

    if (type === "state") {
      const { name, code } = data;
      if (!name || !code) {
        return NextResponse.json({ error: "Name and code are required" }, { status: 400 });
      }

      const newState = await prisma.state.create({
        data: {
          name,
          code: code.toUpperCase(),
          isActive: true
        }
      });
      return NextResponse.json(newState);
    } 
    
    if (type === "district") {
      const { stateId, name, odopProduct } = data;
      if (!stateId || !name) {
        return NextResponse.json({ error: "stateId and name are required" }, { status: 400 });
      }

      const newDistrict = await prisma.district.create({
        data: {
          stateId,
          name,
          odopProduct,
          isActive: true
        }
      });
      return NextResponse.json(newDistrict);
    }

    return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Edit existing State or District
export async function PUT(request: Request) {
  try {
    const { type, id, ...data } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (type === "state") {
      const { name, code, isActive } = data;
      const updatedState = await prisma.state.update({
        where: { id },
        data: {
          name,
          code: code ? code.toUpperCase() : undefined,
          isActive
        }
      });
      return NextResponse.json(updatedState);
    }

    if (type === "district") {
      const { name, odopProduct, isActive } = data;
      const updatedDistrict = await prisma.district.update({
        where: { id },
        data: {
          name,
          odopProduct,
          isActive
        }
      });
      return NextResponse.json(updatedDistrict);
    }

    return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove records
export async function DELETE(request: Request) {
  try {
    const { type, id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (type === "state") {
      // Check if state contains districts
      const districtCount = await prisma.district.count({
        where: { stateId: id }
      });
      if (districtCount > 0) {
        return NextResponse.json(
          { error: "Cannot delete State. Please delete all its districts first." },
          { status: 400 }
        );
      }

      await prisma.state.delete({ where: { id } });
      return NextResponse.json({ success: true, message: "State deleted" });
    }

    if (type === "district") {
      // Check if district has linked products
      const productCount = await prisma.product.count({
        where: { districtId: id }
      });
      if (productCount > 0) {
        return NextResponse.json(
          { error: "Cannot delete District. Active products are assigned to this district." },
          { status: 400 }
        );
      }

      await prisma.district.delete({ where: { id } });
      return NextResponse.json({ success: true, message: "District deleted" });
    }

    return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
