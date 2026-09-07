"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { pick, type Loc } from "@/lib/homeContent";
import type { SceneModule } from "@/lib/sceneModules";
import { displayName } from "../viewer/Hotspots";
import { useAnatomyStore } from "@/store/useAnatomyStore";
import ModelViewer from "../viewer/ModelViewer";
import SectionModelViewer from "../viewer/SectionModelViewer";
import InfoPanel from "../InfoPanel";
import LanguageSwitcher from "../LanguageSwitcher";
import ThemeToggle from "../home/ThemeToggle";
import "../../app/home.css";
import { consumeLocaleTransition } from "@/lib/localeTransition";

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
    if (consumeLocaleTransition()) {
      const current = useAnatomyStore.getState().selected;
      const hotspot = current && sceneModule.hotspots.find((item) => item.key === useAnatomyStore.getState().activeHotspotKey);
      if (current && hotspot) {
        useAnatomyStore.getState().setSelected({
          ...current,
          name: displayName(hotspot, locale),
          latin: hotspot.latinName ?? current.latin,
          description: hotspot.note ? pick(hotspot.note, locale) : current.description,
        });
      }
      return;
    }
    const patch = Object.fromEntries(sceneModule.visibleSystems.map((k) => [k, true]));
    resetViewer(patch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneModule, locale]);

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
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
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
            <div className="space-y-2">
              {sceneModule.hotspots.map((h) => {
                const active = activeHotspotKey === h.key;
                return (
                  <button
                    key={h.key}
                    type="button"
                    onClick={() => setActiveHotspotKey(active ? null : h.key)}
                    className={`block w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
                      active
                        ? "bg-[color-mix(in_srgb,var(--blue)_10%,white)]"
                        : "hover:bg-[var(--surf-2)]"
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold ${active ? "text-[var(--blue)]" : "text-[var(--body-fg)]"}`}
                    >
                      {displayName(h, locale)}
                    </span>
                    {h.note && (
                      <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                        {pick(h.note, locale)}
                      </p>
                    )}
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

        <InfoPanel />
      </div>
    </div>
  );
}
