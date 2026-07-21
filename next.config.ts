import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.STATIC_EXPORT === "true" ? "export" : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
