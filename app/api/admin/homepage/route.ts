import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const configPath = path.join(process.cwd(), "public", "data", "homepage.json");

export async function GET() {
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, "utf8");
      return NextResponse.json(JSON.parse(data));
    }
    return NextResponse.json({ error: "Homepage configuration not found" }, { status: 404 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Basic role restriction simulation
    const roleHeader = req.headers.get("x-mock-role") || "Admin";
    const allowed = ["Owner", "Super Admin", "Admin"].includes(roleHeader);
    if (!allowed) {
      return NextResponse.json({ error: "Access denied: Unauthorized role" }, { status: 403 });
    }

    const body = await req.json();
    if (!body.sections || !Array.isArray(body.sections)) {
      return NextResponse.json({ error: "Invalid homepage configuration format" }, { status: 400 });
    }

    // Write to local json database file
    fs.writeFileSync(configPath, JSON.stringify(body, null, 2), "utf8");
    return NextResponse.json({ success: true, message: "Homepage configurations saved successfully" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
