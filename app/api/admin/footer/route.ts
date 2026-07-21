import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const sections = await prisma.footerSection.findMany({
      include: {
        links: {
          orderBy: { order: "asc" }
        }
      },
      orderBy: { order: "asc" }
    });

    const socialLinks = await prisma.footerSocialLink.findMany();
    const paymentMethods = await prisma.footerPaymentMethod.findMany();
    const shippingPartners = await prisma.footerShippingPartner.findMany();
    const certifications = await prisma.footerCertification.findMany();
    const contactInfo = await prisma.footerContactInfo.findFirst();
    const languages = await prisma.footerLanguage.findMany();
    const currencies = await prisma.footerCurrency.findMany();
    const settings = await prisma.footerSettings.findFirst();
    
    // Subscribed email counts for the admin board
    const subscribers = await prisma.footerNewsletter.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      sections,
      socialLinks,
      paymentMethods,
      shippingPartners,
      certifications,
      contactInfo: contactInfo || {
        corporateOffice: "", registeredOffice: "", email: "", phone: "", whatsApp: "", businessHours: "", googleMapsUrl: ""
      },
      languages,
      currencies,
      settings: settings || {
        copyright: "", companyRegistration: "", gstNumber: "", trademark: "", accessibilityStmt: "", cookieSettings: "", versionNumber: "1.0.0"
      },
      subscribers
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const roleHeader = req.headers.get("x-mock-role") || "Admin";
    const allowed = ["Owner", "Super Admin", "Admin"].includes(roleHeader);
    if (!allowed) {
      return NextResponse.json({ error: "Access denied: Unauthorized role" }, { status: 403 });
    }

    const body = await req.json();

    // 1. Update Sections & Links
    if (body.sections && Array.isArray(body.sections)) {
      for (const sec of body.sections) {
        await prisma.footerSection.upsert({
          where: { id: sec.id },
          update: {
            title: sec.title,
            isEnabled: sec.isEnabled,
            order: sec.order
          },
          create: {
            id: sec.id,
            title: sec.title,
            isEnabled: sec.isEnabled,
            order: sec.order
          }
        });

        // Recreate links for clean alignment
        await prisma.footerLink.deleteMany({ where: { sectionId: sec.id } });
        if (sec.links && Array.isArray(sec.links)) {
          await prisma.footerLink.createMany({
            data: sec.links.map((l: any, idx: number) => ({
              label: l.label,
              url: l.url,
              order: idx + 1,
              isEnabled: l.isEnabled !== false,
              sectionId: sec.id
            }))
          });
        }
      }
    }

    // 2. Update Social Links
    if (body.socialLinks && Array.isArray(body.socialLinks)) {
      for (const item of body.socialLinks) {
        await prisma.footerSocialLink.upsert({
          where: { platform: item.platform },
          update: { url: item.url, isEnabled: item.isEnabled },
          create: { platform: item.platform, url: item.url, isEnabled: item.isEnabled }
        });
      }
    }

    // 3. Update Contact Metadata
    if (body.contactInfo) {
      const current = await prisma.footerContactInfo.findFirst();
      if (current) {
        await prisma.footerContactInfo.update({
          where: { id: current.id },
          data: body.contactInfo
        });
      } else {
        await prisma.footerContactInfo.create({
          data: body.contactInfo
        });
      }
    }

    // 4. Update Legal settings
    if (body.settings) {
      const current = await prisma.footerSettings.findFirst();
      if (current) {
        await prisma.footerSettings.update({
          where: { id: current.id },
          data: body.settings
        });
      } else {
        await prisma.footerSettings.create({
          data: body.settings
        });
      }
    }

    return NextResponse.json({ success: true, message: "Footer configurations successfully published!" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
