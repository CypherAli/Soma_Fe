import { readFile } from "node:fs/promises";
import path from "node:path";
import { SYNONYM_GROUPS } from "./medicalSynonyms";

/**
 * Tra cứu đoạn giáo trình cho trợ lý bệnh lý — CHẠY Ở SERVER, không bao giờ
 * gửi cả kho xuống trình duyệt.
 *
 * Kho là `data/pathology-chunks.jsonl` do
 * medical_kb/scripts/build_pathology_index.py sinh ra: 2883 đoạn của 103 bài
 * trong Bệnh học Nội khoa, mỗi đoạn có sẵn slug bệnh và SỐ TRANG IN để trích
 * dẫn. File nằm ngoài public/ vì đó là toàn văn sách có bản quyền — chỉ được
 * trả về từng đoạn ngắn kèm nguồn, không phục vụ nguyên file.
 */

export type Chunk = {
  slug: string;
  book: string;
  page: number;
  pdfPage: number;
  text: string;
};

export type Hit = Chunk & { score: number };

const FILE = path.join(process.cwd(), "data", "pathology-chunks.jsonl");

/**
 * Bỏ dấu để "viem khop" khớp được "viêm khớp" — sinh viên hay gõ không dấu.
 *
 * Phải thay "đ" -> "d" RIÊNG. NFD chỉ tách được nguyên âm có dấu phụ, còn "đ"
 * (U+0111) là một CHỮ CÁI riêng của bảng chữ cái tiếng Việt chứ không phải
 * "d" + dấu gạch, nên nó sống sót qua normalize. Thiếu dòng này thì "đái tháo
 * đường" chuẩn hoá ra "đai thao đuong" và câu hỏi gõ ASCII "dai thao duong"
 * không bao giờ khớp — đã đo: 0/2829 đoạn khớp được tên bệnh đó.
 */
export const fold = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/g, "d");

/** Từ quá phổ biến thì tính điểm cho mọi đoạn, thành ra không phân biệt gì. */
const STOP = new Set([
  "cua", "va", "la", "co", "khong", "cho", "trong", "voi", "nhu", "khi", "duoc",
  "cac", "nhung", "mot", "nay", "do", "den", "tu", "ve", "hay", "thi", "ma",
  "benh", "gi", "nao", "the", "bi", "sao", "tai", "lam", "ra", "hon", "nguoi",
]);

/* Trọng số: cụm người dùng gõ > cụm nới nghĩa > tiếng lẻ. Tiếng lẻ để thấp vì
   một tiếng tiếng Việt gần như vô nghĩa khi đứng riêng.

   Từ đồng nghĩa để CAO (0,7) chứ không rón rén: chúng cùng chỉ một thứ, và
   IDF mới là chỗ phân biệt từ hiếm với từ nhan nhản. Để 0,2 như bản trước thì
   "bệnh thống phong" không tới nổi bài gout — sách không dùng chữ "thống
   phong" lần nào, đường duy nhất tới bài đó là qua chữ "gút". */
const W_PHRASE = 1;
const W_SYN_PHRASE = 0.9;
const W_WORD = 0.25;
const W_SYN_WORD = 0.7;

const FOLDED_GROUPS = SYNONYM_GROUPS.map((g) => g.map(fold));

type Term = { t: string; w: number };

/**
 * Tách câu hỏi thành từ khoá, rồi nới thêm từ đồng nghĩa.
 *
 * Cụm nhiều chữ được dò TRƯỚC trên nguyên câu ("dai thao duong"), vì tách theo
 * dấu cách rồi mới tra thì không bao giờ khớp được nhóm nhiều chữ.
 */
export function expandTerms(foldedQuestion: string): Term[] {
  const out = new Map<string, number>();
  const add = (t: string, w: number) => {
    if (t.length > 2) out.set(t, Math.max(out.get(t) ?? 0, w));
  };

  const words = foldedQuestion.split(/[^\p{L}\p{N}]+/u).filter(Boolean);

  // CỤM HAI TIẾNG là đơn vị mang nghĩa của tiếng Việt, và là thứ đáng tin nhất
  // ở đây. Một tiếng lẻ gần như vô nghĩa để tra: "duong" trúng cả "dương tính"
  // lẫn "dinh dưỡng", "tieu" trúng "tiêu chuẩn" — chấm điểm theo tiếng lẻ thì
  // câu hỏi "tiểu đường" ra bài lupus.
  for (let i = 0; i < words.length - 1; i++) {
    if (STOP.has(words[i]) && STOP.has(words[i + 1])) continue;
    add(`${words[i]} ${words[i + 1]}`, W_PHRASE);
  }
  for (const word of words) {
    if (!STOP.has(word)) add(word, W_WORD);
  }

  for (const group of FOLDED_GROUPS) {
    const hit = group.some(
      (member) =>
        member.includes(" ")
          ? foldedQuestion.includes(member)
          : new RegExp(`\\b${member}\\b`).test(foldedQuestion),
    );
    if (!hit) continue;
    for (const member of group) {
      // Giữ NGUYÊN CỤM khi nới nghĩa. Tách "dai thao duong" thành ba tiếng rời
      // là mất hết sức phân biệt, đúng cái bẫy vừa nói ở trên.
      add(member, member.includes(" ") ? W_SYN_PHRASE : W_SYN_WORD);
    }
  }

  return [...out].map(([t, w]) => ({ t, w }));
}

