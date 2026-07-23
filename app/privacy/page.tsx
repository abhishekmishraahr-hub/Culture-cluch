import React from "react";
import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

async function getSettings() {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "settings.json");
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return {
      site_name: "Cultural Clutch",
      privacy_policy: "Your privacy is important to us. Cultural Clutch stores user profiles and functional cookies locally to deliver customized translations, theme attributes, and shopping carts."
    };
  }
}

export default async function PrivacyPolicyPage() {
  const settings = await getSettings();

  return (
    <div className="min-h-screen bg-[#FAF5EE] text-[#2E1E1A] py-12 px-4 md:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-[#FDFBF7] border border-[#C09355]/25 rounded-3xl p-6 md:p-10 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-[#C09355]/20 pb-4">
          <h1 className="text-2xl md:text-3xl font-serif text-[#3D1E16] font-bold flex items-center gap-2.5">
            <ShieldCheck className="w-8 h-8 text-[#B56D3E]" /> Privacy Policy
          </h1>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-[#B56D3E] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <div className="text-sm font-medium text-gray-700 leading-relaxed text-justify space-y-4">
          <p className="whitespace-pre-line font-serif">
            {settings.privacy_policy}
          </p>
          
          <div className="border-t border-gray-100 pt-4 text-xs text-gray-400">
            <p>Last modified: {new Date().toLocaleDateString("en-IN")}</p>
            <p className="mt-1">Site Owner: {settings.site_name} Management Consortium</p>
          </div>
        </div>
      </div>
    </div>
  );
}
