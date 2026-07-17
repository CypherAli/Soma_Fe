"use client";

import { useTranslations } from "next-intl";
import { useAnatomyStore, SYSTEM_KEYS } from "@/store/useAnatomyStore";

export default function Sidebar() {
  const t = useTranslations("sidebar");
  const visibleSystems = useAnatomyStore((s) => s.visibleSystems);
  const toggleSystem = useAnatomyStore((s) => s.toggleSystem);

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[var(--line)] bg-[var(--surf)]">
      <div className="px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
          {t("systems")}
        </h2>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 pb-4" data-lenis-prevent>
        {SYSTEM_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => toggleSystem(key)}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-[var(--body-fg)] transition-colors hover:bg-[var(--surf-2)]"
          >
            <span>{t(key)}</span>
            <span
              className={`h-4 w-8 rounded-full p-0.5 transition-colors ${
                visibleSystems[key] ? "bg-[var(--blue)]" : "bg-[var(--line)]"
              }`}
            >
              <span
                className={`block h-3 w-3 rounded-full bg-white transition-transform ${
                  visibleSystems[key] ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
