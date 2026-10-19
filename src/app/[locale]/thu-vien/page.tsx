
import { ContentSurface } from "@/components/content/ContentProvider";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import LibraryPage from "@/components/library/LibraryPage";
import type { Loc } from "@/lib/homeContent";

export default async function ThuVienPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Loc;

  return <ContentSurface scope="src/app/[locale]/thu-vien/page.tsx"><LibraryPage locale={loc} /></ContentSurface>;
}
