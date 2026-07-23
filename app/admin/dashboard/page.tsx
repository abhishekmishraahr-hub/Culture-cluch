"use client";

import React, { useState, useEffect } from "react";
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Download, 
  Upload, 
  Check, 
  ShieldAlert, 
  RefreshCw, 
  FileText, 
  ShieldCheck, 
  Activity, 
  UserPlus, 
  PlusCircle, 
  Lock,
  Calendar, 
  ClipboardList, 
  Package, 
  Layers, 
  Truck, 
  BarChart2, 
  Database, 
  Moon, 
  Sun, 
  Settings, 
  Bell, 
  X, 
  Edit, 
  Trash2, 
  ArrowRight, 
  UserCheck, 
  Plus, 
  Globe, 
  Key, 
  Sparkles, 
  Filter,
  MapPin,
  Clock,
  Briefcase,
  FileCheck,
  Tag
} from "lucide-react";

// ==================== SCHEMAS & DATA STRUCTURES ====================

const ERP_ROLES = [
  "Super Admin", "Admin", "CEO", "Director", "Sales Manager", "Sales Executive",
  "Finance Manager", "Accountant", "Purchase Manager", "Purchase Executive",
  "Warehouse Manager", "Store Keeper", "HR Manager", "HR Executive",
  "Marketing Manager", "Customer Support", "Logistics Manager",
  "Delivery Partner", "Vendor", "Artisan", "Customer", "Auditor"
];

const ERP_MODULES = [
  {
    id: "bi",
    name: "Business Intelligence",
    icon: BarChart2,
    subFeatures: ["Daily Sales", "Monthly Sales", "Revenue Reports", "Profit & Loss", "Orders Analytics", "Inventory Levels", "Customer Growth", "Vendor Performance", "Employee Performance", "Top Products", "Top District", "Top State", "ODOP Analytics"]
  },
  {
    id: "sales",
    name: "Sales Department",
    icon: DollarSign,
    subFeatures: ["Dashboard", "Leads", "Enquiries", "Quotations", "Orders", "Invoice", "POS Interface", "Returns", "Discounts", "Offers", "Coupons", "Sales Analytics", "Customer History", "Sales Reports", "Targets", "Commission Tracking"]
  },
  {
    id: "purchase",
    name: "Purchase Department",
    icon: ClipboardList,
    subFeatures: ["Vendor Master", "RFQ (Request for Quote)", "Purchase Request", "Purchase Order", "Vendor Comparison", "Goods Receipt Note", "Purchase Invoice", "Vendor Payment", "Vendor Rating", "Purchase Return", "Purchase Reports"]
  },
  {
    id: "finance",
    name: "Finance Department",
    icon: FileText,
    subFeatures: ["Chart of Accounts", "Journal Entries", "Cash Book", "Bank Book", "Ledger Detail", "Trial Balance", "Balance Sheet", "Profit & Loss Account", "GST Tracker", "TDS Deductions", "Accounts Receivable", "Accounts Payable", "Payment Voucher", "Receipt Voucher", "Expense Management", "Budget Control", "Financial Reports"]
  },
  {
    id: "inventory",
    name: "Inventory & Storage",
    icon: Package,
    subFeatures: ["Warehouse Config", "Stock Tracking", "Stock Transfer", "Batch Management", "Barcode Scanner", "QR Code Generation", "Damaged Stock Logs", "Inventory Audit", "Inventory Reports"]
  },
  {
    id: "product",
    name: "Product Management",
    icon: Layers,
    subFeatures: ["Product Master", "Brand Registry", "Category Config", "Attributes Settings", "Variants Builder", "Images Manager", "Videos Linker", "SEO Config", "Product Approval Flow", "Recommendation Config"]
  },
  {
    id: "customer",
    name: "Customer CRM",
    icon: Users,
    subFeatures: ["Customer Master", "Address Registry", "Wishlist Registry", "Orders History", "Loyalty Wallet", "Wallet Transfers", "Refund Processing", "Reviews & Ratings"]
  },
  {
    id: "hr",
    name: "Human Resources",
    icon: Briefcase,
    subFeatures: ["Employee Registry", "Department Config", "Designation Registry", "Attendance Logs", "Leave Approvals", "Holiday List", "Performance Score", "Training Programs"]
  },
  {
    id: "payroll",
    name: "Payroll Console",
    icon: FileCheck,
    subFeatures: ["Salary Structure", "Payslips Dispatcher", "PF Tracking", "ESI Scheme", "Bonus Dispatcher", "Tax Declaration", "Payroll Reports"]
  },
  {
    id: "marketing",
    name: "Marketing & Promos",
    icon: Tag,
    subFeatures: ["Coupons Master", "Campaign Manager", "Email Marketing", "WhatsApp Promos", "SMS Broadcaster", "SEO Keywords", "Push Notifications"]
  },
  {
    id: "logistics",
    name: "Logistics & Shipping",
    icon: Truck,
    subFeatures: ["Shipments Queue", "Courier Partners", "Tracking Hub", "Delivery Logs", "POD (Proof of Delivery)", "Shipping Reports", "Workflow Statuses", "Return Reasons"]
  },
  {
    id: "admin",
    name: "Admin Control",
    icon: Settings,
    subFeatures: ["Company Settings", "User Roles Manager", "Permissions Matrix", "Theme Preferences", "System Backup", "System Restore", "API Keys Manager", "Security Audit Logs"]
  },
  {
    id: "settings",
    name: "Website Settings",
    icon: Settings,
    subFeatures: ["System Config", "Activity Log", "Permission Matrix"]
  },
  {
    id: "database",
    name: "Database Schema Explorer",
    icon: Database,
    subFeatures: ["Database Tables", "Primary Keys Mapping", "Foreign Keys Mapping", "Relationship Visualizer", "Optimized Indexes"]
  }
];

const DEPARTMENTS_PURPOSES = [
  { name: "Sales", purpose: "Customer orders, quotations, invoices, returns" },
  { name: "Purchase", purpose: "Vendor management, purchase orders, GRN, bills" },
  { name: "Finance & Accounts", purpose: "Accounting, GST, payments, receipts, ledger" },
  { name: "Inventory", purpose: "Warehouse and stock management" },
  { name: "Product Management", purpose: "Product creation and catalog" },
  { name: "Category Management", purpose: "Category/Subcategory" },
  { name: "Vendor Management", purpose: "Artisan & Supplier Management" },
  { name: "Customer Management (CRM)", purpose: "Customer database and support" },
  { name: "Human Resource (HR)", purpose: "Employee management" },
  { name: "Payroll", purpose: "Salary and attendance" },
  { name: "Marketing", purpose: "Campaigns, Coupons, Promotions" },
  { name: "Customer Support", purpose: "Tickets & complaints" },
  { name: "Logistics", purpose: "Shipping & delivery" },
  { name: "Order Management", purpose: "Order lifecycle" },
  { name: "Returns & Refund", purpose: "Return processing" },
  { name: "Manufacturing / Artisan Management", purpose: "Artisan production tracking" },
  { name: "Quality Control", purpose: "Product quality inspection" },
  { name: "Document Management", purpose: "Store contracts and files" },
  { name: "Compliance & Legal", purpose: "GST, Tax, Legal Documents" },
  { name: "Business Intelligence (BI)", purpose: "Reports and analytics" },
  { name: "Administration", purpose: "System settings" },
  { name: "User & Role Management", purpose: "Permissions" },
  { name: "Audit & Activity Logs", purpose: "User activity" },
  { name: "Notification Center", purpose: "Email, SMS, WhatsApp" },
  { name: "CMS", purpose: "Website content management" },
  { name: "Reviews & Ratings", purpose: "Product reviews" },
  { name: "Wishlist & Cart", purpose: "Customer wishlist" },
  { name: "Gift Cards & Loyalty", purpose: "Reward system" },
  { name: "Affiliate Management", focus: "Referral system", purpose: "Referral system" },
  { name: "Franchise/Partner Management", purpose: "Business partners" },
  { name: "Multi Warehouse", purpose: "Multiple warehouse support" },
  { name: "Multi Currency", purpose: "International selling" },
  { name: "Multi Language", purpose: "Global users" },
  { name: "Security Center", purpose: "Authentication & permissions" }
];

