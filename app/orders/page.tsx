"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/lib/cart";
import { 
  Package, 
  MapPin, 
  Truck, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Star, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  Gift,
  Coins,
  ChevronRight,
  User,
  ShoppingBag,
  X,
  Search,
  Filter,
  CreditCard,
  MessageSquare,
  FileText,
  Printer,
  ChevronDown,
  Upload,
  AlertOctagon,
  CornerUpLeft,
  ThumbsUp
} from "lucide-react";
import Link from "next/link";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variantId?: string | null;
  variantName?: string;
  variantValue?: string;
  taxRate: number;
}

interface Order {
  id: string;
  invoiceNumber: string;
  netAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  courier: string;
  trackingCode: string;
  currentCity: string;
  pincode: string;
  
  // Custom enhanced fields
  shippingName: string;
  shippingAddress: string;
  shippingMobile: string;
  deliveryInstructions: string;
  expectedDeliveryDate: string;
  deliveryOtp: string;
  
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponDiscount: number;
  walletUsed: number;
  rewardPointsUsed: number;
  taxAmount: number;
  
  vendorName: string;
  vendorBusinessName: string;
  vendorDistrict: string;
  vendorState: string;
  vendorRating: number;
  vendorYearsOnPlatform: number;
  
  returnStatus: string;
  refundStatus: string;
}

const TIMELINE_STAGES = [
  { name: "Order Placed", dept: "Customer Systems", progress: "100%", offsetHours: 0, notes: "Order received and queued." },
  { name: "Payment Verified", dept: "Finance Department", progress: "100%", offsetHours: 0.2, notes: "Payment authorized successfully." },
  { name: "Vendor Accepted", dept: "Artisan Operations", progress: "100%", offsetHours: 1.5, notes: "Artisan acknowledged product request." },
  { name: "Product Preparing", dept: "Artisan Workshop", progress: "100%", offsetHours: 4, notes: "Weaving/pottery final finishing steps in progress." },
  { name: "Quality Check", dept: "Quality Control", progress: "100%", offsetHours: 8, notes: "Passed museum-grade craftsmanship test." },
  { name: "Packed", dept: "Fulfillment Center", progress: "100%", offsetHours: 10, notes: "Secure double-wall boxes with bubble wrap applied." },
  { name: "Ready for Pickup", dept: "Fulfillment Center", progress: "100%", offsetHours: 12, notes: "Awaiting courier arrival." },
  { name: "Picked by Courier", dept: "Logistics Hub", progress: "100%", offsetHours: 14, notes: "Package received at district sorting center." },
  { name: "In Transit", dept: "Logistics Hub", progress: "100%", offsetHours: 24, notes: "Dispatched from primary cluster hub." },
  { name: "Reached Destination City", dept: "Delivery Hub", progress: "15%", offsetHours: 48, notes: "Arrived at destination warehouse." },
  { name: "Out for Delivery", dept: "Delivery Hub", progress: "0%", offsetHours: 52, notes: "Assigned to courier delivery partner." },
  { name: "Delivered", dept: "Delivery Partner", progress: "0%", offsetHours: 54, notes: "Doorstep delivery completed." },
  { name: "Customer Confirmation", dept: "Customer Systems", progress: "0%", offsetHours: 55, notes: "OTP verification completed." },
  { name: "Review Requested", dept: "Marketing Console", progress: "0%", offsetHours: 56, notes: "Feedback mail sent to patron." }
];

