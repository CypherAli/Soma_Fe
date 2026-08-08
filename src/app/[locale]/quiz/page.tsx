import { setRequestLocale } from "next-intl/server";
import HomeNav from "@/components/home/HomeNav";
import IconSprite from "@/components/home/IconSprite";
import HomeFooter from "@/components/home/HomeFooter";
import QuizRunner from "@/components/quiz/QuizRunner";
import { type Loc } from "@/lib/homeContent";
import "../../home.css";

export default async function QuizPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Loc;
  setRequestLocale(locale);
  return (
    <div className="bd">
      <IconSprite />
      <HomeNav />
      <QuizRunner locale={locale} />
      <HomeFooter locale={locale} />
    </div>
  );
}
