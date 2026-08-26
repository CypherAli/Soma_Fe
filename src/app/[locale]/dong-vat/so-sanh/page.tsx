import { setRequestLocale } from "next-intl/server";
import VetCompareView from "@/components/vet/VetCompareView";
import { vetCopy } from "@/lib/vet/copy";
import type { Loc } from "@/lib/homeContent";
import type { VetSystemKey } from "@/lib/vet/types";
import "../../../home.css";
import "../vet.css";

const L = (l: string) => (["vi", "en", "zh"].includes(l) ? l : "vi") as Loc;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const C = vetCopy(L(locale));
  return { title: `${C.compareH} — Soma 3D`, description: C.compareSub };
}

export default async function VetComparePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ he?: string }>;
}) {
  const { locale } = await params;
  const { he } = await searchParams;
  setRequestLocale(locale);
  return <VetCompareView locale={locale as Loc} initialSystem={he as VetSystemKey | undefined} />;
}
