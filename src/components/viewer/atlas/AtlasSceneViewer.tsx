"use client";





import { useContent } from "@/components/content/ContentProvider";
import { bindContentSource } from "@/lib/content/source";
import { contentFetch } from '@/lib/content/fetch';
import { ContentSurface } from "@/components/content/ContentProvider";
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
import { createSceneLabels } from "@/lib/humanAtlas/sceneLabels";
import { localizedPartNames } from "@/lib/humanAtlas/partNames";
import PartLearning from './PartLearning';
import { partLearning } from '@/lib/humanAtlas/learning';
import { pick, type Loc } from "@/lib/homeContent";
import { bestByName, resolveMany, type VoiceAction } from "@/lib/voice/match";
import { useVoiceActions } from "@/lib/voice/registry";

const AtlasScene = dynamic(() => import("./AtlasScene"), { ssr: false });

const VIEWS: { id: View; label: string; key: string }[] = bindContentSource("data:src/components/viewer/atlas/AtlasSceneViewer.tsx#VIEWS", [
  { id: "three-quarter", label: "¾", key: "viewThreeQuarter" },
  { id: "front", label: "T", key: "viewFront" },
  { id: "side", label: "B", key: "viewSide" },
  { id: "back", label: "S", key: "viewBack" },
]);

/** Thông báo lỗi tải — ném từ trong `.then()` nên không dùng được hook ở đó. */
const ERR_LOAD = "ATLAS_LOAD_FAILED";

const CLIP_AXES: { id: ClipAxis; label: string }[] = bindContentSource("data:src/components/viewer/atlas/AtlasSceneViewer.tsx#CLIP_AXES", [
  { id: "x", label: "X" },
  { id: "y", label: "Y" },
  { id: "z", label: "Z" },
]);

