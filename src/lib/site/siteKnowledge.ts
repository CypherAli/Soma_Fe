import { fold } from "@/lib/anatomy/knowledge";
import {
  catalogScenes,
  catalogStats,
  regionGroups,
  scenesOfRegion,
  systemGroups,
  type CatalogScene,
} from "@/lib/catalog";
import { pick, type Loc, type T3 } from "@/lib/homeContent";
import { SPECIES, vetStats } from "@/lib/vet/knowledge";
import { mentionedQuizSets, webFeatureGuides, webQuizGuides } from "./webFeatures";

/**
 * KHO TRI THỨC VỀ CHÍNH HỆ THỐNG WEB — lớp thứ tư của trợ lý.
 *
 * VÌ SAO PHẢI CÓ: ba kho kia (hotspot giải phẫu, kiến thức tổng quan, giáo
 * trình bệnh học) đều nói về CƠ THỂ NGƯỜI, không kho nào nói về SOMA. Hỏi
 * "web này có bao nhiêu mô hình", "vào phần trắc nghiệm ở đâu", "xem mặt cắt
 * ngang thế nào" thì trợ lý trả lời "thư viện chưa có" hoặc tệ hơn là từ chối
 * vì tưởng lạc đề — trong khi câu trả lời nằm ngay trong dữ liệu của chính
 * ứng dụng. Người dùng đứng trong trang mà không hỏi được về trang thì trợ lý
 * đó chưa dùng được.
 *
 * NGUYÊN TẮC: mọi con số ở đây ĐẾM TỪ DỮ LIỆU THẬT (`catalogStats`,
 * `catalogScenes`), không gõ tay. Thêm một mô hình mới là kho này tự biết,
 * không phải sửa ở đây — chính vì vậy nó không bao giờ nói sai số lượng.
 */
export type SiteFact = {
  id: string;
  /** "model" = một mô hình 3D cụ thể; "feature" = một trang / tính năng. */
  kind: "model" | "feature" | "quiz";
  /** Mọi cách người ta có thể gọi tên nó, ĐÃ BỎ DẤU, ba ngôn ngữ. */
  keys: string[];
  title: T3;
  body: T3;
  /** Đường dẫn KHÔNG kèm locale — nơi gọi tự thêm `/${locale}`. */
  href: string;
  /** Tên gọi tắt, chỉ dùng khi câu hỏi rõ ràng đang hỏi về trang web. */
  shortKeys?: string[];
  /** Tên rút gọn GIỮ NGUYÊN DẤU. */
  shortRaw?: string[];
  /**
   * Các từ đặc trưng của tên, GIỮ NGUYÊN DẤU.
   *
   * Phải giữ dấu vì bỏ dấu làm nhập nhằng chết người trong tiếng Việt: "ở đâu"
   * bỏ dấu thành "dau", trùng đúng với "Đầu" — nên mọi câu "… xem ở đâu" đều
   * lôi về mô hình "Giải phẫu Đầu".
   */
  shortWords?: string[];
};

/**
 * Bỏ tiền tố chung của tên mô hình: "Giải phẫu Tim" -> "tim".
 *
 * Nhận CẢ bản có dấu lẫn bản đã bỏ dấu — trước đây chỉ nhận bản không dấu nên
 * tên thật ("giải phẫu đầu") không bị cắt gì, tên rút gọn hoá ra vẫn là cả câu.
 */
const stripPrefix = (s: string) =>
  s
    .toLowerCase()
    .replace(/^(giải phẫu|giai phau|hệ|he|anatomy of the|anatomy of|the)\s+/, "")
    .trim();

/** Chuỗi không mang dấu nào (bỏ dấu xong vẫn y nguyên) — an toàn để so khớp mờ. */
const isPlain = (s: string) => fold(s) === s;

/** Từ quá chung, khớp một mình thì mô hình nào cũng trúng. */
const GENERIC_WORDS = new Set([
  "hoc", "hinh", "phau", "giai", "tong", "quan", "vung", "chung", "the", "cua",
  "and", "the", "system", "anatomy", "region", "general",
]);

/** Dấu hiệu câu hỏi đang nói về TRANG WEB chứ không phải về cơ thể người. */
const SITE_CUE =
  /(mo hinh|mo hinh 3d|model|xem o dau|mo o dau|trang nao|trang web|website|website nay|trang nay|o dau tren trang|soma|模型|网站|页面|哪里打开)/;

const T = (vi: string, en: string, zh: string): T3 => ({ vi, en, zh });

/* ------------------------------------------------------------------ *
 * Mô hình 3D — sinh tự động từ danh mục
 * ------------------------------------------------------------------ */

