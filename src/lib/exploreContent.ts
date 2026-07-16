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
      { img: "an-heart", title: { vi: "Ngực nữ", en: "Female thorax", zh: "女性胸部" }, filters: ["thorax"] },
      { img: "an-skel", title: { vi: "Đầu và cổ", en: "Head and neck", zh: "头颈部" }, filters: ["head-neck"] },
      { img: "an-muscle", title: { vi: "Chi dưới", en: "Lower limb", zh: "下肢" }, filters: ["lower-limb"] },
      { img: "an-organ", title: { vi: "Bụng nam", en: "Male abdomen", zh: "男性腹部" }, filters: ["abdomen"] },
      { img: "an-vessel", title: { vi: "Xương chậu nam", en: "Male pelvis", zh: "男性骨盆" }, filters: ["pelvis"] },
      { img: "an-heart", title: { vi: "Ngực nam", en: "Male thorax", zh: "男性胸部" }, filters: ["thorax"] },
      { img: "an-muscle", title: { vi: "Chi trên", en: "Upper limb", zh: "上肢" }, filters: ["upper-limb"] },
      { img: "an-vessel", title: { vi: "Động mạch chủ bụng", en: "Abdominal aorta", zh: "腹主动脉" }, filters: ["abdomen"] },
    ],
  },
  "theo-he": {
    slug: "theo-he",
    icon: "i-system",
    title: { vi: "Giải phẫu theo hệ", en: "Anatomy by system", zh: "按系统解剖" },
    filters: [
      { key: "all", label: { vi: "Tất cả", en: "All", zh: "全部" } },
      { key: "male", label: { vi: "Nam", en: "Male", zh: "男性" } },
      { key: "female", label: { vi: "Nữ", en: "Female", zh: "女性" } },
    ],
    cards: [
      { img: "an-heart", title: { vi: "Hệ tuần hoàn", en: "Cardiovascular system", zh: "心血管系统" }, filters: ["male", "female"], href: "/viewer", real: true },
      { img: "an-skel", title: { vi: "Hệ xương", en: "Skeletal system", zh: "骨骼系统" }, filters: ["male", "female"] },
      { img: "an-muscle", title: { vi: "Hệ cơ", en: "Muscular system", zh: "肌肉系统" }, filters: ["male", "female"] },
      { img: "an-skel", title: { vi: "Hệ cơ xương", en: "Musculoskeletal system", zh: "肌肉骨骼系统" }, filters: ["male", "female"] },
      { img: "an-nerve", title: { vi: "Hệ thần kinh", en: "Nervous system", zh: "神经系统" }, filters: ["male", "female"] },
      { img: "an-organ", title: { vi: "Hệ tiêu hóa", en: "Digestive system", zh: "消化系统" }, filters: ["male", "female"] },
      { img: "an-lung", title: { vi: "Hệ hô hấp", en: "Respiratory system", zh: "呼吸系统" }, filters: ["male", "female"] },
      { img: "an-vessel", title: { vi: "Hệ bạch huyết", en: "Lymphatic system", zh: "淋巴系统" }, filters: ["male", "female"] },
      { img: "an-organ", title: { vi: "Hệ nội tiết", en: "Endocrine system", zh: "内分泌系统" }, filters: ["male", "female"] },
      { img: "an-organ", title: { vi: "Hệ tiết niệu", en: "Urinary system", zh: "泌尿系统" }, filters: ["male", "female"] },
      { img: "an-organ", title: { vi: "Hệ sinh sản", en: "Reproductive system", zh: "生殖系统" }, filters: ["female"] },
      { img: "an-organ", title: { vi: "Hệ sinh sản", en: "Reproductive system", zh: "生殖系统" }, filters: ["male"] },
      { img: "an-cell", title: { vi: "Mô liên kết", en: "Connective tissue", zh: "结缔组织" }, filters: ["male", "female"] },
      { img: "an-cell", title: { vi: "Mô mỡ", en: "Fat", zh: "脂肪" }, filters: ["male", "female"] },
      { img: "an-cell", title: { vi: "Mạc", en: "Fascia", zh: "筋膜" }, filters: ["male", "female"] },
      { img: "an-cell", title: { vi: "Hệ thính giác", en: "Auditory system", zh: "听觉系统" }, filters: ["male", "female"] },
      { img: "an-brain", title: { vi: "Hệ thị giác", en: "Visual system", zh: "视觉系统" }, filters: ["male", "female"] },
    ],
  },
};
