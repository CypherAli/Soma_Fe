
import { ContentSurface } from "@/components/content/ContentProvider";
import { setRequestLocale } from "next-intl/server";
import HomeNav from "@/components/home/HomeNav";
import IconSprite from "@/components/home/IconSprite";
import PathologyLibrary from "@/components/pathology/PathologyLibrary";
import type { Loc } from "@/lib/homeContent";
import "../../home.css";

export default async function PathologyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  return <ContentSurface scope="src/app/[locale]/benh-ly/page.tsx"><div className="bd"><IconSprite /><HomeNav/><PathologyLibrary locale={locale as Loc}/></div></ContentSurface>;
}
