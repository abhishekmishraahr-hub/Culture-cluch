"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string; // Unique combination of productId and variantId
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variantId?: string | null;
  variantName?: string;
  variantValue?: string;
  taxRate: number; // GST rate, e.g. 5%, 12%, 18%
}

interface Coupon {
  code: string;
  type: string; // PERCENTAGE, FLAT
  value: number;
  minOrderAmount: number;
  maxDiscount?: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  coupon: Coupon | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  totals: {
    subtotal: number;
    taxTotal: number;
    shippingTotal: number;
    discountTotal: number;
    netTotal: number;
  };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("auraic_cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error("Failed to parse cart from local storage", e);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("auraic_cart", JSON.stringify(newCart));
  };

  const addToCart = (item: Omit<CartItem, "id">) => {
    const id = item.variantId
      ? `${item.productId}-${item.variantId}`
      : item.productId;

    const existingIndex = cart.findIndex((i) => i.id === id);

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += item.quantity;
      saveCart(updated);
    } else {
      saveCart([...cart, { ...item, id }]);
    }
  };

  const removeFromCart = (id: string) => {
    saveCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    saveCart(
      cart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    saveCart([]);
    setCoupon(null);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    try {
      // Mock coupon validation against seeded data
      if (code.toUpperCase() === "ODOPFIRST") {
        setCoupon({
          code: "ODOPFIRST",
          type: "PERCENTAGE",
          value: 10,
          minOrderAmount: 1000,
          maxDiscount: 500
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  // Calculations
  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // Calculate GST tax amount per item: price * qty * (taxRate / 100)
    // Note: prices are inclusive of GST in standard retail, but let's calculate the tax content or add it.
    // Standard approach: if prices are inclusive, taxContent = Total * (taxRate / (100 + taxRate))
    // Let's assume prices listed are base prices and tax is calculated on top.
    const taxTotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity * (item.taxRate / 100),
      0
    );

    // Free shipping above 2000 INR, else flat 150 INR
    const shippingTotal = subtotal > 2000 || subtotal === 0 ? 0 : 150;

    // Apply Coupon discount
    let discountTotal = 0;
    if (coupon && subtotal >= coupon.minOrderAmount) {
      if (coupon.type === "PERCENTAGE") {
        discountTotal = subtotal * (coupon.value / 100);
        if (coupon.maxDiscount && discountTotal > coupon.maxDiscount) {
          discountTotal = coupon.maxDiscount;
        }
      } else if (coupon.type === "FLAT") {
        discountTotal = coupon.value;
      }
    }

    const netTotal = subtotal + taxTotal + shippingTotal - discountTotal;

    return {
      subtotal,
      taxTotal,
      shippingTotal,
      discountTotal,
      netTotal
    };
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        coupon,
        applyCoupon,
        removeCoupon,
        totals: calculateTotals()
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
