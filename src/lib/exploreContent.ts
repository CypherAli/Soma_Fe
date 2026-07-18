import type { T3 } from "./homeContent";

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

export const sidebarAnatomy: SidebarItem[] = [
  { slug: "theo-vung", icon: "i-region", label: { vi: "Giải phẫu theo vùng", en: "Anatomy by region", zh: "按区域" }, href: "/giai-phau/theo-vung" },
  { slug: "theo-he", icon: "i-system", label: { vi: "Giải phẫu theo hệ", en: "Anatomy by system", zh: "按系统" }, href: "/giai-phau/theo-he" },
  { slug: "toan-than", icon: "i-full", label: { vi: "Giải phẫu toàn thân", en: "Complete anatomy", zh: "完整解剖" }, href: "/viewer" },
  { slug: "moc-xuong", icon: "i-bone", label: { vi: "Mốc xương, nguyên ủy & bám tận", en: "Bony landmarks & insertions", zh: "骨性标志与附着" }, href: "/giai-phau/moc-xuong" },
  { slug: "lat-cat", icon: "i-cross", label: { vi: "Lát cắt & vi giải phẫu", en: "Cross sections & microanatomy", zh: "断面与微观解剖" }, href: "/giai-phau/lat-cat" },
  { slug: "trac-nghiem", icon: "i-quiz", label: { vi: "Trắc nghiệm giải phẫu", en: "Anatomy quizzes", zh: "解剖测验" }, href: "/giai-phau/trac-nghiem" },
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
  { key: "head-neck", label: { vi: "Đầu và cổ", en: "Head and neck", zh: "头颈" } },
  { key: "thorax", label: { vi: "Ngực", en: "Thorax", zh: "胸部" } },
  { key: "abdomen", label: { vi: "Bụng", en: "Abdomen", zh: "腹部" } },
  { key: "back", label: { vi: "Lưng", en: "Back", zh: "背部" } },
  { key: "upper-limb", label: { vi: "Chi trên", en: "Upper limb", zh: "上肢" } },
  { key: "pelvis", label: { vi: "Xương chậu", en: "Pelvis", zh: "骨盆" } },
  { key: "lower-limb", label: { vi: "Chi dưới", en: "Lower limb", zh: "下肢" } },
];

const regionCards: ResultCard[] = [
  { img: "an-muscle", title: { vi: "Lưng", en: "Back", zh: "背部" }, filters: ["back"], type: "anatomy" },
  { img: "an-brain", title: { vi: "Não", en: "Brain", zh: "脑" }, filters: ["head-neck"], type: "anatomy" },
  { img: "an-organ", title: { vi: "Bụng nữ", en: "Female abdomen", zh: "女性腹部" }, filters: ["abdomen"], type: "anatomy" },
  { img: "an-vessel", title: { vi: "Xương chậu nữ", en: "Female pelvis", zh: "女性骨盆" }, filters: ["pelvis"], type: "anatomy" },
  { img: "an-heart", title: { vi: "Ngực nữ", en: "Female thorax", zh: "女性胸部" }, filters: ["thorax"], type: "anatomy" },
  { img: "an-skel", title: { vi: "Đầu và cổ", en: "Head and neck", zh: "头颈部" }, filters: ["head-neck"], type: "anatomy" },
  { img: "an-muscle", title: { vi: "Chi dưới", en: "Lower limb", zh: "下肢" }, filters: ["lower-limb"], type: "anatomy" },
  { img: "an-organ", title: { vi: "Bụng nam", en: "Male abdomen", zh: "男性腹部" }, filters: ["abdomen"], type: "anatomy" },
  { img: "an-vessel", title: { vi: "Xương chậu nam", en: "Male pelvis", zh: "男性骨盆" }, filters: ["pelvis"], type: "anatomy" },
  { img: "an-heart", title: { vi: "Ngực nam", en: "Male thorax", zh: "男性胸部" }, filters: ["thorax"], type: "anatomy" },
  { img: "an-muscle", title: { vi: "Chi trên", en: "Upper limb", zh: "上肢" }, filters: ["upper-limb"], type: "anatomy" },
  { img: "an-vessel", title: { vi: "Động mạch chủ bụng", en: "Abdominal aorta", zh: "腹主动脉" }, filters: ["abdomen"], type: "anatomy" },
];

const systemFilters: FilterTab[] = [
  { key: "all", label: { vi: "Tất cả", en: "All", zh: "全部" } },
  { key: "male", label: { vi: "Nam", en: "Male", zh: "男性" } },
  { key: "female", label: { vi: "Nữ", en: "Female", zh: "女性" } },
];

