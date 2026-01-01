import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed 'output: export' to enable API routes for admin dashboard
  // Netlify supports Next.js server-side rendering natively
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
