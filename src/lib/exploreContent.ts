import type { T3 } from "./homeContent";
import {
  catalogScenes, regionGroups, scenesOfRegion, scenesOfSystem, systemByKey, systemGroups,
} from "./catalog";

export type CategorySlug =
  | "tat-ca"
  | "theo-vung"
  | "theo-he"
  | "toan-than"
  | "moc-xuong"
  | "lat-cat"
  | "trac-nghiem";

export type SidebarItem = {
  slug: CategorySlug;
  icon: string;
  label: T3;
  href: string; // đường dẫn tương đối (không kèm locale)
};

export const sidebarAllModels: SidebarItem = {
  slug: "tat-ca",
  icon: "i-grid",
  label: { vi: "Tất cả mô hình", en: "All Models", zh: "所有模型" },
  href: "/giai-phau/tat-ca",
};

/**
 * Chỉ liệt kê mục có trang thật. Hai mục cũ "Mốc xương, nguyên ủy & bám tận"
 * và "Trắc nghiệm giải phẫu" đã bỏ khỏi đây vì `/giai-phau/moc-xuong` và
 * `/giai-phau/trac-nghiem` chưa tồn tại — chúng trả về 404 khi bấm vào.
 * Khi dựng xong hai trang đó thì thêm lại.
 */
export const sidebarAnatomy: SidebarItem[] = [
  { slug: "theo-vung", icon: "i-region", label: { vi: "Giải phẫu theo vùng", en: "Anatomy by region", zh: "按区域" }, href: "/giai-phau/theo-vung" },
  { slug: "theo-he", icon: "i-system", label: { vi: "Giải phẫu theo hệ", en: "Anatomy by system", zh: "按系统" }, href: "/giai-phau/theo-he" },
  { slug: "toan-than", icon: "i-full", label: { vi: "Giải phẫu toàn thân", en: "Complete anatomy", zh: "完整解剖" }, href: "/viewer" },
  { slug: "lat-cat", icon: "i-cross", label: { vi: "Lát cắt & vi giải phẫu", en: "Cross sections & microanatomy", zh: "断面与微观解剖" }, href: "/giai-phau/lat-cat" },
];

export type FilterTab = { key: string; label: T3 };
export type ContentType = "anatomy" | "condition" | "procedure";
export type ResultCard = {
  img: string;
  title: T3;
  filters: string[];
  href?: string;
  real?: boolean;
  type?: ContentType;
  /** Ảnh thumbnail chụp thật từ model 3D (public/thumbnails/<slug>.jpg). Không có = dùng gradient giữ chỗ. */
  thumb?: string;
  /** Icon id (IconSprite) hiển thị trên nền gradient khi chưa có thumb — ghi đè fallback theo img class. */
  icon?: string;
};

export type CategoryData = {
  slug: CategorySlug;
  icon: string;
  title: T3;
  filters: FilterTab[];
  cards: ResultCard[];
};

/** 4 tab nội dung của trang "Tất cả mô hình" — kiểu gạch chân, khác filter-tab dạng pill. */
export const contentTypeTabs: { key: "all" | ContentType; label: T3 }[] = [
  { key: "all", label: { vi: "Tất cả", en: "All", zh: "全部" } },
  { key: "anatomy", label: { vi: "Giải phẫu & Sinh lý", en: "Anatomy and Physiology", zh: "解剖与生理" } },
  { key: "condition", label: { vi: "Bệnh lý", en: "Conditions", zh: "病症" } },
  { key: "procedure", label: { vi: "Thủ thuật & Điều trị", en: "Procedures and Treatments", zh: "操作与治疗" } },
];

const regionFilters: FilterTab[] = [
  { key: "all", label: { vi: "Tất cả", en: "All", zh: "全部" } },
  ...regionGroups.map((g) => ({ key: g.key as string, label: g.label })),
];

/**
 * Thẻ của trang "Giải phẫu theo vùng" — DẪN XUẤT từ catalog theo vùng cơ thể.
 * Trước đây là 12 thẻ viết tay ("Ngực nữ", "Bụng nam"…) không có href nên bấm
 * vào không đi đâu, lại còn chia nam/nữ trong khi dữ liệu nguồn chỉ có cơ thể
 * nam. Nay mỗi thẻ là một scene có model thật, bấm vào mở được ngay.
 */
