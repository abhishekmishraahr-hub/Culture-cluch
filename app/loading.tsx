"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Sparkles } from "lucide-react";

const LOADING_STATEMENTS = [
  "Loading India's Heritage...",
  "Preparing Cultural Stories...",
  "Exploring Authentic Crafts...",
  "Discovering ODOP Collections..."
];

export default function Loading() {
  const [statementIdx, setStatementIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatementIdx((prev) => (prev + 1) % LOADING_STATEMENTS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF5EE] dark:bg-[#1c0f0c] text-[#2E1E1A] dark:text-[#FAF5EE] overflow-hidden transition-colors duration-300">
      {/* Premium Decorative Mandala Grid Background */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#C09355_1px,transparent_1px),linear-gradient(to_bottom,#C09355_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full border border-[#C09355]/10 opacity-30 animate-pulse pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] rounded-full border-2 border-dashed border-[#C09355]/5 pointer-events-none animate-[spin_120s_linear_infinite]" />

      <div className="space-y-8 flex flex-col items-center text-center relative z-10 px-4">
        {/* Animated Heritage Motif Frame */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Continuous Gold Outer Ring */}
          <motion.div
            className="absolute inset-0 border border-[#C09355]/40 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          />

          {/* Copper Dotted Inner Ring */}
          <motion.div
            className="absolute inset-2 border border-dashed border-[#B56D3E]/60 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          />

          {/* Glowing Center Core */}
          <div className="relative w-16 h-16 bg-[#FAF5EE] dark:bg-[#1c0f0c] rounded-full flex items-center justify-center shadow-lg border border-[#C09355]/20">
            <Compass className="w-7 h-7 text-[#B56D3E] animate-pulse" />
          </div>
        </div>

        {/* Brand and Dynamic Statement */}
        <div className="space-y-3">
          <h3 className="font-serif font-black text-lg tracking-widest text-[#B56D3E] flex items-center gap-2 justify-center italic">
            <Sparkles className="w-4 h-4 text-[#C09355] animate-bounce" />
            Cultural <span className="text-[#3D1E16] dark:text-[#FAF5EE] not-italic">Clutch</span>
          </h3>

          <div className="h-6 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={statementIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="text-xs text-[#7A6A53] dark:text-[#C6BBAA] font-bold uppercase tracking-widest font-sans"
              >
                {LOADING_STATEMENTS[statementIdx]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
