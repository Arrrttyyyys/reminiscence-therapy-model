import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // For client-side, alias canvas to false for face-api.js
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
      };
    }
    return config;
  },
  // Turbopack config - empty to allow webpack
  turbopack: {},
};

export default nextConfig;
