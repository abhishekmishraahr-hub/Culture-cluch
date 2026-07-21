import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();
    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { phone }
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this phone number. Please sign up first." },
        { status: 404 }
      );
    }

    console.log(`[MOCK OTP SERVICE] Generated OTP code '123456' for user phone: ${phone}`);
    
    return NextResponse.json({
      success: true,
      message: "OTP sent successfully. For local testing, please enter '123456'."
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
