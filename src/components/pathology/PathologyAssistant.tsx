"use client";




import { useContent } from "@/components/content/ContentProvider";
import { bindContentSource } from "@/lib/content/source";
import { ContentSurface } from "@/components/content/ContentProvider";
import { useEffect, useRef, useState } from "react";
import type { Loc } from "@/lib/homeContent";
import { Icon } from "@/components/home/IconSprite";

/**
 * Hộp hỏi đáp bám giáo trình, dùng chung cho hai chỗ:
 *   mode="disease"  — trong hồ sơ một bệnh, chỉ tra trong bài của bệnh đó
 *   mode="symptoms" — ngoài trang chỉ mục, nhập triệu chứng để tìm BÀI ĐỌC
 *
 * Mọi câu trả lời đều kèm danh sách nguồn có số trang. Khi máy chủ không gọi
 * được mô hình (chưa cấu hình AI_API_KEY, hết hạn mức…), route trả về nguyên
 * văn giáo trình và cờ `engine`; ở đây hiện rõ cờ đó chứ không giả vờ là AI
 * đang trả lời.
 */

type Source = { slug: string; book: string; page: number; excerpt: string };

const copy = bindContentSource("data:src/components/pathology/PathologyAssistant.tsx#copy", {
  vi: {
    diseaseTitle: "Hỏi về bệnh này",
    diseasePlaceholder: "Vd: tiêu chuẩn chẩn đoán? phân biệt với bệnh nào?",
    symptomTitle: "Tra theo triệu chứng",
    symptomPlaceholder: "Vd: sưng đau khớp ngón chân cái về đêm, sốt nhẹ",
    send: "Hỏi", thinking: "Đang tra giáo trình…",
    sources: "Nguồn", failed: "Không tra được, thử lại giúp tôi.",
    lookupNote: "Chưa cấu hình khoá AI — đây là trích nguyên văn giáo trình, không phải câu trả lời do AI viết.",
    fallbackNote: "Không gọi được AI nên hiện nguyên văn giáo trình.",
    examples: ["sưng đau khớp ngón chân cái", "khó thở về đêm", "vàng da, nước tiểu sẫm", "sốt kéo dài, sụt cân"],
    symptomWarn: "Công cụ tra tài liệu học tập. Không chẩn đoán, không thay thế khám bệnh.",
  },
  en: {
    diseaseTitle: "Ask about this condition",
    diseasePlaceholder: "E.g. diagnostic criteria? differential diagnosis?",
    symptomTitle: "Search by symptom",
    symptomPlaceholder: "E.g. night-time swelling and pain in the big toe joint",
    send: "Ask", thinking: "Searching the textbook…",
    sources: "Sources", failed: "Lookup failed, please try again.",
    lookupNote: "No AI key configured — this is verbatim textbook text, not an AI-written answer.",
    fallbackNote: "AI unavailable, showing verbatim textbook text.",
    examples: ["swollen painful big toe joint", "breathlessness at night", "jaundice and dark urine", "prolonged fever, weight loss"],
    symptomWarn: "Study reference tool. Not a diagnosis and not a substitute for seeing a doctor.",
  },
  zh: {
    diseaseTitle: "询问本病",
    diseasePlaceholder: "例如：诊断标准？与哪些病鉴别？",
    symptomTitle: "按症状检索",
    symptomPlaceholder: "例如：夜间大脚趾关节红肿疼痛，低热",
    send: "提问", thinking: "正在检索教材…",
    sources: "来源", failed: "检索失败，请重试。",
    lookupNote: "未配置 AI 密钥——以下为教材原文，非 AI 撰写的回答。",
    fallbackNote: "无法调用 AI，显示教材原文。",
    examples: ["大脚趾关节红肿疼痛", "夜间呼吸困难", "黄疸、尿色深", "长期发热、体重下降"],
    symptomWarn: "学习检索工具。不作诊断，不能替代就医。",
  },
} as const);

