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
import { regionViewerConfig } from "./scenes/regions";

/** Nhóm hệ cơ quan dùng để gom scene trên trang chủ. */
export type SystemGroupKey =
  | "skeletal"
  | "muscular"
  | "nervous"
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
  { key: "nervous", slug: "he-than-kinh", label: { vi: "Hệ thần kinh", en: "Nervous system", zh: "神经系统" }, icon: "i-brain", accent: "g-nerve" },
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
  "giai-phau-canh-tay": "muscular",
  "giai-phau-cang-tay": "muscular",
  "giai-phau-dai-vai": "muscular",
  "giai-phau-dau": "skeletal",
  "giai-phau-co": "muscular",
  "giai-phau-than": "muscular",
  // Các hệ dựng sau cùng
  "he-thinh-giac": "auditory",
  "he-sinh-san-nam": "reproductive",
  "he-mac": "fascia",
  "mo-lien-ket": "connective",
  // Vùng cơ thể nhiều lớp (export_region.py)
  "giai-phau-ban-tay": "muscular",
  "khop-vai-khuyu": "skeletal",
  "khop-goi": "skeletal",
  "chau-hong-day-chau": "skeletal",
  "vung-lung": "muscular",
  "thanh-nguc": "skeletal",
  "vai-ho-nach": "muscular",
  "vung-ben": "muscular",
  "co-mat-than-kinh-vii": "muscular",
  "khop-thai-duong-ham": "skeletal",
  "cot-song-co": "skeletal",
  "cot-song-that-lung": "skeletal",
  "nao-that-mang-nao": "nervous",
  "he-tinh-mach-chu-cua": "cardiovascular",
  "tuyen-noi-tiet": "endocrine",
  "dam-roi-that-lung-cung": "nervous",
  "co-tay-ong-co-tay": "skeletal",
  "vung-mong": "muscular",
  "co-quan-sinh-duc-nam": "reproductive",
  "khop-hang-dui": "muscular",
  "cang-chan-ban-chan": "muscular",
  "so-nen-so": "skeletal",
  "hoc-mat": "visual",
  "tai-day-du": "auditory",
  "mui-xoang": "respiratory",
  "mieng-luoi-rang": "digestive",
  "hau-thanh-quan": "respiratory",
  "co-hoanh-day-du": "respiratory",
  "thanh-bung": "muscular",
  "dai-nao": "nervous",
  "than-nao-day-so-full": "nervous",
  "tieu-nao-day-du": "nervous",
  "tuy-song-dam-roi": "nervous",
  "he-dong-mach-chu": "cardiovascular",
  "he-bach-huyet": "cardiovascular",
  "tim-day-du": "cardiovascular",
  "phoi-cay-phe-quan": "respiratory",
  "trung-that": "respiratory",
  "gan-duong-mat": "digestive",
  "da-day-ta-trang": "digestive",
  "ruot-non-ruot-gia": "digestive",
  "tuy-lach": "digestive",
  "than-nieu-quan": "urinary",
  "phuc-mac-mac-treo": "digestive",
  // Thần kinh
  "than-nao-day-so": "nervous",
  "tieu-nao": "nervous",
  "gian-nao-he-vien": "nervous",
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
  // Đợt render 14/08/2026: bổ sung ảnh thật cho 42 scene trước đây rơi về
  // hình minh hoạ mặc định. Hai scene "he-noi-tiet" và "mo-lien-ket" CỐ Ý
  // không có ảnh: cấu trúc của chúng là các tuyến và túi hoạt dịch nhỏ nằm
  // rải khắp người, chụp ra gần như một khung trống — hình minh hoạ thiết
  // kế sẵn nhìn rõ ràng hơn hẳn một tấm ảnh trống.
  "ban-chan": "/thumbnails/ban-chan.jpg",
  "ban-tay": "/thumbnails/ban-tay.jpg",
  "bo-rang": "/thumbnails/bo-rang.jpg",
  "chi-duoi": "/thumbnails/chi-duoi.jpg",
  "co-bung": "/thumbnails/co-bung.jpg",
  "co-canh-tay": "/thumbnails/co-canh-tay.jpg",
  "co-dui-mong": "/thumbnails/co-dui-mong.jpg",
  "co-hoanh": "/thumbnails/co-hoanh.jpg",
  "co-mat": "/thumbnails/co-mat.jpg",
  "co-that-hau-mon": "/thumbnails/co-that-hau-mon.jpg",
  "cot-song": "/thumbnails/cot-song.jpg",
  "da-giac-willis": "/thumbnails/da-giac-willis.jpg",
  "dai-vai-chi-tren": "/thumbnails/dai-vai-chi-tren.jpg",
  "dong-mach-vanh": "/thumbnails/dong-mach-vanh.jpg",
  "giai-phau-co": "/thumbnails/giai-phau-co.jpg",
  "giai-phau-dau": "/thumbnails/giai-phau-dau.jpg",
  "giai-phau-gan": "/thumbnails/giai-phau-gan.jpg",
  "giai-phau-mat": "/thumbnails/giai-phau-mat.jpg",
  "giai-phau-phoi": "/thumbnails/giai-phau-phoi.jpg",
  "giai-phau-than": "/thumbnails/giai-phau-than.jpg",
  "giai-phau-tuy": "/thumbnails/giai-phau-tuy.jpg",
  "gian-nao-he-vien": "/thumbnails/gian-nao-he-vien.jpg",
  "he-mac": "/thumbnails/he-mac.jpg",
  "he-sinh-san-nam": "/thumbnails/he-sinh-san-nam.jpg",
  "he-thinh-giac": "/thumbnails/he-thinh-giac.jpg",
  "he-tiet-nieu": "/thumbnails/he-tiet-nieu.jpg",
  "long-nguc": "/thumbnails/long-nguc.jpg",
  "mat-cat-da-day": "/thumbnails/mat-cat-da-day.jpg",
  "mat-cat-dong-mach": "/thumbnails/mat-cat-dong-mach.jpg",
  "mat-cat-ngang-bung": "/thumbnails/mat-cat-ngang-bung.jpg",
  "mat-cat-ruot-gia": "/thumbnails/mat-cat-ruot-gia.jpg",
  "mat-cat-ruot-non": "/thumbnails/mat-cat-ruot-non.jpg",
  "mat-cat-tinh-mach": "/thumbnails/mat-cat-tinh-mach.jpg",
  "mat-cat-tui-mat": "/thumbnails/mat-cat-tui-mat.jpg",
  "mat-cat-vanh-tim": "/thumbnails/mat-cat-vanh-tim.jpg",
  "phuc-mac": "/thumbnails/phuc-mac.jpg",
  "than-nao-day-so": "/thumbnails/than-nao-day-so.jpg",
  "thanh-quan": "/thumbnails/thanh-quan.jpg",
  "tieu-nao": "/thumbnails/tieu-nao.jpg",
  "tong-quan-he-tieu-hoa": "/thumbnails/tong-quan-he-tieu-hoa.jpg",
  "xuong-chau": "/thumbnails/xuong-chau.jpg",
  "xuong-con-tai-giua": "/thumbnails/xuong-con-tai-giua.jpg",
  "giai-phau-tim": "/thumbnails/giai-phau-tim.jpg",
  "giai-phau-so": "/thumbnails/giai-phau-so.jpg",
  "giai-phau-canh-tay": "/thumbnails/giai-phau-canh-tay.jpg",
  // Render offline bằng scripts/blender/render_glb_preview.py rồi nén bằng scripts/optimize-thumbnails.mjs —
  // không phải ảnh chụp màn hình, nhưng cùng bảng màu với viewer.
  "giai-phau-cang-tay": "/thumbnails/giai-phau-cang-tay.jpg",
  "giai-phau-dai-vai": "/thumbnails/giai-phau-dai-vai.jpg",
  "so-nen-so": "/thumbnails/so-nen-so.jpg",
  "hoc-mat": "/thumbnails/hoc-mat.jpg",
  "tai-day-du": "/thumbnails/tai-day-du.jpg",
  "mui-xoang": "/thumbnails/mui-xoang.jpg",
  "mieng-luoi-rang": "/thumbnails/mieng-luoi-rang.jpg",
  "hau-thanh-quan": "/thumbnails/hau-thanh-quan.jpg",
  "co-hoanh-day-du": "/thumbnails/co-hoanh-day-du.jpg",
  "thanh-bung": "/thumbnails/thanh-bung.jpg",
  "dai-nao": "/thumbnails/dai-nao.jpg",
  "than-nao-day-so-full": "/thumbnails/than-nao-day-so-full.jpg",
  "tieu-nao-day-du": "/thumbnails/tieu-nao-day-du.jpg",
  "tuy-song-dam-roi": "/thumbnails/tuy-song-dam-roi.jpg",
  "he-dong-mach-chu": "/thumbnails/he-dong-mach-chu.jpg",
  "he-bach-huyet": "/thumbnails/he-bach-huyet.jpg",
  "tim-day-du": "/thumbnails/tim-day-du.jpg",
  "phoi-cay-phe-quan": "/thumbnails/phoi-cay-phe-quan.jpg",
  "trung-that": "/thumbnails/trung-that.jpg",
  "gan-duong-mat": "/thumbnails/gan-duong-mat.jpg",
  "da-day-ta-trang": "/thumbnails/da-day-ta-trang.jpg",
  "ruot-non-ruot-gia": "/thumbnails/ruot-non-ruot-gia.jpg",
  "tuy-lach": "/thumbnails/tuy-lach.jpg",
  "than-nieu-quan": "/thumbnails/than-nieu-quan.jpg",
  "phuc-mac-mac-treo": "/thumbnails/phuc-mac-mac-treo.jpg",
  "giai-phau-ban-tay": "/thumbnails/giai-phau-ban-tay.jpg",
  "khop-vai-khuyu": "/thumbnails/khop-vai-khuyu.jpg",
  "khop-goi": "/thumbnails/khop-goi.jpg",
  "chau-hong-day-chau": "/thumbnails/chau-hong-day-chau.jpg",
  "vung-lung": "/thumbnails/vung-lung.jpg",
  "thanh-nguc": "/thumbnails/thanh-nguc.jpg",
  "vai-ho-nach": "/thumbnails/vai-ho-nach.jpg",
  "vung-ben": "/thumbnails/vung-ben.jpg",
  "co-mat-than-kinh-vii": "/thumbnails/co-mat-than-kinh-vii.jpg",
  "khop-thai-duong-ham": "/thumbnails/khop-thai-duong-ham.jpg",
  "cot-song-co": "/thumbnails/cot-song-co.jpg",
  "cot-song-that-lung": "/thumbnails/cot-song-that-lung.jpg",
  "nao-that-mang-nao": "/thumbnails/nao-that-mang-nao.jpg",
  "he-tinh-mach-chu-cua": "/thumbnails/he-tinh-mach-chu-cua.jpg",
  "tuyen-noi-tiet": "/thumbnails/tuyen-noi-tiet.jpg",
  "dam-roi-that-lung-cung": "/thumbnails/dam-roi-that-lung-cung.jpg",
  "co-tay-ong-co-tay": "/thumbnails/co-tay-ong-co-tay.jpg",
  "vung-mong": "/thumbnails/vung-mong.jpg",
  "co-quan-sinh-duc-nam": "/thumbnails/co-quan-sinh-duc-nam.jpg",
  "khop-hang-dui": "/thumbnails/khop-hang-dui.jpg",
  "cang-chan-ban-chan": "/thumbnails/cang-chan-ban-chan.jpg",
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
  // Cánh tay flagship mở thẳng viewer nhiều lớp (bảng bật/tắt/mờ) thay vì trang scene thường
  href:
    scene.slug === "giai-phau-canh-tay" ? "/xem-canh-tay"
    : scene.slug === "giai-phau-cang-tay" ? "/xem-cang-tay"
    : scene.slug === "giai-phau-dai-vai" ? "/xem-vai"
    : scene.slug === "giai-phau-dau" ? "/xem-dau"
    : scene.slug === "giai-phau-co" ? "/xem-co"
    : scene.slug === "giai-phau-than" ? "/xem-than"
    : regionViewerConfig[scene.slug] ? `/xem/${scene.slug}`
    : `/giai-phau/mo-hinh/${scene.slug}`,
  thumb: thumbnails[scene.slug],
  structureCount: scene.hotspots.length,
  searchText: buildSearchText(scene),
}));

