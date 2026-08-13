import { pick, type Loc } from "@/lib/homeContent";
import type { CategoryData, CategorySlug } from "@/lib/exploreContent";
import IconSprite from "../home/IconSprite";
import AtlasIcon from "./AtlasIcon";
import HomeNav from "../home/HomeNav";
import CategorySidebar from "./CategorySidebar";
import ExploreResults from "./ExploreResults";
import "../../app/home.css";

export default function ExplorePage({ data, locale }: { data: CategoryData; locale: Loc }) {
  const copy = {
    eyebrow: locale === "vi" ? "THƯ VIỆN GIẢI PHẪU" : locale === "zh" ? "解剖学图谱" : "ANATOMY LIBRARY",
    description:
      locale === "vi"
        ? "Khám phá các lát cắt, cấu trúc vi thể và mô hình 3D được sắp xếp theo ngữ cảnh lâm sàng."
        : locale === "zh"
          ? "探索按临床语境整理的切面、显微结构与三维模型。"
          : "Explore cross-sections, microscopic structures and 3D models organised for clinical study.",
    models: locale === "vi" ? "mô hình" : locale === "zh" ? "个模型" : "models",
  };

  return (
    <div className="bd">
      <IconSprite />
      <HomeNav />
      <div className="explore-shell">
        <CategorySidebar locale={locale} active={data.slug as CategorySlug} />
        <main className="explore-main">
          <header className="explore-heading">
            <span className="explore-eyebrow">{copy.eyebrow}</span>
            <div className="page-head">
              <span className="ic"><AtlasIcon id={data.icon} /></span>
              <h1>{pick(data.title, locale)}</h1>
            </div>
            <div className="explore-heading-foot">
              <p>{copy.description}</p>
              <span className="count"><b>{data.cards.length}</b> {copy.models}</span>
            </div>
          </header>
          <ExploreResults data={data} locale={locale} />
        </main>
      </div>
    </div>
  );
}
