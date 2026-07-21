import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import * as bcrypt from "bcryptjs";
import * as fs from "fs";
import * as path from "path";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

const DISTRICTS_MAP: Record<string, string[]> = {
  "AN": ["Nicobars", "North and Middle Andaman", "South Andaman"],
  "AP": [
    "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool",
    "Prakasam", "Sri Potti Sriramulu Nellore", "Srikakulam", "Visakhapatnam",
    "Vizianagaram", "West Godavari", "Y.S.R."
  ],
  "AR": [
    "Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang",
    "Kra Daadi", "Kurung Kumey", "Lohit", "Lower Dibang Valley", "Lower Siang",
    "Lower Subansiri", "Namsai", "Papum Pare", "Siang", "Tawang", "Tirap",
    "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang"
  ],
  "AS": [
    "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo",
    "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao",
    "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup",
    "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar",
    "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar",
    "Sonitpur", "South Salamara-Mankachar", "Tinsukia", "Udalguri",
    "West Karbi Anglong"
  ],
  "BR": [
    "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur",
    "Bhojpur", "Buxar", "Darbhanga", "Gaya", "Gopalganj", "Jamui", "Jehanabad",
    "Kaimur (Bhabua)", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai",
    "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada",
    "Pashchim Champaran", "Patna", "Purbi Champaran", "Purnia", "Rohtas",
    "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi",
    "Siwan", "Supaul", "Vaishali"
  ],
  "CG": [
    "Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur",
    "Bilaspur", "Dakshin Bastar Dantewada", "Dhamtari", "Durg", "Gariyaband",
    "Janjgir - Champa", "Jashpur", "Kabeerdham", "Kondagaon", "Korba",
    "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur",
    "Rajnandgaon", "Sukma", "Surajpur", "Surguja", "Uttar Kanker"
  ],
  "CH": ["Chandigarh"],
  "DN": ["Dadra and Nagar Haveli", "Daman", "Diu"],
  "GA": ["North Goa", "South Goa"],
  "GJ": [
    "Ahmadabad", "Amreli", "Anand", "Arvalli", "Banas Kantha", "Bharuch",
    "Bhavnagar", "Botad", "Chhota Udepur", "Devbhoomi Dwarka", "Dohad",
    "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kachchh", "Kheda",
    "Mahesana", "Mahisagar", "Morbi", "Narmada", "Navsari", "Panch Mahals",
    "Patan", "Porbandar", "Rajkot", "Sabar Kantha", "Surat", "Surendranagar",
    "Tapi", "The Dangs", "Vadodara", "Valsad"
  ],
  "HR": [
    "Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurgaon",
    "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra",
    "Mahendragarh", "Mewat", "Palwal", "Panchkula", "Panipat", "Rewari",
    "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"
  ],
  "HP": [
    "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu",
    "Lahul Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"
  ],
  "JK": [
    "Anantnag", "Badgam", "Bandipore", "Baramula", "Doda", "Ganderbal",
    "Jammu", "Kargil", "Kathua", "Kishtwar", "Kulgam", "Kupwara",
    "Leh(Ladakh)", "Pulwama", "Punch", "Rajouri", "Ramban", "Reasi",
    "Samba", "Shupiyan", "Srinagar", "Udhampur"
  ],
  "JH": [
    "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "Garhwa", "Giridih",
    "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Kodarma", "Latehar",
    "Lohardaga", "Pakur", "Palamu", "Pashchimi Singhbhum", "Purbi Singhbhum",
    "Ramgarh", "Ranchi", "Sahibganj", "Saraikela-Kharsawan", "Simdega"
  ],
  "KA": [
    "Bagalkot", "Bangalore", "Bangalore Rural", "Belgaum", "Bellary", "Bidar",
    "Bijapur", "Chamarajanagar", "Chikkaballapura", "Chikmagalur",
    "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag",
    "Gulbarga", "Hassan", "Haveri", "Kodagu", "Kolar", "Koppal", "Mandya",
    "Mysore", "Raichur", "Ramanagara", "Shimoga", "Tumkur", "Udupi",
    "Uttara Kannada", "Yadgir"
  ],
  "KL": [
    "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam",
    "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta",
    "Thiruvananthapuram", "Thrissur", "Wayanad"
  ],
  "LD": ["Lakshadweep"],
  "LA": ["Leh", "Kargil"],
  "MP": [
    "Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani",
    "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara",
    "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda",
    "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa (East Nimar)",
    "Khargone (West Nimar)", "Mandla", "Mandsaur", "Morena", "Narsimhapur",
    "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar",
    "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri",
    "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"
  ],
  "MH": [
    "Ahmadnagar", "Akola", "Amravati", "Aurangabad", "Bhandara", "Bid",
    "Buldana", "Chandrapur", "Dhule", "Gadchiroli", "Gondiya", "Hingoli",
    "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai", "Mumbai Suburban",
    "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar",
    "Parbhani", "Pune", "Raigarh", "Ratnagiri", "Sangli", "Satara",
    "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
  ],
  "MN": [
    "Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West",
    "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl",
    "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"
  ],
  "ML": [
    "East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "Jaintia Hills",
    "North Garo Hills", "Ribhoi", "South Garo Hills", "South West Garo Hills",
    "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills",
    "West Khasi Hills"
  ],
  "MZ": ["Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Serchhip"],
  "NL": ["Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"],
  "DL": ["Central", "East", "New Delhi", "North", "North East", "North West", "Shahdara", "South", "South East Delhi", "South West", "West"],
  "OR": [
    "Anugul", "Balangir", "Baleshwar", "Bargarh", "Baudh", "Bhadrak", "Cuttack",
    "Debagarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghapur", "Jajapur",
    "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar",
    "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangapur", "Nayagarh",
    "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"
  ],
  "PY": ["Karaikal", "Mahe", "Puducherry", "Yanam"],
  "PB": [
    "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka",
    "Firozpur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana",
    "Mansa", "Moga", "Muktsar", "Pathankot", "Patiala", "Rupnagar",
    "Sahibzada Ajit Singh Nagar", "Sangrur", "Shahid Bhagat Singh Nagar",
    "Tarn Taran"
  ],
  "RJ": [
    "Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara",
    "Bikaner", "Bundi", "Chittaurgarh", "Churu", "Dausa", "Dhaulpur",
    "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalor", "Jhalawar",
    "Jhunjhunun", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh",
    "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk",
    "Udaipur"
  ],
  "SK": ["East District", "North District", "South District", "West District"],
  "TN": [
    "Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul",
    "Erode", "Kancheepuram", "Kanniyakumari", "Karur", "Krishnagiri", "Madurai",
    "Nagapattinam", "Namakkal", "Perambalur", "Pudukkottai", "Ramanathapuram",
    "Salem", "Sivaganga", "Thanjavur", "The Nilgiris", "Theni", "Thiruvallur",
    "Thiruvarur", "Thoothukkudi", "Tiruchirappalli", "Tirunelveli", "Tiruppur",
    "Tiruvannamalai", "Vellore", "Viluppuram", "Virudhunagar"
  ],
  "TG": [
    "Adilabad", "Bhadradri", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar",
    "Jogulamba", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem",
    "Mahabubabad", "Mahbubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri",
    "Nagarkurnool", "Nalgonda", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna",
    "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad",
    "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri"
  ],
  "TR": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
  "UP": [
    "Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi", "Amroha",
    "Auraiya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur",
    "Banda", "Bara Banki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun",
    "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah",
    "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar",
    "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur",
    "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat",
    "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur",
    "Lucknow", "Mahoba", "Mahrajganj", "Mainpuri", "Mathura", "Mau", "Meerut",
    "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh",
    "Rae Bareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar",
    "Shahjahanpur", "Shamli", "Shrawasti", "Siddharthnagar", "Sitapur",
    "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
  ],
  "UK": [
    "Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Garhwal",
    "Hardwar", "Nainital", "Pithoragarh", "Rudraprayag", "Tehri Garhwal",
    "Udham Singh Nagar", "Uttarkashi"
  ],
  "WB": [
    "Alipurduar", "Bankura", "Barddhaman", "Birbhum", "Dakshin Dinajpur",
    "Darjiling", "Haora", "Hugli", "Jalpaiguri", "Jhargram", "Kalimpong",
    "Koch Bihar", "Kolkata", "Maldah", "Murshidabad", "Nadia",
    "North Twenty Four Parganas", "Paschim Bardhaman", "Paschim Medinipur",
    "Purba Bardhaman", "Purba Medinipur", "Puruliya", "South Twenty Four Parganas",
    "Uttar Dinajpur"
  ]
};

