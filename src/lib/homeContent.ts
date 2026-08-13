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
    cta: { vi: "Truy cập thư viện", en: "Enter library", zh: "进入图书馆" },
  },
  // Menu chính editorial — 4 mục như mẫu Corpus & Anima
  mainMenu: [
    { label: { vi: "Giải phẫu người", en: "Human anatomy", zh: "人体解剖" }, href: "/nguoi" },
    { label: { vi: "Hệ cơ quan", en: "Organ systems", zh: "器官系统" }, href: "/giai-phau/theo-he" },
    { label: { vi: "Quiz", en: "Quiz", zh: "测验" }, href: "/quiz" },
    { label: { vi: "Vision AI", en: "Vision AI", zh: "视觉 AI" }, href: "/cu-chi" },
    { label: { vi: "Bệnh lý", en: "Pathology", zh: "病理" }, href: "/benh-ly" },
  ],
  // Khối 2 cột: Corpus (người) · Anima (thú y)
  twoCol: {
    corpus: {
      kicker: { vi: "Corpus", en: "Corpus", zh: "Corpus" },
      meta: { vi: "Mô hình thật · nhiều hệ", en: "Real models · multi-system", zh: "真实模型 · 多系统" },
      title: { vi: "Giải phẫu người", en: "Human anatomy", zh: "人体解剖" },
      latin: { vi: "Anatomia Humana", en: "Anatomia Humana", zh: "Anatomia Humana" },
      body: {
        vi: "Bản đồ đầy đủ hệ xương, cơ, thần kinh, tuần hoàn và các cơ quan nội tạng của Homo sapiens — có tham chiếu chéo lâm sàng.",
        en: "A complete map of the skeletal, muscular, nervous, cardiovascular and visceral systems of Homo sapiens — with clinical cross-reference.",
        zh: "涵盖智人骨骼、肌肉、神经、循环与内脏系统的完整图谱——附临床交叉参考。",
      },
      cta: { vi: "Vào atlas người", en: "Enter human atlas", zh: "进入人体图谱" },
      href: "/nguoi",
      img: "/plates/skull-human.png",
    },
    anima: {
      kicker: { vi: "Anima", en: "Anima", zh: "Anima" },
      meta: { vi: "Đang phát triển", en: "In development", zh: "开发中" },
      title: { vi: "Giải phẫu động vật", en: "Animal anatomy", zh: "动物解剖" },
      latin: { vi: "Anatomia Veterinaria", en: "Anatomia Veterinaria", zh: "Anatomia Veterinaria" },
      body: {
        vi: "Nghiên cứu so sánh trên chó, mèo, ngựa, gia cầm và động vật ngoại lai — phục vụ chẩn đoán và can thiệp lâm sàng.",
        en: "Comparative study across dogs, cats, horses, poultry and exotics — for clinical diagnosis and intervention.",
        zh: "涵盖犬、猫、马、家禽及外来动物的比较研究——服务于临床诊断与干预。",
      },
      cta: { vi: "Sắp ra mắt", en: "Coming soon", zh: "即将推出" },
      href: "/dong-vat",
      img: "/plates/skull-cat.jpg",
    },
  },
  // Hero trang Giải phẫu người
  humanHero: {
    eyebrow: { vi: "Corpus · Anatomia Humana", en: "Corpus · Anatomia Humana", zh: "Corpus · Anatomia Humana" },
    titlePre: { vi: "Atlas giải phẫu", en: "Human anatomy", zh: "人体解剖" },
    titleAccent: { vi: "người", en: "atlas", zh: "图谱" },
    lede: {
      vi: "Thư viện tham chiếu về cấu trúc cơ thể Homo sapiens — từ hệ cơ quan đến từng vùng giải phẫu, được đối chiếu với dữ liệu lâm sàng.",
      en: "A reference library of the Homo sapiens body — from organ systems to individual regions, verified against clinical data.",
      zh: "关于智人身体结构的参考库——从器官系统到各个解剖区域，均对照临床数据核验。",
    },
    ctaSystem: { vi: "Duyệt theo hệ cơ quan", en: "Browse by system", zh: "按系统浏览" },
    ctaRegion: { vi: "Duyệt theo vùng cơ thể", en: "Browse by region", zh: "按区域浏览" },
  },
  hero: {
    eyebrow: {
      vi: "Volumen I · Atlas tham chiếu",
      en: "Volumen I · Reference Atlas",
      zh: "第一卷 · 参考图谱",
    },
    // Tiêu đề editorial 3 phần — phần giữa in nghiêng đỏ nhấn
    titlePre: { vi: "Cấu trúc của sự sống,", en: "The structure of life,", zh: "生命的结构，" },
    titleAccent: { vi: "được ghi chép", en: "recorded", zh: "被精确" },
    titlePost: { vi: "một cách chính xác.", en: "with precision.", zh: "地记录。" },
    title: {
      vi: "Trực quan hóa giải phẫu người bằng mô hình 3D tương tác",
      en: "Visualize human anatomy with interactive 3D models",
      zh: "以交互式 3D 模型呈现人体解剖",
    },
    lede: {
      vi: "Atlas kỹ thuật số cho sinh viên y khoa, bác sĩ và bác sĩ thú y — hợp nhất giải phẫu người và giải phẫu so sánh trong một thư viện tham chiếu, dựng từ dữ liệu mở và đối chiếu chuẩn Terminologia Anatomica.",
      en: "A digital atlas for medical students, physicians and veterinarians — unifying human and comparative anatomy in one reference library, built from open data and verified against Terminologia Anatomica.",
      zh: "面向医学生、医生与兽医的数字图谱——在同一参考库中统一人体与比较解剖，基于开放数据并对照 Terminologia Anatomica 标准。",
    },
    ctaPrimary: { vi: "Vào atlas người", en: "Enter human atlas", zh: "进入人体图谱" },
    ctaSecondary: { vi: "Xem động vật nuôi", en: "View animals", zh: "查看动物" },
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
    /**
     * Hai mục này từng render bằng <div> trơ vì chưa có trang. Nay `/dong-vat`
     * và `/quiz` đã tồn tại nên gắn href — mục nào có href thì HomeNav render
     * thành <Link> bấm được, mục nào chưa có vẫn để trạng thái mờ.
     */
    upcoming: [
      { icon: "i-paw", label: { vi: "Giải phẫu thú y", en: "Veterinary anatomy", zh: "兽医解剖" }, href: "/dong-vat", vet: true },
      { icon: "i-quiz", label: { vi: "Trắc nghiệm giải phẫu", en: "Anatomy quizzes", zh: "解剖测验" }, href: "/quiz" },
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
