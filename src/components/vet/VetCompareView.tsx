"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import HomeNav from "@/components/home/HomeNav";
import HomeFooter from "@/components/home/HomeFooter";
import IconSprite from "@/components/home/IconSprite";
import { pick, type Loc } from "@/lib/homeContent";
import { vetCopy } from "@/lib/vet/copy";
import { SPECIES, VET_SYSTEM_LABEL, allVetFacts, speciesInfo } from "@/lib/vet/knowledge";
import type { VetSystemKey } from "@/lib/vet/types";

/**
 * Trang đối chiếu: chọn một hệ, xem mọi loài cạnh nhau.
 *
 * Đây là thứ mà bên người không cần nhưng bên thú y thì không thể thiếu — cả
 * ngành học bằng cách so loài này với loài kia. Cột nào không có mục thì để
 * trống chứ KHÔNG bịa: chỗ trống chính là thông tin (chưa biên soạn tới).
 */
export default function VetCompareView({
  locale,
  initialSystem,
}: {
  locale: Loc;
  initialSystem?: VetSystemKey;
}) {
  const t = vetCopy(locale);
  const facts = allVetFacts();
  const systems = (Object.keys(VET_SYSTEM_LABEL) as VetSystemKey[]).filter((k) =>
    facts.some((f) => f.system === k),
  );
  const [system, setSystem] = useState<VetSystemKey>(
    initialSystem && systems.includes(initialSystem) ? initialSystem : systems[0],
  );

  const rows = SPECIES.map((s) => ({
    species: s,
    items: facts.filter((f) => f.system === system && f.species.includes(s.key)),
  }));

  return (
    <div className="bd animal-home">
      <IconSprite />
      <HomeNav minimal />

      <header className="vet-compare-head">
        <Link href="/dong-vat" className="vet-back">
          ← {t.backToSpecies}
        </Link>
        <h1>{t.compareH}</h1>
        <p>{t.compareSub}</p>
        <div className="vet-filter">
          {systems.map((s) => (
            <button key={s} className={system === s ? "is-on" : ""} onClick={() => setSystem(s)}>
              {pick(VET_SYSTEM_LABEL[s], locale)}
            </button>
          ))}
        </div>
      </header>

      <section className="vet-compare">
        {rows.map(({ species, items }) => (
          <article key={species.key} className={items.length ? "" : "is-empty"}>
            <header>
              <h2>{pick(species.name, locale)}</h2>
              <em>{species.latin}</em>
            </header>
            {items.length === 0 ? (
              <p className="vet-empty">{t.empty}</p>
            ) : (
              <ul>
                {items.map((f) => (
                  <li key={f.id}>
                    <h3>{pick(f.name, locale)}</h3>
                    <em>{f.nav}</em>
                    <p>{pick(f.compare ?? f.note, locale)}</p>
                    <Link href={`/dong-vat/${species.key}`}>{t.readMore} →</Link>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </section>

      <p className="vet-compare-foot">
        {SPECIES.map((s) => (
          <Link key={s.key} href={`/dong-vat/${s.key}`}>
            {pick(speciesInfo(s.key).name, locale)}
          </Link>
        ))}
      </p>

      <HomeFooter locale={locale} />
    </div>
  );
}
