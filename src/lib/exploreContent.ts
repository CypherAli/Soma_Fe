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
 * Mọi mục ở đây đều có trang thật. Hai mục "Mốc xương, nguyên uỷ & bám tận" và
 * "Trắc nghiệm giải phẫu" từng bị gỡ khỏi danh sách vì đường dẫn chưa tồn tại
 * (bấm vào ra 404); ngày 25/08/2026 đã dựng xong cả hai trang nên trả lại đúng
 * chỗ cũ — `/giai-phau/moc-xuong` bày hai model mốc bám cơ dựng từ dữ liệu
 * điểm bám của Z-Anatomy, `/giai-phau/trac-nghiem` mở bộ đề sinh từ chính thư
 * viện 3D.
 */
export const sidebarAnatomy: SidebarItem[] = [
  { slug: "theo-vung", icon: "i-region", label: { vi: "Giải phẫu theo vùng", en: "Anatomy by region", zh: "按区域" }, href: "/giai-phau/theo-vung" },
  { slug: "theo-he", icon: "i-system", label: { vi: "Giải phẫu theo hệ", en: "Anatomy by system", zh: "按系统" }, href: "/giai-phau/theo-he" },
  { slug: "toan-than", icon: "i-full", label: { vi: "Giải phẫu toàn thân", en: "Complete anatomy", zh: "完整解剖" }, href: "/viewer" },
  { slug: "lat-cat", icon: "i-cross", label: { vi: "Lát cắt & vi giải phẫu", en: "Cross sections & microanatomy", zh: "断面与微观解剖" }, href: "/giai-phau/lat-cat" },
  { slug: "moc-xuong", icon: "i-bone", label: { vi: "Mốc xương, nguyên uỷ & bám tận", en: "Bony landmarks, origins & insertions", zh: "骨性标志与肌肉起止" }, href: "/giai-phau/moc-xuong" },
  { slug: "trac-nghiem", icon: "i-quiz", label: { vi: "Trắc nghiệm giải phẫu", en: "Anatomy quiz", zh: "解剖学测验" }, href: "/giai-phau/trac-nghiem" },
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

// Các mô hình theo hệ được trình bày như một atlas giải phẫu chung.
/**
 * Tab lọc của trang "Giải phẫu theo hệ" — mỗi hệ một tab, sinh từ `catalog` nên
 * không bao giờ lệch với số scene thật.
 */
const systemFilters: FilterTab[] = [
  { key: "all", label: { vi: "Tất cả", en: "All", zh: "全部" } },
  ...systemGroups
    .filter((g) => scenesOfSystem(g.key).length > 0)
    .map((g) => ({ key: g.key as string, label: g.label })),
];

/**
 * Thẻ "bộ sưu tập" đứng đầu trang Tất cả mô hình — MỖI HỆ MỘT THẺ, dẫn tới
 * TRANG DUYỆT của hệ đó (`/giai-phau/<slug hệ>`) chứ không tới một model lẻ.
 *
 * Trước đây mười tám thẻ này trỏ thẳng vào một scene tiêu biểu (thẻ "Hệ tuần
 * hoàn" mở đúng model "Giải phẫu Tim"), nên trang vừa có thẻ hệ vừa có thẻ
 * model cùng dẫn tới một chỗ — người học bấm hai thẻ khác tên lại ra cùng một
 * mô hình, và số model đếm được phồng lên. Nay thẻ hệ mở danh sách đầy đủ
 * model của hệ, đúng nghĩa một bộ sưu tập.
 *
 * Ảnh đại diện lấy từ scene ĐẦU TIÊN của hệ đã có ảnh render thật — không gõ
 * tay, nên dựng thêm model là thẻ tự có ảnh.
 */
const systemCards: ResultCard[] = [
  ...systemGroups
    .filter((group) => scenesOfSystem(group.key).length > 0)
    .map((group): ResultCard => ({
      img: "an-organ",
      icon: group.icon,
      thumb: scenesOfSystem(group.key).find((s) => s.thumb)?.thumb,
      title: group.label,
      filters: ["male", "female"],
      href: `/giai-phau/${group.slug}`,
      real: true,
      type: "anatomy",
    })),
  // Trang /viewer mở MÔ HÌNH TOÀN THÂN bật sẵn cả bảy hệ (xương, khớp, cơ,
  // mạch, thần kinh, tạng, bạch huyết) chứ không riêng hệ cơ xương — tên thẻ cũ
  // "Hệ cơ xương (toàn thân)" nói sai thứ người học sẽ thấy khi bấm vào.
  { img: "an-skel", icon: "i-full", thumb: "/thumbnails/toan-than-7-he.jpg", title: { vi: "Giải phẫu toàn thân (7 hệ)", en: "Whole-body anatomy (7 systems)", zh: "全身解剖（七大系统）" }, filters: ["male", "female"], href: "/viewer", real: true, type: "anatomy" },
  // Bỏ 24/08/2026 (quyết định của chủ đồ án): hai thẻ "Hệ sinh sản (nữ)" và
  // "Mô mỡ" trước đây đứng ở đây mang nhãn "SẮP CÓ" và trỏ tới mục giới hạn dữ
  // liệu. Danh mục nay chỉ bày thứ MỞ ĐƯỢC. Việc thiếu hai nhóm dữ liệu này vẫn
  // được nói rõ ở mục "Giới hạn dữ liệu" trên trang /nguoi (#gioi-han-du-lieu),
  // nên tính minh bạch không mất đi cùng hai tấm thẻ.
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
 * Thẻ của mục "Mốc xương, nguyên uỷ & bám tận".
 *
 * Hai model chi trên / chi dưới dựng riêng cho mục này: bộ xương trần cùng
 * TOÀN BỘ mảng nguyên uỷ và bám tận của các cơ (dữ liệu hệ 2 của Z-Anatomy),
 * không lấy khối cơ vì cơ che kín xương. Lọc theo slug nên dựng thêm model mốc
 * bám cho vùng khác là tự có mặt ở đây.
 */
const landmarkCards: ResultCard[] = catalogScenes
  .filter((scene) => scene.slug.startsWith("moc-xuong-"))
  .map((scene): ResultCard => ({
    img: "an-skel",
    icon: "i-bone",
    thumb: scene.thumb,
    title: scene.title,
    filters: [],
    href: scene.href,
    real: true,
    type: "anatomy",
  }));

/**
 * Thẻ của mục "Lát cắt & vi giải phẫu".
 *
 * Trước đây mục này dùng thẳng `crossSectionCards`, tức là bày TOÀN BỘ atlas
 * (119 model) — trùng y hệt trang "Tất cả mô hình" và sai hẳn với tên mục.
 * Nay chỉ giữ đúng thứ thuộc về nó: công cụ cắt lát tương tác trên mô hình
 * toàn thân, và các scene dựng từ một MẶT CẮT thật (slug bắt đầu bằng
 * "mat-cat-"). Lọc theo slug nên dựng thêm mặt cắt mới là tự có mặt ở đây.
 */
const sectionCards: ResultCard[] = [
  {
    img: "an-cell",
    icon: "i-cross",
    title: {
      vi: "Cắt lát tương tác (toàn thân)",
      en: "Interactive slicing (whole body)",
      zh: "全身交互式断层",
    },
    filters: [],
    href: "/cat-lat",
    real: true,
    type: "anatomy",
  },
  ...catalogScenes
    .filter((scene) => scene.slug.startsWith("mat-cat-"))
    .map((scene): ResultCard => ({
      img: "an-organ",
      icon: "i-cross",
      thumb: scene.thumb,
      title: scene.title,
      filters: [],
      href: scene.href,
      real: true,
      type: "anatomy",
    })),
];

/**
 * Thẻ của trang "Tất cả mô hình" — MỖI ĐÍCH ĐẾN ĐÚNG MỘT THẺ.
 *
 * Trước đây trang này ghép thẳng ba mảng `systemCards + regionCards +
 * crossSectionCards`, mà cả ba đều dẫn xuất từ cùng một danh sách scene: mỗi
 * model có gắn vùng cơ thể hiện ra HAI lần, thêm lần thứ ba nếu nó còn là thẻ
 * tiêu biểu của một hệ. Kết quả là trang đếm 186 thẻ trong khi atlas chỉ có 89
 * model thật — người học cuộn qua thấy đúng "Khớp gối", "Vùng mông"… lặp lại.
 *
 * Nay: các thẻ bộ sưu tập theo hệ đứng đầu (chúng dẫn tới TRANG DUYỆT của hệ,
 * không còn trùng đích với model nào), rồi mỗi scene đúng một thẻ mang tên
 * thật của nó. Vẫn lọc theo `href` để dựng thêm scene cũng không thể sinh lại
 * trùng lặp.
 */
const allModelCards: ResultCard[] = (() => {
  const seen = new Set<string>();
  const out: ResultCard[] = [];
  for (const card of [...systemCards, ...crossSectionCards]) {
    // Hai thẻ "chưa có dữ liệu" (sinh sản nữ, mô mỡ) dùng chung một href tới
    // mục giới hạn dữ liệu — phải kèm tên vào khoá, nếu không mất một thẻ.
    const key = card.href && !card.href.includes("#") ? card.href : `?${card.title.vi}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(card);
  }
  return out;
})();

/**
 * Trang duyệt cho từng hệ cơ quan — sinh tự động từ `catalog` nên luôn khớp
 * với số scene thật, không phải chép tay lại danh sách card.
 */
/**
 * MỌI model, gắn nhãn hệ để tab lọc dùng được.
 *
 * Thẻ tiêu biểu (`systemCards`) đi trước và cũng được gắn nhãn hệ theo scene mà
 * nó trỏ tới — nếu để `filters: []` thì bấm tab "Hệ xương" là chúng biến mất
 * hết, trang trông như vừa mất nội dung.
 */
const systemModelCards: ResultCard[] = [
  ...catalogScenes.map((scene): ResultCard => ({
    img: "an-organ",
    icon: systemByKey.get(scene.system)?.icon ?? "i-grid",
    thumb: scene.thumb,
    title: scene.title,
    filters: [scene.system],
    href: scene.href,
    real: true,
    type: "anatomy",
  })),
];

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
    cards: allModelCards,
  },
  "theo-vung": {
    slug: "theo-vung",
    icon: "i-region",
    title: { vi: "Giải phẫu theo vùng", en: "Anatomy by region", zh: "按区域解剖" },
    filters: regionFilters,
    cards: regionCards,
  },
  /**
   * Trang này trước đây chỉ bày 17 thẻ chọn tay — mỗi hệ đúng một model tiêu
   * biểu — trong khi atlas đã có hơn tám mươi model. Người học vào "Giải phẫu
   * theo hệ" là để thấy HẾT model của hệ đó, nên giờ bày toàn bộ, lọc bằng tab
   * theo hệ. Thẻ tiêu biểu vẫn đứng đầu để không mất lối vào quen thuộc.
   */
  "theo-he": {
    slug: "theo-he",
    icon: "i-system",
    title: { vi: "Giải phẫu theo hệ", en: "Anatomy by system", zh: "按系统解剖" },
    filters: systemFilters,
    cards: systemModelCards,
  },
  "moc-xuong": {
    slug: "moc-xuong",
    icon: "i-bone",
    title: {
      vi: "Mốc xương, nguyên uỷ & bám tận",
      en: "Bony landmarks, origins & insertions",
      zh: "骨性标志与肌肉起止",
    },
    filters: [],
    cards: landmarkCards,
  },
  "lat-cat": {
    slug: "lat-cat",
    icon: "i-cross",
    title: { vi: "Lát cắt & vi giải phẫu", en: "Cross sections & microanatomy", zh: "断面与微观解剖" },
    filters: [],
    cards: sectionCards,
  },
};
