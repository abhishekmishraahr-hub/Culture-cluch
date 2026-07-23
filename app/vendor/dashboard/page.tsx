"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  BarChart3, 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Settings, 
  LogOut, 
  Sparkles, 
  Clock, 
  Bell, 
  ChevronRight, 
  Upload, 
  BookOpen,
  Menu,
  X
} from "lucide-react";

export default function VendorDashboard() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session } = useSession();

  // Load products dynamically on mount
  useEffect(() => {
    fetch("/api/vendor/products")
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Failed to load vendor products");
      })
      .then(data => {
        setProducts(data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          stock: p.stock,
          status: p.isActive ? "Published" : (p.approvalWorkflow ? "Submitted" : "Draft"),
          stage: p.approvalWorkflow?.currentStage || (p.isActive ? "Published" : "Draft")
        })));
      })
      .catch(err => {
        console.warn("Failed to load database products for vendor:", err);
      });
  }, [session]);

  // Vendor Catalog State
  const [products, setProducts] = useState([
    { id: "P-801", name: "Banarasi Katan Silk Saree", price: 12500, stock: 4, status: "Published", stage: "Published" },
    { id: "P-802", name: "Jaipur Handpainted Blue Vase", price: 3200, stock: 12, status: "Submitted", stage: "Quality_Review" },
    { id: "P-803", name: "Madhubani Hand-painted Frame", price: 4500, stock: 2, status: "Draft", stage: "Draft" },
    { id: "P-804", name: "Bhagalpur Pure Tassar Silk Saree", price: 8500, stock: 0, status: "Rejected", stage: "Content_Review", rejectReason: "Craft story grammar and authenticity certificates missing." }
  ]);

  // Orders State
  const [orders, setOrders] = useState([
    { id: "ORD-9081", customer: "Pooja Hegde", amount: 12500, date: "2026-07-18", status: "Ready to Ship" },
    { id: "ORD-9076", customer: "Rajiv Malhotra", amount: 3200, date: "2026-07-17", status: "Delivered" }
  ]);

  // Form states for Product Onboarding
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodStock, setProdStock] = useState("");
  const [prodCategory, setProdCategory] = useState("Handlooms & Textiles");
  const [prodDistrict, setProdDistrict] = useState("Varanasi");
  const [prodState, setProdState] = useState("Uttar Pradesh");
  
  // Storytelling state
  const [artisanStory, setArtisanStory] = useState("");
  const [craftProcess, setCraftProcess] = useState("");
  const [culturalSignificance, setCulturalSignificance] = useState("");
  
  // AI assistance loader
  const [isAiLoading, setIsAiLoading] = useState(false);

  // File Upload mock state
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // AI Story & SEO generator simulation
  const handleAiGeneration = (field: string) => {
    if (!prodName) {
      showToast("Please enter a Product Name first to give context to the AI.");
      return;
    }
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      if (field === "story") {
        setArtisanStory(`Passed down through five generations of master weavers in ${prodDistrict}, this authentic craft embodies the legacy of the local artisan coop. Each detail of the weave is handcrafted over a 15-day meticulous process.`);
        setCraftProcess("We dye the raw silks with organic marigold and indigo leaf dyes, preparing the warp strings on a traditional counter-march pit loom.");
        setCulturalSignificance(`Historically woven for regional royal courts, this pattern represents protection and prosperity during standard wedding festivals.`);
        showToast("AI Storytelling generated successfully!");
      }
    }, 1500);
  };

  const handleAddNewProduct = (e: React.FormEvent, isDraft: boolean) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodStock) return;
    
    const sku = `VND-VAR-${prodName.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6)}-${Date.now().toString().slice(-4)}`;

    fetch("/api/vendor/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: prodName,
        sku,
        description: artisanStory || "Authentic local artisan craft product.",
        price: parseFloat(prodPrice),
        stock: parseInt(prodStock),
        status: isDraft ? "Draft" : "Submitted",
        story: {
          artisanName: "Banaras Weavers Guild Member",
          artisanLocation: prodDistrict,
          history: artisanStory,
          culturalSignificance: culturalSignificance,
          productionMethod: craftProcess
        }
      })
    }).then(res => {
      if (res.ok) {
        // Reload products list
        fetch("/api/vendor/products")
          .then(r => r.json())
          .then(data => {
            setProducts(data.map((p: any) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              stock: p.stock,
              status: p.isActive ? "Published" : (p.approvalWorkflow ? "Submitted" : "Draft"),
              stage: p.approvalWorkflow?.currentStage || (p.isActive ? "Published" : "Draft")
            })));
            showToast(isDraft ? "Draft saved successfully." : "Product catalog submitted to the Admin Approval Workflow!");
          });
      } else {
        showToast("Failed to save product in database.");
      }
    });

    setProdName("");
    setProdPrice("");
    setProdStock("");
    setArtisanStory("");
    setCraftProcess("");
    setCulturalSignificance("");
    setUploadedFiles([]);
  };

  return (
    <div className={`min-h-screen font-sans flex transition-colors duration-300 ${isDarkMode ? "bg-[#110B09] text-gray-100" : "bg-[#FAF5EE] text-[#2E1E1A]"}`}>
      
      {/* Mobile Sidebar Overlay backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      {/* 1. LEFT SIDEBAR PANEL */}
      <aside className={`w-64 border-r flex flex-col justify-between p-5 transition-all duration-300 shrink-0 ${
        isSidebarOpen ? "fixed inset-y-0 left-0 z-50 bg-[#FDFBF7] dark:bg-[#1A1311] shadow-2xl" : "hidden md:flex"
      } ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#B56D3E] text-white">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="font-serif font-black tracking-wide text-md text-[#B56D3E] block">Sellers hub</span>
                <span className="text-[9px] uppercase font-extrabold tracking-widest text-gray-400">Cultural Clutch</span>
              </div>
            </div>
            {isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 text-gray-400 hover:text-[#B56D3E] md:hidden"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <nav className="space-y-1">
            {[
              { name: "Dashboard", icon: BarChart3 },
              { name: "Product Management", icon: Package },
              { name: "Orders", icon: ShoppingBag },
              { name: "Payments & Wallet", icon: TrendingUp },
              { name: "Settings", icon: Settings },
            ].map(item => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveMenu(item.name);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeMenu === item.name 
                    ? "bg-[#B56D3E] text-white shadow-sm" 
                    : "text-gray-405 hover:text-[#B56D3E] hover:bg-[#C09355]/5"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-3 pt-6 border-t border-gray-250/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-bold text-white text-xs">
              V
            </div>
            <div className="text-left text-xs">
              <span className="block font-bold leading-tight">Banaras Weavers Guild</span>
              <span className="block text-[10px] text-gray-400">ID: VEND- Varanasi - 081</span>
            </div>
          </div>
          <button 
            onClick={() => showToast("Simulated Logout redirection.")}
            className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-xl"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CORE CONTENT WRAPPER */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* TOP STATUS HEADER BAR */}
        <header className={`px-6 py-4 flex items-center justify-between border-b ${isDarkMode ? "bg-[#110B09]/95 border-gray-800" : "bg-[#FAF5EE]/95 border-[#C09355]/20"}`}>
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-gray-450 tracking-wider">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg border border-[#C09355]/20 hover:bg-[#C09355]/10 text-[#B56D3E] mr-2 md:hidden"
            >
              <Menu className="w-4 h-4" />
            </button>
            <span>Portal Mode</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#B56D3E]">{activeMenu}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 border rounded-xl hover:bg-gray-150/30 text-gray-500 text-xs"
            >
              {isDarkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>
            <div className="relative p-2 hover:bg-gray-150/30 rounded-xl cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </div>
          </div>
        </header>

        {/* PAGE DYNAMIC CONTAINER */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 max-w-[1200px] w-full mx-auto">
          
          {/* ==================== MENU VIEW: DASHBOARD ==================== */}
          {activeMenu === "Dashboard" && (
            <div className="space-y-6">
              
              {/* VENDOR METRICS GRID */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Approved Products", val: products.filter(p => p.status === "Published").length, color: "text-green-600" },
                  { label: "In Workflow Review", val: products.filter(p => p.status === "Submitted").length, color: "text-yellow-600" },
                  { label: "Rejected Listing", val: products.filter(p => p.status === "Rejected").length, color: "text-red-505" },
                  { label: "Monthly Revenue", val: "₹1,42,800", color: "text-[#B56D3E]" }
                ].map((item, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl border ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"} shadow-sm`}>
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase block">{item.label}</span>
                    <span className={`block text-2xl font-serif font-black ${item.color} mt-1`}>{item.val}</span>
                  </div>
                ))}
              </div>

              {/* LISTING MANAGEMENT LIST */}
              <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
                <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Catalog Listing Status</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-150 text-gray-400 font-bold uppercase pb-3">
                        <th className="pb-2">SKU ID</th>
                        <th className="pb-2">Name</th>
                        <th className="pb-2">Price</th>
                        <th className="pb-2">Stage</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3 font-mono font-bold">{p.id}</td>
                          <td className="py-3">
                            <span className="block font-bold">{p.name}</span>
                            <span className="block text-[10px] text-gray-400">Stock: {p.stock} units</span>
                          </td>
                          <td className="py-3 font-bold">₹{p.price.toLocaleString()}</td>
                          <td className="py-3 font-mono font-semibold text-amber-600">{p.stage}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                              p.status === "Published" ? "bg-green-100 text-green-700 border-green-200" : 
                              p.status === "Rejected" ? "bg-red-100 text-red-700 border-red-200" : "bg-yellow-100 text-yellow-750 border-yellow-200"
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            {p.status === "Rejected" && (
                              <button 
                                type="button"
                                onClick={() => alert(`Rejection Reason:\n${p.rejectReason}`)}
                                className="px-2 py-1 bg-red-100 text-red-750 text-[10px] font-bold rounded"
                              >
                                View Reason
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== MENU VIEW: PRODUCT MANAGEMENT ==================== */}
          {activeMenu === "Product Management" && (
            <div className="space-y-6">
              
              {/* ADD NEW PRODUCT FORM */}
              <div className={`p-6 rounded-2xl border space-y-6 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
                <div className="border-b pb-4 border-gray-150/40">
                  <h3 className="text-lg font-serif font-black flex items-center gap-2">
                    Onboard New Product & Cultural Story
                  </h3>
                  <p className="text-xs text-gray-450 uppercase font-semibold">New products must pass document reviews and quality control checks before catalog release.</p>
                </div>

                <form className="space-y-6 text-xs font-semibold">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-gray-400 block">Product Name</label>
                      <input 
                        type="text" 
                        required
                        value={prodName} 
                        onChange={(e) => setProdName(e.target.value)}
                        placeholder="Banarasi Silk Saree"
                        className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 block">Category</label>
                      <select 
                        value={prodCategory} 
                        onChange={(e) => setProdCategory(e.target.value)}
                        className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 text-gray-655 cursor-pointer"
                      >
                        <option value="Handlooms & Textiles">Handlooms & Textiles</option>
                        <option value="Pottery & Clay">Pottery & Clay</option>
                        <option value="Woodcraft & Carvings">Woodcraft & Carvings</option>
                        <option value="Agricultural Specialities">Agricultural Specialities (ODOP)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 block">District Origin</label>
                      <input 
                        type="text" 
                        required
                        value={prodDistrict} 
                        onChange={(e) => setProdDistrict(e.target.value)}
                        placeholder="Varanasi"
                        className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-gray-400 block">Retail Price (₹)</label>
                      <input 
                        type="number" 
                        required
                        value={prodPrice} 
                        onChange={(e) => setProdPrice(e.target.value)}
                        placeholder="12500"
                        className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 block">Stock Volume</label>
                      <input 
                        type="number" 
                        required
                        value={prodStock} 
                        onChange={(e) => setProdStock(e.target.value)}
                        placeholder="10"
                        className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 block">Sourcing State</label>
                      <input 
                        type="text" 
                        value={prodState} 
                        onChange={(e) => setProdState(e.target.value)}
                        placeholder="Uttar Pradesh"
                        className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                      />
                    </div>
                  </div>

                  {/* PRODUCT STORY WRITING - SYSTEM MANDATED */}
                  <div className="p-4 border border-dashed rounded-2xl bg-amber-500/5 border-[#C09355]/45 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-serif font-black text-amber-600 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" /> Cultural Storytelling
                      </h4>
                      <button
                        type="button"
                        disabled={isAiLoading}
                        onClick={() => handleAiGeneration("story")}
                        className="px-3 py-1 bg-amber-500 text-white rounded-lg font-bold text-[10px] hover:bg-amber-600 flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5 animate-spin-slow" /> {isAiLoading ? "Generating..." : "Generate AI Story"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-gray-400 block">Artisan / Weaver Background</label>
                        <textarea 
                          rows={3}
                          value={artisanStory}
                          onChange={(e) => setArtisanStory(e.target.value)}
                          placeholder="Tell us about the artisan..."
                          className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white font-sans"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-gray-400 block">Detailed Craft Process</label>
                        <textarea 
                          rows={3}
                          value={craftProcess}
                          onChange={(e) => setCraftProcess(e.target.value)}
                          placeholder="How is it traditionally made..."
                          className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white font-sans"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-gray-400 block">Cultural & Festival Connection</label>
                        <textarea 
                          rows={3}
                          value={culturalSignificance}
                          onChange={(e) => setCulturalSignificance(e.target.value)}
                          placeholder="Woven for specific occasions..."
                          className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white font-sans"
                        />
                      </div>
                    </div>
                  </div>

                  {/* DRAG AND DROP IMAGE COMPONENT */}
                  <div className="space-y-1.5">
                    <label className="text-gray-400 block">Upload Product Media Assets</label>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const files = Array.from(e.dataTransfer.files).map(f => f.name);
                        setUploadedFiles([...uploadedFiles, ...files]);
                        showToast(`Simulated upload for ${files.length} images.`);
                      }}
                      className={`h-28 border border-dashed rounded-2xl flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all ${
                        isDragging ? "bg-[#B56D3E]/10 border-[#B56D3E]" : "border-gray-300 hover:bg-gray-50/10"
                      }`}
                    >
                      <Upload className="w-6 h-6 text-[#B56D3E]" />
                      <span className="font-bold text-gray-400">Drag & Drop Product Images or click to browse</span>
                      <span className="text-[10px] text-gray-450">Resolution minimum: 1200x1200px (white background preferred)</span>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {uploadedFiles.map((fn, idx) => (
                          <div key={idx} className="px-3 py-1 bg-amber-500/10 text-[#B56D3E] border border-amber-500/20 rounded-xl text-[10px] font-mono">
                            {fn}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-150/40">
                    <button 
                      type="button" 
                      onClick={(e) => handleAddNewProduct(e, true)}
                      className="px-5 py-2.5 bg-gray-100 hover:bg-gray-205 dark:bg-gray-800 text-gray-650 rounded-xl font-bold transition-all shadow-sm"
                    >
                      Save Draft Catalog
                    </button>
                    <button 
                      type="button" 
                      onClick={(e) => handleAddNewProduct(e, false)}
                      className={`px-5 py-2.5 ${activeTheme.button} font-bold rounded-xl shadow-sm transition-all`}
                    >
                      Submit for Approval Workflow
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

          {/* ==================== MENU VIEW: ORDERS ==================== */}
          {activeMenu === "Orders" && (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
                <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Fulfillment Order Logs</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-150 text-gray-400 font-bold uppercase pb-3">
                        <th className="pb-2">Order ID</th>
                        <th className="pb-2">Customer</th>
                        <th className="pb-2">Net Amount</th>
                        <th className="pb-2">Placement Date</th>
                        <th className="pb-2">Fulfillment</th>
                        <th className="pb-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map(o => (
                        <tr key={o.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3.5 font-mono font-bold">{o.id}</td>
                          <td className="py-3.5 font-semibold">{o.customer}</td>
                          <td className="py-3.5 font-bold">₹{o.amount.toLocaleString()}</td>
                          <td className="py-3.5 text-gray-500 font-semibold">{o.date}</td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                              o.status === "Delivered" ? "bg-green-150 text-green-700 border-green-200" : "bg-yellow-100 text-yellow-750 border-yellow-200"
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            {o.status === "Ready to Ship" && (
                              <button 
                                type="button"
                                onClick={() => {
                                  setOrders(orders.map(item => item.id === o.id ? { ...item, status: "Shipped" } : item));
                                  showToast(`Package packed. Awaiting logistics courier pickup.`);
                                }}
                                className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-[10px] font-bold"
                              >
                                Ship Order
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== MENU VIEW: PAYMENTS ==================== */}
          {activeMenu === "Payments & Wallet" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className={`p-6 rounded-2xl border text-center space-y-2 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">Seller Wallet Balance</span>
                  <span className="block text-3xl font-serif font-black text-emerald-600">₹45,900</span>
                  <span className="text-[9px] text-gray-450 block">Next payout settlement: July 22, 2026</span>
                </div>

                <div className={`p-6 rounded-2xl border text-center space-y-2 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">TDS Deductions (1%)</span>
                  <span className="block text-3xl font-serif font-black text-gray-400">₹1,428</span>
                  <span className="text-[9px] text-gray-450 block">Automated financial ledger reports</span>
                </div>

                <div className={`p-6 rounded-2xl border text-center space-y-2 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">Commission Deducted</span>
                  <span className="block text-3xl font-serif font-black text-red-500">₹18,200</span>
                  <span className="text-[9px] text-gray-450 block">Platform services charge: 12% standard</span>
                </div>
              </div>
            </div>
          )}

          {/* ==================== MENU VIEW: SETTINGS ==================== */}
          {activeMenu === "Settings" && (
            <div className={`p-6 rounded-2xl border space-y-6 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Security & Profile Settings</h3>
              
              <div className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-gray-400 block">Notification Channel Preferences</label>
                    <div className="flex gap-4 pt-1">
                      {["Email", "SMS", "WhatsApp", "Push Notifications"].map((ch, idx) => (
                        <label key={idx} className="flex items-center gap-1.5">
                          <input type="checkbox" defaultChecked className="accent-[#B56D3E]" />
                          <span>{ch}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => showToast("Profile settings updated successfully.")}
                  className={`py-2 px-5 ${activeTheme.button} font-bold rounded-xl shadow`}
                >
                  Save Account Settings
                </button>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* Floating Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#3D1E16] text-[#FAF5EE] border border-[#C09355]/30 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in-up text-xs">
          <Clock className="w-4 h-4 text-[#C09355] animate-spin" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

// Accent configuration maps matches the main ERP dashboard page layout structures
const themes: Record<string, { button: string, text: string, chartGradient: string }> = {
  saffron: {
    button: "bg-[#B56D3E] hover:bg-[#9B5A2F] text-white",
    text: "text-[#B56D3E]",
    chartGradient: "from-orange-500 to-amber-500"
  }
};
const activeTheme = themes.saffron;
