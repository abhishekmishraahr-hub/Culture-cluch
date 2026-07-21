"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ShoppingBag, X } from "lucide-react";

const PURCHASE_POOL = [
  { location: "Jaipur, Rajasthan", product: "Blue Pottery Flower Vase", time: "2 mins ago" },
  { location: "Bengaluru, Karnataka", product: "Mysore Sandalwood Carving", time: "5 mins ago" },
  { location: "New Delhi", product: "Moradabad Brass Nakshi Diya", time: "8 mins ago" },
  { location: "Pune, Maharashtra", product: "Paithani Zari Border Saree", time: "12 mins ago" },
  { location: "Lucknow, Uttar Pradesh", product: "Handcrafted Chikan Kurta", time: "15 mins ago" }
];

export default function LivePurchasePopup() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Schedule intervals to toggle notification display
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 4000); // Show first notification after 4 seconds

    const interval = setInterval(() => {
      setVisible(false);
      // Wait for exit transition, then load next purchase info
      setTimeout(() => {
        setCurrentIdx(prev => (prev + 1) % PURCHASE_POOL.length);
        setVisible(true);
      }, 1000);
    }, 20000); // Cycle every 20 seconds

    return () => {
      clearTimeout(showTimer);
      clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  const item = PURCHASE_POOL[currentIdx];

  return (
    <div className="fixed bottom-6 left-6 z-40 bg-[#3D1E16] text-[#FAF5EE] border border-[#C09355]/40 rounded-2xl shadow-2xl p-3.5 pr-8 flex items-center gap-3.5 max-w-[280px] animate-in fade-in slide-in-from-bottom-6 duration-500 relative">
      {/* Close Toast */}
      <button 
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Shopping Bag Icon */}
      <div className="w-9 h-9 rounded-full bg-[#B56D3E]/20 border border-[#C09355]/30 flex items-center justify-center text-[#C09355] shrink-0 shadow-inner">
        <ShoppingBag className="w-4.5 h-4.5" />
      </div>

      <div className="space-y-0.5 text-[10px]">
        <div className="flex items-center gap-1 font-extrabold uppercase text-[#C09355] tracking-wider leading-none">
          <Sparkles className="w-3 h-3 text-[#C09355]" /> Live Purchase
        </div>
        <p className="text-gray-300 font-serif leading-snug">
          Someone in <span className="font-bold text-white">{item.location}</span> bought <span className="italic font-bold text-[#C09355]">{item.product}</span>.
        </p>
        <span className="text-[8px] text-gray-400 font-mono block pt-0.5">
          {item.time}
        </span>
      </div>
    </div>
  );
}
