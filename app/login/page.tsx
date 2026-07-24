"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Info, Check, ShieldAlert, ArrowLeft, Mail, Lock, User } from "lucide-react";
import Link from "next/link";

const SEEDED_EMPLOYEES = [
  { id: "ADM-ABHISHEK", role: "Super Admin", email: "owner@auraic.in", pass: "AuraicOwner2026", dept: "Administration" },
  { id: "SAL-ROHIT", role: "Sales Manager", email: "rohit.sales@auraic.in", pass: "AuraicEmp2026", dept: "Sales" },
  { id: "FIN-AMIT", role: "Finance Manager", email: "amit.finance@auraic.in", pass: "AuraicEmp2026", dept: "Finance" },
  { id: "HR-SNEHA", role: "HR Manager", email: "sneha.hr@auraic.in", pass: "AuraicEmp2026", dept: "Human Resource" },
  { id: "LOG-RAJ", role: "Logistics Manager", email: "raj.logistics@auraic.in", pass: "AuraicEmp2026", dept: "Logistics" },
  { id: "SUP-ABHISHEK", role: "Support Manager", email: "abhishek.support@auraic.in", pass: "AuraicEmp2026", dept: "Customer Support" },
  { id: "ADM-VIKAS", role: "Admin Specialist", email: "vikas.admin@auraic.in", pass: "AuraicEmp2026", dept: "Administration" }
];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";

  // Mode switcher: login, signup, forgot
  const [viewMode, setViewMode] = useState<"login" | "signup" | "forgot">("login");

  // Sign In inputs (can be email or employee ID e.g. SAL-ROHIT)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign Up inputs
  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Forgot Password input (email or Employee ID)
  const [forgotEmail, setForgotEmail] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Prefill helper
  const handlePrefill = (emailOrId: string, pass: string) => {
    setEmail(emailOrId);
    setPassword(pass);
    setError(null);
    setSuccessMessage("Credentials loaded. Click Sign In to verify.");
  };

  // Handle Login form submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email, // email field carries either email or employeeId
        password,
        callbackUrl
      });

      if (res?.error) {
        throw new Error(res.error || "Authentication failed. Check credentials or suspension status.");
      }

      setSuccessMessage("Login successful! Loading your department dashboard...");
      
      // Dynamic Redirect based on logged in user session
      setTimeout(() => {
        router.push(callbackUrl);
        setTimeout(() => {
          window.location.reload();
        }, 150);
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Signup/Register form submission
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !signupEmail || !signupPassword) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: signupEmail,
          password: signupPassword,
          roleId: "customer-default-role-id" // Placeholder role, handled by backend
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed.");

      setSuccessMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        setViewMode("login");
        setEmail(signupEmail);
        setPassword(signupPassword);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password submission (Saves reset request to database)
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/admin/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "FORGOT_REQUEST",
          email: forgotEmail
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit request.");

      setSuccessMessage("Password reset request submitted successfully to Admin. Lock state locked until approved.");
      setForgotEmail("");
    } catch (err: any) {
      setError(err.message || "Error submitting reset request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 text-[#2E1E1A]">
      <div className="max-w-md w-full bg-[#FDFBF7] border border-gray-200/80 p-8 rounded-3xl shadow-lg space-y-6">
        
        {/* Logo & Headline */}
        <div className="text-center space-y-3">
          <img
            src="/logo.jpg"
            alt="Cultural Clutch Logo"
            className="w-16 h-16 rounded-full border border-[#C09355]/25 mx-auto object-cover shadow-sm"
          />
          <div>
            <h1 className="text-2xl font-serif text-[#3D1E16] font-bold tracking-wide">
              {viewMode === "login" && "Cultural Clutch ERP Access"}
              {viewMode === "signup" && "Create Customer Account"}
              {viewMode === "forgot" && "Recover Password"}
            </h1>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mt-1 font-sans">
              Indian Heritage & ODOP Marketplace
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3.5 text-red-700 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Success Notification */}
        {successMessage && (
          <div className="flex items-start gap-2.5 bg-green-50 border border-green-200 rounded-xl p-3.5 text-green-700 text-xs font-semibold">
            <Check className="w-4 h-4 shrink-0 mt-0.5" />
            <div>{successMessage}</div>
          </div>
        )}

        {/* VIEW 1: SIGN IN VIEW */}
        {viewMode === "login" && (
          <div className="space-y-4">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Email Address or Employee ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. SAL-ROHIT or owner@auraic.in"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 text-[#3D1E16]"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-450" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setViewMode("forgot"); setError(null); setSuccessMessage(null); }}
                    className="text-[11px] text-[#B56D3E] font-bold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 text-[#3D1E16]"
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-455" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-50 uppercase tracking-wider"
              >
                {loading ? "Verifying Credentials..." : "Sign In"}
              </button>
            </form>
          </div>
        )}

        {/* VIEW 2: REGISTER / SIGN UP VIEW */}
        {viewMode === "signup" && (
          <div className="space-y-4">
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 text-[#3D1E16]"
                  />
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-450" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="e.g. aarav@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 text-[#3D1E16]"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-455" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 text-[#3D1E16]"
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-455" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-50 uppercase tracking-wider"
              >
                {loading ? "Registering..." : "Create Account"}
              </button>
            </form>

            <div className="border-t border-gray-150 pt-3">
              <button
                onClick={() => setViewMode("login")}
                className="w-full py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: FORGOT PASSWORD VIEW */}
        {viewMode === "forgot" && (
          <div className="space-y-4">
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Email Address or Employee ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter email or employee ID e.g. SAL-ROHIT"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B56D3E]/20 text-[#3D1E16]"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-455" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#B56D3E] hover:bg-[#9B5A2F] text-white rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-50 uppercase tracking-wider"
              >
                {loading ? "Submitting request..." : "Submit Reset Request"}
              </button>
            </form>

            <button
              onClick={() => { setViewMode("login"); setError(null); setSuccessMessage(null); }}
              className="w-full py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </button>
          </div>
        )}

        {/* Real Seeded Employee IDs Tip Panel */}
        {viewMode === "login" && (
          <div className="bg-[#FAF5EE] border border-[#C09355]/20 rounded-2xl p-4 text-[11px] leading-relaxed text-gray-600 space-y-2.5">
            <div className="flex items-center gap-1.5 font-bold text-[#3D1E16] uppercase tracking-wider text-xs border-b border-gray-200/50 pb-1.5">
              <Info className="w-4 h-4 text-[#B56D3E]" /> Seeded Active Employee IDs
            </div>
            
            <p className="text-[10px] text-gray-500">
              Click any active employee profile below to prefill their database credentials:
            </p>

            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
              {SEEDED_EMPLOYEES.map((emp) => (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => handlePrefill(emp.id, emp.pass)}
                  className="w-full text-left p-2 bg-white hover:bg-amber-50 border border-gray-150 hover:border-[#B56D3E]/30 rounded-xl transition-all flex items-center justify-between text-[10px] cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-[#3D1E16]">{emp.id}</span>
                    <span className="block text-[8px] text-gray-400 font-medium uppercase tracking-wider">{emp.role} • {emp.dept}</span>
                  </div>
                  <span className="font-mono text-[9px] text-[#B56D3E] font-semibold bg-[#FAF5EE] px-1.5 py-0.5 rounded-md border border-gray-200">
                    {emp.pass}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#B56D3E] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
