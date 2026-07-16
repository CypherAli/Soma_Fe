import { pick, type Loc } from "@/lib/homeContent";
import type { CategoryData, CategorySlug } from "@/lib/exploreContent";
import IconSprite, { Icon } from "../home/IconSprite";
import HomeNav from "../home/HomeNav";
import CategorySidebar from "./CategorySidebar";
import ExploreResults from "./ExploreResults";
import "../../app/home.css";

export default function ExplorePage({
  data,
  locale,
}: {
  data: CategoryData;
  locale: Loc;
}) {
  return (
    <div className="bd">
      <IconSprite />
      <HomeNav />

      <div className="explore-tabs">
        <span className="explore-tab active">
          {locale === "vi" ? "Khám phá" : locale === "zh" ? "探索" : "Explore"}
        </span>
      </div>

      <div className="explore-shell">
        <CategorySidebar locale={locale} active={data.slug as CategorySlug} />

        <main className="explore-main">
          <div className="page-head">
            <span className="ic"><Icon id={data.icon} /></span>
            <h1>{pick(data.title, locale)}</h1>
            <span className="count">
              {data.cards.length} {locale === "vi" ? "kết quả" : locale === "zh" ? "个结果" : "results"}
            </span>
          </div>

          <ExploreResults data={data} locale={locale} />
        </main>
      </div>
    </div>
  );
}
