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
 * Mọi mục ở đây đều có trang thật. "Trắc nghiệm giải phẫu" đã được gỡ khỏi
 * danh sách (quyết định của chủ đồ án) — trang `/giai-phau/trac-nghiem` vẫn
 * chạy và vẫn tới được từ mục Quiz trên thanh điều hướng, chỉ không còn chiếm
 * một dòng trong menu Giải phẫu.
 */
export const sidebarAnatomy: SidebarItem[] = [
  { slug: "theo-vung", icon: "i-region", label: { vi: "Giải phẫu theo vùng", en: "Anatomy by region", zh: "按区域" }, href: "/giai-phau/theo-vung" },
  { slug: "theo-he", icon: "i-system", label: { vi: "Giải phẫu theo hệ", en: "Anatomy by system", zh: "按系统" }, href: "/giai-phau/theo-he" },
  { slug: "toan-than", icon: "i-full", label: { vi: "Giải phẫu toàn thân", en: "Complete anatomy", zh: "完整解剖" }, href: "/viewer" },
  { slug: "lat-cat", icon: "i-cross", label: { vi: "Lát cắt & vi giải phẫu", en: "Cross sections & microanatomy", zh: "断面与微观解剖" }, href: "/giai-phau/lat-cat" },
  { slug: "moc-xuong", icon: "i-bone", label: { vi: "Mốc xương, nguyên uỷ & bám tận", en: "Bony landmarks, origins & insertions", zh: "骨性标志与肌肉起止" }, href: "/giai-phau/moc-xuong" },
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
  /** Đơn vị đếm ở đầu trang; mặc định là "mô hình". */
  unit?: T3;
  /**
   * Bộ lọc bày kiểu nào: hàng tab gạch chân (mặc định) hay một ô chọn nằm
   * trong thanh công cụ. Trang "Tất cả mô hình" có tới 13 hệ nên hàng tab dài
   * quá một dòng — dùng ô chọn gọn hơn.
   */
  filterAs?: "tabs" | "select";
  /** Nhãn của ô chọn khi `filterAs` là "select". */
  filterLabel?: T3;
};




// Các mô hình theo hệ được trình bày như một atlas giải phẫu chung.
/**
 * Tab lọc của trang "Giải phẫu theo hệ" — mỗi hệ một tab, sinh từ `catalog` nên
 * không bao giờ lệch với số scene thật.
 */
const regionFilters: FilterTab[] = [
  { key: "all", label: { vi: "Tất cả", en: "All", zh: "全部" } },
  ...regionGroups
    .filter((g) => scenesOfRegion(g.key).length > 0)
    .map((g) => ({ key: g.key as string, label: g.label })),
];

const systemFilters: FilterTab[] = [
  { key: "all", label: { vi: "Tất cả", en: "All", zh: "全部" } },
  ...systemGroups
    .filter((g) => scenesOfSystem(g.key).length > 0)
    .map((g) => ({ key: g.key as string, label: g.label })),
];

/**
 * Thẻ mô hình toàn thân — thứ duy nhất trong trang "Tất cả mô hình" không phải
 * một scene của catalog, nên phải khai riêng.
 *
 * Trang này trước đây còn có 13 thẻ "bộ sưu tập" theo hệ đứng ở đầu. Đã bỏ
 * (yêu cầu của chủ đồ án): trang bày THẲNG mọi model, ai muốn thu hẹp thì
 * dùng ô chọn "Hệ" trên thanh công cụ; còn lối vào từng hệ nằm ở trang "Giải
 * phẫu theo hệ" và ở sidebar.
 */
const wholeBodyCard: ResultCard = {
  img: "an-skel",
  icon: "i-full",
  thumb: "/thumbnails/toan-than-7-he.jpg",
  title: { vi: "Giải phẫu toàn thân (7 hệ)", en: "Whole-body anatomy (7 systems)", zh: "全身解剖（七大系统）" },
  filters: [],
  href: "/viewer",
  real: true,
  type: "anatomy",
};

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
  // Nhãn hệ để ô chọn "Hệ" ở trang Tất cả mô hình lọc được.
  filters: [scene.system],
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
// Thẻ "Cắt lát tương tác (toàn thân)" (/cat-lat) đã gỡ khỏi mục này theo yêu cầu
// của chủ đồ án (12/09/2026) — trang /cat-lat vẫn còn, chỉ không bày ở đây nữa.
const sectionCards: ResultCard[] = [
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
 * Trước đây trang này ghép thẳng ba mảng `systemCards` + thẻ theo vùng +
 * `crossSectionCards`, mà cả ba đều dẫn xuất từ cùng một danh sách scene: mỗi
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
  for (const card of [wholeBodyCard, ...crossSectionCards]) {
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
 * Model lẻ gắn nhãn VÙNG — trang "Giải phẫu theo vùng" bày y như trang "Tất cả
 * mô hình": mọi model nằm thẳng trên lưới, thu hẹp bằng ô lọc trên thanh công
 * cụ. Scene không thuộc vùng nào (hệ bạch huyết, hệ mạc… trải khắp người) cố ý
 * không có mặt ở đây.
 */
const regionModelCards: ResultCard[] = regionGroups.flatMap((group) =>
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

/** Model lẻ gắn nhãn HỆ — cùng lối bày với trang theo vùng. */
const systemModelCards: ResultCard[] = catalogScenes.map((scene): ResultCard => ({
  img: "an-organ",
  icon: systemByKey.get(scene.system)?.icon ?? "i-grid",
  thumb: scene.thumb,
  title: scene.title,
  filters: [scene.system],
  href: scene.href,
  real: true,
  type: "anatomy",
}));

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

/**
 * Trang duyệt cho từng vùng cơ thể — dựng y như trang của từng hệ cơ quan:
 * `/giai-phau/<slug vùng>` bày đúng model của vùng đó, sidebar liệt kê cả bảy
 * vùng kèm số model. Trước đây bảy vùng chỉ là một hàng tab lọc nằm trong
 * trang "Giải phẫu theo vùng", không có địa chỉ riêng để lưu hay chia sẻ.
 */
const regionCategories: Record<string, CategoryData> = Object.fromEntries(
  regionGroups.map((group) => [
    group.slug,
    {
      slug: "theo-vung" as CategorySlug,
      icon: group.icon,
      title: group.label,
      filters: [],
      cards: scenesOfRegion(group.key).map(
        (scene): ResultCard => ({
          img: "an-organ",
          icon: systemByKey.get(scene.system)?.icon ?? group.icon,
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
  ...regionCategories,
  "tat-ca": {
    slug: "tat-ca",
    icon: "i-grid",
    title: { vi: "Tất cả mô hình", en: "All Models", zh: "所有模型" },
    filters: systemFilters,
    filterAs: "select",
    filterLabel: { vi: "Hệ", en: "System", zh: "系统" },
    cards: allModelCards,
  },
  "theo-vung": {
    slug: "theo-vung",
    icon: "i-region",
    title: { vi: "Giải phẫu theo vùng", en: "Anatomy by region", zh: "按区域解剖" },
    filters: regionFilters,
    filterAs: "select",
    filterLabel: { vi: "Vùng", en: "Region", zh: "区域" },
    cards: regionModelCards,
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
    filterAs: "select",
    filterLabel: { vi: "Hệ", en: "System", zh: "系统" },
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
