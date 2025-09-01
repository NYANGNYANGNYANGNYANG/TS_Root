// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 필요 시: Docker 배포면 아래 옵션 고려
  // output: "standalone",
};

export default nextConfig;
