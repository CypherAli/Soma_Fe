"use client";

import { useTranslations } from "next-intl";
import { useAnatomyStore } from "@/store/useAnatomyStore";
import ViewerPathologyPanel from "./pathology/ViewerPathologyPanel";

export default function InfoPanel() {
  const t = useTranslations("info");
  const selected = useAnatomyStore((s) => s.selected);
  const hiddenIds = useAnatomyStore((s) => s.hiddenIds);
  const fadedIds = useAnatomyStore((s) => s.fadedIds);
  const isolatedId = useAnatomyStore((s) => s.isolatedId);
  const toggleHidden = useAnatomyStore((s) => s.toggleHidden);
  const toggleFaded = useAnatomyStore((s) => s.toggleFaded);
  const toggleIsolate = useAnatomyStore((s) => s.toggleIsolate);

  const isHidden = selected ? !!hiddenIds[selected.id] : false;
  const isFaded = selected ? !!fadedIds[selected.id] : false;
  const isIsolated = selected ? isolatedId === selected.id : false;

  return (
    <aside
      className="viewer-info-panel flex w-80 shrink-0 flex-col overflow-y-auto border-l border-[var(--line)] bg-[var(--surf)]"
      data-lenis-prevent
    >
      <div className="border-b border-[var(--line)] px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
          {t("title")}
        </h2>
      </div>

      {selected ? (
        <div className="space-y-4 p-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--ink)]">
              {selected.name}
            </h3>
            {selected.latin && (
              <p className="mt-0.5 text-sm italic text-[var(--blue)]">
                {selected.latin}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => toggleHidden(selected.id)}
              className={`flex-1 rounded border px-2 py-1.5 text-xs font-medium ${
                isHidden
                  ? "border-[var(--blue)] bg-[color-mix(in_srgb,var(--blue)_12%,white)] text-[var(--blue)]"
                  : "border-[var(--line)] text-[var(--body-fg)] hover:bg-[var(--surf-2)]"
              }`}
            >
              {isHidden ? t("show") : t("hide")}
            </button>
            <button
              type="button"
              onClick={() => toggleFaded(selected.id)}
              className={`flex-1 rounded border px-2 py-1.5 text-xs font-medium ${
                isFaded
                  ? "border-[var(--blue)] bg-[color-mix(in_srgb,var(--blue)_12%,white)] text-[var(--blue)]"
                  : "border-[var(--line)] text-[var(--body-fg)] hover:bg-[var(--surf-2)]"
              }`}
            >
              {t("fade")}
            </button>
            <button
              type="button"
              onClick={() => toggleIsolate(selected.id)}
              className={`flex-1 rounded border px-2 py-1.5 text-xs font-medium ${
                isIsolated
                  ? "border-[var(--blue)] bg-[color-mix(in_srgb,var(--blue)_12%,white)] text-[var(--blue)]"
                  : "border-[var(--line)] text-[var(--body-fg)] hover:bg-[var(--surf-2)]"
              }`}
            >
              {t("isolate")}
            </button>
          </div>
          {selected.description && (
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--muted-2)]">
                {t("description")}
              </p>
              <p className="text-sm leading-relaxed text-[var(--body-fg)]">
                {selected.description}
              </p>
            </div>
          )}
          <ViewerPathologyPanel />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-center text-sm text-[var(--muted)]">{t("empty")}</p>
        </div>
      )}
    </aside>
  );
}
