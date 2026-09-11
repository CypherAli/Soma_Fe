"use client";

/**
 * Trang chuyên đề dựng trên atlas BodyParts3D.
 *
 * Dùng CHUNG bộ dựng hình `AtlasScene` với trang toàn thân, chỉ truyền thêm
 * `focus` là danh sách mã mảnh của scene. Nhờ vậy mọi trang chuyên đề tự động
 * có tách rời, mặt cắt lát, cô lập, ẩn/làm mờ — không phải xuất riêng file
 * .glb nào, và chất lượng hình đồng nhất với trang toàn thân.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Link } from "@/i18n/navigation";
import BrandSignature from "@/components/home/BrandSignature";
import ThemeToggle from "@/components/home/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  ArrowUpRight,
  ChevronRight,
  Focus,
  RotateCcw,
  RotateCw,
  Pause,
  X,
} from "./icons";
import {
  ATLAS_MANIFEST,
  DEFAULT_CLIP,
  type Atlas,
  type ClipAxis,
  type SceneLabel,
  type SceneState,
  type View,
} from "@/lib/humanAtlas/anatomy";
import {
  sceneFadedIds,
  sceneFrameIds,
  scenePartIds,
  sceneTint,
  type AtlasSceneDef,
} from "@/lib/humanAtlas/scenes/types";
import { pick, type Loc } from "@/lib/homeContent";

const AtlasScene = dynamic(() => import("./AtlasScene"), { ssr: false });

const VIEWS: { id: View; label: string; key: string }[] = [
  { id: "three-quarter", label: "¾", key: "viewThreeQuarter" },
  { id: "front", label: "T", key: "viewFront" },
  { id: "side", label: "B", key: "viewSide" },
  { id: "back", label: "S", key: "viewBack" },
];

/** Thông báo lỗi tải — ném từ trong `.then()` nên không dùng được hook ở đó. */
const ERR_LOAD = "ATLAS_LOAD_FAILED";

const CLIP_AXES: { id: ClipAxis; label: string }[] = [
  { id: "x", label: "X" },
  { id: "y", label: "Y" },
  { id: "z", label: "Z" },
];

