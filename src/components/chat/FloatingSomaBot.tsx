"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import type { Loc } from "@/lib/homeContent";

type Source = {
  id: string;
  name: string;
  latin?: string;
  system: string;
  sceneSlug: string;
};

type Message = {
  role: "user" | "bot";
  text: string;
  sources?: Source[];
  engine?: string;
};

type CatMood = "calm" | "curious" | "sleepy" | "stretch";

type SpeechResultEvent = Event & {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
};

type SpeechErrorEvent = Event & { error: string };

type BrowserSpeechRecognition = EventTarget & {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: ((event: SpeechErrorEvent) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

const COPY = {
  vi: {
    name: "Soma Bot", status: "Trợ lý giải phẫu", hello: "Chào bạn, mình là Soma Bot. Mình có thể tra cứu cấu trúc trong atlas, giải thích thuật ngữ và mở đúng mô hình 3D.",
    placeholder: "Hỏi bằng giọng nói hoặc văn bản…", send: "Gửi", thinking: "Đang tra thư viện…", source: "Cấu trúc liên quan", view: "Xem 3D", full: "Mở trợ lý đầy đủ", clear: "Xóa hội thoại", close: "Đóng", open: "Hỏi Soma Bot", error: "Mình chưa kết nối được với thư viện. Hãy thử lại.", disclaimer: "Phục vụ học tập, không thay thế chẩn đoán hoặc điều trị.", mic: "Nói với Soma", stopMic: "Dừng nghe", listening: "Đang nghe…", read: "Đọc câu trả lời", stopRead: "Dừng đọc", voiceUnsupported: "Trình duyệt này chưa hỗ trợ nhập giọng nói.", micDenied: "Bạn chưa cấp quyền sử dụng micro.",
    suggestions: ["Tim có những buồng nào?", "Gan nằm ở đâu?", "Dây thần kinh giữa chi phối gì?"],
  },
  en: {
    name: "Soma Bot", status: "Anatomy assistant", hello: "Hi, I’m Soma Bot. I can look up atlas structures, explain terminology and open the relevant 3D model.",
    placeholder: "Ask by voice or text…", send: "Send", thinking: "Searching the library…", source: "Related structures", view: "View 3D", full: "Open full assistant", clear: "Clear conversation", close: "Close", open: "Ask Soma Bot", error: "I could not reach the library. Please try again.", disclaimer: "For learning only; not a substitute for diagnosis or treatment.", mic: "Talk to Soma", stopMic: "Stop listening", listening: "Listening…", read: "Read answer", stopRead: "Stop reading", voiceUnsupported: "Voice input is not supported in this browser.", micDenied: "Microphone permission was not granted.",
    suggestions: ["What are the chambers of the heart?", "Where is the liver?", "What does the median nerve supply?"],
  },
  zh: {
    name: "Soma Bot", status: "解剖助手", hello: "你好，我是 Soma Bot。我可以检索图谱结构、解释术语并打开相关三维模型。",
    placeholder: "使用语音或文字提问…", send: "发送", thinking: "正在检索资料库…", source: "相关结构", view: "查看三维", full: "打开完整助手", clear: "清除对话", close: "关闭", open: "询问 Soma Bot", error: "暂时无法连接资料库，请重试。", disclaimer: "仅供学习，不能替代诊断或治疗。", mic: "对 Soma 说话", stopMic: "停止收听", listening: "正在收听…", read: "朗读回答", stopRead: "停止朗读", voiceUnsupported: "此浏览器不支持语音输入。", micDenied: "尚未授予麦克风权限。",
    suggestions: ["心脏有哪些腔室？", "肝脏在哪里？", "正中神经支配什么？"],
  },
} as const;

export default function FloatingSomaBot() {
  const locale = useLocale() as Loc;
  const pathname = usePathname();
  const t = COPY[locale] ?? COPY.vi;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [reacting, setReacting] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [catMood, setCatMood] = useState<CatMood>("calm");
  const [listening, setListening] = useState(false);
  const [voiceNote, setVoiceNote] = useState("");
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const reactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  useEffect(() => {
    Promise.resolve().then(() => {
      try {
        const saved = JSON.parse(localStorage.getItem("soma3d-bot-history") ?? "[]") as Message[];
        setMessages(saved.slice(-12));
      } catch { setMessages([]); }
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; });
  }, [open, messages, busy]);

  useEffect(() => {
    let frame = 0;
    const followPointer = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const node = launcherRef.current;
        if (!node || open) return;
        const rect = node.getBoundingClientRect();
        const dx = Math.max(-1, Math.min(1, (event.clientX - (rect.left + rect.width / 2)) / (window.innerWidth * .45)));
        const dy = Math.max(-1, Math.min(1, (event.clientY - (rect.top + rect.height / 2)) / (window.innerHeight * .45)));
        node.style.setProperty("--look-x", `${(dx * 7).toFixed(2)}deg`);
        node.style.setProperty("--look-y", `${(dy * -5).toFixed(2)}deg`);
        node.style.setProperty("--shift-x", `${(dx * 3).toFixed(2)}px`);
      });
    };
    window.addEventListener("pointermove", followPointer, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("pointermove", followPointer); };
  }, [open]);

  useEffect(() => () => {
    if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
    if (answerTimerRef.current) clearTimeout(answerTimerRef.current);
    recognitionRef.current?.abort();
    window.speechSynthesis?.cancel();
  }, []);

  useEffect(() => {
    if (open || busy || answered || reacting) return;
    const moods: CatMood[] = ["curious", "calm", "stretch", "calm", "sleepy", "calm"];
    let index = 0;
    const timer = window.setInterval(() => {
      setCatMood(moods[index % moods.length]);
      index += 1;
    }, 4200);
    return () => window.clearInterval(timer);
  }, [open, busy, answered, reacting]);

  const suggestions = useMemo(() => {
    if (pathname.includes("benh-ly")) return locale === "vi" ? ["Bệnh lý nào liên quan đến tim?", "Mở cấu trúc gan trên mô hình", "ICD-11 là gì?"] : t.suggestions;
    if (pathname.includes("tim")) return locale === "vi" ? ["Tim có những buồng nào?", "Van hai lá nằm ở đâu?", "Tâm nhĩ trái có chức năng gì?"] : t.suggestions;
    if (pathname.includes("so") || pathname.includes("dau")) return locale === "vi" ? ["Xương trán nằm ở đâu?", "Hộp sọ gồm những phần nào?", "Mở mô hình xương đỉnh"] : t.suggestions;
    return t.suggestions;
  }, [locale, pathname, t.suggestions]);

  async function ask(text?: string) {
    const value = (text ?? question).trim();
    if (!value || busy) return;
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
    setSpeakingIndex(null);
    const next = [...messages, { role: "user", text: value } satisfies Message];
    setMessages(next);
    setQuestion("");
    setBusy(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: value, locale, contextPath: pathname }),
      });
      if (!response.ok) throw new Error("assistant unavailable");
      const data = await response.json();
      const complete = [...next, { role: "bot", text: data.answer ?? t.error, sources: data.sources, engine: data.engine } satisfies Message].slice(-12);
      setMessages(complete);
      localStorage.setItem("soma3d-bot-history", JSON.stringify(complete));
      setAnswered(true);
      if (answerTimerRef.current) clearTimeout(answerTimerRef.current);
      answerTimerRef.current = setTimeout(() => setAnswered(false), 2400);
    } catch {
      const complete = [...next, { role: "bot", text: t.error } satisfies Message].slice(-12);
      setMessages(complete);
      localStorage.setItem("soma3d-bot-history", JSON.stringify(complete));
    } finally { setBusy(false); }
  }

  function clear() {
    window.speechSynthesis?.cancel();
    setSpeakingIndex(null);
    setMessages([]);
    localStorage.removeItem("soma3d-bot-history");
  }

  function toggleListening() {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const browserWindow = window as typeof window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const Recognition = browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceNote(t.voiceUnsupported);
      return;
    }

    window.speechSynthesis?.cancel();
    setSpeakingIndex(null);
    setVoiceNote("");
    const recognition = new Recognition();
    recognition.lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      let transcript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript;
      }
      setQuestion(transcript.trimStart());
    };
    recognition.onerror = (event) => {
      setVoiceNote(event.error === "not-allowed" || event.error === "service-not-allowed" ? t.micDenied : t.voiceUnsupported);
      setListening(false);
    };
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

  function speakMessage(text: string, index: number) {
    if (!("speechSynthesis" in window)) return;
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    utterance.rate = locale === "vi" ? 0.94 : 1;
    utterance.pitch = 1.05;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  }

  function toggleBot() {
    if (open) {
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
      setListening(false);
      setSpeakingIndex(null);
    }
    setOpen((value) => !value);
    setReacting(true);
    if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
    reactionTimerRef.current = setTimeout(() => setReacting(false), 650);
  }

  function closeBot() {
    recognitionRef.current?.abort();
    window.speechSynthesis?.cancel();
    setListening(false);
    setSpeakingIndex(null);
    setOpen(false);
  }

  return <div className={`soma-bot mood-${catMood}${open ? " is-open" : ""}${busy ? " is-thinking" : ""}${listening ? " is-listening" : ""}${answered ? " is-success" : ""}${reacting ? " is-reacting" : ""}`} style={{ position: "fixed", right: 22, bottom: 18, zIndex: 90 }}>
    {open && <section className="soma-bot-panel" aria-label={t.status}>
      <header>
        <Image src="/mascot/white-pixel-cat-idle.png" alt="" width={48} height={48} />
        <div><strong>{t.name}</strong><span><i />{busy ? t.thinking : t.status}</span></div>
        <button type="button" onClick={clear} title={t.clear} aria-label={t.clear}>↺</button>
        <button type="button" onClick={closeBot} title={t.close} aria-label={t.close}>×</button>
      </header>

      <div className="soma-bot-log" ref={logRef} data-lenis-prevent>
        {messages.length === 0 && <div className="soma-bot-welcome"><p>{t.hello}</p><div>{suggestions.map((item) => <button key={item} onClick={() => void ask(item)}>{item}<span>→</span></button>)}</div></div>}
        {messages.map((message, index) => <article key={`${message.role}-${index}`} className={message.role}>
          {message.role === "bot" && <div className="soma-bot-message-tools"><small>{message.engine?.startsWith("claude") ? "AI + Soma Library" : "Soma Library"}</small><button type="button" className={speakingIndex === index ? "is-speaking" : ""} onClick={() => speakMessage(message.text, index)} aria-label={speakingIndex === index ? t.stopRead : t.read} title={speakingIndex === index ? t.stopRead : t.read}>{speakingIndex === index ? "■" : "◖))"}</button></div>}
          <p>{message.text}</p>
          {!!message.sources?.length && <div className="soma-bot-sources"><b>{t.source}</b>{message.sources.slice(0, 3).map((source) => <Link key={source.id} href={`/xem/${source.sceneSlug}`} onClick={closeBot}><span>{source.name}{source.latin ? <i>{source.latin}</i> : null}</span><em>{t.view} →</em></Link>)}</div>}
        </article>)}
        {busy && <article className="bot soma-bot-thinking"><span /><span /><span /><p>{t.thinking}</p></article>}
      </div>

      <form onSubmit={(event) => { event.preventDefault(); void ask(); }}>
        <textarea rows={1} value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void ask(); } }} placeholder={t.placeholder} aria-label={t.placeholder} />
        <button className={`soma-bot-mic${listening ? " is-listening" : ""}`} type="button" onClick={toggleListening} disabled={busy} aria-label={listening ? t.stopMic : t.mic} title={listening ? t.stopMic : t.mic}><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v4m-3 0h6"/></svg></button>
        <button type="submit" disabled={!question.trim() || busy} aria-label={t.send}>↑</button>
      </form>
      {(listening || voiceNote) && <div className={`soma-bot-voice-note${listening ? " is-listening" : ""}`} role="status"><i />{listening ? t.listening : voiceNote}</div>}
      <footer><span>{t.disclaimer}</span><Link href="/tro-ly" onClick={closeBot}>{t.full} ↗</Link></footer>
    </section>}

    <button ref={launcherRef} className="soma-bot-launcher" type="button" onClick={toggleBot} aria-expanded={open} aria-label={open ? t.close : t.open}>
      <b className="soma-bot-aura" aria-hidden="true" />
      <b className="soma-bot-scan" aria-hidden="true" />
      <span>{t.open}</span>
      <span className="soma-pose-stack" aria-hidden="true">
        <Image className="soma-pose soma-pose-idle" src="/mascot/white-pixel-cat-idle.png" alt="" width={112} height={112} priority />
        <Image className="soma-pose soma-pose-greet" src="/mascot/white-pixel-cat-greet.png" alt="" width={112} height={112} />
        <Image className="soma-pose soma-pose-think" src="/mascot/white-pixel-cat-think.png" alt="" width={112} height={112} />
        <Image className="soma-pose soma-pose-success" src="/mascot/white-pixel-cat-success.png" alt="" width={112} height={112} />
      </span>
      <b className="soma-bot-sparkles" aria-hidden="true"><i /><i /><i /></b>
      <b className="soma-bot-orbit" aria-hidden="true"><i /><i /><i /></b>
      <b className="soma-bot-sleep" aria-hidden="true"><i>Z</i><i>z</i></b>
      <i />
      <b className="soma-bot-ecg" aria-hidden="true"><svg viewBox="0 0 52 18"><path d="M1 10h10l3-5 4 11 5-15 5 9h8l3-4 3 4h9" /></svg></b>
    </button>
  </div>;
}
