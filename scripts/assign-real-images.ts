import { prisma } from "../lib/db";

// Curated high-quality Unsplash image mapping for ODOP products based on keywords
const KEYWORD_IMAGES: { keywords: string[]; urls: string[] }[] = [
  {
    keywords: ["saree", "sari", "silk", "handloom", "weaving", "weaver", "zari", "dhoti", "shawl", "carpet", "rug", "chikankari", "embroidery", "garment", "apparel", "textile", "fabric", "wool"],
    urls: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    keywords: ["tea", "coffee", "beverage"],
    urls: [
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    keywords: ["rice", "paddy", "wheat", "grain", "millet", "pulses", "barley", "maize", "cereal"],
    urls: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1574325131876-a799dc3e9447?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    keywords: ["spice", "spices", "chili", "chilly", "pepper", "turmeric", "ginger", "garlic", "cardamom", "clove", "cumin", "coriander", "mustard", "fennel", "saffron"],
    urls: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1608797178974-15b35a61d121?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    keywords: ["honey", "nectar", "sweetener"],
    urls: [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    keywords: ["mango", "banana", "orange", "lemon", "lime", "fruit", "fruits", "apple", "guava", "pineapple", "coconut", "makhana", "foxnut", "litchi", "cashew", "walnut", "almond"],
    urls: [
      "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1596178060810-72cb62112e75?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    keywords: ["pottery", "clay", "ceramic", "terracotta", "earthen", "glass", "glassware", "bangle", "mirror", "porcelain"],
    urls: [
      "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    keywords: ["wood", "wooden", "furniture", "carving", "sandalwood", "teak", "toy", "toys", "doll", "dolls", "lacquer", "lac"],
    urls: [
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    keywords: ["brass", "copper", "metal", "bronze", "silver", "gold", "steel", "iron", "bell", "jewelry", "ornaments", "aluminium", "hardware"],
    urls: [
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    keywords: ["painting", "art", "paint", "drawing", "folk", "craft", "embroidery", "leather", "footwear", "shoe", "shoes", "jutti", "chappal", "handbag", "bag", "purse", "wallet"],
    urls: [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1524498250077-390f9e378db0?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    keywords: ["bamboo", "cane", "straw", "grass", "jute", "fibre", "coir", "basket", "mats", "broom"],
    urls: [
      "https://images.unsplash.com/photo-1501747315-124a0eaca060?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80"
    ]
  }
];

async function assignImages() {
  console.log("Starting matching of real product images from Unsplash based on product names...");
  
  try {
    const products = await prisma.product.findMany({
      include: { images: true }
    });

    console.log(`Analyzing ${products.length} database products...`);

    let updatedCount = 0;

    for (const p of products) {
      const nameLower = p.name.toLowerCase();
      const descLower = p.description.toLowerCase();
      
      let matchedUrls: string[] | null = null;

      // Scan keywords mapping to find match
      for (const entry of KEYWORD_IMAGES) {
        const hasKeyword = entry.keywords.some(
          kw => nameLower.includes(kw) || descLower.includes(kw)
        );
        if (hasKeyword) {
          matchedUrls = entry.urls;
          break;
        }
      }

      // If matched, update images in DB
      if (matchedUrls && matchedUrls.length > 0) {
        // Delete old image references
        await prisma.productImage.deleteMany({
          where: { productId: p.id }
        });

        // Add matching image references
        for (let i = 0; i < Math.min(matchedUrls.length, 3); i++) {
          await prisma.productImage.create({
            data: {
              productId: p.id,
              url: matchedUrls[i]
            }
          });
        }
        updatedCount++;
      }
    }

    console.log(`Successfully updated ${updatedCount} products with matching real images!`);
  } catch (error) {
    console.error("Encountered error during image assignment:", error);
  } finally {
    await prisma.$disconnect();
  }
}

assignImages();
