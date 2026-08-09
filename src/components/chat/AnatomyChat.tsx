"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { Loc } from "@/lib/homeContent";

/**
 * Trợ lý hỏi đáp giải phẫu. Gọi /api/chat — tầng tra cứu luôn chạy, tầng
 * Claude chỉ bật khi máy chủ có ANTHROPIC_API_KEY (xem route.ts). Giao diện
 * hiển thị rõ đang chạy tầng nào để người dùng biết câu trả lời đến từ đâu.
 */
type Source = {
  id: string; name: string; latin?: string; system: string;
  scene: string; sceneSlug: string; meshName: string; note: string;
};
type Msg = { role: "user" | "bot"; text: string; sources?: Source[]; engine?: string };

const TXT = {
  vi: {
    eyebrow: "TRỢ LÝ GIẢI PHẪU", title: "Hỏi đáp cấu trúc",
    lead: "Hỏi về bất kỳ cấu trúc nào có trong thư viện 3D. Câu trả lời luôn kèm nguồn và nút mở đúng cấu trúc trên mô hình.",
    ph: "Ví dụ: gan nằm ở đâu, dây thần kinh giữa chi phối cơ nào…",
    send: "Hỏi", thinking: "Đang tra…", sources: "Nguồn trong thư viện",
    view: "Mở trên mô hình 3D",
    lookup: "Tra cứu thư viện", claude: "Claude + thư viện",
    disclaimer: "Nội dung phục vụ học tập, không thay thế chẩn đoán hay điều trị.",
    err: "Không gọi được trợ lý. Thử lại giúp tôi.",
  },
  en: {
    eyebrow: "ANATOMY ASSISTANT", title: "Ask about a structure",
    lead: "Ask about any structure in the 3D library. Every answer cites its source and opens the structure on the model.",
    ph: "e.g. where is the liver, what does the median nerve supply…",
    send: "Ask", thinking: "Searching…", sources: "Library sources",
    view: "Open on the 3D model",
    lookup: "Library lookup", claude: "Claude + library",
    disclaimer: "For learning only — not a substitute for diagnosis or treatment.",
    err: "Could not reach the assistant. Please try again.",
  },
  zh: {
    eyebrow: "解剖助手", title: "结构问答",
    lead: "可询问三维资料库中的任何结构。每个回答都标注来源并可直接在模型中打开。",
    ph: "例如：肝在哪里、正中神经支配哪些肌肉…",
    send: "提问", thinking: "查询中…", sources: "资料库来源",
    view: "在三维模型中打开",
    lookup: "资料库检索", claude: "Claude + 资料库",
    disclaimer: "仅供学习，不能替代诊断或治疗。",
    err: "无法连接助手，请重试。",
  },
} as const;

export default function AnatomyChat({ locale }: { locale: Loc }) {
  const t = TXT[locale] ?? TXT.vi;
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const ask = async (e: React.FormEvent) => {
    e.preventDefault();
    const question = q.trim();
    if (!question || busy) return;
    setQ("");
    setMsgs((m) => [...m, { role: "user", text: question }]);
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question, locale }),
      });
      const data = await res.json();
      setMsgs((m) => [
        ...m,
        { role: "bot", text: data.answer ?? t.err, sources: data.sources, engine: data.engine },
      ]);
    } catch {
      setMsgs((m) => [...m, { role: "bot", text: t.err }]);
    } finally {
      setBusy(false);
      requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
    }
  };

  return (
    <main className="chat-shell">
      <span className="quiz-eyebrow">{t.eyebrow}</span>
      <h1>{t.title}</h1>
      <p className="quiz-lead">{t.lead}</p>

      <div className="chat-log" data-lenis-prevent>
        {msgs.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>
            {m.role === "bot" && m.engine && (
              <span className="chat-engine">
                {m.engine.startsWith("claude") ? t.claude : t.lookup}
              </span>
            )}
            <p>{m.text}</p>
            {!!m.sources?.length && (
              <div className="chat-src">
                <b>{t.sources}</b>
                {m.sources.map((s) => (
                  <div key={s.id} className="chat-src-item">
                    <span>
                      {s.name}
                      {s.latin ? <i> · {s.latin}</i> : null} — {s.system}
                    </span>
                    <Link href={`/xem/${s.sceneSlug}`}>{t.view} →</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {busy && <div className="chat-msg bot"><p className="chat-wait">{t.thinking}</p></div>}
        <div ref={endRef} />
      </div>

      <form className="chat-form" onSubmit={ask}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.ph}
          aria-label={t.title}
        />
        <button type="submit" disabled={busy || !q.trim()}>{t.send}</button>
      </form>
      <p className="chat-note">{t.disclaimer}</p>
    </main>
  );
}
