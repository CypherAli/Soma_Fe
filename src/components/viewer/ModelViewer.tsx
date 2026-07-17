"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import ClipControls from "./ClipControls";
import type { SceneHotspot } from "@/lib/sceneModules";
import type { SystemKey } from "@/store/useAnatomyStore";

const ModelScene = dynamic(() => import("./ModelScene"), {
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

export default function ModelViewer({
  hotspots,
  requiredSystems,
  autoFocusOnLoad,
  showClipControls = true,
}: {
  hotspots?: SceneHotspot[];
  requiredSystems?: SystemKey[];
  autoFocusOnLoad?: boolean;
  showClipControls?: boolean;
}) {
  const t = useTranslations("viewer");
  return (
    <div className="relative h-full w-full">
      <ModelScene
        hotspots={hotspots}
        requiredSystems={requiredSystems}
        autoFocusOnLoad={autoFocusOnLoad}
      />
      {showClipControls && <ClipControls />}
      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-[var(--line)] bg-white/90 px-4 py-1.5 text-xs text-[var(--body-fg)] shadow backdrop-blur">
        {t("selectHint")}
      </p>
    </div>
  );
}