const systemCards: ResultCard[] = [
  { img: "an-heart", title: { vi: "Hệ tuần hoàn", en: "Cardiovascular system", zh: "心血管系统" }, filters: ["male", "female"], href: "/giai-phau/mo-hinh/giai-phau-tim", real: true, type: "anatomy" },
  { img: "an-skel", title: { vi: "Hệ xương", en: "Skeletal system", zh: "骨骼系统" }, filters: ["male", "female"], href: "/giai-phau/mo-hinh/giai-phau-so", real: true, type: "anatomy" },
  { img: "an-muscle", title: { vi: "Hệ cơ", en: "Muscular system", zh: "肌肉系统" }, filters: ["male", "female"], href: "/viewer", real: true, type: "anatomy" },
  { img: "an-skel", title: { vi: "Hệ cơ xương", en: "Musculoskeletal system", zh: "肌肉骨骼系统" }, filters: ["male", "female"], type: "anatomy" },
  { img: "an-nerve", title: { vi: "Hệ thần kinh", en: "Nervous system", zh: "神经系统" }, filters: ["male", "female"], href: "/viewer", real: true, type: "anatomy" },
  { img: "an-organ", title: { vi: "Hệ tiêu hóa", en: "Digestive system", zh: "消化系统" }, filters: ["male", "female"], href: "/giai-phau/mo-hinh/tong-quan-he-tieu-hoa", real: true, type: "anatomy" },
  { img: "an-lung", title: { vi: "Hệ hô hấp", en: "Respiratory system", zh: "呼吸系统" }, filters: ["male", "female"], type: "anatomy" },
  { img: "an-vessel", title: { vi: "Hệ bạch huyết", en: "Lymphatic system", zh: "淋巴系统" }, filters: ["male", "female"], href: "/viewer", real: true, type: "anatomy" },
  { img: "an-organ", title: { vi: "Hệ nội tiết", en: "Endocrine system", zh: "内分泌系统" }, filters: ["male", "female"], type: "anatomy" },
  { img: "an-organ", title: { vi: "Hệ tiết niệu", en: "Urinary system", zh: "泌尿系统" }, filters: ["male", "female"], type: "anatomy" },
  { img: "an-organ", title: { vi: "Hệ sinh sản", en: "Reproductive system", zh: "生殖系统" }, filters: ["female"], type: "anatomy" },
  { img: "an-organ", title: { vi: "Hệ sinh sản", en: "Reproductive system", zh: "生殖系统" }, filters: ["male"], type: "anatomy" },
  { img: "an-cell", title: { vi: "Mô liên kết", en: "Connective tissue", zh: "结缔组织" }, filters: ["male", "female"], type: "anatomy" },
  { img: "an-cell", title: { vi: "Mô mỡ", en: "Fat", zh: "脂肪" }, filters: ["male", "female"], type: "anatomy" },
  { img: "an-cell", title: { vi: "Mạc", en: "Fascia", zh: "筋膜" }, filters: ["male", "female"], type: "anatomy" },
  { img: "an-cell", title: { vi: "Hệ thính giác", en: "Auditory system", zh: "听觉系统" }, filters: ["male", "female"], type: "anatomy" },
  { img: "an-brain", title: { vi: "Hệ thị giác", en: "Visual system", zh: "视觉系统" }, filters: ["male", "female"], type: "anatomy" },
];

