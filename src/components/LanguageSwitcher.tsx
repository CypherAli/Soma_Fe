"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { useTransition } from "react";

const LABELS: Record<Locale, string> = {
  vi: "Tiếng Việt",
  en: "English",
  zh: "中文",
};

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-[var(--line)] bg-[var(--surf-2)] p-0.5">
      {routing.locales.map((l) => (
        <button
          key={l}
          disabled={isPending}
          onClick={() =>
            startTransition(() => router.replace(pathname, { locale: l }))
          }
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            l === locale
              ? "bg-[var(--blue)] text-white"
              : "text-[var(--muted)] hover:bg-[var(--surf-3)]"
          }`}
          title={LABELS[l]}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
