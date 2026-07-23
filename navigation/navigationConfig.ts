export interface NavigationItem {
  key: string;
  label: string;
  href?: string;
  roles?: string[]; // Allowed roles (e.g. ["Admin", "Owner"], ["Vendor"])
  children?: NavigationItem[];
  mobileOnly?: boolean;
  desktopOnly?: boolean;
  drawerOnly?: boolean;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { 
    key: "home", 
    label: "Home", 
    href: "/" 
  },
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
  { 
    key: "stories", 
    label: "Stories", 
    href: "/stories" 
  },
  { 
    key: "search", 
    label: "Search", 
    href: "/products", 
    mobileOnly: true 
  },
  { 
    key: "orders", 
    label: "Orders", 
    href: "/orders"
  },
  { 
    key: "wishlist", 
    label: "Wishlist", 
    href: "/products?wishlist=true"
  },
  { 
    key: "cart", 
    label: "Cart", 
    href: "/checkout", 
    mobileOnly: true 
  },
  { 
    key: "profile", 
    label: "Profile", 
    href: "/profile" 
  },
  { 
    key: "support", 
    label: "Support", 
    href: "/profile", 
    drawerOnly: true 
  },
  { 
    key: "contact", 
    label: "Contact", 
    href: "/profile", 
    drawerOnly: true 
  },
  { 
    key: "about", 
    label: "About", 
    href: "/about", 
    drawerOnly: true 
  },
  { 
    key: "privacy", 
    label: "Privacy Policy", 
    href: "/privacy", 
    drawerOnly: true 
  },
  { 
    key: "terms", 
    label: "Terms of Service", 
    href: "/terms", 
    drawerOnly: true 
  },
  { 
    key: "faq", 
    label: "Help Center & FAQs", 
    href: "/faq", 
    drawerOnly: true 
  },
  { 
    key: "shipping-returns", 
    label: "Shipping & Returns", 
    href: "/shipping-returns", 
    drawerOnly: true 
  },
  {
    key: "admin-dashboard",
    label: "Admin Dashboard",
    href: "/admin/dashboard",
    roles: ["Admin", "Owner", "Super Admin"]
  },
  {
    key: "vendor-dashboard",
    label: "Vendor Dashboard",
    href: "/vendor/dashboard",
    roles: ["Vendor"]
  }
];
