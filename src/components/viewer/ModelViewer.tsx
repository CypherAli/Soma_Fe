"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const ModelScene = dynamic(() => import("./ModelScene"), {
  ssr: false,
  loading: () => <ViewerFallback />,
});

function ViewerFallback() {
  const t = useTranslations("viewer");
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-sky-400" />
        <p className="text-sm">{t("loading")}</p>
      </div>
    </div>
  );
}

export default function ModelViewer() {
  const t = useTranslations("viewer");
  return (
    <div className="relative h-full w-full">
      <ModelScene />
      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/70 px-4 py-1.5 text-xs text-slate-300 backdrop-blur">
        {t("selectHint")}
      </p>
    </div>
  );
}
