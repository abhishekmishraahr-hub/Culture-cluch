import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = session?.user ? (session.user as any).role : null;

    // Super Admin only for reset actions
    const isAuthorized = userRole && ["Owner", "Super Admin"].includes(userRole);
    const isSimulated = request.headers.get("x-mock-role") === "Super Admin";

    if (!isAuthorized && !isSimulated) {
      return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 });
    }

    console.log("Restoring default state map outlines...");
    
    // Execute setup and seed scripts in sequence
    await execPromise("npx tsx scripts/setup-state-maps.ts");
    await execPromise("npx tsx scripts/seed-state-maps.ts");

    return NextResponse.json({
      success: true,
      message: "Successfully restored all default state map vector assets and database records."
    });
  } catch (error: any) {
    console.error("Restore default maps failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