const DATABASE_SCHEMAS = [
  { table: "users", pk: "id (UUID)", fk: "None", relations: "1-to-Many with user_roles", indexes: "idx_users_email (Unique)" },
  { table: "user_roles", pk: "id (UUID)", fk: "user_id (users.id)", relations: "Many-to-1 with users", indexes: "idx_roles_user" },
  { table: "products", pk: "id (UUID)", fk: "category_id (categories.id)", relations: "1-to-Many with product_variants", indexes: "idx_prod_sku, idx_prod_odop" },
  { table: "product_variants", pk: "id (UUID)", fk: "product_id (products.id)", relations: "Many-to-1 with products", indexes: "idx_variant_sku" },
  { table: "leads", pk: "id (UUID)", fk: "assigned_to (employees.id)", relations: "Many-to-1 with employees", indexes: "idx_leads_status" },
  { table: "quotations", pk: "id (UUID)", fk: "customer_id (customers.id), created_by (users.id)", relations: "1-to-Many with quotation_items", indexes: "idx_quote_customer" },
  { table: "sales_orders", pk: "id (UUID)", fk: "quote_id (quotations.id), customer_id (customers.id)", relations: "1-to-Many with order_items, 1-to-1 with invoices", indexes: "idx_orders_status, idx_orders_date" },
  { table: "invoices", pk: "id (UUID)", fk: "order_id (sales_orders.id)", relations: "1-to-1 with sales_orders, 1-to-Many with accounts_ledger", indexes: "idx_invoice_num" },
  { table: "vendors", pk: "id (UUID)", fk: "linked_user_id (users.id)", relations: "1-to-Many with purchase_orders", indexes: "idx_vendor_code" },
  { table: "purchase_orders", pk: "id (UUID)", fk: "vendor_id (vendors.id), approver_id (users.id)", relations: "1-to-Many with grns", indexes: "idx_po_vendor" },
  { table: "grns", pk: "id (UUID)", fk: "po_id (purchase_orders.id)", relations: "Many-to-1 with purchase_orders", indexes: "idx_grn_po" },
  { table: "warehouses", pk: "id (UUID)", fk: "None", relations: "1-to-Many with stock_items", indexes: "idx_warehouse_code" },
  { table: "stock_items", pk: "id (UUID)", fk: "product_id (products.id), warehouse_id (warehouses.id)", relations: "Many-to-1 with products & warehouses", indexes: "idx_stock_lookup" },
  { table: "employees", pk: "id (UUID)", fk: "user_id (users.id), manager_id (employees.id)", relations: "Self-referencing manager, 1-to-Many with payroll", indexes: "idx_emp_dept" }
];

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export function DashboardContent() {
  const searchParams = useSearchParams();
  const queryModule = searchParams.get("module") || "bi";
  
  // Helper: Get initial sub-feature
  const getInitialSubFeature = (mod: string) => {
    if (mod === "inventory") return "Stock Control";
    if (mod === "sales") return "Billing & Sales";
    if (mod === "settings") return "General Settings";
    if (mod === "vendor") return "Approvals Queue";
    if (mod === "customer") return "Customer Registry";
    return "ODOP Analytics";
  };

  // ==================== STATE MANAGEMENT ====================
  const [activeModule, setActiveModule] = useState(queryModule);
  const [activeSubFeature, setActiveSubFeature] = useState(() => getInitialSubFeature(queryModule));
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dashboardTheme, setDashboardTheme] = useState("saffron");

  // Load dynamic data on mount
  useEffect(() => {
    // 1. Fetch site configurations from public/data/settings.json
    fetch("/api/admin/settings")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load settings");
      })
      .then((data) => {
        // Map settings JSON key-values to settings list structure in dashboard
        const flatList = Object.keys(data).map((key, idx) => ({
          id: `set-${idx}`,
          key,
          value: typeof data[key] === "object" ? JSON.stringify(data[key]) : String(data[key]),
          category: "System Config",
          enabled: true,
          role: "All Roles",
          updatedAt: new Date().toISOString(),
          updatedBy: "System"
        }));
        setSettings(flatList);
      })
      .catch((err) => console.error("Error loading CMS settings:", err));

    // 2. Fetch dashboard BI reports and database user/roles details
    fetch("/api/admin/dashboard")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load dashboard data");
      })
      .then((data) => {
        if (data.users) {
          // Sync database users list with deptAccounts
          setDeptAccounts(
            data.users.map((u: any) => ({
              id: u.id,
              name: u.name,
              email: u.email,
              password: "●●●●●●●●",
              department: u.role?.name || "Customer",
              accessGrants: u.role?.permissions ? [u.role.permissions] : []
            }))
          );
        }
        if (data.roles) {
          // Sync database role permissions matrix with rolePermissions
          const matrix: Record<string, string[]> = {};
          data.roles.forEach((r: any) => {
            try {
              if (r.permissions.startsWith("{")) {
                const parsed = JSON.parse(r.permissions);
                matrix[r.name] = parsed.actions || ["Read"];
              } else {
                matrix[r.name] = r.permissions.split(",").map((p: string) => p.trim());
              }
            } catch {
              matrix[r.name] = [r.permissions];
            }
          });
          setRolePermissions(matrix);
        }
      })
      .catch((err) => console.error("Error loading dashboard data:", err));

    // 3. Fetch products master
    fetch("/api/admin/products")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load products");
      })
      .then((data) => {
        setProductsMaster(
          data.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            stock: p.stock,
            state: p.district?.state?.name || "State",
            active: p.isActive
          }))
        );
      })
      .catch((err) => console.error("Error loading products master:", err));
  }, []);

  // Filter States for BI
  const [biFilterState, setBiFilterState] = useState("All States");
  const [biFilterCategory, setBiFilterCategory] = useState("All Categories");

  // Website Settings Module States
  const [settings, setSettings] = useState([
    { id: "set-1", key: "site_name", value: "Cultural Clutch", category: "General Settings", enabled: true, role: "All Roles", updatedAt: "2026-07-21T18:00:00.000Z", updatedBy: "Super Admin" },
    { id: "set-2", key: "favicon_url", value: "/favicon.ico", category: "General Settings", enabled: true, role: "All Roles", updatedAt: "2026-07-21T18:00:00.000Z", updatedBy: "Super Admin" },
    { id: "set-3", key: "gst_details_pan", value: "AAAC0000A", category: "Company Settings", enabled: true, role: "Super Admin", updatedAt: "2026-07-21T18:00:00.000Z", updatedBy: "Finance Manager" },
    { id: "set-4", key: "otp_login_status", value: "true", category: "User Settings", enabled: true, role: "Admin", updatedAt: "2026-07-21T18:00:00.000Z", updatedBy: "Admin" },
    { id: "set-5", key: "sku_format_default", value: "CC-[DIST]-[CAT]-[NUM]", category: "Product Settings", enabled: true, role: "All Roles", updatedAt: "2026-07-21T18:00:00.000Z", updatedBy: "Super Admin" },
    { id: "set-6", key: "minimum_stock_alert", value: "5", category: "Inventory Settings", enabled: true, role: "Admin", updatedAt: "2026-07-21T18:00:00.000Z", updatedBy: "Super Admin" },
    { id: "set-7", key: "free_shipping_threshold", value: "1999", category: "Shipping Settings", enabled: true, role: "All Roles", updatedAt: "2026-07-21T18:00:00.000Z", updatedBy: "Admin" },
    { id: "set-8", key: "razorpay_api_live", value: "true", category: "Payment Gateway Settings", enabled: true, role: "Super Admin", updatedAt: "2026-07-21T18:00:00.000Z", updatedBy: "Finance Manager" },
    { id: "set-9", key: "ai_chatbot_status", value: "true", category: "AI Settings", enabled: true, role: "All Roles", updatedAt: "2026-07-21T18:00:00.000Z", updatedBy: "Super Admin" },
    { id: "set-10", key: "debug_mode", value: "false", category: "Developer Settings", enabled: false, role: "Super Admin", updatedAt: "2026-07-21T18:00:00.000Z", updatedBy: "Super Admin" }
  ]);

  const [settingsLogs, setSettingsLogs] = useState([
    { id: "slog-1", timestamp: "2026-07-21 17:00:00", action: "UPDATE", key: "site_name", desc: "Super Admin changed value to 'Cultural Clutch'", user: "Super Admin" },
    { id: "slog-2", timestamp: "2026-07-21 16:00:00", action: "CREATE", key: "gst_details_pan", desc: "Super Admin initialized value to 'AAAC0000A'", user: "Super Admin" }
  ]);

  const [searchSettingsQuery, setSearchSettingsQuery] = useState("");
  const [filterSettingsCategory, setFilterSettingsCategory] = useState("All Categories");
  const [filterSettingsStatus, setFilterSettingsStatus] = useState("All Statuses");

  // State for Create/Edit Modal
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<any | null>(null); // null means "Create" mode
  const [inputSettingKey, setInputSettingKey] = useState("");
  const [inputSettingValue, setInputSettingValue] = useState("");
  const [inputSettingCategory, setInputSettingCategory] = useState("General Settings");
  const [inputSettingRole, setInputSettingRole] = useState("All Roles");
  const [inputSettingEnabled, setInputSettingEnabled] = useState(true);

  // Raw JSON config import/export states
  const [importConfigString, setImportConfigString] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Access Controls & Mock Data
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({
    "Super Admin": ["Read", "Create", "Update", "Delete", "Approve"],
    "Admin": ["Read", "Create", "Update", "Delete"],
    "CEO": ["Read", "Approve"],
    "Director": ["Read"],
    "Sales Manager": ["Read", "Create", "Update", "Approve"],
    "Sales Executive": ["Read", "Create"],
    "Finance Manager": ["Read", "Update", "Approve"],
    "Accountant": ["Read", "Create", "Update"],
    "Purchase Manager": ["Read", "Create", "Update", "Approve"],
    "Warehouse Manager": ["Read", "Update"],
    "Artisan": ["Read", "Update"]
  });

  const [selectedRole, setSelectedRole] = useState("Sales Executive");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for creating simulated credentials
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newDept, setNewDept] = useState("Sales");
  const [selectedGrants, setSelectedGrants] = useState<string[]>(["Customer orders, quotations, invoices, returns"]);

  const [deptAccounts, setDeptAccounts] = useState([
    { id: "1", name: "Amit Trivedi", email: "amit.finance@auraic.in", password: "FinancePass2026", department: "Finance & Accounts", accessGrants: ["Accounting, GST, payments, receipts, ledger"] },
    { id: "2", name: "Savitri Bai", email: "savitri.artisan@auraic.in", password: "ArtisanPass2026", department: "Vendor Management", accessGrants: ["Artisan & Supplier Management"] }
  ]);

  // Interactive ERP state collections
  const [leadsList, setLeadsList] = useState([
    { id: "L-101", name: "Rahul Deshmukh", email: "rahul@gmail.com", phone: "+91 98765 43210", product: "Jaipur Blue Pottery", value: 45000, source: "WhatsApp", status: "New" },
    { id: "L-102", name: "Ananya Sen", email: "ananya@gmail.com", phone: "+91 99999 88888", product: "Banarasi Silk Saree", value: 120000, source: "Website Enquiry", status: "In Progress" },
    { id: "L-103", name: "Suresh Hegde", email: "suresh@yahoo.com", phone: "+91 98888 77777", product: "Bhagalpur Makhana", value: 35000, source: "POS Portal", status: "Qualified" }
  ]);

  const [rfqsList, setRfqsList] = useState([
    { id: "RFQ-1001", product: "Madhubani Wall Frame", quantity: 50, budget: 4500, vendorA: "Bihar Artisan Coop", vendorB: "Patna Handicrafts", terms: "30 Days Credit", status: "Awaiting Bids" },
    { id: "RFQ-1002", product: "Terracotta Horses", quantity: 100, budget: 1200, vendorA: "Bankura Crafts Guild", vendorB: "Bengal Clay Exports", terms: "Prepaid 50%", status: "Bids Received" }
  ]);

  const [invoicesList, setInvoicesList] = useState([
    { id: "INV-2026-001", customer: "Rahul Deshmukh", amount: 45000, date: "2026-07-15", status: "PAID" },
    { id: "INV-2026-002", customer: "Ananya Sen", amount: 120000, date: "2026-07-16", status: "PENDING" },
    { id: "INV-2026-003", customer: "Suresh Hegde", amount: 35000, date: "2026-07-17", status: "OVERDUE" }
  ]);

  const [employeeRegistry, setEmployeeRegistry] = useState([
    { id: "EMP-01", name: "Rohit Deshpande", post: "Logistics Manager", dept: "Shipping", attendance: "98% Present", salary: 45000 },
    { id: "EMP-02", name: "Sneha Sen", post: "Artisan Liaison", dept: "Vendor Sourcing", attendance: "95% Present", salary: 35000 },
    { id: "EMP-03", name: "Kunal Kishor", post: "Senior Accountant", dept: "Finance", attendance: "100% Present", salary: 55000 }
  ]);

  const [couponsList, setCouponsList] = useState([
    { id: "C-01", code: "SARI50", discount: 50, type: "PERCENTAGE", active: true, usageCount: 24 },
    { id: "C-02", code: "ODOPFREE", discount: 200, type: "FLAT", active: true, usageCount: 154 },
    { id: "C-03", code: "BOGO2026", discount: 100, type: "BOGO", active: false, usageCount: 0 }
  ]);

  const [shipmentsList, setShipmentsList] = useState([
    { id: "SHIP-90182", partner: "Delhivery", dest: "Mumbai", status: "Out for Delivery", date: "18 JUL" },
    { id: "SHIP-90183", partner: "BlueDart", dest: "Hyderabad", status: "In Transit", date: "19 JUL" },
    { id: "SHIP-90184", partner: "IndiaPost", dest: "Srinagar", status: "Pending Pickup", date: "20 JUL" }
  ]);

  const [productsMaster, setProductsMaster] = useState([
    { id: "P-001", name: "Jaipur Blue Pottery Pots", price: 2500, stock: 15, state: "Rajasthan", active: true },
    { id: "P-002", name: "Banarasi Silk Saree", price: 8500, stock: 2, state: "Uttar Pradesh", active: true },
    { id: "P-003", name: "Bhagalpur Makhana (500g)", price: 350, stock: 85, state: "Bihar", active: true },
    { id: "P-004", name: "Terracotta Horse (Panchmura)", price: 1200, stock: 0, state: "West Bengal", active: false }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, type: "WARN", msg: "Inventory Alert: Jaipur Blue Pottery running low (2 units left)." },
    { id: 2, type: "INFO", msg: "New artisan alignment: 15 new Banarasi Saree listings awaiting approval." },
    { id: 3, type: "AUTH", msg: "Compliance Alert: GST filing status updated to Completed." }
  ]);

  const [calendarEvents, setCalendarEvents] = useState([
    { id: 1, date: "18 JUL", title: "Vendor Payment Release", type: "Finance" },
    { id: 2, date: "19 JUL", title: "Warehouse Stock Audit", type: "Inventory" },
    { id: 3, date: "21 JUL", title: "ODOP Sourcing Review", type: "Sales" }
  ]);

  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");

  // ==================== NEW ERP WORKFLOW STATE VARIABLES ====================
  const [activeSubTab, setActiveSubTab] = useState("dashboard"); // "dashboard" | "tasks" | "approvals" | "documents" | "team" | "logs"

  interface ERPTask {
    id: string;
    title: string;
    description: string;
    departmentId: string;
    assignedTo: string;
    assignedBy: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    dueDate: string;
    status: "TODAY" | "PENDING" | "COMPLETED" | "REVISION_REQUESTED";
    checklist: { label: string; done: boolean }[];
    comments: { user: string; text: string; timestamp: string }[];
    approvalStatus: "NONE" | "PENDING_TL" | "PENDING_MANAGER" | "PENDING_DIRECTOR" | "PENDING_SUPER" | "APPROVED" | "REJECTED";
    approvalHistory: { step: string; actor: string; action: string; comment: string; timestamp: string }[];
  }

  const [erpTasks, setErpTasks] = useState<ERPTask[]>([
    {
      id: "T-101",
      title: "Draft Banarasi Silk RFQ Model",
      description: "Prepare RFQ parameters for the Varanasi silk weaver cooperative partnership specifications.",
      departmentId: "purchase",
      assignedTo: "Kunal Kishor",
      assignedBy: "Super Admin",
      priority: "HIGH",
      dueDate: "2026-07-24",
      status: "TODAY",
      checklist: [
        { label: "Verify silk threads catalog pricing", done: true },
        { label: "Outline payment credit terms (30 Days)", done: false }
      ],
      comments: [
        { user: "Sneha Sen", text: "Checked raw pricing indices.", timestamp: "2026-07-19 14:32" }
      ],
      approvalStatus: "NONE",
      approvalHistory: []
    },
    {
      id: "T-102",
      title: "Audit Warehouse Section B (Rajasthan Blue Pottery)",
      description: "Verify stock count matching between Prisma database entries and actual storage shelves.",
      departmentId: "inventory",
      assignedTo: "Rohit Deshpande",
      assignedBy: "Super Admin",
      priority: "CRITICAL",
      dueDate: "2026-07-22",
      status: "PENDING",
      checklist: [
        { label: "Generate QR codes for missing boxes", done: false },
        { label: "Submit damage discrepancy report", done: false }
      ],
      comments: [],
      approvalStatus: "PENDING_MANAGER",
      approvalHistory: [
        { step: "Team Leader Review", actor: "Sneha Sen", action: "RECOMMENDED", comment: "Section B visual count complete.", timestamp: "2026-07-20 18:22" }
      ]
    },
    {
      id: "T-103",
      title: "Review Q2 GST Filing Draft",
      description: "Verify accounting accounts ledger tax balance totals before finalizing filing submission.",
      departmentId: "finance",
      assignedTo: "Kunal Kishor",
      assignedBy: "Super Admin",
      priority: "HIGH",
      dueDate: "2026-07-21",
      status: "TODAY",
      checklist: [
        { label: "Confirm state IGST collections mapping", done: true },
        { label: "Audit TDS deductions data mapping", done: true }
      ],
      comments: [],
      approvalStatus: "PENDING_TL",
      approvalHistory: []
    },
    {
      id: "T-104",
      title: "Complete Blue Pottery Product SEO Tags",
      description: "Configure SEO title, metadata description, and OG image parameters for the catalog page.",
      departmentId: "product",
      assignedTo: "Sneha Sen",
      assignedBy: "Super Admin",
      priority: "LOW",
      dueDate: "2026-07-28",
      status: "COMPLETED",
      checklist: [
        { label: "Add state-specific key terms", done: true },
        { label: "Check image load time bounds", done: true }
      ],
      comments: [],
      approvalStatus: "APPROVED",
      approvalHistory: [
        { step: "Final Approval", actor: "Super Admin", action: "APPROVED", comment: "Meta tags look optimal.", timestamp: "2026-07-20 16:40" }
      ]
    },
    {
      id: "T-105",
      title: "Set Up B2B Bulk Discount Table",
      description: "Configure tiers for bulk wholesale procurement of Blue Pottery vases.",
      departmentId: "sales",
      assignedTo: "Rohit Deshpande",
      assignedBy: "Super Admin",
      priority: "MEDIUM",
      dueDate: "2026-07-25",
      status: "PENDING",
      checklist: [
        { label: "Add 100+ units discount bounds (15%)", done: true },
        { label: "Add 500+ units discount bounds (25%)", done: false }
      ],
      comments: [],
      approvalStatus: "NONE",
      approvalHistory: []
    }
  ]);

  interface ERPTeam {
    id: string;
    name: string;
    departmentId: string;
    teamLeaderId: string;
    memberIds: string[];
  }

  const [erpTeams, setErpTeams] = useState<ERPTeam[]>([
    { id: "TM-01", name: "Sourcing Team A", departmentId: "purchase", teamLeaderId: "Sneha Sen", memberIds: ["Kunal Kishor", "Rohit Deshpande"] },
    { id: "TM-02", name: "Accounts Group", departmentId: "finance", teamLeaderId: "Kunal Kishor", memberIds: ["Amit Trivedi"] },
    { id: "TM-03", name: "SEO Operations", departmentId: "product", teamLeaderId: "Sneha Sen", memberIds: ["Rohit Deshpande"] }
  ]);

  interface ERPNotification {
    id: string;
    channel: "EMAIL" | "SMS" | "WHATSAPP" | "IN_APP";
    recipient: string;
    message: string;
    timestamp: string;
    unread: boolean;
  }

  const [erpNotifications, setErpNotifications] = useState<ERPNotification[]>([
    { id: "N-1", channel: "EMAIL", recipient: "amit.finance@auraic.in", message: "Task Assigned: Draft Banarasi Silk RFQ Model", timestamp: "2026-07-20 18:30", unread: true },
    { id: "N-2", channel: "IN_APP", recipient: "Super Admin", message: "Task T-102 submitted for Manager Review by Rohit Deshpande", timestamp: "2026-07-20 18:23", unread: true },
    { id: "N-3", channel: "WHATSAPP", recipient: "Sneha Sen", message: "Approval Requested: Complete Blue Pottery Product SEO Tags", timestamp: "2026-07-20 16:45", unread: false }
  ]);

  interface ERPAuditLog {
    id: string;
    timestamp: string;
    actor: string;
    departmentId: string;
    action: string;
    details: string;
  }

  const [erpAuditLogs, setErpAuditLogs] = useState<ERPAuditLog[]>([
    { id: "LOG-01", timestamp: "2026-07-20 18:30", actor: "Super Admin", departmentId: "purchase", action: "TASK_ASSIGNED", details: "Assigned 'Draft Banarasi Silk RFQ Model' to Kunal Kishor" },
    { id: "LOG-02", timestamp: "2026-07-20 18:23", actor: "Rohit Deshpande", departmentId: "inventory", action: "TASK_SUBMITTED", details: "Submitted 'Audit Warehouse Section B' for review" },
    { id: "LOG-03", timestamp: "2026-07-20 16:40", actor: "Super Admin", departmentId: "product", action: "APPROVAL_GRANTED", details: "Approved task 'Complete Blue Pottery Product SEO Tags'" }
  ]);

  interface ERPDocument {
    id: string;
    name: string;
    departmentId: string;
    size: string;
    uploadedBy: string;
    uploadedAt: string;
  }

  const [erpDocuments, setErpDocuments] = useState<ERPDocument[]>([
    { id: "DOC-001", name: "RFQ-Banarasi-Silk-V1.pdf", departmentId: "purchase", size: "1.2 MB", uploadedBy: "Kunal Kishor", uploadedAt: "2026-07-20" },
    { id: "DOC-002", name: "Warehouse-Audit-Report-Q2.pdf", departmentId: "inventory", size: "850 KB", uploadedBy: "Rohit Deshpande", uploadedAt: "2026-07-20" },
    { id: "DOC-003", name: "GST-Tax-Calculations-Draft.xlsx", departmentId: "finance", size: "2.4 MB", uploadedBy: "Amit Trivedi", uploadedAt: "2026-07-19" }
  ]);

  interface ERPChatMessage {
    id: string;
    departmentId: string;
    user: string;
    text: string;
    timestamp: string;
  }

  const [erpChatMessages, setErpChatMessages] = useState<ERPChatMessage[]>([
    { id: "M-1", departmentId: "purchase", user: "Kunal Kishor", text: "Starting work on the Silk Weaver RFQ today.", timestamp: "10:15 AM" },
    { id: "M-2", departmentId: "purchase", user: "Sneha Sen", text: "Let me know if you need the latest supplier database indexes.", timestamp: "10:20 AM" }
  ]);

  const [departmentsList, setDepartmentsList] = useState([
    { id: "bi", name: "Business Intelligence", manager: "Mr. Abhishek Mishra" },
    { id: "sales", name: "Sales Department", manager: "Super Admin" },
    { id: "purchase", name: "Purchase Department", manager: "Super Admin" },
    { id: "finance", name: "Finance Department", manager: "Kunal Kishor" },
    { id: "inventory", name: "Inventory & Storage", manager: "Rohit Deshpande" },
    { id: "product", name: "Product Management", manager: "Sneha Sen" }
  ]);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [newDeptId, setNewDeptId] = useState("");
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptManager, setNewDeptManager] = useState("Super Admin");

  const [erpJobRoles, setErpJobRoles] = useState([
    { id: "R-1", title: "Super Admin", department: "Administration" },
    { id: "R-2", title: "Finance Manager", department: "Finance" },
    { id: "R-3", title: "Artisan Liaison", department: "Purchase" },
    { id: "R-4", title: "Logistics Specialist", department: "Logistics" }
  ]);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [newRoleTitle, setNewRoleTitle] = useState("");
  const [newRoleDept, setNewRoleDept] = useState("Sales");

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [newTeamNameInput, setNewTeamNameInput] = useState("");
  const [newTeamLeaderInput, setNewTeamLeaderInput] = useState("Sneha Sen");

  // Modal toggle state variables
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTaskForView, setSelectedTaskForView] = useState<any | null>(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">("MEDIUM");
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState("Kunal Kishor");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  
  const [newCommentText, setNewCommentText] = useState("");
  const [newDocName, setNewDocName] = useState("");
  const [newChatMessageText, setNewChatMessageText] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Dynamic Theme Palette Map
  const themes = {
    saffron: {
      accent: "#B56D3E",
      text: "text-[#B56D3E]",
      bg: "bg-[#FAF5EE]",
      border: "border-[#C09355]/30",
      button: "bg-[#B56D3E] hover:bg-[#9B5A2F] text-white",
      chartGradient: "from-[#B56D3E] to-[#C09355]",
      cardTint: "bg-[#FAF5EE]/70"
    },
    indigo: {
      accent: "#2563EB",
      text: "text-blue-600",
      bg: "bg-blue-50/20",
      border: "border-blue-200",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
      chartGradient: "from-blue-600 to-indigo-400",
      cardTint: "bg-blue-50/40"
    },
    emerald: {
      accent: "#059669",
      text: "text-emerald-600",
      bg: "bg-emerald-50/20",
      border: "border-emerald-200",
      button: "bg-emerald-600 hover:bg-emerald-700 text-white",
      chartGradient: "from-emerald-600 to-teal-400",
      cardTint: "bg-emerald-50/40"
    },
    crimson: {
      accent: "#DC2626",
      text: "text-red-650",
      bg: "bg-red-50/20",
      border: "border-red-200",
      button: "bg-red-600 hover:bg-red-700 text-white",
      chartGradient: "from-red-600 to-rose-400",
      cardTint: "bg-red-50/40"
    }
  };

  const activeTheme = themes[dashboardTheme as keyof typeof themes] || themes.saffron;

  // Handles adding calendar events
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventDate) return;
    setCalendarEvents([
      ...calendarEvents,
      { id: Date.now(), date: newEventDate.toUpperCase(), title: newEventTitle, type: "Admin" }
    ]);
    setNewEventTitle("");
    setNewEventDate("");
    showToast(`Scheduled event: ${newEventTitle}`);
  };

  // Handles simulated department credentials creation
  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPassword) {
      showToast("Please fill out all credentials fields.");
      return;
    }

    try {
      const rolesRes = await fetch("/api/admin/roles");
      if (!rolesRes.ok) throw new Error("Failed to load roles list");
      const rolesList = await rolesRes.json();
      
      const matchedRole = rolesList.find((r: any) => r.name.toLowerCase().includes(newDept.toLowerCase())) || rolesList[0];
      
      if (!matchedRole) {
        showToast("No matching database role found to provision user.");
        return;
      }

      const userRes = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          roleId: matchedRole.id
        })
      });

      const data = await userRes.json();
      if (!userRes.ok) throw new Error(data.error || "Failed to create user account");

      const newAcct = {
        id: data.id,
        name: data.name,
        email: data.email,
        password: "●●●●●●●●",
        department: data.role?.name || newDept,
        accessGrants: data.role?.permissions ? [data.role.permissions] : ["General Access"]
      };

      setDeptAccounts([newAcct, ...deptAccounts]);
      showToast(`Account provisioned successfully in database for ${newName}!`);
      setNewName("");
      setNewEmail("");
      setNewPassword("");
    } catch (err: any) {
      showToast(`Provisioning failed: ${err.message}`);
    }
  };

  const toggleGrant = (grant: string) => {
    if (selectedGrants.includes(grant)) {
      setSelectedGrants(selectedGrants.filter((g) => g !== grant));
    } else {
      setSelectedGrants([...selectedGrants, grant]);
    }
  };

  // Toggle user permissions switches
  const togglePermission = async (role: string, perm: string) => {
    const current = rolePermissions[role] || [];
    let updated;
    if (current.includes(perm)) {
      updated = current.filter(p => p !== perm);
    } else {
      updated = [...current, perm];
    }
    const newRolePermissions = {
      ...rolePermissions,
      [role]: updated
    };
    setRolePermissions(newRolePermissions);
    
    try {
      const rolesRes = await fetch("/api/admin/roles");
      if (rolesRes.ok) {
        const rolesList = await rolesRes.json();
        const roleObj = rolesList.find((r: any) => r.name === role);
        if (roleObj) {
          let serializedPermissions = JSON.stringify({ actions: updated });
          if (roleObj.permissions && !roleObj.permissions.startsWith("{")) {
            serializedPermissions = updated.join(",");
          }
          await fetch("/api/admin/roles", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: roleObj.id, permissions: serializedPermissions })
          });
        }
      }
    } catch (err) {
      console.error("Failed to persist permission update to database:", err);
    }
    
    showToast(`Updated permissions for ${role}`);
  };

  // Helper to sync dynamic flat array back to the JSON file settings
  const syncSettingsToBackend = async (flatList: any[]) => {
    try {
      const kv: Record<string, any> = {};
      flatList.forEach((s) => {
        let val = s.value;
        try {
          if (val.startsWith("[") || val.startsWith("{")) {
            val = JSON.parse(val);
          }
        } catch {
          // Keep as string
        }
        kv[s.key] = val;
      });
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kv)
      });
    } catch (err) {
      console.error("Failed to sync settings with backend database:", err);
    }
  };

  // Website Settings CRUD Handlers
  const handleSaveSetting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSettingKey || !inputSettingValue) {
      showToast("Please fill key and value fields.");
      return;
    }

    const timestamp = new Date().toISOString();
    let updatedList;
    if (editingSetting) {
      // Update Mode
      updatedList = settings.map((s) => {
        if (s.id === editingSetting.id) {
          return {
            ...s,
            key: inputSettingKey,
            value: inputSettingValue,
            category: inputSettingCategory,
            role: inputSettingRole,
            enabled: inputSettingEnabled,
            updatedAt: timestamp,
            updatedBy: "Super Admin"
          };
        }
        return s;
      });
      setSettings(updatedList);
      
      const newLog = {
        id: `slog-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        action: "UPDATE",
        key: inputSettingKey,
        desc: `Super Admin updated value to '${inputSettingValue}' and permissions to '${inputSettingRole}'`,
        user: "Super Admin"
      };
      setSettingsLogs([newLog, ...settingsLogs]);
      showToast(`Updated setting key: ${inputSettingKey}`);
    } else {
      // Create Mode
      const duplicate = settings.find(s => s.key === inputSettingKey);
      if (duplicate) {
        showToast("Setting key already exists! Use edit instead.");
        return;
      }
      const newSetting = {
        id: `set-${Date.now()}`,
        key: inputSettingKey,
        value: inputSettingValue,
        category: inputSettingCategory,
        enabled: inputSettingEnabled,
        role: inputSettingRole,
        updatedAt: timestamp,
        updatedBy: "Super Admin"
      };
      updatedList = [...settings, newSetting];
      setSettings(updatedList);

      const newLog = {
        id: `slog-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        action: "CREATE",
        key: inputSettingKey,
        desc: `Super Admin initialized key with value '${inputSettingValue}' under category '${inputSettingCategory}'`,
        user: "Super Admin"
      };
      setSettingsLogs([newLog, ...settingsLogs]);
      showToast(`Created new setting: ${inputSettingKey}`);
    }

    await syncSettingsToBackend(updatedList);

    setIsSettingsModalOpen(false);
    setEditingSetting(null);
    setInputSettingKey("");
    setInputSettingValue("");
  };

  const handleDeleteSetting = async (id: string, keyName: string) => {
    const updatedList = settings.filter(s => s.id !== id);
    setSettings(updatedList);
    const newLog = {
      id: `slog-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      action: "DELETE",
      key: keyName,
      desc: `Super Admin deleted the settings key.`,
      user: "Super Admin"
    };
    setSettingsLogs([newLog, ...settingsLogs]);
    showToast(`Deleted settings key: ${keyName}`);
    await syncSettingsToBackend(updatedList);
  };

  const handleToggleSettingEnabled = async (id: string, keyName: string, currentStatus: boolean) => {
    const updatedList = settings.map((s) => {
      if (s.id === id) {
        return { ...s, enabled: !currentStatus };
      }
      return s;
    });
    setSettings(updatedList);
    
    const newLog = {
      id: `slog-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      action: currentStatus ? "DISABLE" : "ENABLE",
      key: keyName,
      desc: `Super Admin ${currentStatus ? "disabled" : "enabled"} the setting.`,
      user: "Super Admin"
    };
    setSettingsLogs([newLog, ...settingsLogs]);
    showToast(`Setting ${keyName} is now ${!currentStatus ? "Enabled" : "Disabled"}`);
    await syncSettingsToBackend(updatedList);
  };

  const handleExportSettings = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "website_settings_export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Exported website settings successfully.");
  };

  const handleImportSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importConfigString) return;
    try {
      const parsed = JSON.parse(importConfigString);
      if (!Array.isArray(parsed)) {
        showToast("Invalid settings format! Must be a JSON array.");
        return;
      }
      const isValid = parsed.every(item => item.key && item.value && item.category);
      if (!isValid) {
        showToast("JSON format is missing required fields (key, value, category).");
        return;
      }

      const merged = [...settings];
      parsed.forEach(importedItem => {
        const existingIdx = merged.findIndex(s => s.key === importedItem.key);
        const timestamp = new Date().toISOString();
        if (existingIdx !== -1) {
          merged[existingIdx] = {
            ...merged[existingIdx],
            value: importedItem.value,
            category: importedItem.category,
            role: importedItem.role || "All Roles",
            enabled: importedItem.enabled !== undefined ? importedItem.enabled : true,
            updatedAt: timestamp,
            updatedBy: "Super Admin (Bulk Import)"
          };
        } else {
          merged.push({
            id: `set-${Date.now()}-${Math.random()}`,
            key: importedItem.key,
            value: importedItem.value,
            category: importedItem.category,
            role: importedItem.role || "All Roles",
            enabled: importedItem.enabled !== undefined ? importedItem.enabled : true,
            updatedAt: timestamp,
            updatedBy: "Super Admin (Bulk Import)"
          });
        }
      });

      setSettings(merged);
      const newLog = {
        id: `slog-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        action: "IMPORT",
        key: "bulk_config",
        desc: `Super Admin bulk-imported and updated config settings.`,
        user: "Super Admin"
      };
      setSettingsLogs([newLog, ...settingsLogs]);
      showToast("Successfully imported and merged settings config.");
      setIsImportModalOpen(false);
      setImportConfigString("");
    } catch (err) {
      showToast("Error parsing JSON string! Check syntax.");
    }
  };

  // UI states for custom sub-feature interactions
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadProduct, setNewLeadProduct] = useState("Jaipur Blue Pottery");
  const [newLeadValue, setNewLeadValue] = useState("");
  const [newLeadSource, setNewLeadSource] = useState("Website Enquiry");

  const [newRfqProduct, setNewRfqProduct] = useState("");
  const [newRfqQty, setNewRfqQty] = useState("");
  const [newRfqBudget, setNewRfqBudget] = useState("");
  const [newRfqVendorA, setNewRfqVendorA] = useState("");
  const [newRfqVendorB, setNewRfqVendorB] = useState("");
  
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState("");
  const [newCouponType, setNewCouponType] = useState("PERCENTAGE");

  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpPost, setNewEmpPost] = useState("");
  const [newEmpDept, setNewEmpDept] = useState("Sales");
  const [newEmpSalary, setNewEmpSalary] = useState("");

  const [newShipmentDest, setNewShipmentDest] = useState("");
  const [newShipmentPartner, setNewShipmentPartner] = useState("Delhivery");

  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductStock, setNewProductStock] = useState("");
  const [newProductState, setNewProductState] = useState("Uttar Pradesh");

  // Mocks for POS Checkout
  const [posSelectedProduct, setPosSelectedProduct] = useState("P-001");
  const [posQuantity, setPosQuantity] = useState("1");
  const [posCart, setPosCart] = useState<any[]>([]);

  // Mocks for Barcode Generator
  const [generatedBarcode, setGeneratedBarcode] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");

  // Generic Simulator State
  const [simulatorData, setSimulatorData] = useState<Record<string, any[]>>({
    "daily sales": [
      { id: "DS-1", date: "2026-07-18", amount: "₹45,200", items: "12 units", payment: "Razorpay" },
      { id: "DS-2", date: "2026-07-17", amount: "₹38,900", items: "8 units", payment: "UPI" },
      { id: "DS-3", date: "2026-07-16", amount: "₹62,100", items: "18 units", payment: "COD" }
    ],
    "gst tracker": [
      { id: "GST-1", period: "Q1 2026", liability: "₹1,45,000", status: "Paid", date: "2026-04-20" },
      { id: "GST-2", period: "Q2 2026", liability: "₹1,82,400", status: "Pending Filing", date: "2026-07-20" }
    ],
    "damaged stock logs": [
      { id: "DSL-1", product: "Jaipur Blue Pottery", quantity: "2 units", cause: "Transit damage", date: "2026-07-17" },
      { id: "DSL-2", product: "Banarasi Saree", quantity: "1 unit", cause: "Stain defect", date: "2026-07-15" }
    ],
    "attendance logs": [
      { id: "ATT-1", employee: "Rohit Deshpande", time: "09:05 AM", date: "2026-07-18", status: "On Time" },
      { id: "ATT-2", employee: "Sneha Sen", time: "09:12 AM", date: "2026-07-18", status: "Late (12m)" },
      { id: "ATT-3", employee: "Kunal Kishor", time: "08:55 AM", date: "2026-07-18", status: "On Time" }
    ],
    "holiday list": [
      { id: "H-1", name: "Independence Day", date: "15 AUG", type: "National" },
      { id: "H-2", name: "Diwali festival", date: "09 NOV", type: "Gazetted" },
      { id: "H-3", name: "Republic Day", date: "26 JAN", type: "National" }
    ]
  });

  const [simulatorSearch, setSimulatorSearch] = useState("");
  const [genericFieldName, setGenericFieldName] = useState("");
  const [genericFieldValue, setGenericFieldValue] = useState("");
  const [genericFieldKey, setGenericFieldKey] = useState("");

  // Interactive Cashier POS Handlers
  const handleAddToPosCart = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = productsMaster.find(p => p.id === posSelectedProduct);
    if (!prod) return;
    const qty = parseInt(posQuantity) || 1;
    if (prod.stock < qty) {
      showToast(`Insufficient stock! Only ${prod.stock} units available.`);
      return;
    }
    
    const existing = posCart.find(item => item.id === prod.id);
    if (existing) {
      if (prod.stock < existing.quantity + qty) {
        showToast(`Cannot add more. Total in cart exceeds stock.`);
        return;
      }
      setPosCart(posCart.map(item => item.id === prod.id ? { ...item, quantity: item.quantity + qty } : item));
    } else {
      setPosCart([...posCart, { ...prod, quantity: qty }]);
    }
    showToast(`Added ${qty}x ${prod.name} to POS Cart.`);
  };

  const handlePosCheckout = () => {
    if (posCart.length === 0) return;
    // Deduct stock
    const updatedProducts = productsMaster.map(p => {
      const cartItem = posCart.find(item => item.id === p.id);
      if (cartItem) {
        return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
      }
      return p;
    });
    setProductsMaster(updatedProducts);
    
    const total = posCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newInvoice = {
      id: `INV-POS-${Date.now().toString().slice(-4)}`,
      customer: "POS Counter Cash Customer",
      amount: total,
      date: new Date().toISOString().split('T')[0],
      status: "PAID"
    };
    setInvoicesList([newInvoice, ...invoicesList]);
    setPosCart([]);
    showToast(`POS Checkout successful! Total: ₹${total.toLocaleString()}`);
  };

  // Helper: Log operational actions to the audit trail
  const logERPAction = (deptId: string, action: string, details: string) => {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString("en-IN"),
      actor: selectedRole,
      departmentId: deptId,
      action,
      details
    };
    setErpAuditLogs([newLog, ...erpAuditLogs]);
  };

  // Helper: Send simulated notifications
  const sendERPNotification = (channel: "EMAIL" | "SMS" | "WHATSAPP" | "IN_APP", recipient: string, message: string) => {
    const newNotif = {
      id: `N-${Date.now().toString().slice(-4)}`,
      channel,
      recipient,
      message,
      timestamp: new Date().toLocaleString("en-IN"),
      unread: true
    };
    setErpNotifications([newNotif, ...erpNotifications]);
  };

  // ==================== RENDERS: ERP WORKSPACE SUB-TABS ====================

  const renderTasksWorkspace = () => {
    const deptTasks = erpTasks.filter(t => t.departmentId === activeModule);
    const todayTasks = deptTasks.filter(t => t.status === "TODAY");
    const pendingTasks = deptTasks.filter(t => t.status === "PENDING" || t.status === "REVISION_REQUESTED");
    const completedTasks = deptTasks.filter(t => t.status === "COMPLETED");

    return (
      <div className="space-y-6 text-left">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#3D1E16] dark:text-gray-200">Interactive Kanban Task Board</h3>
            <p className="text-xs text-gray-400">Manage and track departmental operations, review checklist actions, and submit work.</p>
          </div>
          <button
            onClick={() => {
              setNewTaskTitle("");
              setNewTaskDesc("");
              setNewTaskPriority("MEDIUM");
              setNewTaskDueDate(new Date().toISOString().split("T")[0]);
              setIsCreateTaskModalOpen(true);
            }}
            className={`px-4 py-2 ${activeTheme.button} text-xs font-bold rounded-xl shadow flex items-center gap-1.5 active:scale-95 transition-all`}
          >
            <Plus className="w-4 h-4" /> Create Task
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Today's Tasks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2 border-amber-500/20">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#B56D3E] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Today's Queue ({todayTasks.length})
              </span>
            </div>
            <div className="space-y-3 min-h-[300px] bg-gray-100/30 dark:bg-white/5 p-3 rounded-2xl border border-dashed border-gray-300/10">
              {todayTasks.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-10">No tasks active for today.</p>
              ) : (
                todayTasks.map(t => renderTaskCard(t))
              )}
            </div>
          </div>

          {/* Column 2: Pending Backlog */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2 border-blue-500/20">
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-500 flex items-center gap-1.5">
                <ClipboardList className="w-3.5 h-3.5" /> Pending Backlog ({pendingTasks.length})
              </span>
            </div>
            <div className="space-y-3 min-h-[300px] bg-gray-100/30 dark:bg-white/5 p-3 rounded-2xl border border-dashed border-gray-300/10">
              {pendingTasks.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-10">Backlog clean.</p>
              ) : (
                pendingTasks.map(t => renderTaskCard(t))
              )}
            </div>
          </div>

          {/* Column 3: Completed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2 border-green-500/20">
              <span className="text-xs font-extrabold uppercase tracking-widest text-green-600 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Completed ({completedTasks.length})
              </span>
            </div>
            <div className="space-y-3 min-h-[300px] bg-gray-100/30 dark:bg-white/5 p-3 rounded-2xl border border-dashed border-gray-300/10">
              {completedTasks.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-10">No completed tasks yet.</p>
              ) : (
                completedTasks.map(t => renderTaskCard(t))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTaskCard = (task: ERPTask) => {
    const doneCount = task.checklist.filter(c => c.done).length;
    const totalCount = task.checklist.length;
    const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

    return (
      <div
        key={task.id}
        onClick={() => {
          setSelectedTaskForView(task);
          setNewCommentText("");
          setIsTaskModalOpen(true);
        }}
        className="p-4 bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/50 rounded-2xl shadow-sm hover:shadow-md hover:border-[#B56D3E]/30 cursor-pointer transition-all space-y-3 text-left relative group select-none"
      >
        <div className="flex justify-between items-start">
          <span className="font-mono text-[9px] font-black text-gray-400 group-hover:text-[#B56D3E] transition-colors">{task.id}</span>
          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
            task.priority === "CRITICAL" ? "bg-red-100 text-red-700" :
            task.priority === "HIGH" ? "bg-orange-100 text-orange-700" :
            task.priority === "MEDIUM" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
          }`}>
            {task.priority}
          </span>
        </div>

        <div className="space-y-1">
          <h4 className="font-sans font-bold text-xs text-[#3D1E16] dark:text-gray-100 group-hover:text-[#B56D3E] transition-colors leading-tight">
            {task.title}
          </h4>
          <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        </div>

        {totalCount > 0 && (
          <div className="space-y-1 text-[9px]">
            <div className="flex justify-between text-gray-400 font-bold">
              <span>Checklist Progress</span>
              <span>{doneCount}/{totalCount} ({progress}%)</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
              <div style={{ width: `${progress}%` }} className="bg-[#B56D3E] h-full rounded-full" />
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700/50 text-[9px] font-bold text-gray-450 uppercase">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3 text-[#B56D3E]" /> {task.assignedTo}
          </span>
          {task.comments.length > 0 && (
            <span>{task.comments.length} comments</span>
          )}
        </div>
      </div>
    );
  };

  const renderApprovalsWorkspace = () => {
    // Show tasks in review for activeModule
    const pendingApprovals = erpTasks.filter(
      t => t.departmentId === activeModule && t.approvalStatus !== "NONE" && t.approvalStatus !== "APPROVED"
    );

    return (
      <div className="space-y-6 text-left">
        <div>
          <h3 className="text-lg font-serif font-bold text-[#3D1E16] dark:text-gray-200">Department Approval Chains</h3>
          <p className="text-xs text-gray-400">Review task submissions, inspect checklist validations, request revisions, or issue signatures.</p>
        </div>

        {pendingApprovals.length === 0 ? (
          <div className="text-center py-20 bg-gray-100/20 dark:bg-white/5 border border-dashed border-gray-300/10 rounded-2xl">
            <ShieldCheck className="w-12 h-12 text-[#B56D3E] mx-auto mb-3 opacity-60" />
            <p className="text-xs text-gray-400 italic font-serif">No approval requests pending in this department.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingApprovals.map(t => (
              <div key={t.id} className="p-6 bg-white dark:bg-gray-800 border border-gray-200/70 rounded-2xl shadow-sm space-y-4">
                <div className="flex justify-between items-start border-b pb-3 border-gray-100 dark:border-gray-700">
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] font-black text-gray-400">{t.id}</span>
                    <h4 className="font-sans font-bold text-sm text-[#3D1E16] dark:text-gray-100">{t.title}</h4>
                    <p className="text-xs text-gray-400">Submitted by <span className="font-bold text-gray-600 dark:text-gray-300">{t.assignedTo}</span></p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-[#B56D3E] font-bold text-[9px] rounded-lg uppercase tracking-wider">
                    {t.approvalStatus.replace("_", " ")}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                  <div className="space-y-2">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Task Details</span>
                    <p className="text-gray-655 dark:text-gray-300 text-justify">{t.description}</p>
                    {t.checklist.length > 0 && (
                      <div className="space-y-1 pt-2">
                        <span className="block font-bold text-[10px] text-gray-450 uppercase">Checklist Audit</span>
                        {t.checklist.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[10px] font-semibold text-gray-700 dark:text-gray-300">
                            <span className={item.done ? "text-green-600" : "text-gray-400"}>
                              {item.done ? "✓" : "✗"}
                            </span>
                            <span className={item.done ? "line-through text-gray-400" : ""}>{item.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 bg-[#FAF5EE]/30 dark:bg-white/5 p-4 rounded-xl border border-gray-300/10">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Workflow Progress</span>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-[10px] font-bold">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>Employee Submission Completed</span>
                      </div>
                      {t.approvalHistory.map((h, idx) => (
                        <div key={idx} className="flex flex-col gap-0.5 text-[10px] pl-4 border-l border-gray-300 dark:border-gray-700">
                          <span className="font-bold text-[#B56D3E]">{h.step}: {h.action}</span>
                          <p className="text-gray-500 italic">"{h.comment}"</p>
                          <span className="text-[8px] text-gray-400 font-semibold">{h.actor} | {h.timestamp}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                      <button
                        onClick={() => handleExecuteApproval(t.id, "APPROVED")}
                        className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider text-center"
                      >
                        Approve / Sign
                      </button>
                      <button
                        onClick={() => {
                          const comment = prompt("Enter revision comments:");
                          if (comment) handleExecuteApproval(t.id, "REJECTED", comment);
                        }}
                        className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider text-center"
                      >
                        Request Revision
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleExecuteApproval = (taskId: string, decision: "APPROVED" | "REJECTED", commentText = "Approved details verification.") => {
    const updated = erpTasks.map(t => {
      if (t.id === taskId) {
        let nextStatus: ERPTask["approvalStatus"] = t.approvalStatus;
        let finalStatus: ERPTask["status"] = t.status;
        const currentActor = selectedRole;

        if (decision === "APPROVED") {
          if (t.approvalStatus === "PENDING_TL") {
            nextStatus = "PENDING_MANAGER";
            sendERPNotification("IN_APP", "Manager", `Task ${t.id} approved by Team Leader and awaits Manager signature.`);
          } else if (t.approvalStatus === "PENDING_MANAGER") {
            nextStatus = "PENDING_DIRECTOR";
            sendERPNotification("EMAIL", "director@culturalclutch.com", `Direct Review required: Task ${t.id}`);
          } else if (t.approvalStatus === "PENDING_DIRECTOR") {
            nextStatus = "APPROVED";
            finalStatus = "COMPLETED";
            sendERPNotification("EMAIL", "artisan@culturalclutch.com", `Task Approved: ${t.title}`);
          }
        } else {
          // Sent back for revision
          nextStatus = "NONE";
          finalStatus = "REVISION_REQUESTED";
          sendERPNotification("WHATSAPP", t.assignedTo, `Revision requested on task ${t.id}: ${commentText}`);
        }

        const newHistory = [
          ...t.approvalHistory,
          {
            step: t.approvalStatus === "PENDING_TL" ? "Team Leader Review" :
                  t.approvalStatus === "PENDING_MANAGER" ? "Manager Review" : "Director Verification",
            actor: currentActor,
            action: decision === "APPROVED" ? "APPROVED & ADVANCED" : "REVISION REQUESTED",
            comment: commentText,
            timestamp: new Date().toLocaleString("en-IN")
          }
        ];

        return {
          ...t,
          approvalStatus: nextStatus,
          status: finalStatus,
          approvalHistory: newHistory
        };
      }
      return t;
    });

    setErpTasks(updated);
    logERPAction(activeModule, "TASK_APPROVAL_DECISION", `Reviewed task ${taskId} with result ${decision}`);
    showToast(`Approval advanced successfully.`);
  };

  const renderDocumentsWorkspace = () => {
    const deptDocs = erpDocuments.filter(d => d.departmentId === activeModule);

    return (
      <div className="space-y-6 text-left">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#3D1E16] dark:text-gray-250">Department Document Vault</h3>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Access contracts, invoice specifications, policies, and file references.</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newDocName) return;
              const newD = {
                id: `DOC-${Date.now().toString().slice(-3)}`,
                name: newDocName.endsWith(".pdf") || newDocName.endsWith(".xlsx") ? newDocName : `${newDocName}.pdf`,
                departmentId: activeModule,
                size: "450 KB",
                uploadedBy: selectedRole,
                uploadedAt: new Date().toISOString().split("T")[0]
              };
              setErpDocuments([newD, ...erpDocuments]);
              setNewDocName("");
              logERPAction(activeModule, "DOCUMENT_UPLOAD", `Uploaded document '${newD.name}'`);
              showToast(`Document uploaded successfully.`);
            }}
            className="flex gap-2 text-xs"
          >
            <input
              type="text"
              required
              placeholder="Document name (e.g. Agreement.pdf)"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              className="px-3 py-1.5 border border-gray-250 rounded-xl dark:bg-gray-800 text-xs"
            />
            <button type="submit" className={`px-4 py-1.5 ${activeTheme.button} font-bold rounded-xl`}>
              Upload File
            </button>
          </form>
        </div>

        <div className={`p-6 rounded-2xl border ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"} shadow-sm`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-150 text-gray-450 font-bold uppercase pb-3">
                  <th className="pb-2">File Name</th>
                  <th className="pb-2">File Size</th>
                  <th className="pb-2">Uploaded By</th>
                  <th className="pb-2">Upload Date</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {deptDocs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-400 italic">No files in vault yet.</td>
                  </tr>
                ) : (
                  deptDocs.map(doc => (
                    <tr key={doc.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 font-bold font-sans text-gray-800 dark:text-gray-250">{doc.name}</td>
                      <td className="py-3 font-mono">{doc.size}</td>
                      <td className="py-3 text-gray-500">{doc.uploadedBy}</td>
                      <td className="py-3 font-mono text-gray-450">{doc.uploadedAt}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => showToast(`Downloading ${doc.name} (simulated)`)}
                          className="text-[#B56D3E] hover:underline font-bold"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderTeamWorkspace = () => {
    const deptTeam = erpTeams.find(t => t.departmentId === activeModule);
    const deptMessages = erpChatMessages.filter(m => m.departmentId === activeModule);

    return (
      <div className="space-y-6 text-left">
        <div>
          <h3 className="text-lg font-serif font-bold text-[#3D1E16] dark:text-gray-200">Department Team Workspace</h3>
          <p className="text-xs text-gray-400">Coordinate task allocations, list team leaders, and participate in internal team chats.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Team Members List */}
          <div className={`lg:col-span-5 p-6 rounded-2xl border space-y-4 bg-white dark:bg-[#1A1311] ${isDarkMode ? "border-gray-800" : "border-[#C09355]/20"}`}>
            <h4 className="text-xs font-extrabold uppercase text-[#B56D3E] tracking-wider border-b pb-2">Active Team Directory</h4>
            {deptTeam ? (
              <div className="space-y-3">
                <div className="p-3 bg-[#FAF5EE]/50 border border-amber-500/10 rounded-xl">
                  <span className="block text-[8px] uppercase tracking-widest text-[#B56D3E] font-extrabold">Team Leader</span>
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{deptTeam.teamLeaderId}</span>
                </div>
                <div className="space-y-2">
                  <span className="block text-[8px] uppercase tracking-widest text-gray-400 font-extrabold">Executives & Interns</span>
                  {deptTeam.memberIds.map((m, idx) => (
                    <div key={idx} className="p-2.5 border border-gray-100 rounded-xl bg-white text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {m}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-gray-400 italic">
                No active team configured for this department.
              </div>
            )}

            {/* Super admin create/edit team controls */}
            {selectedRole === "Super Admin" && (
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => {
                    setNewTeamNameInput("");
                    setNewTeamLeaderInput("Sneha Sen");
                    setIsTeamModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-1 py-2 border border-dashed border-[#B56D3E] text-[#B56D3E] hover:bg-[#B56D3E]/5 text-[10px] font-black uppercase rounded-xl transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Reconfigure Teams
                </button>
              </div>
            )}
          </div>

          {/* Internal chat room */}
          <div className="lg:col-span-7 flex flex-col justify-between min-h-[380px] bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="space-y-4">
              <span className="text-xs font-extrabold uppercase text-[#B56D3E] tracking-widest border-b pb-2 flex items-center gap-1">
                <Bell className="w-3.5 h-3.5" /> Internal Secure Channel
              </span>
              <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                {deptMessages.length === 0 ? (
                  <p className="text-[11px] text-gray-400 italic text-center py-10">No messages in department thread yet. Start the conversation!</p>
                ) : (
                  deptMessages.map(msg => (
                    <div key={msg.id} className="p-3 border border-gray-200/50 bg-[#FAF5EE]/30 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between font-bold">
                        <span className="text-[#3D1E16] dark:text-gray-150">{msg.user}</span>
                        <span className="text-[9px] text-gray-400">{msg.timestamp}</span>
                      </div>
                      <p className="text-gray-655 dark:text-gray-300 font-medium leading-relaxed">{msg.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newChatMessageText) return;
                const newMsg = {
                  id: `M-${Date.now().toString().slice(-3)}`,
                  departmentId: activeModule,
                  user: selectedRole,
                  text: newChatMessageText,
                  timestamp: new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })
                };
                setErpChatMessages([...erpChatMessages, newMsg]);
                setNewChatMessageText("");
              }}
              className="flex gap-2 pt-4 border-t border-gray-100"
            >
              <input
                type="text"
                required
                placeholder="Post updates, comments, or notes to team..."
                value={newChatMessageText}
                onChange={(e) => setNewChatMessageText(e.target.value)}
                className="flex-grow px-3.5 py-2 border border-gray-250 rounded-xl text-xs"
              />
              <button type="submit" className={`px-4 py-2 ${activeTheme.button} font-bold rounded-xl text-xs uppercase tracking-wider`}>
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const renderLogsWorkspace = () => {
    const deptLogs = erpAuditLogs.filter(l => l.departmentId === activeModule);

    return (
      <div className="space-y-6 text-left">
        <div>
          <h3 className="text-lg font-serif font-bold text-[#3D1E16] dark:text-gray-250">Department Audit Trail Logs</h3>
          <p className="text-xs text-gray-400">Verifiable logging of configuration shifts, data deletions, invoice issuances, and workflows.</p>
        </div>

        <div className={`p-6 rounded-2xl border ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"} shadow-sm`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-150 text-gray-450 font-bold uppercase pb-3">
                  <th className="pb-2">Log ID</th>
                  <th className="pb-2">Timestamp</th>
                  <th className="pb-2">Actor (Role)</th>
                  <th className="pb-2">Operation Action</th>
                  <th className="pb-2 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono text-[11px] text-gray-655 dark:text-gray-300">
                {deptLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-400 italic">No operational logs recorded.</td>
                  </tr>
                ) : (
                  deptLogs.map(log => (
                    <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 font-bold text-[#B56D3E]">{log.id}</td>
                      <td className="py-3">{log.timestamp}</td>
                      <td className="py-3 font-bold font-sans text-gray-700 dark:text-gray-250">{log.actor}</td>
                      <td className="py-3 font-bold"><span className="bg-[#C09355]/10 text-[#B56D3E] px-2 py-0.5 rounded text-[9px] uppercase">{log.action}</span></td>
                      <td className="py-3 text-right font-sans">{log.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Dynamic Renderer Dispatcher for the ERP options
  const renderActiveWorkspace = () => {
    const feat = activeSubFeature.toLowerCase();
    
    // =========================================================
    // 1. BUSINESS INTELLIGENCE (bi)
    // =========================================================
    if (activeModule === "bi") {
      const isSalesBi = feat.includes("sales") || feat.includes("revenue") || feat.includes("profit");
      const isOdopBi = feat.includes("odop") || feat.includes("district") || feat.includes("state") || feat.includes("product") || feat.includes("inventory");
      
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-5 rounded-2xl border ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"} shadow-sm flex items-center justify-between`}>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">Daily Revenue</span>
                <span className="block text-xl font-serif font-extrabold">₹3,42,800</span>
                <span className="text-[9px] font-bold text-green-600 block">↑ 14% vs Yesterday</span>
              </div>
              <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className={`p-5 rounded-2xl border ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"} shadow-sm flex items-center justify-between`}>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">Monthly Sales</span>
                <span className="block text-xl font-serif font-extrabold">₹1,12,85,900</span>
                <span className="text-[9px] font-bold text-green-600 block">↑ 22% vs Last Month</span>
              </div>
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className={`p-5 rounded-2xl border ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"} shadow-sm flex items-center justify-between`}>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">Total Orders</span>
                <span className="block text-xl font-serif font-extrabold">426 orders</span>
                <span className="text-[9px] font-bold text-green-600 block">↑ 8% this week</span>
              </div>
              <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>

            <div className={`p-5 rounded-2xl border ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"} shadow-sm flex items-center justify-between`}>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">Inventory Value</span>
                <span className="block text-xl font-serif font-extrabold">₹67,82,450</span>
                <span className="text-[9px] font-bold text-amber-600 block">3 warnings remaining</span>
              </div>
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </div>

          {isSalesBi && (
            <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Sales & Revenue Report Breakdown</h3>
              <div className="space-y-3.5">
                {[
                  { segment: "Direct Website Checkout", sales: "₹72,40,900", count: 284, pct: 64 },
                  { segment: "POS Offline Store Counter", sales: "₹31,50,000", count: 122, pct: 28 },
                  { segment: "Artisan Bulk B2B Sourcing", sales: "₹8,95,000", count: 20, pct: 8 }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center font-bold">
                      <span>{item.segment}</span>
                      <span className="text-gray-500">{item.sales} ({item.count} orders)</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div style={{ width: `${item.pct}%` }} className={`bg-[#B56D3E] h-full rounded-full`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isOdopBi && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`lg:col-span-2 p-6 rounded-2xl border space-y-6 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
                <div>
                  <h3 className="text-sm font-serif font-bold">State Sourcing & Sales Distribution</h3>
                  <p className="text-[11px] text-gray-400 font-semibold uppercase">ODOP Crafts volume by top production clusters</p>
                </div>
                <div className="space-y-3.5">
                  {[
                    { state: "Uttar Pradesh", value: "₹45,80,000", pct: 85, color: "from-orange-500 to-amber-500" },
                    { state: "Rajasthan", value: "₹34,12,000", pct: 72, color: "from-blue-600 to-cyan-400" },
                    { state: "Bihar", value: "₹24,90,000", pct: 58, color: "from-emerald-600 to-teal-400" },
                    { state: "West Bengal", value: "₹18,20,000", pct: 40, color: "from-purple-600 to-indigo-400" }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between items-center font-bold">
                        <span>{item.state}</span>
                        <span className="text-gray-500">{item.value} ({item.pct}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                        <div style={{ width: `${item.pct}%` }} className={`bg-gradient-to-r ${item.color} h-full rounded-full`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-6 rounded-2xl border space-y-6 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
                <div>
                  <h3 className="text-sm font-serif font-bold">Vendor & Artisan Efficiency</h3>
                  <p className="text-[11px] text-gray-400 font-semibold uppercase">Average fulfillment delivery rankings</p>
                </div>
                <div className="space-y-4">
                  {[
                    { name: "Banaras Silk Weaver Coop.", rate: "4.9/5", task: "98% on-time" },
                    { name: "Saharsa Makhana Farmers", rate: "4.7/5", task: "92% on-time" },
                    { name: "Kutch Bhujodi Weavers Guild", rate: "4.8/5", task: "94% on-time" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2.5 border border-gray-250/40 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div>
                        <span className="block font-bold leading-tight">{item.name}</span>
                        <span className="block text-[10px] text-gray-400 font-semibold">{item.task}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">{item.rate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!isSalesBi && !isOdopBi && (
            <div className={`p-6 rounded-2xl border ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E] mb-2">{activeSubFeature} Analysis</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                This BI module segments your enterprise dashboard queries dynamically. Selected state filters ({biFilterState}) and category scopes ({biFilterCategory}) have been loaded into memory to compute simulated analytics charts.
              </p>
            </div>
          )}
        </div>
      );
    }

    // =========================================================
    // 2. SALES DEPARTMENT (sales)
    // =========================================================
    if (activeModule === "sales") {
      if (feat.includes("lead")) {
        return (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Create Sourcing/Customer Lead</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newLeadName || !newLeadValue) return;
                  const newLead = {
                    id: `L-${Date.now().toString().slice(-3)}`,
                    name: newLeadName,
                    email: `${newLeadName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
                    phone: "+91 99999 00000",
                    product: newLeadProduct,
                    value: parseFloat(newLeadValue) || 0,
                    source: newLeadSource,
                    status: "New"
                  };
                  setLeadsList([newLead, ...leadsList]);
                  setNewLeadName("");
                  setNewLeadValue("");
                  showToast(`Lead created successfully for ${newLeadName}`);
                }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs"
              >
                <input
                  type="text"
                  required
                  placeholder="Customer/Lead Name"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  className="px-3 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                />
                <select
                  value={newLeadProduct}
                  onChange={(e) => setNewLeadProduct(e.target.value)}
                  className="px-3 py-2 border rounded-xl dark:bg-gray-800 text-gray-650 cursor-pointer"
                >
                  <option value="Jaipur Blue Pottery">Jaipur Blue Pottery</option>
                  <option value="Banarasi Silk Saree">Banarasi Silk Saree</option>
                  <option value="Bhagalpur Makhana">Bhagalpur Makhana</option>
                  <option value="Terracotta Horse">Terracotta Horse</option>
                </select>
                <input
                  type="number"
                  required
                  placeholder="Budget Value (₹)"
                  value={newLeadValue}
                  onChange={(e) => setNewLeadValue(e.target.value)}
                  className="px-3 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                />
                <button type="submit" className={`py-2 px-4 ${activeTheme.button} font-bold rounded-xl`}>
                  Create Lead
                </button>
              </form>
            </div>

            <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Sales Leads Master</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-150 text-gray-400 font-bold uppercase pb-3">
                      <th className="pb-2">Lead ID</th>
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Target Product</th>
                      <th className="pb-2">Value</th>
                      <th className="pb-2">Channel</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {leadsList.map(lead => (
                      <tr key={lead.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-2.5 font-mono font-bold">{lead.id}</td>
                        <td className="py-2.5">
                          <span className="block font-bold">{lead.name}</span>
                          <span className="block text-[10px] text-gray-400 font-semibold">{lead.email}</span>
                        </td>
                        <td className="py-2.5 font-semibold">{lead.product}</td>
                        <td className="py-2.5 font-bold">₹{lead.value.toLocaleString()}</td>
                        <td className="py-2.5 uppercase font-bold text-[10px] text-amber-600">{lead.source}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            lead.status === "New" ? "bg-blue-100 text-blue-800" : lead.status === "Qualified" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }

      if (feat.includes("pos") || feat.includes("checkout") || feat.includes("interface")) {
        const cartTotal = posCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className={`lg:col-span-5 p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Cashier POS Terminals</h3>
              <form onSubmit={handleAddToPosCart} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-400 uppercase text-[10px] mb-1">Select Product</label>
                  <select
                    value={posSelectedProduct}
                    onChange={(e) => setPosSelectedProduct(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl dark:bg-gray-800 text-gray-650 cursor-pointer"
                  >
                    {productsMaster.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} (₹{p.price} | Stock: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-400 uppercase text-[10px] mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={posQuantity}
                    onChange={(e) => setPosQuantity(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                  />
                </div>
                <button type="submit" className={`w-full py-2.5 ${activeTheme.button} font-bold rounded-xl`}>
                  Add to Cart
                </button>
              </form>
            </div>

            <div className={`lg:col-span-7 p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E] flex justify-between items-center">
                <span>Active Cart</span>
                <span className="font-sans font-black text-base">₹{cartTotal.toLocaleString()}</span>
              </h3>
              {posCart.length === 0 ? (
                <div className="text-center text-xs text-gray-400 py-10">POS Cart is empty. Select products to checkout.</div>
              ) : (
                <div className="space-y-3.5">
                  <div className="max-h-[200px] overflow-y-auto space-y-2 pr-1 text-xs">
                    {posCart.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2.5 border border-gray-200/20 rounded-xl bg-white/5">
                        <div>
                          <span className="block font-bold">{item.name}</span>
                          <span className="block text-[10px] text-gray-400 font-semibold">{item.quantity}x @ ₹{item.price}</span>
                        </div>
                        <span className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handlePosCheckout}
                    className={`w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-sm`}
                  >
                    Complete Checkout Transaction
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      }

      // Default sales view is invoices/orders list
      return (
        <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
          <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Invoices & Billings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-150 text-gray-400 font-bold uppercase pb-3">
                  <th className="pb-2">Invoice ID</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Billing Amount</th>
                  <th className="pb-2">Invoice Date</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoicesList.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-2.5 font-mono font-bold">{inv.id}</td>
                    <td className="py-2.5 font-semibold text-gray-700 dark:text-gray-250">{inv.customer}</td>
                    <td className="py-2.5 font-bold">₹{inv.amount.toLocaleString()}</td>
                    <td className="py-2.5 font-semibold text-gray-500">{inv.date}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                        inv.status === "PAID" ? "bg-green-100 text-green-700" : inv.status === "PENDING" ? "bg-yellow-100 text-yellow-750" : "bg-red-100 text-red-700"
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // =========================================================
    // 3. PURCHASE DEPARTMENT (purchase)
    // =========================================================
    if (activeModule === "purchase") {
      if (feat.includes("rfq") || feat.includes("quote")) {
        return (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Create RFQ (Request for Quote)</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newRfqProduct || !newRfqQty) return;
                  const newRfq = {
                    id: `RFQ-${Date.now().toString().slice(-4)}`,
                    product: newRfqProduct,
                    quantity: parseInt(newRfqQty) || 10,
                    budget: parseFloat(newRfqBudget) || 1000,
                    vendorA: newRfqVendorA || "Local Supplier A",
                    vendorB: newRfqVendorB || "State Sourcing B",
                    terms: "30 Days Credit",
                    status: "Awaiting Bids"
                  };
                  setRfqsList([newRfq, ...rfqsList]);
                  setNewRfqProduct("");
                  setNewRfqQty("");
                  setNewRfqBudget("");
                  setNewRfqVendorA("");
                  setNewRfqVendorB("");
                  showToast(`RFQ issued successfully for ${newRfqProduct}`);
                }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs"
              >
                <input
                  type="text"
                  required
                  placeholder="Target Craft Product"
                  value={newRfqProduct}
                  onChange={(e) => setNewRfqProduct(e.target.value)}
                  className="px-3 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                />
                <input
                  type="number"
                  required
                  placeholder="Volume quantity"
                  value={newRfqQty}
                  onChange={(e) => setNewRfqQty(e.target.value)}
                  className="px-3 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                />
                <input
                  type="number"
                  required
                  placeholder="Target budget (₹)"
                  value={newRfqBudget}
                  onChange={(e) => setNewRfqBudget(e.target.value)}
                  className="px-3 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Artisan Coop Bidder A"
                  value={newRfqVendorA}
                  onChange={(e) => setNewRfqVendorA(e.target.value)}
                  className="px-3 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Artisan Coop Bidder B"
                  value={newRfqVendorB}
                  onChange={(e) => setNewRfqVendorB(e.target.value)}
                  className="px-3 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                />
                <button type="submit" className={`py-2 px-4 ${activeTheme.button} font-bold rounded-xl`}>
                  Issue RFQ
                </button>
              </form>
            </div>

            <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Open RFQs</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-150 text-gray-400 font-bold uppercase pb-3">
                      <th className="pb-2">RFQ ID</th>
                      <th className="pb-2">Spec Craft</th>
                      <th className="pb-2">Quantity</th>
                      <th className="pb-2">Bid A</th>
                      <th className="pb-2">Bid B</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[11px]">
                    {rfqsList.map(rfq => (
                      <tr key={rfq.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-2.5 font-mono font-bold">{rfq.id}</td>
                        <td className="py-2.5 font-semibold text-gray-800 dark:text-gray-250">{rfq.product}</td>
                        <td className="py-2.5 font-bold">{rfq.quantity} units</td>
                        <td className="py-2.5 text-green-600 font-semibold">{rfq.vendorA}</td>
                        <td className="py-2.5 text-gray-500 font-semibold">{rfq.vendorB}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                            rfq.status === "Bids Received" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-750"
                          }`}>
                            {rfq.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }

      // Default View: RFQ Comparison table
      return (
        <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
          <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Artisan RFQ Comparison Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase pb-2 tracking-wider">
                  <th className="pb-3">RFQ ID</th>
                  <th className="pb-3">Product Spec</th>
                  <th className="pb-3">Artisan Proposal A</th>
                  <th className="pb-3">Artisan Proposal B</th>
                  <th className="pb-3">Vendor Payment Terms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[11px]">
                {rfqsList.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 font-bold font-mono">{item.id}</td>
                    <td className="py-3 font-semibold text-gray-700 dark:text-gray-300">{item.product}</td>
                    <td className="py-3 text-emerald-600 font-semibold">{item.vendorA}</td>
                    <td className="py-3 text-gray-500 font-semibold">{item.vendorB}</td>
                    <td className="py-3 font-semibold text-gray-650">{item.terms}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // =========================================================
    // 4. FINANCE DEPARTMENT (finance)
    // =========================================================
    if (activeModule === "finance") {
      const isBalanceSheet = feat.includes("balance") || feat.includes("sheet") || feat.includes("profit") || feat.includes("loss");
      
      if (isBalanceSheet) {
        return (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Company Balance Sheet Statement</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-semibold leading-loose">
                <div className="p-4 border border-gray-200/25 rounded-xl bg-white/5">
                  <h4 className="font-serif font-bold text-amber-500 uppercase mb-2">Assets</h4>
                  <div className="flex justify-between border-b border-gray-100/10 py-1">
                    <span>Cash & Bank Balances:</span>
                    <span>₹1,01,70,050</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100/10 py-1">
                    <span>Accounts Receivable:</span>
                    <span>₹4,50,000</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100/10 py-1">
                    <span>Inventory Value:</span>
                    <span>₹67,82,450</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#3D1E16] dark:text-white pt-2 text-sm">
                    <span>Total Assets:</span>
                    <span>₹1,74,02,500</span>
                  </div>
                </div>

                <div className="p-4 border border-gray-200/25 rounded-xl bg-white/5">
                  <h4 className="font-serif font-bold text-amber-500 uppercase mb-2">Liabilities & Equity</h4>
                  <div className="flex justify-between border-b border-gray-100/10 py-1">
                    <span>Accounts Payable:</span>
                    <span>₹2,84,000</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100/10 py-1">
                    <span>GST & Tax Liabilities:</span>
                    <span>₹3,40,900</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100/10 py-1">
                    <span>Retained Earnings (Equity):</span>
                    <span>₹1,67,77,600</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#3D1E16] dark:text-white pt-2 text-sm">
                    <span>Total Liabilities & Equity:</span>
                    <span>₹1,74,02,500</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // Default view: ledger summary
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-5 rounded-2xl border text-center space-y-2 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">Main Cash Book</span>
              <span className="block text-2xl font-serif font-extrabold text-[#B56D3E]">₹12,45,900</span>
              <span className="text-[10px] text-gray-400 block font-mono">Synced: Today 01:30 AM</span>
            </div>

            <div className={`p-5 rounded-2xl border text-center space-y-2 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">Bank Account (SBI Ledger)</span>
              <span className="block text-2xl font-serif font-extrabold text-blue-600">₹89,24,150</span>
              <span className="text-[10px] text-gray-400 block font-mono">Linked Direct API</span>
            </div>

            <div className={`p-5 rounded-2xl border text-center space-y-2 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">GST Liability Balance</span>
              <span className="block text-2xl font-serif font-extrabold text-red-650">₹3,40,900</span>
              <span className="text-[10px] text-gray-400 block font-mono">Next Filing: 20 JUL</span>
            </div>
          </div>
        </div>
      );
    }

    // =========================================================
    // 5. INVENTORY & STORAGE (inventory)
    // =========================================================
    if (activeModule === "inventory") {
      if (feat.includes("barcode") || feat.includes("qr") || feat.includes("scanner")) {
        return (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Barcode & QR Code Generator</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!barcodeInput) return;
                  setGeneratedBarcode(barcodeInput.toUpperCase());
                  showToast(`Simulated code generated for key: ${barcodeInput}`);
                }}
                className="flex gap-4 text-xs"
              >
                <input
                  type="text"
                  required
                  placeholder="SKU or SKU barcode text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white font-mono"
                />
                <button type="submit" className={`py-2 px-4 ${activeTheme.button} font-bold rounded-xl`}>
                  Generate Codes
                </button>
              </form>
              
              {generatedBarcode && (
                <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-300 rounded-2xl space-y-3 bg-white dark:bg-gray-905">
                  <span className="text-xs font-bold text-gray-400">GENERATED BARCODE (SIMULATION)</span>
                  <div className="flex items-center gap-[2px] h-14 w-60 bg-white border border-gray-100 p-2 justify-center">
                    {[3,1,4,1,2,5,3,2,1,4,2,3,1,5,2,1,4,2,3,1,4,1,2].map((w, idx) => (
                      <div key={idx} style={{ width: `${w}px` }} className="bg-black h-full" />
                    ))}
                  </div>
                  <span className="font-mono font-bold text-sm tracking-widest text-[#3D1E16] dark:text-gray-100">{generatedBarcode}</span>
                </div>
              )}
            </div>
          </div>
        );
      }

      // Default stock list view
      return (
        <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-805" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
          <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Multi-Warehouse Stock Tracking</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-150 text-gray-400 font-bold uppercase pb-3">
                  <th className="pb-2">SKU ID</th>
                  <th className="pb-2">Product Name</th>
                  <th className="pb-2">Base Price</th>
                  <th className="pb-2">Warehouse Stock</th>
                  <th className="pb-2">Sourcing Region</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {productsMaster.map(prod => (
                  <tr key={prod.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-2.5 font-mono font-bold">{prod.id}</td>
                    <td className="py-2.5 font-semibold text-gray-800 dark:text-gray-250">{prod.name}</td>
                    <td className="py-2.5 font-bold">₹{prod.price.toLocaleString()}</td>
                    <td className="py-2.5">
                      <span className={`font-black font-mono ${prod.stock < 5 ? "text-red-500 font-black animate-pulse" : "text-green-600"}`}>
                        {prod.stock} units
                      </span>
                    </td>
                    <td className="py-2.5 font-semibold text-gray-500">{prod.state}</td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => {
                          const newStock = prompt(`Update stock count for ${prod.name}:`, String(prod.stock));
                          if (newStock !== null) {
                            const parsed = parseInt(newStock);
                            if (!isNaN(parsed)) {
                              fetch("/api/admin/products", {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id: prod.id, stock: parsed })
                              }).then(res => {
                                if (res.ok) {
                                  setProductsMaster(productsMaster.map(p => p.id === prod.id ? { ...p, stock: parsed } : p));
                                  showToast(`Updated stock count for ${prod.name} to ${parsed}.`);
                                } else {
                                  showToast("Failed to update stock in database.");
                                }
                              });
                            }
                          }
                        }}
                        className="px-2.5 py-1 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded text-[10px] font-bold"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // =========================================================
    // 6. PRODUCT MANAGEMENT (product)
    // =========================================================
    if (activeModule === "product") {
      if (feat.includes("master") || feat.includes("registry")) {
        return (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Onboard New Heritage Craft</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newProductName || !newProductPrice) return;
                  
                  const slug = newProductName.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
                  const sku = `CC-${newProductState.toUpperCase().slice(0,3)}-${slug.toUpperCase().slice(0,6)}-${Date.now().toString().slice(-4)}`;

                  fetch("/api/admin/products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: newProductName,
                      sku,
                      slug,
                      price: parseFloat(newProductPrice) || 0,
                      stock: parseInt(newProductStock) || 0
                    })
                  }).then(res => {
                    if (res.ok) {
                      // Reload products master list from database
                      fetch("/api/admin/products")
                        .then(r => r.json())
                        .then(data => {
                          setProductsMaster(data.map((p: any) => ({
                            id: p.id,
                            name: p.name,
                            price: p.price,
                            stock: p.stock,
                            state: p.district?.state?.name || "State",
                            active: p.isActive
                          })));
                          showToast(`Product ${newProductName} added to registry.`);
                        });
                    } else {
                      showToast("Failed to onboard product in database.");
                    }
                  });

                  setNewProductName("");
                  setNewProductPrice("");
                  setNewProductStock("");
                }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-xs"
              >
                <input
                  type="text"
                  required
                  placeholder="Craft Product Name"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="px-3 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                />
                <input
                  type="number"
                  required
                  placeholder="Retail Price (₹)"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  className="px-3 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                />
                <input
                  type="number"
                  required
                  placeholder="Starting stock volume"
                  value={newProductStock}
                  onChange={(e) => setNewProductStock(e.target.value)}
                  className="px-3 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                />
                <select
                  value={newProductState}
                  onChange={(e) => setNewProductState(e.target.value)}
                  className="px-3 py-2 border rounded-xl dark:bg-gray-800 text-gray-655 cursor-pointer"
                >
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Bihar">Bihar</option>
                  <option value="West Bengal">West Bengal</option>
                </select>
                <button type="submit" className={`py-2 px-4 ${activeTheme.button} font-bold rounded-xl`}>
                  Onboard Craft
                </button>
              </form>
            </div>

            <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Product Master registry</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-150 text-gray-400 font-bold uppercase pb-3">
                      <th className="pb-2">Product ID</th>
                      <th className="pb-2">Craft Name</th>
                      <th className="pb-2">Price</th>
                      <th className="pb-2">Stock</th>
                      <th className="pb-2">Origin State</th>
                      <th className="pb-2">Active Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {productsMaster.map(prod => (
                      <tr key={prod.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-2.5 font-mono font-bold">{prod.id}</td>
                        <td className="py-2.5 font-semibold">{prod.name}</td>
                        <td className="py-2.5 font-bold">₹{prod.price.toLocaleString()}</td>
                        <td className="py-2.5 font-mono font-semibold">{prod.stock} units</td>
                        <td className="py-2.5 font-semibold text-gray-550">{prod.state}</td>
                        <td className="py-2.5">
                          <button
                            onClick={() => {
                              setProductsMaster(productsMaster.map(p => p.id === prod.id ? { ...p, active: !p.active } : p));
                              showToast(`Product ${prod.name} active status toggled.`);
                            }}
                            className={`px-3 py-1 rounded-full text-[9px] font-bold ${
                              prod.active ? "bg-green-150 text-green-700 border border-green-200" : "bg-gray-150 text-gray-550 border border-gray-200"
                            }`}
                          >
                            {prod.active ? "Active" : "Inactive"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }

      if (feat.includes("recommendation") || feat.includes("config")) {
        return (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E] uppercase tracking-wider">Dynamic Recommendation Weights</h3>
              <p className="text-[11px] text-gray-400">Configure matching tolerances and catalog priority biases for discovery lists.</p>
              
              <div className="space-y-4 pt-2 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Category Match weight:</span>
                    <span>70%</span>
                  </div>
                  <input type="range" min="0" max="100" defaultValue="70" className="w-full h-1 bg-[#C09355]/30 rounded-lg appearance-none cursor-pointer accent-[#B56D3E]" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Origin District Bias:</span>
                    <span>85%</span>
                  </div>
                  <input type="range" min="0" max="100" defaultValue="85" className="w-full h-1 bg-[#C09355]/30 rounded-lg appearance-none cursor-pointer accent-[#B56D3E]" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Retail Price Margin Tolerance:</span>
                    <span>±20%</span>
                  </div>
                  <input type="range" min="0" max="50" defaultValue="20" className="w-full h-1 bg-[#C09355]/30 rounded-lg appearance-none cursor-pointer accent-[#B56D3E]" />
                </div>

                <button onClick={() => showToast("Recommendation weights saved successfully!")} className={`py-2 px-4 ${activeTheme.button} font-bold rounded-xl`}>
                  Save Formulas Weights
                </button>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E] uppercase tracking-wider">Configure Frequently Bought Together Bundles</h3>
              <div className="space-y-3 pt-2 text-xs">
                {[
                  { name: "Jaipur Pottery Combo", items: "Vase + Indigo Cups", discount: "10% Bundle Discount", status: "Active" },
                  { name: "Banaras Weaving Combo", items: "Katan Silk Saree + Zari Brocade Shawl", discount: "15% Bundle Discount", status: "Active" }
                ].map((bundle, i) => (
                  <div key={i} className="p-3 border rounded-xl bg-white dark:bg-gray-800 flex justify-between items-center">
                    <div>
                      <strong className="block text-[#3D1E16] dark:text-gray-150">{bundle.name}</strong>
                      <span className="text-[10px] text-gray-400 font-semibold">{bundle.items} • {bundle.discount}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 font-bold border border-green-200 uppercase text-[8px]">{bundle.status}</span>
                  </div>
                ))}
                <button onClick={() => showToast("Bundle configuration updated.")} className={`py-2 px-4 ${activeTheme.button} font-bold rounded-xl`}>
                  Manage Product Bundles
                </button>
              </div>
            </div>
          </div>
        );
      }

      // Default: show the variants approval flow pipeline
      return (
        <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
          <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Product Variant Approval Pipeline</h3>
          <div className="space-y-3">
            {[
              { name: "Madhubani Wall Frame", variant: "Medium / Black Border", code: "BH-MAD-ATT-092", state: "Bihar", status: "Awaiting CEO Approval" },
              { name: "Banarasi Handwoven Saree", variant: "Red Silk / Gold Zari", code: "UP-VAR-TEX-124", state: "Uttar Pradesh", status: "Awaiting Owner Signoff" }
            ].map((item, idx) => (
              <div key={idx} className="p-3 border border-gray-250/60 rounded-xl bg-white dark:bg-gray-800 flex flex-col sm:flex-row justify-between sm:items-center text-xs gap-3">
                <div>
                  <span className="font-bold text-[#3D1E16] dark:text-gray-150 block">{item.name}</span>
                  <span className="text-[10px] text-gray-450 block font-mono">SKU: {item.code} | {item.variant}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded border border-amber-200">
                    {item.status}
                  </span>
                  <button
                    onClick={() => showToast(`Approved variant: ${item.name}`)}
                    className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-[10px] font-bold shadow-sm transition-colors"
                  >
                    Approve Listing
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // =========================================================
    // 7. CUSTOMER CRM (customer)
    // =========================================================
    if (activeModule === "customer") {
      if (feat.includes("wallet") || feat.includes("loyalty")) {
        return (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E]">CRM Loyalty Points wallet</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="p-4 border border-gray-200/20 rounded-xl bg-white/5">
                  <h4 className="font-serif font-bold text-amber-500 mb-2">Issue Reward Points</h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => showToast("Credited 500 bonus points to Abhishek Auraic's wallet.")}
                      className={`w-full py-2 ${activeTheme.button} font-bold rounded-xl`}
                    >
                      Credit 500 pts to Owner User
                    </button>
                    <button
                      onClick={() => showToast("Credited 250 bonus points to Aarav Sharma's wallet.")}
                      className={`w-full py-2 ${activeTheme.button} font-bold rounded-xl`}
                    >
                      Credit 250 pts to Aarav Sharma
                    </button>
                  </div>
                </div>
                <div className="p-4 border border-gray-200/20 rounded-xl bg-white/5 flex flex-col justify-center text-center space-y-1">
                  <span className="block text-gray-400 uppercase text-[10px]">Active Wallets Balance</span>
                  <span className="block text-3xl font-serif font-black text-emerald-600">₹3,40,200</span>
                  <span className="block text-[10px] text-gray-450">Across 1,540 registered customer profiles</span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // Default: customer database view
      return (
        <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
          <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Customer Registry profiles</h3>
          <div className="space-y-3 text-xs">
            {[
              { name: "Abhishek Auraic", email: "owner@auraic.in", state: "Uttar Pradesh", orderCount: "12 orders", spending: "₹2,45,900" },
              { name: "Aarav Sharma", email: "aarav@gmail.com", state: "Uttar Pradesh", orderCount: "3 orders", spending: "₹18,400" },
              { name: "Meera Patel", email: "meera.patel@gmail.com", state: "Gujarat", orderCount: "8 orders", spending: "₹65,200" }
            ].map((c, idx) => (
              <div key={idx} className="p-3 border border-gray-250/50 rounded-xl bg-white dark:bg-gray-800 flex justify-between items-center">
                <div>
                  <span className="font-bold block text-gray-800 dark:text-gray-150">{c.name}</span>
                  <span className="text-[10px] text-gray-400 block font-mono">{c.email} | {c.state}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold block text-amber-500">{c.spending}</span>
                  <span className="text-[10px] text-gray-455 block font-semibold">{c.orderCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // =========================================================
    // 8. HUMAN RESOURCES (hr)
    // =========================================================
    if (activeModule === "hr") {
      if (feat.includes("registry") || feat.includes("employee")) {
        return (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Onboard Corporate Employee</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newEmpName || !newEmpPost || !newEmpSalary) return;
                  const newEmp = {
                    id: `EMP-${Date.now().toString().slice(-2)}`,
                    name: newEmpName,
                    post: newEmpPost,
                    dept: newEmpDept,
                    attendance: "100% Present",
                    salary: parseFloat(newEmpSalary) || 25000
                  };
                  setEmployeeRegistry([...employeeRegistry, newEmp]);
                  setNewEmpName("");
                  setNewEmpPost("");
                  setNewEmpSalary("");
                  showToast(`Employee ${newEmpName} successfully onboarded.`);
                }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-xs"
              >
                <input
                  type="text"
                  required
                  placeholder="Employee Name"
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  className="px-3 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Designation Post"
                  value={newEmpPost}
                  onChange={(e) => setNewEmpPost(e.target.value)}
                  className="px-3 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                />
                <select
                  value={newEmpDept}
                  onChange={(e) => setNewEmpDept(e.target.value)}
                  className="px-3 py-2 border rounded-xl dark:bg-gray-800 text-gray-655 cursor-pointer"
                >
                  {DEPARTMENTS_PURPOSES.map(d => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  required
                  placeholder="Salary (₹/month)"
                  value={newEmpSalary}
                  onChange={(e) => setNewEmpSalary(e.target.value)}
                  className="px-3 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                />
                <button type="submit" className={`py-2 px-4 ${activeTheme.button} font-bold rounded-xl`}>
                  Onboard
                </button>
              </form>
            </div>

            <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Corporate Employee Registry</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-150 text-gray-400 font-bold uppercase pb-3">
                      <th className="pb-2">EMP ID</th>
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Designation</th>
                      <th className="pb-2">Department</th>
                      <th className="pb-2">Salary</th>
                      <th className="pb-2">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {employeeRegistry.map(emp => (
                      <tr key={emp.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-2.5 font-mono font-bold">{emp.id}</td>
                        <td className="py-2.5 font-bold">{emp.name}</td>
                        <td className="py-2.5 font-semibold text-gray-600 dark:text-gray-300">{emp.post}</td>
                        <td className="py-2.5">
                          <span className="bg-[#C09355]/10 text-[#B56D3E] font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                            {emp.dept}
                          </span>
                        </td>
                        <td className="py-2.5 font-bold">₹{emp.salary.toLocaleString()}</td>
                        <td className="py-2.5 font-semibold text-green-600">{emp.attendance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }

      if (feat.includes("department")) {
        return (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <div className="flex justify-between items-center border-b pb-2 border-gray-150/50 dark:border-gray-850">
                <div>
                  <h3 className="text-sm font-serif font-bold text-[#B56D3E] uppercase tracking-wider">Enterprise Corporate Departments</h3>
                  <p className="text-xs text-gray-400">Master configuration registry of the organizational departments and business units.</p>
                </div>
                <span className="bg-[#B56D3E]/10 text-[#B56D3E] font-extrabold px-3 py-1 rounded-full text-xs">
                  {DEPARTMENTS_PURPOSES.length} Total Units
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DEPARTMENTS_PURPOSES.map((dept, index) => (
                  <div key={index} className="p-4 border rounded-xl bg-white dark:bg-gray-805 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-5 h-5 rounded bg-[#C09355]/10 text-[#B56D3E] flex items-center justify-center font-bold text-xs">{index + 1}</span>
                        <strong className="text-sm text-gray-850 dark:text-gray-150 font-bold block">{dept.name}</strong>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-300 leading-relaxed font-semibold">
                        {dept.purpose || (dept as any).focus || "General operational department capabilities."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      if (feat.includes("designation")) {
        return (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <div className="flex justify-between items-center border-b pb-2 border-gray-150/50 dark:border-gray-850">
                <div>
                  <h3 className="text-sm font-serif font-bold text-[#B56D3E] uppercase tracking-wider">Corporate Designations Registry</h3>
                  <p className="text-xs text-gray-400">Registered payroll designations and organizational departments mapping.</p>
                </div>
                <span className="bg-[#B56D3E]/10 text-[#B56D3E] font-extrabold px-3 py-1 rounded-full text-xs">
                  {erpJobRoles.length} Active Designations
                </span>
              </div>
              <div className="space-y-3">
                {erpJobRoles.map((role) => (
                  <div key={role.id} className="p-3 border rounded-xl bg-white dark:bg-gray-855 flex justify-between items-center text-xs">
                    <div>
                      <strong className="block text-[#3D1E16] dark:text-gray-150">{role.title}</strong>
                      <span className="text-[10px] text-gray-400 font-semibold">Department: {role.department}</span>
                    </div>
                    <span className="text-[9px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded border border-amber-200">
                      ID: {role.id}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      // Default HR view is general registry info
      return (
        <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
          <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Employee designation registry</h3>
          <div className="space-y-2 text-xs">
            {employeeRegistry.map((emp, i) => (
              <div key={i} className="flex justify-between items-center p-3 border border-gray-250/60 rounded-xl bg-white dark:bg-gray-800">
                <div>
                  <span className="font-bold text-[#3D1E16] dark:text-gray-150 block">{emp.name}</span>
                  <span className="text-[10px] text-gray-400 font-semibold">{emp.post} • {emp.dept}</span>
                </div>
                <span className="text-[9px] bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded border border-green-200">
                  {emp.attendance}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // =========================================================
    // 9. PAYROLL CONSOLE (payroll)
    // =========================================================
    if (activeModule === "payroll") {
      if (feat.includes("structure")) {
        return (
          <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
            <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Corporate Salary Structure Matrix</h3>
            <p className="text-xs text-gray-400">Designation-wise basic wages, allowances, and statutory deductions (EPF/ESI).</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-150 text-gray-400 font-bold pb-2">
                    <th>Designation</th>
                    <th>Base Salary</th>
                    <th>HRA Allowance</th>
                    <th>Special Allowance</th>
                    <th>EPF Deduction</th>
                    <th>ESI Deduction</th>
                    <th className="text-right">Net Payable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-2.5 font-bold font-sans">Super Admin</td>
                    <td>₹85,000</td>
                    <td>₹15,000</td>
                    <td>₹10,000</td>
                    <td>₹10,200</td>
                    <td>₹637</td>
                    <td className="text-right font-bold text-green-600">₹99,163</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-2.5 font-bold font-sans">Manager</td>
                    <td>₹45,000</td>
                    <td>₹8,000</td>
                    <td>₹5,000</td>
                    <td>₹5,400</td>
                    <td>₹337</td>
                    <td className="text-right font-bold text-green-600">₹52,263</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-2.5 font-bold font-sans">Executive</td>
                    <td>₹25,000</td>
                    <td>₹4,500</td>
                    <td>₹2,500</td>
                    <td>₹3,000</td>
                    <td>₹187</td>
                    <td className="text-right font-bold text-green-600">₹28,813</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      if (feat.includes("pf") || feat.includes("tracking") || feat.includes("provident")) {
        return (
          <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
            <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Employees Provident Fund (EPF) Tracker</h3>
            <p className="text-xs text-gray-400">Monthly statutory accumulations and employer matching.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-150 text-gray-400 font-bold pb-2">
                    <th>Employee ID</th>
                    <th>Employee Name</th>
                    <th>Salary Base</th>
                    <th>Employee Cont. (12%)</th>
                    <th>Employer Cont. (12%)</th>
                    <th className="text-right">Accumulated Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                  {employeeRegistry.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50/50">
                      <td className="py-2.5 font-bold">{emp.id}</td>
                      <td className="py-2.5 font-bold font-sans">{emp.name}</td>
                      <td>₹{emp.salary.toLocaleString()}</td>
                      <td className="text-blue-600">₹{(emp.salary * 0.12).toLocaleString()}</td>
                      <td className="text-amber-700">₹{(emp.salary * 0.12).toLocaleString()}</td>
                      <td className="text-right font-bold text-green-600">₹{(emp.salary * 0.24).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      if (feat.includes("esi") || feat.includes("scheme")) {
        return (
          <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
            <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Employee State Insurance (ESI) Scheme</h3>
            <p className="text-xs text-gray-400">ESI medical eligibility and corporate insurance status tracking.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-150 text-gray-400 font-bold pb-2">
                    <th>Insurance ID</th>
                    <th>Insured Person</th>
                    <th>Salary</th>
                    <th>Employee Share (0.75%)</th>
                    <th>Employer Share (3.25%)</th>
                    <th className="text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                  {employeeRegistry.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50/50">
                      <td className="py-2.5 font-bold">ESI-{emp.id.split("-")[1] || "99"}</td>
                      <td className="py-2.5 font-bold font-sans">{emp.name}</td>
                      <td>₹{emp.salary.toLocaleString()}</td>
                      <td className="text-blue-600">₹{(emp.salary * 0.0075).toLocaleString()}</td>
                      <td className="text-amber-700">₹{(emp.salary * 0.0325).toLocaleString()}</td>
                      <td className="text-right text-green-600 font-bold">ACTIVE COVERED</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      if (feat.includes("tax") || feat.includes("declaration")) {
        return (
          <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
            <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Employee IT Declarations & Tax Slabs</h3>
            <p className="text-xs text-gray-400">Overview of chosen regimes (FY 2026-27) and pending 80C/80D investment proofs.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-150 text-gray-400 font-bold pb-2">
                    <th>Employee</th>
                    <th>Regime Option</th>
                    <th>Declared Investments</th>
                    <th>Taxable Income</th>
                    <th>Deduction Proofs</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-2.5 font-bold font-sans">Rohit Deshpande</td>
                    <td className="text-blue-600 font-bold">New Regime (Default)</td>
                    <td>₹0 (Not applicable)</td>
                    <td>₹5,40,000</td>
                    <td className="text-green-600 font-bold">Auto-approved</td>
                    <td className="text-right"><button className="text-[10px] text-gray-400 hover:text-gray-600">View</button></td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-2.5 font-bold font-sans">Sneha Sen</td>
                    <td className="text-amber-600 font-bold">Old Regime</td>
                    <td>₹1,50,000 (80C)</td>
                    <td>₹2,70,000</td>
                    <td className="text-amber-500 font-bold">Awaiting Audit</td>
                    <td className="text-right"><button onClick={() => showToast("Approved Sneha's investment proof.")} className="text-[10px] text-amber-600 hover:text-amber-700 font-bold">Verify Proofs</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      // Default: Dispatcher console
      return (
        <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
          <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Monthly Payslip Dispatcher & ESI Console</h3>
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-bold block">Payroll Batch: July 2026</span>
              <span className="text-[10px] text-gray-400">Total volume: {employeeRegistry.length} active corporate employees</span>
            </div>
            <button
              onClick={() => showToast(`Dispatched ${employeeRegistry.length} payslips to employee corporate emails.`)}
              className={`px-3 py-1.5 ${activeTheme.button} text-xs font-bold rounded-xl shadow`}
            >
              Release Salary & Payslips
            </button>
          </div>
        </div>
      );
    }

    // =========================================================
    // 10. MARKETING & PROMOS (marketing)
    // =========================================================
    if (activeModule === "marketing") {
      if (feat.includes("coupon")) {
        return (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Issue Marketing Coupon</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newCouponCode || !newCouponDiscount) return;
                  const newC = {
                    id: `C-${Date.now().toString().slice(-2)}`,
                    code: newCouponCode.toUpperCase().replace(/\s+/g, ''),
                    discount: parseFloat(newCouponDiscount) || 10,
                    type: newCouponType,
                    active: true,
                    usageCount: 0
                  };
                  setCouponsList([newC, ...couponsList]);
                  setNewCouponCode("");
                  setNewCouponDiscount("");
                  showToast(`Coupon ${newCouponCode} issued successfully.`);
                }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs"
              >
                <input
                  type="text"
                  required
                  placeholder="Coupon Code (e.g. DIWALI)"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="px-3 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white font-mono"
                />
                <input
                  type="number"
                  required
                  placeholder="Discount value"
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(e.target.value)}
                  className="px-3 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                />
                <select
                  value={newCouponType}
                  onChange={(e) => setNewCouponType(e.target.value)}
                  className="px-3 py-2 border rounded-xl dark:bg-gray-800 text-gray-655 cursor-pointer"
                >
                  <option value="PERCENTAGE">PERCENTAGE (%)</option>
                  <option value="FLAT">FLAT (₹)</option>
                  <option value="BOGO">BOGO (Buy 1 Get 1)</option>
                </select>
                <button type="submit" className={`py-2 px-4 ${activeTheme.button} font-bold rounded-xl`}>
                  Issue Coupon
                </button>
              </form>
            </div>

            <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Coupons Master</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-150 text-gray-400 font-bold uppercase pb-3">
                      <th className="pb-2">Code ID</th>
                      <th className="pb-2">Coupon Code</th>
                      <th className="pb-2">Discount Value</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Total Usages</th>
                      <th className="pb-2">Active Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {couponsList.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-2.5 font-mono font-bold">{c.id}</td>
                        <td className="py-2.5 font-bold font-mono text-[#3D1E16] dark:text-gray-250">{c.code}</td>
                        <td className="py-2.5 font-bold">{c.type === "PERCENTAGE" ? `${c.discount}%` : `₹${c.discount}`}</td>
                        <td className="py-2.5 font-semibold text-gray-550">{c.type}</td>
                        <td className="py-2.5 font-mono font-semibold">{c.usageCount} times</td>
                        <td className="py-2.5">
                          <button
                            onClick={() => {
                              setCouponsList(couponsList.map(item => item.id === c.id ? { ...item, active: !item.active } : item));
                              showToast(`Coupon ${c.code} status toggled.`);
                            }}
                            className={`px-3 py-1 rounded-full text-[9px] font-bold ${
                              c.active ? "bg-green-150 text-green-700 border border-green-200" : "bg-gray-150 text-gray-550 border border-gray-200"
                            }`}
                          >
                            {c.active ? "Enabled" : "Disabled"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }

      // Default: Promo campaigns info
      return (
        <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
          <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Coupon Code Generator</h3>
          <div className="flex flex-col sm:flex-row gap-3 text-xs">
            <input
              type="text"
              placeholder="COUPON_CODE (e.g. FESTIVAL50)"
              className="flex-1 px-4 py-2 border rounded-xl dark:bg-gray-800"
            />
            <button
              onClick={() => showToast("Marketing campaign coupon generated.")}
              className={`px-4 py-2 ${activeTheme.button} font-bold rounded-xl`}
            >
              Generate Campaign Link
            </button>
          </div>
        </div>
      );
    }

    // =========================================================
    // 11. LOGISTICS & SHIPPING (logistics)
    // =========================================================
    if (activeModule === "logistics") {
      const isShipments = feat.includes("shipment") || feat.includes("queue") || feat.includes("tracking") || feat.includes("courier");
      
      if (isShipments) {
        return (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Onboard Courier Shipment</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newShipmentDest) return;
                  const newShip = {
                    id: `SHIP-${Date.now().toString().slice(-4)}`,
                    partner: newShipmentPartner,
                    dest: newShipmentDest,
                    status: "Pending Pickup",
                    date: "Today"
                  };
                  setShipmentsList([newShip, ...shipmentsList]);
                  setNewShipmentDest("");
                  showToast(`Shipment registered to ${newShipmentDest} via ${newShipmentPartner}`);
                }}
                className="flex gap-4 text-xs"
              >
                <input
                  type="text"
                  required
                  placeholder="Shipping Destination (e.g. Bangalore)"
                  value={newShipmentDest}
                  onChange={(e) => setNewShipmentDest(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                />
                <select
                  value={newShipmentPartner}
                  onChange={(e) => setNewShipmentPartner(e.target.value)}
                  className="px-3 py-2 border rounded-xl dark:bg-gray-800 text-gray-655 cursor-pointer"
                >
                  <option value="Delhivery">Delhivery</option>
                  <option value="BlueDart">BlueDart</option>
                  <option value="IndiaPost">IndiaPost</option>
                </select>
                <button type="submit" className={`py-2 px-4 ${activeTheme.button} font-bold rounded-xl`}>
                  Onboard Shipment
                </button>
              </form>
            </div>

            <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Courier Shipment Log</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-150 text-gray-400 font-bold uppercase pb-3">
                      <th className="pb-2">Tracking ID</th>
                      <th className="pb-2">Courier Partner</th>
                      <th className="pb-2">Destination</th>
                      <th className="pb-2">Scheduled</th>
                      <th className="pb-2">Shipment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {shipmentsList.map(ship => (
                      <tr key={ship.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-2.5 font-mono font-bold">{ship.id}</td>
                        <td className="py-2.5 font-semibold text-gray-700 dark:text-gray-250">{ship.partner}</td>
                        <td className="py-2.5 font-bold">To {ship.dest}</td>
                        <td className="py-2.5 text-gray-500 font-semibold">{ship.date}</td>
                        <td className="py-2.5">
                          <button
                            onClick={() => {
                              const statuses = ["Pending Pickup", "In Transit", "Out for Delivery", "Delivered"];
                              const currIdx = statuses.indexOf(ship.status);
                              const nextStatus = statuses[(currIdx + 1) % statuses.length];
                              setShipmentsList(shipmentsList.map(s => s.id === ship.id ? { ...s, status: nextStatus } : s));
                              showToast(`Shipment ${ship.id} tracking updated to ${nextStatus}.`);
                            }}
                            className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                              ship.status === "Delivered" ? "bg-green-100 text-green-700 border-green-200" : 
                              ship.status === "In Transit" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-yellow-100 text-yellow-750 border-yellow-200"
                            }`}
                          >
                            {ship.status}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }

      if (feat.includes("statuses") || feat.includes("workflow")) {
        return (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E] uppercase tracking-wider">Dynamic 15-Stage Order Workflows</h3>
              <p className="text-[11px] text-gray-400">Configure logistics department ownership and dispatch statuses templates.</p>
              
              <div className="space-y-3 pt-2 text-xs">
                {[
                  { stage: "Order Placed", dept: "Customer Systems", autoNotify: "Email + Push" },
                  { stage: "Payment Verified", dept: "Finance Department", autoNotify: "Email + SMS" },
                  { stage: "Vendor Accepted", dept: "Artisan Operations", autoNotify: "WhatsApp" },
                  { stage: "Quality Check Passed", dept: "Quality Control", autoNotify: "In-App" },
                  { stage: "Picked by Courier", dept: "Logistics Hub", autoNotify: "SMS + WhatsApp" }
                ].map((wf, idx) => (
                  <div key={idx} className="p-3 border rounded-xl bg-white dark:bg-gray-800 flex justify-between items-center">
                    <div>
                      <strong className="block text-[#3D1E16] dark:text-gray-150">{wf.stage}</strong>
                      <span className="text-[10px] text-gray-400 font-semibold">Owner: {wf.dept}</span>
                    </div>
                    <span className="text-[10px] text-[#B56D3E] font-bold">{wf.autoNotify}</span>
                  </div>
                ))}
                
                <button onClick={() => showToast("Logistics workflow statuses synchronized.")} className={`py-2 px-4 ${activeTheme.button} font-bold rounded-xl`}>
                  Synchronize Workflows
                </button>
              </div>
            </div>
          </div>
        );
      }

      if (feat.includes("reasons") || feat.includes("return")) {
        return (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E] uppercase tracking-wider">Return Grievances Settings</h3>
              <p className="text-[11px] text-gray-400">Manage return eligibility reasons and refund release triggers.</p>
              
              <div className="space-y-3 pt-2 text-xs">
                {[
                  { reason: "Quality/Weaving Flaws", autoApprove: "No (Requires QA Audit)", trigger: "GI Stamp Scan" },
                  { reason: "Variant Mismatch", autoApprove: "Yes", trigger: "Courier Picked" },
                  { reason: "Broken/Damaged Item", autoApprove: "No (Requires Photo Proof)", trigger: "Manual Review" }
                ].map((r, idx) => (
                  <div key={idx} className="p-3 border rounded-xl bg-white dark:bg-gray-800 flex justify-between items-center">
                    <div>
                      <strong className="block text-[#3D1E16] dark:text-gray-150">{r.reason}</strong>
                      <span className="text-[10px] text-gray-400 font-semibold">Instant refund: {r.autoApprove}</span>
                    </div>
                    <span className="text-[10px] text-gray-550 font-mono font-bold">Release trigger: {r.trigger}</span>
                  </div>
                ))}
                
                <button onClick={() => showToast("Return settings updated.")} className={`py-2 px-4 ${activeTheme.button} font-bold rounded-xl`}>
                  Update Rules Matrix
                </button>
              </div>
            </div>
          </div>
        );
      }

      // Default: general logistics tracker
      return (
        <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
          <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Courier Tracking Board</h3>
          <div className="space-y-3">
            {shipmentsList.slice(0, 2).map((ship, idx) => (
              <div key={idx} className="p-3 border border-gray-250/50 rounded-xl bg-white dark:bg-gray-800 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-[#3D1E16] dark:text-gray-150 block">{ship.id}</span>
                  <span className="text-[10px] text-gray-400 font-semibold">{ship.partner} • To {ship.dest}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  {ship.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // =========================================================
    // 12. ADMIN CONTROL (admin)
    // =========================================================
    if (activeModule === "admin") {
      // Role and checkbox permissions matrix
      return (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border space-y-6 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
            <div>
              <h3 className="text-sm font-serif font-bold">Enterprise Permissions Role Matrix</h3>
              <p className="text-[11px] text-gray-400 font-semibold uppercase">Manage permissions matrix mapping for the 22 custom system roles</p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="font-bold">Select Role:</span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-xl font-bold dark:bg-gray-800 cursor-pointer text-gray-655"
              >
                {ERP_ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {["Read", "Create", "Update", "Delete", "Approve"].map((perm) => {
                const isGranted = (rolePermissions[selectedRole] || []).includes(perm);
                return (
                  <button
                    key={perm}
                    type="button"
                    onClick={() => togglePermission(selectedRole, perm)}
                    className={`px-3 py-2.5 border rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                      isGranted
                        ? "border-green-500 bg-green-50/10 text-green-500"
                        : "border-gray-200 hover:border-gray-300 text-gray-400"
                    }`}
                  >
                    <span>{perm} Permission</span>
                    {isGranted ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className={`lg:col-span-5 p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold">Simulate Department Credentials</h3>
              <form onSubmit={handleCreateDept} className="space-y-3.5 text-xs">
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Employee Name"
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                />
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Corporate Email"
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Credential Password"
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                />
                <select
                  value={newDept}
                  onChange={(e) => {
                    setNewDept(e.target.value);
                    const purp = DEPARTMENTS_PURPOSES.find(d => d.name === e.target.value)?.purpose;
                    if (purp) setSelectedGrants([purp]);
                  }}
                  className="w-full px-4 py-2 border rounded-xl font-semibold dark:bg-gray-800 cursor-pointer text-gray-655"
                >
                  {DEPARTMENTS_PURPOSES.map(d => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
                <button type="submit" className={`w-full py-2.5 ${activeTheme.button} font-bold rounded-xl shadow`}>
                  Generate Simulated Accounts
                </button>
              </form>
            </div>

            <div className={`lg:col-span-7 p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
              <h3 className="text-sm font-serif font-bold">Simulated Active Accounts</h3>
              <div className="space-y-3">
                {deptAccounts.map(acct => (
                  <div key={acct.id} className="p-3 border border-gray-250/50 rounded-xl bg-white dark:bg-gray-800 text-xs space-y-1">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-[#3D1E16] dark:text-gray-150">{acct.name}</span>
                      <span className="text-[10px] bg-[#C09355]/15 text-[#B56D3E] px-2 py-0.5 rounded uppercase font-bold text-[9px]">
                        {acct.department}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-mono">ID: {acct.email} | PW: {acct.password}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeModule === "settings") {
      if (feat.includes("activity") || feat.includes("log")) {
        return (
          <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
            <div className="border-b pb-2">
              <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Settings Modification Logs</h3>
              <p className="text-[10px] text-gray-400">Auditable configuration modifications recorded across the system.</p>
            </div>
            <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
              {settingsLogs.map((log) => (
                <div key={log.id} className="p-3 border border-gray-250/30 rounded-xl bg-white dark:bg-gray-800 text-xs flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                        log.action === "UPDATE" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                      }`}>{log.action}</span>
                      <span className="font-bold font-mono text-[#3D1E16] dark:text-gray-250">{log.key}</span>
                    </div>
                    <p className="text-gray-555 dark:text-gray-300">{log.desc}</p>
                  </div>
                  <div className="text-right text-[10px] text-gray-400 font-medium">
                    <span className="block font-bold">{log.user}</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      if (feat.includes("permission") || feat.includes("matrix")) {
        return (
          <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
            <div className="border-b pb-2">
              <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Role Access Permissions Matrix</h3>
              <p className="text-[10px] text-gray-400">Interactive setup for granular department capabilities based on role.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-150 text-gray-400 font-bold pb-2">
                    <th>System Role</th>
                    <th className="text-center">Read</th>
                    <th className="text-center">Create</th>
                    <th className="text-center">Update</th>
                    <th className="text-center">Delete</th>
                    <th className="text-center">Approve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {Object.entries(rolePermissions).map(([role, grants]) => (
                    <tr key={role} className="hover:bg-gray-50/50">
                      <td className="py-2.5 font-bold text-gray-700 dark:text-gray-300">{role}</td>
                      {["Read", "Create", "Update", "Delete", "Approve"].map((action) => {
                        const hasGrant = grants.includes(action);
                        return (
                          <td key={action} className="text-center py-2.5">
                            <input
                              type="checkbox"
                              checked={hasGrant}
                              onChange={() => {
                                const newGrants = hasGrant
                                  ? grants.filter(g => g !== action)
                                  : [...grants, action];
                                setRolePermissions({
                                  ...rolePermissions,
                                  [role]: newGrants
                                });
                                showToast(`Permission Updated: ${role} -> ${action}`);
                              }}
                              className="rounded text-[#B56D3E] focus:ring-[#B56D3E]"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      // Default: System Config keys editor
      return (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border space-y-6 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-serif font-black flex items-center gap-2">Website Settings Console</h3>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Manage system keys, payments config, shipping bounds, and access locks</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setEditingSetting(null);
                    setInputSettingKey("");
                    setInputSettingValue("");
                    setInputSettingCategory("General Settings");
                    setInputSettingRole("All Roles");
                    setInputSettingEnabled(true);
                    setIsSettingsModalOpen(true);
                  }}
                  className={`px-3 py-1.5 ${activeTheme.button} text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1`}
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Key
                </button>
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-205 dark:bg-gray-800 dark:hover:bg-gray-700 text-xs font-bold text-gray-650 rounded-xl shadow transition-all flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" /> Import JSON
                </button>
                <button
                  onClick={handleExportSettings}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-205 dark:bg-gray-800 dark:hover:bg-gray-700 text-xs font-bold text-gray-650 rounded-xl shadow transition-all flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Export Config
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Search setting keys..."
                value={searchSettingsQuery}
                onChange={(e) => setSearchSettingsQuery(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs dark:bg-gray-800 focus:outline-none text-gray-600 dark:text-white"
              />
              <select
                value={filterSettingsCategory}
                onChange={(e) => setFilterSettingsCategory(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs dark:bg-gray-800 cursor-pointer text-gray-550 font-semibold"
              >
                <option value="All Categories">All Categories</option>
                <option value="General Settings">General Settings</option>
                <option value="Company Settings">Company Settings</option>
                <option value="User Settings">User Settings</option>
                <option value="Product Settings">Product Settings</option>
                <option value="Inventory Settings">Inventory Settings</option>
                <option value="Shipping Settings">Shipping Settings</option>
                <option value="Payment Gateway Settings">Payment Gateway Settings</option>
                <option value="AI Settings">AI Settings</option>
                <option value="Developer Settings">Developer Settings</option>
              </select>
              <select
                value={filterSettingsStatus}
                onChange={(e) => setFilterSettingsStatus(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-250 rounded-xl text-xs dark:bg-gray-800 cursor-pointer text-gray-550 font-semibold"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Enabled">Enabled Only</option>
                <option value="Disabled">Disabled Only</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-150 text-gray-400 font-bold uppercase pb-3">
                    <th className="pb-2">Setting Key</th>
                    <th className="pb-2">Config Value</th>
                    <th className="pb-2">Category</th>
                    <th className="pb-2">Scope</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {settings
                    .filter(s => {
                      const matchesSearch = s.key.toLowerCase().includes(searchSettingsQuery.toLowerCase());
                      const matchesCategory = filterSettingsCategory === "All Categories" || s.category === filterSettingsCategory;
                      const matchesStatus = filterSettingsStatus === "All Statuses" || 
                        (filterSettingsStatus === "Enabled" && s.enabled) ||
                        (filterSettingsStatus === "Disabled" && !s.enabled);
                      return matchesSearch && matchesCategory && matchesStatus;
                    })
                    .map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3 font-bold font-mono text-[#3D1E16] dark:text-gray-250">{s.key}</td>
                        <td className="py-3 text-gray-555 dark:text-gray-300 font-semibold max-w-[200px] truncate">{s.value}</td>
                        <td className="py-3">
                          <span className="bg-[#C09355]/10 text-[#B56D3E] font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                            {s.category}
                          </span>
                        </td>
                        <td className="py-3 font-bold text-gray-400">{s.role}</td>
                        <td className="py-3">
                          <button
                            onClick={() => handleToggleSettingEnabled(s.id, s.key, s.enabled)}
                            className={`w-10 h-5 rounded-full p-0.5 transition-colors relative ${s.enabled ? "bg-green-600" : "bg-gray-300"}`}
                          >
                            <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${s.enabled ? "translate-x-5" : "translate-x-0"}`} />
                          </button>
                        </td>
                        <td className="py-3 text-right flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingSetting(s);
                              setInputSettingKey(s.key);
                              setInputSettingValue(s.value);
                              setInputSettingCategory(s.category);
                              setInputSettingRole(s.role);
                              setInputSettingEnabled(s.enabled);
                              setIsSettingsModalOpen(true);
                            }}
                            className="p-1.5 hover:bg-gray-150 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-[#B56D3E]"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSetting(s.id, s.key)}
                            className="p-1.5 hover:bg-gray-150 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    // =========================================================
    // 14. DATABASE SCHEMA EXPLORER (database)
    // =========================================================
    if (activeModule === "database") {
      if (feat.includes("visualizer") || feat.includes("relationship")) {
        return (
          <div className={`p-6 rounded-2xl border space-y-6 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
            <div>
              <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Relational Entity Database Visualizer</h3>
              <p className="text-xs text-gray-400">Schema mapping and constraints tracking between database entities.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/50 relative overflow-hidden">
              <div className="p-4 border rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 text-center space-y-2 relative z-10">
                <span className="font-bold block font-serif">Users Table</span>
                <span className="font-mono text-[9px] block text-gray-450">pk: id (UUID)</span>
                <div className="w-0.5 h-8 bg-blue-400 mx-auto border-dashed border" />
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[9px] font-bold">1 to Many Connection</span>
              </div>
              <div className="p-4 border rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 text-center space-y-2 relative z-10">
                <span className="font-bold block font-serif">User Roles Table</span>
                <span className="font-mono text-[9px] block text-gray-455 font-bold">fk: user_id (users.id)</span>
                <div className="w-0.5 h-8 bg-amber-400 mx-auto border-dashed border" />
                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[9px] font-bold">Many to 1 Reference</span>
              </div>
              <div className="p-4 border rounded-xl bg-green-50/50 dark:bg-green-900/10 border-green-200 text-center space-y-2 relative z-10">
                <span className="font-bold block font-serif">Products Table</span>
                <span className="font-mono text-[9px] block text-gray-455 font-bold">fk: category_id (categories.id)</span>
                <div className="w-0.5 h-8 bg-green-400 mx-auto border-dashed border" />
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[9px] font-bold">Many to 1 Reference</span>
              </div>
            </div>
          </div>
        );
      }

      if (feat.includes("primary") || feat.includes("foreign") || feat.includes("index") || feat.includes("key") || feat.includes("mapping")) {
        const showPk = feat.includes("primary");
        const showFk = feat.includes("foreign");
        const showIndex = feat.includes("index") || feat.includes("optimize");
        
        return (
          <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
            <h3 className="text-sm font-serif font-bold text-[#B56D3E]">
              {showPk ? "Primary Keys Mapping" : showFk ? "Foreign Keys Mapping" : "Database Performance Indexes"}
            </h3>
            <p className="text-xs text-gray-400">
              {showPk ? "Granular table identifiers mapping." : showFk ? "Relational dependencies mapping." : "Optimized indexing parameters for accelerated query parsing."}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-150 text-gray-400 font-bold pb-2 uppercase tracking-wider text-[10px]">
                    <th>Table Name</th>
                    {showPk && <th>Primary Key (PK)</th>}
                    {showFk && <th>Foreign Key (FK)</th>}
                    {!showIndex && <th>Relations</th>}
                    {showIndex && <th className="text-right">Optimized Indexes</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                  {DATABASE_SCHEMAS.map((db, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-2.5 font-bold font-sans text-gray-800 dark:text-gray-200">{db.table}</td>
                      {showPk && <td className="text-blue-600 font-bold">{db.pk}</td>}
                      {showFk && <td className="text-amber-700 font-semibold">{db.fk}</td>}
                      {!showIndex && <td className="font-sans text-gray-600 dark:text-gray-300 font-semibold">{db.relations}</td>}
                      {showIndex && <td className="text-right font-bold text-gray-500">{db.indexes}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      // Default: full schema tables mapping
      return (
        <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
          <h3 className="text-sm font-serif font-bold">ERP Relational Database Blueprint</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-150 text-gray-400 font-bold uppercase pb-3 tracking-wider">
                  <th className="pb-3">Table Name</th>
                  <th className="pb-3">Primary Key (PK)</th>
                  <th className="pb-3">Foreign Key (FK)</th>
                  <th className="pb-3">Relationships</th>
                  <th className="pb-3 text-right">Optimized Indexes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                {DATABASE_SCHEMAS.map((db, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3.5 font-bold text-gray-800 dark:text-gray-250">{db.table}</td>
                    <td className="py-3.5 text-blue-600 font-bold">{db.pk}</td>
                    <td className="py-3.5 text-amber-700 font-semibold">{db.fk}</td>
                    <td className="py-3.5 text-gray-650 dark:text-gray-300 font-sans font-semibold">{db.relations}</td>
                    <td className="py-3.5 text-right font-bold text-gray-500">{db.indexes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // =========================================================
    // FALLBACK / GENERAL DYNAMIC SIMULATOR FOR ALL OTHER SUB-FEATURES
    // =========================================================
    const simRows = simulatorData[feat] || [
      { id: "MOCK-1", item: `${activeSubFeature} Row #1`, date: "2026-07-18", user: "Abhishek Mishra", status: "Active" },
      { id: "MOCK-2", item: `${activeSubFeature} Row #2`, date: "2026-07-17", user: "Finance Officer", status: "Active" },
      { id: "MOCK-3", item: `${activeSubFeature} Row #3`, date: "2026-07-15", user: "Corporate Exec", status: "Inactive" }
    ];

    const keys = Object.keys(simRows[0]).filter(k => k !== "id");

    return (
      <div className="space-y-6">
        <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
          <h3 className="text-sm font-serif font-bold text-[#B56D3E]">Create Simulated Record for {activeSubFeature}</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!genericFieldName) return;
              const newRec: any = {
                id: `MOCK-${Date.now().toString().slice(-3)}`
              };
              keys.forEach(k => {
                if (k === "item" || k === "name" || k === "employee" || k === "product") {
                  newRec[k] = genericFieldName;
                } else if (k === "status") {
                  newRec[k] = "Active";
                } else if (k === "date") {
                  newRec[k] = new Date().toISOString().split('T')[0];
                } else {
                  newRec[k] = genericFieldValue || "Generic Val";
                }
              });
              
              setSimulatorData({
                ...simulatorData,
                [feat]: [newRec, ...simRows]
              });
              setGenericFieldName("");
              setGenericFieldValue("");
              showToast(`Created record in ${activeSubFeature}.`);
            }}
            className="flex flex-wrap gap-4 text-xs"
          >
            <input
              type="text"
              required
              placeholder="Record Name / Details"
              value={genericFieldName}
              onChange={(e) => setGenericFieldName(e.target.value)}
              className="flex-grow px-3 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
            />
            {keys.some(k => k !== "item" && k !== "name" && k !== "employee" && k !== "product" && k !== "status" && k !== "date") && (
              <input
                type="text"
                placeholder="Supplementary Value"
                value={genericFieldValue}
                onChange={(e) => setGenericFieldValue(e.target.value)}
                className="w-48 px-3 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
              />
            )}
            <button type="submit" className={`py-2 px-4 ${activeTheme.button} font-bold rounded-xl`}>
              Add Record
            </button>
          </form>
        </div>

        <div className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h3 className="text-sm font-serif font-bold text-[#B56D3E]">{activeSubFeature} Sourcing Records</h3>
            <input
              type="text"
              placeholder="Search records..."
              value={simulatorSearch}
              onChange={(e) => setSimulatorSearch(e.target.value)}
              className="px-3 py-1.5 border border-gray-250 rounded-xl text-xs dark:bg-gray-800 text-gray-655"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-150 text-gray-400 font-bold uppercase pb-3">
                  <th className="pb-2">Record ID</th>
                  {keys.map(k => (
                    <th key={k} className="pb-2 capitalize">{k}</th>
                  ))}
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {simRows
                  .filter(row => {
                    if (!simulatorSearch) return true;
                    return Object.values(row).some(val => 
                      String(val).toLowerCase().includes(simulatorSearch.toLowerCase())
                    );
                  })
                  .map(row => (
                    <tr key={row.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-2.5 font-mono font-bold">{row.id}</td>
                      {keys.map(k => (
                        <td key={k} className="py-2.5 font-semibold text-gray-700 dark:text-gray-250">
                          {k === "status" ? (
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              row[k] === "Active" || row[k] === "On Time" || row[k] === "Paid" ? "bg-green-100 text-green-800" : "bg-gray-150 text-gray-505"
                            }`}>
                              {row[k]}
                            </span>
                          ) : row[k]}
                        </td>
                      ))}
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => {
                            setSimulatorData({
                              ...simulatorData,
                              [feat]: simRows.filter(r => r.id !== row.id)
                            });
                            showToast("Deleted record from workspace.");
                          }}
                          className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-650 rounded text-[9px] font-bold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? "bg-[#110B09] text-gray-100" : "bg-[#FAF5EE] text-[#2E1E1A]"}`}>
      
      {/* ==================== GLOBAL ERP NAVIGATION CONTROL BAR ==================== */}
      <header className={`sticky top-0 z-40 border-b px-6 py-4 flex items-center justify-between backdrop-blur-md ${isDarkMode ? "bg-[#110B09]/95 border-gray-800" : "bg-[#FAF5EE]/95 border-[#C09355]/20"}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-gradient-to-tr ${activeTheme.chartGradient} shadow-md`}>
            <Layers className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-black tracking-wide text-lg text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-[#B56D3E] to-amber-500">CULTURAL CLUTCH</span>
              <span className="text-[9px] uppercase font-extrabold tracking-widest px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-sm">Enterprise ERP Suite</span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Auraic SAP-Inspired Management Console</p>
          </div>
        </div>

        {/* Global Controls & Mode Switchers */}
        <div className="flex items-center gap-4">
          
          {/* Dynamic Theme color switchers */}
          <div className="hidden lg:flex items-center gap-1.5 bg-gray-50/5 p-1 rounded-xl border border-gray-300/10">
            {Object.keys(themes).map((thm) => (
              <button
                key={thm}
                onClick={() => setDashboardTheme(thm)}
                className={`w-4 h-4 rounded-full transition-transform ${
                  thm === "saffron" ? "bg-[#B56D3E]" : thm === "indigo" ? "bg-blue-600" : thm === "emerald" ? "bg-emerald-600" : "bg-red-600"
                } ${dashboardTheme === thm ? "scale-125 ring-2 ring-amber-500/40" : "opacity-60 hover:opacity-100"}`}
                title={`Switch to ${thm.toUpperCase()} Accent`}
              />
            ))}
          </div>

          {/* Light/Dark mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-xl border transition-all ${isDarkMode ? "border-gray-800 hover:bg-gray-800 text-yellow-400" : "border-[#C09355]/20 hover:bg-[#C09355]/10 text-gray-500"}`}
            title="Toggle Dashboard Theme Style"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Real-time Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 rounded-xl border border-gray-300/10 hover:bg-gray-150/20 dark:hover:bg-gray-800/40 text-gray-500 dark:text-gray-300 relative transition-all active:scale-95"
            >
              <Bell className="w-4 h-4 animate-swing" />
              {erpNotifications.filter(n => n.unread).length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto z-50 rounded-2xl border bg-white dark:bg-[#1A1311] border-[#C09355]/20 shadow-2xl p-4 space-y-3">
                <div className="flex justify-between items-center border-b pb-2 border-gray-150 dark:border-gray-850">
                  <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#3D1E16] dark:text-gray-100">Notification Center</h4>
                  <button
                    onClick={() => {
                      setErpNotifications(erpNotifications.map(n => ({ ...n, unread: false })));
                      showToast("All notifications marked read.");
                    }}
                    className="text-[9px] text-[#B56D3E] hover:underline font-bold uppercase tracking-wider"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2">
                  {erpNotifications.length === 0 ? (
                    <p className="text-[10px] text-gray-400 italic text-center py-4">No notifications.</p>
                  ) : (
                    erpNotifications.map((notif) => (
                      <div key={notif.id} className={`p-2 rounded-xl text-[10px] border flex flex-col gap-1 transition-all ${
                        notif.unread ? "bg-[#FAF5EE]/70 dark:bg-white/5 border-[#B56D3E]/30 font-semibold" : "bg-white dark:bg-gray-800/50 border-gray-100 dark:border-gray-700"
                      }`}>
                        <div className="flex justify-between items-center text-[8px] font-extrabold uppercase">
                          <span className="text-[#B56D3E]">{notif.channel} alert</span>
                          <span className="text-gray-450">{notif.timestamp}</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-normal">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Role Simulation Switcher */}
          <div className="flex items-center gap-1">
            <span className="hidden md:inline text-[9px] font-extrabold uppercase text-gray-400 tracking-wider">Role Play:</span>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                showToast(`Switched Role Play authorization to: ${e.target.value}`);
              }}
              className="px-2 py-1 text-[10px] font-bold border border-gray-250 rounded-xl dark:bg-gray-800 focus:outline-none"
            >
              {Object.keys(rolePermissions).map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* User Profile Badge */}
          <div className="flex items-center gap-2 border-l pl-4 border-gray-300/20">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-bold text-white text-xs shadow-md">
              {selectedRole.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <span className="block text-xs font-bold font-serif leading-tight">
                {selectedRole === "Super Admin" ? "Mr. Abhishek Mishra" : "ERP Representative"}
              </span>
              <span className="block text-[9px] uppercase tracking-wider text-gray-400 font-extrabold">{selectedRole}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ==================== MAIN ERP PAGE GRID ==================== */}
      <div className="max-w-[1600px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ==================== LEFT COLLAPSIBLE NAVIGATION SIDEBAR ==================== */}
        <aside className="lg:col-span-3 space-y-4">
          <div className={`p-4 rounded-2xl border ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"} shadow-sm`}>
            <h3 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-3">Core ERP Modules</h3>
            <nav className="space-y-1">
              {ERP_MODULES.map((mod) => {
                const IconComponent = mod.icon;
                const isSelected = activeModule === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      setActiveModule(mod.id);
                      setActiveSubFeature(mod.subFeatures[0]);
                      showToast(`Navigated to ${mod.name}`);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-bold tracking-wide transition-all ${
                      isSelected
                        ? `${activeTheme.button} shadow-sm scale-[1.02]`
                        : `text-gray-550 hover:text-[#B56D3E] hover:bg-[#C09355]/5`
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent className="w-4 h-4 shrink-0" />
                      <span>{mod.name}</span>
                    </div>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500 dark:bg-gray-800"}`}>
                      {mod.subFeatures.length}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Module Sub-features Selection Panel */}
          <div className={`p-4 rounded-2xl border ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"} shadow-sm`}>
            <h3 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-2">Module Subcategories</h3>
            <div className="flex flex-wrap gap-1.5">
              {ERP_MODULES.find(m => m.id === activeModule)?.subFeatures.map((sub) => (
                <button
                  key={sub}
                  onClick={() => {
                    setActiveSubFeature(sub);
                    showToast(`Active View: ${sub}`);
                  }}
                  className={`px-3 py-1.5 border rounded-xl text-[10px] font-bold uppercase transition-all ${
                    activeSubFeature === sub
                      ? "border-[#B56D3E] bg-[#B56D3E]/5 text-[#B56D3E]"
                      : "border-gray-200 hover:border-gray-300 text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-700"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ==================== RIGHT CONTENT PAGE AREA ==================== */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Active View Title & Context */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-gray-300/10">
            <div>
              <span className={`text-[10px] uppercase font-extrabold tracking-widest ${activeTheme.text}`}>
                Active Workspace / {ERP_MODULES.find(m => m.id === activeModule)?.name}
              </span>
              <h1 className="text-2xl font-serif font-black tracking-wide flex items-center gap-2">
                {activeSubFeature} <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              </h1>
            </div>
            
            {/* Quick Actions Bar */}
            <div className="flex items-center gap-2 text-xs">
              <button 
                onClick={() => showToast(`Exporting current dataset as GST XML/CSV...`)}
                className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-250 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Export Data
              </button>
              <button 
                onClick={() => showToast("Syncing ERP with Main Net API...")}
                className={`px-3.5 py-1.5 ${activeTheme.button} font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all`}
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> Force Sync
              </button>
            </div>
          </div>

          {/* Local Department Sub-Tab Selector */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-150/40 dark:border-gray-805 pb-2">
            {[
              { id: "dashboard", label: "📊 Analytics Dashboard" },
              { id: "tasks", label: "📋 Kanban Tasks" },
              { id: "approvals", label: "⚖️ Approval Queue" },
              { id: "documents", label: "📁 Documents Vault" },
              { id: "team", label: "💬 Team Chat" },
              { id: "logs", label: "📜 Audit Trail" }
            ].map((tab) => {
              const isSelected = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveSubTab(tab.id);
                    showToast(`Switched view to: ${tab.label.split(" ").slice(1).join(" ")}`);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-sans font-bold text-[10px] uppercase tracking-wider transition-all active:scale-95 ${
                    isSelected
                      ? "bg-[#B56D3E] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700 bg-gray-50 dark:bg-gray-800/40 dark:text-gray-300 dark:hover:bg-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ==================== RENDER: DYNAMIC MODULE WORKSPACE ==================== */}
          <div className="transition-all duration-200">
            {activeSubTab === "dashboard" && renderActiveWorkspace()}
            {activeSubTab === "tasks" && renderTasksWorkspace()}
            {activeSubTab === "approvals" && renderApprovalsWorkspace()}
            {activeSubTab === "documents" && renderDocumentsWorkspace()}
            {activeSubTab === "team" && renderTeamWorkspace()}
            {activeSubTab === "logs" && renderLogsWorkspace()}
          </div>

          {/* ==================== GLOBAL ERP DETAILS ROW: CALENDAR & ALERTS TIMELINE ==================== */}
          {activeModule === "bi" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Calendar list */}
              <div className={`lg:col-span-5 p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
                <h3 className="text-sm font-serif font-bold flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#B56D3E]" /> Interactive Operations Calendar
                </h3>
                
                <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                  {calendarEvents.map((evt) => (
                    <div key={evt.id} className="flex justify-between items-center p-2.5 border border-gray-250/50 rounded-xl bg-white dark:bg-gray-800 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded font-bold font-mono text-[9px] uppercase">
                          {evt.date}
                        </span>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{evt.title}</span>
                      </div>
                      <span className="text-[9px] text-gray-400 font-extrabold uppercase">{evt.type}</span>
                    </div>
                  ))}
                </div>

                {/* Add event form */}
                <form onSubmit={handleAddEvent} className="flex gap-2 text-xs">
                  <input
                    type="text"
                    required
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="Schedule task..."
                    className="flex-1 px-3 py-1.5 border border-gray-250 rounded-xl dark:bg-gray-800"
                  />
                  <input
                    type="text"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    placeholder="e.g. 24 JUL"
                    className="w-24 px-3 py-1.5 border border-gray-250 rounded-xl dark:bg-gray-800 text-center font-mono"
                  />
                  <button type="submit" className={`px-3 py-1.5 ${activeTheme.button} font-bold rounded-xl`}>
                    <Plus className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Notifications Timeline */}
              <div className={`lg:col-span-7 p-6 rounded-2xl border space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800" : "bg-[#FDFBF7] border-[#C09355]/20"}`}>
                <h3 className="text-sm font-serif font-bold flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-amber-500 animate-swing" /> Operations Audit Inbox & Notifications
                </h3>
                
                <div className="space-y-2">
                  {notifications.map((note) => (
                    <div key={note.id} className="flex items-start gap-2.5 p-2.5 border border-gray-250/40 rounded-xl bg-white dark:bg-gray-800 text-xs">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase shrink-0 mt-0.5 ${
                        note.type === "WARN" ? "bg-red-100 text-red-700" : note.type === "AUTH" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                      }`}>
                        {note.type}
                      </span>
                      <p className="font-medium text-gray-700 dark:text-gray-300 leading-normal">{note.msg}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </main>

      </div>

      {/* Website Settings Edit / Create Overlay Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in text-xs">
          <div className={`max-w-md w-full p-6 rounded-3xl border shadow-2xl space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800 text-white" : "bg-white border-[#C09355]/20 text-[#2E1E1A]"}`}>
            <div className="flex justify-between items-center border-b pb-3 border-gray-150/40">
              <h3 className="font-serif font-bold text-sm">
                {editingSetting ? `Edit Setting Key: ${editingSetting.key}` : "Create New Setting Key"}
              </h3>
              <button onClick={() => setIsSettingsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSaveSetting} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Setting Key</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. shipping_tax_default"
                  disabled={!!editingSetting}
                  value={inputSettingKey}
                  onChange={(e) => setInputSettingKey(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 font-mono disabled:opacity-50 text-[#3D1E16] dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Config Value</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 18"
                  value={inputSettingValue}
                  onChange={(e) => setInputSettingValue(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 text-[#3D1E16] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Category</label>
                  <select
                    value={inputSettingCategory}
                    onChange={(e) => setInputSettingCategory(e.target.value)}
                    className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 font-semibold cursor-pointer text-gray-650"
                  >
                    <option value="General Settings">General Settings</option>
                    <option value="Company Settings">Company Settings</option>
                    <option value="User Settings">User Settings</option>
                    <option value="Product Settings">Product Settings</option>
                    <option value="Inventory Settings">Inventory Settings</option>
                    <option value="Shipping Settings">Shipping Settings</option>
                    <option value="Payment Gateway Settings">Payment Gateway Settings</option>
                    <option value="AI Settings">AI Settings</option>
                    <option value="Developer Settings">Developer Settings</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Edit Permission</label>
                  <select
                    value={inputSettingRole}
                    onChange={(e) => setInputSettingRole(e.target.value)}
                    className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 font-semibold cursor-pointer text-gray-650"
                  >
                    <option value="All Roles">All Roles</option>
                    <option value="Admin">Admin & Higher</option>
                    <option value="Super Admin">Super Admin Only</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="modalSettingEnabled"
                  checked={inputSettingEnabled}
                  onChange={(e) => setInputSettingEnabled(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer"
                />
                <label htmlFor="modalSettingEnabled" className="font-bold text-gray-600 cursor-pointer">
                  Activate key immediately on submit
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-150/40">
                <button
                  type="button"
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-650 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 ${activeTheme.button} font-bold rounded-xl shadow transition-all`}
                >
                  {editingSetting ? "Save Changes" : "Create Setting"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Config Import JSON Overlay Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in text-xs">
          <div className={`max-w-md w-full p-6 rounded-3xl border shadow-2xl space-y-4 ${isDarkMode ? "bg-[#1A1311] border-gray-800 text-white" : "bg-white border-[#C09355]/20 text-[#2E1E1A]"}`}>
            <div className="flex justify-between items-center border-b pb-3 border-gray-150/40">
              <h3 className="font-serif font-bold text-sm">
                Import JSON Website Configuration
              </h3>
              <button onClick={() => setIsImportModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleImportSettings} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Paste JSON Configuration Array</label>
                <textarea
                  required
                  rows={6}
                  placeholder={`[\n  {\n    "key": "custom_logo_url",\n    "value": "/assets/logo.png",\n    "category": "General"\n  }\n]`}
                  value={importConfigString}
                  onChange={(e) => setImportConfigString(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 font-mono text-[11px] focus:outline-none text-[#3D1E16] dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-150/40">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-650 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 ${activeTheme.button} font-bold rounded-xl shadow transition-all`}
                >
                  Merge Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ERP: Create Task Modal */}
      {isCreateTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in text-xs text-[#2E1E1A]">
          <div className="max-w-md w-full p-6 rounded-3xl border bg-white dark:bg-[#1A1311] border-[#C09355]/20 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center border-b pb-3 border-gray-150/40">
              <h3 className="font-serif font-bold text-sm dark:text-white">Create Departmental Task</h3>
              <button onClick={() => setIsCreateTaskModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newTaskTitle) return;
                const newT: any = {
                  id: `T-${Date.now().toString().slice(-3)}`,
                  title: newTaskTitle,
                  description: newTaskDesc,
                  departmentId: activeModule,
                  assignedTo: newTaskAssignedTo,
                  assignedBy: selectedRole,
                  priority: newTaskPriority,
                  dueDate: newTaskDueDate || new Date().toISOString().split("T")[0],
                  status: "PENDING",
                  checklist: [
                    { label: "Verify workflow specification parameters", done: false },
                    { label: "Perform quality control check", done: false }
                  ],
                  comments: [],
                  approvalStatus: "NONE",
                  approvalHistory: []
                };
                setErpTasks([newT, ...erpTasks]);
                setIsCreateTaskModalOpen(false);
                logERPAction(activeModule, "TASK_CREATED", `Created task ${newT.id}: ${newT.title}`);
                sendERPNotification("IN_APP", newT.assignedTo, `New Task Assigned: ${newT.title}`);
                showToast(`Task ${newT.id} created successfully.`);
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Draft Vendor Specifications agreement"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Task Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summarize the core requirements..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-xl dark:bg-gray-800 text-xs text-gray-650"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Assign To</label>
                  <select
                    value={newTaskAssignedTo}
                    onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl dark:bg-gray-800 text-xs text-gray-655"
                  >
                    {employeeRegistry.map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name} ({emp.post})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Due Date</label>
                <input
                  type="date"
                  required
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-150/40">
                <button
                  type="button"
                  onClick={() => setIsCreateTaskModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-650 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 ${activeTheme.button} font-bold rounded-xl`}
                >
                  Publish Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ERP: Task Details & Actions Modal */}
      {isTaskModalOpen && selectedTaskForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in text-xs text-[#2E1E1A]">
          <div className="max-w-md w-full p-6 rounded-3xl border bg-white dark:bg-[#1A1311] border-[#C09355]/20 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center border-b pb-3 border-gray-150/40">
              <div>
                <span className="font-mono text-[9px] text-[#B56D3E] font-black">{selectedTaskForView.id}</span>
                <h3 className="font-serif font-bold text-sm dark:text-white leading-tight">{selectedTaskForView.title}</h3>
              </div>
              <button onClick={() => setIsTaskModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 leading-relaxed">
              <div>
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Task Description</span>
                <p className="text-gray-700 dark:text-gray-200">{selectedTaskForView.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-gray-400 font-bold block uppercase tracking-wider text-[8px]">Assigned Employee</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedTaskForView.assignedTo}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block uppercase tracking-wider text-[8px]">Due Date</span>
                  <span className="font-mono text-gray-700 dark:text-gray-300">{selectedTaskForView.dueDate}</span>
                </div>
              </div>

              {/* Checklist Toggler */}
              <div className="space-y-1.5 pt-2">
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Operational Checklist</span>
                <div className="space-y-1">
                  {selectedTaskForView.checklist.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={(e) => {
                          const updatedCheck = selectedTaskForView.checklist.map((c: any, i: number) =>
                            i === idx ? { ...c, done: e.target.checked } : c
                          );
                          const updatedTasks = erpTasks.map(t =>
                            t.id === selectedTaskForView.id ? { ...t, checklist: updatedCheck } : t
                          );
                          setErpTasks(updatedTasks);
                          setSelectedTaskForView({ ...selectedTaskForView, checklist: updatedCheck });
                          logERPAction(activeModule, "CHECKLIST_TOGGLE", `Updated checklist item: ${item.label}`);
                        }}
                        className="w-3.5 h-3.5 rounded cursor-pointer text-[#B56D3E]"
                      />
                      <span className={`text-[11px] font-medium text-gray-700 dark:text-gray-300 ${item.done ? "line-through text-gray-400" : ""}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-2 pt-2">
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Comments & Updates</span>
                <div className="space-y-2 max-h-[100px] overflow-y-auto pr-1">
                  {selectedTaskForView.comments.length === 0 ? (
                    <p className="text-[10px] text-gray-400 italic">No notes posted yet.</p>
                  ) : (
                    selectedTaskForView.comments.map((c: any, idx: number) => (
                      <div key={idx} className="p-2 border border-gray-100 rounded-xl bg-gray-50/50 text-[10px] leading-relaxed">
                        <div className="flex justify-between font-bold text-gray-600">
                          <span>{c.user}</span>
                          <span className="text-[8px] font-mono">{c.timestamp}</span>
                        </div>
                        <p className="text-gray-700">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add comment..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="flex-grow px-3 py-1.5 border border-gray-250 rounded-xl text-[10px]"
                  />
                  <button
                    onClick={() => {
                      if (!newCommentText) return;
                      const newC = {
                        user: selectedRole,
                        text: newCommentText,
                        timestamp: new Date().toLocaleString("en-IN").slice(-11, -3)
                      };
                      const updatedComments = [...selectedTaskForView.comments, newC];
                      const updatedTasks = erpTasks.map(t =>
                        t.id === selectedTaskForView.id ? { ...t, comments: updatedComments } : t
                      );
                      setErpTasks(updatedTasks);
                      setSelectedTaskForView({ ...selectedTaskForView, comments: updatedComments });
                      setNewCommentText("");
                      logERPAction(activeModule, "TASK_COMMENT_ADD", `Added comment on task ${selectedTaskForView.id}`);
                    }}
                    className={`px-3 py-1.5 ${activeTheme.button} font-bold rounded-xl text-[10px]`}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 dark:border-gray-750 flex flex-col gap-2">
              {/* Submission Logic */}
              {selectedTaskForView.status !== "COMPLETED" && selectedTaskForView.approvalStatus === "NONE" && (
                <button
                  onClick={() => {
                    const updatedTasks = erpTasks.map(t =>
                      t.id === selectedTaskForView.id
                        ? { ...t, approvalStatus: "PENDING_TL" as const, status: "PENDING" as const }
                        : t
                    );
                    setErpTasks(updatedTasks);
                    setIsTaskModalOpen(false);
                    logERPAction(activeModule, "TASK_APPROVAL_SUBMIT", `Submitted task ${selectedTaskForView.id} for Team Leader review`);
                    sendERPNotification("IN_APP", "Team Leader", `Review required: Task ${selectedTaskForView.title}`);
                    showToast("Task submitted for review successfully.");
                  }}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider text-center"
                >
                  Submit for Approval Review
                </button>
              )}

              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="w-full py-2 bg-gray-100 text-gray-655 rounded-xl font-bold text-[10px] uppercase text-center"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ERP: Reconfigure Teams Modal */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in text-xs text-[#2E1E1A]">
          <div className="max-w-md w-full p-6 rounded-3xl border bg-white dark:bg-[#1A1311] border-[#C09355]/20 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center border-b pb-3 border-gray-150/40">
              <h3 className="font-serif font-bold text-sm dark:text-white">Reconfigure Departmental Teams</h3>
              <button onClick={() => setIsTeamModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newTeamNameInput) return;
                const newTm = {
                  id: `TM-${Date.now().toString().slice(-2)}`,
                  name: newTeamNameInput,
                  departmentId: activeModule,
                  teamLeaderId: newTeamLeaderInput,
                  memberIds: ["Kunal Kishor", "Rohit Deshpande", "Amit Trivedi"]
                };
                setErpTeams([newTm, ...erpTeams.filter(t => t.departmentId !== activeModule)]);
                setIsTeamModalOpen(false);
                logERPAction(activeModule, "TEAM_RECONFIGURED", `Configured team ${newTm.name} with TL ${newTm.teamLeaderId}`);
                showToast("Departmental team reconfigured.");
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Team Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Procurement Operations A"
                  value={newTeamNameInput}
                  onChange={(e) => setNewTeamNameInput(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Team Leader</label>
                <select
                  value={newTeamLeaderInput}
                  onChange={(e) => setNewTeamLeaderInput(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl dark:bg-gray-800 text-xs text-gray-655"
                >
                  {employeeRegistry.map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name} ({emp.post})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-150/40">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-650 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 ${activeTheme.button} font-bold rounded-xl`}
                >
                  Save Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#3D1E16] text-[#FAF5EE] border border-[#C09355]/30 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in-up">
          <Activity className="w-4 h-4 text-[#C09355] animate-spin" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAF5EE] dark:bg-[#1c0f0c]">
        <div className="w-10 h-10 border-4 border-[#B56D3E] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
