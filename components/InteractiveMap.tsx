"use client";

import React, { useState, useEffect } from "react";
import { Compass, Sparkles, MapPin, X, ArrowRight, Tag, RefreshCw } from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";

interface PathData {
  id: string;
  name: string;
  d: string;
}

interface DistrictData {
  id: string;
  name: string;
  odopProduct: string | null;
}

interface StateDetails {
  id: string;
  name: string;
  code: string;
  districts: DistrictData[];
}

interface InteractiveMapProps {
  specialPlace?: {
    stateId: string;
    title: string;
    description: string;
    imageUrl: string;
  };
}

// Vibrant heritage colors matched to Indian culture palette
const STATE_COLORS: Record<string, string> = {
  ap: "#1F4E5B", // Royal Indigo
  ar: "#6E8B3D", // Sage Green
  as: "#2E5A44", // Forest Green
  br: "#E3A857", // Ochre / Mustard
  cg: "#207F7E", // Teal
  ga: "#A63A50", // Madder Crimson
  gj: "#FF9933", // Saffron
  hr: "#1F4E5B", // Royal Indigo
  hp: "#D05A3F", // Terracotta Rose
  jk: "#6E8B3D", // Sage Green
  jh: "#E3A857", // Ochre
  ka: "#B56D3E", // Rust Copper
  kl: "#2E5A44", // Forest Green
  mp: "#C09355", // Gold
  mh: "#1F4E5B", // Royal Indigo
  mn: "#A63A50", // Crimson
  ml: "#207F7E", // Teal
  mz: "#D05A3F", // Rose Pink
  nl: "#6E8B3D", // Sage
  or: "#E3A857", // Ochre
  pb: "#FF9933", // Saffron
  rj: "#B56D3E", // Terracotta Rust
  sk: "#207F7E", // Teal
  tn: "#A63A50", // Crimson
  tg: "#C09355", // Gold
  tr: "#6E8B3D", // Sage
  up: "#FF9933", // Saffron
  ut: "#D05A3F", // Rose Pink
  wb: "#1F4E5B", // Indigo
  la: "#6E8B3D", // Sage
  py: "#A63A50", // Crimson
  dl: "#C09355"  // Gold
};

