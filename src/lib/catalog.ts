
import { bindContentSource } from "@/lib/content/source";
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
import { atlasScenes, atlasSceneAliases } from "./humanAtlas/scenes";

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

export const systemGroups: SystemGroup[] = bindContentSource("data:src/lib/catalog.ts#systemGroups", [
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
]);

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
  "tong-quan-he-tieu-hoa": "digestive",
  // Tuần hoàn
  "giai-phau-tim": "cardiovascular",
  "dong-mach-vanh": "cardiovascular",
  "da-giac-willis": "cardiovascular",
  // Xương
  "giai-phau-so": "skeletal",
  "cot-song": "skeletal",
  "long-nguc": "skeletal",
  "dai-vai-chi-tren": "skeletal",
  "ban-tay": "skeletal",
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
  "khop-hang": "skeletal",
  "cot-song-nguc": "skeletal",
  "ban-chan-chi-tiet": "skeletal",
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
  "tuyen-nuoc-bot": "digestive",
  "xoang-tinh-mach-mang-cung": "cardiovascular",
  "ho-khoeo": "muscular",
  "tam-giac-co": "muscular",
  "khoang-sau-phuc-mac": "urinary",
  "khop-khuyu": "skeletal",
  "khop-co-chan": "skeletal",
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
  "hoi-vo-dai-nao": "nervous",
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
  // Đợt vùng thứ năm — 14 vùng chuyên đề (xem scenes/regions6.ts)
  "dam-roi-canh-tay": "nervous",
  "than-kinh-tu-chu": "nervous",
  "duong-thi-giac": "visual",
  "dong-mach-canh": "cardiovascular",
  "vung-nguc-tuyen-vu": "muscular",
  "thuc-quan": "digestive",
  "bang-quang-tien-liet": "urinary",
  "khop-cung-chau": "skeletal",
  "chop-xoay-vai": "muscular",
  "gan-got-ong-co-chan": "muscular",
  "tinh-mach-hien": "cardiovascular",
  "hach-co": "cardiovascular",
  "mang-phoi": "respiratory",
  "tuyen-giap": "endocrine",
  // Đợt vùng thứ sáu — 10 vùng chuyên đề (scenes/regions8–10.ts)
  "than-kinh-sinh-ba": "nervous",
  "le-dao": "visual",
  "ho-duoi-thai-duong": "muscular",
  "co-vung-gay": "muscular",
  "khop-uc-don": "skeletal",
  "ong-song-that-lung": "nervous",
  "tam-giac-dui": "muscular",
  "dong-mach-chi-tren": "cardiovascular",
  "tinh-mach-chi-tren": "cardiovascular",
  "dong-mach-chi-duoi": "cardiovascular",
  // Mốc xương – nguyên uỷ – bám tận (scenes/regions13.ts)
  "moc-xuong-chi-tren": "skeletal",
  "moc-xuong-chi-duoi": "skeletal",
  // Đợt vùng thứ bảy — 6 vùng chuyên đề (scenes/regions11–12.ts)
  "ho-khuyu": "muscular",
  "mach-mac-treo": "digestive",
  "goc-cau-tieu-nao": "nervous",
  "dai-chau-chay": "muscular",
  "than-kinh-toa": "nervous",
  "can-nguc-that-lung": "muscular",
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
  // hình minh hoạ mặc định.
  //
  // Đợt 23/08/2026: bổ sung 14 scene mới (regions6/7) và ĐÓNG NỐT hai scene
  // trước đây cố ý để trống ảnh — "he-noi-tiet" và "mo-lien-ket". Lý do bỏ
  // trống trước kia vẫn đúng (tuyến nội tiết và túi hoạt dịch là những mảnh
  // nhỏ rải khắp người, khung hình mặc định chụp ra gần như một tấm trống),
  // nên hai ảnh này render bằng THAM SỐ ZOOM của render_glb_preview.py
  // (0,5 và 0,45) để cắt sát vào cụm cấu trúc thay vì lấy trọn hộp bao:
  //   blender -b --python scripts/blender/render_glb_preview.py --   //     public/models/endocrine_system.glb public/thumbnails/he-noi-tiet.png 1.0 head "" 0.5 ""
  // Chạy `render-thumbnails.mjs` cho hai slug này sẽ ghi đè bằng khung mặc
  // định (ảnh trống) — phải render lại bằng lệnh trên.
  "ban-chan": "/thumbnails/ban-chan.jpg",
  "ban-tay": "/thumbnails/ban-tay.jpg",
  "bo-rang": "/thumbnails/bo-rang.jpg",
  "co-bung": "/thumbnails/co-bung.jpg",
  "co-canh-tay": "/thumbnails/co-canh-tay.jpg",
  "co-dui-mong": "/thumbnails/co-dui-mong.jpg",
  "co-mat": "/thumbnails/co-mat.jpg",
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
  "gian-nao-he-vien": "/thumbnails/gian-nao-he-vien.jpg",
  "he-mac": "/thumbnails/he-mac.jpg",
  "he-sinh-san-nam": "/thumbnails/he-sinh-san-nam.jpg",
  "he-thinh-giac": "/thumbnails/he-thinh-giac.jpg",
  "he-tiet-nieu": "/thumbnails/he-tiet-nieu.jpg",
  "long-nguc": "/thumbnails/long-nguc.jpg",
  "mat-cat-ngang-bung": "/thumbnails/mat-cat-ngang-bung.jpg",
  "than-nao-day-so": "/thumbnails/than-nao-day-so.jpg",
  "thanh-quan": "/thumbnails/thanh-quan.jpg",
  "tieu-nao": "/thumbnails/tieu-nao.jpg",
  "tong-quan-he-tieu-hoa": "/thumbnails/tong-quan-he-tieu-hoa.jpg",
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
  "hoi-vo-dai-nao": "/thumbnails/tieu-nao-day-du.jpg",
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
  "tuyen-nuoc-bot": "/thumbnails/tuyen-nuoc-bot.jpg",
  "xoang-tinh-mach-mang-cung": "/thumbnails/xoang-tinh-mach-mang-cung.jpg",
  "ho-khoeo": "/thumbnails/ho-khoeo.jpg",
  "tam-giac-co": "/thumbnails/tam-giac-co.jpg",
  "khoang-sau-phuc-mac": "/thumbnails/khoang-sau-phuc-mac.jpg",
  "khop-khuyu": "/thumbnails/khop-khuyu.jpg",
  "khop-co-chan": "/thumbnails/khop-co-chan.jpg",
  "khop-hang-dui": "/thumbnails/khop-hang-dui.jpg",
  "cang-chan-ban-chan": "/thumbnails/cang-chan-ban-chan.jpg",
  "khop-hang": "/thumbnails/khop-hang.jpg",
  "cot-song-nguc": "/thumbnails/cot-song-nguc.jpg",
  "ban-chan-chi-tiet": "/thumbnails/ban-chan-chi-tiet.jpg",
  "dam-roi-canh-tay": "/thumbnails/dam-roi-canh-tay.jpg",
  "than-kinh-tu-chu": "/thumbnails/than-kinh-tu-chu.jpg",
  "duong-thi-giac": "/thumbnails/duong-thi-giac.jpg",
  "dong-mach-canh": "/thumbnails/dong-mach-canh.jpg",
  "vung-nguc-tuyen-vu": "/thumbnails/vung-nguc-tuyen-vu.jpg",
  "thuc-quan": "/thumbnails/thuc-quan.jpg",
  "bang-quang-tien-liet": "/thumbnails/bang-quang-tien-liet.jpg",
  "khop-cung-chau": "/thumbnails/khop-cung-chau.jpg",
  "chop-xoay-vai": "/thumbnails/chop-xoay-vai.jpg",
  "gan-got-ong-co-chan": "/thumbnails/gan-got-ong-co-chan.jpg",
  "tinh-mach-hien": "/thumbnails/tinh-mach-hien.jpg",
  "hach-co": "/thumbnails/hach-co.jpg",
  "mang-phoi": "/thumbnails/mang-phoi.jpg",
  "tuyen-giap": "/thumbnails/tuyen-giap.jpg",
  "he-noi-tiet": "/thumbnails/he-noi-tiet.jpg",
  "mo-lien-ket": "/thumbnails/mo-lien-ket.jpg",
  "than-kinh-sinh-ba": "/thumbnails/than-kinh-sinh-ba.jpg",
  "le-dao": "/thumbnails/le-dao.jpg",
  "ho-duoi-thai-duong": "/thumbnails/ho-duoi-thai-duong.jpg",
  "co-vung-gay": "/thumbnails/co-vung-gay.jpg",
  "khop-uc-don": "/thumbnails/khop-uc-don.jpg",
  "ong-song-that-lung": "/thumbnails/ong-song-that-lung.jpg",
  "tam-giac-dui": "/thumbnails/tam-giac-dui.jpg",
  "dong-mach-chi-tren": "/thumbnails/dong-mach-chi-tren.jpg",
  "tinh-mach-chi-tren": "/thumbnails/tinh-mach-chi-tren.jpg",
  "dong-mach-chi-duoi": "/thumbnails/dong-mach-chi-duoi.jpg",
  "ho-khuyu": "/thumbnails/ho-khuyu.jpg",
  "mach-mac-treo": "/thumbnails/mach-mac-treo.jpg",
  "goc-cau-tieu-nao": "/thumbnails/goc-cau-tieu-nao.jpg",
  "dai-chau-chay": "/thumbnails/dai-chau-chay.jpg",
  "than-kinh-toa": "/thumbnails/than-kinh-toa.jpg",
  "can-nguc-that-lung": "/thumbnails/can-nguc-that-lung.jpg",
  "moc-xuong-chi-tren": "/thumbnails/moc-xuong-chi-tren.jpg",
  "moc-xuong-chi-duoi": "/thumbnails/moc-xuong-chi-duoi.jpg",
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
/**
 * Slug đã có scene atlas: thẻ lấy tiêu đề/mô tả/hệ từ scene atlas (một số bài
 * đã ĐỔI CHỦ ĐỀ vì atlas thiếu cấu trúc cốt lõi của bài cũ) và luôn mở trang
 * atlas, không rẽ sang viewer Z-Anatomy /xem-*.
 */
