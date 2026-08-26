import Image from "next/image";
import { Link } from "@/i18n/navigation";
import HomeNav from "@/components/home/HomeNav";
import HomeFooter from "@/components/home/HomeFooter";
import IconSprite from "@/components/home/IconSprite";
import { pick, type Loc } from "@/lib/homeContent";
import { vetCopy } from "@/lib/vet/copy";
import { vetModelsOfSpecies } from "@/lib/vet/models";
import {
  SPECIES,
  VET_SYSTEM_LABEL,
  allVetFacts,
  vetCounts,
  vetStats,
} from "@/lib/vet/knowledge";
import type { VetSystemKey } from "@/lib/vet/types";

/**
 * Trang chủ khu vực thú y.
 *
 * Thay cho bản cũ vốn chỉ là tờ rơi: bốn thẻ loài đều đề "ĐANG PHÁT TRIỂN",
 * không dẫn đi đâu, và ba mục nội dung chỉ hiện với tiếng Việt. Bản này lấy số
 * liệu từ kho tri thức thật, mỗi thẻ loài mở ra trang có nội dung.
 */
export default function VetHome({ locale }: { locale: Loc }) {
  const t = vetCopy(locale);
  const counts = vetCounts();
  const facts = allVetFacts();

  // Hệ nào có mục thì mới hiện — không bày ra ô trống rồi bấm vào chẳng có gì.
  const systems = (Object.keys(VET_SYSTEM_LABEL) as VetSystemKey[])
    .map((key) => ({ key, count: facts.filter((f) => f.system === key).length }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div className="bd animal-home">
      <IconSprite />
      <HomeNav minimal />

      <header className="animal-hero">
        <div className="animal-hero-copy">
          <span>{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p>{t.lead}</p>
          <div className="animal-actions">
            <a href="#species" className="pill pill-solid">
              {t.exploreCta}
            </a>
            <Link href="/dong-vat/so-sanh" className="pill pill-ghost">
              {t.compareCta}
            </Link>
            <Link href="/dong-vat/trac-nghiem" className="pill pill-ghost">
              {t.quizCta}
            </Link>
          </div>
          <div className="vet-stats">
            <div>
              <b>{vetStats.facts}</b>
              <span>{t.statsFacts}</span>
            </div>
            <div>
              <b>{vetStats.species}</b>
              <span>{t.statsSpecies}</span>
            </div>
            <div>
              <b>{vetStats.systems}</b>
              <span>{t.statsSystems}</span>
            </div>
          </div>
        </div>
        <div className="animal-hero-art">
          <Image
            src="/plates/skull-cat.jpg"
            alt="Minh họa giải phẫu sọ động vật"
            fill
            priority
            sizes="(max-width: 800px) 100vw, 48vw"
          />
          <div>
            <span>FELIS CATUS</span>
            <i />
            <span>CRANIUM · LATERALIS</span>
          </div>
        </div>
      </header>

      <section className="animal-species" id="species">
        <div className="animal-section-head">
          <div>
            <span>SPECIES INDEX</span>
            <h2>{t.speciesH}</h2>
          </div>
          <p>{t.speciesSub}</p>
        </div>
        <div className="vet-species-grid">
          {SPECIES.map((s, i) => (
            <Link key={s.key} href={`/dong-vat/${s.key}`} className="vet-species-card">
              <span className="vet-no">{String(i + 1).padStart(2, "0")}</span>
              <h3>{pick(s.name, locale)}</h3>
              <em>{s.latin}</em>
              <p>{pick(s.blurb, locale)}</p>
              <b>
                {t.entries(counts[s.key])}
                {vetModelsOfSpecies(s.key).length > 0 && <i className="vet-has-model">3D</i>}
              </b>
            </Link>
          ))}
        </div>
      </section>

      <section className="vet-systems">
        <div className="animal-section-head">
          <div>
            <span>SYSTEMA</span>
            <h2>{t.systemsH}</h2>
          </div>
          <p>{t.systemsSub}</p>
        </div>
        <div className="vet-system-grid">
          {systems.map((s) => (
            <Link key={s.key} href={`/dong-vat/so-sanh?he=${s.key}`} className="vet-system-card">
              <span>{pick(VET_SYSTEM_LABEL[s.key], locale)}</span>
              <b>{s.count}</b>
            </Link>
          ))}
        </div>
      </section>

      {/* Nói thẳng tình trạng dữ liệu 3D. Trang cũ để bốn thẻ loài mang nhãn
          "ĐANG PHÁT TRIỂN" mà không giải thích gì — người đọc không biết là
          sắp có hay không bao giờ có. */}
      <section className="vet-note">
        <div>
          <span>DATA</span>
          <h2>{t.noteH}</h2>
        </div>
        <p>{t.note3d}</p>
      </section>

      <HomeFooter locale={locale} />
    </div>
  );
}
