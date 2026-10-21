import type { MetadataRoute } from "next";
import { informationPages, informationHref } from "@/lib/informationPages";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://somaatlas.vn";
  const locales = ["vi", "en", "zh"];
  const pages = ["", "/quiz", "/tro-ly", "/cu-chi", "/thu-vien", "/dieu-khoan", "/chinh-sach", "/nguon-du-lieu", ...Object.entries(informationPages).map(([slug, page]) => informationHref(slug, page))];
  return locales.flatMap((locale) =>
    pages.map((p) => ({ url: `${base}/${locale}${p}`, lastModified: new Date() })),
  );
}
