
import { ContentSurface } from "@/components/content/ContentProvider";
import { pick, type Loc } from "@/lib/homeContent";
import type { CategoryData, CategorySlug } from "@/lib/exploreContent";
import IconSprite from "../home/IconSprite";
import AtlasIcon from "./AtlasIcon";
import HomeNav from "../home/HomeNav";
import CategorySidebar from "./CategorySidebar";
import ExploreResults from "./ExploreResults";
import SystemsAtlas, { RegionsAtlas } from "./SystemsAtlas";
import "../../app/home.css";

export default function ExplorePage({
  data,
  locale,
  activeSlug,
}: {
  data: CategoryData;
  locale: Loc;
  /** Slug URL đang mở — dùng để sáng đúng mục trong sidebar (trang của một hệ
      hay một vùng dùng chung `data.slug` "theo-he"/"theo-vung"). */
  activeSlug?: string;
}) {
  /** Trang gốc "Giải phẫu theo hệ" (không phải trang của MỘT hệ, vốn cũng mang slug theo-he). */
  const systemsHome = activeSlug === "theo-he";
  /** Trang gốc "Giải phẫu theo vùng" — cùng bố cục mục lục + từng khu như theo hệ. */
  const regionsHome = activeSlug === "theo-vung";
  const copy = {
    eyebrow: locale === "vi" ? "THƯ VIỆN GIẢI PHẪU" : locale === "zh" ? "解剖学图谱" : "ANATOMY LIBRARY",
    description: regionsHome
      ? locale === "vi"
        ? "Học giải phẫu định khu theo từng vùng cơ thể: chọn một vùng trong mục lục, đọc giới thiệu rồi mở bài học 3D của vùng đó."
        : locale === "zh"
          ? "按身体区域学习局部解剖：在目录中选择一个区域，阅读简介，再打开该区域的三维课程。"
          : "Study regional anatomy one body region at a time: pick a region from the index, read its overview, then open its 3D lessons."
      : systemsHome
      ? locale === "vi"
        ? "Học giải phẫu theo từng hệ cơ quan: chọn một hệ trong mục lục, đọc giới thiệu rồi mở bài học 3D của hệ đó."
        : locale === "zh"
          ? "按器官系统学习解剖：在目录中选择一个系统，阅读简介，再打开该系统的三维课程。"
          : "Study anatomy one organ system at a time: pick a system from the index, read its overview, then open its 3D lessons."
      : locale === "vi"
        ? "Khám phá các lát cắt, cấu trúc vi thể và mô hình 3D được sắp xếp theo ngữ cảnh lâm sàng."
        : locale === "zh"
          ? "探索按临床语境整理的切面、显微结构与三维模型。"
          : "Explore cross-sections, microscopic structures and 3D models organised for clinical study.",
    models: locale === "vi" ? "mô hình" : locale === "zh" ? "个模型" : "models",
  };

  return <ContentSurface scope="src/components/explore/ExplorePage.tsx">{(
    <div className="bd">
      <IconSprite />
      <HomeNav />
      <div className="explore-shell">
        <CategorySidebar locale={locale} active={activeSlug ?? (data.slug as CategorySlug)} />
        <main className="explore-main">
          <header className="explore-heading">
            <span className="explore-eyebrow">{copy.eyebrow}</span>
            <div className="page-head">
              <span className="ic"><AtlasIcon id={data.icon} /></span>
              <h1>{pick(data.title, locale)}</h1>
            </div>
            <div className="explore-heading-foot">
              <p>{copy.description}</p>
              <span className="count"><b>{data.cards.length}</b> {data.unit ? pick(data.unit, locale) : copy.models}</span>
            </div>
          </header>
          {systemsHome ? (
            <SystemsAtlas locale={locale} />
          ) : regionsHome ? (
            <RegionsAtlas locale={locale} />
          ) : (
            <ExploreResults data={data} locale={locale} />
          )}
        </main>
      </div>
    </div>
  )}</ContentSurface>;
}
