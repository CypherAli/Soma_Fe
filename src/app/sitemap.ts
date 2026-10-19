import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://somaatlas.vn";
  const locales = ["vi", "en", "zh"];
  const pages = ["", "/quiz", "/tro-ly", "/cu-chi", "/thu-vien", "/dieu-khoan", "/chinh-sach"];
  return locales.flatMap((locale) =>
    pages.map((p) => ({ url: `${base}/${locale}${p}`, lastModified: new Date() })),
  );
}
