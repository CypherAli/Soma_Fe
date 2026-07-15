"use client";

import { useTranslations } from "next-intl";
import { useAnatomyStore } from "@/store/useAnatomyStore";
import LanguageSwitcher from "./LanguageSwitcher";

export default function TopBar() {
  const t = useTranslations();
  const searchQuery = useAnatomyStore((s) => s.searchQuery);
  const setSearchQuery = useAnatomyStore((s) => s.setSearchQuery);

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-slate-800 bg-slate-900 px-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 text-sm font-bold text-white">
          S
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-slate-100">
            {t("app.name")}
          </p>
          <p className="hidden text-[10px] text-slate-400 sm:block">
            {t("app.tagline")}
          </p>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-md">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("nav.search")}
          className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-sky-500"
        />
      </div>

      <LanguageSwitcher />
    </header>
  );
}
