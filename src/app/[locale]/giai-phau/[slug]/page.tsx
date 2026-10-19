
import { ContentSurface } from "@/components/content/ContentProvider";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { categoryData } from "@/lib/exploreContent";
import ExplorePage from "@/components/explore/ExplorePage";
import type { Loc } from "@/lib/homeContent";

export function generateStaticParams() {
  return Object.keys(categoryData).map((slug) => ({ slug }));
}

export default async function GiaiPhauPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Loc;

  const data = categoryData[slug as keyof typeof categoryData];
  if (!data) notFound();

  return <ContentSurface scope="src/app/[locale]/giai-phau/[slug]/page.tsx"><ExplorePage data={data} locale={loc} activeSlug={slug} /></ContentSurface>;
}
