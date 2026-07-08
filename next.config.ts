import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.ufs.sh" },
      { protocol: "https", hostname: "utfs.io" },
    ],
  },
  outputFileTracingIncludes: {
    "/api/resume": ["./lib/resume/assets/*.ttf"],
    "/api/resume/preview": ["./lib/resume/assets/*.ttf"],
  },
};

export default nextConfig;
