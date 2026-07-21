import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Sparkles, BookOpen, Compass, Award, Tag } from "lucide-react";

// Predefined detailed cultural profiles for states to satisfy the visual details requirements
const culturalProfiles: Record<string, {
  culture: string;
  art: string;
  craft: string;
  architecture: string;
  food: string;
  festival: string;
  history: string;
  stories: string;
}> = {
  "RJ": {
    culture: "Rajasthan's culture is deeply rooted in Rajput chivalry, folk traditions, and vibrant colors that contrast with the golden sands of the Thar Desert.",
    art: "Miniature Painting, Phad Scroll Art, and Pichwai Paintings representing legends of Lord Krishna.",
    craft: "Blue Pottery of Jaipur, Mojari Leather Footwear, Tie & Dye (Bandhani) textiles, and Puppetry.",
    architecture: "Intricate Havelis with Jharokhas, majestic hill forts like Amer and Chittorgarh, and stepwells (Baoris).",
    food: "Dal Baati Churma, Laal Maas, Ker Sangri, and sweet Mawa Kachori.",
    festival: "Pushkar Camel Fair, Gangaur, Teej, and Desert Festival.",
    history: "A legacy of legendary Rajput rulers, Mewar and Marwar dynasties, and legendary tales of courage and honor.",
    stories: "The folklore of Dhola Maru, legends of Maharana Pratap, and the spiritual compositions of Mirabai."
  },
  "KL": {
    culture: "Known as 'God's Own Country', Kerala's culture is a harmonious blend of Dravidian traditions, maritime exchanges, and lush nature.",
    art: "Kathakali classical dance-drama, Koodiyattam temple theater, and Mohiniyattam.",
    craft: "Aranmula Metal Mirrors, Coir products, Coconut Shell crafts, and Balaramapuram handloom sarees.",
    architecture: "Traditional wooden Nalukettu homesteads, sloping roofs built to withstand monsoons, and historic temples.",
    food: "Kerala Sadya served on banana leaves, Appam with Stew, Karimeen Pollichathu, and Malabar Parotta.",
    festival: "Onam harvest festival, Vishu, and Thrissur Pooram featuring majestic elephant processions.",
    history: "Ancient spice trading hub with Roman, Arab, and Chinese exchanges; rules of Travancore and Chera dynasties.",
    stories: "The origin myth of Parasurama reclaiming Kerala from the sea, and folklore of Kayamkulam Kochunni."
  },
  "UP": {
    culture: "Uttar Pradesh is the spiritual heartland of India, shaped by the sacred rivers Ganga and Yamuna and ancient philosophical traditions.",
    art: "Kathak classical dance, Awadhi Thumri music, and Mughal-inspired paintings.",
    craft: "Chikan Embroidery of Lucknow, Banarasi Silk Weaving, Brassware of Moradabad, and Glassware of Firozabad.",
    architecture: "The Taj Mahal, Bara Imambara's architectural maze, and the ghats of Varanasi.",
    food: "Lucknowi Biryani, Galouti Kebabs, Banarasi Tamatar Chaat, and Petha of Agra.",
    festival: "Kumbh Mela (the world's largest spiritual gathering), Lathmar Holi of Barsana, and Dev Deepawali.",
    history: "The cradle of Buddhism, Hinduism, and major empires including the Mauryas, Guptas, and Mughals.",
    stories: "The epics of Ramayana and Mahabharata, tales of Kabir, and the royal legends of Wajid Ali Shah."
  },
  "MH": {
    culture: "Maharashtra's culture represents a proud history of Maratha warriors, lively folk performances, and rich spiritual literature.",
    art: "Warli Tribal Paintings and Lavani folk dance-music.",
    craft: "Paithani Silk Sarees, Kolhapuri Leather Chappals, and Bidriware metal craft.",
    architecture: "Ellora and Ajanta rock-cut caves, Maratha hill forts (Raigad, Pratapgad), and Victorian Gothic structures in Mumbai.",
    food: "Puran Poli, Vada Pav, Misal Pav, Shrikhand, and Konkani Seafood.",
    festival: "Ganesh Chaturthi celebrated with grand public Dhol-Tasha processions, and Shivaji Jayanti.",
    history: "The establishment of Hindavi Swarajya by Chhatrapati Shivaji Maharaj and the rule of the Peshwas.",
    stories: "Folklore of Sant Dnyaneshwar and Sant Tukaram, and legendary battles of Sinhagad."
  }
};

