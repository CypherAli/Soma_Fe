"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { Loc } from "@/lib/homeContent";
import {
  fetchPathologies,
  pathologyContent,
  pathologyName,
  structureName,
  type Pathology,
} from "@/lib/pathologies";
import { Link } from "@/i18n/navigation";
import IconSprite, { Icon } from "@/components/home/IconSprite";
import { pathologyFigures } from "@/lib/pathologyFigures.generated";
import { getScene } from "@/lib/catalog";
import PathologyAssistant from "./PathologyAssistant";

const copy = {
  vi: {
    eyebrow: "Chỉ mục lâm sàng", title: "Tra cứu bệnh lý",
    lead: "Tra theo tên bệnh, mã ICD-10 hoặc hệ cơ quan, rồi đối chiếu thẳng với cấu trúc giải phẫu 3D.",
    search: "Tên bệnh, mã ICD-10 hoặc hệ cơ quan", sources: "Tra cứu nguồn",
    allSystems: "Tất cả", saved: "Đã lưu",
    records: "bệnh", showing: "đang hiện", empty: "Không có bệnh lý nào khớp bộ lọc.",
    loading: "Đang tải dữ liệu bệnh lý…",
    severity: { info: "Theo dõi", warning: "Cảnh báo", critical: "Cấp cứu" },
    icd: "ICD-10", page: "Trang", system: "Hệ lâm sàng", model: "Mô hình 3D",
    hasModel: "Có", noModel: "Chưa có",
    close: "Đóng", view3d: "Mở cấu trúc 3D", source: "Nguồn",
    overview: "Tổng quan", clinical: "Lâm sàng & cận lâm sàng", imaging: "Chẩn đoán hình ảnh",
    progression: "Tiến triển & biến chứng", treatment: "Điều trị tham khảo",
    incomplete: "Chưa có phần bệnh học chi tiết. Hồ sơ hiện dẫn thẳng tới đúng trang trong giáo trình để bạn đọc nguyên bản.",
    save: "Lưu", unsave: "Bỏ lưu", related: "Cùng chuyên khoa",
    unclassified: "Chưa phân loại",
    catTitle: "Danh mục bệnh", filters: "Bộ lọc", askSymptom: "Tra theo triệu chứng",
    bookFigs: "Hình trong giáo trình", pageGuess: "trang suy ra",
    noTranslation: "Phần bệnh học chưa có bản dịch — đang hiển thị nguyên văn tiếng Việt.",
    machineTranslated: "Bản dịch máy, chưa qua thẩm định chuyên môn. Bản tiếng Việt là bản gốc.",
    relatedFigs: "Cấu trúc & cơ chế liên quan",
    relatedNote: "Hình lấy từ sách giải phẫu/sinh lý, mô tả cấu trúc liên quan — không phải ảnh tổn thương của bệnh này.",
    offline: "Không kết nối được máy chủ dữ liệu bệnh lý.",
    disclaimer: "Mã ICD-10 và thuật ngữ dịch chưa qua thẩm định chuyên môn. Nội dung phục vụ học tập, không thay thế chẩn đoán hay chỉ định điều trị.",
  },
  en: {
    eyebrow: "Clinical index", title: "Pathology lookup",
    lead: "Search by condition, ICD-10 code or specialty, then correlate directly with the 3D anatomy.",
    search: "Condition, ICD-10 code or specialty", sources: "Search sources",
    allSystems: "All", saved: "Saved",
    records: "conditions", showing: "showing", empty: "No conditions match these filters.",
    loading: "Loading pathology data…",
    severity: { info: "Monitor", warning: "Warning", critical: "Emergency" },
    icd: "ICD-10", page: "Page", system: "Specialty", model: "3D model",
    hasModel: "Yes", noModel: "Not yet",
    close: "Close", view3d: "Open 3D structure", source: "Source",
    overview: "Overview", clinical: "Clinical & laboratory", imaging: "Diagnostic imaging",
    progression: "Progression & complications", treatment: "Treatment reference",
    incomplete: "The detailed pathology has not been written yet. This record points to the exact textbook page so you can read the original.",
    save: "Save", unsave: "Remove", related: "Same specialty",
    unclassified: "Unclassified",
    catTitle: "Condition index", filters: "Filters", askSymptom: "Search by symptom",
    bookFigs: "Textbook figures", pageGuess: "page inferred",
    noTranslation: "This article has not been translated yet — showing the original Vietnamese text.",
    machineTranslated: "Machine translation, not yet reviewed by a clinician. The Vietnamese text is the original.",
    relatedFigs: "Related structure & mechanism",
    relatedNote: "Taken from anatomy/physiology texts; shows the related structure, not a lesion image of this condition.",
    offline: "Cannot reach the pathology data server.",
    disclaimer: "ICD-10 codes and translated terms are not yet expert-reviewed. Educational reference only; not a substitute for diagnosis or treatment.",
  },
  zh: {
    eyebrow: "临床索引", title: "病理检索",
    lead: "按疾病名称、ICD-10 代码或专科检索，并直接与三维解剖结构对照。",
    search: "疾病、ICD-10 代码或专科", sources: "查阅来源",
    allSystems: "全部", saved: "已收藏",
    records: "种疾病", showing: "显示", empty: "没有符合筛选条件的病理。",
    loading: "正在加载病理数据…",
    severity: { info: "观察", warning: "警告", critical: "急救" },
    icd: "ICD-10", page: "页码", system: "专科", model: "三维模型",
    hasModel: "有", noModel: "暂无",
    close: "关闭", view3d: "打开三维结构", source: "来源",
    overview: "概述", clinical: "临床与实验室", imaging: "医学影像",
    progression: "进展与并发症", treatment: "参考治疗",
    incomplete: "详细病理内容尚未撰写。本档案直接指向教材对应页码，便于查阅原文。",
    save: "收藏", unsave: "取消收藏", related: "同一专科",
    unclassified: "未分类",
    catTitle: "疾病目录", filters: "筛选", askSymptom: "按症状检索",
    bookFigs: "教材插图", pageGuess: "页码为推算",
    noTranslation: "本篇尚无译文——显示越南语原文。",
    machineTranslated: "机器翻译，尚未经专业人员审核。越南语版本为原文。",
    relatedFigs: "相关结构与机制",
    relatedNote: "取自解剖／生理教材，展示相关结构，并非本病的病变图像。",
    offline: "无法连接病理数据服务器。",
    disclaimer: "ICD-10 代码与译名尚未经专业审核。仅供学习查阅，不能替代诊断或治疗。",
  },
} as const;

