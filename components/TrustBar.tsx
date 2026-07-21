"use client";

import React from "react";
import { ShieldCheck, Award, Lock, RefreshCw, Truck, CheckCircle2, Heart, Flag } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "100% Authentic",
    desc: "Direct GI verification"
  },
  {
    icon: Award,
    title: "Handmade Certified",
    desc: "Cooperative certified"
  },
  {
    icon: Lock,
    title: "Secure Payments",
    desc: "Encrypted checkout"
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    desc: "7-day easy window"
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Insured shipping"
  },
  {
    icon: CheckCircle2,
    title: "ODOP Verified",
    desc: "Official district link"
  },
  {
    icon: Flag,
    title: "Made in India",
    desc: "Preserving heritage"
  },
  {
    icon: Heart,
    title: "Direct from Artisan",
    desc: "Fair pricing margins"
  }
];

export default function TrustBar() {
  return (
    <section className="w-full bg-[#3D1E16] text-[#FAF5EE] border-y border-[#C09355]/30 py-5 overflow-hidden relative">
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-center items-start">
          {TRUST_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-0.5 group"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 border border-[#C09355]/20 flex items-center justify-center text-[#C09355] group-hover:text-white group-hover:border-[#C09355] transition-all duration-300 mb-2 shadow-inner">
                  <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#FAF5EE] leading-tight mb-0.5">
                  {item.title}
                </h4>
                <p className="text-[8.5px] text-gray-400 font-serif leading-normal">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
