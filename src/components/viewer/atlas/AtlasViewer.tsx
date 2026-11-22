"use client";





import { useContent } from "@/components/content/ContentProvider";
import { bindContentSource } from "@/lib/content/source";
import { contentFetch } from '@/lib/content/fetch';
import { ContentSurface } from "@/components/content/ContentProvider";
/**
 * Giao diện atlas toàn thân — chuyển từ human-atlas/app/page.tsx (MIT).
 *
 * Bản gốc dùng shadcn (Button/Badge/Switch/Slider/Sheet/Combobox). Ở đây dựng
 * lại bằng phần tử thuần vì Soma_Fe không có bộ shadcn đó; các thuộc tính
 * `data-slot` được giữ nguyên để CSS đã port (viewer/atlas.css) bám đúng chỗ.
 * Toàn bộ trạng thái, phím tắt và luồng thao tác giữ nguyên hành vi bản gốc.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { localizedPartNames, localizedPartName, localizedConceptName, conceptGroup } from "@/lib/humanAtlas/partNames";
import { heartScene } from "@/lib/humanAtlas/scenes/heart";
import { sceneTint } from "@/lib/humanAtlas/scenes/types";
import { createSceneLabels } from "@/lib/humanAtlas/sceneLabels";
import { Link } from "@/i18n/navigation";
import { pick, type Loc } from "@/lib/homeContent";
import PartLearning from './PartLearning';
import { partLearning } from '@/lib/humanAtlas/learning';
import {
  Activity,
  ArrowUpRight,
  ChevronRight,
  Focus,
  Info,
  Layers3,
  Pause,
  RotateCcw,
  RotateCw,
  Search,
  X,
} from "./icons";
import BrandSignature from "@/components/home/BrandSignature";
import ThemeToggle from "@/components/home/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { registerAtlasTools } from "@/lib/humanAtlas/agentTools";
import {
  ATLAS_MANIFEST,
  DEFAULT_CLIP,
  DEFAULT_VISIBLE,
  EXPLANATIONS,
  SYSTEMS,
  explanation,
  type Atlas,
  type ClipAxis,
  type Concept,
  type SceneState,
  type SystemId,
  type View,
} from "@/lib/humanAtlas/anatomy";

// WebGL không chạy khi dựng phía máy chủ.
const AtlasScene = dynamic(() => import("./AtlasScene"), { ssr: false });

const initial: SceneState = {
  explode: 0,
  visible: DEFAULT_VISIBLE,
  selected: [],
  isolate: false,
  view: "three-quarter",
  rotate: false,
  reset: 0,
  focus: [],
  frame: [],
  tint: {},
  hidden: [],
  faded: [],
  clip: DEFAULT_CLIP,
};

const CLIP_AXES: { id: ClipAxis; label: string; title: string }[] = bindContentSource("data:src/components/viewer/atlas/AtlasViewer.tsx#CLIP_AXES", [
  { id: "x", label: "X", title: "Cắt dọc giữa (mặt phẳng đứng dọc)" },
  { id: "y", label: "Y", title: "Cắt ngang (mặt phẳng nằm ngang)" },
  { id: "z", label: "Z", title: "Cắt trước sau (mặt phẳng đứng ngang)" },
]);

const ORGAN_PRESET: SystemId[] = [
  "cardiac",
  "respiratory",
  "digestive",
  "urinary",
  "endocrine",
  "reproductive",
];

const VIEWS: { id: View; label: string; title: string }[] = bindContentSource("data:src/components/viewer/atlas/AtlasViewer.tsx#VIEWS", [
  { id: "three-quarter", label: "¾", title: "Góc chéo" },
  { id: "front", label: "T", title: "Nhìn trước" },
  { id: "side", label: "B", title: "Nhìn bên" },
  { id: "back", label: "S", title: "Nhìn sau" },
]);

const SUGGESTED = [
  "heart",
  "brain",
  "liver",
  "stomach",
  "spleen",
  "pancreas",
  "urinary bladder",
  "trachea",
];

/** Bản dịch tên hệ cơ quan cho en/zh — bản vi vẫn lấy từ SYSTEMS (CMS sửa được). */
const SYSTEM_NAMES: Record<SystemId, { en: string; zh: string }> = {
  skeletal: { en: "Skeletal system", zh: "骨骼系统" },
  muscular: { en: "Muscular system", zh: "肌肉系统" },
  cardiac: { en: "Heart", zh: "心脏" },
  sensory: { en: "Sensory organs", zh: "感觉器官" },
  arterial: { en: "Arteries", zh: "动脉" },
  venous: { en: "Veins", zh: "静脉" },
  nervous: { en: "Nervous system", zh: "神经系统" },
  respiratory: { en: "Respiratory system", zh: "呼吸系统" },
  digestive: { en: "Digestive system", zh: "消化系统" },
  urinary: { en: "Urinary system", zh: "泌尿系统" },
  lymphatic: { en: "Lymphatic system", zh: "淋巴系统" },
  endocrine: { en: "Endocrine system", zh: "内分泌系统" },
  reproductive: { en: "Reproductive system", zh: "生殖系统" },
  integumentary: { en: "Body surface", zh: "体表" },
  connective: { en: "Connective tissue", zh: "结缔组织" },
};