function atlasCard(scene: SceneModule): Partial<CatalogScene> | null {
  const a = atlasScenes[scene.slug];
  if (!a) return null;
  const names = a.groups.map((g) => [g.name.vi, g.name.en, g.name.zh, g.latin ?? "", ...(g.landmarks ?? []).flatMap(m => [m.name.vi, m.name.en, m.name.zh, m.latin])].join(" "));
  return {
    title: a.title,
    description: a.intro,
    ...(a.system ? { system: a.system as SystemGroupKey } : {}),
    href: `/giai-phau/mo-hinh/${scene.slug}`,
    structureCount: a.groups.length,
    searchText: [a.title.vi, a.title.en, a.title.zh, a.latin ?? "", ...names].join(" ").toLowerCase(),
  };
}

export const catalogScenes: CatalogScene[] = Object.values(sceneModules).filter(scene=>!atlasSceneAliases[scene.slug]).map((scene) => ({
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
  ...atlasCard(scene),
}));

/**
 * Bài CHỈ có trên atlas (bài bộ phận học theo lớp, không có SceneModule
 * Z-Anatomy tương ứng) — trộn chung vào thư viện theo hệ khai trong scene.
 */
for (const a of Object.values(atlasScenes)) {
  if (sceneModules[a.slug as keyof typeof sceneModules]) continue;
  catalogScenes.push({
    slug: a.slug,
    title: a.title,
    description: a.intro,
    system: (a.system as SystemGroupKey) ?? "skeletal",
    href: `/giai-phau/mo-hinh/${a.slug}`,
    thumb: thumbnails[a.slug] ?? `/thumbnails/${a.slug}.jpg`,
    structureCount: a.groups.length,
    searchText: [a.title.vi, a.title.en, a.title.zh, a.latin ?? "", ...a.groups.map((g) => [g.name.vi,g.name.en,g.name.zh,g.latin ?? "",...(g.landmarks ?? []).flatMap(m=>[m.name.vi,m.name.en,m.name.zh,m.latin])].join(" "))]
      .join(" ")
      .toLowerCase(),
  });
}

