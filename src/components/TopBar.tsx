"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAnatomyStore } from "@/store/useAnatomyStore";
import LanguageSwitcher from "./LanguageSwitcher";

export default function TopBar() {
  const t = useTranslations();
  const searchQuery = useAnatomyStore((s) => s.searchQuery);
  const setSearchQuery = useAnatomyStore((s) => s.setSearchQuery);

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[var(--line)] bg-[var(--surf)] px-4">
      <Link href="/" className="flex items-center gap-2">
        <div className="nav-logo">S</div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-[var(--ink)]">
            {t("app.name")}
          </p>
          <p className="hidden text-[10px] text-[var(--muted)] sm:block">
            {t("app.tagline")}
          </p>
        </div>
      </Link>

      <div className="relative mx-auto w-full max-w-md">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-2)]"
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
          className="w-full rounded-lg border border-[var(--line)] bg-[var(--surf-2)] py-2 pl-9 pr-3 text-sm text-[var(--body-fg)] placeholder-[var(--muted-2)] outline-none focus:border-[var(--blue)]"
        />
      </div>

      <LanguageSwitcher />
    </header>
  );
}
