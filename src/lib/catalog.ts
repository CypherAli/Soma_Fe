/**
 * Catalog — lớp dữ liệu dùng chung cho trang chủ, tìm kiếm và trang khám phá.
 *
 * NGUỒN SỰ THẬT DUY NHẤT là `sceneModules` (mỗi entry = 1 model glTF có thật
 * đã xuất từ Blender). Trước đây danh sách scene bị chép tay lại ở
 * `exploreContent.ts` và `homeContent.ts` → sửa một chỗ quên chỗ kia.
 * Ở đây mọi thứ được DẪN XUẤT từ sceneModules nên không thể lệch nhau.
 *
 * Nguyên tắc dự án: chỉ liệt kê cấu trúc có mesh thật. Không có scene nào
 * trong file này là nội dung giữ chỗ hay hư cấu.
 */

import { pick, type Loc, type T3 } from "./homeContent";
import { sceneModules, type SceneModule } from "./sceneModules";

/** Nhóm hệ cơ quan dùng để gom scene trên trang chủ. */
export type SystemGroupKey =
  | "skeletal"
  | "muscular"
  | "cardiovascular"
  | "digestive"
  | "respiratory"
  | "urinary"
  | "endocrine"
  | "visual"
  | "auditory"
  | "reproductive"
  | "fascia"
  | "connective";

export type SystemGroup = {
  key: SystemGroupKey;
  label: T3;
  /** Slug URL tiếng Việt cho trang duyệt theo hệ: /giai-phau/<slug>. */
  slug: string;
  /** Icon id trong IconSprite. */
  icon: string;
  /** Class màu nền dùng cho card bộ sưu tập (định nghĩa trong home.css). */
  accent: string;
};

export const systemGroups: SystemGroup[] = [
  { key: "skeletal", slug: "he-xuong", label: { vi: "Hệ xương", en: "Skeletal system", zh: "骨骼系统" }, icon: "i-bone", accent: "g-bone" },
  { key: "muscular", slug: "he-co", label: { vi: "Hệ cơ", en: "Muscular system", zh: "肌肉系统" }, icon: "i-muscle", accent: "g-muscle" },
  { key: "cardiovascular", slug: "he-tuan-hoan", label: { vi: "Hệ tuần hoàn", en: "Cardiovascular system", zh: "心血管系统" }, icon: "i-heart", accent: "g-heart" },
  { key: "digestive", slug: "he-tieu-hoa", label: { vi: "Hệ tiêu hóa", en: "Digestive system", zh: "消化系统" }, icon: "i-stomach", accent: "g-organ" },
  { key: "respiratory", slug: "he-ho-hap", label: { vi: "Hệ hô hấp", en: "Respiratory system", zh: "呼吸系统" }, icon: "i-lungs", accent: "g-lung" },
  // Lưu ý: slug hệ nằm ở /giai-phau/<slug>, còn scene nằm ở
  // /giai-phau/mo-hinh/<slug> — trùng tên cũng không xung đột route.
  { key: "urinary", slug: "he-tiet-nieu", label: { vi: "Hệ tiết niệu", en: "Urinary system", zh: "泌尿系统" }, icon: "i-nephro", accent: "g-kidney" },
  { key: "endocrine", slug: "he-noi-tiet", label: { vi: "Hệ nội tiết", en: "Endocrine system", zh: "内分泌系统" }, icon: "i-cell", accent: "g-endo" },
  { key: "visual", slug: "he-thi-giac", label: { vi: "Hệ thị giác", en: "Visual system", zh: "视觉系统" }, icon: "i-eye", accent: "g-eye" },
  { key: "auditory", slug: "he-thinh-giac-nhom", label: { vi: "Hệ thính giác", en: "Auditory system", zh: "听觉系统" }, icon: "i-ear", accent: "g-ear" },
  { key: "reproductive", slug: "he-sinh-san", label: { vi: "Hệ sinh sản", en: "Reproductive system", zh: "生殖系统" }, icon: "i-gyn", accent: "g-repro" },
  { key: "fascia", slug: "he-mac-nhom", label: { vi: "Hệ mạc", en: "Fascial system", zh: "筋膜系统" }, icon: "i-cell", accent: "g-fascia" },
  { key: "connective", slug: "mo-lien-ket-nhom", label: { vi: "Mô liên kết", en: "Connective tissue", zh: "结缔组织" }, icon: "i-cell", accent: "g-connective" },
];

export const systemBySlug = new Map(systemGroups.map((g) => [g.slug, g]));
export const systemByKey = new Map(systemGroups.map((g) => [g.key, g]));

/**
 * Scene thuộc hệ nào. Khai báo tường minh vì `visibleSystems` của scene là
 * các hệ RENDER (VD scene cơ đùi bật thêm "skeletal" làm nền xương tham
 * chiếu) — không phản ánh đúng hệ mà scene thuộc về về mặt phân loại.
 */
