import type { QuizItem } from "./quiz";

/**
 * NGÂN HÀNG CÂU HỎI ẢNH — bản vẽ atlas đã che nhãn.
 *
 * Ảnh và bảng tra do `scripts/kb/mask_atlas_labels.py` dựng ra: mỗi mục có bản
 * ĐÃ CHE (dùng để hỏi) và bản GỐC còn nguyên nhãn (hiện lại sau khi trả lời để
 * đối chiếu), kèm `sceneSlug` + `meshName` để mở đúng cấu trúc trên mô hình 3D.
 *
 * Nạp bằng fetch, không import tĩnh: bảng tra chỉ cần khi người dùng chọn dạng
 * câu hỏi này.
 */
export type AtlasShot = {
  page: number;
  title: string;
  file: string;        // bản gốc, còn nhãn
  fileQuiz?: string;   // bản đã che nhãn
  hasMarker?: boolean;
  label: string;
  meshName: string;
  sceneSlug: string;
  hotspotKey: string;
};

export type AtlasBank = {
  source: { title: string; publisher?: string; usage?: string };
  shots: AtlasShot[];
};

let cache: AtlasBank | null = null;

export async function loadAtlasBank(): Promise<AtlasBank> {
  if (cache) return cache;
  const res = await fetch("/atlas/index.json");
  if (!res.ok) throw new Error(`atlas bank ${res.status}`);
  const data = (await res.json()) as AtlasBank;
  // Chỉ giữ mục CÓ ảnh đã che và CÓ dấu hỏi — thiếu một trong hai thì câu hỏi
  // hoặc lộ đáp án, hoặc không chỉ được đang hỏi cấu trúc nào.
  cache = { ...data, shots: data.shots.filter((s) => s.fileQuiz && s.hasMarker) };
  return cache;
}

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

function shuffle<T>(a: T[], rand: () => number): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

const PROMPT = {
  vi: "Cấu trúc được đánh dấu ❓ trên hình là gì?",
  en: "Which structure is marked ❓ on this figure?",
  zh: "图中标记 ❓ 的结构是什么？",
} as const;

export function atlasToQuizItems(
  bank: AtlasBank,
  opts: { count?: number; seed?: number; locale?: "vi" | "en" | "zh" },
): QuizItem[] {
  const { count = 10, locale = "vi" } = opts;
  const rand = rng(opts.seed ?? Date.now());
  const pool = shuffle(bank.shots, rand);

  return pool.slice(0, count).map((s) => {
    // phương án nhiễu lấy từ chính ngân hàng ảnh -> đều là tên cấu trúc thật
    const wrong = pool.filter((o) => o.label !== s.label).slice(0, 40);
    const picks = shuffle(wrong, rand).slice(0, 3);
    return {
      id: `atlas-${s.page}`,
      kind: "identify" as const,
      prompt: PROMPT[locale],
      options: shuffle(
        [
          { id: `${s.page}:ok`, text: s.label, correct: true },
          ...picks.map((w, i) => ({ id: `${s.page}:${i}`, text: w.label, correct: false })),
        ],
        rand,
      ),
      explanation: `${s.title} — ${bank.source.title}, trang ${s.page}.`,
      sceneSlug: s.sceneSlug,
      meshName: s.meshName,
      sceneTitle: s.title,
      image: `/atlas/${s.fileQuiz}`,
      imageAnswer: `/atlas/${s.file}`,
    };
  });
}
