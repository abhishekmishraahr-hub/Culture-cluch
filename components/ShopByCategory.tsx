"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const CATEGORIES = [
  { name: "Handloom", slug: "handloom-textiles", iconText: "🧵", color: "from-[#B56D3E] to-amber-800" },
  { name: "Paintings", slug: "art-folk-painting", iconText: "🎨", color: "from-amber-700 to-amber-900" },
  { name: "Metal Crafts", slug: "heritage-handicrafts", iconText: "🏺", color: "from-yellow-700 to-amber-900" },
  { name: "Wood Craft", slug: "heritage-handicrafts", iconText: "🪓", color: "from-amber-800 to-stone-900" },
  { name: "Stone Art", slug: "heritage-handicrafts", iconText: "🗿", color: "from-stone-700 to-amber-900" },
  { name: "Pottery", slug: "pottery", iconText: "🏺", color: "from-orange-700 to-amber-950" },
  { name: "Textiles", slug: "handloom-textiles", iconText: "🧶", color: "from-amber-800 to-amber-600" },
  { name: "Jewelry", slug: "heritage-handicrafts", iconText: "💍", color: "from-amber-700 to-yellow-800" },
  { name: "Home Decor", slug: "heritage-handicrafts", iconText: "🏺", color: "from-yellow-800 to-amber-950" },
  { name: "Tribal Art", slug: "art-folk-painting", iconText: "🏹", color: "from-amber-900 to-amber-700" }
];

export default function ShopByCategory() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif text-[#3D1E16] font-bold flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-[#B56D3E] animate-pulse" />
          Shop By Category
        </h2>
        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
          Select a heritage category to browse master crafts
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-6 pt-4">
        {CATEGORIES.map((cat, idx) => (
          <Link
            key={idx}
            href={`/products?category=${cat.slug}`}
            className="flex flex-col items-center justify-center text-center gap-3 group cursor-pointer"
          >
            {/* Circular Category Frame */}
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-md border-2 border-[#C09355]/20 group-hover:border-[#C09355] transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-[#C09355]/20 group-hover:shadow-lg`}>
              <span className="transform group-hover:rotate-6 transition-transform duration-300 select-none">
                {cat.iconText}
              </span>
            </div>
            
            <span className="font-bold text-xs text-[#3D1E16] group-hover:text-[#B56D3E] transition-colors leading-tight line-clamp-1">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
