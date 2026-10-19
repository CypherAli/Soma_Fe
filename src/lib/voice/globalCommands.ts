import type { Loc } from "@/lib/homeContent";
import { bestByName, type Named, type VoiceAction, type VoiceResult } from "./match";

/**
 * LỆNH CHUNG — dùng được ở MỌI trang có Soma Bot (tức là mọi trang).
 * Lệnh riêng của từng trang (bật lớp, quét…) đăng ký qua `useVoiceActions` và
 * được xét trước; bộ này là tầng đỡ phía sau.
 */

/** Trang đích và các cách người ta gọi tên nó. Khoá là đường dẫn KHÔNG kèm locale. */
export const ROUTES: Named[] = [
  { key: "/", names: ["trang chủ", "trang đầu", "màn hình chính", "home", "homepage", "主页", "首页"] },
  { key: "/nguoi", names: ["giải phẫu người", "human anatomy", "人体解剖"] },
  { key: "/giai-phau/tat-ca", names: ["tất cả mô hình", "danh sách mô hình", "all models", "所有模型"] },
  { key: "/thu-vien", names: ["thư viện", "thư viện mô hình", "model library", "library", "模型库"] },
  { key: "/giai-phau/theo-he", names: ["hệ cơ quan", "giải phẫu theo hệ", "theo hệ", "organ systems", "by system", "器官系统"] },
  { key: "/giai-phau/theo-vung", names: ["giải phẫu theo vùng", "theo vùng", "by region", "regions", "按区域"] },
  { key: "/viewer", names: ["toàn thân", "giải phẫu toàn thân", "whole body", "complete anatomy", "全身"] },
  { key: "/benh-ly", names: ["bệnh lý", "bệnh học", "pathology", "病理"] },
  { key: "/quiz", names: ["quiz", "trắc nghiệm", "kiểm tra", "làm bài", "ôn tập", "quizzes", "测验"] },
  { key: "/cu-chi", names: ["vision ai", "vision", "cử chỉ", "cử chỉ tay", "quét camera", "quét cơ thể", "camera", "视觉"] },
  { key: "/dong-vat", names: ["động vật", "thú y", "animals", "veterinary", "动物", "兽医"] },
  { key: "/tro-ly", names: ["trợ lý", "trợ lý đầy đủ", "assistant", "助手"] },
  { key: "/tai-lieu-y-khoa", names: ["tài liệu y khoa", "tài liệu", "medical documents", "documents", "资料"] },
  { key: "/cai-dat", names: ["cài đặt", "tài khoản", "settings", "account", "设置"] },
  { key: "/dang-nhap", names: ["đăng nhập", "login", "sign in", "登录"] },
];

export const resolveRoute = (arg: string): string | null => bestByName(arg, ROUTES);

/**
 * Hai bài khớp ngang nhau ("mở mô hình cánh tay") thì ưu tiên BÀI HỌC THEO LỚP —
 * bài đầy đủ nhất cho người học, cùng chính sách với danh sách gợi ý của Vision AI.
 */
export const layeredFirst = (slug: string): number => (slug.startsWith("bo-phan-") ? 1 : 0);

const T = {
  vi: {
    go: (n: string) => `Đang mở ${n}.`,
    noPage: (x: string) => `Mình chưa biết trang "${x}".`,
    model: (n: string) => `Đang mở mô hình ${n}.`,
    noModel: (x: string) => `Không tìm thấy mô hình "${x}".`,
    back: "Quay lại trang trước.",
    down: "Cuộn xuống.",
    up: "Cuộn lên.",
    help: 'Bạn có thể nói: "mở trang bệnh lý", "mở mô hình tim", "quay lại". Ở trang mô hình: "bật lớp cơ", "tách lớp", "nhìn phía sau", "đặt lại". Ở Vision AI: "quét", "chọn khuỷu tay", "hoàn tác".',
  },
  en: {
    go: (n: string) => `Opening ${n}.`,
    noPage: (x: string) => `I don't know a page called "${x}".`,
    model: (n: string) => `Opening the ${n} model.`,
    noModel: (x: string) => `No model matches "${x}".`,
    back: "Going back.",
    down: "Scrolling down.",
    up: "Scrolling up.",
    help: 'Try: "open the pathology page", "open the heart model", "go back". On a model: "turn on muscles", "explode", "back view", "reset". In Vision AI: "scan", "pick elbow", "undo".',
  },
  zh: {
    go: (n: string) => `正在打开${n}。`,
    noPage: (x: string) => `没有找到"${x}"页面。`,
    model: (n: string) => `正在打开${n}模型。`,
    noModel: (x: string) => `没有找到"${x}"模型。`,
    back: "返回上一页。",
    down: "向下滚动。",
    up: "向上滚动。",
    help: '可以说："打开病理页面"、"打开心脏模型"、"返回"。在模型页："打开肌肉层"、"分解"、"后面观"、"重置"。',
  },
} as const;

