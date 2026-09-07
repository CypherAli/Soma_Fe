"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import type { Loc } from "@/lib/homeContent";
import {
  GUEST_LIMIT,
  clearMemory,
  countGuestQuestion,
  guestQuotaLeft,
  isGuest,
  loadMemory,
  saveMemory,
} from "@/lib/chatMemory";
import { AUTH_CHANGED_EVENT } from "@/lib/auth";
import AnswerText, { plainText } from "@/components/chat/AnswerText";

/** Nguồn hợp nhất từ /api/assistant: cấu trúc 3D hoặc trang giáo trình bệnh học. */
type Source = {
  kind: "anatomy" | "pathology" | "overview" | "site" | "vet";
  id: string;
  title: string;
  detail: string;
  /** nơi mở khi bấm: model 3D hoặc hồ sơ bệnh */
  href: string;
  meta: string;
};

type Message = {
  role: "user" | "bot";
  text: string;
  sources?: Source[];
  engine?: string;
  /** câu hỏi nối tiếp do trợ lý đề xuất, bấm được */
  suggestions?: string[];
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
    placeholder: "Hỏi bằng giọng nói hoặc văn bản…", send: "Gửi", thinking: "Đang tra thư viện…", source: "Cấu trúc liên quan", view: "Xem 3D", read2: "Đọc bài", learn: "Giải phẫu đại cương", goPage: "Mở trang", full: "Mở trợ lý đầy đủ", clear: "Xóa hội thoại", close: "Đóng", open: "Hỏi Soma Bot", error: "Mình chưa kết nối được với thư viện. Hãy thử lại.", disclaimer: "Phục vụ học tập, không thay thế chẩn đoán hoặc điều trị.", mic: "Nói với Soma", stopMic: "Dừng nghe", listening: "Đang nghe…", read: "Đọc câu trả lời", stopRead: "Dừng đọc", voiceUnsupported: "Trình duyệt này chưa hỗ trợ nhập giọng nói.", micDenied: "Bạn chưa cấp quyền sử dụng micro.",
    suggestions: ["Tim có những buồng nào?", "Gan nằm ở đâu?", "Dây thần kinh giữa chi phối gì?"],
    voiceMissing: "Máy này chưa cài giọng đọc tiếng Việt nên mình chưa đọc được.",
    hide: "Ẩn trợ lý", show: "Hiện lại Soma Bot",
    guestGateTitle: "Hết lượt hỏi của chế độ khách",
    guestGateBody: `Khách chỉ hỏi được ${GUEST_LIMIT} câu mỗi phiên và hội thoại không được lưu lại. Đăng nhập để hỏi không giới hạn và giữ lại mạch hội thoại trên mọi thiết bị.`,
    guestGateCta: "Đăng nhập / Tạo tài khoản",
  },
  en: {
    name: "Soma Bot", status: "Anatomy assistant", hello: "Hi, I’m Soma Bot. I can look up atlas structures, explain terminology and open the relevant 3D model.",
    placeholder: "Ask by voice or text…", send: "Send", thinking: "Searching the library…", source: "Related structures", view: "View 3D", read2: "Read article", learn: "General anatomy", goPage: "Open page", full: "Open full assistant", clear: "Clear conversation", close: "Close", open: "Ask Soma Bot", error: "I could not reach the library. Please try again.", disclaimer: "For learning only; not a substitute for diagnosis or treatment.", mic: "Talk to Soma", stopMic: "Stop listening", listening: "Listening…", read: "Read answer", stopRead: "Stop reading", voiceUnsupported: "Voice input is not supported in this browser.", micDenied: "Microphone permission was not granted.",
    suggestions: ["What are the chambers of the heart?", "Where is the liver?", "What does the median nerve supply?"],
    voiceMissing: "This device has no English text-to-speech voice installed.",
    hide: "Hide assistant", show: "Show Soma Bot again",
    guestGateTitle: "Guest questions used up",
    guestGateBody: `Guests get ${GUEST_LIMIT} questions per session and the conversation is never saved. Sign in to ask without limits and keep your conversation on any device.`,
    guestGateCta: "Sign in / Create account",
  },
  zh: {
    name: "Soma Bot", status: "解剖助手", hello: "你好，我是 Soma Bot。我可以检索图谱结构、解释术语并打开相关三维模型。",
    placeholder: "使用语音或文字提问…", send: "发送", thinking: "正在检索资料库…", source: "相关结构", view: "查看三维", read2: "阅读条目", learn: "系统解剖", goPage: "打开页面", full: "打开完整助手", clear: "清除对话", close: "关闭", open: "询问 Soma Bot", error: "暂时无法连接资料库，请重试。", disclaimer: "仅供学习，不能替代诊断或治疗。", mic: "对 Soma 说话", stopMic: "停止收听", listening: "正在收听…", read: "朗读回答", stopRead: "停止朗读", voiceUnsupported: "此浏览器不支持语音输入。", micDenied: "尚未授予麦克风权限。",
    suggestions: ["心脏有哪些腔室？", "肝脏在哪里？", "正中神经支配什么？"],
    voiceMissing: "此设备未安装中文语音，暂时无法朗读。",
    hide: "隐藏助手", show: "重新显示 Soma Bot",
    guestGateTitle: "访客提问次数已用完",
    guestGateBody: `访客每次会话只能提问 ${GUEST_LIMIT} 次，且对话不会保存。登录后可无限提问，并在任何设备上保留对话。`,
    guestGateCta: "登录／注册",
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
  /** Ẩn hẳn trợ lý, chỉ chừa một chấm để gọi lại. */
  const [hidden, setHidden] = useState(false);
  /* Chỉ để VẼ lại giao diện. Nguồn sự thật của hạn mức vẫn là @/lib/chatMemory:
     state React có thể lỡ nhịp, còn hàm kia thì không. */
  const [guest, setGuest] = useState(false);
  const [quotaLeft, setQuotaLeft] = useState(GUEST_LIMIT);
  const gated = guest && quotaLeft <= 0;
  const logRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const reactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  /** Đọc lại trạng thái đăng nhập + hạn mức từ @/lib/chatMemory. */
  function syncQuota() {
    const g = isGuest();
    setGuest(g);
    setQuotaLeft(g ? guestQuotaLeft() : GUEST_LIMIT);
  }

  useEffect(() => {
    Promise.resolve().then(() => {
      try {
        // Đã đăng nhập thì lấy hội thoại từ máy chủ (đổi máy vẫn còn); khách
        // thì chỉ có những gì đã hỏi trong tab này — xem @/lib/chatMemory.
        void loadMemory().then((turns) => setMessages(turns.slice(-12) as Message[]));
      } catch { setMessages([]); }
      syncQuota();
    });
    // Đăng nhập ngay trong tab khác / trang khác thì hàng rào phải mở ra luôn,
    // không bắt người ta tải lại trang mới hỏi tiếp được.
    const onAuth = () => {
      syncQuota();
      void loadMemory().then((turns) => setMessages(turns.slice(-12) as Message[])).catch(() => {});
    };
    window.addEventListener(AUTH_CHANGED_EVENT, onAuth);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, onAuth);
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
    // Hỏi lại chatMemory chứ không tin state: hết lượt thì dừng ở đây, không
    // gọi API. Trả về sau khi đã đồng bộ để giao diện hiện hàng rào.
    if (isGuest() && guestQuotaLeft() <= 0) {
      syncQuota();
      return;
    }
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
    setSpeakingIndex(null);
    const next = [...messages, { role: "user", text: value } satisfies Message];
    setMessages(next);
    setQuestion("");
    setBusy(true);
    // Trừ lượt ngay lúc gửi, không đợi câu trả lời: bấm liên tục lúc đang chờ
    // thì hai câu cùng lọt qua nếu chỉ trừ ở lúc trả lời xong.
    countGuestQuestion();
    syncQuota();
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          question: value,
          locale,
          // Vài lượt gần nhất để hỏi tiếp kiểu "nó nằm ở đâu" là hiểu.
          history: next.slice(-5).map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      if (!response.ok) throw new Error("assistant unavailable");
      const data = await response.json();
      const complete = [...next, { role: "bot", text: data.answer ?? t.error, sources: data.sources, engine: data.engine, suggestions: data.suggestions } satisfies Message].slice(-12);
      setMessages(complete);
      saveMemory(complete.map((m) => ({ role: m.role, text: m.text })));
      setAnswered(true);
      if (answerTimerRef.current) clearTimeout(answerTimerRef.current);
      answerTimerRef.current = setTimeout(() => setAnswered(false), 2400);
    } catch {
      const complete = [...next, { role: "bot", text: t.error } satisfies Message].slice(-12);
      setMessages(complete);
      saveMemory(complete.map((m) => ({ role: m.role, text: m.text })));
    } finally { setBusy(false); }
  }

  function clear() {
    window.speechSynthesis?.cancel();
    setSpeakingIndex(null);
    setMessages([]);
    clearMemory();
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

  /**
   * Danh sách giọng đọc nạp KHÔNG ĐỒNG BỘ.
   *
   * Chrome trả về mảng rỗng ở lần gọi getVoices() đầu tiên rồi mới bắn sự kiện
   * voiceschanged sau đó. Bản trước không đợi, lại gán thẳng lang = "vi-VN"
   * nên trên máy chỉ cài giọng en-US (đã đo: 3 giọng, đều en-US) trình duyệt
   * lặng lẽ không phát gì — bấm loa tưởng hỏng.
   */
  function voicesReady(): Promise<SpeechSynthesisVoice[]> {
    const now = window.speechSynthesis.getVoices();
    if (now.length > 0) return Promise.resolve(now);
    return new Promise((resolve) => {
      const done = () => resolve(window.speechSynthesis.getVoices());
      window.speechSynthesis.addEventListener("voiceschanged", done, { once: true });
      // Có trình duyệt không bao giờ bắn sự kiện này; đừng treo mãi ở đó.
      setTimeout(done, 1200);
    });
  }

  async function speakMessage(text: string, index: number) {
    if (!("speechSynthesis" in window)) {
      setVoiceNote(t.voiceUnsupported);
      return;
    }
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }
    window.speechSynthesis.cancel();

    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const voices = await voicesReady();
    // Khớp theo tiền tố ("vi") chứ không đòi đúng "vi-VN": nhiều hệ đặt tên là
    // "vi_VN" hoặc chỉ "vi".
    const prefix = lang.slice(0, 2).toLowerCase();
    const voice = voices.find((v) => v.lang.toLowerCase().replace("_", "-").startsWith(prefix));
    if (!voice) {
      // Thà nói thẳng là máy thiếu giọng, còn hơn đọc tiếng Việt bằng giọng
      // tiếng Anh — nghe ra một thứ không ai hiểu.
      setVoiceNote(t.voiceMissing);
      setSpeakingIndex(null);
      return;
    }

    setVoiceNote("");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = voice.lang;
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

  function hideBot() {
    recognitionRef.current?.abort();
    window.speechSynthesis?.cancel();
    setListening(false);
    setSpeakingIndex(null);
    setOpen(false);
    setHidden(true);
  }

  function closeBot() {
    recognitionRef.current?.abort();
    window.speechSynthesis?.cancel();
    setListening(false);
    setSpeakingIndex(null);
    setOpen(false);
  }

  /* Đã ẩn thì cả con mèo lẫn bảng chat biến mất, chỉ còn một chấm sáng ở đúng
     chỗ cũ để gọi lại — người đang xoay mô hình 3D cần khoảng góc phải đó. */
  if (hidden) {
    return <button className="soma-bot-minimized" type="button" onClick={() => setHidden(false)} title={t.show} aria-label={t.show}><i /></button>;
  }

  return <div className={`soma-bot mood-${catMood}${open ? " is-open" : ""}${busy ? " is-thinking" : ""}${listening ? " is-listening" : ""}${answered ? " is-success" : ""}${reacting ? " is-reacting" : ""}`} style={{ position: "fixed", right: 22, bottom: 18, zIndex: 90 }}>
    <button className="soma-bot-hide" type="button" onClick={hideBot} title={t.hide} aria-label={t.hide}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" strokeLinecap="round" /></svg>
    </button>

    {open && <section className="soma-bot-panel" aria-label={t.status}>
      <header>
        {/* Mèo ở header nghĩ ngợi khi đang tra cứu: ba bong bóng chỉ hiện lúc
            bận, còn dáng lắc do CSS lo qua lớp .is-thinking ở gốc. */}
        <span className="soma-bot-header-mascot">
          <Image src="/mascot/white-pixel-cat-idle.png" alt="" width={48} height={48} />
          {busy && <><i /><i /><i /></>}
        </span>
        <div><strong>{t.name}</strong><span><i />{busy ? t.thinking : t.status}</span></div>
        <button type="button" onClick={clear} title={t.clear} aria-label={t.clear}>↺</button>
        <button type="button" onClick={closeBot} title={t.close} aria-label={t.close}>×</button>
      </header>

      <div className="soma-bot-log" ref={logRef} data-lenis-prevent>
        {messages.length === 0 && <div className="soma-bot-welcome"><p>{t.hello}</p><div>{suggestions.map((item) => <button key={item} onClick={() => void ask(item)}>{item}<span>→</span></button>)}</div></div>}
        {messages.map((message, index) => <article key={`${message.role}-${index}`} className={message.role}>
          {message.role === "bot" && <div className="soma-bot-message-tools"><small>{message.engine?.startsWith("claude") ? "AI + Soma Library" : "Soma Library"}</small><button type="button" className={speakingIndex === index ? "is-speaking" : ""} onClick={() => void speakMessage(plainText(message.text), index)} aria-label={speakingIndex === index ? t.stopRead : t.read} title={speakingIndex === index ? t.stopRead : t.read}>{speakingIndex === index ? "■" : "◖))"}</button></div>}
          {message.role === "bot" ? <AnswerText text={message.text} /> : <p>{message.text}</p>}
          {!!message.sources?.length && <div className="soma-bot-sources"><b>{t.source}</b>{message.sources.slice(0, 3).map((source) => <Link key={source.id} href={source.href} onClick={closeBot}><span>{source.title}{source.meta ? <i>{source.meta}</i> : null}</span><em>{source.kind === "pathology" ? t.read2 : source.kind === "overview" ? t.learn : source.kind === "site" ? t.goPage : t.view} →</em></Link>)}</div>}
          {!!message.suggestions?.length && <div className="soma-bot-next">{message.suggestions.map((sug) => <button key={sug} type="button" onClick={() => void ask(sug)}>{sug}</button>)}</div>}
        </article>)}
        {busy && <article className="bot soma-bot-thinking"><span /><span /><span /><p>{t.thinking}</p></article>}
        {gated && !busy && <div className="soma-bot-gate" role="status">
          <strong>{t.guestGateTitle}</strong>
          <p>{t.guestGateBody}</p>
          <Link href="/dang-nhap" onClick={closeBot}>{t.guestGateCta} →</Link>
        </div>}
      </div>

      <form onSubmit={(event) => { event.preventDefault(); void ask(); }}>
        <textarea rows={1} value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void ask(); } }} placeholder={gated ? t.guestGateTitle : t.placeholder} aria-label={t.placeholder} disabled={gated} />
        <button className={`soma-bot-mic${listening ? " is-listening" : ""}`} type="button" onClick={toggleListening} disabled={busy || gated} aria-label={listening ? t.stopMic : t.mic} title={listening ? t.stopMic : t.mic}><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v4m-3 0h6"/></svg></button>
        <button type="submit" disabled={!question.trim() || busy || gated} aria-label={t.send}>↑</button>
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