export default function InteractiveMap({ specialPlace }: InteractiveMapProps) {
  const [paths, setPaths] = useState<PathData[]>([]);
  const [hoveredState, setHoveredState] = useState<PathData | null>(null);
  const [selectedState, setSelectedState] = useState<PathData | null>(null);
  const [stateDetails, setStateDetails] = useState<StateDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const defaultSpecialPlace = {
    stateId: "rj",
    title: "Jaipur Craft Capital",
    description: "Jaipur is globally renowned for its traditional Blue Pottery, block printed textiles, and gemstone craft heritage. Click to explore Rajasthan's full ODOP registry.",
    imageUrl: "https://images.unsplash.com/photo-1596178060810-72cb62112e75?auto=format&fit=crop&w=600&q=80"
  };

  const activeSpecialPlace = specialPlace || defaultSpecialPlace;

  useEffect(() => {
    fetch("/maps/india.svg")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load map data");
        return res.text();
      })
      .then((text) => {
        const pathRegex = /<path[\s\S]*?id="([^"]+)"[\s\S]*?aria-label="([^"]+)"[\s\S]*?d="([\s\S]*?)"/g;
        let match;
        const parsed: PathData[] = [];
        while ((match = pathRegex.exec(text)) !== null) {
          parsed.push({
            id: match[1],
            name: match[2],
            d: match[3].trim().replace(/\s+/g, " ")
          });
        }
        setPaths(parsed);
      })
      .catch((err) => console.error("Map parsing error:", err));
  }, []);

  const handleStateClick = async (statePath: PathData) => {
    setSelectedState(statePath);
    setLoadingDetails(true);
    setStateDetails(null);

    const lookupCode = statePath.id === "ut" ? "UK" : statePath.id.toUpperCase();
    try {
      const res = await fetch(`/api/state-maps/${lookupCode}`);
      if (res.ok) {
        await res.json();
        // Fetch full state districts details via standard API
        const detailsRes = await fetch(`/api/states?admin=true`);
        if (detailsRes.ok) {
          const allStates = await detailsRes.json();
          const match = allStates.find((s: any) => s.code.toUpperCase() === lookupCode);
          if (match) {
            setStateDetails(match);
          }
        }
      }
    } catch (e) {
      console.error("Failed to load details for state:", lookupCode, e);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left + 15,
      y: e.clientY - rect.top - 15
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 relative">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif text-[#3D1E16] font-bold flex items-center justify-center gap-2">
          <Compass className="w-6 h-6 text-[#B56D3E]" />
          Civilizational Map Explorer
        </h2>
        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
          Hover over states to view names, click to inspect local ODOP specialties
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FDFBF7]/90 border border-[#C09355]/20 rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
        {/* Map Grid Background Accent */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#C09355_1px,transparent_1px),linear-gradient(to_bottom,#C09355_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        {/* Left Column: Map Outline Container (Span 7) */}
        <div 
          className="lg:col-span-7 flex items-center justify-center bg-[#FAF5EE]/50 rounded-2xl border border-[#C09355]/10 p-4 shadow-inner relative select-none"
          onMouseMove={handleMouseMove}
        >
          {paths.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-xs text-gray-400">
              <RefreshCw className="w-8 h-8 animate-spin text-[#B56D3E] mb-2" />
              Loading Vector Boundaries...
            </div>
          ) : (
            <svg
              className="w-full max-w-[460px] h-auto object-contain text-[#3D1E16]"
              viewBox="0 0 612 696"
              fill="none"
              stroke="#FAF5EE"
              strokeWidth="1.2"
            >
              {paths.map((p) => {
                const isHovered = hoveredState?.id === p.id;
                const isSelected = selectedState?.id === p.id;
                const baseColor = STATE_COLORS[p.id.toLowerCase()] || "#E6DFD3";

                return (
                  <path
                    key={p.id}
                    d={p.d}
                    fill={isSelected ? "#B56D3E" : isHovered ? "rgba(181, 109, 62, 0.6)" : baseColor}
                    fillOpacity={isSelected ? "0.9" : isHovered ? "0.8" : "0.55"}
                    stroke={isSelected ? "#3D1E16" : isHovered ? "#3D1E16" : "rgba(61, 30, 22, 0.2)"}
                    strokeWidth={isSelected ? "2" : isHovered ? "1.8" : "1.2"}
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredState(p)}
                    onMouseLeave={() => setHoveredState(null)}
                    onClick={() => handleStateClick(p)}
                  />
                );
              })}
            </svg>
          )}

          {/* Floating Tooltip */}
          {hoveredState && (
            <div
              className="absolute z-20 bg-[#3D1E16]/95 border border-[#C09355]/40 text-[#FAF5EE] px-3.5 py-1.5 rounded-xl shadow-lg pointer-events-none text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"
              style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
            >
              <span className="w-1.5 h-1.5 bg-[#B56D3E] rounded-full" />
              {hoveredState.name}
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Info / District Explorer Drawer (Span 5) */}
        <div className="lg:col-span-5 h-full flex flex-col justify-between min-h-[420px] bg-white border border-[#C09355]/15 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          {selectedState ? (
            <div className="space-y-5 h-full flex flex-col justify-between">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-gray-150 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#B56D3E] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#B56D3E]" /> Region Explorer
                    </span>
                    <h3 className="font-serif font-black text-xl text-[#3D1E16] uppercase tracking-wide">
                      {selectedState.name}
                    </h3>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedState(null);
                      setStateDetails(null);
                    }}
                    className="p-1 hover:bg-gray-150 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Loading state details */}
                {loadingDetails ? (
                  <div className="flex flex-col items-center justify-center py-20 text-xs text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#B56D3E] mb-2" />
                    Loading District Data...
                  </div>
                ) : stateDetails ? (
                  <div className="space-y-4">
                    {/* Bounding Box Map Preview */}
                    <div className="flex items-center gap-4 bg-[#FAF5EE]/50 border border-[#C09355]/10 p-3 rounded-2xl relative overflow-hidden">
                      <div className="w-16 h-16 shrink-0 bg-white rounded-xl border border-[#C09355]/20 p-1 flex items-center justify-center">
                        <img 
                          src={`/maps/${selectedState.id === "ut" ? "uttarakhand.svg" : selectedState.id === "jk" ? "jammu-kashmir.svg" : selectedState.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".svg"}`} 
                          alt="preview"
                          className="w-full h-full object-contain"
                          style={{ filter: "sepia(0.8) hue-rotate(-15deg) saturate(2) brightness(0.9)" }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-serif font-bold text-xs">ODOP Crafts Directory</h4>
                        <p className="text-[10px] text-gray-550 leading-normal">
                          Configured with {stateDetails.districts.length} districts under India&apos;s Vocal for Local mission.
                        </p>
                      </div>
                    </div>

                    {/* Districts List */}
                    <div className="space-y-2">
                      <h4 className="text-[9px] font-extrabold uppercase tracking-widest text-[#C09355] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#C09355]" /> Key ODOP Specialties
                      </h4>
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {stateDetails.districts.length === 0 ? (
                          <p className="text-xs text-gray-400 italic">No districts configured yet.</p>
                        ) : (
                          stateDetails.districts.map(d => (
                            <div key={d.id} className="p-2.5 bg-[#FAF5EE]/40 border border-gray-100 rounded-xl flex justify-between items-center text-xs gap-3">
                              <span className="font-bold text-[#3D1E16]">{d.name}</span>
                              {d.odopProduct ? (
                                <span className="text-[9px] font-extrabold bg-[#B56D3E]/5 border border-[#B56D3E]/20 text-[#B56D3E] px-2 py-0.5 rounded flex items-center gap-1">
                                  <Tag className="w-2.5 h-2.5" /> {d.odopProduct}
                                </span>
                              ) : (
                                <span className="text-[9px] text-gray-400 italic">Local Crafts</span>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 text-xs text-gray-400 font-serif italic">
                    Failed to fetch details for this state.
                  </div>
                )}
              </div>

              {stateDetails && (
                <div className="pt-4 border-t border-gray-100 flex gap-2">
                  <Link
                    href={`/states/${selectedState.id === "ut" ? "uk" : selectedState.id.toLowerCase()}`}
                    target="_blank"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#3D1E16] hover:bg-[#28140E] text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg uppercase tracking-wider"
                  >
                    Explore Heritage <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/products?state=${selectedState.id === "ut" ? "UK" : selectedState.id.toUpperCase()}`}
                    className="inline-flex items-center justify-center px-4.5 py-2.5 bg-[#FAF5EE] hover:bg-amber-500/5 text-[#B56D3E] border border-[#C09355]/30 rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                  >
                    Shop Catalog
                  </Link>
                </div>
              )}
            </div>
          ) : (
            /* Special Place Curated Panel when no state is selected */
            <div className="space-y-5 h-full flex flex-col justify-between text-left">
              <div className="space-y-4">
                <div className="space-y-0.5 border-b border-[#C09355]/15 pb-3">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#B56D3E] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#B56D3E]" /> Curated Heritage Spot
                  </span>
                  <h3 className="font-serif font-black text-base text-[#3D1E16] uppercase tracking-wide">
                    {activeSpecialPlace.title}
                  </h3>
                </div>

                <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[#C09355]/20 shadow-sm relative bg-[#FAF5EE] dark:bg-[#1c0f0c]">
                  <SafeImage
                    src={activeSpecialPlace.imageUrl}
                    alt={activeSpecialPlace.title}
                    className="object-cover w-full h-full"
                    wrapperClassName="w-full h-full"
                  />
                </div>

                <p className="description text-xs text-foreground/80 dark:text-gray-300 leading-relaxed font-serif text-justify">
                  {activeSpecialPlace.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#C09355]/15">
                <button
                  onClick={() => {
                    const matchPath = paths.find(
                      (p) => p.id.toLowerCase() === activeSpecialPlace.stateId.toLowerCase()
                    );
                    if (matchPath) {
                      handleStateClick(matchPath);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#3D1E16] hover:bg-[#28140E] text-white rounded-xl text-xs font-bold transition-all shadow-md uppercase tracking-wider active:scale-95"
                >
                  Explore Region On Map <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
