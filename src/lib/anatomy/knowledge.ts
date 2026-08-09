import { sceneModules } from "@/lib/sceneModules";
import { pick, type Loc, type T3 } from "@/lib/homeContent";
import type { SystemKey } from "@/store/useAnatomyStore";

/**
 * KHO TRI THỨC GIẢI PHẪU — nguồn dùng chung cho Quiz và Trợ lý hỏi đáp.
 *
 * KHÔNG tạo dữ liệu mới: chỉ trải phẳng 629 hotspot đã biên soạn tay trong
 * `src/lib/scenes/*.ts`. Mỗi hotspot vốn đã có tên 3 ngôn ngữ, tên Latin, một
 * đoạn giải thích thật, và quan trọng nhất là `meshName` ĐÃ VERIFY tồn tại
 * trong file .glb — nên mọi câu hỏi và mọi câu trả lời đều nhảy thẳng được tới
 * đúng cấu trúc trên mô hình 3D.
 *
 * Vì sao KHÔNG lấy nội dung từ giáo trình PDF: sách có bản quyền, nhúng
 * nguyên văn vào ứng dụng là phát tán lại. Giáo trình chỉ dùng để ĐỐI CHIẾU
 * xem model có thiếu cấu trúc nào không (xem scripts/blender/query_coverage.py)
 * — đúng nguyên tắc đã ghi trong medical_kb/README.md.
 */
export type AnatomyFact = {
  /** khoá duy nhất: <slug scene>/<key hotspot> */
  id: string;
  /** tên mesh thật trong glTF — dùng để chọn sáng cấu trúc trên mô hình */
  meshName: string;
  /** slug scene chứa cấu trúc này, để mở đúng trang xem */
  sceneSlug: string;
  sceneTitle: T3;
  /** hệ cơ quan mà scene này bật mặc định */
  systems: SystemKey[];
  label: T3;
  latinName?: string;
  note: T3;
};

let cache: AnatomyFact[] | null = null;

export function allFacts(): AnatomyFact[] {
  if (cache) return cache;
  const out: AnatomyFact[] = [];
  for (const [slug, mod] of Object.entries(sceneModules)) {
    for (const h of mod.hotspots) {
      // Chỉ nhận hotspot có ĐỦ tên hiển thị và giải thích — thiếu một trong
      // hai thì không đủ để ra câu hỏi hay câu trả lời tử tế.
      if (!h.label || !h.note) continue;
      out.push({
        id: `${slug}/${h.key}`,
        meshName: h.meshName,
        sceneSlug: slug,
        sceneTitle: mod.title,
        systems: mod.visibleSystems,
        label: h.label,
        latinName: h.latinName,
        note: h.note,
      });
    }
  }
  cache = out;
  return out;
}

/** Gom theo hệ — dùng để lấy phương án nhiễu "cùng hệ" cho câu hỏi trắc nghiệm. */
export function factsBySystem(): Map<SystemKey, AnatomyFact[]> {
  const m = new Map<SystemKey, AnatomyFact[]>();
  for (const f of allFacts()) {
    for (const s of f.systems) {
      const arr = m.get(s) ?? [];
      arr.push(f);
      m.set(s, arr);
    }
  }
  return m;
}

export const SYSTEM_LABEL: Record<SystemKey, T3> = {
  skeletal: { vi: "Hệ xương", en: "Skeletal system", zh: "骨骼系统" },
  muscular: { vi: "Hệ cơ", en: "Muscular system", zh: "肌肉系统" },
  nervous: { vi: "Hệ thần kinh", en: "Nervous system", zh: "神经系统" },
  cardiovascular: { vi: "Hệ tuần hoàn", en: "Cardiovascular system", zh: "循环系统" },
  visceral: { vi: "Nội tạng", en: "Visceral systems", zh: "内脏系统" },
  lymphoid: { vi: "Hệ bạch huyết", en: "Lymphoid system", zh: "淋巴系统" },
  joints: { vi: "Khớp", en: "Joints", zh: "关节" },
};