export default function PathologyAssistant({
  locale,
  mode,
  slug,
  question: external,
}: {
  locale: Loc;
  mode: "disease" | "symptoms";
  slug?: string;
  /** Câu hỏi đưa từ ngoài vào (ô tìm kiếm gộp). Đổi giá trị thì tự hỏi lại. */
  question?: string;
}) {
  const cmsContent = useContent();
  const copy = cmsContent.resolve(cmsSourcecopy());

  const t = copy[locale];
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [engine, setEngine] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const asked = useRef<string | null>(null);
  const request = useRef<AbortController | null>(null);
  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (!active || request.current) return;
      setBusy(false); setAnswer(null); setSources([]); setEngine(null);
    });
    return () => { active = false; request.current?.abort(); request.current = null; };
  }, [mode, slug, locale]);

  async function ask(text: string) {
    if (!text.trim()) return;
    request.current?.abort();
    const controller = new AbortController(); request.current = controller;
    setBusy(true);
    setAnswer(null);
    setSources([]);
    try {
      const res = await fetch("/api/pathology-chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: text, mode, slug, locale }),
        signal: controller.signal,
      });
      const data = await res.json();
      if (controller.signal.aborted || request.current !== controller) return;
      if (!res.ok) throw new Error(data?.error ?? "http");
      setAnswer(data.answer);
      setSources(data.sources ?? []);
      setEngine(data.engine ?? null);
    } catch {
      if (controller.signal.aborted || request.current !== controller) return;
      setAnswer(t.failed);
      setEngine(null);
    } finally {
      if (request.current === controller) { request.current = null; setBusy(false); }
    }
  }

  useEffect(() => {
    const q = (external ?? "").trim();
    // Chốt lại câu đã hỏi: thiếu nó thì mỗi lần component render lại là gọi
    // API thêm một lần cho cùng một câu.
    const key = [mode, slug, locale, q].join(":");
    if (!q || asked.current === key) return;
    asked.current = key;
    setQuestion(q);
    ask(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [external, mode, slug, locale]);

  const note =
    engine === "lookup-nokey" ? t.lookupNote : engine === "lookup-fallback" ? t.fallbackNote : null;

  return <ContentSurface scope="src/components/pathology/PathologyAssistant.tsx">{(
    <section className="pth-ai">
      <header className="pth-ai-head">
        <Icon id={mode === "disease" ? "i-spark" : "i-steth"} />
        <h3>{mode === "disease" ? t.diseaseTitle : t.symptomTitle}</h3>
      </header>

      <form
        className="pth-ai-bar"
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
        }}
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={mode === "disease" ? t.diseasePlaceholder : t.symptomPlaceholder}
          aria-label={mode === "disease" ? t.diseaseTitle : t.symptomTitle}
          maxLength={500}
        />
        <button type="submit" disabled={busy || !question.trim()}>
          {busy ? t.thinking : t.send}
        </button>
      </form>

      {/* Gợi ý bấm được: ô trống là rào cản lớn nhất — người dùng không biết
          nên gõ gì, và gõ sai kiểu thì kết quả tệ. Bốn ví dụ này cũng ngầm dạy
          rằng nên mô tả TRIỆU CHỨNG chứ đừng gõ tên bệnh. */}
      {mode === "symptoms" && !answer && (
        <div className="pth-ai-eg">
          {t.examples.map((eg) => (
            <button key={eg} type="button" onClick={() => { setQuestion(eg); ask(eg); }} disabled={busy}>
              {eg}
            </button>
          ))}
        </div>
      )}

      {mode === "symptoms" && <p className="pth-ai-warn">{t.symptomWarn}</p>}

      {answer && (
        <div className="pth-ai-out">
          {note && <p className="pth-ai-note">{note}</p>}
          <p className="pth-ai-answer">{answer}</p>
          {sources.length > 0 && (
            <details>
              <summary>
                {t.sources} · {sources.length}
              </summary>
              <ol>
                {sources.map((s, i) => (
                  <li key={`${s.slug}-${s.page}-${i}`}>
                    <cite>
                      {s.book} · {s.page}
                    </cite>
                    <span>{s.excerpt}…</span>
                  </li>
                ))}
              </ol>
            </details>
          )}
        </div>
      )}
    </section>
  )}</ContentSurface>;
}

function cmsSourcecopy() { return copy; }