const regionCards: ResultCard[] = regionGroups.flatMap((group) =>
  scenesOfRegion(group.key).map(
    (scene): ResultCard => ({
      img: "an-organ",
      icon: systemByKey.get(scene.system)?.icon ?? group.icon,
      thumb: scene.thumb,
      title: scene.title,
      filters: [group.key],
      href: scene.href,
      real: true,
      type: "anatomy",
    }),
  ),
);

const systemFilters: FilterTab[] = [
  { key: "all", label: { vi: "Tất cả", en: "All", zh: "全部" } },
  { key: "male", label: { vi: "Nam", en: "Male", zh: "男性" } },
  { key: "female", label: { vi: "Nữ", en: "Female", zh: "女性" } },
];

const systemCards: ResultCard[] = [
  { img: "an-heart", icon: "i-heart", thumb: "/thumbnails/giai-phau-tim.jpg", title: { vi: "Hệ tuần hoàn", en: "Cardiovascular system", zh: "心血管系统" }, filters: ["male", "female"], href: "/giai-phau/mo-hinh/giai-phau-tim", real: true, type: "anatomy" },
  { img: "an-skel", icon: "i-bone", thumb: "/thumbnails/giai-phau-so.jpg", title: { vi: "Hệ xương", en: "Skeletal system", zh: "骨骼系统" }, filters: ["male", "female"], href: "/giai-phau/mo-hinh/giai-phau-so", real: true, type: "anatomy" },
  { img: "an-muscle", icon: "i-muscle", title: { vi: "Hệ cơ", en: "Muscular system", zh: "肌肉系统" }, filters: ["male", "female"], href: "/giai-phau/mo-hinh/co-mat", real: true, type: "anatomy" },
  { img: "an-skel", icon: "i-bone", title: { vi: "Hệ cơ xương", en: "Musculoskeletal system", zh: "肌肉骨骼系统" }, filters: ["male", "female"], href: "/viewer", real: true, type: "anatomy" },
  { img: "an-nerve", icon: "i-brain", title: { vi: "Hệ thần kinh", en: "Nervous system", zh: "神经系统" }, filters: ["male", "female"], href: "/giai-phau/mo-hinh/than-nao-day-so", real: true, type: "anatomy" },
  { img: "an-organ", icon: "i-stomach", title: { vi: "Hệ tiêu hóa", en: "Digestive system", zh: "消化系统" }, filters: ["male", "female"], href: "/giai-phau/mo-hinh/tong-quan-he-tieu-hoa", real: true, type: "anatomy" },
  { img: "an-lung", icon: "i-lungs", title: { vi: "Hệ hô hấp", en: "Respiratory system", zh: "呼吸系统" }, filters: ["male", "female"], href: "/giai-phau/mo-hinh/giai-phau-phoi", real: true, type: "anatomy" },
  { img: "an-vessel", icon: "i-droplet", title: { vi: "Hệ bạch huyết", en: "Lymphatic system", zh: "淋巴系统" }, filters: ["male", "female"], href: "/viewer", real: true, type: "anatomy" },
  { img: "an-organ", icon: "i-cell", title: { vi: "Hệ nội tiết", en: "Endocrine system", zh: "内分泌系统" }, filters: ["male", "female"], href: "/giai-phau/mo-hinh/he-noi-tiet", real: true, type: "anatomy" },
  { img: "an-organ", icon: "i-nephro", title: { vi: "Hệ tiết niệu", en: "Urinary system", zh: "泌尿系统" }, filters: ["male", "female"], href: "/giai-phau/mo-hinh/he-tiet-nieu", real: true, type: "anatomy" },
  // Sinh sản nữ KHÔNG có dữ liệu: Z-Anatomy và BodyParts3D đều dựng trên cơ
  // thể nam. Giữ thẻ ở trạng thái chưa có mô hình thay vì dùng tạm model nam.
  { img: "an-organ", icon: "i-gyn", title: { vi: "Hệ sinh sản (nữ)", en: "Reproductive system (female)", zh: "生殖系统（女）" }, filters: ["female"], href: "/nguoi#gioi-han-du-lieu", type: "anatomy" },
  { img: "an-organ", icon: "i-gyn", title: { vi: "Hệ sinh sản (nam)", en: "Reproductive system (male)", zh: "生殖系统（男）" }, filters: ["male"], href: "/giai-phau/mo-hinh/he-sinh-san-nam", real: true, type: "anatomy" },
  { img: "an-cell", icon: "i-cell", title: { vi: "Mô liên kết", en: "Connective tissue", zh: "结缔组织" }, filters: ["male", "female"], href: "/giai-phau/mo-hinh/mo-lien-ket", real: true, type: "anatomy" },
  // Mô mỡ: 0 mesh trong Z-Anatomy, không có nguồn thay thế.
  { img: "an-cell", icon: "i-droplet", title: { vi: "Mô mỡ", en: "Fat", zh: "脂肪" }, filters: ["male", "female"], href: "/nguoi#gioi-han-du-lieu", type: "anatomy" },
  { img: "an-cell", icon: "i-cell", title: { vi: "Mạc", en: "Fascia", zh: "筋膜" }, filters: ["male", "female"], href: "/giai-phau/mo-hinh/he-mac", real: true, type: "anatomy" },
  { img: "an-cell", icon: "i-ear", title: { vi: "Hệ thính giác", en: "Auditory system", zh: "听觉系统" }, filters: ["male", "female"], href: "/giai-phau/mo-hinh/he-thinh-giac", real: true, type: "anatomy" },
  { img: "an-brain", icon: "i-eye", title: { vi: "Hệ thị giác", en: "Visual system", zh: "视觉系统" }, filters: ["male", "female"], href: "/giai-phau/mo-hinh/giai-phau-mat", real: true, type: "anatomy" },
];

