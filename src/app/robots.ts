import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/vi/gesture-test", "/en/gesture-test", "/zh/gesture-test"] }],
    sitemap: "https://somaatlas.vn/sitemap.xml",
  };
}
