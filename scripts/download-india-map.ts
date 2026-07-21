import https from "https";
import fs from "fs";
import path from "path";

const SOURCE_URL = "https://cdn.jsdelivr.net/npm/@svg-maps/india@2.0.0/india.svg";
const filePath = path.join(process.cwd(), "public", "maps", "india.svg");

console.log("Downloading master India SVG map...");

https.get(SOURCE_URL, (res) => {
  const fileStream = fs.createWriteStream(filePath);
  res.pipe(fileStream);
  fileStream.on("finish", () => {
    console.log("Successfully saved master India SVG map to public/maps/india.svg!");
    process.exit();
  });
}).on("error", (e) => {
  console.error("Failed to download master map:", e.message);
});
