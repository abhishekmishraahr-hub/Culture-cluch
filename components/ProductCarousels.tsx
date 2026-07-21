"use client";

import React, { useState } from "react";
import { Sparkles, Star, ShoppingBag, Eye, Heart } from "lucide-react";
import { useCart } from "@/lib/cart";
import ProductQuickView from "./ProductQuickView";

interface ProductImage {
  id: string;
  url: string;
}

interface District {
  name: string;
  state: {
    name: string;
    code: string;
  };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  images: ProductImage[];
  district?: District;
}

interface CarouselProps {
  trendingProducts: Product[];
  bestSellers: Product[];
  recentlyAdded: Product[];
}

export default function ProductCarousels({ trendingProducts, bestSellers, recentlyAdded }: CarouselProps) {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<"trending" | "best" | "recent">("trending");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const getActiveList = () => {
    switch (activeTab) {
      case "trending":
        return trendingProducts;
      case "best":
        return bestSellers;
      case "recent":
        return recentlyAdded;
    }
  };

  const handleQuickAddToCart = (e: React.MouseEvent, prod: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.images[0]?.url || "",
      quantity: 1,
      variantId: null,
      taxRate: 18
    });
    alert(`"${prod.name}" added to cart successfully!`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
      {/* Tabs selectors */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-b border-[#C09355]/20 pb-4 gap-4">
        <div>
          <h2 className="text-3xl font-serif text-[#3D1E16] font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#B56D3E]" />
            Heritage Showcases
          </h2>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mt-1">
            Browse our hand-picked curated collections
          </p>
        </div>

        <div className="flex gap-2 bg-[#FAF5EE] border border-[#C09355]/25 p-1 rounded-2xl shadow-sm">
          {[
            { id: "trending", label: "Trending" },
            { id: "best", label: "Best Sellers" },
            { id: "recent", label: "New Arrivals" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#3D1E16] text-[#FAF5EE] shadow-md"
                  : "text-gray-500 hover:text-[#B56D3E]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
        {getActiveList().map((prod) => {
          const discount = prod.compareAtPrice
            ? Math.round(((prod.compareAtPrice - prod.price) / prod.compareAtPrice) * 100)
            : 0;

          return (
            <div
              key={prod.id}
              onClick={() => setQuickViewProduct(prod)}
              className="group bg-[#FDFBF7] rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full relative cursor-pointer"
            >
              {/* Product Thumbnail with hover buttons overlay */}
              <div className="aspect-square w-full bg-white relative overflow-hidden border-b border-gray-100">
                <img
                  src={prod.images[0]?.url || "https://images.unsplash.com/photo-1596178060810-72cb62112e75?auto=format&fit=crop&w=600&q=80"}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                {discount > 0 && (
                  <span className="absolute top-3 left-3 bg-[#B56D3E] text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {discount}% OFF
                  </span>
                )}

                {/* Hover Quick-Shop Action Buttons */}
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button 
                    title="Quick View Details"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuickViewProduct(prod);
                    }}
                    className="p-2.5 bg-white hover:bg-[#FAF5EE] text-[#3D1E16] rounded-full shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-all duration-300"
                  >
                    <Eye className="w-4.5 h-4.5" />
                  </button>
                  <button 
                    title="Add to Cart"
                    onClick={(e) => handleQuickAddToCart(e, prod)}
                    className="p-2.5 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-full shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-all duration-300"
                  >
                    <ShoppingBag className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {/* Text specifications */}
              <div className="p-4 flex-grow flex flex-col justify-between gap-3 text-left">
                <div className="space-y-1">
                  {prod.district && (
                    <span className="text-[9px] text-[#B56D3E] font-extrabold uppercase tracking-widest block leading-none">
                      {prod.district.name} District
                    </span>
                  )}
                  <h3 className="font-serif font-black text-xs text-[#3D1E16] group-hover:text-[#B56D3E] transition-colors leading-tight line-clamp-1">
                    {prod.name}
                  </h3>
                </div>

                <div className="flex items-baseline justify-between border-t border-gray-100 pt-2.5">
                  <span className="font-serif font-black text-[#3D1E16] text-sm">
                    ₹{prod.price.toLocaleString()}
                  </span>
                  {prod.compareAtPrice && (
                    <span className="text-[10px] text-gray-400 line-through">
                      ₹{prod.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        isOpen={quickViewProduct !== null}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p, qty) => {
          addToCart({
            productId: p.id,
            name: p.name,
            price: p.price,
            image: p.images[0]?.url || "",
            quantity: qty,
            variantId: null,
            taxRate: 18
          });
          alert(`"${p.name}" added to cart successfully!`);
        }}
      />
    </section>
  );
}