export default function CustomerOrdersHubPage() {
  const { addToCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("o-1");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [timeFilter, setTimeFilter] = useState("ALL"); // ALL, last30, last6M, lastYear

  // Modals/Overlays
  const [complaintOrderId, setComplaintOrderId] = useState<string | null>(null);
  const [complaintCategory, setComplaintCategory] = useState("DAMAGED_ITEM");
  const [complaintText, setComplaintText] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState("QUALITY_DEFECT");
  const [returnText, setReturnText] = useState("");

  const [activeChatOrderId, setActiveChatOrderId] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: "support", text: "Namaste! Welcome to Cultural Clutch Care. How may I help you with your order today?", time: "10:15 AM" }
  ]);

  const [reviewProductId, setReviewProductId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const activeTheme = {
    button: "bg-[#B56D3E] hover:bg-[#9B5A2F] text-white",
    text: "text-[#B56D3E]"
  };

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "o-1",
      invoiceNumber: "INV-2026-0001",
      netAmount: 4350,
      status: "SHIPPED",
      createdAt: new Date(Date.now() - 3600000 * 36).toISOString(), // 1.5 days ago
      items: [
        {
          productId: "p-1",
          name: "Blue Pottery Flower Vase Jaipur",
          price: 1800,
          image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=300&q=80",
          quantity: 1,
          variantId: "v-1",
          variantName: "Color",
          variantValue: "Jaipur Cobalt Blue",
          taxRate: 12
        },
        {
          productId: "p-2",
          name: "Organic Saharsa Makhana (Foxnut)",
          price: 850,
          image: "https://images.unsplash.com/photo-1596178060810-72cb62112e75?auto=format&fit=crop&w=300&q=80",
          quantity: 3,
          taxRate: 5
        }
      ],
      courier: "Delhivery Express",
      trackingCode: "DEL-90182531",
      currentCity: "Varanasi Logistics Sorting Facility",
      pincode: "221001",
      shippingName: "Abhishek Sharma",
      shippingAddress: "E-102, Shriram Apartments, Sector 62, Noida, Uttar Pradesh, 201301",
      shippingMobile: "+91 99880 12345",
      deliveryInstructions: "Leave package with gatekeeper inside guard box.",
      expectedDeliveryDate: new Date(Date.now() + 3600000 * 48).toISOString(),
      deliveryOtp: "4921",
      paymentMethod: "RAZORPAY",
      paymentStatus: "PAID",
      transactionId: "TXN-880012341",
      subtotal: 4150,
      shippingFee: 0,
      discount: 200,
      couponDiscount: 0,
      walletUsed: 0,
      rewardPointsUsed: 0,
      taxAmount: 400,
      vendorName: "Pt. Radhe Shyam",
      vendorBusinessName: "Jaipur Blue Pottery Cooperative",
      vendorDistrict: "Jaipur",
      vendorState: "Rajasthan",
      vendorRating: 4.9,
      vendorYearsOnPlatform: 4,
      returnStatus: "NOT_APPLICABLE",
      refundStatus: "NOT_APPLICABLE"
    },
    {
      id: "o-2",
      invoiceNumber: "INV-2026-0002",
      netAmount: 12400,
      status: "DELIVERED",
      createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(), // 5 days ago
      items: [
        {
          productId: "p-3",
          name: "Banarasi Handloom Katan Silk Saree",
          price: 12400,
          image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80",
          quantity: 1,
          variantId: "v-2",
          variantName: "Pattern",
          variantValue: "Gold Brocade Zari",
          taxRate: 5
        }
      ],
      courier: "BlueDart Premium",
      trackingCode: "BD-4512903",
      currentCity: "Delivered (Signature Verified)",
      pincode: "400001",
      shippingName: "Abhishek Sharma",
      shippingAddress: "E-102, Shriram Apartments, Sector 62, Noida, Uttar Pradesh, 201301",
      shippingMobile: "+91 99880 12345",
      deliveryInstructions: "Call before coming.",
      expectedDeliveryDate: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
      deliveryOtp: "9021",
      paymentMethod: "COD",
      paymentStatus: "PAID",
      transactionId: "TXN-COD-91283",
      subtotal: 12000,
      shippingFee: 0,
      discount: 0,
      couponDiscount: 200,
      walletUsed: 100,
      rewardPointsUsed: 300,
      taxAmount: 600,
      vendorName: "Bunkar Samaj Coop",
      vendorBusinessName: "Banarasi Heritage Weavers",
      vendorDistrict: "Varanasi",
      vendorState: "Uttar Pradesh",
      vendorRating: 4.8,
      vendorYearsOnPlatform: 8,
      returnStatus: "NOT_APPLICABLE",
      refundStatus: "NOT_APPLICABLE"
    }
  ]);

  const normalizeOrder = (o: any): Order => {
    return {
      ...o,
      shippingName: o.shippingName || "Abhishek Sharma",
      shippingAddress: o.shippingAddress || (o.address ? `${o.address.street}, ${o.address.city}, ${o.address.state}, ${o.address.pincode}` : "E-102, Shriram Apartments, Sector 62, Noida, Uttar Pradesh, 201301"),
      shippingMobile: o.shippingMobile || "+91 99880 12345",
      deliveryInstructions: o.deliveryInstructions || "Leave package with gatekeeper inside guard box.",
      expectedDeliveryDate: o.expectedDeliveryDate || new Date(new Date(o.createdAt).getTime() + 4 * 24 * 3600000).toISOString(),
      deliveryOtp: o.deliveryOtp || Math.floor(1000 + Math.random() * 9000).toString(),
      paymentMethod: o.paymentMethod || "RAZORPAY",
      paymentStatus: o.paymentStatus || "PAID",
      transactionId: o.transactionId || `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      subtotal: o.subtotal || o.netAmount - Math.round(o.netAmount * 0.08),
      shippingFee: o.shippingFee ?? 0,
      discount: o.discount ?? 0,
      couponDiscount: o.couponDiscount ?? 0,
      walletUsed: o.walletUsed ?? 0,
      rewardPointsUsed: o.rewardPointsUsed ?? 0,
      taxAmount: o.taxAmount || Math.round(o.netAmount * 0.08),
      vendorName: o.vendorName || "Ramprasad Weavers",
      vendorBusinessName: o.vendorBusinessName || "Traditional Rural Crafts Co.",
      vendorDistrict: o.vendorDistrict || "Varanasi",
      vendorState: o.vendorState || "Uttar Pradesh",
      vendorRating: o.vendorRating || 4.7,
      vendorYearsOnPlatform: o.vendorYearsOnPlatform || 3,
      returnStatus: o.returnStatus || "NOT_APPLICABLE",
      refundStatus: o.refundStatus || "NOT_APPLICABLE"
    };
  };

  useEffect(() => {
    setMounted(true);
    try {
      const localOrdersStr = localStorage.getItem("customer_orders");
      if (localOrdersStr) {
        const parsed = JSON.parse(localOrdersStr);
        if (parsed.length > 0) {
          const normalized = parsed.map((item: any) => normalizeOrder(item));
          setOrders(prev => {
            const existingIds = new Set(prev.map(o => o.id));
            const filteredLocal = normalized.filter((o: any) => !existingIds.has(o.id));
            return [...filteredLocal, ...prev];
          });
          setSelectedOrderId(normalized[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load local orders:", e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  const handleReorder = (item: OrderItem) => {
    addToCart({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      variantId: item.variantId || null,
      variantName: item.variantName || undefined,
      variantValue: item.variantValue || undefined,
      taxRate: item.taxRate
    });
    showToast(`Added "${item.name}" back to cart!`);
  };

  const handleReorderAll = (order: Order) => {
    order.items.forEach(item => {
      addToCart({
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        variantId: item.variantId || null,
        variantName: item.variantName || undefined,
        variantValue: item.variantValue || undefined,
        taxRate: item.taxRate
      });
    });
    showToast("Reordered all items! Forwarding to Cart.");
    setTimeout(() => {
      window.location.href = "/checkout";
    }, 1500);
  };

  const handleInitiateReturn = (orderId: string) => {
    setReturnOrderId(orderId);
  };

  const submitReturnRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnOrderId) return;
    const updated = orders.map(o => {
      if (o.id === returnOrderId) {
        return {
          ...o,
          status: "RETURN_INITIATED",
          returnStatus: "Return Approved (Artisan assigned)",
          refundStatus: "Refund Invoiced (Pending verification)"
        };
      }
      return o;
    });
    setOrders(updated);
    showToast("Return request submitted. Artisan partner will verify item authenticity.");
    setReturnOrderId(null);
    setReturnText("");
  };

  const handleCancelOrder = (orderId: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      const updated = orders.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: "CANCELLED",
            refundStatus: "REFUNDED_TO_ORIGINAL_SOURCE"
          };
        }
        return o;
      });
      setOrders(updated);
      showToast("Order cancelled successfully. Refund initiated to wallet/card.");
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewProductId) return;
    showToast("Thank you! Your feedback is synced with our local artisan database.");
    setReviewProductId(null);
    setReviewComment("");
    setReviewRating(5);
  };

  const submitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintOrderId) return;
    showToast("Complaint registered. Ticket raised to quality audit department.");
    setComplaintOrderId(null);
    setComplaintText("");
    setUploadedFiles([]);
  };

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const newMsg = { sender: "user", text: chatMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages([...chatMessages, newMsg]);
    setChatMessage("");
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: "support", text: "Checking details for your order. We are contacting the logistics partner for live updates...", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 1200);
  };

  const handlePrintInvoice = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const taxTable = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong><br>
          <span style="font-size: 10px; color: #888;">${item.variantName ? `${item.variantName}: ${item.variantValue}` : ''}</span>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; font-family: monospace;">₹${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.taxRate}%</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; font-family: monospace; text-align: right;">₹${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `).join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.invoiceNumber}</title>
          <style>
            body { font-family: sans-serif; color: #3D1E16; padding: 40px; line-height: 1.4; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px dashed #C09355; padding-bottom: 20px; }
            .logo { font-size: 24px; font-family: serif; font-weight: bold; color: #3D1E16; }
            .details { display: flex; justify-content: space-between; margin-top: 30px; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 35px; font-size: 12px; }
            th { padding: 10px; background: #FAF5EE; text-align: left; border-bottom: 2px solid #C09355; }
            .total { margin-top: 30px; text-align: right; font-size: 14px; font-weight: bold; border-top: 2px dashed #C09355; padding-top: 15px; }
            .footer { text-align: center; margin-top: 60px; font-size: 9px; color: #888; border-top: 1px dashed #ccc; padding-top: 20px; }
            .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 9px; font-weight: bold; text-transform: uppercase; border: 1px solid; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">Cultural Clutch</div>
              <div style="font-size: 10px; color: #B56D3E; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">Vocal for Local • ODOP Marketplace</div>
              <div style="font-size: 10px; color: #555; margin-top: 5px;">GSTIN: 33AAAAA1111A1Z1</div>
            </div>
            <div style="text-align: right; font-size: 12px;">
              <h2 style="margin: 0; color: #B56D3E;">TAX INVOICE</h2>
              <div style="margin-top: 5px;">Invoice #: <strong>${order.invoiceNumber}</strong></div>
              <div>Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}</div>
              <div>Order ID: ${order.id}</div>
            </div>
          </div>
          
          <div class="details">
            <div>
              <strong>Billed To:</strong><br>
              ${order.shippingName}<br>
              ${order.shippingAddress}<br>
              Mobile: ${order.shippingMobile}
            </div>
            <div style="text-align: right;">
              <strong>Artisan/Vendor Center:</strong><br>
              ${order.vendorBusinessName}<br>
              ${order.vendorDistrict}, ${order.vendorState}<br>
              District GI Tag Reference: Verified
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Product Specialty</th>
                <th>Rate</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: center;">GST</th>
                <th style="text-align: right;">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              ${taxTable}
            </tbody>
          </table>

          <div class="total">
            <div style="margin-bottom: 5px; color: #777;">Base Subtotal: ₹${order.subtotal.toLocaleString()}</div>
            <div style="margin-bottom: 5px; color: #777;">CGST + SGST tax: ₹${order.taxAmount.toLocaleString()}</div>
            <div style="margin-bottom: 5px; color: #777;">Shipping & Packaging: ₹${order.shippingFee.toLocaleString()}</div>
            ${order.discount > 0 ? `<div style="margin-bottom: 5px; color: #2e7d32;">Coupon/Store Discount: -₹${order.discount.toLocaleString()}</div>` : ''}
            ${order.walletUsed > 0 ? `<div style="margin-bottom: 5px; color: #2e7d32;">Wallet Credits Used: -₹${order.walletUsed.toLocaleString()}</div>` : ''}
            <div style="font-size: 16px; margin-top: 10px; color: #3D1E16;">Final Amount Paid: <strong style="color: #B56D3E;">₹${order.netAmount.toLocaleString()}</strong></div>
            <div style="font-size: 10px; color: #888; margin-top: 5px;">Payment Method: ${order.paymentMethod} | Status: ${order.paymentStatus}</div>
          </div>

          <div style="margin-top: 30px; font-size: 11px; border: 1px solid #eee; border-radius: 8px; padding: 15px; background: #fafafa;">
            <strong>Declaration & Terms:</strong><br>
            This invoice certifies that the handloom/craft products listed are procured directly from registered artisans of the designated district under the Government ODOP program. Certified Geographical Indication (GI) labels verify origin authenticity. For returns or replacement, please coordinate via your orders panel within 7 days of delivery.
          </div>

          <div class="footer">
            Thank you for supporting Indian artisans. Handcrafted in India.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // Stepper tracking progress status mapper
  const getStatusStep = (status: string) => {
    switch (status) {
      case "CONFIRMED": return 3;
      case "SHIPPED": return 9;
      case "OUT_FOR_DELIVERY": return 11;
      case "DELIVERED": return 13;
      case "RETURN_INITIATED": return 10;
      case "RETURNED": return 14;
      case "CANCELLED": return 2;
      default: return 1;
    }
  };

  const step = getStatusStep(selectedOrder.status);

  // Filters logic
  const filteredOrders = orders.filter(o => {
    // 1. Text Search
    const searchMatch = searchTerm === "" || 
      o.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      o.vendorBusinessName.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Status Filter
    const statusMatch = statusFilter === "ALL" || o.status === statusFilter;

    // 3. Payment Filter
    const paymentMatch = paymentFilter === "ALL" || o.paymentMethod === paymentFilter;

    // 4. Time Filter
    let timeMatch = true;
    if (timeFilter === "last30") {
      timeMatch = new Date(o.createdAt).getTime() >= Date.now() - 30 * 24 * 3600000;
    } else if (timeFilter === "last6M") {
      timeMatch = new Date(o.createdAt).getTime() >= Date.now() - 180 * 24 * 3600000;
    } else if (timeFilter === "lastYear") {
      timeMatch = new Date(o.createdAt).getTime() >= Date.now() - 365 * 24 * 3600000;
    }

    return searchMatch && statusMatch && paymentMatch && timeMatch;
  });

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FAF5EE] flex items-center justify-center flex-col gap-3">
        <div className="w-10 h-10 border-4 border-[#B56D3E] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-gray-550 font-sans">Loading orders dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF5EE] text-[#2E1E1A] py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#B56D3E] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-600">My Orders Portal</span>
        </div>

        {/* Header Title with Points Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-2">
            <h1 className="text-3xl font-serif text-[#3D1E16] font-bold tracking-wide flex items-center gap-2">
              <ShoppingBag className="w-8 h-8 text-[#B56D3E]" /> My Orders & Shipment Tracking
            </h1>
            <p className="text-sm text-gray-555">
              Download GST tax invoices, communicate with vendor cooperatives, monitor 15-stage real-time shipment timelines, or initiate return processes.
            </p>
          </div>

          <div className="lg:col-span-4 bg-gradient-to-br from-[#3D1E16] to-[#22100B] text-white p-5 rounded-2xl shadow-md border border-[#C09355]/30 relative overflow-hidden flex items-center justify-between">
            <div className="absolute top-0 right-0 p-8 bg-[#C09355]/10 rounded-full blur-xl pointer-events-none" />
            <div className="space-y-1">
              <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest block">Loyalty Points Balance</span>
              <span className="text-2xl font-serif font-extrabold flex items-center gap-1.5 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-[#C09355]">
                <Coins className="w-6 h-6 text-amber-400" /> 450 Coins
              </span>
              <span className="block text-[9px] text-gray-400 font-medium">1 Coin = ₹1 value rebate.</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
              <span className="text-[9px] font-extrabold text-amber-400 uppercase block tracking-wider">Patron Status</span>
              <span className="text-xs font-bold text-white uppercase block">Silver Tier</span>
            </div>
          </div>
        </div>

        {/* Redesigned Search & Filters Header */}
        <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by invoice number, product name, or vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#3D1E16] focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 transition-all"
              />
            </div>

            {/* Quick Summary */}
            <div className="text-xs font-bold text-[#B56D3E] shrink-0 uppercase tracking-wide">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          </div>

          {/* Expanded filters row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-left">
            <div>
              <label className="block text-[9px] uppercase font-extrabold text-gray-400 mb-1">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-55 border border-gray-200 rounded-xl font-semibold text-gray-700 cursor-pointer focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="CONFIRMED">Placed / Confirmed</option>
                <option value="SHIPPED">Shipped / In Transit</option>
                <option value="DELIVERED">Delivered</option>
                <option value="RETURN_INITIATED">Return Initiated</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-extrabold text-gray-400 mb-1">Timeframe</label>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-55 border border-gray-200 rounded-xl font-semibold text-gray-700 cursor-pointer focus:outline-none"
              >
                <option value="ALL">All History</option>
                <option value="last30">Last 30 Days</option>
                <option value="last6M">Last 6 Months</option>
                <option value="lastYear">Last Year</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-extrabold text-gray-400 mb-1">Payment Method</label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-55 border border-gray-200 rounded-xl font-semibold text-gray-700 cursor-pointer focus:outline-none"
              >
                <option value="ALL">All Payment Types</option>
                <option value="RAZORPAY">Razorpay UPI/Card</option>
                <option value="COD">Cash on Delivery</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                  setTimeFilter("ALL");
                  setPaymentFilter("ALL");
                }}
                className="w-full py-2 border border-gray-200 hover:bg-gray-50 text-gray-655 font-bold rounded-xl text-center"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Main Section layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Past Orders list */}
          <div className="lg:col-span-4 space-y-4 max-h-[800px] overflow-y-auto pr-1">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 text-left">Order Packages</h2>
            
            {filteredOrders.length === 0 ? (
              <div className="text-center p-8 bg-[#FDFBF7] border border-dashed rounded-2xl text-gray-400 text-xs">
                No orders match your filter criteria.
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isSelected = order.id === selectedOrderId;
                return (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex justify-between items-center bg-[#FDFBF7] ${
                      isSelected
                        ? "border-[#B56D3E] ring-2 ring-[#B56D3E]/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="space-y-2 flex-1 min-w-0 pr-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono font-bold text-xs text-[#3D1E16]">{order.invoiceNumber}</span>
                        <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                          order.status === "DELIVERED"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : order.status === "CANCELLED"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : order.status === "RETURN_INITIATED"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      
                      {/* Products preview */}
                      <div className="flex gap-2 items-center">
                        {order.items.slice(0, 3).map((item, i) => (
                          <img key={i} src={item.image} alt="preview" className="w-8 h-8 object-cover rounded-lg border bg-gray-50 shrink-0" />
                        ))}
                        {order.items.length > 3 && (
                          <span className="text-[10px] text-gray-400 font-bold">+{order.items.length - 3}</span>
                        )}
                      </div>

                      <p className="text-[9px] text-gray-450 font-semibold font-mono">
                        Invoice Date: {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </p>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-serif font-extrabold text-[#3D1E16]">
                          ₹{order.netAmount.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-gray-450 font-bold italic line-clamp-1">{order.vendorBusinessName}</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isSelected ? "translate-x-1" : ""}`} />
                  </button>
                );
              })
            )}
          </div>

          {/* RIGHT: Detailed Active View */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Header panel with basic actions */}
            <div className="bg-[#FDFBF7] border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100 text-left">
                <div>
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-gray-400 block">Active Selected Package</span>
                  <h2 className="text-xl font-serif text-[#3D1E16] font-bold mt-0.5">{selectedOrder.invoiceNumber}</h2>
                  <p className="text-[10px] text-gray-450 font-mono mt-0.5">Order UID: {selectedOrder.id}</p>
                </div>

                {/* Print/Invoice Actions */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handlePrintInvoice(selectedOrder)}
                    className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print / Tax Invoice
                  </button>
                  
                  <button
                    onClick={() => {
                      showToast("GST tax breakdown downloaded locally as CSV.");
                    }}
                    className="px-3.5 py-2 border border-[#C09355]/30 hover:bg-[#C09355]/5 text-[#B56D3E] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" /> GST Invoice
                  </button>
                </div>
              </div>

              {/* Delivery Window, Courier tracking, OTP */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2 text-left">
                <div className="space-y-1">
                  <span className="text-gray-400 font-bold uppercase text-[9px] block">Courier Partner</span>
                  <span className="font-bold text-[#3D1E16] block">{selectedOrder.courier}</span>
                  <span className="text-[10px] text-gray-500 font-mono">Tracking: {selectedOrder.trackingCode}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-400 font-bold uppercase text-[9px] block">Expected Delivery Window</span>
                  <span className="font-bold text-green-700 block">
                    {new Date(selectedOrder.expectedDeliveryDate).toLocaleDateString("en-IN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <span className="text-[10px] text-gray-550 block">Status: {selectedOrder.currentCity}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-400 font-bold uppercase text-[9px] block">Delivery Partner Pin OTP</span>
                  {selectedOrder.status === "DELIVERED" ? (
                    <span className="font-bold text-gray-400 block line-through">Used (Verified)</span>
                  ) : (
                    <span className="font-serif font-black text-sm text-amber-600 block bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50 w-fit">
                      OTP: {selectedOrder.deliveryOtp}
                    </span>
                  )}
                  <span className="text-[9px] text-gray-400 block">Provide code at delivery doorstep.</span>
                </div>
              </div>

              {/* Delivery Instructions */}
              <div className="p-3 bg-gray-55 border text-[11px] text-[#3D1E16] flex items-center gap-2 rounded-xl text-left">
                <ShieldCheck className="w-4 h-4 text-[#B56D3E] shrink-0" />
                <div>
                  <strong className="text-gray-500">Delivery Instructions:</strong> {selectedOrder.deliveryInstructions}
                </div>
              </div>
            </div>

            {/* 2. Real-Time 15-Stage Stepper Order Timeline */}
            <div className="bg-[#FDFBF7] border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 border-b pb-2 mb-4 text-left">Real-Time Progress Timeline</h3>
              
              <div className="max-h-[350px] overflow-y-auto pr-2 space-y-4">
                {TIMELINE_STAGES.map((s, idx) => {
                  const isCompleted = step > idx;
                  const isActive = step === idx + 1;
                  
                  // Calculate dynamic simulated timestamp based on order.createdAt
                  const baseTime = new Date(selectedOrder.createdAt).getTime();
                  const stageTime = new Date(baseTime + s.offsetHours * 3600000);
                  
                  return (
                    <div key={idx} className="flex gap-4 items-start relative text-xs text-left">
                      
                      {/* Connection bar */}
                      {idx < TIMELINE_STAGES.length - 1 && (
                        <div className={`absolute left-4.5 top-8 w-0.5 h-12 -translate-x-1/2 ${
                          isCompleted ? "bg-[#B56D3E]" : "bg-gray-150"
                        }`} />
                      )}

                      {/* Step index icon */}
                      <div className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 font-bold transition-all z-10 ${
                        isCompleted
                          ? "bg-[#B56D3E] border-[#B56D3E] text-white shadow-sm"
                          : isActive
                          ? "bg-amber-500 border-amber-500 text-white animate-pulse"
                          : "bg-white border-gray-200 text-gray-300"
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-4.5 h-4.5" /> : idx + 1}
                      </div>

                      {/* Stage info */}
                      <div className="flex-grow space-y-0.5">
                        <div className="flex justify-between items-baseline flex-wrap">
                          <span className={`font-bold text-sm ${
                            isCompleted || isActive ? "text-[#3D1E16]" : "text-gray-300"
                          }`}>
                            {s.name}
                          </span>
                          
                          {(isCompleted || isActive) && (
                            <span className="text-[10px] text-gray-400 font-mono">
                              {stageTime.toLocaleDateString("en-IN")} • {stageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-[9px] uppercase font-bold text-gray-450">
                          <span>Dept: {s.dept}</span>
                          {isActive && <span className="bg-amber-100 text-amber-700 px-1 rounded">Active Stage</span>}
                        </div>

                        <p className={`text-[11px] leading-relaxed ${
                          isCompleted || isActive ? "text-gray-655" : "text-gray-300"
                        }`}>
                          {s.notes}
                        </p>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Items list & reorder/review options */}
            <div className="bg-[#FDFBF7] border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 border-b pb-2 text-left">Craft Package Items</h3>
              
              <div className="divide-y divide-gray-100 font-sans">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-left">
                    <div className="flex gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl border shrink-0 bg-gray-50" />
                      <div className="space-y-0.5 text-xs">
                        <h4 className="font-serif font-bold text-sm text-[#3D1E16]">{item.name}</h4>
                        {item.variantValue && (
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{item.variantName}: {item.variantValue}</p>
                        )}
                        <p className="text-gray-500 font-semibold">₹{item.price.toLocaleString()} × {item.quantity}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleReorder(item)}
                        className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-655 font-bold rounded-xl text-[11px] transition-colors"
                      >
                        Buy Again
                      </button>
                      
                      <button
                        onClick={() => setReviewProductId(item.productId)}
                        className="px-3.5 py-2 border border-[#C09355]/30 hover:bg-[#C09355]/5 text-[#B56D3E] font-bold rounded-xl text-[11px] transition-colors font-sans"
                      >
                        Rate Artisan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Delivery Address & Vendor Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Address card */}
              <div className="bg-[#FDFBF7] border border-gray-200 rounded-3xl p-6 shadow-sm space-y-3 text-xs text-left">
                <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Shipping Delivery Address</h4>
                <div className="space-y-1 text-[#2E1E1A]">
                  <p className="font-bold text-sm text-[#3D1E16]">{selectedOrder.shippingName}</p>
                  <p className="leading-relaxed text-gray-655 font-medium">{selectedOrder.shippingAddress}</p>
                  <p className="font-mono text-gray-500 font-bold mt-1">Mobile: {selectedOrder.shippingMobile}</p>
                </div>
              </div>

              {/* Vendor Cooperative card */}
              <div className="bg-[#FDFBF7] border border-gray-200 rounded-3xl p-6 shadow-sm space-y-3 text-xs text-left">
                <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Artisan Cooperatives Center</h4>
                <div className="space-y-1.5 font-sans">
                  <div>
                    <span className="font-serif font-black text-sm text-[#3D1E16] block">{selectedOrder.vendorBusinessName}</span>
                    <span className="text-[10px] text-[#B56D3E] font-bold block">{selectedOrder.vendorName} • {selectedOrder.vendorDistrict}, {selectedOrder.vendorState}</span>
                  </div>
                  <div className="flex gap-2 items-center text-[10px] text-gray-400 font-bold">
                    <span className="flex items-center gap-0.5 text-amber-500"><Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {selectedOrder.vendorRating}</span>
                    <span>•</span>
                    <span>{selectedOrder.vendorYearsOnPlatform} Years Registry</span>
                  </div>
                  <button
                    onClick={() => setActiveChatOrderId(selectedOrder.id)}
                    className="px-3 py-1.5 bg-[#C09355]/10 hover:bg-[#C09355]/20 text-[#B56D3E] font-bold rounded-lg tracking-wide uppercase text-[9px] transition-colors"
                  >
                    Contact Artisan Hub
                  </button>
                </div>
              </div>

            </div>

            {/* 5. Payments Detailed Ledger */}
            <div className="bg-[#FDFBF7] border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4 text-xs text-left">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 border-b pb-2 text-left">Financial Payment Breakdown</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start font-sans">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-500 font-semibold">
                    <span>Base Subtotal Amount:</span>
                    <span className="font-mono">₹{selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 font-semibold">
                    <span>CGST + SGST tax (10% avg):</span>
                    <span className="font-mono">₹{selectedOrder.taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-550 font-semibold">
                    <span>Shipping Handling Fee:</span>
                    <span className="font-mono">{selectedOrder.shippingFee === 0 ? "FREE" : `₹${selectedOrder.shippingFee}`}</span>
                  </div>
                  
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-700 font-semibold">
                      <span>Promo Coupon Discount:</span>
                      <span className="font-mono">-₹{selectedOrder.discount.toLocaleString()}</span>
                    </div>
                  )}

                  {selectedOrder.walletUsed > 0 && (
                    <div className="flex justify-between text-green-700 font-semibold">
                      <span>Store Wallet balance rebate:</span>
                      <span className="font-mono">-₹{selectedOrder.walletUsed.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="border-t pt-2 flex justify-between items-baseline font-bold text-sm">
                    <span className="text-[#3D1E16]">Final Amount Invoiced:</span>
                    <span className="text-base text-[#B56D3E] font-serif">₹{selectedOrder.netAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-55 rounded-2xl border border-gray-150 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#B56D3E]" />
                    <span className="font-bold text-[#3D1E16] text-[11px]">Transaction Credentials</span>
                  </div>
                  <div className="space-y-1 text-[10px] text-gray-550">
                    <p><strong className="text-gray-400 font-bold uppercase text-[9px]">Payment Mode:</strong> {selectedOrder.paymentMethod === "RAZORPAY" ? "Secure Online Payment Gateway" : "Cash on Delivery"}</p>
                    <p><strong className="text-gray-400 font-bold uppercase text-[9px]">Gateway Status:</strong> <span className="text-green-600 font-bold">{selectedOrder.paymentStatus}</span></p>
                    <p className="font-mono select-all"><strong className="text-gray-400 font-bold uppercase text-[9px]">Transaction ID:</strong> {selectedOrder.transactionId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Advanced Customer self-service actions (Cancel, Return, Support Chat, FAQ Hub) */}
            <div className="bg-[#FDFBF7] border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 border-b pb-2 text-left">Customer Service Help Center</h3>
              
              <div className="flex flex-wrap gap-3 font-sans">
                <button
                  onClick={() => setComplaintOrderId(selectedOrder.id)}
                  className="flex-1 min-w-[150px] py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <AlertOctagon className="w-4 h-4" /> Raise Grievance Ticket
                </button>

                <button
                  onClick={() => setActiveChatOrderId(selectedOrder.id)}
                  className="flex-1 min-w-[150px] py-3 bg-[#B56D3E]/10 hover:bg-[#B56D3E]/20 text-[#B56D3E] font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" /> Chat With Support Desk
                </button>

                {selectedOrder.status === "CONFIRMED" && (
                  <button
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    className="flex-1 min-w-[150px] py-3 border border-red-200 hover:bg-red-50 text-red-500 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                  >
                    Request Cancellation
                  </button>
                )}

                {selectedOrder.status === "DELIVERED" && (
                  <button
                    onClick={() => handleInitiateReturn(selectedOrder.id)}
                    className="flex-1 min-w-[150px] py-3 border border-amber-300 hover:bg-amber-50 text-[#B56D3E] font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    <CornerUpLeft className="w-4 h-4" /> Request Return / Replacement
                  </button>
                )}
              </div>

              {/* Dynamic return status tracker if active */}
              {selectedOrder.returnStatus !== "NOT_APPLICABLE" && (
                <div className="p-4 bg-amber-55 text-amber-900 border border-amber-200 rounded-2xl text-xs text-left space-y-1 font-sans">
                  <p className="font-bold flex items-center gap-1.5"><CornerUpLeft className="w-4 h-4" /> Active Return/Refund Processing Tracker</p>
                  <p><strong className="text-amber-800">Return Workflow Status:</strong> {selectedOrder.returnStatus}</p>
                  <p><strong className="text-amber-800">Refund Settlement status:</strong> {selectedOrder.refundStatus}</p>
                </div>
              )}

              {/* Policies & FAQ list */}
              <div className="border-t border-gray-100 pt-4 text-xs text-left space-y-3 font-sans">
                <span className="text-[10px] font-extrabold uppercase text-gray-400 block">Frequently Asked Policies</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] text-gray-550">
                  <div className="space-y-1 p-3 bg-gray-55 rounded-xl border border-gray-150/40">
                    <p className="font-bold text-[#3D1E16] flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-[#B56D3E]" /> How long does return approval take?</p>
                    <p className="leading-relaxed text-gray-500">All handloom and ceramic products undergo direct verification. Once picked up, refund is released to source account within 48 hours.</p>
                  </div>
                  <div className="space-y-1 p-3 bg-gray-55 rounded-xl border border-gray-150/40">
                    <p className="font-bold text-[#3D1E16] flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-[#B56D3E]" /> Can I modify shipping coordinates?</p>
                    <p className="leading-relaxed text-gray-500">For packages awaiting pickup, support chat agents can change address logs inside Logistics before shipping dispatch.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* COMPLAINT MODAL OVERLAY */}
      {complaintOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#FDFBF7] border border-[#C09355]/30 rounded-3xl p-6 shadow-2xl relative space-y-4 text-xs text-left font-sans">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif text-base font-bold text-[#3D1E16]">Raise Quality Grievance</h3>
              <button onClick={() => setComplaintOrderId(null)} className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitComplaint} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-400 uppercase mb-1">Issue Category</label>
                <select
                  value={complaintCategory}
                  onChange={(e) => setComplaintCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-55 border border-gray-200 rounded-xl font-bold cursor-pointer font-sans"
                >
                  <option value="DAMAGED_ITEM">Damaged or broken craft item received</option>
                  <option value="MISSING_ITEM">Missing items from package</option>
                  <option value="WRONG_PRODUCT">Incorrect product variant delivered</option>
                  <option value="COURIER_BAD_EXPERIENCE">Improper courier partner behavior</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-400 uppercase mb-1">Describe the problem</label>
                <textarea
                  required
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  placeholder="Detail the weaving flaw, ceramic cracking, or packaging tearing..."
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-55 border border-gray-205 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20"
                />
              </div>

              {/* Image Upload box */}
              <div>
                <label className="block font-bold text-gray-400 uppercase mb-1">Upload Damage Proof Images</label>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center cursor-pointer hover:bg-gray-50/50 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        const fileNames = Array.from(e.target.files).map(f => f.name);
                        setUploadedFiles(fileNames);
                        showToast(`Attached ${fileNames.length} proof images.`);
                      }
                    }}
                    className="hidden"
                    id="complaint-images-upload"
                  />
                  <label htmlFor="complaint-images-upload" className="cursor-pointer space-y-1 block">
                    <Upload className="w-6 h-6 text-[#B56D3E] mx-auto" />
                    <p className="font-bold text-gray-655">Click or drag images to upload</p>
                    <p className="text-[10px] text-gray-400">PNG, JPG up to 5MB</p>
                  </label>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="mt-2 space-y-1 text-[10px] font-mono text-green-700 bg-green-50/50 p-2 rounded-xl border border-green-200">
                    <p className="font-bold uppercase text-[8px]">Attached Proof Files:</p>
                    {uploadedFiles.map((name, i) => <p key={i}>✓ {name}</p>)}
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t font-sans">
                <button
                  type="button"
                  onClick={() => setComplaintOrderId(null)}
                  className="px-4 py-2 bg-gray-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 ${activeTheme.button} font-bold rounded-xl`}
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RETURN MODAL OVERLAY */}
      {returnOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#FDFBF7] border border-[#C09355]/30 rounded-3xl p-6 shadow-2xl relative space-y-4 text-xs text-left font-sans">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif text-base font-bold text-[#3D1E16]">Initiate Return & Refund</h3>
              <button onClick={() => setReturnOrderId(null)} className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitReturnRequest} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-400 uppercase mb-1">Return Reason</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-55 border border-gray-205 rounded-xl font-bold cursor-pointer font-sans"
                >
                  <option value="QUALITY_DEFECT">Product quality/weaving defect detected</option>
                  <option value="SIZE_INCORRECT">Wrong variant size/fit delivered</option>
                  <option value="COLOR_MISMATCH">Color significantly different from photos</option>
                  <option value="NOT_AS_DESCRIBED">Item features don't match specifications</option>
                  <option value="CHANGED_MIND">No longer required / changed mind</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-400 uppercase mb-1">Detail reasons</label>
                <textarea
                  required
                  value={returnText}
                  onChange={(e) => setReturnText(e.target.value)}
                  placeholder="Provide details for artisan coop feedback audits..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-55 border border-gray-205 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20"
                />
              </div>

              <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-[10px] text-amber-850 leading-normal font-sans">
                <strong>Important:</strong> Refunds are processed immediately to your original payment card once our verification pickup agent scans the product's Geographical Indication (GI) security label at your doorstep. Keep tags intact.
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t font-sans">
                <button
                  type="button"
                  onClick={() => setReturnOrderId(null)}
                  className="px-4 py-2 bg-gray-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 ${activeTheme.button} font-bold rounded-xl`}
                >
                  Submit Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHAT SUPPORT MODAL OVERLAY */}
      {activeChatOrderId && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6 bg-black/40 backdrop-blur-xs font-sans">
          <div className="w-full max-w-sm bg-[#FDFBF7] border border-[#C09355]/30 rounded-3xl shadow-2xl flex flex-col h-[500px] overflow-hidden relative">
            
            {/* Header */}
            <div className="bg-[#3D1E16] text-[#FAF5EE] p-4 flex justify-between items-center border-b border-[#C09355]/20">
              <div>
                <h3 className="font-serif text-sm font-bold text-[#FAF5EE]">Patron Support Desk</h3>
                <p className="text-[9px] text-amber-400 uppercase tracking-widest font-bold">Direct Liaison Hotline</p>
              </div>
              <button onClick={() => setActiveChatOrderId(null)} className="p-1 hover:bg-white/10 rounded-full text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages box */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-amber-500/[0.02] text-xs">
              {chatMessages.map((msg, idx) => {
                const isSupport = msg.sender === "support";
                return (
                  <div key={idx} className={`flex flex-col ${isSupport ? "items-start" : "items-end"}`}>
                    <div className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                      isSupport 
                        ? "bg-white border text-gray-700 rounded-tl-none text-left" 
                        : "bg-[#B56D3E] text-white rounded-tr-none text-left"
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] text-gray-400 mt-1 px-1 font-mono">{msg.time || "Just now"}</span>
                  </div>
                );
              })}
            </div>

            {/* Input Form */}
            <form onSubmit={sendChatMessage} className="p-3 border-t bg-white flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your message about courier or return status..."
                className="flex-grow px-3.5 py-2 border rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-[#B56D3E]"
              />
              <button
                type="submit"
                className="p-2 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-full flex items-center justify-center shrink-0"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ARTISAN REVIEW MODAL OVERLAY */}
      {reviewProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#FDFBF7] border-2 border-[#C09355]/20 rounded-3xl p-6 shadow-2xl text-xs text-left space-y-4 font-sans">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-[#3D1E16] uppercase tracking-wide">Write Artisan Feedback</h3>
              <button onClick={() => setReviewProductId(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-400 uppercase">Weaving & Finishing Rating:</span>
                <div className="flex gap-1 text-amber-400 font-sans">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setReviewRating(s)}
                      className="hover:scale-110 transition-transform font-sans"
                    >
                      <Star className={`w-5 h-5 ${reviewRating >= s ? "fill-amber-400" : "text-gray-200"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share detail specifications (dye quality, pottery glaze, unboxing security)..."
                rows={4}
                className="w-full px-3 py-2 bg-gray-55 border border-gray-205 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B56D3E]"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewProductId(null)}
                  className="px-4 py-2 bg-gray-150 hover:bg-gray-200 rounded-xl font-bold font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 ${activeTheme.button} font-bold rounded-xl font-sans`}
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#3D1E16] text-[#FAF5EE] border border-[#C09355]/30 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3">
          <Clock className="w-4 h-4 text-[#C09355] animate-spin" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
