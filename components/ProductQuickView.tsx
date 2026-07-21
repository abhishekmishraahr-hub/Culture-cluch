"use client";

import React, { useState } from "react";
import { X, Heart, ShoppingBag, ArrowRight, Share2, Shield, RefreshCw } from "lucide-react";
import Link from "next/link";

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

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductQuickView({ product, isOpen, onClose, onAddToCart }: QuickViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!isOpen || !product) return null;

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleCartAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="bg-[#FAF5EE] border border-[#C09355]/30 rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 relative z-10 max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-gray-600 border border-gray-100 hover:shadow-md transition-all z-50"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Panel: Image Gallery (Span 5) */}
        <div className="md:col-span-5 bg-white border-r border-[#C09355]/10 p-6 flex flex-col justify-between gap-4">
          <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 relative">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[activeImageIdx].url} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                No Image Available
              </div>
            )}
            
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-[#B56D3E] text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 bg-gray-50 shrink-0 transition-all ${
                    activeImageIdx === idx ? "border-[#B56D3E]" : "border-transparent"
                  }`}
                >
                  <img src={img.url} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Features badge */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-550">
              <Shield className="w-4 h-4 text-[#B56D3E] shrink-0" />
              <span>Certified Handloom Silk & Handicraft Guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-550">
              <RefreshCw className="w-4 h-4 text-[#B56D3E] shrink-0" />
              <span>7-Day Return Policy under ODOP Trust Scheme</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Content Details (Span 7) */}
        <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            {/* Breadcrumb / Location Badge */}
            {product.district && (
              <div className="flex items-center gap-2">
                <span className="bg-[#B56D3E]/10 border border-[#B56D3E]/20 text-[#B56D3E] text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  {product.district.state.name}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  {product.district.name} District
                </span>
              </div>
            )}

            <h2 className="font-serif font-black text-2xl text-[#3D1E16] leading-tight">
              {product.name}
            </h2>

            {/* Pricing block */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-serif font-black text-[#3D1E16]">
                ₹{product.price.toLocaleString()}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-gray-400 line-through font-medium">
                  ₹{product.compareAtPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-600 leading-relaxed font-serif text-justify max-h-[160px] overflow-y-auto pr-1">
              {product.description}
            </p>
          </div>

          <div className="space-y-5">
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center border border-[#C09355]/30 rounded-xl overflow-hidden bg-white shadow-sm">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3.5 py-1.5 hover:bg-[#FAF5EE] text-[#3D1E16] font-bold text-sm"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-[#3D1E16] border-x border-[#C09355]/10">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3.5 py-1.5 hover:bg-[#FAF5EE] text-[#3D1E16] font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Shopping buttons */}
            <div className="flex gap-3.5">
              <button
                onClick={handleCartAdd}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all text-xs uppercase tracking-wider"
              >
                <ShoppingBag className="w-4 h-4" /> Add To Cart
              </button>
              
              <Link
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-1.5 px-6 py-3 bg-[#3D1E16] hover:bg-[#28140E] text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all text-xs uppercase tracking-wider"
              >
                Explore Story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