/** Vùng cơ thể của từng scene, tra ngược từ bảng vùng để khỏi khai báo lại. */
function regionOfScene(): Map<string, T3> {
  const m = new Map<string, T3>();
  for (const g of regionGroups) {
    for (const s of scenesOfRegion(g.key)) m.set(s.slug, g.label);
  }
  return m;
}

function modelFact(scene: CatalogScene, region: T3 | undefined): SiteFact {
  const sys = systemGroups.find((g) => g.key === scene.system)?.label;
  const n = scene.structureCount;
  const bit = (l: Loc) => [sys && pick(sys, l), region && pick(region, l)].filter(Boolean).join(" · ");
  return {
    id: `model:${scene.slug}`,
    kind: "model",
    keys: [
      fold(pick(scene.title, "vi")),
      fold(pick(scene.title, "en")),
      pick(scene.title, "zh"),
      scene.slug.replace(/-/g, " "),
    ],
    /* Tên rút gọn: "Giải phẫu Tim" -> "tim". Người dùng không gọi mô hình bằng
       đúng tên đầy đủ trong danh mục — họ hỏi "mở mô hình tim ở đâu". Chỉ được
       dùng khoá rút gọn này KHI câu hỏi có dấu hiệu đang hỏi về trang web
       (xem `SITE_CUE`), nếu không thì mọi câu hỏi giải phẫu về tim đều lôi về
       mục "mô hình Tim" thay vì kiến thức về tim. */
    /* Tên rút gọn dùng cho ba phép khớp khác nhau:
         shortRaw   — có dấu, khớp chuỗi con: "mô hình tim ở đâu" -> "tim"
         shortKeys  — CHỈ tên vốn không dấu (tên tiếng Anh), để người gõ thiếu
                      dấu vẫn tra được. Không đưa tên tiếng Việt đã bỏ dấu vào
                      đây: "Đầu" -> "dau" trùng đúng chữ "đâu" trong "ở đâu",
                      nên câu nào có "ở đâu" cũng kèm mô hình "Giải phẫu Đầu".
         shortWords — từng từ có dấu, để "có mô hình não không" bắt được
                      "Thân não", "Tiểu não"… vì không có mô hình nào tên đúng
                      là "Não". */
    shortRaw: [
      stripPrefix(pick(scene.title, "vi")),
      stripPrefix(pick(scene.title, "en")),
    ].filter((k) => k.length >= 3),
    shortKeys: [stripPrefix(pick(scene.title, "en"))].filter(
      (k) => k.length >= 3 && isPlain(k),
    ),
    shortWords: [
      ...stripPrefix(pick(scene.title, "vi")).split(/[^\p{L}\p{N}]+/u),
      ...stripPrefix(pick(scene.title, "en")).split(/[^\p{L}\p{N}]+/u),
    ].filter((w) => w.length >= 3 && !GENERIC_WORDS.has(fold(w))),
    title: scene.title,
    body: T(
      `Mô hình 3D "${pick(scene.title, "vi")}" của Soma — ${bit("vi")}, có ${n} cấu trúc được gắn nhãn. ${pick(scene.description, "vi")} Mở tại đường dẫn ${scene.href}.`,
      `Soma's 3D model "${pick(scene.title, "en")}" — ${bit("en")}, ${n} labelled structures. ${pick(scene.description, "en")} Open it at ${scene.href}.`,
      `Soma 的三维模型「${pick(scene.title, "zh")}」— ${bit("zh")}，标注结构 ${n} 个。${pick(scene.description, "zh")} 打开路径：${scene.href}。`,
    ),
    href: scene.href,
  };
}

/* ------------------------------------------------------------------ *
 * Tính năng / trang — biên soạn tay, số liệu vẫn lấy từ dữ liệu
 * ------------------------------------------------------------------ */