/** Khoá dịch của bốn góc nhìn camera. */
const VIEW_KEYS: Partial<Record<View, "viewThreeQuarter" | "viewFront" | "viewSide" | "viewBack">> = {
  "three-quarter": "viewThreeQuarter",
  front: "viewFront",
  side: "viewSide",
  back: "viewBack",
};

/** Tiêu đề ba trục mặt cắt (bản vi nằm trong CLIP_AXES để CMS sửa được). */
const CLIP_TITLES: Record<ClipAxis, { en: string; zh: string }> = {
  x: { en: "Mid-sagittal cut (vertical sagittal plane)", zh: "正中矢状切（垂直矢状面）" },
  y: { en: "Transverse cut (horizontal plane)", zh: "横断切（水平面）" },
  z: { en: "Coronal cut (vertical coronal plane)", zh: "冠状切（垂直冠状面）" },
};

const NUMBER_LOCALE: Record<Loc, string> = { vi: "vi-VN", en: "en-US", zh: "zh-CN" };

/** Dấu hiệu lỗi tải danh mục — dịch ở chỗ hiển thị, không dịch trong effect. */
const LOAD_FAILED = "ATLAS_LOAD_FAILED";

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return <ContentSurface scope="src/components/viewer/atlas/AtlasViewer.tsx">{(
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      data-slot="switch"
      data-state={checked ? "checked" : "unchecked"}
      onClick={onChange}
    >
      <span data-slot="switch-thumb" />
    </button>
  )}</ContentSurface>;
}

