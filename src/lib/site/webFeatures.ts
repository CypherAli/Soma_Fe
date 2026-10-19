import quizCatalog from "../../../public/kb/dr-lam/index.json" with { type: "json" };
import type { T3 } from "@/lib/homeContent";
import { catalogStats } from "@/lib/catalog";

export type WebGuide = {
  id: string;
  kind: "feature" | "quiz";
  title: T3;
  body: T3;
  keys: string[];
  href: string;
};

const t = (vi: string, en: string, zh: string): T3 => ({ vi, en, zh });
export const quizInventory = {
  sets: quizCatalog.exams.length,
  questions: quizCatalog.totalQuestions,
};

/** Public product knowledge shared by navigation search and grounded answers. */
export const webFeatureGuides: WebGuide[] = [
  {
    id: "feature:catalog", kind: "feature", href: "/thu-vien",
    title: t("Thư viện mô hình 3D của Soma", "Soma's 3D model library", "Soma 三维模型库"),
    keys: ["bao nhiêu mô hình", "số lượng mô hình", "thư viện mô hình", "tất cả mô hình", "danh sách mô hình", "how many models", "model library", "all models", "多少模型", "模型列表"],
    body: t(`Soma có ${catalogStats.scenes} mô hình/bài học 3D, ${catalogStats.systems} hệ và ${catalogStats.structures} nhóm cấu trúc được khai báo trong danh mục. Mở /thu-vien để tìm theo tên Việt, Anh, Latin và lọc hệ cơ quan, cách học. Đây là số đếm danh mục; số cấu trúc nguồn trong từng mô hình Vision AI được hiển thị riêng trong mô hình đó.`, `Soma's catalog contains ${catalogStats.scenes} 3D models/lessons, ${catalogStats.systems} systems and ${catalogStats.structures} declared structure groups. Search /thu-vien by Vietnamese, English or Latin terms and filter by system or lesson type. These are catalog counts; individual Vision AI source structure counts are shown separately in each model.`, `Soma 目录包含 ${catalogStats.scenes} 个三维模型/课程、${catalogStats.systems} 个系统及 ${catalogStats.structures} 个已声明结构分组。在 /thu-vien 按越南语、英语、拉丁术语搜索并筛选系统或课程类型。这是目录计数，各个 Vision AI 模型的原始结构数量另行显示。`),
  },
  {
    id: "feature:account", kind: "feature", href: "/dang-nhap",
    title: t("Đăng nhập và tài khoản", "Login and account", "登录与账户"),
    keys: ["đăng nhập", "tài khoản", "đăng ký", "quên mật khẩu", "login", "sign in", "account", "登录", "账户"],
    body: t("Mở /dang-nhap để đăng nhập tài khoản Soma. Tài liệu cá nhân, tạo đề theo tài khoản và các chức năng quản lý cần đăng nhập. Các mô hình và bộ đề Y Hà Nội công khai có thể xem trước khi đăng nhập. Thông tin tài khoản và tài liệu riêng không được đưa vào kho tìm kiếm công khai.", "Open /dang-nhap to sign in to Soma. Personal documents, account-based quiz tools and management functions require login. Public models and Hanoi question sets can be viewed before signing in. Account data and private documents are excluded from public search.", "在 /dang-nhap 登录 Soma。个人文档、账户出题及管理功能需登录，公开模型及河内题库可在登录前查看；账户信息和私人文档不纳入公开搜索。"),
  },
  {
    id: "feature:quiz", kind: "feature", href: "/quiz",
    title: t("Trắc nghiệm và ôn tập", "Quizzes and revision", "测验与复习"),
    keys: ["trắc nghiệm", "quiz", "đề y hà nội", "đại học y hà nội", "bao nhiêu bộ đề", "hanoi medical university", "ôn thi", "ôn tập", "làm bài kiểm tra", "lịch ôn", "flashcard", "test yourself", "revision", "河内医科大学", "测验", "练习题", "复习"],
    body: t(
      `Trang /quiz có ${quizInventory.sets} bộ đề Đại học Y Hà Nội, ${quizInventory.questions} câu từ PDF bạn cung cấp. Có luyện tập, thi thử, xem kết quả và làm lại câu sai. Các công cụ Tạo đề & mô hình 3D, PDF & Word của tôi, Lộ trình ôn tập và AI tạo đề vẫn nằm trên thanh công cụ. Tiến độ bộ đề được lưu trong trình duyệt; công cụ tài liệu cá nhân cần đăng nhập.`,
      `/quiz contains ${quizInventory.sets} Hanoi Medical University sets with ${quizInventory.questions} questions imported from the supplied PDFs. Practice, exams, results and mistake review are available. Quiz & 3D models, My PDF & Word, Study plan and AI quiz composer remain in the tool bar. Source-set progress is stored in this browser; personal document tools require login.`,
      `/quiz 包含由所提供 PDF 导入的 ${quizInventory.sets} 套河内医科大学试题，共 ${quizInventory.questions} 题，可练习、模拟考试、查看成绩及复习错题。工具栏仍保留三维模型出题、个人 PDF 与 Word、复习计划及 AI 出题。题库进度保存在当前浏览器；个人文档工具需登录。`,
    ),
  },
  {
    id: "feature:gesture", kind: "feature", href: "/cu-chi",
    title: t("Điều khiển bằng cử chỉ (Vision AI)", "Gesture control (Vision AI)", "手势控制（Vision AI）"),
    keys: ["cử chỉ", "điều khiển bằng tay", "vision ai", "webcam", "camera", "like tay trái", "like tay phải", "chuyển mô hình", "đổi mô hình", "gesture control", "thumbs up", "switch model", "手势", "摄像头控制"],
    body: t(
      "Trang /cu-chi cho xem và điều khiển nhiều vùng giải phẫu người. Like tay trái chuyển mô hình tiếp; like tay phải chuyển hệ trong mô hình hiện tại. Hạ ngón cái rồi giơ lại để chuyển thêm một lần. Mô hình cũ tan thành hạt rồi mô hình mới gom lại; sau khi đổi, góc nhìn về phía trước, phóng đại 1× và bỏ lựa chọn/tách cũ. Nắm tay lắp mô hình, mở tay tách các hệ; trỏ và giữ chọn cấu trúc. Có thể chọn mô hình và hệ bằng bảng điều khiển mà không bật camera. Nhận diện bàn tay để điều khiển chạy trong trình duyệt.",
      "/cu-chi displays and controls multiple human anatomy regions. A left-hand thumbs-up advances the model; a right-hand thumbs-up advances the system in the current model. Lower and raise the thumb to advance again. The old model dissolves into particles and the new model forms; switching restores the front view, 1× zoom and clears old selection/separation. A fist assembles, an open hand separates systems, and pointing with a dwell selects a structure. The control panel also works without a camera. Gesture hand tracking runs in the browser.",
      "/cu-chi 可查看及操作多个解剖区域。左手点赞切换模型，右手点赞切换当前模型的系统；放下再举起拇指可再次切换。旧模型化为粒子，新模型重新聚合，随后恢复正面、1× 缩放并清除旧选择及分离状态。握拳组装，张手分离系统，指向并停留选择结构；也可不启用摄像头直接使用控制面板。手势追踪在浏览器内运行。",
    ),
  },
  {
    id: "feature:documents", kind: "feature", href: "/quiz?tool=pdf",
    title: t("PDF & Word của tôi", "My PDF & Word", "我的 PDF 与 Word"),
    keys: ["pdf", "word", "tài liệu của tôi", "tài liệu cá nhân", "tải đề cương", "upload document", "personal documents", "个人文档", "上传文档"],
    body: t(
      "Vào /quiz, chọn PDF & Word của tôi. Đăng nhập để tải, quản lý và tạo câu hỏi từ tài liệu cá nhân. Bộ đề Đại học Y Hà Nội là nguồn riêng, không thay thế công cụ PDF/Word. Nội dung tài liệu cá nhân không thuộc kho tìm kiếm công khai của Soma.",
      "Open /quiz and choose My PDF & Word. Sign in to upload, manage and generate questions from personal documents. The Hanoi Medical University bank is a separate source and does not replace PDF/Word tools. Private document content is excluded from Soma's public search index.",
      "打开 /quiz 并选择“我的 PDF 与 Word”，登录后可上传、管理文档并生成题目。河内医科大学题库是独立来源，不替代个人文档工具；私人文档内容不纳入公开搜索索引。",
    ),
  },
  {
    id: "feature:quiz-feedback", kind: "feature", href: "/quiz",
    title: t("Ảnh câu hỏi và giải thích đáp án", "Question images and answer explanations", "题目图片与答案解析"),
    keys: ["ảnh gợi ý", "hình gợi ý", "ảnh đáp án", "giải thích đáp án", "kiểm tra đáp án", "nộp bài", "answer explanation", "hint image", "submit exam", "答案解析", "提示图片"],
    body: t(
      "Ảnh thuộc phần đề được hiển thị để đọc câu hỏi. Ảnh giải thích hoặc gợi ý từ PDF chỉ xuất hiện sau khi kiểm tra đáp án trong luyện tập, hoặc sau khi nộp bài thi thử. Câu chọn nhiều đáp án chỉ được tính đúng khi chọn đúng toàn bộ tập đáp án nguồn. Câu không có đáp án xác định trong nguồn được đánh dấu không chấm điểm.",
      "Images belonging to a question are visible while answering. Explanation/hint images from the PDF appear only after checking a practice answer or submitting the exam. A multiple-answer question is correct only if the selected set exactly matches the source key. Questions without a definite source key are marked ungraded.",
      "题干图片在答题时显示；PDF 中的解析或提示图片只在练习检查答案后、或模拟考试交卷后显示。多选题必须与原始答案集合完全一致才计为正确；来源没有确定答案的题目标为不评分。",
    ),
  },
  {
    id: "feature:study-plan", kind: "feature", href: "/quiz?tool=adaptive",
    title: t("Lộ trình ôn tập", "Study plan", "复习计划"),
    keys: ["lộ trình", "kế hoạch ôn", "study plan", "adaptive", "复习计划"],
    body: t("Chọn Lộ trình ôn tập trên /quiz để dùng công cụ kế hoạch học; chức năng theo tài khoản cần đăng nhập. Xem lại câu sai của đề Y Hà Nội ngay trong phần kết quả của bộ đề.", "Choose Study plan on /quiz to use the planning tool; account-based functions require login. Hanoi set mistakes can also be reviewed directly from that set's results.", "在 /quiz 选择复习计划；与账户相关的功能需登录。河内题库的错题也可直接在该试卷的成绩中复习。"),
  },
  {
    id: "feature:quiz-ai", kind: "feature", href: "/quiz?tool=ai",
    title: t("AI tạo đề", "AI quiz composer", "AI 出题"),
    keys: ["ai tạo đề", "tạo câu hỏi ai", "ai quiz", "quiz composer", "ai 出题"],
    body: t("Chọn AI tạo đề trên /quiz để tạo bộ câu hỏi theo chủ đề. Công cụ sử dụng tài khoản và dịch vụ AI được cấu hình trên máy chủ; nếu chưa đăng nhập, trang hướng dẫn đăng nhập. Đề nguồn Đại học Y Hà Nội được nhập từ PDF, không phải câu do AI tự viết lại.", "Choose AI quiz composer on /quiz to create topic-based questions. This tool uses an account and the configured server AI service; unsigned users are prompted to log in. Hanoi Medical University source sets come from PDFs and are not AI-rewritten questions.", "在 /quiz 选择 AI 出题以按主题创建题目；该功能使用账户及服务器配置的 AI 服务，未登录时会提示登录。河内医科大学原始题库来自 PDF，不是 AI 改写的题目。"),
  },
  {
    id: "feature:vision-detail", kind: "feature", href: "/cu-chi",
    title: t("Xem chi tiết cấu trúc trong Vision AI", "Inspect structures in Vision AI", "在 Vision AI 查看结构细节"),
    keys: ["danh sách cấu trúc", "nhóm nhãn", "tìm cấu trúc", "chất lượng hiển thị", "mô hình quá nhỏ", "vị trí mặc định", "detail mode", "structure list", "label pages", "结构列表", "默认视角"],
    body: t("Trong /cu-chi, chọn vùng, mô hình và hệ ở bảng điều khiển. Xem N cấu trúc mở danh sách đầy đủ; ô tìm kiếm tra tên Việt, tên nguồn Anh hoặc mã cấu trúc. Chọn một tên để căn giữa và xem riêng; dùng nút Nhóm nhãn để chuyển nhóm chú thích. Chế độ Chi tiết render ở độ phân giải 2× và giữ nguyên lưới nguồn. Đặt lại đưa về góc trước và 1×. Tên nguồn tiếng Anh được ghi rõ riêng; nguồn chưa có tên dịch chính xác giữ nhóm và mã nguồn để tránh gán tên sai.", "In /cu-chi choose a region, model and system in the panel. View N structures opens the complete list; search accepts Vietnamese names, original English names and source IDs. Select a name to center and isolate it; label-page controls browse annotation groups. Detail mode renders at 2× resolution with the original geometry. Reset restores front view and 1× zoom. English source names are explicitly identified; entries without an exact translation retain a group and source ID rather than a guessed name.", "在 /cu-chi 面板中选择区域、模型及系统。“查看 N 个结构”打开完整列表，可按越南语名称、原始英文名称及来源编号搜索；选中名称可居中单独观察，标签翻页按钮可浏览各组注释。细节模式以 2× 分辨率渲染原始网格，重置恢复正面及 1×。英文原名另行标注，没有确定翻译的条目保留分组及来源编号，避免猜测名称。"),
  },
  {
    id: "feature:assistant", kind: "feature", href: "/tro-ly",
    title: t("Trợ lý Soma Bot", "Soma Bot assistant", "Soma Bot 助手"),
    keys: ["trợ lý", "soma bot", "hỏi đáp", "hỏi ai", "assistant", "source citation", "助手", "问答"],
    body: t("Trang /tro-ly và nút Soma Bot tra cứu nhãn mô hình, kiến thức giải phẫu, thú y, tư liệu bệnh học và hướng dẫn sử dụng chính Soma. Câu trả lời có các nguồn đánh số kèm liên kết. Chỉ diễn giải nội dung truy xuất được; không đủ tư liệu thì nói rõ. Có thể hỏi cách mở Quiz, PDF/Word hoặc cách dùng cử chỉ Vision AI. Nội dung tài liệu cá nhân không được đưa vào kho tìm kiếm công khai.", "The /tro-ly page and Soma Bot button retrieve model labels, anatomy, veterinary and pathology material, plus guides to using Soma itself. Answers carry numbered sources and links, and explain only retrieved evidence. Missing material is reported. You can ask how to open Quiz or PDF/Word tools, or use Vision AI gestures. Private document content is excluded from public search.", "/tro-ly 页面及 Soma Bot 按钮检索模型标注、解剖、兽医、病理资料及 Soma 使用指南。回答附编号来源和链接，只解释检索到的依据，缺少资料时会说明。可询问如何打开题库或 PDF/Word 工具及使用 Vision AI 手势；私人文档不纳入公开搜索。"),
  },
  {
    id: "feature:search", kind: "feature", href: "/tim-kiem",
    title: t("Tìm kiếm và hỏi AI theo nguồn", "Search and source-grounded AI", "搜索与有据 AI 问答"),
    keys: ["tìm kiếm", "tìm kiếm ai", "hỏi ai", "tra cứu web", "search", "rag", "搜索", "资料检索"],
    body: t("Trang /tim-kiem tra mô hình, bộ đề và hướng dẫn tính năng trong dữ liệu công khai của chính Soma. Ô tìm kiếm thường và trợ lý dùng chung các mục hệ thống. Hỏi AI theo nguồn để nhận câu trả lời kèm liên kết nguồn. Khi AI chưa được cấu hình hoặc gặp lỗi, trang vẫn trả nội dung truy xuất được. Không có tư liệu phù hợp thì nói rõ chưa tìm thấy; không tự tạo nội dung thiếu.", "Search /tim-kiem for models, quiz sets and feature guides in Soma's own public data. Navigation search and the assistant share the system entries. Source-grounded AI answers include source links. When AI is unconfigured or fails, retrieved content remains available. Missing evidence is reported rather than invented.", "在 /tim-kiem 搜索 Soma 公开数据中的模型、题库及功能指南。普通搜索与助手共用系统条目，有据 AI 回答附带来源链接。AI 未配置或出错时仍显示检索内容；缺少依据时会明确说明，不补造内容。"),
  },
];

