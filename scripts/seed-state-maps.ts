import { prisma } from "../lib/db";
import fs from "fs";
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

async function seed() {
  console.log("Seeding StateMapAsset database records...");
  const states = await prisma.state.findMany();
  let count = 0;
  
  for (const st of states) {
    const code = st.code.toUpperCase();
    const fileName = filenameMap[code];
    if (!fileName) continue;
    
    const filePath = path.join(MAPS_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: Map file not found at ${filePath}`);
      continue;
    }
    
    const stats = fs.statSync(filePath);
    
    // Upsert record
    await prisma.stateMapAsset.upsert({
      where: { stateCode: code },
      update: {},
      create: {
        stateName: st.name,
        stateCode: code,
        imageUrl: `/maps/${fileName}`,
        imageType: "SVG",
        fileSize: stats.size,
        width: 100,
        height: 100,
        version: 1,
        uploadedBy: "System Default Seeder",
        status: "active"
      }
    });
    count++;
  }
  
  console.log(`Seeded ${count} StateMapAsset entries.`);
}

seed()
  .catch(err => {
    console.error("Error during seeding:", err);
  })
  .finally(() => {
    process.exit();
  });
