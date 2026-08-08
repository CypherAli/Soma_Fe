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

/**
 * Tìm kiếm không cần LLM: chấm điểm theo số từ khoá khớp, ưu tiên khớp ở TÊN
 * hơn ở phần giải thích, và cộng điểm cho cụm khớp nguyên vẹn. Đủ tốt để trả
 * lời "gan nằm ở đâu", "cơ nào gấp cẳng tay" mà không tốn một đồng API nào.
 */
export function searchFacts(query: string, locale: Loc, limit = 6): AnatomyFact[] {
  const q = fold(query.trim());
  if (!q) return [];
  const terms = q.split(/\s+/).filter((t) => t.length > 1);
  if (!terms.length) return [];

  const scored = allFacts().map((f) => {
    const name = fold(`${pick(f.label, locale)} ${f.latinName ?? ""} ${f.meshName}`);
    const body = fold(pick(f.note, locale));
    const scene = fold(pick(f.sceneTitle, locale));
    let score = 0;
    for (const t of terms) {
      if (name.includes(t)) score += 10;
      if (scene.includes(t)) score += 3;
      if (body.includes(t)) score += 2;
    }
    if (name.includes(q)) score += 25;      // khớp nguyên cụm ở tên: gần như chắc chắn đúng
    if (body.includes(q)) score += 6;
    return { f, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.f);
}
