"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import HomeNav from "@/components/home/HomeNav";
import HomeFooter from "@/components/home/HomeFooter";
import IconSprite from "@/components/home/IconSprite";
import { pick, type Loc } from "@/lib/homeContent";
import VetModelViewer from "./VetModelViewer";
import { vetCopy } from "@/lib/vet/copy";
import { VET_REGION_LABEL, VET_SYSTEM_LABEL, relatedAcrossSpecies, speciesInfo } from "@/lib/vet/knowledge";
import { vetModelsOfSpecies } from "@/lib/vet/models";
import type { VetFact, VetSpeciesKey, VetSystemKey } from "@/lib/vet/types";

/**
 * Trang một loài: trị số tham chiếu + toàn bộ mục kiến thức, lọc theo hệ.
 *
 * Mỗi mục hiện đủ bốn phần đã biên soạn (mô tả · khác biệt · lâm sàng · nguồn)
 * chứ không cắt bớt: phần "khác biệt" mới là lý do người học vào đây, cắt đi
 * thì trang này chỉ còn là bản tóm tắt sách giáo khoa.
 */
export default function VetSpeciesView({
  locale,
  speciesKey,
  facts,
}: {
  locale: Loc;
  speciesKey: VetSpeciesKey;
  facts: VetFact[];
}) {
  const t = vetCopy(locale);
  const info = speciesInfo(speciesKey);
  const [system, setSystem] = useState<VetSystemKey | "all">("all");
  const [open, setOpen] = useState<string | null>(facts[0]?.id ?? null);
  const models = vetModelsOfSpecies(speciesKey);

  const systems = useMemo(() => {
    const keys = [...new Set(facts.map((f) => f.system))];
    return keys.sort((a, b) => pick(VET_SYSTEM_LABEL[a], locale).localeCompare(pick(VET_SYSTEM_LABEL[b], locale)));
  }, [facts, locale]);

  const shown = system === "all" ? facts : facts.filter((f) => f.system === system);

  return (
    <div className="bd animal-home">
      <IconSprite />
      <HomeNav section="vet" />

      <header className="vet-species-head">
        <div>
          <Link href="/dong-vat" className="vet-back">
            ← {t.backToSpecies}
          </Link>
          <h1>{pick(info.name, locale)}</h1>
          <em>{info.latin}</em>
          <p>{pick(info.blurb, locale)}</p>
        </div>
        <dl className="vet-vitals">
          <div>
            <dt>{t.temp}</dt>
            <dd>{info.vitals.temp}</dd>
          </div>
          <div>
            <dt>{t.pulse}</dt>
            <dd>{info.vitals.pulse}</dd>
          </div>
          <div>
            <dt>{t.resp}</dt>
            <dd>{info.vitals.resp}</dd>
          </div>
          <div>
            <dt>{t.lifespan}</dt>
            <dd>{info.vitals.lifespan}</dd>
          </div>
        </dl>
      </header>

      {models.length > 0 && (
        <section className="vet-models" aria-labelledby="vet-models-h">
          <h2 id="vet-models-h">{t.modelH}</h2>
          {models.map((m) => (
            <VetModelViewer key={m.slug} locale={locale} model={m} />
          ))}
        </section>
      )}

      <div className="vet-filter">
        <button className={system === "all" ? "is-on" : ""} onClick={() => setSystem("all")}>
          {t.allSystems}
        </button>
        {systems.map((s) => (
          <button key={s} className={system === s ? "is-on" : ""} onClick={() => setSystem(s)}>
            {pick(VET_SYSTEM_LABEL[s], locale)}
          </button>
        ))}
      </div>

      <section className="vet-facts">
        {shown.length === 0 && <p className="vet-empty">{t.empty}</p>}
        {shown.map((f) => {
          const isOpen = open === f.id;
          const related = isOpen ? relatedAcrossSpecies(f) : [];
          return (
            <article key={f.id} className={`vet-fact${isOpen ? " is-open" : ""}`}>
              <button onClick={() => setOpen(isOpen ? null : f.id)}>
                <span>
                  <h3>{pick(f.name, locale)}</h3>
                  <em>{f.nav}</em>
                </span>
                <i>
                  {pick(VET_SYSTEM_LABEL[f.system], locale)} · {pick(VET_REGION_LABEL[f.region], locale)}
                </i>
              </button>
              {isOpen && (
                <div className="vet-fact-body">
                  <h4>{t.note}</h4>
                  <p>{pick(f.note, locale)}</p>
                  {f.compare && (
                    <>
                      <h4>{t.difference}</h4>
                      <p>{pick(f.compare, locale)}</p>
                    </>
                  )}
                  {f.clinical && (
                    <>
                      <h4>{t.clinical}</h4>
                      <p>{pick(f.clinical, locale)}</p>
                    </>
                  )}
                  <p className="vet-source">
                    {t.source}: {f.source}
                  </p>
                  {related.length > 0 && (
                    <div className="vet-related">
                      <h4>{t.alsoIn}</h4>
                      <ul>
                        {related.map((r) => (
                          <li key={r.id}>
                            <Link href={`/dong-vat/${r.species[0]}`}>
                              {pick(speciesInfo(r.species[0]).name, locale)} — {pick(r.name, locale)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
