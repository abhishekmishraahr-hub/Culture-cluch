import React from "react";
import { Briefcase, MapPin, Clock, DollarSign, Send, ArrowRight } from "lucide-react";

export default function CareersPage() {
  const jobs = [
    {
      id: "1",
      title: "Artisan Partnership Manager",
      department: "Artisan Relations",
      location: "New Delhi (Hybrid)",
      type: "Full-Time",
      salary: "₹6,00,000 - ₹8,50,000 / year",
      desc: "Lead relations with village cooperatives and district committees to audit, onboard, and support local handloom weavers and handicraft artisans."
    },
    {
      id: "2",
      title: "Sourcing & Quality Auditor",
      department: "Supply Chain",
      location: "Varanasi / Lucknow (On-Site)",
      type: "Full-Time",
      salary: "₹5,00,000 - ₹7,00,000 / year",
      desc: "Audit geographical GI tags and ODOP authenticity of agriculture specialties (spices, organic food items) directly at the processing hubs."
    },
    {
      id: "3",
      title: "Creative Content Storyteller",
      department: "Marketing",
      location: "Remote / Bengaluru",
      type: "Contract",
      salary: "₹4,00,000 - ₹5,50,000 / year",
      desc: "Visit local artisan hubs, conduct interviews, take high-quality photographs, and draft the historical stories featured in our Chronicles section."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF5EE] text-[#2E1E1A] py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#C09355]/10 text-[#B56D3E] border border-[#C09355]/30 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" /> Join Our Mission
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-[#3D1E16] leading-tight">
            Build the Future of <span className="italic font-normal text-[#B56D3E]">Heritage Commerce</span>
          </h1>
          <p className="text-sm text-gray-550 leading-relaxed">
            At Cultural Clutch, we are connecting local Indian artisans and district specialties directly with global consumers under the Vocal for Local initiative.
          </p>
        </div>

        {/* Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-gray-200/60 shadow-sm space-y-2">
            <h3 className="font-serif font-bold text-[#3D1E16] text-base">Support Local Artisans</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every role contributes directly to enhancing the livelihoods of rural weavers, clay artists, and spice farmers across India.
            </p>
          </div>
          <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-gray-200/60 shadow-sm space-y-2">
            <h3 className="font-serif font-bold text-[#3D1E16] text-base">Authenticity Checked</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Help build database tracking models that guarantee 100% genuine GI tags and ODOP district certifications.
            </p>
          </div>
          <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-gray-200/60 shadow-sm space-y-2">
            <h3 className="font-serif font-bold text-[#3D1E16] text-base">Hybrid & Flexible</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We offer generous remote choices, travel allowances to artisan locations, and health benefits.
            </p>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          <h2 className="text-xl font-serif font-bold text-[#3D1E16] border-b border-[#C09355]/20 pb-2">
            Current Open Roles
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className="bg-[#FDFBF7] border border-gray-200/70 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="space-y-1">
                    <span className="text-[10px] bg-[#C09355]/15 text-[#B56D3E] font-bold uppercase px-2 py-0.5 rounded">
                      {job.department}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-[#3D1E16]">
                      {job.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-550 leading-relaxed">
                    {job.desc}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-medium">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#B56D3E]" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#B56D3E]" /> {job.type}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-[#B56D3E]" /> {job.salary}</span>
                  </div>
                </div>
                
                <button className="self-start md:self-auto px-5 py-2.5 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-2 transition-all shrink-0">
                  Apply Now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <div className="max-w-2xl mx-auto bg-[#FDFBF7] border border-gray-200 p-8 rounded-3xl shadow-md space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-serif font-bold text-[#3D1E16]">Submit An Application</h2>
            <p className="text-xs text-gray-500">
              Don't see a matching role? Send your resume anyway! We are always looking for passionate talent.
            </p>
          </div>

          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20"
                placeholder="Aarav Sharma"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20"
                placeholder="aarav@domain.com"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Role of Interest
              </label>
              <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 text-gray-600">
                <option>Select a position...</option>
                <option>Artisan Partnership Manager</option>
                <option>Sourcing & Quality Auditor</option>
                <option>Creative Content Storyteller</option>
                <option>General Application / Other</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Resume / Portfolio Link
              </label>
              <input
                type="url"
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20"
                placeholder="https://linkedin.com/in/... or drive link"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Brief Cover Pitch (Why Cultural Clutch?)
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20"
                placeholder="Tell us about your connection to Indian local crafts, or your professional experience..."
              />
            </div>
            <div className="sm:col-span-2 text-center pt-2">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#3D1E16] hover:bg-[#28140E] text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                Submit Application <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