const STATES_AND_UTS = [
  // States
  { name: "Andhra Pradesh", code: "AP", district: "Araku Valley", odop: "Araku Coffee" },
  { name: "Arunachal Pradesh", code: "AR", district: "Changlang", odop: "Handloom Textiles" },
  { name: "Assam", code: "AS", district: "Kamrup", odop: "Muga Silk" },
  { name: "Bihar", code: "BR", district: "Madhubani", odop: "Madhubani Paintings" },
  { name: "Chhattisgarh", code: "CG", district: "Bastar", odop: "Bastar Iron Craft" },
  { name: "Goa", code: "GA", district: "North Goa", odop: "Cashew Nuts" },
  { name: "Gujarat", code: "GJ", district: "Kutch", odop: "Kutchi Embroidery" },
  { name: "Haryana", code: "HR", district: "Panipat", odop: "Handloom Carpets" },
  { name: "Himachal Pradesh", code: "HP", district: "Kullu", odop: "Kullu Shawl" },
  { name: "Jharkhand", code: "JH", district: "Saraikela", odop: "Seraikella Chhau Masks" },
  { name: "Karnataka", code: "KA", district: "Ramanagara", odop: "Channapatna Toys" },
  { name: "Kerala", code: "KL", district: "Wayanad", odop: "Wayanad Cardamom" },
  { name: "Madhya Pradesh", code: "MP", district: "Chanderi", odop: "Chanderi Saree" },
  { name: "Maharashtra", code: "MH", district: "Aurangabad", odop: "Himroo Shawls" },
  { name: "Manipur", code: "MN", district: "Imphal East", odop: "Kauna Reed Craft" },
  { name: "Meghalaya", code: "ML", district: "West Jaintia Hills", odop: "Lakadong Turmeric" },
  { name: "Mizoram", code: "MZ", district: "Aizawl", odop: "Mizo Puan Fabric" },
  { name: "Nagaland", code: "NL", district: "Chumoukedima", odop: "Naga Handloom & Crafts" },
  { name: "Odisha", code: "OR", district: "Puri", odop: "Applique Work of Pippli" },
  { name: "Punjab", code: "PB", district: "Amritsar", odop: "Phulkari Embroidery" },
  { name: "Rajasthan", code: "RJ", district: "Jaipur", odop: "Blue Pottery" },
  { name: "Sikkim", code: "SK", district: "East Sikkim", odop: "Large Cardamom" },
  { name: "Tamil Nadu", code: "TN", district: "Kanchipuram", odop: "Kanchipuram Silk Sarees" },
  { name: "Telangana", code: "TG", district: "Pochampally", odop: "Pochampally Ikat Sarees" },
  { name: "Tripura", code: "TR", district: "West Tripura", odop: "Bamboo & Cane Handicrafts" },
  { name: "Uttar Pradesh", code: "UP", district: "Varanasi", odop: "Banarasi Silk Brocade" },
  { name: "Uttarakhand", code: "UK", district: "Almora", odop: "Bal Mithai & Singauri" },
  { name: "West Bengal", code: "WB", district: "Darjeeling", odop: "Darjeeling Tea" },
  // UTs
  { name: "Andaman and Nicobar Islands", code: "AN", district: "South Andaman", odop: "Coconut Handicrafts" },
  { name: "Chandigarh", code: "CH", district: "Chandigarh", odop: "Phulkari & Panjiri" },
  { name: "Dadra and Nagar Haveli and Daman and Diu", code: "DN", district: "Daman", odop: "Tortoiseshell & Ivory Carving" },
  { name: "Delhi", code: "DL", district: "Central Delhi", odop: "Zardozi Embroidery" },
  { name: "Jammu and Kashmir", code: "JK", district: "Srinagar", odop: "Kashmiri Pashmina Shawl" },
  { name: "Ladakh", code: "LA", district: "Leh", odop: "Sea Buckthorn Berries" },
  { name: "Lakshadweep", code: "LD", district: "Kavaratti", odop: "Coir and Coconut Products" },
  { name: "Puducherry", code: "PY", district: "Puducherry", odop: "Terracotta Toys & Dolls" }
];

