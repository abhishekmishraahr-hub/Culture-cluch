"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSession } from "next-auth/react";

export default function HeroButtons() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const activeSession = await getSession();
        setSession(activeSession);
      } catch (err) {
        console.error("Failed to load user session client-side:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, []);

  const userRole = (session?.user as any)?.role;
  const isAdmin = ["Owner", "Super Admin", "Admin"].includes(userRole || "");

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
      <Link
        href="/products"
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-xl shadow-lg transition-all font-semibold"
      >
        Explore the Catalog <ArrowRight className="w-4 h-4" />
      </Link>
      {!loading && isAdmin && (
        <Link
          href="/admin/dashboard"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all font-semibold"
        >
          Access Admin Dashboard
        </Link>
      )}
    </div>
  );
}
