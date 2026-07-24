"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  DollarSign, ShoppingBag, TrendingUp, AlertTriangle, Users, Download, Upload, Check, 
  ShieldAlert, RefreshCw, FileText, ShieldCheck, Activity, UserPlus, PlusCircle, Lock,
  Calendar, ClipboardList, Package, Layers, Truck, BarChart2, Database, Moon, Sun, 
  Settings, Bell, X, Edit, Trash2, ArrowRight, UserCheck, Plus, Globe, Key, Sparkles, 
  Filter, MapPin, Clock, Briefcase, FileCheck, Tag, Eye, Shield, Power, Trash, ArrowDown, ChevronRight, MessageSquare
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
  const [resetRequests, setResetRequests] = useState<any[]>([]);

  // --- ADDITIONAL ENTERPRISE STATE MODULES ---
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [wmsBins, setWmsBins] = useState<any[]>([
    { id: "bin-a1", code: "Bay A - Bin 1", item: "Banarasi Silk Brocade", stock: 15, max: 50 },
    { id: "bin-a2", code: "Bay A - Bin 2", item: "Kashmiri Pashmina Shawl", stock: 8, max: 20 },
    { id: "bin-b1", code: "Bay B - Bin 1", item: "Channapatna Wooden Toys", stock: 45, max: 100 },
    { id: "bin-b2", code: "Bay B - Bin 2", item: "Kutchi Embroidered Bag", stock: 12, max: 40 }
  ]);
  const [dmsFiles, setDmsFiles] = useState<any[]>([
    { id: "doc-1", name: "Artisan_Agreement_Kashmir.pdf", category: "Contracts", size: "1.2 MB", uploadedBy: "HR-SNEHA", date: "2026-07-20" },
    { id: "doc-2", name: "GST_Filing_Q2_Receipt.pdf", category: "Finance", size: "850 KB", uploadedBy: "FIN-AMIT", date: "2026-07-18" },
    { id: "doc-3", name: "Vendor_KYC_VaranasiWeavers.pdf", category: "Vendor KYC", size: "2.1 MB", uploadedBy: "ADM-ABHISHEK", date: "2026-07-22" }
  ]);
  const [integrationConfig, setIntegrationConfig] = useState<any>({
    razorpayKey: "rzp_test_Auraic2026",
    razorpayEnabled: true,
    delhiverySandbox: "https://track.delhivery.com/api/v1/sandbox",
    gstApiEnabled: true
  });
  const [notificationTemplates, setNotificationTemplates] = useState<any[]>([
    { id: "notif-1", type: "EMAIL", event: "Order Dispatched", body: "Hello {name}, your Cultural Clutch order #{orderId} is shipped!" },
    { id: "notif-2", type: "WHATSAPP", event: "Payment Successful", body: "Namaste {name}! Payout of ₹{amount} was received successfully." },
    { id: "notif-3", type: "SMS", event: "Low Stock Alert", body: "Alert: Product SKU {sku} is below 5 units. Please reorder." }
  ]);
  const [vendorProfile, setVendorProfile] = useState<any>({
    businessName: "Kashmiri Heritage Guild",
    ownerName: "Ghulam Ahmed",
    gstNumber: "01AAGCK2231A1Z0",
    panNumber: "ABOPA1245Z",
    businessType: "Artisan Cooperative",
    status: "Approved",
    address: "Lal Chowk, Srinagar, Jammu & Kashmir"
  });

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Form inputs
  const [showFormModal, setShowFormModal] = useState<string | null>(null);
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
      // 1. Core BI / Analytics data
      if (activeModule === "bi") {
        const res = await fetch("/api/admin/finance");
        if (res.ok) setFinanceData(await res.json());

        const prodRes = await fetch("/api/admin/products");
        if (prodRes.ok) setProducts(await prodRes.json());

        const orderRes = await fetch("/api/admin/orders");
        if (orderRes.ok) setOrders(await orderRes.json());
      }
      // 2. Sales / CRM data
      else if (activeModule === "sales") {
        const res = await fetch("/api/admin/leads");
        if (res.ok) setLeads(await res.json());

        const oRes = await fetch("/api/admin/orders");
        if (oRes.ok) setOrders(await oRes.json());
      }
      // 3. Purchase orders
      else if (activeModule === "purchase") {
        const res = await fetch("/api/admin/purchase");
        if (res.ok) setPurchaseOrders(await res.json());
      }
      // 4. Finance books
      else if (activeModule === "finance") {
        const res = await fetch("/api/admin/finance");
        if (res.ok) setFinanceData(await res.json());
      }
      // 5. HR structures
      else if (activeModule === "hr") {
        const res = await fetch("/api/admin/hr");
        const hrRaw = await res.json();
        setHrData(hrRaw);
        setSupportTickets(hrRaw.leaves ? [
          { id: "tick-1", subject: "Replacement request for Blue Pottery", user: { name: "Rahul Verma" }, priority: "HIGH", status: "OPEN", description: "Pottery received with minor surface cracks." },
          { id: "tick-2", subject: "GST bill mismatch on invoice #INV-002", user: { name: "Aarav Sharma" }, priority: "MEDIUM", status: "IN_PROGRESS", description: "The local state SGST was calculated instead of IGST." }
        ] : []);
      }
      // 6. Payroll registers
      else if (activeModule === "payroll") {
        const res = await fetch("/api/admin/payroll");
        if (res.ok) setPayroll(await res.json());
      }
      // 7. Marketing
      else if (activeModule === "marketing") {
        const res = await fetch("/api/admin/marketing");
        if (res.ok) setMarketing(await res.json());
      }
      // 8. Logistics
      else if (activeModule === "logistics") {
        const res = await fetch("/api/admin/logistics");
        if (res.ok) setLogistics(await res.json());
      }
      // 9. Database structure
      else if (activeModule === "database") {
        const res = await fetch("/api/admin/database");
        if (res.ok) setDbExplorer(await res.json());
      }
      // 10. Super Admin Central Room
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
      // 11. Vendor Management Portal
      else if (activeModule === "vendor") {
        const prodRes = await fetch("/api/admin/products");
        if (prodRes.ok) setProducts(await prodRes.json());

        const financeRes = await fetch("/api/admin/finance");
        if (financeRes.ok) setFinanceData(await financeRes.json());
      }
      // 12. Order Management System (OMS)
      else if (activeModule === "oms") {
        const res = await fetch("/api/admin/orders");
        if (res.ok) setOrders(await res.json());
      }
      // 13. Warehouse Management System (WMS)
      else if (activeModule === "wms") {
        const res = await fetch("/api/admin/logistics");
        if (res.ok) setLogistics(await res.json());
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
      const userDept = (session.user as any).department;
      const userRole = (session.user as any).role;
      
      // Enforce: regular employees can ONLY see their assigned department dashboard
      if (userRole !== "Owner" && userRole !== "Super Admin" && userRole !== "Admin") {
        if (userDept === "Sales") setActiveModule("sales");
        else if (userDept === "Finance") setActiveModule("finance");
        else if (userDept === "Human Resource" || userDept === "HR") setActiveModule("hr");
        else if (userDept === "Logistics") setActiveModule("logistics");
        else if (userDept === "Product Management" || userDept === "Products") setActiveModule("vendor"); // Vendor portal fits products too
        else if (userDept === "Customer Support") setActiveModule("hr");
        else if (userDept === "Marketing") setActiveModule("marketing");
        else if (userDept === "Purchase") setActiveModule("purchase");
        else if (userDept === "Inventory") setActiveModule("wms");
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
      if (res.ok) {
        showToast(`Employee state updated successfully.`);
        loadModuleData();
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
      if (res.ok) {
        showToast("Employee deleted from vault.");
        loadModuleData();
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
        showToast(`Forgot password request ${status}. Temporary password set.`);
        loadModuleData();
      }
    } catch {
      showToast("Error processing reset.");
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

  // DMS Upload Mock
  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: formInputs.docName || "new_document.pdf",
      category: formInputs.docCategory || "Contracts",
      size: "450 KB",
      uploadedBy: session?.user?.name || "Admin",
      date: new Date().toISOString().split("T")[0]
    };
    setDmsFiles([newDoc, ...dmsFiles]);
    showToast("Document saved inside secure DMS folder.");
    setShowFormModal(null);
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
          <div className="flex items-center gap-1.5 bg-black/30 p-1.5 rounded-xl border border-gray-800 text-xs">
            <button onClick={() => setTheme("saffron")} className={`px-2 py-1 rounded-lg ${theme === "saffron" ? "bg-[#C09355] text-black" : "text-gray-400"}`}>Saffron</button>
            <button onClick={() => setTheme("charcoal")} className={`px-2 py-1 rounded-lg ${theme === "charcoal" ? "bg-[#4A4A4A] text-white" : "text-gray-400"}`}>Charcoal</button>
            <button onClick={() => setTheme("emerald")} className={`px-2 py-1 rounded-lg ${theme === "emerald" ? "bg-[#2D5A27] text-white" : "text-gray-400"}`}>Emerald</button>
          </div>

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

          {/* Business Intelligence (Admins / Super Admins / CEO) */}
          {["Owner", "Super Admin", "Admin", "CEO", "Finance"].includes((session?.user as any).role) && (
            <button onClick={() => { setActiveModule("bi"); }} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer ${activeModule === "bi" ? "bg-[#C09355]/10 text-[#C09355] font-bold border border-[#C09355]/20" : "hover:bg-white/5 text-gray-400"}`}>
              <span className="flex items-center gap-2"><BarChart2 className="w-4 h-4" /> Business Intelligence</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          )}

          {/* Vendor Management Portal */}
          {["Owner", "Super Admin", "Admin", "Vendor"].includes((session?.user as any).role) && (
            <button onClick={() => { setActiveModule("vendor"); }} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer ${activeModule === "vendor" ? "bg-[#C09355]/10 text-[#C09355] font-bold border border-[#C09355]/20" : "hover:bg-white/5 text-gray-400"}`}>
              <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Vendor Management Portal</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          )}

          {/* Order Management System (OMS) */}
          {["Owner", "Super Admin", "Admin", "Order Manager"].includes((session?.user as any).role) && (
            <button onClick={() => { setActiveModule("oms"); }} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer ${activeModule === "oms" ? "bg-[#C09355]/10 text-[#C09355] font-bold border border-[#C09355]/20" : "hover:bg-white/5 text-gray-400"}`}>
              <span className="flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Order Management (OMS)</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          )}

          {/* Warehouse Management System (WMS) */}
          {["Owner", "Super Admin", "Admin", "Inventory Manager"].includes((session?.user as any).role) && (
            <button onClick={() => { setActiveModule("wms"); }} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer ${activeModule === "wms" ? "bg-[#C09355]/10 text-[#C09355] font-bold border border-[#C09355]/20" : "hover:bg-white/5 text-gray-400"}`}>
              <span className="flex items-center gap-2"><Package className="w-4 h-4" /> Warehouse System (WMS)</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          )}

          {/* Customer Support Tickets / Helpdesk */}
          {["Owner", "Super Admin", "Admin", "Customer Support"].includes((session?.user as any).role) && (
            <button onClick={() => { setActiveModule("support"); }} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer ${activeModule === "support" ? "bg-[#C09355]/10 text-[#C09355] font-bold border border-[#C09355]/20" : "hover:bg-white/5 text-gray-400"}`}>
              <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Support & Helpdesk</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          )}

          {/* Document Management System (DMS) */}
          {["Owner", "Super Admin", "Admin", "HR Manager", "Finance"].includes((session?.user as any).role) && (
            <button onClick={() => { setActiveModule("dms"); }} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer ${activeModule === "dms" ? "bg-[#C09355]/10 text-[#C09355] font-bold border border-[#C09355]/20" : "hover:bg-white/5 text-gray-400"}`}>
              <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Document Vault (DMS)</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          )}

          {/* Notifications Center */}
          {["Owner", "Super Admin", "Admin", "Marketing"].includes((session?.user as any).role) && (
            <button onClick={() => { setActiveModule("notifications"); }} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer ${activeModule === "notifications" ? "bg-[#C09355]/10 text-[#C09355] font-bold border border-[#C09355]/20" : "hover:bg-white/5 text-gray-400"}`}>
              <span className="flex items-center gap-2"><Bell className="w-4 h-4" /> Notification Center</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          )}

          {/* API and Integrations */}
          {["Owner", "Super Admin", "Admin"].includes((session?.user as any).role) && (
            <button onClick={() => { setActiveModule("integrations"); }} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer ${activeModule === "integrations" ? "bg-[#C09355]/10 text-[#C09355] font-bold border border-[#C09355]/20" : "hover:bg-white/5 text-gray-400"}`}>
              <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> API & Integrations</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          )}

          {/* Base departments links */}
          <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest px-3 my-2 pt-2 border-t border-gray-850">Departments</div>
          <button onClick={() => { setActiveModule("sales"); }} className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs cursor-pointer ${activeModule === "sales" ? "bg-[#C09355]/10 text-[#C09355]" : "hover:bg-white/5 text-gray-400"}`}>
            <span className="flex items-center gap-2"><DollarSign className="w-3.5 h-3.5" /> Sales Department</span>
          </button>
          <button onClick={() => { setActiveModule("purchase"); }} className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs cursor-pointer ${activeModule === "purchase" ? "bg-[#C09355]/10 text-[#C09355]" : "hover:bg-white/5 text-gray-400"}`}>
            <span className="flex items-center gap-2"><ClipboardList className="w-3.5 h-3.5" /> Purchase & POs</span>
          </button>
          <button onClick={() => { setActiveModule("finance"); }} className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs cursor-pointer ${activeModule === "finance" ? "bg-[#C09355]/10 text-[#C09355]" : "hover:bg-white/5 text-gray-400"}`}>
            <span className="flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> Finance & Ledger</span>
          </button>
          <button onClick={() => { setActiveModule("hr"); }} className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs cursor-pointer ${activeModule === "hr" ? "bg-[#C09355]/10 text-[#C09355]" : "hover:bg-white/5 text-gray-400"}`}>
            <span className="flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" /> HR Directory</span>
          </button>
          <button onClick={() => { setActiveModule("payroll"); }} className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs cursor-pointer ${activeModule === "payroll" ? "bg-[#C09355]/10 text-[#C09355]" : "hover:bg-white/5 text-gray-400"}`}>
            <span className="flex items-center gap-2"><FileCheck className="w-3.5 h-3.5" /> Payroll Console</span>
          </button>
          <button onClick={() => { setActiveModule("marketing"); }} className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs cursor-pointer ${activeModule === "marketing" ? "bg-[#C09355]/10 text-[#C09355]" : "hover:bg-white/5 text-gray-400"}`}>
            <span className="flex items-center gap-2"><Tag className="w-3.5 h-3.5" /> Marketing Promos</span>
          </button>
          <button onClick={() => { setActiveModule("logistics"); }} className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs cursor-pointer ${activeModule === "logistics" ? "bg-[#C09355]/10 text-[#C09355]" : "hover:bg-white/5 text-gray-400"}`}>
            <span className="flex items-center gap-2"><Truck className="w-3.5 h-3.5" /> Logistics Queue</span>
          </button>
          <button onClick={() => { setActiveModule("database"); }} className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs cursor-pointer ${activeModule === "database" ? "bg-[#C09355]/10 text-[#C09355]" : "hover:bg-white/5 text-gray-400"}`}>
            <span className="flex items-center gap-2"><Database className="w-3.5 h-3.5" /> Database Explorer</span>
          </button>
          <button onClick={() => { setActiveModule("admin"); }} className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs cursor-pointer ${activeModule === "admin" ? "bg-[#C09355]/10 text-[#C09355]" : "hover:bg-white/5 text-gray-400"}`}>
            <span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> Central Control Room</span>
          </button>
        </aside>

        {/* Dashboard Display Window */}
        <main className="lg:col-span-4 space-y-6">

          {/* BI Screens */}
          {activeModule === "bi" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">Business Intelligence Center</h2>
                  <p className="text-xs text-gray-400">Enterprise analytical predictions and geographical ODOP metrics from database.</p>
                </div>
                <button onClick={() => exportToCSV(orders, "OrdersExport")} className="px-3 py-1.5 bg-black/40 hover:bg-black/80 border border-gray-800 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer">
                  <Download className="w-3.5 h-3.5" /> Export Orders
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className={`p-5 rounded-2xl border ${t.card}`}>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Gross Sales Revenue</div>
                  <div className="text-xl font-bold font-serif mt-2">₹{financeData?.revenue?.toLocaleString("en-IN") || "3,25,000"}</div>
                </div>
                <div className={`p-5 rounded-2xl border ${t.card}`}>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Real Net Profit</div>
                  <div className="text-xl font-bold font-serif mt-2">₹{financeData?.netProfit?.toLocaleString("en-IN") || "1,85,000"}</div>
                </div>
                <div className={`p-5 rounded-2xl border ${t.card}`}>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Inventory Valuation</div>
                  <div className="text-xl font-bold font-serif mt-2">₹{financeData?.inventoryAssetValue?.toLocaleString("en-IN") || "4,50,000"}</div>
                </div>
                <div className={`p-5 rounded-2xl border ${t.card}`}>
                  <div className="text-[10px] uppercase font-bold text-gray-400">GST Collected</div>
                  <div className="text-xl font-bold font-serif mt-2">₹{financeData?.taxCollected?.toLocaleString("en-IN") || "58,500"}</div>
                </div>
              </div>

              <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                <div className="text-xs font-bold uppercase tracking-wider">Revenue Timeline (Live Database Orders)</div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={orders.map(o => ({ date: new Date(o.createdAt).toLocaleDateString(), value: o.netAmount }))}>
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

          {/* VENDOR MANAGEMENT PORTAL VIEW */}
          {activeModule === "vendor" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">Vendor Management Portal</h2>
                  <p className="text-xs text-gray-400">Dedicated vendor profile dashboards, product catalogs, and payout histories.</p>
                </div>
                <span className="px-3 py-1 bg-green-950 border border-green-800 text-green-400 rounded-xl text-xs font-extrabold uppercase">
                  {vendorProfile.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className={`p-6 rounded-3xl border ${t.card} md:col-span-1 space-y-3`}>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">Business Credentials</div>
                  <div className="space-y-2 text-xs">
                    <div>Business: <span className="font-bold text-white">{vendorProfile.businessName}</span></div>
                    <div>Owner: <span className="font-bold text-white">{vendorProfile.ownerName}</span></div>
                    <div>GSTIN: <span className="font-mono text-white">{vendorProfile.gstNumber}</span></div>
                    <div>PAN: <span className="font-mono text-white">{vendorProfile.panNumber}</span></div>
                    <div>Type: <span className="font-bold text-white">{vendorProfile.businessType}</span></div>
                  </div>
                </div>

                {/* Vendor Products Grid */}
                <div className={`p-6 rounded-3xl border ${t.card} md:col-span-2 space-y-4`}>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">Product Approvals Queue</div>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {products.slice(0, 5).map((p) => (
                      <div key={p.id} className="p-3 bg-black/20 border border-gray-800 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-white">{p.name}</span>
                          <span className="block text-[9px] text-gray-500 font-mono">SKU: {p.sku}</span>
                        </div>
                        <span className="font-semibold text-[#C09355]">₹{p.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ORDER MANAGEMENT SYSTEM (OMS) VIEW */}
          {activeModule === "oms" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">Order Management System (OMS)</h2>
                  <p className="text-xs text-gray-400">Return requests, replacements queue, and cancellation workflows.</p>
                </div>
              </div>

              {/* OMS Orders Queue */}
              <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">Central E-Commerce Order Lifecycles</div>
                <div className="space-y-3">
                  {orders.map((o) => (
                    <div key={o.id} className="p-4 bg-black/20 border border-gray-800 rounded-2xl flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-white">Order ID: {o.id.substring(0,8).toUpperCase()}</div>
                        <div className="text-[10px] text-gray-400 mt-1">Invoice: {o.invoiceNumber || "N/A"} • Amount: ₹{o.netAmount}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${o.status === "DELIVERED" ? "bg-green-950 text-green-400" : o.status === "PAID" ? "bg-blue-950 text-blue-400" : "bg-yellow-950 text-yellow-450"}`}>
                          {o.status}
                        </span>
                        
                        {/* Exchange / Cancel actions */}
                        {o.status === "PAID" && (
                          <button 
                            onClick={async () => {
                              await fetch("/api/admin/orders", {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id: o.id, status: "CANCELLED" })
                              });
                              showToast("Order cancelled successfully.");
                              loadModuleData();
                            }}
                            className="px-2.5 py-1 bg-red-950/40 border border-red-900 text-red-400 hover:text-white rounded text-[10px] font-bold cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* WAREHOUSE MANAGEMENT SYSTEM (WMS) VIEW */}
          {activeModule === "wms" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">Warehouse & Stock Bin Locations</h2>
                  <p className="text-xs text-gray-400">Configure warehouse slots, track inventory movements, and print barcodes.</p>
                </div>
              </div>

              {/* Warehouse bays layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">Storage Bin Location Layout</div>
                  <div className="grid grid-cols-2 gap-3">
                    {wmsBins.map((bin) => (
                      <div key={bin.id} className="p-3 bg-black/20 border border-gray-800 rounded-xl space-y-1 text-xs">
                        <div className="font-bold text-[#C09355]">{bin.code}</div>
                        <div className="text-[10px] text-gray-400 truncate">{bin.item}</div>
                        <div className="w-full bg-gray-900 rounded-full h-1.5 mt-2">
                          <div className="bg-[#C09355] h-1.5 rounded-full" style={{ width: `${(bin.stock / bin.max) * 100}%` }} />
                        </div>
                        <div className="text-[9px] text-gray-500 text-right mt-1">{bin.stock} / {bin.max} units</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stock movement tracking */}
                <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">Warehouse Stock Movements Logger</div>
                  <div className="space-y-2 text-[11px] font-mono">
                    <div className="p-2 border-l-2 border-green-500 bg-white/5 rounded">
                      [14:02:11] RECEIVED: 10 Kashmiri Pashmina Shawls placed in Bin A2.
                    </div>
                    <div className="p-2 border-l-2 border-yellow-500 bg-white/5 rounded">
                      [11:45:00] TRANSFER: 5 Banarasi Silk units moved from Bin A1 to Packing Bay.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CUSTOMER SUPPORT / HELPDESK VIEW */}
          {activeModule === "support" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">Customer Support & Escalations</h2>
                  <p className="text-xs text-gray-400">Resolve customer queries, process refund requests, and track helpdesk tickets.</p>
                </div>
              </div>

              {/* Tickets list */}
              <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">Helpdesk Support Queue</div>
                <div className="space-y-3">
                  {supportTickets.map((tick) => (
                    <div key={tick.id} className="p-4 bg-black/20 border border-gray-800 rounded-2xl space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-white">{tick.subject}</span>
                          <span className="block text-[9px] text-gray-500 mt-0.5">Submitted by: {tick.user.name}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${tick.priority === "HIGH" ? "bg-red-950 text-red-400" : "bg-yellow-950 text-yellow-450"}`}>
                          {tick.priority} Priority
                        </span>
                      </div>
                      <p className="text-gray-400 text-[10px]">"{tick.description}"</p>
                      
                      <div className="flex gap-2 mt-2 pt-2 border-t border-gray-850">
                        <button 
                          onClick={() => {
                            setSupportTickets(supportTickets.map(t => t.id === tick.id ? { ...t, status: "RESOLVED" } : t));
                            showToast("Ticket resolved successfully.");
                          }}
                          className="px-2 py-1 bg-green-950 hover:bg-green-900 border border-green-800 text-green-400 rounded text-[9px] font-bold cursor-pointer"
                        >
                          Mark Resolved
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DOCUMENT MANAGEMENT SYSTEM (DMS) VIEW */}
          {activeModule === "dms" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">Document Vault (DMS)</h2>
                  <p className="text-xs text-gray-400">Contracts, employee records, vendor KYC files, and invoice receipts.</p>
                </div>
                <button 
                  onClick={() => {
                    setFormInputs({});
                    setShowFormModal("DOCUMENT");
                  }}
                  className="px-4 py-2 bg-[#C09355] text-black font-bold rounded-2xl text-xs flex items-center gap-1.5 hover:bg-[#C09355]/95 transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4" /> Upload Document
                </button>
              </div>

              {/* Files Table */}
              <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">Categorized Document Registers</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-400 font-extrabold uppercase">
                        <th className="py-2.5">Document Name</th>
                        <th>Category</th>
                        <th>File Size</th>
                        <th>Uploaded By</th>
                        <th>Upload Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                      {dmsFiles.map((doc) => (
                        <tr key={doc.id} className="hover:bg-white/5 transition-all">
                          <td className="py-3 font-semibold text-white flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#C09355]" /> {doc.name}
                          </td>
                          <td>
                            <span className="bg-gray-850 px-2 py-0.5 rounded text-gray-300 font-medium">
                              {doc.category}
                            </span>
                          </td>
                          <td className="font-mono text-gray-400">{doc.size}</td>
                          <td>{doc.uploadedBy}</td>
                          <td>{doc.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATION CENTER VIEW */}
          {activeModule === "notifications" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">Notification Center</h2>
                  <p className="text-xs text-gray-400">Configure messaging templates for Email, WhatsApp, and SMS alerts.</p>
                </div>
              </div>

              {/* Templates */}
              <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">Active Message Event Templates</div>
                <div className="space-y-3">
                  {notificationTemplates.map((temp) => (
                    <div key={temp.id} className="p-4 bg-black/20 border border-gray-800 rounded-2xl space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#FAF5EE]">{temp.event} Alert</span>
                        <span className="px-2 py-0.5 bg-[#C09355]/15 border border-[#C09355]/20 text-[#C09355] rounded text-[9px] font-extrabold uppercase">{temp.type}</span>
                      </div>
                      <p className="text-gray-400 font-mono text-[10px] bg-black/40 p-2.5 rounded-lg border border-gray-850">"{temp.body}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* API INTEGRATION CENTER VIEW */}
          {activeModule === "integrations" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">API & Third-Party Integrations</h2>
                  <p className="text-xs text-gray-400">Integrate with shipping APIs, payment checkouts, and Government GST networks.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Integration Details */}
                <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">Payment Gateway Setup</div>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block mb-1 text-gray-400">Razorpay API Key</label>
                      <input type="text" readOnly value={integrationConfig.razorpayKey} className="w-full p-2.5 bg-black/40 border border-gray-850 rounded-xl font-mono text-white" />
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-850 pt-3">
                      <span>Enable COD Payments</span>
                      <span className="px-2.5 py-0.5 bg-green-950 text-green-400 border border-green-800 rounded-lg text-[10px] font-bold uppercase">Active</span>
                    </div>
                  </div>
                </div>

                {/* Shipping API settings */}
                <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">Courier API Endpoints</div>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block mb-1 text-gray-400">Delhivery API Gateway</label>
                      <input type="text" readOnly value={integrationConfig.delhiverySandbox} className="w-full p-2.5 bg-black/40 border border-gray-850 rounded-xl font-mono text-white" />
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-850 pt-3">
                      <span>Government GST IN Portal Sync</span>
                      <span className="px-2.5 py-0.5 bg-green-950 text-green-400 border border-green-800 rounded-lg text-[10px] font-bold uppercase">Connected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Department pages backup screens */}
          {activeModule === "sales" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">Sales & Leads Manager</h2>
                  <p className="text-xs text-gray-400">Leads pipeline, sales targets, and commissions registers.</p>
                </div>
                <button onClick={() => { setFormInputs({}); setShowFormModal("LEAD"); }} className="px-4 py-2 bg-[#C09355] text-black font-bold rounded-2xl text-xs flex items-center gap-1.5 hover:bg-[#C09355]/95 transition-all cursor-pointer">
                  <PlusCircle className="w-4 h-4" /> Add Lead
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {["NEW", "CONTACTED", "QUALIFIED", "WON"].map((stage) => (
                  <div key={stage} className="bg-black/30 border border-gray-800/80 p-4 rounded-2xl space-y-3">
                    <div className="text-[10px] font-bold text-[#C09355] tracking-wide uppercase">{stage} Stage</div>
                    <div className="space-y-2">
                      {leads.filter(l => l.status === stage).map((l) => (
                        <div key={l.id} className="p-3 bg-white/5 border border-gray-800 rounded-xl text-xs">
                          <div className="font-bold text-white">{l.name}</div>
                          <div className="text-gray-400 text-[10px] mt-0.5">{l.phone}</div>
                          <div className="font-mono text-amber-500 mt-1">₹{l.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeModule === "purchase" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">Purchase Orders Queue</h2>
                  <p className="text-xs text-gray-400">Procure inventory from artisan cooperatives.</p>
                </div>
                <button onClick={() => { setFormInputs({}); setShowFormModal("PO"); }} className="px-4 py-2 bg-[#C09355] text-black font-bold rounded-2xl text-xs hover:bg-[#C09355]/95 transition-all cursor-pointer">Create PO</button>
              </div>
              <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 uppercase font-bold">
                      <th className="py-2.5">Vendor</th>
                      <th>Procured Item</th>
                      <th>Total Value</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseOrders.map((po) => (
                      <tr key={po.id} className="border-b border-gray-800/50 hover:bg-white/5">
                        <td className="py-3 font-semibold text-white">{po.vendorName}</td>
                        <td>{po.items[0]?.productName || "Stock Bundle"}</td>
                        <td className="font-mono">₹{po.totalAmount}</td>
                        <td>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${po.status === "DELIVERED" ? "bg-green-950 text-green-400" : "bg-yellow-950 text-yellow-450"}`}>
                            {po.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeModule === "finance" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">Finance & Ledger Accounts</h2>
                  <p className="text-xs text-gray-400">Cash reserve tracking and profit/loss statements.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">General Ledger Statements</div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 text-[11px]">
                    {(financeData?.ledger || []).map((log: any) => (
                      <div key={log.id} className="p-3 bg-black/20 border border-gray-800 rounded-xl flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-white">{log.description}</div>
                          <div className="text-[9px] text-gray-500">{new Date(log.date).toLocaleString()}</div>
                        </div>
                        <span className={`font-mono font-bold ${log.type === "INFLOW" ? "text-green-400" : "text-red-400"}`}>
                          ₹{log.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeModule === "hr" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">HR Management & Directories</h2>
                  <p className="text-xs text-gray-400">Onboarding, leaves, and corporate designations registries.</p>
                </div>
                <button onClick={() => { setFormInputs({}); setShowFormModal("EMPLOYEE"); }} className="px-4 py-2 bg-[#C09355] text-black font-bold rounded-2xl text-xs hover:bg-[#C09355]/95 transition-all cursor-pointer">Onboard Employee</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(hrData?.employees || []).map((emp: any) => (
                  <div key={emp.id} className="p-4 bg-black/20 border border-gray-800 rounded-2xl flex justify-between items-start text-xs">
                    <div>
                      <div className="font-serif font-bold text-sm text-[#FAF5EE]">{emp.name}</div>
                      <div className="text-gray-400 uppercase text-[9px] mt-0.5">{emp.employeeId} • {emp.designation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeModule === "payroll" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">Payroll & Salary slips</h2>
                  <p className="text-xs text-gray-400">Manage salary base scale, PF, ESIC deductions, tax filings, and payslip runs.</p>
                </div>
              </div>
              <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 font-extrabold uppercase">
                      <th className="py-2.5">Employee</th>
                      <th>Base Salary</th>
                      <th>Net Pay</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payroll.map((p) => (
                      <tr key={p.id} className="border-b border-gray-800/50 hover:bg-white/5">
                        <td className="py-3 font-semibold text-white">{p.user.name} ({p.user.employeeId})</td>
                        <td className="font-mono">₹{p.salary}</td>
                        <td className="font-bold font-mono text-[#C09355]">₹{p.netPay}</td>
                        <td>{p.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeModule === "marketing" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">Marketing Campaign Manager</h2>
                  <p className="text-xs text-gray-400">Create promotional codes, referral programs, and email triggers.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">Coupons Registry</div>
                  {marketing?.coupons?.map((cop: any) => (
                    <div key={cop.id} className="p-3 bg-black/20 border border-gray-800 rounded-xl flex justify-between items-center text-xs">
                      <span className="font-mono text-[#C09355] font-bold">{cop.code}</span>
                      <span className="text-gray-400">{cop.value}% discount</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeModule === "logistics" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">Logistics dispatch queue</h2>
                  <p className="text-xs text-gray-400">Coordinate shipments queue and tracking updates.</p>
                </div>
              </div>
              <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                {logistics.map((ship) => (
                  <div key={ship.id} className="p-4 bg-black/20 border border-gray-800 rounded-xl text-xs space-y-2">
                    <div className="flex justify-between font-bold text-white">
                      <span>Order ID: {ship.orderId.substring(0,8).toUpperCase()}</span>
                      <span>{ship.status}</span>
                    </div>
                    <div className="text-gray-400">Carrier: {ship.carrier || "Unassigned"} | Track: {ship.trackingNumber || "N/A"}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeModule === "database" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">Database Schema Explorer</h2>
                  <p className="text-xs text-gray-400">Metadata indexes, table counts, and backups snapshots.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleBackupDatabase} className="px-3 py-1.5 bg-[#C09355] text-black font-bold rounded-xl text-xs cursor-pointer">Backup Snap</button>
                  <button onClick={handleRestoreDatabase} className="px-3 py-1.5 bg-black/40 text-white rounded-xl border border-gray-800 text-xs cursor-pointer">Restore Snap</button>
                </div>
              </div>
              <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                {Object.entries(dbExplorer.stats || {}).map(([tbl, count]: any) => (
                  <div key={tbl} className="flex justify-between p-2 bg-white/5 border border-gray-800 rounded text-xs">
                    <span>{tbl}</span>
                    <span className="font-mono text-[#C09355] font-bold">{count} rows</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeModule === "admin" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-gradient-to-r from-amber-950/20 to-black/30 p-6 rounded-3xl border border-gray-800">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#C09355]">Central Security Control Room</h2>
                  <p className="text-xs text-gray-400">Super Admin authorization matrices, failed login attempts, password vault request logs.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">Security Audit Activity Logs</div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 text-[10px]">
                    {auditLogs.map((log: any) => (
                      <div key={log.id} className="p-3 bg-black/20 border border-gray-800 rounded-xl space-y-1">
                        <div className="flex justify-between items-center font-bold text-white">
                          <span>{log.actorName}</span>
                          <span className="text-[#C09355] uppercase">{log.action}</span>
                        </div>
                        <p className="text-gray-400">{log.details}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-6 rounded-3xl border ${t.card} space-y-4`}>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#C09355]">Forgot Password Reset requests approvals</div>
                  {resetRequests.map((req: any) => (
                    <div key={req.id} className="p-3 bg-black/20 border border-gray-800 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-white">{req.user?.name} ({req.user?.employeeId})</span>
                        <span className="block text-[9px] text-gray-500">Status: {req.status}</span>
                      </div>
                      {req.status === "PENDING" && (
                        <div className="flex gap-1">
                          <button onClick={() => handleForgotPasswordApproval(req.id, "APPROVED")} className="px-2 py-1 bg-green-950 text-green-400 rounded text-[9px] font-bold cursor-pointer">Approve</button>
                          <button onClick={() => handleForgotPasswordApproval(req.id, "REJECTED")} className="px-2 py-1 bg-red-950 text-red-400 rounded text-[9px] font-bold cursor-pointer">Reject</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL CONSOLE WINDOW FOR FORM CRUD OPTIONS */}
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
                {showFormModal === "DOCUMENT" && "Upload Document"}
              </h3>
              <button 
                onClick={() => setShowFormModal(null)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-all cursor-pointer text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form screens */}
            {showFormModal === "LEAD" && (
              <form onSubmit={handleCreateLead} className="space-y-4 text-xs font-semibold text-gray-600">
                <div>
                  <label className="block mb-1">Lead Name</label>
                  <input type="text" required onChange={(e) => setFormInputs({ ...formInputs, name: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Email</label>
                    <input type="email" required onChange={(e) => setFormInputs({ ...formInputs, email: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block mb-1">Phone</label>
                    <input type="text" required onChange={(e) => setFormInputs({ ...formInputs, phone: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block mb-1">Value (₹)</label>
                  <input type="number" required onChange={(e) => setFormInputs({ ...formInputs, value: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
                </div>
                <button type="submit" className="w-full py-3 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white font-bold rounded-xl transition-all cursor-pointer">Register Lead</button>
              </form>
            )}

            {showFormModal === "PO" && (
              <form onSubmit={handleCreatePO} className="space-y-4 text-xs font-semibold text-gray-600">
                <div>
                  <label className="block mb-1">Vendor Name</label>
                  <input type="text" required onChange={(e) => setFormInputs({ ...formInputs, vendorName: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Vendor ID</label>
                    <input type="text" required onChange={(e) => setFormInputs({ ...formInputs, vendorId: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block mb-1">Expected Date</label>
                    <input type="date" required onChange={(e) => setFormInputs({ ...formInputs, expectedDate: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block mb-1">Product</label>
                    <input type="text" required onChange={(e) => setFormInputs({ ...formInputs, productName: e.target.value })} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="block mb-1">Qty</label>
                    <input type="number" required onChange={(e) => setFormInputs({ ...formInputs, quantity: e.target.value })} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Unit Price (₹)</label>
                    <input type="number" required onChange={(e) => setFormInputs({ ...formInputs, unitPrice: e.target.value })} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="block mb-1">Total (₹)</label>
                    <input type="number" required onChange={(e) => setFormInputs({ ...formInputs, totalAmount: e.target.value })} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg" />
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white font-bold rounded-xl transition-all cursor-pointer">Dispatch PO</button>
              </form>
            )}

            {showFormModal === "EMPLOYEE" && (
              <form onSubmit={handleOnboardEmployee} className="space-y-4 text-xs font-semibold text-gray-600">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Full Name</label>
                    <input type="text" required onChange={(e) => setFormInputs({ ...formInputs, name: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block mb-1">Email</label>
                    <input type="email" required onChange={(e) => setFormInputs({ ...formInputs, email: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Dept</label>
                    <input type="text" required onChange={(e) => setFormInputs({ ...formInputs, department: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                  <div>
                    <label className="block mb-1">Designation</label>
                    <input type="text" required onChange={(e) => setFormInputs({ ...formInputs, designation: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">System Role</label>
                    <select onChange={(e) => setFormInputs({ ...formInputs, roleName: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                      <option value="Admin">Admin</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Customer Support">Customer Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Password</label>
                    <input type="password" required onChange={(e) => setFormInputs({ ...formInputs, password: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white font-bold rounded-xl transition-all cursor-pointer">Onboard Employee</button>
              </form>
            )}

            {showFormModal === "CAMPAIGN" && (
              <form onSubmit={(e) => handleCreateMarketing(e, "CAMPAIGN")} className="space-y-4 text-xs font-semibold text-gray-600">
                <div>
                  <label className="block mb-1">Campaign Name</label>
                  <input type="text" required onChange={(e) => setFormInputs({ ...formInputs, name: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Type</label>
                    <select onChange={(e) => setFormInputs({ ...formInputs, type: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                      <option value="SOCIAL">SOCIAL</option>
                      <option value="EMAIL">EMAIL</option>
                      <option value="SMS">SMS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Budget (₹)</label>
                    <input type="number" required onChange={(e) => setFormInputs({ ...formInputs, budget: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
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
                <button type="submit" className="w-full py-3 bg-[#B56D3E] text-white font-bold rounded-xl cursor-pointer">Create Campaign</button>
              </form>
            )}

            {showFormModal === "COUPON" && (
              <form onSubmit={(e) => handleCreateMarketing(e, "COUPON")} className="space-y-4 text-xs font-semibold text-gray-600">
                <div>
                  <label className="block mb-1">Coupon Code</label>
                  <input type="text" required onChange={(e) => setFormInputs({ ...formInputs, code: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Type</label>
                    <select onChange={(e) => setFormInputs({ ...formInputs, couponType: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                      <option value="PERCENTAGE">PERCENTAGE</option>
                      <option value="FLAT">FLAT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Value</label>
                    <input type="number" required onChange={(e) => setFormInputs({ ...formInputs, value: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-[#B56D3E] text-white font-bold rounded-xl cursor-pointer">Create Coupon</button>
              </form>
            )}

            {showFormModal === "DOCUMENT" && (
              <form onSubmit={handleUploadDocument} className="space-y-4 text-xs font-semibold text-gray-600">
                <div>
                  <label className="block mb-1">Document File Name</label>
                  <input type="text" required onChange={(e) => setFormInputs({ ...formInputs, docName: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" placeholder="contracts_agreement.pdf" />
                </div>
                <div>
                  <label className="block mb-1">Category</label>
                  <select onChange={(e) => setFormInputs({ ...formInputs, docCategory: e.target.value })} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                    <option value="Contracts">Contracts</option>
                    <option value="Finance">Finance</option>
                    <option value="Vendor KYC">Vendor KYC</option>
                    <option value="Employee Docs">Employee Docs</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-3 bg-[#B56D3E] text-white font-bold rounded-xl cursor-pointer">Upload to Vault</button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
