import { NextResponse } from "next/server";
import { articlePassages, citation, search, type Hit } from "@/lib/pathologyRetrieval";
import { complete, isConfigured } from "@/lib/llm";
import { readJsonObject, readString } from "@/lib/requestBody";
import type { Loc } from "@/lib/homeContent";

/**
 * TRỢ LÝ BỆNH LÝ — hai tầng, giống trợ lý giải phẫu ở /api/chat.
 *
 * Tầng 1 (luôn chạy, không cần khoá): tra 2883 đoạn giáo trình đã tách theo
 * bệnh, trả về NGUYÊN VĂN kèm tên sách và số trang. Không sinh chữ nên không
 * bịa được.
 * Tầng 2 (chỉ khi có AI_API_KEY): đưa đúng những đoạn đó cho mô hình viết lại.
 * Prompt cấm dùng kiến thức ngoài tư liệu. Nhà cung cấp nào là do @/lib/llm
 * quyết định theo biến môi trường — route này không biết mình đang gọi
 * Claude hay DeepSeek, và không cần biết.
 *
 * Ba chế độ:
 *   ask      — hỏi tự do trên toàn bộ 103 bài
 *   disease  — hỏi/tóm tắt trong phạm vi một bệnh (kèm slug)
 *   symptoms — nhập triệu chứng, trả về BÀI ĐỌC LIÊN QUAN
 *
 * `symptoms` KHÔNG phải chẩn đoán. Prompt bắt buộc diễn đạt thành "các bài có
 * nhắc tới triệu chứng này", cấm xếp hạng khả năng mắc bệnh và cấm khuyên điều
 * trị — đây là công cụ học tập, người dùng có thể là bệnh nhân đang lo lắng.
 */
export const runtime = "nodejs";

type Mode = "ask" | "disease" | "symptoms";

const SYSTEM: Record<Mode, string> = {
  ask:
    "Bạn là trợ lý tra cứu bệnh học của Soma 3D, dùng cho sinh viên y khoa. " +
    "CHỈ trả lời dựa trên phần TƯ LIỆU được cung cấp, trích từ giáo trình Bệnh học " +
    "Nội khoa (ĐH Y Hà Nội). Không thêm kiến thức ngoài, không suy đoán. Tư liệu " +
    "không đủ thì nói thẳng là giáo trình trong thư viện chưa có phần đó. Mỗi ý " +
    "phải dẫn nguồn bằng số [1], [2] đúng theo tư liệu. Trả lời gọn, đúng thuật " +
    "ngữ y khoa, cùng ngôn ngữ với câu hỏi.",
  disease:
    "Bạn là trợ lý tra cứu bệnh học của Soma 3D. Người dùng đang mở hồ sơ MỘT " +
    "bệnh cụ thể. CHỈ trả lời dựa trên TƯ LIỆU của chính bệnh đó. Không thêm " +
    "kiến thức ngoài, không suy đoán, không so sánh với bệnh khác nếu tư liệu " +
    "không nói. Dẫn nguồn bằng số [1], [2]. Trả lời gọn, cùng ngôn ngữ với câu hỏi.",
  symptoms:
    "Bạn là trợ lý tra cứu tài liệu của Soma 3D. Người dùng mô tả triệu chứng. " +
    "TUYỆT ĐỐI KHÔNG chẩn đoán, không xếp hạng khả năng mắc bệnh, không dùng chữ " +
    "'có thể bạn bị', không khuyên dùng thuốc hay điều trị. Việc của bạn CHỈ là " +
    "chỉ ra những BÀI trong giáo trình có nhắc tới các triệu chứng đó, và nêu " +
    "triệu chứng nào của bài khớp với mô tả — như một thủ thư chỉ chỗ đọc. " +
    "Dẫn nguồn bằng số [1], [2]. Kết thúc bằng đúng một câu nhắc rằng đây là tài " +
    "liệu học tập và việc chẩn đoán phải do bác sĩ khám trực tiếp.",
};

