import type { Loc } from "@/lib/homeContent";

export type MicrophoneState = "off" | "starting" | "listening" | "paused" | "error";
type Result = { isFinal: boolean; length: number; [index: number]: { transcript: string } };
export type Recognition = {
  lang: string; continuous: boolean; interimResults: boolean; maxAlternatives: number;
  start(): void; abort(): void;
  stop?(): void;
  onspeechstart?: (() => void) | null;
  onspeechend?: (() => void) | null;
  onstart: (() => void) | null;
  onresult: ((event: { resultIndex: number; results: ArrayLike<Result> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};
export type MicrophoneSession = ReturnType<typeof createMicrophone>;
type Options = {
  locale: Loc;
  continuous?: boolean;
  /** Group browser result fragments into one conversational turn. */
  utterance?: boolean;
  onState(state: MicrophoneState): void;
  onText(text: string, alternatives: string[], final: boolean): void;
  onError(error: string): void;
};
function browserRecognition(): Recognition | null {
  if (typeof window === "undefined") return null;
  const scope = window as typeof window & {
    SpeechRecognition?: new () => Recognition;
    webkitSpeechRecognition?: new () => Recognition;
  };
  const Constructor = scope.SpeechRecognition ?? scope.webkitSpeechRecognition;
  return Constructor ? new Constructor() : null;
}

/** One owner per session; late callbacks can never submit after stop/error. */
export function createMicrophone(options: Options, factory = browserRecognition) {
  let active = false, recognition: Recognition | null = null;
  let restart: ReturnType<typeof setTimeout> | undefined;
  let watchdog: ReturnType<typeof setTimeout> | undefined;
  let silentEnds = 0;
  let turnTimer: ReturnType<typeof setTimeout> | undefined;
  let endTimer: ReturnType<typeof setTimeout> | undefined;
  let fragments: string[] = [], lastAlternatives: string[] = [], interim = "";
  const pauses = new Set<string>();
  function discardTurn() {
    clearTimeout(turnTimer); clearTimeout(endTimer);
    fragments = []; lastAlternatives = []; interim = "";
  }
  function flushTurn() {
    if (!active || pauses.size || interim || !fragments.length) return;
    const prefix = fragments.slice(0, -1).join(" ");
    const text = fragments.join(" ");
    const alternatives = [...new Set([text, ...lastAlternatives.map(value => [prefix, value].filter(Boolean).join(" "))])];
    discardTurn();
    if (!options.continuous) { active = false; release(); options.onState("off"); }
    options.onText(text, alternatives, true);
  }
  function emit(text: string, alternatives: string[], final: boolean) {
    if (!options.utterance) { options.onText(text, alternatives, final); return; }
    clearTimeout(turnTimer);
    if (final) { if (options.continuous) fragments.push(text); else fragments = [text]; lastAlternatives = alternatives; interim = ""; }
    else { if (!options.continuous) fragments = []; interim = text; }
    const preview = [...fragments, interim].filter(Boolean).join(" ");
    options.onText(preview, [preview], false);
    // New speech/interim cancels the timer; unconfirmed text is never auto-sent.
    if (final) turnTimer = setTimeout(flushTurn, 700);
  }
  function release() {
    clearTimeout(restart); clearTimeout(watchdog);
    clearTimeout(endTimer);
    const previous = recognition; recognition = null;
    if (!previous) return;
    previous.onstart = previous.onend = previous.onresult = previous.onerror = null;
    previous.onspeechstart = previous.onspeechend = null;
    try { previous.abort(); } catch { /* Already released by the browser. */ }
  }
  function stop() {
    active = false; pauses.clear(); discardTurn(); release(); options.onState("off");
  }
  function fail(error: string) {
    active = false; discardTurn(); release(); options.onState("error"); options.onError(error);
  }
  function begin() {
    if (!active || pauses.size) return;
    release();
    let rec: Recognition | null;
    try { rec = factory(); } catch { fail("start-failed"); return; }
    if (!rec) { fail("unsupported"); return; }
    recognition = rec;
    const current = () => active && recognition === rec && !pauses.size;
    rec.lang = options.locale === "vi" ? "vi-VN" : options.locale === "zh" ? "zh-CN" : "en-US";
    rec.continuous = !!options.continuous; rec.interimResults = true; rec.maxAlternatives = 3;
    let delivered = -1;
    rec.onstart = () => { if (current()) { clearTimeout(watchdog); options.onState("listening"); } };
    rec.onspeechstart = () => { if (current()) { clearTimeout(endTimer); clearTimeout(turnTimer); } };
    rec.onspeechend = () => {
      if (!options.utterance || !current() || !rec.stop) return;
      clearTimeout(endTimer);
      // Request a final result instead of waiting for the service's long idle timeout.
      endTimer = setTimeout(() => { if (current()) { try { rec.stop?.(); } catch { /* Already ended. */ } } }, 650);
    };
    rec.onresult = event => {
      if (!current()) return;
      const alternatives = (result: Result) => Array.from({ length: result.length }, (_, i) => result[i]?.transcript?.trim()).filter((text): text is string => !!text);
      if (options.continuous) {
        for (let i = Math.max(event.resultIndex, delivered + 1); i < event.results.length; i++) {
          const result = event.results[i];
          if (!result.isFinal) {
            const choices = [...new Set(alternatives(result))];
            if (choices.length) emit(choices[0], choices, false);
            continue;
          }
          delivered = i; silentEnds = 0;
          const choices = [...new Set(alternatives(result))];
          if (choices.length) emit(choices[0], choices, true);
          if (!current()) return;
        }
      } else {
        const results = Array.from(event.results);
        const text = results.map(result => result[0]?.transcript?.trim() ?? "").filter(Boolean).join(" ");
        const final = results.length > 0 && results.every(result => result.isFinal);
        if (!text) return;
        const choices = results.length === 1 ? [...new Set(alternatives(results[0]))] : [text];
        // Detach before delivering a final result: stopping/starting another mic
        // inside onText must not let an old onend clear the new microphone.
        if (final && !options.utterance) { active = false; release(); options.onState("off"); }
        emit(text, choices, final);
      }
    };
    rec.onerror = event => {
      if (!current()) return;
      if (event.error === "no-speech" && options.continuous) return;
      if (event.error === "aborted") { stop(); return; }
      fail(event.error || "start-failed");
    };
    rec.onend = () => {
      if (!current()) return;
      recognition = null; clearTimeout(watchdog);
      if (options.utterance && fragments.length && !interim) {
        clearTimeout(turnTimer); turnTimer = setTimeout(flushTurn, 350);
      }
      if (!options.continuous) {
        if (options.utterance && fragments.length && !interim) return;
        active = false; discardTurn(); options.onState("off"); return;
      }
      // A service ending repeatedly without audio must not spin at 4 starts/sec.
      silentEnds++; options.onState("starting");
      restart = setTimeout(begin, Math.min(5000, 350 * silentEnds));
    };
    options.onState("starting");
    watchdog = setTimeout(() => { if (current()) fail("start-timeout"); }, 10000);
    try { rec.start(); } catch { fail("start-failed"); }
  }
  return {
    start() { stop(); active = true; silentEnds = 0; begin(); },
    stop,
    pause(reason = "speech") { pauses.add(reason); discardTurn(); if (active) { release(); options.onState("paused"); } },
    resume(reason = "speech") {
      if (!pauses.delete(reason) || !active || pauses.size) return;
      clearTimeout(restart); restart = setTimeout(begin, 350);
    },
  };
}

export function microphoneError(locale: Loc, error: string): string {
  const messages = {
    denied: ["Bạn chưa cấp quyền micro. Cho phép microphone trong quyền của trang rồi thử lại.", "Microphone permission was denied. Allow it in site permissions and retry.", "麦克风权限被拒绝，请在网站权限中允许后重试。"],
    network: ["Dịch vụ nhận giọng nói đang lỗi mạng. Kiểm tra kết nối rồi bật lại micro; bạn vẫn có thể gõ câu hỏi.", "Speech recognition has a network error. Check your connection and retry, or type your question.", "语音识别网络出错，请检查连接后重试，也可输入问题。"],
    device: ["Không tìm thấy micro hoặc micro đang bị ứng dụng khác sử dụng. Kiểm tra thiết bị đầu vào rồi thử lại.", "No microphone is available or it is in use. Check your audio input and retry.", "找不到可用麦克风或设备正在被占用，请检查音频输入。"],
    silent: ["Chưa nghe được lời nói. Bấm micro và nói lại, hoặc tiếp tục gõ câu hỏi.", "No speech was detected. Try again or type your question.", "未检测到语音，请重试或输入问题。"],
    unsupported: ["Trình duyệt này chưa hỗ trợ nhận dạng giọng nói. Hãy dùng Chrome/Edge hoặc gõ câu hỏi.", "Speech recognition is unavailable in this browser. Use Chrome/Edge or type your question.", "此浏览器不支持语音识别，请使用 Chrome/Edge 或输入问题。"],
    failed: ["Chưa khởi động được micro. Kiểm tra quyền và thiết bị rồi bấm thử lại.", "The microphone could not start. Check permissions and the device, then retry.", "麦克风无法启动，请检查权限和设备后重试。"],
  };
  const key = ["not-allowed", "service-not-allowed"].includes(error) ? "denied" : error === "network" ? "network" : error === "audio-capture" ? "device" : error === "no-speech" ? "silent" : error === "unsupported" ? "unsupported" : "failed";
  return messages[key][locale === "vi" ? 0 : locale === "zh" ? 2 : 1];
}

/** Wait for asynchronously installed voices, then choose only the requested language. */
export async function matchingSpeechVoice(locale: Loc): Promise<SpeechSynthesisVoice | null> {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const synth = window.speechSynthesis;
  let voices = synth.getVoices();
  if (!voices.length) voices = await new Promise(resolve => {
    const done = () => { clearTimeout(timer); synth.removeEventListener("voiceschanged", done); resolve(synth.getVoices()); };
    const timer = setTimeout(done, 1200); synth.addEventListener("voiceschanged", done);
  });
  const language = locale === "zh" ? "zh" : locale;
  return voices.find(voice => voice.lang.toLowerCase().replaceAll("_", "-").startsWith(language)) ?? null;
}
