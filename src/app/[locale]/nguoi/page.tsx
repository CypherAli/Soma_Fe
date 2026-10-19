
import { ContentSurface } from "@/components/content/ContentProvider";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import HumanPage from "@/components/home/HumanPage";
import type { Loc } from "@/lib/homeContent";
import "../../home.css";

export default async function Nguoi({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Loc;

  return <ContentSurface scope="src/app/[locale]/nguoi/page.tsx"><HumanPage locale={loc} /></ContentSurface>;
}
