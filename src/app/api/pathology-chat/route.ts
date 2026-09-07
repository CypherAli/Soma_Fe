import { NextResponse } from "next/server";
import { citation, search, type Hit } from "@/lib/pathologyRetrieval";
import { complete, isConfigured } from "@/lib/llm";

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

function lookupAnswer(hits: Hit[], mode: Mode): string {
  if (hits.length === 0) {
    return "Không tìm thấy đoạn nào trong giáo trình khớp với câu hỏi này.";
  }
  const head =
    mode === "symptoms"
      ? "Các bài trong giáo trình có nhắc tới mô tả của bạn:"
      : "Trích nguyên văn từ giáo trình:";
  return `${head}\n\n${hits
    .map((h, i) => `[${i + 1}] ${citation(h)}\n${h.text.slice(0, 420)}…`)
    .join("\n\n")}`;
}

export async function POST(request: Request) {
  let body: { question?: string; slug?: string; mode?: Mode };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "body không phải JSON" }, { status: 400 });
  }

  const question = (body.question ?? "").trim();
  const mode: Mode = body.mode ?? "ask";
  if (!question) {
    return NextResponse.json({ error: "thiếu câu hỏi" }, { status: 400 });
  }
  if (question.length > 500) {
    return NextResponse.json({ error: "câu hỏi quá dài" }, { status: 400 });
  }

  const hits = await search(question, {
    slug: mode === "disease" ? body.slug : undefined,
    limit: mode === "symptoms" ? 8 : 6,
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
      answer: lookupAnswer(hits, mode),
      sources,
      engine: hasAi ? "lookup" : "lookup-nokey",
    });
  }

  try {
    const context = hits
      .map((h, i) => `[${i + 1}] ${citation(h)}\n${h.text}`)
      .join("\n\n");

    const text = await complete({
      system: SYSTEM[mode],
      user: `TƯ LIỆU:\n\n${context}\n\n---\n\nCÂU HỎI: ${question}`,
      maxTokens: 900,
    });

    return NextResponse.json({ answer: text, sources, engine: "ai" });
  } catch {
    // Hỏng khoá / hết hạn mức / mất mạng thì rơi về tầng tra cứu, người dùng
    // vẫn đọc được nguyên văn giáo trình chứ không nhận màn hình lỗi.
    return NextResponse.json({
      answer: lookupAnswer(hits, mode),
      sources,
      engine: "lookup-fallback",
    });
  }
}
