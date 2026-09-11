import { homeContent as C, pick, type Loc } from "@/lib/homeContent";
import {
  catalogStats,
  featuredScenes,
  recentScenes,
  scenesOfSystem,
  systemGroups,
} from "@/lib/catalog";
import IconSprite from "./IconSprite";
import HomeNav from "./HomeNav";
import HomeFooter from "./HomeFooter";
import SceneCarousel from "./SceneCarousel";
import SkullFigure from "./SkullFigure";
import HomeSearch from "./HomeSearch";
import SystemGrid from "./SystemGrid";

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
          <SystemGrid
            title={pick(C.sections.bySystem, locale)}
            subtitle={pick(C.sections.bySystemSub, locale)}
            cards={systemGroups.map((group) => ({
              key: group.key,
              slug: group.slug,
              accent: group.accent,
              icon: group.icon,
              label: pick(group.label, locale),
              count: scenesOfSystem(group.key).length,
              countLabel: pick(C.sections.modelCount, locale),
            }))}
            moreLabel={pick(C.sections.showMore, locale)}
            lessLabel={pick(C.sections.showLess, locale)}
          />
        </div>
      </section>

      <HomeFooter locale={locale} />
    </div>
  );
}
