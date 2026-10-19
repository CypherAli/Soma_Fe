import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Soma Atlas — Atlas giải phẫu 3D",
    short_name: "Soma Atlas",
    start_url: "/vi",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f8a7c",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
