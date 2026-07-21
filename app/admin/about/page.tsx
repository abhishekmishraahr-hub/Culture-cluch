"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, ShieldAlert, Check, RefreshCw, Edit2, FileText, Save } from "lucide-react";
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

export default function AdminAboutConfigPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ourStoryTitle, setOurStoryTitle] = useState("");
  const [ourStoryText, setOurStoryText] = useState("");
  const [ourStoryImage, setOurStoryImage] = useState("");
  const [ourStoryImageAlignment, setOurStoryImageAlignment] = useState("right");
  const [ourStoryImageWidth, setOurStoryImageWidth] = useState("medium");
  const [ourMissionTitle, setOurMissionTitle] = useState("");
  const [ourMissionText, setOurMissionText] = useState("");
  const [ourFounderTitle, setOurFounderTitle] = useState("");
  const [ourFounderName, setOurFounderName] = useState("");
  const [ourFounderTitleDescription, setOurFounderTitleDescription] = useState("");
  const [ourFounderText, setOurFounderText] = useState("");
  const [ourFounderImage, setOurFounderImage] = useState("");
  const [ourFounderImageWidth, setOurFounderImageWidth] = useState("small");
  const [ourFounderImageAlignment, setOurFounderImageAlignment] = useState("left");
  const [ourPromiseTitle, setOurPromiseTitle] = useState("");
  const [ourPromiseText, setOurPromiseText] = useState("");
  const [tagline, setTagline] = useState("");

  const fetchAboutData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/about");
      if (!res.ok) throw new Error("Failed to load About Us configuration.");
      const json: AboutData = await res.json();
      
      setTitle(json.title || "");
      setSubtitle(json.subtitle || "");
      setOurStoryTitle(json.ourStoryTitle || "");
      setOurStoryText(json.ourStoryText || "");
      setOurStoryImage(json.ourStoryImage || "");
      setOurStoryImageAlignment(json.ourStoryImageAlignment || "right");
      setOurStoryImageWidth(json.ourStoryImageWidth || "medium");
      setOurMissionTitle(json.ourMissionTitle || "");
      setOurMissionText(json.ourMissionText || "");
      setOurFounderTitle(json.ourFounderTitle || "");
      setOurFounderName(json.ourFounderName || "");
      setOurFounderTitleDescription(json.ourFounderTitleDescription || "");
      setOurFounderText(json.ourFounderText || "");
      setOurFounderImage(json.ourFounderImage || "");
      setOurFounderImageWidth(json.ourFounderImageWidth || "small");
      setOurFounderImageAlignment(json.ourFounderImageAlignment || "left");
      setOurPromiseTitle(json.ourPromiseTitle || "");
      setOurPromiseText(json.ourPromiseText || "");
      setTagline(json.tagline || "");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload: AboutData = {
      title,
      subtitle,
      ourStoryTitle,
      ourStoryText,
      ourStoryImage,
      ourStoryImageAlignment,
      ourStoryImageWidth,
      ourMissionTitle,
      ourMissionText,
      ourFounderTitle,
      ourFounderName,
      ourFounderTitleDescription,
      ourFounderText,
      ourFounderImage,
      ourFounderImageWidth,
      ourFounderImageAlignment,
      ourPromiseTitle,
      ourPromiseText,
      tagline
    };

    try {
      // Determine if running in local simulation where session is local mock
      const mockSession = localStorage.getItem("mock_session");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (mockSession) {
        const user = JSON.parse(mockSession);
        headers["x-mock-role"] = user.role;
      }

      const res = await fetch("/api/about", {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update page");

      setSuccess("About Us story page configuration updated successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF5EE] p-10 flex items-center justify-center flex-col gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-[#B56D3E]" />
        <span className="text-sm font-semibold text-gray-550">Retrieving About configuration...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF5EE] p-6 lg:p-10 text-[#2E1E1A]">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#C09355]/20 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-serif text-[#3D1E16] font-bold flex items-center gap-2">
              <FileText className="w-8 h-8 text-[#B56D3E]" /> About Us Page Editor
            </h1>
            <p className="text-sm text-gray-550 mt-1">
              Customize the brand narrative, founder message, mission, and promises.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/about"
              target="_blank"
              className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl transition-all text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              View Live Page
            </Link>
            <button
              onClick={fetchAboutData}
              className="flex items-center gap-2 px-4 py-2 bg-[#FDFBF7] border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-xs font-bold uppercase tracking-wider"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Error:</span> {error}
            </div>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm">
            <Check className="w-5 h-5 shrink-0" />
            <div>{success}</div>
          </div>
        )}

        {/* Editor Form */}
        <form onSubmit={handleSubmit} className="bg-[#FDFBF7] rounded-2xl border border-gray-200/80 shadow-md p-6 md:p-8 space-y-6">
          
          {/* Main Hero Header Info */}
          <div className="bg-[#FAF5EE] p-5 rounded-2xl border border-[#C09355]/20 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#B56D3E]">
              Main Header Banner
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                  Main Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                  Sub-title / Tagline
                </label>
                <input
                  type="text"
                  required
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20"
                />
              </div>
            </div>
          </div>

          {/* Section 1: Our Story */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D1E16] border-b border-gray-100 pb-1">
              Section 1: Our Story
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-550 uppercase mb-1">
                  Section Header
                </label>
                <input
                  type="text"
                  required
                  value={ourStoryTitle}
                  onChange={(e) => setOurStoryTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-550 uppercase mb-1">
                  Story Content
                </label>
                <textarea
                  required
                  rows={6}
                  value={ourStoryText}
                  onChange={(e) => setOurStoryText(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-550 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 font-serif leading-relaxed"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-550 uppercase mb-1">
                    Story Image Path / URL
                  </label>
                  <input
                    type="text"
                    value={ourStoryImage}
                    onChange={(e) => setOurStoryImage(e.target.value)}
                    placeholder="/story-concept.png"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-550 uppercase mb-1">
                    Image Alignment
                  </label>
                  <select
                    value={ourStoryImageAlignment}
                    onChange={(e) => setOurStoryImageAlignment(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm cursor-pointer"
                  >
                    <option value="left">Left (Story on Right)</option>
                    <option value="right">Right (Story on Left)</option>
                    <option value="top">Top (Full Width Center)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-550 uppercase mb-1">
                    Image Size / Width
                  </label>
                  <select
                    value={ourStoryImageWidth}
                    onChange={(e) => setOurStoryImageWidth(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm cursor-pointer"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Mission */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D1E16] border-b border-gray-100 pb-1">
              Section 2: Our Mission
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-550 uppercase mb-1">
                  Section Header
                </label>
                <input
                  type="text"
                  required
                  value={ourMissionTitle}
                  onChange={(e) => setOurMissionTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-550 uppercase mb-1">
                  Mission Content
                </label>
                <textarea
                  required
                  rows={4}
                  value={ourMissionText}
                  onChange={(e) => setOurMissionText(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 font-serif leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Founder */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D1E16] border-b border-gray-100 pb-1">
              Section 3: Founder Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-550 uppercase mb-1">
                  Founder Block Header
                </label>
                <input
                  type="text"
                  required
                  value={ourFounderTitle}
                  onChange={(e) => setOurFounderTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-555 uppercase mb-1">
                  Founder Name
                </label>
                <input
                  type="text"
                  required
                  value={ourFounderName}
                  onChange={(e) => setOurFounderName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-555 uppercase mb-1">
                  Founder Description/Role
                </label>
                <input
                  type="text"
                  required
                  value={ourFounderTitleDescription}
                  onChange={(e) => setOurFounderTitleDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-550 uppercase mb-1">
                Founder Story Content
              </label>
              <textarea
                required
                rows={4}
                value={ourFounderText}
                onChange={(e) => setOurFounderText(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-55/20 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 font-serif leading-relaxed"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-550 uppercase mb-1">
                  Founder Image Path / URL
                </label>
                <input
                  type="text"
                  value={ourFounderImage}
                  onChange={(e) => setOurFounderImage(e.target.value)}
                  placeholder="/logo.jpg"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-555 uppercase mb-1">
                  Image Alignment
                </label>
                <select
                  value={ourFounderImageAlignment}
                  onChange={(e) => setOurFounderImageAlignment(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm cursor-pointer"
                >
                  <option value="left">Left Avatar</option>
                  <option value="right">Right Avatar</option>
                  <option value="top">Top Header Image</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-555 uppercase mb-1">
                  Image Size / Width
                </label>
                <select
                  value={ourFounderImageWidth}
                  onChange={(e) => setOurFounderImageWidth(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm cursor-pointer"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Brand Promise */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D1E16] border-b border-gray-100 pb-1">
              Section 4: Our Promise
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-550 uppercase mb-1">
                  Promise Card Header
                </label>
                <input
                  type="text"
                  required
                  value={ourPromiseTitle}
                  onChange={(e) => setOurPromiseTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-550 uppercase mb-1">
                  Promise Card Content
                </label>
                <textarea
                  required
                  rows={4}
                  value={ourPromiseText}
                  onChange={(e) => setOurPromiseText(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 font-serif"
                />
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D1E16] border-b border-gray-100 pb-1">
              Bottom Banner
            </h3>
            <div>
              <label className="block text-[11px] font-bold text-gray-550 uppercase mb-1">
                Footer Tagline / Slogans
              </label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-xl shadow-md hover:shadow-lg transition-all text-xs font-bold uppercase tracking-wider disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Page Configuration
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