async function main() {
  console.log("Seeding started...");

  // 1. Clear database
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.culturalStory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.district.deleteMany();
  await prisma.state.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.blogPost.deleteMany();

  // 2. Roles
  const roles = [
    { name: "Owner", permissions: "ALL" },
    { name: "Super Admin", permissions: "ALL" },
    { name: "Admin", permissions: "PRODUCTS:WRITE,CATEGORIES:WRITE,STATES:WRITE,USERS:WRITE" },
    { name: "Product Manager", permissions: "PRODUCTS:WRITE,CATEGORIES:WRITE" }, // Cannot edit base prices
    { name: "Inventory Manager", permissions: "INVENTORY:WRITE" },
    { name: "Order Manager", permissions: "ORDERS:WRITE" },
    { name: "Finance", permissions: "REPORTS:READ,INVOICES:WRITE" },
    { name: "Marketing", permissions: "BANNERS:WRITE,COUPONS:WRITE,SEO:WRITE" },
    { name: "Customer Support", permissions: "SUPPORT:READ" },
    { name: "Delivery Manager", permissions: "DELIVERY:WRITE" },
    { name: "Vendor", permissions: "VENDOR:OWN" },
    { name: "Moderator", permissions: "REVIEWS:MODERATE,BLOGS:WRITE" },
    { name: "Customer", permissions: "CUSTOMER:OWN" }
  ];

  const createdRoles: Record<string, string> = {};
  for (const r of roles) {
    const created = await prisma.role.create({
      data: { name: r.name, permissions: r.permissions }
    });
    createdRoles[r.name] = created.id;
  }
  console.log("Roles seeded.");

  // 3. States & UTs and Districts
  const stateMap: Record<string, string> = {};
  const districtMap: Record<string, string> = {};

  for (const item of STATES_AND_UTS) {
    const state = await prisma.state.create({
      data: {
        name: item.name,
        code: item.code,
        isActive: true
      }
    });
    stateMap[item.code] = state.id;

    // Retrieve all districts for this state from our PDF-detailed mapping
    const districtsList = [...(DISTRICTS_MAP[item.code] || [])];
    
    // Ensure the main ODOP representative district is included
    if (!districtsList.includes(item.district)) {
      districtsList.push(item.district);
    }

    for (const distName of districtsList) {
      const isRepresentative = distName === item.district;
      const district = await prisma.district.create({
        data: {
          stateId: state.id,
          name: distName,
          odopProduct: isRepresentative ? item.odop : null,
          isActive: true
        }
      });
      districtMap[`${item.code}-${distName}`] = district.id;
    }
  }
  console.log("States, UTs and PDF-mapped districts seeded successfully.");

  // 4. Categories
  const categoriesData = [
    { name: "Handloom & Textiles", slug: "handloom-textiles", desc: "Traditional weave, silks, and embroidered materials." },
    { name: "Heritage Handicrafts", slug: "heritage-handicrafts", desc: "Handcrafted metal, clay, stone, and wood arts." },
    { name: "Spices & Organic Food", slug: "spices-organic-food", desc: "Certified organic spices, farm products, and sweets." },
    { name: "Art & Folk Painting", slug: "art-folk-painting", desc: "Historical paintings like Madhubani, Pattachitra, and Tanjore." }
  ];

  const catMap: Record<string, string> = {};
  for (const c of categoriesData) {
    const cat = await prisma.category.create({
      data: {
        name: c.name,
        slug: c.slug,
        description: c.desc,
        isActive: true
      }
    });
    catMap[c.slug] = cat.id;
  }
  console.log("Categories seeded.");

  // 5. Mapped Products & Cultural Stories from PDF Data
  const parsedProductsPath = path.join(process.cwd(), "prisma", "parsed_products.json");
  const parsedProductsRaw = fs.readFileSync(parsedProductsPath, "utf8");
  const parsedProducts = JSON.parse(parsedProductsRaw);

  const getCategorySlug = (sector: string): string => {
    const s = (sector || "").toLowerCase().trim();
    if (s.includes("agriculture") || s.includes("dairy") || s.includes("food processing") || s.includes("marine")) {
      return "spices-organic-food";
    }
    if (s.includes("handloom") || s.includes("textile")) {
      return "handloom-textiles";
    }
    if (s.includes("handicraft") || s.includes("tourism") || s.includes("manufacturing")) {
      return "heritage-handicrafts";
    }
    return "heritage-handicrafts"; // fallback
  };

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  };

  let productIndex = 0;
  for (const item of parsedProducts) {
    const stateId = stateMap[item.stateCode];
    const districtId = districtMap[`${item.stateCode}-${item.district}`];
    const catSlug = getCategorySlug(item.sector);
    const categoryId = catMap[catSlug];

    if (!stateId || !districtId || !categoryId) {
      continue;
    }

    // Generate random realistic pricing based on category
    let price = 450.0;
    if (item.category === "Primary") price = 350.0 + (productIndex % 5) * 150.0;
    else if (item.category === "Secondary") price = 1200.0 + (productIndex % 5) * 450.0;
    else if (item.category === "Tertiary") price = 3500.0 + (productIndex % 5) * 900.0;
    else price = 250.0 + (productIndex % 5) * 80.0;

    const compareAtPrice = price * 1.25;
    const stock = 20 + (productIndex % 8) * 15;
    const sku = `${item.stateCode}-${item.district.substring(0, 3).toUpperCase()}-${item.category.substring(0, 3).toUpperCase()}-${String(productIndex).padStart(4, "0")}`;
    const barcode = `890${String(123400000 + productIndex)}`;

    // Select standard heritage Unsplash images based on sector
    let imageUrl = "https://images.unsplash.com/photo-1596178060810-72cb62112e75?auto=format&fit=crop&w=600&q=80"; // default
    const s = (item.sector || "").toLowerCase();
    if (s.includes("agriculture") || s.includes("dairy")) {
      imageUrl = "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80";
    } else if (s.includes("handloom") || s.includes("textile")) {
      imageUrl = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80";
    } else if (s.includes("handicraft") || s.includes("manufacturing")) {
      imageUrl = "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80";
    } else if (s.includes("marine")) {
      imageUrl = "https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=600&q=80";
    } else if (s.includes("food processing")) {
      imageUrl = "https://images.unsplash.com/photo-1589733901241-5e5647c4854f?auto=format&fit=crop&w=600&q=80";
    }

    const createdProduct = await prisma.product.create({
      data: {
        name: item.productName,
        slug: `${slugify(item.productName)}-${slugify(item.district)}-${productIndex}`,
        description: `Premium certified ${item.productName} representing the local district heritage of ${item.district}, ${item.state}. Sourced directly from native community clusters under India's Vocal for Local mission.`,
        price: price,
        compareAtPrice: compareAtPrice,
        taxRate: 5.0, // Standard 5% GST
        stock: stock,
        sku: sku,
        barcode: barcode,
        categoryId: categoryId,
        districtId: districtId,
        isFeatured: productIndex % 45 === 0, // Mark a few as featured
        isTrending: productIndex % 33 === 0,
        isNew: true,
        isActive: true
      }
    });

    // Create Image
    await prisma.productImage.create({
      data: {
        productId: createdProduct.id,
        url: imageUrl
      }
    });

    // Create Default Variant
    await prisma.productVariant.create({
      data: {
        productId: createdProduct.id,
        name: "Size/Weight",
        value: s.includes("agriculture") ? "500g Pack" : "Standard",
        priceAdjustment: 0.0,
        stock: stock
      }
    });

    // Create Cultural Story
    await prisma.culturalStory.create({
      data: {
        productId: createdProduct.id,
        artisanName: `${item.district} Community Collective`,
        artisanLocation: `${item.district}, ${item.state}`,
        artisanImage: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?auto=format&fit=crop&w=400&q=80",
        history: `The legacy of crafting ${item.productName} in ${item.district} represents a timeless heritage. Practiced for generations, this traditional art is a living cultural registry of the region.`,
        culturalSignificance: `Using locally sourced materials, this product embodies the unique geographic character and community legacy of ${item.district}.`,
        productionMethod: `Meticulously crafted using traditional, eco-friendly hand processes passed down through generations of local artisans.`,
        geographicalIdentity: `Certified official ODOP product from ${item.district}, ${item.state}.`,
        awards: "State Craft Heritage Award"
      }
    });

    productIndex++;
  }
  console.log(`Successfully seeded ${productIndex} PDF-mapped Products and Cultural Stories.`);

  // 6. Users (Admin/Owner and Customer)
  const ownerPasswordHash = await bcrypt.hash("AuraicOwner2026", 10);
  const customerPasswordHash = await bcrypt.hash("AuraicCust2026", 10);

  const ownerRole = createdRoles["Owner"];
  const customerRole = createdRoles["Customer"];

  await prisma.user.create({
    data: {
      name: "Abhishek Auraic",
      email: "owner@auraic.in",
      phone: "+919876543210",
      passwordHash: ownerPasswordHash,
      roleId: ownerRole,
      isSuspended: false
    }
  });

  const normalCust = await prisma.user.create({
    data: {
      name: "Aarav Sharma",
      email: "aarav@gmail.com",
      phone: "+919812345678",
      passwordHash: customerPasswordHash,
      roleId: customerRole,
      isSuspended: false
    }
  });

  // Seed default address for Customer
  const custAddress = await prisma.address.create({
    data: {
      userId: normalCust.id,
      street: "Sector 15, House 24B",
      city: "Noida",
      state: "Uttar Pradesh",
      pincode: "201301",
      country: "India",
      isDefault: true
    }
  });
  console.log("Users and default address seeded.");

  // 7. Banners
  await prisma.banner.createMany({
    data: [
      {
        title: "Vocal for Local Heritage Sale",
        subtitle: "Support India's Master Artisans & Explore Unique ODOP Specialties from 750+ Districts.",
        imageUrl: "https://images.unsplash.com/photo-1596178060810-72cb62112e75?auto=format&fit=crop&w=1200&q=80",
        linkUrl: "/products",
        position: "HERO",
        isActive: true
      },
      {
        title: "Festive Silk Collection",
        subtitle: "Exclusive Kanchipuram & Banarasi Sarees crafted with pure mulberry silk.",
        imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
        linkUrl: "/products?category=handloom-textiles",
        position: "CATEGORY",
        isActive: true
      }
    ]
  });

  // 8. Coupons
  await prisma.coupon.create({
    data: {
      code: "ODOPFIRST",
      type: "PERCENTAGE",
      value: 10.0, // 10% Off
      minOrderAmount: 1000.0,
      maxDiscount: 500.0,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
      usageLimit: 1000,
      isActive: true
    }
  });

  // 9. BlogPosts
  await prisma.blogPost.create({
    data: {
      title: "The Golden Thread: Journey of Varanasi's Handwoven Sarees",
      slug: "golden-thread-varanasi-handwoven-sarees",
      summary: "Explore the ancient weavers' colony of Madanpura and learn how they are preserving 500 years of handloom legacy.",
      content: "Varanasi, or Kashi, is known not just for its spiritual ghats but also for its rich weaving heritage. Banarasi Silk Brocades have dressed royals and families for generations. The process involves drawing patterns, punching cards, and manual weaving on heavy wooden pit looms. Supporting these artisans helps keep this national legacy alive...",
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
      author: "Auraic Editorial",
      isPublished: true
    }
  });

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
