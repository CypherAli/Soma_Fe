import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Cho phép import file model 3D (.glb/.gltf) và Draco sau này.
  transpilePackages: ["three"],
  // Tắt biểu tượng dev của Next (chấm "N" góc dưới trái).
  devIndicators: false,
  // TẠM tắt để kiểm chứng nghi vấn Canvas kẹt 300x150 do StrictMode double-mount.
  reactStrictMode: false,
};

export default withNextIntl(nextConfig);