export default function AtlasViewer() {
  const cmsContent = useContent();
  const SYSTEMS = cmsContent.resolve(cmsSourceSYSTEMS());
  const CLIP_AXES = cmsContent.resolve(cmsSourceCLIP_AXES());
  const VIEWS = cmsContent.resolve(cmsSourceVIEWS());

  const loc=useLocale() as Loc;
  const t = useTranslations("atlas");
  const text = (vi: string, en: string, zh: string) => pick({ vi, en, zh }, loc);
  const numbers = useMemo(() => new Intl.NumberFormat(NUMBER_LOCALE[loc]), [loc]);
  const systemName = (s: { id: SystemId; name: string }) =>
    loc === "vi" ? s.name : SYSTEM_NAMES[s.id]?.[loc] ?? s.name;
  const viewTitle = (v: { id: View; title: string }) => {
    const key = VIEW_KEYS[v.id];
    return loc === "vi" || !key ? v.title : t(key);
  };
  const clipTitle = (a: { id: ClipAxis; title: string }) =>
    loc === "vi" ? a.title : CLIP_TITLES[a.id]?.[loc] ?? a.title;
  const detailTitle = useRef<HTMLHeadingElement>(null);
  const [atlas, setAtlas] = useState<Atlas | null>(null);
  const partNames=useMemo(()=>localizedPartNames(atlas?.parts??[],loc,cmsContent),[atlas,loc,cmsContent]);
  const [state, setState] = useState(initial);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [panel, setPanel] = useState<"layers" | "search" | null>(null);
  const [details, setDetails] = useState(false);
  const [about, setAbout] = useState(false);
  const [query, setQuery] = useState("");
  const [chosen, setChosen] = useState<Concept | null>(null);

  useEffect(() => {
    // Bản gốc gọi một loạt setState dọn dẹp ở đây; effect này chỉ chạy một lần
    // lúc gắn nên mọi giá trị đã đúng bằng trạng thái khởi tạo — gọi lại chỉ
    // tạo thêm một vòng dựng thừa (và vi phạm react-hooks/set-state-in-effect).
    const abort = new AbortController();
    contentFetch(ATLAS_MANIFEST, { signal: abort.signal })
      .then((r) => {
        if (!r.ok) throw new Error(LOAD_FAILED);
        return r.json();
      })
      .then((data) => setAtlas(data as Atlas))
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => abort.abort();
  }, []);

  // Phím "/" mở ô tìm kiếm, đúng như bản gốc.
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setPanel("search");
        setDetails(false);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  const parts = useMemo(
    () => new Map(atlas?.parts.map((p) => [p.id, p])),
    [atlas],
  );
  const counts = useMemo(
    () =>
      Object.fromEntries(
        SYSTEMS.map((s) => [
          s.id,
          atlas?.parts.filter((p) => p.system === s.id).length ?? 0,
        ]),
      ),
    [SYSTEMS, atlas?.parts],
  );
  const activeSystems = SYSTEMS.filter((s) => counts[s.id] > 0);
  const selectedParts = state.selected
    .map((id) => parts.get(id))
    .filter((p) => !!p);
  const selected = selectedParts[0];
  const heart = cmsContent.resolve(heartScene);
  const tint = useMemo(() => sceneTint(heart), [heart]);
  const labels = useMemo(() => {
    if (!atlas) return [];
    const ids = new Set(state.isolate ? state.isolated ?? state.selected : state.selected.length ? state.selected : state.visible.length===1&&state.visible[0]==='cardiac' ? atlas.parts.filter(part=>part.system==='cardiac').map(part=>part.id) : []);
    const groups = heart.groups.map(group => ({...group,parts:group.parts.filter(id=>ids.has(id))})).filter(group=>group.parts.length);
    return createSceneLabels({...heart,groups},atlas.parts,loc,{...state,isolate:false});
  }, [atlas, heart, loc, state]);
  const chosenTitle = chosen ? chosen.elements.length===1 && selected
    ? localizedPartName(selected,loc,cmsContent)
    : localizedConceptName(chosen,loc,cmsContent) : '';
  const system = SYSTEMS.find((s) => s.id === selected?.system);
  // Trừ luôn phần bị ẩn thủ công: bấm "Ẩn" mà con số không đổi thì người dùng
  // tưởng nút không ăn.
  const visibleCount =
    atlas?.parts.filter(
      (p) =>
        !state.hidden.includes(p.id) &&
        (state.isolate
          ? (state.isolated ?? state.selected).includes(p.id)
          : state.visible.includes(p.system) || state.selected.includes(p.id)),
    ).length ?? 0;

  const results = useMemo(() => {
    if (!atlas) return [];
    const fold=(value:string)=>value.toLowerCase().normalize('NFD').replace(/\p{M}/gu,'').replace(/đ/g,'d');
    const term = fold(query.trim());
    if (!term)
      return SUGGESTED.map((n) =>
        atlas.concepts.find((c) => c.name.toLowerCase() === n),
      ).filter((x): x is Concept => !!x);
    return atlas.concepts
      .filter(
        (c) =>
          fold(c.name).includes(term) ||
          fold(localizedConceptName(c,loc,cmsContent)).includes(term) ||
          (c.elements.length===1&&fold([partNames[c.elements[0]]??'',partLearning(c.elements[0],cmsContent)?.latin??''].join(' ')).includes(term)) ||
          c.id.toLowerCase().includes(term),
      )
      .sort((a, b) => a.name.length - b.name.length)
      .slice(0, 80);
  }, [atlas, query, partNames, cmsContent, loc]);

  const choose = useCallback((c: Concept) => {
    setChosen(c);
    setState((s) => ({
      ...s,
      selected: c.elements,
      isolate: true,
      isolated: c.elements,
      explode: 0,
      rotate: false,
    }));
    setDetails(true);
    setPanel(null);
  }, []);

  useEffect(() => {
    if (!atlas) return;
    return registerAtlasTools(atlas, (c) => flushSync(() => choose(c)));
  }, [atlas, choose]);

  const choosePart = (id: string) => {
    const p = parts.get(id);
    if (!p) return;
    setChosen({ id: p.conceptId, name: p.name, elements: [id] });
    setState((s) => ({ ...s, selected: [id], isolated: s.isolate ? s.isolated ?? s.selected : undefined, rotate: false }));
    setDetails(true);
    setPanel(null);
  };

  const toggle = (id: SystemId) => {
    setDetails(false);
    setState((s) => ({
      ...s,
      selected: [],
      isolate: false,
      visible: s.visible.includes(id)
        ? s.visible.filter((x) => x !== id)
        : [...s.visible, id],
    }));
  };

  const reset = () => {
    setState((s) => ({
      ...initial,
      visible: DEFAULT_VISIBLE,
      reset: s.reset + 1,
    }));
    setChosen(null);
    setDetails(false);
    setPanel(null);
  };

  const openPanel = (next: "layers" | "search") => {
    setDetails(false);
    setPanel((p) => (p === next ? null : next));
  };

  const only = (id: SystemId) =>
    setState((v) => ({ ...v, visible: [id], isolate: false, selected: [] }));

  const allHidden =
    state.selected.length > 0 && state.selected.every((id) => state.hidden.includes(id));
  const allFaded =
    state.selected.length > 0 && state.selected.every((id) => state.faded.includes(id));

  const caption = state.isolate
    ? chosenTitle
    : state.explode > 0.95
      ? text("KHO CẤU TRÚC GIẢI PHẪU", "STRUCTURE LIBRARY", "结构库")
      : state.explode > 0.05
        ? text("CÁC CẤU TRÚC ĐÃ TÁCH RỜI", "STRUCTURES SEPARATED", "结构已分离")
        : text("NGƯỜI TRƯỞNG THÀNH · NAM", "ADULT · MALE", "成年 · 男性");

  return <ContentSurface scope="src/components/viewer/atlas/AtlasViewer.tsx">{(
    <main className="atlas-studio">
      {atlas && (
        <AtlasScene
          atlas={atlas}
          state={{
            ...state,
            tint,
            labels,
            showLabels: state.showLabels ?? true,
            partNames,
            inspectorOpen: details && selectedParts.length > 0,
          }}
          onSelect={choosePart}
          onLabelPick={(key) => {
            const label = labels.find(item=>item.key===key);
            if (label) choosePart(label.ids[0]);
          }}
          onProgress={(n) => {
            setProgress(n);
            if (n === 100) setError("");
          }}
          onError={setError}
        />
      )}
      <div className="vignette" />

      <header className="identity">
        {/* Lối thoát về danh sách mô hình. Trang toàn thân tràn viền, không có
            <header> riêng như các bài chuyên đề (`/giai-phau/mo-hinh/*`), nên
            nút nằm ngay trong lớp nổi: dựng thêm thanh header sẽ cắt mất ~62px
            chiều cao khung hình và làm model nhỏ đi. `.identity` đặt
            pointer-events:none cho cả khối chữ, nên nút phải tự bật lại. */}
        <Link
          href="/giai-phau/tat-ca"
          className="scene-exit"
          style={{ pointerEvents: "auto", marginBottom: 10, width: "fit-content" }}
          aria-label={text("Quay lại thư viện mô hình", "Back to the model library", "返回模型库")}
        >
          <ChevronRight size={16} />
          <span>{text("Quay lại thư viện", "Back to library", "返回模型库")}</span>
        </Link>
        {/* Nhận diện dùng chung <BrandSignature> (con dấu Soma Atlas) thay cho
            thanh header riêng: trang tràn viền nên logo và lối về trang chủ
            phải nằm ngay trong lớp nổi. Dòng "GIẢI PHẪU TƯƠNG TÁC" của bản gốc
            đã bỏ vì con dấu đã mang sẵn đúng dòng chữ đó. */}
        <BrandSignature />
        <h1>
          {text("Atlas toàn thân", "Whole-body atlas", "全身图谱")}
          <span className="edition">3D</span>
        </h1>
        <div className="identity-meta">
          {numbers.format(atlas?.parts.length ?? 2234)} {t("pieces")}{" "}
          <span>·</span> BodyParts3D
        </div>
      </header>

      <nav className="top-actions" aria-label={text("Bảng điều khiển", "Control panel", "控制面板")}>
        <button
          type="button"
          data-slot="button"
          className={panel === "search" ? "active" : ""}
          onClick={() => openPanel("search")}
        >
          <Search size={18} />
          <span>{t("findStructure")}</span>
          <kbd>/</kbd>
        </button>
        <ThemeToggle />
        <button type="button" data-slot="button" aria-pressed={state.showLabels ?? true} onClick={()=>setState(s=>({...s,showLabels:!(s.showLabels??true)}))}>
          {text("Nhãn", "Labels", "标注")}
        </button>
        <LanguageSwitcher />
        <button
          type="button"
          data-slot="button"
          className="icon-button"
          aria-label={t("about")}
          onClick={() => {
            setDetails(false);
            setPanel(null);
            setAbout(true);
          }}
        >
          <Info size={18} />
        </button>
      </nav>

      <section
        className={`layers-panel glass ${panel === "layers" ? "mobile-open" : ""}`}
        aria-label={t("layers")}
      >
        <div className="panel-heading">
          <span>{t("systems")}</span>
          <button
            type="button"
            data-slot="button"
            className="mobile-only icon-button"
            onClick={() => setPanel(null)}
            aria-label={t("close")}
          >
            <X size={18} />
          </button>
          <span className="desktop-only small-number">
            {activeSystems.length}
          </span>
        </div>
        <div className="layer-presets">
          <button
            type="button"
            data-slot="button"
            aria-pressed={activeSystems.every((x) =>
              state.visible.includes(x.id),
            )}
            onClick={() =>
              setState((s) => ({
                ...s,
                selected: [],
                isolate: false,
                visible: activeSystems.map((x) => x.id),
              }))
            }
          >
            {t("presetAll")}
          </button>
          <button
            type="button"
            data-slot="button"
            aria-pressed={
              state.visible.length === 1 && state.visible[0] === "skeletal"
            }
            onClick={() =>
              setState((s) => ({
                ...s,
                selected: [],
                isolate: false,
                visible: ["skeletal"],
              }))
            }
          >
            {t("presetSkeleton")}
          </button>
          <button
            type="button"
            data-slot="button"
            aria-pressed={
              state.visible.length === ORGAN_PRESET.length &&
              ORGAN_PRESET.every((id) => state.visible.includes(id))
            }
            onClick={() =>
              setState((s) => ({
                ...s,
                selected: [],
                isolate: false,
                visible: ORGAN_PRESET,
              }))
            }
          >
            {t("presetOrgans")}
          </button>
        </div>
        <div className="system-list">
          {activeSystems.map((s) => (
            <div
              className={`system-row ${state.visible.includes(s.id) ? "enabled" : ""}`}
              key={s.id}
            >
              <button
                type="button"
                data-slot="button"
                className="system-name"
                title={text(`Chỉ hiện ${systemName(s).toLowerCase()}`, `Show only ${systemName(s).toLowerCase()}`, `仅显示${systemName(s)}`)}
                onClick={() => only(s.id)}
              >
                <span className="system-dot" style={{ background: s.color }} />
                {systemName(s)}
                <span className="system-count">{counts[s.id]}</span>
              </button>
              <Switch
                checked={state.visible.includes(s.id)}
                onChange={() => toggle(s.id)}
                label={text(`Hiện ${systemName(s).toLowerCase()}`, `Show ${systemName(s).toLowerCase()}`, `显示${systemName(s)}`)}
              />
            </div>
          ))}
        </div>
        <div className="panel-foot">
          <span>{numbers.format(visibleCount)} {t("piecesVisible")}</span>
          <button
            type="button"
            data-slot="button"
            onClick={() =>
              setState((s) => ({
                ...s,
                visible: [],
                selected: [],
                isolate: false,
              }))
            }
          >
            {t("hideAll")}
          </button>
        </div>
      </section>

      {/* Mặt cắt lát — thẻ nổi góc PHẢI, ngay dưới hàng nút tìm/thông tin, cùng kiểu
          `.clip-card` với trang chuyên đề. Trước đây lớp `clip-panel` không có CSS nào nên
          thẻ rơi thành một thanh trần chạy ngang đỉnh trang. */}
      <section className="clip-card clip-panel" aria-label={t("clip")}>
        <div className="clip-head">
          <span>{t("clip")}</span>
          <button
            type="button"
            role="switch"
            aria-checked={state.clip.enabled}
            aria-label={text("Bật mặt cắt lát", "Turn on cross-section", "开启断层切面")}
            data-slot="switch"
            data-state={state.clip.enabled ? "checked" : "unchecked"}
            onClick={() =>
              setState((v) => ({
                ...v,
                clip: { ...v.clip, enabled: !v.clip.enabled },
              }))
            }
          >
            <span data-slot="switch-thumb" />
          </button>
        </div>
        {state.clip.enabled && (
          <>
            <div className="clip-axes">
              {CLIP_AXES.map((a) => (
                <button
                  type="button"
                  data-slot="button"
                  key={a.id}
                  title={clipTitle(a)}
                  aria-pressed={state.clip.axis === a.id}
                  onClick={() => setState((v) => ({ ...v, clip: { ...v.clip, axis: a.id } }))}
                >
                  {a.label}
                </button>
              ))}
            </div>
            <input
              data-slot="slider"
              type="range"
              min={0}
              max={100}
              step={1}
              value={state.clip.percent}
              aria-label={t("clipPosition")}
              onChange={(e) =>
                setState((v) => ({ ...v, clip: { ...v.clip, percent: Number(e.target.value) } }))
              }
            />
            <div className="clip-foot">
              <span>{state.clip.percent}%</span>
              <button
                type="button"
                data-slot="button"
                onClick={() =>
                  setState((v) => ({ ...v, clip: { ...v.clip, keepPositive: !v.clip.keepPositive } }))
                }
              >
                {t("clipReverse")}
              </button>
            </div>
          </>
        )}
      </section>

      {panel === "search" && (
        <section className="search-panel glass" aria-label={text("Tìm cấu trúc", "Structure search", "结构搜索")}>
          <div className="panel-heading">
            <span>{t("findStructure")}</span>
            <button
              type="button"
              data-slot="button"
              className="icon-button"
              onClick={() => setPanel(null)}
              aria-label={text("Đóng tìm kiếm", "Close search", "关闭搜索")}
            >
              <X size={18} />
            </button>
          </div>
          {/* Ô này chỉ xuất hiện khi người dùng chủ động mở bằng nút hoặc phím "/". */}
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Heart, femur, cranial nerve…"
            aria-label={text("Tìm theo tên cấu trúc giải phẫu", "Search by anatomical structure name", "按解剖结构名称搜索")}
          />
          <div className="anatomy-search-results">
            {results.length === 0 && (
              <p className="search-note">{text("Không có cấu trúc nào khớp.", "No matching structures.", "没有匹配的结构。")}</p>
            )}
            {results.map((c) => (
              <button
                type="button"
                data-slot="button"
                key={c.id}
                onClick={() => choose(c)}
              >
                <span className="search-result-name">{localizedConceptName(c,loc,cmsContent)}</span>
                <span className="small-number">{c.elements.length} {text("mảnh", "pieces", "个部件")}</span>
              </button>
            ))}
          </div>
          <p className="search-note">
            {query
              ? text(
                  "Hiện tối đa 80 kết quả. Gõ cụ thể hơn để tìm các cấu trúc nhỏ.",
                  "Showing up to 80 results. Type more specifically to reach smaller structures.",
                  "最多显示 80 条结果。输入更具体的关键词可找到更小的结构。",
                )
              : text(
                  "Tên cấu trúc theo BodyParts3D nên ở dạng tiếng Anh. Bắt đầu từ một tạng lớn, hoặc tìm trong toàn bộ 3.432 cấu trúc có tên.",
                  "Structure names follow BodyParts3D, so they appear in English. Start with a large organ, or search all 3,432 named structures.",
                  "结构名称沿用 BodyParts3D，因此为英文。建议从一个大型器官开始，或搜索全部 3,432 个具名结构。",
                )}
          </p>
        </section>
      )}

      <nav className="view-controls glass" aria-label={text("Điều khiển máy ảnh", "Camera controls", "视角控制")}>
        {VIEWS.map((v) => (
          <button
            type="button"
            data-slot="button"
            key={v.id}
            className={state.view === v.id ? "active" : ""}
            aria-pressed={state.view === v.id}
            disabled={state.explode > 0.8 && v.id !== "front"}
            onClick={() =>
              setState((s) => ({
                ...s,
                view: v.id,
                reset: s.reset + 1,
                rotate: false,
              }))
            }
            title={viewTitle(v)}
            aria-label={viewTitle(v)}
          >
            <span>{v.label}</span>
          </button>
        ))}
        <i />
        <button
          type="button"
          data-slot="button"
          disabled={state.explode >= 0.4}
          className={state.rotate ? "active" : ""}
          aria-label={state.rotate ? t("stopRotate") : t("autoRotate")}
          title={t("autoRotate")}
          onClick={() => setState((s) => ({ ...s, rotate: !s.rotate }))}
        >
          {state.rotate ? <Pause size={17} /> : <RotateCw size={18} />}
        </button>
        <button
          type="button"
          data-slot="button"
          aria-label={text("Đặt lại khung nhìn và các lớp", "Reset view and layers", "重置视角与层次")}
          title={t("reset")}
          onClick={reset}
        >
          <RotateCcw size={17} />
        </button>
      </nav>

      <div className="scene-caption">
        <span className="caption-line" />
        <span>{caption}</span>
        <span className="caption-line" />
      </div>

      <div className="bottom-dock glass">
        <button
          type="button"
          data-slot="button"
          className="dock-icon"
          onClick={() => openPanel("layers")}
          aria-label={text("Mở bảng lớp", "Open layers panel", "打开层次面板")}
        >
          <Layers3 size={20} />
        </button>
        <div className="explode-control">
          <div className="explode-label">
            <label htmlFor="atlas-explode">{t("explode")}</label>
            <output htmlFor="atlas-explode">
              {Math.round(state.explode * 100)}
              <span>%</span>
            </output>
          </div>
          <input
            id="atlas-explode"
            data-slot="slider"
            type="range"
            min={0}
            max={100}
            step={1}
            value={Math.round(state.explode * 100)}
            onChange={(e) => {
              const v = Number(e.target.value);
              setState((s) => ({
                ...s,
                explode: v / 100,
                view: v > 80 ? "front" : s.view,
                rotate: false,
              }));
            }}
          />
          <div className="slider-endpoints">
            <span>{t("assembled")}</span>
            <span>{t("everyPiece")}</span>
          </div>
        </div>
        <button
          type="button"
          data-slot="button"
          className="dock-icon"
          onClick={reset}
          aria-label={text("Ghép lại và đặt lại", "Reassemble and reset", "复原并重置")}
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <footer className="studio-footer">
        <span>
          {state.explode > 0.8 ? t("dragPan") : t("dragOrbit")} <b>·</b>{" "}
          {t("pinchZoom")} <b>·</b> {t("tapInspect")}
        </span>
        <button
          type="button"
          data-slot="button"
          onClick={() => {
            setDetails(false);
            setPanel(null);
            setAbout(true);
          }}
        >
          {t("credits")} <ArrowUpRight size={12} />
        </button>
      </footer>

      {progress < 100 && !error && (
        <div className="loading glass" role="status">
          <Activity size={18} />
          <div>
            <strong>{t("loading")}</strong>
            <span>
              {progress}% · {text("Đang tải", "Loading", "正在加载")}{" "}
              {numbers.format(atlas?.parts.length ?? 2234)} {text("mảnh", "pieces", "个部件")}
            </span>
            <div className="loading-track">
              <i style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className="loading glass error" role="alert">
          <p>{error === LOAD_FAILED ? t("loadError") : error}</p>
          <button
            type="button"
            data-slot="button"
            onClick={() => location.reload()}
          >
            {text("Tải lại", "Reload", "重新加载")}
          </button>
        </div>
      )}

      {details && selectedParts.length > 0 && (
        <aside
          className={`detail-sheet glass ${state.isolate ? "is-isolated" : ""}`}
          aria-label={text("Chi tiết cấu trúc", "Structure details", "结构详情")}
        >
          <button
            type="button"
            data-slot="button"
            className="sheet-close"
            onClick={() => setDetails(false)}
            aria-label={t("close")}
          >
            <X size={18} />
          </button>
          <div className="detail-header">
            <div
              className="detail-accent"
              style={{ background: system?.color }}
            />
            <div className="eyebrow">
              {system ? systemName(system) : text("GIẢI PHẪU", "ANATOMY", "解剖")}
            </div>
            <h2 ref={detailTitle} tabIndex={-1} className="structure-title">
              {chosenTitle}
            </h2>
          </div>
          <div className="detail-scroll" key={`${chosen?.id}-${state.isolate}`}>
            {selectedParts.length===1&&selected&&<PartLearning part={selected} locale={loc} hideIdentity/>}
            {selectedParts.length>1&&chosen&&conceptGroup(chosen,cmsContent)?.note&&<p className="structure-description">{conceptGroup(chosen,cmsContent)?.note?.[loc]}</p>}
            {selected&&!partLearning(selected.id,cmsContent)?.note&&chosen&&EXPLANATIONS[chosen.name.toLowerCase()]&&loc==='vi'&&<p className="structure-description">
              {chosen && selected
                ? explanation(chosen.name, selected.system)
                : ""}
            </p>}
            <div className="structure-meta">
              <span>
                {text("Mã tra cứu", "Lookup ID", "查询编号")}
                <strong>{chosen?.id}</strong>
              </span>
              <span>
                {text("Số mảnh đang chọn", "Selected pieces", "已选部件")}
                <strong>{numbers.format(state.selected.length)}</strong>
              </span>
            </div>
            {selectedParts.length > 1 && (
              <div className="member-list">
                <h3>{text("Các cấu trúc thành phần", "Constituent structures", "组成部分")}</h3>
                {selectedParts.slice(0, 50).map((p) => (
                  <button
                    type="button"
                    data-slot="button"
                    key={p.id}
                    onClick={() => choosePart(p.id)}
                  >
                    <span>{partNames[p.id]}</span>
                    <ChevronRight size={14} />
                  </button>
                ))}
                {selectedParts.length > 50 && (
                  <p>
                    {text(
                      `Và ${selectedParts.length - 50} mảnh nữa.`,
                      `And ${selectedParts.length - 50} more pieces.`,
                      `还有 ${selectedParts.length - 50} 个部件。`,
                    )}
                  </p>
                )}
              </div>
            )}
            <a
              className="source-link"
              href="https://lifesciencedb.jp/bp3d/"
              target="_blank"
              rel="noreferrer"
            >
              {text("Xem nguồn giải phẫu", "View anatomy source", "查看解剖来源")}{" "}
              <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="detail-actions">
            {/* Ẩn / Làm mờ theo đúng cặp nút của viewer Z-Anatomy cũ, để thao
                tác trên hai khu không lệch nhau. Cả hai áp cho MỌI mảnh đang
                chọn — một cấu trúc có tên có thể gồm nhiều mảnh. */}
            <div className="detail-quick">
              <button
                type="button"
                data-slot="button"
                aria-pressed={allHidden}
                onClick={() =>
                  setState((v) => ({
                    ...v,
                    hidden: allHidden
                      ? v.hidden.filter((id) => !v.selected.includes(id))
                      : [...v.hidden, ...v.selected.filter((id) => !v.hidden.includes(id))],
                  }))
                }
              >
                {allHidden ? t("unhide") : t("hide")}
              </button>
              <button
                type="button"
                data-slot="button"
                aria-pressed={allFaded}
                onClick={() =>
                  setState((v) => ({
                    ...v,
                    faded: allFaded
                      ? v.faded.filter((id) => !v.selected.includes(id))
                      : [...v.faded, ...v.selected.filter((id) => !v.faded.includes(id))],
                  }))
                }
              >
                {allFaded ? t("unfade") : t("fade")}
              </button>
            </div>
            <button
              type="button"
              data-slot="button"
              className={`primary-action ${state.isolate ? "active" : ""}`}
              onClick={() =>
                setState((s) => ({ ...s, isolate: !s.isolate, isolated: s.isolate ? undefined : s.selected, explode: 0 }))
              }
            >
              <Focus size={18} />
              {state.isolate ? t("unisolate") : t("isolate")}
              <ChevronRight size={16} />
            </button>
            <button
              type="button"
              data-slot="button"
              className="secondary-action"
              onClick={() => {
                setState((s) => ({ ...s, selected: [], isolate: false }));
                setDetails(false);
              }}
            >
              {t("clearSelection")}
            </button>
          </div>
        </aside>
      )}

      {about && (
        <aside className="about-sheet glass" aria-label={text("Nguồn và phạm vi", "Sources and scope", "来源与范围")}>
          <button
            type="button"
            data-slot="button"
            className="sheet-close"
            onClick={() => setAbout(false)}
            aria-label={t("close")}
          >
            <X size={18} />
          </button>
          <div className="eyebrow">{text("NGUỒN & PHẠM VI", "SOURCES & SCOPE", "来源与范围")}</div>
          <h2 className="structure-title">
            {text("Một cơ thể, mở ra từng lớp.", "One body, opened layer by layer.", "一具身体，逐层展开。")}
          </h2>
          <div className="about-copy">
            <p>
              <strong>{text("Nam · BodyParts3D", "Male · BodyParts3D", "男性 · BodyParts3D")}</strong>
              <br />
              {text(
                "2.234 mesh riêng lẻ và 3.432 cấu trúc có tên, lấy từ bộ giải phẫu tham chiếu người trưởng thành nam.",
                "2,234 individual meshes and 3,432 named structures, taken from the adult male reference anatomy set.",
                "2,234 个独立网格与 3,432 个具名结构，取自成年男性参考解剖数据集。",
              )}
            </p>
            <p>
              {text(
                "Bộ tham chiếu này không chứa mọi cấu trúc hay mọi biến thể giải phẫu ở người. Một cấu trúc có tên có thể gồm nhiều mảnh; mỗi mesh nguồn chỉ được vẽ một lần.",
                "This reference set does not contain every human structure or anatomical variant. A named structure may consist of several pieces; each source mesh is drawn only once.",
                "该参考数据集并不包含人体的全部结构或解剖变异。一个具名结构可能由多个部件组成；每个源网格只绘制一次。",
              )}
            </p>
            <p>
              {text(
                "Màu sắc và cách nhóm theo hệ là quy ước phục vụ việc học. Hình học đã được đơn giản hoá để chạy trên trình duyệt. Đây là tài liệu tham khảo phục vụ giáo dục, không phải công cụ chẩn đoán hay phẫu thuật.",
                "Colours and system grouping are teaching conventions. The geometry has been simplified to run in a browser. This is an educational reference, not a diagnostic or surgical tool.",
                "颜色与系统分组属于教学约定。几何模型已简化以便在浏览器中运行。本资料仅供教育参考，不用于诊断或手术。",
              )}
            </p>
            <h3>{text("Nguồn dữ liệu", "Data source", "数据来源")}</h3>
            <p>
              {text(
                "BodyParts3D, © The Database Center for Life Science, giấy phép CC Attribution 4.0 International.",
                "BodyParts3D, © The Database Center for Life Science, licensed under CC Attribution 4.0 International.",
                "BodyParts3D，© The Database Center for Life Science，采用 CC Attribution 4.0 International 许可。",
              )}
            </p>
            <a
              href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html"
              target="_blank"
              rel="noreferrer"
            >
              {text("Giấy phép bộ dữ liệu", "Dataset licence", "数据集许可")}{" "}
              <ArrowUpRight size={14} />
            </a>
            <a
              href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html"
              target="_blank"
              rel="noreferrer"
            >
              {text("Hình học và siêu dữ liệu gốc", "Original geometry and metadata", "原始几何与元数据")}{" "}
              <ArrowUpRight size={14} />
            </a>
            <a
              href="https://academic.oup.com/nar/article/37/suppl_1/D782/1000752"
              target="_blank"
              rel="noreferrer"
            >
              {text("Bài báo công bố nguồn", "Source publication paper", "来源论文")}{" "}
              <ArrowUpRight size={14} />
            </a>
            <Link
              href="/nguon-du-lieu"
              target="_blank"
              rel="noreferrer"
            >
              {text("Ghi công đầy đủ", "Full attribution", "完整致谢")}{" "}
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </aside>
      )}
    </main>
  )}</ContentSurface>;
}

function cmsSourceSYSTEMS() { return SYSTEMS; }
function cmsSourceCLIP_AXES() { return CLIP_AXES; }
function cmsSourceVIEWS() { return VIEWS; }
