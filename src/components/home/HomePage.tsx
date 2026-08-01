import { homeContent as C, pick, type Loc } from "@/lib/homeContent";
import { Link } from "@/i18n/navigation";
import IconSprite from "./IconSprite";
import HomeNav from "./HomeNav";
import HomeSearch from "./HomeSearch";
import HomeFooter from "./HomeFooter";

export default function HomePage({ locale }: { locale: Loc }) {
  const cols = [C.twoCol.corpus, C.twoCol.anima] as const;

  return (
    <div className="bd">
      <IconSprite />
      <HomeNav />

      <header className="hero">
        <div className="wrap">
          <div className="hero-copy">
            <h1 className="hero-display">
              {pick(C.hero.titlePre, locale)}{" "}
              <em>{pick(C.hero.titleAccent, locale)}</em>{" "}
              {pick(C.hero.titlePost, locale)}
            </h1>
            <p className="hero-lede">{pick(C.hero.lede, locale)}</p>
            <HomeSearch locale={locale} />
            <div className="hero-cta">
              <Link href="/nguoi" className="pill pill-solid">
                {pick(C.hero.ctaPrimary, locale)}
              </Link>
              <Link href="/giai-phau/theo-vung" className="pill pill-ghost">
                {pick(C.hero.ctaSecondary, locale)}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Khối 2 cột: Corpus (người) · Anima (thú y) — như mẫu Corpus & Anima */}
      <section className="twocol">
        <div className="twocol-inner">
          {cols.map((col, i) => (
            <Link
              key={i}
              href={col.href}
              className={`tc-panel ${i === 0 ? "tc-corpus" : "tc-anima"}`}
            >
              <div className="tc-copy">
                <div className="tc-top">
                  <span className="tc-kicker">{pick(col.kicker, locale)}</span>
                  <span className="tc-meta">{pick(col.meta, locale)}</span>
                </div>
                <h2 className="tc-title">{pick(col.title, locale)}</h2>
                <p className="tc-latin">{pick(col.latin, locale)}</p>
                <p className="tc-text">{pick(col.body, locale)}</p>
                <span className="tc-cta">
                  {pick(col.cta, locale)} <span className="tc-arrow">→</span>
                </span>
              </div>
              {/* Ô ảnh: sọ người (Corpus) · sọ mèo (Anima) — file ở public/plates/ */}
              <div
                className="tc-fig"
                style={col.img ? { backgroundImage: `url(${col.img})` } : undefined}
                aria-hidden
              />
            </Link>
          ))}
        </div>
      </section>

      <HomeFooter locale={locale} />
    </div>
  );
}