const sceneSystem: Record<string, SystemGroupKey> = {
  // Tiêu hoá
  "mat-cat-ngang-bung": "digestive",
  "giai-phau-gan": "digestive",
  "mat-cat-da-day": "digestive",
  "giai-phau-tuy": "digestive",
  "mat-cat-ruot-non": "digestive",
  "mat-cat-ruot-gia": "digestive",
  "co-that-hau-mon": "digestive",
  "mat-cat-tui-mat": "digestive",
  "tong-quan-he-tieu-hoa": "digestive",
  "phuc-mac": "digestive",
  // Tuần hoàn
  "giai-phau-tim": "cardiovascular",
  "mat-cat-vanh-tim": "cardiovascular",
  "dong-mach-vanh": "cardiovascular",
  "da-giac-willis": "cardiovascular",
  "mat-cat-dong-mach": "cardiovascular",
  "mat-cat-tinh-mach": "cardiovascular",
  // Xương
  "giai-phau-so": "skeletal",
  "xuong-con-tai-giua": "skeletal",
  "cot-song": "skeletal",
  "long-nguc": "skeletal",
  "xuong-chau": "skeletal",
  "dai-vai-chi-tren": "skeletal",
  "ban-tay": "skeletal",
  "chi-duoi": "skeletal",
  "ban-chan": "skeletal",
  "bo-rang": "skeletal",
  // Cơ
  "co-mat": "muscular",
  "co-dui-mong": "muscular",
  "co-canh-tay": "muscular",
  "co-bung": "muscular",
  // Hô hấp
  "giai-phau-phoi": "respiratory",
  "thanh-quan": "respiratory",
  "co-hoanh": "respiratory",
  // Còn lại
  "he-noi-tiet": "endocrine",
  "he-tiet-nieu": "urinary",
  "giai-phau-mat": "visual",
  // Các hệ dựng sau cùng
  "he-thinh-giac": "auditory",
  "he-sinh-san-nam": "reproductive",
  "he-mac": "fascia",
  "mo-lien-ket": "connective",
};

export type CatalogScene = {
  slug: string;
  title: T3;
  description: T3;
  system: SystemGroupKey;
  /** Đường dẫn KHÔNG kèm locale — thêm `/${locale}` khi render. */
  href: string;
  /** Ảnh chụp thật từ model 3D, nếu đã có trong public/thumbnails/. */
  thumb?: string;
  /** Số cấu trúc được gắn nhãn trong scene. */
  structureCount: number;
  /** Tên mọi cấu trúc (Việt + Anh + Latin) — dùng cho tìm kiếm. */
  searchText: string;
};

/** Thumbnail đã chụp thật. Scene chưa có ảnh sẽ dùng icon theo hệ. */
const thumbnails: Record<string, string> = {
  "giai-phau-tim": "/thumbnails/giai-phau-tim.jpg",
  "giai-phau-so": "/thumbnails/giai-phau-so.jpg",
};

function buildSearchText(scene: SceneModule): string {
  const parts: string[] = [scene.title.vi, scene.title.en, scene.title.zh];
  for (const hotspot of scene.hotspots) {
    if (hotspot.label) parts.push(hotspot.label.vi, hotspot.label.en);
    if (hotspot.latinName) parts.push(hotspot.latinName);
    parts.push(hotspot.meshName);
  }
  return parts.join(" ").toLowerCase();
}

/**
 * Toàn bộ scene có model thật, theo THỨ TỰ XÂY DỰNG (khoá của object giữ
 * thứ tự chèn) — nhờ vậy đảo ngược mảng là ra "mới cập nhật".
 */
export const catalogScenes: CatalogScene[] = Object.values(sceneModules).map((scene) => ({
  slug: scene.slug,
  title: scene.title,
  description: scene.description,
  system: sceneSystem[scene.slug] ?? "skeletal",
  href: `/giai-phau/mo-hinh/${scene.slug}`,
  thumb: thumbnails[scene.slug],
  structureCount: scene.hotspots.length,
  searchText: buildSearchText(scene),
}));

const byslug = new Map(catalogScenes.map((s) => [s.slug, s]));

export const getScene = (slug: string): CatalogScene | undefined => byslug.get(slug);

/** Scene mới nhất trước. */
export const recentScenes = (limit: number): CatalogScene[] =>
  [...catalogScenes].reverse().slice(0, limit);

export const scenesOfSystem = (key: SystemGroupKey): CatalogScene[] =>
  catalogScenes.filter((s) => s.system === key);

/**
 * Scene tiêu biểu để giới thiệu — chọn tay theo giá trị giảng dạy, không
 * phải theo thứ tự ngẫu nhiên.
 */
export const featuredSlugs = [
  "giai-phau-tim",
  "giai-phau-gan",
  "giai-phau-so",
  "giai-phau-mat",
  "da-giac-willis",
] as const;

export const featuredScenes = (): CatalogScene[] =>
  featuredSlugs.map((slug) => byslug.get(slug)).filter((s): s is CatalogScene => s !== undefined);

/** Bỏ dấu tiếng Việt để "gan" khớp được cả "Gan" lẫn "gán". */
const deaccent = (text: string): string =>
  text.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");

/**
 * Tìm scene theo tên hệ, tên scene, hoặc tên cấu trúc bên trong (Việt, Anh,
 * Latin). Trả về mảng rỗng khi query rỗng — nơi gọi tự quyết định hiển thị gì.
 */
export function searchScenes(query: string, locale: Loc = "vi"): CatalogScene[] {
  const q = deaccent(query.trim().toLowerCase());
  if (!q) return [];

  const systemHits = new Set(
    systemGroups
      .filter((g) => deaccent(pick(g.label, locale).toLowerCase()).includes(q))
      .map((g) => g.key),
  );

  return catalogScenes.filter(
    (scene) => deaccent(scene.searchText).includes(q) || systemHits.has(scene.system),
  );
}

/** Số liệu thật hiển thị ở trang chủ — đếm từ dữ liệu, không gõ tay. */
export const catalogStats = {
  scenes: catalogScenes.length,
  systems: new Set(catalogScenes.map((s) => s.system)).size,
  structures: catalogScenes.reduce((sum, s) => sum + s.structureCount, 0),
};