export async function generateStaticParams() {
  const states = await prisma.state.findMany({
    where: { isActive: true }
  });
  return states.map((st) => ({
    code: st.code.toLowerCase()
  }));
}

export default async function StateDetailPage({
  params
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params;
  const codeUpper = code.toUpperCase();

  // Fetch state, districts, and linked products
  const state = await prisma.state.findUnique({
    where: { code: codeUpper },
    include: {
      districts: {
        where: { isActive: true },
        include: {
          products: {
            where: { isActive: true },
            include: { images: true },
            take: 4
          }
        }
      }
    }
  });

  if (!state) {
    notFound();
  }

  // Fetch map asset URL from database
  const mapAsset = await prisma.stateMapAsset.findUnique({
    where: { stateCode: codeUpper }
  });

  // Load custom profile or default placeholder
  const profile = culturalProfiles[codeUpper] || {
    culture: `The culture of ${state.name} represents a unique regional heritage, enriched by local community traditions, dialects, and celebrations.`,
    art: `Traditional folk drawings, paintings, and performing arts unique to ${state.name}.`,
    craft: `Indigenous handicraft styles, handloom weaves, and artisan practices passed down through generations.`,
    architecture: `Historical monuments, sacred shrines, and regional construction designs reflecting the climate and history.`,
    food: `Authentic regional recipes, traditional spices, and popular local delicacies.`,
    festival: `Local harvest celebrations, temple festivals, and community fairs that bring the region to life.`,
    history: `Ancient roots, local kingdoms, and historical milestones under the Vocal for Local initiative.`,
    stories: `Spiritual legends, local folklore, and inspirational stories of native artisan communities.`
  };

  const allProducts = state.districts.flatMap(d => d.products);

  return (
    <div className="min-h-screen bg-[#FAF5EE] text-[#3D1E16] pb-16">
      {/* Dynamic Header Banner */}
      <div className="bg-gradient-to-b from-[#3D1E16] to-[#25120D] text-[#FAF5EE] py-12 px-4 md:px-8 border-b border-[#C09355]/30 relative overflow-hidden">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-4">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#C09355] uppercase tracking-wider hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Region Map Explorer
            </Link>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="bg-[#B56D3E] text-white font-mono font-bold text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {state.code}
                </span>
                <span className="text-xs uppercase tracking-widest text-[#C09355] font-extrabold">State Profile</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-black uppercase tracking-wide">
                {state.name}
              </h1>
            </div>
            <p className="max-w-xl text-sm text-gray-300 leading-relaxed font-serif text-justify">
              Explore the rich civilizational roots, legendary artisan crafts, and native One District One Product (ODOP) specialties of {state.name}.
            </p>
          </div>

          {/* Interactive Bounding Box Card with Map Outline */}
          <div className="w-56 h-56 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md p-6 flex flex-col items-center justify-center relative group shadow-2xl">
            {mapAsset ? (
              <img 
                src={mapAsset.imageUrl} 
                alt={`${state.name} map outline`} 
                className="w-full h-full object-contain filter invert opacity-90 transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="text-center text-xs text-gray-400">
                <Compass className="w-10 h-10 mx-auto text-[#C09355] mb-2 animate-pulse" />
                Map Coming Soon
              </div>
            )}
            <div className="absolute bottom-3 text-[10px] font-mono font-bold text-[#C09355]/70 uppercase tracking-widest">
              Geographic Registry
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: District List & ODOP Registry (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FDFBF7] rounded-3xl border border-[#C09355]/20 p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="font-serif font-bold text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#B56D3E]" />
                Districts & ODOP List
              </h2>
              <span className="text-xs font-bold text-[#B56D3E] bg-[#B56D3E]/5 px-2.5 py-0.5 rounded-full">
                {state.districts.length} Districts
              </span>
            </div>

            <div className="space-y-3.5 max-h-[580px] overflow-y-auto pr-1">
              {state.districts.map(dist => (
                <div 
                  key={dist.id} 
                  className="p-3.5 bg-white border border-gray-100 rounded-2xl hover:border-[#C09355]/30 transition-all hover:shadow-sm group"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-sm text-[#3D1E16] group-hover:text-[#B56D3E] transition-colors">{dist.name}</span>
                    {dist.odopProduct && (
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#B56D3E] bg-[#B56D3E]/5 px-2 py-0.5 rounded-md border border-[#B56D3E]/10 flex items-center gap-1 shrink-0">
                        <Award className="w-3 h-3 text-[#B56D3E]" /> ODOP
                      </span>
                    )}
                  </div>
                  {dist.odopProduct && (
                    <p className="text-xs text-gray-500 mt-1.5 font-serif font-medium flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#C09355]" /> {dist.odopProduct}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Cultural Explorer & Catalog (Span 7) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Detailed Cultural Tabs Section */}
          <div className="bg-[#FDFBF7] rounded-3xl border border-[#C09355]/20 p-6 shadow-md space-y-6">
            <h2 className="font-serif font-bold text-lg border-b border-gray-100 pb-3 flex items-center gap-2 uppercase tracking-wide">
              <Sparkles className="w-5 h-5 text-[#B56D3E]" />
              Civilizational Heritage Explorer
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 p-4 bg-white border border-gray-100 rounded-2xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B56D3E]">Artistic Expression</span>
                <h3 className="font-serif font-bold text-sm text-[#3D1E16]">Traditional Art</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-serif text-justify">{profile.art}</p>
              </div>

              <div className="space-y-1.5 p-4 bg-white border border-gray-100 rounded-2xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B56D3E]">Master Crafts</span>
                <h3 className="font-serif font-bold text-sm text-[#3D1E16]">Handicrafts & Handlooms</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-serif text-justify">{profile.craft}</p>
              </div>

              <div className="space-y-1.5 p-4 bg-white border border-gray-100 rounded-2xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B56D3E]">Heritage Marvels</span>
                <h3 className="font-serif font-bold text-sm text-[#3D1E16]">Classical Architecture</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-serif text-justify">{profile.architecture}</p>
              </div>

              <div className="space-y-1.5 p-4 bg-white border border-gray-100 rounded-2xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B56D3E]">Indigenous Flavors</span>
                <h3 className="font-serif font-bold text-sm text-[#3D1E16]">Local Food & Cuisine</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-serif text-justify">{profile.food}</p>
              </div>

              <div className="space-y-1.5 p-4 bg-white border border-gray-100 rounded-2xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B56D3E]">Local Celebrations</span>
                <h3 className="font-serif font-bold text-sm text-[#3D1E16]">Festivals & Fairs</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-serif text-justify">{profile.festival}</p>
              </div>

              <div className="space-y-1.5 p-4 bg-white border border-gray-100 rounded-2xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B56D3E]">Ancient Origins</span>
                <h3 className="font-serif font-bold text-sm text-[#3D1E16]">Dynasties & History</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-serif text-justify">{profile.history}</p>
              </div>
            </div>

            <div className="p-4 bg-amber-500/5 border border-[#C09355]/20 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B56D3E] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Oral Traditions & Stories
              </span>
              <p className="text-xs text-gray-700 leading-relaxed font-serif text-justify italic">
                {profile.stories}
              </p>
            </div>
          </div>

          {/* Regional Products Catalog */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-serif font-bold text-lg flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#B56D3E]" />
                Regional Heritage Products
              </h2>
              <Link 
                href={`/products?state=${state.code}`}
                className="text-xs text-[#B56D3E] font-bold uppercase hover:underline"
              >
                View Full Catalog →
              </Link>
            </div>

            {allProducts.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-3xl border border-gray-200 text-xs text-gray-400">
                No active products loaded under this region yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allProducts.slice(0, 4).map(prod => (
                  <div 
                    key={prod.id} 
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group h-full"
                  >
                    <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden border-b border-gray-100">
                      {prod.images && prod.images.length > 0 ? (
                        <img 
                          src={prod.images[0].url} 
                          alt={prod.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 bg-gray-100">
                          No Image Available
                        </div>
                      )}
                    </div>
                    <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
                      <div>
                        <h3 className="font-serif font-bold text-xs text-[#3D1E16] group-hover:text-[#B56D3E] transition-colors leading-snug line-clamp-1">
                          {prod.name}
                        </h3>
                        <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">{prod.description}</p>
                      </div>
                      <div className="flex justify-between items-center border-t border-gray-50 pt-2">
                        <span className="font-serif font-extrabold text-xs text-[#3D1E16]">
                          ₹{prod.price.toLocaleString()}
                        </span>
                        <Link 
                          href={`/products/${prod.slug}`}
                          className="text-[9px] font-bold uppercase tracking-wider bg-[#B56D3E] hover:bg-[#9B5A2F] text-white px-2.5 py-1 rounded-md transition-all"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
