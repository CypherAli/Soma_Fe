import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Cho phép import file model 3D (.glb/.gltf) và Draco sau này.
  transpilePackages: ["three"],
};

export default withNextIntl(nextConfig);
