import React from "react";
import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { Truck, RotateCcw, ArrowLeft } from "lucide-react";

async function getSettings() {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "settings.json");
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return {
      site_name: "Cultural Clutch",
      shipping_policy: "Orders are processed within 24-48 hours. Standard domestic shipping is free for all orders above ₹1,999.",
      return_policy: "We offer a customer-friendly 7-day return window for items with verified structural weaving or transit damage."
    };
  }
}

export default async function ShippingReturnsPolicyPage() {
  const settings = await getSettings();

  return (
    <div className="min-h-screen bg-[#FAF5EE] text-[#2E1E1A] py-12 px-4 md:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-[#FDFBF7] border border-[#C09355]/25 rounded-3xl p-6 md:p-10 shadow-md space-y-8">
        <div className="flex items-center justify-between border-b border-[#C09355]/20 pb-4">
          <h1 className="text-2xl md:text-3xl font-serif text-[#3D1E16] font-bold">
            Shipping & Return Policies
          </h1>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-[#B56D3E] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        {/* Shipping Policy Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-serif text-[#3D1E16] font-bold flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#B56D3E]" /> Shipping Policy
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed font-serif whitespace-pre-line">
            {settings.shipping_policy}
          </p>
        </div>

        {/* Return Policy Section */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <h2 className="text-lg font-serif text-[#3D1E16] font-bold flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-[#B56D3E]" /> Return & Refund Policy
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed font-serif whitespace-pre-line">
            {settings.return_policy}
          </p>
        </div>

        <div className="border-t border-gray-100 pt-4 text-xs text-gray-400">
          <p>Last modified: {new Date().toLocaleDateString("en-IN")}</p>
          <p className="mt-1">Site Owner: {settings.site_name} Logistics and Fulfillment Division</p>
        </div>
      </div>
    </div>
  );
}
