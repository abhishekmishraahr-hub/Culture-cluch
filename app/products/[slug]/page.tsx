import React from "react";
import { prisma } from "@/lib/db";
import ProductDetailClient from "./ProductDetailClient";

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true }
  });
  
  return products.map((p) => ({
    slug: p.slug
  }));
}

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailPage(props: Props) {
  const { slug } = await props.params;
  return <ProductDetailClient slug={slug} />;
}
