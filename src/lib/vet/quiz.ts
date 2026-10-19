
import { bindContentSource } from "@/lib/content/source";
import { rng, shuffle } from "@/lib/anatomy/random";
import { pick, type Loc, type T3 } from "@/lib/homeContent";
import { SPECIES, VET_SYSTEM_LABEL, allVetFacts, speciesInfo } from "./knowledge";
import type { VetFact, VetSpeciesKey } from "./types";

/**
 * SINH CÂU HỎI TRẮC NGHIỆM THÚ Y từ chính kho tri thức.
 *
 * Cùng nguyên tắc với bên người: KHÔNG có ngân hàng câu hỏi chép tay. Mỗi câu
 * dẫn xuất từ một mục đã biên soạn, nên câu hỏi không bao giờ nói về thứ không
 * có trong thư viện, và thêm mục mới là tự có thêm câu hỏi.
 *
 * BỐN DẠNG CÂU, chọn theo đúng thứ sinh viên thú y phải nhớ:
 *   species  — đặc điểm này thuộc loài nào (dạng hay bị lẫn nhất)
 *   identify — mô tả này ứng với cấu trúc nào
 *   nav      — thuật ngữ Latin (NAV) của cấu trúc
 *   compare  — điểm khác biệt nào là ĐÚNG (lấy thẳng từ trường `compare`)
 */
export type VetQuizKind = "species" | "identify" | "nav" | "compare";

export type VetQuizOption = { id: string; text: string; correct: boolean };

export type VetQuizItem = {
  id: string;
  kind: VetQuizKind;
  prompt: string;
  question: string;
  options: VetQuizOption[];
  /** Hiện sau khi trả lời — chính là nội dung đã biên soạn, kèm nguồn. */
  explanation: string;
  source: string;
  /** Để mở trang loài tương ứng sau khi trả lời. */
  speciesKey: VetSpeciesKey;
  factId: string;
};

const PROMPT: Record<VetQuizKind, T3> = bindContentSource("data:src/lib/vet/quiz.ts#PROMPT", {
  species: {
    vi: "Đặc điểm sau thuộc loài nào?",
    en: "Which species does this feature belong to?",
    zh: "下述特征属于哪个物种？",
  },
  identify: {
    vi: "Mô tả sau ứng với cấu trúc nào?",
    en: "Which structure matches this description?",
    zh: "下述描述对应哪个结构？",
  },
  nav: {
    vi: "Thuật ngữ NAV của cấu trúc sau là gì?",
    en: "What is the NAV term for this structure?",
    zh: "该结构的 NAV 术语是什么？",
  },
  compare: {
    vi: "Phát biểu nào về khác biệt giữa các loài là ĐÚNG?",
    en: "Which statement about the difference between species is CORRECT?",
    zh: "关于物种间差异，下列哪项陈述正确？",
  },
});

/**
 * Cắt một đoạn mô tả và XOÁ mọi tên có thể làm lộ đáp án.
 *
 * Cùng cái bẫy đã gặp ở quiz bên người: nếu để nguyên câu đầu của phần mô tả
 * thì trong đó thường có sẵn tên cấu trúc và tên loài, đọc là biết đáp án ngay
 * mà không cần hiểu gì.
 */
function maskedNote(fact: VetFact, locale: Loc, hideSpecies: boolean): string {
  const note = pick(fact.note, locale);
  const first = note.split(/(?<=[.。])\s/).slice(0, 2).join(" ") || note;
  const names = [
    pick(fact.name, locale),
    pick(fact.name, "vi"),
    pick(fact.name, "en"),
    fact.nav,
    ...fact.nav.split(/[,\s]+/).filter((w) => w.length > 4),
  ];
  if (hideSpecies) {
    for (const sp of fact.species) {
      const info = speciesInfo(sp);
      names.push(pick(info.name, locale), pick(info.name, "vi"), pick(info.name, "en"), info.latin);
    }
  }
  let out = first;
  for (const n of names) {
    if (!n || n.length < 2) continue;
    out = out.replace(new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "…");
  }
  return out.replace(/…(\s*…)+/g, "…").trim();
}

const optionsFrom = (texts: string[], correctText: string): VetQuizOption[] =>
  texts.map((text, i) => ({ id: `o${i}`, text, correct: text === correctText }));

