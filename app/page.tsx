import React from "react";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { ArrowRight, Gift, Shield, CheckCircle, MapPin, Star, Sparkles, Compass } from "lucide-react";
import { prisma } from "@/lib/db";

// Dynamic Client Subcomponents
import TrustBar from "@/components/TrustBar";
import ShopByCategory from "@/components/ShopByCategory";
import InteractiveMap from "@/components/InteractiveMap";
import ArtisanStories from "@/components/ArtisanStories";
import ProductCarousels from "@/components/ProductCarousels";
import AIShoppingAssistant from "@/components/AIShoppingAssistant";
import LivePurchasePopup from "@/components/LivePurchasePopup";
import MobileStickyBottomNav from "@/components/MobileStickyBottomNav";
import SafeImage from "@/components/SafeImage";

// Server subcomponents for page content
function HeroSection({ activeHero }: { activeHero: any }) {
  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-[#3D1E16]">
      {/* Background Image with Saffron/Indigo Overlay */}
      <div className="absolute inset-0 z-0">
        <SafeImage
          src={activeHero.imageUrl}
          alt="Indian Artisan Heritage Banner"
          className="opacity-25 object-center"
          wrapperClassName="w-full h-full"
          priority={true}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3D1E16] via-[#3D1E16]/85 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
          {/* Left Col: Text & Buttons */}
          <div className="space-y-6 text-white text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-[#B56D3E] text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-md">
              <Gift className="w-3.5 h-3.5 text-white animate-pulse" /> ODOP Celebration
            </div>

            <h1 className="hero-title text-gradient-gold mb-4 leading-tight">
              {activeHero.title}
            </h1>

            <p className="paragraph text-sand/80 max-w-lg font-serif">
              {activeHero.subtitle}
            </p>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link
                href="/products"
                className="button-text px-6 py-3.5 bg-copper hover:bg-copper/90 text-white rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                Shop By State
              </Link>
              <Link
                href="/products"
                className="button-text px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/25 text-white rounded-xl transition-all active:scale-95"
              >
                Meet Artisans
              </Link>
            </div>
          </div>

          {/* Right Col: statistics */}
          <div className="hidden md:flex flex-col justify-center items-center gap-6 select-none">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#C09355]/20 rounded-full blur-xl group-hover:bg-[#C09355]/45 transition-all duration-500" />
              <SafeImage
                src="/logo.jpg"
                alt="Cultural Clutch Brand Emblem"
                className="object-cover"
                wrapperClassName="relative w-40 h-40 lg:w-48 lg:h-48 rounded-full border-4 border-[#C09355]/30 shadow-2xl transition-transform duration-500 hover:scale-105"
                priority={true}
              />
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm text-left">
              {[
                { number: "750+", label: "Districts Represented" },
                { number: "5000+", label: "Certified Artisans" },
                { number: "28", label: "States Outlined" },
                { number: "1M+", label: "Happy Collectors" }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-white/15">
                  <span className="block display-title text-gold text-2xl font-bold">{stat.number}</span>
                  <span className="label text-sand/70 tracking-widest text-[9px]">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedCollectionsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="section-heading text-[#3D1E16] dark:text-[#FAF5EE] flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-[#B56D3E]" />
          Curated Showcases
        </h2>
        <p className="sub-heading text-center mt-1">Exquisite selections curated for high artistic legacy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        {[
          { title: "Luxury Collection", desc: "Premium Paithani silks & certified sandalwood carvings.", tag: "Royal Heritage", img: "https://images.unsplash.com/photo-1596178060810-72cb62112e75?auto=format&fit=crop&w=600&q=80" },
          { title: "Collector's Edition", desc: "Museum-quality brass statues and hand-painted scrolls.", tag: "Limited Run", img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80" },
          { title: "Limited Curation", desc: "Naturally dyed tribal bamboo works and rare folk art.", tag: "Rare Finds", img: "https://images.unsplash.com/photo-1596178060810-72cb62112e75?auto=format&fit=crop&w=600&q=80" }
        ].map((col, idx) => (
          <div key={idx} className="group relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#C09355]/20 shadow-md">
            <SafeImage
              src={col.img}
              alt={col.title}
              className="opacity-75 group-hover:scale-105 transition-transform duration-500"
              wrapperClassName="w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#25120D] via-[#25120D]/65 to-transparent z-10" />
            <div className="absolute bottom-6 left-6 right-6 z-20 space-y-2 text-left flex flex-col">
              <span className="badge bg-[#B56D3E] text-white self-start">{col.tag}</span>
              <h3 className="product-name text-white font-bold leading-tight">{col.title}</h3>
              <p className="description text-gray-300 font-serif leading-relaxed text-[11px]">{col.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ShopByDistrictSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="section-heading text-[#3D1E16] dark:text-[#FAF5EE] flex items-center justify-center gap-2">
          <MapPin className="w-5 h-5 text-[#B56D3E]" />
          Shop By District
        </h2>
        <p className="sub-heading text-center mt-1">Explore craft capitals and historical district hubs</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
        {[
          { name: "Jaipur, RJ", craft: "Blue Pottery City", link: "/products?state=RJ", img: "https://images.unsplash.com/photo-1596178060810-72cb62112e75?auto=format&fit=crop&w=400&q=80" },
          { name: "Varanasi, UP", craft: "Handloom Brocades", link: "/products?state=UP", img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80" },
          { name: "Srinagar, JK", craft: "Pashmina & Carpets", link: "/products?state=JK", img: "https://images.unsplash.com/photo-1596178060810-72cb62112e75?auto=format&fit=crop&w=400&q=80" },
          { name: "Mysuru, KA", craft: "Sandalwood Carvings", link: "/products?state=KA", img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80" }
        ].map((dist, idx) => (
          <Link key={idx} href={dist.link} className="group relative aspect-square rounded-3xl overflow-hidden border border-[#C09355]/20 shadow-sm flex flex-col justify-end p-5">
            <SafeImage
              src={dist.img}
              alt={dist.name}
              className="opacity-60 group-hover:scale-105 transition-transform duration-500"
              wrapperClassName="absolute inset-0 w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#25120D] via-[#25120D]/50 to-transparent z-10" />
            <div className="relative z-20 space-y-1 text-left">
              <h3 className="product-name text-white font-bold leading-tight">{dist.name}</h3>
              <p className="district-name text-sand/90 tracking-wide font-sans text-[10px]">{dist.craft}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function StorytellingSection() {
  return (
    <section className="bg-[#3D1E16] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6 text-left">
          <span className="sub-heading text-gold">Civilizational Archive</span>
          <h2 className="section-heading text-white leading-tight font-bold">
            Preserving 5000 Years of Indian Craft Legacy
          </h2>
          <p className="paragraph text-sand/80 text-justify text-sm">
            From the terracotta seals of Mohenjo-daro to the royal silk brocades of medieval courts, India's craft legacy is a living history. Every thread, carving, and pottery dye represents centuries of geographical wisdom. By connecting artisans directly to conscious consumers, we ensure fair compensation, prevent craft extinction, and keep this rich inheritance alive for future generations.
          </p>
          <Link href="/about" className="button-text inline-flex items-center gap-2 px-6 py-3.5 bg-copper hover:bg-copper/90 text-white rounded-xl shadow transition-all active:scale-95">
            Explore About Us Editor →
          </Link>
        </div>
        <div className="rounded-3xl overflow-hidden border-2 border-[#C09355]/20 shadow-lg aspect-[4/3] bg-gray-900">
          <SafeImage
            src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
            alt="Weavers loom"
            className="object-cover"
            wrapperClassName="w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}

function FestivalSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="section-heading text-[#3D1E16] dark:text-[#FAF5EE] flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-[#B56D3E]" />
          Festive Showcases
        </h2>
        <p className="sub-heading text-center mt-1">Celebrate dynamic traditional holidays with curated craft sets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {[
          { name: "Diwali Curation 🪔", desc: "Genuine Moradabad brass diyas & organic festive sweet bowls.", img: "https://images.unsplash.com/photo-1596178060810-72cb62112e75?auto=format&fit=crop&w=800&q=80" },
          { name: "Onam Handlooms 🌾", desc: "Fine Kasavu gold-bordered handlooms from Kerala cooperatives.", img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80" }
        ].map((fest, idx) => (
          <div key={idx} className="group relative aspect-[16/9] rounded-3xl overflow-hidden border border-[#C09355]/20 shadow-md">
            <SafeImage
              src={fest.img}
              alt={fest.name}
              className="opacity-70 group-hover:scale-105 transition-transform duration-500"
              wrapperClassName="w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#25120D] via-[#25120D]/60 to-transparent z-10" />
            <div className="absolute bottom-5 left-5 right-5 z-20 space-y-1 text-left">
              <h3 className="product-name text-white font-bold leading-tight">{fest.name}</h3>
              <p className="description text-gray-300 leading-relaxed font-serif text-xs">{fest.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhyCulturalClutchSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="section-heading text-[#3D1E16] dark:text-[#FAF5EE] text-center">Why Cultural Clutch</h2>
        <p className="sub-heading text-center mt-1">Supporting local artisan economies sustainably</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        {[
          { title: "Direct Purchase", desc: "We bypass middle agents, sending margins directly to weavers and crafters." },
          { title: "GI Authenticity", desc: "All local products are verified for Geographical Indications (GI) registry." },
          { title: "Zero Plastic Curation", desc: "Shipped in 100% sustainable paper and cloth craft gift packaging." }
        ].map((why, idx) => (
          <div key={idx} className="p-6 bg-[#FDFBF7] border border-[#C09355]/20 rounded-3xl text-left space-y-2 shadow-sm">
            <h3 className="card-heading text-primary dark:text-[#FAF5EE] font-bold">{why.title}</h3>
            <p className="description text-foreground/80 dark:text-gray-300 leading-relaxed font-serif text-justify text-xs">{why.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CustomerReviewsSection({ testimonials }: { testimonials: any[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="section-heading text-[#3D1E16] dark:text-[#FAF5EE] text-center">Verified Customer Voice</h2>
        <p className="sub-heading text-center mt-1">What heritage collectors say about us</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {testimonials.map((t) => (
          <div key={t.id} className="p-6 bg-[#FDFBF7] border border-[#C09355]/25 rounded-3xl space-y-3 shadow-sm text-left">
            <div className="flex gap-1 text-yellow-600">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <p className="paragraph text-sm italic font-serif text-foreground/90 dark:text-gray-200">"{t.text}"</p>
            <div className="flex justify-between items-center label text-muted-text/80 pt-2.5 border-t border-[#C09355]/15">
              <span className="text-[#3D1E16]">{t.name}</span>
              <span>{t.location}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MembershipSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 pt-4">
      <div className="bg-gradient-to-r from-[#3D1E16] to-[#25120D] border border-[#C09355]/40 rounded-3xl p-8 text-center text-white relative overflow-hidden shadow-xl space-y-4">
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#C09355_1px,transparent_1px),linear-gradient(to_bottom,#C09355_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />
        <span className="badge bg-copper text-white inline-block">Collector Guild</span>
        <h3 className="section-heading text-gradient-gold text-2xl font-bold">Join Premium Cultural Membership</h3>
        <p className="paragraph text-sand/80 max-w-lg mx-auto leading-relaxed text-sm">
          Get free global shipping, early previews of rare artisan launches, reward point allocations, and invitations to exclusive master weaver virtual workshops.
        </p>
        <button className="button-text px-6 py-3 bg-copper hover:bg-copper/90 text-white rounded-xl transition-all shadow active:scale-95">
          Subscribe Guild
        </button>
      </div>
    </section>
  );
}

export default async function Home() {
  // Load configuration from local data storage (saved by admin panel)
  let configData = {
    sections: [
      { id: "Hero", name: "Hero Banner & Statistics", isEnabled: true, order: 1 },
      { id: "TrustBar", name: "Artisan Trust & Certifications", isEnabled: true, order: 2 },
      { id: "ShopByCategory", name: "Circular Category Explorer", isEnabled: true, order: 3 },
      { id: "InteractiveMap", name: "Interactive India Region Map", isEnabled: true, order: 4 },
      { id: "FeaturedCollections", name: "Heritage Featured Collections", isEnabled: true, order: 5 },
      { id: "ShopByDistrict", name: "One District One Product Slider", isEnabled: true, order: 6 },
      { id: "ArtisanStories", name: "Artisan Stories & Narratives", isEnabled: true, order: 7 },
      { id: "Storytelling", name: "Civilizational Storytelling Block", isEnabled: true, order: 8 },
      { id: "ProductCarousels", name: "Best Sellers & Deal Carousels", isEnabled: true, order: 9 },
      { id: "Festival", name: "Active Festive Showcases", isEnabled: true, order: 10 },
      { id: "WhyCulturalClutch", name: "Why Choose Us Infographics", isEnabled: true, order: 11 },
      { id: "CustomerReviews", name: "Verified Customer Reviews", isEnabled: true, order: 12 },
      { id: "Membership", name: "Premium Member Benefits Banner", isEnabled: true, order: 13 }
    ],
    activePromo: { text: "Festive Offer: 10% Discount on Paithani Handlooms. Use Code: HERITAGE10", isEnabled: true },
    testimonials: [
      { id: "t-1", name: "Ananya Sharma", location: "Jaipur, Rajasthan", text: "The Blue Pottery vase I bought is a masterpiece. Knowing it came directly from the artisan's family makes it so special.", rating: 5 },
      { id: "t-2", name: "Rohan Deshmukh", location: "Pune, Maharashtra", text: "Exceptional Paithani silk weave! The QR code scan showing the master weaver's story added so much trust.", rating: 5 }
    ],
    specialPlace: {
      stateId: "rj",
      title: "Jaipur Craft Capital",
      description: "Jaipur is globally renowned for its traditional Blue Pottery, block printed textiles, and gemstone craft heritage. Click to explore Rajasthan's full ODOP registry.",
      imageUrl: "https://images.unsplash.com/photo-1596178060810-72cb62112e75?auto=format&fit=crop&w=600&q=80"
    }
  };

  try {
    const configPath = path.join(process.cwd(), "public", "data", "homepage.json");
    if (fs.existsSync(configPath)) {
      configData = JSON.parse(fs.readFileSync(configPath, "utf8"));
    }
  } catch (e) {
    console.error("Failed to load local homepage configs:", e);
  }

  // Fetch featured products
  const dbFeaturedProducts = await prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: {
      images: true,
      district: { include: { state: true } }
    },
    take: 4
  });

  // Fetch best sellers
  const dbBestSellers = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      images: true,
      district: { include: { state: true } }
    },
    take: 4
  });

  // Fetch recently added
  const dbRecentlyAdded = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: {
      images: true,
      district: { include: { state: true } }
    },
    take: 4
  });

  // Fetch active banners
  const banners = await prisma.banner.findMany({
    where: { isActive: true, position: "HERO" },
    take: 1
  });

  const activeHero = banners[0] || {
    title: "Vocal for Local Heritage Sale",
    subtitle: "Support India's Master Artisans & Explore Unique ODOP Specialties from 750+ Districts.",
    imageUrl: "https://images.unsplash.com/photo-1596178060810-72cb62112e75?auto=format&fit=crop&w=1200&q=80"
  };

  // Sort and filter active sections
  const activeSections = configData.sections
    .filter((s: any) => s.isEnabled)
    .sort((a: any, b: any) => a.order - b.order);

  return (
    <div className="space-y-16 pb-16 text-[#2E1E1A] relative">
      {/* Dynamic Active Promotion Ribbon */}
      {configData.activePromo && configData.activePromo.isEnabled && (
        <div className="w-full bg-[#B56D3E] text-white text-[10px] font-extrabold uppercase tracking-widest text-center py-2 relative z-25 shadow-sm">
          {configData.activePromo.text}
        </div>
      )}

      {/* Render sections dynamically based on CMS order */}
      {activeSections.map((section: any) => {
        switch (section.id) {
          case "Hero":
            return <HeroSection key={section.id} activeHero={activeHero} />;
          case "TrustBar":
            return <TrustBar key={section.id} />;
          case "ShopByCategory":
            return <ShopByCategory key={section.id} />;
          case "InteractiveMap":
            return <InteractiveMap key={section.id} specialPlace={configData.specialPlace} />;
          case "FeaturedCollections":
            return <FeaturedCollectionsSection key={section.id} />;
          case "ShopByDistrict":
            return <ShopByDistrictSection key={section.id} />;
          case "ArtisanStories":
            return <ArtisanStories key={section.id} />;
          case "Storytelling":
            return <StorytellingSection key={section.id} />;
          case "ProductCarousels":
            return (
              <ProductCarousels
                key={section.id}
                trendingProducts={dbFeaturedProducts}
                bestSellers={dbBestSellers}
                recentlyAdded={dbRecentlyAdded}
              />
            );
          case "Festival":
            return <FestivalSection key={section.id} />;
          case "WhyCulturalClutch":
            return <WhyCulturalClutchSection key={section.id} />;
          case "CustomerReviews":
            return <CustomerReviewsSection key={section.id} testimonials={configData.testimonials} />;
          case "Membership":
            return <MembershipSection key={section.id} />;
          default:
            return null;
        }
      })}

      {/* Interactive Floating Widgets */}
      <AIShoppingAssistant />
      <LivePurchasePopup />
      <MobileStickyBottomNav />
    </div>
  );
}
