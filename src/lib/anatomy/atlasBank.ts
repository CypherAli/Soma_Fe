import type { QuizItem } from "./quiz";
import { rng, shuffle } from "./random";

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

/** Số câu nhiều nhất ngân hàng ảnh ra được — dùng để chặn chọn quá số câu. */
export function atlasQuestionCount(bank: AtlasBank): number {
  return bank.shots.length;
}

const PROMPT = {
  vi: "Cấu trúc được đánh dấu ❓ trên hình là gì?",
  en: "Which structure is marked ❓ on this figure?",
  zh: "图中标记 ❓ 的结构是什么？",
} as const;

export function atlasToQuizItems(
  bank: AtlasBank,
  opts: { count?: number; seed?: number; locale?: "vi" | "en" | "zh"; only?: string[] },
): QuizItem[] {
  const { count = 10, locale = "vi" } = opts;
  const rand = rng(opts.seed ?? Date.now());
  const only = opts.only?.length ? new Set(opts.only) : null;
  const source = only
    ? bank.shots.filter((s) => only.has(`atlas:atlas-${s.page}-${s.hotspotKey}`))
    : bank.shots;
  const pool = shuffle(source, rand);

  return pool.slice(0, count).map((s, index) => {
    // Phương án nhiễu lấy từ TOÀN BỘ ngân hàng ảnh, không phải từ `pool`: buổi
    // ôn theo lịch có khi chỉ còn một hai câu đến hạn, lấy nhiễu trong đó thì
    // không gom nổi 4 phương án. Nhiễu nào cũng là tên cấu trúc thật nên lấy
    // rộng ra không làm câu hỏi dở đi.
    // Bỏ trùng theo TÊN chứ không chỉ khác đáp án: một cấu trúc xuất hiện ở
    // nhiều trang atlas, để nguyên thì hai phương án y hệt nhau.
    const seen = new Set([s.label.trim().toLowerCase()]);
    const picks: AtlasShot[] = [];
    for (const other of shuffle(bank.shots, rand)) {
      if (picks.length >= 3) break;
      const key = other.label.trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      picks.push(other);
    }
    return {
      // một trang atlas có thể có nhiều mục -> thêm chỉ số cho id thật sự duy
      // nhất, không thì React dựng lại nhầm câu khi hai câu cùng key.
      id: `atlas-${s.page}-${s.hotspotKey || index}`,
      kind: "identify" as const,
      prompt: PROMPT[locale],
      options: shuffle(
        [
          { id: `${s.page}:${index}:ok`, text: s.label, correct: true },
          ...picks.map((w, i) => ({ id: `${s.page}:${index}:${i}`, text: w.label, correct: false })),
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
