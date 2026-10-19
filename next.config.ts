import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Xuất bản standalone để Dockerfile chỉ copy những gì server cần.
  output: "standalone",
  // next-intl canonicalizes locale prefixes from the original public URL.
  // Normalizing a prerendered internal /vi path can redirect back to itself.
  skipProxyUrlNormalize: true,
  // Cho phép import file model 3D (.glb/.gltf) và Draco sau này.
  transpilePackages: ["three"],
  // Tắt biểu tượng dev của Next (chấm "N" góc dưới trái).
  devIndicators: false,
  // TẠM tắt để kiểm chứng nghi vấn Canvas kẹt 300x150 do StrictMode double-mount.
  reactStrictMode: false,
};

// Production verification must not replace a running dev server's chunks.
const configureNext = (phase: string) => withNextIntl({
  ...nextConfig,
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
  // The running dev server rewrites these generated types during a build.
  typescript: { tsconfigPath: phase === PHASE_DEVELOPMENT_SERVER ? "tsconfig.json" : "tsconfig.build.json" },
});
export default configureNext;
