"use client";




import { useContent } from "@/components/content/ContentProvider";
import { bindContentSource } from "@/lib/content/source";
import { ContentSurface } from "@/components/content/ContentProvider";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Loc } from "@/lib/homeContent";
import { isRecord } from "@/lib/requestBody";
import { getToken } from "@/lib/auth";
import { MEMBERSHIP_CHANGED_EVENT } from "@/lib/membership";
import { createMicrophone, microphoneError, matchingSpeechVoice, type MicrophoneSession } from "@/lib/voice/microphone";

/** Nguồn hợp nhất: cấu trúc 3D hoặc trang giáo trình bệnh học. */
type Source = {
  kind: "anatomy" | "pathology" | "overview" | "site" | "vet";
  id: string;
  title: string;
  detail: string;
  href: string;
  meta: string;
};
type Msg = {
  role: "user" | "bot";
  text: string;
  sources?: Source[];
  engine?: string;
  suggestions?: string[];
};
type ChatSession = {
  id: string;
  title: string;
  updatedAt: number;
  msgs: Msg[];
};
type ChatState = {
  sid: string;
  msgs: Msg[];
  sessions: ChatSession[];
  loaded: boolean;
};
const STORE_KEY = "soma-assistant-sessions-v1";

function withMessages(
  state: ChatState,
  msgs: Msg[],
  updatedAt: number,
): ChatState {
  const sessions = state.sessions.filter((session) => session.id !== state.sid);
  if (msgs.length) {
    sessions.unshift({
      id: state.sid,
      title:
        msgs.find((message) => message.role === "user")?.text.slice(0, 42) ??
        "Phiên học",
      updatedAt,
      msgs,
    });
  }
  return { ...state, msgs, sessions: sessions.slice(0, 20) };
}

function readSessions(): ChatSession[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORE_KEY) ?? "[]");
    if (!Array.isArray(value)) return [];
    return value
      .filter(
        (session): session is ChatSession =>
          isRecord(session) &&
          typeof session.id === "string" &&
          typeof session.title === "string" &&
          typeof session.updatedAt === "number" &&
          Number.isFinite(session.updatedAt) &&
          Array.isArray(session.msgs) &&
          session.msgs.every(
            (message) =>
              isRecord(message) &&
              (message.role === "user" || message.role === "bot") &&
              typeof message.text === "string",
          ),
      )
      .slice(0, 20);
  } catch {
    return [];
  }
}
const MIN_THINKING_MS = 1400;