const crossSectionCards: ResultCard[] = [
  {
    img: "an-organ",
    title: { vi: "Mặt cắt ngang bụng", en: "Abdomen Transverse Section", zh: "腹部横切面" },
    filters: [],
    href: "/giai-phau/mo-hinh/mat-cat-ngang-bung",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-organ",
    title: { vi: "Giải phẫu Gan (phân thuỳ Couinaud)", en: "Liver Anatomy (Couinaud Segments)", zh: "肝脏解剖（Couinaud分段）" },
    filters: [],
    href: "/giai-phau/mo-hinh/giai-phau-gan",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-organ",
    title: { vi: "Mặt cắt dạ dày", en: "Stomach Cross Section", zh: "胃横切面" },
    filters: [],
    href: "/giai-phau/mo-hinh/mat-cat-da-day",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-organ",
    title: { vi: "Giải phẫu Tuỵ", en: "Pancreas Anatomy", zh: "胰腺解剖" },
    filters: [],
    href: "/giai-phau/mo-hinh/giai-phau-tuy",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-organ",
    title: { vi: "Mặt cắt ruột non (hỗng tràng)", en: "Small Intestine Cross Section (Jejunum)", zh: "小肠横切面（空肠）" },
    filters: [],
    href: "/giai-phau/mo-hinh/mat-cat-ruot-non",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-organ",
    title: { vi: "Đại-trực tràng và mặt cắt đại tràng xích-ma", en: "Colorectal Anatomy and Sigmoid Colon Cross Section", zh: "大肠、直肠与乙状结肠横切面" },
    filters: [],
    href: "/giai-phau/mo-hinh/mat-cat-ruot-gia",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-organ",
    title: { vi: "Cơ thắt hậu môn và cơ nâng hậu môn", en: "Anal Sphincter and Levator Ani Muscles", zh: "肛门括约肌与提肛肌" },
    filters: [],
    href: "/giai-phau/mo-hinh/co-that-hau-mon",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-organ",
    title: { vi: "Mặt cắt túi mật", en: "Gallbladder Cross Section", zh: "胆囊切面" },
    filters: [],
    href: "/giai-phau/mo-hinh/mat-cat-tui-mat",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-organ",
    title: { vi: "Tổng quan hệ tiêu hoá (tạng bụng)", en: "Digestive System Overview (Abdominal Viscera)", zh: "消化系统总览（腹腔脏器）" },
    filters: [],
    href: "/giai-phau/mo-hinh/tong-quan-he-tieu-hoa",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-organ",
    title: { vi: "Phúc mạc: mạc nối và mạc treo", en: "Peritoneum: Omenta and Mesenteries", zh: "腹膜：网膜与系膜" },
    filters: [],
    href: "/giai-phau/mo-hinh/phuc-mac",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-heart",
    title: { vi: "Giải phẫu Tim", en: "Heart Anatomy", zh: "心脏解剖" },
    filters: [],
    href: "/giai-phau/mo-hinh/giai-phau-tim",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-heart",
    title: { vi: "Mặt cắt vành tim", en: "Heart Coronal Cross Section", zh: "心脏冠状切面" },
    filters: [],
    href: "/giai-phau/mo-hinh/mat-cat-vanh-tim",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-heart",
    title: { vi: "Động mạch vành", en: "Coronary Arteries", zh: "冠状动脉" },
    filters: [],
    href: "/giai-phau/mo-hinh/dong-mach-vanh",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-vessel",
    title: { vi: "Đa giác Willis", en: "Circle of Willis", zh: "威利斯环" },
    filters: [],
    href: "/giai-phau/mo-hinh/da-giac-willis",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-vessel",
    title: { vi: "Mặt cắt động mạch chủ bụng", en: "Abdominal Aorta Cross Section", zh: "腹主动脉横切面" },
    filters: [],
    href: "/giai-phau/mo-hinh/mat-cat-dong-mach",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-vessel",
    title: { vi: "Mặt cắt tĩnh mạch chủ dưới", en: "Inferior Vena Cava Cross Section", zh: "下腔静脉横切面" },
    filters: [],
    href: "/giai-phau/mo-hinh/mat-cat-tinh-mach",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-skel",
    title: { vi: "Giải phẫu Sọ", en: "Skull Anatomy", zh: "颅骨解剖" },
    filters: [],
    href: "/giai-phau/mo-hinh/giai-phau-so",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-skel",
    title: { vi: "Xương con Tai giữa", en: "Middle Ear Ossicles", zh: "中耳听小骨" },
    filters: [],
    href: "/giai-phau/mo-hinh/xuong-con-tai-giua",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-skel",
    title: { vi: "Cột sống", en: "Vertebral Column", zh: "脊柱" },
    filters: [],
    href: "/giai-phau/mo-hinh/cot-song",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-skel",
    title: { vi: "Lồng ngực", en: "Thoracic Cage", zh: "胸廓" },
    filters: [],
    href: "/giai-phau/mo-hinh/long-nguc",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-skel",
    title: { vi: "Xương chậu", en: "Pelvis Anatomy", zh: "骨盆解剖" },
    filters: [],
    href: "/giai-phau/mo-hinh/xuong-chau",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-skel",
    title: { vi: "Đai vai và Chi trên", en: "Shoulder Girdle and Upper Limb", zh: "肩带与上肢骨" },
    filters: [],
    href: "/giai-phau/mo-hinh/dai-vai-chi-tren",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-skel",
    title: { vi: "Xương Bàn tay", en: "Hand Bones", zh: "手骨" },
    filters: [],
    href: "/giai-phau/mo-hinh/ban-tay",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-skel",
    title: { vi: "Xương Chi dưới", en: "Lower Limb Bones", zh: "下肢骨" },
    filters: [],
    href: "/giai-phau/mo-hinh/chi-duoi",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-skel",
    title: { vi: "Xương Bàn chân", en: "Foot Bones", zh: "足骨" },
    filters: [],
    href: "/giai-phau/mo-hinh/ban-chan",
    real: true,
    type: "anatomy",
  },
  {
    img: "an-skel",
    title: { vi: "Bộ răng", en: "Dentition", zh: "牙列" },
    filters: [],
    href: "/giai-phau/mo-hinh/bo-rang",
    real: true,
    type: "anatomy",
  },
];

export const categoryData: Record<"tat-ca" | "theo-vung" | "theo-he" | "lat-cat", CategoryData> = {
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
