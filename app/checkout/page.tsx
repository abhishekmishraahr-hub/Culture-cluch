"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/lib/cart";
import { CreditCard, ShoppingBag, Truck, Gift, Check, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, coupon, applyCoupon, removeCoupon, totals, clearCart } = useCart();

  // Authentication State
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const mockSessionStr = localStorage.getItem("mock_session");
        if (mockSessionStr) {
          const mockUser = JSON.parse(mockSessionStr);
          setSession({ user: mockUser });
          setAuthLoading(false);
          return;
        }

        const activeSession = await getSession();
        if (activeSession) {
          setSession(activeSession);
          setAuthLoading(false);
        } else {
          router.push("/login?callbackUrl=/checkout");
        }
      } catch (err) {
        console.error("Auth verification failed:", err);
        router.push("/login?callbackUrl=/checkout");
      }
    }
    checkAuth();
  }, [router]);

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY"); // RAZORPAY, COD
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState(false);

  // Checkout submission states
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(false);
    if (!couponCode) return;
    const success = await applyCoupon(couponCode);
    if (!success) {
      setCouponError(true);
    } else {
      setCouponCode("");
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street || !city || !state || !pincode) {
      alert("Please fill in all shipping address fields.");
      return;
    }

    setLoading(true);
    try {
      // Simulate Payment Gateway loading for credit card/UPI
      if (paymentMethod === "RAZORPAY") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: cart,
          address: { street, city, state, pincode, country: "India" },
          paymentMethod,
          totals,
          couponCode: coupon?.code || null
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");

      // Save order to localStorage for robust client-side access
      try {
        const localOrdersStr = localStorage.getItem("customer_orders") || "[]";
        const localOrders = JSON.parse(localOrdersStr);
        const newOrderObj = {
          id: data.id || `o-${Date.now()}`,
          invoiceNumber: data.invoiceNumber || `INV-2026-${Date.now().toString().slice(-4)}`,
          netAmount: totals.netTotal,
          status: "CONFIRMED" as const,
          createdAt: new Date().toISOString(),
          items: cart.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
            variantId: item.variantId || null,
            variantName: item.variantName || "",
            variantValue: item.variantValue || "",
            taxRate: item.taxRate || 12
          })),
          courier: "Delhivery Premium",
          trackingCode: `DEL-${Date.now().toString().slice(-8)}`,
          currentCity: "Registered Hub Sourcing Center",
          pincode: pincode
        };
        localOrders.unshift(newOrderObj);
        localStorage.setItem("customer_orders", JSON.stringify(localOrders));
      } catch (err) {
        console.error("Failed to save order to localStorage:", err);
      }

      setOrderSuccess(data);
      clearCart();
    } catch (err: any) {
      alert(`Checkout failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF5EE] flex items-center justify-center flex-col gap-3">
        <div className="w-10 h-10 border-4 border-[#B56D3E] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-gray-550 font-sans">Checking session status...</span>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#FAF5EE] flex items-center justify-center p-6 text-[#2E1E1A]">
        <div className="max-w-md w-full bg-[#FDFBF7] border border-gray-200 p-8 rounded-3xl shadow-lg space-y-6 text-center">
          <div className="w-16 h-16 bg-green-55/10 text-green-600 border border-green-200/50 rounded-full flex items-center justify-center mx-auto text-3xl">
            <Check className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif text-[#3D1E16] font-bold">Order Confirmed!</h2>
            <p className="text-xs text-gray-500 font-mono">Invoice ID: {orderSuccess.invoiceNumber}</p>
            <p className="text-sm text-gray-500 leading-relaxed px-4">
              Thank you for supporting India's local artisans. Your heritage package from the district has been reserved.
            </p>
          </div>

          <div className="border-t border-b border-gray-100 py-4 text-left text-xs space-y-2 bg-gray-50/50 rounded-xl p-4">
            <div className="flex justify-between">
              <span className="text-gray-400 font-bold uppercase">Order Amount</span>
              <span className="font-semibold text-gray-700">₹{totals.netTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 font-bold uppercase">Payment Status</span>
              <span className="font-semibold text-green-600">{paymentMethod === "COD" ? "Pending COD" : "PAID (Razorpay)"}</span>
            </div>
          </div>

          <Link
            href="/products"
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-xl text-sm font-semibold transition-all shadow-md"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF5EE] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-[#FDFBF7] border border-gray-200 p-8 rounded-2xl shadow-md space-y-4">
          <div className="w-12 h-12 bg-[#FAF5EE] text-[#B56D3E] border border-[#C09355]/20 rounded-full flex items-center justify-center mx-auto text-lg">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif text-[#3D1E16] font-bold">Your Cart is Empty</h2>
          <p className="text-sm text-gray-400">
            Please add some cultural artifacts and local delicacies from our catalog to begin checkout.
          </p>
          <Link
            href="/products"
            className="inline-block px-5 py-2.5 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-xl text-sm font-semibold shadow"
          >
            Go to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF5EE] text-[#2E1E1A] py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        
        <h1 className="text-3xl font-serif text-[#3D1E16] font-bold border-b border-[#C09355]/20 pb-4">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Shipping Form & Payments */}
          <form onSubmit={handleCheckoutSubmit} className="lg:col-span-7 space-y-6">
            
            {/* Address box */}
            <div className="bg-[#FDFBF7] rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-serif text-[#3D1E16] font-bold flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#B56D3E]" /> Shipping Address
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="House/Flat No, Sector, Area"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Varanasi"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. Uttar Pradesh"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Pincode</label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g. 221001"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method box */}
            <div className="bg-[#FDFBF7] rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-serif text-[#3D1E16] font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#B56D3E]" /> Payment Methods
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Razorpay Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("RAZORPAY")}
                  className={`flex flex-col items-start p-4 border rounded-2xl text-left transition-all ${
                    paymentMethod === "RAZORPAY"
                      ? "border-[#B56D3E] bg-[#B56D3E]/5 ring-2 ring-[#B56D3E]/10"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="font-bold text-sm text-[#3D1E16]">Razorpay Secure Checkout</span>
                  <span className="text-xs text-gray-400 mt-1">Pay with UPI, Credit/Debit cards, Net Banking, and Wallets.</span>
                </button>

                {/* COD Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`flex flex-col items-start p-4 border rounded-2xl text-left transition-all ${
                    paymentMethod === "COD"
                      ? "border-[#B56D3E] bg-[#B56D3E]/5 ring-2 ring-[#B56D3E]/10"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="font-bold text-sm text-[#3D1E16]">Cash on Delivery (COD)</span>
                  <span className="text-xs text-gray-400 mt-1">Pay with cash when package reaches your doorstep.</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-2xl shadow-md hover:shadow-lg transition-all text-sm font-semibold disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing Secure payment gateway...
                </>
              ) : (
                `Place Order (₹${totals.netTotal.toLocaleString()})`
              )}
            </button>

          </form>

          {/* RIGHT: Order Review & Pricing Summary */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Items list */}
            <div className="bg-[#FDFBF7] rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-serif text-[#3D1E16] font-bold border-b border-gray-50 pb-3">Review Items ({cart.length})</h2>
              
              <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="py-3 flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg border" />
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-[#3D1E16] line-clamp-1">{item.name}</h4>
                        {item.variantValue && (
                          <p className="text-[10px] text-gray-400 font-semibold">{item.variantName}: {item.variantValue}</p>
                        )}
                        <p className="text-xs text-gray-500">₹{item.price.toLocaleString()} × {item.quantity}</p>
                      </div>
                    </div>
                    
                    {/* Delete item button */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupons section */}
            <div className="bg-[#FDFBF7] rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-base font-serif text-[#3D1E16] font-bold flex items-center gap-1.5">
                <Gift className="w-5 h-5 text-[#B56D3E]" /> Promo Coupons
              </h2>
              {coupon ? (
                <div className="flex items-center justify-between bg-green-55/10 border border-green-200/50 rounded-xl p-3.5 text-xs text-green-700">
                  <div>
                    <span className="font-bold">{coupon.code}</span> applied: {coupon.value}% Discount!
                  </div>
                  <button onClick={removeCoupon} className="text-[10px] font-bold underline uppercase">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter Code (e.g. ODOPFIRST)"
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#3D1E16] hover:bg-[#28140E] text-white text-xs font-semibold rounded-xl"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <div className="text-[10px] text-red-500 font-semibold">
                  Invalid coupon code or minimum purchase amount not met.
                </div>
              )}
            </div>

            {/* Summary calculations */}
            <div className="bg-[#FDFBF7] rounded-2xl border border-gray-200 p-6 shadow-sm space-y-3 text-xs">
              <h2 className="text-sm font-serif text-[#3D1E16] font-bold border-b border-gray-50 pb-2">Price Breakdown</h2>
              
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{totals.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>GST Tax (Items Tax breakdown)</span>
                <span>₹{totals.taxTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping Handling</span>
                <span>{totals.shippingTotal === 0 ? "FREE" : `₹${totals.shippingTotal}`}</span>
              </div>
              {totals.discountTotal > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Coupon Discount ({coupon?.code})</span>
                  <span>-₹{totals.discountTotal.toLocaleString()}</span>
                </div>
              )}

              <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline font-bold">
                <span className="text-sm text-[#3D1E16]">Total Net Amount</span>
                <span className="text-lg font-serif text-[#B56D3E]">₹{totals.netTotal.toLocaleString()}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
