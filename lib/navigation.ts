export type NavigationItem = {
  key: string;
  label: string;
  href?: string;
  roles?: string[]; // Allowed roles: e.g. ["Admin", "Owner"]
  children?: NavigationItem[];
  desktopOnly?: boolean;
  mobileOnly?: boolean;
};

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "about", label: "About", href: "/about" },
  {
    key: "categories",
    label: "Categories",
    href: "/products",
    children: [
      { key: "all-products", label: "All Products", href: "/products" },
      { key: "heritage-handicrafts", label: "Stone & Wood Carvings", href: "/products?category=heritage-handicrafts" },
      { key: "blue-pottery", label: "Blue Pottery & Clay Art", href: "/products?category=pottery" },
      { key: "brassware", label: "Moradabad Brassware", href: "/products?category=metal-crafts" },
      { key: "tribal-bamboo", label: "Tribal Bamboo Crafts", href: "/products?category=tribal-art" },
      { key: "banarasi", label: "Banarasi Silk Sarees", href: "/products?category=handloom-textiles" },
      { key: "paithani", label: "Paithani Silk Sarees", href: "/products?category=handloom-textiles" },
      { key: "venkatagiri", label: "Venkatagiri Handlooms", href: "/products?category=handloom-textiles" },
      { key: "pashmina", label: "Pashmina Shawls", href: "/products?category=handloom-textiles" },
      { key: "madhubani", label: "Madhubani Paintings", href: "/products?category=art-folk-painting" },
      { key: "pattachitra", label: "Pattachitra Scrolls", href: "/products?category=art-folk-painting" },
      { key: "warli", label: "Warli Folk Drawings", href: "/products?category=art-folk-painting" }
    ]
  },
  { key: "stories", label: "Stories", href: "/stories" },
  { key: "orders", label: "Orders", href: "/orders" },
  { key: "wishlist", label: "Wishlist", href: "/products?wishlist=true" },
  {
    key: "admin",
    label: "Admin",
    roles: ["Admin", "Owner"],
    children: [
      { key: "admin-dashboard", label: "Dashboard", href: "/admin/dashboard" },
      { key: "admin-states", label: "States & Districts", href: "/admin/states" },
      { key: "admin-categories", label: "Categories", href: "/admin/categories" },
      { key: "admin-about", label: "About Editor", href: "/admin/about" }
    ]
  }
];

export const LANGUAGE_OPTIONS = [
  { code: "en", name: "English", localName: "English" },
  { code: "hi", name: "Hindi", localName: "हिन्दी" },
  { code: "gu", name: "Gujarati", localName: "ગુજરાતી" },
  { code: "pa", name: "Punjabi", localName: "ਪੰਜਾਬੀ" },
  { code: "ta", name: "Tamil", localName: "தமிழ்" },
  { code: "te", name: "Telugu", localName: "తెలుగు" },
  { code: "mr", name: "Marathi", localName: "मराठी" },
  { code: "ml", name: "Malayalam", localName: "മലയാളം" },
  { code: "kn", name: "Kannada", localName: "ಕನ್ನಡ" },
  { code: "bn", name: "Bengali", localName: "বাংলা" },
  { code: "or", name: "Odia", localName: "ଓଡ଼ିଆ" },
  { code: "as", name: "Assamese", localName: "অসমীয়া" }
];

export const CURRENCY_OPTIONS = [
  { code: "INR", name: "Indian Rupee (₹)" },
  { code: "USD", name: "US Dollar ($)" },
  { code: "EUR", name: "Euro (€)" },
  { code: "GBP", name: "British Pound (£)" }
];