/** Counts and file names are taken from the imported public manifest. */
export const webQuizGuides: WebGuide[] = quizCatalog.exams.map((exam) => ({
  id: `quiz:${exam.id}`, kind: "quiz", href: `/quiz?de=${encodeURIComponent(exam.id)}`,
  title: t(exam.title, `HMU source set — ${exam.title}`, `河内医科大学题库 — ${exam.title}`),
  keys: [exam.title, exam.id.replaceAll("-", " "), "đề y hà nội", "hanoi medical university quiz", "河内医科大学题库"],
  body: t(
    `Bộ đề ${exam.title}, nhóm ${exam.group}, có ${exam.count} câu; ${exam.gradableCount} câu chấm điểm và ${exam.illustratedCount} câu có ảnh. Nhập từ PDF người dùng cung cấp. Mở bộ đề tại /quiz?de=${exam.id}; mỗi câu ghi trang PDF nguồn.`,
    `The source set ${exam.title} has ${exam.count} questions, ${exam.gradableCount} graded and ${exam.illustratedCount} illustrated. Imported from the supplied PDF. Open /quiz?de=${exam.id}; each question identifies its original PDF page.`,
    `原始试卷 ${exam.title} 有 ${exam.count} 题，${exam.gradableCount} 题评分、${exam.illustratedCount} 题含图；由提供的 PDF 导入。在 /quiz?de=${exam.id} 打开，各题标注原始 PDF 页码。`,
  ),
}));

/** Complete source titles keep numbered sets (1 / 10) and regions distinct. */
export function mentionedQuizSets(question: string): Set<string> {
  const foldTitle = (value: string) => value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/g, "d");
  const query = foldTitle(question);
  const named = new Set(webQuizGuides.filter(guide => {
    const title = foldTitle(guide.title.vi).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|[^\\p{L}\\p{N}])${title}($|[^\\p{L}\\p{N}])`, "u").test(query);
  }).map(guide => guide.id));
  // An unavailable number must not silently match a shorter existing title.
  for (const match of query.matchAll(/\bde thi thu\s+(\d+)\b/g)) named.add(`quiz:de-thi-thu-${match[1]}`);
  return named;
}
