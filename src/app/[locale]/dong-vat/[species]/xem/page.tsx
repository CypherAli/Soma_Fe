
import { ContentSurface } from "@/components/content/ContentProvider";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import VetViewerShell from "@/components/vet/VetViewerShell";
import type { Loc } from "@/lib/homeContent";
import { speciesInfo } from "@/lib/vet/knowledge";
import { VET_SPECIES, type VetSpeciesKey } from "@/lib/vet/types";
import "../../../../home.css";
import "../../vet.css";

/**
 * Khung xem mẫu vật của một loài — bản tương đương `/viewer` bên người.
 *
 * Tách khỏi trang loài vì hai thứ cần hai dạng trang khác nhau: phần chữ là bài
 * đọc cuộn dọc, còn khung xem 3D cần chiếm trọn chiều cao và có thanh điều
 * khiển cố định hai bên. Nhét chung một trang thì cái nào cũng hỏng.
 */
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
  const loc = (["vi", "en", "zh"].includes(locale) ? locale : "vi") as Loc;
  return { title: `${info.name[loc]} — mẫu vật 3D — Soma 3D` };
}

export default async function VetSpeciesViewerPage({
  params,
}: {
  params: Promise<{ locale: string; species: string }>;
}) {
  const { locale, species } = await params;
  setRequestLocale(locale);
  if (!VET_SPECIES.includes(species as VetSpeciesKey)) notFound();
  return <ContentSurface scope="src/app/[locale]/dong-vat/[species]/xem/page.tsx"><VetViewerShell locale={locale as Loc} speciesKey={species as VetSpeciesKey} /></ContentSurface>;
}
