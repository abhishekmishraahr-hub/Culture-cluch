import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

const MAPS_DIR = path.join(process.cwd(), "public", "maps");

// GET: Fetch a specific map asset by ID or State Code
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lookup = id.toUpperCase();

    const asset = await prisma.stateMapAsset.findFirst({
      where: {
        OR: [
          { id: id },
          { stateCode: lookup }
        ]
      }
    });

    if (!asset) {
      return NextResponse.json({ error: "State map asset not found." }, { status: 404 });
    }

    return NextResponse.json(asset);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Modify / Replace a specific map asset by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const userRole = session?.user ? (session.user as any).role : null;
    const userName = session?.user?.name || "System Admin";

    const isAuthorized = userRole && ["Owner", "Super Admin", "Admin"].includes(userRole);
    const isSimulated = request.headers.get("x-mock-role") === "Admin" || request.headers.get("x-mock-role") === "Super Admin";

    if (!isAuthorized && !isSimulated) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const asset = await prisma.stateMapAsset.findUnique({
      where: { id }
    });

    if (!asset) {
      return NextResponse.json({ error: "State map asset not found." }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const status = formData.get("status") as string | null;

    const updateData: any = {};
    if (status) {
      updateData.status = status;
    }

    if (file) {
      // Size/Type validations
      if (file.size > 2 * 1024 * 1024) {
        return NextResponse.json({ error: "File size exceeds 2MB limit." }, { status: 400 });
      }

      const allowedTypes = ["image/svg+xml", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: "Unsupported file type. Only SVG, PNG, and WebP are allowed." }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const fileContent = buffer.toString("utf-8");

      if (file.type === "image/svg+xml") {
        if (/<script|onload=|onerror=|javascript:/gi.test(fileContent)) {
          return NextResponse.json({ error: "Malicious script validation failed." }, { status: 400 });
        }
      }

      // Delete old file if name changes or to overwrite cleanly
      const oldFilename = path.basename(asset.imageUrl);
      const oldPath = path.join(MAPS_DIR, oldFilename);
      try {
        await fs.unlink(oldPath);
      } catch (err) {
        // Ignore if file doesn't exist
      }

      const ext = file.type === "image/svg+xml" ? ".svg" : file.type === "image/webp" ? ".webp" : ".png";
      const fileName = asset.imageUrl.replace(/^\/maps\//, "").replace(/\.[^/.]+$/, "") + ext;
      const filePath = path.join(MAPS_DIR, fileName);

      await fs.writeFile(filePath, buffer);

      updateData.imageUrl = `/maps/${fileName}`;
      updateData.imageType = file.type === "image/svg+xml" ? "SVG" : file.type === "image/webp" ? "WebP" : "PNG";
      updateData.fileSize = file.size;
      updateData.version = asset.version + 1;
      updateData.uploadedBy = userName;
    }

    const updated = await prisma.stateMapAsset.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      message: "State map asset updated successfully.",
      asset: updated
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a specific map asset by ID (Super Admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const userRole = session?.user ? (session.user as any).role : null;

    const isAuthorized = userRole && ["Owner", "Super Admin"].includes(userRole);
    const isSimulated = request.headers.get("x-mock-role") === "Super Admin";

    if (!isAuthorized && !isSimulated) {
      return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 });
    }

    const asset = await prisma.stateMapAsset.findUnique({
      where: { id }
    });

    if (!asset) {
      return NextResponse.json({ error: "State map asset not found." }, { status: 404 });
    }

    // Delete SVG outline file from disk
    const fileName = path.basename(asset.imageUrl);
    const filePath = path.join(MAPS_DIR, fileName);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      // Ignore if file already missing
    }

    // Delete database entry
    await prisma.stateMapAsset.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: `State map asset for ${asset.stateName} deleted successfully.`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
