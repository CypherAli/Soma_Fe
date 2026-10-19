
import { ContentSurface } from "@/components/content/ContentProvider";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import HomePage from "@/components/home/HomePage";
import type { Loc } from "@/lib/homeContent";
import "../home.css";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Loc;

  return <ContentSurface scope="src/app/[locale]/page.tsx"><HomePage locale={loc} /></ContentSurface>;
}
