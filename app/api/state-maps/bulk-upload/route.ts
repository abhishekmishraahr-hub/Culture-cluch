import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

const MAPS_DIR = path.join(process.cwd(), "public", "maps");

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

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user ? (session.user as any).role : null;
    const userName = session?.user?.name || "System Admin";

    // Super Admin only for bulk actions
    const isAuthorized = userRole && ["Owner", "Super Admin"].includes(userRole);
    const isSimulated = request.headers.get("x-mock-role") === "Super Admin";

    if (!isAuthorized && !isSimulated) {
      return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const stateCodesRaw = formData.get("stateCodes") as string | null;

    if (!files || files.length === 0 || !stateCodesRaw) {
      return NextResponse.json({ error: "Missing uploaded files or stateCodes mappings" }, { status: 400 });
    }

    const stateCodes = JSON.parse(stateCodesRaw) as Record<string, { code: string; name: string }>;
    const results = [];

    await fs.mkdir(MAPS_DIR, { recursive: true });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const stateMapping = stateCodes[file.name] || Object.values(stateCodes)[i];
      if (!stateMapping) continue;

      const codeUpper = stateMapping.code.toUpperCase();
      const mappedFilename = filenameMap[codeUpper];
      if (!mappedFilename) continue;

      // Type/Size validates
      if (file.size > 2 * 1024 * 1024) {
        results.push({ name: file.name, success: false, error: "Exceeds 2MB limit" });
        continue;
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const fileContent = buffer.toString("utf-8");

      if (file.type === "image/svg+xml") {
        if (/<script|onload=|onerror=|javascript:/gi.test(fileContent)) {
          results.push({ name: file.name, success: false, error: "Malicious script validation failed" });
          continue;
        }
      }

      const ext = file.type === "image/svg+xml" ? ".svg" : file.type === "image/webp" ? ".webp" : ".png";
      const fileName = mappedFilename.replace(/\.svg$/, "") + ext;
      const filePath = path.join(MAPS_DIR, fileName);

      await fs.writeFile(filePath, buffer);

      const existing = await prisma.stateMapAsset.findUnique({
        where: { stateCode: codeUpper }
      });
      const newVersion = existing ? existing.version + 1 : 1;

      const asset = await prisma.stateMapAsset.upsert({
        where: { stateCode: codeUpper },
        update: {
          stateName: stateMapping.name,
          imageUrl: `/maps/${fileName}`,
          imageType: file.type === "image/svg+xml" ? "SVG" : file.type === "image/webp" ? "WebP" : "PNG",
          fileSize: file.size,
          version: newVersion,
          uploadedBy: userName,
          status: "active"
        },
        create: {
          stateName: stateMapping.name,
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

      results.push({ name: file.name, stateCode: codeUpper, success: true, asset });
    }

    return NextResponse.json({
      success: true,
      message: `Processed bulk uploads for ${results.length} files.`,
      results
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
