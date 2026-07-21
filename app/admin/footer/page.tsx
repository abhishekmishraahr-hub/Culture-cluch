"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Check, Save, ShieldAlert, Sparkles, RefreshCw, Eye } from "lucide-react";

interface LinkItem {
  id?: string;
  label: string;
  url: string;
  isEnabled?: boolean;
}

interface Section {
  id: string;
  title: string;
  isEnabled: boolean;
  order: number;
  links: LinkItem[];
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  isEnabled: boolean;
}

interface ContactInfo {
  corporateOffice: string;
  registeredOffice: string;
  email: string;
  phone: string;
  whatsApp: string;
  businessHours: string;
  googleMapsUrl: string;
}

interface Settings {
  copyright: string;
  companyRegistration: string;
  gstNumber: string;
  trademark: string;
  accessibilityStmt: string;
  cookieSettings: string;
  versionNumber: string;
}

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export default function AdminFooterManager() {
  const [sections, setSections] = useState<Section[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    corporateOffice: "", registeredOffice: "", email: "", phone: "", whatsApp: "", businessHours: "", googleMapsUrl: ""
  });
  const [settings, setSettings] = useState<Settings>({
    copyright: "", companyRegistration: "", gstNumber: "", trademark: "", accessibilityStmt: "", cookieSettings: "", versionNumber: "1.0.0"
  });
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states to add new link under a section
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  const fetchFooterConfigs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/footer");
      if (res.ok) {
        const data = await res.json();
        setSections(data.sections || []);
        setSocialLinks(data.socialLinks || []);
        setContactInfo(data.contactInfo);
        setSettings(data.settings);
        setSubscribers(data.subscribers || []);
      } else {
        throw new Error("Failed to load footer configurations");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooterConfigs();
  }, []);

  const handleSaveConfigs = async () => {
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const res = await fetch("/api/admin/footer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-mock-role": "Super Admin"
        },
        body: JSON.stringify({
          sections,
          socialLinks,
          contactInfo,
          settings
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save configurations");

      setSuccess("Footer layout and corporate data saved successfully!");
      fetchFooterConfigs();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSection = (secId: string) => {
    setSections(sections.map(s => s.id === secId ? { ...s, isEnabled: !s.isEnabled } : s));
  };

  const handleAddLink = (secId: string) => {
    if (!newLinkLabel || !newLinkUrl) return;
    setSections(sections.map(s => {
      if (s.id === secId) {
        return {
          ...s,
          links: [...s.links, { label: newLinkLabel, url: newLinkUrl, isEnabled: true }]
        };
      }
      return s;
    }));
    setNewLinkLabel("");
    setNewLinkUrl("");
    setActiveSectionId(null);
    setSuccess("New link queued. Save configs to apply changes.");
  };

  const handleDeleteLink = (secId: string, linkIdx: number) => {
    setSections(sections.map(s => {
      if (s.id === secId) {
        return {
          ...s,
          links: s.links.filter((_, idx) => idx !== linkIdx)
        };
      }
      return s;
    }));
    setSuccess("Link removed from queue. Save configs to apply changes.");
  };

  const handleToggleSocial = (platform: string) => {
    setSocialLinks(socialLinks.map(s => s.platform === platform ? { ...s, isEnabled: !s.isEnabled } : s));
  };

  const handleSocialUrlChange = (platform: string, url: string) => {
    setSocialLinks(socialLinks.map(s => s.platform === platform ? { ...s, url } : s));
  };

  return (
    <div className="min-h-screen bg-[#FAF5EE] p-6 lg:p-10 text-[#2E1E1A]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#C09355]/20 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-serif text-[#3D1E16] font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#B56D3E]" />
              Enterprise Footer CMS Panel
            </h1>
            <p className="text-xs text-gray-550 mt-1 font-semibold">
              Manage multi-column links, verified corporate registers, GST, support channels, and view community subscribers.
            </p>
          </div>
          
          <button
            onClick={handleSaveConfigs}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-xl shadow-md hover:shadow-lg transition-all text-xs font-extrabold uppercase tracking-wider"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Footer Configs
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
          
          {/* LEFT PANEL: Sections & Links (Span 7) */}
          <div className="lg:col-span-7 bg-[#FDFBF7] rounded-3xl border border-gray-200/80 p-6 space-y-6 shadow-md">
            <div>
              <h2 className="text-lg font-serif text-[#3D1E16] font-semibold">Navigation Columns & Links</h2>
              <p className="text-[11px] text-gray-400">Configure footer link columns and toggle visibility states.</p>
            </div>

            {loading ? (
              <div className="text-center py-20 text-xs text-gray-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#B56D3E] mb-2" />
                Loading Footer Configurations...
              </div>
            ) : (
              <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1">
                {sections.map((sec) => (
                  <div key={sec.id} className="border border-[#C09355]/20 bg-white p-4.5 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="font-serif font-black text-sm text-[#3D1E16]">{sec.title}</span>
                      <button
                        onClick={() => handleToggleSection(sec.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border transition-colors uppercase ${
                          sec.isEnabled ? "bg-green-55/15 text-green-700 border-green-200" : "bg-gray-100 text-gray-400 border-gray-200"
                        }`}
                      >
                        {sec.isEnabled ? "Enabled" : "Disabled"}
                      </button>
                    </div>

                    {/* Links List */}
                    <div className="space-y-2">
                      {sec.links && sec.links.map((link, lIdx) => (
                        <div key={lIdx} className="flex justify-between items-center text-xs bg-gray-50/50 px-3 py-2 rounded-xl border border-gray-100">
                          <div>
                            <span className="font-bold text-[#3D1E16]">{link.label}</span>
                            <span className="ml-2 text-[10px] text-gray-400 font-mono">{link.url}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteLink(sec.id, lIdx)}
                            className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-655 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Link button triggers */}
                    {activeSectionId === sec.id ? (
                      <div className="grid grid-cols-2 gap-2 bg-[#FAF5EE]/40 p-3 rounded-xl border border-[#C09355]/10 items-end">
                        <input
                          type="text"
                          placeholder="Link Label"
                          value={newLinkLabel}
                          onChange={(e) => setNewLinkLabel(e.target.value)}
                          className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          placeholder="URL Path"
                          value={newLinkUrl}
                          onChange={(e) => setNewLinkUrl(e.target.value)}
                          className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                        />
                        <div className="col-span-2 flex gap-2 justify-end pt-1">
                          <button
                            onClick={() => setActiveSectionId(null)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-bold uppercase"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleAddLink(sec.id)}
                            className="px-3 py-1.5 bg-[#3D1E16] text-white rounded-lg text-[10px] font-bold uppercase flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Add Link
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveSectionId(sec.id)}
                        className="w-full py-2 bg-[#FAF5EE] hover:bg-[#C09355]/5 border border-dashed border-[#C09355]/30 rounded-xl text-[10px] font-bold uppercase tracking-wider text-[#B56D3E] flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Append Link
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT PANEL: Settings & Contacts (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Contact Channels Card */}
            <div className="bg-[#FDFBF7] rounded-3xl border border-gray-200/80 p-6 space-y-4 shadow-md text-left">
              <h3 className="text-base font-serif text-[#3D1E16] font-bold border-b border-gray-100 pb-2">Support Channels & Hours</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="text"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className="w-full px-2.5 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Support Phone</label>
                  <input
                    type="text"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className="w-full px-2.5 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Corporate Office Address</label>
                  <textarea
                    value={contactInfo.corporateOffice}
                    onChange={(e) => setContactInfo({ ...contactInfo, corporateOffice: e.target.value })}
                    rows={2}
                    className="w-full px-2.5 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Legal settings */}
            <div className="bg-[#FDFBF7] rounded-3xl border border-gray-200/80 p-6 space-y-4 shadow-md text-left">
              <h3 className="text-base font-serif text-[#3D1E16] font-bold border-b border-gray-100 pb-2">Legal Registries</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Company CIN Number</label>
                  <input
                    type="text"
                    value={settings.companyRegistration}
                    onChange={(e) => setSettings({ ...settings, companyRegistration: e.target.value })}
                    className="w-full px-2.5 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">GSTIN Number</label>
                  <input
                    type="text"
                    value={settings.gstNumber}
                    onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
                    className="w-full px-2.5 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Copyright Statement</label>
                  <input
                    type="text"
                    value={settings.copyright}
                    onChange={(e) => setSettings({ ...settings, copyright: e.target.value })}
                    className="w-full px-2.5 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Social profiles urls */}
            <div className="bg-[#FDFBF7] rounded-3xl border border-gray-200/80 p-6 space-y-4 shadow-md text-left">
              <h3 className="text-base font-serif text-[#3D1E16] font-bold border-b border-gray-100 pb-2">Social Channels Linkage</h3>
              
              <div className="space-y-3">
                {socialLinks.map(s => (
                  <div key={s.id} className="flex gap-2 items-center justify-between text-xs">
                    <span className="w-20 font-bold text-gray-500 uppercase text-[10px] tracking-wider">{s.platform}</span>
                    <input
                      type="text"
                      value={s.url}
                      onChange={(e) => handleSocialUrlChange(s.platform, e.target.value)}
                      placeholder="Enter profile URL"
                      className="flex-grow px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleToggleSocial(s.platform)}
                      className={`px-2 py-1 rounded text-[9px] font-bold border ${
                        s.isEnabled ? "bg-green-55/15 border-green-200 text-green-700" : "bg-gray-100 text-gray-400 border-gray-200"
                      }`}
                    >
                      {s.isEnabled ? "On" : "Off"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscriber list display */}
            <div className="bg-[#FDFBF7] rounded-3xl border border-gray-200/80 p-6 space-y-4 shadow-md text-left">
              <div>
                <h3 className="text-base font-serif text-[#3D1E16] font-bold">Community Subscribers ({subscribers.length})</h3>
                <p className="text-[10px] text-gray-450 mt-0.5">Collectors subscribed to the Artisan Chronicles newsletter.</p>
              </div>

              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {subscribers.length === 0 ? (
                  <div className="text-center py-6 text-gray-450 italic text-[10px]">No subscribers yet.</div>
                ) : (
                  subscribers.map((sub) => (
                    <div key={sub.id} className="p-2 bg-white border border-gray-150 rounded-xl flex justify-between items-center text-[10px] font-mono">
                      <span>{sub.email}</span>
                      <span className="text-gray-400">{new Date(sub.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
