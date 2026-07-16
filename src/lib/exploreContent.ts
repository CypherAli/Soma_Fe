import type { T3 } from "./homeContent";

export type CategorySlug =
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

export const sidebarAnatomy: SidebarItem[] = [
  { slug: "theo-vung", icon: "i-region", label: { vi: "Giải phẫu theo vùng", en: "Anatomy by region", zh: "按区域" }, href: "/giai-phau/theo-vung" },
  { slug: "theo-he", icon: "i-system", label: { vi: "Giải phẫu theo hệ", en: "Anatomy by system", zh: "按系统" }, href: "/giai-phau/theo-he" },
  { slug: "toan-than", icon: "i-full", label: { vi: "Giải phẫu toàn thân", en: "Complete anatomy", zh: "完整解剖" }, href: "/viewer" },
  { slug: "moc-xuong", icon: "i-bone", label: { vi: "Mốc xương, nguyên ủy & bám tận", en: "Bony landmarks & insertions", zh: "骨性标志与附着" }, href: "/giai-phau/moc-xuong" },
  { slug: "lat-cat", icon: "i-cross", label: { vi: "Lát cắt & vi giải phẫu", en: "Cross sections & microanatomy", zh: "断面与微观解剖" }, href: "/giai-phau/lat-cat" },
  { slug: "trac-nghiem", icon: "i-quiz", label: { vi: "Trắc nghiệm giải phẫu", en: "Anatomy quizzes", zh: "解剖测验" }, href: "/giai-phau/trac-nghiem" },
];

export type FilterTab = { key: string; label: T3 };
export type ResultCard = { img: string; title: T3; filters: string[]; href?: string; real?: boolean };

export type CategoryData = {
  slug: CategorySlug;
  icon: string;
  title: T3;
  filters: FilterTab[];
  cards: ResultCard[];
};

export const categoryData: Record<"theo-vung" | "theo-he", CategoryData> = {
  "theo-vung": {
    slug: "theo-vung",
    icon: "i-region",
    title: { vi: "Giải phẫu theo vùng", en: "Anatomy by region", zh: "按区域解剖" },
    filters: [
      { key: "all", label: { vi: "Tất cả", en: "All", zh: "全部" } },
      { key: "head-neck", label: { vi: "Đầu và cổ", en: "Head and neck", zh: "头颈" } },
      { key: "thorax", label: { vi: "Ngực", en: "Thorax", zh: "胸部" } },
      { key: "abdomen", label: { vi: "Bụng", en: "Abdomen", zh: "腹部" } },
      { key: "back", label: { vi: "Lưng", en: "Back", zh: "背部" } },
      { key: "upper-limb", label: { vi: "Chi trên", en: "Upper limb", zh: "上肢" } },
      { key: "pelvis", label: { vi: "Xương chậu", en: "Pelvis", zh: "骨盆" } },
      { key: "lower-limb", label: { vi: "Chi dưới", en: "Lower limb", zh: "下肢" } },
    ],
    cards: [
      { img: "an-muscle", title: { vi: "Lưng", en: "Back", zh: "背部" }, filters: ["back"] },
      { img: "an-brain", title: { vi: "Não", en: "Brain", zh: "脑" }, filters: ["head-neck"] },
      { img: "an-organ", title: { vi: "Bụng nữ", en: "Female abdomen", zh: "女性腹部" }, filters: ["abdomen"] },
      { img: "an-vessel", title: { vi: "Xương chậu nữ", en: "Female pelvis", zh: "女性骨盆" }, filters: ["pelvis"] },
      { img: "an-skel", title: { vi: "Đầu", en: "Head", zh: "头部" }, filters: ["head-neck"] },
      { img: "an-vessel", title: { vi: "Cổ", en: "Neck", zh: "颈部" }, filters: ["head-neck"] },
      { img: "an-heart", title: { vi: "Ngực", en: "Thorax", zh: "胸部" }, filters: ["thorax"], href: "/viewer", real: true },
      { img: "an-organ", title: { vi: "Bụng nam", en: "Male abdomen", zh: "男性腹部" }, filters: ["abdomen"] },
      { img: "an-muscle", title: { vi: "Cánh tay", en: "Arm", zh: "手臂" }, filters: ["upper-limb"] },
      { img: "an-vessel", title: { vi: "Bàn tay", en: "Hand", zh: "手" }, filters: ["upper-limb"] },
      { img: "an-vessel", title: { vi: "Xương chậu nam", en: "Male pelvis", zh: "男性骨盆" }, filters: ["pelvis"] },
      { img: "an-muscle", title: { vi: "Đùi", en: "Thigh", zh: "大腿" }, filters: ["lower-limb"] },
    ],
  },
  "theo-he": {
    slug: "theo-he",
    icon: "i-system",
    title: { vi: "Giải phẫu theo hệ", en: "Anatomy by system", zh: "按系统解剖" },
    filters: [
      { key: "all", label: { vi: "Tất cả", en: "All", zh: "全部" } },
      { key: "skeletal", label: { vi: "Hệ xương", en: "Skeletal", zh: "骨骼" } },
      { key: "muscular", label: { vi: "Hệ cơ", en: "Muscular", zh: "肌肉" } },
      { key: "nervous", label: { vi: "Hệ thần kinh", en: "Nervous", zh: "神经" } },
      { key: "cardio", label: { vi: "Hệ tuần hoàn", en: "Cardiovascular", zh: "心血管" } },
      { key: "digestive", label: { vi: "Hệ tiêu hóa", en: "Digestive", zh: "消化" } },
      { key: "respiratory", label: { vi: "Hệ hô hấp", en: "Respiratory", zh: "呼吸" } },
    ],
    cards: [
      { img: "an-skel", title: { vi: "Hệ xương", en: "Skeletal system", zh: "骨骼系统" }, filters: ["skeletal"] },
      { img: "an-muscle", title: { vi: "Hệ cơ", en: "Muscular system", zh: "肌肉系统" }, filters: ["muscular"] },
      { img: "an-nerve", title: { vi: "Hệ thần kinh", en: "Nervous system", zh: "神经系统" }, filters: ["nervous"] },
      { img: "an-heart", title: { vi: "Hệ tuần hoàn", en: "Cardiovascular system", zh: "心血管系统" }, filters: ["cardio"], href: "/viewer", real: true },
      { img: "an-organ", title: { vi: "Hệ tiêu hóa", en: "Digestive system", zh: "消化系统" }, filters: ["digestive"] },
      { img: "an-lung", title: { vi: "Hệ hô hấp", en: "Respiratory system", zh: "呼吸系统" }, filters: ["respiratory"] },
      { img: "an-vessel", title: { vi: "Hệ bạch huyết", en: "Lymphoid organs", zh: "淋巴系统" }, filters: ["cardio"] },
      { img: "an-cell", title: { vi: "Giác quan", en: "Sense organs", zh: "感觉器官" }, filters: ["nervous"] },
    ],
  },
};