/**
 * Thẻ cho mọi scene có model 3D thật — DẪN XUẤT từ `catalog` thay vì liệt kê
 * tay. Trước đây danh sách này chép lại tiêu đề và đường dẫn của từng scene,
 * nên mỗi lần dựng scene mới phải nhớ sửa thêm ở đây; quên là scene không
 * hiện ra trong "Tất cả mô hình" dù đã tồn tại.
 */
const crossSectionCards: ResultCard[] = catalogScenes.map((scene) => ({
  img: "an-organ",
  icon: systemByKey.get(scene.system)?.icon ?? "i-grid",
  thumb: scene.thumb,
  title: scene.title,
  filters: [],
  href: scene.href,
  real: true,
  type: "anatomy",
}));

/**
 * Trang duyệt cho từng hệ cơ quan — sinh tự động từ `catalog` nên luôn khớp
 * với số scene thật, không phải chép tay lại danh sách card.
 */
const systemCategories: Record<string, CategoryData> = Object.fromEntries(
  systemGroups.map((group) => [
    group.slug,
    {
      slug: "theo-he" as CategorySlug,
      icon: group.icon,
      title: group.label,
      filters: [],
      cards: scenesOfSystem(group.key).map(
        (scene): ResultCard => ({
          img: "an-organ",
          icon: group.icon,
          thumb: scene.thumb,
          title: scene.title,
          filters: [],
          href: scene.href,
          real: true,
          type: "anatomy",
        }),
      ),
    },
  ]),
);

export const categoryData: Record<string, CategoryData> = {
  ...systemCategories,
  "tat-ca": {
    slug: "tat-ca",
    icon: "i-grid",
    title: { vi: "Tất cả mô hình", en: "All Models", zh: "所有模型" },
    filters: [],
    cards: [...systemCards, ...regionCards, ...crossSectionCards],
  },
  "theo-vung": {
    slug: "theo-vung",
    icon: "i-region",
    title: { vi: "Giải phẫu theo vùng", en: "Anatomy by region", zh: "按区域解剖" },
    filters: regionFilters,
    cards: regionCards,
  },
  "theo-he": {
    slug: "theo-he",
    icon: "i-system",
    title: { vi: "Giải phẫu theo hệ", en: "Anatomy by system", zh: "按系统解剖" },
    filters: systemFilters,
    cards: systemCards,
  },
  "lat-cat": {
    slug: "lat-cat",
    icon: "i-cross",
    title: { vi: "Lát cắt & vi giải phẫu", en: "Cross sections & microanatomy", zh: "断面与微观解剖" },
    filters: [],
    cards: crossSectionCards,
  },
};
