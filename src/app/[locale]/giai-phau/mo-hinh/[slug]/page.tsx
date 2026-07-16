import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { sceneModules, getSceneModule } from "@/lib/sceneModules";
import SceneDetailPage from "@/components/scene/SceneDetailPage";
import type { Loc } from "@/lib/homeContent";

export function generateStaticParams() {
  return Object.keys(sceneModules).map((slug) => ({ slug }));
}

export default async function SceneModulePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Loc;

  const sceneModule = getSceneModule(slug);
  if (!sceneModule) notFound();

  return <SceneDetailPage module={sceneModule} locale={loc} backHref="/giai-phau/lat-cat" />;
}