/** Bỏ dấu tiếng Việt để tìm kiếm gõ không dấu vẫn ra. */
export function fold(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Khớp cả TỪ, không khớp lẫn vào giữa từ khác ("gan" không được trúng "ngang"). */
function wordHits(haystack: string, term: string): boolean {
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRe(term)}([^\\p{L}\\p{N}]|$)`, "u").test(haystack);
}

function scoreAgainst(f: AnatomyFact, locale: Loc, q: string, terms: string[], folded: boolean) {
  const norm = (s: string) => (folded ? fold(s) : s.toLowerCase());
  const name = norm(`${pick(f.label, locale)} ${f.latinName ?? ""} ${f.meshName}`);
  const body = norm(pick(f.note, locale));
  const scene = norm(pick(f.sceneTitle, locale));
  let score = 0;
  for (const t of terms) {
    if (wordHits(name, t)) score += 12;
    else if (name.includes(t)) score += 4;      // khớp một phần từ: yếu hơn hẳn
    if (wordHits(scene, t)) score += 3;
    if (wordHits(body, t)) score += 2;
  }
  // Tên TRÙNG KHÍT câu hỏi phải đứng trên tên chỉ CHỨA câu hỏi: hỏi "thần kinh
  // giữa" thì "Thần kinh giữa" phải xếp trước "Nhánh gan tay của thần kinh giữa".
  if (norm(pick(f.label, locale)) === q) score += 40;
  else if (name.includes(q)) score += 25;
  else if (body.includes(q)) score += 6;
  return score;
}

/**
 * Tìm kiếm không cần LLM: chấm điểm theo từ khoá khớp, ưu tiên khớp ở TÊN hơn
 * ở phần giải thích và khớp NGUYÊN TỪ hơn khớp lọt giữa từ.
 *
 * ƯU TIÊN ĐÚNG DẤU. Bỏ dấu tiếng Việt làm nhập nhằng những cặp khác hẳn nhau:
 * "gân" bỏ dấu thành "gan", nên hỏi "gan" từng trả về cơ nhị đầu và cân sọ.
 * Vì thế chỉ hạ xuống so khớp không dấu KHI so khớp đúng dấu không ra gì —
 * lúc đó mới đoán là người dùng gõ thiếu dấu.
 */
export function searchFacts(query: string, locale: Loc, limit = 6): AnatomyFact[] {
  const raw = query.trim().toLowerCase();
  if (!raw) return [];
  const facts = allFacts();

  // Chấm CẢ HAI cách rồi cộng lại, không dùng cách này thay cách kia: chỉ cần
  // một từ khớp đúng dấu là sẽ không bao giờ rơi sang so khớp không dấu nữa,
  // nên gõ "than kinh giua" từng không ra "Thần kinh giữa" (từ "kinh" đã khớp
  // đúng dấu ở hàng loạt dây thần kinh khác). Điểm không dấu nhân 0,5 để bản
  // gõ đúng dấu vẫn luôn được xếp trên.
  const termsOf = (q: string) => q.split(/\s+/).filter((t) => t.length > 1);
  const exactTerms = termsOf(raw);
  const foldedQ = fold(raw);
  const foldedTerms = termsOf(foldedQ);

  const hits = facts
    .map((f) => ({
      f,
      score:
        (exactTerms.length ? scoreAgainst(f, locale, raw, exactTerms, false) : 0) +
        (foldedTerms.length ? 0.5 * scoreAgainst(f, locale, foldedQ, foldedTerms, true) : 0),
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  // Một cấu trúc có thể xuất hiện ở nhiều scene (VD "Gan" có trong cả scene
  // gan-đường mật lẫn scene ổ bụng) — chỉ giữ bản điểm cao nhất, nếu không cả
  // 5 kết quả trả về đều là cùng một thứ.
  const seen = new Set<string>();
  const out: AnatomyFact[] = [];
  for (const { f } of hits) {
    const key = fold(pick(f.label, locale));
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(f);
    if (out.length >= limit) break;
  }
  return out;
}
