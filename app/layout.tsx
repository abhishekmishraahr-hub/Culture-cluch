import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import Link from "next/link";

import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Cultural Clutch - Celebrate India's District Heritage",
  description: "Certified traditional Indian craftsmanship and agricultural specialties, supporting One District One Product (ODOP) and Vocal for Local.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased bg-[#FAF5EE] dark:bg-[#1c0f0c]" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF5EE] dark:bg-[#1c0f0c] font-sans transition-colors duration-300">
        <AuthProvider>
          <LanguageProvider>
            <CartProvider>
              <Header />
              <PageTransition>
                <main className="flex-grow bg-inherit">{children}</main>
              </PageTransition>
              <Footer />
            </CartProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