function lookupAnswer(hits: Hit[], mode: Mode, locale: Loc): string {
  if (hits.length === 0) {
    return locale === "en" ? "No textbook passage matched this question." : locale === "zh" ? "教材中未找到与此问题匹配的段落。" : "Không tìm thấy đoạn nào trong giáo trình khớp với câu hỏi này.";
  }
  const head =
    locale === "en" ? "Source excerpts (Vietnamese original; no machine translation):" : locale === "zh" ? "来源原文（越南语，未经机器翻译）：" : mode === "symptoms"
      ? "Các bài trong giáo trình có nhắc tới mô tả của bạn:"
      : "Trích nguyên văn từ giáo trình:";
  return `${head}\n\n${hits
    .map((h, i) => `[${i + 1}] ${citation(h)}\n${h.text.slice(0, 420)}…`)
    .join("\n\n")}`;
}

export async function POST(request: Request) {
  const body = await readJsonObject(request);
  if (!body) {
    return NextResponse.json({ error: "body không phải JSON" }, { status: 400 });
  }

  const question = readString(body.question, 501);
  const locale = body.locale ?? "vi";
  if (locale !== "vi" && locale !== "en" && locale !== "zh") return NextResponse.json({ error: "invalid locale" }, { status: 400 });
  const mode = body.mode ?? "ask";
  if (mode !== "ask" && mode !== "disease" && mode !== "symptoms") {
    return NextResponse.json({ error: "chế độ không hợp lệ" }, { status: 400 });
  }
  const slug = readString(body.slug, 200);
  if (mode === "disease" && !slug) {
    return NextResponse.json({ error: "thiếu mã bệnh" }, { status: 400 });
  }
  if (!question) {
    return NextResponse.json({ error: "thiếu câu hỏi" }, { status: 400 });
  }
  if (question.length > 500) {
    return NextResponse.json({ error: "câu hỏi quá dài" }, { status: 400 });
  }

  const isSummary = /tóm tắt|summari[sz]|概括|概要/.test(question.toLowerCase());

  const hits = isSummary && mode === "disease" ? await articlePassages(slug, 4) : await search(question, {
    slug: mode === "disease" ? slug : undefined,
    limit: isSummary ? 4 : mode === "symptoms" ? 8 : 6,
  });

  // Nguồn trả về cho giao diện: đoạn ngắn thôi. KHÔNG trả nguyên chunk 1200 ký
  // tự cho mọi truy vấn — gom đủ nhiều lần là dựng lại được cả cuốn sách.
  const sources = hits.map((h) => ({
    slug: h.slug,
    book: h.book,
    page: h.page,
    excerpt: h.text.slice(0, 300),
  }));

  const hasAi = isConfigured();
  if (!hasAi || hits.length === 0) {
    return NextResponse.json({
      answer: lookupAnswer(hits, mode, locale),
      sources,
      engine: hasAi ? "lookup" : "lookup-nokey",
    });
  }

  try {
    const context = hits
      .map((h, i) => `[${i + 1}] ${citation(h)}\n${h.text}`)
      .join("\n\n");

    // Tóm tắt phải NGẮN hơn hẳn bản chính: ép khung 4 gạch đầu dòng,
    // tối đa ~180 từ, cấm chép nguyên văn — không thì ra bản "tóm tắt"
    // dài ngang bài gốc như hiện tại.
    const summaryRule = isSummary
      ? " Yêu cầu đặc biệt cho TÓM TẮT: trả lời tối đa 4 gạch đầu dòng (định nghĩa · triệu chứng chính · chẩn đoán · điều trị), tổng cộng không quá 180 từ, diễn đạt lại gọn bằng chữ của bạn, tuyệt đối không chép nguyên văn đoạn dài."
      : "";
    const text = await complete({
      system: SYSTEM[mode] + summaryRule + ` Trả lời bằng ${locale === "vi" ? "tiếng Việt" : locale === "en" ? "English" : "简体中文"}.`,
      user: `TƯ LIỆU:\n\n${context}\n\n---\n\nCÂU HỎI: ${question}`,
      maxTokens: isSummary ? 400 : 900,
    });
    const references = [...text.matchAll(/\[(\d+)\]/g)].map(match => Number(match[1]));
    if (!references.length || references.some(index => index < 1 || index > sources.length)) throw new Error("Invalid citations");

    return NextResponse.json({ answer: text, sources, engine: "ai" });
  } catch {
    // Hỏng khoá / hết hạn mức / mất mạng thì rơi về tầng tra cứu, người dùng
    // vẫn đọc được nguyên văn giáo trình chứ không nhận màn hình lỗi.
    return NextResponse.json({
      answer: lookupAnswer(hits, mode, locale),
      sources,
      engine: "lookup-fallback",
    });
  }
}