const byslug = new Map(catalogScenes.map((s) => [s.slug, s]));

export const getScene = (slug: string): CatalogScene | undefined => byslug.get(slug);

/** Vùng cơ thể — dùng cho trang "Giải phẫu theo vùng". */
export type RegionKey =
  | "head-neck" | "thorax" | "abdomen" | "back" | "upper-limb" | "pelvis" | "lower-limb";

/**
 * Mỗi vùng có `slug` riêng vì vùng nay được duyệt như hệ cơ quan: mỗi vùng một
 * trang `/giai-phau/<slug>` và một mục trong sidebar, thay cho hàng tab lọc cũ
 * nằm trong trang "Giải phẫu theo vùng".
 */
export const regionGroups: { key: RegionKey; slug: string; label: T3; icon: string }[] = bindContentSource("data:src/lib/catalog.ts#regionGroups", [
  { key: "head-neck", slug: "vung-dau-co", label: { vi: "Đầu và cổ", en: "Head and neck", zh: "头颈部" }, icon: "i-brain" },
  { key: "thorax", slug: "vung-nguc", label: { vi: "Ngực", en: "Thorax", zh: "胸部" }, icon: "i-heart" },
  { key: "abdomen", slug: "vung-bung", label: { vi: "Bụng", en: "Abdomen", zh: "腹部" }, icon: "i-stomach" },
  { key: "back", slug: "vung-lung-cot-song", label: { vi: "Lưng và cột sống", en: "Back and spine", zh: "背部与脊柱" }, icon: "i-bone" },
  { key: "upper-limb", slug: "vung-chi-tren", label: { vi: "Chi trên", en: "Upper limb", zh: "上肢" }, icon: "i-muscle" },
  { key: "pelvis", slug: "vung-chau-hong", label: { vi: "Chậu hông", en: "Pelvis", zh: "骨盆" }, icon: "i-bone" },
  { key: "lower-limb", slug: "vung-chi-duoi", label: { vi: "Chi dưới", en: "Lower limb", zh: "下肢" }, icon: "i-muscle" },
]);