/* Bookmark nằm ở localStorage — nguồn dữ liệu ngoài React. */
const BOOKMARK_KEY = "soma3d-pathology-bookmarks";
const NONE: string[] = [];
const listeners = new Set<() => void>();
let raw: string | null = null;
let parsed: string[] = NONE;

function readBookmarks(): string[] {
  const next = localStorage.getItem(BOOKMARK_KEY);
  if (next !== raw) {
    raw = next;
    try {
      parsed = next ? (JSON.parse(next) as string[]) : NONE;
    } catch {
      parsed = NONE;
    }
  }
  return parsed;
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  window.addEventListener("storage", fn);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", fn);
  };
}

function writeBookmarks(next: string[]) {
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
  listeners.forEach((fn) => fn());
}

const strip = (value: string) =>
  value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/* Hệ lâm sàng là chuỗi tự do từ backend (VI, có dấu), không phải enum — nên
   dò bằng từ khoá đã bỏ dấu. Thứ tự QUAN TRỌNG: "than kinh" phải đứng trước
   "than" (thận), "san/phu khoa" trước "sinh". Không khớp thì về ống nghe. */
const SYSTEM_ICONS: [string[], string][] = [
  [["than kinh", "neuro"], "i-brain"],
  [["co xuong khop", "musculoskel", "ortho", "xuong"], "i-bone"],
  [["ho hap", "respir", "phoi", "pulmo"], "i-lungs"],
  [["hoi suc", "cap cuu", "emergen", "critical care", "icu"], "i-cross"],
  [["huyet hoc", "hemat", "haemat", "mau"], "i-droplet"],
  [["lao khoa", "geriatr", "cao tuoi"], "i-user"],
  [["noi tiet", "endocrin", "chuyen hoa", "metabol"], "i-cell"],
  [["tiet nieu", "nephro", "urolog", "than"], "i-nephro"],
  [["tieu hoa", "gastro", "digest", "gan mat"], "i-stomach"],
  [["tim mach", "cardio"], "i-heart"],
  [["da lieu", "derma"], "i-derma"],
  [["mat", "ophthal", "nhan khoa"], "i-eye"],
  [["tai mui hong", "ent", "otolar"], "i-ear"],
  [["nhi khoa", "pediatr", "paediatr", "so sinh"], "i-baby"],
  [["nhiem", "infect", "truyen nhiem"], "i-virus"],
  [["san", "phu khoa", "obstet", "gynec"], "i-gyn"],
  [["rang ham mat", "dental", "nha khoa"], "i-tooth"],
];

