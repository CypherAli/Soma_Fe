import { allFacts, factsBySystem, SYSTEM_LABEL, type AnatomyFact } from "./knowledge";
import { rng, shuffle } from "./random";
import { pick, type Loc, type T3 } from "@/lib/homeContent";
import type { SystemKey } from "@/store/useAnatomyStore";

/**
 * SINH CÂU HỎI TRẮC NGHIỆM TỪ KHO TRI THỨC — không có ngân hàng câu hỏi chép
 * tay, mọi câu đều dẫn xuất từ 629 hotspot đã biên soạn, nên:
 *   - không bao giờ hỏi về cấu trúc KHÔNG có trong model;
 *   - mỗi câu đều kèm giải thích thật và nút mở đúng cấu trúc trên mô hình 3D;
 *   - thêm hotspot mới là tự có thêm câu hỏi, không phải sửa hai nơi.
 *
 * PHƯƠNG ÁN NHIỄU lấy CÙNG HỆ với đáp án. Lấy ngẫu nhiên toàn kho thì câu hỏi
 * quá dễ (hỏi về xương mà ba phương án kia là ruột thì đoán cũng trúng).
 */
export type QuizKind = "identify" | "system" | "latin";

export type QuizOption = { id: string; text: string; correct: boolean };

export type QuizItem = {
  id: string;
  kind: QuizKind;
  prompt: string;
  options: QuizOption[];
  /** giải thích hiện sau khi trả lời — chính là ghi chú giải phẫu của cấu trúc */
  explanation: string;
  /** để mở mô hình 3D đúng chỗ */
  sceneSlug: string;
  meshName: string;
  sceneTitle: string;
  /** câu hỏi dạng ẢNH: bản vẽ atlas đã che nhãn */
  image?: string;
  /** bản gốc còn nguyên nhãn, hiện lại sau khi trả lời để đối chiếu */
  imageAnswer?: string;
};

const PROMPT: Record<QuizKind, T3> = {
  identify: {
    vi: "Cấu trúc nào ứng với mô tả sau?",
    en: "Which structure matches this description?",
    zh: "下列哪个结构符合该描述？",
  },
  system: {
    vi: "Cấu trúc sau thuộc hệ cơ quan nào?",
    en: "Which organ system does this structure belong to?",
    zh: "该结构属于哪个系统？",
  },
  latin: {
    vi: "Tên Latin của cấu trúc sau là gì?",
    en: "What is the Latin name of this structure?",
    zh: "该结构的拉丁名是什么？",
  },
};