let cache: { chunks: Chunk[]; folded: string[] } | null = null;

async function load() {
  if (cache) return cache;
  const raw = await readFile(FILE, "utf8");
  const chunks: Chunk[] = [];
  for (const line of raw.split("\n")) {
    if (line.trim()) chunks.push(JSON.parse(line) as Chunk);
  }
  // Bỏ dấu sẵn một lần cho cả kho: nếu fold() từng đoạn ở mỗi truy vấn thì
  // mỗi câu hỏi phải chuẩn hoá lại 2,8 MB chữ.
  // Gộp mọi khoảng trắng về một dấu cách: sách xuống dòng ngay giữa cụm, không
  // gộp thì cụm bị ngắt qua hai dòng sẽ không khớp nữa.
  cache = { chunks, folded: chunks.map((c) => fold(c.text).replace(/\s+/g, " ")) };
  return cache;
}

/**
 * Chấm điểm kiểu tần suất từ khoá, có thưởng cho cụm liền nhau.
 *
 * Chưa dùng embedding: kho chỉ 2883 đoạn, quét tuyến tính mất vài chục ms, mà
 * không phải dựng thêm dịch vụ vector nào. Đổi sang embedding chỉ đáng khi
 * người dùng hỏi bằng từ đồng nghĩa mà giáo trình không dùng.
 */
export async function search(
  question: string,
  opts: { slug?: string; limit?: number } = {},
): Promise<Hit[]> {
  const { chunks, folded } = await load();
  const limit = opts.limit ?? 6;
  const q = fold(question);
  const terms = expandTerms(q);
  if (terms.length === 0) return [];

  const pool: number[] = [];
  for (let i = 0; i < chunks.length; i++) {
    if (!opts.slug || chunks[i].slug === opts.slug) pool.push(i);
  }
  if (pool.length === 0) return [];

  // Lượt 1: đếm số lần xuất hiện của từng từ trong từng đoạn.
  const tf: number[][] = terms.map(() => new Array(pool.length).fill(0));
  const df = new Array(terms.length).fill(0);
  for (let k = 0; k < terms.length; k++) {
    const t = terms[k].t;
    for (let j = 0; j < pool.length; j++) {
      const hay = folded[pool[j]];
      let n = 0;
      let at = hay.indexOf(t);
      while (at !== -1) {
        n++;
        at = hay.indexOf(t, at + t.length);
      }
      tf[k][j] = n;
      if (n > 0) df[k]++;
    }
  }

  // IDF là mảnh quyết định. Không có nó, từ nhan nhản như "tiểu", "đường" ăn
  // điểm ở mọi đoạn và dìm chết từ hiếm; đo thực tế: hỏi "bệnh thống phong"
  // ra bài suy thận cấp, còn bài gout — nơi chữ "thống phong" chỉ xuất hiện ở
  // đúng một chỗ — bị đẩy xuống dưới.
  const N = pool.length;
  const idf = df.map((d) => Math.log(1 + (N - d + 0.5) / (d + 0.5)));

  const avgLen = pool.reduce((s, i) => s + folded[i].length, 0) / N;
  const K1 = 1.4;
  const B = 0.6; // đoạn dài không được ăn điểm chỉ vì dài

  const hits: Hit[] = [];
  for (let j = 0; j < pool.length; j++) {
    const chunk = chunks[pool[j]];
    const norm = K1 * (1 - B + (B * folded[pool[j]].length) / avgLen);

    let score = 0;
    let matched = 0;
    for (let k = 0; k < terms.length; k++) {
      const n = tf[k][j];
      if (n === 0) continue;
      matched++;
      score += terms[k].w * idf[k] * ((n * (K1 + 1)) / (n + norm));
    }
    if (matched === 0) continue;

    // Tên bệnh nằm ở slug chứ không nằm trong thân bài. Khớp được nhiều tiếng
    // của slug là tín hiệu mạnh rằng đúng bài, dù chữ đó không lặp trong đoạn.
    const slugWords = new Set(chunk.slug.split("-"));
    const termWords = new Set(terms.flatMap((x) => x.t.split(" ")));
    const slugHit = [...termWords].filter((w) => slugWords.has(w)).length;
    if (slugHit >= 2) score *= 1 + 0.25 * slugHit;

    hits.push({ ...chunk, score });
  }

  hits.sort((a, b) => b.score - a.score);

  // Không lấy 6 đoạn liền nhau của cùng một bài: câu trả lời sẽ chỉ soi được
  // một góc. Mỗi bệnh tối đa 3 đoạn, trừ khi đang hỏi trong phạm vi một bệnh.
  if (opts.slug) return hits.slice(0, limit);
  const perSlug = new Map<string, number>();
  const spread: Hit[] = [];
  for (const hit of hits) {
    const n = perSlug.get(hit.slug) ?? 0;
    if (n >= 3) continue;
    perSlug.set(hit.slug, n + 1);
    spread.push(hit);
    if (spread.length >= limit) break;
  }
  return spread;
}

export const citation = (hit: Chunk) => `${hit.book} · trang ${hit.page}`;
