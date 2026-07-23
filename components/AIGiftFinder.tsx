"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Gift, MapPin } from "lucide-react";
import Link from "next/link";

interface GiftRecommendation {
  name: string;
  price: number;
  slug: string;
  image: string;
  origin: string;
  reason: string;
}

export default function AIGiftFinder() {
  const [recipient, setRecipient] = useState("partner");
  const [occasion, setOccasion] = useState("wedding");
  const [budget, setBudget] = useState("mid");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GiftRecommendation[] | null>(null);

  const handleFindGifts = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    // Simulate AI generation delay
    setTimeout(() => {
      let recommendations: GiftRecommendation[] = [];

      if (budget === "low") {
        recommendations = [
          {
            name: "Organic Saharsa Makhana (Foxnut)",
            price: 850,
            slug: "organic-saharsa-makhana-foxnut",
            image: "https://images.unsplash.com/photo-1596178060810-72cb62112e75?auto=format&fit=crop&w=300&q=80",
            origin: "Saharsa, Bihar",
            reason: "Healthy, authentic local delicacy packaged beautifully. Perfect for health-conscious friends and family gifts."
          },
          {
            name: "Handmade Blue Pottery Coasters Set",
            price: 650,
            slug: "blue-pottery-jaipur",
            image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=300&q=80",
            origin: "Jaipur, Rajasthan",
            reason: "A touch of classic Jaipur style. Glazed clay coaster sets are perfect for housewarming or office tables."
          }
        ];
      } else if (budget === "mid") {
        recommendations = [
          {
            name: "Blue Pottery Flower Vase Jaipur",
            price: 1800,
            slug: "blue-pottery-jaipur",
            image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=300&q=80",
            origin: "Jaipur, Rajasthan",
            reason: "Hand-painted cobalt clay pottery vase. The vibrant blue details and traditional floral motif elevate home decor."
          },
          {
            name: "Handcrafted Bhagalpuri Tussar Silk Dupatta",
            price: 2400,
            slug: "banarasi-silk-brocade-saree",
            image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80",
            origin: "Bhagalpur, Bihar",
            reason: "Rich organic silk textures handwoven by master weavers. An elegant accessory for weddings or festive wardrobe."
          }
        ];
      } else {
        // High budget
        recommendations = [
          {
            name: "Banarasi Handloom Katan Silk Saree",
            price: 12400,
            slug: "banarasi-silk-brocade-saree",
            image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80",
            origin: "Varanasi, Uttar Pradesh",
            reason: "Pure silk with handwoven gold zari borders. Represents the ultimate luxury heritage gift for partners or parents."
          },
          {
            name: "Premium Madhubani Hand-Painted Canvas Wall Art",
            price: 6800,
            slug: "banarasi-silk-brocade-saree",
            image: "https://images.unsplash.com/photo-1596178060810-72cb62112e75?auto=format&fit=crop&w=300&q=80",
            origin: "Madhubani, Bihar",
            reason: "Detailed mythological motifs hand-painted with organic pigments. Perfect for premium housewarming gifts."
          }
        ];
      }

      setResults(recommendations);
      setLoading(false);
    }, 1200);
  };

  return (
    <section className="bg-gradient-to-br from-[#3D1E16] to-[#22100B] text-white rounded-3xl p-6 md:p-10 border border-[#C09355]/30 shadow-2xl relative overflow-hidden">
      
      {/* Background abstract layout */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C09355]/5 rounded-full filter blur-3xl pointer-events-none" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* LEFT: Intake Selectors Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600/20 text-amber-400 border border-amber-500/20 text-[10px] font-extrabold uppercase rounded-full tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Heritage Sourcing AI
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold">
              AI Heritage Gift Finder
            </h2>
            <p className="text-xs text-gray-300">
              Select your preferences below. Our algorithm matches heritage GI crafts directly from Indian weaver registries.
            </p>
          </div>

          <form onSubmit={handleFindGifts} className="space-y-4 text-xs font-semibold">
            
            {/* Recipient */}
            <div className="space-y-1.5">
              <label className="block text-gray-300 uppercase tracking-wider text-[10px]">1. Gift For Whom?</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "partner", label: "Partner/Spouse" },
                  { id: "parents", label: "Parents/Family" },
                  { id: "friend", label: "Friends/Colleagues" },
                  { id: "client", label: "Corporate Clients" }
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRecipient(r.id)}
                    className={`py-2 px-3 border rounded-xl transition-all ${
                      recipient === r.id
                        ? "border-[#B56D3E] bg-[#B56D3E] text-white"
                        : "border-white/10 bg-white/5 hover:bg-white/10 text-gray-300"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div className="space-y-1.5">
              <label className="block text-gray-300 uppercase tracking-wider text-[10px]">2. What is the Occasion?</label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/30 text-white font-semibold"
              >
                <option className="bg-[#3D1E16] text-white" value="wedding">Wedding / Anniversary</option>
                <option className="bg-[#3D1E16] text-white" value="housewarming">Housewarming / Griha Pravesh</option>
                <option className="bg-[#3D1E16] text-white" value="festival">Festival (Diwali, Rakhi, Holi)</option>
                <option className="bg-[#3D1E16] text-white" value="corporate">Official Corporate Milestone</option>
              </select>
            </div>

            {/* Budget */}
            <div className="space-y-1.5">
              <label className="block text-gray-300 uppercase tracking-wider text-[10px]">3. Select Budget Tier</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "low", label: "Under ₹1,500" },
                  { id: "mid", label: "₹1,500 - ₹5,000" },
                  { id: "high", label: "Above ₹5,000" }
                ].map(b => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBudget(b.id)}
                    className={`py-2 px-1 border rounded-xl text-[10px] transition-all text-center ${
                      budget === b.id
                        ? "border-[#B56D3E] bg-[#B56D3E] text-white"
                        : "border-white/10 bg-white/5 hover:bg-white/10 text-gray-300"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-xl font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Gift Matches...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300" /> Matches Heritage Gifts
                </>
              )}
            </button>

          </form>
        </div>

        {/* RIGHT: Results Presentation */}
        <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-6 h-full flex flex-col justify-center min-h-[300px]">
          {loading ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-gray-400 font-medium">Matching regional craft registries, ODOP catalogs, and artisan ratings...</p>
            </div>
          ) : results ? (
            <div className="space-y-5 animate-fadeIn">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5 border-b border-white/10 pb-2">
                <Gift className="w-4 h-4" /> Recommended Heritage Matches
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((item, idx) => (
                  <div key={idx} className="bg-white/[0.03] border border-white/10 rounded-xl p-3 flex flex-col justify-between gap-3 text-xs">
                    
                    <div className="space-y-2">
                      <div className="aspect-[4/3] rounded-lg overflow-hidden border border-white/5 relative">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 bg-[#3D1E16]/80 text-[#C09355] text-[8px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" /> {item.origin}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="font-serif font-bold text-white text-xs leading-snug line-clamp-1">{item.name}</h4>
                        <p className="text-[10px] text-gray-400 leading-normal line-clamp-2">{item.reason}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-2">
                      <span className="font-bold text-[#C09355]">₹{item.price.toLocaleString()}</span>
                      <Link
                        href={`/products/${item.slug}`}
                        className="px-3 py-1 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1"
                      >
                        Gift Now <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <Gift className="w-12 h-12 text-[#C09355]/30 mx-auto animate-bounce" />
              <h3 className="font-serif font-bold text-sm text-white">Find Authentic Indian Heritage Gifts</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                Enter your recipient details, select budget limits, and click matching buttons to fetch customized artisan gifting solutions.
              </p>
            </div>
          )}
        </div>

      </div>

    </section>
  );
}