/* Hệ lâm sàng trong DB chỉ có tiếng Việt. Chín giá trị, dịch tay ngay ở đây
   còn hơn để cột trái trơ tiếng Việt khi người dùng đang xem bản tiếng Anh. */
const SYSTEM_LABELS: Record<string, { en: string; zh: string }> = {
  "Cơ xương khớp": { en: "Musculoskeletal", zh: "肌肉骨骼" },
  "Hô hấp": { en: "Respiratory", zh: "呼吸" },
  "Hồi sức cấp cứu": { en: "Critical care", zh: "重症急救" },
  "Huyết học": { en: "Haematology", zh: "血液" },
  "Lão khoa": { en: "Geriatrics", zh: "老年医学" },
  "Nội tiết": { en: "Endocrinology", zh: "内分泌" },
  "Thận - Tiết niệu": { en: "Nephrology & urology", zh: "肾脏与泌尿" },
  "Tiêu hóa": { en: "Gastroenterology", zh: "消化" },
  "Tim mạch": { en: "Cardiology", zh: "心血管" },
};

const systemLabel = (name: string, locale: Loc) =>
  locale === "vi" ? name : SYSTEM_LABELS[name]?.[locale] ?? name;

function systemIcon(label: string) {
  const key = strip(label);
  for (const [needles, icon] of SYSTEM_ICONS) {
    if (needles.some((n) => key.includes(n))) return icon;
  }
  return "i-steth";
}

/**
 * Nút "Xem 3D" mở ĐÚNG model của bệnh.
 *
 * Trước đây nút luôn dẫn về `/viewer` (mô hình toàn thân) kèm `?structure=`,
 * mà mã cấu trúc lại chính là SLUG CỦA MỘT SCENE trong atlas. Người học bấm
 * "Xem 3D" ở bài "Viêm khớp phản ứng" thì nhận cả cơ thể chứ không phải khớp
 * gối. Nay: mã nào ứng với một scene có thật thì mở thẳng scene ấy; chỉ khi
 * bệnh có `lesionMesh` (neo vào mesh của model TOÀN THÂN) hoặc mã không ứng
 * với scene nào mới lùi về `/viewer` như cũ.
 */
function view3dHref(p: { id: string; lesionMesh?: string | null; structure?: { code: string } | null }): string {
  const code = p.structure?.code;
  const scene = code ? getScene(code) : undefined;
  if (scene && !p.lesionMesh) return scene.href;
  return `/viewer?structure=${encodeURIComponent(code ?? "")}&pathology=${p.id}`;
}

