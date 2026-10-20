"use client";



import { useContent } from "@/components/content/ContentProvider";
import { ContentSurface } from "@/components/content/ContentProvider";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildQuiz, quizQuestionCount, quizSystems, type QuizItem } from "@/lib/anatomy/quiz";
import { rng, shuffle } from "@/lib/anatomy/random";
import { loadExamBank, examQuestionCount, examRegions, examToQuizItems, type ExamBank } from "@/lib/anatomy/examBank";
import { loadSchoolIndex, loadSchoolBank, schoolQuestionCount, schoolToQuizItems, type SchoolEntry } from "@/lib/anatomy/schoolBank";
import { loadAtlasBank, atlasQuestionCount, atlasToQuizItems, type AtlasBank } from "@/lib/anatomy/atlasBank";
import {
  loadPersonalBank,
  personalQuestionCount,
  personalToQuizItems,
  type PersonalBank,
} from "@/lib/personalDocs";
import { getToken, AUTH_CHANGED_EVENT } from "@/lib/auth";
import { isSignedIn, recordAttempt, type QuizSourceKey, type StudySession } from "@/lib/study";
import { pick, type Loc } from "@/lib/homeContent";
import { SYSTEM_LABEL } from "@/lib/anatomy/knowledge";
import { speciesInfo } from "@/lib/vet/knowledge";
import { VET_SPECIES, type VetSpeciesKey } from "@/lib/vet/types";
import { quizText } from "./quizText";
import PathPanel from "./PathPanel";
import SignInGate from "./SignInGate";
import PdfPanel from "./PdfPanel";
import QuizConfirmDialog from "./QuizConfirmDialog";
import { regionViewerConfig } from "@/lib/scenes/regions";
import type { SystemKey } from "@/store/useAnatomyStore";

/**
 * Bộ làm bài trắc nghiệm. Đề được SINH RA từ kho hotspot đã biên soạn
 * (`src/lib/anatomy/quiz.ts`) chứ không phải danh sách câu hỏi chép tay, nên
 * mỗi câu luôn kèm giải thích thật và một nút mở đúng cấu trúc trên mô hình 3D.
 *
 * Toàn bộ chạy phía client, không gọi API — trang quiz vẫn dùng được khi backend
 * chưa bật. Khi nào cần lưu điểm/lịch sử thì nối vào module `quizzes` sẵn có.
 *
 * MỌI chữ hiện ra đều lấy từ `TXT` theo `locale`. Trước đây phần bảng điều khiển
 * viết `locale === "vi" ? … : …` ngay trong JSX nên người đọc tiếng Trung nhận
 * được bản tiếng Anh — ba thứ tiếng thì phải là bảng ba cột, không phải câu hỏi
 * đúng/sai.
 */


/**
 * Scene nào MỞ ĐƯỢC trong lớp phủ 3D.
 *
 * Trang /xem/<slug> trả về null nếu slug không có trong regionViewerConfig —
 * mở ra chỉ thấy khung trắng. Nên phải kiểm tra trước, đừng hiện cái nút dẫn
 * tới trang rỗng.
 */
function canOpen3d(slug: string): boolean {
  return !!slug && !!regionViewerConfig[slug];
}

/** Nhãn phương án kiểu đề thi — A, B, C, D, E. */
const LETTERS = ["A", "B", "C", "D", "E", "F"];
const QUESTION_COUNTS = [5, 10, 20, 45, 60, 100] as const;
/** 45 giây mỗi câu — bằng nhịp đề thi giải phẫu thường gặp (40 câu / 30 phút). */
const SECONDS_PER_QUESTION = 45;
export type QuizTool = "quick" | "adaptive" | "ai" | "pdf";

