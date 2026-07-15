"use client";

import { useTranslations } from "next-intl";
import { useAnatomyStore } from "@/store/useAnatomyStore";

export default function InfoPanel() {
  const t = useTranslations("info");
  const selected = useAnatomyStore((s) => s.selected);

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