export default function PathologyLibrary({ locale }: { locale: Loc }) {
  const t = copy[locale];
  const [items, setItems] = useState<Pathology[]>([]);
  const [loading, setLoading] = useState(true);
  const [system, setSystem] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Pathology | null>(null);
  const [savedOnly, setSavedOnly] = useState(false);
  const [sugOpen, setSugOpen] = useState(false);
  const [sugIndex, setSugIndex] = useState(-1);
  /* Câu hỏi triệu chứng tách khỏi `query`: gõ để lọc danh sách là việc tức
     thời, còn hỏi trợ lý là hành động có chủ đích, chỉ chạy khi người dùng
     chọn dòng gợi ý cuối. Nếu gọi trợ lý theo từng phím gõ thì vừa tốn tiền
     vừa trả lời linh tinh giữa chừng. */
  const [symptomQuery, setSymptomQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const bookmarks = useSyncExternalStore(subscribe, readBookmarks, () => NONE);

  useEffect(() => {
    fetchPathologies()
      .then((result) => {
        setItems(result.items);
        setError(result.ok ? null : result.error);
      })
      .finally(() => setLoading(false));
  }, []);

  /* Trợ lý dẫn tới /benh-ly?open=<slug> — mở sẵn đúng hồ sơ đó. Chỉ chạy một
     lần sau khi có dữ liệu, và xoá tham số khỏi thanh địa chỉ để bấm Quay lại
     không mở lại hồ sơ vừa đóng. */
  useEffect(() => {
    if (items.length === 0) return;
    const want = new URLSearchParams(window.location.search).get("open");
    if (!want) return;
    const hit = items.find((p) => p.slug === want);
    if (!hit) return;
    // Đặt state ở MICROTASK kế tiếp chứ không gọi thẳng trong effect: gọi thẳng
    // là dựng lại cây ngay trong lượt commit (React cảnh báo "cascading
    // renders"). Cờ `alive` để nếu người dùng rời trang trước khi microtask
    // chạy thì không đụng vào state của component đã tháo.
    let alive = true;
    queueMicrotask(() => {
      if (!alive) return;
      setSelected(hit);
      window.history.replaceState(null, "", window.location.pathname);
    });
    return () => {
      alive = false;
    };
  }, [items]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  /* Danh sách hệ lấy từ TOÀN BỘ bản ghi, không lấy từ kết quả đang lọc — cột
     trái phải đứng yên khi gõ tìm kiếm, chỉ số đếm bên phải mới đổi. */
  const systems = useMemo(
    () =>
      Array.from(new Set(items.map((p) => p.clinicalSystem).filter(Boolean) as string[])).sort(
        (a, b) => a.localeCompare(b, "vi"),
      ),
    [items],
  );

  /* Pool = đã áp tìm kiếm + "đã lưu", CHƯA áp hệ và mức độ. Từ pool này đếm
     ngược ra số bệnh cho từng mục ở cột trái. */
  const pool = useMemo(() => {
    const needle = strip(query.trim());
    return items.filter((p) => {
      if (savedOnly && !bookmarks.includes(p.id)) return false;
      if (!needle) return true;
      const hay = strip(
        [p.nameVi, p.nameEn, p.nameZh, p.latin, p.icdCode, p.clinicalSystem, structureName(p, locale)]
          .filter(Boolean)
          .join(" "),
      );
      return hay.includes(needle);
    });
  }, [items, savedOnly, bookmarks, query, locale]);

  const systemCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of pool) {
      const label = p.clinicalSystem ?? t.unclassified;
      map.set(label, (map.get(label) ?? 0) + 1);
    }
    return map;
  }, [pool, t.unclassified]);

  const visible = useMemo(
    () => pool.filter((p) => system === "all" || p.clinicalSystem === system),
    [pool, system],
  );

  const groups = useMemo(() => {
    const map = new Map<string, Pathology[]>();
    for (const p of visible) {
      const label = p.clinicalSystem ?? t.unclassified;
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(p);
    }
    return Array.from(map.entries());
  }, [visible, t.unclassified]);

  /* Hình quét từ giáo trình cho đúng bệnh đang mở; rỗng với bệnh chưa trích.
     Tách hai loại vì chúng nói hai điều khác nhau: `book` là hình in trong
     chính bài bệnh đó, `related` là hình giải phẫu/sinh lý ghép từ sách khác.
     Gộp chung một mục là để người đọc tưởng ảnh cấu trúc là ảnh tổn thương. */
  const allFigures = selected ? pathologyFigures[selected.slug] ?? [] : [];
  const figures = allFigures.filter((f) => f.kind !== "related");
  const relatedFigures = allFigures.filter((f) => f.kind === "related");

  const related = useMemo(
    () =>
      !selected
        ? []
        : items.filter((p) => p.id !== selected.id && p.clinicalSystem === selected.clinicalSystem).slice(0, 8),
    [items, selected],
  );

  /* Gợi ý: tên bệnh khớp trước, rồi tới dòng "tra theo triệu chứng". Chỉ hiện
     khi đã gõ >=2 ký tự — gợi ý ngay từ ký tự đầu là danh sách vô nghĩa. */
  type Suggestion = { key: string; kind: "disease" | "symptom"; label: string; hint?: string; id?: string };

  const suggestions: Suggestion[] = useMemo(() => {
    const q = query.trim();
    if (q.length < 2) return [];
    const list: Suggestion[] = visible.slice(0, 6).map((p) => ({
      key: p.id,
      kind: "disease",
      label: pathologyName(p, locale),
      hint: p.icdCode ?? undefined,
      id: p.id,
    }));
    // Mô tả triệu chứng thường dài hơn một tiếng; gợi ý hỏi trợ lý khi câu gõ
    // trông như một mô tả chứ không phải một từ khoá tra tên.
    if (q.split(/\s+/).length >= 2) {
      list.push({ key: "__symptom", kind: "symptom", label: `${t.askSymptom}: “${q}”` });
    }
    return list;
  }, [query, visible, locale, t.askSymptom]);

  function runSuggestion(sug: Suggestion) {
    setSugOpen(false);
    if (sug.kind === "symptom") {
      setSymptomQuery(query.trim());
      return;
    }
    const hit = items.find((p) => p.id === sug.id);
    if (hit) setSelected(hit);
  }

  function onSearchKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!sugOpen || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSugIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSugIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && sugIndex >= 0) {
      e.preventDefault();
      runSuggestion(suggestions[sugIndex]);
    } else if (e.key === "Escape") {
      setSugOpen(false);
    }
  }

  function toggleBookmark(id: string) {
    const next = bookmarks.includes(id) ? bookmarks.filter((x) => x !== id) : [...bookmarks, id];
    writeBookmarks(next);
  }

  return (
    <div className="pth-shell">
      <IconSprite />

      {/* Cột trái CHỈ chứa bộ lọc của trang này (hệ lâm sàng, mức độ, đã lưu).
          Các mục điều hướng chung — Giải phẫu người, Hệ cơ quan, Quiz… — vẫn
          nằm ở thanh trên, không nhân bản xuống đây. */}
      <aside className="pth-side" aria-label={t.filters}>
        <div className="pth-side-in" data-lenis-prevent>
        <p className="pth-side-title">{t.catTitle}</p>

        <nav className="pth-cats" aria-label={t.system}>
          <button
            type="button"
            className={`pth-cat${system === "all" ? " on" : ""}`}
            onClick={() => setSystem("all")}
            aria-pressed={system === "all"}
          >
            <Icon id="i-grid" />
            <span>{t.allSystems}</span>
            {/* Tổng của chính các mục bên dưới — KHÔNG dùng pool.length, vì
                pool chưa áp mức độ nên "Tất cả 106" sẽ chỏi với tổng 13. */}
            <em>{[...systemCounts.values()].reduce((a, b) => a + b, 0)}</em>
          </button>
          {systems.map((name) => {
            const n = systemCounts.get(name) ?? 0;
            return (
              <button
                key={name}
                type="button"
                className={`pth-cat${system === name ? " on" : ""}${n === 0 ? " is-empty" : ""}`}
                onClick={() => setSystem(name)}
                aria-pressed={system === name}
              >
                <Icon id={systemIcon(name)} />
                <span>{systemLabel(name, locale)}</span>
                <em>{n}</em>
              </button>
            );
          })}
        </nav>

        {/* KHÔNG có bộ lọc "Mức độ" ở đây. Chỉ 16/106 bệnh có mức độ, và 10
            trong số đó nằm gọn trong chương "Hồi sức cấp cứu" — lọc theo mức
            độ gần như trùng với lọc theo hệ, lại khiến 6 hệ hiện số 0 như thể
            hệ đó không có bệnh nặng. Mức độ vẫn hiện dạng chấm màu ở từng dòng
            và trong hồ sơ bệnh; xem prisma/data/pathologies.ts để biết vì sao
            90 bản ghi còn lại để trống (mục lục giáo trình không có trường
            này, không tự phán đoán). */}
        {bookmarks.length > 0 && (
          <button
            type="button"
            className={`pth-saved${savedOnly ? " on" : ""}`}
            onClick={() => setSavedOnly((v) => !v)}
            aria-pressed={savedOnly}
          >
            <Icon id="i-bookmark" />
            {t.saved} · {bookmarks.length}
          </button>
        )}
        </div>
      </aside>

      <main className="pth">
      <header className="pth-head">
        <p className="pth-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p className="pth-lead">{t.lead}</p>
      </header>

      {/* MỘT ô tìm kiếm duy nhất cho cả hai việc: lọc danh sách theo tên/mã, và
          hỏi trợ lý theo triệu chứng. Trước đây tách làm hai ô, người dùng phải
          tự đoán nên gõ vào ô nào — mà hai ô lại nhận cùng một kiểu chữ. */}
      <div className="pth-tools">
        <div className="pth-searchwrap">
          <div className={`pth-search${sugOpen && suggestions.length > 0 ? " is-open" : ""}`}>
            <Icon id="i-search" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSugOpen(true);
                setSugIndex(-1);
              }}
              onFocus={() => setSugOpen(true)}
              onBlur={() => window.setTimeout(() => setSugOpen(false), 150)}
              onKeyDown={onSearchKey}
              placeholder={t.search}
              aria-label={t.search}
              aria-expanded={sugOpen}
              aria-controls="pth-sug"
              role="combobox"
              autoComplete="off"
            />
            {query && (
              <button onClick={() => { setQuery(""); setSugOpen(false); }} aria-label={t.close}>
                <Icon id="i-close" />
              </button>
            )}
          </div>

          {sugOpen && suggestions.length > 0 && (
            <ul className="pth-sug" id="pth-sug" role="listbox">
              {suggestions.map((sug, i) => (
                <li key={sug.key} role="option" aria-selected={i === sugIndex}>
                  <button
                    className={i === sugIndex ? "on" : ""}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => runSuggestion(sug)}
                  >
                    <Icon id={sug.kind === "symptom" ? "i-steth" : "i-search"} />
                    <span>{sug.label}</span>
                    {sug.hint && <em>{sug.hint}</em>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Link href="/tai-lieu-y-khoa" className="pth-sources">
          {t.sources}
          <Icon id="i-right" />
        </Link>
      </div>

      {symptomQuery && (
        <PathologyAssistant locale={locale} mode="symptoms" question={symptomQuery} />
      )}

      {!loading && !error && (
        <div className="pth-filters">
          {/* Chip chỉ còn hiện bộ lọc ĐANG bật để bỏ nhanh — danh sách đầy đủ
              đã nằm ở cột trái, lặp lại ở đây là thừa. */}
          {system !== "all" && (
            <button className="pth-tag" onClick={() => setSystem("all")}>
              {systemLabel(system, locale)}
              <Icon id="i-close" />
            </button>
          )}
          {savedOnly && (
            <button className="pth-tag" onClick={() => setSavedOnly(false)}>
              {t.saved}
              <Icon id="i-close" />
            </button>
          )}
          <span className="pth-count">
            {t.showing} <b>{visible.length}</b>/{items.length} {t.records}
          </span>
        </div>
      )}

      {loading ? (
        <div className="pth-loading" role="status">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} />
          ))}
          <p>{t.loading}</p>
        </div>
      ) : error ? (
        <p className="pth-empty pth-error">
          {t.offline}
          <small>{error}</small>
        </p>
      ) : visible.length === 0 ? (
        <p className="pth-empty">{t.empty}</p>
      ) : (
        <div className="pth-index">
          {groups.map(([label, rows]) => (
            <section key={label} className="pth-group">
              <h2>
                <span>{systemLabel(label, locale)}</span>
                <em>{rows.length}</em>
              </h2>
              <ul>
                {rows.map((p) => {
                  const saved = bookmarks.includes(p.id);
                  const sev = p.severity;
                  return (
                    <li key={p.id} className={`pth-row${sev ? ` sev-${sev}` : ""}`}>
                      <button className="pth-open" onClick={() => setSelected(p)}>
                        {/* Mức độ chỉ có ở 16/106 bản ghi → hiện dấu thì mới có
                            nghĩa. Cột chữ "Nghiêm trọng" lặp lại 10 lần như bản
                            trước chỉ là nhiễu. */}
                        {sev && <i className="pth-dot" title={t.severity[sev]} />}
                        <span className="pth-name">{pathologyName(p, locale)}</span>
                        {/* Cả ba ô đuôi LUÔN render, ô nào không có dữ liệu thì
                            ẩn bằng visibility — nếu bỏ hẳn thì dòng có nhãn 3D
                            sẽ đẩy mã ICD và số trang lệch đi, cột thành zigzag. */}
                        <span className={`pth-icd${p.icdCode ? "" : " is-blank"}`}>
                          {p.icdCode || "—"}
                        </span>
                        <span className={`pth-page${p.sourcePage ? "" : " is-blank"}`}>
                          {t.page} {p.sourcePage ?? "—"}
                        </span>
                        <span className={`pth-3d${p.structure ? "" : " is-blank"}`}>3D</span>
                      </button>
                      <button
                        className={`pth-mark${saved ? " on" : ""}`}
                        onClick={() => toggleBookmark(p.id)}
                        aria-label={saved ? t.unsave : t.save}
                        aria-pressed={saved}
                      >
                        <Icon id="i-bookmark" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}

      <p className="pth-disclaimer">{t.disclaimer}</p>
      </main>

      {selected && (
        <div className="pth-drawer-back" onClick={() => setSelected(null)}>
          <aside
            className="pth-drawer"
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
            role="dialog"
            aria-label={pathologyName(selected, locale)}
          >
            <header>
              <div>
                {selected.severity && (
                  <span className={`pth-chip sev-${selected.severity}`}>
                    <i aria-hidden="true" />
                    {t.severity[selected.severity]}
                  </span>
                )}
                <h2>{pathologyName(selected, locale)}</h2>
                <p className="pth-alt">
                  {selected.nameEn}
                  {selected.latin ? ` · ${selected.latin}` : ""}
                </p>
              </div>
              <button onClick={() => setSelected(null)} aria-label={t.close}>
                <Icon id="i-close" />
              </button>
            </header>

            {/* Hình GIÁO TRÌNH đứng trước ảnh 3D tự dựng: đây mới là hình đã
                qua thẩm định chuyên môn. Ảnh 3D chỉ để định vị giải phẫu và
                được ghi rõ là do dự án tự dựng, tránh người đọc tưởng là hình
                thật trong sách. */}
            {figures.length > 0 && (
              <div className="pth-figs">
                <h3>{t.bookFigs}</h3>
                {figures.map((fig) => (
                  <figure key={fig.src} className="pth-fig">
                    <img src={fig.src} alt={fig.caption} loading="lazy" />
                    <figcaption>
                      {fig.source}
                      {fig.page ? ` · ${t.page} ${fig.page}` : ""}
                      {fig.pageInferred ? ` (${t.pageGuess})` : ""}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}

            {/* Hình từ sách GIẢI PHẪU / SINH LÝ, ghép theo cấu trúc 3D của bệnh.
                Để riêng khối và ghi rõ nguồn gốc: đây là cấu trúc liên quan,
                KHÔNG phải ảnh tổn thương. Gộp chung với hình giáo trình ở trên
                là để người đọc hiểu nhầm. */}
            {relatedFigures.length > 0 && (
              <div className="pth-figs pth-figs-ref">
                <h3>{t.relatedFigs}</h3>
                <p className="pth-figs-note">{t.relatedNote}</p>
                {relatedFigures.map((fig) => (
                  <figure key={fig.src} className="pth-fig">
                    <img src={fig.src} alt={fig.caption} loading="lazy" />
                    <figcaption>
                      {fig.caption} — {fig.source}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}

            {/* KHÔNG hiện ảnh render từ mô hình 3D của dự án nữa. Ảnh đó neo
                theo tên mesh nên hay lệch với mô tả bệnh — gout tô cả thân
                xương bàn I ở CẢ HAI bàn chân, trong khi bệnh là viêm khớp bàn
                ngón chân cái, thường một bên. Đã có hình giáo trình đúng thì
                giữ ảnh sai bên cạnh chỉ gây nhiễu.
                Mô hình 3D vẫn dùng để ĐỊNH VỊ qua nút "Mở cấu trúc 3D" ở dưới,
                nơi người dùng biết rõ mình đang xem model. */}

            <dl className="pth-facts">
              <div>
                <dt>{t.icd}</dt>
                <dd className="mono">{selected.icdCode || "—"}</dd>
              </div>
              <div>
                <dt>{t.system}</dt>
                <dd>{selected.clinicalSystem ? systemLabel(selected.clinicalSystem, locale) : "—"}</dd>
              </div>
              <div>
                <dt>{t.model}</dt>
                <dd>{selected.structure ? structureName(selected, locale) : t.noModel}</dd>
              </div>
            </dl>

            {(() => {
              const c = pathologyContent(selected, locale);
              /* Nội dung bệnh học trong DB mới chỉ có tiếng Việt (106/106).
                 pathologyContent() tự lùi về tiếng Việt — im lặng thì người
                 đọc bản tiếng Anh tưởng đây LÀ bản dịch. Nói thẳng ra. */
              const untranslated = locale !== "vi" && c?.locale === "vi";
              /* Hai tình huống khác hẳn nhau, không gộp làm một:
                 - chưa dịch  -> đang đọc nguyên văn tiếng Việt
                 - dịch máy   -> đúng ngôn ngữ nhưng chưa ai chuyên môn duyệt */
              const machine = c?.machineTranslated === true;
              const sections = [
                [t.overview, c?.description],
                [t.clinical, c?.clinical],
                [t.imaging, c?.imaging],
                [t.progression, c?.progression],
                [t.treatment, c?.treatment],
              ].filter(([, body]) => body) as [string, string][];
              return sections.length > 0 ? (
                <>
                  {untranslated && <p className="pth-untranslated">{t.noTranslation}</p>}
                  {machine && <p className="pth-untranslated">{t.machineTranslated}</p>}
                  {sections.map(([heading, body]) => (
                    <section key={heading}>
                      <h3>{heading}</h3>
                      <p>{body}</p>
                    </section>
                  ))}
                </>
              ) : (
                <p className="pth-incomplete">{t.incomplete}</p>
              );
            })()}

            <PathologyAssistant locale={locale} mode="disease" slug={selected.slug} />

            <section className="pth-cite">
              <h3>{t.source}</h3>
              <cite>{selected.source}</cite>
              {selected.sourcePage && (
                <strong>
                  {t.page} {selected.sourcePage}
                </strong>
              )}
              {selected.citations?.map((c) => (
                <a key={c.id} href={c.source.url} target="_blank" rel="noreferrer">
                  {c.source.title}
                  {c.pageOrSection ? ` · ${c.pageOrSection}` : ""}
                </a>
              ))}
            </section>

            {related.length > 0 && (
              <section className="pth-related">
                <h3>{t.related}</h3>
                <ul>
                  {related.map((p) => (
                    <li key={p.id}>
                      <button onClick={() => setSelected(p)}>
                        <span>{pathologyName(p, locale)}</span>
                        {p.icdCode && <em>{p.icdCode}</em>}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="pth-actions">
              <button onClick={() => toggleBookmark(selected.id)}>
                <Icon id="i-bookmark" />
                {bookmarks.includes(selected.id) ? t.unsave : t.save}
              </button>
              {selected.structure && (
                <Link href={view3dHref(selected)}>
                  {t.view3d}
                  <Icon id="i-right" />
                </Link>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
