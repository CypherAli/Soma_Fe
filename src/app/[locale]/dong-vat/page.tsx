import { setRequestLocale } from "next-intl/server";
import VetHome from "@/components/vet/VetHome";
import { vetCopy } from "@/lib/vet/copy";
import type { Loc } from "@/lib/homeContent";
import "../../home.css";
import "./vet.css";

const L = (l: string) => (["vi", "en", "zh"].includes(l) ? l : "vi") as Loc;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const C = vetCopy(L(locale));
  return { title: `${C.title} — Soma 3D`, description: C.lead };
}

export default async function AnimalsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <VetHome locale={locale as Loc} />;
}
