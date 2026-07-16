import { homeContent as C, pick, type Loc, type T3 } from "@/lib/homeContent";
import IconSprite, { Icon } from "./IconSprite";
import HomeNav from "./HomeNav";

type Card = { img: string; title: T3; sub?: T3; lock?: boolean; badge?: T3 };

function SmallCard({ card, locale }: { card: Card; locale: Loc }) {
  return (
    <div className="card sm">
      <div className={`img ${card.img}`}>
        {card.badge && <span className="badge-vet">{pick(card.badge, locale)}</span>}
        <div className="figline" />
        {card.lock && <span className="lock"><Icon id="i-lock" /></span>}
      </div>
      <div className="cap">
        <div className="t">{pick(card.title, locale)}</div>
        {card.sub && <div className="s">{pick(card.sub, locale)}</div>}
      </div>
    </div>
  );
}

function CardRow({ title, cards, locale }: { title: T3; cards: Card[]; locale: Loc }) {
  return (
    <section className="sec">
      <div className="wrap">
        <div className="sec-head">
          <h2>{pick(title, locale)}</h2>
          <div className="arrows">
            <span className="arrow"><Icon id="i-left" /></span>
            <span className="arrow"><Icon id="i-right" /></span>
          </div>
        </div>
        <div className="row c5">
          {cards.map((c, i) => <SmallCard key={i} card={c} locale={locale} />)}
        </div>
      </div>
    </section>
  );
}

export default function HomePage({ locale }: { locale: Loc }) {
  return (
    <div className="bd">
      <IconSprite />
      <HomeNav />

      <header className="hero">
        <div className="wrap">
          <div className="hero-copy">
            <h1>{pick(C.hero.title, locale)}</h1>
            <div className="search">
              <Icon id="i-spark" className="isvg sp" />
              <input placeholder={pick(C.hero.search, locale)} />
              <button className="go">{pick(C.hero.searchBtn, locale)}</button>
            </div>
            <div className="chips">
              {C.hero.chips.map((c, i) => (
                <span key={i} className="chip"><Icon id="i-search" /> {pick(c, locale)}</span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="sec first">
        <div className="wrap">
          <div className="sec-head">
            <h2>{pick(C.sections.expert, locale)}</h2>
            <div className="arrows">
              <span className="arrow"><Icon id="i-left" /></span>
              <span className="arrow"><Icon id="i-right" /></span>
            </div>
          </div>
          <div className="row c3">
            {C.collections.map((c, i) => (
              <div key={i} className="card col-card">
                <div className={`img ${c.img}`}>
                  <div className="figline" />
                  <span className="lock"><Icon id="i-lock" /></span>
                </div>
                <div className={`col-foot ${c.color}`}>
                  <h3>{pick(c.title, locale)}</h3>
                  <div className="who">{pick(c.author, locale)}</div>
                  <div className="role">{pick(c.role, locale)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CardRow title={C.sections.whatsNew} cards={C.whatsNew} locale={locale} />

      <section className="sec">
        <div className="wrap">
          <div className="feat">
            <div className="fbig cream">
              <div className="figpair" />
              <h3>{pick(C.feature.completeTitle, locale)}</h3>
              <p>{pick(C.feature.completeDesc, locale)}</p>
              <div className="launch-btns">
                <button className="lb">{pick(C.feature.female, locale)}</button>
                <button className="lb">{pick(C.feature.male, locale)}</button>
              </div>
            </div>
            <div className="fside">
              <div className="fcol blue">
                <span className="exp"><Icon id="i-expand" /></span>
                <h3>{pick(C.feature.studioT, locale)}</h3>
                <p>{pick(C.feature.studioD, locale)}</p>
              </div>
              <div className="fcol purple">
                <span className="exp"><Icon id="i-expand" /></span>
                <h3>{pick(C.feature.vrT, locale)}</h3>
                <p>{pick(C.feature.vrD, locale)}</p>
              </div>
              <div className="fcol dark">
                <span className="exp"><Icon id="i-expand" /></span>
                <h3>{pick(C.feature.svcT, locale)}</h3>
                <p>{pick(C.feature.svcD, locale)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CardRow title={C.sections.featured} cards={C.featured} locale={locale} />
      <CardRow title={C.sections.journeys} cards={C.journeys} locale={locale} />

      <footer className="foot">
        <div className="wrap">
          <div className="grid">
            <div>
              <div className="brand" style={{ fontSize: 18 }}><span className="mk">S</span>Soma&nbsp;3D</div>
              <p className="lic">{pick(C.footer.lic, locale)}</p>
            </div>
            <div>
              <h4>{pick(C.footer.productH, locale)}</h4>
              {C.footer.product.map((a, i) => <a key={i}>{pick(a, locale)}</a>)}
            </div>
            <div>
              <h4>{pick(C.footer.resourcesH, locale)}</h4>
              {C.footer.resources.map((a, i) => <a key={i}>{pick(a, locale)}</a>)}
            </div>
            <div>
              <h4>{pick(C.footer.languageH, locale)}</h4>
              {C.footer.languages.map((a, i) => <a key={i}>{pick(a, locale)}</a>)}
            </div>
          </div>
          <div className="bottom"><span>SOMA 3D · 2026</span><span>WEBGL · glTF · DRACO</span></div>
        </div>
      </footer>
    </div>
  );
}
