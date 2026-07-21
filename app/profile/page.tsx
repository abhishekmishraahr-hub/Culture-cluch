"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Bell, 
  Languages, 
  Moon, 
  Wallet, 
  Clock, 
  Save,
  CheckCircle,
  LogOut,
  ChevronRight
} from "lucide-react";

function ProfileContent() {
  const router = useRouter();
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();
  const [mockSession, setMockSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Tab state: info, notifications, preferences, security, wallet
  const [activeTab, setActiveTab] = useState("info");

  // Editable customer info state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("Sector 15, House 24B");
  const [city, setCity] = useState("Noida");
  const [stateName, setStateName] = useState("Uttar Pradesh");
  const [pincode, setPincode] = useState("201301");

  // Preferences & notifications sub-settings
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("en");
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [whatsappTracking, setWhatsappTracking] = useState(true);
  
  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const mockSessionStr = localStorage.getItem("mock_session");
    if (mockSessionStr) {
      const user = JSON.parse(mockSessionStr);
      setMockSession({ user });
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "+91 98123 45678");
    }
    
    // Load preferences
    setTheme(localStorage.getItem("theme") || "system");
    setLanguage(localStorage.getItem("language") || "en");
    setLoading(false);
  }, []);

  const session = nextAuthSession || mockSession;
  const user = session?.user;

  // Sync session data if next-auth loaded it
  useEffect(() => {
    if (nextAuthSession?.user) {
      setName(nextAuthSession.user.name || "");
      setEmail(nextAuthSession.user.email || "");
      setPhone((nextAuthSession.user as any).phone || "+91 98123 45678");
    }
  }, [nextAuthSession]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    // Update local storage representation
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
    localStorage.setItem("language", language);
    
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

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Notification tracking sub-settings updated.");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast("Please fill all password fields.");
      return;
    }
    showToast("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleSignOut = () => {
    localStorage.removeItem("mock_session");
    signOut({ callbackUrl: "/" });
  };

  if (loading || nextAuthStatus === "loading") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#B56D3E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in view
  if (!session) {
    return (
      <div className="max-w-md mx-auto my-16 px-6 py-10 bg-[#FDFBF7] border border-[#C09355]/20 rounded-3xl text-center space-y-6 text-[#2E1E1A] shadow-lg">
        <User className="w-16 h-16 text-[#B56D3E]/30 mx-auto animate-bounce" />
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold">Access Customer Settings</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Please sign in to view your profile dashboard, manage billing addresses, configure notifications, and check loyalty coins.
          </p>
        </div>
        <button
          onClick={() => router.push("/login")}
          className="w-full py-3 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 text-[#2E1E1A]">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#C09355]/20 pb-6 mb-8 gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#3D1E16] via-[#B56D3E] to-[#C09355]">
            Account & Preferences Settings
          </h1>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest">
            Logged in as {user?.role || "Customer"} • {user?.email}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 px-4 py-2 border border-red-200 hover:bg-red-50 text-red-500 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sub-settings Tabs Bar */}
        <aside className="lg:col-span-3 space-y-2">
          {[
            { id: "info", label: "Profile Information", icon: User },
            { id: "notifications", label: "Notification Setup", icon: Bell },
            { id: "preferences", label: "Theme & Locale", icon: Languages },
            { id: "security", label: "Security & Passwords", icon: ShieldCheck },
            { id: "wallet", label: "Patron Coins Wallet", icon: Wallet }
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-[#B56D3E] text-white shadow-md scale-[1.02]"
                    : "bg-[#FDFBF7] border border-gray-200/80 text-gray-600 hover:text-[#B56D3E] hover:bg-[#C09355]/5"
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
        <main className="lg:col-span-9 bg-[#FDFBF7] border border-gray-200/80 rounded-2xl p-6 md:p-8 shadow-sm h-fit">
          
          {/* TAB 1: PROFILE INFO */}
          {activeTab === "info" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#3D1E16]">Personal Profile Information</h3>
                <p className="text-xs text-gray-500">Update your name, phone index, and saved shipping details</p>
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
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 text-[#3D1E16]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-gray-400 uppercase tracking-wider text-[10px]">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={email}
                      className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
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
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 text-[#3D1E16]"
                  />
                </div>

                {/* Shipping address details sub-settings */}
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <h4 className="font-serif font-bold text-xs text-[#3D1E16] flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-[#B56D3E]" /> Saved Address Book
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-gray-400 uppercase tracking-wider text-[10px]">Street Address</label>
                      <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 text-[#3D1E16]"
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <label className="block text-gray-400 uppercase tracking-wider text-[10px]">City</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 text-[#3D1E16]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-gray-400 uppercase tracking-wider text-[10px]">State</label>
                        <input
                          type="text"
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 text-[#3D1E16]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-gray-400 uppercase tracking-wider text-[10px]">Pincode</label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 text-[#3D1E16]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-gray-400 uppercase tracking-wider text-[10px]">Country</label>
                        <input
                          type="text"
                          disabled
                          value="India"
                          className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Profile Info
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: NOTIFICATIONS SUB-SETTINGS */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#3D1E16]">Notification Routing Settings</h3>
                <p className="text-xs text-gray-550">Choose how you receive order tracking, dispatch notices, and loyalty coins balances</p>
              </div>

              <form onSubmit={handleSaveNotifications} className="space-y-4 text-xs font-semibold">
                
                <div className="space-y-3">
                  
                  {/* Email */}
                  <div className="flex items-start gap-3 p-4 border border-gray-150 rounded-xl bg-gray-50/50">
                    <input
                      type="checkbox"
                      id="optEmail"
                      checked={emailUpdates}
                      onChange={(e) => setEmailUpdates(e.target.checked)}
                      className="w-4 h-4 mt-0.5 cursor-pointer rounded"
                    />
                    <div className="space-y-0.5 cursor-pointer" onClick={() => setEmailUpdates(!emailUpdates)}>
                      <label htmlFor="optEmail" className="font-bold text-sm text-[#3D1E16] cursor-pointer">Email Summaries</label>
                      <p className="text-[10px] text-gray-450 leading-normal">Receive digital invoices, receipts, and order statuses directly in your inbox.</p>
                    </div>
                  </div>

                  {/* SMS */}
                  <div className="flex items-start gap-3 p-4 border border-gray-150 rounded-xl bg-gray-50/50">
                    <input
                      type="checkbox"
                      id="optSMS"
                      checked={smsAlerts}
                      onChange={(e) => setSmsAlerts(e.target.checked)}
                      className="w-4 h-4 mt-0.5 cursor-pointer rounded"
                    />
                    <div className="space-y-0.5 cursor-pointer" onClick={() => setSmsAlerts(!smsAlerts)}>
                      <label htmlFor="optSMS" className="font-bold text-sm text-[#3D1E16] cursor-pointer">SMS Shipment Steppers</label>
                      <p className="text-[10px] text-gray-455 leading-normal">Direct carrier notifications when items are shipped, out-for-delivery, or delivered.</p>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-start gap-3 p-4 border border-gray-150 rounded-xl bg-gray-50/50">
                    <input
                      type="checkbox"
                      id="optWhatsApp"
                      checked={whatsappTracking}
                      onChange={(e) => setWhatsappTracking(e.target.checked)}
                      className="w-4 h-4 mt-0.5 cursor-pointer rounded"
                    />
                    <div className="space-y-0.5 cursor-pointer" onClick={() => setWhatsappTracking(!whatsappTracking)}>
                      <label htmlFor="optWhatsApp" className="font-bold text-sm text-[#3D1E16] cursor-pointer">WhatsApp Concierge Updates</label>
                      <p className="text-[10px] text-gray-450 leading-normal">Direct chat alerts containing courier numbers, tracking links, and reorder shortcuts.</p>
                    </div>
                  </div>

                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Notification Setup
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: THEME & LOCALE PREFERENCES */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#3D1E16]">Theme & Localization preferences</h3>
                <p className="text-xs text-gray-500">Configure language, dark colors mode, and default currencies</p>
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
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 text-gray-600 font-semibold cursor-pointer"
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
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 text-gray-600 font-semibold cursor-pointer"
                    >
                      <option value="en">English (Default)</option>
                      <option value="hi">हिन्दी (Hindi)</option>
                      <option value="bn">বাংলা (Bengali)</option>
                      <option value="te">తెలుగు (Telugu)</option>
                      <option value="ta">தமிழ் (Tamil)</option>
                    </select>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Currency */}
                  <div className="space-y-1.5">
                    <label className="block text-gray-400 uppercase tracking-wider text-[10px]">Primary Currency</label>
                    <select
                      disabled
                      value="inr"
                      className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                    >
                      <option value="inr">INR (₹) - Indian Rupee</option>
                    </select>
                  </div>

                  {/* Timezone */}
                  <div className="space-y-1.5">
                    <label className="block text-gray-400 uppercase tracking-wider text-[10px]">Display Time Zone</label>
                    <select
                      disabled
                      value="ist"
                      className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                    >
                      <option value="ist">IST (UTC+05:30) - Kolkata</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Local Preferences
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: SECURITY & PASSWORDS */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#3D1E16]">Security Credentials</h3>
                <p className="text-xs text-gray-550">Manage passwords, credential tokens, and verify sign-in logs</p>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs font-semibold">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="space-y-1">
                    <label className="block text-gray-400 uppercase tracking-wider text-[10px]">Current Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 text-[#3D1E16]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-gray-400 uppercase tracking-wider text-[10px]">New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Create a strong password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 text-[#3D1E16]"
                    />
                  </div>

                </div>

                <div className="p-4 border border-[#C09355]/20 rounded-xl bg-[#FAF5EE]/40 space-y-2">
                  <span className="font-serif font-bold text-xs text-[#3D1E16] flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-green-600" /> Active Session Details
                  </span>
                  <div className="text-[10px] text-gray-450 space-y-1 font-mono">
                    <p>Authentication Type: Credentials Provider session token</p>
                    <p>Device Location: Noida, Uttar Pradesh (Local Dev Host)</p>
                    <p>Token TTL: 24 Hours remaining</p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Security Keys
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: PATRON COINS WALLET */}
          {activeTab === "wallet" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#3D1E16]">Cultural Clutch Coins Wallet</h3>
                <p className="text-xs text-gray-550">Review active coins, cashback, and redeem settings for checkouts</p>
              </div>

              {/* Gold card design */}
              <div className="bg-gradient-to-br from-[#E6B36C] via-[#C09355] to-[#8C5D24] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-[#C09355]/30">
                <div className="absolute top-0 right-0 w-44 h-44 bg-white/5 rounded-full filter blur-xl pointer-events-none" />
                
                <div className="space-y-8 relative z-10">
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase tracking-widest font-extrabold text-white/70">Redeemable Coins Balance</span>
                      <span className="block text-3xl font-serif font-black">₹450.00</span>
                    </div>
                    <Wallet className="w-8 h-8 text-white/30" />
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="text-[10px] font-mono">
                      <p className="opacity-80">PATRON USER LEVEL</p>
                      <p className="font-bold text-xs uppercase tracking-wide">SILVER CLUTCH MEMBER</p>
                    </div>
                    <span className="text-[8px] bg-white/20 font-bold px-2 py-1 rounded">MEMBER ID: CC-9981</span>
                  </div>
                </div>
              </div>

              {/* Reward stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-2xl bg-gray-50/50 text-xs space-y-1">
                  <span className="text-gray-400 block font-bold">Accumulated Rewards Coins</span>
                  <span className="font-bold text-sm block">450 Patron Coins (1 Coin = ₹1)</span>
                  <p className="text-[10px] text-gray-500 leading-normal">Coins will be automatically suggested as a deductibles option during Razorpay or COD payment screens.</p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-2xl bg-gray-50/50 text-xs space-y-1">
                  <span className="text-gray-400 block font-bold">Referral Points</span>
                  <span className="font-bold text-sm block">120 Points</span>
                  <p className="text-[10px] text-gray-500 leading-normal">Refer local heritage craft products to friends and gain 50 coins on each completed transaction.</p>
                </div>
              </div>

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
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#B56D3E] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