const byslug = new Map(catalogScenes.map((s) => [s.slug, s]));

export const getScene = (slug: string): CatalogScene | undefined => byslug.get(slug);

/** Vùng cơ thể — dùng cho trang "Giải phẫu theo vùng". */
export type RegionKey =
  | "head-neck" | "thorax" | "abdomen" | "back" | "upper-limb" | "pelvis" | "lower-limb";

export const regionGroups: { key: RegionKey; label: T3; icon: string }[] = [
  { key: "head-neck", label: { vi: "Đầu và cổ", en: "Head and neck", zh: "头颈部" }, icon: "i-brain" },
  { key: "thorax", label: { vi: "Ngực", en: "Thorax", zh: "胸部" }, icon: "i-heart" },
  { key: "abdomen", label: { vi: "Bụng", en: "Abdomen", zh: "腹部" }, icon: "i-stomach" },
  { key: "back", label: { vi: "Lưng và cột sống", en: "Back and spine", zh: "背部与脊柱" }, icon: "i-bone" },
  { key: "upper-limb", label: { vi: "Chi trên", en: "Upper limb", zh: "上肢" }, icon: "i-muscle" },
  { key: "pelvis", label: { vi: "Chậu hông", en: "Pelvis", zh: "骨盆" }, icon: "i-bone" },
  { key: "lower-limb", label: { vi: "Chi dưới", en: "Lower limb", zh: "下肢" }, icon: "i-muscle" },
];