const TXT = bindContentSource("data:src/components/chat/AnatomyChat.tsx#TXT", {
  vi: {
    eyebrow: "TRỢ LÝ HỌC TẬP Y KHOA",
    title: "Hỏi Soma bằng giọng nói hoặc văn bản",
    lead: "Tra cứu giải phẫu từ thư viện Soma, nhận giải thích có nguồn và mở trực tiếp cấu trúc liên quan trên mô hình 3D.",
    ph: "Hỏi về một cấu trúc, chức năng hoặc liên quan lâm sàng…",
    send: "Gửi câu hỏi",
    thinking: "Đang tra thư viện…",
    sources: "Cấu trúc liên quan",
    view: "Mở mô hình",
    page: "Mở trang",
    lookup: "Soma Library",
    claude: "AI + Soma Library",
    disclaimer: "Phục vụ học tập; không thay thế chẩn đoán hoặc điều trị.",
    err: "Chưa thể kết nối trợ lý. Hãy thử lại.",
    listen: "Bắt đầu nói",
    stop: "Dừng nghe",
    listening: "Đang nghe bạn nói…",
    read: "Đọc câu trả lời",
    stopRead: "Dừng đọc",
    history: "Phiên học hiện tại",
    empty: "Bắt đầu bằng một câu hỏi hoặc chọn gợi ý bên dưới.",
    clear: "Xóa phiên",
    capabilities: "Soma có thể giúp gì?",
    cap1: "Giải thích cấu trúc",
    cap2: "Đối chiếu thuật ngữ",
    cap3: "Mở mô hình 3D",
    prompts: [
      "Tim có những buồng nào?",
      "Gan liên quan với các cơ quan nào?",
      "Dây thần kinh giữa chi phối gì?",
      "So sánh động mạch và tĩnh mạch",
    ],
  },
  en: {
    eyebrow: "MEDICAL STUDY ASSISTANT",
    title: "Ask Soma by voice or text",
    lead: "Search Soma's anatomy library, get sourced explanations, and open related structures in 3D.",
    ph: "Ask about a structure, function or clinical relation…",
    send: "Send question",
    thinking: "Searching the library…",
    sources: "Related structures",
    view: "Open model",
    page: "Open page",
    lookup: "Soma Library",
    claude: "AI + Soma Library",
    disclaimer:
      "For learning only; not a substitute for diagnosis or treatment.",
    err: "The assistant is unavailable. Please try again.",
    listen: "Start speaking",
    stop: "Stop listening",
    listening: "Listening…",
    read: "Read answer",
    stopRead: "Stop reading",
    history: "Current study session",
    empty: "Start with a question or choose a prompt below.",
    clear: "Clear session",
    capabilities: "What can Soma do?",
    cap1: "Explain structures",
    cap2: "Compare terminology",
    cap3: "Open 3D models",
    prompts: [
      "What are the chambers of the heart?",
      "What organs relate to the liver?",
      "What does the median nerve supply?",
      "Compare arteries and veins",
    ],
  },
  zh: {
    eyebrow: "医学学习助手",
    title: "通过语音或文字询问 Soma",
    lead: "检索 Soma 解剖资料库，获取有来源的解释并打开相关三维结构。",
    ph: "询问结构、功能或临床关系…",
    send: "发送问题",
    thinking: "正在检索…",
    sources: "相关结构",
    view: "打开模型",
    page: "打开页面",
    lookup: "Soma 资料库",
    claude: "AI + Soma 资料库",
    disclaimer: "仅供学习，不能替代诊断或治疗。",
    err: "暂时无法连接助手，请重试。",
    listen: "开始说话",
    stop: "停止收听",
    listening: "正在收听…",
    read: "朗读回答",
    stopRead: "停止朗读",
    history: "当前学习会话",
    empty: "输入问题或选择下方建议。",
    clear: "清除会话",
    capabilities: "Soma 能做什么？",
    cap1: "解释结构",
    cap2: "对照术语",
    cap3: "打开三维模型",
    prompts: [
      "心脏有哪些腔室？",
      "肝脏与哪些器官相关？",
      "正中神经支配什么？",
      "比较动脉和静脉",
    ],
  },
} as const);

function MicIcon() {
  return <ContentSurface scope="src/components/chat/AnatomyChat.tsx">{(
    <span className="assistant-mic-glyph" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v4m-3 0h6" />
      </svg>
      <i />
      <i />
      <i />
    </span>
  )}</ContentSurface>;
}

/**
 * Hiện câu trả lời của mô hình: **đậm** thành chữ đậm, ngắt dòng giữ nguyên.
 *
 * Mô hình trả về markdown nhẹ (đậm, gạch đầu dòng) — in thẳng ra thì người
 * dùng đọc phải "**121 mô hình 3D**" với đủ dấu sao. Chỉ cần đúng hai thứ này,
 * không đáng kéo cả thư viện markdown vào.
 */
function RichText({ text }: { text: string }) {
  return <ContentSurface scope="src/components/chat/AnatomyChat.tsx">{(
    <>
      {text.split("\n").map((line, li) => (
        <span key={li} className="assistant-line">
          {line
            .split(/\*\*(.+?)\*\*/g)
            .map((part, i) =>
              i % 2 ? <b key={i}>{part}</b> : <span key={i}>{part}</span>,
            )}
        </span>
      ))}
    </>
  )}</ContentSurface>;
}