export default function QuizRunner({
  locale,
  defaultSource = "model",
  embedded = false,
  tool: controlledTool,
  onToolChange,
  onSessionActiveChange,
}: {
  locale: Loc;
  /** Nguồn đề mở sẵn khi vào trang (trang /quiz để mặc định "model"). */
  defaultSource?: QuizSourceKey;
  embedded?: boolean;
  tool?: QuizTool;
  onToolChange?: (tool: QuizTool) => void;
  onSessionActiveChange?: (active: boolean) => void;
}) {
  const cmsContent = useContent();
  const SYSTEM_LABEL = cmsContent.resolve(cmsSourceSYSTEM_LABEL());

  const t = quizText(locale);
  const systems = useMemo(() => quizSystems(locale), [locale]);
  /**
   * Tổng số cấu trúc ra được đề — hỏi thẳng kho, KHÔNG cộng số câu từng hệ:
   * một cấu trúc thuộc nhiều hệ sẽ bị đếm nhiều lần và con số trên bảng vống lên.
   */
  const structureCount = useMemo(() => quizQuestionCount(locale, "all"), [locale]);

  const [mode, setMode] = useState<"practice" | "exam">("practice");
  /**
   * Khi nào lộ đáp án — tách khỏi `mode` (vốn gộp cả đếm giờ):
   * "instant" = giải thích ngay sau mỗi câu, "end" = chỉ xem đáp án
   * và giải thích khi làm xong tất cả (trang kết quả). Mặc định đi
   * theo mode, người dùng được đổi tay ở bảng thiết lập.
   */
  const [reveal, setReveal] = useState<"instant" | "end">("instant");
  /**
   * Bảng hỏi giữa màn hình khi bấm Bắt đầu / Đề ngẫu nhiên — người học
   * chọn xong mới vào bài. Giữ cấu hình chờ ở đây để nút modal gọi
   * `start` đúng một lần với đủ tham số.
   */
  const [askReveal, setAskReveal] = useState<null | { system?: SystemKey | "all"; count?: number; mode?: "practice" | "exam"; source?: QuizSourceKey }>(null);
  const [left, setLeft] = useState<number | null>(null);   // giây còn lại
  const [timedOut, setTimedOut] = useState(false);
  // `defaultSource` để trang "Trắc nghiệm giải phẫu" trong mục Giải phẫu mở
  // thẳng bộ đề sinh từ thư viện 3D, còn trang /quiz vẫn giữ mặc định cũ.
  const [source, setSource] = useState<QuizSourceKey>(defaultSource);
  const [bank, setBank] = useState<ExamBank | null>(null);
  const [atlas, setAtlas] = useState<AtlasBank | null>(null);
  const [personal, setPersonal] = useState<PersonalBank | null>(null);
  /** Đề trường Y: danh mục trường + id trường đang chọn + ngân hàng đã nạp. */
  const [schoolIndex, setSchoolIndex] = useState<SchoolEntry[] | null>(null);
  const [schoolId, setSchoolId] = useState<string>("all");
  const [schoolData, setSchoolData] = useState<{ id: string; bank: ExamBank } | null>(null);
  /**
   * Danh sách khoá câu của BUỔI ÔN HÔM NAY.
   *
   * Khác rỗng nghĩa là bài đang chạy do lộ trình chỉ định, không phải do bảng
   * thiết lập — lúc đó bỏ qua bộ lọc hệ/vùng và ra đúng những câu đến hạn.
   */
  const [dueOnly, setDueOnly] = useState<string[] | null>(null);
  /** Có đang đăng nhập không — quyết định chặn các chức năng gắn tài khoản. */
  const [signedIn, setSignedIn] = useState(false);
  // scene đang mở trong lớp phủ 3D; null = đang đóng
  const [view3d, setView3d] = useState<{ slug: string; title: string } | null>(null);
  const [region, setRegion] = useState<string>("all");
  const [system, setSystem] = useState<SystemKey | "all">("all");
  const [count, setCount] = useState(10);
  const [internalTool, setInternalTool] = useState<QuizTool>("quick");
  const tool = controlledTool ?? internalTool;
  function setTool(next: QuizTool) {
    setInternalTool(next);
    onToolChange?.(next);
  }
  const [brief, setBrief] = useState("");
  const [composing, setComposing] = useState(false);
  const [composeNote, setComposeNote] = useState("");
  /**
   * ĐỀ TRỘN NHIỀU HỆ do AI dựng: "20 câu thần kinh, 15 câu tiêu hoá".
   *
   * Giữ riêng chứ không nhét vào `system`: `system` là MỘT lựa chọn của người
   * dùng trên bảng chip, còn đây là bản thiết kế nhiều phần. Chạm tay vào bảng
   * chip là bỏ bản thiết kế — hai thứ cùng ra lệnh cho một đề thì người dùng
   * không đoán được mình đang làm bài nào.
   */
  const [blueprint, setBlueprint] = useState<{ system: SystemKey | "all"; count: number }[] | null>(null);
  const [seed, setSeed] = useState<number | null>(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Record<number, string>>({});
  const [done, setDone] = useState(false);
  const [exitPrompt, setExitPrompt] = useState(false);
  useEffect(() => {
    onSessionActiveChange?.(seed !== null && !done);
  }, [seed, done, onSessionActiveChange]);
  const recordedSeed = useRef<number | null>(null);
  /** Mốc bắt đầu bài, để đo thời lượng THẬT — chế độ ôn tập không có đồng hồ. */
  const startedAt = useRef<number>(0);

  useEffect(() => {
    async function sync() {
      // `await` trước setState: cùng cách HomeNav nạp tài khoản, tránh dựng lại
      // hai lần cho một lần mở trang.
      await Promise.resolve();
      setSignedIn(isSignedIn());
    }
    void sync();
    window.addEventListener(AUTH_CHANGED_EVENT, sync);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, sync);
  }, []);

  // Danh mục trường Y rất nhẹ nên nạp sẵn từ đầu: con số "nguồn học" trên đầu
  // trang đúng ngay, và nút "ôn nhanh điểm yếu" định tuyến được scope đề
  // trường mà không cần mở nguồn đó trước.
  useEffect(() => {
    let alive = true;
    loadSchoolIndex()
      .then((idx) => alive && setSchoolIndex((prev) => prev ?? idx.schools))
      .catch(() => alive && setSchoolIndex((prev) => prev ?? []));
    return () => { alive = false; };
  }, []);

  // Nạp ngân hàng đề khi người dùng chọn nguồn đó (lười nạp: hàng trăm KB JSON
  // không nên tải cho người chỉ làm đề sinh từ mô hình).
  useEffect(() => {
    if (source !== "atlas" || atlas) return;
    let alive = true;
    loadAtlasBank().then((b) => alive && setAtlas(b)).catch(() => alive && setAtlas(null));
    return () => { alive = false; };
  }, [source, atlas]);

  useEffect(() => {
    if (source !== "book" || bank) return;
    let alive = true;
    loadExamBank().then((b) => alive && setBank(b)).catch(() => alive && setBank(null));
    return () => { alive = false; };
  }, [source, bank]);

  // Danh mục trường nạp khi chọn nguồn; ngân hàng từng trường nạp khi chọn
  // đúng trường đó — đề trường có thể nặng, không tải cả chùm.
  useEffect(() => {
    if (source !== "school" || schoolIndex) return;
    let alive = true;
    loadSchoolIndex().then((idx) => alive && setSchoolIndex(idx.schools)).catch(() => alive && setSchoolIndex([]));
    return () => { alive = false; };
  }, [source, schoolIndex]);

  /**
   * Trường đang dùng: người dùng chọn chip thì theo chip; buổi ôn theo lịch
   * (dueOnly) trỏ vào câu đề trường mà chưa chọn trường nào thì theo trường
   * của câu đến hạn — tính ra chứ không setState trong effect.
   */
  const dueSchoolId = useMemo(() => {
    if (source !== "school" || !dueOnly?.length) return null;
    const match = dueOnly[0].match(/^school:([^:]+):/);
    return match ? match[1] : null;
  }, [source, dueOnly]);
  const effectiveSchoolId = schoolId !== "all" ? schoolId : (dueSchoolId ?? "all");

  const activeSchool: SchoolEntry | undefined = useMemo(
    () => schoolIndex?.find((s) => s.id === effectiveSchoolId),
    [schoolIndex, effectiveSchoolId],
  );

  useEffect(() => {
    if (source !== "school" || !activeSchool) return;
    const entry = activeSchool;
    let alive = true;
    loadSchoolBank(entry)
      .then((b) => alive && setSchoolData({ id: entry.id, bank: b }))
      .catch(() => alive && setSchoolData(null));
    return () => { alive = false; };
  }, [source, activeSchool]);

  /**
   * Ngân hàng đang hiển thị: chỉ nhận khi đúng trường đang chọn — đang chuyển
   * trường thì coi như chưa nạp (hiện "đang nạp") chứ không hiện đề trường cũ.
   */
  const schoolBank =
    schoolData && activeSchool && schoolData.id === activeSchool.id
      ? schoolData.bank
      : null;

  // Ngân hàng đề cá nhân nằm sau đăng nhập nên không nạp sẵn được như hai kho
  // tĩnh kia; nạp khi chọn nguồn, và nạp lại khi người dùng vừa duyệt thêm câu.
  const reloadPersonal = useCallback(async () => {
    await Promise.resolve();
    if (!isSignedIn()) { setPersonal({ questions: [] }); return; }
    try {
      setPersonal(await loadPersonalBank());
    } catch {
      setPersonal({ questions: [] });
    }
  }, []);

  useEffect(() => {
    if (source !== "personal" || personal) return;
    async function sync() {
      await Promise.resolve();
      await reloadPersonal();
    }
    void sync();
  }, [source, personal, reloadPersonal]);

  /**
   * Vùng THẬT SỰ dùng để ra đề: ngân hàng nạp xong mà vùng đang chọn không có
   * trong đó thì coi như "tất cả".
   *
   * Tính ra chứ không sửa `region` bằng effect — sửa state trong effect là thêm
   * một vòng render và vẫn có một nhịp giao diện hiện vùng không tồn tại.
   */
  const activeRegion = useMemo(() => {
    if (!bank || region === "all") return region;
    return examRegions(bank).some((r) => r.key === region) ? region : "all";
  }, [bank, region]);

  /**
   * Số câu nguồn đang chọn thực sự ra được; `null` khi ngân hàng chưa nạp xong
   * nên chưa biết.
   *
   * CẢ BA NGUỒN đều cắt `slice(0, count)` từ kho của mình, nên chọn 60 câu ở
   * kho 19 câu thì bài lặng lẽ ngắn hơn số đã chọn — không riêng gì đề giáo
   * trình. Vì vậy tính ở một chỗ theo nguồn, đừng vá riêng cho từng nguồn.
   */
  const available = useMemo(() => {
    if (source === "book") return bank ? examQuestionCount(bank, activeRegion) : null;
    if (source === "atlas") return atlas ? atlasQuestionCount(atlas) : null;
    if (source === "personal") return personal ? personalQuestionCount(personal) : null;
    if (source === "school") {
      if (!schoolIndex) return null;
      if (!activeSchool) return 0;
      return schoolQuestionCount(schoolBank);
    }
    return quizQuestionCount(locale, system);
  }, [source, bank, activeRegion, atlas, personal, locale, system, schoolIndex, activeSchool, schoolBank]);

  /**
   * Số câu THỰC SỰ ra đề: hạ xuống mức cao nhất kho hiện tại còn đáp ứng được.
   *
   * Tính ra chứ không lưu thành state riêng, nên đổi vùng, đổi nguồn, đổi hệ,
   * ngân hàng nạp xong hay AI soạn đề đều tự đúng — không phải nhớ gọi hàm hạ
   * số câu ở từng nút. `count` vẫn giữ nguyên lựa chọn của người dùng: quay lại
   * vùng nhiều câu là số cũ trở về.
   */
  const effectiveCount = useMemo(() => {
    if (available === null || count <= available) return count;
    return QUESTION_COUNTS.findLast((value) => value <= available) ?? Math.max(1, available);
  }, [available, count]);

  const items: QuizItem[] = useMemo(() => {
    if (seed === null) return [];

    const build = (only?: string[]) => {
      if (source === "book") {
        return bank ? examToQuizItems(bank, { region: activeRegion, count: effectiveCount, seed, only }) : [];
      }
      if (source === "atlas") {
        return atlas ? atlasToQuizItems(atlas, { count: effectiveCount, seed, locale, only }) : [];
      }
      if (source === "personal") {
        return personal ? personalToQuizItems(personal, { count: effectiveCount, seed, only }) : [];
      }
      if (source === "school") {
        return activeSchool && schoolBank
          ? schoolToQuizItems(activeSchool, schoolBank, { count: effectiveCount, seed, only })
          : [];
      }
      // Đề trộn: ra từng phần theo đúng hệ và số câu của phần đó, mỗi phần một
      // hạt giống riêng (không thì hai phần cùng thứ tự bốc), rồi xáo chung để
      // bài đọc như MỘT đề chứ không phải ba đề nối đuôi.
      if (blueprint && source === "model" && !only) {
        const mixed = blueprint.flatMap((part, i) =>
          buildQuiz({ locale, system: part.system, count: part.count, seed: seed + i * 7919 }),
        );
        return shuffle(mixed, rng(seed));
      }
      return buildQuiz({ locale, system, count: effectiveCount, seed, only });
    };

    // `dueOnly` là buổi ôn theo lịch — ra ĐÚNG những câu đến hạn, không ngẫu nhiên.
    if (dueOnly?.length) {
      const due = build(dueOnly);
      // Hàng đợi có thể trỏ tới câu KHÔNG CÒN TỒN TẠI: ngân hàng đề được cập
      // nhật, hoặc người dùng vừa xoá câu trong tài liệu cá nhân. Lúc đó lùi về
      // đề bình thường — để trống là người học bấm "vào học" xong nhận màn hình
      // trắng, chẳng hiểu vì sao.
      if (due.length) return due;
    }
    return build();
  }, [seed, locale, system, effectiveCount, source, bank, activeRegion, atlas, personal, dueOnly, blueprint, activeSchool, schoolBank]);

  const start = (ov?: { system?: SystemKey | "all"; count?: number; mode?: "practice" | "exam"; reveal?: "instant" | "end"; source?: QuizSourceKey }) => {
    const nextMode = ov?.mode ?? mode;
    const nextReveal = ov?.reveal ?? (ov?.mode ? (ov.mode === "exam" ? "end" : "instant") : reveal);
    // The current bank may contain fewer questions than the remembered choice.
    // Use the same effective count shown in setup for the exam countdown.
    const nextCount = ov?.count ?? effectiveCount;
    if (ov?.system !== undefined) setSystem(ov.system);
    if (ov?.count !== undefined) setCount(ov.count);
    if (ov?.mode !== undefined) setMode(ov.mode);
    if (ov?.reveal !== undefined || ov?.mode !== undefined) setReveal(nextReveal);
    if (ov?.source !== undefined) setSource(ov.source);
    startedAt.current = Date.now();
    setDueOnly(null);
    setSeed(Math.floor(Math.random() * 2 ** 31));
    setIdx(0);
    setPicked({});
    setDone(false);
    setTimedOut(false);
    setView3d(null);
    setLeft(nextMode === "exam" ? nextCount * SECONDS_PER_QUESTION : null);
  };

  /** Đề ngẫu nhiên: bốc hệ bất kỳ + số câu bất kỳ rồi hỏi cách hiện đáp án. */
  const randomStart = () => {
    const keys: (SystemKey | "all")[] = ["all", ...systems.map((s) => s.key)];
    const systemKey = keys[Math.floor(Math.random() * keys.length)] as SystemKey | "all";
    const n = QUESTION_COUNTS[Math.floor(Math.random() * QUESTION_COUNTS.length)];
    setBlueprint(null);
    setAskReveal({ system: systemKey, count: n, mode: "practice", source: "model" });
  };

  /** Bỏ bài đang làm, quay về bảng thiết lập. */
  const confirmExit = () => {
    setExitPrompt(false);
    setSeed(null);
    setDueOnly(null);
    setLeft(null);
    setDone(false);
    setTimedOut(false);
    setView3d(null);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };
  const exitQuiz = () => {
    if (!done && Object.keys(picked).length > 0) setExitPrompt(true);
    else confirmExit();
  };

  const composeQuiz = async () => {
    if (!brief.trim() || composing) return;
    setComposing(true);
    setComposeNote("");
    try {
      const token = getToken();
      const response = await fetch("/api/quiz-compose", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ brief, locale }),
      });
      if (!response.ok) throw new Error("compose failed");
      const config = await response.json();
      const parts = Array.isArray(config.parts) ? config.parts : [];
      // Nhiều hơn một phần mới là đề trộn; một phần thì vẫn là đề thường, để
      // bảng chip hiện đúng hệ đang chọn.
      const mixed = parts.length > 1 && config.source === "model" ? parts : null;
      setBlueprint(mixed);
      setCount(config.count);
      // Đề trộn thì bảng chip hệ cơ quan KHÔNG được sáng lên một hệ: đề gồm
      // hai hệ mà chip chỉ tô đúng một cái là nói sai về bài sắp làm.
      setSystem(mixed ? "all" : config.system);
      setMode(config.mode);
      setReveal(config.mode === "exam" ? "end" : "instant");
      setSource(config.source);
      // Đề giáo trình chia theo VÙNG chứ không theo hệ, nên đổi nguồn phải bỏ
      // vùng cũ — không thì cấu hình AI vừa dựng lại bị vùng lần trước chặn.
      setRegion("all");
      // Nói rõ AI hay bộ luật từ khoá đã dựng cấu hình này: máy chủ lặng lẽ lùi
      // về bộ luật khi chưa cấu hình LLM, người dùng có quyền biết mình vừa
      // được cái nào.
      setComposeNote(t.aiOk(config.engine === "ai" ? t.engineAi : t.engineRule));
      setTool("quick");
    } catch {
      setComposeNote(t.aiFail);
    } finally { setComposing(false); }
  };

  /**
   * Vào thẳng một bài ôn theo phạm vi chỉ định (nút "ôn nhanh điểm yếu").
   *
   * `scope` là thứ máy chủ trả về trong thống kê: mã hệ cơ quan với đề sinh từ
   * mô hình, tên vùng với đề giáo trình. Đoán đúng nguồn theo hình dạng của nó
   * — mã hệ luôn là chữ thường không dấu.
   */
  const reviewScope = (scope: string) => {
    const asSystem = systems.find((entry) => entry.key === scope);
    if (asSystem) {
      setSource("model");
      setSystem(asSystem.key);
    } else if (schoolIndex?.some((s) => s.id === scope)) {
      setSource("school");
      setSchoolId(scope);
    } else {
      setSource("book");
      setRegion(scope);
    }
    setCount(20);
    setMode("practice");
    setReveal("instant");
    setTool("quick");
    setBlueprint(null);
    setDueOnly(null);
    startedAt.current = Date.now();
    setSeed(Math.floor(Math.random() * 2 ** 31));
    setIdx(0); setPicked({}); setDone(false); setTimedOut(false); setLeft(null); setView3d(null);
  };

  /**
   * Vào học buổi hôm nay do lộ trình chỉ định.
   *
   * Hàng đợi trộn lẫn câu của nhiều nguồn, nhưng một bài chỉ chạy được một
   * nguồn — nên chọn nguồn ĐANG CÓ NHIỀU CÂU ĐẾN HẠN NHẤT và ra đề trong đó.
   * Còn lại sẽ tới lượt ở buổi sau; thà học đủ một mảng còn hơn nhảy loạn.
   */
  const startSession = (session: StudySession) => {
    const bySource = new Map<QuizSourceKey, string[]>();
    for (const key of session.dueKeys) {
      const src = key.split(":")[0] as QuizSourceKey;
      bySource.set(src, [...(bySource.get(src) ?? []), key]);
    }
    const [pickedSource, keys] = [...bySource.entries()].sort((a, b) => b[1].length - a[1].length)[0] ?? [];

    if (pickedSource && keys?.length) {
      setSource(pickedSource);
      setDueOnly(keys);
      setCount(Math.min(session.size, keys.length));
    } else {
      // Chưa có câu nào đến hạn: học nội dung MỚI theo hệ ưu tiên của lộ trình.
      setSource("model");
      setDueOnly(null);
      setSystem((session.systemKey as SystemKey | "all") ?? "all");
      setCount(session.size);
    }
    // Buổi học của lộ trình có nội dung riêng — đừng để bản thiết kế trộn của
    // lần trước bẻ lái đề của buổi hôm nay.
    setBlueprint(null);
    setMode("practice");
    setReveal("instant");
    setTool("quick");
    startedAt.current = Date.now();
    setSeed(Math.floor(Math.random() * 2 ** 31));
    setIdx(0); setPicked({}); setDone(false); setTimedOut(false); setLeft(null); setView3d(null);
  };

  /**
   * Đổi mã phạm vi thành nhãn đọc được.
   *
   * Máy chủ lưu phạm vi ở dạng thô ("muscular", "CHI TRÊN", "all") vì nó không
   * biết ngôn ngữ đang xem; dịch ở đây, nơi đã có bảng chữ theo locale.
   */
  const scopeLabel = (scope: string) => {
    if (scope === "all") return t.all;
    const offered = systems.find((entry) => entry.key === scope);
    if (offered) return offered.label;
    // Dàn bài lộ trình có thể nhắc tới hệ KHÔNG nằm trong danh sách ra đề (khớp,
    // bạch huyết) — tra tiếp bảng tên chung, không thì bảng kế hoạch hiện mã
    // thô "joints" giữa những dòng tiếng Việt.
    const known = SYSTEM_LABEL[scope as SystemKey];
    if (known) return pick(known, locale);
    // Phạm vi đề trường là id trường ("y-ha-noi") — hiện tên trường chứ không
    // hiện mã thô trong lịch sử và dàn bài lộ trình.
    const school = schoolIndex?.find((s) => s.id === scope);
    if (school) return school.name;
    // Lượt làm bài bên thú y ghi `scope` là MÃ LOÀI ("cattle", "chicken"), không
    // phải mã hệ cơ quan — tra hai bảng trên đều trượt, và bảng lịch sử hiện ra
    // "cattle" trần giữa những dòng tiếng Việt. Tra tiếp bảng loài.
    if (VET_SPECIES.includes(scope as VetSpeciesKey)) {
      return pick(speciesInfo(scope as VetSpeciesKey).name, locale);
    }
    return scope;
  };

  // Đồng hồ chỉ chạy ở chế độ thi và khi chưa nộp bài.
  useEffect(() => {
    if (left === null || done) return;
    const id = setTimeout(() => {
      if (left <= 1) {
        setLeft(0);
        setTimedOut(true);
        setDone(true);
        return;
      }
      setLeft((value) => (value === null ? null : value - 1));
    }, 1000);
    return () => clearTimeout(id);
  }, [left, done]);

  const mmss = (sec: number) =>
    `${Math.floor(sec / 60)}:${String(Math.max(0, sec % 60)).padStart(2, "0")}`;

  /**
   * Bấm "Bắt đầu làm bài" là nhảy tới đúng chỗ đề — trước đây trang giữ
   * nguyên vị trí cuộn nên đề hiện tít dưới cuối, người dùng tưởng chưa
   * có gì xảy ra.
   */
  useEffect(() => {
    if (seed === null) return;
    const id = requestAnimationFrame(() => {
      document.querySelector(".quiz-shell")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(id);
  }, [seed]);

  const score = items.reduce(
    (n, it, i) => n + (it.options.find((o) => o.id === picked[i])?.correct ? 1 : 0),
    0,
  );

  /**
   * Nộp bài xong thì ghi lượt VÀ kết quả từng câu.
   *
   * Gửi kèm `items` để máy chủ cập nhật lịch ôn: câu trả lời đúng giãn ra, câu
   * sai kéo về hôm sau. Không gửi thì lộ trình mãi mãi không biết người học
   * đang mạnh yếu chỗ nào.
   *
   * `recordedSeed` chặn ghi trùng — effect này chạy lại mỗi khi `score` đổi.
   */
  useEffect(() => {
    if (!done || seed === null || recordedSeed.current === seed || !items.length) return;
    recordedSeed.current = seed;
    void recordAttempt({
      source,
      scope: source === "model" ? system : source === "book" ? activeRegion : source === "school" ? effectiveSchoolId : "all",
      mode,
      score,
      total: items.length,
      answers: items.map((it, i) => ({ questionId: it.id, answerId: picked[i] })),
      // Đo từ lúc bấm bắt đầu: chế độ ôn tập không có đồng hồ đếm ngược nên
      // lấy hiệu đồng hồ thi là ra 0 giây cho mọi buổi ôn.
      seconds: startedAt.current ? Math.round((Date.now() - startedAt.current) / 1000) : 0,
    });
    // `picked`/`left` cố ý không nằm trong danh sách phụ thuộc: chúng đã đứng
    // yên khi `done` bật lên, thêm vào chỉ khiến effect chạy lại vô ích.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, seed, items, score, source, system, activeRegion, effectiveSchoolId, mode]);

  // Lớp phủ 3D: Esc để đóng và khoá cuộn nền, đúng thói quen của một hộp thoại.
  useEffect(() => {
    if (!view3d) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setView3d(null); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [view3d]);

  const inQuestion = seed !== null && !done && items.length > 0;

  /**
   * Phím tắt lúc làm bài: A–F chọn phương án, ← → chuyển câu.
   *
   * Bỏ qua khi đang mở lớp phủ 3D hoặc con trỏ đang ở ô nhập liệu — không thì
   * gõ chữ "a" vào ô mô tả lại thành chọn đáp án A.
   */
  const answer = useCallback((optionId: string) => {
    setPicked((prev) => (prev[idx] !== undefined && reveal === "instant" ? prev : { ...prev, [idx]: optionId }));
  }, [idx, reveal]);

  useEffect(() => {
    if (!inQuestion || view3d || exitPrompt) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      const item = items[idx];
      if (!item) return;

      const letter = LETTERS.indexOf(e.key.toUpperCase());
      const digit = /^[1-9]$/.test(e.key) ? Number(e.key) - 1 : -1;
      const at = letter >= 0 ? letter : digit;
      if (at >= 0 && at < item.options.length) {
        e.preventDefault();
        answer(item.options[at].id);
        return;
      }
      if (e.key === "ArrowRight" && idx + 1 < items.length) { e.preventDefault(); setIdx(idx + 1); }
      if (e.key === "ArrowLeft" && idx > 0) { e.preventDefault(); setIdx(idx - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inQuestion, view3d, exitPrompt, items, idx, answer]);

  /** Lớp phủ 3D dùng chung cho cả lúc làm bài lẫn lúc xem lại kết quả. */
  const overlay3d = view3d && (
    <div className="quiz-3d" role="dialog" aria-modal="true" aria-label={view3d.title}>
      <div className="quiz-3d-bar">
        <span>{view3d.title}</span>
        <em>{t.keepPlace}</em>
        <button type="button" autoFocus onClick={() => setView3d(null)}>{t.close3d}</button>
      </div>
      {/* Nhúng bằng iframe CHỦ Ý: trang xem 3D là một tài liệu riêng nên
          component câu hỏi không bị gỡ khỏi cây — đóng lớp phủ lại là vẫn
          nguyên câu hỏi, nguyên đáp án đã chọn, nguyên đồng hồ đang chạy. */}
      <iframe src={`/xem/${view3d.slug}`} title={view3d.title} />
    </div>
  );

  if (seed === null) {
    return <ContentSurface scope="src/components/quiz/QuizRunner.tsx">{(
      <main className="quiz-shell quiz-dashboard">
        {embedded && <header className="quiz-tool-heading">
          <h1>{tool === "pdf" ? t.toolPdf : tool === "adaptive" ? t.toolPath : tool === "ai" ? t.toolAi : t.toolQuick}</h1>
          <p>{tool === "pdf" ? t.toolPdfSub : tool === "adaptive" ? t.toolPathSub : tool === "ai" ? t.toolAiSub : t.toolQuickSub}</p>
        </header>}
        {!embedded && <header className="quiz-dashboard-head">
          <div>
            <span className="quiz-eyebrow">{t.eyebrow}</span>
            <h1>{t.title}</h1>
            <p className="quiz-lead">{t.lead}</p>
          </div>
          <div className="quiz-overview" aria-label={t.title}>
            <span><b>{systems.length}</b>{t.statSystems}</span>
            <span><b>{structureCount}</b>{t.statStructures}</span>
            <span><b>{3 + (schoolIndex && schoolIndex.length > 0 ? 1 : 0)}</b>{t.statSources}</span>
          </div>
        </header>}

        {!embedded && <nav className="quiz-workflows" aria-label={t.configTitle}>
          <button type="button" className={tool === "quick" ? "on" : ""} aria-pressed={tool === "quick"} onClick={() => setTool("quick")}><b>{t.toolQuick}</b><span>{t.toolQuickSub}</span></button>
          <button type="button" className={tool === "adaptive" ? "on" : ""} aria-pressed={tool === "adaptive"} onClick={() => setTool("adaptive")}><b>{t.toolPath}</b><span>{t.toolPathSub}</span></button>
          <button type="button" className={tool === "ai" ? "on" : ""} aria-pressed={tool === "ai"} onClick={() => setTool("ai")}><b>{t.toolAi}</b><span>{t.toolAiSub}</span></button>
          <button type="button" className={tool === "pdf" ? "on" : ""} aria-pressed={tool === "pdf"} onClick={() => setTool("pdf")}><b>{t.toolPdf}</b><span>{t.toolPdfSub}</span></button>
        </nav>}

        {tool === "ai" && !signedIn && <SignInGate t={t} />}
        {tool === "ai" && signedIn && <section className="quiz-ai-composer">
          <div><b>{t.aiQ}</b><p>{t.aiNote}</p></div>
          <textarea value={brief} aria-label={t.aiQ} onChange={(event) => setBrief(event.target.value)} placeholder={t.aiPlaceholder} />
          <button type="button" disabled={!brief.trim() || composing} onClick={() => void composeQuiz()}>{composing ? t.aiBuilding : t.aiBuild}</button>
          {composeNote && <span role="status">{composeNote}</span>}
        </section>}

        {tool === "adaptive" && (
          <PathPanel
            t={t}
            locale={locale}
            systems={systems}
            scopeLabel={scopeLabel}
            onReviewWeakest={reviewScope}
            onStartSession={startSession}
          />
        )}

        {tool === "pdf" && <PdfPanel t={t} onBankChanged={() => void reloadPersonal()} />}

        {(!embedded || tool === "quick") && <div className="quiz-dashboard-grid">
        <section className="quiz-setup quiz-config-card">
          <div className="quiz-card-heading">
            <span>01</span>
            <div><b>{t.configTitle}</b><p>{t.configSub}</p></div>
          </div>
          {/* Bản thiết kế đề trộn đứng NGAY TRÊN bảng chip số câu: chip lúc này
              không còn nói hết đề gồm những gì, phải thấy ngay vì sao. */}
          {blueprint && (
            <div className="quiz-blueprint">
              <b>{t.blueprintTitle}</b>
              <ul>
                {blueprint.map((part) => (
                  <li key={part.system}>{t.blueprintPart(scopeLabel(part.system), part.count)}</li>
                ))}
              </ul>
              <button type="button" onClick={() => setBlueprint(null)}>{t.blueprintClear}</button>
            </div>
          )}
          <div className="quiz-field">
            <label>{t.numQ}</label>
            <div className="quiz-chips">
              {QUESTION_COUNTS.map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`quiz-chip${effectiveCount === n ? " on" : ""}`}
                  aria-pressed={effectiveCount === n}
                  onClick={() => { setCount(n); setBlueprint(null); }}
                  disabled={available !== null && n > available}
                  title={available !== null && n > available ? t.onlyAvailable(available) : undefined}
                >
                  {n}
                </button>
              ))}
              {/* Full hệ: có người muốn làm trọn 666 câu hệ xương. */}
              {available !== null && available > 0 && (
                <button
                  type="button"
                  className={`quiz-chip${effectiveCount === available ? " on" : ""}`}
                  aria-pressed={effectiveCount === available}
                  onClick={() => { setCount(available); setBlueprint(null); }}
                >
                  {t.fullAll} <i>{available}</i>
                </button>
              )}
            </div>
          </div>

          <div className="quiz-field">
            <label>{t.mode}</label>
            <div>
              <div className="quiz-chips">
                <button type="button" className={`quiz-chip${mode === "practice" ? " on" : ""}`}
                  aria-pressed={mode === "practice"}
                  onClick={() => { setMode("practice"); setReveal("instant"); }}>{t.modePractice}</button>
                <button type="button" className={`quiz-chip${mode === "exam" ? " on" : ""}`}
                  aria-pressed={mode === "exam"}
                  onClick={() => { setMode("exam"); setReveal("end"); }}>
                  {t.modeExam} <i>{examMinutes(effectiveCount)} {t.minutes}</i>
                </button>
              </div>
              <p className="quiz-srcnote">
                {mode === "exam" ? t.modeHintExam : t.modeHintPractice}
              </p>
            </div>
          </div>

          <div className="quiz-field">
            <label>{t.src}</label>
            <div className="quiz-chips">
              <button type="button" className={`quiz-chip${source === "model" ? " on" : ""}`}
                aria-pressed={source === "model"}
                onClick={() => setSource("model")}>{t.srcModel}</button>
              <button type="button" className={`quiz-chip${source === "book" ? " on" : ""}`}
                aria-pressed={source === "book"}
                onClick={() => setSource("book")}>{t.srcBook}</button>
              <button type="button" className={`quiz-chip${source === "atlas" ? " on" : ""}`}
                aria-pressed={source === "atlas"}
                onClick={() => setSource("atlas")}>
                {t.srcAtlas}{atlas ? <i>{atlas.shots.length}</i> : null}
              </button>
              <button type="button" className={`quiz-chip${source === "personal" ? " on" : ""}`}
                aria-pressed={source === "personal"}
                onClick={() => setSource("personal")}>
                {t.srcPersonal}{personal ? <i>{personal.questions.length}</i> : null}
              </button>
              <button type="button" className={`quiz-chip${source === "school" ? " on" : ""}`}
                aria-pressed={source === "school"}
                onClick={() => setSource("school")}>
                {t.srcSchool}{schoolIndex ? <i>{schoolIndex.length}</i> : null}
              </button>
            </div>
          </div>

          {source === "personal" ? (
            <div className="quiz-field">
              <label>{t.srcPersonal}</label>
              <div>
                {!personal ? (
                  <p className="quiz-lead">{t.loading}</p>
                ) : personal.questions.length ? (
                  <p className="quiz-srcnote">
                    {t.pdfApprovedCount(personal.questions.length)} — {t.pdfB2}
                  </p>
                ) : (
                  <p className="quiz-srcnote">{t.srcPersonalEmpty}</p>
                )}
              </div>
            </div>
          ) : source === "atlas" ? (
            <div className="quiz-field">
              <label>{t.srcAtlas}</label>
              <div>
                {!atlas ? (
                  <p className="quiz-lead">{t.loading}</p>
                ) : (
                  <p className="quiz-srcnote">
                    {t.atlasNote} — {atlas.source.title}
                  </p>
                )}
              </div>
            </div>
          ) : source === "school" ? (
            <div className="quiz-field">
              <label>{t.schoolPick}</label>
              {!schoolIndex ? (
                <p className="quiz-lead">{t.loading}</p>
              ) : !schoolIndex.length ? (
                <p className="quiz-srcnote">{t.schoolEmpty}</p>
              ) : (
                <div>
                  <div className="quiz-chips">
                    {schoolIndex.map((s) => (
                      <button key={s.id} type="button"
                        className={`quiz-chip${effectiveSchoolId === s.id ? " on" : ""}`}
                        aria-pressed={effectiveSchoolId === s.id}
                        onClick={() => setSchoolId(s.id)}>
                        {s.name}{schoolBank && effectiveSchoolId === s.id ? <i>{schoolBank.questions.length}</i> : null}
                      </button>
                    ))}
                  </div>
                  <p className="quiz-srcnote">
                    {activeSchool && schoolBank
                      ? `${activeSchool.name} — ${schoolBank.source.title}`
                      : t.schoolPick}
                  </p>
                </div>
              )}
            </div>
          ) : source === "book" ? (
            <div className="quiz-field">
              <label>{t.region}</label>
              {!bank ? (
                <p className="quiz-lead">{t.loading}</p>
              ) : (
                <div>
                  <div className="quiz-chips">
                    <button type="button" className={`quiz-chip${activeRegion === "all" ? " on" : ""}`}
                      aria-pressed={activeRegion === "all"}
                      onClick={() => setRegion("all")}>{t.all}</button>
                    {examRegions(bank).map((r) => (
                      <button key={r.key} type="button"
                        className={`quiz-chip${activeRegion === r.key ? " on" : ""}`}
                        aria-pressed={activeRegion === r.key}
                        onClick={() => setRegion(r.key)}>
                        {r.key} <i>{r.count}</i>
                      </button>
                    ))}
                  </div>
                  <p className="quiz-srcnote">{bank.source.title} — {bank.source.section}</p>
                </div>
              )}
            </div>
          ) : (
          <div className="quiz-field">
            <label>{t.systemLabel}</label>
            <div className="quiz-chips">
              <button
                type="button"
                className={`quiz-chip${system === "all" ? " on" : ""}`}
                aria-pressed={system === "all"}
                onClick={() => { setSystem("all"); setBlueprint(null); }}
              >
                {t.all}
              </button>
              {systems.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  className={`quiz-chip${system === s.key ? " on" : ""}`}
                  aria-pressed={system === s.key}
                  onClick={() => { setSystem(s.key); setBlueprint(null); }}
                >
                  {s.label} <i>{s.count}</i>
                </button>
              ))}
            </div>
          </div>
          )}

          <button type="button" className="quiz-start" onClick={() => setAskReveal({})}
            disabled={
              (source === "book" && !bank) ||
              (source === "atlas" && !atlas) ||
              (source === "personal" && !personal) ||
              (source === "school" && (!activeSchool || !schoolBank)) ||
              available === 0
            }>
            {t.start}
          </button>
          <div className="quiz-rand-row">
            <button type="button" className="quiz-ghost" onClick={randomStart}
              disabled={available === 0}>
              {t.randomQuiz} — {t.randomQuizSub}
            </button>
          </div>
          {/* Bảng hỏi giữa màn hình: bấm Bắt đầu mới hỏi hiện đáp án khi nào. */}
          {askReveal !== null && (
            <div className="quiz-reveal-back" role="dialog" aria-modal="true" aria-label={t.revealAskTitle} onClick={() => setAskReveal(null)}>
              <div className="quiz-reveal-modal" onClick={(e) => e.stopPropagation()}>
                <h3>{t.revealAskTitle}</h3>
                <p>{t.revealAskLead}</p>
                <div className="opt">
                  <button type="button" onClick={() => { const cfg = askReveal; setAskReveal(null); start({ ...cfg, reveal: "instant" }); }}>
                    <b>{t.revealInstant}</b><span>{t.revealInstantSub}</span>
                  </button>
                  <button type="button" onClick={() => { const cfg = askReveal; setAskReveal(null); start({ ...cfg, reveal: "end" }); }}>
                    <b>{t.revealEnd}</b><span>{t.revealEndSub}</span>
                  </button>
                </div>
                <button type="button" className="quiz-reveal-cancel" onClick={() => setAskReveal(null)}>{t.close3d}</button>
              </div>
            </div>
          )}
        </section>
        <aside className="quiz-session-card">
          <span className="quiz-session-kicker">{t.sessionKicker}</span>
          <h2>{mode === "exam" ? t.modeExam : t.modePractice}</h2>
          <dl>
            <div><dt>{t.numQ}</dt><dd>{effectiveCount}</dd></div>
            <div><dt>{t.src}</dt><dd>{source === "model" ? t.srcModel : source === "book" ? t.srcBook : source === "atlas" ? t.srcAtlas : source === "school" ? (activeSchool ? `${t.srcSchool} · ${activeSchool.name}` : t.srcSchool) : t.srcPersonal}</dd></div>
            <div><dt>{t.duration}</dt><dd>{mode === "exam" ? `${examMinutes(effectiveCount)} ${t.minutes}` : t.untimed}</dd></div>
          </dl>
          <div className="quiz-session-note"><i />{reveal === "end" ? t.revealEnd : t.modeHintPractice}</div>
        </aside>
        </div>}
      </main>
    )}</ContentSurface>;
  }

  if (!items.length) {
    return <ContentSurface scope="src/components/quiz/QuizRunner.tsx">{(
      <main className="quiz-shell">
        <h1>{t.title}</h1>
        <p className="quiz-lead">{t.empty}</p>
        <button type="button" className="quiz-start" onClick={() => setSeed(null)}>
          {t.restart}
        </button>
      </main>
    )}</ContentSurface>;
  }

  if (done) {
    const pct = Math.round((score / items.length) * 100);
    return <ContentSurface scope="src/components/quiz/QuizRunner.tsx">{(
      <main className="quiz-shell">
        <span className="quiz-eyebrow">{t.scoreTitle}</span>
        {timedOut && <p className="quiz-timeup" role="status">{t.timeUp}</p>}
        <div className="quiz-score">
          <div className="quiz-ring" style={{ "--p": pct } as React.CSSProperties}>
            <span>{pct}%</span>
          </div>
          <div className="quiz-score-txt">
            <b>{t.scoreBody(score, items.length)}</b>
            <p>{t.review}</p>
          </div>
        </div>
        <div className="quiz-review">
          {items.map((it, i) => {
            const chosen = it.options.find((o) => o.id === picked[i]);
            const ok = !!chosen?.correct;
            const right = it.options.find((o) => o.correct);
            return (
              <article key={it.id} className={`quiz-rev${ok ? " ok" : " no"}`}>
                <b>{i + 1}. {it.prompt.split("\n")[0]}</b>
                <p className="quiz-rev-q">{it.prompt.split("\n").slice(1).join(" ").trim()}</p>
                {/* Câu hỏi ẢNH: xem lại phải thấy bản CÒN NHÃN, không thì đọc
                    lời giải mà không biết hình đã hỏi chỗ nào trên bản vẽ. */}
                {(it.imageAnswer ?? it.image) && (
                  <figure className="quiz-fig quiz-rev-fig">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.imageAnswer ?? it.image} alt={`${t.atlasFull} — ${it.sceneTitle}`} loading="lazy" />
                  </figure>
                )}
                <p className="quiz-rev-a">
                  <span>{ok ? t.correct : t.wrong}</span>
                  {" · "}
                  {right?.text}
                </p>
                <p className="quiz-exp">{it.explanation}</p>
                {canOpen3d(it.sceneSlug) && (
                  <button type="button" className="quiz-link"
                    onClick={() => setView3d({ slug: it.sceneSlug, title: it.sceneTitle })}>
                    {t.open3d} →
                  </button>
                )}
              </article>
            );
          })}
        </div>
        <div className="quiz-actions">
          <button type="button" className="quiz-start" onClick={() => start()}>{t.restart}</button>
          <button type="button" className="quiz-ghost" onClick={exitQuiz}>{t.exit}</button>
        </div>
        {overlay3d}
      </main>
    )}</ContentSurface>;
  }

  const item = items[idx];
  const chosen = picked[idx];
  // reveal "instant": chọn xong lộ đáp án ngay; reveal "end": chỉ đánh dấu
  // ô đã chọn, đáp án + giải thích xem ở trang kết quả sau khi làm xong.
  const answered = chosen !== undefined && reveal === "instant";
  const chosenOpt = item.options.find((o) => o.id === chosen);
  const desc = item.prompt.split("\n").slice(1).join(" ").trim();
  // Ôn tập hiện-ngay tính theo số câu ĐÃ trả lời, còn lại tính theo vị trí —
  // câu đã chọn vẫn quay lại sửa được, thanh tiến độ phải nói đúng điều đó.
  const progress = reveal === "end"
    ? (idx + 1) / items.length
    : (idx + (answered ? 1 : 0)) / items.length;

  return <ContentSurface scope="src/components/quiz/QuizRunner.tsx">{(
    <main className="quiz-shell quiz-doing">
      <div className="quiz-head">
        <span className="quiz-count">
          <b>{idx + 1}</b> {t.of} {items.length}
        </span>
        <span className="quiz-tag">
          {left !== null && (
            <b className={`quiz-clock${left <= 60 ? " warn" : ""}`} role="timer" aria-live="off">
              {mmss(left)}
            </b>
          )}
          {item.sceneTitle}
          <button type="button" className="quiz-exit" onClick={exitQuiz}>{t.exit}</button>
        </span>
      </div>
      <div className="quiz-bar" role="progressbar" aria-valuemin={1} aria-valuemax={items.length} aria-valuenow={idx + 1}>
        <i style={{ width: `${progress * 100}%` }} />
      </div>

      <h2 className="quiz-prompt">{item.prompt.split("\n")[0]}</h2>
      {desc && <p className="quiz-desc">{desc}</p>}

      {item.image && (
        <figure className="quiz-fig">
          {/* Trả lời xong thì đổi sang bản GỐC còn nguyên nhãn để đối chiếu. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={answered && item.imageAnswer ? item.imageAnswer : item.image}
            alt={answered ? `${t.atlasFull} — ${item.sceneTitle}` : t.atlasNote}
            loading="lazy"
          />
        </figure>
      )}

      <div className="quiz-options" role="radiogroup" aria-label={item.prompt.split("\n")[0]}>
        {item.options.map((o, i) => {
          const state = answered
            ? o.correct ? " ok" : o.id === chosen ? " no" : " dim"
            : o.id === chosen ? " picked" : "";
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={o.id === chosen}
              className={`quiz-opt${state}`}
              disabled={answered}
              onClick={() => answer(o.id)}
            >
              <kbd>{LETTERS[i]}</kbd>
              <span>{o.text}</span>
            </button>
          );
        })}
      </div>
      <p className="quiz-keyhint">{t.keyHint}</p>

      {answered && (
        <div className={`quiz-feedback${chosenOpt?.correct ? " ok" : " no"}`} role="status" aria-live="polite">
          <b>{chosenOpt?.correct ? t.correct : t.wrong}</b>
          {!chosenOpt?.correct && (
            <p className="quiz-rev-a">
              {t.correct}: {item.options.find((o) => o.correct)?.text}
            </p>
          )}
          <p>{item.explanation}</p>
          {canOpen3d(item.sceneSlug) && (
            <button type="button" className="quiz-link"
              onClick={() => setView3d({ slug: item.sceneSlug, title: item.sceneTitle })}>
              {t.open3d} — {item.sceneTitle} →
            </button>
          )}
        </div>
      )}

      {overlay3d}
      {exitPrompt && <QuizConfirmDialog title={t.exit} description={t.exitConfirm} cancelLabel={t.close3d} confirmLabel={t.exit} onCancel={() => setExitPrompt(false)} onConfirm={confirmExit} />}

      {/* Luôn dựng hàng thao tác: ở chế độ hiện-ngay, câu CHƯA trả lời trước đây
          không có hàng này nên quay lại câu trước là không còn nút nào. */}
      {(answered || reveal === "end" || idx > 0) && (
        <div className="quiz-actions">
          {idx > 0 && (
            <button type="button" className="quiz-ghost" onClick={() => setIdx(idx - 1)}>
              ← {t.prev}
            </button>
          )}
          {!answered && reveal === "instant" ? null : idx + 1 < items.length ? (
            <button type="button" className="quiz-start" onClick={() => setIdx(idx + 1)}>
              {t.next}
            </button>
          ) : (
            <button type="button" className="quiz-start" onClick={() => setDone(true)}>
              {mode === "exam" ? t.submit : t.finish}
            </button>
          )}
          {reveal === "end" && (
            <span className="quiz-left">
              {items.length - Object.keys(picked).length} {t.unanswered}
            </span>
          )}
        </div>
      )}
    </main>
  )}</ContentSurface>;
}

/** Thời lượng bài thi, làm tròn lên ít nhất 1 phút. */
function examMinutes(questions: number): number {
  return Math.max(1, Math.round((questions * SECONDS_PER_QUESTION) / 60));
}

function cmsSourceSYSTEM_LABEL() { return SYSTEM_LABEL; }
