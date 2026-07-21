const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const apiDir = path.join(__dirname, "../app/api");

console.log("Starting static HTML export build process...");

const nextDir = path.join(__dirname, "../.next");
if (fs.existsSync(nextDir)) {
  console.log("Cleaning Next.js cache directory (.next) to prevent typescript typing collisions...");
  fs.rmSync(nextDir, { recursive: true, force: true });
}

const renamedFiles = [];

// Helper to recursively find and rename route.ts files
function toggleRoutes(dir, backup = true) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      toggleRoutes(fullPath, backup);
    } else if (backup && (file === "route.ts" || file === "route.js")) {
      const backupPath = fullPath + ".bak";
      fs.renameSync(fullPath, backupPath);
      renamedFiles.push({ original: fullPath, backup: backupPath });
    }
  }
}

try {
  console.log("Generating static database JSON files for static client access...");
  execSync("npx tsx scripts/generate-static-data.ts", { stdio: "inherit" });

  console.log("Temporarily renaming route files under app/api to exclude them from build...");
  toggleRoutes(apiDir, true);
  console.log(`Successfully backed up ${renamedFiles.length} route files.`);

  console.log("Running Next.js production build...");
  execSync("npx next build", { env: { ...process.env, STATIC_EXPORT: "true" }, stdio: "inherit" });
  console.log("Next.js build completed successfully.");

} catch (error) {
  console.error("Next.js build execution encountered an error:", error.message);
  if (error.stdout) console.log("Build Stdout:", error.stdout.toString());
  if (error.stderr) console.error("Build Stderr:", error.stderr.toString());
  process.exitCode = 1;
} finally {
  console.log("Restoring all route files from backup...");
  for (const entry of renamedFiles) {
    if (fs.existsSync(entry.backup)) {
      fs.renameSync(entry.backup, entry.original);
    }
  }
  console.log("Restored all route files successfully.");
}
