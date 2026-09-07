import { getSceneModule } from "@/lib/sceneModules";
import { regionViewerConfig } from "@/lib/scenes/regions";
import type { CatKey } from "./layers";
import type { T3 } from "@/lib/homeContent";

/**
 * MÔ HÌNH BÓC LỚP ĐƯỢC — tra cứu dùng chung.
 *
 * Vì sao cần: chế độ điều khiển bằng cử chỉ chỉ có nghĩa với model NHIỀU LỚP
 * (da → cơ → mạch → thần kinh → xương); model một khối thì không có gì để bóc.
 * Danh sách ấy trước nay nằm rải ở hai chỗ:
 *   • `regionViewerConfig` — khoảng 90 vùng, dùng chung route /xem/<slug>.
 *   • Sáu model flagship — mỗi cái một file route riêng, cấu hình viết thẳng
 *     trong JSX (xem-cang-tay, xem-canh-tay, xem-vai, xem-dau, xem-co, xem-than).
 * Trang cử chỉ cần biết CẢ HAI, nên gộp lại đây thay vì chép tay lần thứ ba.
 *
 * (Các route flagship vẫn giữ cấu hình cũ của chúng — đổi cả sáu file đó là
 * việc dọn dẹp riêng, không gánh vào tính năng này.)
 */

export type LayeredModel = {
  slug: string;
  /** Đường dẫn .glb thật trong /public. */
  url: string;
  /** Các lớp có trong model này — bảng bật/tắt chỉ hiện đúng ngần này. */
  cats: CatKey[];
  /** Lớp bật sẵn ở chế độ mờ (thường là da, để nhìn xuyên qua). */
  faded: CatKey[];
  title: T3;
};

/** Sáu model flagship, cấu hình đối chiếu đúng với các file route tương ứng. */
const FLAGSHIP: Record<string, { url: string; cats: CatKey[]; faded: CatKey[] }> = {
  "giai-phau-cang-tay": {
    url: "/models/forearm.glb",
    cats: ["skin", "muscle", "artery", "vein", "nerve", "bone"],
    faded: ["skin"],
  },
  "giai-phau-canh-tay": {
    url: "/models/arm.glb",
    cats: ["skin", "muscle", "artery", "vein", "nerve", "lymph", "bone"],
    faded: ["skin"],
  },
  "giai-phau-dai-vai": {
    url: "/models/shoulder.glb",
    cats: ["skin", "muscle", "artery", "vein", "nerve", "lymph", "bone"],
    faded: ["skin"],
  },
  "giai-phau-dau": {
    url: "/models/head.glb",
    cats: ["skin", "muscle", "artery", "vein", "nerve", "eye", "brain", "bone"],
    faded: ["skin"],
  },
  "giai-phau-co": {
    url: "/models/neck.glb",
    cats: ["skin", "muscle", "artery", "vein", "nerve", "lymph", "bone"],
    faded: ["skin"],
  },
  "giai-phau-than": {
    url: "/models/trunk.glb",
    cats: ["skin", "muscle", "organ", "artery", "vein", "nerve", "lymph", "bone"],
    faded: ["skin"],
  },
};

/** Mô hình bóc lớp của một scene, hoặc `undefined` nếu scene đó là model một khối. */
export function getLayeredModel(slug: string): LayeredModel | undefined {
  const mod = getSceneModule(slug);
  if (!mod) return undefined;

  const flag = FLAGSHIP[slug];
  if (flag) return { slug, url: flag.url, cats: flag.cats, faded: flag.faded, title: mod.title };

  const view = regionViewerConfig[slug];
  if (!view || !mod.modelFile) return undefined;
  return {
    slug,
    url: mod.modelFile,
    cats: view.cats as CatKey[],
    faded: (view.faded ?? []) as CatKey[],
    title: mod.title,
  };
}

/** Mô hình mặc định của chế độ điều khiển — cẳng tay, đúng như trước nay. */
export const DEFAULT_LAYERED_SLUG = "giai-phau-cang-tay";
