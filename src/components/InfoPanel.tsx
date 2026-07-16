"use client";

import { useTranslations } from "next-intl";
import { useAnatomyStore } from "@/store/useAnatomyStore";

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
    <aside className="flex w-72 shrink-0 flex-col border-l border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {t("title")}
        </h2>
      </div>

      {selected ? (
        <div className="space-y-4 p-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-100">
              {selected.name}
            </h3>
            {selected.latin && (
              <p className="mt-0.5 text-sm italic text-sky-400">
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
                  ? "border-sky-400 bg-sky-500/20 text-sky-300"
                  : "border-slate-700 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {isHidden ? t("show") : t("hide")}
            </button>
            <button
              type="button"
              onClick={() => toggleFaded(selected.id)}
              className={`flex-1 rounded border px-2 py-1.5 text-xs font-medium ${
                isFaded
                  ? "border-sky-400 bg-sky-500/20 text-sky-300"
                  : "border-slate-700 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {t("fade")}
            </button>
            <button
              type="button"
              onClick={() => toggleIsolate(selected.id)}
              className={`flex-1 rounded border px-2 py-1.5 text-xs font-medium ${
                isIsolated
                  ? "border-sky-400 bg-sky-500/20 text-sky-300"
                  : "border-slate-700 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {t("isolate")}
            </button>
          </div>
          {selected.description && (
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                {t("description")}
              </p>
              <p className="text-sm leading-relaxed text-slate-300">
                {selected.description}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-center text-sm text-slate-500">{t("empty")}</p>
        </div>
      )}
    </aside>
  );
}
