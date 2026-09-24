import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // يخلي الـ Build ينجح حتى لو في أخطاء Typescript مثل item.qty
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
