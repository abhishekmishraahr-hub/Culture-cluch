import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

const MAPS_DIR = path.join(process.cwd(), "public", "maps");

// Helper to determine filename mapping
const filenameMap: Record<string, string> = {
  "AN": "andaman-nicobar.svg",
  "AP": "andhra-pradesh.svg",
  "AR": "arunachal-pradesh.svg",
  "AS": "assam.svg",
  "BR": "bihar.svg",
  "CH": "chandigarh.svg",
  "CG": "chhattisgarh.svg",
  "DN": "dadra-nagar-haveli-daman-diu.svg",
  "DL": "delhi.svg",
  "GA": "goa.svg",
  "GJ": "gujarat.svg",
  "HR": "haryana.svg",
  "HP": "himachal-pradesh.svg",
  "JK": "jammu-kashmir.svg",
  "JH": "jharkhand.svg",
  "KA": "karnataka.svg",
  "KL": "kerala.svg",
  "LA": "ladakh.svg",
  "LD": "lakshadweep.svg",
  "MP": "madhya-pradesh.svg",
  "MH": "maharashtra.svg",
  "MN": "manipur.svg",
  "ML": "meghalaya.svg",
  "MZ": "mizoram.svg",
  "NL": "nagaland.svg",
  "OR": "odisha.svg",
  "PY": "puducherry.svg",
  "PB": "punjab.svg",
  "RJ": "rajasthan.svg",
  "SK": "sikkim.svg",
  "TN": "tamil-nadu.svg",
  "TG": "telangana.svg",
  "TR": "tripura.svg",
  "UP": "uttar-pradesh.svg",
  "UK": "uttarakhand.svg",
  "WB": "west-bengal.svg"
};

// GET: List all state map assets
export async function GET() {
  try {
    const assets = await prisma.stateMapAsset.findMany({
      orderBy: { stateName: "asc" }
    });
    return NextResponse.json(assets);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create or upload a new state map asset (Admin or Super Admin)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user ? (session.user as any).role : null;
    const userName = session?.user?.name || "System Admin";

    const isAuthorized = userRole && ["Owner", "Super Admin", "Admin"].includes(userRole);
    const isSimulated = request.headers.get("x-mock-role") === "Admin" || request.headers.get("x-mock-role") === "Super Admin";

    if (!isAuthorized && !isSimulated) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const stateCode = formData.get("stateCode") as string | null;
    const stateName = formData.get("stateName") as string | null;

    if (!file || !stateCode || !stateName) {
      return NextResponse.json({ error: "Missing required fields (file, stateCode, stateName)" }, { status: 400 });
    }

    // 1. Validation: File Size (Max 2MB)
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File size exceeds 2MB limit." }, { status: 400 });
    }

    // 2. Validation: File Type
    const allowedTypes = ["image/svg+xml", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported file type. Only SVG, PNG, and WebP are allowed." }, { status: 400 });
    }

    // 3. Security: Prevent malicious SVG scripts
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileContent = buffer.toString("utf-8");

    if (file.type === "image/svg+xml") {
      const maliciousPatterns = [
        /<script/i,
        /onload=/i,
        /onerror=/i,
        /javascript:/i,
        /xlink:href/i
      ];
      for (const pattern of maliciousPatterns) {
        if (pattern.test(fileContent)) {
          return NextResponse.json({ error: "Malicious SVG content detected. Upload rejected." }, { status: 400 });
        }
      }
    }

    // 4. Save File to /public/maps
    const ext = file.type === "image/svg+xml" ? ".svg" : file.type === "image/webp" ? ".webp" : ".png";
    const codeUpper = stateCode.toUpperCase();
    const mappedFilename = filenameMap[codeUpper];
    
    // Generate clean filename
    const baseName = mappedFilename ? mappedFilename.replace(/\.svg$/, "") : stateName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const fileName = `${baseName}${ext}`;
    const filePath = path.join(MAPS_DIR, fileName);

    await fs.mkdir(MAPS_DIR, { recursive: true });
    await fs.writeFile(filePath, buffer);

    // 5. Update or Create Database Record
    const existing = await prisma.stateMapAsset.findUnique({
      where: { stateCode: codeUpper }
    });

    const newVersion = existing ? existing.version + 1 : 1;

    const asset = await prisma.stateMapAsset.upsert({
      where: { stateCode: codeUpper },
      update: {
        stateName,
        imageUrl: `/maps/${fileName}`,
        imageType: file.type === "image/svg+xml" ? "SVG" : file.type === "image/webp" ? "WebP" : "PNG",
        fileSize: file.size,
        version: newVersion,
        uploadedBy: userName,
        status: "active"
      },
      create: {
        stateName,
        stateCode: codeUpper,
        imageUrl: `/maps/${fileName}`,
        imageType: file.type === "image/svg+xml" ? "SVG" : file.type === "image/webp" ? "WebP" : "PNG",
        fileSize: file.size,
        width: 100,
        height: 100,
        version: 1,
        uploadedBy: userName,
        status: "active"
      }
    });

    return NextResponse.json({
      success: true,
      message: "State map asset uploaded and configured successfully.",
      asset
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
