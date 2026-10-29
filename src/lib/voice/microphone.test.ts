import assert from "node:assert/strict";
import { test } from "node:test";
import { createMicrophone, microphoneError, matchingSpeechVoice, type Recognition } from "./microphone.ts";
import { conversationQuestion } from "./match.ts";

class FakeRecognition implements Recognition {
  lang = ""; continuous = false; interimResults = false; maxAlternatives = 0;
  onstart: Recognition["onstart"] = null; onend: Recognition["onend"] = null;
  onerror: Recognition["onerror"] = null; onresult: Recognition["onresult"] = null;
  onspeechstart: Recognition["onspeechstart"] = null; onspeechend: Recognition["onspeechend"] = null;
  stops = 0;
  aborts = 0;
  start() { this.onstart?.(); }
  abort() { this.aborts++; this.onend?.(); }
  stop() { this.stops++; }
  result(text: string, final: boolean) {
    this.onresult?.({ resultIndex: 0, results: [{ isFinal: final, length: 1, 0: { transcript: text } }] });
  }
}
test("an explicitly open conversation accepts natural questions; minimized listening still requires the wake word", () => {
  assert.equal(conversationQuestion(["Tim có mấy buồng?"], true), "Tim có mấy buồng?");
  assert.equal(conversationQuestion(["Tim có mấy buồng?"], false), null);
  assert.equal(conversationQuestion(["Soma tim có mấy buồng?"], false), "tim có mấy buồng?");
});
function setup(continuous = false, locale: "vi" | "en" | "zh" = "vi", utterance = false) {
  const engines: FakeRecognition[] = [], heard: { text: string; final: boolean }[] = [], errors: string[] = [], states: string[] = [];
  const session = createMicrophone({ locale, continuous, utterance, onState: value => states.push(value), onError: error => errors.push(error), onText: (text, _alts, final) => heard.push({ text, final }) }, () => {
    const rec = new FakeRecognition(); engines.push(rec); return rec;
  });
  return { session, engines, heard, errors, states };
}
test("microphone uses the selected locale and actual onstart status", () => {
  for (const [locale, lang] of [["vi", "vi-VN"], ["en", "en-US"], ["zh", "zh-CN"]] as const) {
    const { session, engines, states } = setup(false, locale); session.start();
    assert.equal(engines[0].lang, lang); assert.equal(engines[0].maxAlternatives, 3);
    assert.deepEqual(states, ["off", "starting", "listening"]); session.stop();
  }
});
test("conversational turns combine Vietnamese and English final fragments into one question", t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  for (const [locale, chunks] of [["vi", ["Tim có", "mấy buồng?"]], ["en", ["How many chambers", "does the heart have?"]]] as const) {
    const { session, engines, heard } = setup(true, locale, true); session.start();
    engines[0].result(chunks[0], true); t.mock.timers.tick(300);
    engines[0].onresult?.({ resultIndex: 1, results: chunks.map(text => ({ isFinal: true, length: 1, 0: { transcript: text } })) });
    t.mock.timers.tick(699); assert.equal(heard.filter(item => item.final).length, 0);
    t.mock.timers.tick(1); assert.deepEqual(heard.filter(item => item.final), [{ text: chunks.join(" "), final: true }]); session.stop();
  }
});
test("unconfirmed continuation blocks sending an incomplete conversational question", t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const { session, engines, heard } = setup(true, "vi", true); session.start();
  engines[0].result("Tim có", true);
  engines[0].onresult?.({ resultIndex: 1, results: [{ isFinal: true, length: 1, 0: { transcript: "Tim có" } }, { isFinal: false, length: 1, 0: { transcript: "mấy" } }] });
  t.mock.timers.tick(5000); assert.equal(heard.filter(item => item.final).length, 0);
  session.stop(); t.mock.timers.tick(5000); assert.equal(heard.filter(item => item.final).length, 0);
});
test("speech-end asks the engine to finalize promptly, while resumed speech cancels early cutoff", t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const { session, engines, heard } = setup(true, "vi", true); session.start();
  engines[0].result("Tim có", false); engines[0].onspeechend?.(); t.mock.timers.tick(600);
  engines[0].onspeechstart?.(); t.mock.timers.tick(1000); assert.equal(engines[0].stops, 0);
  engines[0].onspeechend?.(); t.mock.timers.tick(650); assert.equal(engines[0].stops, 1);
  assert.equal(heard.filter(item => item.final).length, 0); session.stop();
});
test("one-shot cumulative results never duplicate previous words, even after natural end", t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const { session, engines, heard } = setup(false, "vi", true); session.start();
  engines[0].result("Tim có mấy buồng?", true); engines[0].result("Tim có mấy buồng?", true); engines[0].onend?.();
  t.mock.timers.tick(700); assert.deepEqual(heard.filter(item => item.final), [{ text: "Tim có mấy buồng?", final: true }]); session.stop();
});
test("only a final result is eligible for automatic submission, and it is delivered once", () => {
  const { session, engines, heard } = setup(); session.start();
  const rec = engines[0], late = rec.onresult;
  rec.result("unfinished", false); rec.result("finished sentence", true); rec.result("duplicate", true);
  late?.({ resultIndex: 0, results: [{ isFinal: true, length: 1, 0: { transcript: "late" } }] });
  assert.deepEqual(heard, [{ text: "unfinished", final: false }, { text: "finished sentence", final: true }]);
  assert.equal(rec.aborts, 1);
});
test("manual cancellation and natural silence do not submit an unfinished transcript", () => {
  for (const manual of [true, false]) {
    const { session, engines, heard, states } = setup(); session.start();
    engines[0].result("partial", false);
    if (manual) session.stop(); else engines[0].onend?.();
    assert.equal(heard.filter(item => item.final).length, 0); assert.equal(states.at(-1), "off"); session.stop();
  }
});
test("incremental results retain previous words instead of replacing the whole question", () => {
  const { session, engines, heard } = setup(); session.start();
  engines[0].onresult?.({ resultIndex: 1, results: [
    { isFinal: true, length: 1, 0: { transcript: "first words" } },
    { isFinal: true, length: 1, 0: { transcript: "last words" } },
  ] });
  assert.deepEqual(heard, [{ text: "first words last words", final: true }]);
});
test("network, permission and device errors stop continuous listening without retry loops", t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  for (const error of ["network", "not-allowed", "service-not-allowed", "audio-capture"]) {
    const { session, engines, errors, states, heard } = setup(true); session.start();
    const end = engines[0].onend; engines[0].onerror?.({ error }); end?.(); t.mock.timers.tick(30000);
    assert.deepEqual(errors, [error]); assert.equal(engines.length, 1); assert.equal(states.at(-1), "error"); assert.equal(heard.length, 0); session.stop();
  }
});
test("stop cancels a scheduled continuous restart", t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const { session, engines } = setup(true); session.start(); engines[0].onend?.(); session.stop(); t.mock.timers.tick(10000);
  assert.equal(engines.length, 1);
});
test("continuous recognition restarts safely with a fresh engine and ignores stale callbacks", t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const { session, engines, heard } = setup(true); session.start();
  const late = engines[0].onresult; engines[0].onend?.(); t.mock.timers.tick(350);
  assert.equal(engines.length, 2);
  late?.({ resultIndex: 0, results: [{ isFinal: true, length: 1, 0: { transcript: "stale command" } }] });
  engines[1].result("new command", true); assert.deepEqual(heard, [{ text: "new command", final: true }]); session.stop();
});
test("speech pauses prevent speaker feedback and require all pause reasons to be released", t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const { session, engines, heard, states } = setup(true); session.start(); const late = engines[0].onresult;
  session.pause("speech"); session.pause("another"); session.resume("speech"); t.mock.timers.tick(1000);
  assert.equal(engines.length, 1); assert.equal(states.at(-1), "paused");
  late?.({ resultIndex: 0, results: [{ isFinal: true, length: 1, 0: { transcript: "speaker feedback" } }] }); assert.equal(heard.length, 0);
  session.resume("another"); t.mock.timers.tick(350); assert.equal(engines.length, 2); session.resume("another"); t.mock.timers.tick(1000); assert.equal(engines.length, 2); session.stop();
});
test("continuous final results are not replayed when the browser repeats its result array", () => {
  const { session, engines, heard } = setup(true); session.start(); engines[0].result("command", true); engines[0].result("command", true);
  assert.deepEqual(heard, [{ text: "command", final: true }]); session.stop();
});
test("constructor/start errors and an unsupported browser are controlled failures", () => {
  for (const factory of [() => null, () => { throw new Error("constructor failed"); }, () => {
    const rec = new FakeRecognition(); rec.start = () => { throw new Error("start failed"); }; return rec;
  }]) {
    const errors: string[] = [];
    const session = createMicrophone({ locale: "vi", onState: () => {}, onText: () => assert.fail("no text expected"), onError: error => errors.push(error) }, factory);
    assert.doesNotThrow(() => session.start()); assert.equal(errors.length, 1); session.stop();
  }
});
test("a service that never starts cannot leave the UI listening indefinitely", t => {
  t.mock.timers.enable({ apis: ["setTimeout"] }); const errors: string[] = [], rec = new FakeRecognition(); rec.start = () => {};
  const session = createMicrophone({ locale: "vi", continuous: true, onState: () => {}, onText: () => {}, onError: error => errors.push(error) }, () => rec);
  session.start(); t.mock.timers.tick(10000); assert.deepEqual(errors, ["start-timeout"]); assert.equal(rec.aborts, 1); session.stop();
});
test("voice errors explain the actual failure in all three interface languages", () => {
  assert(microphoneError("vi", "network").includes("lỗi mạng")); assert(microphoneError("en", "audio-capture").includes("audio input")); assert(microphoneError("zh", "not-allowed").includes("权限"));
  assert(!microphoneError("vi", "network").includes("chưa hỗ trợ"));
});
test("speaker waits for voices and never selects English to read Vietnamese", async t => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const synth = new EventTarget() as EventTarget & { getVoices(): SpeechSynthesisVoice[] };
  let voices: SpeechSynthesisVoice[] = []; synth.getVoices = () => voices;
  Object.defineProperty(globalThis, "window", { configurable: true, value: { speechSynthesis: synth } });
  try {
    const waiting = matchingSpeechVoice("vi"); voices = [{ lang: "en-US" }, { lang: "vi_VN" }] as SpeechSynthesisVoice[]; synth.dispatchEvent(new Event("voiceschanged"));
    assert.equal((await waiting)?.lang, "vi_VN"); voices = [{ lang: "en-US" }] as SpeechSynthesisVoice[]; assert.equal(await matchingSpeechVoice("vi"), null);
  } finally { if (oldWindow) Object.defineProperty(globalThis, "window", oldWindow); else Reflect.deleteProperty(globalThis, "window"); }
});
