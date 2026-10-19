
import { ContentSurface } from "@/components/content/ContentProvider";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Loc } from "@/lib/homeContent";
import HomeNav from "@/components/home/HomeNav";
import HomeFooter from "@/components/home/HomeFooter";
import IconSprite from "@/components/home/IconSprite";
import SiteSearchResults from "@/components/search/SiteSearchResults";
import "../../home.css";
import "@/components/search/site-search.css";

export default async function SearchPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: raw } = await params;
  const locale = (hasLocale(routing.locales, raw) ? raw : routing.defaultLocale) as Loc;
  setRequestLocale(locale);
  const values = await searchParams;
  const query = typeof values.q === "string" ? values.q.trim().slice(0, 500) : "";
  return <ContentSurface scope="src/app/[locale]/tim-kiem/page.tsx"><div className="bd search-page">
    <IconSprite /><HomeNav />
    <SiteSearchResults key={query} locale={locale} initialQuery={query} />
    <HomeFooter locale={locale} />
  </div></ContentSurface>;
}
