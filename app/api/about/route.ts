import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "public", "data", "about.json");

export async function GET() {
  try {
    const data = await fs.readFile(DATA_PATH, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user ? (session.user as any).role : null;
    
    // In next-auth credentials or standard flow, allow Owner, Super Admin, Admin, Product Manager
    const isAuthorized = userRole && ["Owner", "Super Admin", "Admin", "Product Manager"].includes(userRole);
    
    // Fallback: if there is no session but client header indicates mock admin session or it's static simulation
    const isSimulated = request.headers.get("x-mock-role") === "Admin" || request.headers.get("x-mock-role") === "Owner";

    if (!isAuthorized && !isSimulated) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
    }

    const payload = await request.json();
    await fs.writeFile(DATA_PATH, JSON.stringify(payload, null, 2), "utf-8");
    return NextResponse.json({ success: true, message: "About Us content updated successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 550 });
  }
}
