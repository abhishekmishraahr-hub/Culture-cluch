import https from "https";
import fs from "fs";
import path from "path";

const SOURCE_URL = "https://cdn.jsdelivr.net/npm/@svg-maps/india@2.0.0/india.svg";
const MAPS_DIR = path.join(process.cwd(), "public", "maps");

const filenameMap: Record<string, string> = {
  "an": "andaman-nicobar.svg",
  "ap": "andhra-pradesh.svg",
  "ar": "arunachal-pradesh.svg",
  "as": "assam.svg",
  "br": "bihar.svg",
  "ch": "chandigarh.svg",
  "cg": "chhattisgarh.svg",
  "ct": "chhattisgarh.svg", // Handle CT code for Chhattisgarh in some SVGs
  "dn": "dadra-nagar-haveli-daman-diu.svg",
  "dl": "delhi.svg",
  "ga": "goa.svg",
  "gj": "gujarat.svg",
  "hr": "haryana.svg",
  "hp": "himachal-pradesh.svg",
  "jk": "jammu-kashmir.svg",
  "jh": "jharkhand.svg",
  "ka": "karnataka.svg",
  "kl": "kerala.svg",
  "la": "ladakh.svg",
  "ld": "lakshadweep.svg",
  "mp": "madhya-pradesh.svg",
  "mh": "maharashtra.svg",
  "mn": "manipur.svg",
  "ml": "meghalaya.svg",
  "mz": "mizoram.svg",
  "nl": "nagaland.svg",
  "or": "odisha.svg",
  "py": "puducherry.svg",
  "pb": "punjab.svg",
  "rj": "rajasthan.svg",
  "sk": "sikkim.svg",
  "tn": "tamil-nadu.svg",
  "tg": "telangana.svg",
  "tr": "tripura.svg",
  "up": "uttar-pradesh.svg",
  "ut": "uttarakhand.svg",
  "wb": "west-bengal.svg"
};

// Simplified parser to estimate the bounding box of a path
function getPathBoundingBox(d: string) {
  const tokens = d.match(/[a-df-z]|[+-]?\d+(?:\.\d+)?/gi) || [];
  let curX = 0;
  let curY = 0;
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  
  let i = 0;
  let currentCmd = '';
  
  while (i < tokens.length) {
    const token = tokens[i];
    if (isNaN(Number(token))) {
      currentCmd = token;
      i++;
    }
    
    const cmdUpper = currentCmd.toUpperCase();
    const isRelative = currentCmd !== cmdUpper;
    
    if (cmdUpper === 'M' || cmdUpper === 'L' || cmdUpper === 'T') {
      const x = Number(tokens[i++]);
      const y = Number(tokens[i++]);
      curX = isRelative ? curX + x : x;
      curY = isRelative ? curY + y : y;
      updateBounds(curX, curY);
    } else if (cmdUpper === 'H') {
      const x = Number(tokens[i++]);
      curX = isRelative ? curX + x : x;
      updateBounds(curX, curY);
    } else if (cmdUpper === 'V') {
      const y = Number(tokens[i++]);
      curY = isRelative ? curY + y : y;
      updateBounds(curX, curY);
    } else if (cmdUpper === 'C') {
      const x1 = Number(tokens[i++]);
      const y1 = Number(tokens[i++]);
      const x2 = Number(tokens[i++]);
      const y2 = Number(tokens[i++]);
      const x = Number(tokens[i++]);
      const y = Number(tokens[i++]);
      curX = isRelative ? curX + x : x;
      curY = isRelative ? curY + y : y;
      updateBounds(curX, curY);
    } else if (cmdUpper === 'S' || cmdUpper === 'Q') {
      const x1 = Number(tokens[i++]);
      const y1 = Number(tokens[i++]);
      const x = Number(tokens[i++]);
      const y = Number(tokens[i++]);
      curX = isRelative ? curX + x : x;
      curY = isRelative ? curY + y : y;
      updateBounds(curX, curY);
    } else if (cmdUpper === 'A') {
      const rx = Number(tokens[i++]);
      const ry = Number(tokens[i++]);
      const xaxis = Number(tokens[i++]);
      const largearc = Number(tokens[i++]);
      const sweep = Number(tokens[i++]);
      const x = Number(tokens[i++]);
      const y = Number(tokens[i++]);
      curX = isRelative ? curX + x : x;
      curY = isRelative ? curY + y : y;
      updateBounds(curX, curY);
    } else if (cmdUpper === 'Z') {
      // Closed path
    } else {
      i++;
    }
  }
  
  function updateBounds(x: number, y: number) {
    if (!isNaN(x) && !isNaN(y)) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  
  return {
    x: minX === Infinity ? 0 : minX,
    y: minY === Infinity ? 0 : minY,
    width: maxX === -Infinity ? 100 : (maxX - minX),
    height: maxY === -Infinity ? 100 : (maxY - minY)
  };
}

console.log("Downloading India states SVG map...");

if (!fs.existsSync(MAPS_DIR)) {
  fs.mkdirSync(MAPS_DIR, { recursive: true });
}

https.get(SOURCE_URL, (res) => {
  let body = "";
  res.on("data", (chunk) => body += chunk);
  res.on("end", () => {
    // Regex matching across multi-line path nodes
    const pathRegex = /<path[\s\S]*?id="([^"]+)"[\s\S]*?aria-label="([^"]+)"[\s\S]*?d="([\s\S]*?)"/g;
    let match;
    let count = 0;
    
    while ((match = pathRegex.exec(body)) !== null) {
      const rawId = match[1].toLowerCase();
      const name = match[2];
      const d = match[3].trim().replace(/\s+/g, " ");
      
      const fileNames = [];
      if (filenameMap[rawId]) {
        fileNames.push(filenameMap[rawId]);
      }
      
      // Special mappings:
      // If Jammu & Kashmir, also duplicate/write for Ladakh
      if (rawId === "jk") {
        fileNames.push("ladakh.svg");
      }
      
      for (const fileName of fileNames) {
        const bbox = getPathBoundingBox(d);
        const padding = 2;
        const vx = bbox.x - padding;
        const vy = bbox.y - padding;
        const vw = bbox.width + padding * 2;
        const vh = bbox.height + padding * 2;

        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx} ${vy} ${vw} ${vh}" width="100%" height="100%">
  <path
    d="${d}"
    fill="currentColor"
    stroke="currentColor"
    stroke-width="0.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>`;

        fs.writeFileSync(path.join(MAPS_DIR, fileName), svgContent, "utf-8");
        count++;
      }
    }
    console.log(`Successfully generated ${count} individual state SVG map outlines under public/maps/!`);
  });
}).on("error", (e) => {
  console.error("Failed to download map assets:", e.message);
});