function featureFacts(): SiteFact[] {
  const { scenes, structures, systems } = catalogStats;
  const regionList = (l: Loc) => regionGroups.map((g) => pick(g.label, l)).join(", ");

  return [
    {
      id: "feature:catalog",
      kind: "feature",
      keys: [
        "bao nhieu mo hinh", "so luong mo hinh", "co nhung mo hinh nao", "danh sach mo hinh",
        "tat ca mo hinh", "how many models", "list of models", "all models", "多少模型", "模型列表",
      ],
      title: T("Thư viện mô hình 3D của Soma", "Soma's 3D model library", "Soma 三维模型库"),
      body: T(
        `Soma hiện có ${scenes} mô hình 3D, trải trên ${systems} hệ cơ quan, với tổng cộng ${structures} cấu trúc được gắn nhãn (mỗi nhãn đều có tên Việt – Anh – Trung, tên Latin và một đoạn giải thích). Xem toàn bộ tại /giai-phau/tat-ca; lọc theo hệ tại /giai-phau, theo vùng cơ thể (${regionList("vi")}) tại /giai-phau/vung.`,
        `Soma currently has ${scenes} 3D models across ${systems} organ systems, with ${structures} labelled structures in total (each label carries Vietnamese, English and Chinese names, the Latin term and an explanatory note). Browse them all at /giai-phau/tat-ca, filter by system at /giai-phau, or by body region (${regionList("en")}) at /giai-phau/vung.`,
        `Soma 目前有 ${scenes} 个三维模型，覆盖 ${systems} 个系统，共标注 ${structures} 个结构（每个标注含中／英／越名称、拉丁名与说明）。全部模型见 /giai-phau/tat-ca；按系统筛选见 /giai-phau；按部位（${regionList("zh")}）见 /giai-phau/vung。`,
      ),
      href: "/giai-phau/tat-ca",
    },
    {
      id: "feature:about",
      kind: "feature",
      keys: [
        "soma la gi", "trang nay la gi", "trang nay lam duoc gi", "gioi thieu", "co nhung gi",
        "what is soma", "what can this website do", "what does this site do", "about this site",
        "features", "这个网站", "网站能做什么", "soma 是什么",
      ],
      title: T("Soma là gì", "What Soma is", "Soma 是什么"),
      body: T(
        `Soma là atlas giải phẫu 3D tương tác cho sinh viên y khoa, chạy trong trình duyệt, ba thứ tiếng Việt – Anh – Trung. Gồm: ${scenes} mô hình 3D với ${structures} cấu trúc gắn nhãn (bấm vào là hiện tên Việt/Anh/Latin và giải thích); xem theo lớp da – cơ – mạch – thần kinh – xương; công cụ cắt mặt phẳng xem thiết đồ; mốc xương thăm khám; trắc nghiệm có lịch ôn; thư viện bệnh lý trích giáo trình có dẫn trang; trợ lý hỏi đáp bám nguồn; và điều khiển mô hình bằng cử chỉ tay qua webcam.`,
        `Soma is an interactive 3D anatomy atlas for medical students, running in the browser in Vietnamese, English and Chinese. It contains ${scenes} 3D models with ${structures} labelled structures (click one for its Vietnamese/English/Latin name and a note); layered viewing of skin, muscle, vessels, nerves and bone; a cutting-plane tool for sectional anatomy; palpable bony landmarks; quizzes with spaced repetition; a pathology library quoted from textbooks with page citations; a source-grounded Q&A assistant; and gesture control of the models through the webcam.`,
        `Soma 是面向医学生的交互式三维解剖图谱，在浏览器中运行，提供越／英／中三语。包含：${scenes} 个三维模型、${structures} 个标注结构（点击即显示越／英／拉丁名称与说明）；皮肤—肌肉—血管—神经—骨的分层查看；断层切面工具；可触及的骨性标志；带间隔复习的测验；引自教材并标注页码的病理资料库；有据可查的问答助手；以及通过摄像头的手势操作。`,
      ),
      href: "/",
    },
    {
      id: "feature:vet",
      kind: "feature",
      keys: [
        "thu y", "dong vat", "giai phau thu y", "trac nghiem thu y", "cho meo ngua bo lon ga", "so sanh loai",
        "veterinary", "animal anatomy", "comparative anatomy", "vet section", "veterinary quiz",
        "兽医", "动物解剖", "比较解剖", "兽医测验",
      ],
      title: T("Khu vực thú y", "The veterinary section", "兽医专区"),
      body: T(
        `Ngoài atlas người, Soma có khu giải phẫu thú y tại /dong-vat: ${vetStats.species} loài (${SPECIES.map((s) => s.name.vi).join(", ")}) với ${vetStats.facts} mục kiến thức trải trên ${vetStats.systems} hệ cơ quan. Mỗi mục gồm mô tả, KHÁC BIỆT so với người hoặc giữa các loài, ý nghĩa lâm sàng thú y, thuật ngữ Latin theo NAV và nguồn giáo trình. Khu này đi theo nhóm → loài → cấu trúc: trang /dong-vat xếp các loài theo nhóm (gia súc, gia cầm, thú cảnh), mỗi loài có trang riêng kèm trị số tham chiếu (thân nhiệt, mạch, nhịp thở) và bộ lọc theo hệ cơ quan. Chó, mèo và ngựa có thêm mẫu vật sọ 3D xoay được, kèm giấy phép và ghi công.`,
        `Besides the human atlas, Soma has a veterinary section at /dong-vat: ${vetStats.species} species (${SPECIES.map((s) => s.name.en).join(", ")}) with ${vetStats.facts} entries across ${vetStats.systems} organ systems. Each entry carries a description, the DIFFERENCE from humans or between species, its veterinary clinical relevance, the Latin term in NAV and a textbook source. The section is navigated group → species → structure: /dong-vat lists species by group (livestock, poultry, companion animals), each species has its own page with reference values (temperature, pulse, respiration) and an organ-system filter. Dog, cat and horse also carry a rotatable 3D skull specimen with its licence and attribution.`,
        `除人体图谱外，Soma 设有兽医专区 /dong-vat：${vetStats.species} 个物种（${SPECIES.map((s) => s.name.zh).join("、")}），共 ${vetStats.facts} 条内容，覆盖 ${vetStats.systems} 个器官系统。每条包含描述、与人或物种间的差异、兽医临床意义、NAV 拉丁术语及教材出处。本专区按 群 → 物种 → 结构 组织：/dong-vat 按家畜、家禽、伴侣动物分组列出物种，每个物种另有专页并附参考值（体温、脉搏、呼吸）及器官系统筛选。犬、猫、马另附可旋转的三维颅骨标本，并标明许可与署名。`,
      ),
      href: "/dong-vat",
    },
    {
      id: "feature:quiz",
      kind: "feature",
      keys: [
        "trac nghiem", "lam bai kiem tra", "on tap", "cau hoi", "quiz", "test yourself",
        "flashcard", "on thi", "lich on", "测验", "练习题", "复习",
      ],
      title: T("Trắc nghiệm và ôn tập", "Quizzes and revision", "测验与复习"),
      body: T(
        "Trang /giai-phau/trac-nghiem cho làm trắc nghiệm sinh thẳng từ các nhãn trên mô hình 3D: nhìn hình chọn tên, nhìn tên chọn hình, hoặc hỏi theo ghi chú. Có thể giới hạn theo hệ cơ quan hoặc theo một mô hình. Tiến độ gắn với tài khoản và có lịch ôn theo thuật toán SM-2 (câu sai hiện lại sớm, câu thuộc giãn dần). Ngoài ra tải PDF đề cương lên để máy tự soạn bộ đề riêng.",
        "The page /giai-phau/trac-nghiem generates quizzes straight from the labels on the 3D models: pick the name for a highlighted structure, pick the structure for a name, or answer from the note. You can restrict a session to one organ system or one model. Progress is tied to your account and scheduled with the SM-2 spaced-repetition algorithm. You can also upload a PDF of your own course notes and have a personal question set built from it.",
        "页面 /giai-phau/trac-nghiem 直接依据三维模型上的标注生成测验：看结构选名称、看名称选结构，或依据说明作答；可限定某一系统或某一模型。学习进度与账号绑定，并按 SM-2 间隔重复算法安排复习。也可上传自己的 PDF 讲义，自动生成个人题库。",
      ),
      href: "/giai-phau/trac-nghiem",
    },
    {
      id: "feature:landmarks",
      kind: "feature",
      keys: [
        "moc xuong", "diem moc", "so nan", "moc giai phau", "bony landmark", "landmarks",
        "surface anatomy", "骨性标志", "体表标志",
      ],
      title: T("Mốc xương và giải phẫu bề mặt", "Bony landmarks and surface anatomy", "骨性标志与体表解剖"),
      body: T(
        "Trang /giai-phau/moc-xuong tập hợp các mốc xương sờ được trên người sống (chi trên, chi dưới, thân) — thứ dùng để định vị khi thăm khám. Mỗi mốc mở được trên mô hình 3D đúng vị trí.",
        "The page /giai-phau/moc-xuong collects the bony landmarks you can palpate on a living patient (upper limb, lower limb, trunk) — the reference points used during physical examination. Each landmark opens on the 3D model at its exact location.",
        "页面 /giai-phau/moc-xuong 汇集可在活体触及的骨性标志（上肢、下肢、躯干），即查体时的定位标志，每个标志都可在三维模型上对应位置打开。",
      ),
      href: "/giai-phau/moc-xuong",
    },
    {
      id: "feature:section",
      kind: "feature",
      keys: [
        "mat cat", "cat ngang", "lat cat", "cat doc", "thiet do", "cross section", "slice",
        "sectional anatomy", "断层", "横断面", "切面",
      ],
      title: T("Mặt cắt giải phẫu", "Sectional anatomy", "断层解剖"),
      body: T(
        "Mở /cat-lat để xem phần lát cắt giải phẫu của Soma. Có thể tìm thêm bài theo vùng trong /thu-vien. Trang Vision AI /cu-chi cũng có nút Mặt cắt trong bộ công cụ quan sát mô hình 3D.",
        "Open /cat-lat for Soma's anatomical sections. You can also find regional lessons in /thu-vien. Vision AI at /cu-chi includes a Cross-section button among its 3D inspection tools.",
        "在 /cat-lat 查看 Soma 解剖断层，在 /thu-vien 查找部位课程；/cu-chi 的 Vision AI 三维观察工具也包含切面按钮。",
      ),
      href: "/cat-lat",
    },
    {
      id: "feature:viewer",
      kind: "feature",
      keys: [
        "boc lop", "an lop", "hien lop", "lam mo lop", "xem theo lop", "tach lop",
        "peel layers", "layer", "hide layer", "分层", "剥层", "隐藏图层",
      ],
      title: T("Xem theo lớp trên mô hình", "Layered viewing", "分层查看"),
      body: T(
        "Các mô hình vùng (cánh tay, cẳng tay, vai, đầu, cổ, thân…) mở ra trình xem nhiều lớp: bật/tắt hoặc làm mờ từng lớp da – cơ – động mạch – tĩnh mạch – thần kinh – xương – tạng, bấm vào một cấu trúc để xem tên và ghi chú, và tách lớp ra để nhìn thứ tự nông sâu. Trỏ chuột vào cấu trúc là hiện tên; bấm là ghim lại.",
        "Regional models (arm, forearm, shoulder, head, neck, trunk…) open in a layered viewer: show, hide or fade each layer — skin, muscle, artery, vein, nerve, bone, viscera — click a structure for its name and note, and explode the layers to see what lies superficial to what. Hovering shows the name; clicking pins it.",
        "各部位模型（上臂、前臂、肩、头、颈、躯干等）以分层查看器打开：可显示／隐藏／淡化皮肤、肌肉、动脉、静脉、神经、骨、内脏各层，点击结构查看名称与说明，并可分层展开以观察由浅入深的层次。悬停显示名称，点击可固定。",
      ),
      href: "/thu-vien",
    },
    {
      id: "feature:pathology",
      kind: "feature",
      keys: [
        "benh ly", "benh hoc", "ho so benh", "thu vien benh", "ton thuong", "pathology",
        "disease library", "lesion", "病理", "疾病库",
      ],
      title: T("Thư viện bệnh lý", "Pathology library", "病理资料库"),
      body: T(
        "Trang /benh-ly là thư viện bệnh học: mỗi bệnh có tổng quan, triệu chứng, cận lâm sàng, điều trị, trích từ giáo trình có ghi rõ trang; bệnh nào gắn được với cấu trúc giải phẫu thì mở thẳng sang mô hình 3D và tô sáng vị trí tổn thương. Có hộp hỏi đáp riêng trong trang, trả lời bám đúng đoạn giáo trình và dẫn nguồn.",
        "The page /benh-ly is the pathology library: each entry has an overview, symptoms, investigations and treatment, quoted from textbooks with page citations; entries linked to an anatomical structure open the 3D model with the lesion site highlighted. The page has its own Q&A box that answers strictly from the textbook passages, with citations.",
        "页面 /benh-ly 为病理资料库：每个条目包含概述、症状、辅助检查与治疗，均引自教材并标注页码；已关联解剖结构的条目可直接打开三维模型并高亮病变部位。页内另设问答框，严格依据教材段落作答并给出出处。",
      ),
      href: "/benh-ly",
    },
    {
      id: "feature:assistant",
      kind: "feature",
      keys: [
        "tro ly", "chatbot", "hoi dap", "bot", "assistant", "ask", "助手", "问答",
      ],
      title: T("Trợ lý hỏi đáp Soma", "The Soma assistant", "Soma 助手"),
      body: T(
        "Trợ lý trả lời DỰA TRÊN tư liệu trong Soma và luôn dẫn nguồn [1], [2]: nhãn của 1310 cấu trúc trên mô hình 3D, một số mục kiến thức tổng quan có trích sách, kho đoạn giáo trình bệnh học, và thông tin về chính hệ thống này. Tư liệu không có thì trợ lý nói thẳng là chưa có chứ không đoán. Trợ lý không chẩn đoán cho cá nhân và không làm việc ngoài y khoa.",
        "The assistant answers ONLY from material inside Soma and always cites its sources as [1], [2]: the labels of 1310 structures on the 3D models, a set of general anatomy facts quoted from standard textbooks, the pathology textbook passages, and information about this system itself. When the material does not cover a question it says so rather than guessing. It does not diagnose individuals and does not do work outside medicine.",
        "助手仅依据 Soma 内部资料作答，并始终以 [1]、[2] 标注出处：三维模型上 1310 个结构的标注、若干引自权威教材的总论条目、病理教材段落，以及关于本系统的说明。资料未涵盖时会直言没有，而不作猜测。助手不为个人作诊断，也不处理医学以外的请求。",
      ),
      href: "/tro-ly",
    },
    {
      id: "feature:gesture",
      kind: "feature",
      keys: [
        "cu chi", "dieu khien bang tay", "webcam", "vision ai", "camera", "gesture control",
        "hand tracking", "手势", "摄像头控制",
      ],
      title: T("Điều khiển bằng cử chỉ (Vision AI)", "Gesture control (Vision AI)", "手势控制（Vision AI）"),
      body: T(
        "Trang /cu-chi cho điều khiển mô hình cẳng tay bằng cử chỉ tay qua webcam: ngón trỏ làm con trỏ, xoè bàn tay để xoay, nắm tay để kéo, chụm ngón cả hai tay để phóng to. Toàn bộ nhận diện chạy ngay trong trình duyệt — hình webcam không rời khỏi máy.",
        "The page /cu-chi lets you drive the forearm model with hand gestures through the webcam: the index finger is the cursor, an open hand rotates, a fist drags, pinching with both hands zooms. All detection runs inside the browser — the webcam image never leaves the device.",
        "页面 /cu-chi 可通过摄像头以手势操作前臂模型：食指为光标，张开手掌旋转，握拳拖动，双手同时捏合缩放。全部识别在浏览器本地完成，摄像头画面不会离开本机。",
      ),
      href: "/cu-chi",
    },
    {
      id: "feature:scan",
      kind: "feature",
      keys: [
        "quet", "quet camera", "chup anh bo phan", "nhan dien bo phan", "scan", "scan body part",
        "identify body part", "camera scan", "扫描", "识别部位",
      ],
      title: T("Quét bộ phận bằng camera", "Scan a body part with the camera", "用摄像头扫描部位"),
      body: T(
        "Chế độ QUÉT của trang Vision AI (/cu-chi, hoặc lối tắt /quet) nhận diện bộ phận cơ thể qua webcam rồi mở đúng mô hình của vùng đó. Trang này có hai chế độ dùng chung một camera: Quét và Điều khiển. Có hai cách ngắm, máy tự chọn theo số tay đang thấy. Quét BÀN TAY hoặc CẲNG TAY của chính mình: chỉ cần giơ MỘT bàn tay xoè ra, ô tự ôm lấy chính bàn tay đó và kéo dài xuống cẳng tay, giữ yên khoảng một giây rưỡi là chụp — không phải ngắm gì cả. Quét bộ phận khác (mặt, cổ, vai, ngực, gối…): đưa cả HAI tay vào khung hình, ô ngắm hiện giữa hai đầu ngón trỏ và đi theo tay, bên trong đổ đen–trắng để thấy đúng tấm ảnh sắp chụp; chụm ngón cả hai tay và giữ thì ô đóng băng, đếm ngược 3 giây cho bạn rút tay ra và đưa bộ phận vào đúng ô đó. Sau khi chụp, máy suy ra vùng bằng MỐC GIẢI PHẪU ngay trên máy (MediaPipe Pose tìm vai, khuỷu, cổ tay, gối, mắt, tai, miệng rồi xét ô vừa ngắm trùng đoạn nào) — nhanh, không cần mạng và giải thích được; chỉ khi mốc không đủ mới hỏi thêm máy chủ GPU, và chờ tối đa 0,8 giây. Máy đề xuất ba vùng khả dĩ kèm nguồn kết quả để bạn chọn, rồi mở mô hình vùng đó ngay trong chế độ điều khiển bằng cử chỉ. Phần nhận diện BÀN TAY chạy ngay trong trình duyệt; riêng bước đoán bộ phận thì mẩu ảnh vuông đã cắt được gửi lên máy chủ GPU và chỉ gửi sau khi bạn đồng ý — từ chối thì vẫn tự chọn vùng được. Máy không bao giờ tự mở mô hình mà luôn để bạn chọn.",
        "The SCAN mode of the Vision AI page (/cu-chi, shortcut /quet) identifies a body part through the webcam and opens the models for that region. There are two ways to aim and the app picks by how many hands it sees. To scan your own HAND or FOREARM, just hold up ONE open hand: the frame wraps that hand by itself and extends down the forearm, and holding still for about a second and a half captures it — no aiming at all. For anything else (face, neck, shoulder, chest, knee…), bring BOTH hands into view: a frame appears between the two index fingertips and follows your hands, rendered in black and white inside so you see the exact photo about to be taken; pinching with both hands and holding freezes it, then a 3-second timer lets you take your hands away and put the body part inside. After the shot the region is inferred from ANATOMICAL LANDMARKS on the device (MediaPipe Pose locates shoulders, elbows, wrists, knees, eyes, ears and mouth, and the framed box is matched against those segments) — fast, offline and explainable; the GPU service is only consulted when the landmarks are not enough, with an 0.8 second budget. Three candidate regions are offered with the source of the answer, and picking one opens that region's model right inside gesture control. HAND tracking runs inside the browser; only the square crop is sent to a GPU server for the recognition step, and only after you agree — decline and you can still pick the region yourself. It never opens a model on its own.",
        "Vision AI 页面（/cu-chi，快捷方式 /quet）的“扫描”模式通过摄像头识别身体部位并打开该区域的模型。有两种取景方式，系统按看到几只手自动选择。扫描自己的手或前臂：只需举起一只张开的手，取景框会自动框住这只手并沿前臂延伸，保持不动约一秒半即自动拍摄，完全无需取景。扫描其他部位（面部、颈、肩、胸、膝…）：把双手放入画面，取景框出现在两个食指指尖之间并跟随双手，框内显示为黑白；双手捏合并保持即可冻结取景框，随后 3 秒倒计时让你收手并把部位放进框内。拍摄后系统先用本机的解剖标志点推断区域（MediaPipe Pose 定位肩、肘、腕、膝、眼、耳、口，再比对所取景的框落在哪一段），快速、离线且可解释；只有标志点不足时才询问 GPU 服务，且最多等待 0.8 秒。系统给出三个候选区域并标明结果来源，选中后即在手势操作模式中打开该区域的模型。手部追踪在浏览器本地运行；仅识别步骤会把裁剪后的方形图像发送到 GPU 服务器，且必须先获得你的同意——拒绝后仍可手动选择区域。系统绝不会自行打开模型。",
      ),
      href: "/cu-chi?che-do=quet",
    },
    {
      id: "feature:language",
      kind: "feature",
      keys: [
        "doi ngon ngu", "tieng anh", "tieng trung", "ngon ngu", "change language",
        "english", "chinese", "语言", "切换语言",
      ],
      title: T("Ngôn ngữ giao diện", "Interface languages", "界面语言"),
      body: T(
        "Soma chạy ba thứ tiếng: Việt, Anh, Trung. Đổi bằng nút ngôn ngữ trên thanh trên cùng; đường dẫn đổi theo tiền tố /vi, /en, /zh. Tên cấu trúc và ghi chú trên mô hình đều có đủ ba thứ tiếng.",
        "Soma runs in three languages: Vietnamese, English and Chinese. Switch with the language button in the top bar; the URL prefix changes to /vi, /en or /zh. Structure names and notes on the models exist in all three.",
        "Soma 提供越南语、英语、中文三种界面语言，可用顶栏的语言按钮切换，网址前缀相应变为 /vi、/en、/zh。模型上的结构名称与说明均备齐三语。",
      ),
      href: "/",
    },
  ];
}

