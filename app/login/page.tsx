"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Info, Check, ShieldAlert, ArrowLeft, Mail, Lock, User } from "lucide-react";
import Link from "next/link";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Mode switcher: login, signup, forgot
  const [viewMode, setViewMode] = useState<"login" | "signup" | "forgot">("login");

  // Sign In inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign Up inputs
  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Forgot Password input
  const [forgotEmail, setForgotEmail] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle Login form submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Detect if running on static serve (mock authentication fallback)
    let isStaticMode = false;
    try {
      const sessionRes = await fetch("/api/auth/session");
      if (!sessionRes.ok || sessionRes.headers.get("content-type")?.includes("text/html")) {
        isStaticMode = true;
      }
    } catch (err) {
      isStaticMode = true;
    }
    console.log("[DEBUG LOGIN] isStaticMode:", isStaticMode);

    if (isStaticMode) {
      if (email === "owner@auraic.in" && password === "AuraicOwner2026") {
        const mockUser = {
          name: "Owner User",
          email: "owner@auraic.in",
          role: "Owner"
        };
        localStorage.setItem("mock_session", JSON.stringify(mockUser));
        setSuccessMessage("Login successful! Redirecting...");
        setTimeout(() => {
          router.push(callbackUrl);
          setTimeout(() => {
            window.location.reload();
          }, 300);
        }, 1000);
        return;
      } else if (email === "aarav@gmail.com" && password === "AuraicCust2026") {
        const mockUser = {
          name: "Aarav Sharma",
          email: "aarav@gmail.com",
          role: "Customer"
        };
        localStorage.setItem("mock_session", JSON.stringify(mockUser));
        setSuccessMessage("Login successful! Redirecting...");
        setTimeout(() => {
          router.push(callbackUrl);
          setTimeout(() => {
            window.location.reload();
          }, 300);
        }, 1000);
        return;
      } else {
        setError("Invalid credentials for static simulation.");
        setLoading(false);
        return;
      }
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl
      });

      if (res?.error) {
        throw new Error(res.error || "Login failed");
      }

      setSuccessMessage("Login successful! Redirecting...");
      setTimeout(() => {
        router.push(callbackUrl);
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }, 1000);
    } catch (err: any) {
      setError(err.message);
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
      // Create mock registration in local storage and sign in
      const mockNewUser = {
        name,
        email: signupEmail,
        role: "Customer"
      };
      localStorage.setItem("mock_session", JSON.stringify(mockNewUser));
      setSuccessMessage("Account created successfully! Auto-signing you in...");
      
      // Auto-redirect
      setTimeout(() => {
        router.push(callbackUrl);
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password submission
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Simulate OTP / reset link dispatch
    setTimeout(() => {
      setSuccessMessage(`Password recovery link has been sent to ${forgotEmail}! Please check your inbox.`);
      setForgotEmail("");
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 text-[#2E1E1A]">
      
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
              {viewMode === "login" && "Sign In to Cultural Clutch"}
              {viewMode === "signup" && "Create Your Account"}
              {viewMode === "forgot" && "Recover Password"}
            </h1>
            <p className="text-xs text-gray-550 font-semibold uppercase tracking-widest mt-1 font-sans">
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
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. customer@domain.com"
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

            <div className="border-t border-gray-100 pt-3">
              <p className="text-center text-xs text-gray-500 font-semibold">
                New to Cultural Clutch?{" "}
                <button
                  type="button"
                  onClick={() => { setViewMode("signup"); setError(null); setSuccessMessage(null); }}
                  className="text-[#B56D3E] font-bold hover:underline"
                >
                  Register Now
                </button>
              </p>
            </div>
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

            <div className="border-t border-gray-100 pt-3">
              <p className="text-center text-xs text-gray-500 font-semibold">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => { setViewMode("login"); setError(null); setSuccessMessage(null); }}
                  className="text-[#B56D3E] font-bold hover:underline"
                >
                  Sign In here
                </button>
              </p>
            </div>
          </div>
        )}

        {/* VIEW 3: FORGOT PASSWORD VIEW */}
        {viewMode === "forgot" && (
          <div className="space-y-4">
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your email to receive recovery instructions"
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
                {loading ? "Sending link..." : "Send Recovery Link"}
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

        {/* Local Test Accounts Credentials Tip (Only show in login mode) */}
        {viewMode === "login" && (
          <div className="bg-[#FAF5EE] border border-[#C09355]/20 rounded-2xl p-4 text-[11px] leading-relaxed text-gray-655 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-[#3D1E16] uppercase tracking-wider text-xs">
              <Info className="w-4 h-4 text-[#B56D3E]" /> Seeding Test Credentials
            </div>
            <div>
              <span className="font-bold text-gray-600">Owner Access (Full Control):</span>
              <div className="font-mono mt-0.5 bg-white/70 border border-gray-150 p-1.5 rounded-lg select-all text-[10px]">
                Email: owner@auraic.in <br /> Password: AuraicOwner2026
              </div>
            </div>
            <div>
              <span className="font-bold text-gray-600">Customer Access (Mock Checkout):</span>
              <div className="font-mono mt-0.5 bg-white/70 border border-gray-150 p-1.5 rounded-lg select-all text-[10px]">
                Email: aarav@gmail.com <br /> Password: AuraicCust2026
              </div>
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
