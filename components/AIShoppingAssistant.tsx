"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, User, RefreshCw } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

const KNOWLEDGE_BASE = [
  {
    keywords: ["gift", "present", "recommend"],
    answer: "For a premium gift, I highly recommend our **Blue Pottery Vases (Jaipur)** or **Banarasi Silk Stoles (Varanasi)**. They represent authentic GI-tagged crafts, come with an official artisan card, and are packaged beautifully in heritage boxes!"
  },
  {
    keywords: ["delivery", "shipping", "days"],
    answer: "We ship nationwide across India! Standard delivery takes **3 to 5 business days**. Express shipping is available for major cities (1-2 days). All packages are fully insured against transit damage."
  },
  {
    keywords: ["return", "refund", "exchange"],
    answer: "We offer a hassle-free **7-day return policy** on all craft items if they are undamaged and in original packaging. To initiate a return, visit your Profile dashboard or contact support."
  },
  {
    keywords: ["paithani", "silk", "saree"],
    answer: "Paithani silk sarees originate from the town of Paithan in Aurangabad. They are hand-woven in fine silk with borders of pure gold zari, traditionally depicting nature-inspired motifs like peacock (mor) and lotus. They date back over 2000 years to the Satavahana dynasty."
  },
  {
    keywords: ["odop", "one district"],
    answer: "ODOP stands for **One District One Product**, an initiative by the Government of India to identify, brand, and promote one unique heritage product from each district. Every item sold on Cultural Clutch is officially certified under the ODOP and Vocal for Local framework."
  },
  {
    keywords: ["brass", "diya", "moradabad"],
    answer: "Moradabad in Uttar Pradesh is famously known as the 'Pital Nagri' (Brass City). Our brass diyas and kitchenware are hand-engraved by brass smiths using traditional chiseling (Nakshi) work that has been practiced for over 400 years."
  }
];

export default function AIShoppingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Namaste! 🙏 I am your Cultural Clutch Heritage Assistant. How can I help you discover India's district legacy or assist with your order today?"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    // Add user message
    const userMsg: Message = { id: `user-${Date.now()}`, sender: "user", text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Dynamic matching response
    setTimeout(() => {
      let aiText = "I would be happy to help you with that! As a heritage assistant, I can explain craft history, ODOP products, shipping timelines, or suggest a gift. Could you please specify which craft or region you are curious about?";
      
      const query = trimmed.toLowerCase();
      for (const entry of KNOWLEDGE_BASE) {
        if (entry.keywords.some(k => query.includes(k))) {
          aiText = entry.answer;
          break;
        }
      }

      const aiMsg: Message = { id: `ai-${Date.now()}`, sender: "ai", text: aiText };
      setMessages(prev => [...prev, aiMsg]);
      setLoading(false);
    }, 1000);
  };

  const handleChipClick = (topicText: string) => {
    handleSend(topicText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Chat window */}
      {isOpen && (
        <div className="w-[340px] h-[460px] bg-[#FDFBF7] border border-[#C09355]/30 rounded-3xl shadow-2xl flex flex-col justify-between mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#3D1E16] to-[#25120D] text-[#FAF5EE] p-4 flex items-center justify-between border-b border-[#C09355]/30">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C09355] animate-pulse" />
              <span className="font-serif font-black text-sm uppercase tracking-wide">Heritage Assistant</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-full text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Chat Feed */}
          <div ref={feedRef} className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex gap-2 items-start ${m.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                  m.sender === "user" 
                    ? "bg-[#B56D3E]/10 border-[#B56D3E]/20 text-[#B56D3E]" 
                    : "bg-[#3D1E16] border-[#C09355]/20 text-[#FAF5EE]"
                }`}>
                  {m.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                </div>

                <div 
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                    m.sender === "user" 
                      ? "bg-[#3D1E16] text-[#FAF5EE] rounded-tr-none" 
                      : "bg-[#FAF5EE] border border-gray-150 text-gray-700 rounded-tl-none font-serif text-justify"
                  }`}
                  dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
                />
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-start">
                <div className="w-6 h-6 rounded-full bg-[#3D1E16] border border-[#C09355]/20 text-[#FAF5EE] flex items-center justify-center shrink-0">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-[#FAF5EE] border border-gray-150 p-2.5 rounded-2xl rounded-tl-none text-[10px] text-gray-400">
                  Searching archives...
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Suggestion Chips */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5 justify-start">
              {[
                "Suggest a gift 🎁",
                "Paithani Silk history 🧶",
                "Explain ODOP Verified 📜",
                "Check delivery rules 🚚"
              ].map(chip => (
                <button
                  key={chip}
                  onClick={() => handleChipClick(chip)}
                  className="px-2.5 py-1 bg-white border border-[#C09355]/15 hover:border-[#C09355] rounded-full text-[9px] font-bold text-gray-600 transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input field */}
          <div className="p-3 border-t border-gray-100 bg-white flex gap-2">
            <input
              type="text"
              placeholder="Ask about craft history, ODOP, shipping..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              className="flex-grow px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#B56D3E] text-gray-700"
            />
            <button
              onClick={() => handleSend(input)}
              className="p-2 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-xl transition-colors shadow-sm shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#B56D3E] hover:bg-[#9B5A2F] text-[#FAF5EE] rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group relative border border-[#C09355]/40"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full border border-white" />
          </>
        )}
      </button>
    </div>
  );
}
