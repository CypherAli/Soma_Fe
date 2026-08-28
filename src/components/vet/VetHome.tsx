import HomeNav from "@/components/home/HomeNav";
import HomeFooter from "@/components/home/HomeFooter";
import IconSprite from "@/components/home/IconSprite";
import { pick, type Loc } from "@/lib/homeContent";
import { vetCopy } from "@/lib/vet/copy";
import VetSkullFigure from "./VetSkullFigure";
import VetGroupBrowser from "./VetGroupBrowser";
import { VET_GROUPS, speciesOfGroup, vetCounts, vetStats } from "@/lib/vet/knowledge";

/**
 * Trang chủ khu vực thú y.
 *
 * Điều hướng đi theo MỘT chiều duy nhất: nhóm → loài → cấu trúc. Bản trước có
 * hai lối song song (lưới loài phẳng, và một lưới "hệ cơ quan" dẫn sang trang
 * đối chiếu) — hai lối cùng dẫn tới một nơi thì người xem phải tự đoán nên đi
 * đường nào, và trang đối chiếu bày năm loài cạnh nhau trên một hàng thì cột
 * nào cũng hẹp, loài nào chưa có mục thì để lại một ô trống giữa bảng.
 *
 * Nay chỉ còn một lối. Hệ cơ quan vẫn còn, nhưng đúng chỗ của nó: bộ lọc bên
 * trong từng trang loài, nơi nó thực sự thu hẹp được thứ đang đọc.
 */
export default function VetHome({ locale }: { locale: Loc }) {
  const t = vetCopy(locale);
  const counts = vetCounts();

  return (
    <div className="bd animal-home">
      <IconSprite />
      <HomeNav section="vet" />

      <header className="animal-hero">
        <div className="animal-hero-copy">
          <span>{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p>{t.lead}</p>
          <div className="animal-actions">
            <a href="#dong-vat" className="pill pill-solid">
              {t.exploreCta}
            </a>
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
          <VetSkullFigure />
          <div>
            <span>FELIS CATUS</span>
            <i />
            <span>CRANIUM</span>
          </div>
        </div>
      </header>

      <section className="vet-groups" id="dong-vat">
        <div className="animal-section-head">
          <div>
            <span>ANIMALIA</span>
            <h2>{t.groupsH}</h2>
          </div>
          <p>{t.groupsSub}</p>
        </div>

        {VET_GROUPS.map((group) => {
          const species = speciesOfGroup(group.key);
          if (species.length === 0) return null;
          return (
            <div key={group.key} className="vet-group">
              <div className="vet-group-head">
                <h3>{pick(group.label, locale)}</h3>
                <p>{pick(group.blurb, locale)}</p>
              </div>
              <VetGroupBrowser locale={locale} species={species} counts={counts} />
            </div>
          );
        })}
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
