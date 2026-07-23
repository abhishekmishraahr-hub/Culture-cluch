import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#FAF5EE] flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white border border-[#C09355]/20 rounded-3xl shadow-xl p-10 text-center">
        <ShieldAlert className="mx-auto mb-6 w-14 h-14 text-[#B56D3E]" />
        <h1 className="text-3xl font-serif font-black text-[#3D1E16] mb-4">Access Denied</h1>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          You do not have sufficient permissions to access this page. Please sign in with an authorized admin role or contact system support.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/login"
            className="px-5 py-3 rounded-xl bg-[#B56D3E] text-white text-sm font-bold uppercase tracking-widest shadow-sm hover:bg-[#9B5A2F] transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-[#3D1E16] hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}