export default function AtlasSceneViewer({ scene }: { scene: AtlasSceneDef }) {
  const t = useTranslations("atlas");
  const loc = useLocale() as Loc;
  const focus = useMemo(() => scenePartIds(scene), [scene]);
  const frame = useMemo(() => sceneFrameIds(scene), [scene]);
  const tint = useMemo(() => sceneTint(scene), [scene]);
  const fadedAtStart = useMemo(() => sceneFadedIds(scene), [scene]);
  const initial = useMemo<SceneState>(
    () => ({
      explode: 0,
      visible: [],
      selected: [],
      isolate: false,
      view: scene.view ?? "three-quarter",
      rotate: false,
      reset: 0,
      focus,
      frame,
      tint,
      hidden: [],
      faded: fadedAtStart,
      clip: scene.clip ? { ...DEFAULT_CLIP, ...scene.clip, enabled: true } : DEFAULT_CLIP,
      showLabels: true,
    }),
    [focus, frame, tint, fadedAtStart, scene.clip, scene.view],
  );

  const [atlas, setAtlas] = useState<Atlas | null>(null);
  const [state, setState] = useState<SceneState>(initial);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  /** Thu gọn hai tấm điều khiển để nhường chỗ cho mô hình. */
  const [railOpen, setRailOpen] = useState(true);
  const [dockOpen, setDockOpen] = useState(true);
  const detailRef = useRef<HTMLDivElement>(null);

  /**
   * Nhãn chỉ dẫn: một nhãn cho mỗi nhóm, TRỪ nhóm mốc làm mờ sẵn (xương nền…)
   * — gắn nhãn cho nền chỉ làm rối hình.
   */
  const labels = useMemo<SceneLabel[]>(() => {
    const faded = new Set(scene.fadedGroups ?? []);
    return scene.groups
      .filter((g) => !faded.has(g.key))
      .map((g) => ({ key: g.key, ids: g.parts, text: pick(g.name, loc), color: g.tint ?? "#9aa4ae" }));
  }, [scene, loc]);

  /**
   * `?thumb` — chế độ chụp ảnh bìa cho thư viện (scripts/atlas/thumb-atlas.mjs):
   * ẩn giao diện, ẩn hẳn nhóm mốc (lớp chấm mờ nhìn như nhiễu trên ảnh nhỏ),
   * mô hình lấp đầy khung. Đọc sau khi mount để không lệch HTML lúc hydrate.
   */
  /** Lớp đang bật (bài bộ phận). Nhóm thuộc lớp tắt bị ẩn — cộng vào `hidden`. */
  const [layersOn, setLayersOn] = useState<string[]>(
    () => scene.layers?.filter((l) => l.on).map((l) => l.key) ?? [],
  );
  const layerHidden = useMemo(() => {
    if (!scene.layers?.length) return [];
    const off = new Set(scene.layers.filter((l) => !layersOn.includes(l.key)).flatMap((l) => l.groups));
    return scene.groups.filter((g) => off.has(g.key)).flatMap((g) => g.parts);
  }, [scene, layersOn]);
  const [thumb, setThumb] = useState(false);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (!q.has("thumb")) return;
    // Bài vùng SAU (lưng, gáy, mông…) chụp bìa từ phía sau: `?thumb&view=back`.
    const view = VIEWS.find((v) => v.id === q.get("view"))?.id;
    // `&layers=all`: ảnh bìa bật đủ mọi lớp (sọ chỉ có lớp sọ não thì mặt trống hoác).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- đọc URL chỉ có được sau mount
    if (q.get("layers") === "all") setLayersOn(scene.layers?.map((l) => l.key) ?? []);
    setThumb(true);
    setState((s) => ({
      ...s,
      hidden: [...fadedAtStart],
      faded: [],
      ...(view ? { view, reset: s.reset + 1 } : {}),
    }));
  }, [fadedAtStart, scene.layers]);

  useEffect(() => {
    const abort = new AbortController();
    fetch(ATLAS_MANIFEST, { signal: abort.signal })
      .then((r) => {
        if (!r.ok) throw new Error(ERR_LOAD);
        return r.json();
      })
      .then((d) => setAtlas(d as Atlas))
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => abort.abort();
  }, []);

  const parts = useMemo(
    () => new Map(atlas?.parts.map((p) => [p.id, p])),
    [atlas],
  );

  /** Chọn cả nhóm nhãn — một cấu trúc giải phẫu thường gồm nhiều mảnh. */
  const pickGroup = useCallback((key: string, ids: string[]) => {
    setOpenGroup(key);
    setState((s) => ({ ...s, selected: ids, isolate: false, rotate: false }));
  }, []);

  /** Bấm thẳng lên mô hình: tra ngược xem mảnh đó thuộc nhóm nào. */
  const pickPart = useCallback(
    (id: string) => {
      const g = scene.groups.find((x) => x.parts.includes(id));
      setOpenGroup(g?.key ?? null);
      setState((s) => ({
        ...s,
        selected: g ? g.parts : [id],
        isolate: false,
        rotate: false,
      }));
    },
    [scene],
  );

  /**
   * `?focus=<khoá nhóm>` — trang Bệnh lý mở bài và CHỈ ĐÚNG bộ phận bị bệnh:
   * làm nổi nhóm đó, mở ghi chú, và nếu nhóm thuộc một lớp đang tắt thì bật lớp
   * ấy lên (bài bộ phận). Đọc sau mount để không lệch HTML lúc hydrate.
   */
  useEffect(() => {
    const key = new URLSearchParams(window.location.search).get("focus");
    const g = key ? scene.groups.find((x) => x.key === key) : undefined;
    if (!g) return;
    const layer = scene.layers?.find((l) => l.groups.includes(g.key));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- đọc URL chỉ có được sau mount
    if (layer) setLayersOn((v) => (v.includes(layer.key) ? v : [...v, layer.key]));
    // Làm mờ MỌI THỨ khác: bộ phận bị bệnh hay nằm khuất bên trong (van hai lá trong
    // lòng tim, đĩa đệm giữa hai đốt) — chỉ chọn thì nó vẫn bị che (đã chụp kiểm).
    // Người học bỏ mờ bằng nút Đặt lại hoặc nút Làm mờ trong ô ghi chú.
    const target = new Set(g.parts);
    setState((s) => ({ ...s, faded: s.focus.filter((id) => !target.has(id)) }));
    pickGroup(g.key, g.parts);
  }, [scene, pickGroup]);

  const reset = () => {
    setOpenGroup(null);
    setState((s) => ({ ...initial, reset: s.reset + 1 }));
  };

  const active = scene.groups.find((g) => g.key === openGroup) ?? null;
  const selectedNames = state.selected
    .map((id) => parts.get(id)?.name)
    .filter((n): n is string => !!n);
  const allHidden =
    state.selected.length > 0 &&
    state.selected.every((id) => state.hidden.includes(id));
  const allFaded =
    state.selected.length > 0 &&
    state.selected.every((id) => state.faded.includes(id));

  const toggleIds = (field: "hidden" | "faded", on: boolean) =>
    setState((s) => ({
      ...s,
      [field]: on
        ? s[field].filter((id) => !s.selected.includes(id))
        : [...s[field], ...s.selected.filter((id) => !s[field].includes(id))],
    }));

  return (
    <main className={`atlas-studio atlas-scene ${thumb ? "is-thumb" : ""}`}>
      {atlas && (
        <AtlasScene
          atlas={atlas}
          state={{
            ...state,
            inspectorOpen: !!active,
            labels,
            hidden: layerHidden.length ? [...state.hidden, ...layerHidden] : state.hidden,
            showLabels: !!state.showLabels && !thumb && !active,
            bare: thumb,
          }}
          onSelect={pickPart}
          onLabelPick={(key) => {
            const g = scene.groups.find((x) => x.key === key);
            if (g) pickGroup(g.key, g.parts);
          }}
          onProgress={(n) => {
            setProgress(n);
            if (n === 100) setError("");
          }}
          onError={setError}
        />
      )}
      <div className="vignette" />

      {/* Thanh header CÓ ĐƯỜNG PHÂN CÁCH cho trang chuyên đề.
          Khác trang toàn thân (tràn viền, không header): ở đây người dùng đi
          từ thư viện vào một bài cụ thể nên cần lối thoát rõ ràng, không thể
          chỉ có một dòng chữ nhỏ lẫn trong lớp nổi. */}
      <header className="scene-bar">
        <Link
          href="/giai-phau/lat-cat"
          className="scene-exit"
          aria-label={t("backToLibrary")}
        >
          <ChevronRight size={16} />
          <span>{t("backToLibrary")}</span>
        </Link>
        <BrandSignature />
        <div className="scene-bar-actions">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </header>

      {/* CỘT TRÁI — một khối layout duy nhất.
          Trước đây tiêu đề, bảng bài học và mặt cắt là ba tấm nổi neo tay bằng
          top/bottom riêng; mỗi lần đổi một cái là phải căn lại hai cái kia.
          Nay xếp bằng flex + gap: thêm bớt phần nào cũng tự giãn đúng chỗ. */}
      {/* Tiêu đề đứng NGOÀI cột thu gọn: thu gọn bảng điều khiển không có
          nghĩa là giấu luôn tên bài đang xem. */}
      <header className="scene-title">
        <h1>{pick(scene.title, loc)}</h1>
        <p className="scene-meta">
          {scene.latin ? <i>{scene.latin}</i> : null}
          {scene.latin ? <span>·</span> : null}
          {focus.length.toLocaleString(loc === "vi" ? "vi-VN" : loc)}{" "}
          {t("pieces")}
          <span>·</span> BodyParts3D
        </p>
      </header>

      <aside className={`scene-rail ${railOpen ? "" : "is-collapsed"}`}>
        <button
          type="button"
          data-slot="button"
          className="rail-toggle"
          aria-expanded={railOpen}
          aria-label={railOpen ? t("collapse") : t("expand")}
          title={railOpen ? t("collapse") : t("expand")}
          onClick={() => setRailOpen((v) => !v)}
        >
          <ChevronRight size={16} />
        </button>

        <div className="rail-body">
        {/* Chuyển lớp nằm TRONG cột (đầu cột) — đặt dưới tiêu đề thì đè lên thẻ bài học. */}
        {scene.layers?.length ? (
          <div className="layer-chips" role="group" aria-label={t("layers")}>
            {scene.layers.map((l) => {
              const on = layersOn.includes(l.key);
              return (
                <button
                  type="button"
                  data-slot="button"
                  key={l.key}
                  aria-pressed={on}
                  className={on ? "active" : ""}
                  onClick={() =>
                    setLayersOn((v) => (on ? v.filter((k) => k !== l.key) : [...v, l.key]))
                  }
                >
                  {pick(l.name, loc)}
                </button>
              );
            })}
          </div>
        ) : null}
          <section className="lesson-card" aria-label={pick(scene.title, loc)}>
            <div className="lesson-scroll">
              <p className="lesson-intro">{pick(scene.intro, loc)}</p>
              <div className="lesson-list">
                {scene.groups.map((g) => (
                  <button
                    type="button"
                    data-slot="button"
                    key={g.key}
                    className={`lesson-item ${openGroup === g.key ? "active" : ""}`}
                    onClick={() => pickGroup(g.key, g.parts)}
                  >
                    <span className="lesson-name">{pick(g.name, loc)}</span>
                    <span className="lesson-count">{g.parts.length}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="clip-card" aria-label={t("clip")}>
            <div className="clip-head">
              <span>{t("clip")}</span>
              <button
                type="button"
                role="switch"
                aria-checked={state.clip.enabled}
                aria-label={t("clip")}
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
              <div className="clip-body">
                <div className="clip-axes">
                  {CLIP_AXES.map((a) => (
                    <button
                      type="button"
                      data-slot="button"
                      key={a.id}
                      aria-pressed={state.clip.axis === a.id}
                      onClick={() =>
                        setState((v) => ({
                          ...v,
                          clip: { ...v.clip, axis: a.id },
                        }))
                      }
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
                    setState((v) => ({
                      ...v,
                      clip: { ...v.clip, percent: Number(e.target.value) },
                    }))
                  }
                />
                <div className="clip-foot">
                  <span>{state.clip.percent}%</span>
                  <button
                    type="button"
                    data-slot="button"
                    onClick={() =>
                      setState((v) => ({
                        ...v,
                        clip: { ...v.clip, keepPositive: !v.clip.keepPositive },
                      }))
                    }
                  >
                    {t("clipReverse")}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </aside>

      <nav className="view-controls glass" aria-label={t("viewThreeQuarter")}>
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
            title={t(v.key)}
            aria-label={t(v.key)}
          >
            <span>{v.label}</span>
          </button>
        ))}
        <i />
        <button
          type="button"
          data-slot="button"
          className={state.showLabels ? "active" : ""}
          aria-pressed={!!state.showLabels}
          title={t("labels")}
          aria-label={t("labels")}
          onClick={() => setState((s) => ({ ...s, showLabels: !s.showLabels }))}
        >
          <span>Aa</span>
        </button>
        <button
          type="button"
          data-slot="button"
          disabled={state.explode >= 0.4}
          className={state.rotate ? "active" : ""}
          title={t("autoRotate")}
          aria-label={state.rotate ? t("stopRotate") : t("autoRotate")}
          onClick={() => setState((s) => ({ ...s, rotate: !s.rotate }))}
        >
          {state.rotate ? <Pause size={17} /> : <RotateCw size={18} />}
        </button>
        <button
          type="button"
          data-slot="button"
          title={t("reset")}
          aria-label={t("reset")}
          onClick={reset}
        >
          <RotateCcw size={17} />
        </button>
      </nav>

      {/* Thu gọn thành một viên thuốc gọn hiển thị đúng giá trị hiện tại, chứ
          không phải trượt cả tấm to xuống để lại một hộp rỗng. */}
      {!dockOpen && (
        <button
          type="button"
          data-slot="button"
          className="dock-pill glass"
          aria-label={t("expand")}
          onClick={() => setDockOpen(true)}
        >
          <span>{t("explodeScene")}</span>
          <b>{Math.round(state.explode * 100)}%</b>
          <ChevronRight size={15} />
        </button>
      )}
      <div className="bottom-dock glass" hidden={!dockOpen}>
        <button
          type="button"
          data-slot="button"
          className="dock-icon"
          aria-label={t("reset")}
          title={t("reset")}
          onClick={reset}
        >
          <RotateCcw size={17} />
        </button>
        <div className="explode-control">
          <div className="explode-label">
            <label htmlFor="scene-explode">{t("explodeScene")}</label>
            <output htmlFor="scene-explode">
              {Math.round(state.explode * 100)}
              <span>%</span>
            </output>
          </div>
          <input
            id="scene-explode"
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
          aria-label={t("collapse")}
          title={t("collapse")}
          onClick={() => setDockOpen(false)}
        >
          <ChevronRight size={17} />
        </button>
      </div>

      <footer className="studio-footer">
        <span>
          {t("dragOrbit")} <b>·</b> {t("pinchZoom")} <b>·</b> {t("tapInspect")}
        </span>
        <a href="/human-atlas/ATTRIBUTION.md" target="_blank" rel="noreferrer">
          {t("credits")} <ArrowUpRight size={12} />
        </a>
      </footer>

      {progress < 100 && !error && (
        <div className="loading glass" role="status">
          <div>
            <strong>{t("loading")}</strong>
            <span>{progress}%</span>
            <div className="loading-track">
              <i style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className="loading glass error" role="alert">
          <p>{error === ERR_LOAD ? t("loadError") : error}</p>
        </div>
      )}

      {active && (
        <aside className="detail-sheet glass" aria-label={t("partCount")}>
          <button
            type="button"
            data-slot="button"
            className="sheet-close"
            aria-label={t("close")}
            onClick={() => {
              setOpenGroup(null);
              setState((s) => ({ ...s, selected: [], isolate: false }));
            }}
          >
            <X size={18} />
          </button>
          <div className="detail-header">
            <div className="detail-accent" style={{ background: "#b96760" }} />
            <div className="eyebrow">{pick(scene.title, loc)}</div>
            <h2 className="structure-title">{pick(active.name, loc)}</h2>
          </div>
          <div className="detail-scroll" ref={detailRef}>
            {active.latin && <p className="context-note">{active.latin}</p>}
            {active.note && (
              <p className="structure-description">{pick(active.note, loc)}</p>
            )}
            <div className="structure-meta">
              <span>
                {t("partCount")}
                <strong>{active.parts.length}</strong>
              </span>
            </div>
            {selectedNames.length > 0 && (
              <div className="member-list">
                <h3>{t("sourceNames")}</h3>
                {[...new Set(selectedNames)].slice(0, 30).map((n) => (
                  <p key={n}>{n}</p>
                ))}
              </div>
            )}
          </div>
          <div className="detail-actions">
            <div className="detail-quick">
              <button
                type="button"
                data-slot="button"
                aria-pressed={allHidden}
                onClick={() => toggleIds("hidden", allHidden)}
              >
                {allHidden ? t("unhide") : t("hide")}
              </button>
              <button
                type="button"
                data-slot="button"
                aria-pressed={allFaded}
                onClick={() => toggleIds("faded", allFaded)}
              >
                {allFaded ? t("unfade") : t("fade")}
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
              {state.isolate ? t("unisolate") : t("isolate")}
              <ChevronRight size={16} />
            </button>
          </div>
        </aside>
      )}
    </main>
  );
}
