import { prisma } from "../lib/db";

async function main() {
  console.log("Seeding footer databases...");

  // 1. Clear existing footer data to prevent duplicates
  await prisma.footerLink.deleteMany({});
  await prisma.footerSection.deleteMany({});
  await prisma.footerSocialLink.deleteMany({});
  await prisma.footerPaymentMethod.deleteMany({});
  await prisma.footerShippingPartner.deleteMany({});
  await prisma.footerCertification.deleteMany({});
  await prisma.footerContactInfo.deleteMany({});
  await prisma.footerLanguage.deleteMany({});
  await prisma.footerCurrency.deleteMany({});
  await prisma.footerSettings.deleteMany({});

  // 2. Seed Footer Sections & Links
  const shopSec = await prisma.footerSection.create({
    data: { title: "Shop Catalog", order: 1, isEnabled: true }
  });
  await prisma.footerLink.createMany({
    data: [
      { sectionId: shopSec.id, label: "All Products", url: "/products", order: 1 },
      { sectionId: shopSec.id, label: "New Arrivals", url: "/products?sort=newest", order: 2 },
      { sectionId: shopSec.id, label: "Best Sellers", url: "/products?sort=popular", order: 3 },
      { sectionId: shopSec.id, label: "Curated Collections", url: "/products?isFeatured=true", order: 4 }
    ]
  });

  const categorySec = await prisma.footerSection.create({
    data: { title: "Heritage Categories", order: 2, isEnabled: true }
  });
  await prisma.footerLink.createMany({
    data: [
      { sectionId: categorySec.id, label: "Handloom & Silks", url: "/products?category=handloom-textiles", order: 1 },
      { sectionId: categorySec.id, label: "Heritage Pottery", url: "/products?category=pottery", order: 2 },
      { sectionId: categorySec.id, label: "Nakshi Metal Crafts", url: "/products?category=metal-crafts", order: 3 },
      { sectionId: categorySec.id, label: "Madhubani Paintings", url: "/products?category=art-folk-painting", order: 4 }
    ]
  });

  const supportSec = await prisma.footerSection.create({
    data: { title: "Customer Service", order: 3, isEnabled: true }
  });
  await prisma.footerLink.createMany({
    data: [
      { sectionId: supportSec.id, label: "Contact Support", url: "/profile", order: 1 },
      { sectionId: supportSec.id, label: "Help Center & FAQs", url: "/about", order: 2 },
      { sectionId: supportSec.id, label: "Track Your Order", url: "/orders", order: 3 },
      { sectionId: supportSec.id, label: "Returns & Exchanges", url: "/about", order: 4 }
    ]
  });

  const partnerSec = await prisma.footerSection.create({
    data: { title: "Partner Programs", order: 4, isEnabled: true }
  });
  await prisma.footerLink.createMany({
    data: [
      { sectionId: partnerSec.id, label: "Become a Seller", url: "/vendor/dashboard", order: 1 },
      { sectionId: partnerSec.id, label: "Artisan Onboarding", url: "/vendor/dashboard", order: 2 },
      { sectionId: partnerSec.id, label: "Corporate Gifting", url: "/about", order: 3 },
      { sectionId: partnerSec.id, label: "Quality Guidelines", url: "/about", order: 4 }
    ]
  });

  const missionSec = await prisma.footerSection.create({
    data: { title: "National Missions", order: 5, isEnabled: true }
  });
  await prisma.footerLink.createMany({
    data: [
      { sectionId: missionSec.id, label: "One District One Product", url: "/about", order: 1 },
      { sectionId: missionSec.id, label: "Vocal for Local Campaign", url: "/about", order: 2 },
      { sectionId: missionSec.id, label: "Make in India Certified", url: "/about", order: 3 },
      { sectionId: missionSec.id, label: "GI tagged registry", url: "/about", order: 4 }
    ]
  });

  // 3. Seed Social Links
  await prisma.footerSocialLink.createMany({
    data: [
      { platform: "Instagram", url: "https://instagram.com/culturalclutch" },
      { platform: "Facebook", url: "https://facebook.com/culturalclutch" },
      { platform: "YouTube", url: "https://youtube.com/culturalclutch" },
      { platform: "LinkedIn", url: "https://linkedin.com/company/culturalclutch" },
      { platform: "X (Twitter)", url: "https://twitter.com/culturalclutch" }
    ]
  });

  // 4. Seed Payments
  await prisma.footerPaymentMethod.createMany({
    data: [
      { name: "UPI", imageUrl: "/logo.jpg" },
      { name: "Visa", imageUrl: "/logo.jpg" },
      { name: "Mastercard", imageUrl: "/logo.jpg" },
      { name: "RuPay", imageUrl: "/logo.jpg" }
    ]
  });

  // 5. Seed Shipping
  await prisma.footerShippingPartner.createMany({
    data: [
      { name: "Delhivery", imageUrl: "/logo.jpg" },
      { name: "Blue Dart", imageUrl: "/logo.jpg" },
      { name: "India Post", imageUrl: "/logo.jpg" },
      { name: "DTDC", imageUrl: "/logo.jpg" }
    ]
  });

  // 6. Seed Certifications
  await prisma.footerCertification.createMany({
    data: [
      { name: "GI Certified", imageUrl: "/logo.jpg" },
      { name: "MSME Registered", imageUrl: "/logo.jpg" },
      { name: "SSL Protected", imageUrl: "/logo.jpg" }
    ]
  });

  // 7. Contact Metadata
  await prisma.footerContactInfo.create({
    data: {
      corporateOffice: "Cultural Clutch Hub, Sector 62, Noida, UP, 201301",
      registeredOffice: "Heritage House, 12 Kalakshetra Road, Chennai, TN, 600041",
      email: "care@culturalclutch.com",
      phone: "+91 88001 23456",
      whatsApp: "+91 88001 23456",
      businessHours: "Monday to Saturday: 9:00 AM - 6:00 PM IST",
      googleMapsUrl: "https://maps.google.com"
    }
  });

  // 8. Languages & Currencies
  await prisma.footerLanguage.createMany({
    data: [
      { code: "en", name: "English" },
      { code: "hi", name: "Hindi" },
      { code: "ta", name: "Tamil" },
      { code: "te", name: "Telugu" }
    ]
  });

  await prisma.footerCurrency.createMany({
    data: [
      { code: "INR", name: "Indian Rupee", symbol: "₹" },
      { code: "USD", name: "US Dollar", symbol: "$" },
      { code: "EUR", name: "Euro", symbol: "€" }
    ]
  });

  // 9. Legal & Settings
  await prisma.footerSettings.create({
    data: {
      copyright: "© 2026 Cultural Clutch. Celebrating Indian Crafts & Agriculture Heritage.",
      companyRegistration: "U74999TN2026PTC123456",
      gstNumber: "33AAAAA1111A1Z1",
      trademark: "Cultural Clutch® is a registered trademark of Heritage Holdings Pvt. Ltd.",
      accessibilityStmt: "Our website complies with WCAG 2.1 Level AA specifications to serve all collectors.",
      cookieSettings: "Functional cookies are stored locally to personalize language and cart configurations.",
      versionNumber: "2.1.0"
    }
  });

  console.log("Footer database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
