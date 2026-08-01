import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `pg` resolves its optional native binding (`pg-native`) at runtime, which
  // the bundler cannot statically follow — keep it as a plain Node require.
  serverExternalPackages: ["pg"],
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
