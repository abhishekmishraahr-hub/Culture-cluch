import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(request: Request, props: Params) {
  try {
    const params = await props.params;
    const { slug } = params;

    const product = await prisma.product.findUnique({
      where: { slug },
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
          where: { isApproved: true },
          include: {
            user: {
              select: { name: true }
            }
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!product || !product.isActive) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