let cache: SiteFact[] | null = null;

export function allSiteFacts(): SiteFact[] {
  if (cache) return cache;
  const region = regionOfScene();
  const legacy = featureFacts();
  const guides = new Map(webFeatureGuides.map(guide => [guide.id, guide]));
  const existing = new Set(legacy.map(fact => fact.id));
  cache = [
    ...legacy.map(fact => guides.get(fact.id) ?? fact),
    ...webFeatureGuides.filter(guide => !existing.has(guide.id)),
    ...webQuizGuides,
    ...catalogScenes.map((s) => modelFact(s, region.get(s.slug))),
  ].map(fact => ({ ...fact, keys: fact.keys.map(fold) }));
  return cache;
}

/* ------------------------------------------------------------------ *
 * Tra cứu
 * ------------------------------------------------------------------ */

/**
 * Chấm điểm một mục theo câu hỏi.
 *
 * Ba mức, cách nhau đủ xa để không lẫn:
 *   3  — câu hỏi chứa nguyên một từ khoá của mục ("bao nhieu mo hinh").
 *   2  — câu hỏi chứa nguyên TÊN mục ("mốc xương", tên một mô hình).
 *   ≤1 — chỉ trùng lẻ tẻ vài từ; chỉ nhận khi trùng từ 2 từ trở lên, vì một từ
 *        chung chung như "giải phẫu" thì mục nào cũng có và sẽ ra rác.
 */
