"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Check, Save, Plus, Trash2, ShieldAlert, Sparkles, RefreshCw, MapPin } from "lucide-react";

interface Section {
  id: string;
  name: string;
  isEnabled: boolean;
  order: number;
}

interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
}

export default function AdminHomepageManager() {
  const [sections, setSections] = useState<Section[]>([]);
  const [promoText, setPromoText] = useState("");
  const [promoEnabled, setPromoEnabled] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Special Place details
  const [specialStateId, setSpecialStateId] = useState("rj");
  const [specialTitle, setSpecialTitle] = useState("");
  const [specialDesc, setSpecialDesc] = useState("");
  const [specialImg, setSpecialImg] = useState("");

  // New review form
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewLoc, setNewReviewLoc] = useState("");
  const [newReviewText, setNewReviewText] = useState("");

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/homepage");
      if (res.ok) {
        const data = await res.json();
        setSections(data.sections.sort((a: any, b: any) => a.order - b.order));
        setPromoText(data.activePromo.text);
        setPromoEnabled(data.activePromo.isEnabled);
        setTestimonials(data.testimonials || []);
        
        if (data.specialPlace) {
          setSpecialStateId(data.specialPlace.stateId || "rj");
          setSpecialTitle(data.specialPlace.title || "");
          setSpecialDesc(data.specialPlace.description || "");
          setSpecialImg(data.specialPlace.imageUrl || "");
        }
      } else {
        throw new Error("Failed to load homepage configuration database");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleSaveConfigs = async () => {
    setError(null);
    setSuccess(null);
    setSaving(true);

    // Re-index orders to match layout order array
    const updatedSections = sections.map((sec, idx) => ({
      ...sec,
      order: idx + 1
    }));

    try {
      const res = await fetch("/api/admin/homepage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-mock-role": "Super Admin"
        },
        body: JSON.stringify({
          sections: updatedSections,
          activePromo: {
            text: promoText,
            isEnabled: promoEnabled
          },
          testimonials,
          specialPlace: {
            stateId: specialStateId,
            title: specialTitle,
            description: specialDesc,
            imageUrl: specialImg
          }
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save configs");

      setSuccess("Homepage layout and preferences saved successfully!");
      fetchConfigs();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setSections(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setSections(updated);
  };

  const handleToggleSection = (index: number) => {
    const updated = [...sections];
    updated[index].isEnabled = !updated[index].isEnabled;
    setSections(updated);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName || !newReviewText) return;

    const newTestimonial: Testimonial = {
      id: `t-${Date.now()}`,
      name: newReviewName,
      location: newReviewLoc || "India",
      text: newReviewText,
      rating: 5
    };

    setTestimonials([...testimonials, newTestimonial]);
    setNewReviewName("");
    setNewReviewLoc("");
    setNewReviewText("");
    setSuccess("New review added to queue. Click 'Save Configs' to publish.");
  };

  const handleDeleteReview = (id: string) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
    setSuccess("Review removed. Click 'Save Configs' to publish.");
  };

  return (
    <div className="min-h-screen bg-[#FAF5EE] p-6 lg:p-10 text-[#2E1E1A]">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#C09355]/20 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-serif text-[#3D1E16] font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#B56D3E]" />
              Homepage Layout CMS Manager
            </h1>
            <p className="text-sm text-gray-555 mt-1 font-medium">
              Configure homepage section ordering, toggle displays, active promos, special map spot, and customer testimonials in real-time.
            </p>
          </div>
          
          <button
            onClick={handleSaveConfigs}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-xl shadow-md hover:shadow-lg transition-all text-xs font-extrabold uppercase tracking-wider font-sans"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Configs
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Error:</span> {error}
            </div>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-3 bg-green-55/10 border border-green-200 rounded-2xl p-4 text-green-700 text-sm">
            <Check className="w-5 h-5 shrink-0" />
            <div>{success}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Section Sorters (Span 7) */}
          <div className="lg:col-span-7 bg-[#FDFBF7] rounded-3xl border border-gray-200/80 p-6 space-y-4 shadow-md">
            <div>
              <h2 className="text-lg font-serif text-[#3D1E16] font-semibold">Home Layout Order</h2>
              <p className="text-[11px] text-gray-400">Toggle sections or use up/down buttons to adjust vertical ordering.</p>
            </div>

            {loading ? (
              <div className="text-center py-20 text-xs text-gray-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#B56D3E] mb-2" />
                Loading Homepage Data...
              </div>
            ) : (
              <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
                {sections.map((sec, idx) => (
                  <div 
                    key={sec.id}
                    className={`p-3.5 border rounded-2xl flex items-center justify-between gap-4 transition-all ${
                      sec.isEnabled 
                        ? "bg-white border-[#C09355]/25 hover:border-[#C09355]/55 shadow-sm" 
                        : "bg-gray-50 border-gray-200 text-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#FAF5EE] text-[#B56D3E] flex items-center justify-center font-mono text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-xs text-[#3D1E16] leading-none">
                        {sec.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Toggle status button */}
                      <button
                        onClick={() => handleToggleSection(idx)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                          sec.isEnabled
                            ? "bg-green-55/15 text-green-700 border-green-200 hover:bg-green-100"
                            : "bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-150"
                        }`}
                      >
                        {sec.isEnabled ? "Active" : "Inactive"}
                      </button>

                      {/* Direction controls */}
                      <button
                        disabled={idx === 0}
                        onClick={() => handleMoveUp(idx)}
                        className="p-1.5 hover:bg-[#FAF5EE] rounded-lg border border-gray-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                      >
                        <ArrowUp className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                      <button
                        disabled={idx === sections.length - 1}
                        onClick={() => handleMoveDown(idx)}
                        className="p-1.5 hover:bg-[#FAF5EE] rounded-lg border border-gray-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                      >
                        <ArrowDown className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Promos, Special Map Spot, & Reviews (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Promo banner editor */}
            <div className="bg-[#FDFBF7] rounded-3xl border border-gray-200/80 p-6 space-y-4 shadow-md text-left">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <h3 className="text-base font-serif text-[#3D1E16] font-bold">Active Promotion Banner</h3>
                <button
                  type="button"
                  onClick={() => setPromoEnabled(!promoEnabled)}
                  className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border transition-colors uppercase ${
                    promoEnabled ? "bg-green-55/15 text-green-700 border-green-200" : "bg-gray-100 text-gray-400 border-gray-200"
                  }`}
                >
                  {promoEnabled ? "Enabled" : "Disabled"}
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Promotion Ribbon Text</label>
                <textarea
                  value={promoText}
                  onChange={(e) => setPromoText(e.target.value)}
                  placeholder="e.g. Festive Curation: Get 10% off Paithani Handlooms & Blue Pottery. Use Code: HERITAGE10"
                  rows={2}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#B56D3E] text-gray-700"
                />
              </div>
            </div>

            {/* Special Place Editor */}
            <div className="bg-[#FDFBF7] rounded-3xl border border-gray-200/80 p-6 space-y-4 shadow-md text-left">
              <div className="border-b border-gray-100 pb-2">
                <h3 className="text-base font-serif text-[#3D1E16] font-bold flex items-center gap-1.5">
                  <MapPin className="w-4.5 h-4.5 text-[#B56D3E]" /> Map Curated Specialty Spot
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Define the featured place displayed on the interactive map by default.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Target State</label>
                  <select
                    value={specialStateId}
                    onChange={(e) => setSpecialStateId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B56D3E] text-gray-700"
                  >
                    <option value="rj">Rajasthan</option>
                    <option value="up">Uttar Pradesh</option>
                    <option value="mh">Maharashtra</option>
                    <option value="ka">Karnataka</option>
                    <option value="kl">Kerala</option>
                    <option value="ap">Andhra Pradesh</option>
                    <option value="gj">Gujarat</option>
                    <option value="mp">Madhya Pradesh</option>
                    <option value="tn">Tamil Nadu</option>
                    <option value="wb">West Bengal</option>
                    <option value="jk">Jammu & Kashmir</option>
                    <option value="ut">Uttarakhand</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Spot Title</label>
                  <input
                    type="text"
                    value={specialTitle}
                    onChange={(e) => setSpecialTitle(e.target.value)}
                    placeholder="e.g. Jaipur Craft Capital"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B56D3E] text-gray-700 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Spot Image URL</label>
                  <input
                    type="text"
                    value={specialImg}
                    onChange={(e) => setSpecialImg(e.target.value)}
                    placeholder="https://images.unsplash.com/... or /images/..."
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B56D3E] text-gray-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Spot Description</label>
                  <textarea
                    value={specialDesc}
                    onChange={(e) => setSpecialDesc(e.target.value)}
                    placeholder="Provide a historical or cultural synopsis of the crafts here..."
                    rows={3}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B56D3E] text-gray-700 leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Testimonials editor */}
            <div className="bg-[#FDFBF7] rounded-3xl border border-gray-200/80 p-6 space-y-4 shadow-md text-left">
              <div>
                <h3 className="text-base font-serif text-[#3D1E16] font-bold">Manage Customer Testimonials</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Queue testimonials showing on customer feedback rails.</p>
              </div>

              {/* Add form */}
              <form onSubmit={handleAddReview} className="space-y-3 bg-[#FAF5EE]/40 p-3 rounded-2xl border border-[#C09355]/10">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Location (e.g. Pune)"
                    value={newReviewLoc}
                    onChange={(e) => setNewReviewLoc(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <textarea
                  placeholder="Review review message..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  rows={2}
                  className="w-full px-2.5 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1 py-2 bg-[#3D1E16] hover:bg-[#28140E] text-white rounded-lg text-[10px] font-black uppercase tracking-wider font-sans"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Testimonial
                </button>
              </form>

              {/* Active testimonials list */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {testimonials.map(t => (
                  <div key={t.id} className="p-2.5 bg-white border border-gray-150 rounded-2xl flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="text-[11px] text-gray-650 leading-relaxed italic font-serif">"{t.text}"</p>
                      <div className="flex gap-2 text-[9px] font-bold text-gray-400 uppercase">
                        <span className="text-[#3D1E16]">{t.name}</span>
                        <span>{t.location}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteReview(t.id)}
                      className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
