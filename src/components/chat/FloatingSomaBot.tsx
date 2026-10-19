"use client";


import { ContentSurface } from "@/components/content/ContentProvider";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { matchCommand, wakeQuestion, type VoiceResult } from "@/lib/voice/match";
import { pageVoiceActions } from "@/lib/voice/registry";
import { buildGlobalActions } from "@/lib/voice/globalCommands";
import { createMicrophone, microphoneError, type MicrophoneSession } from "@/lib/voice/microphone";
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

const COPY = {
  vi: {
    name: "Soma Bot", status: "Trợ lý giải phẫu", hello: "Chào bạn, mình là Soma Bot. Mình có thể tra cứu cấu trúc trong atlas, giải thích thuật ngữ và mở đúng mô hình 3D.",
    placeholder: "Hỏi bằng giọng nói hoặc văn bản…", send: "Gửi", thinking: "Đang tra thư viện…", source: "Cấu trúc liên quan", view: "Xem 3D", read2: "Đọc bài", learn: "Giải phẫu đại cương", goPage: "Mở trang", full: "Mở trợ lý đầy đủ", clear: "Xóa hội thoại", close: "Đóng", open: "Hỏi Soma Bot", error: "Mình chưa kết nối được với thư viện. Hãy thử lại.", disclaimer: "Phục vụ học tập, không thay thế chẩn đoán hoặc điều trị.", mic: "Nói với Soma", stopMic: "Dừng nghe", listening: "Đang nghe…", read: "Đọc câu trả lời", stopRead: "Dừng đọc", voiceUnsupported: "Trình duyệt này chưa hỗ trợ nhập giọng nói.", micDenied: "Bạn chưa cấp quyền sử dụng micro.",
    suggestions: ["Tim có những buồng nào?", "Gan nằm ở đâu?", "Dây thần kinh giữa chi phối gì?"],
    voiceMissing: "Máy này chưa cài giọng đọc tiếng Việt nên mình chưa đọc được.",
    hide: "Ẩn trợ lý", show: "Hiện lại Soma Bot",
    handsFree: "Nghe liên tục", handsFreeOn: "Đang nghe liên tục — nói lệnh, hoặc “Soma …” để hỏi", handsFreeOff: "Tắt nghe liên tục",
    done: "Xong.", cmdFail: "Không thực hiện được lệnh này.",
    notUnderstood: (x: string) => `Chưa hiểu lệnh “${x}”. Nói “trợ giúp” để nghe các lệnh.`,
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
    handsFree: "Hands-free", handsFreeOn: "Listening hands-free — say a command, or “Soma …” to ask", handsFreeOff: "Stop hands-free",
    done: "Done.", cmdFail: "That command could not be carried out.",
    notUnderstood: (x: string) => `I didn't catch the command “${x}”. Say “help” to hear the commands.`,
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
    handsFree: "持续收听", handsFreeOn: "正在持续收听——直接说指令，或说“Soma …”提问", handsFreeOff: "停止持续收听",
    done: "完成。", cmdFail: "无法执行该指令。",
    notUnderstood: (x: string) => `没有听懂指令“${x}”。说“帮助”可听取指令列表。`,
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
  const recognitionRef = useRef<MicrophoneSession | null>(null);
  const answerRequestRef = useRef<AbortController | null>(null);
  const memoryGenerationRef = useRef(0);

  // ---- LỆNH GIỌNG NÓI ----
  // Câu nói (hoặc gõ) được thử khớp LỆNH trước: lệnh của trang đang mở (bật lớp,
  // quét…) rồi tới lệnh chung (mở trang, mở mô hình). Không khớp mới gửi cho trợ
  // lý như một câu hỏi. Lệnh chạy ngay trên máy, không tốn lượt hỏi của khách.
  const router = useRouter();
  const globalActions = useMemo(
    () => buildGlobalActions({ locale, navigate: (href) => router.push(href), back: () => router.back() }),
    [locale, router],
  );
  /** Nghe liên tục (rảnh tay): chỉ chạy LỆNH; muốn hỏi thì mở đầu bằng “Soma …”. */
  const [handsFree, setHandsFree] = useState(false);
  const handsFreeRef = useRef(false);
  const handsFreeRecRef = useRef<MicrophoneSession | null>(null);
  /** Đang đọc câu xác nhận: micro nghe lại chính giọng máy sẽ tự kích lệnh lần nữa. */
  const speakingRef = useRef(false);
  const speechSerialRef = useRef(0);
  const speechReleaseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const speechOutput = useCallback((active: boolean) => {
    speakingRef.current = active;
    if (active) handsFreeRecRef.current?.pause("speech");
    else handsFreeRecRef.current?.resume("speech");
    window.dispatchEvent(new CustomEvent("soma-speech-output", { detail: { active } }));
  }, []);

  const stopBotSpeech = useCallback(() => {
    speechSerialRef.current += 1;
    if (speechReleaseRef.current) clearTimeout(speechReleaseRef.current);
    if (speakingRef.current) window.speechSynthesis?.cancel();
    speechOutput(false);
    setSpeakingIndex(null);
  }, [speechOutput]);

  // Switching microphones discards an unfinished transcript; it must not run a command.
  function stopBotMicrophones() {
    const rec = recognitionRef.current;
    recognitionRef.current = null;
    rec?.stop();
    setListening(false);
    handsFreeRef.current = false;
    setHandsFree(false);
    const continuous = handsFreeRecRef.current;
    handsFreeRecRef.current = null;
    continuous?.stop();
  }

  useEffect(() => {
    const owner = (event: Event) => {
      const other = (event as CustomEvent).detail?.owner;
      if (other !== "vision" && other !== "assistant") return;
      stopBotMicrophones();
      stopBotSpeech();
    };
    window.addEventListener("soma-speech-owner", owner);
    return () => { window.removeEventListener("soma-speech-owner", owner); stopBotMicrophones(); stopBotSpeech(); };
  }, [stopBotSpeech]);
  useEffect(() => {
    let current = true;
    void Promise.resolve().then(() => {
      if (current) { recognitionRef.current?.stop(); stopBotSpeech(); }
    });
    return () => { current = false; };
  }, [pathname, stopBotSpeech]);
  useEffect(() => {
    let current = true;
    void Promise.resolve().then(() => {
      if (current) handsFreeRecRef.current?.stop();
    });
    return () => { current = false; };
  }, [locale]);
  const [toast, setToast] = useState("");
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Bộ nghe giọng nói giữ hàm từ lúc bắt đầu nghe; qua ref thì luôn gọi bản mới nhất.
  const askRef = useRef<(text: string, opts?: { voice?: boolean; alts?: string[] }) => Promise<void>>(async () => {});
  const handsFreeHandlerRef = useRef<(alts: string[]) => Promise<void>>(async () => {});

  /** `texts`: các phương án nghe (phương án tin cậy nhất trước) hoặc một câu gõ. */
  async function runCommand(texts: string[]): Promise<VoiceResult | null> {
    const m = matchCommand(texts, [...pageVoiceActions(), ...globalActions]);
    if (!m) return null;
    try {
      return (await m.action.run(m.arg)) ?? { ok: true, say: t.done };
    } catch {
      return { ok: false, say: t.cmdFail };
    }
  }

  function flash(text: string) {
    setToast(text);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(""), 3600);
  }

  /** Lệnh đã chạy: ghi vào hội thoại (không lưu — lệnh không phải kiến thức), báo nhanh, đọc to nếu nói bằng giọng. */
  function reportCommand(said: string, r: VoiceResult, voice?: boolean) {
    setQuestion("");
    setMessages((prev) => [...prev, { role: "user", text: said } as Message, { role: "bot", text: r.say, engine: "command" } as Message].slice(-12));
    flash(r.say);
    if (voice) void speakPlain(r.say);
  }

  /** Đọc lại trạng thái đăng nhập + hạn mức từ @/lib/chatMemory. */
  function syncQuota() {
    const g = isGuest();
    setGuest(g);
    setQuotaLeft(g ? guestQuotaLeft() : GUEST_LIMIT);
  }

  useEffect(() => {
    let active = true;
    const reload = () => {
      const generation = ++memoryGenerationRef.current;
      void loadMemory().then(turns => {
        if (active && generation === memoryGenerationRef.current) setMessages(turns.slice(-12) as Message[]);
      }).catch(() => {});
    };
    Promise.resolve().then(() => {
      if (!active) return;
      reload();
      syncQuota();
    });
    // Đăng nhập ngay trong tab khác / trang khác thì hàng rào phải mở ra luôn,
    // không bắt người ta tải lại trang mới hỏi tiếp được.
    const onAuth = () => {
      answerRequestRef.current?.abort(); answerRequestRef.current = null;
      stopBotMicrophones(); setBusy(false); setQuestion("");
      syncQuota();
      reload();
    };
    window.addEventListener(AUTH_CHANGED_EVENT, onAuth);
    return () => { active = false; answerRequestRef.current?.abort(); window.removeEventListener(AUTH_CHANGED_EVENT, onAuth); };
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
    stopBotMicrophones();
    stopBotSpeech();
  }, [stopBotSpeech]);

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

  async function ask(text?: string, opts?: { voice?: boolean; alts?: string[] }) {
    const value = (text ?? question).trim();
    if (!value) return;
    // Lệnh chạy TRƯỚC khi xét "đang bận": nó chạy ngay trên máy, không cần chờ
    // trợ lý trả lời xong câu trước. Đã thấy trên trang thật: hỏi "tim có mấy
    // buồng" rồi nói "mở mô hình tim" trong lúc chờ thì lệnh bị nuốt mất.
    const cmd = await runCommand(opts?.alts?.length ? opts.alts : [value]);
    if (cmd) {
      reportCommand(value, cmd, opts?.voice);
      return;
    }
    if (answerRequestRef.current) return;
    // Hỏi lại chatMemory chứ không tin state: hết lượt thì dừng ở đây, không
    // gọi API. Trả về sau khi đã đồng bộ để giao diện hiện hàng rào.
    if (isGuest() && guestQuotaLeft() <= 0) {
      syncQuota();
      return;
    }
    stopBotMicrophones();
    stopBotSpeech();
    const controller = new AbortController();
    answerRequestRef.current = controller; memoryGenerationRef.current++;
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
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("assistant unavailable");
      const data = await response.json();
      if (controller.signal.aborted || answerRequestRef.current !== controller) return;
      const complete = [...next, { role: "bot", text: data.answer ?? t.error, sources: data.sources, engine: data.engine, suggestions: data.suggestions } satisfies Message].slice(-12);
      setMessages(complete);
      saveMemory(complete.map((m) => ({ role: m.role, text: m.text })));
      setAnswered(true);
      if (answerTimerRef.current) clearTimeout(answerTimerRef.current);
      answerTimerRef.current = setTimeout(() => setAnswered(false), 2400);
    } catch {
      if (controller.signal.aborted || answerRequestRef.current !== controller) return;
      const complete = [...next, { role: "bot", text: t.error } satisfies Message].slice(-12);
      setMessages(complete);
      saveMemory(complete.map((m) => ({ role: m.role, text: m.text })));
    } finally { if (answerRequestRef.current === controller) { answerRequestRef.current = null; setBusy(false); } }
  }

  function clear() {
    memoryGenerationRef.current++; answerRequestRef.current?.abort(); answerRequestRef.current = null;
    stopBotMicrophones(); setBusy(false);
    stopBotSpeech();
    setMessages([]);
    clearMemory();
  }

  function toggleListening() {
    if (listening) { recognitionRef.current?.stop(); return; }
    window.dispatchEvent(new CustomEvent("soma-speech-owner", { detail: { owner: "bot" } }));
    stopBotMicrophones();
    stopBotSpeech();
    setVoiceNote("");
    const session = createMicrophone({
      locale,
      onState: state => setListening(state === "starting" || state === "listening"),
      onError: error => setVoiceNote(microphoneError(locale, error)),
      onText: (text, alts, final) => {
        setQuestion(text);
        if (final) void askRef.current(text, { voice: true, alts });
      },
    });
    recognitionRef.current = session; session.start();
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
      const done = () => { clearTimeout(timer); window.speechSynthesis.removeEventListener("voiceschanged", done); resolve(window.speechSynthesis.getVoices()); };
      window.speechSynthesis.addEventListener("voiceschanged", done, { once: true });
      // Có trình duyệt không bao giờ bắn sự kiện này; đừng treo mãi ở đó.
      const timer = setTimeout(done, 1200);
    });
  }

  async function speakMessage(text: string, index: number) {
    if (!("speechSynthesis" in window)) {
      setVoiceNote(t.voiceUnsupported);
      return;
    }
    if (speakingIndex === index) {
      stopBotSpeech();
      return;
    }
    window.dispatchEvent(new CustomEvent("soma-speech-owner", { detail: { owner: "bot" } }));
    stopBotSpeech();
    const serial = speechSerialRef.current;

    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const voices = await voicesReady();
    if (serial !== speechSerialRef.current) return;
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
    const done = () => { if (serial !== speechSerialRef.current) return; setSpeakingIndex(null); speechReleaseRef.current = setTimeout(() => { if (serial === speechSerialRef.current) speechOutput(false); }, 350); };
    utterance.onend = done;
    utterance.onerror = done;
    setSpeakingIndex(index);
    speechOutput(true);
    try { window.speechSynthesis.speak(utterance); } catch { stopBotSpeech(); setVoiceNote(t.voiceUnsupported); }
  }

  /** Đọc một câu ngắn (xác nhận lệnh). Máy thiếu giọng đúng tiếng thì im lặng — đã có dòng báo trên màn hình. */
  async function speakPlain(text: string) {
    if (!("speechSynthesis" in window)) return;
    window.dispatchEvent(new CustomEvent("soma-speech-owner", { detail: { owner: "bot" } }));
    stopBotSpeech();
    const serial = speechSerialRef.current;
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const voice = (await voicesReady()).find((v) => v.lang.toLowerCase().replace("_", "-").startsWith(lang.slice(0, 2)));
    if (serial !== speechSerialRef.current) return;
    if (!voice) { setVoiceNote(t.voiceMissing); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = locale === "vi" ? 1 : 1.05;
    speechOutput(true);
    const done = () => { if (serial === speechSerialRef.current) speechReleaseRef.current = setTimeout(() => { if (serial === speechSerialRef.current) speechOutput(false); }, 350); };
    u.onend = done;
    u.onerror = done;
    try { window.speechSynthesis.speak(u); } catch { stopBotSpeech(); setVoiceNote(t.voiceUnsupported); }
  }

  /** Một câu nghe được ở chế độ rảnh tay. */
  async function handleHandsFree(alts: string[]) {
    const text = alts[0];
    if (!text || speakingRef.current) return;
    const cmd = await runCommand(alts);
    if (cmd) return reportCommand(text, cmd, true);
    // Hỏi trợ lý phải GỌI TÊN: nghe liên tục mà câu nào cũng gửi đi thì mọi câu
    // nói chuyện trong phòng đều thành câu hỏi, tốn lượt và làm rối hội thoại.
    const q = alts.map(wakeQuestion).find(Boolean);
    if (q) {
      setOpen(true);
      return void askRef.current(q, { voice: true });
    }
    flash(t.notUnderstood(text));
  }

  function toggleHandsFree() {
    if (handsFreeRef.current) {
      handsFreeRecRef.current?.stop();
      return;
    }
    window.dispatchEvent(new CustomEvent("soma-speech-owner", { detail: { owner: "bot" } }));
    stopBotMicrophones();
    stopBotSpeech();
    setVoiceNote("");
    const session = createMicrophone({
      locale, continuous: true,
      onState: state => {
        const active = state === "starting" || state === "listening" || state === "paused";
        handsFreeRef.current = active; setHandsFree(active);
      },
      onError: error => setVoiceNote(microphoneError(locale, error)),
      onText: (_text, alts) => { void handsFreeHandlerRef.current(alts); },
    });
    handsFreeRecRef.current = session; session.start();
  }

  useEffect(() => {
    askRef.current = ask;
    handsFreeHandlerRef.current = handleHandsFree;
  });

  useEffect(
    () => () => {
      handsFreeRef.current = false;
      handsFreeRecRef.current?.stop();
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    },
    [],
  );

  function toggleBot() {
    if (open) {
      stopBotMicrophones();
      stopBotSpeech();
    }
    setOpen((value) => !value);
    setReacting(true);
    if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
    reactionTimerRef.current = setTimeout(() => setReacting(false), 650);
  }

  function hideBot() {
    stopBotMicrophones();
    stopBotSpeech();
    setOpen(false);
    setHidden(true);
  }

  function closeBot() {
    stopBotMicrophones();
    stopBotSpeech();
    setOpen(false);
  }

  /* Đã ẩn thì cả con mèo lẫn bảng chat biến mất, chỉ còn một chấm sáng ở đúng
     chỗ cũ để gọi lại — người đang xoay mô hình 3D cần khoảng góc phải đó. */
  if (hidden) {
    return <ContentSurface scope="src/components/chat/FloatingSomaBot.tsx"><button className="soma-bot-minimized" type="button" onClick={() => setHidden(false)} title={t.show} aria-label={t.show}><i /></button></ContentSurface>;
  }

  return <ContentSurface scope="src/components/chat/FloatingSomaBot.tsx"><div className={`soma-bot mood-${catMood}${open ? " is-open" : ""}${busy ? " is-thinking" : ""}${listening ? " is-listening" : ""}${answered ? " is-success" : ""}${reacting ? " is-reacting" : ""}`} style={{ position: "fixed", right: 22, bottom: 18, zIndex: 90 }}>
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
      {(listening || voiceNote || handsFree) && <div className={`soma-bot-voice-note${listening || handsFree ? " is-listening" : ""}`} role="status"><i />{listening ? t.listening : handsFree ? t.handsFreeOn : voiceNote}</div>}
      <button type="button" onClick={toggleHandsFree} aria-pressed={handsFree} disabled={gated && !handsFree} style={{ margin: "0 12px 8px", padding: "6px 10px", borderRadius: 999, border: "1px solid var(--line)", background: handsFree ? "rgba(15,138,124,.14)" : "transparent", color: "var(--ink)", fontSize: 12, cursor: "pointer" }}>
        {handsFree ? `■ ${t.handsFreeOff}` : `◉ ${t.handsFree}`}
      </button>
      <footer><span>{t.disclaimer}</span><Link href="/tro-ly" onClick={closeBot}>{t.full} ↗</Link></footer>
    </section>}

    {/* Kết quả lệnh khi bảng chat đang đóng (rảnh tay): một dòng báo ngắn ngay trên con mèo. */}
    {!open && toast && <div role="status" style={{ position: "absolute", right: 0, bottom: "100%", marginBottom: 10, maxWidth: 300, padding: "8px 12px", borderRadius: 12, border: "1px solid var(--line)", background: "var(--surf)", color: "var(--ink)", fontSize: 13, lineHeight: 1.45, boxShadow: "0 8px 24px rgba(0,0,0,.18)" }}>{handsFree ? "◉ " : ""}{toast}</div>}
    <button ref={launcherRef} className={`soma-bot-launcher${handsFree ? " is-hands-free" : ""}`} type="button" onClick={toggleBot} aria-expanded={open} aria-label={open ? t.close : t.open}>
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
  </div></ContentSurface>;
}
