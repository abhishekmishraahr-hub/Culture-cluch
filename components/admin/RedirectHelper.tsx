"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectHelper({ to }: { to: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(to);
  }, [router, to]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF5EE] dark:bg-[#1c0f0c]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#B56D3E] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-gray-500 font-bold uppercase tracking-widest animate-pulse">
          Redirecting to {to.split("?")[0]}...
        </span>
      </div>
    </div>
  );
}