export function buildVetQuiz(opts: {
  locale: Loc;
  count: number;
  seed: number;
  /** Giới hạn trong một loài, hoặc "all". */
  species?: VetSpeciesKey | "all";
}): VetQuizItem[] {
  const { locale, count, seed, species = "all" } = opts;
  const rand = rng(seed);
  const pool = allVetFacts().filter((f) => species === "all" || f.species.includes(species));
  if (pool.length === 0) return [];

  const items: VetQuizItem[] = [];
  for (const fact of shuffle(pool, rand)) {
    if (items.length >= count) break;
    const primary = fact.species[0];

    // Dạng câu khả dụng phụ thuộc dữ liệu của chính mục đó — không cố ra dạng
    // mà mục ấy không đủ dữ kiện (mục nói về nhiều loài thì hỏi "loài nào" là vô nghĩa).
    const kinds: VetQuizKind[] = ["identify", "nav"];
    if (fact.species.length === 1 && species === "all") kinds.push("species");
    if (fact.compare) kinds.push("compare");
    const kind = kinds[Math.floor(rand() * kinds.length)];

    if (kind === "species") {
      const others = shuffle(
        SPECIES.filter((s) => s.key !== primary),
        rand,
      ).slice(0, 3);
      const correct = pick(speciesInfo(primary).name, locale);
      const texts = shuffle([correct, ...others.map((s) => pick(s.name, locale))], rand);
      items.push({
        id: `${fact.id}#species`,
        kind,
        prompt: pick(PROMPT.species, locale),
        question: maskedNote(fact, locale, true),
        options: optionsFrom(texts, correct),
        explanation: pick(fact.note, locale),
        source: fact.source,
        speciesKey: primary,
        factId: fact.id,
      });
      continue;
    }

    if (kind === "nav") {
      // Phương án nhiễu là thuật ngữ NAV của mục khác — cùng loại chữ, cùng độ
      // khó, nên không đoán được bằng cách loại trừ hình thức.
      const others = shuffle(
        allVetFacts().filter((f) => f.nav !== fact.nav),
        rand,
      )
        .slice(0, 3)
        .map((f) => f.nav);
      if (others.length < 3) continue;
      const texts = shuffle([fact.nav, ...others], rand);
      items.push({
        id: `${fact.id}#nav`,
        kind,
        prompt: pick(PROMPT.nav, locale),
        question: pick(fact.name, locale),
        options: optionsFrom(texts, fact.nav),
        explanation: `${pick(fact.name, locale)} — ${fact.nav}. ${pick(fact.note, locale)}`,
        source: fact.source,
        speciesKey: primary,
        factId: fact.id,
      });
      continue;
    }

    if (kind === "compare" && fact.compare) {
      // Nhiễu: phần "khác biệt" của mục khác. Đều là phát biểu so sánh thật,
      // chỉ sai chỗ nó nói về loài/cấu trúc khác — buộc người học đọc hiểu.
      const others = shuffle(
        allVetFacts().filter((f) => f.id !== fact.id && f.compare),
        rand,
      )
        .slice(0, 3)
        .map((f) => pick(f.compare!, locale));
      if (others.length < 3) continue;
      const correct = pick(fact.compare, locale);
      const texts = shuffle([correct, ...others], rand);
      items.push({
        id: `${fact.id}#compare`,
        kind,
        prompt: pick(PROMPT.compare, locale),
        question: `${pick(fact.name, locale)} · ${pick(VET_SYSTEM_LABEL[fact.system], locale)}`,
        options: optionsFrom(texts, correct),
        explanation: pick(fact.note, locale),
        source: fact.source,
        speciesKey: primary,
        factId: fact.id,
      });
      continue;
    }

    const others = shuffle(
      allVetFacts().filter((f) => f.id !== fact.id && f.system === fact.system),
      rand,
    )
      .slice(0, 3)
      .map((f) => pick(f.name, locale));
    if (others.length < 3) continue;
    const correct = pick(fact.name, locale);
    const texts = shuffle([correct, ...others], rand);
    items.push({
      id: `${fact.id}#identify`,
      kind: "identify",
      prompt: pick(PROMPT.identify, locale),
      question: maskedNote(fact, locale, false),
      options: optionsFrom(texts, correct),
      explanation: pick(fact.note, locale),
      source: fact.source,
      speciesKey: primary,
      factId: fact.id,
    });
  }
  return items;
}

/** Số câu tối đa ra được — để giao diện không mời chọn 20 câu khi chỉ có 12. */
export const vetQuizCapacity = (species: VetSpeciesKey | "all" = "all") =>
  allVetFacts().filter((f) => species === "all" || f.species.includes(species)).length;
