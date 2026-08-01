"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname, Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { homeContent as C, pick, type Loc } from "@/lib/homeContent";
import { systemGroups, scenesOfSystem, catalogStats } from "@/lib/catalog";
import { Icon } from "./IconSprite";

const LANG_CODE: Record<Loc, string> = { vi: "VI", en: "EN", zh: "中" };

export default function HomeNav() {
  const locale = useLocale() as Loc;
  const router = useRouter();
  const pathname = usePathname();
  const [megaOpen, setMegaOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const otherLocales = routing.locales.filter((l) => l !== locale);
  const section = pathname.startsWith("/thu-vien") ? "library" : "explore";

  useEffect(() => {
    if (!langOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [langOpen]);

  // Đóng mega-menu khi chuyển trang, tránh menu treo lại sau điều hướng
  useEffect(() => setMegaOpen(false), [pathname]);

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-word" aria-label="Soma 3D">Soma&nbsp;3D</Link>

          <div className="menu">
            {C.mainMenu.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className={pathname.startsWith(m.href.split("#")[0]) && m.href !== "/" ? "active" : ""}
              >
                {pick(m.label, locale)}
              </Link>
            ))}
          </div>

          <div className="nav-r">
            <div className="lang" ref={langRef}>
              <button
                type="button"
                className="lang-trigger"
                aria-expanded={langOpen}
                onClick={() => setLangOpen((o) => !o)}
              >
                {LANG_CODE[locale]}
                <Icon id="i-chev" className="isvg cx" />
              </button>
              {langOpen && (
                <div className="lang-menu">
                  {otherLocales.map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        router.replace(pathname, { locale: l });
                        setLangOpen(false);
                      }}
                    >
                      {LANG_CODE[l as Loc]}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link href="/dang-nhap" className="btn-signin">
              {pick(C.nav.signIn, locale)}
            </Link>
          </div>
        </div>

        <div className={`mega${megaOpen ? " open" : ""}`}>
          <div className="wrap">
            <div className="mega-grid">
              <div>
                <p className="mcol-h">{pick(C.mega.anatomyH, locale)}</p>
                {C.mega.anatomy.map((m) => (
                  <Link key={m.href} href={m.href!} className="mi">
                    <Icon id={m.icon} /> {pick(m.label, locale)}
                  </Link>
                ))}

                <p className="mcol-h mt">{pick(C.mega.upcomingH, locale)}</p>
                {C.mega.upcoming.map((m, i) => (
                  <div key={i} className={`mi disabled${m.vet ? " vet" : ""}`}>
                    <Icon id={m.icon} /> {pick(m.label, locale)}
                  </div>
                ))}
              </div>

              <div className="mega-systems">
                <p className="mcol-h">{pick(C.mega.systemsH, locale)}</p>
                <div className="spec-items">
                  {systemGroups.map((g) => (
                    <Link key={g.key} href={`/giai-phau/${g.slug}`} className="mi">
                      <Icon id={g.icon} /> {pick(g.label, locale)}
                      <span className="mi-count">{scenesOfSystem(g.key).length}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mega-note">
                <p className="mcol-h">{pick(C.stats.heading, locale)}</p>
                <div className="mega-stat">
                  <b>{catalogStats.scenes}</b>
                  <span>{pick(C.stats.scenes, locale)}</span>
                </div>
                <div className="mega-stat">
                  <b>{catalogStats.structures}</b>
                  <span>{pick(C.stats.structures, locale)}</span>
                </div>
                <p className="mega-src">{pick(C.sources.body, locale)}</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className={`mega-back${megaOpen ? " open" : ""}`} onClick={() => setMegaOpen(false)} />
    </>
  );
}
