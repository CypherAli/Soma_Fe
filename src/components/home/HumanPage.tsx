import { homeContent as C, pick, type Loc } from "@/lib/homeContent";
import {
  catalogStats,
  featuredScenes,
  recentScenes,
  scenesOfSystem,
  systemGroups,
} from "@/lib/catalog";
import { Link } from "@/i18n/navigation";
import IconSprite, { Icon } from "./IconSprite";
import HomeNav from "./HomeNav";
import HomeFooter from "./HomeFooter";
import SceneCarousel from "./SceneCarousel";
import SkullFigure from "./SkullFigure";
import HomeSearch from "./HomeSearch";

export default function HumanPage({ locale }: { locale: Loc }) {
  const recent = recentScenes(8);
  const featured = featuredScenes();

  return (
    <div className="bd">
      <IconSprite />
      <HomeNav />

      {/* Hero trang Người — bố cục 2 phần: chữ trái · ảnh phải (ô chờ) */}
      <header className="human-hero">
        <div className="wrap human-hero-inner">
          <div className="human-hero-copy">
            <p className="hero-eyebrow">{pick(C.humanHero.eyebrow, locale)}</p>
            <h1 className="human-hero-title">
              {pick(C.humanHero.titlePre, locale)}{" "}
              <em>{pick(C.humanHero.titleAccent, locale)}</em>
            </h1>
            <p className="hero-lede human-hero-lede">{pick(C.humanHero.lede, locale)}</p>
            <div className="hero-cta human-hero-cta">
              <Link href="/giai-phau/theo-he" className="pill pill-solid">
                {pick(C.humanHero.ctaSystem, locale)}
              </Link>
              <Link href="/giai-phau/theo-vung" className="pill pill-ghost">
                {pick(C.humanHero.ctaRegion, locale)}
              </Link>
            </div>
            <div className="human-hero-search">
              <HomeSearch locale={locale} />
            </div>
            <div className="human-stats">
              <div className="hstat">
                <b>{catalogStats.scenes}</b>
                <span>{pick(C.stats.scenes, locale)}</span>
              </div>
              <div className="hstat">
                <b>{catalogStats.systems}</b>
                <span>{pick(C.stats.systems, locale)}</span>
              </div>
              <div className="hstat">
                <b>{catalogStats.structures}</b>
                <span>{pick(C.stats.structures, locale)}</span>
              </div>
            </div>
          </div>
          {/* Ô minh hoạ: sọ 3D xoay bàn tròn (Z-Anatomy) */}
          <SkullFigure />
        </div>
      </header>

      <SceneCarousel
        title={pick(C.sections.recent, locale)}
        subtitle={pick(C.sections.recentSub, locale)}
        scenes={recent}
        locale={locale}
        viewAllHref="/giai-phau/tat-ca"
      />

      <SceneCarousel
        title={pick(C.sections.featured, locale)}
        subtitle={pick(C.sections.featuredSub, locale)}
        scenes={featured}
        locale={locale}
      />

      <section className="sec" id="he-co-quan">
        <div className="wrap">
          <div className="sec-head">
            <div className="sec-head-text">
              <h2>{pick(C.sections.bySystem, locale)}</h2>
              <p className="sec-sub">{pick(C.sections.bySystemSub, locale)}</p>
            </div>
          </div>
          <div className="sys-grid">
            {systemGroups.map((group) => {
              const count = scenesOfSystem(group.key).length;
              return (
                <Link
                  key={group.key}
                  href={`/giai-phau/${group.slug}`}
                  className={`sys-card ${group.accent}`}
                >
                  <span className="sys-icon">
                    <Icon id={group.icon} />
                  </span>
                  <h3>{pick(group.label, locale)}</h3>
                  <p>
                    {count} {pick(C.sections.modelCount, locale)}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Minh bạch nguồn dữ liệu — Phương pháp biên soạn */}
      <section className="sec" id="phuong-phap">
        <div className="wrap">
          <div className="src-block">
            <div className="src-main">
              <h2>{pick(C.sources.heading, locale)}</h2>
              <p>{pick(C.sources.body, locale)}</p>
            </div>
            {/* id để thẻ "chưa có dữ liệu" ở trang Giải phẫu trỏ thẳng tới đây
                (Mô mỡ, Hệ sinh sản nữ) thay vì bấm vào không phản ứng gì. */}
            <div className="src-gaps" id="gioi-han-du-lieu">
              <h3>{pick(C.sources.gapsHeading, locale)}</h3>
              <p>{pick(C.sources.gapsBody, locale)}</p>
            </div>
          </div>
        </div>
      </section>

      <HomeFooter locale={locale} />
    </div>
  );
}
