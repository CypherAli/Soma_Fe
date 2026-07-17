"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { SceneHotspot } from "@/lib/sceneModules";

const SectionModelScene = dynamic(() => import("./SectionModelScene"), {
  ssr: false,
  loading: () => <ViewerFallback />,
});

function ViewerFallback() {
  const t = useTranslations("viewer");
  return (
    <div className="flex h-full w-full items-center justify-center bg-[var(--surf-3)]">
      <div className="flex flex-col items-center gap-3 text-[var(--muted)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--blue)]" />
        <p className="text-sm">{t("loading")}</p>
      </div>
    </div>
  );
}

export default function SectionModelViewer({
  modelUrl,
  hotspots,
}: {
  modelUrl: string;
  hotspots: SceneHotspot[];
}) {
  const t = useTranslations("viewer");
  return (
    <div className="relative h-full w-full">
      <SectionModelScene modelUrl={modelUrl} hotspots={hotspots} />
      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-[var(--line)] bg-white/90 px-4 py-1.5 text-xs text-[var(--body-fg)] shadow backdrop-blur">
        {t("selectHint")}
      </p>
    </div>
  );
}
