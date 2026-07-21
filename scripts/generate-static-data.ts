import fs from "fs";
import path from "path";
import { prisma } from "../lib/db";

const outputDir = path.join(__dirname, "../public/static-data");

async function generate() {
  console.log("Generating static database JSON files for static HTML export...");
  
  // Ensure output directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  try {
    // 1. Fetch and write categories
    console.log("Fetching categories...");
    const categories = await prisma.category.findMany({
      include: {
        subcategories: {
          orderBy: { name: "asc" }
        }
      },
      orderBy: { name: "asc" }
    });
    fs.writeFileSync(
      path.join(outputDir, "categories.json"),
      JSON.stringify(categories, null, 2)
    );
    console.log(`Saved ${categories.length} categories.`);

    // 2. Fetch and write states
    console.log("Fetching states...");
    const states = await prisma.state.findMany({
      include: {
        districts: {
          orderBy: { name: "asc" }
        }
      },
      orderBy: { name: "asc" }
    });
    fs.writeFileSync(
      path.join(outputDir, "states.json"),
      JSON.stringify(states, null, 2)
    );
    console.log(`Saved ${states.length} states.`);

    // 3. Fetch and write products
    console.log("Fetching products...");
    const products = await prisma.product.findMany({
      include: {
        images: true,
        category: true,
        district: {
          include: {
            state: true
          }
        },
        variants: true,
        culturalStory: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    fs.writeFileSync(
      path.join(outputDir, "products.json"),
      JSON.stringify(products, null, 2)
    );
    console.log(`Saved ${products.length} products.`);

  } catch (error) {
    console.error("Failed to generate static database files:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

generate();
