import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const states = await prisma.state.findMany({
      where: { isActive: true },
      include: {
        districts: {
          where: { isActive: true },
          orderBy: { name: "asc" }
        }
      },
      orderBy: { name: "asc" }
    });

    return NextResponse.json(states);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
