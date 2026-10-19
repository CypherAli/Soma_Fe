
import { ContentSurface } from "@/components/content/ContentProvider";
import { setRequestLocale } from "next-intl/server";
import HomeNav from "@/components/home/HomeNav";
import IconSprite from "@/components/home/IconSprite";
import HomeFooter from "@/components/home/HomeFooter";
import QuizPageContent from "@/components/quiz/QuizPageContent";
import { type Loc } from "@/lib/homeContent";
import { quizDestination } from "@/lib/site/quizDestination";
import "../../home.css";

export default async function QuizPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Loc;
  setRequestLocale(locale);
  const { tool, examId } = quizDestination(await searchParams);
  return <ContentSurface scope="src/app/[locale]/quiz/page.tsx">{(
    <div className="bd quiz-page">
      <IconSprite />
      <HomeNav />
      <QuizPageContent key={`${tool}:${examId ?? "default"}`} locale={locale} initialTool={tool} initialExamId={examId} />
      <HomeFooter locale={locale} />
    </div>
  )}</ContentSurface>;
}
