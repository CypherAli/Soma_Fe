
import { ContentSurface } from "@/components/content/ContentProvider";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import VetSpeciesView from "@/components/vet/VetSpeciesView";
import type { Loc } from "@/lib/homeContent";
import { factsOfSpecies, speciesInfo } from "@/lib/vet/knowledge";
import { VET_SPECIES, type VetSpeciesKey } from "@/lib/vet/types";
import "../../../home.css";
import "../vet.css";

/** Dựng sẵn 6 loài × 3 ngôn ngữ lúc build — nội dung tĩnh, không cần dựng lúc chạy. */
export function generateStaticParams() {
  return VET_SPECIES.map((species) => ({ species }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; species: string }>;
}) {
  const { locale, species } = await params;
  if (!VET_SPECIES.includes(species as VetSpeciesKey)) return {};
  const info = speciesInfo(species as VetSpeciesKey);
  const name = info.name[(["vi", "en", "zh"].includes(locale) ? locale : "vi") as Loc];
  return { title: `${name} (${info.latin}) — Soma 3D`, description: info.blurb.vi };
}

export default async function VetSpeciesPage({
  params,
}: {
  params: Promise<{ locale: string; species: string }>;
}) {
  const { locale, species } = await params;
  setRequestLocale(locale);
  if (!VET_SPECIES.includes(species as VetSpeciesKey)) notFound();
  const key = species as VetSpeciesKey;
  return <ContentSurface scope="src/app/[locale]/dong-vat/[species]/page.tsx"><VetSpeciesView locale={locale as Loc} speciesKey={key} facts={factsOfSpecies(key)} /></ContentSurface>;
}
