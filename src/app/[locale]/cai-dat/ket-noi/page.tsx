
import { ContentSurface } from "@/components/content/ContentProvider";
import { setRequestLocale } from "next-intl/server";
import HomeNav from "@/components/home/HomeNav";
import IconSprite from "@/components/home/IconSprite";
import HomeFooter from "@/components/home/HomeFooter";
import SettingsPage from "@/components/settings/SettingsPage";
import { type Loc } from "@/lib/homeContent";
import "../../../home.css";
import "../../../settings.css";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Loc;
  setRequestLocale(locale);
  return <ContentSurface scope="src/app/[locale]/cai-dat/ket-noi/page.tsx">{(
    <div className="bd">
      <IconSprite />
      <HomeNav />
      <SettingsPage locale={locale} tab="connections" />
      <HomeFooter locale={locale} />
    </div>
  )}</ContentSurface>;
}
