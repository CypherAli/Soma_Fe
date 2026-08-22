import { allFacts, fold, SYSTEM_LABEL, type AnatomyFact } from "./knowledge";
import type { SystemKey } from "@/store/useAnatomyStore";

/**
 * TRA CỨU NỀN CHO AI — phần "R" của RAG, lấy ngay trên kho cấu trúc có thật.
 *
 * Trước đây các route AI chỉ nhận được lời người dùng và một danh sách mã hệ
 * khô khốc, nên chúng đoán mò: "tiêu hoá" không có trong danh sách mã nào cả,
 * mô hình phải tự nghĩ xem nó thuộc hệ gì. Ở đây ta đưa cho mô hình đúng những
 * cấu trúc CÓ THẬT trong kho khớp với lời người dùng, kèm hệ của chúng — mô
 * hình chỉ còn việc đọc hiểu ý định, không phải bịa kiến thức giải phẫu.
 *
 * Không dùng vector/embedding: kho chỉ vài trăm cấu trúc và câu hỏi của người
 * dùng luôn là tên bộ phận, nên khớp theo từ (đã bỏ dấu) vừa đủ chính xác lại
 * không kéo theo một dịch vụ ngoài phải trả tiền và phải chờ.
 */

export type Retrieved = {
  /** dòng ngữ cảnh để nhét vào lời nhắc hệ thống */
  lines: string[];
  /** hệ cơ quan suy ra từ các cấu trúc khớp, xếp theo độ khớp giảm dần */
  systems: SystemKey[];
};

/** Số cấu trúc nêu tên cho mỗi hệ trong bản tóm tắt kho. */
const DIGEST_SAMPLE = 6;

/** Từ dừng: khớp trúng mấy từ này thì mọi cấu trúc đều "liên quan". */
const STOP = new Set([
  "cau", "truc", "he", "cua", "va", "hoi", "cau hoi", "toi", "muon", "tao",
  "de", "cho", "hoc", "on", "tap", "phan", "the", "nguoi", "bai", "cac",
  "the", "system", "the", "and", "with", "quiz", "question", "questions",
  "want", "make", "about", "study", "learn", "review", "body",
]);

/** Tóm tắt kho: mỗi hệ có bao nhiêu cấu trúc và vài cái tên tiêu biểu. */
export function systemDigest(): string[] {
  const bySystem = new Map<SystemKey, AnatomyFact[]>();
  for (const fact of allFacts()) {
    for (const s of fact.systems) {
      bySystem.set(s, [...(bySystem.get(s) ?? []), fact]);
    }
  }
  return [...bySystem.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([key, facts]) => {
      const names = facts
        .slice(0, DIGEST_SAMPLE)
        .map((f) => f.label.vi)
        .join(", ");
      return `${key} (${SYSTEM_LABEL[key].vi} / ${SYSTEM_LABEL[key].en}) — ${facts.length} cấu trúc: ${names}`;
    });
}

/**
 * Tìm các cấu trúc trong kho khớp với lời người dùng.
 *
 * Chấm điểm theo chỗ khớp: tên cấu trúc đáng giá hơn ghi chú, vì "gan" xuất
 * hiện trong tên là đang nói về gan, còn xuất hiện trong ghi chú thì chỉ là
 * được nhắc tới khi mô tả cái khác.
 */
export function retrieve(query: string, limit = 12): Retrieved {
  const terms = tokens(query);
  if (!terms.length) return { lines: [], systems: [] };

  const scored: { fact: AnatomyFact; score: number }[] = [];
  for (const fact of allFacts()) {
    const label = fold(`${fact.label.vi} ${fact.label.en} ${fact.latinName ?? ""}`);
    const note = fold(`${fact.note.vi} ${fact.note.en}`);
    let score = 0;
    for (const term of terms) {
      if (label.includes(term)) score += 3;
      else if (note.includes(term)) score += 1;
    }
    if (score > 0) scored.push({ fact, score });
  }
  scored.sort((a, b) => b.score - a.score);

  // Cộng điểm theo HỆ chứ không chỉ đếm số cấu trúc khớp: một hệ có ba cấu trúc
  // khớp đúng tên phải đứng trên hệ có mười cấu trúc chỉ được nhắc trong ghi chú.
  const weight = new Map<SystemKey, number>();
  for (const { fact, score } of scored) {
    for (const s of fact.systems) weight.set(s, (weight.get(s) ?? 0) + score);
  }

  return {
    lines: scored.slice(0, limit).map(({ fact }) => {
      const latin = fact.latinName ? ` [${fact.latinName}]` : "";
      return `${fact.label.vi} / ${fact.label.en}${latin} → ${fact.systems.join(",")}`;
    }),
    systems: [...weight.entries()].sort((a, b) => b[1] - a[1]).map(([s]) => s),
  };
}

/** Cắt lời người dùng thành từ khoá đã bỏ dấu, bỏ từ dừng và từ quá ngắn. */
function tokens(query: string): string[] {
  const words = fold(query)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOP.has(w) && !/^\d+$/.test(w));
  // Ghép đôi từ liền nhau: "tieu hoa", "than kinh" chỉ có nghĩa khi đi cặp,
  // tách ra thì "hoa" và "kinh" khớp lung tung.
  const pairs = words.slice(0, -1).map((w, i) => `${w} ${words[i + 1]}`);
  return [...new Set([...pairs, ...words])];
}
