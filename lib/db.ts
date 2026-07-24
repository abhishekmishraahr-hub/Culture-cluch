import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import fs from "fs";
import path from "path";

let prisma: PrismaClient;
let dbUrl = "file:./prisma/dev.db";

// Copy SQLite database to /tmp on Vercel to make it writable
if (process.env.VERCEL || process.env.NODE_ENV === "production") {
  const srcPath = path.join(process.cwd(), "prisma", "dev.db");
  const destPath = "/tmp/dev.db";
  try {
    if (fs.existsSync(srcPath)) {
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
        fs.chmodSync(destPath, 0o666);
      }
    }
    dbUrl = "file:/tmp/dev.db";
  } catch (err) {
    console.error("Failed to copy SQLite database to /tmp:", err);
  }
}

if (process.env.NODE_ENV === "production") {
  const adapter = new PrismaBetterSqlite3({ url: dbUrl });
  prisma = new PrismaClient({ adapter });
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prisma?: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    const adapter = new PrismaBetterSqlite3({ url: dbUrl });
    globalWithPrisma.prisma = new PrismaClient({ adapter });
  }
  prisma = globalWithPrisma.prisma;
}

export { prisma };