/** Cắt ghi chú thành một đoạn mô tả gọn, BỎ tên cấu trúc để khỏi lộ đáp án. */
function describe(fact: AnatomyFact, locale: Loc): string {
  const note = pick(fact.note, locale);
  const name = pick(fact.label, locale);
  const first = note.split(/(?<=[.。])\s/)[0] || note;
  const names: string[] = [name, fact.latinName ?? "", fact.meshName.replace(/\.[lr]$/, "")]
    .filter((n): n is string => !!n);
  const masked = names.reduce<string>(
    (s, n) => s.replace(new RegExp(escapeRe(n), "gi"), "…"),
    first,
  );
  return masked.length > 240 ? masked.slice(0, 237) + "…" : masked;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function distractors(
  fact: AnatomyFact,
  bySystem: Map<SystemKey, AnatomyFact[]>,
  rand: () => number,
  n: number,
): AnatomyFact[] {
  const pool = new Map<string, AnatomyFact>();
  for (const s of fact.systems) {
    for (const other of bySystem.get(s) ?? []) {
      if (other.id !== fact.id && pick(other.label, "vi") !== pick(fact.label, "vi")) {
        pool.set(other.id, other);
      }
    }
  }
  // không đủ cùng hệ thì mới bù bằng cấu trúc bất kỳ
  if (pool.size < n) {
    for (const other of allFacts()) {
      if (pool.size >= n * 3) break;
      if (other.id !== fact.id) pool.set(other.id, other);
    }
  }
  return shuffle([...pool.values()], rand).slice(0, n);
}

/**
 * Kho cấu trúc ra được đề cho một hệ: chỉ giữ cấu trúc có ghi chú đủ dài để
 * viết được câu hỏi nhận dạng tử tế.
 *
 * Một nơi duy nhất định nghĩa "ra được đề" — `buildQuiz` sinh đề, `quizSystems`
 * dựng nút lọc và `quizQuestionCount` báo số câu khả dụng đều hỏi hàm này. Ba
 * nơi tự lọc riêng thì chỉnh ngưỡng ở một chỗ là hai chỗ kia nói sai số câu.
 */
function quizPool(locale: Loc, system: SystemKey | "all"): AnatomyFact[] {
  const pool = system === "all" ? allFacts() : (factsBySystem().get(system) ?? []);
  return pool.filter((f) => pick(f.note, locale).length > 60);
}

/** Số câu nhiều nhất có thể sinh cho một hệ — dùng để chặn chọn quá số câu. */
export function quizQuestionCount(locale: Loc, system: SystemKey | "all" = "all"): number {
  return quizPool(locale, system).length;
}

export function buildQuiz(opts: {
  locale: Loc;
  system?: SystemKey | "all";
  count?: number;
  seed?: number;
}): QuizItem[] {
  const { locale, system = "all", count = 10 } = opts;
  const rand = rng(opts.seed ?? Date.now());
  const bySystem = factsBySystem();

  const pool = quizPool(locale, system);
  if (!pool.length) return [];

  const chosen = shuffle(pool, rand).slice(0, count);
  const items: QuizItem[] = [];

  for (const fact of chosen) {
    const kinds: QuizKind[] = ["identify", "system"];
    if (fact.latinName) kinds.push("latin");
    const kind = kinds[Math.floor(rand() * kinds.length)];
    const name = pick(fact.label, locale);

    let prompt = pick(PROMPT[kind], locale);
    let options: QuizOption[];

    if (kind === "identify") {
      prompt += `\n\n“${describe(fact, locale)}”`;
      const wrong = distractors(fact, bySystem, rand, 3);
      options = shuffle(
        [
          { id: fact.id, text: name, correct: true },
          ...wrong.map((w) => ({ id: w.id, text: pick(w.label, locale), correct: false })),
        ],
        rand,
      );
    } else if (kind === "system") {
      prompt += `\n\n${name}`;
      const right = fact.systems[0];
      const others = (Object.keys(SYSTEM_LABEL) as SystemKey[]).filter(
        (s) => !fact.systems.includes(s),
      );
      options = shuffle(
        [
          { id: right, text: pick(SYSTEM_LABEL[right], locale), correct: true },
          ...shuffle(others, rand)
            .slice(0, 3)
            .map((s) => ({ id: s, text: pick(SYSTEM_LABEL[s], locale), correct: false })),
        ],
        rand,
      );
    } else {
      prompt += `\n\n${name}`;
      const wrong = distractors(fact, bySystem, rand, 8).filter((w) => w.latinName).slice(0, 3);
      options = shuffle(
        [
          { id: fact.id, text: fact.latinName!, correct: true },
          ...wrong.map((w) => ({ id: w.id, text: w.latinName!, correct: false })),
        ],
        rand,
      );
    }

    // câu nào không gom đủ 4 phương án thì bỏ, đừng ra đề 2 lựa chọn
    if (options.length < 4) continue;

    items.push({
      id: `${fact.id}#${kind}`,
      kind,
      prompt,
      options,
      explanation: pick(fact.note, locale),
      sceneSlug: fact.sceneSlug,
      meshName: fact.meshName,
      sceneTitle: pick(fact.sceneTitle, locale),
    });
  }

  return items;
}

/** Các hệ thực sự có đủ dữ liệu để ra đề — dùng dựng bộ lọc, không bịa nút. */
export function quizSystems(locale: Loc): { key: SystemKey; label: string; count: number }[] {
  return (Object.keys(SYSTEM_LABEL) as SystemKey[])
    .map((k) => ({ key: k, label: pick(SYSTEM_LABEL[k], locale), count: quizQuestionCount(locale, k) }))
    .filter((s) => s.count >= 4);
}
