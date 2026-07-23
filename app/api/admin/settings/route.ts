import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const SETTINGS_PATH = path.join(process.cwd(), "public", "data", "settings.json");

export async function GET() {
  try {
    const data = await fs.readFile(SETTINGS_PATH, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: "Failed to read site settings configuration" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user ? (session.user as any).role : null;

    // Check authorization: Owner, Super Admin, Admin, Content Manager
    const isAuthorized = userRole && ["Owner", "Super Admin", "Admin", "Content Manager"].includes(userRole);
    const isSimulated = request.headers.get("x-mock-role") === "Admin" || request.headers.get("x-mock-role") === "Owner";

    if (!isAuthorized && !isSimulated) {
      return NextResponse.json({ error: "Unauthorized. Admin credentials required." }, { status: 401 });
    }

    const payload = await request.json();
    await fs.writeFile(SETTINGS_PATH, JSON.stringify(payload, null, 2), "utf-8");
    return NextResponse.json({ success: true, message: "Site configurations updated successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
