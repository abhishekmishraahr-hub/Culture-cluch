"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  User, 
  MapPin, 
  ShieldCheck, 
  Languages, 
  Moon, 
  Clock, 
  Save,
  CheckCircle,
  LogOut,
  ChevronRight,
  BarChart3,
  Package,
  Grid,
  ShoppingBag,
  BookOpen,
  Settings,
  Heart
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";

function ProfileContent() {
  const router = useRouter();
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();
  const { language, setLanguage } = useTranslation();
  
  const [mockSession, setMockSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Default active tab to 'info' or first valid tab depending on role
  const [activeTab, setActiveTab] = useState("info");

  // Editable customer info state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("Sector 15, House 24B");
  const [city, setCity] = useState("Noida");
  const [stateName, setStateName] = useState("Uttar Pradesh");
  const [pincode, setPincode] = useState("201301");

  // Preferences appearance settings
  const [theme, setTheme] = useState("system");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const mockSessionStr = localStorage.getItem("mock_session");
    if (mockSessionStr) {
      const userObj = JSON.parse(mockSessionStr);
      setMockSession({ user: userObj });
      setName(userObj.name || "");
      setEmail(userObj.email || "");
      setPhone(userObj.phone || "+91 98123 45678");
    }
    
    // Load preferences
    setTheme(localStorage.getItem("theme") || "system");
    setLoading(false);
  }, []);

  const session = nextAuthSession || mockSession;
  const user = session?.user;
  const userRole = (user as any)?.role || "Customer";

  // Sync session data if next-auth loaded it
  useEffect(() => {
    if (nextAuthSession?.user) {
      setName(nextAuthSession.user.name || "");
      setEmail(nextAuthSession.user.email || "");
      setPhone((nextAuthSession.user as any).phone || "+91 98123 45678");
    }
  }, [nextAuthSession]);

  // Adjust default tab according to userRole
  useEffect(() => {
    if (userRole === "Admin" || userRole === "Owner" || userRole === "Super Admin") {
      setActiveTab("dashboard");
    } else {
      setActiveTab("info");
    }
  }, [userRole]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (mockSession) {
      const updatedUser = { ...mockSession.user, name, email, phone };
      localStorage.setItem("mock_session", JSON.stringify(updatedUser));
      setMockSession({ user: updatedUser });
    }
    showToast("Profile information updated successfully!");
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("theme", theme);
    
    // Apply theme
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.remove("dark", "light");
    }

    showToast("Preferences and localization saved.");
  };

  const handleSignOut = () => {
    localStorage.removeItem("mock_session");
    document.cookie = "mock_session_cookie=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    signOut({ callbackUrl: "/" });
  };

  // Dynamic tabs configuration based on logged in user session roles
  const getSidebarTabs = () => {
    if (userRole === "Customer") {
      return [
        { id: "info", label: "Address & Profile", icon: MapPin },
        { id: "orders", label: "My Orders", icon: Clock, href: "/orders" },
        { id: "wishlist", label: "My Wishlist", icon: Heart, href: "/products?wishlist=true" },
        { id: "preferences", label: "Preferences & Settings", icon: Languages },
        { id: "logout", label: "Sign Out", icon: LogOut, action: true }
      ];
    }

    if (userRole === "Admin") {
      return [
        { id: "dashboard", label: "Go To Dashboard", icon: ShieldCheck },
        { id: "analytics", label: "Analytics", icon: BarChart3, href: "/admin/dashboard?module=bi" },
        { id: "products", label: "Products", icon: Package, href: "/admin/products" },
        { id: "categories", label: "Categories", icon: Grid, href: "/admin/categories" },
        { id: "orders-admin", label: "Orders", icon: ShoppingBag, href: "/admin/orders" },
        { id: "users", label: "Users", icon: User, href: "/admin/users" },
        { id: "reports", label: "Reports", icon: BookOpen, href: "/admin/reports" },
        { id: "preferences", label: "Settings", icon: Settings },
        { id: "logout", label: "Sign Out", icon: LogOut, action: true }
      ];
    }

    if (userRole === "Owner" || userRole === "Super Admin") {
      return [
        { id: "dashboard", label: "Go To Dashboard", icon: ShieldCheck },
        { id: "analytics", label: "Analytics", icon: BarChart3, href: "/admin/dashboard?module=bi" },
        { id: "products", label: "Products", icon: Package, href: "/admin/products" },
        { id: "categories", label: "Categories", icon: Grid, href: "/admin/categories" },
        { id: "orders-admin", label: "Orders", icon: ShoppingBag, href: "/admin/orders" },
        { id: "users", label: "Users", icon: User, href: "/admin/users" },
        { id: "reports", label: "Reports", icon: BookOpen, href: "/admin/reports" },
        { id: "vendor-approval", label: "Vendor Approval", icon: CheckCircle, href: "/admin/vendors" },
        { id: "system-settings", label: "System Settings", icon: Settings, href: "/admin/settings" },
        { id: "preferences", label: "Settings", icon: Settings },
        { id: "logout", label: "Sign Out", icon: LogOut, action: true }
      ];
    }

    return [
      { id: "info", label: "Profile Information", icon: User },
      { id: "preferences", label: "Theme & Locale", icon: Languages },
      { id: "logout", label: "Sign Out", icon: LogOut, action: true }
    ];
  };

  if (loading || nextAuthStatus === "loading") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF5EE] dark:bg-[#1c0f0c]">
        <div className="w-10 h-10 border-4 border-[#B56D3E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in view
  if (!session) {
    return (
      <div className="max-w-md mx-auto my-16 px-6 py-10 bg-[#FDFBF7] dark:bg-[#261613] border border-[#C09355]/20 rounded-3xl text-center space-y-6 text-[#2E1E1A] dark:text-[#FAF5EE] shadow-lg">
        <User className="w-16 h-16 text-[#B56D3E]/30 mx-auto animate-bounce" />
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold">Access Customer Settings</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Please sign in to view your profile dashboard, manage billing addresses, configure notifications, and check loyalty coins.
          </p>
        </div>
        <button
          onClick={() => router.push("/login")}
          className="w-full py-3 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const tabs = getSidebarTabs();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 text-[#2E1E1A] dark:text-[#FAF5EE]">
      
      {/* Dynamic welcome header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#C09355]/20 pb-6 mb-8 gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#3D1E16] via-[#B56D3E] to-[#C09355] dark:from-[#FFF] dark:to-[#C09355]">
            Account & Preferences Settings
          </h1>
          <p className="text-xs text-gray-550 dark:text-gray-405 font-semibold uppercase tracking-widest">
            Logged in as {userRole} • {user?.email}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 px-4 py-2 border border-red-200 hover:bg-red-50 text-red-500 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Highly Visible Card for Admin/Owner redirect */}
      {["Admin", "Owner", "Super Admin"].includes(userRole) && (
        <div className="mb-8 p-6 bg-gradient-to-br from-[#3D1E16] via-[#B56D3E] to-[#C09355] rounded-3xl text-white shadow-lg space-y-4 animate-fade-in">
          <div className="border-b border-white/20 pb-3">
            <h2 className="text-xl font-serif font-black flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-300 animate-pulse" /> Administrator Panel
            </h2>
            <p className="text-xs text-white/80 mt-0.5">Quick administrative actions and ERP modules control center</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <Link 
              href="/admin/products"
              className="flex items-center justify-center p-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all text-center border border-white/5 hover:border-white/10 cursor-pointer"
            >
              Manage Products
            </Link>
            <Link 
              href="/admin/orders"
              className="flex items-center justify-center p-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all text-center border border-white/5 hover:border-white/10 cursor-pointer"
            >
              Manage Orders
            </Link>
            <Link 
              href="/admin/vendors"
              className="flex items-center justify-center p-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all text-center border border-white/5 hover:border-white/10 cursor-pointer"
            >
              Manage Vendors
            </Link>
            <Link 
              href="/admin/dashboard?module=bi"
              className="flex items-center justify-center p-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all text-center border border-white/5 hover:border-white/10 cursor-pointer"
            >
              Analytics
            </Link>
          </div>
          
          <div className="flex justify-end pt-2">
            <Link
              href="/admin"
              className="px-6 py-2.5 bg-white text-[#3D1E16] hover:bg-gray-150 font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer shrink-0"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Dynamic Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.action) {
                    handleSignOut();
                  } else if (tab.href) {
                    router.push(tab.href);
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#B56D3E] text-white shadow-md scale-[1.02]"
                    : "bg-[#FDFBF7] dark:bg-[#261613] border border-gray-200/80 dark:border-gray-800 text-gray-655 dark:text-gray-300 hover:text-[#B56D3E] hover:bg-[#C09355]/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            );
          })}
        </aside>

        {/* Right Tab Content Panel */}
        <main className="lg:col-span-9 bg-[#FDFBF7] dark:bg-[#261613] border border-gray-200/80 dark:border-gray-800 rounded-2xl p-6 md:p-8 shadow-sm h-fit">
          
          {/* TAB 0: DASHBOARD REDIRECT WRAPPER CARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 text-center py-10">
              <ShieldCheck className="w-16 h-16 text-[#B56D3E]/30 mx-auto" />
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-xl font-serif font-bold text-[#3D1E16] dark:text-white">Admin Management Console</h3>
                <p className="text-xs text-gray-550">
                  Please click the link below to enter the full core administrative dashboard containing analytics, inventory workflows, and sales ledgers.
                </p>
              </div>
              <button
                onClick={() => router.push("/admin/dashboard")}
                className="px-6 py-2.5 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
              >
                Launch Dashboard
              </button>
            </div>
          )}

          {/* TAB 1: ADDRESS BOOK (info) */}
          {activeTab === "info" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#3D1E16] dark:text-white">Personal Profile Information</h3>
                <p className="text-xs text-gray-500">Update your name, phone number, and saved shipping details</p>
              </div>

              <form onSubmit={handleSaveInfo} className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-gray-400 uppercase tracking-wider text-[10px]">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-[#3D1E16] dark:text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-gray-400 uppercase tracking-wider text-[10px]">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={email}
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-400 uppercase tracking-wider text-[10px]">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-[#3D1E16] dark:text-white focus:outline-none"
                  />
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3">
                  <h4 className="font-serif font-bold text-xs text-[#3D1E16] dark:text-white flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-[#B56D3E]" /> Saved Address Book
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-gray-400 uppercase tracking-wider text-[10px]">Street Address</label>
                      <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-[#3D1E16] dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <label className="block text-gray-400 uppercase tracking-wider text-[10px]">City</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-[#3D1E16] dark:text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-gray-400 uppercase tracking-wider text-[10px]">State</label>
                        <input
                          type="text"
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-[#3D1E16] dark:text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-gray-400 uppercase tracking-wider text-[10px]">Pincode</label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-[#3D1E16] dark:text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-gray-400 uppercase tracking-wider text-[10px]">Country</label>
                        <input
                          type="text"
                          disabled
                          value="India"
                          className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Profile Info
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: THEME & SETTINGS (preferences) */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#3D1E16] dark:text-white">Theme & Localization preferences</h3>
                <p className="text-xs text-gray-500">Configure language modes and dark colors theme appearance</p>
              </div>

              <form onSubmit={handleSavePreferences} className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Theme */}
                  <div className="space-y-1.5">
                    <label className="block text-gray-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <Moon className="w-3.5 h-3.5" /> Appearance Theme
                    </label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-600 dark:text-white font-semibold cursor-pointer"
                    >
                      <option value="light">Bright Heritage Palette</option>
                      <option value="dark">Cozy Dark Mode</option>
                      <option value="system">Follow Operating System</option>
                    </select>
                  </div>

                  {/* Language */}
                  <div className="space-y-1.5">
                    <label className="block text-gray-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <Languages className="w-3.5 h-3.5" /> Site Display Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-600 dark:text-white font-semibold cursor-pointer"
                    >
                      <option value="en">English (Default)</option>
                      <option value="hi">हिन्दी (Hindi)</option>
                      <option value="gu">ગુજરાતી (Gujarati)</option>
                      <option value="mr">मराठी (Marathi)</option>
                      <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                      <option value="ta">தமிழ் (Tamil)</option>
                      <option value="te">తెలుగు (Telugu)</option>
                      <option value="kn">ಕನ್ನಡ (Kannada)</option>
                      <option value="ml">മലയാളം (Malayalam)</option>
                      <option value="bn">বাংলা (Bengali)</option>
                      <option value="or">ଓଡ଼ିଆ (Odia)</option>
                      <option value="as">অসমীয়া (Assamese)</option>
                    </select>
                  </div>

                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Local Preferences
                </button>
              </form>
            </div>
          )}

        </main>

      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#3D1E16] text-[#FAF5EE] border border-[#C09355]/30 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3">
          <Clock className="w-4 h-4 text-[#C09355] animate-spin" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center bg-[#FAF5EE] dark:bg-[#1c0f0c]">
        <div className="w-10 h-10 border-4 border-[#B56D3E] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