export const regionBySlug = new Map(regionGroups.map((g) => [g.slug, g]));

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
  "tieu-nao": "head-neck", "hoi-vo-dai-nao": "head-neck", "gian-nao-he-vien": "head-neck",
  "da-giac-willis": "head-neck",
  // Ngực
  "giai-phau-than": "thorax", "tim-day-du": "thorax", "giai-phau-tim": "thorax",
  "giai-phau-phoi": "thorax", "trung-that": "thorax", "long-nguc": "thorax",
  "co-hoanh-day-du": "thorax", "co-hoanh": "thorax",
  // Bụng
  "thanh-bung": "abdomen", "co-bung": "abdomen", "mat-cat-ngang-bung": "abdomen",
  "gan-duong-mat": "abdomen", "giai-phau-gan": "abdomen", "mat-cat-tui-mat": "abdomen",
  "da-day-ta-trang": "abdomen", "mat-cat-da-day": "abdomen", "ruot-non-ruot-gia": "abdomen",
  "phuc-mac-mac-treo": "abdomen", "phuc-mac": "abdomen", "tong-quan-he-tieu-hoa": "abdomen",
  // Lưng và cột sống
  "cot-song": "back", "tuy-song-dam-roi": "back",
  // Chi trên
  "giai-phau-dai-vai": "upper-limb", "giai-phau-canh-tay": "upper-limb",
  "giai-phau-cang-tay": "upper-limb", "giai-phau-ban-tay": "upper-limb",
  "khop-vai-khuyu": "upper-limb", "co-canh-tay": "upper-limb",
  "dai-vai-chi-tren": "upper-limb", "ban-tay": "upper-limb",
  // Chậu hông
  // Chi dưới
  "co-dui-mong": "lower-limb", "chi-duoi": "lower-limb", "ban-chan": "lower-limb",
  // Bổ sung 2026-08-22: 31 scene của các đợt vùng 2–5 trước nay KHÔNG có mặt
  // trong "Giải phẫu theo vùng" chỉ vì thiếu dòng khai báo ở đây — model có
  // thật, nhãn có thật, chỉ là trang duyệt theo vùng không biết tới chúng.
  "tuyen-nuoc-bot": "head-neck", "xoang-tinh-mach-mang-cung": "head-neck",
  "tam-giac-co": "head-neck", "co-mat-than-kinh-vii": "head-neck",
  "khop-thai-duong-ham": "head-neck", "nao-that-mang-nao": "head-neck",
  "thanh-nguc": "thorax", "phoi-cay-phe-quan": "thorax",
  "tuy-lach": "abdomen", "than-nieu-quan": "abdomen", "vung-ben": "abdomen",
  "khoang-sau-phuc-mac": "abdomen", "he-tinh-mach-chu-cua": "abdomen",
  "cot-song-co": "back", "cot-song-nguc": "back", "cot-song-that-lung": "back",
  "vung-lung": "back",
  "vai-ho-nach": "upper-limb", "khop-khuyu": "upper-limb", "co-tay-ong-co-tay": "upper-limb",
  "chau-hong-day-chau": "pelvis", "co-quan-sinh-duc-nam": "pelvis",
  "dam-roi-that-lung-cung": "pelvis",
  "khop-hang": "lower-limb", "khop-hang-dui": "lower-limb", "khop-goi": "lower-limb",
  "ho-khoeo": "lower-limb", "khop-co-chan": "lower-limb",
  "cang-chan-ban-chan": "lower-limb", "ban-chan-chi-tiet": "lower-limb",
  "vung-mong": "lower-limb",
  // Đợt vùng thứ năm — 14 vùng chuyên đề
  "dam-roi-canh-tay": "upper-limb",
  "than-kinh-tu-chu": "thorax",
  "duong-thi-giac": "head-neck",
  "dong-mach-canh": "head-neck",
  "vung-nguc-tuyen-vu": "thorax",
  "thuc-quan": "thorax",
  "bang-quang-tien-liet": "pelvis",
  "khop-cung-chau": "pelvis",
  "chop-xoay-vai": "upper-limb",
  "gan-got-ong-co-chan": "lower-limb",
  "tinh-mach-hien": "lower-limb",
  "hach-co": "head-neck",
  "mang-phoi": "thorax",
  "tuyen-giap": "head-neck",
  // Đợt vùng thứ sáu
  "than-kinh-sinh-ba": "head-neck",
  "le-dao": "head-neck",
  "ho-duoi-thai-duong": "head-neck",
  "co-vung-gay": "back",
  "khop-uc-don": "upper-limb",
  "ong-song-that-lung": "back",
  "tam-giac-dui": "lower-limb",
  "dong-mach-chi-tren": "upper-limb",
  "tinh-mach-chi-tren": "upper-limb",
  "dong-mach-chi-duoi": "lower-limb",
  // Ba model dưới đây gán được vùng nhưng trước nay bị bỏ sót nên KHÔNG hiện ra
  // ở trang "Giải phẫu theo vùng" (đếm được 110/119 model). Sáu model toàn thân
  // còn lại (hệ mạc, mô liên kết, hệ nội tiết, tuyến nội tiết, cây động mạch
  // chủ, hệ bạch huyết) vẫn cố ý không gán vùng — chúng trải khắp cơ thể.
  "dong-mach-vanh": "thorax",
  "he-tiet-nieu": "abdomen",
  "he-sinh-san-nam": "pelvis",
  // Đợt vùng thứ bảy
  "ho-khuyu": "upper-limb",
  "mach-mac-treo": "abdomen",
  "goc-cau-tieu-nao": "head-neck",
  "dai-chau-chay": "lower-limb",
  "than-kinh-toa": "lower-limb",
  "can-nguc-that-lung": "back",
  "moc-xuong-chi-tren": "upper-limb",
  "moc-xuong-chi-duoi": "lower-limb",
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
  // Đổi theo yêu cầu chủ đồ án (12/09/2026): cánh tay → đại não, Willis → sọ.
  "dai-nao",
  "giai-phau-so",
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