export default function AtlasSceneViewer({ scene }: { scene: AtlasSceneDef }) {
  const cmsContent = useContent();
  const VIEWS = cmsContent.resolve(cmsSourceVIEWS());
  const CLIP_AXES = cmsContent.resolve(cmsSourceCLIP_AXES());

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
  const partNames=useMemo(()=>localizedPartNames(atlas?.parts??[],loc,cmsContent),[atlas,loc,cmsContent]);
  const [state, setState] = useState<SceneState>(initial);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  /** Thu gọn hai tấm điều khiển để nhường chỗ cho mô hình. */
  const [railOpen, setRailOpen] = useState(true);
  const [mobileLessons, setMobileLessons] = useState(false);
  const [dockOpen, setDockOpen] = useState(true);
  const detailRef = useRef<HTMLDivElement>(null);
  const partNumbers=useMemo(()=>new Map([...new Set(scene.groups.flatMap(group=>group.parts))].map((id,index)=>[id,index+1])),[scene]);

  /**
   * Nhãn chỉ dẫn: một nhãn cho mỗi nhóm, TRỪ nhóm mốc làm mờ sẵn (xương nền…)
   * — gắn nhãn cho nền chỉ làm rối hình.
   */
  const labels = useMemo<SceneLabel[]>(()=>createSceneLabels(scene,atlas?.parts??[],loc,{...state,selected:state.isolate?state.isolated??state.selected:state.selected}),[scene,atlas,loc,state]);

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
  }, [VIEWS, fadedAtStart, scene.layers]);

  useEffect(() => {
    const abort = new AbortController();
    contentFetch(ATLAS_MANIFEST, { signal: abort.signal })
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
    setMobileLessons(false);
    setState((s) => ({ ...s, selected: ids, isolate: false, isolated: undefined, rotate: false }));
  }, []);

  /** Bấm thẳng lên mô hình: tra ngược xem mảnh đó thuộc nhóm nào. */
  const pickPart = useCallback(
    (id: string) => {
      const g = scene.groups.find((x) => x.parts.includes(id));
      setOpenGroup(g?.key ?? null);
      setState((s) => ({
        ...s,
        selected: [id],
        isolated: s.isolate ? s.isolated ?? s.selected : undefined,
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

  /**
   * LỆNH GIỌNG NÓI CỦA TRANG MÔ HÌNH — Soma Bot hỏi sổ đăng ký này trước lệnh chung.
   * Mọi lệnh dùng setState dạng hàm nên không phải đăng ký lại mỗi lần render.
   */
  const voiceActions = useMemo<VoiceAction[]>(() => {
    const say = (vi: string, en: string, zh: string) => ({ ok: true, say: loc === "en" ? en : loc === "zh" ? zh : vi });
    const fail = (vi: string, en: string, zh: string) => ({ ...say(vi, en, zh), ok: false });
    const layerItems = (scene.layers ?? []).map((l) => ({ key: l.key, names: [l.name.vi, l.name.en, l.name.zh] }));
    const groupItems = scene.groups.map((g) => ({ key: g.key, names: [g.name.vi, g.name.en, g.name.zh, g.latin ?? ""] }));
    const nameOf = (names: { vi: string; en: string; zh: string }) => pick(names, loc);

    /** Bật/tắt theo LỚP nếu bài có lớp, không thì theo NHÓM cấu trúc. */
    const show = (arg: string, on: boolean) => {
      // "bật lớp cơ" khi bài có hai lớp cơ = bật CẢ HAI (resolveMany), đúng cách nói tiếng Việt.
      const lks = layerItems.length ? resolveMany(arg, layerItems) : [];
      if (lks.length) {
        const ls = scene.layers!.filter((x) => lks.includes(x.key));
        setLayersOn((v) => (on ? [...new Set([...v, ...lks])] : v.filter((k) => !lks.includes(k))));
        const names = (k: "vi" | "en" | "zh") => ls.map((l) => l.name[k]).join(", ");
        return on
          ? say(`Đã bật lớp ${names("vi")}.`, `${names("en")} on.`, `已打开${names("zh")}。`)
          : say(`Đã tắt lớp ${names("vi")}.`, `${names("en")} off.`, `已关闭${names("zh")}。`);
      }
      const gk = bestByName(arg, groupItems);
      if (!gk) return fail(`Bài này không có lớp hay cấu trúc "${arg}".`, `This lesson has no layer or structure "${arg}".`, `本课没有"${arg}"。`);
      const g = scene.groups.find((x) => x.key === gk)!;
      setState((s) => ({
        ...s,
        hidden: on ? s.hidden.filter((id) => !g.parts.includes(id)) : [...s.hidden, ...g.parts.filter((id) => !s.hidden.includes(id))],
      }));
      return on ? say(`Đã hiện ${nameOf(g.name)}.`, `Showing ${g.name.en}.`, `已显示${g.name.zh}。`) : say(`Đã ẩn ${nameOf(g.name)}.`, `Hid ${g.name.en}.`, `已隐藏${g.name.zh}。`);
    };
    const view = (v: View, vi: string, en: string, zh: string): VoiceAction["run"] => () => {
      setState((s) => ({ ...s, view: v, reset: s.reset + 1, rotate: false, explode: v === "front" ? s.explode : Math.min(s.explode, 0.8) }));
      return say(vi, en, zh);
    };

    return [
      // "bậc/bặc" và "tắc": cách nhận dạng tiếng Việt hay nghe lệch "bật" và "tắt".
      { id: "layer-on", phrases: ["bật lớp {x}", "bậc lớp {x}", "mở lớp {x}", "hiện lớp {x}", "hiện {x}", "bật {x}", "turn on {x}", "show {x}", "打开{x}层", "显示{x}"], run: (a) => show(a, true) },
      { id: "layer-off", phrases: ["tắt lớp {x}", "tắc lớp {x}", "ẩn lớp {x}", "ẩn {x}", "tắt {x}", "turn off {x}", "hide {x}", "关闭{x}层", "隐藏{x}"], run: (a) => show(a, false) },
      {
        id: "layers-all",
        phrases: ["bật tất cả các lớp", "bật hết các lớp", "hiện tất cả", "show all layers", "turn on all layers", "显示所有层"],
        run: () => (setLayersOn(scene.layers?.map((l) => l.key) ?? []), setState((s) => ({ ...s, hidden: [] })), say("Đã bật mọi lớp.", "All layers on.", "已打开所有层。")),
      },
      {
        id: "select",
        phrases: ["chọn {x}", "chỉ vào {x}", "cho xem {x}", "xem {x}", "select {x}", "highlight {x}", "选择{x}"],
        run: (a) => {
          const gk = bestByName(a, groupItems);
          if (!gk) return fail(`Không thấy "${a}" trong bài này.`, `No "${a}" in this lesson.`, `本课中没有"${a}"。`);
          const g = scene.groups.find((x) => x.key === gk)!;
          const layer = scene.layers?.find((l) => l.groups.includes(g.key));
          if (layer) setLayersOn((v) => (v.includes(layer.key) ? v : [...v, layer.key]));
          pickGroup(g.key, g.parts);
          return say(`Đang chỉ ${g.name.vi}.`, `Showing ${g.name.en}.`, `正在显示${g.name.zh}。`);
        },
      },
      { id: "explode", phrases: ["tách lớp", "tách rời", "tách ra", "explode", "分解"], run: () => (setState((s) => ({ ...s, explode: 1, rotate: false })), say("Đã tách rời.", "Exploded.", "已分解。")) },
      { id: "collapse", phrases: ["gộp lại", "gộp lớp", "ghép lại", "collapse", "合并"], run: () => (setState((s) => ({ ...s, explode: 0 })), say("Đã gộp lại.", "Collapsed.", "已合并。")) },
      { id: "view-front", phrases: ["nhìn phía trước", "nhìn trước", "mặt trước", "front view", "正面"], run: view("front", "Nhìn từ trước.", "Front view.", "正面观。") },
      { id: "view-back", phrases: ["nhìn phía sau", "nhìn sau", "mặt sau", "back view", "后面"], run: view("back", "Nhìn từ sau.", "Back view.", "后面观。") },
      { id: "view-side", phrases: ["nhìn bên", "nhìn nghiêng", "mặt bên", "side view", "侧面"], run: view("side", "Nhìn từ bên.", "Side view.", "侧面观。") },
      { id: "view-34", phrases: ["nhìn chéo", "ba phần tư", "three quarter view", "四分之三"], run: view("three-quarter", "Nhìn chéo ¾.", "Three-quarter view.", "四分之三视角。") },
      { id: "labels-on", phrases: ["hiện nhãn", "bật nhãn", "show labels", "显示标签"], run: () => (setState((s) => ({ ...s, showLabels: true })), say("Đã hiện nhãn.", "Labels on.", "已显示标签。")) },
      { id: "labels-off", phrases: ["ẩn nhãn", "tắt nhãn", "hide labels", "隐藏标签"], run: () => (setState((s) => ({ ...s, showLabels: false })), say("Đã ẩn nhãn.", "Labels off.", "已隐藏标签。")) },
      { id: "rotate", phrases: ["tự xoay", "xoay tròn", "auto rotate", "自动旋转"], run: () => (setState((s) => ({ ...s, rotate: true, explode: Math.min(s.explode, 0.3) })), say("Đang tự xoay.", "Rotating.", "正在旋转。")) },
      { id: "rotate-stop", phrases: ["dừng xoay", "thôi xoay", "stop rotating", "停止旋转"], run: () => (setState((s) => ({ ...s, rotate: false })), say("Đã dừng xoay.", "Stopped.", "已停止。")) },
      { id: "clip-on", phrases: ["bật mặt cắt", "cắt lát", "turn on section", "打开剖面"], run: () => (setState((s) => ({ ...s, clip: { ...s.clip, enabled: true } })), say("Đã bật mặt cắt.", "Section on.", "已打开剖面。")) },
      { id: "clip-off", phrases: ["tắt mặt cắt", "turn off section", "关闭剖面"], run: () => (setState((s) => ({ ...s, clip: { ...s.clip, enabled: false } })), say("Đã tắt mặt cắt.", "Section off.", "已关闭剖面。")) },
      {
        id: "reset",
        phrases: ["đặt lại", "về ban đầu", "làm lại từ đầu", "reset", "重置"],
        run: () => {
          setOpenGroup(null);
          setLayersOn(scene.layers?.filter((l) => l.on).map((l) => l.key) ?? []);
          setState((s) => ({ ...initial, reset: s.reset + 1 }));
          return say("Đã đặt lại.", "Reset.", "已重置。");
        },
      },
    ];
  }, [scene, loc, initial, pickGroup]);
  useVoiceActions("atlas-scene", voiceActions);

  const active = scene.groups.find((g) => g.key === openGroup) ?? null;
  const members = active?.parts.map((id) => parts.get(id)).filter((part) => !!part) ?? [];
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

  return <ContentSurface scope="src/components/viewer/atlas/AtlasSceneViewer.tsx">{(
    <main className={`atlas-studio atlas-scene ${thumb ? "is-thumb" : ""}`}>
      {atlas && (
        <AtlasScene
          atlas={atlas}
          state={{
            ...state,
            partNames,
            inspectorOpen: !!active,
            labels,
            hidden: layerHidden.length ? [...state.hidden, ...layerHidden] : state.hidden,
            showLabels: !!state.showLabels && !thumb,
            bare: thumb,
          }}
          onSelect={pickPart}
          onLabelPick={(key) => {
            const [groupKey,kind,detail]=key.split("::");
            const g=scene.groups.find(x=>x.key===groupKey);
            if(!g)return;
            setOpenGroup(g.key);
            setMobileLessons(false);
            if(kind==="part")setState(s=>({...s,selected:[detail],rotate:false}));
            else setState(s=>({...s,selected:kind==="landmark"&&s.selected.some(id=>g.parts.includes(id))?s.selected:g.parts,rotate:false}));
            if(kind==="landmark")requestAnimationFrame(()=>detailRef.current?.querySelector(`[data-landmark="${detail}"]`)?.scrollIntoView({block:"nearest",behavior:"smooth"}));
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

      <button type="button" className="mobile-lessons-trigger" aria-expanded={mobileLessons} onClick={()=>setMobileLessons(v=>!v)}>{pick({vi:"Cấu trúc & lớp",en:"Structures & layers",zh:"结构与分层"},loc)}</button>
      <aside className={`scene-rail ${railOpen ? "" : "is-collapsed"} ${mobileLessons ? "mobile-open" : ""}`}>
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
            {active.latin && <p className="context-note structure-latin">{active.latin}</p>}
            {active.parts.length > 1 && state.selected.length===1 && <p className="context-note structure-latin">{partNames[state.selected[0]]}</p>}
          </div>
          <div className="detail-scroll" key={active.key} ref={detailRef} data-lenis-prevent>
            {active.note && !(state.selected.length===1&&partLearning(state.selected[0],cmsContent)?.note?.[loc]) && (
              <p className="structure-description">{pick(active.note, loc)}</p>
            )}
            {state.selected.length===1&&parts.get(state.selected[0])&&<PartLearning part={parts.get(state.selected[0])!} locale={loc} showTopics={false} hideIdentity={active.parts.length===1}/>}
            {active.note&&state.selected.length===1&&partLearning(state.selected[0],cmsContent)?.note?.[loc]&&active.note[loc]!==partLearning(state.selected[0],cmsContent)?.note?.[loc]&&<details className="anatomy-learning"><summary>{pick({vi:'Ghi chú của bài học',en:'Lesson note',zh:'课程注释'},loc)}</summary><p>{active.note[loc]}</p></details>}
            {active.landmarks?.length ? (
              <section className="anatomy-landmarks" aria-label={pick({vi:"Mốc giải phẫu",en:"Anatomical landmarks",zh:"解剖标志"},loc)}>
                <h3>{pick({vi:"Mốc giải phẫu",en:"Anatomical landmarks",zh:"解剖标志"},loc)}</h3>
                <p className="context-note">{pick({vi:"Mốc có vị trí đối chiếu được gắn tag trên mô hình; các mốc còn lại nằm trong danh mục đọc thêm.",en:"Landmarks with mapped positions have model tags; the remaining landmarks are listed for reference.",zh:"具有映射位置的标志在模型上带有标签，其余标志列出供参考。"},loc)}</p>
                {active.landmarks.map((landmark,index)=>(
                  <article key={landmark.latin} data-landmark={index}>
                    <h4>{pick(landmark.name,loc)}</h4>
                    <i>{landmark.latin}</i>
                    <p>{pick(landmark.note,loc)}</p>
                    <a href={landmark.source} target="_blank" rel="noopener noreferrer">{landmark.sourceTitle??pick({vi:"Đối chiếu nguồn",en:"Reference",zh:"参考资料"},loc)} ↗</a>
                  </article>
                ))}
              </section>
            ) : null}
            <div className="structure-meta">
              <span>
                {t("partCount")}
                <strong>{state.selected.length} / {active.parts.length}</strong>
              </span>
            </div>
            {members.length > 0 && (
              <div className="member-list">
                <h3>{pick({vi:"Thành phần mô hình",en:"Model components",zh:"模型组成部分"},loc)}</h3>
                <p className="context-note">{pick({vi:"Chọn một thành phần để cô lập riêng. Mã mảnh giúp đối chiếu dữ liệu gốc; tên nhóm được dùng khi chưa có tên riêng đã biên tập.",en:"Select a component to isolate it. IDs identify source meshes; a group name is used when an individual term has not been curated.",zh:"选择组成部分以单独隔离。编号对应源网格；尚未编写单独术语时使用分组名称。"},loc)}</p>
                {members.map((part) => (
                  <button type="button" key={part.id} aria-pressed={state.isolate && state.selected.length===1 && state.selected[0]===part.id} onClick={()=>setState((s)=>({...s,selected:[part.id],isolate:true,isolated:[part.id],explode:0,rotate:false,hidden:s.hidden.filter(id=>id!==part.id)}))}>
                    <span><b className="member-tag-number">{partNumbers.get(part.id)}</b> {partNames[part.id]}<small>{part.id}</small></span><ChevronRight size={14}/>
                  </button>
                ))}
                {active.parts.length > 1 && <button type="button" onClick={()=>setState((s)=>({...s,selected:active.parts,isolate:true,isolated:active.parts,explode:0,rotate:false,hidden:s.hidden.filter(id=>!active.parts.includes(id))}))}>{pick({vi:"Cô lập cả nhóm",en:"Isolate the whole group",zh:"隔离整个组"},loc)}</button>}
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
                setState((s) => ({ ...s, isolate: !s.isolate, isolated: s.isolate ? undefined : s.selected, explode: 0 }))
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
  )}</ContentSurface>;
}

function cmsSourceVIEWS() { return VIEWS; }
function cmsSourceCLIP_AXES() { return CLIP_AXES; }
