"use client";

import React, { useState, useEffect } from "react";
import { Shield, CheckCircle, Gift, Heart, Info, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AboutData {
  title: string;
  subtitle: string;
  ourStoryTitle: string;
  ourStoryText: string;
  ourStoryImage?: string;
  ourStoryImageAlignment?: string;
  ourStoryImageWidth?: string;
  ourMissionTitle: string;
  ourMissionText: string;
  ourFounderTitle: string;
  ourFounderName: string;
  ourFounderTitleDescription: string;
  ourFounderText: string;
  ourFounderImage?: string;
  ourFounderImageWidth?: string;
  ourFounderImageAlignment?: string;
  ourPromiseTitle: string;
  ourPromiseText: string;
  tagline: string;
}

export default function AboutPage() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/about");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load about data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF5EE] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#B56D3E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const aboutData = data || {
    title: "THE STORY OF CULTURAL CLUCH",
    subtitle: "More Than a Brand — A Living Legacy of Bharat",
    ourStoryTitle: "OUR STORY",
    ourStoryText: "India is one of the world’s oldest living civilizations, known for its temples, sculptures, paintings, handlooms, and timeless architecture. Our ancestors expressed life, faith, and wisdom through art and craftsmanship that still inspire the world today.\n\nBut many traditional crafts and artisans are slowly fading in the rush of modernization. Their skills, stories, and heritage deserve to be preserved and celebrated.\n\nCultural Cluch was created to protect this legacy. It is not just a marketplace—it is a bridge between our glorious past and a hopeful future. Every product represents the talent of an artisan, the history of a region, and the soul of our civilization.",
    ourMissionTitle: "OUR MISSION",
    ourMissionText: "Our mission is to support Indian craftsmanship, folk art, tribal traditions, architecture, drawings, sculptures, and regional specialties. We believe every district has a story, and every artisan deserves respect for keeping our culture alive.",
    ourFounderTitle: "OUR FOUNDER",
    ourFounderName: "Mr. Abhishek Mishra",
    ourFounderTitleDescription: "General Person",
    ourFounderText: "The founder of Cultural Cluch is Mr. Abhishek Mishra, a general person with a deep love for heritage and a strong vision to empower artisans. His dream is to give traditional creators a voice and inspire people to take pride in Bharat’s cultural roots.",
    ourPromiseTitle: "OUR PROMISE",
    ourPromiseText: "When you choose Cultural Cluch, you are not just buying a product—you are supporting families, protecting ancient skills, and helping preserve a civilization that has lived for thousands of years.\n\nCultural Cluch is a tribute to our ancestors, a hope for our artisans, and a promise to keep India’s heritage alive.",
    tagline: "Preserve Heritage. Empower Artisans. Celebrate Bharat.",
    ourStoryImage: "/story-concept.png",
    ourStoryImageAlignment: "right",
    ourStoryImageWidth: "medium",
    ourFounderImage: "/logo.jpg",
    ourFounderImageWidth: "small",
    ourFounderImageAlignment: "left"
  };

  return (
    <div className="min-h-screen bg-[#FAF5EE] text-[#2E1E1A] py-12 px-4 md:px-8 select-none font-sans">
      <div className="max-w-6xl mx-auto bg-[#FDFBF7] border-2 border-[#C09355]/30 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden space-y-12">
        
        {/* Subtle Decorative Borders (Heritage Style) */}
        <div className="absolute top-4 left-4 right-4 bottom-4 border border-[#C09355]/15 pointer-events-none rounded-2xl" />
        
        {/* Top Back Navigation Link */}
        <div className="relative z-10 flex justify-between items-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B56D3E] hover:underline uppercase tracking-wider">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C09355] border border-[#C09355]/30 px-3 py-1 rounded-full bg-[#FAF5EE]">
            Official Heritage Story
          </span>
        </div>

        {/* 1. Header Section */}
        <div className="text-center relative z-10 space-y-4 max-w-3xl mx-auto pt-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-8 h-[1px] bg-[#C09355]" />
            <span className="text-xs font-extrabold text-[#C09355] uppercase tracking-widest">The Story of</span>
            <span className="w-8 h-[1px] bg-[#C09355]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-black tracking-wide text-[#3D1E16] leading-none">
            {aboutData.title}
          </h1>
          <p className="text-sm md:text-base font-serif italic text-[#B56D3E] font-medium tracking-wide">
            {aboutData.subtitle}
          </p>
          <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-[#C09355] to-transparent mx-auto pt-1" />
        </div>

        {/* Top Banner Image Option */}
        {aboutData.ourStoryImage && aboutData.ourStoryImageAlignment === "top" && (
          <div className="relative z-10 w-full rounded-3xl overflow-hidden border-2 border-[#C09355]/30 shadow-lg group bg-white/5">
            <img 
              src={aboutData.ourStoryImage} 
              alt="Cultural Clutch Story Map" 
              className="w-full h-auto object-cover max-h-[520px] transition-transform duration-700 hover:scale-[1.01]"
            />
            <div className="absolute bottom-4 right-4 bg-[#3D1E16]/85 text-[#FAF5EE] text-[10px] font-bold px-3.5 py-1.5 rounded-full border border-[#C09355]/30">
              Heritage Sourcing & Storytelling
            </div>
          </div>
        )}

        {/* 2. Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative z-10 items-start">
          
          {/* Left Column: Our Story & Tribute */}
          <div className="lg:col-span-7 space-y-8">
            {/* Our Story Block */}
            <div className="space-y-4">
              <h2 className="text-lg md:text-xl font-serif font-bold text-[#3D1E16] border-b border-[#C09355]/20 pb-2 uppercase tracking-wide flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#B56D3E] rounded-full" />
                {aboutData.ourStoryTitle}
              </h2>

              {aboutData.ourStoryImage && (aboutData.ourStoryImageAlignment === "left" || aboutData.ourStoryImageAlignment === "right") ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Story Image placement left */}
                  {aboutData.ourStoryImageAlignment === "left" && (
                    <div className={`md:col-span-${aboutData.ourStoryImageWidth === "small" ? "4" : aboutData.ourStoryImageWidth === "large" ? "6" : "5"} rounded-2xl overflow-hidden border border-[#C09355]/30 shadow-md`}>
                      <img src={aboutData.ourStoryImage} alt="Story visual" className="w-full h-auto object-cover" />
                    </div>
                  )}

                  {/* Story Text content */}
                  <div className={`md:col-span-${
                    aboutData.ourStoryImageWidth === "small" ? (aboutData.ourStoryImageAlignment === "left" ? "8" : "8") : 
                    aboutData.ourStoryImageWidth === "large" ? "6" : "7"
                  } text-sm text-gray-700 leading-relaxed font-serif space-y-4 whitespace-pre-line text-justify`}>
                    {aboutData.ourStoryText}
                  </div>

                  {/* Story Image placement right */}
                  {aboutData.ourStoryImageAlignment === "right" && (
                    <div className={`md:col-span-${aboutData.ourStoryImageWidth === "small" ? "4" : aboutData.ourStoryImageWidth === "large" ? "6" : "5"} rounded-2xl overflow-hidden border border-[#C09355]/30 shadow-md`}>
                      <img src={aboutData.ourStoryImage} alt="Story visual" className="w-full h-auto object-cover" />
                    </div>
                  )}

                </div>
              ) : (
                <div className="text-sm text-gray-700 leading-relaxed font-serif space-y-4 whitespace-pre-line text-justify">
                  {aboutData.ourStoryText}
                </div>
              )}
            </div>

            {/* A Tribute to Civilization */}
            <div className="bg-[#FAF5EE]/70 border border-[#C09355]/20 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#B56D3E] flex items-center gap-1.5">
                A Tribute to Our Civilization
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-xs font-serif font-bold text-[#3D1E16]">Architecture</div>
                  <p className="text-[10px] text-gray-500 leading-normal">Temples, forts, and monuments.</p>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-serif font-bold text-[#3D1E16]">Crafts</div>
                  <p className="text-[10px] text-gray-500 leading-normal">Clay, wood, metals, and textiles.</p>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-serif font-bold text-[#3D1E16]">Paintings</div>
                  <p className="text-[10px] text-gray-500 leading-normal">Madhubani, Pattachitra, Warli.</p>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-serif font-bold text-[#3D1E16]">Specialties</div>
                  <p className="text-[10px] text-gray-500 leading-normal">Geographical tags and local food.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Mission, Founder, Quote & Promise */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Our Mission */}
            <div className="space-y-4">
              <h2 className="text-lg md:text-xl font-serif font-bold text-[#3D1E16] border-b border-[#C09355]/20 pb-2 uppercase tracking-wide flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#B56D3E] rounded-full" />
                {aboutData.ourMissionTitle}
              </h2>
              <div className="text-sm text-gray-700 leading-relaxed font-serif whitespace-pre-line text-justify">
                {aboutData.ourMissionText}
              </div>
            </div>

            {/* Our Founder */}
            <div className="space-y-4">
              <h2 className="text-lg md:text-xl font-serif font-bold text-[#3D1E16] border-b border-[#C09355]/20 pb-2 uppercase tracking-wide flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#B56D3E] rounded-full" />
                {aboutData.ourFounderTitle}
              </h2>
              <div className="space-y-4">
                {aboutData.ourFounderImage && aboutData.ourFounderImageAlignment === "top" && (
                  <div className="w-full rounded-2xl overflow-hidden border border-[#C09355]/30 shadow-sm max-h-[300px]">
                    <img src={aboutData.ourFounderImage} alt={aboutData.ourFounderName} className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div className="flex items-start gap-4">
                  {aboutData.ourFounderImage && aboutData.ourFounderImageAlignment === "left" && (
                    <div className={`shrink-0 overflow-hidden border border-[#C09355]/30 ${
                      aboutData.ourFounderImageWidth === "large" ? "w-24 h-24 rounded-2xl" : aboutData.ourFounderImageWidth === "medium" ? "w-16 h-16 rounded-xl" : "w-12 h-12 rounded-full"
                    }`}>
                      <img src={aboutData.ourFounderImage} alt={aboutData.ourFounderName} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif font-bold text-base text-[#3D1E16]">{aboutData.ourFounderName}</span>
                      <span className="text-[10px] font-bold text-gray-450 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider">
                        {aboutData.ourFounderTitleDescription}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 font-serif leading-relaxed text-justify">
                      {aboutData.ourFounderText}
                    </p>
                  </div>

                  {aboutData.ourFounderImage && aboutData.ourFounderImageAlignment === "right" && (
                    <div className={`shrink-0 overflow-hidden border border-[#C09355]/30 ${
                      aboutData.ourFounderImageWidth === "large" ? "w-24 h-24 rounded-2xl" : aboutData.ourFounderImageWidth === "medium" ? "w-16 h-16 rounded-xl" : "w-12 h-12 rounded-full"
                    }`}>
                      <img src={aboutData.ourFounderImage} alt={aboutData.ourFounderName} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cursive Highlight Quote */}
            <div className="bg-[#B56D3E]/5 border-l-4 border-[#B56D3E] p-4 rounded-r-xl space-y-2">
              <p className="text-xs md:text-sm font-serif italic text-[#3D1E16] leading-relaxed">
                &quot;I may be a general person, but my dream is extraordinary — to keep the soul of Bharat alive.&quot;
              </p>
              <div className="text-[10px] font-bold text-gray-450 uppercase tracking-wider text-right">
                — {aboutData.ourFounderName}
              </div>
            </div>

            {/* Customer Promise Box */}
            <div className="bg-[#FDFBF7] border border-[#C09355]/30 rounded-2xl p-5 space-y-3.5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#B56D3E]" />
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#B56D3E] flex items-center gap-1.5">
                <Heart className="w-4 h-4" /> For Our Customers &amp; Civilisation
              </h4>
              <p className="text-xs text-gray-600 font-serif leading-relaxed text-justify whitespace-pre-line">
                {aboutData.ourPromiseText}
              </p>
            </div>

          </div>

        </div>

        {/* 3. Footer Tagline Banner */}
        <div className="bg-[#3D1E16] text-[#FAF5EE] rounded-2xl p-6 text-center relative z-10 overflow-hidden shadow-lg border border-[#C09355]/20">
          <div className="absolute inset-0 bg-[radial-gradient(#C09355/10_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
          <div className="relative z-10 space-y-2">
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#C09355]">
              CULTURAL CLUCH IS MORE THAN A BRAND
            </p>
            <h3 className="text-base md:text-xl font-serif font-black tracking-wider uppercase text-[#FAF5EE]">
              {aboutData.tagline}
            </h3>
          </div>
        </div>

      </div>
    </div>
  );
}
