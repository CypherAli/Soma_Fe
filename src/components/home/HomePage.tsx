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
import HomeSearch from "./HomeSearch";
import SceneCarousel from "./SceneCarousel";

export default function HomePage({ locale }: { locale: Loc }) {
  const recent = recentScenes(8);
  const featured = featuredScenes();

  return (
    <div className="bd">
      <IconSprite />
      <HomeNav />

      <header className="hero">
        <div className="wrap">
          <div className="hero-copy">
            <h1>{pick(C.hero.title, locale)}</h1>
            <p className="hero-lede">{pick(C.hero.lede, locale)}</p>
            <HomeSearch locale={locale} />
          </div>
        </div>
      </header>

      {/* Số liệu đếm từ chính catalog — không gõ tay, không thể lệch thực tế */}
      <section className="stats">
        <div className="wrap">
          <div className="stat-row">
            <div className="stat">
              <b>{catalogStats.scenes}</b>
              <span>{pick(C.stats.scenes, locale)}</span>
            </div>
            <div className="stat">
              <b>{catalogStats.systems}</b>
              <span>{pick(C.stats.systems, locale)}</span>
            </div>
            <div className="stat">
              <b>{catalogStats.structures}</b>
              <span>{pick(C.stats.structures, locale)}</span>
            </div>
          </div>
        </div>
      </section>

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

      <section className="sec">
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
                <Link key={group.key} href={`/giai-phau/${group.slug}`} className={`sys-card ${group.accent}`}>
                  <span className="sys-icon"><Icon id={group.icon} /></span>
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

      {/* Minh bạch nguồn dữ liệu + nói thẳng chỗ nào thiếu dữ liệu thật */}
      <section className="sec">
        <div className="wrap">
          <div className="src-block">
            <div className="src-main">
              <h2>{pick(C.sources.heading, locale)}</h2>
              <p>{pick(C.sources.body, locale)}</p>
            </div>
            <div className="src-gaps">
              <h3>{pick(C.sources.gapsHeading, locale)}</h3>
              <p>{pick(C.sources.gapsBody, locale)}</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap">
          <div className="grid">
            <div>
              <div className="brand" style={{ fontSize: 18 }}>
                <span className="mk">S</span>Soma&nbsp;3D
              </div>
              <p className="lic">{pick(C.footer.lic, locale)}</p>
            </div>
            <div>
              <h4>{pick(C.footer.productH, locale)}</h4>
              {C.footer.product.map((item) => (
                <Link key={item.href} href={item.href}>
                  {pick(item.label, locale)}
                </Link>
              ))}
            </div>
            <div>
              <h4>{pick(C.footer.resourcesH, locale)}</h4>
              {C.footer.resources.map((item) =>
                item.external ? (
                  <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer">
                    {pick(item.label, locale)}
                  </a>
                ) : (
                  <Link key={item.href} href={item.href}>
                    {pick(item.label, locale)}
                  </Link>
                ),
              )}
            </div>
            <div>
              <h4>{pick(C.footer.languageH, locale)}</h4>
              {C.footer.languages.map((lang) => (
                <Link key={lang.loc} href="/" locale={lang.loc}>
                  {lang.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="bottom">
            <span>SOMA 3D · 2026</span>
            <span>WEBGL · glTF · DRACO</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
