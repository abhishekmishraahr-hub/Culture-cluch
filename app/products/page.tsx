"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, MapPin, SlidersHorizontal, ArrowUpDown, Mic, MicOff, Heart, Clock } from "lucide-react";

interface ProductImage {
  id: string;
  url: string;
}

interface CatalogDistrict {
  id: string;
  name: string;
  odopProduct: string | null;
  isActive: boolean;
}

interface State {
  id: string;
  name: string;
  code: string;
  districts: CatalogDistrict[];
}

interface District {
  name: string;
  state: {
    code: string;
  };
}

interface Category {
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  description: string;
  sku: string;
  images: ProductImage[];
  category: Category;
  district: District;
  isFeatured: boolean;
  isTrending: boolean;
  createdAt?: string;
}

export default function ProductsCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  
  // Dropdown lists
  const [categories, setCategories] = useState<Category[]>([]);
  const [states, setStates] = useState<State[]>([]);
  
  // UI states
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Comparison & Wishlist states
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleWishlist = (id: string, name: string) => {
    if (wishlistedIds.includes(id)) {
      setWishlistedIds(wishlistedIds.filter(wId => wId !== id));
      showToast(`Removed "${name}" from Wishlist`);
    } else {
      setWishlistedIds([...wishlistedIds, id]);
      showToast(`Added "${name}" to Wishlist! We'll track stock changes.`);
    }
  };

  // Voice Search Mock
  const handleVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice search is not supported in this browser. Please try Chrome.");
      return;
    }
    
    setIsListening(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setSearchTerm(speechToText);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const fetchJSONWithFallback = async (apiUrl: string, staticUrl: string) => {
    try {
      const res = await fetch(apiUrl);
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (data && !data.error) return data;
        }
      }
    } catch {
      console.warn(`Dynamic API fetch failed for ${apiUrl}, attempting static fallback...`);
    }
    const staticRes = await fetch(staticUrl);
    if (staticRes.ok) return await staticRes.json();
    throw new Error(`Failed to load data from both ${apiUrl} and ${staticUrl}`);
  };

  const fetchFilters = useCallback(async () => {
    try {
      const catData = await fetchJSONWithFallback("/api/categories", "/static-data/categories.json");
      setCategories(catData);

      const stateData = await fetchJSONWithFallback("/api/states", "/static-data/states.json");
      setStates(stateData);
    } catch (error) {
      console.error("Failed to load catalog filters", error);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let isStaticMode = false;
      let fetchedProducts: Product[] = [];

      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append("q", searchTerm);
        if (selectedCategory) params.append("category", selectedCategory);
        if (selectedState) params.append("state", selectedState);
        if (selectedDistrict) params.append("district", selectedDistrict);
        if (selectedSort) params.append("sort", selectedSort);
        if (minPrice > 0) params.append("minPrice", minPrice.toString());
        if (maxPrice < 50000) params.append("maxPrice", maxPrice.toString());

        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            if (data && !data.error) {
              fetchedProducts = data;
            } else {
              isStaticMode = true;
            }
          } else {
            isStaticMode = true;
          }
        } else {
          isStaticMode = true;
        }
      } catch {
        isStaticMode = true;
      }

      if (isStaticMode) {
        let sourceList = allProducts;
        if (!sourceList) {
          const res = await fetch("/static-data/products.json");
          if (res.ok) {
            sourceList = await res.json();
            setAllProducts(sourceList);
          }
        }

        if (sourceList) {
          let filtered = [...sourceList];

          // 1. Search term
          if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(p =>
              p.name.toLowerCase().includes(term) ||
              p.description.toLowerCase().includes(term) ||
              p.sku.toLowerCase().includes(term) ||
              p.district.name.toLowerCase().includes(term)
            );
          }

          // 2. Category
          if (selectedCategory) {
            filtered = filtered.filter(p => p.category.slug === selectedCategory);
          }

          // 3. State
          if (selectedState) {
            filtered = filtered.filter(p => p.district.state.code === selectedState);
          }

          // 4. District
          if (selectedDistrict) {
            filtered = filtered.filter(p => p.district.name === selectedDistrict);
          }

          // 5. Price range
          filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

          // 6. Sorting
          if (selectedSort === "price_asc") {
            filtered.sort((a, b) => a.price - b.price);
          } else if (selectedSort === "price_desc") {
            filtered.sort((a, b) => b.price - a.price);
          } else {
            // newest/default
            filtered.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
          }

          fetchedProducts = filtered;
        }
      }

      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  }, [
    searchTerm, selectedCategory, selectedState, selectedDistrict, selectedSort,
    minPrice, maxPrice, allProducts
  ]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  useEffect(() => {
    // Debounce product fetching when searching
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchProducts]);

  const selectedStateObj = states.find((st) => st.code === selectedState);
  const districtsToShow = selectedStateObj ? selectedStateObj.districts : [];

  return (
    <div className="min-h-screen bg-[#FAF5EE] text-[#2E1E1A]">
      
      {/* Visual background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C09355]/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#B56D3E]/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 space-y-8 relative">
        
        {/* Page title & Description */}
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl md:text-4xl font-serif text-[#3D1E16] font-bold">The Heritage Catalog</h1>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl">
            Explore and support the authentic products from every district of India, registered under the One District One Product (ODOP) mission.
          </p>
        </div>

        {/* Central Search Bar Row */}
        <div className="bg-[#FDFBF7] rounded-2xl border border-[#C09355]/20 shadow-md p-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name, district, craft description..."
              className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 focus:border-[#B56D3E]"
            />
            <button
              onClick={handleVoiceSearch}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                isListening ? "bg-red-50 text-red-500 animate-pulse" : "text-gray-400 hover:bg-gray-100"
              }`}
              title="Voice Search"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex w-full md:w-auto items-center gap-3">
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors md:hidden"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <div className="flex-1 md:flex-initial relative flex items-center">
              <ArrowUpDown className="absolute left-4 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 focus:border-[#B56D3E] appearance-none cursor-pointer"
              >
                <option value="newest">Sort: New Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Sort: Trending First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Catalog Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* SIDEBAR FILTERS (Desktop) */}
          <aside className={`lg:block space-y-6 ${showFiltersMobile ? "block" : "hidden"} lg:sticky lg:top-8`}>
            
            {/* Filters panel wrapper */}
            <div className="bg-[#FDFBF7] rounded-2xl border border-gray-200/80 shadow-md p-6 space-y-6">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="font-serif font-bold text-[#3D1E16] flex items-center gap-2">
                  <SlidersHorizontal className="w-4.5 h-4.5" /> Filters
                </h3>
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setSelectedState("");
                    setSelectedDistrict("");
                    setMinPrice(0);
                    setMaxPrice(50000);
                  }}
                  className="text-xs text-[#B56D3E] font-semibold hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categories</h4>
                <div className="flex flex-wrap lg:flex-col gap-2">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-left border transition-all ${
                      selectedCategory === ""
                        ? "bg-[#B56D3E] border-[#B56D3E] text-white"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-left border transition-all ${
                        selectedCategory === cat.slug
                          ? "bg-[#B56D3E] border-[#B56D3E] text-white"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* State Filter */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Indian Region (State)</h4>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedDistrict("");
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 focus:border-[#B56D3E]"
                >
                  <option value="">All States / UTs</option>
                  {states.map((st) => (
                    <option key={st.code} value={st.code}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Filter */}
              {selectedState && districtsToShow && districtsToShow.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">District</h4>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 focus:border-[#B56D3E]"
                  >
                    <option value="">All Districts</option>
                    {districtsToShow.map((dist) => (
                      <option key={dist.id} value={dist.id}>
                        {dist.name} {dist.odopProduct ? `(${dist.odopProduct})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Filter */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price Range</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                    <span>₹{minPrice.toLocaleString()}</span>
                    <span>₹{maxPrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full accent-[#B56D3E]"
                  />
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 block mb-0.5">Min (₹)</span>
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block mb-0.5">Max (₹)</span>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(parseInt(e.target.value) || 0)}
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </aside>

          {/* MAIN PRODUCT GRID */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* Loading Indicator */}
            {loading ? (
              <div className="h-[400px] flex items-center justify-center flex-col gap-3">
                <div className="w-10 h-10 border-4 border-[#B56D3E] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-semibold text-gray-500">Loading catalog items...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="h-[400px] bg-[#FDFBF7] rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-6 shadow-sm">
                <div className="w-12 h-12 bg-[#FAF5EE] rounded-full border border-[#C09355]/20 flex items-center justify-center text-[#B56D3E] mb-4 font-serif text-lg font-bold">
                  !
                </div>
                <h3 className="text-lg font-serif text-[#3D1E16] font-semibold">No products found</h3>
                <p className="text-sm text-gray-400 mt-1 max-w-sm">
                  We couldn&apos;t find any products matching your current filter set. Try adjusting your search query or clear all filters.
                </p>
              </div>
            ) : (
              <div>
                <div className="text-xs text-gray-400 font-semibold mb-4 uppercase">
                  Showing {products.length} heritage items
                </div>
                
                {/* Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((prod) => {
                    const discount = prod.compareAtPrice
                      ? Math.round(((prod.compareAtPrice - prod.price) / prod.compareAtPrice) * 100)
                      : 0;

                    return (
                      <div
                        key={prod.id}
                        className="group bg-[#FDFBF7] rounded-2xl border border-gray-200/80 hover:border-[#C09355]/35 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full relative"
                      >
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                          {prod.isTrending && (
                            <span className="bg-[#B56D3E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
                              Trending
                            </span>
                          )}
                          {prod.isFeatured && (
                            <span className="bg-[#3D1E16] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
                              Featured
                            </span>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <button
                          onClick={() => handleToggleWishlist(prod.id, prod.name)}
                          className={`absolute top-3 right-3 z-10 p-1.5 rounded-full transition-colors shadow-sm ${
                            wishlistedIds.includes(prod.id)
                              ? "bg-red-50 text-red-500"
                              : "bg-[#FAF5EE]/80 hover:bg-[#FAF5EE] text-gray-400 hover:text-red-500"
                          }`}
                          title="Add to Wishlist"
                        >
                          <Heart className={`w-4 h-4 ${wishlistedIds.includes(prod.id) ? "fill-red-500" : ""}`} />
                        </button>

                        {/* Image Viewer */}
                        <Link href={`/products/${prod.slug}`} className="block aspect-[4/3] bg-gray-50 overflow-hidden relative border-b border-gray-100">
                          <img
                            src={prod.images[0]?.url || "https://images.unsplash.com/photo-1596178060810-72cb62112e75?auto=format&fit=crop&w=600&q=80"}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>

                        {/* Content Card Body */}
                        <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold font-mono uppercase">
                              <MapPin className="w-3.5 h-3.5 text-[#B56D3E]" />
                              <span>{prod.district.name}, {prod.district.state.code}</span>
                            </div>

                            <Link href={`/products/${prod.slug}`} className="block">
                              <h3 className="font-serif font-bold text-sm text-[#3D1E16] group-hover:text-[#B56D3E] transition-colors leading-tight line-clamp-1">
                                {prod.name}
                              </h3>
                            </Link>

                            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                              {prod.description}
                            </p>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-baseline gap-2 border-t border-gray-50 pt-3">
                              <span className="font-serif font-extrabold text-[#3D1E16] text-base">
                                ₹{prod.price.toLocaleString()}
                              </span>
                              {prod.compareAtPrice && (
                                <>
                                  <span className="text-xs text-gray-400 line-through">
                                    ₹{prod.compareAtPrice.toLocaleString()}
                                  </span>
                                  <span className="text-xs font-bold text-green-600">
                                    ({discount}% OFF)
                                  </span>
                                </>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <Link
                                href={`/products/${prod.slug}`}
                                className="flex-1 flex items-center justify-center px-4 py-2 border border-[#B56D3E]/40 text-[#B56D3E] hover:bg-[#B56D3E] hover:text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
                              >
                                View Details
                              </Link>
                              
                              <button
                                onClick={() => {
                                  const exists = comparedProducts.some(p => p.id === prod.id);
                                  if (exists) {
                                    setComparedProducts(comparedProducts.filter(p => p.id !== prod.id));
                                  } else {
                                    if (comparedProducts.length >= 3) {
                                      showToast("You can compare up to 3 products at a time.");
                                      return;
                                    }
                                    setComparedProducts([...comparedProducts, prod]);
                                    showToast(`Added ${prod.name} to comparison list.`);
                                  }
                                }}
                                className={`px-3 py-2 border rounded-xl text-xs font-semibold transition-all ${
                                  comparedProducts.some(p => p.id === prod.id)
                                    ? "bg-[#3D1E16] border-[#3D1E16] text-white"
                                    : "border-gray-200 hover:border-gray-300 text-gray-555 bg-[#FDFBF7]"
                                }`}
                                title="Compare Product Specs"
                              >
                                Compare
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </main>

        </div>

      </div>

      {/* Floating Comparison Action Bar */}
      {comparedProducts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#3D1E16] text-white border-t border-[#C09355]/30 shadow-2xl py-4 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 animate-slideUp">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Comparing Items ({comparedProducts.length}/3)</span>
            <div className="flex gap-2">
              {comparedProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl text-xs">
                  <span className="truncate max-w-[120px] font-medium">{p.name}</span>
                  <button 
                    onClick={() => setComparedProducts(comparedProducts.filter(item => item.id !== p.id))}
                    className="text-[9px] hover:text-red-400 font-bold bg-white/10 px-1.5 py-0.5 rounded"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2.5 w-full md:w-auto">
            <button
              onClick={() => setComparedProducts([])}
              className="flex-1 md:flex-initial px-4 py-2 border border-white/20 hover:bg-white/5 rounded-xl text-xs font-semibold uppercase tracking-wider"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsCompareOpen(true)}
              className="flex-1 md:flex-initial px-5 py-2 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow"
            >
              Compare Specifications
            </button>
          </div>
        </div>
      )}

      {/* Compare Modal Panel overlay */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#FAF5EE] text-[#2E1E1A] w-full max-w-4xl rounded-3xl overflow-hidden border border-[#C09355]/30 shadow-2xl flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="bg-[#3D1E16] text-[#FAF5EE] p-5 flex justify-between items-center border-b border-[#C09355]/20">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#C09355]" />
                <h3 className="font-serif text-lg font-bold">Heritage Product Comparison Matrix</h3>
              </div>
              <button 
                onClick={() => setIsCompareOpen(false)}
                className="text-white/60 hover:text-white text-sm font-extrabold uppercase bg-white/10 px-3.5 py-1.5 rounded-xl"
              >
                Close Matrix
              </button>
            </div>

            {/* Matrix comparison table */}
            <div className="flex-1 overflow-x-auto p-6">
              <div className="min-w-[600px] grid grid-cols-4 gap-6 divide-x divide-gray-200/50">
                
                {/* Headers column */}
                <div className="space-y-6 pt-32 text-xs font-extrabold uppercase tracking-widest text-gray-400">
                  <div className="h-10">Name</div>
                  <div className="h-10 pt-2">Pricing</div>
                  <div className="h-10 pt-2">State Origin</div>
                  <div className="h-10 pt-2">District</div>
                  <div className="h-10 pt-2">Heritage Category</div>
                  <div className="h-20 pt-2">Craft Description</div>
                </div>

                {/* Compared items */}
                {comparedProducts.map((p) => (
                  <div key={p.id} className="pl-6 space-y-6 text-xs text-gray-700">
                    
                    {/* Visual Card details */}
                    <div className="space-y-2 h-32 flex flex-col justify-end">
                      <img src={p.images[0]?.url} alt={p.name} className="w-20 h-20 object-cover rounded-xl border bg-white mx-auto shadow-sm" />
                      <span className="block font-bold text-center font-serif text-[#3D1E16] text-xs line-clamp-1">{p.name}</span>
                    </div>

                    <div className="h-10 font-bold text-[#B56D3E] text-sm pt-2">₹{p.price.toLocaleString()}</div>
                    <div className="h-10 pt-2 font-semibold text-[#3D1E16]">{p.district.state.code}</div>
                    <div className="h-10 pt-2 font-semibold text-[#3D1E16]">{p.district.name}</div>
                    <div className="h-10 pt-2 font-mono uppercase text-[10px] bg-gray-100/50 px-2 py-0.5 rounded border inline-block">{p.category.name}</div>
                    <div className="h-20 pt-2 text-[11px] text-gray-500 leading-relaxed line-clamp-3">{p.description}</div>
                  </div>
                ))}

                {/* Empty columns if comparing less than 3 */}
                {Array.from({ length: 3 - comparedProducts.length }).map((_, idx) => (
                  <div key={idx} className="pl-6 h-full flex items-center justify-center text-gray-300 text-xs border-dashed border-2 border-gray-200 rounded-3xl m-2 bg-gray-50/50 py-16">
                    Empty Selection Slot
                  </div>
                ))}

              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#FAF5EE] border-t border-gray-150 p-4 text-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Cultural Clutch Vocal for Local comparison</span>
            </div>

          </div>
        </div>
      )}

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
