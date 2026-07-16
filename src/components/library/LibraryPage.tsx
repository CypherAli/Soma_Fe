import { pick, type Loc } from "@/lib/homeContent";
import { libraryContent as L } from "@/lib/libraryContent";
import IconSprite, { Icon } from "../home/IconSprite";
import HomeNav from "../home/HomeNav";
import { Link } from "@/i18n/navigation";
import "../../app/home.css";

export default function LibraryPage({ locale }: { locale: Loc }) {
  return (
    <div className="bd">
      <IconSprite />
      <HomeNav />

      <main className="simple-page">
        <div className="page-head">
          <h1>{pick(L.title, locale)}</h1>
          <span className="count">
            0 {locale === "vi" ? "kết quả" : locale === "zh" ? "个结果" : "results"}
          </span>
        </div>

        <div className="simple-toolbar">
          <div className="tb-search">
            <Icon id="i-search" />
            <input placeholder={pick(L.search, locale)} />
          </div>
          <div className="tb-right">
            <button className="tb-btn"><Icon id="i-sort" /> {pick(L.sort, locale)}</button>
            <button className="tb-btn"><Icon id="i-dots" /></button>
          </div>
        </div>

        <div className="empty-state">
          <h2>{pick(L.emptyTitle, locale)}</h2>
          <p>{pick(L.emptyDesc, locale)}</p>
          <Link href="/"><button className="cta">{pick(L.cta, locale)}</button></Link>
        </div>
      </main>
    </div>
  );
}
