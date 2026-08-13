"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { useEffect, useRef, useState, useTransition } from "react";

const CODES: Record<Locale, string> = { vi: "VI", en: "EN", zh: "中" };
const LABELS: Record<Locale, string> = { vi: "Tiếng Việt", en: "English", zh: "中文" };

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);

  const otherLocales = routing.locales.filter((item) => item !== locale);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={isPending}
        aria-label="Chọn ngôn ngữ"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 min-w-15 items-center justify-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--surf)] px-3 text-xs font-medium text-[var(--body-fg)] transition-colors hover:bg-[var(--surf-2)] disabled:opacity-60"
      >
        {CODES[locale]}
        <svg className={`size-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m8 10 4 4 4-4" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-20 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surf)] py-1.5 shadow-[0_14px_35px_rgba(0,0,0,0.16)]">
          {otherLocales.map((item) => (
            <button
              key={item}
              type="button"
              title={LABELS[item]}
              onClick={() => {
                setOpen(false);
                startTransition(() => router.replace(pathname, { locale: item }));
              }}
              className="block w-full px-4 py-2.5 text-left text-xs font-medium text-[var(--body-fg)] transition-colors hover:bg-[var(--surf-2)] hover:text-[var(--blue)]"
            >
              {CODES[item]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
