"use client";

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

const CLIP_AXES: { id: ClipAxis; label: string; title: string }[] = [
  { id: "x", label: "X", title: "Cắt dọc giữa (mặt phẳng đứng dọc)" },
  { id: "y", label: "Y", title: "Cắt ngang (mặt phẳng nằm ngang)" },
  { id: "z", label: "Z", title: "Cắt trước sau (mặt phẳng đứng ngang)" },
];

const ORGAN_PRESET: SystemId[] = [
  "cardiac",
  "respiratory",
  "digestive",
  "urinary",
  "endocrine",
  "reproductive",
];

const VIEWS: { id: View; label: string; title: string }[] = [
  { id: "three-quarter", label: "¾", title: "Góc chéo" },
  { id: "front", label: "T", title: "Nhìn trước" },
  { id: "side", label: "B", title: "Nhìn bên" },
  { id: "back", label: "S", title: "Nhìn sau" },
];

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

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
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
  );
}

export default function AtlasViewer() {
  const detailTitle = useRef<HTMLHeadingElement>(null);
  const [atlas, setAtlas] = useState<Atlas | null>(null);
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
    fetch(ATLAS_MANIFEST, { signal: abort.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Không tải được danh mục giải phẫu.");
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
    [atlas],
  );
  const activeSystems = SYSTEMS.filter((s) => counts[s.id] > 0);
  const selectedParts = state.selected
    .map((id) => parts.get(id))
    .filter((p) => !!p);
  const selected = selectedParts[0];
  const system = SYSTEMS.find((s) => s.id === selected?.system);
  // Trừ luôn phần bị ẩn thủ công: bấm "Ẩn" mà con số không đổi thì người dùng
  // tưởng nút không ăn.
  const visibleCount =
    atlas?.parts.filter(
      (p) =>
        !state.hidden.includes(p.id) &&
        (state.isolate
          ? state.selected.includes(p.id)
          : state.visible.includes(p.system) || state.selected.includes(p.id)),
    ).length ?? 0;

  const results = useMemo(() => {
    if (!atlas) return [];
    const term = query.toLowerCase().trim();
    if (!term)
      return SUGGESTED.map((n) =>
        atlas.concepts.find((c) => c.name.toLowerCase() === n),
      ).filter((x): x is Concept => !!x);
    return atlas.concepts
      .filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.id.toLowerCase().includes(term),
      )
      .sort((a, b) => a.name.length - b.name.length)
      .slice(0, 80);
  }, [atlas, query]);

  const choose = useCallback((c: Concept) => {
    setChosen(c);
    setState((s) => ({
      ...s,
      selected: c.elements,
      isolate: false,
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
    setState((s) => ({ ...s, selected: [id], isolate: false, rotate: false }));
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
    ? (chosen?.name ?? "CẤU TRÚC ĐANG CHỌN")
    : state.explode > 0.95
      ? "KHO CẤU TRÚC GIẢI PHẪU"
      : state.explode > 0.05
        ? "CÁC CẤU TRÚC ĐÃ TÁCH RỜI"
        : "NGƯỜI TRƯỞNG THÀNH · NAM";

  return (
    <main className="atlas-studio">
      {atlas && (
        <AtlasScene
          atlas={atlas}
          state={{
            ...state,
            inspectorOpen: details && selectedParts.length > 0,
          }}
          onSelect={choosePart}
          onProgress={(n) => {
            setProgress(n);
            if (n === 100) setError("");
          }}
          onError={setError}
        />
      )}
      <div className="vignette" />

      <header className="identity">
        {/* Nhận diện dùng chung <BrandSignature> (con dấu Soma Atlas) thay cho
            thanh header riêng: trang tràn viền nên logo và lối về trang chủ
            phải nằm ngay trong lớp nổi. Dòng "GIẢI PHẪU TƯƠNG TÁC" của bản gốc
            đã bỏ vì con dấu đã mang sẵn đúng dòng chữ đó. */}
        <BrandSignature />
        <h1>
          Atlas toàn thân<span className="edition">3D</span>
        </h1>
        <div className="identity-meta">
          {(atlas?.parts.length ?? 2234).toLocaleString("vi-VN")} mảnh mô hình{" "}
          <span>·</span> BodyParts3D
        </div>
      </header>

      <nav className="top-actions" aria-label="Bảng điều khiển">
        <button
          type="button"
          data-slot="button"
          className={panel === "search" ? "active" : ""}
          onClick={() => openPanel("search")}
        >
          <Search size={18} />
          <span>Tìm một cấu trúc</span>
          <kbd>/</kbd>
        </button>
        <ThemeToggle />
        <LanguageSwitcher />
        <button
          type="button"
          data-slot="button"
          className="icon-button"
          aria-label="Về bộ dữ liệu"
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
        aria-label="Các lớp giải phẫu"
      >
        <div className="panel-heading">
          <span>Hệ cơ quan</span>
          <button
            type="button"
            data-slot="button"
            className="mobile-only icon-button"
            onClick={() => setPanel(null)}
            aria-label="Đóng"
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
            Tất cả
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
            Bộ xương
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
            Nội tạng
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
                title={`Chỉ hiện ${s.name.toLowerCase()}`}
                onClick={() => only(s.id)}
              >
                <span className="system-dot" style={{ background: s.color }} />
                {s.name}
                <span className="system-count">{counts[s.id]}</span>
              </button>
              <Switch
                checked={state.visible.includes(s.id)}
                onChange={() => toggle(s.id)}
                label={`Hiện ${s.name.toLowerCase()}`}
              />
            </div>
          ))}
        </div>
        <div className="panel-foot">
          <span>{visibleCount.toLocaleString("vi-VN")} mảnh đang hiện</span>
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
            Ẩn hết
          </button>
        </div>
      </section>

      {/* Mặt cắt lát — thẻ nổi góc PHẢI, ngay dưới hàng nút tìm/thông tin, cùng kiểu
          `.clip-card` với trang chuyên đề. Trước đây lớp `clip-panel` không có CSS nào nên
          thẻ rơi thành một thanh trần chạy ngang đỉnh trang. */}
      <section className="clip-card clip-panel" aria-label="Mặt cắt lát">
        <div className="clip-head">
          <span>Mặt cắt lát</span>
          <button
            type="button"
            role="switch"
            aria-checked={state.clip.enabled}
            aria-label="Bật mặt cắt lát"
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
                  title={a.title}
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
              aria-label="Vị trí lát cắt"
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
                Đảo chiều
              </button>
            </div>
          </>
        )}
      </section>

      {panel === "search" && (
        <section className="search-panel glass" aria-label="Tìm cấu trúc">
          <div className="panel-heading">
            <span>Tìm một cấu trúc</span>
            <button
              type="button"
              data-slot="button"
              className="icon-button"
              onClick={() => setPanel(null)}
              aria-label="Đóng tìm kiếm"
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
            aria-label="Tìm theo tên cấu trúc giải phẫu"
          />
          <div className="anatomy-search-results">
            {results.length === 0 && (
              <p className="search-note">Không có cấu trúc nào khớp.</p>
            )}
            {results.map((c) => (
              <button
                type="button"
                data-slot="button"
                key={c.id}
                onClick={() => choose(c)}
              >
                <span className="search-result-name">{c.name}</span>
                <span className="small-number">{c.elements.length} mảnh</span>
              </button>
            ))}
          </div>
          <p className="search-note">
            {query
              ? "Hiện tối đa 80 kết quả. Gõ cụ thể hơn để tìm các cấu trúc nhỏ."
              : "Tên cấu trúc theo BodyParts3D nên ở dạng tiếng Anh. Bắt đầu từ một tạng lớn, hoặc tìm trong toàn bộ 3.432 cấu trúc có tên."}
          </p>
        </section>
      )}

      <nav className="view-controls glass" aria-label="Điều khiển máy ảnh">
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
            title={v.title}
            aria-label={v.title}
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
          aria-label={state.rotate ? "Dừng xoay" : "Tự xoay"}
          title="Tự xoay"
          onClick={() => setState((s) => ({ ...s, rotate: !s.rotate }))}
        >
          {state.rotate ? <Pause size={17} /> : <RotateCw size={18} />}
        </button>
        <button
          type="button"
          data-slot="button"
          aria-label="Đặt lại khung nhìn và các lớp"
          title="Đặt lại"
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
          className="mobile-only dock-layers"
          onClick={() => openPanel("layers")}
          aria-label="Mở bảng lớp"
        >
          <Layers3 size={20} />
          <span>Lớp</span>
        </button>
        <div className="explode-control">
          <div className="explode-label">
            <label htmlFor="atlas-explode">Tách rời giải phẫu</label>
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
            <span>Nguyên khối</span>
            <span>Từng mảnh</span>
          </div>
        </div>
        <button
          type="button"
          data-slot="button"
          className="dock-reset"
          onClick={reset}
          aria-label="Ghép lại và đặt lại"
        >
          <RotateCcw size={18} />
          <span>Đặt lại</span>
        </button>
      </div>

      <footer className="studio-footer">
        <span>
          {state.explode > 0.8 ? "Kéo để dời" : "Kéo để xoay"} <b>·</b> Cuộn để
          phóng <b>·</b> Bấm để xem chi tiết
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
          Nguồn &amp; ghi công <ArrowUpRight size={12} />
        </button>
      </footer>

      {progress < 100 && !error && (
        <div className="loading glass" role="status">
          <Activity size={18} />
          <div>
            <strong>Đang chuẩn bị mô hình</strong>
            <span>
              {progress}% · Đang tải{" "}
              {(atlas?.parts.length ?? 2234).toLocaleString("vi-VN")} mảnh
            </span>
            <div className="loading-track">
              <i style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className="loading glass error" role="alert">
          <p>{error}</p>
          <button
            type="button"
            data-slot="button"
            onClick={() => location.reload()}
          >
            Tải lại
          </button>
        </div>
      )}

      {details && selectedParts.length > 0 && (
        <aside
          className={`detail-sheet glass ${state.isolate ? "is-isolated" : ""}`}
          aria-label="Chi tiết cấu trúc"
        >
          <button
            type="button"
            data-slot="button"
            className="sheet-close"
            onClick={() => setDetails(false)}
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
          <div className="detail-header">
            <div
              className="detail-accent"
              style={{ background: system?.color }}
            />
            <div className="eyebrow">{system?.name ?? "GIẢI PHẪU"}</div>
            <h2 ref={detailTitle} tabIndex={-1} className="structure-title">
              {chosen?.name}
            </h2>
          </div>
          <div className="detail-scroll" key={`${chosen?.id}-${state.isolate}`}>
            <p className="structure-description">
              {chosen && selected
                ? explanation(chosen.name, selected.system)
                : ""}
            </p>
            {chosen && !EXPLANATIONS[chosen.name.toLowerCase()] && (
              <span className="context-note">
                Mô tả chung của hệ · cấu trúc lấy từ dữ liệu giải phẫu gốc
              </span>
            )}
            <div className="structure-meta">
              <span>
                Mã tra cứu<strong>{chosen?.id}</strong>
              </span>
              <span>
                Số mảnh đang chọn
                <strong>{state.selected.length.toLocaleString("vi-VN")}</strong>
              </span>
            </div>
            {selectedParts.length > 1 && (
              <div className="member-list">
                <h3>Các cấu trúc thành phần</h3>
                {selectedParts.slice(0, 50).map((p) => (
                  <button
                    type="button"
                    data-slot="button"
                    key={p.id}
                    onClick={() => choosePart(p.id)}
                  >
                    <span>{p.name}</span>
                    <ChevronRight size={14} />
                  </button>
                ))}
                {selectedParts.length > 50 && (
                  <p>Và {selectedParts.length - 50} mảnh nữa.</p>
                )}
              </div>
            )}
            <a
              className="source-link"
              href="https://lifesciencedb.jp/bp3d/"
              target="_blank"
              rel="noreferrer"
            >
              Xem nguồn giải phẫu <ArrowUpRight size={14} />
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
                {allHidden ? "Hiện lại" : "Ẩn"}
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
                {allFaded ? "Bỏ làm mờ" : "Làm mờ"}
              </button>
            </div>
            <button
              type="button"
              data-slot="button"
              className={`primary-action ${state.isolate ? "active" : ""}`}
              onClick={() =>
                setState((s) => ({ ...s, isolate: !s.isolate, explode: 0 }))
              }
            >
              <Focus size={18} />
              {state.isolate
                ? "Hiện lại giải phẫu xung quanh"
                : "Cô lập cấu trúc"}
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
              Bỏ chọn
            </button>
          </div>
        </aside>
      )}

      {about && (
        <aside className="about-sheet glass" aria-label="Nguồn và phạm vi">
          <button
            type="button"
            data-slot="button"
            className="sheet-close"
            onClick={() => setAbout(false)}
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
          <div className="eyebrow">NGUỒN &amp; PHẠM VI</div>
          <h2 className="structure-title">Một cơ thể, mở ra từng lớp.</h2>
          <div className="about-copy">
            <p>
              <strong>Nam · BodyParts3D</strong>
              <br />
              2.234 mesh riêng lẻ và 3.432 cấu trúc có tên, lấy từ bộ giải phẫu
              tham chiếu người trưởng thành nam.
            </p>
            <p>
              Bộ tham chiếu này không chứa mọi cấu trúc hay mọi biến thể giải
              phẫu ở người. Một cấu trúc có tên có thể gồm nhiều mảnh; mỗi mesh
              nguồn chỉ được vẽ một lần.
            </p>
            <p>
              Màu sắc và cách nhóm theo hệ là quy ước phục vụ việc học. Hình học
              đã được đơn giản hoá để chạy trên trình duyệt. Đây là tài liệu
              tham khảo phục vụ giáo dục, không phải công cụ chẩn đoán hay phẫu
              thuật.
            </p>
            <h3>Nguồn dữ liệu</h3>
            <p>
              BodyParts3D, © The Database Center for Life Science, giấy phép CC
              Attribution 4.0 International.
            </p>
            <a
              href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html"
              target="_blank"
              rel="noreferrer"
            >
              Giấy phép bộ dữ liệu <ArrowUpRight size={14} />
            </a>
            <a
              href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html"
              target="_blank"
              rel="noreferrer"
            >
              Hình học và siêu dữ liệu gốc <ArrowUpRight size={14} />
            </a>
            <a
              href="https://academic.oup.com/nar/article/37/suppl_1/D782/1000752"
              target="_blank"
              rel="noreferrer"
            >
              Bài báo công bố nguồn <ArrowUpRight size={14} />
            </a>
            <a
              href="/human-atlas/ATTRIBUTION.md"
              target="_blank"
              rel="noreferrer"
            >
              Ghi công đầy đủ <ArrowUpRight size={14} />
            </a>
          </div>
        </aside>
      )}
    </main>
  );
}
