"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { pick, type Loc } from "@/lib/homeContent";
import type { SceneModule } from "@/lib/sceneModules";
import { cleanName } from "../viewer/Hotspots";
import { useAnatomyStore } from "@/store/useAnatomyStore";
import ModelViewer from "../viewer/ModelViewer";
import SectionModelViewer from "../viewer/SectionModelViewer";
import "../../app/home.css";

export default function SceneDetailPage({
  module: sceneModule,
  locale,
  backHref,
}: {
  module: SceneModule;
  locale: Loc;
  backHref: string;
}) {
  const t = useTranslations("scene");
  const resetViewer = useAnatomyStore((s) => s.resetViewer);
  const activeHotspotKey = useAnatomyStore((s) => s.activeHotspotKey);
  const setActiveHotspotKey = useAnatomyStore((s) => s.setActiveHotspotKey);

  // Mỗi lần vào 1 scene: xoá sạch Ẩn/Mờ/Cô lập/Mặt cắt của scene trước đó và
  // chỉ bật đúng các hệ scene này cần — tránh trạng thái cũ lẫn sang.
  useEffect(() => {
    const patch = Object.fromEntries(sceneModule.visibleSystems.map((k) => [k, true]));
    resetViewer(patch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneModule.slug]);

  return (
    <div className="bd flex h-screen flex-col bg-[var(--surf-3)]">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[var(--line)] bg-[var(--surf)] px-4">
        <Link
          href={backHref}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-[var(--body-fg)] transition-colors hover:bg-[var(--surf-2)]"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t("back")}
        </Link>
        <h1 className="text-sm font-semibold text-[var(--ink)]">{pick(sceneModule.title, locale)}</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="flex w-80 shrink-0 flex-col overflow-y-auto border-r border-[var(--line)] bg-[var(--surf)]" data-lenis-prevent>
          <div className="space-y-3 border-b border-[var(--line)] p-4">
            <h2 className="text-lg font-semibold text-[var(--ink)]">{pick(sceneModule.title, locale)}</h2>
            <p className="text-[11px] italic text-[var(--muted-2)]">{t("reviewedNote")}</p>
            <p className="text-sm leading-relaxed text-[var(--body-fg)]">{pick(sceneModule.description, locale)}</p>
          </div>
          <div className="p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
              {t("labels")}
            </h3>
            <div className="space-y-1">
              {sceneModule.hotspots.map((h) => {
                const active = activeHotspotKey === h.key;
                return (
                  <button
                    key={h.key}
                    type="button"
                    onClick={() => setActiveHotspotKey(active ? null : h.key)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors ${
                      active
                        ? "bg-[color-mix(in_srgb,var(--blue)_10%,white)] text-[var(--blue)]"
                        : "text-[var(--body-fg)] hover:bg-[var(--surf-2)]"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                        active
                          ? "border-[var(--blue)] bg-[var(--blue)] text-white"
                          : "border-[var(--line)] text-[var(--muted)]"
                      }`}
                    >
                      {active ? "−" : "+"}
                    </span>
                    {cleanName(h.meshName)}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <main className="relative flex-1 bg-[var(--surf-3)]">
          {sceneModule.modelFile ? (
            // Scene có model cắt sẵn → nạp đúng 1 file (nhẹ, đúng "từng phần").
            <SectionModelViewer
              modelUrl={sceneModule.modelFile}
              hotspots={sceneModule.hotspots}
            />
          ) : (
            // Chưa có model cắt → tạm dùng full-body zoom vào vùng.
            <ModelViewer
              hotspots={sceneModule.hotspots}
              requiredSystems={sceneModule.visibleSystems}
              autoFocusOnLoad
              showClipControls={false}
            />
          )}
        </main>
      </div>
    </div>
  );
}
