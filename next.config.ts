import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // eslint: with Next 16 this property is no longer part of NextConfig.
  // Avoid TypeScript error by removing or using app-specific linting configuration.
};

export default nextConfig;
