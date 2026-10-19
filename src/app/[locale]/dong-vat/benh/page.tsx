
import { ContentSurface } from "@/components/content/ContentProvider";
import { setRequestLocale } from "next-intl/server";
import VetDiseases from "@/components/vet/VetDiseases";
import { vetCopy } from "@/lib/vet/copy";
import type { Loc } from "@/lib/homeContent";
import "../../../home.css";
import "../vet.css";

const L = (l: string) => (["vi", "en", "zh"].includes(l) ? l : "vi") as Loc;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const C = vetCopy(L(locale));
  return { title: `${C.diseaseH} — Soma 3D`, description: C.diseaseSub };
}

export default async function VetDiseasePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContentSurface scope="src/app/[locale]/dong-vat/benh/page.tsx"><VetDiseases locale={locale as Loc} /></ContentSurface>;
}
