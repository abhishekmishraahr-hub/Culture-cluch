"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, Award, Lock, RefreshCw, Truck, CheckCircle2, Heart, Flag,
  Send, Mail, Clock, MapPin, Sparkles
} from "lucide-react";
import SafeImage from "@/components/SafeImage";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [sections, setSections] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [contactInfo, setContactInfo] = useState<any>({
    corporateOffice: "Cultural Clutch Hub, Sector 62, Noida, UP, 201301",
    registeredOffice: "Heritage House, 12 Kalakshetra Road, Chennai, TN, 600041",
    email: "care@culturalclutch.com",
    phone: "+91 88001 23456",
    whatsApp: "+91 88001 23456",
    businessHours: "Monday to Saturday: 9:00 AM - 6:00 PM IST"
  });
  const [settings, setSettings] = useState<any>({
    copyright: "© 2026 Cultural Clutch. Celebrating Indian Crafts & Agriculture Heritage.",
    companyRegistration: "U74999TN2026PTC123456",
    gstNumber: "33AAAAA1111A1Z1",
    trademark: "Cultural Clutch® is a registered trademark of Heritage Holdings Pvt. Ltd.",
    accessibilityStmt: "Our website complies with WCAG 2.1 Level AA specifications to serve all collectors.",
    cookieSettings: "Functional cookies are stored locally to personalize language and cart configurations.",
    versionNumber: "2.1.0"
  });

  useEffect(() => {
    // Fetch dynamic configurations
    fetch("/api/admin/footer")
      .then(res => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then(data => {
        if (data.sections && data.sections.length > 0) {
          setSections(data.sections.filter((s: any) => s.isEnabled));
          setSocialLinks(data.socialLinks.filter((s: any) => s.isEnabled));
          setContactInfo(data.contactInfo);
          setSettings(data.settings);
        }
      })
      .catch(() => {
        // Fallback defaults if API not ready (static generation safety)
        setSections([
          {
            id: "sec-1",
            title: "Shop Catalog",
            links: [
              { label: "All Products", url: "/products" },
              { label: "New Arrivals", url: "/products?sort=newest" },
              { label: "Best Sellers", url: "/products?sort=popular" }
            ]
          },
          {
            id: "sec-2",
            title: "Heritage Categories",
            links: [
              { label: "Handloom Textiles", url: "/products?category=handloom-textiles" },
              { label: "Heritage Pottery", url: "/products?category=pottery" },
              { label: "Folk Paintings", url: "/products?category=art-folk-painting" }
            ]
          },
          {
            id: "sec-3",
            title: "Customer Support",
            links: [
              { label: "Help Center & FAQs", url: "/faq" },
              { label: "Track Your Order", url: "/orders" },
              { label: "Shipping & Returns", url: "/shipping-returns" },
              { label: "Contact Us", url: "/profile" }
            ]
          }
        ]);
      });
  }, []);

  if (pathname.startsWith("/admin") || pathname.startsWith("/vendor")) {
    return null;
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/footer/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setEmail("");
      } else {
        setMessage(data.error);
      }
    } catch {
      setMessage("Subscription failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="w-full bg-[#3D1E16] text-[#FAF5EE] border-t border-[#C09355]/30 relative z-30 font-sans">
      
      {/* ======================================= */}
      {/* 1. TOP FOOTER: TRUST BADGES & CTA RAILS */}
      {/* ======================================= */}
      <div className="border-b border-[#C09355]/20 py-8 bg-[#2C150F]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Newsletter Input Box */}
          <div className="lg:col-span-6 space-y-3 text-left">
            <h3 className="font-serif font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-white to-[#C09355] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C09355] animate-pulse" />
              Subscribe to Artisan Chronicles
            </h3>
            <p className="description text-gray-300 max-w-md text-xs leading-normal">
              Receive updates on rare launch curations, weaver profiles, and exclusive 10% discount credentials.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm pt-1">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                className="flex-grow px-3.5 py-2 bg-white/5 border border-[#C09355]/30 focus:border-[#C09355] text-white rounded-xl text-xs focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="button-text px-4 py-2 bg-copper hover:bg-copper/90 text-white rounded-xl shadow transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            {message && <p className="text-[10px] text-[#C09355] font-semibold">{message}</p>}
          </div>

          {/* Become Vendor & Sell options */}
          <div className="lg:col-span-6 flex flex-wrap gap-3 justify-start lg:justify-end">
            <Link
              href="/vendor/dashboard"
              className="button-text px-5 py-3 bg-copper hover:bg-copper/90 text-white rounded-xl transition-all shadow-md active:scale-95"
            >
              Become Artisan Partner
            </Link>
            <Link
              href="/vendor/dashboard"
              className="button-text px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl transition-all active:scale-95"
            >
              Bulk / Corporate Gifting
            </Link>
          </div>

        </div>
      </div>

      {/* Trust credentials ribbons */}
      <div className="border-b border-[#C09355]/15 py-6 bg-[#28130E]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-center">
          {[
            { icon: ShieldCheck, title: "100% Genuine", label: "GI tags verified" },
            { icon: Award, title: "Handmade", label: "Certified weaving" },
            { icon: Lock, title: "Secure Pay", label: "PCI DSS certified" },
            { icon: RefreshCw, title: "Easy Return", label: "7-day window" },
            { icon: Truck, title: "Fast Ship", label: "Insured transit" },
            { icon: CheckCircle2, title: "ODOP Link", label: "Government backed" },
            { icon: Flag, title: "Vocal Local", label: "100% Indian made" },
            { icon: Heart, title: "Direct Hub", label: "No middle agents" }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex flex-col items-center justify-center p-1.5 rounded-lg">
                <Icon className="w-4 h-4 text-[#C09355] mb-1.5" />
                <span className="text-[9px] font-black uppercase text-white leading-none block">{item.title}</span>
                <span className="text-[7.5px] text-gray-400 font-serif leading-normal mt-0.5 block">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================= */}
      {/* 2. MIDDLE FOOTER: NAVIGATION & LINK GRIDS */}
      {/* ======================================= */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
        
        {/* About brand statement */}
        <div className="md:col-span-3 space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <SafeImage
              src="/logo.jpg"
              alt="Logo"
              className="object-cover"
              wrapperClassName="w-8 h-8 rounded-full border border-[#C09355]/30"
            />
            <span className="font-serif font-black tracking-wide text-lg text-white">
              Cultural <span className="text-[#C09355]">Clutch</span>
            </span>
          </Link>
          <p className="description text-gray-300 leading-relaxed font-serif text-[11px]">
            A premium Indian marketplace connecting master weavers, registered art cooperatives, and unique district specialties directly to heritage collectors globally.
          </p>
          
          {/* Social connections */}
          {socialLinks.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <span className="block text-[8px] font-bold text-[#C09355] uppercase tracking-widest">Connect With Us</span>
              <div className="flex gap-2.5">
                {socialLinks.map(s => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="footer-link text-gray-400 hover:text-white transition-colors text-[10px] font-bold underline"
                  >
                    {s.platform}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Nav Columns */}
        <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
          {sections.map((sec) => (
            <div key={sec.id} className="space-y-3">
              <h4 className="sub-heading text-[#C09355] text-xs font-bold font-serif mb-3">
                {sec.title}
              </h4>
              <ul className="space-y-2">
                {sec.links && sec.links.filter((l: any) => l.isEnabled !== false).map((link: any, lIdx: number) => (
                  <li key={lIdx}>
                    <Link
                      href={link.url}
                      className="footer-link text-[10px] text-gray-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact offices details */}
        <div className="md:col-span-3 space-y-4 text-xs font-semibold">
          <h4 className="sub-heading text-[#C09355] text-xs font-bold font-serif mb-3">Corporate Info</h4>
          
          <div className="space-y-3 text-[10px] text-gray-300">
            <div className="flex gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#C09355] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white uppercase text-[8px] tracking-wider mb-0.5">Corporate Office</p>
                <p className="description leading-relaxed font-serif text-gray-300 text-[10px]">{contactInfo.corporateOffice}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Mail className="w-3.5 h-3.5 text-[#C09355] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white uppercase text-[8px] tracking-wider mb-0.5">Customer Support</p>
                <p className="description leading-none text-gray-300 text-[10px]">{contactInfo.email}</p>
                <p className="description leading-none mt-1 text-gray-400 text-[10px]">{contactInfo.phone}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Clock className="w-3.5 h-3.5 text-[#C09355] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white uppercase text-[8px] tracking-wider mb-0.5">Office Timings</p>
                <p className="description leading-relaxed font-serif text-gray-300 text-[10px]">{contactInfo.businessHours}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ======================================= */}
      {/* 3. BOTTOM FOOTER: LEGAL & CORPORATE */}
      {/* ======================================= */}
      <div className="border-t border-[#C09355]/20 bg-[#25120D] py-8 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
          
          {/* Registrations numbers block */}
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 pb-4">
            <span>CIN: {settings.companyRegistration}</span>
            <span className="w-1 h-1 bg-[#C09355] rounded-full hidden sm:inline" />
            <span>GSTIN: {settings.gstNumber}</span>
            <span className="w-1 h-1 bg-[#C09355] rounded-full hidden sm:inline" />
            <span>{settings.trademark}</span>
          </div>

          {/* Quick legal compliance links */}
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[9px] text-gray-300 font-bold uppercase tracking-wider">
            <Link href="/privacy" className="hover:text-[#C09355] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#C09355] transition-colors">Terms of Service</Link>
            <Link href="/shipping-returns" className="hover:text-[#C09355] transition-colors">Shipping & Returns</Link>
            <Link href="/faq" className="hover:text-[#C09355] transition-colors">FAQs</Link>
          </div>

          {/* Customer live counts */}
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 max-w-xl mx-auto text-[8.5px] font-bold text-[#C09355] uppercase tracking-wider flex justify-around items-center">
            <span>887 Products</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span>5000+ Artisans</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span>750+ Districts</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span>28 States</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 caption text-gray-500 pt-2 text-[10px]">
            <span>{settings.copyright}</span>
            <span className="font-mono text-[9px]">v{settings.versionNumber}</span>
          </div>

        </div>
      </div>

    </footer>
  );
}
