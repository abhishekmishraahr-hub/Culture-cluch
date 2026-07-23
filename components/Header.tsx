"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Search, Settings, Globe, X, Bell, Mic, HelpCircle, Menu, ArrowLeft, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { LANGUAGE_OPTIONS, CURRENCY_OPTIONS } from "@/lib/navigation";
import { NAVIGATION_ITEMS } from "@/navigation/navigationConfig";
import { useTranslation } from "@/lib/i18n/LanguageContext";

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
  const { data: nextAuthSession } = useSession();
  const { cart, totals } = useCart();
  const { language, setLanguage, t } = useTranslation();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [mockSession, setMockSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [localeMenuOpen, setLocaleMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  
  // Customization States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState("system");
  const [currency, setCurrency] = useState("INR");
  const [country, setCountry] = useState("IN");
  const [voiceActive, setVoiceActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Focus trap implementation for Mobile Drawer Accessibility
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const drawerElement = drawerRef.current;
    if (!drawerElement) return;

    // Select all focusable tags
    const focusableSelector = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = drawerElement.querySelectorAll<HTMLElement>(focusableSelector);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element on drawer open
    firstElement.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          // Shift + Tab: trap backwards
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          // Tab: trap forwards
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      } else if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMounted(true);
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

    // Load dynamic site settings and theme palette
    fetch("/api/admin/settings")
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Settings fetch failed");
      })
      .then(data => {
        setSiteSettings(data);
        if (data.theme_palette) {
          const root = document.documentElement;
          root.classList.remove("theme-saffron", "theme-indigo", "theme-emerald", "theme-crimson");
          root.classList.add(`theme-${data.theme_palette}`);
        }
      })
      .catch(err => {
        console.warn("Failed to retrieve site config settings:", err);
      });

    // Load preferences
    setTheme(localStorage.getItem("theme") || "system");
    setCurrency(localStorage.getItem("currency") || "INR");
    setCountry(localStorage.getItem("country") || "IN");

    try {
      const recents = localStorage.getItem("recent_searches");
      if (recents) {
        setRecentSearches(JSON.parse(recents));
      }
    } catch {
      // ignore malformed recent searches
    }

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
    const handleClickOutsideNav = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setCategoriesOpen(false);
        setLocaleMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideNav);
    return () => document.removeEventListener("mousedown", handleClickOutsideNav);
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
  const user = session?.user;
  const userRole = mounted && user ? (user as any).role || "Customer" : "Customer";

  useEffect(() => {
    if (mounted) {
      console.log("User", user);
      console.log("Role", userRole);
      console.log("Session", session);
    }
  }, [mounted, user, userRole, session]);

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
    const langObj = LANGUAGE_OPTIONS.find(l => l.code === newLang);
    showToast(`Language set to ${langObj?.name}...`);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSignOut = () => {
    localStorage.removeItem("mock_session");
    document.cookie = "mock_session_cookie=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setMobileMenuOpen(false);
    signOut({ callbackUrl: "/" });
  };

  // Filter items for desktop navbar: exclude mobile-only, drawer-only, and role-restricted
  const desktopItems = NAVIGATION_ITEMS.filter(item => {
    if (item.mobileOnly || item.drawerOnly) return false;
    if (item.roles && !item.roles.includes(userRole)) return false;
    return true;
  });

  // Filter items for mobile drawer: exclude desktop-only, and role-restricted
  const mobileDrawerItems = NAVIGATION_ITEMS.filter(item => {
    if (item.desktopOnly) return false;
    if (item.roles && !item.roles.includes(userRole)) return false;
    return true;
  });

  console.log("[DEBUG HEADER] userRole:", userRole, "items keys:", mobileDrawerItems.map(i => i.key));

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

        {/* Brand Logo with next/image */}
        <Link href="/" className="flex items-center gap-3 shrink-0 animate-fade-in">
          <Image
            src={siteSettings?.logo_url || "/logo.jpg"}
            alt={`${siteSettings?.site_name || "Cultural Clutch"} Logo`}
            width={40}
            height={40}
            className="rounded-full border-2 border-[#C09355]/30 object-cover shadow-sm animate-fade-in"
            priority
          />
          <div className="flex flex-col">
            <span className="font-serif text-lg font-black tracking-wide text-[#3D1E16] italic leading-none">
              {siteSettings?.site_name?.split(" ")[0] || "Cultural"}{" "}
              <span className="text-[#B56D3E] not-italic">
                {siteSettings?.site_name?.split(" ").slice(1).join(" ") || "Clutch"}
              </span>
            </span>
            <span className="text-[7.5px] font-extrabold text-[#C09355] uppercase tracking-widest mt-1">
              {t("odopCelebration")}
            </span>
          </div>
        </Link>

        {/* Live Search & Autocomplete Container */}
        <div ref={searchRef} className="hidden lg:block flex-1 max-w-md mx-6 relative">
          <div className="relative w-full">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
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

        {/* Dynamic Navigation (Reads from Single Source: navigationConfig) */}
        <nav ref={navRef} className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-gray-500">
          {desktopItems.map((item) => {
            return item.children ? (
              <div key={item.key} className="relative cursor-pointer py-1">
                <button
                  type="button"
                  onClick={() => {
                    setCategoriesOpen(!categoriesOpen);
                    setLocaleMenuOpen(false);
                  }}
                  className="hover:text-[#B56D3E] transition-colors flex items-center gap-1"
                  aria-expanded={categoriesOpen}
                >
                  {t(item.key)}
                </button>
                <div className={`absolute left-1/2 -translate-x-1/2 w-[680px] grid grid-cols-2 gap-6 p-6 mt-2 bg-[#FDFBF7] border border-[#C09355]/20 rounded-2xl shadow-xl transition-all duration-300 z-50 text-xs text-gray-655 normal-case ${
                  categoriesOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}>
                  {item.children.map((child) => (
                    <Link
                      key={child.key}
                      href={child.href || "/"}
                      className="block hover:text-[#B56D3E] transition-colors font-medium py-1.5"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      {t(child.key)}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={item.key} href={item.href || "/"} className="hover:text-[#B56D3E] transition-colors">
                {t(item.key)}
              </Link>
            );
          })}
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
          <div className="relative cursor-pointer">
            <button
              type="button"
              onClick={() => {
                setLocaleMenuOpen(!localeMenuOpen);
                setCategoriesOpen(false);
              }}
              className="p-2 hover:bg-[#C09355]/10 text-gray-500 hover:text-[#B56D3E] rounded-xl transition-all flex items-center gap-1"
              aria-expanded={localeMenuOpen}
            >
              <Globe className="w-4 h-4 text-[#B56D3E]" />
              <span className="text-[9px] font-extrabold uppercase hidden xl:inline">{language}-{currency}</span>
            </button>
            <div className={`absolute right-0 mt-1 w-52 bg-[#FDFBF7] border border-[#C09355]/20 rounded-2xl shadow-xl transition-all duration-200 z-50 p-3 text-xs font-bold text-gray-600 normal-case space-y-3 ${localeMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">{t("language")}</span>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {LANGUAGE_OPTIONS.map(lang => (
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
                <span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">{t("currency")}</span>
                <div className="grid grid-cols-2 gap-1">
                  {CURRENCY_OPTIONS.map(curr => (
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
                <span className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5">{t("deliverTo")}</span>
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

          {/* Cart Icon */}
          <Link
            href="/checkout"
            className="flex items-center gap-2 px-3 py-2 bg-[#3D1E16] hover:bg-[#28140E] text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("cart")}</span>
          </Link>

          {/* User Account / Profile Menu */}
          {!loading && session ? (
            <div 
              ref={profileRef}
              onClick={() => {
                setProfileMenuOpen(!profileMenuOpen);
                setCategoriesOpen(false);
                setLocaleMenuOpen(false);
              }}
              className="relative cursor-pointer border-l border-gray-250 pl-3 py-1 flex items-center gap-1.5 animate-fade-in"
            >
              <div className="w-7 h-7 bg-[#B56D3E]/10 border border-[#B56D3E]/20 text-[#B56D3E] flex items-center justify-center rounded-full text-xs font-black">
                {session.user.name?.charAt(0).toUpperCase() || "C"}
              </div>
              <span className="text-xs font-bold text-[#3D1E16] hidden md:inline select-none">
                {session.user.name?.split(" ")[0]}
              </span>
              
              <div className={`absolute right-0 mt-36 w-48 bg-[#FDFBF7] border border-[#C09355]/20 rounded-xl shadow-lg transition-all duration-200 z-50 p-2 text-xs font-bold text-gray-655 normal-case space-y-1 ${
                profileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}>
                <div className="px-3 py-1.5 border-b border-gray-100 pb-1.5 mb-1 text-left">
                  <p className="text-[#3D1E16] font-black line-clamp-1">{session.user.name}</p>
                  <p className="text-[10px] text-gray-400 font-semibold">{session.user.email}</p>
                </div>
                
                <Link href="/profile" className="block text-left px-3 py-2 hover:bg-[#FAF5EE] hover:text-[#B56D3E] rounded-lg transition-colors">
                  {t("profile")}
                </Link>
                <Link href="/orders" className="block text-left px-3 py-2 hover:bg-[#FAF5EE] hover:text-[#B56D3E] rounded-lg transition-colors">
                  {t("orders")}
                </Link>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="w-full text-left px-3 py-2 hover:bg-[#FAF5EE] hover:text-[#B56D3E] rounded-lg transition-colors font-bold"
                >
                  {t("preferences")}
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors border-t border-gray-100/50 mt-1 pt-1.5 font-bold"
                >
                  {t("logout")}
                </button>
              </div>
            </div>
          ) : !loading ? (
            <Link
              href="/login"
              className="px-3 py-2 border border-gray-200 hover:border-gray-300 text-gray-600 rounded-xl text-xs font-semibold transition-all hover:bg-gray-50 animate-fade-in"
            >
              {t("login")}
            </Link>
          ) : (
            <div className="w-12 h-8 bg-gray-100 animate-pulse rounded-xl" />
          )}

          {/* Mobile Menu Button (Hamburger) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-gray-300/10 hover:bg-[#C09355]/10 text-gray-555 hover:text-[#B56D3E] transition-all flex items-center justify-center cursor-pointer active:scale-95"
            title="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Rebuilt Mobile Drawer sliding panel menu with Focus Trap & Shared Configuration */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in">
          <div className="absolute inset-0 bg-transparent" onClick={() => setMobileMenuOpen(false)} />
          
          <div 
            ref={drawerRef}
            className="fixed top-0 right-0 w-80 h-full bg-[#FDFBF7] dark:bg-[#1A1311] border-l border-[#C09355]/20 p-6 flex flex-col justify-between shadow-2xl z-50 text-xs text-[#2E1E1A] dark:text-white"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            <div className="space-y-6 flex-1 overflow-y-auto pr-1">
              <div className="flex items-center justify-between border-b pb-4 border-[#C09355]/25">
                <span className="font-serif font-black text-sm uppercase tracking-wider text-[#3D1E16] dark:text-gray-150">Drawer Menu</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-1 hover:bg-gray-100 rounded-full text-gray-400"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Live Search Input */}
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (() => { handleSearchSubmit(searchQuery); setMobileMenuOpen(false); })()}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-[#C09355]/25 rounded-full text-xs font-semibold focus:outline-none"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B56D3E]" />
              </div>

              {/* Core Links List (Unified Shared Config) */}
              <div className="space-y-4 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-200">
                {mobileDrawerItems.map((item) => {
                  return item.children ? (
                    <div key={item.key} className="space-y-2 border-b border-gray-150/40 pb-3">
                      <button
                        type="button"
                        onClick={() => {
                          setCategoriesOpen(!categoriesOpen);
                        }}
                        className="w-full text-left flex items-center justify-between gap-3 py-2 hover:text-[#B56D3E] transition-colors"
                      >
                        <span>{t(item.key)}</span>
                        <span className="text-[10px] text-gray-400">{categoriesOpen ? "-" : "+"}</span>
                      </button>
                      {categoriesOpen && (
                        <div className="space-y-1 pl-4">
                          {item.children.map((child) => (
                            <Link
                              key={child.key}
                              href={child.href || "/"}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block text-[10px] uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:text-[#B56D3E] transition-colors py-1.5"
                            >
                              {t(child.key)}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={item.key}
                      href={item.href || "/"}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-[#B56D3E] transition-colors py-2 border-b border-gray-150/40 text-gray-700 dark:text-gray-200"
                    >
                      {t(item.key)}
                    </Link>
                  );
                })}

                {/* Mobile Drawer Settings & Custom Controls */}
                <div className="space-y-3 border-b border-gray-150/40 pb-4">
                  <span className="block text-[9px] uppercase tracking-widest text-[#B56D3E] font-extrabold">{t("language")}</span>
                  <div className="grid grid-cols-3 gap-1 max-h-36 overflow-y-auto pr-1">
                    {LANGUAGE_OPTIONS.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          handleLanguageChange(lang.code);
                          setMobileMenuOpen(false);
                        }}
                        className={`py-1.5 text-[9px] text-center rounded-xl border transition-all truncate ${language === lang.code ? "border-[#B56D3E] bg-[#B56D3E]/10 text-[#3D1E16] dark:text-white" : "border-gray-200 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"}`}
                      >
                        {lang.localName}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Cart Summary inside mobile drawer */}
                <div className="p-4 bg-amber-500/5 dark:bg-white/5 border border-[#C09355]/20 rounded-2xl space-y-3 normal-case font-medium text-left">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#B56D3E]">
                    <span className="flex items-center gap-1.5"><ShoppingCart className="w-3.5 h-3.5" /> {t("cartSummary")}</span>
                    <span className="bg-[#B56D3E] text-white px-2 py-0.5 rounded-full text-[9px] font-bold">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)} {t("items")}
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
                        <span className="text-[#3D1E16] dark:text-gray-100">{t("total")}</span>
                        <span className="text-[#B56D3E]">₹{totals.netTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                  <Link
                    onClick={() => setMobileMenuOpen(false)}
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-xl text-xs font-bold uppercase tracking-wide transition-all shadow-sm"
                  >
                    {t("checkoutButton")}
                  </Link>
                </div>
              </div>
            </div>

            {/* Session actions */}
            <div className="border-t border-gray-150/40 pt-4">
              {!loading && session ? (
                <div className="space-y-3 text-left font-bold uppercase tracking-wide">
                  <div className="flex items-center gap-3 normal-case">
                    <div className="w-8 h-8 rounded-full bg-[#B56D3E]/10 border border-[#B56D3E]/20 text-[#B56D3E] flex items-center justify-center text-xs font-black">
                      {session.user.name?.charAt(0).toUpperCase() || "C"}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#3D1E16] dark:text-white leading-tight">{session.user.name}</p>
                      <p className="text-[9px] text-gray-455">{session.user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full py-2.5 bg-red-50 text-red-500 rounded-xl text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> {t("logout")}
                  </button>
                </div>
              ) : (
                <Link
                  onClick={() => setMobileMenuOpen(false)}
                  href="/login"
                  className="w-full block py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-semibold uppercase tracking-wider text-center rounded-xl transition-all"
                >
                  {t("login")}
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
          
          <div className="w-full max-w-sm bg-[#FDFBF7] dark:bg-[#1A1311] border-l border-[#C09355]/30 h-full p-6 flex flex-col shadow-2xl relative z-50">
            <div className="flex items-center justify-between border-b border-[#C09355]/20 pb-4 mb-6">
              <h3 className="font-serif text-base font-bold text-[#3D1E16] dark:text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#B56D3E]" /> {t("preferences")}
              </h3>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-650 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto">
              <div className="space-y-3">
                <span className="block text-xs font-bold text-[#3D1E16] dark:text-white uppercase tracking-wider">Select Theme</span>
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
                          : "border-gray-200 bg-white dark:bg-gray-800 text-gray-550 dark:text-gray-300"
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

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#3D1E16] text-[#FAF5EE] border border-[#C09355]/30 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3">
          <Bell className="w-4 h-4 text-[#C09355]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </header>
  );
}