export const helpText = (locale: Loc) => T[locale].help;

type Deps = {
  locale: Loc;
  navigate: (href: string) => void;
  back: () => void;
};

/** Tìm mô hình theo tên đọc ra — nạp catalog LƯỜI vì bot có mặt ở mọi trang. */
async function findScene(arg: string, locale: Loc) {
  const { catalogScenes, searchScenes } = await import("@/lib/catalog");
  const slug =
    bestByName(
      arg,
      catalogScenes.map((s) => ({ key: s.slug, names: [s.title.vi, s.title.en, s.title.zh] })),
      layeredFirst,
    ) ?? searchScenes(arg, locale)[0]?.slug;
  return slug ? catalogScenes.find((s) => s.slug === slug) : undefined;
}

export function buildGlobalActions({ locale, navigate, back }: Deps): VoiceAction[] {
  const t = T[locale];
  const openRoute = (arg: string): VoiceResult | null => {
    const href = resolveRoute(arg);
    if (!href) return null;
    const name = ROUTES.find((r) => r.key === href)!.names[0];
    navigate(href);
    return { ok: true, say: t.go(name) };
  };
  const openModel = async (arg: string): Promise<VoiceResult | null> => {
    const scene = await findScene(arg, locale);
    if (!scene) return null;
    navigate(scene.href);
    return { ok: true, say: t.model(scene.title[locale]) };
  };

  return [
    {
      id: "open-model",
      phrases: [
        "mở mô hình {x}", "mở bài {x}", "xem mô hình {x}", "cho xem {x}",
        "open model {x}", "open the {x} model", "show the {x} model", "show me the {x} model",
        "打开{x}模型", "查看{x}模型",
      ],
      run: async (arg) => (await openModel(arg)) ?? { ok: false, say: t.noModel(arg) },
    },
    {
      id: "open-page",
      phrases: [
        "mở trang {x}", "đi tới {x}", "đi đến {x}", "chuyển sang {x}", "vào trang {x}", "sang trang {x}",
        "go to {x}", "open the {x} page", "open {x} page", "take me to {x}",
        "打开{x}页面", "进入{x}", "去{x}",
      ],
      run: (arg) => openRoute(arg) ?? { ok: false, say: t.noPage(arg) },
    },
    {
      // "mở tim", "open quiz" — thử trang trước, không có mới tìm mô hình.
      id: "open-any",
      phrases: ["mở {x}", "vào {x}", "open {x}", "show {x}", "打开{x}"],
      run: async (arg) => openRoute(arg) ?? (await openModel(arg)) ?? { ok: false, say: t.noModel(arg) },
    },
    { id: "back", phrases: ["quay lại", "trở lại", "trang trước", "go back", "back", "返回"], run: () => (back(), { ok: true, say: t.back }) },
    {
      id: "scroll-down",
      phrases: ["cuộn xuống", "kéo xuống", "scroll down", "向下滚动"],
      run: () => (window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" }), { ok: true, say: t.down }),
    },
    {
      id: "scroll-up",
      phrases: ["cuộn lên", "kéo lên", "scroll up", "向上滚动"],
      run: () => (window.scrollBy({ top: -window.innerHeight * 0.8, behavior: "smooth" }), { ok: true, say: t.up }),
    },
    {
      id: "help",
      phrases: ["trợ giúp", "hướng dẫn giọng nói", "nói được gì", "có thể nói gì", "what can i say", "voice help", "help", "帮助"],
      run: () => ({ ok: true, say: t.help }),
    },
  ];
}
