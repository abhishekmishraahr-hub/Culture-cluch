"use client";

import React, { useState } from "react";
import { Sparkles, Star, Award, Heart, Play, X, User } from "lucide-react";

const ARTISANS = [
  {
    id: "art-1",
    name: "Ramswaroop Sharma",
    district: "Jaipur, Rajasthan",
    craft: "Blue Pottery Master",
    experience: "42 Years",
    story: "Passed down through five generations, Ramswaroop keeps the Persian-origin Blue Pottery glaze alive. Using ground quartz, raw glass, and gum, his family shapes every pot by hand, firing it once to create vibrant floral motifs.",
    imageUrl: "/logo.jpg", // Using standard placeholder logo or avatar
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "art-2",
    name: "Latika Salunkhe",
    district: "Paithan, Maharashtra",
    craft: "Paithani Silk Weaver",
    experience: "28 Years",
    story: "Latika weaves peacock and floral motifs on handloom borders using pure gold threads (zari) and naturally-dyed silk. Each saree takes anywhere from three weeks to six months, registering a historic craft that dates back to the Satavahana dynasty.",
    imageUrl: "/logo.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "art-3",
    name: "Mohammad Yusuf",
    district: "Moradabad, Uttar Pradesh",
    craft: "Brass Engraver",
    experience: "35 Years",
    story: "Yusuf performs intricate Nakshi engravings on heavy brass items. Using small chisels and wooden hammers, he carves delicate foliage patterns from memory, carrying a heritage that gave Moradabad its name 'Pital Nagri'.",
    imageUrl: "/logo.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  }
];

export default function ArtisanStories() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif text-[#3D1E16] font-bold flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-[#B56D3E]" />
          Artisan Chronicles
        </h2>
        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
          Meet the master craftspeople behind India's timeless heritage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        {ARTISANS.map((art) => (
          <div 
            key={art.id}
            className="bg-[#FDFBF7] rounded-3xl border border-[#C09355]/20 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group h-full relative"
          >
            {/* Image Banner / Video Placeholder */}
            <div className="relative aspect-[16/10] bg-[#3D1E16] flex items-center justify-center overflow-hidden border-b border-[#C09355]/15">
              <div className="absolute inset-0 bg-gradient-to-t from-[#25120D] to-transparent opacity-85 z-10" />
              
              {/* Default Avatar Placeholder */}
              <div className="w-16 h-16 rounded-full bg-white/10 border border-[#C09355]/40 flex items-center justify-center text-[#C09355] relative z-20 group-hover:scale-105 transition-transform duration-300">
                <User className="w-8 h-8" />
              </div>

              {/* Play Video Trigger overlay */}
              <button 
                onClick={() => setActiveVideo(art.videoUrl)}
                className="absolute inset-0 flex items-center justify-center z-25 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#B56D3E] hover:bg-[#9B5A2F] text-[#FAF5EE] flex items-center justify-center shadow-lg transition-transform transform scale-90 group-hover:scale-100 duration-300">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </button>

              <div className="absolute bottom-3 left-4 right-4 z-20 flex justify-between items-end">
                <span className="text-[9px] font-extrabold uppercase tracking-widest bg-[#B56D3E] text-[#FAF5EE] px-2 py-0.5 rounded-full">
                  {art.craft}
                </span>
                <span className="text-[9px] font-bold text-gray-300 font-mono">
                  {art.experience} Experience
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-[#B56D3E] font-extrabold uppercase tracking-wider">
                  <Award className="w-4 h-4 text-[#B56D3E]" />
                  {art.district}
                </div>
                <h3 className="font-serif font-black text-lg text-[#3D1E16] group-hover:text-[#B56D3E] transition-colors leading-tight">
                  {art.name}
                </h3>
                <p className="text-xs text-gray-550 leading-relaxed font-serif text-justify line-clamp-4">
                  "{art.story}"
                </p>
              </div>

              <div className="border-t border-gray-100 pt-3.5 flex justify-between items-center">
                <span className="text-[10px] font-bold text-[#C09355] uppercase tracking-wide flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-[#C09355]" /> Handloom Cooperative Link
                </span>
                <button 
                  onClick={() => setActiveVideo(art.videoUrl)}
                  className="text-[10px] font-extrabold uppercase tracking-wider text-[#B56D3E] hover:underline"
                >
                  Watch Story →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Trigger */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl bg-[#3D1E16] border border-[#C09355]/30 rounded-3xl overflow-hidden shadow-2xl">
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-3 right-3 p-1.5 bg-[#FAF5EE]/10 hover:bg-[#FAF5EE]/25 rounded-full text-white transition-all z-50"
            >
              <X className="w-4.5 h-4.5" />
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={activeVideo}
                title="Artisan Story Video"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
