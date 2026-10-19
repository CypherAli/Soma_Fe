
import { ContentSurface } from "@/components/content/ContentProvider";
import { setRequestLocale } from "next-intl/server";
import HomeNav from "@/components/home/HomeNav";
import IconSprite from "@/components/home/IconSprite";
import HomeFooter from "@/components/home/HomeFooter";
import AnatomyChat from "@/components/chat/AnatomyChat";
import { type Loc } from "@/lib/homeContent";
import "../../home.css";

export default async function AssistantPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Loc;
  setRequestLocale(locale);
  return <ContentSurface scope="src/app/[locale]/tro-ly/page.tsx">{(
    <div className="bd">
      <IconSprite />
      <HomeNav />
      <AnatomyChat locale={locale} />
      <HomeFooter locale={locale} />
    </div>
  )}</ContentSurface>;
}