/**
 * Scene nằm ở vùng cơ thể nào. Khai báo tường minh vì một scene có thể thuộc
 * hệ này nhưng nằm ở vùng khác (VD "he-bach-huyet" thuộc hệ tuần hoàn nhưng
 * trải khắp người, "co-hoanh" thuộc hô hấp nhưng nằm ở ranh giới ngực–bụng).
 * Scene toàn thân (hệ động mạch chủ, hệ bạch huyết, hệ mạc…) cố ý KHÔNG gán
 * vùng — chúng xuất hiện ở "Tất cả mô hình" chứ không thuộc vùng nào.
 */
const sceneRegion: Record<string, RegionKey> = {
  // Đầu – mặt – cổ
  "giai-phau-dau": "head-neck", "giai-phau-co": "head-neck", "so-nen-so": "head-neck",
  "giai-phau-so": "head-neck", "hoc-mat": "head-neck", "giai-phau-mat": "head-neck",
  "tai-day-du": "head-neck", "he-thinh-giac": "head-neck", "xuong-con-tai-giua": "head-neck",
  "mui-xoang": "head-neck", "mieng-luoi-rang": "head-neck", "bo-rang": "head-neck",
  "hau-thanh-quan": "head-neck", "thanh-quan": "head-neck", "co-mat": "head-neck",
  "dai-nao": "head-neck", "than-nao-day-so": "head-neck", "than-nao-day-so-full": "head-neck",
  "tieu-nao": "head-neck", "tieu-nao-day-du": "head-neck", "gian-nao-he-vien": "head-neck",
  "da-giac-willis": "head-neck",
  // Ngực
  "giai-phau-than": "thorax", "tim-day-du": "thorax", "giai-phau-tim": "thorax",
  "mat-cat-vanh-tim": "thorax", "dong-mach-vanh": "thorax", "phoi-cay-phe-quan": "thorax",
  "giai-phau-phoi": "thorax", "trung-that": "thorax", "long-nguc": "thorax",
  "co-hoanh-day-du": "thorax", "co-hoanh": "thorax",
  // Bụng
  "thanh-bung": "abdomen", "co-bung": "abdomen", "mat-cat-ngang-bung": "abdomen",
  "gan-duong-mat": "abdomen", "giai-phau-gan": "abdomen", "mat-cat-tui-mat": "abdomen",
  "da-day-ta-trang": "abdomen", "mat-cat-da-day": "abdomen", "ruot-non-ruot-gia": "abdomen",
  "mat-cat-ruot-non": "abdomen", "mat-cat-ruot-gia": "abdomen", "tuy-lach": "abdomen",
  "giai-phau-tuy": "abdomen", "than-nieu-quan": "abdomen", "he-tiet-nieu": "abdomen",
  "phuc-mac-mac-treo": "abdomen", "phuc-mac": "abdomen", "tong-quan-he-tieu-hoa": "abdomen",
  "mat-cat-dong-mach": "abdomen", "mat-cat-tinh-mach": "abdomen",
  // Lưng và cột sống
  "cot-song": "back", "tuy-song-dam-roi": "back",
  // Chi trên
  "giai-phau-dai-vai": "upper-limb", "giai-phau-canh-tay": "upper-limb",
  "giai-phau-cang-tay": "upper-limb", "giai-phau-ban-tay": "upper-limb",
  "khop-vai-khuyu": "upper-limb", "co-canh-tay": "upper-limb",
  "dai-vai-chi-tren": "upper-limb", "ban-tay": "upper-limb",
  // Chậu hông
  "xuong-chau": "pelvis", "he-sinh-san-nam": "pelvis", "co-that-hau-mon": "pelvis",
  // Chi dưới
  "co-dui-mong": "lower-limb", "chi-duoi": "lower-limb", "ban-chan": "lower-limb",
};

export const scenesOfRegion = (key: RegionKey): CatalogScene[] =>
  catalogScenes.filter((s) => sceneRegion[s.slug] === key);

/** Scene không gắn vùng nào (toàn thân) — kiểm tra để không bỏ sót khi thêm scene mới. */
export const scenesWithoutRegion = (): CatalogScene[] =>
  catalogScenes.filter((s) => !sceneRegion[s.slug]);

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
  "giai-phau-dau",
  "giai-phau-canh-tay",
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
