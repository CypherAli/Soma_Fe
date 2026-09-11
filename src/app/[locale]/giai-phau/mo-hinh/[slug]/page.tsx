import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { sceneModules, getSceneModule } from "@/lib/sceneModules";
import SceneDetailPage from "@/components/scene/SceneDetailPage";
import AtlasSceneViewer from "@/components/viewer/atlas/AtlasSceneViewer";
import { atlasScenes } from "@/lib/humanAtlas/scenes";
// home.css mang style của <BrandSignature>, <ThemeToggle> và <LanguageSwitcher>
// — ba thứ AtlasSceneViewer dùng. Thiếu nó thì logo tụt về display:inline và
// quả cầu ngôn ngữ phình ra 92px. Trang /viewer nạp sẵn; route này thì không.
import "../../../../home.css";
import "../../../viewer/atlas.css";
import type { Loc } from "@/lib/homeContent";

export function generateStaticParams() {
  // Cả bài chỉ có trên atlas (bài bộ phận) chứ không riêng SceneModule.
  const slugs = new Set([...Object.keys(sceneModules), ...Object.keys(atlasScenes)]);
  return [...slugs].map((slug) => ({ slug }));
}

export default async function SceneModulePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Loc;

  /**
   * Scene nào đã dựng lại trên bộ atlas BodyParts3D thì đi đường mới: cùng bộ
   * dựng hình với trang toàn thân, nên có sẵn tách rời / mặt cắt / cô lập và
   * chi tiết hơn hẳn model .glb cắt sẵn. Scene chưa chuyển vẫn chạy đường cũ
   * (Z-Anatomy) — xem docs/atlas-coverage.md để biết cái nào chuyển được.
   */
  const atlasScene = atlasScenes[slug];
  // Bọc `.bd`: TOÀN BỘ home.css nằm dưới bộ chọn đó (`.bd .brand-signature`,
  // `.bd .language-globe`…). Thiếu lớp bọc thì logo, nút sáng/tối và bộ đổi
  // ngôn ngữ mất sạch tạo hình — quả cầu phình ra 92px. Trang /viewer đã bọc
  // sẵn nên không lộ lỗi này.
  if (atlasScene)
    return (
      <div className="bd">
        <AtlasSceneViewer scene={atlasScene} />
      </div>
    );

  const sceneModule = getSceneModule(slug);
  if (!sceneModule) notFound();

  return <SceneDetailPage module={sceneModule} locale={loc} backHref="/giai-phau/lat-cat" />;
}
