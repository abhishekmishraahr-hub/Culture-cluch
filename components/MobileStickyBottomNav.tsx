"use client";

import React from "react";
import Link from "next/link";
import { Home, Grid, Search, Heart, ShoppingBag, User } from "lucide-react";

export default function MobileStickyBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#3D1E16] text-[#FAF5EE] border-t border-[#C09355]/30 md:hidden shadow-2xl backdrop-blur-md bg-opacity-95">
      <div className="flex justify-around items-center py-2 px-1">
        
        <Link 
          href="/" 
          className="flex flex-col items-center justify-center p-1.5 hover:text-[#C09355] text-gray-300 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="text-[8.5px] font-bold uppercase tracking-wider mt-1">Home</span>
        </Link>

        <Link 
          href="/products" 
          className="flex flex-col items-center justify-center p-1.5 hover:text-[#C09355] text-gray-300 transition-colors"
        >
          <Grid className="w-5 h-5" />
          <span className="text-[8.5px] font-bold uppercase tracking-wider mt-1">Catalog</span>
        </Link>

        <Link 
          href="/products" 
          className="flex flex-col items-center justify-center p-1.5 hover:text-[#C09355] text-gray-300 transition-colors"
        >
          <Search className="w-5 h-5" />
          <span className="text-[8.5px] font-bold uppercase tracking-wider mt-1">Search</span>
        </Link>

        <Link 
          href="/checkout" 
          className="flex flex-col items-center justify-center p-1.5 hover:text-[#C09355] text-gray-300 transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[8.5px] font-bold uppercase tracking-wider mt-1">Cart</span>
        </Link>

        <Link 
          href="/profile" 
          className="flex flex-col items-center justify-center p-1.5 hover:text-[#C09355] text-gray-300 transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-[8.5px] font-bold uppercase tracking-wider mt-1">Profile</span>
        </Link>

      </div>
    </div>
  );
}
