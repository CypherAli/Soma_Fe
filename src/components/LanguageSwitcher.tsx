"use client";




import { useContent } from "@/components/content/ContentProvider";
import { bindContentSource } from "@/lib/content/source";
import { ContentSurface } from "@/components/content/ContentProvider";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { useEffect, useRef, useState, useTransition } from "react";
import { markLocaleTransition } from "@/lib/localeTransition";

const CODES: Record<Locale, string> = bindContentSource("data:src/components/LanguageSwitcher.tsx#CODES", { vi: "VI", en: "EN", zh: "中文" });
const LABELS: Record<Locale, string> = bindContentSource("data:src/components/LanguageSwitcher.tsx#LABELS", { vi: "Tiếng Việt", en: "English", zh: "中文" });

export default function LanguageSwitcher() {
  const cmsContent = useContent();
  const LABELS = cmsContent.resolve(cmsSourceLABELS());
  const CODES = cmsContent.resolve(cmsSourceCODES());

  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return <ContentSurface scope="src/components/LanguageSwitcher.tsx">{(
    <div ref={rootRef} className="language-select">
      <button type="button" disabled={isPending} aria-label="Chọn ngôn ngữ" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="language-select-trigger">
        <svg className="language-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3.5 12h17M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3Z"/></svg>
        <span>{LABELS[locale]}</span><em>{CODES[locale]}</em>
        <svg className={`language-chevron ${open ? "is-open" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m8 10 4 4 4-4" /></svg>
      </button>
      {open && <div className="language-select-menu" role="menu">
        <p>Ngôn ngữ / Language</p>
        {routing.locales.map((item) => <button key={item} type="button" aria-current={item === locale ? "true" : undefined} onClick={() => {
          setOpen(false);
          if (item !== locale) {
            markLocaleTransition(pathname);
            startTransition(() => router.replace(pathname, { locale: item, scroll: false }));
          }
        }} className="language-select-option">
          <span>{LABELS[item]}</span><em>{CODES[item]}</em>{item === locale && <b aria-hidden="true">✓</b>}
        </button>)}
      </div>}
    </div>
  )}</ContentSurface>;
}

function cmsSourceLABELS() { return LABELS; }
function cmsSourceCODES() { return CODES; }
