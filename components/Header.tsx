"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingCart, Search, Settings, Globe, X, Check, Bell, Mic, Heart, HelpCircle, RefreshCw, Menu, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";

const LANGUAGES = [
  { code: "en", name: "English", localName: "English" },
  { code: "hi", name: "Hindi", localName: "हिन्दी" },
  { code: "te", name: "Telugu", localName: "తెలుగు" },
  { code: "mr", name: "Marathi", localName: "मराठी" },
  { code: "ta", name: "Tamil", localName: "தமிழ்" }
];

const CURRENCIES = [
  { code: "INR", name: "Indian Rupee (₹)", symbol: "₹" },
  { code: "USD", name: "US Dollar ($)", symbol: "$" },
  { code: "EUR", name: "Euro (€)", symbol: "€" },
  { code: "GBP", name: "British Pound (£)", symbol: "£" }
];

const COUNTRIES = [
  { code: "IN", name: "India" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" }
];

const TRENDING_SEARCHES = [
  "Paithani Saree",
  "Blue Pottery",
  "Madhubani Painting",
  "Brass Diya",
  "Pashmina Shawl"
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();
  const { cart, totals } = useCart();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [mockSession, setMockSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Customization States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("INR");
  const [country, setCountry] = useState("IN");
  const [voiceActive, setVoiceActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Google Translate Callback Injection
    if (!(window as any).googleTranslateElementInit) {
      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi,te,mr,ta",
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE
          },
          "google_translate_element"
        );
      };
    }

    // 2. Load script
    const existingScript = document.getElementById("google-translate-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    // Session loader
    try {
      const mockSessionStr = localStorage.getItem("mock_session");
      if (mockSessionStr) {
        setMockSession({ user: JSON.parse(mockSessionStr) });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }

    // Load preferences
    setTheme(localStorage.getItem("theme") || "system");
    setLanguage(localStorage.getItem("language") || "en");
    setCurrency(localStorage.getItem("currency") || "INR");
    setCountry(localStorage.getItem("country") || "IN");

    try {
      const recents = localStorage.getItem("recent_searches");
      if (recents) {
        setRecentSearches(JSON.parse(recents));
      }
    } catch (e) {}

    // Click outside handler for search overlay
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // system theme
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme]);

  const session = nextAuthSession || mockSession;
  const userRole = (session?.user as any)?.role;
  const isAdmin = ["Owner", "Super Admin", "Admin"].includes(userRole || "");

  const handleSearchSubmit = (queryStr: string) => {
    const trimmed = queryStr.trim();
    if (!trimmed) return;

    // Save to recents
    const updated = [trimmed, ...recentSearches.filter(q => q !== trimmed)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));

    setSearchFocused(false);
    router.push(`/products?q=${encodeURIComponent(trimmed)}`);
  };

  // Web Speech API Voice Search
  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Voice Search is not supported on this browser.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    
    setVoiceActive(true);
    showToast("Listening... Speak now.");
    recognition.start();

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setSearchQuery(result);
      handleSearchSubmit(result);
    };

    recognition.onerror = () => {
      showToast("Speech recognition error. Please try again.");
      setVoiceActive(false);
    };

    recognition.onend = () => {
      setVoiceActive(false);
    };
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
    
    const hostname = window.location.hostname;
    if (newLang === "en") {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
    } else {
      document.cookie = `googtrans=/en/${newLang}; path=/;`;
      document.cookie = `googtrans=/en/${newLang}; path=/; domain=${hostname};`;
    }
    
    const langObj = LANGUAGES.find(l => l.code === newLang);
    showToast(`Translating to ${langObj?.name}...`);
    setTimeout(() => window.location.reload(), 800);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF5EE]/95 backdrop-blur-md border-b border-[#C09355]/20 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4 relative">
        
        {/* Back Button (Only if not on home page) */}
        {pathname !== "/" && (
          <button
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push("/");
              }
            }}
            className="p-2 mr-1 rounded-xl border border-[#C09355]/20 hover:bg-[#C09355]/10 text-[#B56D3E] hover:text-[#9B5A2F] transition-all flex items-center justify-center cursor-pointer active:scale-95 shrink-0"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <img
            src="/logo.jpg"
            alt="Cultural Clutch Logo"
            className="w-10 h-10 rounded-full border-2 border-[#C09355]/30 object-cover shadow-sm"
          />
          <div className="flex flex-col">
            <span className="font-serif text-lg font-black tracking-wide text-[#3D1E16] italic leading-none">
              Cultural <span className="text-[#B56D3E] not-italic">Clutch</span>
            </span>
            <span className="text-[7.5px] font-extrabold text-[#C09355] uppercase tracking-widest mt-1">
              Vocal for Local
            </span>
          </div>
        </Link>

        {/* Live Search & Autocomplete Container */}
        <div ref={searchRef} className="hidden lg:block flex-1 max-w-md mx-6 relative">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search product, state, craft heritage..."
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit(searchQuery)}
              className="w-full pl-10 pr-10 py-2.5 bg-[#FDFBF7] border border-[#C09355]/25 focus:border-[#B56D3E] focus:ring-2 focus:ring-[#B56D3E]/10 rounded-full text-xs font-semibold focus:outline-none transition-all placeholder-gray-400 text-[#3D1E16]"
            />
            <Search 
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B56D3E] cursor-pointer hover:scale-105" 
              onClick={() => handleSearchSubmit(searchQuery)}
            />
            <button 
              onClick={startVoiceSearch}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 text-[#B56D3E] transition-all ${
                voiceActive ? "bg-red-50 text-red-500 animate-pulse" : ""
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Autocomplete Suggestions Overlay */}
          {searchFocused && (
            <div className="absolute top-11 left-0 right-0 bg-[#FDFBF7] border border-[#C09355]/20 rounded-2xl shadow-xl z-50 p-4 text-xs">
              <div className="space-y-4">
                {/* Trending */}
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-[#B56D3E] font-bold mb-2">Trending Searches</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {TRENDING_SEARCHES.map(item => (
                      <button
                        key={item}
                        onClick={() => {
                          setSearchQuery(item);
                          handleSearchSubmit(item);
                        }}
                        className="px-2.5 py-1 bg-[#FAF5EE] hover:bg-[#B56D3E]/5 text-[#3D1E16] border border-gray-100 rounded-full transition-colors text-[10px] font-semibold"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recents */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Recently Searched</h4>
                      <button 
                        onClick={() => {
                          setRecentSearches([]);
                          localStorage.removeItem("recent_searches");
                        }}
                        className="text-[9px] font-bold text-red-500 hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      {recentSearches.map(item => (
                        <button
                          key={item}
                          onClick={() => {
                            setSearchQuery(item);
                            handleSearchSubmit(item);
                          }}
                          className="w-full text-left font-serif hover:text-[#B56D3E] transition-colors py-1 flex items-center gap-1.5"
                        >
                          <span className="w-1 h-1 bg-[#C09355] rounded-full" />
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Mega Menu & Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-gray-500">
          <Link href="/" className="hover:text-[#B56D3E] transition-colors">Home</Link>
          <Link href="/about" className="hover:text-[#B56D3E] transition-colors">About</Link>
          
          {/* Categories Mega Menu */}
          <div className="relative group cursor-pointer py-1">
            <span className="hover:text-[#B56D3E] transition-colors flex items-center gap-1">
              Categories
            </span>
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-[680px] bg-[#FDFBF7] border border-[#C09355]/20 rounded-2xl shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-50 p-6 text-xs text-gray-600 normal-case grid grid-cols-3 gap-6">
              {/* Col 1: Heritage Crafts */}
              <div className="space-y-3">
                <h4 className="font-serif font-black text-[11px] text-[#3D1E16] uppercase tracking-wider border-b border-[#C09355]/20 pb-1">Heritage Crafts</h4>
                <Link href="/products?category=heritage-handicrafts" className="block hover:text-[#B56D3E] transition-colors font-medium">Stone & Wood Carvings</Link>
                <Link href="/products?category=pottery" className="block hover:text-[#B56D3E] transition-colors font-medium">Blue Pottery & Clay Art</Link>
                <Link href="/products?category=metal-crafts" className="block hover:text-[#B56D3E] transition-colors font-medium">Moradabad Brassware</Link>
                <Link href="/products?category=tribal-art" className="block hover:text-[#B56D3E] transition-colors font-medium">Tribal Bamboo Crafts</Link>
              </div>
              
              {/* Col 2: Handlooms & Textiles */}
              <div className="space-y-3">
                <h4 className="font-serif font-black text-[11px] text-[#3D1E16] uppercase tracking-wider border-b border-[#C09355]/20 pb-1">Handlooms & Silks</h4>
                <Link href="/products?category=handloom-textiles" className="block hover:text-[#B56D3E] transition-colors font-medium">Banarasi Silk Sarees</Link>
                <Link href="/products?category=handloom-textiles" className="block hover:text-[#B56D3E] transition-colors font-medium">Paithani Silk Sarees</Link>
                <Link href="/products?category=handloom-textiles" className="block hover:text-[#B56D3E] transition-colors font-medium">Venkatagiri Handlooms</Link>
                <Link href="/products?category=handloom-textiles" className="block hover:text-[#B56D3E] transition-colors font-medium">Pashmina Shawls</Link>
              </div>

              {/* Col 3: Folk Art & Painting */}
              <div className="space-y-3">
                <h4 className="font-serif font-black text-[11px] text-[#3D1E16] uppercase tracking-wider border-b border-[#C09355]/20 pb-1">Folk Paintings</h4>
                <Link href="/products?category=art-folk-painting" className="block hover:text-[#B56D3E] transition-colors font-medium">Madhubani Paintings</Link>
                <Link href="/products?category=art-folk-painting" className="block hover:text-[#B56D3E] transition-colors font-medium">Pattachitra Scrolls</Link>
                <Link href="/products?category=art-folk-painting" className="block hover:text-[#B56D3E] transition-colors font-medium">Warli Folk Drawings</Link>
                <div className="mt-4 p-3 bg-amber-500/5 rounded-xl border border-[#C09355]/20">
                  <span className="text-[10px] text-[#B56D3E] font-black uppercase block mb-1">Rare Collector Curation</span>
                  <p className="text-[9px] text-gray-500 font-serif leading-normal">Explore certified museum-quality craft collector editions.</p>
                </div>
              </div>
            </div>
          </div>

          <Link href="/stories" className="hover:text-[#B56D3E] transition-colors">Stories</Link>
          <Link href="/orders" className="hover:text-[#B56D3E] transition-colors">Orders</Link>

          {!loading && isAdmin && (
            <div className="relative group cursor-pointer py-1">
              <span className="hover:text-[#B56D3E] transition-colors text-[#3D1E16] font-bold">
                Admin
              </span>
              <div className="absolute right-0 mt-1 w-48 bg-[#FDFBF7] border border-[#C09355]/20 rounded-xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50 p-2 text-xs font-bold text-gray-655 normal-case">
                <Link href="/admin/dashboard" className="block px-4 py-2 hover:bg-[#FAF5EE] hover:text-[#B56D3E] rounded-lg transition-colors">Dashboard</Link>
                <Link href="/admin/states" className="block px-4 py-2 hover:bg-[#FAF5EE] hover:text-[#B56D3E] rounded-lg transition-colors">States & Districts</Link>
                <Link href="/admin/categories" className="block px-4 py-2 hover:bg-[#FAF5EE] hover:text-[#B56D3E] rounded-lg transition-colors">Categories</Link>
                <Link href="/admin/about" className="block px-4 py-2 hover:bg-[#FAF5EE] hover:text-[#B56D3E] rounded-lg transition-colors">About Us Editor</Link>
              </div>
            </div>
          )}
        </nav>

        {/* Global Toolbar Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Support Link */}
          <Link 
            href="/profile" 
            title="Customer Support"
            className="p-2 text-gray-500 hover:text-[#B56D3E] hover:bg-[#C09355]/10 rounded-xl transition-all hidden xl:flex items-center"
          >
            <HelpCircle className="w-4.5 h-4.5 text-[#B56D3E]" />
          </Link>

          {/* Localization Dropdown */}
          <div className="relative group cursor-pointer">
            <button className="p-2 hover:bg-[#C09355]/10 text-gray-500 hover:text-[#B56D3E] rounded-xl transition-all flex items-center gap-1">
              <Globe className="w-4 h-4 text-[#B56D3E]" />
              <span className="text-[9px] font-extrabold uppercase hidden xl:inline">{language}-{currency}</span>
            </button>
            <div className="absolute right-0 mt-1 w-52 bg-[#FDFBF7] border border-[#C09355]/20 rounded-2xl shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50 p-3 text-xs font-bold text-gray-600 normal-case space-y-3">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Language</span>
                <div className="space-y-1">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full text-left px-2.5 py-1 hover:bg-[#FAF5EE] hover:text-[#B56D3E] rounded-lg flex justify-between items-center ${
                        language === lang.code ? "text-[#B56D3E] bg-[#B56D3E]/5" : ""
                      }`}
                    >
                      <span>{lang.localName}</span>
                      <span className="text-[10px] text-gray-400">{lang.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-2">
                <span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Currency</span>
                <div className="grid grid-cols-2 gap-1">
                  {CURRENCIES.map(curr => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency(curr.code);
                        localStorage.setItem("currency", curr.code);
                        showToast(`Currency updated to ${curr.code}`);
                      }}
                      className={`px-2 py-1 text-center rounded-lg border text-[10px] ${
                        currency === curr.code 
                          ? "border-[#B56D3E] bg-[#B56D3E]/5 text-[#B56D3E]" 
                          : "border-gray-100 bg-white text-gray-550"
                      }`}
                    >
                      {curr.code}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-2">
                <span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">Deliver To</span>
                <select
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    localStorage.setItem("country", e.target.value);
                    showToast(`Shipping destination set to ${e.target.value}`);
                  }}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px]"
                >
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <Link
            href="/checkout"
            className="flex items-center gap-2 px-3 py-2 bg-[#3D1E16] hover:bg-[#28140E] text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cart</span>
          </Link>

          {!loading && session ? (
            <div className="relative group cursor-pointer border-l border-gray-250 pl-3 py-1 flex items-center gap-1.5">
              <div className="w-7 h-7 bg-[#B56D3E]/10 border border-[#B56D3E]/20 text-[#B56D3E] flex items-center justify-center rounded-full text-xs font-black">
                {session.user.name?.charAt(0).toUpperCase() || "C"}
              </div>
              <span className="text-xs font-bold text-[#3D1E16] hidden md:inline select-none">
                {session.user.name?.split(" ")[0]}
              </span>
              
              <div className="absolute right-0 mt-36 w-48 bg-[#FDFBF7] border border-[#C09355]/20 rounded-xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50 p-2 text-xs font-bold text-gray-655 normal-case space-y-1">
                <div className="px-3 py-1.5 border-b border-gray-100 pb-1.5 mb-1 text-left">
                  <p className="text-[#3D1E16] font-black line-clamp-1">{session.user.name}</p>
                  <p className="text-[10px] text-gray-400 font-semibold">{session.user.email}</p>
                </div>
                
                <Link href="/profile" className="block text-left px-3 py-2 hover:bg-[#FAF5EE] hover:text-[#B56D3E] rounded-lg transition-colors">
                  Profile Settings
                </Link>
                <Link href="/orders" className="block text-left px-3 py-2 hover:bg-[#FAF5EE] hover:text-[#B56D3E] rounded-lg transition-colors">
                  My Orders
                </Link>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="w-full text-left px-3 py-2 hover:bg-[#FAF5EE] hover:text-[#B56D3E] rounded-lg transition-colors font-bold"
                >
                  Preferences
                </button>
                <button
                  onClick={async () => {
                    localStorage.removeItem("mock_session");
                    window.location.href = "/api/auth/signout";
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors border-t border-gray-100/50 mt-1 pt-1.5 font-bold"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : !loading ? (
            <Link
              href="/login"
              className="px-3 py-2 border border-gray-200 hover:border-gray-300 text-gray-600 rounded-xl text-xs font-semibold transition-all hover:bg-gray-50"
            >
              Sign In
            </Link>
          ) : (
            <div className="w-12 h-8 bg-gray-100 animate-pulse rounded-xl" />
          )}

          {/* Mobile Menu Button (Hamburger) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-gray-300/10 hover:bg-[#C09355]/10 text-gray-550 hover:text-[#B56D3E] transition-all flex items-center justify-center cursor-pointer active:scale-95"
            title="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer sliding panel menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in">
          <div className="flex-grow h-full" onClick={() => setMobileMenuOpen(false)} />
          
          <div className="absolute top-0 right-0 w-80 h-full bg-[#FDFBF7] dark:bg-[#1A1311] border-l border-[#C09355]/20 p-6 flex flex-col justify-between shadow-2xl relative z-50 text-xs text-[#2E1E1A] dark:text-white">
            <div className="space-y-6 flex-1 overflow-y-auto pr-1">
              <div className="flex items-center justify-between border-b pb-4 border-[#C09355]/25">
                <span className="font-serif font-black text-sm uppercase tracking-wider text-[#3D1E16] dark:text-gray-150">Navigation Drawer</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Core Links List */}
              <div className="space-y-4 text-xs font-bold uppercase tracking-wider text-gray-655 dark:text-gray-200">
                <Link onClick={() => setMobileMenuOpen(false)} href="/" className="block hover:text-[#B56D3E] transition-colors py-2 border-b border-gray-150/40">Home</Link>
                <Link onClick={() => setMobileMenuOpen(false)} href="/about" className="block hover:text-[#B56D3E] transition-colors py-2 border-b border-gray-150/40">About</Link>
                <Link onClick={() => setMobileMenuOpen(false)} href="/products" className="block hover:text-[#B56D3E] transition-colors py-2 border-b border-gray-150/40">Category / All Products</Link>
                <Link onClick={() => setMobileMenuOpen(false)} href="/orders" className="block hover:text-[#B56D3E] transition-colors py-2 border-b border-gray-150/40">My Orders</Link>
                
                {!loading && isAdmin && (
                  <div className="pt-2 pb-1 border-b border-gray-150/40 space-y-2">
                    <span className="block text-[9px] uppercase tracking-widest text-[#B56D3E] font-extrabold mb-1">Admin Controls</span>
                    <Link onClick={() => setMobileMenuOpen(false)} href="/admin/dashboard" className="block hover:text-[#B56D3E] transition-colors pl-2 py-1 text-xs text-[#B56D3E] font-black">Dashboard</Link>
                    <Link onClick={() => setMobileMenuOpen(false)} href="/admin/states" className="block hover:text-[#B56D3E] transition-colors pl-2 py-1 text-xs">States & Districts</Link>
                    <Link onClick={() => setMobileMenuOpen(false)} href="/admin/categories" className="block hover:text-[#B56D3E] transition-colors pl-2 py-1 text-xs">Categories</Link>
                    <Link onClick={() => setMobileMenuOpen(false)} href="/admin/about" className="block hover:text-[#B56D3E] transition-colors pl-2 py-1 text-xs">About Editor</Link>
                  </div>
                )}
                
                {/* Flipkart/Amazon-style Cart Summary panel inside mobile menu */}
                <div className="p-4 bg-amber-500/5 dark:bg-white/5 border border-[#C09355]/20 rounded-2xl space-y-3 normal-case font-medium text-left">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#B56D3E]">
                    <span className="flex items-center gap-1.5"><ShoppingCart className="w-3.5 h-3.5" /> Cart Summary</span>
                    <span className="bg-[#B56D3E] text-white px-2 py-0.5 rounded-full text-[9px] font-bold">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
                    </span>
                  </div>
                  {cart.length === 0 ? (
                    <p className="text-[10px] text-gray-400 italic">Your cart is empty.</p>
                  ) : (
                    <div className="space-y-2">
                      <div className="max-h-[100px] overflow-y-auto space-y-1.5 pr-1">
                        {cart.map(item => (
                          <div key={item.id} className="flex justify-between items-center text-[10px]">
                            <span className="font-semibold text-gray-700 dark:text-gray-300 line-clamp-1 flex-1">{item.name}</span>
                            <span className="text-gray-450 shrink-0 font-mono ml-2">₹{item.price} x {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-2 flex justify-between items-baseline font-bold text-xs">
                        <span className="text-[#3D1E16] dark:text-gray-100">Estimated Total</span>
                        <span className="text-[#B56D3E]">₹{totals.netTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                  <Link
                    onClick={() => setMobileMenuOpen(false)}
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-xl text-xs font-bold uppercase tracking-wide transition-all shadow-sm"
                  >
                    Proceed to Cart/Checkout
                  </Link>
                </div>
              </div>
            </div>

            {/* Session actions */}
            <div className="border-t border-gray-150/40 pt-4">
              {!loading && session ? (
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#B56D3E]/10 border border-[#B56D3E]/20 text-[#B56D3E] flex items-center justify-center text-xs font-black">
                      {session.user.name?.charAt(0).toUpperCase() || "C"}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#3D1E16] dark:text-white leading-tight">{session.user.name}</p>
                      <p className="text-[9px] text-gray-450">{session.user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.removeItem("mock_session");
                      setMobileMenuOpen(false);
                      window.location.href = "/api/auth/signout";
                    }}
                    className="w-full py-2.5 bg-red-50 text-red-500 rounded-xl text-xs font-semibold uppercase tracking-wider text-center"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  onClick={() => setMobileMenuOpen(false)}
                  href="/login"
                  className="w-full block py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-semibold uppercase tracking-wider text-center rounded-xl transition-all"
                >
                  Sign In / Create Account
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preferences sliding panel */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="flex-grow h-full" onClick={() => setIsSettingsOpen(false)} />
          
          <div className="w-full max-w-sm bg-[#FDFBF7] border-l border-[#C09355]/30 h-full p-6 flex flex-col shadow-2xl relative z-50">
            <div className="flex items-center justify-between border-b border-[#C09355]/20 pb-4 mb-6">
              <h3 className="font-serif text-base font-bold text-[#3D1E16] flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#B56D3E]" /> Preferences & Settings
              </h3>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto">
              <div className="space-y-3">
                <span className="block text-xs font-bold text-[#3D1E16] uppercase tracking-wider">Select Theme</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "light", label: "Bright Theme" },
                    { id: "dark", label: "Dark Theme" }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        localStorage.setItem("theme", t.id);
                        const root = document.documentElement;
                        if (t.id === "dark") {
                          root.classList.add("dark");
                        } else {
                          root.classList.remove("dark");
                        }
                        showToast(`Theme updated to ${t.label}`);
                      }}
                      className={`py-2 border rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                        theme === t.id
                          ? "border-[#B56D3E] bg-[#B56D3E]/5 text-[#B56D3E]"
                          : "border-gray-200 bg-white text-gray-500"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-[#C09355]/15 pt-4">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-full py-3 bg-[#3D1E16] hover:bg-[#28140E] text-white text-xs font-semibold rounded-xl transition-all uppercase tracking-wide"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      <div id="google_translate_element" style={{ display: "none" }} />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#3D1E16] text-[#FAF5EE] border border-[#C09355]/30 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3">
          <Bell className="w-4 h-4 text-[#C09355]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </header>
  );
}
