"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname, Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { homeContent as C, pick, type Loc } from "@/lib/homeContent";
import { Icon } from "./IconSprite";

export default function HomeNav() {
  const locale = useLocale() as Loc;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const langCode: Record<Loc, string> = { vi: "VI", en: "EN", zh: "中" };
  const section: "explore" | "library" | "studio" = pathname.startsWith("/thu-vien")
    ? "library"
    : pathname.startsWith("/studio")
      ? "studio"
      : "explore";

  return (
    <>
      <nav className="nav">
        <div className="wrap nav-inner">
          <div className="brand"><span className="mk">S</span>Soma&nbsp;3D</div>
          <div className="menu">
            <button
              type="button"
              className={`explore-btn${section === "explore" ? " active" : ""}`}
              onClick={() => setOpen((o) => !o)}
            >
              {pick(C.nav.explore, locale)} <Icon id="i-chev" className="isvg cx" />
            </button>
            <Link href="/thu-vien" className={section === "library" ? "active" : ""}>
              {pick(C.nav.library, locale)}
            </Link>
            <a className={section === "studio" ? "active" : ""}>{pick(C.nav.studio, locale)}</a>
          </div>
          <div className="nav-r">
            <div className="lang">
              {routing.locales.map((l) => (
                <button
                  key={l}
                  className={l === locale ? "on" : ""}
                  onClick={() => router.replace(pathname, { locale: l })}
                >
                  {langCode[l as Loc]}
                </button>
              ))}
            </div>
            <button className="btn-up">{pick(C.nav.upgrade, locale)}</button>
            <span className="nic"><Icon id="i-msg" /></span>
            <span className="nic"><Icon id="i-help" /></span>
            <span className="nic"><Icon id="i-user" /></span>
          </div>
        </div>

        <div className={`mega${open ? " open" : ""}`}>
          <div className="wrap">
            <div className="mega-grid">
              <div>
                <p className="mcol-h">{pick(C.mega.anatomyH, locale)}</p>
                {C.mega.anatomy.map((m, i) =>
                  m.href ? (
                    <Link key={i} href={m.href} className={`mi${m.vet ? " vet" : ""}`} onClick={() => setOpen(false)}>
                      <Icon id={m.icon} /> {pick(m.label, locale)}
                    </Link>
                  ) : (
                    <div key={i} className={`mi${m.vet ? " vet" : ""}`}>
                      <Icon id={m.icon} /> {pick(m.label, locale)}
                    </div>
                  ),
                )}
                <p className="mcol-h mt">{pick(C.mega.communityH, locale)}</p>
                {C.mega.community.map((m, i) => (
                  <div key={i} className="mi"><Icon id={m.icon} /> {pick(m.label, locale)}</div>
                ))}
              </div>
              <div>
                <p className="mcol-h">{pick(C.mega.specialtiesH, locale)}</p>
                <div className="spec-items">
                  {C.mega.specialties.map((m, i) => (
                    <div key={i} className="mi"><Icon id={m.icon} /> {pick(m.label, locale)}</div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mcol-h">{pick(C.mega.collectionsH, locale)}</p>
                {C.collections.map((c, i) => (
                  <div key={i} className="ec">
                    <span className="lk"><Icon id="i-lock" /></span>
                    <div className="t">{pick(c.title, locale)}</div>
                    <div className="c">{pick(c.author, locale)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className={`mega-back${open ? " open" : ""}`} onClick={() => setOpen(false)} />
    </>
  );
}
