"use client";

import React, { useState, useEffect } from "react";
import { 
  MapPin, 
  ShieldCheck, 
  ShoppingCart, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  History, 
  Hammer, 
  CheckCircle2, 
  User, 
  Star, 
  Clock, 
  Zap,
  Share2,
  HelpCircle,
  TrendingUp,
  SlidersHorizontal,
  ChevronDown,
  Info,
  PlayCircle,
  Gift
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart";

interface ProductImage {
  id: string;
  url: string;
}

interface State {
  name: string;
  code: string;
}

interface District {
  name: string;
  state: State;
}

interface Category {
  name: string;
  slug: string;
}

interface ProductVariant {
  id: string;
  name: string;
  value: string;
  priceAdjustment: number;
  stock: number;
}

interface CulturalStory {
  artisanName: string;
  artisanLocation: string;
  artisanImage: string | null;
  history: string;
  culturalSignificance: string;
  productionMethod: string;
  geographicalIdentity: string | null;
  awards: string | null;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
  };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  description: string;
  sku: string;
  stock: number;
  images: ProductImage[];
  category: Category;
  district: District;
  variants: ProductVariant[];
  culturalStory: CulturalStory | null;
  reviews: Review[];
  taxRate: number;
}

export default function ProductDetailClient({ slug }: { slug: string }) {
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Recommendation Lists
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [districtProducts, setDistrictProducts] = useState<Product[]>([]);
  const [stateProducts, setStateProducts] = useState<Product[]>([]);
  const [vendorProducts, setVendorProducts] = useState<Product[]>([]);
  const [frequentlyBought, setFrequentlyBought] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  
  // Gallery & Zoom
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: "none" });

  // Customizer selection
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [cartSuccess, setCartSuccess] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState("story"); // story, specs, reviews

  // Delivery check states
  const [pincode, setPincode] = useState("");
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);

  // Wishlist states
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistSuccess, setWishlistSuccess] = useState(false);

  // Interactive 360 view states
  const [is360Active, setIs360Active] = useState(false);
  const [rotationIndex, setRotationIndex] = useState(0);

  // Sticky Actions state
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Question & Answers states
  const [qaList, setQaList] = useState([
    { id: 1, question: "Is this saree dry-clean only?", answer: "Yes, since this is a pure Banarasi Katan silk saree woven with actual gold brocade zari, we strongly advise professional dry cleaning only to maintain luster.", votes: 8 },
    { id: 2, question: "Does this come with a Geographical Indication (GI) label?", answer: "Absolutely. All official ODOP listings from Varanasi are tagged with authentic GI seals, featuring registration code credentials verified by the local artisan cooperative.", votes: 12 }
  ]);
  const [newQuestion, setNewQuestion] = useState("");
  const [qaMessage, setQaMessage] = useState(false);

  // Reviews submission state
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeTheme = {
    button: "bg-[#B56D3E] hover:bg-[#9B5A2F] text-white",
    text: "text-[#B56D3E]"
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Scroll listener for Sticky CTA bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      setWishlistSuccess(true);
      showToast("Added to Wishlist! We will notify you of stock levels.");
      setTimeout(() => setWishlistSuccess(false), 3000);
    } else {
      showToast("Removed from Wishlist.");
    }
  };

  const fetchProduct = async () => {
    try {
      let isStaticMode = false;
      let data: any = null;
      let allCatalog: Product[] = [];

      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const fetched = await res.json();
            if (fetched && !fetched.error) {
              data = fetched;
            } else {
              isStaticMode = true;
            }
          } else {
            isStaticMode = true;
          }
        } else {
          isStaticMode = true;
        }
      } catch (err) {
        isStaticMode = true;
      }

      // Fetch full catalog for recommendations
      const catalogRes = await fetch("/static-data/products.json");
      if (catalogRes.ok) {
        allCatalog = await catalogRes.json();
      }

      if (isStaticMode && allCatalog.length > 0) {
        data = allCatalog.find(p => p.slug === slug) || null;
      }

      if (!data) throw new Error("Product not found");
      
      // Add mock variants if missing to enable customizer
      if (!data.variants || data.variants.length === 0) {
        data.variants = [
          { id: "v-size-m", name: "Dimension", value: "Standard Craft Edition", priceAdjustment: 0, stock: 15 },
          { id: "v-size-l", name: "Dimension", value: "Collector Curation (Museum)", priceAdjustment: 2500, stock: 3 }
        ];
      }

      setProduct(data);

      // Pre-select first option for each variant type
      if (data.variants && data.variants.length > 0) {
        const initialSelections: Record<string, string> = {};
        data.variants.forEach((v: ProductVariant) => {
          if (!initialSelections[v.name]) {
            initialSelections[v.name] = v.value;
          }
        });
        setSelectedVariants(initialSelections);
      }

      // Build Dynamic Recommendations
      if (allCatalog.length > 0) {
        const otherProducts = allCatalog.filter(p => p.slug !== slug);

        // 1. Similar Products (matching category slug)
        const similar = otherProducts.filter(p => p.category.slug === data.category.slug).slice(0, 4);
        setSimilarProducts(similar);

        // 2. Same District
        const district = otherProducts.filter(p => p.district.name === data.district.name).slice(0, 4);
        setDistrictProducts(district);

        // 3. Same State
        const stateProds = otherProducts.filter(p => p.district.state.code === data.district.state.code && p.district.name !== data.district.name).slice(0, 4);
        setStateProducts(stateProds);

        // 4. Same Vendor (mock vendor grouping or design cooperative match)
        const vendor = otherProducts.slice().reverse().filter(p => p.category.slug === data.category.slug || p.district.state.code === data.district.state.code).slice(0, 4);
        setVendorProducts(vendor);

        // 5. Frequently Bought Together (Current item + 2 matching catalog items)
        const fbt = otherProducts.filter(p => p.category.slug !== data.category.slug).slice(0, 2);
        setFrequentlyBought(fbt);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  // Browse History Tracker
  useEffect(() => {
    if (!product) return;
    try {
      const historyStr = localStorage.getItem("recently_viewed") || "[]";
      let historyList = JSON.parse(historyStr);
      historyList = [product.slug, ...historyList.filter((s: string) => s !== product.slug)].slice(0, 5);
      localStorage.setItem("recently_viewed", JSON.stringify(historyList));
      
      // Load recently viewed objects from local catalog
      fetch("/static-data/products.json")
        .then(res => {
          if (res.ok) return res.json();
          return [];
        })
        .then((catalog: Product[]) => {
          const loaded = historyList
            .map((s: string) => catalog.find(p => p.slug === s))
            .filter((p: any) => p && p.slug !== slug);
          setRecentlyViewed(loaded);
        })
        .catch(err => console.error(err));
    } catch (e) {
      console.warn("Failed recently viewed localStorage tracking:", e);
    }
  }, [product, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF5EE] flex items-center justify-center flex-col gap-3">
        <div className="w-10 h-10 border-4 border-[#B56D3E] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-gray-550">Retrieving heritage story...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FAF5EE] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-[#FDFBF7] border border-gray-200 p-8 rounded-2xl shadow-md space-y-4 font-sans">
          <div className="w-12 h-12 bg-red-50 text-red-500 border border-red-200 rounded-full flex items-center justify-center mx-auto text-lg font-bold">
            !
          </div>
          <h2 className="text-xl font-serif text-[#3D1E16] font-bold">Product Not Found</h2>
          <p className="text-sm text-gray-555">
            The heritage item you are looking for does not exist or has been removed from our listings.
          </p>
          <Link
            href="/products"
            className="inline-block px-5 py-2.5 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-xl text-sm font-bold shadow"
          >
            Go to Catalog
          </Link>
        </div>
      </div>
    );
  }

  // Calculate pricing adjustment based on selected variants
  let variantPriceAdjustment = 0;
  product.variants.forEach((v) => {
    if (selectedVariants[v.name] === v.value) {
      variantPriceAdjustment += v.priceAdjustment;
    }
  });

  const basePrice = product.price;
  const adjustedPrice = basePrice + variantPriceAdjustment;

  // Zoom magnifier function
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - window.scrollX - left) / width) * 100;
    const y = ((e.pageY - window.scrollY - top) / height) * 100;
    
    setZoomStyle({
      display: "block",
      backgroundImage: `url(${product.images[activeImageIndex]?.url})`,
      backgroundPosition: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: adjustedPrice,
      image: product.images[0]?.url || "https://images.unsplash.com/photo-1596178060810-72cb62112e75?auto=format&fit=crop&w=300&q=80",
      quantity: quantity,
      variantId: "selected-config",
      variantName: Object.keys(selectedVariants)[0] || "Standard",
      variantValue: Object.values(selectedVariants)[0] || "Craft Selection",
      taxRate: product.taxRate || 12
    });
    setCartSuccess(true);
    showToast(`Added ${quantity} × "${product.name}" to cart!`);
    setTimeout(() => setCartSuccess(false), 2500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      window.location.href = "/checkout";
    }, 500);
  };

  const handleAddFbtBundle = () => {
    // Add main product
    addToCart({
      productId: product.id,
      name: product.name,
      price: adjustedPrice,
      image: product.images[0]?.url,
      quantity: 1,
      variantId: null,
      taxRate: product.taxRate || 12
    });

    // Add FBT items
    frequentlyBought.forEach((p) => {
      addToCart({
        productId: p.id,
        name: p.name,
        price: p.price,
        image: p.images[0]?.url,
        quantity: 1,
        variantId: null,
        taxRate: p.taxRate || 12
      });
    });

    showToast("Frequently Bought Together bundle added to your cart with discount!");
  };

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setDeliveryEstimate("Please enter a valid 6-digit PIN code.");
      return;
    }
    // Mock delivery check calculation
    const days = 3 + (parseInt(pincode.charAt(0)) % 4);
    const dateStr = new Date(Date.now() + days * 24 * 3600000).toLocaleDateString("en-IN", { weekday: 'long', month: 'short', day: 'numeric' });
    setDeliveryEstimate(`Delivery available! Expected arrival by ${dateStr}. Cash on Delivery (COD) eligible.`);
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setQaList(prev => [
      { id: Date.now(), question: newQuestion, answer: "Artisan cooperative agent will post an answer shortly.", votes: 0 },
      ...prev
    ]);
    setNewQuestion("");
    setQaMessage(true);
    setTimeout(() => setQaMessage(false), 3000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;
    showToast("Feedback submitted to quality moderation.");
    setReviewSuccess(true);
    setUserComment("");
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAF5EE] text-[#2E1E1A] py-8 text-left">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 relative">
        
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#B56D3E] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#B56D3E] transition-colors">Products</Link>
          <span>/</span>
          <span>{product.district?.state?.name || "Vocal for Local"}</span>
          <span>/</span>
          <span className="text-gray-600">{product.name}</span>
        </div>

        {/* Product main presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Multi-image magnifier & 360 View */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Gallery Wrapper */}
            <div className="relative w-full bg-[#FDFBF7] border border-gray-250/80 rounded-3xl overflow-hidden shadow-sm">
              
              {!is360Active ? (
                // Magnifier Mode
                <div
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className="relative aspect-[4/3] w-full cursor-zoom-in group"
                >
                  <img
                    src={product.images[activeImageIndex]?.url || "https://images.unsplash.com/photo-1596178060810-72cb62112e75?auto=format&fit=crop&w=600&q=80"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-200"
                  />
                  
                  {/* Zoom Overlay */}
                  <div
                    style={zoomStyle}
                    className="absolute inset-0 pointer-events-none bg-[#FDFBF7] bg-no-repeat bg-[length:200%_200%]"
                  />
                </div>
              ) : (
                // 360 Degree Drag Rotation Simulator Mode
                <div className="relative aspect-[4/3] w-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#FDFBF7] to-gray-50/50">
                  <div className="w-64 h-64 relative overflow-hidden rounded-full border border-[#C09355]/30 shadow-inner flex items-center justify-center bg-white">
                    <img
                      src={product.images[rotationIndex % product.images.length]?.url}
                      alt="360 view frame"
                      className="w-full h-full object-cover transition-transform duration-75 scale-90"
                    />
                  </div>
                  
                  {/* Rotation Slider */}
                  <div className="w-full px-8 space-y-1 mt-4 z-10 text-center">
                    <span className="text-[9px] uppercase tracking-widest text-[#B56D3E] font-bold">Drag slider to rotate craft: 360° View</span>
                    <input
                      type="range"
                      min={0}
                      max={18}
                      value={rotationIndex}
                      onChange={(e) => setRotationIndex(parseInt(e.target.value))}
                      className="w-full h-1 bg-[#C09355]/30 rounded-lg appearance-none cursor-ew-resize accent-[#B56D3E]"
                    />
                  </div>
                </div>
              )}

              {/* 360 Mode Toggle button */}
              <button
                onClick={() => setIs360Active(!is360Active)}
                className="absolute top-4 right-4 px-3 py-1.5 bg-[#3D1E16] text-[#FAF5EE] rounded-xl text-[10px] font-extrabold uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center gap-1 cursor-pointer"
              >
                {is360Active ? "Image View" : "360° Studio View"}
              </button>
            </div>

            {/* Thumbnail Gallery selector */}
            {!is360Active && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-2xl border-2 overflow-hidden shrink-0 transition-all cursor-pointer ${
                      activeImageIndex === idx ? "border-[#B56D3E] shadow" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Buy Panel */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title & Price Header */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-550">
                <span className="bg-[#FAF5EE] text-[#B56D3E] border border-[#C09355]/20 px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider">
                  {product.category.name}
                </span>
                <span className="flex items-center gap-1 bg-[#FAF5EE] text-[#3D1E16] border border-[#C09355]/20 px-2.5 py-0.5 rounded-full">
                  <MapPin className="w-3.5 h-3.5 text-[#B56D3E]" />
                  {product.district.name}, {product.district.state.name}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-serif text-[#3D1E16] font-bold leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 pt-2 font-sans">
                <span className="text-3xl font-serif font-extrabold text-[#3D1E16]">
                  ₹{adjustedPrice.toLocaleString()}
                </span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-sm text-gray-400 line-through">
                      ₹{(product.compareAtPrice + variantPriceAdjustment).toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                      ({Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF)
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Official Authenticity Seals GI Tagged sourcing */}
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-[#FAF5EE] border border-emerald-200 rounded-3xl space-y-3 font-sans">
              <div className="flex items-start gap-3">
                <Award className="w-10 h-10 text-emerald-700 shrink-0 animate-pulse mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-black text-emerald-800 uppercase tracking-widest block">Geographical Indication (GI) Verified</span>
                  <p className="text-[11px] text-gray-655 leading-relaxed">
                    This registry certifies this product is hand-crafted directly under designated district cluster borders. Woven/crafted with certified methods, carrying official GI identification stamp tags.
                  </p>
                </div>
              </div>
              
              <div className="border-t border-emerald-200/50 pt-2 flex justify-between text-[9px] font-mono text-emerald-700">
                <span>Certification Code: <strong>IN-ODOP-VAR-0012</strong></span>
                <span>Cooperative: <strong>Kashi Artisan Union</strong></span>
              </div>
            </div>

            {/* Product Customizer variants */}
            {product.variants.length > 0 && (
              <div className="space-y-3 font-sans text-xs">
                <span className="block font-bold text-[#3D1E16] uppercase tracking-wider">Select Spec Edition</span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariants({ ...selectedVariants, [v.name]: v.value })}
                      className={`px-4 py-2 border rounded-xl font-semibold transition-all cursor-pointer ${
                        selectedVariants[v.name] === v.value
                          ? "border-[#B56D3E] bg-[#B56D3E]/5 text-[#B56D3E]"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {v.value} {v.priceAdjustment > 0 ? `(+₹${v.priceAdjustment})` : ""}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Standard CTA Actions */}
            <div className="flex gap-4 items-center pt-2 font-sans text-xs">
              <div className="flex items-center border border-gray-200 rounded-xl bg-white p-1">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 py-1.5 font-bold hover:bg-gray-150 rounded-lg text-gray-500 cursor-pointer"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-gray-700">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-8 py-1.5 font-bold hover:bg-gray-150 rounded-lg text-gray-500 cursor-pointer"
                >
                  +
                </button>
              </div>

              <div className="flex-1 flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 border border-[#B56D3E] text-[#B56D3E] hover:bg-[#B56D3E]/5 font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider text-[11px]`}
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  className={`flex-1 py-3 ${activeTheme.button} font-bold rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider text-[11px]`}
                >
                  <Zap className="w-4 h-4" /> Buy Now
                </button>
              </div>
            </div>

            {/* Pincode logistics check tool */}
            <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3 font-sans text-xs">
              <span className="block font-bold text-[#3D1E16] uppercase tracking-wider">Check Shipping Availability</span>
              <form onSubmit={handlePincodeSubmit} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-Digit Delivery Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  className="flex-grow px-4 py-2 border border-gray-250 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B56D3E]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3D1E16] text-white hover:bg-[#28140E] font-bold rounded-xl transition-all cursor-pointer"
                >
                  Verify
                </button>
              </form>
              {deliveryEstimate && (
                <p className="text-[10px] font-semibold text-green-700 bg-green-50/50 p-2 border border-green-200/50 rounded-lg">
                  {deliveryEstimate}
                </p>
              )}
            </div>

            {/* High trust security icons */}
            <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold border-t pt-4 font-sans">
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-[#B56D3E]" /> 100% Safe Payments</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-[#B56D3E]" /> 7-Day Easy Return</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Hammer className="w-4 h-4 text-[#B56D3E]" /> Direct Artisan Union</span>
            </div>

          </div>

        </div>

        {/* Dynamic Detail Tabs */}
        <div className="border-t border-[#C09355]/20 pt-8 font-sans">
          
          {/* Tab headers */}
          <div className="flex border-b border-gray-200 mb-6 text-sm font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab("story")}
              className={`pb-3 px-6 border-b-2 transition-all cursor-pointer ${
                activeTab === "story" ? "border-[#B56D3E] text-[#B56D3E]" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Artisan Heritage Story
            </button>
            
            <button
              onClick={() => setActiveTab("specs")}
              className={`pb-3 px-6 border-b-2 transition-all cursor-pointer ${
                activeTab === "specs" ? "border-[#B56D3E] text-[#B56D3E]" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Craft Specs
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 px-6 border-b-2 transition-all cursor-pointer ${
                activeTab === "reviews" ? "border-[#B56D3E] text-[#B56D3E]" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Patron Reviews ({product.reviews.length})
            </button>
          </div>

          {/* TAB 1: Stories */}
          {activeTab === "story" && product.culturalStory && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-xs text-gray-655 leading-relaxed text-left">
              
              {/* Artisan Profile */}
              <div className="md:col-span-4 bg-[#FDFBF7] p-5 border border-gray-200 rounded-3xl space-y-4 text-center">
                <div className="w-24 h-24 rounded-full border-2 border-[#C09355]/30 overflow-hidden mx-auto bg-gray-50">
                  <img
                    src={product.culturalStory.artisanImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"}
                    alt={product.culturalStory.artisanName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-serif font-black text-sm text-[#3D1E16] block">{product.culturalStory.artisanName}</h4>
                  <span className="text-[10px] text-[#B56D3E] font-bold block">{product.culturalStory.artisanLocation}</span>
                </div>
                
                {product.culturalStory.awards && (
                  <div className="p-3 bg-amber-500/5 border border-[#C09355]/30 rounded-2xl">
                    <span className="text-[9px] font-black text-[#B56D3E] uppercase block mb-1">State Registry Awards</span>
                    <p className="text-[10px] text-gray-500 font-serif leading-normal">{product.culturalStory.awards}</p>
                  </div>
                )}
              </div>

              {/* Story detail */}
              <div className="md:col-span-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-[#C09355]/10 pb-6">
                  <div className="space-y-3">
                    <h4 className="font-serif font-bold text-[#3D1E16] flex items-center gap-2">
                      <History className="w-4 h-4 text-[#B56D3E]" /> Historical Legacy
                    </h4>
                    <p>{product.culturalStory.history}</p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-serif font-bold text-[#3D1E16] flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#B56D3E]" /> Cultural Significance
                    </h4>
                    <p>{product.culturalStory.culturalSignificance}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-serif font-bold text-sm text-[#3D1E16] flex items-center gap-2 uppercase tracking-wide">
                    <Hammer className="w-4 h-4 text-[#B56D3E]" /> Production Method
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-600 bg-[#FDFBF7] rounded-2xl p-5 border border-gray-100">
                    {product.culturalStory.productionMethod}
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Specifications */}
          {activeTab === "specs" && (
            <div className="max-w-xl mx-auto bg-[#FDFBF7] rounded-2xl border border-gray-200/80 p-6 shadow-xs text-xs text-left">
              <table className="w-full text-left border-collapse font-sans">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 text-gray-400 font-bold uppercase text-[9px]">Origin District</td>
                    <td className="py-3 font-semibold text-[#3D1E16]">{product.district.name}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 text-gray-400 font-bold uppercase text-[9px]">State / UT</td>
                    <td className="py-3 font-semibold text-[#3D1E16]">{product.district.state.name}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 text-gray-400 font-bold uppercase text-[9px]">Registry SKU</td>
                    <td className="py-3 font-mono text-gray-500 font-bold">{product.sku}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 text-gray-400 font-bold uppercase text-[9px]">GST Rate Included</td>
                    <td className="py-3 font-semibold text-[#3D1E16]">{product.taxRate}% Base</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-400 font-bold uppercase text-[9px]">Availability</td>
                    <td className="py-3 font-semibold text-green-700 font-sans">Verified in Stock ({product.stock} units)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: Reviews */}
          {activeTab === "reviews" && (
            <div className="max-w-2xl mx-auto space-y-8 text-xs text-left">
              
              {/* Form */}
              <div className="bg-[#FDFBF7] rounded-2xl border border-gray-205 p-6 shadow-xs space-y-4 font-sans">
                <h3 className="font-serif text-sm font-bold text-[#3D1E16]">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="flex items-center gap-2 font-sans">
                    <span className="font-bold text-gray-400 uppercase">Artisan rating:</span>
                    <div className="flex gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <button
                          key={stars}
                          type="button"
                          onClick={() => setUserRating(stars)}
                          className="hover:scale-110 transition-transform font-sans"
                        >
                          <Star className={`w-5 h-5 ${userRating >= stars ? "fill-amber-400" : "text-gray-200"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <textarea
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      placeholder="Share your thoughts about this traditional craft, quality, weaving structure, packaging..."
                      rows={3}
                      className="w-full px-4 py-2.5 bg-gray-55 border border-gray-205 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B56D3E]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#3D1E16] hover:bg-[#28140E] text-white rounded-xl font-bold shadow transition-all cursor-pointer font-sans"
                  >
                    Submit review
                  </button>
                </form>
                {reviewSuccess && (
                  <div className="text-xs text-green-600 font-semibold mt-2">
                    Review submitted for verification and cooperative audit.
                  </div>
                )}
              </div>

              {/* Reviews List */}
              <div className="space-y-4 font-sans">
                <h3 className="text-sm font-bold text-[#3D1E16] uppercase tracking-wide">Customer Feedback</h3>
                {product.reviews.length === 0 ? (
                  <div className="text-center text-gray-400 py-8 bg-[#FDFBF7] border border-dashed rounded-2xl">
                    No reviews yet. Be the first to share your experience!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {product.reviews.map((rev) => (
                      <div key={rev.id} className="bg-[#FDFBF7] rounded-2xl border p-5 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-150 rounded-full flex items-center justify-center text-gray-500 border border-gray-200 font-sans">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-semibold text-sm block text-[#3D1E16]">{rev.user.name}</span>
                              <span className="text-[10px] text-gray-450 font-mono">
                                {new Date(rev.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${rev.rating > i ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-655 leading-relaxed pl-10">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* DYNAMIC RECOMMENDATION SLIDERS */}
        <div className="border-t border-[#C09355]/20 pt-10 space-y-12">
          
          {/* 1. Frequently Bought Together Bundle block */}
          {frequentlyBought.length > 0 && (
            <div className="bg-[#FDFBF7] p-6 border border-[#C09355]/30 rounded-3xl shadow-sm text-left">
              <h3 className="font-serif text-lg font-bold text-[#3D1E16] flex items-center gap-1.5 mb-4">
                <Gift className="w-5 h-5 text-[#B56D3E]" /> Frequently Bought Together Bundle
              </h3>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-wrap items-center gap-4 flex-1">
                  
                  {/* Current Item */}
                  <div className="flex items-center gap-3 bg-white p-3 border border-gray-200 rounded-2xl w-full sm:w-[260px]">
                    <img src={product.images[0]?.url} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div className="text-xs">
                      <p className="font-serif font-bold text-gray-700 line-clamp-1">{product.name}</p>
                      <p className="font-mono text-gray-500">₹{adjustedPrice.toLocaleString()}</p>
                    </div>
                  </div>

                  <span className="text-lg font-bold text-gray-400">+</span>

                  {/* FBT Item 1 */}
                  {frequentlyBought.map((p, idx) => (
                    <React.Fragment key={p.id}>
                      <div className="flex items-center gap-3 bg-white p-3 border border-gray-200 rounded-2xl w-full sm:w-[260px]">
                        <img src={p.images[0]?.url} alt={p.name} className="w-12 h-12 object-cover rounded-lg" />
                        <div className="text-xs">
                          <p className="font-serif font-bold text-gray-700 line-clamp-1">{p.name}</p>
                          <p className="font-mono text-gray-500">₹{p.price.toLocaleString()}</p>
                        </div>
                      </div>
                      {idx === 0 && <span className="text-lg font-bold text-gray-400">+</span>}
                    </React.Fragment>
                  ))}

                </div>

                {/* Bundle actions */}
                <div className="p-4 bg-[#FAF5EE] border rounded-2xl text-center min-w-[200px] text-xs space-y-3 font-sans shrink-0">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">Combined Bundle Price</span>
                    <span className="text-xl font-serif font-black text-[#B56D3E] block">
                      ₹{Math.round((adjustedPrice + frequentlyBought.reduce((sum, p) => sum + p.price, 0)) * 0.9).toLocaleString()}
                    </span>
                    <span className="text-[9px] font-bold text-green-700 block mt-0.5">10% Combo Discount Applied</span>
                  </div>
                  
                  <button
                    onClick={handleAddFbtBundle}
                    className={`w-full py-2 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white font-bold rounded-xl uppercase tracking-wider text-[10px] shadow-sm transition-all cursor-pointer`}
                  >
                    Add All 3 to Cart
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. Similar Products */}
          {similarProducts.length > 0 && (
            <div className="space-y-4 text-left">
              <h3 className="font-serif text-lg font-bold text-[#3D1E16]">Similar Craft Masterpieces</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {similarProducts.map((p) => (
                  <Link key={p.id} href={`/products/${p.slug}`} className="bg-[#FDFBF7] border border-gray-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
                    <img src={p.images[0]?.url} alt={p.name} className="w-full aspect-[4/3] object-cover group-hover:scale-102 transition-transform duration-300" />
                    <div className="p-3 text-xs space-y-1">
                      <span className="text-[8px] bg-amber-500/10 text-[#B56D3E] border border-amber-500/20 px-2 py-0.5 rounded font-black uppercase tracking-wider">{p.district.name}</span>
                      <h4 className="font-serif font-bold text-[#3D1E16] line-clamp-1 pt-1">{p.name}</h4>
                      <p className="font-mono text-gray-655 font-bold">₹{p.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 3. Products from same district */}
          {districtProducts.length > 0 && (
            <div className="space-y-4 text-left">
              <h3 className="font-serif text-lg font-bold text-[#3D1E16] flex items-center gap-1">
                <MapPin className="w-5 h-5 text-[#B56D3E]" /> Trending in {product.district.name} District
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {districtProducts.map((p) => (
                  <Link key={p.id} href={`/products/${p.slug}`} className="bg-[#FDFBF7] border border-gray-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
                    <img src={p.images[0]?.url} alt={p.name} className="w-full aspect-[4/3] object-cover group-hover:scale-102 transition-transform duration-300" />
                    <div className="p-3 text-xs space-y-1">
                      <span className="text-[8px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-black uppercase tracking-wider">{p.category.name}</span>
                      <h4 className="font-serif font-bold text-[#3D1E16] line-clamp-1 pt-1">{p.name}</h4>
                      <p className="font-mono text-gray-655 font-bold">₹{p.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 4. Products from same state */}
          {stateProducts.length > 0 && (
            <div className="space-y-4 text-left">
              <h3 className="font-serif text-lg font-bold text-[#3D1E16]">Other Specialties from {product.district.state.name} State</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stateProducts.map((p) => (
                  <Link key={p.id} href={`/products/${p.slug}`} className="bg-[#FDFBF7] border border-gray-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
                    <img src={p.images[0]?.url} alt={p.name} className="w-full aspect-[4/3] object-cover group-hover:scale-102 transition-transform duration-300" />
                    <div className="p-3 text-xs space-y-1">
                      <span className="text-[8px] bg-amber-500/10 text-[#B56D3E] border border-amber-500/20 px-2 py-0.5 rounded font-black uppercase tracking-wider">{p.district.name}</span>
                      <h4 className="font-serif font-bold text-[#3D1E16] line-clamp-1 pt-1">{p.name}</h4>
                      <p className="font-mono text-gray-655 font-bold">₹{p.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 5. Products by same vendor cooperative */}
          {vendorProducts.length > 0 && (
            <div className="space-y-4 text-left">
              <h3 className="font-serif text-lg font-bold text-[#3D1E16]">More from Kashi Artisan Coop Union</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {vendorProducts.map((p) => (
                  <Link key={p.id} href={`/products/${p.slug}`} className="bg-[#FDFBF7] border border-gray-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
                    <img src={p.images[0]?.url} alt={p.name} className="w-full aspect-[4/3] object-cover group-hover:scale-102 transition-transform duration-300" />
                    <div className="p-3 text-xs space-y-1">
                      <span className="text-[8px] bg-[#FAF5EE] text-[#3D1E16] border border-gray-150 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{p.district.name}</span>
                      <h4 className="font-serif font-bold text-[#3D1E16] line-clamp-1 pt-1">{p.name}</h4>
                      <p className="font-mono text-gray-655 font-bold">₹{p.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 6. Recently Viewed browsing history list */}
          {recentlyViewed.length > 0 && (
            <div className="space-y-4 text-left">
              <h3 className="font-serif text-lg font-bold text-gray-400 uppercase tracking-widest text-xs border-b pb-2">Your Recently Viewed Items</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {recentlyViewed.map((p) => (
                  <Link key={p.id} href={`/products/${p.slug}`} className="bg-[#FDFBF7] border border-gray-200/50 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
                    <img src={p.images[0]?.url} alt={p.name} className="w-full aspect-[4/3] object-cover scale-95" />
                    <div className="p-2.5 text-xs text-center">
                      <h4 className="font-serif font-bold text-[#3D1E16] line-clamp-1">{p.name}</h4>
                      <p className="font-mono text-gray-500 font-semibold mt-0.5">₹{p.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Dynamic Q&A Panel */}
        <div className="border-t border-[#C09355]/20 pt-10 space-y-6 text-xs text-left">
          <h3 className="font-serif text-lg font-bold text-[#3D1E16]">Questions & Answers</h3>
          
          <div className="bg-[#FDFBF7] p-6 border border-gray-250/70 rounded-3xl shadow-xs space-y-6">
            
            {/* Ask form */}
            <form onSubmit={handlePostQuestion} className="space-y-3 font-sans">
              <span className="block font-bold text-gray-400 uppercase tracking-wider text-[10px]">Have a query about materials or dye methods? Ask here:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Ask product specifications or packaging transit details..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="flex-grow px-4 py-2 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#B56D3E]"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#3D1E16] text-white hover:bg-[#28140E] font-bold rounded-xl transition-all cursor-pointer font-sans"
                >
                  Post Question
                </button>
              </div>
              {qaMessage && (
                <p className="text-[10px] text-green-700 font-semibold">✓ Question posted successfully for cooperative union response.</p>
              )}
            </form>

            {/* Q&A list */}
            <div className="space-y-4 divide-y divide-gray-100">
              {qaList.map((qa) => (
                <div key={qa.id} className="pt-4 first:pt-0 space-y-2">
                  <div className="flex gap-2 items-start">
                    <span className="font-serif font-black text-sm text-[#B56D3E]">Q:</span>
                    <div>
                      <p className="font-bold text-[#3D1E16] text-sm">{qa.question}</p>
                      <div className="flex items-center gap-3 text-[9px] text-gray-450 font-bold mt-1 uppercase">
                        <span>Liaison Desk Answered</span>
                        <span>•</span>
                        <button
                          onClick={() => {
                            setQaList(prev => prev.map(item => item.id === qa.id ? { ...item, votes: item.votes + 1 } : item));
                            showToast("Upvoted question.");
                          }}
                          className="hover:text-[#B56D3E] underline cursor-pointer"
                        >
                          Helpful ({qa.votes})
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 items-start pl-4 border-l-2 border-gray-150">
                    <span className="font-serif font-black text-sm text-[#3D1E16]">A:</span>
                    <p className="text-gray-655 font-medium leading-relaxed">{qa.answer}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* STICKY BOTTOM ACTIONS BAR */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-2xl p-3 flex items-center justify-between gap-4 font-sans animate-fade-in-up">
          <div className="flex items-center gap-3 max-w-sm">
            <img src={product.images[0]?.url} alt={product.name} className="w-10 h-10 object-cover rounded-lg border shrink-0 bg-gray-50" />
            <div className="text-xs text-left">
              <h4 className="font-serif font-bold text-[#3D1E16] line-clamp-1 leading-snug">{product.name}</h4>
              <p className="font-mono text-[#B56D3E] font-bold">₹{adjustedPrice.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0 text-xs uppercase font-bold tracking-wider text-[10px]">
            <button
              onClick={handleAddToCart}
              className="px-4 py-2.5 border border-[#B56D3E] text-[#B56D3E] hover:bg-[#B56D3E]/5 rounded-xl cursor-pointer"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className={`px-5 py-2.5 ${activeTheme.button} rounded-xl shadow cursor-pointer`}
            >
              Buy Now
            </button>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#3D1E16] text-[#FAF5EE] border border-[#C09355]/30 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3">
          <Clock className="w-4 h-4 text-[#C09355] animate-spin" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