export default function AnatomyChat({ locale }: { locale: Loc }) {
  const cmsContent = useContent();
  const TXT = cmsContent.resolve(cmsSourceTXT());

  const t = TXT[locale] ?? TXT.vi;
  const [chat, setChat] = useState<ChatState>({
    sid: "current",
    msgs: [],
    sessions: [],
    loaded: false,
  });
  const { sid, msgs, sessions } = chat;
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [speaking, setSpeaking] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<MicrophoneSession | null>(null);
  const speechSerialRef = useRef(0);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      requestRef.current?.abort();
      recognitionRef.current?.stop();
      speechSerialRef.current++;
      window.speechSynthesis?.cancel();
    },
    [],
  );
  useEffect(() => {
    const stop = (event: Event) => {
      if ((event as CustomEvent).detail?.owner === "assistant") return;
      recognitionRef.current?.stop();
      speechSerialRef.current++;
      window.speechSynthesis?.cancel(); setSpeaking(null);
    };
    window.addEventListener("soma-speech-owner", stop);
    return () => window.removeEventListener("soma-speech-owner", stop);
  }, []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [msgs, busy]);

  /* Nạp lịch sử các phiên cũ — câu hỏi + câu trả lời đều được giữ lại. */
  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      const stored = readSessions();
      const id = crypto.randomUUID();
      if (active)
        setChat((state) => ({
          ...state,
          sid: id,
          sessions: stored,
          loaded: true,
        }));
    });
    return () => {
      active = false;
    };
  }, []);

  /* Persist after React commits; state updater functions stay pure. */
  useEffect(() => {
    if (!chat.loaded) return;
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(sessions));
    } catch {
      /* Storage may be unavailable. */
    }
  }, [chat.loaded, sessions]);

  function cancelReply() {
    requestRef.current?.abort();
    requestRef.current = null;
    setBusy(false);
    window.speechSynthesis?.cancel();
    setSpeaking(null);
  }

  const appendMessage = useCallback((message: Msg, updatedAt: number) => {
    setChat((state) =>
      withMessages(state, [...state.msgs, message], updatedAt),
    );
  }, []);

  function newSession() {
    cancelReply();
    const id = crypto.randomUUID();
    setChat((state) => ({ ...state, sid: id, msgs: [] }));
  }
  function openSession(id: string) {
    const s = sessions.find((x) => x.id === id);
    if (!s) return;
    cancelReply();
    setChat((state) => ({ ...state, sid: s.id, msgs: s.msgs }));
  }
  function deleteSession(id: string) {
    setChat((state) => ({
      ...state,
      sessions: state.sessions.filter((session) => session.id !== id),
    }));
    if (id === sid) newSession();
  }

  const ask = useCallback(async (questionText?: string) => {
    const question = (questionText ?? q).trim();
    if (!question || requestRef.current || !chat.loaded) return;
    const controller = new AbortController();
    requestRef.current = controller;
    recognitionRef.current?.stop();
    speechSerialRef.current++;
    window.speechSynthesis?.cancel();
    setSpeaking(null);
    setQ("");
    appendMessage({ role: "user", text: question }, Date.now());
    setBusy(true);
    const thinkingDelay = new Promise<void>((resolve) =>
      setTimeout(resolve, MIN_THINKING_MS),
    );
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        signal: controller.signal,
        headers: { "content-type": "application/json", ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) },
        body: JSON.stringify({
          question,
          locale,
          history: msgs.slice(-5).map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = await res.json();
      if (data.engine !== "prepared-summary") window.dispatchEvent(new Event(MEMBERSHIP_CHANGED_EVENT));
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : t.err);
      await thinkingDelay;
      if (!controller.signal.aborted)
        appendMessage(
          {
            role: "bot",
            text: data.answer ?? t.err,
            sources: data.sources,
            engine: data.engine,
            suggestions: data.suggestions,
          },
          Date.now(),
        );
    } catch (cause) {
      await thinkingDelay;
      if (!controller.signal.aborted)
        appendMessage({ role: "bot", text: cause instanceof Error ? cause.message : t.err }, Date.now());
    } finally {
      if (requestRef.current === controller) {
        requestRef.current = null;
        setBusy(false);
      }
    }
  }, [q, chat.loaded, locale, msgs, t.err, appendMessage]);

  function toggleListening() {
    if (listening) { recognitionRef.current?.stop(); return; }
    window.dispatchEvent(new CustomEvent("soma-speech-owner", { detail: { owner: "assistant" } }));
    recognitionRef.current?.stop(); speechSerialRef.current++;
    window.speechSynthesis?.cancel(); setSpeaking(null);
    setVoiceError("");
    const session = createMicrophone({
      locale,
      onState: state => setListening(state === "starting" || state === "listening"),
      onError: error => setVoiceError(microphoneError(locale, error)),
      onText: text => setQ(text),
    });
    recognitionRef.current = session; session.start();
  }

  async function speak(text: string, index: number) {
    const synth = window.speechSynthesis;
    if (!synth || typeof SpeechSynthesisUtterance === "undefined") {
      setVoiceError(microphoneError(locale, "unsupported")); return;
    }
    speechSerialRef.current++;
    if (speaking === index) {
      synth.cancel();
      setSpeaking(null);
      return;
    }
    window.dispatchEvent(new CustomEvent("soma-speech-owner", { detail: { owner: "assistant" } }));
    recognitionRef.current?.stop(); synth.cancel();
    const serial = speechSerialRef.current;
    const voice = await matchingSpeechVoice(locale);
    if (serial !== speechSerialRef.current) return;
    if (!voice) {
      setSpeaking(null);
      setVoiceError(locale === "vi" ? "Máy chưa có giọng đọc tiếng Việt. Bạn vẫn có thể đọc câu trả lời trên màn hình." : locale === "zh" ? "此设备没有中文朗读语音，仍可阅读屏幕上的回答。" : "This device has no English voice installed. You can still read the answer.");
      return;
    }
    setVoiceError("");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voice.lang; utterance.voice = voice;
    utterance.rate = 0.95;
    utterance.onend = utterance.onerror = () => { if (serial === speechSerialRef.current) setSpeaking(null); };
    setSpeaking(index);
    try { synth.speak(utterance); } catch { setSpeaking(null); setVoiceError(microphoneError(locale, "start-failed")); }
  }

  return <ContentSurface scope="src/components/chat/AnatomyChat.tsx">{(
    <main className="assistant-page assistant-page-v2">
      <section className="assistant-intro">
        <div>
          <span>{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p>{t.lead}</p>
        </div>
        <dl className="assistant-system-status">
          <div>
            <dt>Trạng thái</dt>
            <dd>
              <i />
              Sẵn sàng
            </dd>
          </div>
          <div>
            <dt>Nguồn</dt>
            <dd>Atlas Soma 3D</dd>
          </div>
          <div>
            <dt>Chế độ</dt>
            <dd>Học tập</dd>
          </div>
        </dl>
      </section>

      <section className="assistant-workspace">
        <aside className="assistant-sidebar">
          <header>
            <span>01</span>
            <div>
              <b>{t.capabilities}</b>
              <small>Atlas · Thuật ngữ · Mô hình 3D</small>
            </div>
          </header>
          <ul>
            <li>
              <i>+</i>
              {t.cap1}
            </li>
            <li>
              <i>≋</i>
              {t.cap2}
            </li>
            <li>
              <i>⌁</i>
              {t.cap3}
            </li>
          </ul>
          <div className="assistant-prompts">
            {t.prompts.map((prompt) => (
              <button key={prompt} onClick={() => void ask(prompt)}>
                {prompt}
                <span>↗</span>
              </button>
            ))}
          </div>
          <div className="assistant-history">
            <div className="assistant-history-head">
              <b>Lịch sử trò chuyện</b>
              <button type="button" onClick={newSession}>
                + Mới
              </button>
            </div>
            {!sessions.length && (
              <p className="assistant-history-empty">
                Chưa có phiên nào. Mỗi cuộc trò chuyện sẽ tự lưu ở đây.
              </p>
            )}
            <ul>
              {sessions.map((s) => (
                <li key={s.id} className={s.id === sid ? "on" : ""}>
                  <button
                    type="button"
                    className="h-open"
                    onClick={() => openSession(s.id)}
                    title={s.title}
                  >
                    <b>{s.title}</b>
                    <small>
                      {s.msgs.length} tin ·{" "}
                      {new Date(s.updatedAt).toLocaleDateString(
                        locale === "zh"
                          ? "zh-CN"
                          : locale === "en"
                            ? "en-US"
                            : "vi-VN",
                      )}
                    </small>
                  </button>
                  <button
                    type="button"
                    className="h-del"
                    aria-label="Xóa phiên"
                    onClick={() => deleteSession(s.id)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <p>{t.disclaimer}</p>
        </aside>

        <div className="assistant-chat-card">
          <header>
            <div>
              <span>{t.history}</span>
              <b>
                {msgs.length
                  ? `${msgs.length} messages · đã lưu tự động`
                  : "READY"}
              </b>
            </div>
            <div className="assistant-head-actions">
              <button onClick={newSession}>Phiên mới</button>
              <button
                onClick={() => {
                  cancelReply();
                  setChat((state) => withMessages(state, [], Date.now()));
                }}
                disabled={!msgs.length}
              >
                {t.clear}
              </button>
            </div>
          </header>
          <div className="assistant-log" data-lenis-prevent>
            {!msgs.length && (
              <div className="assistant-empty">
                <Image
                  src="/mascot/white-pixel-cat-idle.png"
                  alt=""
                  width={80}
                  height={80}
                />
                <h2>{t.empty}</h2>
                <p>{t.lead}</p>
              </div>
            )}
            {msgs.map((message, index) => (
              <article
                key={`${message.role}-${index}`}
                className={message.role}
              >
                {message.role === "bot" && (
                  <header>
                    <span>
                      {message.engine?.startsWith("claude")
                        ? t.claude
                        : t.lookup}
                    </span>
                    <button onClick={() => speak(message.text, index)}>
                      {speaking === index ? `■ ${t.stopRead}` : `◖)) ${t.read}`}
                    </button>
                  </header>
                )}
                <p>
                  <RichText text={message.text} />
                </p>
                {!!message.sources?.length && (
                  <div className="assistant-sources">
                    <b>{t.sources}</b>
                    {message.sources.slice(0, 4).map((source) => (
                      <Link key={source.id} href={source.href}>
                        <span>
                          {source.title}
                          <i>{source.meta}</i>
                        </span>
                        <em>
                          {source.kind === "site" &&
                          source.id.startsWith("feature:")
                            ? t.page
                            : t.view}{" "}
                          ↗
                        </em>
                      </Link>
                    ))}
                  </div>
                )}
                {!!message.suggestions?.length && (
                  <div className="assistant-next">
                    {message.suggestions.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => void ask(sug)}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </article>
            ))}
            {busy && (
              <article className="bot assistant-wait">
                <i />
                <i />
                <i />
                <span>{t.thinking}</span>
              </article>
            )}
            <div ref={endRef} />
          </div>
          <form
            className="assistant-composer"
            onSubmit={(event) => {
              event.preventDefault();
              void ask();
            }}
          >
            <button
              type="button"
              className={listening ? "voice active" : "voice"}
              onClick={toggleListening}
              aria-label={listening ? t.stop : t.listen}
              title={listening ? t.stop : t.listen}
            >
              <MicIcon />
              <span>{listening ? t.stop : t.listen}</span>
            </button>
            <textarea
              rows={2}
              value={q}
              onChange={(event) => setQ(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void ask();
                }
              }}
              placeholder={listening ? t.listening : t.ph}
            />
            <button
              className="submit"
              type="submit"
              disabled={!q.trim() || busy}
            >
              <span>{t.send}</span>↑
            </button>
          </form>
          {(listening || voiceError) && (
            <div
              className={`assistant-voice-status${listening ? " active" : ""}`}
            >
              <i />
              {listening ? t.listening : voiceError}
            </div>
          )}
        </div>
      </section>
    </main>
  )}</ContentSurface>;
}

function cmsSourceTXT() { return TXT; }
