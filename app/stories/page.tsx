import React from "react";
import { prisma } from "@/lib/db";
import { BookOpen, User, Calendar, ArrowRight } from "lucide-react";

export const revalidate = false; // Compile statically at build time

export default async function StoriesPage() {
  const stories = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-[#FAF5EE] py-12 text-[#2E1E1A]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#C09355]/10 text-[#B56D3E] border border-[#C09355]/35 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" /> Cultural Chronicles
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-[#3D1E16] leading-tight">
            Artisan &amp; Craft <span className="italic font-normal text-[#B56D3E]">Stories</span>
          </h1>
          <p className="text-sm text-gray-550 leading-relaxed">
            Delve into the history, ancient methodologies, and inspiring personal narratives of the community craftspeople preserving India&apos;s local heritage.
          </p>
        </div>

        {/* Stories Grid */}
        {stories.length === 0 ? (
          <div className="text-center py-16 bg-[#FDFBF7] border border-gray-200/60 rounded-3xl p-8 max-w-md mx-auto space-y-4 shadow-sm">
            <p className="text-sm text-gray-400 font-medium">No stories published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <div 
                key={story.id} 
                className="bg-[#FDFBF7] border border-gray-200/65 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col h-full"
              >
                
                {/* Visual Image */}
                <div className="aspect-[16/10] bg-gray-105 overflow-hidden relative border-b border-gray-100">
                  <img 
                    src={story.image || "https://images.unsplash.com/photo-1596178060810-72cb62112e75?auto=format&fit=crop&w=600&q=80"} 
                    alt={story.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-[#3D1E16]/90 text-[#FAF5EE] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md backdrop-blur-sm">
                    Verified Heritage
                  </div>
                </div>

                {/* Metadata & Title */}
                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-[#B56D3E]" /> {story.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#B56D3E]" /> {new Date(story.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>

                    <h2 className="text-lg font-serif font-bold text-[#3D1E16] leading-snug group-hover:text-[#B56D3E] transition-colors line-clamp-2">
                      {story.title}
                    </h2>

                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                      {story.summary}
                    </p>
                  </div>

                  {/* Read Article action link */}
                  <div className="pt-4 border-t border-gray-100 mt-auto flex items-center justify-between text-xs font-bold text-[#B56D3E] uppercase tracking-wider">
                    <span>Read Chronicle</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
