import { NextResponse } from "next/server";
import { searchFacts, SYSTEM_LABEL, type AnatomyFact } from "@/lib/anatomy/knowledge";
import { pick, type Loc } from "@/lib/homeContent";
import { complete, isConfigured } from "@/lib/llm";
import { readJsonObject, readString } from "@/lib/requestBody";

/**
 * TRỢ LÝ GIẢI PHẪU — HAI TẦNG.
 *
 * Tầng 1 (luôn chạy, không cần khoá, không tốn tiền): tra cứu trên 629 cấu
 * trúc đã biên soạn của chính dự án. Trả về đoạn giải thích NGUYÊN VĂN kèm
 * đường dẫn mở đúng cấu trúc trên mô hình 3D. Không sinh chữ nên KHÔNG BỊA.
 *
 * Tầng 2 (chỉ bật khi có AI_API_KEY): đưa đúng những đoạn tìm được ở
 * tầng 1 cho mô hình viết lại thành câu trả lời mạch lạc. Vẫn bắt buộc bám vào
 * ngữ cảnh đó — prompt cấm trả lời ngoài phần được cung cấp.
 *
 * Vì sao KHÔNG nạp giáo trình PDF vào đây: sách có bản quyền, phục vụ nguyên
 * văn qua API là phát tán lại. Giáo trình chỉ dùng để đối chiếu độ phủ model.
 */
export const runtime = "nodejs";

type Source = {
  id: string;
  name: string;
  latin?: string;
  system: string;
  scene: string;
  sceneSlug: string;
  meshName: string;
  note: string;
};

function toSource(f: AnatomyFact, locale: Loc): Source {
  return {
    id: f.id,
    name: pick(f.label, locale),
    latin: f.latinName,
    system: f.systems.map((s) => pick(SYSTEM_LABEL[s], locale)).join(", "),
    scene: pick(f.sceneTitle, locale),
    sceneSlug: f.sceneSlug,
    meshName: f.meshName,
    note: pick(f.note, locale),
  };
}

const EMPTY: Record<Loc, string> = {
  vi: "Chưa tìm thấy cấu trúc nào khớp trong thư viện Soma. Thử gõ tên cấu trúc (ví dụ “gan”, “dây thần kinh giữa”, “van hai lá”).",
  en: "No matching structure in the Soma library yet. Try a structure name (e.g. “liver”, “median nerve”, “mitral valve”).",
  zh: "在 Soma 资料库中未找到匹配结构。请尝试输入结构名称（例如“肝”“正中神经”“二尖瓣”）。",
};

const LEAD: Record<Loc, (n: number) => string> = {
  vi: (n) => `Tìm thấy ${n} cấu trúc liên quan trong thư viện Soma:`,
  en: (n) => `Found ${n} related structures in the Soma library:`,
  zh: (n) => `在 Soma 资料库中找到 ${n} 个相关结构：`,
};

export async function POST(req: Request) {
  const body = await readJsonObject(req);
  if (!body) {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const question = readString(body.question, 500);
  const locale: Loc = body.locale === "en" || body.locale === "zh" ? body.locale : "vi";
  if (!question) return NextResponse.json({ error: "empty question" }, { status: 400 });

  const facts = searchFacts(question, locale, 5);
  const sources = facts.map((f) => toSource(f, locale));

  if (!sources.length) {
    return NextResponse.json({ answer: EMPTY[locale], sources: [], engine: "lookup" });
  }

  // ---- Tầng 1: ghép câu trả lời từ chính các đoạn đã biên soạn ----
  const lookupAnswer = [
    LEAD[locale](sources.length),
    ...sources.map((s) => `• ${s.name}${s.latin ? ` (${s.latin})` : ""} — ${s.note}`),
  ].join("\n\n");

  if (!isConfigured()) {
    return NextResponse.json({ answer: lookupAnswer, sources, engine: "lookup" });
  }

  // ---- Tầng 2: nhờ Claude diễn đạt lại, CHỈ dựa trên ngữ cảnh ở trên ----
  try {
    const context = sources
      .map(
        (s, i) =>
          `[${i + 1}] ${s.name}${s.latin ? ` (${s.latin})` : ""} — ${s.system} — ${s.scene}\n${s.note}`,
      )
      .join("\n\n");

    const text = await complete({
      system:
        "Bạn là trợ lý giải phẫu của atlas 3D Soma, dành cho sinh viên y. " +
        "CHỈ được trả lời dựa trên phần TƯ LIỆU được cung cấp. Không thêm kiến thức ngoài, " +
        "không suy đoán, không chẩn đoán bệnh. Nếu tư liệu không đủ để trả lời, nói thẳng là " +
        "thư viện chưa có và gợi ý cấu trúc gần nhất có trong tư liệu. Dẫn nguồn bằng số [1], [2] " +
        "đúng theo tư liệu. Trả lời gọn, đúng thuật ngữ giải phẫu, cùng ngôn ngữ với câu hỏi.",
      user: `TƯ LIỆU:

${context}

---

CÂU HỎI: ${question}`,
      maxTokens: 700,
    });

    return NextResponse.json({ answer: text, sources, engine: "ai" });
  } catch {
    // Hỏng khoá/hết hạn mức/mất mạng thì RƠI VỀ tầng tra cứu chứ không báo lỗi
    // trắng màn hình — người dùng vẫn nhận được nội dung đúng, chỉ kém mượt.
    return NextResponse.json({ answer: lookupAnswer, sources, engine: "lookup-fallback" });
  }
}
