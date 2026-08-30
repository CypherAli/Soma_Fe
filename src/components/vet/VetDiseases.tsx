"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import HomeNav from "@/components/home/HomeNav";
import HomeFooter from "@/components/home/HomeFooter";
import IconSprite from "@/components/home/IconSprite";
import { pick, type Loc } from "@/lib/homeContent";
import { vetCopy } from "@/lib/vet/copy";
import { vetDiseases, type VetSeverity } from "@/lib/vet/diseases";
import { SPECIES, VET_SYSTEM_LABEL, allVetFacts, speciesInfo } from "@/lib/vet/knowledge";
import type { VetSpeciesKey } from "@/lib/vet/types";

/**
 * Khu bệnh của phần thú y.
 *
 * Điểm khác một danh sách bệnh thông thường: mỗi bệnh mở ra là thấy MỤC GIẢI
 * PHẪU giải thích nó, kèm đường dẫn sang trang loài. Bò chướng hơi dạ cỏ vì dạ
 * cỏ nằm đâu và to bằng nào — bỏ mối nối ấy đi thì trang này chẳng liên quan gì
 * tới một atlas giải phẫu nữa.
 */
export default function VetDiseases({ locale }: { locale: Loc }) {
  const t = vetCopy(locale);
  const [species, setSpecies] = useState<VetSpeciesKey | "all">("all");
  const [severity, setSeverity] = useState<VetSeverity | "all">("all");
  const [open, setOpen] = useState<string | null>(null);

  const facts = useMemo(() => allVetFacts(), []);
  const shown = vetDiseases.filter(
    (d) =>
      (species === "all" || d.species.includes(species)) &&
      (severity === "all" || d.severity === severity),
  );

  const sevLabel: Record<VetSeverity, string> = {
    critical: t.sevCritical,
    warning: t.sevWarning,
    info: t.sevInfo,
  };

  return (
    <div className="bd animal-home">
      <IconSprite />
      <HomeNav section="vet" />

      <header className="vet-species-head vet-disease-head">
        <div>
          <Link href="/dong-vat" className="vet-back">
            ← {t.backToSpecies}
          </Link>
          <h1>{t.diseaseH}</h1>
          <p>{t.diseaseSub}</p>
        </div>
      </header>

      <div className="vet-filter">
        <button className={species === "all" ? "is-on" : ""} onClick={() => setSpecies("all")}>
          {t.allSystems}
        </button>
        {SPECIES.map((s) => (
          <button
            key={s.key}
            className={species === s.key ? "is-on" : ""}
            onClick={() => setSpecies(s.key)}
          >
            {pick(s.name, locale)}
          </button>
        ))}
      </div>

      <div className="vet-filter vet-filter-sev">
        <button className={severity === "all" ? "is-on" : ""} onClick={() => setSeverity("all")}>
          {t.allSeverity}
        </button>
        {(["critical", "warning", "info"] as VetSeverity[]).map((k) => (
          <button
            key={k}
            className={`sev-${k}${severity === k ? " is-on" : ""}`}
            onClick={() => setSeverity(k)}
          >
            {sevLabel[k]}
          </button>
        ))}
      </div>

      <section className="vet-facts">
        {shown.length === 0 && <p className="vet-empty">{t.empty}</p>}
        {shown.map((d) => {
          const isOpen = open === d.id;
          const fact = facts.find((f) => f.id === d.factId);
          return (
            <article key={d.id} className={`vet-fact vet-disease${isOpen ? " is-open" : ""}`}>
              <button onClick={() => setOpen(isOpen ? null : d.id)}>
                <span>
                  <h3>
                    <i className={`vet-sev sev-${d.severity}`} aria-label={sevLabel[d.severity]} />
                    {pick(d.name, locale)}
                  </h3>
                  <em>{d.term}</em>
                </span>
                <i>
                  {d.species.map((k) => pick(speciesInfo(k).name, locale)).join(" · ")} ·{" "}
                  {pick(VET_SYSTEM_LABEL[d.system], locale)}
                </i>
              </button>

              {isOpen && (
                <div className="vet-fact-body">
                  <h4>{t.diseaseWhy}</h4>
                  <p>{pick(d.mechanism, locale)}</p>
                  <h4>{t.diseaseSigns}</h4>
                  <p>{pick(d.signs, locale)}</p>
                  <h4>{t.diseaseDo}</h4>
                  <p>{pick(d.management, locale)}</p>

                  {/* Mối nối về giải phẫu — lý do khu bệnh này nằm trong một atlas. */}
                  {fact && (
                    <div className="vet-related vet-disease-anatomy">
                      <h4>{t.diseaseAnatomy}</h4>
                      <p className="vet-disease-fact">
                        <strong>{pick(fact.name, locale)}</strong> <em>{fact.nav}</em>
                      </p>
                      <p>{pick(fact.note, locale)}</p>
                      <ul>
                        <li>
                          <Link href={`/dong-vat/${d.species[0]}`}>
                            {pick(speciesInfo(d.species[0]).name, locale)} →
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}

                  <p className="vet-source">
                    {t.source}: {d.source}
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </section>

      <HomeFooter locale={locale} />
    </div>
  );
}
