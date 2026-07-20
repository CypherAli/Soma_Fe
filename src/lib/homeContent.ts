export type Loc = "vi" | "en" | "zh";
export type T3 = Record<Loc, string>;

export const pick = (t: T3, l: Loc) => t[l] ?? t.vi;

type MenuItem = { icon: string; label: T3; vet?: boolean; href?: string };

/**
 * Nội dung tĩnh của trang chủ (chữ, nhãn, menu).
 *
 * DANH SÁCH MÔ HÌNH KHÔNG nằm ở đây — nó được dẫn xuất từ `catalog.ts`
 * (nguồn: sceneModules) để trang chủ luôn khớp với model thật đã xuất.
 *
 * Nguyên tắc: mọi thứ hiển thị phải có thật. Không có chuyên gia hư cấu,
 * không có sản phẩm chưa tồn tại, không có card trỏ vào nội dung trống.
 */
export const homeContent = {
  nav: {
    explore: { vi: "Khám phá", en: "Explore", zh: "探索" },
    library: { vi: "Thư viện của tôi", en: "My library", zh: "我的库" },
    quiz: { vi: "Trắc nghiệm", en: "Quizzes", zh: "测验" },
    signIn: { vi: "Đăng nhập", en: "Sign in", zh: "登录" },
    signOut: { vi: "Đăng xuất", en: "Sign out", zh: "退出" },
  },
  hero: {
    title: {
      vi: "Trực quan hóa giải phẫu người bằng mô hình 3D tương tác",
      en: "Visualize human anatomy with interactive 3D models",
      zh: "以交互式 3D 模型呈现人体解剖",
    },
    lede: {
      vi: "Mô hình dựng từ dữ liệu giải phẫu mở Z-Anatomy và BodyParts3D, thuật ngữ theo chuẩn Terminologia Anatomica.",
      en: "Models built from the open Z-Anatomy and BodyParts3D datasets, with terminology following Terminologia Anatomica.",
      zh: "模型基于开放数据集 Z-Anatomy 与 BodyParts3D 构建，术语遵循 Terminologia Anatomica 标准。",
    },
    search: {
      vi: "Tìm theo cấu trúc, hệ cơ quan hoặc tên Latin",
      en: "Search by structure, organ system, or Latin name",
      zh: "按结构、器官系统或拉丁名搜索",
    },
    searchBtn: { vi: "Tìm kiếm", en: "Search", zh: "搜索" },
    noResult: {
      vi: "Không có mô hình nào khớp — thử tên khác, ví dụ “gan” hoặc “hepar”.",
      en: "No matching model — try another term, e.g. “liver” or “hepar”.",
      zh: "没有匹配的模型——换个词试试，例如 “liver” 或 “hepar”。",
    },
    // Gợi ý trỏ tới cấu trúc CÓ THẬT trong catalog
    chips: [
      { vi: "Tim", en: "Heart", zh: "心脏" },
      { vi: "Gan", en: "Liver", zh: "肝脏" },
      { vi: "Xương sọ", en: "Skull", zh: "颅骨" },
      { vi: "Mắt", en: "Eye", zh: "眼" },
      { vi: "Cột sống", en: "Vertebral column", zh: "脊柱" },
    ] as T3[],
  },
  mega: {
    anatomyH: { vi: "Giải phẫu", en: "Anatomy", zh: "解剖" },
    anatomy: [
      { icon: "i-grid", label: { vi: "Tất cả mô hình", en: "All models", zh: "所有模型" }, href: "/giai-phau/tat-ca" },
      { icon: "i-region", label: { vi: "Giải phẫu theo vùng", en: "Anatomy by region", zh: "按区域" }, href: "/giai-phau/theo-vung" },
      { icon: "i-system", label: { vi: "Giải phẫu theo hệ", en: "Anatomy by system", zh: "按系统" }, href: "/giai-phau/theo-he" },
      { icon: "i-full", label: { vi: "Giải phẫu toàn thân", en: "Complete anatomy", zh: "完整解剖" }, href: "/viewer" },
    ] as MenuItem[],
    systemsH: { vi: "Hệ cơ quan", en: "Organ systems", zh: "器官系统" },
    /** Mục "Hệ cơ quan" trong mega-menu được sinh từ catalog, không khai ở đây. */
    upcomingH: { vi: "Đang xây dựng", en: "In progress", zh: "建设中" },
    upcoming: [
      { icon: "i-paw", label: { vi: "Giải phẫu thú y", en: "Veterinary anatomy", zh: "兽医解剖" }, vet: true },
      { icon: "i-quiz", label: { vi: "Trắc nghiệm giải phẫu", en: "Anatomy quizzes", zh: "解剖测验" } },
    ] as MenuItem[],
  },
  sections: {
    recent: { vi: "Mới cập nhật", en: "Recently added", zh: "最新添加" },
    recentSub: {
      vi: "Những mô hình được dựng gần đây nhất",
      en: "The most recently built models",
      zh: "最近构建的模型",
    },
    featured: { vi: "Mô hình tiêu biểu", en: "Featured models", zh: "精选模型" },
    featuredSub: {
      vi: "Chọn theo giá trị giảng dạy — cấu trúc rõ, nhiều cấu trúc được gắn nhãn",
      en: "Chosen for teaching value — clear structures, richly labelled",
      zh: "按教学价值挑选——结构清晰、标注丰富",
    },
    bySystem: { vi: "Duyệt theo hệ cơ quan", en: "Browse by organ system", zh: "按器官系统浏览" },
    bySystemSub: {
      vi: "Mỗi hệ gồm các mô hình đã dựng từ dữ liệu giải phẫu thật",
      en: "Each system groups the models built from real anatomical data",
      zh: "每个系统汇总基于真实解剖数据构建的模型",
    },
    viewAll: { vi: "Xem tất cả", en: "View all", zh: "查看全部" },
    modelCount: { vi: "mô hình", en: "models", zh: "个模型" },
    structureCount: { vi: "cấu trúc", en: "structures", zh: "个结构" },
  },
  stats: {
    heading: { vi: "Dự án gồm những gì", en: "What the project contains", zh: "项目内容" },
    scenes: { vi: "Mô hình 3D đã dựng", en: "3D models built", zh: "已构建 3D 模型" },
    systems: { vi: "Hệ cơ quan", en: "Organ systems", zh: "器官系统" },
    structures: { vi: "Cấu trúc được gắn nhãn", en: "Labelled structures", zh: "已标注结构" },
  },
  sources: {
    heading: { vi: "Nguồn dữ liệu và thuật ngữ", en: "Data sources and terminology", zh: "数据来源与术语" },
    body: {
      vi: "Hình học 3D dẫn xuất từ Z-Anatomy (CC BY-SA), bản thân là dẫn xuất của BodyParts3D do DBCLS Nhật Bản phát hành (CC BY-SA 2.1 JP). Khi Z-Anatomy thiếu một cấu trúc, mô hình được bổ sung trực tiếp từ BodyParts3D và ghi rõ xuất xứ ngay tại nhãn cấu trúc đó. Thuật ngữ giải phẫu theo Terminologia Anatomica (TA2).",
      en: "3D geometry derives from Z-Anatomy (CC BY-SA), itself derived from BodyParts3D published by DBCLS Japan (CC BY-SA 2.1 JP). Where Z-Anatomy lacks a structure, the model is supplemented directly from BodyParts3D and the provenance is stated on that structure's label. Anatomical terminology follows Terminologia Anatomica (TA2).",
      zh: "三维几何数据源自 Z-Anatomy (CC BY-SA)，后者派生自日本 DBCLS 发布的 BodyParts3D (CC BY-SA 2.1 JP)。当 Z-Anatomy 缺少某结构时，模型直接取自 BodyParts3D，并在该结构标签处注明出处。解剖术语遵循 Terminologia Anatomica (TA2)。",
    },
    gapsHeading: { vi: "Giới hạn dữ liệu đã biết", en: "Known data gaps", zh: "已知数据缺口" },
    gapsBody: {
      vi: "Bộ dữ liệu nguồn dựng trên cơ thể nam, nên chưa có cơ quan sinh dục nữ. Một số cấu trúc không tồn tại trong cả hai nguồn: ống hậu môn, bóng Vater, manh tràng đầy đủ, ống bán khuyên và mô mỡ. Những mục này được ghi là thiếu dữ liệu thay vì dựng hình phỏng đoán.",
      en: "The source datasets are built on a male body, so female reproductive organs are not available. Several structures exist in neither source: the anal canal, ampulla of Vater, a complete cecum, the semicircular canals, and adipose tissue. These are reported as missing data rather than modelled by guesswork.",
      zh: "源数据集基于男性人体构建，因此没有女性生殖器官。若干结构在两个来源中均不存在：肛管、Vater 壶腹、完整盲肠、半规管与脂肪组织。这些内容标注为数据缺失，而非凭推测建模。",
    },
  },
  footer: {
    lic: {
      vi: "Nền tảng giải phẫu 3D tương tác — đồ án tốt nghiệp. Dữ liệu dựa trên Z-Anatomy (CC BY-SA) và BodyParts3D (CC BY-SA 2.1 JP), thuật ngữ theo Terminologia Anatomica.",
      en: "Interactive 3D anatomy platform — graduation project. Data based on Z-Anatomy (CC BY-SA) and BodyParts3D (CC BY-SA 2.1 JP), terminology per Terminologia Anatomica.",
      zh: "交互式 3D 解剖平台——毕业设计。数据基于 Z-Anatomy (CC BY-SA) 与 BodyParts3D (CC BY-SA 2.1 JP)，术语依据 Terminologia Anatomica。",
    },
    productH: { vi: "Khám phá", en: "Explore", zh: "探索" },
    resourcesH: { vi: "Tài nguyên", en: "Resources", zh: "资源" },
    languageH: { vi: "Ngôn ngữ", en: "Language", zh: "语言" },
    product: [
      { label: { vi: "Tất cả mô hình", en: "All models", zh: "所有模型" }, href: "/giai-phau/tat-ca" },
      { label: { vi: "Theo hệ cơ quan", en: "By organ system", zh: "按器官系统" }, href: "/giai-phau/theo-he" },
      { label: { vi: "Theo vùng cơ thể", en: "By body region", zh: "按身体区域" }, href: "/giai-phau/theo-vung" },
      { label: { vi: "Giải phẫu toàn thân", en: "Complete anatomy", zh: "完整解剖" }, href: "/viewer" },
    ],
    resources: [
      { label: { vi: "Thư viện của tôi", en: "My library", zh: "我的库" }, href: "/thu-vien" },
      { label: { vi: "Z-Anatomy", en: "Z-Anatomy", zh: "Z-Anatomy" }, href: "https://www.z-anatomy.com/", external: true },
      { label: { vi: "BodyParts3D (DBCLS)", en: "BodyParts3D (DBCLS)", zh: "BodyParts3D (DBCLS)" }, href: "https://dbarchive.biosciencedbc.jp/en/bodyparts3d/desc.html", external: true },
      { label: { vi: "Giấy phép CC BY-SA", en: "CC BY-SA licence", zh: "CC BY-SA 许可" }, href: "https://creativecommons.org/licenses/by-sa/4.0/", external: true },
    ],
    languages: [
      { label: "Tiếng Việt", loc: "vi" as Loc },
      { label: "English", loc: "en" as Loc },
      { label: "中文", loc: "zh" as Loc },
    ],
  },
};
