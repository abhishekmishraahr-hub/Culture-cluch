import { NextResponse } from "next/server";
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
    const payload = await request.json();
    await fs.writeFile(DATA_PATH, JSON.stringify(payload, null, 2), "utf-8");
    return NextResponse.json({ success: true, message: "About Us content updated successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
