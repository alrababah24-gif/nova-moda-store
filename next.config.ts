import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "ik.imagekit.io" },
    ],
  },
  poweredByHeader: false,
  // Old links (and cached pages) pointed at /products and /cart, which don't exist.
  async redirects() {
    return [
      { source: "/products", destination: "/shop", permanent: false },
      { source: "/cart", destination: "/checkout", permanent: false },
    ];
  },
};

export default nextConfig;
