"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  DollarSign, ShoppingBag, TrendingUp, AlertTriangle, Users, Download, Upload, Check, 
  ShieldAlert, RefreshCw, FileText, ShieldCheck, Activity, UserPlus, PlusCircle, Lock,
  Calendar, ClipboardList, Package, Layers, Truck, BarChart2, Database, Moon, Sun, 
  Settings, Bell, X, Edit, Trash2, ArrowRight, UserCheck, Plus, Globe, Key, Sparkles, 
  Filter, MapPin, Clock, Briefcase, FileCheck, Tag, Eye, Shield, Power, Trash, ArrowDown, ChevronRight
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  BarChart, Bar, Legend, LineChart, Line, Cell, PieChart, Pie
} from "recharts";

// CSS Auraic color codes & themes
const THEMES: Record<string, { primary: string; bg: string; text: string; card: string; accent: string }> = {
  saffron: { primary: "#C09355", bg: "bg-[#1c0f0c]", text: "text-[#FAF5EE]", card: "bg-[#251512] border-[#C09355]/20", accent: "#E0A96D" },
  charcoal: { primary: "#4A4A4A", bg: "bg-[#121212]", text: "text-[#E0E0E0]", card: "bg-[#1E1E1E] border-[#4A4A4A]/25", accent: "#8C8C8C" },
  emerald: { primary: "#2D5A27", bg: "bg-[#0B150A]", text: "text-[#ECF3EC]", card: "bg-[#122210] border-[#2D5A27]/25", accent: "#4E9A45" }
};

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Active theme
  const [theme, setTheme] = useState("saffron");
  const t = THEMES[theme];

  // Selected Department / Module View
  const [activeModule, setActiveModule] = useState("bi");
  const [activeSubTab, setActiveSubTab] = useState("analytics");
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- DATABASE DRIVEN STATES ---
  const [leads, setLeads] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [financeData, setFinanceData] = useState<any>({});
  const [hrData, setHrData] = useState<any>({ employees: [], attendance: [], leaves: [] });
  const [payroll, setPayroll] = useState<any[]>([]);
  const [marketing, setMarketing] = useState<any>({ campaigns: [], coupons: [] });
  const [logistics, setLogistics] = useState<any[]>([]);
  const [dbExplorer, setDbExplorer] = useState<any>({ stats: {}, relationships: [] });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [resetRequests, setResetRequests] = useState<any[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Form inputs
  const [showFormModal, setShowFormModal] = useState<string | null>(null); // e.g. "LEAD", "PO", "EMPLOYEE", "CAMPAIGN", "COUPON"
  const [formInputs, setFormInputs] = useState<any>({});

  // Trigger Toast Notification
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch data based on active department module
  const loadModuleData = async () => {
    setLoading(true);
    try {
      if (activeModule === "bi") {
        const res = await fetch("/api/admin/finance");
        if (res.ok) setFinanceData(await res.json());

        const prodRes = await fetch("/api/admin/products");
        if (prodRes.ok) setProducts(await prodRes.ok ? await prodRes.json() : []);

        const orderRes = await fetch("/api/admin/orders");
        if (orderRes.ok) setOrders(await orderRes.json());
      }
      else if (activeModule === "sales") {
        const res = await fetch("/api/admin/leads");
        if (res.ok) setLeads(await res.json());

        const oRes = await fetch("/api/admin/orders");
        if (oRes.ok) setOrders(await oRes.json());
      }
      else if (activeModule === "purchase") {
        const res = await fetch("/api/admin/purchase");
        if (res.ok) setPurchaseOrders(await res.json());
      }
      else if (activeModule === "finance") {
        const res = await fetch("/api/admin/finance");
        if (res.ok) setFinanceData(await res.json());
      }
      else if (activeModule === "hr") {
        const res = await fetch("/api/admin/hr");
        if (res.ok) setHrData(await res.json());
      }
      else if (activeModule === "payroll") {
        const res = await fetch("/api/admin/payroll");
        if (res.ok) setPayroll(await res.json());
      }
      else if (activeModule === "marketing") {
        const res = await fetch("/api/admin/marketing");
        if (res.ok) setMarketing(await res.json());
      }
      else if (activeModule === "logistics") {
        const res = await fetch("/api/admin/logistics");
        if (res.ok) setLogistics(await res.json());
      }
      else if (activeModule === "database") {
        const res = await fetch("/api/admin/database");
        if (res.ok) setDbExplorer(await res.json());
      }
      else if (activeModule === "admin") {
        const auditRes = await fetch("/api/admin/audit-logs");
        if (auditRes.ok) setAuditLogs(await auditRes.json());

        const hrRes = await fetch("/api/admin/hr");
        if (hrRes.ok) setHrData(await hrRes.json());

        const credRes = await fetch("/api/admin/credentials");
        if (credRes.ok) {
          const credData = await credRes.json();
          setResetRequests(credData.resetRequests || []);
        }
      }
    } catch (err) {
      console.error("Error loading ERP backend data:", err);
      showToast("Backend connection timeout. Please reload.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      // Role restrictions mapping
      const userDept = (session.user as any).department;
      const userRole = (session.user as any).role;
      
      // Enforce: regular employees can ONLY see their assigned department dashboard
      if (userRole !== "Owner" && userRole !== "Super Admin" && userRole !== "Admin") {
        if (userDept === "Sales") setActiveModule("sales");
        else if (userDept === "Finance") setActiveModule("finance");
        else if (userDept === "Human Resource" || userDept === "HR") setActiveModule("hr");
        else if (userDept === "Logistics") setActiveModule("logistics");
        else if (userDept === "Product Management" || userDept === "Products") setActiveModule("product");
        else if (userDept === "Customer Support") setActiveModule("customer");
        else if (userDept === "Marketing") setActiveModule("marketing");
        else if (userDept === "Purchase") setActiveModule("purchase");
        else if (userDept === "Inventory") setActiveModule("inventory");
      }
      
      loadModuleData();
    }
  }, [status, activeModule, session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#1c0f0c] flex items-center justify-center text-[#FAF5EE]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#C09355] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold tracking-wider font-sans uppercase">Synchronizing Auraic ERP Systems...</p>
        </div>
      </div>
    );
  }

  // --- CRUD ACTIONS ---

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formInputs)
      });
      if (res.ok) {
        showToast("Lead successfully registered!");
        setShowFormModal(null);
        setFormInputs({});
        loadModuleData();
      } else {
        const error = await res.json();
        showToast(error.error || "Failed to create lead.");
      }
    } catch {
      showToast("Error creating lead.");
    }
  };

  const handleCreatePO = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formInputs,
        items: [{ productName: formInputs.productName, quantity: formInputs.quantity, unitPrice: formInputs.unitPrice }]
      };
      const res = await fetch("/api/admin/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast("Purchase Order dispatched!");
        setShowFormModal(null);
        setFormInputs({});
        loadModuleData();
      } else {
        showToast("Failed to create Purchase Order.");
      }
    } catch {
      showToast("Network error.");
    }
  };

  const handleOnboardEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/hr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formInputs)
      });
      if (res.ok) {
        showToast(`Employee ${formInputs.name} onboarded successfully!`);
        setShowFormModal(null);
        setFormInputs({});
        loadModuleData();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to onboard employee.");
      }
    } catch {
      showToast("Network error onboarding employee.");
    }
  };

  const handleCreateMarketing = async (e: React.FormEvent, actionType: "CAMPAIGN" | "COUPON") => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formInputs, action: actionType })
      });
      if (res.ok) {
        showToast(`${actionType === "CAMPAIGN" ? "Campaign" : "Coupon"} created successfully!`);
        setShowFormModal(null);
        setFormInputs({});
        loadModuleData();
      } else {
        showToast("Failed to write promo asset.");
      }
    } catch {
      showToast("Network error.");
    }
  };

  const handleUpdatePOStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/purchase", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        showToast(`PO status set to ${status}.`);
        loadModuleData();
      }
    } catch {
      showToast("Error updating PO.");
    }
  };

  const handleUpdateLeaveStatus = async (leaveId: string, leaveStatus: string) => {
    try {
      const res = await fetch("/api/admin/hr", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "LEAVE", leaveId, leaveStatus })
      });
      if (res.ok) {
        showToast(`Leave request ${leaveStatus}.`);
        loadModuleData();
      }
    } catch {
      showToast("Error updating leave.");
    }
  };

  const handleEmployeeSuspension = async (employeeId: string, suspensionAction: string) => {
    try {
      const res = await fetch("/api/admin/hr", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SUSPENSION", employeeId, suspensionAction })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Employee state updated successfully.`);
        loadModuleData();
      } else {
        showToast(data.error || "Action restricted.");
      }
    } catch {
      showToast("Error executing employee suspend.");
    }
  };

  const handlePermanentDeleteEmployee = async (employeeId: string) => {
    if (!confirm("Are you sure you want to permanently delete this employee? This action is irreversible.")) return;
    try {
      const res = await fetch("/api/admin/hr", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId })
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Employee deleted from vault.");
        loadModuleData();
      } else {
        showToast(data.error || "Action restricted.");
      }
    } catch {
      showToast("Error deleting record.");
    }
  };

  const handleForgotPasswordApproval = async (requestId: string, status: string, tempPass: string = "TempAuraic2026!") => {
    try {
      const res = await fetch("/api/admin/credentials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status, newPassword: tempPass })
      });
      if (res.ok) {
        showToast(`Forgot password request ${status}. Temporary password sent.`);
        loadModuleData();
      } else {
        const err = await res.json();
        showToast(err.error || "Fails to process reset.");
      }
    } catch {
      showToast("Error processing request.");
    }
  };

  const handleBackupDatabase = async () => {
    try {
      const res = await fetch("/api/admin/database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "BACKUP" })
      });
      if (res.ok) {
        showToast("Database snapshot backup created.");
        loadModuleData();
      }
    } catch {
      showToast("Error copying DB.");
    }
  };

  const handleRestoreDatabase = async () => {
    try {
      const res = await fetch("/api/admin/database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "RESTORE" })
      });
      if (res.ok) {
        showToast("Database state restored successfully!");
        loadModuleData();
      }
    } catch {
      showToast("Error restoring DB.");
    }
  };

  // Assign courier for logistics
  const handleAssignCourier = async (orderId: string, carrier: string) => {
    try {
      const res = await fetch("/api/admin/logistics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, carrier, weight: 1.5, length: 20, width: 15, height: 10 })
      });
      if (res.ok) {
        showToast(`Courier ${carrier} assigned for order dispatch.`);
        loadModuleData();
      }
    } catch {
      showToast("Error setting courier.");
    }
  };

  // Update logistics package status
  const handleUpdateLogisticsStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/logistics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        showToast(`Shipment updated to ${status}.`);
        loadModuleData();
      }
    } catch {
      showToast("Error updating shipment status.");
    }
  };

  // --- CSV DATA EXPORT HELPER ---
  const exportToCSV = (dataset: any[], filename: string) => {
    if (!dataset || dataset.length === 0) {
      showToast("No records to export.");
      return;
    }
    const headers = Object.keys(dataset[0]).join(",");
    const rows = dataset.map(row => 
      Object.values(row).map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${dataset.length} rows to CSV.`);
  };

  return (
    <div className={`min-h-screen ${t.bg} ${t.text} font-sans p-6 transition-all duration-300`}>
      
      {/* Toast popup */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#3D1E16] text-[#FAF5EE] border border-[#C09355]/30 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Activity className="w-4 h-4 text-[#C09355] animate-spin" />
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}

      {/* Header bar */}
      <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-[#C09355] flex items-center justify-center font-bold text-white text-lg shadow-md border border-[#C09355]/20">
            CC
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-[#C09355] tracking-wide">CULTURAL CLUTCH ERP</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold font-sans">Enterprise Resource Planner</p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-4">
          
          {/* Quick theme selector */}
          <div className="flex items-center gap-1.5 bg-black/30 p-1.5 rounded-xl border border-gray-800 text-xs">
            <button onClick={() => setTheme("saffron")} className={`px-2 py-1 rounded-lg ${theme === "saffron" ? "bg-[#C09355] text-black" : "text-gray-400"}`}>Saffron</button>
            <button onClick={() => setTheme("charcoal")} className={`px-2 py-1 rounded-lg ${theme === "charcoal" ? "bg-[#4A4A4A] text-white" : "text-gray-400"}`}>Charcoal</button>
            <button onClick={() => setTheme("emerald")} className={`px-2 py-1 rounded-lg ${theme === "emerald" ? "bg-[#2D5A27] text-white" : "text-gray-400"}`}>Emerald</button>
          </div>

          {/* Profile details */}
          <div className="flex items-center gap-3 bg-black/20 px-4 py-1.5 rounded-2xl border border-gray-800">
            <div className="text-right">
              <span className="block text-xs font-bold text-[#FAF5EE]">{session?.user?.name || "Employee"}</span>
              <span className="block text-[9px] text-[#C09355] font-extrabold uppercase tracking-wider">
                {(session?.user as any).employeeId || "CUSTOMER"} • {(session?.user as any).role}
              </span>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-1.5 bg-red-950/40 hover:bg-red-900 border border-red-950 text-red-400 hover:text-white rounded-xl transition-all cursor-pointer"
            >
              <Power className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main workspace layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 space-y-2">
          
          <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">Permitted Modules</div>

          {/* Business Intelligence (Visible to Admins / Super Admins / CEO) */}
          {["Owner", "Super Admin", "Admin", "CEO", "Finance"].includes((session?.user as any).role) && (
            <button 
              onClick={() => { setActiveModule("bi"); setActiveSubTab("analytics"); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-xs cursor-pointer ${activeModule === "bi" ? "bg-[#C09355]/10 text-[#C09355] font-bold border border-[#C09355]/20" : "hover:bg-white/5 text-gray-400"}`}
            >
              <span className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4" /> Business Intelligence
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          )}

          {/* Sales (Visible to Sales & Admins) */}
          {(["Owner", "Super Admin", "Admin"].includes((session?.user as any).role) || (session?.user as any).department === "Sales") && (
            <button 
              onClick={() => { setActiveModule("sales"); setActiveSubTab("leads"); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-xs cursor-pointer ${activeModule === "sales" ? "bg-[#C09355]/10 text-[#C09355] font-bold border border-[#C09355]/20" : "hover:bg-white/5 text-gray-400"}`}
            >
              <span className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Sales Department
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          )}

          {/* Purchase (Visible to Purchase & Admins) */}
          {(["Owner", "Super Admin", "Admin"].includes((session?.user as any).role) || (session?.user as any).department === "Purchase") && (
            <button 
              onClick={() => { setActiveModule("purchase"); setActiveSubTab("orders"); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-xs cursor-pointer ${activeModule === "purchase" ? "bg-[#C09355]/10 text-[#C09355] font-bold border border-[#C09355]/20" : "hover:bg-white/5 text-gray-400"}`}
            >
              <span className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4" /> Purchase & Procurement
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          )}

          {/* Finance (Visible to Finance & Admins) */}
          {(["Owner", "Super Admin", "Admin", "Finance"].includes((session?.user as any).role) || (session?.user as any).department === "Finance") && (
            <button 
              onClick={() => { setActiveModule("finance"); setActiveSubTab("p_and_l"); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-xs cursor-pointer ${activeModule === "finance" ? "bg-[#C09355]/10 text-[#C09355] font-bold border border-[#C09355]/20" : "hover:bg-white/5 text-gray-400"}`}
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> Finance & Accounts
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          )}

          {/* HR / Employee records (Visible to HR & Admins) */}
          {(["Owner", "Super Admin", "Admin"].includes((session?.user as any).role) || (session?.user as any).department === "Human Resource" || (session?.user as any).department === "HR") && (
            <button 
              onClick={() => { setActiveModule("hr"); setActiveSubTab("employees"); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-xs cursor-pointer ${activeModule === "hr" ? "bg-[#C09355]/10 text-[#C09355] font-bold border border-[#C09355]/20" : "hover:bg-white/5 text-gray-400"}`}
            >
              <span className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Human Resources
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          )}

          {/* Payroll Slips */}
          {(["Owner", "Super Admin", "Admin", "Finance"].includes((session?.user as any).role) || (session?.user as any).department === "Human Resource" || (session?.user as any).department === "HR") && (
            <button 
              onClick={() => { setActiveModule("payroll"); setActiveSubTab("salary"); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-xs cursor-pointer ${activeModule === "payroll" ? "bg-[#C09355]/10 text-[#C09355] font-bold border border-[#C09355]/20" : "hover:bg-white/5 text-gray-400"}`}
            >
              <span className="flex items-center gap-2">
                <FileCheck className="w-4 h-4" /> Payroll Console
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          )}

          {/* Marketing campaigns (Marketing & Promos) */}
          {(["Owner", "Super Admin", "Admin"].includes((session?.user as any).role) || (session?.user as any).department === "Marketing") && (
            <button 
              onClick={() => { setActiveModule("marketing"); setActiveSubTab("campaigns"); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-xs cursor-pointer ${activeModule === "marketing" ? "bg-[#C09355]/10 text-[#C09355] font-bold border border-[#C09355]/20" : "hover:bg-white/5 text-gray-400"}`}
            >
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4" /> Marketing & Promos
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          )}

          {/* Logistics & Shipments */}
          {(["Owner", "Super Admin", "Admin", "Order Manager", "Delivery Manager"].includes((session?.user as any).role) || (session?.user as any).department === "Logistics") && (
            <button 
              onClick={() => { setActiveModule("logistics"); setActiveSubTab("queue"); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-xs cursor-pointer ${activeModule === "logistics" ? "bg-[#C09355]/10 text-[#C09355] font-bold border border-[#C09355]/20" : "hover:bg-white/5 text-gray-400"}`}
            >
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4" /> Logistics & Shipping
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          )}

          {/* Database Schema Explorer (Owner / Super Admin Only) */}
          {["Owner", "Super Admin"].includes((session?.user as any).role) && (
            <button 
              onClick={() => { setActiveModule("database"); setActiveSubTab("explorer"); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-xs cursor-pointer ${activeModule === "database" ? "bg-[#C09355]/10 text-[#C09355] font-bold border border-[#C09355]/20" : "hover:bg-white/5 text-gray-400"}`}
            >
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4" /> DB Schema Explorer
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          )}

          {/* Central Security Control Room (Admin / Super Admin / Owner) */}
          {["Owner", "Super Admin", "Admin"].includes((session?.user as any).role) && (
            <button 
              onClick={() => { setActiveModule("admin"); setActiveSubTab("audit"); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-xs cursor-pointer ${activeModule === "admin" ? "bg-[#C09355]/10 text-[#C09355] font-bold border border-[#C09355]/20" : "hover:bg-white/5 text-gray-400"}`}
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" /> Central Control Room
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          )}

        </aside>

        {/* Dashboard Display Window */}
        <main className="lg:col-span-4 space-y-6">

          {/* ========================================== */}
          {/* BUSINESS INTELLIGENCE DASHBOARD VIEW       */}
          {/* ========================================== */}
          {activeModule === "bi" && (
            <div className="space-y-6">
              
              {/* Header Title */}
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">Business Intelligence Center</h2>
                  <p className="text-xs text-gray-400">Enterprise analytical predictions and geographical ODOP metrics from database.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => exportToCSV(orders, "SalesOrdersBackup")} className="px-3 py-1.5 bg-black/40 hover:bg-black/80 border border-gray-800 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer">
                    <Download className="w-3.5 h-3.5" /> Export Orders
                  </button>
                </div>
              </div>

              {/* KPI Summaries Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className={`p-5 rounded-2xl border ${t.card}`}>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Gross Sales Revenue</span>
                    <DollarSign className="w-4 h-4 text-[#C09355]" />
                  </div>
                  <div className="text-xl font-bold font-serif mt-2">₹{financeData?.revenue?.toLocaleString("en-IN") || 0}</div>
                  <div className="text-[9px] text-green-500 font-extrabold flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> +14.2% from last quarter
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${t.card}`}>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Real Net profit</span>
                    <TrendingUp className="w-4 h-4 text-[#C09355]" />
                  </div>
                  <div className="text-xl font-bold font-serif mt-2">₹{financeData?.netProfit?.toLocaleString("en-IN") || 0}</div>
                  <div className="text-[9px] text-green-500 font-extrabold flex items-center gap-1 mt-1">
                    <Check className="w-3 h-3" /> In Good Standing
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${t.card}`}>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Inventory Asset Valuation</span>
                    <Package className="w-4 h-4 text-[#C09355]" />
                  </div>
                  <div className="text-xl font-bold font-serif mt-2">₹{financeData?.inventoryAssetValue?.toLocaleString("en-IN") || 0}</div>
                  <div className="text-[9px] text-gray-400 flex items-center gap-1 mt-1">
                    Based on prices & current stock
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${t.card}`}>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Tax GST Reserves</span>
                    <FileText className="w-4 h-4 text-[#C09355]" />
                  </div>
                  <div className="text-xl font-bold font-serif mt-2">₹{financeData?.taxCollected?.toLocaleString("en-IN") || 0}</div>
                  <div className="text-[9px] text-[#C09355] font-semibold flex items-center gap-1 mt-1">
                    Tax liabilities collected
                  </div>
                </div>
              </div>

              {/* Area chart of revenue */}
              <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                <div className="text-xs font-bold uppercase tracking-wider">Sales Analytics Timeline (Live Database Orders)</div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={orders.map(o => ({ date: new Date(o.createdAt).toLocaleDateString(), value: o.netAmount }))}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#999" fontSize={10} />
                      <YAxis stroke="#999" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: "#1e1e1e", border: "1px solid #444" }} />
                      <Area type="monotone" dataKey="value" stroke="#C09355" fill="rgba(192, 147, 85, 0.15)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}

          {/* ========================================== */}
          {/* SALES DEPARTMENT VIEW                      */}
          {/* ========================================== */}
          {activeModule === "sales" && (
            <div className="space-y-6">
              
              {/* Header Title */}
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">Sales & CRM Pipeline</h2>
                  <p className="text-xs text-gray-400">Leads pipeline, conversions, target tracking, and customer conversion forms.</p>
                </div>
                <button 
                  onClick={() => {
                    setFormInputs({});
                    setShowFormModal("LEAD");
                  }} 
                  className="px-4 py-2 bg-[#C09355] text-black font-bold rounded-2xl text-xs flex items-center gap-1.5 hover:bg-[#C09355]/95 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> Add Sales Lead
                </button>
              </div>

              {/* CRM Leads grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {["NEW", "CONTACTED", "QUALIFIED", "WON"].map((stage) => (
                  <div key={stage} className="bg-black/30 border border-gray-800/80 p-4 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                      <span className="text-[10px] font-bold text-[#C09355] tracking-wide uppercase">{stage} Stage</span>
                      <span className="text-[9px] bg-gray-800 px-1.5 py-0.5 rounded-md text-gray-400 font-extrabold">
                        {leads.filter(l => l.status === stage).length}
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {leads.filter(l => l.status === stage).map((l) => (
                        <div key={l.id} className="p-3 bg-white/5 border border-gray-800 hover:border-[#C09355]/30 rounded-xl space-y-1.5 transition-all">
                          <div className="font-semibold text-xs text-[#FAF5EE]">{l.name}</div>
                          <div className="text-[10px] text-gray-400">{l.phone}</div>
                          <div className="text-[10px] text-amber-500/80 font-semibold font-mono">₹{l.value}</div>
                          
                          {/* Quick stage toggle buttons */}
                          <div className="flex gap-1.5 mt-1 border-t border-gray-800/50 pt-1.5">
                            {stage !== "WON" && (
                              <button 
                                onClick={async () => {
                                  const nextStage = stage === "NEW" ? "CONTACTED" : stage === "CONTACTED" ? "QUALIFIED" : "WON";
                                  await fetch("/api/admin/leads", {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ id: l.id, status: nextStage })
                                  });
                                  showToast(`Lead set to ${nextStage}`);
                                  loadModuleData();
                                }}
                                className="text-[8px] font-extrabold uppercase text-[#C09355] bg-[#C09355]/10 px-1.5 py-0.5 rounded hover:bg-[#C09355] hover:text-black transition-all cursor-pointer"
                              >
                                Advance
                              </button>
                            )}
                            <button 
                              onClick={async () => {
                                if (confirm("Remove lead?")) {
                                  await fetch("/api/admin/leads", {
                                    method: "DELETE",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ id: l.id })
                                  });
                                  showToast("Lead removed.");
                                  loadModuleData();
                                }
                              }}
                              className="text-[8px] font-extrabold uppercase text-red-400 bg-red-950/20 px-1.5 py-0.5 rounded hover:bg-red-800 hover:text-white transition-all cursor-pointer ml-auto"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================== */}
          {/* PURCHASE DEPARTMENT VIEW                   */}
          {/* ========================================== */}
          {activeModule === "purchase" && (
            <div className="space-y-6">
              
              {/* Header Title */}
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">Purchase & Supply</h2>
                  <p className="text-xs text-gray-400">Vendor COMPARISON matrix, Purchase Orders (PO), GRN logs matching.</p>
                </div>
                <button 
                  onClick={() => {
                    setFormInputs({});
                    setShowFormModal("PO");
                  }} 
                  className="px-4 py-2 bg-[#C09355] text-black font-bold rounded-2xl text-xs flex items-center gap-1.5 hover:bg-[#C09355]/95 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> Create Purchase Order
                </button>
              </div>

              {/* PO list table */}
              <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                <div className="text-xs font-bold uppercase tracking-wider">Procurement Purchase Orders</div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-400 font-extrabold uppercase">
                        <th className="py-2.5">Vendor Name</th>
                        <th>Procured Item</th>
                        <th>Total Value</th>
                        <th>Expectation Date</th>
                        <th>Status</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                      {purchaseOrders.map((po) => (
                        <tr key={po.id} className="hover:bg-white/5 transition-all">
                          <td className="py-3 font-semibold text-[#FAF5EE]">{po.vendorName}</td>
                          <td>{po.items[0]?.productName || "Stock Bundle"}</td>
                          <td className="font-mono">₹{po.totalAmount}</td>
                          <td>{new Date(po.expectedDate).toLocaleDateString()}</td>
                          <td>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${po.status === "DELIVERED" ? "bg-green-950 text-green-400 border border-green-800" : po.status === "APPROVED" ? "bg-blue-950 text-blue-400" : "bg-yellow-950 text-yellow-400"}`}>
                              {po.status}
                            </span>
                          </td>
                          <td className="text-right">
                            {po.status === "PENDING" && (
                              <button onClick={() => handleUpdatePOStatus(po.id, "APPROVED")} className="px-2 py-1 bg-blue-950 hover:bg-blue-800 text-blue-400 text-[10px] font-bold rounded-lg cursor-pointer">
                                Approve PO
                              </button>
                            )}
                            {po.status === "APPROVED" && (
                              <button onClick={() => handleUpdatePOStatus(po.id, "DELIVERED")} className="px-2 py-1 bg-green-950 hover:bg-green-800 text-green-400 text-[10px] font-bold rounded-lg cursor-pointer">
                                Post GRN (Deliver)
                              </button>
                            )}
                            {po.status === "DELIVERED" && <span className="text-[10px] text-gray-500 font-bold uppercase">Archived</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================== */}
          {/* FINANCE DEPARTMENT VIEW                    */}
          {/* ========================================== */}
          {activeModule === "finance" && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">Finance & Ledger Accounts</h2>
                  <p className="text-xs text-gray-400">Cash book registers, P&L reporting, balance sheet structures, tax GST filings.</p>
                </div>
                <button onClick={() => exportToCSV(financeData?.ledger || [], "FinanceLedger")} className="px-3 py-1.5 bg-black/40 hover:bg-black/80 border border-gray-800 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer">
                  <Download className="w-3.5 h-3.5" /> Export Ledger
                </button>
              </div>

              {/* Finance sheets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Ledger Inflows/Outflows */}
                <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">Real-Time General Ledger Statements</div>
                  
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 text-[11px]">
                    {(financeData?.ledger || []).map((log: any) => (
                      <div key={log.id} className="p-3 bg-black/20 border border-gray-800/80 rounded-xl flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-white">{log.description}</div>
                          <div className="text-[9px] text-gray-500">{new Date(log.date).toLocaleString()} • {log.category}</div>
                        </div>
                        <span className={`font-mono font-bold ${log.type === "INFLOW" ? "text-green-400" : "text-red-400"}`}>
                          {log.type === "INFLOW" ? "+" : "-"} ₹{log.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Profit & Loss report summary */}
                <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">Profit & Loss Statement (P&L)</div>
                  
                  <div className="space-y-3 font-sans text-xs">
                    <div className="flex justify-between border-b border-gray-800 pb-2">
                      <span className="text-gray-400 font-semibold">Customer Invoice Revenue</span>
                      <span className="font-bold font-mono">₹{financeData?.revenue || 0}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-800 pb-2">
                      <span className="text-gray-400 font-semibold">Commissions Deducted (15% platform)</span>
                      <span className="font-bold font-mono">₹{financeData?.commissionsEarned || 0}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-800 pb-2 text-red-400">
                      <span className="font-semibold">Procurement Purchase Outflow</span>
                      <span className="font-bold font-mono">- ₹{financeData?.procurementOutflow || 0}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-800 pb-2 text-red-400">
                      <span className="font-semibold">Artisan Payout settlements</span>
                      <span className="font-bold font-mono">- ₹{financeData?.vendorPayoutsOutflow || 0}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-850 pb-2 text-red-400">
                      <span className="font-semibold">Baseline Operations & Overheads</span>
                      <span className="font-bold font-mono">- ₹15,000</span>
                    </div>
                    <div className="flex justify-between text-base font-serif font-bold text-[#C09355] pt-2">
                      <span>Net profit margin</span>
                      <span className="font-mono">₹{financeData?.netProfit || 0}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================== */}
          {/* HUMAN RESOURCES DEPARTMENT VIEW            */}
          {/* ========================================== */}
          {activeModule === "hr" && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">HR Management & Attendance</h2>
                  <p className="text-xs text-gray-400">Onboarding files, daily attendance clock logs, and leave approval workflows.</p>
                </div>
                <button 
                  onClick={() => {
                    setFormInputs({});
                    setShowFormModal("EMPLOYEE");
                  }} 
                  className="px-4 py-2 bg-[#C09355] text-black font-bold rounded-2xl text-xs flex items-center gap-1.5 hover:bg-[#C09355]/95 transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" /> Onboard Employee
                </button>
              </div>

              {/* Employee directory list */}
              <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">Active Employee Directory</div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(hrData?.employees || []).map((emp: any) => (
                    <div key={emp.id} className="p-4 bg-black/20 border border-gray-800 rounded-2xl flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="font-serif font-bold text-sm text-[#FAF5EE]">{emp.name}</div>
                        <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide">
                          {emp.employeeId} • {emp.designation}
                        </div>
                        <div className="text-[10px] text-[#C09355] font-semibold">{emp.department}</div>
                        
                        {emp.isSuspended && (
                          <div className="text-[9px] bg-red-950 text-red-400 border border-red-900 rounded px-1.5 py-0.5 inline-block font-bold">
                            SUSPENDED (Expires: {new Date(emp.terminationExpiry).toLocaleDateString()})
                          </div>
                        )}
                      </div>

                      {/* Suspension actions */}
                      <div className="flex flex-col gap-1.5">
                        {!emp.isSuspended ? (
                          <button 
                            onClick={() => handleEmployeeSuspension(emp.id, "SUSPEND")}
                            className="px-2 py-1 bg-red-950 hover:bg-red-900 border border-red-900 text-red-400 hover:text-white text-[9px] font-bold rounded-lg cursor-pointer"
                          >
                            Suspend (5d)
                          </button>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleEmployeeSuspension(emp.id, "RESTORE")}
                              className="px-2 py-1 bg-green-950 hover:bg-green-900 border border-green-900 text-green-400 hover:text-white text-[9px] font-bold rounded-lg cursor-pointer"
                            >
                              Restore
                            </button>
                            <button 
                              onClick={() => handleEmployeeSuspension(emp.id, "EXTEND")}
                              className="px-2 py-1 bg-yellow-950 hover:bg-yellow-900 text-yellow-450 text-[9px] font-bold rounded-lg cursor-pointer"
                            >
                              Extend (+5d)
                            </button>
                            <button 
                              onClick={() => handleEmployeeSuspension(emp.id, "TERMINATE")}
                              className="px-2 py-1 bg-red-950 hover:bg-red-800 text-red-400 text-[9px] font-bold rounded-lg cursor-pointer"
                            >
                              Terminate
                            </button>
                          </>
                        )}
                        
                        {/* Super Admin Permanent Delete */}
                        {["Owner", "Super Admin"].includes((session?.user as any).role) && (
                          <button 
                            onClick={() => handlePermanentDeleteEmployee(emp.id)}
                            className="px-2 py-1 bg-black/40 hover:bg-red-950 text-red-500 hover:text-white text-[9px] font-bold rounded-lg border border-red-950/45 cursor-pointer mt-1"
                          >
                            Permanent Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leave approvals table */}
              <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">Leave Approvals Queue</div>
                <div className="space-y-2">
                  {(hrData?.leaves || []).map((l: any) => (
                    <div key={l.id} className="p-3 bg-black/20 border border-gray-800 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-white">{l.user.name} ({l.user.employeeId})</span>
                        <p className="text-[10px] text-gray-400 mt-0.5">Reason: "{l.reason}" ({new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()})</p>
                      </div>
                      <div className="flex gap-2">
                        {l.status === "PENDING" ? (
                          <>
                            <button onClick={() => handleUpdateLeaveStatus(l.id, "APPROVED")} className="px-2 py-1 bg-green-950 text-green-400 hover:bg-green-800 text-[10px] font-bold rounded-lg cursor-pointer">Approve</button>
                            <button onClick={() => handleUpdateLeaveStatus(l.id, "REJECTED")} className="px-2 py-1 bg-red-950 text-red-400 hover:bg-red-800 text-[10px] font-bold rounded-lg cursor-pointer">Reject</button>
                          </>
                        ) : (
                          <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded ${l.status === "APPROVED" ? "bg-green-950 text-green-400" : "bg-red-950 text-red-400"}`}>
                            {l.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================== */}
          {/* PAYROLL CONSOLE VIEW                       */}
          {/* ========================================== */}
          {activeModule === "payroll" && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">Payroll & Salary structures</h2>
                  <p className="text-xs text-gray-400">Manage salary base scale, PF, ESIC deductions, tax filings, and payslip runs.</p>
                </div>
                <button 
                  onClick={async () => {
                    const res = await fetch("/api/admin/payroll", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ month: new Date().getMonth() + 1, year: new Date().getFullYear() })
                    });
                    if (res.ok) {
                      showToast("Monthly payroll batch runs approved!");
                      loadModuleData();
                    } else {
                      showToast("No pending payroll entries found.");
                    }
                  }}
                  className="px-4 py-2 bg-[#C09355] text-black font-bold rounded-2xl text-xs flex items-center gap-1.5 hover:bg-[#C09355]/95 transition-all cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" /> Approve Current Month Payroll
                </button>
              </div>

              {/* Payroll slips table */}
              <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">Employee Payslips Registry</div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-400 font-extrabold uppercase">
                        <th className="py-2.5">Employee</th>
                        <th>Department</th>
                        <th>Base Salary</th>
                        <th>PF / ESIC</th>
                        <th>Tax Deducted</th>
                        <th>Net Pay</th>
                        <th>Period</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                      {payroll.map((p) => (
                        <tr key={p.id} className="hover:bg-white/5">
                          <td className="py-3 font-semibold text-white">{p.user.name} ({p.user.employeeId})</td>
                          <td>{p.user.department}</td>
                          <td className="font-mono">₹{p.salary}</td>
                          <td className="font-mono">₹{p.pf} / ₹{p.esic}</td>
                          <td className="font-mono">₹{p.tax}</td>
                          <td className="font-semibold font-mono text-[#C09355]">₹{p.netPay}</td>
                          <td>{p.month}/{p.year}</td>
                          <td>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${p.status === "APPROVED" ? "bg-green-950 text-green-400" : "bg-yellow-950 text-yellow-450"}`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================== */}
          {/* MARKETING & PROMOS VIEW                    */}
          {/* ========================================== */}
          {activeModule === "marketing" && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">Marketing & Promos</h2>
                  <p className="text-xs text-gray-400">Setup coupons discount rules, banner positions, and active campaign stats.</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setFormInputs({});
                      setShowFormModal("CAMPAIGN");
                    }}
                    className="px-3 py-2 bg-[#C09355] text-black font-bold rounded-2xl text-xs flex items-center gap-1.5 hover:bg-[#C09355]/95 transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Campaign
                  </button>
                  <button 
                    onClick={() => {
                      setFormInputs({});
                      setShowFormModal("COUPON");
                    }}
                    className="px-3 py-2 bg-black/40 hover:bg-black/80 text-white font-bold rounded-2xl border border-gray-800 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Coupon
                  </button>
                </div>
              </div>

              {/* Banners & Coupons list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Active Campaigns list */}
                <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">Active Marketing Campaigns</div>
                  <div className="space-y-3">
                    {(marketing?.campaigns || []).map((camp: any) => (
                      <div key={camp.id} className="p-4 bg-black/20 border border-gray-800 rounded-2xl space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-serif font-bold text-sm text-[#FAF5EE]">{camp.name}</span>
                            <span className="block text-[8px] text-gray-400 font-extrabold uppercase mt-0.5">{camp.type} • {camp.status}</span>
                          </div>
                          <span className="font-mono text-xs font-bold text-[#C09355]">Budget: ₹{camp.budget}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 border-t border-gray-850 pt-2">
                          <div>Clicks: <span className="font-bold text-white">{camp.clicks}</span></div>
                          <div>Conversions: <span className="font-bold text-white">{camp.conversions}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Coupon Codes list */}
                <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">Discount Coupons Vault</div>
                  
                  <div className="space-y-2">
                    {(marketing?.coupons || []).map((cop: any) => (
                      <div key={cop.id} className="p-3 bg-black/20 border border-gray-800 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <span className="font-mono font-bold text-[#C09355] bg-[#C09355]/10 px-2 py-0.5 rounded border border-[#C09355]/25">{cop.code}</span>
                          <p className="text-[10px] text-gray-500 mt-1">Min Order: ₹{cop.minOrderAmount} • Value: {cop.value}% off</p>
                        </div>
                        <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded ${cop.isActive ? "bg-green-950 text-green-400" : "bg-red-950 text-red-400"}`}>
                          {cop.isActive ? "Active" : "Disabled"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================== */}
          {/* LOGISTICS & SHIPPING VIEW                  */}
          {/* ========================================== */}
          {activeModule === "logistics" && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">Logistics & Shipping Operations</h2>
                  <p className="text-xs text-gray-400">Communication with shipping lines, courier labels, manifests, dispatch queues.</p>
                </div>
              </div>

              {/* Ready for shipment queue */}
              <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">Ready For Shipment queue</div>
                
                <div className="space-y-3">
                  {logistics.map((ship: any) => (
                    <div key={ship.id} className="p-4 bg-black/20 border border-gray-800 rounded-2xl space-y-3 text-xs">
                      
                      <div className="flex justify-between items-start border-b border-gray-850 pb-2">
                        <div>
                          <span className="font-bold text-white">Order ID: {ship.orderId.substring(0,8).toUpperCase()}</span>
                          <p className="text-[10px] text-gray-400 mt-0.5">Customer: {ship.order?.user?.name} | Address: {ship.order?.shippingAddress?.street}, {ship.order?.shippingAddress?.city}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${ship.status === "DELIVERED" ? "bg-green-950 text-green-400" : "bg-yellow-950 text-yellow-450"}`}>
                          {ship.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] text-gray-400">
                        <div>Carrier: <span className="font-bold text-white">{ship.carrier || "Unassigned"}</span></div>
                        <div>Tracking: <span className="font-bold text-white">{ship.trackingNumber || "N/A"}</span></div>
                        <div>Weight: <span className="font-bold text-white">{ship.weight} kg</span></div>
                        <div>Dimensions: <span className="font-bold text-white">{ship.length}x{ship.width}x{ship.height} cm</span></div>
                      </div>

                      {/* Manifest / shipping label links */}
                      {ship.trackingNumber && (
                        <div className="flex gap-3 bg-black/40 p-2 rounded-xl border border-gray-850/50">
                          <a href={ship.labelUrl} target="_blank" className="text-[#C09355] hover:underline flex items-center gap-1 font-bold text-[10px]">
                            <Download className="w-3.5 h-3.5" /> Shipping Label
                          </a>
                          <a href={ship.manifestUrl} target="_blank" className="text-[#C09355] hover:underline flex items-center gap-1 font-bold text-[10px]">
                            <FileText className="w-3.5 h-3.5" /> Manifest Document
                          </a>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        {!ship.trackingNumber ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-gray-400">Assign Courier:</span>
                            <button onClick={() => handleAssignCourier(ship.orderId, "Delhivery")} className="px-2.5 py-1 bg-amber-950/40 text-[#C09355] border border-[#C09355]/30 rounded hover:bg-[#C09355] hover:text-black cursor-pointer">Delhivery</button>
                            <button onClick={() => handleAssignCourier(ship.orderId, "Blue Dart")} className="px-2.5 py-1 bg-amber-950/40 text-[#C09355] border border-[#C09355]/30 rounded hover:bg-[#C09355] hover:text-black cursor-pointer">Blue Dart</button>
                          </div>
                        ) : (
                          ship.status === "PENDING_PICKUP" && (
                            <button onClick={() => handleUpdateLogisticsStatus(ship.id, "IN_TRANSIT")} className="px-3 py-1 bg-amber-950/50 hover:bg-[#C09355] hover:text-black text-[#C09355] font-bold rounded-lg cursor-pointer">
                              Dispatch Order
                            </button>
                          )
                        )}
                        {ship.status === "IN_TRANSIT" && (
                          <button onClick={() => handleUpdateLogisticsStatus(ship.id, "DELIVERED")} className="px-3 py-1 bg-green-950 hover:bg-green-900 text-green-400 font-bold rounded-lg cursor-pointer">
                            Mark as Delivered
                          </button>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================== */}
          {/* DB SCHEMA EXPLORER VIEW                    */}
          {/* ========================================== */}
          {activeModule === "database" && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">Database Schema Explorer</h2>
                  <p className="text-xs text-gray-400">Raw table metadata, column relation mapping, backup snapshots and restorations.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleBackupDatabase} className="px-3 py-2 bg-[#C09355] text-black font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-[#C09355]/95 transition-all cursor-pointer">
                    <Database className="w-4 h-4" /> Snapshot Backup
                  </button>
                  <button onClick={handleRestoreDatabase} className="px-3 py-2 bg-black/40 hover:bg-black/80 text-white font-bold rounded-xl border border-gray-800 text-xs flex items-center gap-1.5 transition-all cursor-pointer">
                    <RefreshCw className="w-4 h-4" /> Restore State
                  </button>
                </div>
              </div>

              {/* Table stats & relationship mapping */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Lists of Tables */}
                <div className={`p-6 rounded-3xl border ${t.card} md:col-span-1 space-y-4`}>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">SQLite Tables Row Counts</div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {Object.entries(dbExplorer.stats || {}).map(([tbl, count]: any) => (
                      <div key={tbl} className="flex justify-between items-center p-2 bg-white/5 border border-gray-850 rounded-xl text-xs">
                        <span className="font-semibold text-white">{tbl}</span>
                        <span className="font-mono font-bold text-[#C09355] bg-[#C09355]/10 px-2 py-0.5 rounded border border-[#C09355]/25">{count} rows</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DB Relationships visualizer list */}
                <div className={`p-6 rounded-3xl border ${t.card} md:col-span-2 space-y-4`}>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">Mapped Database Entity Relationships</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                    {(dbExplorer.relationships || []).map((rel: any, idx: number) => (
                      <div key={idx} className="p-3 bg-black/20 border border-gray-800 rounded-xl flex items-center justify-between text-[11px]">
                        <div>
                          <span className="font-bold text-white">{rel.from}</span>
                          <span className="text-gray-500 block text-[9px] mt-0.5">References mapping</span>
                        </div>
                        <div className="text-[#C09355] font-extrabold uppercase text-[9px] bg-[#C09355]/15 px-2 py-0.5 rounded border border-[#C09355]/20">
                          {rel.type}
                        </div>
                        <div>
                          <span className="font-bold text-white">{rel.to}</span>
                          <span className="text-gray-500 block text-[9px] mt-0.5">Primary Key</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================== */}
          {/* CENTRAL SECURITY CONTROL ROOM VIEW         */}
          {/* ========================================== */}
          {activeModule === "admin" && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">Central Security Control Room</h2>
                  <p className="text-xs text-gray-400">Super Admin authorization matrices, failed login attempts, password vault request logs.</p>
                </div>
              </div>

              {/* Password vault resets approvals list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Reset Requests (Visible to Owner / Super Admin / Admin) */}
                <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">Employee Forgot Password Reset approvals</div>
                  
                  <div className="space-y-3">
                    {resetRequests.length === 0 ? (
                      <p className="text-xs text-gray-500">No pending reset requests in queue.</p>
                    ) : (
                      resetRequests.map((req: any) => (
                        <div key={req.id} className="p-4 bg-black/20 border border-gray-800 rounded-2xl space-y-3 text-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-bold text-white">{req.user?.name} ({req.user?.employeeId})</span>
                              <span className="block text-[8px] text-gray-500 uppercase mt-0.5">Dept: {req.user?.department}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${req.status === "APPROVED" ? "bg-green-950 text-green-400" : req.status === "PENDING" ? "bg-yellow-950 text-yellow-450" : "bg-red-950 text-red-400"}`}>
                              {req.status}
                            </span>
                          </div>

                          {req.status === "PENDING" && (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleForgotPasswordApproval(req.id, "APPROVED")} 
                                className="px-3 py-1 bg-green-950 text-green-400 border border-green-900 rounded hover:bg-green-900 hover:text-white cursor-pointer"
                              >
                                Approve (Temp: TempAuraic2026!)
                              </button>
                              <button 
                                onClick={() => handleForgotPasswordApproval(req.id, "REJECTED")} 
                                className="px-3 py-1 bg-red-950 text-red-400 border border-red-900 rounded hover:bg-red-900 hover:text-white cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Audit Logs list */}
                <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">Security Audit Activity Logs</div>
                  
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 text-[10px]">
                    {auditLogs.map((log: any) => (
                      <div key={log.id} className="p-3 bg-black/20 border border-gray-800 rounded-xl space-y-1">
                        <div className="flex justify-between items-center font-bold text-white">
                          <span>{log.actorName}</span>
                          <span className="text-[#C09355] text-[9px] uppercase tracking-wider">{log.action}</span>
                        </div>
                        <p className="text-gray-400">{log.details}</p>
                        <span className="text-[8px] text-gray-500">{new Date(log.createdAt).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

        </main>

      </div>

      {/* ========================================== */}
      {/* DIALOG FORM MODALS FOR CRUD OPERATIONS      */}
      {/* ========================================== */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-6 text-[#2E1E1A]">
          <div className="max-w-md w-full bg-[#FDFBF7] p-8 rounded-3xl border border-gray-200/80 shadow-2xl space-y-6">
            
            <div className="flex justify-between items-center border-b border-gray-150 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#3D1E16]">
                {showFormModal === "LEAD" && "Add New Sales Lead"}
                {showFormModal === "PO" && "Create Purchase Order"}
                {showFormModal === "EMPLOYEE" && "HR Onboard Employee"}
                {showFormModal === "CAMPAIGN" && "Create Marketing Campaign"}
                {showFormModal === "COUPON" && "Add Coupon Code"}
              </h3>
              <button 
                onClick={() => setShowFormModal(null)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-all cursor-pointer text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORM 1: Sales Lead */}
            {showFormModal === "LEAD" && (
              <form onSubmit={handleCreateLead} className="space-y-4 text-xs font-semibold text-gray-600">
                <div>
                  <label className="block mb-1">Lead Name</label>
                  <input type="text" required onChange={(e) => setFormInputs({ ...formInputs, name: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" placeholder="e.g. Rahul Verma" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Email</label>
                    <input type="email" required onChange={(e) => setFormInputs({ ...formInputs, email: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" placeholder="e.g. rahul@domain.com" />
                  </div>
                  <div>
                    <label className="block mb-1">Phone</label>
                    <input type="text" required onChange={(e) => setFormInputs({ ...formInputs, phone: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" placeholder="+91 9988..." />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Estimated Value (₹)</label>
                    <input type="number" required onChange={(e) => setFormInputs({ ...formInputs, value: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" placeholder="e.g. 15000" />
                  </div>
                  <div>
                    <label className="block mb-1">Source</label>
                    <select onChange={(e) => setFormInputs({ ...formInputs, source: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                      <option value="Website">Website</option>
                      <option value="Referral">Referral</option>
                      <option value="Campaign">Campaign</option>
                      <option value="Search">Search</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white font-bold rounded-xl transition-all cursor-pointer">
                  Register Lead
                </button>
              </form>
            )}

            {/* FORM 2: Purchase Order */}
            {showFormModal === "PO" && (
              <form onSubmit={handleCreatePO} className="space-y-4 text-xs font-semibold text-gray-600">
                <div>
                  <label className="block mb-1">Vendor Name</label>
                  <input type="text" required onChange={(e) => setFormInputs({ ...formInputs, vendorName: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" placeholder="e.g. Varanasi Weaver Collective" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Vendor ID</label>
                    <input type="text" required onChange={(e) => setFormInputs({ ...formInputs, vendorId: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" placeholder="e.g. v-weaver-01" />
                  </div>
                  <div>
                    <label className="block mb-1">Expected Delivery</label>
                    <input type="date" required onChange={(e) => setFormInputs({ ...formInputs, expectedDate: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                </div>
                <div className="border-t border-gray-150 pt-3">
                  <span className="block mb-2 font-bold text-[#3D1E16]">PO Line Item Details</span>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block mb-1">Product Name</label>
                      <input type="text" required onChange={(e) => setFormInputs({ ...formInputs, productName: e.target.value })} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg" placeholder="Banarasi Silk" />
                    </div>
                    <div>
                      <label className="block mb-1">Qty</label>
                      <input type="number" required onChange={(e) => setFormInputs({ ...formInputs, quantity: e.target.value })} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg" placeholder="10" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block mb-1">Unit Price (₹)</label>
                      <input type="number" required onChange={(e) => setFormInputs({ ...formInputs, unitPrice: e.target.value })} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg" placeholder="₹6000" />
                    </div>
                    <div>
                      <label className="block mb-1">Total PO Amount (₹)</label>
                      <input type="number" required onChange={(e) => setFormInputs({ ...formInputs, totalAmount: e.target.value })} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg" placeholder="₹60000" />
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white font-bold rounded-xl transition-all cursor-pointer">
                  Dispatch Purchase Order
                </button>
              </form>
            )}

            {/* FORM 3: Onboard Employee */}
            {showFormModal === "EMPLOYEE" && (
              <form onSubmit={handleOnboardEmployee} className="space-y-4 text-xs font-semibold text-gray-600">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Full Name</label>
                    <input type="text" required onChange={(e) => setFormInputs({ ...formInputs, name: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" placeholder="e.g. Sonal Gupta" />
                  </div>
                  <div>
                    <label className="block mb-1">Email</label>
                    <input type="email" required onChange={(e) => setFormInputs({ ...formInputs, email: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" placeholder="sonal@domain.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Phone</label>
                    <input type="text" onChange={(e) => setFormInputs({ ...formInputs, phone: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" placeholder="+91..." />
                  </div>
                  <div>
                    <label className="block mb-1">Temporary Password</label>
                    <input type="password" required onChange={(e) => setFormInputs({ ...formInputs, password: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" placeholder="••••••••" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block mb-1">Department</label>
                    <select onChange={(e) => setFormInputs({ ...formInputs, department: e.target.value })} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-[10px]">
                      <option value="">Select Dept</option>
                      <option value="Sales">Sales</option>
                      <option value="Finance">Finance</option>
                      <option value="Human Resource">Human Resource</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Designation</label>
                    <input type="text" required onChange={(e) => setFormInputs({ ...formInputs, designation: e.target.value })} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg" placeholder="Executive" />
                  </div>
                  <div>
                    <label className="block mb-1">Sys Role</label>
                    <select onChange={(e) => setFormInputs({ ...formInputs, roleName: e.target.value })} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-[10px]">
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Customer Support">Customer Support</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white font-bold rounded-xl transition-all cursor-pointer">
                  Onboard & Save Account
                </button>
              </form>
            )}

            {/* FORM 4: Campaigns */}
            {showFormModal === "CAMPAIGN" && (
              <form onSubmit={(e) => handleCreateMarketing(e, "CAMPAIGN")} className="space-y-4 text-xs font-semibold text-gray-600">
                <div>
                  <label className="block mb-1">Campaign Name</label>
                  <input type="text" required onChange={(e) => setFormInputs({ ...formInputs, name: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" placeholder="e.g. Diwali Expo 2026" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Type</label>
                    <select onChange={(e) => setFormInputs({ ...formInputs, type: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                      <option value="SOCIAL">SOCIAL</option>
                      <option value="EMAIL">EMAIL</option>
                      <option value="SMS">SMS</option>
                      <option value="INFLUENCER">INFLUENCER</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Budget (₹)</label>
                    <input type="number" required onChange={(e) => setFormInputs({ ...formInputs, budget: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" placeholder="e.g. 25000" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Start Date</label>
                    <input type="date" required onChange={(e) => setFormInputs({ ...formInputs, startDate: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block mb-1">End Date</label>
                    <input type="date" required onChange={(e) => setFormInputs({ ...formInputs, endDate: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white font-bold rounded-xl transition-all cursor-pointer">
                  Deploy Campaign
                </button>
              </form>
            )}

            {/* FORM 5: Coupons */}
            {showFormModal === "COUPON" && (
              <form onSubmit={(e) => handleCreateMarketing(e, "COUPON")} className="space-y-4 text-xs font-semibold text-gray-600">
                <div>
                  <label className="block mb-1">Coupon Code</label>
                  <input type="text" required onChange={(e) => setFormInputs({ ...formInputs, code: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" placeholder="e.g. FESTIVE15" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Discount Type</label>
                    <select onChange={(e) => setFormInputs({ ...formInputs, couponType: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                      <option value="PERCENTAGE">PERCENTAGE</option>
                      <option value="FLAT">FLAT</option>
                      <option value="BOGO">BOGO</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Value (% or Flat ₹)</label>
                    <input type="number" required onChange={(e) => setFormInputs({ ...formInputs, value: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" placeholder="e.g. 15" />
                  </div>
                </div>
                <div>
                  <label className="block mb-1">Minimum Order Amount (₹)</label>
                  <input type="number" onChange={(e) => setFormInputs({ ...formInputs, minOrderAmount: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" placeholder="e.g. 1500" />
                </div>
                <button type="submit" className="w-full py-3 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white font-bold rounded-xl transition-all cursor-pointer">
                  Save Coupon Code
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
