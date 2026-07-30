import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "example.com" },
    ],
  },
};

export default nextConfig;
