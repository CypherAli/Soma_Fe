export type Loc = "vi" | "en" | "zh";
export type T3 = Record<Loc, string>;

export const pick = (t: T3, l: Loc) => t[l] ?? t.vi;

type MenuItem = { icon: string; label: T3; vet?: boolean; href?: string };
type Card = { img: string; title: T3; sub?: T3; lock?: boolean; badge?: T3 };
type Collection = { img: string; color: string; title: T3; author: T3; role: T3 };

export const homeContent = {
  nav: {
    explore: { vi: "Khám phá", en: "Explore", zh: "探索" },
    library: { vi: "Thư viện của tôi", en: "My library", zh: "我的库" },
    studio: { vi: "Studio", en: "Studio", zh: "工作室" },
    upgrade: { vi: "Nâng cấp", en: "Upgrade", zh: "升级" },
  },
  hero: {
    title: {
      vi: "Trực quan hóa giải phẫu, bệnh lý và điều trị bằng 3D tương tác",
      en: "Visualize anatomy, disease, and treatments in interactive 3D",
      zh: "以交互式 3D 呈现解剖、疾病与治疗",
    },
    search: {
      vi: "Tìm mô hình 3D theo cấu trúc, chủ đề hoặc cụm từ",
      en: "Search 3D models by term, subject, or phrase",
      zh: "按结构、主题或短语搜索 3D 模型",
    },
    searchBtn: { vi: "Tìm kiếm", en: "Search", zh: "搜索" },
    chips: [
      { vi: "Bệnh tim mạch", en: "Heart disease", zh: "心脏病" },
      { vi: "Sức khỏe mắt", en: "Eye health", zh: "眼健康" },
      { vi: "Điều trị ung thư", en: "Cancer treatment", zh: "癌症治疗" },
      { vi: "Thai kỳ", en: "Pregnancy", zh: "妊娠" },
      { vi: "Đau lưng", en: "Back pain", zh: "腰痛" },
    ] as T3[],
  },
  mega: {
    anatomyH: { vi: "Giải phẫu", en: "Anatomy", zh: "解剖" },
    anatomy: [
      { icon: "i-region", label: { vi: "Giải phẫu theo vùng", en: "Anatomy by region", zh: "按区域" }, href: "/giai-phau/theo-vung" },
      { icon: "i-system", label: { vi: "Giải phẫu theo hệ", en: "Anatomy by system", zh: "按系统" }, href: "/giai-phau/theo-he" },
      { icon: "i-full", label: { vi: "Giải phẫu toàn thân", en: "Complete anatomy", zh: "完整解剖" }, href: "/viewer" },
      { icon: "i-bone", label: { vi: "Mốc xương, nguyên ủy & bám tận", en: "Bony landmarks & insertions", zh: "骨性标志与附着" } },
      { icon: "i-cross", label: { vi: "Lát cắt & vi giải phẫu", en: "Cross sections & microanatomy", zh: "断面与微观解剖" } },
      { icon: "i-quiz", label: { vi: "Trắc nghiệm giải phẫu", en: "Anatomy quizzes", zh: "解剖测验" } },
      { icon: "i-paw", label: { vi: "Giải phẫu thú y", en: "Veterinary anatomy", zh: "兽医解剖" }, vet: true },
    ] as MenuItem[],
    communityH: { vi: "Cộng đồng", en: "Community", zh: "社区" },
    community: [
      { icon: "i-community", label: { vi: "Nội dung cộng đồng", en: "Community content", zh: "社区内容" } },
    ] as MenuItem[],
    specialtiesH: { vi: "Chuyên khoa", en: "Specialties", zh: "专科" },
    specialties: [
      { icon: "i-cell", label: { vi: "Dị ứng & Miễn dịch", en: "Allergy & Immunology", zh: "过敏与免疫" } },
      { icon: "i-brain", label: { vi: "Thần kinh & Tâm thần", en: "Neurology & Psychiatry", zh: "神经与精神" } },
      { icon: "i-heart", label: { vi: "Tim mạch", en: "Cardiology", zh: "心脏科" } },
      { icon: "i-baby", label: { vi: "Sản khoa", en: "Obstetrics", zh: "产科" } },
      { icon: "i-tooth", label: { vi: "Nha khoa", en: "Dentistry", zh: "牙科" } },
      { icon: "i-ribbon", label: { vi: "Ung bướu", en: "Oncology", zh: "肿瘤科" } },
      { icon: "i-derma", label: { vi: "Da liễu", en: "Dermatology", zh: "皮肤科" } },
      { icon: "i-eye", label: { vi: "Nhãn khoa", en: "Ophthalmology", zh: "眼科" } },
      { icon: "i-ear", label: { vi: "Tai Mũi Họng", en: "Ear, Nose & Throat", zh: "耳鼻喉" } },
      { icon: "i-bone", label: { vi: "Chỉnh hình & Thấp khớp", en: "Orthopedics & Rheumatology", zh: "骨科与风湿" } },
      { icon: "i-droplet", label: { vi: "Nội tiết", en: "Endocrinology", zh: "内分泌" } },
      { icon: "i-baby", label: { vi: "Nhi khoa", en: "Pediatrics", zh: "儿科" } },
      { icon: "i-stomach", label: { vi: "Tiêu hóa", en: "Gastroenterology", zh: "消化科" } },
      { icon: "i-region", label: { vi: "Vật lý trị liệu", en: "Physical Therapy", zh: "物理治疗" } },
      { icon: "i-gyn", label: { vi: "Phụ khoa", en: "Gynecology", zh: "妇科" } },
      { icon: "i-steth", label: { vi: "Chăm sóc ban đầu", en: "Primary Care", zh: "初级保健" } },
      { icon: "i-droplet", label: { vi: "Huyết học", en: "Hematology", zh: "血液科" } },
      { icon: "i-lungs", label: { vi: "Hô hấp", en: "Pulmonology", zh: "呼吸科" } },
      { icon: "i-virus", label: { vi: "Bệnh truyền nhiễm", en: "Infectious Disease", zh: "传染病" } },
      { icon: "i-nephro", label: { vi: "Tiết niệu & Thận", en: "Urology & Nephrology", zh: "泌尿与肾" } },
    ] as MenuItem[],
    collectionsH: { vi: "Bộ sưu tập chuyên gia", en: "Expert Collections", zh: "专家合集" },
  },
  sections: {
    expert: { vi: "Bộ sưu tập chuyên gia", en: "Expert Collections", zh: "专家合集" },
    whatsNew: { vi: "Mới cập nhật", en: "What's new", zh: "最新" },
    featured: { vi: "Nổi bật", en: "Featured", zh: "精选" },
    journeys: { vi: "Lộ trình có dẫn dắt", en: "Guided Journeys", zh: "引导式学习" },
  },
  collections: [
    { img: "an-organ", color: "f-blue", title: { vi: "Sức khỏe sinh sản cho giáo dục bệnh nhân", en: "Reproductive health for patient education", zh: "面向患者教育的生殖健康" }, author: { vi: "Biên soạn cùng BS. Nguyễn T. Lan", en: "Created with Dr. Nguyen T. Lan", zh: "与 Nguyen T. Lan 医生合作" }, role: { vi: "Bệnh viện Phụ sản Trung ương", en: "National OB-GYN Hospital", zh: "国家妇产医院" } },
    { img: "an-skel", color: "f-purple", title: { vi: "Giải phẫu hệ cơ quan nền tảng cho sinh viên y", en: "Foundational organ system anatomy for medical students", zh: "医学生的基础器官系统解剖" }, author: { vi: "Biên soạn cùng ThS. Trần V. Minh", en: "Created with MSc. Tran V. Minh", zh: "与 Tran V. Minh 硕士合作" }, role: { vi: "Đại học Y Hà Nội", en: "Hanoi Medical University", zh: "河内医科大学" } },
    { img: "an-muscle", color: "f-teal", title: { vi: "Giải phẫu cho vật lý trị liệu", en: "Anatomy for physical therapy", zh: "物理治疗解剖" }, author: { vi: "Biên soạn cùng BS. Lê H. Anh", en: "Created with Dr. Le H. Anh", zh: "与 Le H. Anh 医生合作" }, role: { vi: "Khoa Phục hồi chức năng", en: "Dept. of Rehabilitation", zh: "康复科" } },
  ] as Collection[],
  whatsNew: [
    { img: "an-skel", title: { vi: "Tiêm chất làm đầy da", en: "Dermal fillers", zh: "皮肤填充" }, sub: { vi: "Da liễu", en: "Dermatology", zh: "皮肤科" }, lock: true },
    { img: "an-organ", title: { vi: "Đốt nội mạc tử cung", en: "Endometrial ablation", zh: "子宫内膜消融" }, sub: { vi: "Có hoạt ảnh", en: "Animated", zh: "含动画" }, lock: true },
    { img: "an-lung", title: { vi: "Mở khí quản", en: "Tracheostomy", zh: "气管切开" }, sub: { vi: "Thủ thuật", en: "Procedure", zh: "操作" }, lock: true },
    { img: "an-nerve", title: { vi: "Đốt sóng cao tần", en: "Radiofrequency ablation", zh: "射频消融" }, sub: { vi: "Thần kinh", en: "Neurology", zh: "神经" }, lock: true },
    { img: "an-vet", title: { vi: "Giải phẫu chó", en: "Dog anatomy", zh: "犬解剖" }, sub: { vi: "Canis familiaris", en: "Canis familiaris", zh: "Canis familiaris" }, badge: { vi: "THÚ Y", en: "VET", zh: "兽医" } },
  ] as Card[],
  featured: [
    { img: "an-heart", title: { vi: "Dòng máu tim sơ sinh", en: "Neonatal heart blood flow", zh: "新生儿心脏血流" }, sub: { vi: "Tuần hoàn", en: "Circulation", zh: "循环" } },
    { img: "an-cell", title: { vi: "Tế bào", en: "Cell", zh: "细胞" }, sub: { vi: "Sinh học", en: "Biology", zh: "生物" }, lock: true },
    { img: "an-organ", title: { vi: "Cắt tuyến vú", en: "Mastectomy", zh: "乳房切除" }, sub: { vi: "Phẫu thuật", en: "Surgery", zh: "外科" }, lock: true },
    { img: "an-lung", title: { vi: "Đặt nội khí quản", en: "Endotracheal intubation", zh: "气管插管" }, sub: { vi: "Hồi sức", en: "Critical care", zh: "重症" }, lock: true },
    { img: "an-nerve", title: { vi: "Thần kinh tọa", en: "Sciatic nerve", zh: "坐骨神经" }, sub: { vi: "Nervus ischiadicus", en: "Nervus ischiadicus", zh: "Nervus ischiadicus" }, lock: true },
  ] as Card[],
  journeys: [
    { img: "an-muscle", title: { vi: "Ung thư vú", en: "Breast cancer", zh: "乳腺癌" }, sub: { vi: "Lộ trình", en: "Journey", zh: "旅程" }, lock: true },
    { img: "an-cell", title: { vi: "Hen tăng bạch cầu ái toan", en: "Eosinophilic asthma", zh: "嗜酸性哮喘" }, sub: { vi: "Hô hấp", en: "Respiratory", zh: "呼吸" }, lock: true },
    { img: "an-brain", title: { vi: "Đau nửa đầu", en: "Migraine", zh: "偏头痛" }, sub: { vi: "Thần kinh", en: "Neurology", zh: "神经" }, lock: true },
    { img: "an-organ", title: { vi: "Cắt túi mật", en: "Cholecystectomy", zh: "胆囊切除" }, sub: { vi: "Tiêu hóa", en: "Digestive", zh: "消化" }, lock: true },
    { img: "an-vessel", title: { vi: "Thuốc giảm đau opioid", en: "Opioids", zh: "阿片类药物" }, sub: { vi: "Dược lý", en: "Pharmacology", zh: "药理" }, lock: true },
  ] as Card[],
  feature: {
    completeTitle: { vi: "Mô hình giải phẫu 3D hoàn chỉnh", en: "Complete 3D anatomy models", zh: "完整 3D 解剖模型" },
    completeDesc: { vi: "Những mô hình cơ thể người chính xác và chi tiết nhất, dựng cho mục đích giảng dạy.", en: "The most accurate and detailed virtual models of the human body, built for teaching.", zh: "最精确详尽的人体虚拟模型，为教学而建。" },
    female: { vi: "Mở cơ thể nữ", en: "Launch female", zh: "打开女性" },
    male: { vi: "Mở cơ thể nam", en: "Launch male", zh: "打开男性" },
    studioT: { vi: "Soma Studio", en: "Soma Studio", zh: "Soma 工作室" },
    studioD: { vi: "Tùy biến và xuất bản mô hình 3D cho nhu cầu giảng dạy của riêng bạn.", en: "Customize and publish 3D models for your own teaching needs.", zh: "定制并发布满足教学需求的 3D 模型。" },
    vrT: { vi: "Soma VR", en: "Soma VR", zh: "Soma VR" },
    vrD: { vi: "Trải nghiệm học tập nhập vai và cộng tác trong thực tế ảo mở rộng.", en: "Immersive, collaborative learning in extended reality.", zh: "在扩展现实中沉浸式协作学习。" },
    svcT: { vi: "Dịch vụ trực quan 3D", en: "3D visualization services", zh: "3D 可视化服务" },
    svcD: { vi: "Đội ngũ dựng nội dung giải phẫu, quy trình hoặc ca bệnh theo yêu cầu.", en: "Our team builds anatomy, procedure, or case content on request.", zh: "团队按需构建解剖、操作或病例内容。" },
  },
  footer: {
    lic: { vi: "Nền tảng giải phẫu 3D tương tác cho ngành y — con người & thú y. Đồ án tốt nghiệp. Dữ liệu dựa trên Z-Anatomy (CC-BY-SA), thuật ngữ theo Terminologia Anatomica.", en: "Interactive 3D anatomy platform for medicine — human & veterinary. Graduation project. Data based on Z-Anatomy (CC-BY-SA), terminology per Terminologia Anatomica.", zh: "面向医学的交互式 3D 解剖平台——人体与兽医。毕业设计。数据基于 Z-Anatomy (CC-BY-SA)，术语依据 Terminologia Anatomica。" },
    productH: { vi: "Sản phẩm", en: "Product", zh: "产品" },
    resourcesH: { vi: "Tài nguyên", en: "Resources", zh: "资源" },
    languageH: { vi: "Ngôn ngữ", en: "Language", zh: "语言" },
    product: [
      { vi: "Khám phá", en: "Explore", zh: "探索" },
      { vi: "Thư viện của tôi", en: "My library", zh: "我的库" },
      { vi: "Studio", en: "Studio", zh: "工作室" },
      { vi: "VR", en: "VR", zh: "VR" },
    ] as T3[],
    resources: [
      { vi: "Bộ sưu tập", en: "Collections", zh: "合集" },
      { vi: "Lộ trình học", en: "Journeys", zh: "学习路径" },
      { vi: "Thuật ngữ TA2", en: "TA2 terminology", zh: "TA2 术语" },
      { vi: "Giấy phép", en: "License", zh: "许可" },
    ] as T3[],
    languages: [
      { vi: "Tiếng Việt", en: "Tiếng Việt", zh: "Tiếng Việt" },
      { vi: "English", en: "English", zh: "English" },
      { vi: "中文", en: "中文", zh: "中文" },
    ] as T3[],
  },
};
