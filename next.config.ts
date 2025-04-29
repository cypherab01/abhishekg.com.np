import type { NextConfig } from "next";

const manifestHeaders = [
  {
    key: "Access-Control-Allow-Origin",
    value: "*",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  async headers() {
    return [{ source: "/site.webmanifest", headers: manifestHeaders }];
  },
};

export default nextConfig;
