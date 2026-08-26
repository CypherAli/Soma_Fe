import { setRequestLocale } from "next-intl/server";
import VetQuiz from "@/components/vet/VetQuiz";
import { vetQuizCopy } from "@/lib/vet/copy";
import type { Loc } from "@/lib/homeContent";
import "../../../home.css";
import "../vet.css";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const x = vetQuizCopy((["vi", "en", "zh"].includes(locale) ? locale : "vi") as Loc);
  return { title: `${x.title} — Soma 3D`, description: x.lead };
}

export default async function VetQuizPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <VetQuiz locale={locale as Loc} />;
}
