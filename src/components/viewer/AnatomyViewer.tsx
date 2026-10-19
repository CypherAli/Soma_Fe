"use client";


import { ContentSurface } from "@/components/content/ContentProvider";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

// Canvas WebGL không chạy khi SSR nên nạp động, tắt SSR.
const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => <ViewerFallback />,
});

function ViewerFallback() {
  const t = useTranslations("viewer");
  return <ContentSurface scope="src/components/viewer/AnatomyViewer.tsx">{(
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-sky-400" />
        <p className="text-sm">{t("loading")}</p>
      </div>
    </div>
  )}</ContentSurface>;
}

export default function AnatomyViewer() {
  const t = useTranslations("viewer");
  return <ContentSurface scope="src/components/viewer/AnatomyViewer.tsx">{(
    <div className="viewer-stage relative h-full w-full">
      <Scene />
      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/70 px-4 py-1.5 text-xs text-slate-300 backdrop-blur">
        {t("selectHint")}
      </p>
    </div>
  )}</ContentSurface>;
}