const CJK = /[㐀-鿿]/;
/** Độ dài tối thiểu để một chuỗi đủ đặc trưng mà đem so khớp.
 *  Tiếng Trung nén thông tin hơn hẳn: "测验" chỉ 2 ký tự nhưng đã là trọn nghĩa
 *  "trắc nghiệm", nên áp chung ngưỡng 4 như tiếng Việt/Anh là loại sạch mọi từ
 *  khoá tiếng Trung — đúng lỗi khiến câu hỏi "怎么进入测验" không tìm ra trang
 *  trắc nghiệm. */
const longEnough = (s: string) => (CJK.test(s) ? s.length >= 2 : s.length >= 4);

function scoreSiteFact(
  f: SiteFact,
  foldedQ: string,
  rawQ: string,
  rawWords: Set<string>,
  terms: string[],
  locale: Loc,
  namedSets: Set<string>,
): number {
  // Quiz set names are navigation evidence, not anatomical explanations.
  if (f.kind === "quiz" && !/(quiz|trac nghiem|de |bo de|on thi|cau hoi|bao nhieu cau|题库|试卷|测验)/.test(foldedQ)) return 0;
  if (f.kind === "quiz" && namedSets.size) return namedSets.has(f.id) ? 6 : 0;
  for (const k of f.keys) {
    if (longEnough(k) && foldedQ.includes(k)) return 3;
  }
  const names = [
    fold(pick(f.title, locale)),
    fold(pick(f.title, "vi")),
    fold(pick(f.title, "en")),
    pick(f.title, "zh"),
  ];
  if (names.some((n) => longEnough(n) && foldedQ.includes(n))) return 2;

  if (SITE_CUE.test(foldedQ) && f.shortKeys?.length) {
    /* Khớp trọn tên rút gọn ("mô hình tim ở đâu" -> "tim"), so khớp CÓ DẤU.
       Bản bỏ dấu sai ở đúng chỗ hay dùng nhất: "ở đâu" -> "dau" trùng "Đầu",
       nên câu nào có "ở đâu" cũng kèm mô hình "Giải phẫu Đầu". Tên chỉ gồm chữ
       ASCII (tên tiếng Anh: "head", "liver") thì bỏ dấu không đổi gì, vẫn dùng
       bản đã bỏ dấu để bắt được cả khi người dùng gõ thiếu dấu. */
    if (f.shortRaw?.some((k) => rawQ.includes(k))) return 2;
    if (f.shortKeys.some((k) => foldedQ.includes(k))) return 2;
    /* Hoặc khớp một TỪ đặc trưng trong tên. Cần bước này vì nhiều chủ đề bị
       tách thành nhiều mô hình: không có mô hình nào tên đúng là "Não", mà có
       "Thân não & dây sọ", "Tiểu não", "Gian não & hệ viền" — hỏi "có mô hình
       não không" mà không khớp từ thì trả lời trượt hết. */
    // So khớp CÓ DẤU: xem chú thích của `shortWords`.
    if (f.shortWords?.some((w) => rawWords.has(w))) return 2;
  }

  // Mức yếu CHỈ dành cho mục hướng dẫn, không cho mô hình. Mô hình mà nhận
  // khớp lỏng thì hỏi "bệnh gout điều trị thế nào" lại lôi về mô hình "Não
  // thất và màng não" (trúng "benh" + "nao") rồi chen lên trên chính bài gout.
  // Hướng dẫn thì chỉ có 9 mục, khớp lỏng vẫn còn dùng được.
  if (f.kind !== "feature") return 0;
  const hay = fold(`${pick(f.title, locale)} ${f.keys.join(" ")}`);
  const hitTerms = terms.filter((t) => t.length > 2 && hay.includes(t));
  return hitTerms.length >= 2 ? 1 : 0;
}

export function searchSiteFacts(
  question: string,
  locale: Loc,
  limit = 4,
): { fact: SiteFact; score: number }[] {
  const foldedQ = fold(question);
  const terms = foldedQ.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const rawQ = question.toLowerCase();
  const rawWords = new Set(
    question.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean),
  );
  if (terms.length === 0) return [];
  const namedSets = mentionedQuizSets(question);

  return allSiteFacts()
    .map((fact) => ({ fact, score: scoreSiteFact(fact, foldedQ, rawQ, rawWords, terms, locale, namedSets) }))
    .filter((x) => x.score > 0)
    // Mục tính năng đứng trước mô hình khi bằng điểm: hỏi "xem mặt cắt thế nào"
    // thì phần hướng dẫn hữu ích hơn một mô hình lẻ có chữ "mặt cắt" trong tên.
    .sort((a, b) => b.score - a.score ||
      ({ feature: 0, quiz: 1, model: 2 }[a.fact.kind] - { feature: 0, quiz: 1, model: 2 }[b.fact.kind]))
    .slice(0, limit);
}
