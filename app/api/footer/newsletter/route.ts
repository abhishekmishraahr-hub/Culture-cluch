import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await prisma.footerNewsletter.findUnique({
      where: { email }
    });

    if (existing) {
      return NextResponse.json({ success: true, message: "You are already subscribed to the Artisan Chronicles newsletter!" });
    }

    await prisma.footerNewsletter.create({
      data: { email }
    });

    return NextResponse.json({ success: true, message: "Thank you for subscribing to Cultural Clutch's Artisan Chronicles!" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
