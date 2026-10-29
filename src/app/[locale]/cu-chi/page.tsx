"use client";



import { useContent } from "@/components/content/ContentProvider";
import { ContentSurface } from "@/components/content/ContentProvider";
import { use, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import GestureArmScene, {
  defaultTransform,
  type LayerState,
} from "@/components/gesture/GestureArmScene";
import { CATS, type CatKey } from "@/lib/anatomy/layers";
import { type LayeredModel } from "@/lib/anatomy/layeredModels";
import {
  atlasLayerDefs,
  getControlModel,
  getGlbModel,
  initAtlasLayers,
  type AtlasLayerState,
  type ControlModel,
} from "@/lib/anatomy/controlModels";
import GestureAtlasScene from "@/components/gesture/GestureAtlasScene";
import { SYSTEMS } from "@/lib/humanAtlas/anatomy";
import { pick, type Loc } from "@/lib/homeContent";
import { LM, type Landmark } from "@/lib/gesture/handModel";
import { gestureText } from "@/lib/gesture/gestureText";
import { CursorSmoother } from "@/lib/gesture/oneEuro";
import {
  ModeStabilizer,
  PinchClick,
  analyze,
  readHand,
  angleDelta,
  deadzone,
  handRoll,
  handTwist,
  isPinching,
  twoHandSpan,
  zoomFromTwoHands,
  type HandMode,
} from "@/lib/gesture/gestures";
import {
  OPEN_SMOOTH_A,
  OPEN_SMOOTH_B,
  WONDER_SPREAD_MAX,
  WonderPoseDebouncer,
  WonderScene,
  WonderSnapDetector,
  nextPullState,
  opennessOf,
  smoothOpen,
  wonderBusy,
  wonderFitZoom,
  wonderPoseOf,
  type WonderPose,
  type WonderPull,
} from "@/lib/gesture/wondersnap";
import {
  HAND_BONES,
  probeHandWorker,
  useHandTracking,
  type FrameInfo,
  type FrameMeta,
  type TrackedHand,
} from "@/lib/gesture/useHandTracking";
import { DEFAULT_VISION_SLUG, isScanControlModel, scanControlModel, scanControlModelName } from "@/lib/vision/scanControlModel";
import { ScanOverlay, ScanSidebar, type ScanStage } from "@/components/vision/ScanPanels";
import {
  CROP_SIZE,
  assessCrop,
  boxToSourceRect,
  fitContain,
  type Box,
  type CropQuality,
} from "@/lib/vision/framing";
import { ScanMachine, type ScanMode, type ScanPhase } from "@/lib/vision/scanMachine";
import {
  VISION_MIN_SCORE,
  VISION_PARTS,
  getVisionPart,
  gpuTier,
  voiceNamesOf,
  isVisionPartKey,
  rankGuesses,
  withTiers,
  type VisionGuess,
  type VisionPartKey,
} from "@/lib/vision/parts";
import { atlasScenes } from "@/lib/humanAtlas/scenes/index";
import { bestByName, norm, resolveMany, type VoiceAction } from "@/lib/voice/match";
import { useVoiceActions } from "@/lib/voice/registry";

import { layeredFirst } from "@/lib/voice/globalCommands";
import { visionText } from "@/lib/vision/visionText";
import { detectPoseOnce, disposePose, preloadPose } from "@/lib/vision/poseOnce";
import { measureUpperBody, zoomForTwin, type TwinMeasurements } from "@/lib/vision/bodyMeasure";
import {
  disposePersonMask,
  segmentPersonOnce,
} from "@/lib/vision/personMask";
import {
  atlasRoll,
  mirrorFor,
  orientationFor,
  type ModelSide,
  type OrientationSnapshot,
} from "@/lib/vision/orientation";
import { recognise, type GpuAnswer, type ResultSource } from "@/lib/vision/recognise";
import {
  getConsent,
  getServerConsent,
  setConsent as writeConsent,
  subscribeConsent,
} from "@/lib/vision/consentStore";
import "../../home.css";

// VISION AI — MỘT TRANG, HAI CHẾ ĐỘ DÙNG CHUNG MỘT CAMERA
//
//   QUÉT       — hai tay ngắm khung quanh một bộ phận thật → nhận diện → mở mô hình
//   ĐIỀU KHIỂN — điều khiển mô hình giải phẫu bằng cử chỉ
//
// VÌ SAO GỘP CHUNG MỘT TRANG (đừng tách ra lại):
//   • Tách ra là xin quyền camera hai lần, mở hai luồng webcam, và nếu mở cả
//     hai tab thì luồng sau bị "camera đang bận".
//   • Mạch tự nhiên của người học là QUÉT ra bộ phận rồi ĐIỀU KHIỂN chính bộ
//     phận đó; hai trang riêng cắt đứt mạch ấy.
//   • Cả hai chế độ dùng CHUNG con trỏ tay, lực hút, vòng dwell và thuộc tính
//     `data-gesture-target`. Chỉ có bộ cử chỉ là tách bạch — mỗi lúc chỉ một
//     chế độ chạy — vì trộn hai bộ cử chỉ chính là thứ từng làm trang này
//     "cực kì khó kiểm soát".
//
// BỘ CỬ CHỈ (đúng bản thiết kế đã chốt):
//   1 tay, chỉ ngón trỏ   → con trỏ; chụm ngón cái vào trỏ = bấm, hoặc giữ yên
//   1 tay xoè cả bàn      → xoay mô hình theo bàn tay
//   1 tay nắm lại rồi kéo → di chuyển mô hình
//   HAI tay cùng chụm     → kéo ra/vào để phóng to / thu nhỏ
//   Vùng "Vứt" góc trên   → giữ con trỏ trong đó để ẩn cấu trúc đang chọn
//   Undo                  → lấy lại thứ vừa ẩn / vừa đổi
//
// BA NGUYÊN TẮC KHIẾN NÓ ĐIỀU KHIỂN ĐƯỢC (bản trước thiếu cả ba nên rất khó dùng):
//   1. MỖI VIỆC MỘT CỬ CHỈ RIÊNG. Zoom chuyển hẳn sang hai tay: một tay chỉ còn
//      trỏ / xoay / kéo, hết cảnh đang trỏ mà ngón cái xoè ra là mô hình tự
//      phóng to.
//   2. NEO + VÙNG CHẾT. Vào chế độ nào cũng chốt mốc tại chỗ, và bỏ qua phần
//      lệch nhỏ — tay run không làm mô hình nhúc nhích, và lúc vừa vượt ngưỡng
//      mô hình cũng không giật nảy.
//   3. CON TRỎ CÓ LỰC HÚT. Tới gần nút thì con trỏ tự dính vào tâm nút, nên
//      không phải giữ tay bất động mới bấm trúng.

/** Mô hình đổi nhanh ngay tại trang — trước đây mặc định kẹt ở cẳng tay, muốn
 * xem vùng khác bắt buộc phải quét bằng camera. Quét vẫn là đường chính, đây
 * chỉ là lối tắt cho người chưa bật camera. */
const QUICK_MODELS = [
  "nua-than-tren",
  "toan-than",
  "giai-phau-cang-tay",
  "giai-phau-canh-tay",
  "giai-phau-dai-vai",
  "giai-phau-dau",
  "giai-phau-co",
  "giai-phau-than",
] as const;

/** Chỉ số mốc cổ tay trong bộ 21 điểm bàn tay. */
const LM_WRIST = 0;

const DWELL_MS = 1200;
const TRASH_DWELL_MS = 2500; // "vứt" là hành động phá huỷ → cố ý bắt giữ lâu hơn
// Tay run + landmark ở 6–17 fps hay nhảy: nới tới 110 px để vòng giữ không bị
// reset oan khi đầu ngón giật giữa hai nhịp nhận diện.
const DWELL_MOVE_TOL_PX = 110;
/** Giữ quá 1/3 vòng thì KHOÁ mục tiêu: tay lệch nhẹ không mất công giữ. */
const DWELL_LOCK_AT = 0.35;
/** Điểm trỏ giữ lại trên màn hình bao lâu sau khi mất dấu tay (tay ra mép
 *  khung, nhận diện hụt 1–2 nhịp): đủ để tay quay lại là nối tiếp, không mất
 *  công giữ dwell từ đầu. */
const CURSOR_GRACE_MS = 700;
/** Con trỏ cách nút dưới ngần này thì bị hút vào. */
const MAGNET_PX = 46;
/**
 * Trạng thái lớp ban đầu cho một mô hình: mọi lớp CỦA MÔ HÌNH ĐÓ đều bật, lớp
 * nào model khai là "mờ sẵn" (thường là da) thì để mờ.
 *
 * Phải dựng theo từng mô hình chứ không dùng một danh sách cố định: mỗi vùng có
 * bộ lớp khác nhau (đầu có não và mắt, thân có nội tạng, cẳng tay thì không).
 * Bảng bật/tắt mà hiện lớp mô hình không có thì bấm vào chẳng có gì xảy ra.
 */
function initLayers(model: Pick<LayeredModel, "faded"> | null): LayerState {
  return Object.fromEntries(
    CATS.map((c) => [
      c.key,
      { visible: true, faded: !!model?.faded.includes(c.key) },
    ]),
  ) as LayerState;
}
const PAN_LIMIT = 0.28;
const ROT_STEP_MAX = 0.25;
/** Vùng chết: tay phải đi quá ngần này (tỉ lệ màn hình / radian) mới tính là cố ý. */
const PAN_DEAD = 0.035;
const ROT_DEAD = 0.12;
const TILT_DEAD = 0.09;
/** Vùng chết cho độ lật lòng bàn tay (z nhiễu hơn x/y nên để rộng hơn). */
const TWIST_DEAD = 0.07;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const CURSOR_COLOR: Record<HandMode, string> = {
  point: "#ffffff",
  zoom: "#b98cff",
  rotate: "#ffb347",
  pan: "#7fb2ff",
};

/**
 * Cấu trúc đang trỏ / đang chọn. `raw` là thứ đem đi ẩn khi "vứt": tên mesh gốc
 * với mô hình .glb, khoá NHÓM cấu trúc với mô hình atlas. Mô hình atlas không
 * có `cat` vì lớp của nó là lớp của bài học, không phải hệ Z-Anatomy.
 */
type Picked = { name: string; raw: string; cat?: CatKey };
type DwellState = { key: string; start: number; x: number; y: number; progress: number };
const newDwell = (): DwellState => ({ key: "", start: 0, x: 0, y: 0, progress: 0 });

/** Mốc neo của một tay khi vào chế độ xoay / kéo. */
type Anchor = {
  mode: HandMode;
  x: number;
  y: number;
  angle: number;
  rotY: number;
  rotX: number;
  /** Tung độ lòng bàn tay (chuẩn hoá) — riêng xoay kiểu WonderSnap. */
  py?: number;
  /** Góc vặn đã hiệu chỉnh aspect (handRoll) — neo xoay kiểu WonderSnap. */
  roll?: number;
  /** Độ lật lòng bàn tay lúc neo (handTwist) — vặn kiểu núm cửa. */
  twist?: number;
  /** Mốc giờ (ms) khung xoay gần nhất — easing theo thời gian thật. */
  t?: number;
};

/** Một bước có thể hoàn tác. */
type UndoStep = { label: string; undo: () => void };

function GuideLine({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return <ContentSurface scope="src/app/[locale]/cu-chi/page.tsx">{(
    <li>
      • {parts.map((p, i) => (i % 2 ? <b key={i}>{p}</b> : <span key={i}>{p}</span>))}
    </li>
  )}</ContentSurface>;
}

/**
 * Vòng openness quanh lòng bàn tay (y hệt WonderSnap): vòng mờ là toàn phần,
 * cung vàng là % bung hiện tại. `px` là hàm đổi landmark → pixel của canvas phủ
 * camera (đã tính phần object-cover), nên vòng ôm khít đúng lòng bàn tay.
 */
function drawWonderRingPx(
  ctx: CanvasRenderingContext2D,
  px: (nx: number, ny: number) => { x: number; y: number },
  wrist: { x: number; y: number },
  mid: { x: number; y: number },
  explode: number,
): void {
  const c = px((wrist.x + mid.x) / 2, (wrist.y + mid.y) / 2);
  const a = px(wrist.x, wrist.y);
  const b = px(mid.x, mid.y);
  const r = Math.max(14, Math.hypot(a.x - b.x, a.y - b.y) * 1.4);
  const k = Math.min(Math.max(explode, 0), 1);
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 0.95;
  ctx.strokeStyle = "#ffd166";
  ctx.shadowColor = "#ffd166";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(c.x, c.y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = "#ffd166";
  ctx.font = "700 12px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(`${Math.round(k * 100)}%`, c.x, c.y + r + 15);
  ctx.restore();
}

export default function GestureControlPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const cmsContent = useContent();
  const VISION_PARTS = cmsContent.resolve(cmsSourceVISION_PARTS());
  const CATS = cmsContent.resolve(cmsSourceCATS());
  const SYSTEMS = cmsContent.resolve(cmsSourceSYSTEMS());

  const { locale: rawLocale } = use(params);
  // Đọc `?che-do=quet` qua PROP chứ không qua window.location: prop này máy chủ
  // cũng thấy, nên HTML dựng sẵn và HTML trình duyệt dựng ra giống nhau. Đọc từ
  // window trong lúc render là nguyên nhân gây lỗi hydration đã gặp.
  const sp = use(searchParams);
  const initialMode = "control" as const;
  /** Bộ đếm nhận diện/vẽ là số đo cho người phát triển — chỉ hiện ở bản dev hoặc `?debug`. */
  const showDebug = "debug" in sp || process.env.NODE_ENV === "development";
  const locale = (["vi", "en", "zh"].includes(rawLocale) ? rawLocale : "vi") as Loc;
  const t = useMemo(() => gestureText(locale), [locale]);

  const controlFrameRef = useRef<HTMLIFrameElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlHandoffRef = useRef<string | null>(null);
  const camCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneBoxRef = useRef<HTMLDivElement | null>(null);

  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState<Picked | null>(null);
  const [picked, setPicked] = useState<Picked | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);
  const [undoDepth, setUndoDepth] = useState(0);
  /**
   * MÔ HÌNH ĐANG ĐIỀU KHIỂN. Trước đây trang này đóng đinh vào cẳng tay; nay
   * quét ra vùng nào thì nạp thẳng mô hình vùng đó vào đúng chế độ điều khiển
   * này — cả vòng từ quét tới bóc lớp không rời trang, không đụng chuột.
   */
  const [target, setTarget] = useState<ControlModel>(
    () => getControlModel(DEFAULT_VISION_SLUG)!,
  );
  /** Lớp của mô hình ATLAS đang điều khiển (mô hình .glb dùng `layers` bên dưới). */
  const [atlasLayers, setAtlasLayers] = useState<AtlasLayerState>(() =>
    target.kind === "atlas" ? initAtlasLayers(target.scene) : {},
  );
  /**
   * Bên người dùng vừa quét (true = trái). Giữ lại vì mô hình atlas chỉ biết
   * mình thuộc bên nào SAU KHI tải xong dữ liệu — lúc đó mới quyết định lật.
   */
  const scannedLeftRef = useRef<boolean | null>(null);
  /**
   * TỶ LỆ Ô VỪA CẮT. Mở mô hình từ một lần quét thì khung 3D lấy ĐÚNG tỷ lệ
   * của ô đã ngắm, chứ không phải khung mặc định của trang.
   *
   * Vì sao đáng làm: người dùng ngắm một ô ngang để lấy cả cánh tay, hoặc một ô
   * hẹp để lấy riêng con mắt — rồi mô hình lại hiện trong khung to đùng khác
   * hẳn hình dạng ấy thì đứt mạch. Khung 3D cùng tỷ lệ với ô vừa cắt khiến hai
   * bên đọc như MỘT thứ nhìn từ hai lớp: ảnh thật và cấu trúc bên dưới.
   */
  const [scanFrame, setScanFrame] = useState<{ aspect: number; shot: string } | null>(null);
  /** Mô hình đang được xoay theo góc bộ phận thật hay chưa. */
  const [oriented, setOriented] = useState(false);
  const scanFrameRef = useRef<HTMLDivElement | null>(null);
  const [layers, setLayers] = useState<LayerState>(() => initLayers(target.kind === "glb" ? target : null));

  // ---- chế độ quét (dùng chung camera và vòng lặp tay với chế độ điều khiển) ----
  const tv = useMemo(() => visionText(locale), [locale]);
  // Đọc ?che-do=quet ngay lúc dựng state: dùng useSearchParams sẽ buộc cả trang
  // phải bọc Suspense và mất khả năng dựng tĩnh, trong khi ta chỉ cần đọc MỘT
  // lần lúc vào trang.
  const [viewMode, setViewMode] = useState<"control" | "scan">(initialMode);
  const [stage, setStage] = useState<ScanStage>("scan");
  const [scanPhase, setScanPhase] = useState<ScanPhase>("idle");
  const [scanMode, setScanMode] = useState<ScanMode>("none");
  /** Kết quả đang hiện đến từ đâu, và mất bao lâu — hiện thẳng cho người dùng thấy. */
  const [source, setSource] = useState<ResultSource | null>(null);
  const [shot, setShot] = useState<string | null>(null);
  const [quality, setQuality] = useState<CropQuality | null>(null);
  const [guesses, setGuesses] = useState<VisionGuess[]>([]);
  const [failure, setFailure] = useState<"offline" | "failed" | "low" | null>(null);
  const [scanPart, setScanPart] = useState<VisionPartKey | null>(null);
  /** Người dùng đã chọn vùng chưa — để kết quả GPU về muộn không nhảy dưới tay họ. */
  const pickedPartRef = useRef<VisionPartKey | null>(null);
  /** Gợi ý đang hiện (bản ref cho các hàm gọi muộn) — để biết vùng vừa chọn ở bên nào. */
  const guessesRef = useRef<VisionGuess[]>([]);
  /** Bên (trái/phải) của vùng người dùng chọn, nếu tầng nhận diện biết — để xoay/lật đúng bên. */
  const pickedSideRef = useRef<"left" | "right" | undefined>(undefined);
  /**
   * SỐ HIỆU PHIÊN QUÉT. Tăng mỗi lần chụp mới hoặc bấm "Quét lại".
   *
   * Vì sao cần: nhận diện chạy bất đồng bộ và có cả nhánh "kết quả về muộn"
   * (Pose quá hạn, GPU quá hạn). Bấm Quét lại trong lúc đang chờ thì kết quả
   * của TẤM ẢNH CŨ sẽ rơi vào phiên mới — người dùng thấy gợi ý của tấm trước
   * dán lên tấm sau, không cách nào hiểu nổi. Mọi lần đẩy kết quả đều phải khai
   * mình thuộc phiên nào; khác phiên hiện tại thì bỏ.
   */
  const scanGenRef = useRef(0);
  /** Tỷ lệ + ảnh của lần chụp gần nhất, để khung 3D mở ra khớp hình dạng ấy. */
  const shotBoxRef = useRef<{ aspect: number; shot: string } | null>(null);
  /**
   * Mốc bàn tay + mốc pose của lần chụp gần nhất, giữ lại để suy GÓC ĐỘ khi
   * người dùng chọn vùng. Phải chụp lại đúng khoảnh khắc bấm máy chứ không đọc
   * lúc mở mô hình — lúc đó tay đã hạ xuống từ lâu.
   */
  const orientSnapRef = useRef<OrientationSnapshot>({});
  const [askConsent, setAskConsent] = useState(false);
  const consent = useSyncExternalStore(subscribeConsent, getConsent, getServerConsent);
  const machineRef = useRef(new ScanMachine());
  const scanPhaseRef = useRef<ScanPhase>("idle");
  const scanModeRef = useRef<ScanMode>("none");
  const modeRef = useRef<"control" | "scan">(viewMode);
  const stageRef = useRef<ScanStage>("scan");
  const busyRef = useRef(false);
  const consentRef = useRef(consent);
  useEffect(() => {
    modeRef.current = viewMode;
    stageRef.current = stage;
    consentRef.current = consent;
  }, [consent, stage, viewMode]);

  const cursorRef = useRef({ x: 0.5, y: 0.5, active: false });
  const transformRef = useRef(defaultTransform());
  const dwellsRef = useRef<Map<string, DwellState>>(new Map());
  const anchorsRef = useRef<Map<string, Anchor>>(new Map());
  const zoomAnchorRef = useRef<{ span: number; zoom: number } | null>(null);
  const hoveredRef = useRef<Picked | null>(null);
  const pickedRef = useRef<Picked | null>(null);
  // ---- CHẾ ĐỘ WONDERSNAP (tay = lệnh cảnh, thay hẳn bộ trỏ/xoay/kéo) ----
  // Mọi ref dưới đây sống ngoài vòng đời React để vòng lặp 60 fps đọc/ghi mà
  // không render lại; state chỉ đổi khi có SỰ KIỆN (pose đổi, gọi/tan model).
  const [wsMode, setWsMode] = useState<"classic" | "wonder">("wonder");
  const wsModeRef = useRef<"classic" | "wonder">("wonder");
  /** Hologram kiểu WonderSnap (chấm phát sáng thay model đặc) — chỉ trang này. */
  const [hologram, setHologram] = useState(true);
  const wsSnapRef = useRef(new WonderSnapDetector());
  const wsPoseRef = useRef(new WonderPoseDebouncer());
  const wsSceneRef = useRef(new WonderScene());
  /** Độ bung mục tiêu + lịch sử đỉnh 0,5 s (giữ khi chỉ/chụm, như WonderSnap). */
  const wsTargetRef = useRef(0);
  const wsExplHistRef = useRef<{ t: number; v: number }[]>([]);
  const [wsHidden, setWsHidden] = useState(false);
  const wsHiddenRef = useRef(false);
  /** Dữ liệu vòng openness (toạ độ video chuẩn hoá) để canvas camera vẽ. */
  const wsRingRef = useRef<{
    wx: number; wy: number; mx: number; my: number; explode: number;
    pose: WonderPose; ext: number; span: number; busy: boolean; target: number;
    roll: number | null; twist: number | null; rotY: number;
  } | null>(null);
  /** Độ xoè tay khung gần nhất (vẽ thanh meter, không qua state). */
  const wsOpenRef = useRef(0);
  const wsOpenBarRef = useRef<HTMLDivElement | null>(null);
  const wsExplBarRef = useRef<HTMLDivElement | null>(null);
  /** Zoom do NGƯỜI dùng chỉnh (lưu riêng để fit-bung không nuốt mất zoom tay). */
  const wsZoomBaseRef = useRef(1);
  const wsLastZoomRef = useRef(1);
  /** Độ hologram đã nội suy (đồng bộ với scene để fit-zoom theo độ tản thật). */
  const wsHoloEaseRef = useRef(0);
  const wsHoloTRef = useRef(0);
  const holoUiRef = useRef(false);
  useEffect(() => {
    holoUiRef.current = hologram;
  });
  /** Part đang bị pinch-kéo (kiểu WonderSnap) — state để render scene. */
  const [wsPull, setWsPull] = useState<WonderPull>(null);
  const wsPullRef = useRef<WonderPull>(null);
  /** Cạnh chụm ở kiểu wonder khi chưa chọn gì = cú bấm (nhánh point tiêu thụ). */
  const wsPinchEdgeRef = useRef(false);
  /** Pose thô khung trước — neo xoay chỉ lập lại khi VỪA mở tay ra. */
  const wsPrevRawRef = useRef<WonderPose>("none");
  /**
   * Góc vặn tay đã mượt (handRoll + aspect, kèm giờ đo) — đúng `ctl.roll` của
   * WonderSnap: tay vừa xuất hiện / mất dấu quá 0,5 s thì chốt ngay, còn lại
   * trộn một nửa vào giá trị cũ để góc không giật giữa các lần nhận diện.
   */
  const wsRollRef = useRef<{ v: number; t: number } | null>(null);
  /** Độ lật lòng bàn tay đã mượt — cùng luật cập nhật như wsRollRef. */
  const wsTwistRef = useRef<{ v: number; t: number } | null>(null);
  const setWsPullState = (v: WonderPull) => {
    wsPullRef.current = v;
    setWsPull(v);
  };
  const stabilizersRef = useRef<Map<string, ModeStabilizer>>(new Map());
  const pinchRef = useRef<Map<string, PinchClick>>(new Map());
  const smoothRef = useRef<Map<string, CursorSmoother>>(new Map());
  const flashRef = useRef<Map<string, number>>(new Map());
  /**
   * ĐỊNH DANH TAY BÁM THEO VỊ TRÍ (trackId → cổ tay khung trước). Nhãn
   * trái/phải của MediaPipe hay lật (tay phải giơ trỏ vẫn bị đọc "Left" rồi
   * lại "Right") — mọi map trạng thái (ổn định chế độ, mượt, chụm, dwell, neo)
   * khoá theo trackId này nên lật nhãn cũng không mất dấu, tay nào cũng nhận
   * như nhau. Nhãn gốc chỉ còn dùng để HIỂN THỊ (A/B) và chọn tay ưu tiên.
   */
  const tracksRef = useRef<Map<string, { x: number; y: number; t: number }>>(new Map());
  const trackSeqRef = useRef(0);
  /** Điểm trỏ cuối cùng còn thấy — vẽ mờ dần trong lúc mất dấu tay. */
  const lastCursorRef = useRef<{ x: number; y: number; mode: HandMode; until: number } | null>(null);
  const undoRef = useRef<UndoStep[]>([]);
  const textRef = useRef(t);
  useEffect(() => {
    textRef.current = t;
  }, [t]);

  const pushUndo = useCallback((step: UndoStep) => {
    // Giữ 20 bước: đủ để sửa sai, không phình bộ nhớ.
    undoRef.current = [...undoRef.current.slice(-19), step];
    setUndoDepth(undoRef.current.length);
  }, []);

  /**
   * NGHI THỨC TIA QUÉT (tầng 1 của gương X-quang) — khai báo ref/state ở đây
   * (trước mọi callback dùng tới), còn `startRitual` nằm sau `resetView` vì nó
   * gọi `choose`/`handleHover`/`resetView`.
   *
   * Bật camera là đếm ngược 3-2-1 rồi tia laser quét từ đầu xuống hết nửa thân
   * trên trên luồng video, đồng thời mô hình 3D reveal theo ĐÚNG tiến trình ấy
   * (qua revealRef — khung 3D đọc ref này mỗi khung hình, xem GestureAtlasScene).
   * Tiến trình quét đi qua REF, state chỉ đổi ở các mốc (số đếm, bắt đầu/kết
   * thúc quét) — đúng luật "không setState mỗi khung hình" của trang này.
   */
  type RitualPhase = "idle" | "count" | "scan" | "done";
  const ritualRef = useRef({ phase: "idle" as RitualPhase, progress: 0 });
  const revealRef = useRef({ active: false, progress: 0 });
  /** Số đo thô từ lần pose lúc đếm ngược — dùng khi quét xong để dựng hồ sơ. */
  const twinRawRef = useRef<TwinMeasurements | null>(null);
  /** Hồ sơ song sinh: số đo + zoom đã áp, có lưu máy (lần sau vào vẫn còn). */
  const TWIN_KEY = "soma-twin/v1";
  const [twin, setTwin] = useState<{ m: TwinMeasurements; zoom: number } | null>(() => {
    try {
      if (typeof window === "undefined") return null;
      const raw = window.localStorage.getItem(TWIN_KEY);
      if (!raw) return null;
      const p = JSON.parse(raw) as { m: TwinMeasurements; zoom: number };
      if (!p?.m?.shoulderW || !(p.zoom > 0)) return null;
      return p;
    } catch {
      return null;
    }
  });
  /**
   * Mặt nạ người + khung vuông đã segment (pixel, theo khung video). Tia laser
   * và lớp dim nền ánh xạ qua khung vuông này nên khớp khít mọi tỉ lệ khung
   * hình — không đoán mò kích thước mask trả về.
   */
  const [ritualCount, setRitualCount] = useState(0);
  const [ritualScanning, setRitualScanning] = useState(false);
  const ritualTimers = useRef<number[]>([]);

  const undo = useCallback(() => {
    const step = undoRef.current.pop();
    setUndoDepth(undoRef.current.length);
    step?.undo();
  }, []);

  useEffect(() => {
    (window as unknown as { somaGesture?: unknown }).somaGesture = transformRef.current;
  }, []);

  // Model tư thế + segmentation chiếm bộ nhớ GPU đáng kể; rời trang thì trả lại.
  useEffect(
    () => () => {
      disposePose();
      disposePersonMask();
    },
    [],
  );

  /**
   * Co khung 3D cho ĐÚNG tỷ lệ ô vừa cắt, đo bằng JavaScript.
   *
   * Đã thử `aspect-ratio` của CSS và ĐO THẤY NÓ HỎNG: khi cả chiều rộng lẫn
   * chiều cao đều bị chặn (`h-full` + `max-w-full`), trình duyệt bỏ tỷ lệ để
   * tôn trọng ràng buộc — ô ngang tỷ lệ 5,8 ra thành 0,4. Ghi thẳng kích thước
   * bằng pixel thì không có gì để hiểu nhầm.
   *
   * Ghi trực tiếp vào style chứ không qua state: đây là việc đồng bộ với bố cục
   * trình duyệt, đặt vào state sẽ thành một vòng render thừa mỗi lần kéo cửa sổ.
   */
  useEffect(() => {
    const el = scanFrameRef.current;
    const box = sceneBoxRef.current;
    if (!el || !box || !scanFrame) return;
    const fit = () => {
      const r = box.getBoundingClientRect();
      const availW = Math.max(1, r.width - 16);
      const availH = Math.max(1, r.height - 16);
      let w = availW;
      let h = w / scanFrame.aspect;
      if (h > availH) {
        h = availH;
        w = h * scanFrame.aspect;
      }
      el.style.width = `${Math.round(w)}px`;
      el.style.height = `${Math.round(h)}px`;
      // R3F đo khung bằng ResizeObserver; đổi cỡ xong bắn thêm một sự kiện
      // resize cho chắc, đúng như lưới an toàn đã dùng ở useBoxReady.
      window.dispatchEvent(new Event("resize"));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => ro.disconnect();
  }, [scanFrame]);


  // Vào chế độ quét là nạp trước model tư thế NGAY, không đợi bật camera: đo
  // thật thấy lần gọi đầu mất 10,8 giây (tải + dựng 5,5 MB), trong khi mỗi lần
  // suy luận sau đó chỉ 25–41 ms. Nạp sớm thì cả mười giây ấy trôi qua trong
  // lúc người dùng còn đang đọc hướng dẫn và bật camera.
  useEffect(() => {
    if (viewMode === "scan") preloadPose();
  }, [viewMode]);

  const toggleLayer = useCallback(
    (key: CatKey, field: "visible" | "faded") => {
      setLayers((s) => ({ ...s, [key]: { ...s[key], [field]: !s[key][field] } }));
      pushUndo({
        label: `${key}:${field}`,
        undo: () => setLayers((s) => ({ ...s, [key]: { ...s[key], [field]: !s[key][field] } })),
      });
    },
    [pushUndo],
  );

  /** Bật/tắt, làm mờ một LỚP BÀI HỌC của mô hình atlas — cùng cơ chế hoàn tác với lớp .glb. */
  const toggleAtlasLayer = useCallback(
    (key: string, field: "visible" | "faded") => {
      const flip = (s: AtlasLayerState): AtlasLayerState => {
        const cur = s[key] ?? { visible: true, faded: false };
        return { ...s, [key]: { ...cur, [field]: !cur[field] } };
      };
      setAtlasLayers(flip);
      pushUndo({ label: `${key}:${field}`, undo: () => setAtlasLayers(flip) });
    },
    [pushUndo],
  );

  /** Mô hình atlas vừa tải xong và báo nó thuộc bên nào: giờ mới biết có phải lật gương không. */
  const onAtlasSide = useCallback((side: ModelSide) => {
    transformRef.current.mirror = mirrorFor(scannedLeftRef.current, side);
  }, []);

  const handleHover = useCallback((info: Picked | null) => {
    if (hoveredRef.current?.raw === info?.raw) return;
    hoveredRef.current = info;
    setHovered(info);
  }, []);

  const choose = useCallback((info: Picked | null) => {
    pickedRef.current = info;
    setPicked(info);
    // Đổi/bỏ chọn thì thôi kéo part cũ (khoá cũ không còn nghĩa).
    wsPullRef.current = null;
    setWsPull(null);
  }, []);

  const resetView = useCallback(() => {
    const tr = transformRef.current;
    tr.rotX = 0;
    tr.rotY = 0;
    // Xoá cả góc nghiêng và phép lật do lần quét đặt vào: "về vị trí ban đầu"
    // mà vẫn còn nghiêng thì nút ấy nói dối.
    tr.rotZ = 0;
    tr.mirror = false;
    // Quên luôn bên đã quét: mô hình atlas tải xong muộn sẽ không lật lại sau lưng người dùng.
    scannedLeftRef.current = null;
    setOriented(false);
    tr.zoom = 1;
    wsZoomBaseRef.current = 1;
    wsLastZoomRef.current = 1;
    tr.panX = 0;
    tr.panY = 0;
    // Mốc neo cũ vô nghĩa sau khi về vị trí gốc — xoá để lần giơ tay kế tiếp neo
    // lại từ đầu, nếu không mô hình sẽ nhảy ngược về chỗ cũ.
    anchorsRef.current.clear();
    zoomAnchorRef.current = null;
  }, []);

  const startRitual = useCallback(() => {
    // Đo pose MỘT lần TRONG LÚC đếm ngược chỉ để lấy số đo song sinh (dựng hồ
    // sơ twin lúc quét xong). Tia quét full khung nên không cần bbox — pose
    // về sớm hay muộn, lần đầu hay quét lại, tia nhìn y hệt nhau.
    // KHÔNG cắt silhouette người ra nền đen nữa: mask không bao trọn được tóc,
    // bàn tay, vai áo thì càng cắt càng xấu — cứ để nguyên video mà quét tia.
    twinRawRef.current = null;
    preloadPose();
    const v = videoRef.current;
    if (v && v.videoWidth > 0) {
      void detectPoseOnce(v).then((r) => {
        if (ritualRef.current.phase !== "count" && ritualRef.current.phase !== "scan") return;
        // Số đo song sinh từ ĐÚNG lần pose này (không detect thêm lần nữa).
        const tm = measureUpperBody(r.landmarks, v.videoWidth, v.videoHeight);
        if (tm) twinRawRef.current = tm;
      });
    }
    // Quét là dựng nửa thân trên — mọi thứ của mô hình cũ đều bỏ.
    const model = getControlModel("nua-than-tren");
    if (model) {
      setTarget(model);
      if (model.kind === "glb") setLayers(initLayers(model));
      else setAtlasLayers(initAtlasLayers(model.scene));
      setHidden([]);
      undoRef.current = [];
      setUndoDepth(0);
      choose(null);
      handleHover(null);
      resetView();
    }
    ritualTimers.current.forEach((id) => window.clearTimeout(id));
    ritualTimers.current = [];
    ritualRef.current = { phase: "count", progress: 0 };
    revealRef.current = { active: false, progress: 0 };
    setRitualScanning(false);
    [3, 2, 1].forEach((n, i) => {
      ritualTimers.current.push(window.setTimeout(() => setRitualCount(n), i * 700));
    });
    ritualTimers.current.push(
      window.setTimeout(() => {
        setRitualCount(0);
        ritualRef.current.phase = "scan";
        revealRef.current.active = true;
        setRitualScanning(true);
        const t0 = performance.now();
        // 4,2 giây cho cả nửa thân trên: tia đi CHẬM, từng lát nhỏ (~1 hàng
        // mask mỗi vài khung hình) để mắt kịp thấy "đang quét tới đâu".
        const DUR = 4200;
        const tick = () => {
          // Tắt cam giữa chừng thì phase đã về idle — dừng luôn, không quét nữa.
          if (ritualRef.current.phase !== "scan") return;
          const p = Math.min(1, (performance.now() - t0) / DUR);
          ritualRef.current.progress = p;
          revealRef.current.progress = p;
          if (p < 1) requestAnimationFrame(tick);
          else {
            ritualRef.current.phase = "done";
            revealRef.current.active = false;
            setRitualScanning(false);
            // DỰNG HỒ SƠ SONG SINH: số đo từ lần pose lúc đếm ngược → zoom
            // model cho cao đúng bằng tỉ lệ người chiếm trên màn hình → lưu
            // máy để lần sau vào vẫn còn. Không đo được thì bỏ qua, model giữ
            // khung fit mặc định — không đoán mò.
            try {
              const tm = twinRawRef.current;
              const sbox = sceneBoxRef.current;
              if (tm && sbox && sbox.clientWidth > 0 && sbox.clientHeight > 0) {
                const z = zoomForTwin(tm, sbox.clientWidth, sbox.clientHeight);
                transformRef.current.zoom = z;
                const prof = { m: tm, zoom: z };
                setTwin(prof);
                try {
                  window.localStorage.setItem(TWIN_KEY, JSON.stringify(prof));
                } catch {
                  /* bộ nhớ đầy/chặn thì thôi */
                }
                console.info(
                  `[vision-ai] twin: shoulder=${tm.shoulderW.toFixed(0)}px torso=${tm.torso.toFixed(0)}px ` +
                    `armL=${tm.armL.toFixed(0)}px armR=${tm.armR.toFixed(0)}px zoom=x${z.toFixed(2)}`,
                );
              }
            } catch {
              /* hồ sơ là phần thưởng thêm — hỏng thì thôi */
            }
          }
        };
        requestAnimationFrame(tick);
      }, 3 * 700),
    );
  }, [choose, handleHover, resetView]);

  // Bật cam là quét; tắt cam là huỷ nghi thức (kể cả rAF cũng tự dừng nhờ
  // kiểm tra phase trong tick). setState hoãn qua setTimeout: lint cấm gọi
  // setState đồng bộ ngay trong effect (cascading renders).
  useEffect(() => {
    ritualTimers.current.forEach((id) => window.clearTimeout(id));
    ritualTimers.current = [];
    if (enabled) {
      const id = window.setTimeout(() => startRitual(), 0);
      return () => window.clearTimeout(id);
    }
    ritualRef.current = { phase: "idle", progress: 0 };
    revealRef.current = { active: false, progress: 0 };
    const id = window.setTimeout(() => {
      setRitualCount(0);
      setRitualScanning(false);
    }, 0);
    return () => {
      ritualTimers.current.forEach((t) => window.clearTimeout(t));
      window.clearTimeout(id);
    };
  }, [enabled, startRitual]);

  /** "Vứt" cấu trúc đang chọn: ẩn đi, và ghi lại để Undo lấy lại được. */
  const dropPicked = useCallback(() => {
    const target = pickedRef.current ?? hoveredRef.current;
    if (!target) return;
    setHidden((h) => (h.includes(target.raw) ? h : [...h, target.raw]));
    choose(null);
    pushUndo({
      label: target.name,
      undo: () => {
        setHidden((h) => h.filter((n) => n !== target.raw));
        choose(target);
      },
    });
  }, [choose, pushUndo]);

  const rescan = useCallback(() => {
    // Sang phiên mới: mọi kết quả đang bay của phiên cũ từ đây bị bỏ.
    scanGenRef.current += 1;
    busyRef.current = false;
    machineRef.current.reset();
    scanPhaseRef.current = "idle";
    setScanPhase("idle");
    // Trả cả CHẾ ĐỘ ô về "chưa ngắm gì": quét lại mà câu nhắc dưới khung vẫn
    // giữ câu của lần ngắm tay trước ("giữ yên bàn tay…") thì nhìn khác hẳn
    // lúc mới vào ("giơ một tay…"). Lúc mới vào scanMode cũng là "none".
    scanModeRef.current = "none";
    setScanMode("none");
    setStage("scan");
    stageRef.current = "scan";
    setShot(null);
    setQuality(null);
    guessesRef.current = [];
    setGuesses([]);
    setFailure(null);
  }, []);

  /**
   * QUÉT LẠI = QUÉT NHƯ LÚC MỚI VÀO. Hai nút "Quét lại" (header + góc dưới
   * khung) trước đây mỗi nút làm nửa việc: nút header chỉ chạy tia mà để
   * nguyên gợi ý/ảnh cũ ở dưới, nút dưới chỉ xoá kết quả mà không chạy tia.
   * Gộp lại: xoá sạch phiên cũ (rescan) rồi đếm ngược + quét tia (startRitual).
   */
  const fullRescan = useCallback(() => {
    rescan();
    startRitual();
  }, [rescan, startRitual]);

  /** Hỏi dịch vụ GPU. Trả về null nếu không dùng được (chưa cấu hình, lỗi, mạng hỏng). */
  const askGpu = useCallback(async (dataUrl: string): Promise<GpuAnswer> => {
    try {
      const res = await fetch("/api/vision/identify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      const data = (await res.json().catch(() => ({}))) as { results?: unknown; error?: string; mode?: string };
      if (!res.ok) return { rows: null, offline: data.error === "vision-offline" };
      const confident = rankGuesses(data.results, 3).filter((g) => g.score >= VISION_MIN_SCORE);
      if (confident.length === 0) return { rows: null };
      // Mức tin cậy theo CHẾ ĐỘ của dịch vụ: zero-shot chưa hiệu chỉnh thì không được nói "khớp rõ".
      return { rows: withTiers(confident, gpuTier(confident[0].score, data.mode === "knn" ? "knn" : "zero-shot")) };
    } catch {
      return { rows: null };
    }
  }, []);

  /**
   * Nối bộ điều phối hai tầng (`lib/vision/recognise.ts`) với trang.
   * Mọi logic nhánh nằm bên đó và có kiểm thử riêng; ở đây chỉ còn dây nối.
   */
  const runRecognition = useCallback(
    (
      dataUrl: string,
      full: HTMLCanvasElement,
      box: Box,
      aspect: number,
      handWrist: Landmark | null,
      gen: number,
    ) => {
      // Chạy Pose MỘT lần rồi dùng chung: bộ điều phối cần nó để đoán vùng, còn
      // trang cần nó để suy góc độ. Gọi hai lần là tốn gấp đôi mà chẳng thêm gì.
      const posePromise = detectPoseOnce(full);
      void posePromise.then((p) => {
        if (gen !== scanGenRef.current) return;
        if (p.landmarks.length) orientSnapRef.current.pose = p.landmarks;
      });
      return recognise(box, aspect, handWrist, {
        pose: () => posePromise,
        gpu: () => askGpu(dataUrl),
        wait: (ms) => new Promise((r) => setTimeout(r, ms)),
        picked: () => pickedPartRef.current !== null,
        emit: ({ guesses, source: src, failure: fail }) => {
          if (gen !== scanGenRef.current) return; // kết quả của phiên đã cũ
          guessesRef.current = guesses;
          setGuesses(guesses);
          setSource(src);
          setFailure(fail);
        },
      });
    },
    [askGpu],
  );

  /**
   * Cắt mẩu ảnh VUÔNG từ khung hình gốc (720p), kiểm chất lượng ngay trên máy,
   * rồi mới gửi đi — và chỉ gửi khi người dùng đã đồng ý.
   */
  useEffect(()=>{
    type Tracking={active:boolean;aspect:number;stamp:number;hand:number[][]|null;second:number[][]|null};
    type Bridge={scanTracking:()=>Tracking;scanSnapshot:()=>{canvas:HTMLCanvasElement;hand:number[][]|null;second:number[][]|null}|null;scanUI:(active:boolean)=>void;scanFrame:(state:ReturnType<ScanMachine['update']>)=>void};
    let cancelled=false,inFlight=0,generation=0,active=false,raf=0,lastStamp=-1,sweepStart=0,hadHands=false;
    const machine=new ScanMachine();
    const bridge=()=> (controlFrameRef.current?.contentWindow as (Window & {wonderSnap?:Bridge})|null)?.wonderSnap;
    const landmarks=(raw:number[][])=>raw.map(p=>({x:p[0],y:p[1],z:p[2]||0}));
    const stop=()=>{active=false;generation++;inFlight=0;cancelAnimationFrame(raf);bridge()?.scanUI(false);machine.reset();};
    const captureIntegrated=async(box:Box,mode:string)=>{
      if(inFlight)return;const request=++generation;inFlight=request;active=false;
      const frame=controlFrameRef.current?.contentWindow;
      const reply=(data:object)=>{if(!cancelled&&generation===request)frame?.postMessage({type:'soma-scan-result',...data},location.origin);};
      const snapshot=bridge()?.scanSnapshot();
      if(!snapshot){reply({error:'Camera đã tắt. Bật camera rồi quét lại.'});inFlight=0;return;}
      try{
        const rect=boxToSourceRect(box,snapshot.canvas.width,snapshot.canvas.height);
        const crop=document.createElement('canvas');crop.width=CROP_SIZE;crop.height=CROP_SIZE;
        const ctx=crop.getContext('2d',{willReadFrequently:true});if(!ctx)throw Error('No crop context');
        const fit=fitContain(rect.sw,rect.sh,CROP_SIZE);ctx.fillStyle='#727272';ctx.fillRect(0,0,CROP_SIZE,CROP_SIZE);ctx.drawImage(snapshot.canvas,rect.sx,rect.sy,rect.sw,rect.sh,fit.dx,fit.dy,fit.dw,fit.dh);
        const quality=assessCrop(ctx.getImageData(fit.dx,fit.dy,fit.dw,fit.dh),Math.max(rect.sw,rect.sh),Math.min(rect.sw,rect.sh));
        const shot=crop.toDataURL('image/jpeg',.85);
        if(!quality.ok){const reasons={'too-small':'Vùng quá nhỏ: đưa lại gần hoặc mở rộng khung.','too-dark':'Ảnh quá tối: tăng ánh sáng.','too-bright':'Ảnh quá sáng: tránh ánh đèn chiếu thẳng.','blurry':'Ảnh mờ: giữ yên và tránh đưa quá sát camera.',ok:''};reply({shot,error:reasons[quality.reason]});return;}
        const wrist=mode==='hand'&&snapshot.hand?landmarks(snapshot.hand)[0]:null;const full=document.createElement('canvas');full.width=640;full.height=Math.round(640*snapshot.canvas.height/snapshot.canvas.width);full.getContext('2d')?.drawImage(snapshot.canvas,0,0,full.width,full.height);
        await recognise(box,snapshot.canvas.width/snapshot.canvas.height,wrist,{
          pose:()=>detectPoseOnce(full),
          gpu:async()=>{
            if(getConsent()!==true||generation!==request)return {rows:null};
            let image=shot;
            try{const mask=await segmentPersonOnce(crop);if(mask&&generation===request){ctx.save();ctx.globalCompositeOperation='destination-in';ctx.drawImage(mask.shape,0,0,CROP_SIZE,CROP_SIZE);ctx.restore();ctx.save();ctx.globalCompositeOperation='destination-over';ctx.fillStyle='#000';ctx.fillRect(0,0,CROP_SIZE,CROP_SIZE);ctx.restore();image=crop.toDataURL('image/jpeg',.85);}}catch{/* Original crop remains usable. */}
            if(getConsent()!==true||generation!==request)return {rows:null};return askGpu(image);
          },
          wait:ms=>new Promise(resolve=>setTimeout(resolve,ms)),picked:()=>generation!==request,
          emit:update=>{const seen=new Set<string>();const rows=update.guesses.map(g=>({id:scanControlModel('',g.part),name:scanControlModelName('',g.part)+(g.tier==='clear'?' · khớp rõ':g.tier==='maybe'?' · có thể':' · gợi ý')})).filter(row=>{if(seen.has(row.id))return false;seen.add(row.id);return true;});reply(rows.length?{shot,rows}:{shot,error:update.failure==='offline'?'Dịch vụ nhận diện chưa sẵn sàng. Điều chỉnh vùng để nhận diện trên máy.':'Chưa xác định được vùng. Điều chỉnh khung rồi quét lại.'});}
        });
      }catch{reply({error:'Không quét được. Thử lại trên camera.'});}finally{if(inFlight===request)inFlight=0;}
    };
    const tick=(now:number)=>{
      if(!active||cancelled)return;const child=bridge(),tracking=child?.scanTracking();
      if(!tracking?.active){stop();controlFrameRef.current?.contentWindow?.postMessage({type:'soma-scan-result',error:'Camera đã tắt. Bật camera rồi quét lại.'},location.origin);return;}
      const hands=[tracking.hand,tracking.second].filter((hand):hand is number[][]=>!!hand).map(raw=>{const lm=landmarks(raw);return {landmarks:lm,fingers:readHand(lm)};});
      if(hands.length)hadHands=true;
      if(!hadHands){if(!sweepStart)sweepStart=now;const progress=Math.min(1,(now-sweepStart)/2200);child?.scanFrame({phase:progress===1?'busy':'framing',mode:'none',box:{x:0,y:0,w:1,h:1},progress,countdown:0,shoot:progress===1});if(progress===1){void captureIntegrated({x:0,y:0,w:1,h:1},'frame');return;}raf=requestAnimationFrame(tick);return;}
      const state=machine.update(hands,tracking.aspect,now,tracking.stamp!==lastStamp);lastStamp=tracking.stamp;child?.scanFrame(state);
      if(state.shoot&&state.box){void captureIntegrated(state.box,state.mode);return;}
      raf=requestAnimationFrame(tick);
    };
    const receive=(event:MessageEvent)=>{
      const frame=controlFrameRef.current?.contentWindow;if(event.origin!==location.origin||event.source!==frame)return;
      if(event.data?.type==='soma-control-model'&&isScanControlModel(event.data.id)){controlHandoffRef.current=event.data.id;return;}
      if(event.data?.type==='soma-scan-selected'){stop();return;}
      if(event.data?.type!=='soma-camera-scan')return;
      // A deliberate retry replaces the previous session, including late refinements.
      stop();if(!bridge()?.scanTracking().active){frame?.postMessage({type:'soma-scan-result',error:'Bật camera trong Vision trước khi quét.'},location.origin);return;}
      bridge()?.scanUI(true);machine.reset();lastStamp=-1;sweepStart=0;hadHands=false;active=true;raf=requestAnimationFrame(tick);
    };
    window.addEventListener('message',receive);return()=>{cancelled=true;stop();window.removeEventListener('message',receive);};
  },[askGpu]);

  const capture = useCallback(
    /**
     * @param handWrist cổ tay của bàn tay đã sinh ra ô (hệ màn hình), hoặc null
     *   khi ô do hai tay ngắm. Truyền hẳn toạ độ chứ không chỉ một cờ đúng/sai:
     *   tầng nhận diện cần biết cổ tay ở ĐÂU mới đo được ô lấn xuống cẳng tay
     *   bao nhiêu.
     */
    (box: Box, handWrist: Landmark | null, handSnap?: OrientationSnapshot["hand"]) => {
      /**
       * Bỏ lần chụp này và TRẢ MÁY VỀ TRẠNG THÁI NGẮM.
       *
       * Máy trạng thái tự chuyển sang "bận" ngay khi bắn cờ chụp, và chỉ
       * `reset()` mới gỡ ra. Nên mọi đường thoát sớm ở đây đều phải gọi hàm
       * này — thiếu một chỗ là máy kẹt ở "bận" vĩnh viễn: ô ngắm vẫn vẽ nhưng
       * không bao giờ chụp nữa, mà người dùng chẳng thấy lỗi gì.
       */
      const boQua = () => {
        busyRef.current = false;
        machineRef.current.reset();
      };
      const v = videoRef.current;
      if (!v || v.videoWidth === 0) return boQua();
      // Cắt ĐÚNG cái ô đang thấy, giữ nguyên tỉ lệ của nó.
      const rect = boxToSourceRect(box, v.videoWidth, v.videoHeight);
      const c = document.createElement("canvas");
      c.width = CROP_SIZE;
      c.height = CROP_SIZE;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      if (!ctx) return boQua();
      // Ảnh vuông cho mô hình thị giác, nhưng KHÔNG kéo giãn: co cho vừa rồi
      // viền xám hai bên. Kéo giãn làm sai tỉ lệ giải phẫu và tụt độ chính xác.
      ctx.fillStyle = "#727272";
      ctx.fillRect(0, 0, CROP_SIZE, CROP_SIZE);
      const fit = fitContain(rect.sw, rect.sh, CROP_SIZE);
      // Ảnh xem trước là ảnh gương; ảnh gửi đi phải đúng chiều thật, nếu không
      // mọi kết luận trái/phải đều ngược.
      ctx.save();
      ctx.translate(fit.dx + fit.dw, fit.dy);
      ctx.scale(-1, 1);
      ctx.drawImage(v, rect.sx, rect.sy, rect.sw, rect.sh, 0, 0, fit.dw, fit.dh);
      ctx.restore();

      // Ảnh CẢ KHUNG HÌNH tại đúng thời điểm chụp, để tầng mốc giải phẫu xét
      // trên chính khoảnh khắc đó chứ không phải khung hình vài chục mili giây
      // sau. Thu nhỏ về 640 px: Pose không cần hơn, mà nhỏ thì nhanh hơn hẳn.
      const full = document.createElement("canvas");
      const fw = 640;
      full.width = fw;
      full.height = Math.max(1, Math.round((fw * v.videoHeight) / v.videoWidth));
      full.getContext("2d")?.drawImage(v, 0, 0, full.width, full.height);

      const gen = (scanGenRef.current += 1);
      // TÁCH NỀN + CROP KHÍT TRƯỚC KHI GỬI (stage 1 bước 3): segment mẩu vuông,
      // giữ người trên nền đen, crop khít bbox mask rồi đặt lại vào khung vuông
      // (vẫn KHÔNG kéo giãn — fitContain như cũ). Bất đồng bộ nên bọc trong
      // continuation có kiểm phiên: hỏng (chưa tải model, không thấy người) thì
      // giữ nguyên ảnh xám — pipeline bên dưới (chất lượng → consent → GPU)
      // không đổi một dòng.
      void (async () => {
        let fx = fit.dx;
        let fy = fit.dy;
        let fw2 = fit.dw;
        let fh2 = fit.dh;
        try {
          const mm = await segmentPersonOnce(c);
          if (mm && gen === scanGenRef.current) {
            const mg = c.getContext("2d", { willReadFrequently: true });
            if (mg) {
              mg.save();
              mg.globalCompositeOperation = "destination-in";
              mg.drawImage(mm.shape, 0, 0, CROP_SIZE, CROP_SIZE);
              mg.restore();
              // JPEG không có alpha — đặt người lên nền đen tĩnh (đúng spec).
              mg.save();
              mg.globalCompositeOperation = "destination-over";
              mg.fillStyle = "#000";
              mg.fillRect(0, 0, CROP_SIZE, CROP_SIZE);
              mg.restore();
              const pad = 10;
              const l = Math.max(0, mm.left - pad);
              const t = Math.max(0, mm.top - pad);
              const r = Math.min(mm.w - 1, mm.right + pad);
              const b = Math.min(mm.h - 1, mm.bottom + pad);
              const sx0 = (l / mm.w) * CROP_SIZE;
              const sy0 = (t / mm.h) * CROP_SIZE;
              const sw = ((r - l + 1) / mm.w) * CROP_SIZE;
              const sh = ((b - t + 1) / mm.h) * CROP_SIZE;
              if (sw > 4 && sh > 4) {
                const tight = document.createElement("canvas");
                tight.width = CROP_SIZE;
                tight.height = CROP_SIZE;
                const tg = tight.getContext("2d", { willReadFrequently: true });
                if (tg) {
                  tg.fillStyle = "#000";
                  tg.fillRect(0, 0, CROP_SIZE, CROP_SIZE);
                  const f2 = fitContain(sw, sh, CROP_SIZE);
                  tg.drawImage(c, sx0, sy0, sw, sh, f2.dx, f2.dy, f2.dw, f2.dh);
                  ctx.clearRect(0, 0, CROP_SIZE, CROP_SIZE);
                  ctx.drawImage(tight, 0, 0);
                  fx = f2.dx;
                  fy = f2.dy;
                  fw2 = f2.dw;
                  fh2 = f2.dh;
                }
              }
            }
          }
        } catch {
          /* giữ ảnh gốc */
        }
        if (gen !== scanGenRef.current) return; // đã có phiên mới hơn
        // Chấm chất lượng trên PHẦN NGƯỜI (đã tách nền thì mặc định là người):
        // viền đen phẳng không tính — cùng luật cũ với viền xám.
        const q = assessCrop(
          ctx.getImageData(fx, fy, fw2, fh2),
          Math.max(rect.sw, rect.sh),
          Math.min(rect.sw, rect.sh),
        );
        const url = c.toDataURL("image/jpeg", 0.85);
        shotBoxRef.current = { aspect: rect.sw / rect.sh, shot: url };
        orientSnapRef.current = handSnap ? { hand: handSnap } : {};
        setShot(url);
        setQuality(q);
        guessesRef.current = [];
        setGuesses([]);
        setScanPart(null);
        pickedPartRef.current = null;
        setSource(null);
        setFailure(null);
        setStage("review");
        stageRef.current = "review";

        if (!q.ok) {
          busyRef.current = false;
          return;
        }
        if (!consentRef.current) {
          // Chưa đồng ý gửi ảnh: giữ ảnh lại trên máy và hỏi.
          setAskConsent(true);
          busyRef.current = false;
          return;
        }
        busyRef.current = true;
        void runRecognition(url, full, box, v.videoWidth / v.videoHeight, handWrist, gen).finally(() => {
          // Chỉ hạ cờ bận nếu vẫn còn là phiên của mình: phiên sau đã tự hạ rồi,
          // hạ đè lên là mở đường cho một lần chụp trùng.
          if (gen === scanGenRef.current) busyRef.current = false;
        });
      })();
    },
    [runRecognition, videoRef],
  );

  const saveConsent = useCallback(
    (value: boolean) => {
      writeConsent(value);
      consentRef.current = value;
      setAskConsent(false);
      // Vừa đồng ý mà đang giữ sẵn một ảnh đạt chuẩn thì hỏi GPU luôn, khỏi
      // chụp lại. (Tầng mốc giải phẫu đã chạy xong từ lúc chụp và không cần
      // xin phép ai — nó chạy ngay trên máy.)
      if (value && shot && quality?.ok) {
        // Cùng một luật với đường nhận diện chính: kết quả chỉ được nhận nếu
        // vẫn còn đúng phiên quét và người dùng chưa chọn vùng nào.
        const gen = scanGenRef.current;
        busyRef.current = true;
        void askGpu(shot)
          .then(({ rows }) => {
            if (gen !== scanGenRef.current || pickedPartRef.current) return;
            if (rows && rows.length) {
              guessesRef.current = rows;
              setGuesses(rows);
              setFailure(null);
              setSource({ kind: "gpu", ms: 0 });
            }
          })
          .finally(() => {
            if (gen === scanGenRef.current) busyRef.current = false;
          });
      }
    },
    [askGpu, quality, shot],
  );

  /**
   * MÓC TỰ KIỂM CHỨNG (chỉ bản dev) — cùng truyền thống với `window.somaGesture`.
   * Cho phép chạy trọn một lần chụp mà KHÔNG cần webcam: gán một luồng video
   * giả vào thẻ <video> rồi gọi
   *
   *   window.somaScan.capture({x:.3,y:.3,w:.3,h:.3}, false)
   *
   * Nhờ nó mà cắt ảnh, cổng chất lượng, bộ điều phối hai tầng và toàn bộ giao
   * diện kết quả đều nghiệm thu được trên máy không có camera.
   */
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const w = window as unknown as { somaScan?: unknown; somaHandWorker?: unknown };
    w.somaScan = { capture, rescan, video: videoRef };
    // Kiểm "worker nhận diện có chạy được trên máy này không" mà KHÔNG cần bật
    // camera: `await window.somaHandWorker()`.
    w.somaHandWorker = probeHandWorker;
    return () => {
      delete w.somaScan;
      delete w.somaHandWorker;
    };
  }, [capture, rescan, videoRef]);

  const fireTarget = useCallback(
    function fireTarget(targetKey: string) {
      const tr = transformRef.current;
      // ---- mục tiêu của chế độ quét ----
      if (targetKey.startsWith("part:")) {
        const key = targetKey.slice(5);
        if (isVisionPartKey(key)) {
          pickedPartRef.current = key;
          // Chọn đúng vùng trong gợi ý thì mang theo BÊN của nó; chọn tay ở bảng thì không biết bên.
          pickedSideRef.current = guessesRef.current.find((g) => g.part === key)?.side;
          setScanPart(key);
          // CHẠM LÀ MỞ NGAY mô hình của vùng đó trên trang này (không dừng ở
          // bảng chọn): chĩa vòng trỏ vào "Mặt" là khuôn mặt đủ da–cơ hiện ra.
          // Vùng nào có `openGlb` (atlas thiếu mặt ngoài, vd đầu/mặt toàn sọ)
          // thì mở thẳng bản .glb đủ lớp; còn lại mở bài atlas đầu danh sách.
          // Các mô hình khác của vùng vẫn còn trong tab Quét để đổi sau.
          const part = getVisionPart(key);
          if (part?.openGlb && getGlbModel(part.openGlb)) {
            fireTarget(`control:glb:${part.openGlb}`);
          } else {
            const first = part?.scenes[0];
            if (first) fireTarget(`control:${first}`);
          }
        }
        return;
      }
      // "control:<slug>" — NẠP MÔ HÌNH VÀO NGAY CHẾ ĐỘ ĐIỀU KHIỂN.
      // Đây là mắt xích khiến cả vòng không cần chuột: quét ra vùng → chọn →
      // mô hình vùng đó hiện ra ngay tại chỗ, tay vẫn đang giơ, xoay/bóc lớp
      // tiếp bằng cử chỉ. Không điều hướng, không tải lại trang, nên luồng
      // webcam không hề bị ngắt.
      // "control:glb:<slug>" — ép lấy bản .glb đủ da–cơ, bỏ qua bài atlas cùng
      // tên (dùng khi atlas thiếu mặt ngoài của vùng).
      if (targetKey.startsWith("control:")) {
        const rest = targetKey.slice(8);
        const model = rest.startsWith("glb:") ? getGlbModel(rest.slice(4)) : getControlModel(rest);
        if (!model) return;
        controlHandoffRef.current = scanControlModel(model.slug, pickedPartRef.current);
        setTarget(model);
        setScanFrame(shotBoxRef.current);
        // XOAY MÔ HÌNH THEO GÓC BỘ PHẬN THẬT. Chỉ áp thứ đo được (nghiêng trong
        // mặt phẳng ảnh + bên trái/phải); ngửa/sấp và ngửa/cúi thì để nguyên vì
        // không đo nổi cho ra hồn — xem `orientation.ts`.
        const part = pickedPartRef.current;
        const ori = part ? orientationFor(part, orientSnapRef.current, pickedSideRef.current) : null;
        setOriented(!!ori);
        if (model.kind === "glb") setLayers(initLayers(model));
        else setAtlasLayers(initAtlasLayers(model.scene));
        // Mô hình mới thì mọi thứ gắn với mô hình cũ đều vô nghĩa.
        setHidden([]);
        undoRef.current = [];
        setUndoDepth(0);
        choose(null);
        handleHover(null);
        resetView();
        if (ori) {
          // Chi trên atlas ở TƯ THẾ GIẢI PHẪU (đầu xa hướng xuống), .glb thì dựng
          // đứng đầu xa hướng lên — cùng một góc tay phải cộng thêm nửa vòng.
          transformRef.current.rotZ = model.kind === "atlas" ? atlasRoll(ori.rollRad) : ori.rollRad;
          scannedLeftRef.current = ori.mirror;
          // .glb đều dựng bên phải nên biết ngay; mô hình atlas báo bên của nó
          // khi tải xong (`onAtlasSide`) rồi mới lật.
          transformRef.current.mirror = model.kind === "glb" ? mirrorFor(ori.mirror, "right") : false;
        }
        setViewMode("control");
        modeRef.current = "control";
        dwellsRef.current.clear();
        return;
      }
      if (targetKey === "rescan") return fullRescan();
      if (targetKey === "consent:yes") return saveConsent(true);
      if (targetKey === "consent:no") return saveConsent(false);

      if (targetKey.startsWith("mesh:")) choose(hoveredRef.current);
      else if (targetKey.startsWith("alayer:")) {
        const [, key, field] = targetKey.split(":");
        toggleAtlasLayer(key, field as "visible" | "faded");
      } else if (targetKey.startsWith("layer:")) {
        const [, cat, field] = targetKey.split(":");
        toggleLayer(cat as CatKey, field as "visible" | "faded");
      } else if (targetKey === "clear") choose(null);
      else if (targetKey === "trash") dropPicked();
      else if (targetKey === "undo") undo();
      else if (targetKey === "explode") {
        const before = tr.explode;
        tr.explode = before > 0 ? 0 : 1;
        pushUndo({ label: "explode", undo: () => (transformRef.current.explode = before) });
      } else if (targetKey === "reset") resetView();
    },
    [choose, dropPicked, handleHover, pushUndo, fullRescan, resetView, saveConsent, toggleAtlasLayer, toggleLayer, undo],
  );

  const fitCanvas = useCallback((cv: HTMLCanvasElement | null) => {
    if (!cv) return null;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    const want = { w: Math.round(w * dpr), h: Math.round(h * dpr) };
    if (cv.width !== want.w || cv.height !== want.h) {
      cv.width = want.w;
      cv.height = want.h;
    }
    const ctx = cv.getContext("2d");
    if (!ctx) return null;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h };
  }, []);

  useEffect(() => {
    const fit = () => {
      fitCanvas(cursorCanvasRef.current);
      fitCanvas(camCanvasRef.current);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [fitCanvas]);

  /**
   * Trúng nút nào NGAY DƯỚI điểm đang xét — không lực hút, không kéo.
   * Dùng cho chế độ QUÉT: vòng trỏ dính chặt đầu ngón trỏ, ngắm đâu trúng đó.
   */
  const aimDirect = useCallback((x: number, y: number) => {
    const direct = (document.elementFromPoint(x, y) as HTMLElement | null)?.closest<HTMLElement>(
      "[data-gesture-target]",
    );
    if (!direct) return null;
    const r = direct.getBoundingClientRect();
    return {
      key: direct.dataset.gestureTarget ?? "",
      x: r.left + r.width / 2,
      y: r.top + r.height / 2,
    };
  }, []);

  /**
   * Tìm nút mà con trỏ đang nhắm tới, KÈM LỰC HÚT.
   *
   * Chỉ dùng `elementFromPoint` thì phải giữ tay đúng trong lòng nút suốt hơn
   * một giây — với bàn tay lơ lửng giữa không khí thì gần như bất khả thi. Nên
   * nếu không trúng nút nào, ta tìm nút gần nhất trong bán kính rồi kéo con trỏ
   * về tâm nó.
   */
  const aimTarget = useCallback(
    (x: number, y: number) => {
      const direct = aimDirect(x, y);
      if (direct) return direct;
      let best: { key: string; x: number; y: number; d: number } | null = null;
      for (const el of document.querySelectorAll<HTMLElement>("[data-gesture-target]")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0) continue;
        const cx = clamp(x, r.left, r.right);
        const cy = clamp(y, r.top, r.bottom);
        const d = Math.hypot(x - cx, y - cy);
        if (d < MAGNET_PX && (!best || d < best.d)) {
          best = {
            key: el.dataset.gestureTarget ?? "",
            x: r.left + r.width / 2,
            y: r.top + r.height / 2,
            d,
          };
        }
      }
      return best;
    },
    [aimDirect],
  );

  const handleFrame = useCallback(
    (hands: TrackedHand[], frame: FrameInfo, now: number, meta: FrameMeta) => {
      const txt = textRef.current;
      // Ghép định danh ỔN ĐỊNH theo vị trí cổ tay khung trước (ngưỡng 0,2
      // khung hình — tay không thể nhảy xa hơn thế giữa hai khung vẽ). Tay mới
      // vào khung thì cấp id mới. Nhờ vậy nhãn Left/Right có lật thì các map
      // trạng thái bên dưới vẫn bám đúng tay.
      const prevTracks = tracksRef.current;
      const usedTracks = new Set<string>();
      const trackIds: string[] = [];
      if (hands.length > 0) {
        for (const h of hands) {
          const w = h.landmarks[0];
          let best: string | null = null;
          let bd = 0.2;
          for (const [tid, p] of prevTracks) {
            if (usedTracks.has(tid)) continue;
            // Track quá cũ (> 1,5 s không thấy) thì coi như tay mới — tránh nối
            // nhầm vào chỗ tay đã hạ xuống từ lâu.
            if (now - p.t > 1500) continue;
            const d = Math.hypot(w.x - p.x, w.y - p.y);
            if (d < bd) {
              bd = d;
              best = tid;
            }
          }
          if (!best) best = `T${trackSeqRef.current++}`;
          usedTracks.add(best);
          trackIds.push(best);
        }
        const nextTracks = new Map<string, { x: number; y: number; t: number }>();
        hands.forEach((h, i) =>
          nextTracks.set(trackIds[i], { x: h.landmarks[0].x, y: h.landmarks[0].y, t: now }),
        );
        // Giữ lại track vừa mất dấu (< 5 s) để tay quay lại mép khung là nối
        // tiếp ngay dwell/smoother cũ, không giữ lại từ đầu.
        for (const [tid, p] of prevTracks) {
          if (!usedTracks.has(tid) && now - p.t < 5000) nextTracks.set(tid, p);
        }
        tracksRef.current = nextTracks;
        // TrackId sinh mới mỗi lần tay ra/vào khung — dọn trạng thái của track
        // đã rời khung, không để các map phình mãi qua nhiều lượt giơ tay.
        for (const m of [smoothRef, pinchRef, dwellsRef, anchorsRef, flashRef, stabilizersRef]) {
          const mp = m.current as Map<string, unknown>;
          for (const k of [...mp.keys()]) {
            if (!usedTracks.has(k) && !nextTracks.has(k)) mp.delete(k);
          }
        }
      }
      const analyzed = analyze(hands, stabilizersRef.current, (_h, i) => trackIds[i]);
      const scanning = modeRef.current === "scan";

      // ---- CHẾ ĐỘ QUÉT: nhịp ngắm → chốt → đếm ngược → chụp ----
      // Chạy TRƯỚC phần vẽ để khung vẽ ra luôn là khung mới nhất của khung hình này.
      // NGHI THỨC AUTO-SCAN ƯU TIÊN: đang đếm ngược / tia đang quét thì TẠM DỪNG
      // máy ngắm tay — để tia toàn thân chạy sạch một lượt, xong mới tới lượt
      // khung 2 ngón trỏ và quét tay. Không thì hai lớp UI đè nhau.
      const ritualBusy =
        ritualRef.current.phase === "count" || ritualRef.current.phase === "scan";
      let scanBox: Box | null = null;
      let scanArmed = false;
      let scanOnHand = false;
      let scanProgress = 0;
      let scanCount = 0;
      if (scanning && stageRef.current === "scan" && frame.height > 0 && !ritualBusy) {
        const st = machineRef.current.update(
          analyzed.map((a) => ({ landmarks: a.hand.landmarks, fingers: a.fingers })),
          frame.width / frame.height,
          now,
          meta.fresh,
        );
        scanBox = st.box;
        scanArmed = st.phase === "armed";
        scanOnHand = st.mode === "hand";
        scanProgress = st.progress;
        scanCount = st.countdown;
        if (st.phase !== scanPhaseRef.current) {
          scanPhaseRef.current = st.phase;
          setScanPhase(st.phase);
        }
        if (st.mode !== scanModeRef.current) {
          scanModeRef.current = st.mode;
          setScanMode(st.mode);
        }
        if (st.shoot && st.box && !busyRef.current) {
          // Ô do bàn tay tự bám thì gửi kèm CỔ TAY của chính bàn tay ấy — mốc
          // bàn tay chính xác hơn mốc pose khi tay ở gần camera.
          const subject = st.mode === "hand" ? analyzed[0] : undefined;
          capture(
            st.box,
            subject ? subject.hand.landmarks[LM_WRIST] : null,
            subject
              ? { landmarks: subject.hand.landmarks, handedness: subject.hand.handedness }
              : undefined,
          );
        }
      }

      // ---- ZOOM HAI TAY: cả hai tay cùng chụm ngón cái–trỏ rồi kéo ra / vào ----
      // Cử chỉ này cố ý "khó vô tình làm được": phải chụm ĐỒNG THỜI cả hai tay.
      // Riêng kiểu wonder thì spread thuần như WonderSnap (hai tay dang/chụm là
      // zoom, không bắt chụm trước).
      const bothPinch =
        !scanning && analyzed.length === 2 && analyzed.every((a) => isPinching(a.fingers));
      const wsTwoZoom = wsModeRef.current === "wonder" && !scanning && analyzed.length === 2;
      const zooming = bothPinch || wsTwoZoom;
      if (zooming) {
        const span = twoHandSpan(analyzed[0].hand.landmarks, analyzed[1].hand.landmarks);
        if (!zoomAnchorRef.current) {
          zoomAnchorRef.current = { span, zoom: transformRef.current.zoom };
        } else if (meta.fresh) {
          transformRef.current.zoom = zoomFromTwoHands(
            span,
            zoomAnchorRef.current.span,
            zoomAnchorRef.current.zoom,
          );
        }
      } else {
        zoomAnchorRef.current = null;
      }

      // ---- CHẾ ĐỘ WONDERSNAP: tay = lệnh cảnh ----
      // snap = gọi/tan model · nắm = gộp · mở = bung LIÊN TỤC theo độ xoè ·
      // peace = mẫu tiếp · chỉ = con trỏ + dwell (dùng chung nhánh point dưới).
      // Nhận diện (worker + góc khớp + lọc) giữ nguyên của trang; chỉ thay LỚP
      // DIỄN GIẢI cử chỉ. Snap/debounce chỉ chạy khi có kết quả đo MỚI (fresh),
      // còn độ bung nội suy mỗi khung vẽ cho mượt 60 fps.
      const wonder = wsModeRef.current === "wonder" && !scanning;
      const wPrimary = wonder && analyzed.length > 0 ? analyzed[0] : null;
      const wFingers = wPrimary ? wPrimary.fingers : null;
      const wLms = wPrimary ? wPrimary.hand.landmarks : null;
      const wRaw: WonderPose = wonder ? wonderPoseOf(wFingers) : "none";
      let wBusy = false;
      let wRotate = false;
      if (wonder) {
        if (meta.fresh) {
          const { stable, changed } = wsPoseRef.current.push(wRaw);
          const snapped = wsSnapRef.current.push(wLms, wFingers, now);
          // Chụm ở kiểu wonder: đã chọn part thì KÉO nó ra/đặt lại (y hệt
          // WonderSnap), chưa chọn gì thì thành cú bấm cho nhánh point.
          if (wPrimary && wFingers) {
            let wPinch = pinchRef.current.get(trackIds[0]);
            if (!wPinch) {
              wPinch = new PinchClick();
              pinchRef.current.set(trackIds[0], wPinch);
            }
            if (wPinch.push(wFingers.pinchSpan, now)) {
              const picked = pickedRef.current;
              if (picked) {
                const prev = wsPullRef.current;
                setWsPullState(nextPullState(prev, picked.raw));
                pushUndo({
                  label: `pull:${picked.raw}`,
                  undo: () => setWsPullState(prev),
                });
              } else if (wRaw === "point") {
                // Chưa chọn gì + đang chỉ tay: thành cú bấm, nhánh point dưới
                // tiêu thụ ngay cùng khung (không để sót sang khung sau).
                wsPinchEdgeRef.current = true;
              }
            }
          }
          for (const ev of wsSceneRef.current.update(stable, changed, snapped)) {
            if (ev === "summon") {
              wsHiddenRef.current = false;
              setWsHidden(false);
            } else if (ev === "dissolve") {
              wsHiddenRef.current = true;
              setWsHidden(true);
            } else if (ev === "assemble") {
              wsExplHistRef.current = [];
              wsTargetRef.current = 0;
            } else if (ev === "next") {
              // Peace ✌: nhảy tới mẫu tiếp theo trong danh sách đổi nhanh.
              const slugs = QUICK_MODELS;
              const cur = slugs.indexOf(target.slug as (typeof slugs)[number]);
              const nxt = slugs[(cur + 1 + slugs.length) % slugs.length] ?? slugs[0];
              fireTarget(`control:${nxt}`);
            }
          }
        }
        // Bận (chỉ/chụm) thì giữ, rảnh mới lái — dùng độ mở THÔ để landmark
        // rung không kẹt ở "bận" vĩnh viễn (bấm/chọn vẫn dùng máy chốt riêng).
        const rawSpan = wFingers ? wFingers.pinchSpan : 99;
        wBusy = wonderBusy(wRaw, rawSpan);
        const shown = wsSceneRef.current.state === "shown";
        if (shown && analyzed.length === 1 && !zooming && wPrimary && wLms && wFingers) {
          if (wRaw === "open" && !wBusy) {
            // Nhân tối đa WONDER_SPREAD_MAX để xoè hết tay bung rộng hơn nút
            // "Tách lớp" cổ điển (vốn chỉ tới 1).
            const op = opennessOf(wFingers, wLms);
            wsOpenRef.current = op;
            const v = WONDER_SPREAD_MAX * smoothOpen(OPEN_SMOOTH_A, OPEN_SMOOTH_B, op);
            wsTargetRef.current = v;
            wsExplHistRef.current.push({ t: now, v });
          } else if (wRaw === "fist") {
            wsOpenRef.current = 0;
            wsTargetRef.current = 0;
            wsExplHistRef.current = [];
          } else if (wBusy) {
            // Chỉ/chụm làm ngón gập giả: giữ đỉnh bung gần nhất, không sập lại.
            while (wsExplHistRef.current.length > 0 && wsExplHistRef.current[0].t < now - 500) {
              wsExplHistRef.current.shift();
            }
            if (wsExplHistRef.current.length > 0) {
              wsTargetRef.current = Math.max(...wsExplHistRef.current.map((h) => h.v));
            }
          }
          wRotate = (wRaw === "open" || wRaw === "other") && !wBusy;
          // Góc vặn mượt kiểu WonderSnap (đúng `ctl.roll`): cập nhật mỗi lần
          // nhận diện mới, dùng cho mọi khung vẽ. Tay mất dấu thì lần sau chốt
          // lại từ đầu (luật 0,5 s của WonderSnap).
          if (wPrimary && wLms && meta.fresh) {
            const vaspect = frame.width > 0 && frame.height > 0 ? frame.width / frame.height : 1;
            const r = handRoll(wLms, vaspect);
            const prev = wsRollRef.current;
            wsRollRef.current =
              !prev || now - prev.t > 500
                ? { v: r, t: now }
                : { v: prev.v + angleDelta(r, prev.v) * 0.5, t: now };
            // Độ lật lòng bàn tay (vặn núm cửa): z nhiễu hơn x/y nên mượt mạnh
            // hơn một chút (trộn 0,35) và vùng chết riêng ở dưới.
            const tw = handTwist(wLms);
            const prevTw = wsTwistRef.current;
            wsTwistRef.current =
              !prevTw || now - prevTw.t > 500
                ? { v: tw, t: now }
                : { v: prevTw.v + (tw - prevTw.v) * 0.35, t: now };
          } else if (!wPrimary) {
            wsRollRef.current = null;
            wsTwistRef.current = null;
          }
        } else {
          wsExplHistRef.current = [];
        }
        const wSpinning = wRaw === "open" || wRaw === "other";
        const wWasSpinning = wsPrevRawRef.current === "open" || wsPrevRawRef.current === "other";
        if (wSpinning && !wWasSpinning) {
          // Vừa mở tay ra: neo xoay cũ (tay đã hạ/xoay đi chỗ khác) vô nghĩa —
          // lập neo mới ở đây để model không nhảy cóc. Còn đang mở liên tục thì
          // GIỮ neo để góc xoay cộng dồn (xoá mỗi khung là xoay mãi không đi).
          for (const k of [...anchorsRef.current.keys()]) {
            if (k.endsWith("#ws")) anchorsRef.current.delete(k);
          }
        }
        wsPrevRawRef.current = wRaw;
        if (shown && wPrimary) {
          const t2 = transformRef.current;
          t2.explode += (wsTargetRef.current - t2.explode) * 0.12;
          if (Math.abs(t2.explode - wsTargetRef.current) < 1e-4) t2.explode = wsTargetRef.current;
          // Vòng ring chỉ khi tay mở/nắm (không khi chỉ tay — lúc đó có con trỏ
          // + vòng dwell riêng, như WonderSnap).
          wsRingRef.current =
            wLms && wFingers && (wRaw === "open" || wRaw === "fist")
              ? {
                  wx: wLms[LM_WRIST].x,
                  wy: wLms[LM_WRIST].y,
                  mx: wLms[LM.MIDDLE_MCP].x,
                  my: wLms[LM.MIDDLE_MCP].y,
                  explode: t2.explode,
                  pose: wRaw,
                  ext: wFingers.extendedCount,
                  span: wFingers.pinchSpan,
                  busy: wBusy,
                  target: wsTargetRef.current,
                  roll: wsRollRef.current?.v ?? null,
                  twist: wsTwistRef.current?.v ?? null,
                  rotY: t2.rotY,
                }
              : null;
        } else {
          wsRingRef.current = null;
        }
        if (shown) {
          // Fit kiểu WonderSnap: bung càng to càng lùi xa để cả cụm lọt khung.
          // Zoom người dùng giữ trong wsZoomBaseRef nên bung/gộp không nuốt
          // mất cỡ tay đã chỉnh; thay đổi từ ngoài (reset/voice) thì nhận lại.
          // Hologram tản rộng gấp ~2,4 lần nên fit theo độ tản THẬT (cùng hằng
          // số nội suy với scene để hai bên đồng bộ).
          const t3 = transformRef.current;
          const hDt = Math.min(Math.max((now - (wsHoloTRef.current || now)) / 1000, 0), 0.1);
          wsHoloTRef.current = now;
          wsHoloEaseRef.current +=
            ((holoUiRef.current ? 1 : 0) - wsHoloEaseRef.current) * (1 - Math.exp(-hDt / 0.25));
          const fit = wonderFitZoom(t3.explode * (1 + 1.4 * wsHoloEaseRef.current));
          if (zooming) {
            wsZoomBaseRef.current = t3.zoom / fit;
          } else {
            if (Math.abs(t3.zoom - wsLastZoomRef.current) > 1e-6) {
              wsZoomBaseRef.current = t3.zoom / fit;
            }
            t3.zoom = Math.min(3, Math.max(0.3, wsZoomBaseRef.current * fit));
          }
          wsLastZoomRef.current = t3.zoom;
        }
        // Thanh meter kiểu WonderSnap: ghi thẳng style, không qua state nên
        // không render lại (60 khung/giây cũng rẻ).
        if (wsOpenBarRef.current) {
          wsOpenBarRef.current.style.transform = `scaleX(${clamp(wsOpenRef.current, 0, 1)})`;
        }
        if (wsExplBarRef.current) {
          wsExplBarRef.current.style.transform = `scaleX(${clamp(transformRef.current.explode / WONDER_SPREAD_MAX, 0, 1)})`;
        }
      }

      // ---- webcam nhỏ: khung xương từng tay ----
      const cam = fitCanvas(camCanvasRef.current);
      if (cam && frame.width > 0) {
        const { ctx, w: cw, h: ch } = cam;
        ctx.clearRect(0, 0, cw, ch);
        const va = frame.width / frame.height;
        const ca = cw / ch;
        const scale = ca > va ? cw / frame.width : ch / frame.height;
        const ox = ca > va ? 0 : (cw - frame.width * scale) / 2;
        const oy = ca > va ? (ch - frame.height * scale) / 2 : 0;
        const px = (nx: number, ny: number) => ({
          x: ox + nx * frame.width * scale,
          y: oy + ny * frame.height * scale,
        });
        // Canvas này là lớp phủ TRONG SUỐT trên thẻ <video>: video gốc giữ
        // nguyên, mọi hiệu ứng (khung xương tay, ô ngắm, tia quét) vẽ đè lên.
        // Không cắt silhouette, không phủ nền đen — tia cứ quét trên video thật.
        for (const a of analyzed) {
          const color = zooming ? CURSOR_COLOR.zoom : CURSOR_COLOR[a.mode];
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          for (const [i, j] of HAND_BONES) {
            const pa = px(a.hand.landmarks[i].x, a.hand.landmarks[i].y);
            const pb = px(a.hand.landmarks[j].x, a.hand.landmarks[j].y);
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.stroke();
          }
          ctx.fillStyle = color;
          for (const p of a.hand.landmarks) {
            const q = px(p.x, p.y);
            ctx.beginPath();
            ctx.arc(q.x, q.y, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        // Vòng openness WonderSnap: ôm đúng lòng bàn tay trong không gian video.
        // Chuẩn hoá theo độ bung tối đa để xoè hết tay là 100 %.
        const wRing = wsModeRef.current === "wonder" ? wsRingRef.current : null;
        if (wRing) {
          drawWonderRingPx(ctx, px, { x: wRing.wx, y: wRing.wy }, { x: wRing.mx, y: wRing.my }, wRing.explode / WONDER_SPREAD_MAX);
        }
        if (showDebug && wsModeRef.current === "wonder" && wRing) {
          // Soi wonder: pose, số ngón duỗi, độ chụm, bận/rảnh, đích, thực tế.
          // Tay mở mà target/explode đứng im thì nhìn dòng này là rõ ngay.
          ctx.font = "600 11px system-ui";
          const dbg =
            `ws ${wRing.pose} · ext ${wRing.ext} · span ${wRing.span.toFixed(2)}` +
            ` · ${wRing.busy ? "BUSY" : "free"} · tgt ${wRing.target.toFixed(2)} · exp ${wRing.explode.toFixed(2)}` +
            ` · rl ${wRing.roll === null ? "-" : wRing.roll.toFixed(2)} · tw ${wRing.twist === null ? "-" : wRing.twist.toFixed(2)} · ry ${wRing.rotY.toFixed(2)}`;
          const dw = ctx.measureText(dbg).width;
          ctx.fillStyle = "rgba(20,16,12,.82)";
          ctx.beginPath();
          ctx.roundRect(6, 6, dw + 14, 20, 6);
          ctx.fill();
          ctx.fillStyle = "#ffd166";
          ctx.fillText(dbg, 13, 20);
        }
        if (scanning && scanBox && videoRef.current) {
          // Ô ngắm vẽ trong ĐÚNG hệ toạ độ của ảnh webcam (px() đã tính sẵn
          // phần bị cắt do object-cover), nên ô trên màn hình trùng khít vùng
          // thật sẽ được cắt ra.
          const a0 = px(scanBox.x, scanBox.y);
          const a1 = px(scanBox.x + scanBox.w, scanBox.y + scanBox.h);
          drawFilmFrame(
            ctx,
            videoRef.current,
            frame,
            scanBox,
            { x: a0.x, y: a0.y, w: a1.x - a0.x, h: a1.y - a0.y },
            scanArmed,
            scanProgress,
            scanCount,
            scanOnHand,
          );
        }

        if (zooming) {
          // vạch nối hai tay: người dùng thấy ngay mình đang "kéo dãn" cái gì
          const p0 = px(analyzed[0].hand.landmarks[8].x, analyzed[0].hand.landmarks[8].y);
          const p1 = px(analyzed[1].hand.landmarks[8].x, analyzed[1].hand.landmarks[8].y);
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = CURSOR_COLOR.zoom;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // TIA XANH QUÉT TRÊN VIDEO THẬT (tầng 1) — vẽ thẳng lên canvas phủ
        // (không qua React — tiến trình đổi mỗi khung hình). Tia đi ngang hết
        // bề rộng người (bbox pose) hoặc toàn khung nếu chưa thấy người; nền
        // phòng giữ nguyên, KHÔNG cắt silhouette.
        // HIỆU ỨNG LÁT NHỎ: tia chính + 3 vệt echo phía trên (cách 10/22/36px,
        // mờ dần) + răng cưa tiến theo bước 6px — mắt thấy rõ "đang quét nhỏ
        // từng chút một" chứ không phải một dải trôi tuột.
        if (ritualRef.current.phase === "scan") {
          // Vẽ một đoạn tia: vệt sáng phía trên + đường sáng chính + sợi trắng.
          const beam = (x0: number, x1: number, top: number, ly: number) => {
            const w = Math.max(0, x1 - x0);
            if (w < 1) return;
            const grad = ctx.createLinearGradient(0, Math.max(top, ly - 110), 0, ly);
            grad.addColorStop(0, "rgba(55,201,179,0)");
            grad.addColorStop(1, "rgba(55,201,179,0.28)");
            ctx.fillStyle = grad;
            ctx.fillRect(x0, Math.max(top, ly - 110), w, 110);
            // Vệt echo: các lát đã quét qua còn lưu sáng mờ — cảm giác quét
            // từng nấc chứ không trôi liền một mạch.
            ctx.fillStyle = "rgba(55,201,179,.20)";
            for (const off of [10, 22, 36]) {
              const ey = Math.round((ly - off) / 6) * 6; // nấc 6px
              if (ey > top) ctx.fillRect(x0, ey, w, 1.5);
            }
            ctx.save();
            ctx.shadowColor = "#37c9b3";
            ctx.shadowBlur = 18;
            ctx.fillStyle = "#37c9b3";
            ctx.fillRect(x0, ly - 2, w, 4);
            ctx.restore();
            ctx.fillStyle = "rgba(255,255,255,.9)";
            ctx.fillRect(x0, ly - 1, w, 1.5);
            // Hai đầu tia: chấm tròn phát sáng để thấy tia "bó" đúng vào người.
            ctx.save();
            ctx.shadowColor = "#9df0e2";
            ctx.shadowBlur = 12;
            ctx.fillStyle = "#dffff7";
            for (const ex of [x0, x1]) {
              ctx.beginPath();
              ctx.arc(ex, ly, 3, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.restore();
          };
          const scanPct = Math.round(ritualRef.current.progress * 100);
          // Tia quét FULL KHUNG, lần nào cũng như lần đầu: không khung đứt nét,
          // không tối hai bên. (Trước đây tia nép theo bbox pose — lần đầu pose
          // chưa kịp trả về nên full khung, quét lại pose có sẵn nên lòi ra
          // khung hẹp hơn, nhìn khác hẳn lúc đầu.)
          const bx0 = 0;
          const bx1 = cw;
          // QUÉT FULL CHIỀU CAO KHUNG HÌNH — không bó theo bbox pose nữa: bbox
          // chỉ bao nửa thân trên nên tia nhìn như "quét có một nửa".
          const by0 = 0;
          const by1 = ch;
          const ly = by0 + ritualRef.current.progress * Math.max(1, by1 - by0);
          beam(bx0, bx1, by0, ly);
          // Nhãn % ngay đầu tia phải — chữ canvas nên không tốn render React.
          ctx.save();
          ctx.font = "700 13px system-ui";
          ctx.fillStyle = "rgba(223,255,247,.95)";
          ctx.strokeStyle = "rgba(0,0,0,.6)";
          ctx.lineWidth = 3;
          const pct = `SCAN ${scanPct}%`;
          const ptx = Math.max(10, Math.min(cw - ctx.measureText(pct).width - 12, bx1 - ctx.measureText(pct).width - 10));
          ctx.strokeText(pct, ptx, ly - 10);
          ctx.fillText(pct, ptx, ly - 10);
          ctx.restore();
        }
      }

      const ov = fitCanvas(cursorCanvasRef.current);
      const ow = ov?.w ?? 0;
      const oh = ov?.h ?? 0;
      const octx = ov?.ctx ?? null;
      octx?.clearRect(0, 0, ow, oh);

      // Vẽ lại điểm trỏ cuối trong lúc mất dấu tay (tay chạm mép khung,
      // nhận diện hụt 1–2 nhịp): mờ đi chứ không biến mất ngay, tay quay lại
      // là nối tiếp dwell cũ. Trả về false khi đã quá hạn → gọi nơi xoá hẳn.
      const drawGraceCursor = (): boolean => {
        const g = lastCursorRef.current;
        if (!g || now >= g.until || !octx) return false;
        const left = (g.until - now) / CURSOR_GRACE_MS;
        octx.save();
        octx.globalAlpha = 0.25 + 0.35 * left;
        octx.strokeStyle = CURSOR_COLOR[g.mode];
        octx.lineWidth = 2;
        octx.beginPath();
        octx.arc(g.x, g.y, 16, 0, Math.PI * 2);
        octx.stroke();
        octx.beginPath();
        octx.moveTo(g.x - 7, g.y);
        octx.lineTo(g.x + 7, g.y);
        octx.moveTo(g.x, g.y - 7);
        octx.lineTo(g.x, g.y + 7);
        octx.stroke();
        octx.restore();
        return true;
      };

      if (scanning && stageRef.current === "scan") {
        // Đang ngắm khung thì hai tay đều bận giữ góc — hiện thêm con trỏ chỉ
        // làm rối, và dwell sẽ bấm nhầm nút phía sau.
        cursorRef.current.active = false;
        if (!drawGraceCursor()) dwellsRef.current.clear();
        return;
      }

      if (analyzed.length === 0) {
        cursorRef.current.active = false;
        anchorsRef.current.clear();
        // KHÔNG xoá dwell/smoother ngay: giữ lại trong hạn grace để tay quay
        // lại mép khung là nối tiếp. Hết hạn mới xoá hẳn.
        if (!drawGraceCursor()) {
          dwellsRef.current.clear();
          lastCursorRef.current = null;
        }
        return;
      }

      const tr = transformRef.current;
      const box = sceneBoxRef.current?.getBoundingClientRect();

      // Ánh xạ đầu-ngón-trỏ → TOẠ ĐỘ MÀN HÌNH cho chế độ quét. Canvas con trỏ
      // phủ toàn màn hình (fixed inset-0) còn khung xương vẽ trên canvas camera
      // (object-cover) — nhân thẳng landmark với kích thước canvas là lệch nhau,
      // đúng cái khoảng hở trong ảnh chụp màn hình. Đổi qua rect thật của canvas
      // camera thì vòng trỏ trùng khít đầu ngón tay đang thấy.
      let tipToScreen: ((nx: number, ny: number) => { x: number; y: number }) | null = null;
      if (scanning && frame.width > 0) {
        const camEl = camCanvasRef.current;
        if (camEl) {
          const r = camEl.getBoundingClientRect();
          const va = frame.width / frame.height;
          const ca = r.width / Math.max(r.height, 1);
          const sc = ca > va ? r.width / frame.width : r.height / frame.height;
          const ox = ca > va ? 0 : (r.width - frame.width * sc) / 2;
          const oy = ca > va ? (r.height - frame.height * sc) / 2 : 0;
          tipToScreen = (nx, ny) => ({
            x: r.left + ox + nx * frame.width * sc,
            y: r.top + oy + ny * frame.height * sc,
          });
        }
      }

      for (const [ai, a] of analyzed.entries()) {
        // `id` là trackId bám theo vị trí (ổn định qua các khung); `side` là
        // nhãn trái/phải của MediaPipe (hay lật — chỉ dùng hiển thị và chọn
        // tay ưu tiên, KHÔNG dùng làm khoá trạng thái).
        const id = trackIds[ai];
        const side = a.hand.handedness;
        // WonderSnap "thay hẳn": tay phụ bị bỏ qua (trừ zoom 2 tay); tay chính
        // chỉ khi CHỈ TAY mới thành con trỏ, còn lại do khối WonderSnap lái.
        const wSuppress = wonder && ai > 0 && !zooming;
        const wPoint = wonder && ai === 0 && wonderPoseOf(a.fingers) === "point";
        const mode: HandMode = zooming ? "zoom" : wPoint ? "point" : a.mode;

        let smoother = smoothRef.current.get(id);
        if (!smoother) {
          // τ = 38 ms cho bám sát tay, bù nhìn trước 45 ms để trả lại đúng
          // phần trễ mà cả chuỗi camera → nhận diện → lọc cộng vào. Đứng yên
          // thì phần bù tự tắt (vận tốc ≈ 0) nên con trỏ vẫn đứng im như trước.
          smoother = new CursorSmoother(38, 45);
          smoothRef.current.set(id, smoother);
        }
        const raw = smoother.sample(a.hand.cursor.x * ow, a.hand.cursor.y * oh, now);

        // ---- neo lại mỗi khi ĐỔI chế độ ----
        let anchor = anchorsRef.current.get(id);
        if (!anchor || anchor.mode !== mode) {
          anchor = {
            mode,
            x: raw.x,
            y: raw.y,
            angle: a.fingers.angle,
            rotY: tr.rotY,
            rotX: tr.rotX,
          };
          anchorsRef.current.set(id, anchor);
        }

        // Xoay wonder chạy MỌI khung vẽ (kể cả khung ngoại suy giữa 2 lần đo):
        // nhận diện 6–8 fps mà chỉ xoay ở khung fresh thì model giậm chân tại
        // chỗ. Góc tay đã được nội suy mượt nên xoay theo vẫn êm.
        const wSpinFrame = wonder && ai === 0 && wRotate;
        if (!zooming && !scanning && !wSuppress && (meta.fresh || wSpinFrame)) {
          if (!wonder && mode === "rotate" && meta.fresh) {
            // Xoay = góc nghiêng bàn tay so với LÚC BẮT ĐẦU xoè tay, trừ vùng chết.
            const dA = deadzone(angleDelta(a.fingers.angle, anchor.angle), ROT_DEAD);
            const targetY = anchor.rotY + dA * 1.8;
            tr.rotY += clamp(targetY - tr.rotY, -ROT_STEP_MAX, ROT_STEP_MAX);
            const dy = deadzone((raw.y - anchor.y) / Math.max(oh, 1), TILT_DEAD);
            const targetX = clamp(anchor.rotX + dy * Math.PI * 1.2, -Math.PI / 2, Math.PI / 2);
            tr.rotX += clamp(targetX - tr.rotX, -ROT_STEP_MAX, ROT_STEP_MAX);
          } else if (!wonder && mode === "pan" && meta.fresh) {
            // Kéo cộng dồn nhưng luôn kẹp trong biên. Vùng chết xét trên từng
            // bước, nên tay đứng yên thì mô hình đứng yên tuyệt đối.
            const lim = PAN_LIMIT * Math.min(1, tr.zoom);
            const dx = deadzone((raw.x - anchor.x) / Math.max(ow, 1), PAN_DEAD);
            const dy = deadzone((raw.y - anchor.y) / Math.max(oh, 1), PAN_DEAD);
            if (dx !== 0) {
              tr.panX = clamp(tr.panX + dx * 1.8, -lim, lim);
              anchor.x = raw.x;
            }
            if (dy !== 0) {
              tr.panY = clamp(tr.panY - dy * 1.8, -lim, lim);
              anchor.y = raw.y;
            }
          } else if (wonder && ai === 0 && wRotate) {
            // Xoay kiểu WonderSnap: tay MỞ (kể cả hơi khép ngón khi vặn cổ
            // tay) vừa bung vừa xoay cùng lúc. Neo-relative nên không nhảy:
            // xoay 45° → model ~100° (gain 2.2), nâng/hạ tay nghiêng model
            // (gain 2.5) — đúng số WonderSnap. Neo riêng (`#ws`) để không lẫn
            // với neo trỏ/xoay cổ điển; góc vặn đã hiệu chỉnh aspect + mượt.
            const wk = `${id}#ws`;
            const palmY = (a.hand.landmarks[LM_WRIST].y + a.hand.landmarks[LM.MIDDLE_MCP].y) / 2;
            const rollNow = wsRollRef.current?.v;
            const twistNow = wsTwistRef.current?.v;
            let wa = anchorsRef.current.get(wk);
            if (!wa) {
              wa = {
                mode: "rotate",
                x: raw.x,
                y: raw.y,
                angle: a.fingers.angle,
                rotY: tr.rotY,
                rotX: tr.rotX,
                py: palmY,
                roll: rollNow ?? 0,
                twist: twistNow ?? 0,
                t: now,
              };
              anchorsRef.current.set(wk, wa);
            }
            const dA = deadzone(angleDelta(rollNow ?? wa.roll ?? 0, wa.roll ?? 0), ROT_DEAD);
            // Vặn núm cửa: lật lòng bàn tay đổi pháp tuyến trong khi trục tay
            // đứng yên — cộng thêm vào yaw với gain tương đương (2,5).
            const dTw = deadzone((twistNow ?? wa.twist ?? 0) - (wa.twist ?? 0), TWIST_DEAD);
            const targetY = wa.rotY + dA * 2.2 + dTw * 2.5;
            const wdy = deadzone(palmY - (wa.py ?? palmY), TILT_DEAD);
            const wtargetX = clamp(wa.rotX + wdy * 2.5, -Math.PI / 2, Math.PI / 2);
            // Easing theo THỜI GIAN THẬT (k = 1 − e^(−dt·9), đúng WonderSnap)
            // thay cho kẹp bước theo khung hình — 30/60/144 Hz xoay như nhau.
            const dtS = Math.min(Math.max((now - (wa.t ?? now)) / 1000, 0), 0.1);
            wa.t = now;
            const kk = 1 - Math.exp(-dtS * 9);
            tr.rotY += (targetY - tr.rotY) * kk;
            tr.rotX += (wtargetX - tr.rotX) * kk;
          }
        }

        // ---- con trỏ + chọn ----
        let dwell = dwellsRef.current.get(id);
        if (!dwell) {
          dwell = newDwell();
          dwellsRef.current.set(id, dwell);
        }
        let pinch = pinchRef.current.get(id);
        if (!pinch) {
          pinch = new PinchClick();
          pinchRef.current.set(id, pinch);
        }

        let sx = raw.x;
        let sy = raw.y;
        // Chế độ QUÉT: vòng trỏ DÍNH CHẶT đầu ngón trỏ — bỏ qua bộ lọc kép và
        // lực hút, ngắm đâu trúng đó. Đầu ngón lấy từ landmark đã ngoại suy
        // (trùng khung xương đang vẽ), đổi ra toạ độ màn hình thật.
        const pinToTip = scanning && tipToScreen !== null;
        if (pinToTip && tipToScreen) {
          const tip = a.hand.landmarks[LM.INDEX_TIP];
          const s = tipToScreen(tip.x, tip.y);
          sx = s.x;
          sy = s.y;
        }

        if (mode === "point" && !wSuppress) {
          // Đã giữ quá nửa thì khoá mục tiêu lại, tay lệch ra không mất công giữ.
          const locked = dwell.progress >= DWELL_LOCK_AT ? dwell.key : "";
          // Quét thì chỉ tính trúng TRỰC TIẾP (không kéo về tâm nút): vòng đã
          // ở đúng đầu ngón, kéo nữa là lệch khỏi tay.
          const aim = pinToTip ? aimDirect(sx, sy) : aimTarget(sx, sy);
          if (aim && !locked && !pinToTip) {
            sx += (aim.x - sx) * 0.35;
            sy += (aim.y - sy) * 0.35;
          }

          if (box && (side === "Right" || analyzed.length === 1)) {
            const rx = (sx - box.left) / box.width;
            const ry = (sy - box.top) / box.height;
            cursorRef.current.x = rx;
            cursorRef.current.y = ry;
            cursorRef.current.active = rx >= 0 && rx <= 1 && ry >= 0 && ry <= 1;
          }

          const aimed = locked || aim?.key || "";
          const targetKey =
            !aimed && cursorRef.current.active && hoveredRef.current && side === "Right"
              ? `mesh:${hoveredRef.current.raw}`
              : aimed;

          const dwellMs =
            targetKey === "trash"
              ? TRASH_DWELL_MS
              : // Kiểu wonder giữ tay 0.45 s như WonderSnap (cổ điển giữ 1.2 s).
                wonder && wPoint ? 450 : DWELL_MS;
          // Kiểu wonder: cạnh chụm đã tính trong khối wonder ở trên (vừa kéo
          // part vừa bấm đều từ một cạnh duy nhất, không đẩy 2 lần).
          let pinchClicked = false;
          if (wonder) {
            pinchClicked = wsPinchEdgeRef.current;
            wsPinchEdgeRef.current = false;
          } else if (meta.fresh) {
            pinchClicked = pinch.push(a.fingers.pinchSpan, now);
          }
          if (
            pinchClicked &&
            targetKey &&
            targetKey !== "trash"
          ) {
            // Chụm ngón = bấm ngay. Riêng "Vứt" KHÔNG cho bấm nhanh: đã là hành
            // động phá huỷ thì bắt buộc giữ đủ thời gian, có đếm ngược.
            flashRef.current.set(id, now);
            dwell.key = "";
            dwell.progress = 0;
            fireTarget(targetKey);
          } else if (!targetKey) {
            dwell.key = "";
            dwell.progress = 0;
          } else if (
            dwell.key !== targetKey ||
            (dwell.progress < DWELL_LOCK_AT &&
              Math.hypot(sx - dwell.x, sy - dwell.y) > DWELL_MOVE_TOL_PX)
          ) {
            dwell.key = targetKey;
            dwell.start = now;
            dwell.x = sx;
            dwell.y = sy;
            dwell.progress = 0;
          } else {
            dwell.progress = Math.min((now - dwell.start) / dwellMs, 1);
            if (dwell.progress >= 1) {
              dwell.progress = 0;
              dwell.start = now;
              dwell.key = "";
              flashRef.current.set(id, now);
              fireTarget(targetKey);
            }
          }
        } else {
          dwell.key = "";
          dwell.progress = 0;
          if (side === "Right") cursorRef.current.active = false;
        }

        // ---- vẽ con trỏ ----
        // Kiểu wonder: chỉ tay mới vẽ con trỏ cổ điển (để chọn); tay mở/nắm có
        // vòng ring trong PiP rồi, tay phụ bỏ qua (trừ lúc zoom 2 tay).
        if (octx && !wSuppress && (!wonder || wPoint || zooming)) {
          const color = CURSOR_COLOR[mode];
          const flash = flashRef.current.get(id) ?? -Infinity;
          const flashK = Math.max(0, 1 - (now - flash) / 260);
          octx.save();
          octx.beginPath();
          octx.arc(sx, sy, 16, 0, Math.PI * 2);
          octx.strokeStyle = "rgba(0,0,0,.55)";
          octx.lineWidth = 3;
          octx.stroke();
          octx.beginPath();
          octx.arc(sx, sy, 16, 0, Math.PI * 2);
          octx.strokeStyle = color;
          octx.lineWidth = 2;
          octx.stroke();
          octx.beginPath();
          octx.moveTo(sx - 7, sy);
          octx.lineTo(sx + 7, sy);
          octx.moveTo(sx, sy - 7);
          octx.lineTo(sx, sy + 7);
          octx.strokeStyle = color;
          octx.lineWidth = 2;
          octx.stroke();
          octx.beginPath();
          octx.arc(sx, sy, pinch.isClosed ? 6 : 3, 0, Math.PI * 2);
          octx.fillStyle = color;
          octx.fill();
          if (flashK > 0) {
            octx.beginPath();
            octx.arc(sx, sy, 16 + (1 - flashK) * 26, 0, Math.PI * 2);
            octx.strokeStyle = `rgba(55,201,179,${flashK})`;
            octx.lineWidth = 4;
            octx.stroke();
          }
          const text = `${side === "Right" ? "A" : "B"} · ${txt.mode[mode]}`;
          octx.font = "600 12px system-ui";
          const tw = octx.measureText(text).width;
          octx.fillStyle = "rgba(20,16,12,.82)";
          octx.beginPath();
          octx.roundRect(sx + 22, sy - 22, tw + 14, 22, 6);
          octx.fill();
          octx.fillStyle = "#fff";
          octx.fillText(text, sx + 29, sy - 7);
          if (showDebug) {
            // Soi lệch trái/phải: track, chế độ, độ chụm, % dwell, nhãn gốc.
            // Tay nào kém nhạy thì các số này khác nhau thấy ngay.
            octx.font = "600 11px system-ui";
            const dbg =
              `${id} · ${mode} · pinch ${a.fingers.pinchSpan.toFixed(2)}` +
              ` · dwell ${Math.round(dwell.progress * 100)}%` +
              ` · ext ${a.fingers.extendedCount} · ${side}`;
            const dw = octx.measureText(dbg).width;
            octx.fillStyle = "rgba(20,16,12,.82)";
            octx.beginPath();
            octx.roundRect(sx + 22, sy + 2, dw + 14, 20, 6);
            octx.fill();
            octx.fillStyle = "#9df0e2";
            octx.fillText(dbg, sx + 29, sy + 16);
          }
          if (dwell.progress > 0) {
            const danger = dwell.key === "trash";
            octx.beginPath();
            octx.arc(sx, sy, 26, -Math.PI / 2, -Math.PI / 2 + dwell.progress * Math.PI * 2);
            octx.strokeStyle = danger ? "#d0453b" : "#37c9b3";
            octx.lineWidth = 5;
            octx.lineCap = "round";
            octx.stroke();
            if (danger) {
              // hành động phá huỷ thì đếm ngược bằng số cho rõ ràng
              const left = Math.ceil((TRASH_DWELL_MS * (1 - dwell.progress)) / 1000);
              octx.font = "700 13px system-ui";
              octx.fillStyle = "#d0453b";
              octx.fillText(String(left), sx + 30, sy + 16);
            }
          }
          octx.restore();
          // Ghi nhớ điểm trỏ để mất dấu tay thì vẽ mờ nối tiếp (grace).
        if (mode === "point" && !wSuppress) {
            lastCursorRef.current = { x: sx, y: sy, mode, until: now + CURSOR_GRACE_MS };
          }
        }
      }
    },
    [aimDirect, aimTarget, capture, fireTarget, fitCanvas, showDebug, target.slug, pushUndo],
  );

  const { fps, renderFps, handCount, status, error, errorCode, backend, cameraStreamRef } = useHandTracking(
    videoRef,
    enabled,
    {
      onFrame: handleFrame,
      paused: viewMode === "control",
      maxHands: 2,
      // HAI ĐỘ PHÂN GIẢI TRÊN MỘT LUỒNG, đặt chung cho cả hai chế độ nên đổi
      // chế độ KHÔNG phải mở lại camera: ảnh gốc 720p để mẩu cắt lúc quét còn
      // đủ nét, còn MediaPipe chỉ nhận ảnh thu nhỏ 320 px (đo thật: 480 px ra
      // ~8 lần/giây nên trỏ đi sau tay thấy rõ; 320 px tay ở gần camera vẫn bắt
      // tốt mà nhẹ hơn ~55%). Landmark chuẩn hoá 0..1 nên thu nhỏ không đổi gì.
      // Trễ còn lại được bù bằng ngoại suy vận tốc trong `useHandTracking`.
      videoWidth: 1280,
      videoHeight: 720,
      detectWidth: 320,
    },
  );

  useEffect(() => {
    if(viewMode!=="control")return;
    const attach=()=>{
      const child=controlFrameRef.current?.contentWindow as (Window & {wonderSnap?:{enter:(id:string,stream:MediaStream|null)=>void}})|null;
      const stream=cameraStreamRef.current;
      child?.wonderSnap?.enter(controlHandoffRef.current??scanControlModel(target.slug,pickedPartRef.current),stream instanceof MediaStream?stream:null);
    };
    const ready=(event:MessageEvent)=>{if(event.origin===window.location.origin&&event.source===controlFrameRef.current?.contentWindow&&event.data?.type==='soma-control-ready')attach();};
    window.addEventListener('message',ready);attach();
    controlFrameRef.current?.contentWindow?.postMessage({type:'soma-control-probe'},window.location.origin);
    return ()=>window.removeEventListener('message',ready);
  },[viewMode,target.slug,enabled,status,cameraStreamRef]);

  /**
   * Đổi chế độ. Luôn ĐẶT LẠI nhịp quét: bỏ dở giữa chừng rồi quay lại mà máy
   * vẫn đang đếm ngược thì nó tự chụp một khung hình vô nghĩa.
   */
  const switchMode = useCallback(
    (next: "control" | "scan") => {
      if(next==='scan'){controlFrameRef.current?.contentWindow?.postMessage({type:'soma-scan-open'},location.origin);return;}
      if (next === viewMode) return;
      if (next === "control" && guessesRef.current[0]) {
        controlHandoffRef.current = scanControlModel("", guessesRef.current[0].part);
      }
      // Keep the stream alive; only the active mode performs hand inference.
      rescan();
      setViewMode(next);
      modeRef.current = next;
      dwellsRef.current.clear();
      anchorsRef.current.clear();
      cursorRef.current.active = false;
    },
    [rescan, viewMode],
  );

  /**
   * Đổi kiểu điều khiển Cổ điển ↔ WonderSnap. Dọn sạch trạng thái của cả hai
   * bộ để tay đang giơ không làm model nhảy khi vừa đổi kiểu.
   */
  const switchWsMode = useCallback((next: "classic" | "wonder") => {
    wsModeRef.current = next;
    setWsMode(next);
    if (next === "wonder") {
      // Neo zoom người dùng hiện tại để fit-bung tính từ đó, không nhảy cỡ.
      wsZoomBaseRef.current =
        transformRef.current.zoom /
        wonderFitZoom(transformRef.current.explode * (1 + 1.4 * wsHoloEaseRef.current));
    } else {
      // Về cổ điển: trả lại đúng cỡ tay đã chỉnh (bỏ phần lùi fit).
      transformRef.current.zoom = wsZoomBaseRef.current;
    }
    wsLastZoomRef.current = transformRef.current.zoom;
    wsSnapRef.current.reset();
    wsPoseRef.current.reset();
    wsSceneRef.current.reset();
    wsRollRef.current = null;
    wsTwistRef.current = null;
    wsTargetRef.current = transformRef.current.explode;
    wsExplHistRef.current = [];
    wsHiddenRef.current = false;
    setWsHidden(false);
    stabilizersRef.current.clear();
    dwellsRef.current.clear();
    anchorsRef.current.clear();
    zoomAnchorRef.current = null;
    wsPinchEdgeRef.current = false;
    setWsPullState(null);
    cursorRef.current.active = false;
  }, []);

  // ---- LỆNH GIỌNG NÓI CỦA VISION AI ----
  // Người dùng trang này thường BẬN CẢ HAI TAY (đang giơ tay trước camera), nên
  // giọng nói phải làm được mọi thứ: quét, chọn vùng, mở mô hình NGAY TẠI TRANG
  // (không bao giờ chuyển trang — luật đã chốt), bật lớp, phóng, xoay, hoàn tác.
  const layersRef = useRef(layers);
  const atlasLayersRef = useRef(atlasLayers);
  useEffect(() => {
    layersRef.current = layers;
    atlasLayersRef.current = atlasLayers;
  }, [layers, atlasLayers]);
  const voiceActions = useMemo<VoiceAction[]>(() => {
    const say = (vi: string, en: string, zh: string) => ({ ok: true, say: locale === "en" ? en : locale === "zh" ? zh : vi });
    const fail = (vi: string, en: string, zh: string) => ({ ...say(vi, en, zh), ok: false });
    // Kèm cách gọi thường ngày/địa phương: "cùi chỏ", "bắp chân", "mắt cá"…
    const partItems = VISION_PARTS.map((p) => ({ key: p.key as string, names: voiceNamesOf(p) }));
    const layerItems =
      target.kind === "atlas"
        ? atlasLayerDefs(target.scene).map((l) => ({ key: l.key, names: [l.name.vi, l.name.en, l.name.zh] }))
        : CATS.filter((c) => target.cats.includes(c.key)).map((c) => ({ key: c.key as string, names: [c.label, c.key] }));

    const setLayer = (arg: string, field: "visible" | "faded", value: boolean) => {
      // "bật lớp cơ" khi có hai lớp cơ = bật CẢ HAI; "động mạch" vẫn tìm ra "Mạch máu".
      const keys = resolveMany(arg, layerItems);
      if (!keys.length) return fail(`Mô hình này không có lớp "${arg}".`, `This model has no "${arg}" layer.`, `该模型没有"${arg}"层。`);
      // Lệnh nói "BẬT" thì phải bật — không phải đảo trạng thái như nút bấm.
      for (const key of keys) {
        if (target.kind === "atlas") {
          const cur = atlasLayersRef.current[key] ?? { visible: true, faded: false };
          if (cur[field] !== value) toggleAtlasLayer(key, field);
        } else {
          const cur = layersRef.current[key as CatKey];
          if (cur && cur[field] !== value) toggleLayer(key as CatKey, field);
        }
      }
      const name = keys
        .map((key) => {
          const item = layerItems.find((l) => l.key === key)!;
          return target.kind === "atlas" ? item.names[locale === "en" ? 1 : locale === "zh" ? 2 : 0] : item.names[0];
        })
        .join(", ");
      if (field === "faded") return value ? say(`Đã làm mờ ${name}.`, `${name} faded.`, `已淡化${name}。`) : say(`Đã làm rõ ${name}.`, `${name} solid.`, `已恢复${name}。`);
      return value ? say(`Đã bật lớp ${name}.`, `${name} on.`, `已打开${name}。`) : say(`Đã tắt lớp ${name}.`, `${name} off.`, `已关闭${name}。`);
    };

    const openModel = (arg: string) => {
      const n = norm(arg);
      const idx = /(^| )(dau tien|thu nhat|so mot|so 1|first|1)( |$)|第一/.test(n)
        ? 0
        : /(^| )(thu hai|so hai|so 2|second|2)( |$)|第二/.test(n)
          ? 1
          : /(^| )(thu ba|so ba|so 3|third|3)( |$)|第三/.test(n)
            ? 2
            : -1;
      const partScenes = scanPart ? (getVisionPart(scanPart)?.scenes ?? []) : [];
      const pool = (list: string[]) =>
        list.filter((s) => atlasScenes[s]).map((s) => ({ key: s, names: [atlasScenes[s].title.vi, atlasScenes[s].title.en, atlasScenes[s].title.zh] }));
      // "mở mô hình đầu tiên" = gợi ý số 1 của vùng vừa quét; gọi tên thì tìm trong
      // gợi ý của vùng trước, rồi mới tìm khắp thư viện atlas.
      const slug =
        idx >= 0
          ? partScenes[idx]
          : (bestByName(arg, pool(partScenes), layeredFirst) ??
            bestByName(arg, pool(Object.keys(atlasScenes)), layeredFirst) ??
            undefined);
      const model = slug ? getControlModel(slug) : undefined;
      if (!slug || !model) return fail(`Không tìm thấy mô hình "${arg}".`, `No model matches "${arg}".`, `没有找到"${arg}"模型。`);
      fireTarget(`control:${slug}`);
      return say(`Đang mở ${model.title.vi} ngay tại đây.`, `Opening ${model.title.en} here.`, `正在此处打开${model.title.zh}。`);
    };

    const tr = () => transformRef.current;
    return [
      {
        id: "vision-open",
        phrases: ["mở mô hình {x}", "mở bài {x}", "điều khiển {x}", "mở {x}", "open model {x}", "open the {x} model", "open {x}", "打开{x}模型", "打开{x}"],
        run: openModel,
      },
      {
        id: "scan-part",
        phrases: ["chọn vùng {x}", "chọn {x}", "quét {x}", "pick {x}", "select {x}", "scan {x}", "选择{x}"],
        run: (arg) => {
          const key = bestByName(arg, partItems);
          if (!key || !isVisionPartKey(key)) return fail(`Chưa có vùng "${arg}".`, `No body region "${arg}".`, `没有"${arg}"部位。`);
          if (modeRef.current !== "scan") switchMode("scan");
          fireTarget(`part:${key}`);
          const p = getVisionPart(key)!;
          return say(`Đã mở ${p.label.vi} ngay tại đây.`, `Opened ${p.label.en} right here.`, `已在此处打开${p.label.zh}。`);
        },
      },
      { id: "scan-mode", phrases: ["chế độ quét", "sang quét", "quét", "scan mode", "scan", "扫描"], run: () => (switchMode("scan"), say("Chế độ quét.", "Scan mode.", "扫描模式。")) },
      { id: "control-mode", phrases: ["chế độ điều khiển", "sang điều khiển", "control mode", "控制模式"], run: () => (switchMode("control"), say("Chế độ điều khiển.", "Control mode.", "控制模式。")) },
      { id: "ws-wonder", phrases: ["kiểu vision ai", "chế độ vision ai", "vision ai", "kiểu wondersnap", "chế độ wondersnap", "búng tay", "wondersnap", "wondersnap mode", "弹指模式"], run: () => (switchWsMode("wonder"), say("Kiểu Vision AI: búng tay để gọi, nắm để gộp, mở để bung.", "Vision AI style.", "Vision AI 模式。")) },
      { id: "ws-classic", phrases: ["kiểu cổ điển", "chế độ cổ điển", "cổ điển", "classic mode", "经典模式"], run: () => (switchWsMode("classic"), say("Kiểu cổ điển.", "Classic style.", "经典模式。")) },
      { id: "hologram-on", phrases: ["bật hologram", "hologram", "chế độ hạt", "dạng hạt", "turn on hologram", "hologram on", "particle mode", "打开全息", "全息"], run: () => (setHologram(true), say("Đã bật hologram.", "Hologram on.", "已打开全息。")) },
      { id: "hologram-off", phrases: ["tắt hologram", "mô hình đặc", "turn off hologram", "hologram off", "solid model", "关闭全息"], run: () => (setHologram(false), say("Đã về mô hình đặc.", "Solid model.", "已恢复实体模型。")) },
      { id: "camera-on", phrases: ["bật camera", "mở camera", "turn on camera", "start camera", "打开摄像头"], run: () => (setEnabled(true), say("Đã bật camera.", "Camera on.", "已打开摄像头。")) },
      { id: "camera-off", phrases: ["tắt camera", "turn off camera", "stop camera", "关闭摄像头"], run: () => (setEnabled(false), say("Đã tắt camera.", "Camera off.", "已关闭摄像头。")) },
      {
        id: "rescan",
        phrases: ["quét lại", "chụp lại", "scan again", "rescan", "重新扫描"],
        run: () => {
          if (modeRef.current !== "scan") {
            switchMode("scan");
            startRitual();
          } else fullRescan();
          return say("Quét lại.", "Scanning again.", "重新扫描。");
        },
      },
      // "bậc" và "tắc": cách nhận dạng tiếng Việt hay nghe lệch "bật" và "tắt".
      { id: "layer-on", phrases: ["bật lớp {x}", "bậc lớp {x}", "hiện lớp {x}", "hiện {x}", "bật {x}", "turn on {x}", "show {x}", "打开{x}层", "显示{x}"], run: (a) => setLayer(a, "visible", true) },
      { id: "layer-off", phrases: ["tắt lớp {x}", "tắc lớp {x}", "ẩn lớp {x}", "ẩn {x}", "tắt {x}", "turn off {x}", "hide {x}", "关闭{x}层", "隐藏{x}"], run: (a) => setLayer(a, "visible", false) },
      { id: "layer-fade", phrases: ["làm mờ {x}", "fade {x}", "淡化{x}"], run: (a) => setLayer(a, "faded", true) },
      { id: "layer-solid", phrases: ["bỏ mờ {x}", "làm rõ {x}", "unfade {x}"], run: (a) => setLayer(a, "faded", false) },
      { id: "explode", phrases: ["tách lớp", "tách rời", "explode", "分解"], run: () => ((tr().explode = 1), say("Đã tách lớp.", "Exploded.", "已分解。")) },
      { id: "collapse", phrases: ["gộp lại", "gộp lớp", "collapse", "合并"], run: () => ((tr().explode = 0), say("Đã gộp lại.", "Collapsed.", "已合并。")) },
      { id: "undo", phrases: ["hoàn tác", "undo", "撤销"], run: () => (undo(), say("Đã hoàn tác.", "Undone.", "已撤销。")) },
      { id: "reset", phrases: ["về vị trí ban đầu", "đặt lại", "reset", "重置"], run: () => (resetView(), say("Đã về vị trí ban đầu.", "Reset.", "已重置。")) },
      { id: "zoom-in", phrases: ["phóng to", "to lên", "zoom in", "放大"], run: () => ((tr().zoom = Math.min(3, tr().zoom * 1.3)), say("Phóng to.", "Zoomed in.", "放大。")) },
      { id: "zoom-out", phrases: ["thu nhỏ", "nhỏ lại", "zoom out", "缩小"], run: () => ((tr().zoom = Math.max(0.4, tr().zoom / 1.3)), say("Thu nhỏ.", "Zoomed out.", "缩小。")) },
      { id: "turn-left", phrases: ["xoay trái", "quay trái", "turn left", "rotate left", "向左转"], run: () => ((tr().rotY -= Math.PI / 4), say("Xoay trái.", "Turned left.", "向左转。")) },
      { id: "turn-right", phrases: ["xoay phải", "quay phải", "turn right", "rotate right", "向右转"], run: () => ((tr().rotY += Math.PI / 4), say("Xoay phải.", "Turned right.", "向右转。")) },
      { id: "turn-back", phrases: ["xoay ra sau", "nhìn phía sau", "back view", "后面"], run: () => ((tr().rotY += Math.PI), say("Nhìn phía sau.", "Back view.", "后面观。")) },
      { id: "hide-picked", phrases: ["vứt đi", "vứt", "ẩn cấu trúc này", "hide this", "扔掉"], run: () => (dropPicked(), say("Đã vứt cấu trúc đang chọn.", "Hid the selected structure.", "已隐藏所选结构。")) },
      { id: "clear", phrases: ["bỏ chọn", "clear selection", "取消选择"], run: () => (choose(null), say("Đã bỏ chọn.", "Selection cleared.", "已取消选择。")) },
    ];
  }, [VISION_PARTS, target, CATS, locale, toggleAtlasLayer, toggleLayer, scanPart, fireTarget, switchMode, switchWsMode, fullRescan, startRitual, undo, resetView, dropPicked, choose]);
  const controlVoiceActions = useMemo<VoiceAction[]>(() => {
    function send(text: string) {
      const child = controlFrameRef.current?.contentWindow as (Window & { wonderSnap?: { command: (text: string, language: string) => { ok: boolean; say: string } } }) | null;
      return child?.wonderSnap?.command(text, locale) ?? { ok: false, say: locale === 'en' ? 'Vision is still loading.' : 'Vision đang tải, vui lòng thử lại.' };
    }
    const fixed:[string,string[],string][]=[
      ['explode',['tách lớp','tách rời','explode'],'tách lớp'],['assemble',['lắp lại','ghép lại','assemble'],'lắp lại'],
      ['scan',['quét','quét lại','scan','scan again'],'quét'],['cancel-scan',['hủy quét','cancel scan'],'hủy quét'],
      ['zoom-in',['phóng to','zoom in'],'phóng to'],['zoom-out',['thu nhỏ','zoom out'],'thu nhỏ'],
      ['reset',['đặt lại','đặt lại góc nhìn','reset view'],'đặt lại'],
      ['rotate-off',['không xoay','đừng xoay','do not rotate','stop rotating','tắt xoay'],'không xoay'],
      ['rotate-on',['xoay','bật xoay','rotate','start rotating'],'xoay'],
      ['describe',['đọc chú thích','đọc mô tả','giải thích','read description','describe','what is this'],'đọc chú thích'],
      ['stop-reading',['dừng đọc','tắt loa','stop reading'],'dừng đọc'],
      ['camera-on',['bật camera','camera on'],'bật camera'],['camera-off',['tắt camera','camera off'],'tắt camera'],
      ['muscles',['tách từng cơ','separate muscles'],'tách từng cơ'],['systems',['tách các hệ','separate systems'],'tách các hệ'],
      ['next',['mẫu tiếp','mô hình tiếp','next model'],'mẫu tiếp'],['prev',['mẫu trước','previous model'],'mẫu trước'],
      ['show-all',['hiện tất cả','show all layers'],'hiện tất cả'],
      ['front',['mặt trước','front view'],'mặt trước'],['back',['mặt sau','back view'],'mặt sau'],['side',['nhìn bên','side view'],'nhìn bên'],
      ['clear',['bỏ chọn','clear selection'],'bỏ chọn'],['pull',['kéo ra','pull out'],'kéo ra'],['put-back',['đặt vào','put back'],'đặt vào'],
      ['labels-on',['bật chú thích','show labels'],'bật chú thích'],['labels-off',['tắt chú thích','hide labels'],'tắt chú thích'],
      ['cut',['bật mặt cắt','cross section'],'bật mặt cắt'],['cut-off',['tắt mặt cắt','turn off cross section'],'tắt mặt cắt'],
      ['record',['ghi hình','start recording'],'ghi hình'],['stop-record',['dừng ghi hình','stop recording'],'dừng ghi hình'],
      ['quiz',['kiểm tra','quiz'],'kiểm tra'],['stop-quiz',['dừng kiểm tra','stop quiz'],'dừng kiểm tra'],
    ];
    return [
      ...fixed.map(([id,phrases,text])=>({id:'vision-'+id,phrases,run:()=>send(text)})),
      {id:'vision-explode-model',phrases:['tách giải phẫu {x}','tách mô hình {x}','tách lớp {x}','tách rời {x}','explode {x}','separate {x}'],run:(arg:string)=>send('tách giải phẫu '+arg)},
      {id:'vision-rotate-degrees',phrases:['xoay {x} độ','xoay {x} do','quay {x} độ','rotate {x} degrees','rotate {x} degree','turn {x} degrees'],run:(arg:string)=>send('xoay '+arg+' độ')},
      {id:'vision-open',phrases:['mở mô hình {x}','mở {x}','open model {x}','open {x}'],run:(arg:string)=>send('open model '+arg)},
      {id:'vision-pick',phrases:['chọn cấu trúc {x}','chọn {x}','select {x}','pick {x}'],run:(arg:string)=>send('select '+arg)},
      {id:'vision-layer-on',phrases:['bật lớp {x}','hiện lớp {x}','show layer {x}'],run:(arg:string)=>send('show layer '+arg)},
      {id:'vision-layer-off',phrases:['tắt lớp {x}','ẩn lớp {x}','hide layer {x}'],run:(arg:string)=>send('hide layer '+arg)},
      {id:'vision-layer-only',phrases:['chỉ xem {x}','xem hệ {x}','show only {x}'],run:(arg:string)=>send('show only '+arg)},
    ].map(action=>({...action,exact:true}));
  },[locale]);
  useVoiceActions("vision-ai", viewMode === "control" ? controlVoiceActions : voiceActions);
  useEffect(()=>{
    const child=()=> (controlFrameRef.current?.contentWindow as (Window & {wonderSnap?:{stopVoice:()=>void;pauseVoice:(active:boolean)=>void}})|null)?.wonderSnap;
    const owner=(event:Event)=>{if((event as CustomEvent).detail?.owner==='bot')child()?.stopVoice();};
    const output=(event:Event)=>child()?.pauseVoice(!!(event as CustomEvent).detail?.active);
    const message=(event:MessageEvent)=>{if(event.origin!==location.origin||event.source!==controlFrameRef.current?.contentWindow)return;if(event.data?.type==='soma-voice-owner')window.dispatchEvent(new CustomEvent('soma-speech-owner',{detail:{owner:'vision'}}));};
    window.addEventListener('soma-speech-owner',owner);window.addEventListener('soma-speech-output',output);window.addEventListener('message',message);
    return()=>{window.removeEventListener('soma-speech-owner',owner);window.removeEventListener('soma-speech-output',output);window.removeEventListener('message',message);};
  },[]);

  const scanHint =
    scanPhase === "busy" ? tv.hintBusy
    : scanPhase === "armed" ? tv.hintArmed
    : scanMode === "hand"
      ? scanPhase === "locking" ? tv.hintHandHold : tv.hintHand
      : scanPhase === "locking" ? tv.hintLocking
      : scanPhase === "framing" ? tv.hintFraming
      : tv.hintIdle;

  // Một khung 3D, hai loại mô hình: mọi thứ khác (con trỏ, dwell, Vứt, Hoàn tác)
  // dùng chung, nên người dùng không cảm thấy có hai loại.
  // Hologram chỉ bật ở kiểu wonder (kiểu cổ điển giữ model đặc để học rõ).
  const holoActive = hologram && wsMode === "wonder" && viewMode === "control";
  const modelView =
    target.kind === "glb" ? (
      <GestureArmScene
        url={target.url}
        layers={layers}
        cursorRef={cursorRef}
        onHover={handleHover}
        transformRef={transformRef}
        hidden={hidden}
        pull={wsPull}
        dissolved={wsHidden}
        hologram={holoActive}
      />
    ) : (
      <GestureAtlasScene
        scene={target.scene}
        locale={locale}
        layers={atlasLayers}
        hidden={hidden}
        cursorRef={cursorRef}
        transformRef={transformRef}
        revealRef={revealRef}
        onHover={handleHover}
        onSide={onAtlasSide}
        pull={wsPull}
        dissolved={wsHidden}
        wonderLabels={viewMode === "control" && wsMode === "wonder"}
        hologram={holoActive}
      />
    );

  return <ContentSurface scope="src/app/[locale]/cu-chi/page.tsx">{(
    <div className="vision-workspace bd flex h-[100dvh] flex-col bg-[var(--surf-3)]">
      <header className="vision-topbar flex shrink-0 items-center gap-2">
        <a
          href={`/${locale}`}
          className="rounded-md border border-[var(--line)] px-2 py-0.5 text-xs font-semibold text-[var(--body-fg)] hover:bg-[var(--surf-2)]"
          title={t.back}
        >
          ← {t.back}
        </a>
        <h1 className="truncate text-xs font-semibold text-[var(--ink)]">
          Vision AI
        </h1>
        <span className="vision-topbar-note">{locale === "en" ? "Anatomy studio" : locale === "zh" ? "解剖工作室" : "Không gian học giải phẫu"}</span>
        <div className="ml-auto flex items-center gap-2">
          {showDebug && viewMode !== "control" && (
            <span className="text-xs text-[var(--muted)]">
              {t.detectFps}{" "}
              <b style={{ color: fps >= 20 ? "#0f8a7c" : fps >= 12 ? "#a9701a" : "#c0453b" }}>{fps}</b>
              {" · "}
              {t.renderFps} <b>{renderFps}</b>
              {" · "}
              {t.hands} {handCount}
              {backend ? ` · ${t.backend(backend)}` : ""}
            </span>
          )}
          {viewMode === "scan" && enabled && (
            <button
              onClick={fullRescan}
              title={t.rescan}
              className="rounded-md border border-[var(--line)] px-2 py-0.5 text-xs text-[var(--body-fg)] hover:bg-[var(--surf-2)]"
            >
              ↻ {t.rescan}
            </button>
          )}
          {viewMode === "scan" && (
          <button
            onClick={() => setEnabled((v) => !v)}
            className="rounded-md border border-[var(--line)] px-2 py-0.5 text-xs text-[var(--body-fg)] hover:bg-[var(--surf-2)]"
          >
            {enabled ? t.stop : t.start}
          </button>
          )}
        </div>
      </header>

      <div className="flex flex-1 gap-4 overflow-hidden p-4">
        <main
          ref={sceneBoxRef}
          className="relative flex-1 overflow-hidden rounded-xl border border-[var(--line)] bg-[#191c1f]"
        >
          {viewMode === "control" ? (
            <iframe ref={controlFrameRef} onLoad={(event) => {
              const child = event.currentTarget.contentWindow as (Window & { wonderSnap?: { enter: (id: string, stream: MediaStream | null) => void } }) | null;
              const stream = cameraStreamRef.current;
              child?.wonderSnap?.enter(controlHandoffRef.current ?? scanControlModel(target.slug, pickedPartRef.current), stream instanceof MediaStream ? stream : null);
            }} src={`/wonder/index.html?lang=${locale}&region=${scanControlModel(DEFAULT_VISION_SLUG)}&autostart=nocamera`} title="Vision AI — điều khiển giải phẫu bằng cử chỉ" className="absolute inset-0 h-full w-full border-0" allow="camera; microphone; fullscreen" />
          ) : (
          <>{scanFrame ? (
            // Khung 3D ĐÚNG TỶ LỆ ô vừa cắt, đặt giữa, kèm chính tấm ảnh đã
            // chụp ở góc để đối chiếu ngay bằng mắt.
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--surf-2)] p-2">
              <div ref={scanFrameRef} className="relative">
                {modelView}
                <div className="pointer-events-none absolute inset-0 border-2 border-[#f5c518]/70" />
              </div>
            </div>
          ) : (
            null
          )}

          {/* Panel trạng thái kiểu WonderSnap cũ đã thay bằng iframe nguyên bản
              ở tab Điều khiển nên không còn dùng. */}

          {/* Nói thẳng khi mô hình đang bị xoay theo bộ phận thật, kèm lối gỡ.
              Mô hình tự xoay mà người dùng không hiểu vì sao và không tắt được
              thì đó là cái bẫy, không phải tiện ích. */}
          {oriented && (
            <button
              data-gesture-target="reset"
              onClick={resetView}
              className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full border border-[#0f8a7c]/50 bg-[#0f8a7c]/12 px-4 py-1.5 text-xs text-[var(--ink)] hover:bg-[#0f8a7c]/20"
            >
              {tv.orientedNote}
            </button>
          )}

          {scanFrame && (
            // Góc TRÁI: góc phải đã là ô "Vứt", đặt chồng lên nhau thì vừa che
            // nhau vừa dễ bấm nhầm vào hành động phá huỷ.
            <figure className="pointer-events-none absolute left-3 top-3 w-24">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={scanFrame.shot}
                alt={tv.shot}
                className="w-full rounded-lg border border-[var(--line)] object-cover shadow"
              />
              <figcaption className="mt-1 text-center text-[11px] text-[var(--muted)]">
                {tv.shot}
              </figcaption>
            </figure>
          )}

          {hovered && (
            <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-lg bg-[#1c1813]/85 px-4 py-2 text-sm font-semibold text-[#f4efe6]">
              {hovered.name}
            </div>
          )}

          {/* Ảnh crop khít đã tách nền sau lần quét — góc PHẢI DƯỚI (góc phải
              trên đã là ô Vứt, góc trái dưới là camera). Bằng chứng "file ảnh
              cuối cùng" của spec, kèm log kích thước trong console. */}
          {false && (
            <figure className="pointer-events-none absolute bottom-3 right-3 w-28">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src=""
                alt=""
                className="w-full rounded-lg border border-[#37c9b3]/50 object-cover shadow"
              />
              <figcaption className="mt-1 text-center text-[11px] text-[var(--muted)]">
                {t.scanShot}
              </figcaption>
            </figure>
          )}

          {/* VÙNG "VỨT" — góc trên-phải khung 3D, đúng chỗ đã chốt trong thiết kế.
              Giữ con trỏ trong đây 2,5 giây (có đếm ngược) thì cấu trúc đang chọn
              bị ẩn; luôn lấy lại được bằng Undo. */}
          {/* Chỉ ở chế độ Điều khiển: lúc Quét không có mô hình nào để vứt, mà ô
              này lại đè lên khung camera — giữ tay ngắm ở góc đó là bấm nhầm. */}
          {/* VÙNG "Vứt" cũ của tab Điều khiển — tab này giờ là WonderSnap
              nguyên bản (tự lo mọi tương tác) nên không còn dùng. */}

          {/* MỘT thẻ <video> duy nhất cho cả hai chế độ — chỉ đổi lớp CSS.
              Chuyển nó sang chỗ khác trong cây React sẽ dựng lại phần tử và
              MẤT luồng camera, buộc xin quyền lại. Tab Điều khiển (WonderSnap
              iframe) không dùng camera ngoài nên ẩn hẳn nhưng vẫn gắn. */}
          <div
            className={
              viewMode === "scan"
                ? "absolute inset-0 overflow-hidden bg-[#191c1f]"
                : "hidden"
            }
          >
            <div className={viewMode === "scan" ? "relative h-full w-full" : "relative aspect-[4/3]"}>
              <video
                ref={videoRef}
                playsInline
                muted
                className="absolute inset-0 h-full w-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
              <canvas ref={camCanvasRef} className="absolute inset-0 h-full w-full" />
              <div className="pointer-events-none absolute left-5 top-5 z-10 flex items-center gap-3 rounded-xl bg-[#191c1f]/75 px-3 py-2 text-white"><span className="h-3 w-3 rounded-full bg-[#25c9b7]" /><div><div className="text-lg font-semibold">Vision AI</div><div className="text-xs text-[#bbc4cd]">{tv.title}</div></div></div>
              {/* NGHI THỨC TẦNG 1: đếm ngược 3-2-1 rồi tia laser quét. Lớp phủ
                  nằm TRONG khung video nên cả hai chế độ (quét toàn màn hình,
                  điều khiển thu nhỏ) đều thấy — và không đụng tới thẻ <video>
                  nên luồng camera không bao giờ bị dựng lại. */}
              {ritualCount > 0 && (
                <div className="absolute inset-0 grid place-items-center bg-black/45">
                  <div className="text-center">
                    <div className="text-7xl font-bold tabular-nums text-[#37c9b3]">
                      {ritualCount}
                    </div>
                    <p className="mt-2 text-sm text-white/85">{t.scanReady}</p>
                  </div>
                </div>
              )}
              {ritualScanning && (
                <div className="pointer-events-none absolute inset-x-0 top-2 text-center">
                  <span className="rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-[#37c9b3]">
                    {t.scanning}
                  </span>
                </div>
              )}
              {viewMode === "scan" && enabled && status !== "loading" && (
                <ScanOverlay
                  t={tv}
                  locale={locale}
                  stage={stage}
                  hint={scanHint}
                  shot={shot}
                  quality={quality}
                  guesses={guesses}
                  failure={failure}
                  shownPart={scanPart}
                  source={source}
                  askConsent={askConsent}
                  fire={fireTarget}
                />
              )}
              {!enabled && (
                <div className="absolute inset-0 grid place-items-center px-2 text-center text-xs text-white/70">
                  {viewMode === "scan" ? tv.enableHint : t.enableHint}
                </div>
              )}
            </div>
          </div>

          {status === "loading" && (
            <div className="absolute bottom-3 left-56 rounded-md bg-black/70 px-3 py-1.5 text-xs text-white">
              {t.loading}
            </div>
          )}
          {status === "error" && (
            <div className="absolute bottom-3 left-56 max-w-md rounded-md bg-red-900/85 px-3 py-2 text-xs leading-relaxed text-white">
              {errorCode ? t.err[errorCode] : error}
              {errorCode === "unknown" && error ? <span className="opacity-70"> ({error})</span> : null}
            </div>
          )}
          </>)}
        </main>

        {viewMode === "scan" && (
        <aside className="flex w-[218px] shrink-0 flex-col gap-3 overflow-y-auto" data-lenis-prevent aria-label={locale==='vi'?'Quét và chọn mô hình':'Scan and select a model'}>
          {viewMode === "scan" ? (
            <ScanSidebar t={tv} locale={locale} shownPart={scanPart} consent={consent} fire={fireTarget} />
          ) : (
          <>
          <div className="rounded-xl border-2 border-[var(--line)] bg-[var(--surf)] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
              {t.model}
            </h2>
            <select
              value={target.slug}
              onChange={(e) => fireTarget(`control:${e.target.value}`)}
              className="w-full rounded-lg border border-[var(--line)] bg-[var(--surf-2)] px-2 py-2 text-sm text-[var(--ink)]"
            >
              {QUICK_MODELS.map((slug) => {
                const m = getControlModel(slug);
                if (!m) return null;
                return (
                  <option key={slug} value={slug}>
                    {pick(m.title, locale)}
                  </option>
                );
              })}
            </select>
          </div>

          {/* HỒ SƠ SONG SINH (tầng 2): số đo từ lần pose lúc đếm ngược + zoom
              đã áp theo cỡ người. Có lưu máy nên vào lại vẫn còn. Không đo
              được thì card không hiện — không đoán mò. */}
          {twin && (
            <div className="rounded-xl border-2 border-[#37c9b3]/40 bg-[var(--surf)] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
                {t.twinTitle}
              </h2>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[var(--body-fg)]">{t.twinShoulder}</dt>
                  <dd className="font-semibold tabular-nums text-[var(--ink)]">
                    {Math.round(twin.m.shoulderW)} px
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--body-fg)]">{t.twinTorso}</dt>
                  <dd className="font-semibold tabular-nums text-[var(--ink)]">
                    {Math.round(twin.m.torso)} px
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--body-fg)]">{t.twinArm}</dt>
                  <dd className="font-semibold tabular-nums text-[var(--ink)]">
                    {Math.round(twin.m.armL)} / {Math.round(twin.m.armR)} px
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--body-fg)]">{t.twinZoom}</dt>
                  <dd className="font-semibold tabular-nums text-[#37c9b3]">
                    ×{twin.zoom.toFixed(2)}
                  </dd>
                </div>
              </dl>
              <p className="mt-2 text-[11px] leading-relaxed text-[var(--muted)]">{t.twinNote}</p>
            </div>
          )}

          <div className="rounded-xl border-2 border-[var(--line)] bg-[var(--surf)] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
              {t.selected}
            </h2>
            <p className="text-sm font-semibold text-[var(--ink)]">
              {picked ? picked.name : t.nothing}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                data-gesture-target="clear"
                onClick={() => choose(null)}
                className="flex-1 rounded-lg border border-[var(--line)] px-3 py-2 text-sm hover:bg-[var(--surf-2)]"
              >
                {t.clear}
              </button>
              <button
                data-gesture-target="undo"
                onClick={undo}
                disabled={undoDepth === 0}
                className="flex-1 rounded-lg border border-[var(--line)] px-3 py-2 text-sm hover:bg-[var(--surf-2)] disabled:opacity-40"
              >
                {t.undo}
                {undoDepth ? ` (${undoDepth})` : ""}
              </button>
            </div>
            {hidden.length > 0 && (
              <p className="mt-2 text-xs text-[var(--muted)]">{t.hiddenCount(hidden.length)}</p>
            )}
          </div>

          <div className="rounded-xl border-2 border-[var(--line)] bg-[var(--surf)] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
              {t.layers}
            </h2>
            <div className="space-y-1.5">
              {/* Mô hình atlas: lớp là LỚP BÀI HỌC (Xương · Cơ gấp–duỗi · Mạch máu…),
                  đúng bộ lớp của trang thư viện, và mở ra đúng lớp bật sẵn. */}
              {target.kind === "atlas" &&
                atlasLayerDefs(target.scene).map((l) => {
                  const st = atlasLayers[l.key] ?? { visible: true, faded: false };
                  const g = target.scene.groups.find((x) => l.groups.includes(x.key));
                  // Ô màu phải TRÙNG màu 3D thật: nhóm có tint thì dùng tint, nhóm
                  // toàn thân (mỗi nhóm là một hệ, không tint) thì dùng màu hệ —
                  // cùng công thức `g.tint ?? màu hệ` với khung 3D (build()).
                  const swatch =
                    g?.tint ?? SYSTEMS.find((s) => s.id === g?.key)?.color ?? "#b9ae98";
                  return (
                    <div key={l.key} className="flex items-center gap-2 text-sm">
                      <span
                        className="h-3 w-3 shrink-0 rounded-sm border border-black/10"
                        style={{ background: swatch }}
                      />
                      <span
                        className="min-w-0 flex-1 truncate"
                        title={pick(l.name, locale)}
                        style={{ opacity: st.visible ? 1 : 0.45 }}
                      >
                        {pick(l.name, locale)}
                      </span>
                      <button
                        data-gesture-target={`alayer:${l.key}:visible`}
                        onClick={() => toggleAtlasLayer(l.key, "visible")}
                        className="rounded-md border border-[var(--line)] px-2 py-1 text-xs hover:bg-[var(--surf-2)]"
                      >
                        {st.visible ? t.show : t.hide}
                      </button>
                      <button
                        data-gesture-target={`alayer:${l.key}:faded`}
                        onClick={() => toggleAtlasLayer(l.key, "faded")}
                        className="rounded-md border border-[var(--line)] px-2 py-1 text-xs hover:bg-[var(--surf-2)]"
                      >
                        {st.faded ? t.faded : t.solid}
                      </button>
                    </div>
                  );
                })}
              {target.kind === "glb" && CATS.filter((c) => target.cats.includes(c.key)).map((c) => {
                const st = layers[c.key];
                return (
                  <div key={c.key} className="flex items-center gap-2 text-sm">
                    <span
                      className="h-3 w-3 shrink-0 rounded-sm border border-black/10"
                      style={{ background: c.color }}
                    />
                    <span className="flex-1" style={{ opacity: st.visible ? 1 : 0.45 }}>
                      {c.label}
                    </span>
                    <button
                      data-gesture-target={`layer:${c.key}:visible`}
                      onClick={() => toggleLayer(c.key, "visible")}
                      className="rounded-md border border-[var(--line)] px-2 py-1 text-xs hover:bg-[var(--surf-2)]"
                    >
                      {st.visible ? t.show : t.hide}
                    </button>
                    <button
                      data-gesture-target={`layer:${c.key}:faded`}
                      onClick={() => toggleLayer(c.key, "faded")}
                      className="rounded-md border border-[var(--line)] px-2 py-1 text-xs hover:bg-[var(--surf-2)]"
                    >
                      {st.faded ? t.faded : t.solid}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border-2 border-[var(--line)] bg-[var(--surf)] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
              {t.actions}
            </h2>
            <div className="space-y-2">
              <button
                data-gesture-target="explode"
                onClick={() => fireTarget("explode")}
                className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm hover:bg-[var(--surf-2)]"
              >
                {t.explode}
              </button>
              <button
                data-gesture-target="reset"
                onClick={resetView}
                className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm hover:bg-[var(--surf-2)]"
              >
                {t.reset}
              </button>
            </div>
          </div>

          <div className="rounded-xl border-2 border-[var(--line)] bg-[var(--surf)] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
              {t.guide}
            </h2>
            <ul className="space-y-1.5 text-xs leading-relaxed text-[var(--body-fg)]">
              {(wsMode === "wonder" ? t.wonderGuideItems : t.guideItems).map((line) => (
                <GuideLine key={line} text={line} />
              ))}
              <li className="pt-1 text-[var(--muted)]">{t.bothHands}</li>
              <li className="pt-1 text-[var(--muted)]">{t.privacy}</li>
            </ul>
          </div>
          </>
          )}
        </aside>
        )}
      </div>

      <canvas
        ref={cursorCanvasRef}
        className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      />
    </div>
  )}</ContentSurface>;
}

/** Hạt phim, dựng một lần rồi lát lại — rẻ hơn nhiều so với rắc nhiễu từng pixel mỗi khung hình. */
let grainTile: HTMLCanvasElement | null = null;
function getGrainTile(): HTMLCanvasElement {
  if (grainTile) return grainTile;
  const size = 96;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d");
  if (g) {
    const img = g.createImageData(size, size);
    for (let i = 0; i < size * size; i++) {
      const v = 128 + (Math.random() - 0.5) * 90;
      img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
      img.data[i * 4 + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  }
  grainTile = c;
  return c;
}

/**
 * Ô NGẮM KIỂU PHIM — phần làm nên cảm giác của PuzzleCam.
 *
 * Bên trong ô KHÔNG phải khung kẻ suông mà là ảnh webcam đổ ĐEN–TRẮNG, tương
 * phản cao, có hạt. Người dùng nhìn thấy ngay tấm ảnh sắp chụp nên tự căn tay
 * cho vừa — thứ mà hai bản khung kẻ trước đây không có, và vì thế phải ngắm
 * bằng niềm tin.
 *
 * BA ĐIỂM KỸ THUẬT:
 *  1. Đổ đen–trắng bằng `ctx.filter` (GPU) chứ KHÔNG duyệt từng pixel như bản
 *     gốc. Vòng lặp `getImageData` trên vùng vài trăm nghìn pixel mỗi khung
 *     hình đủ để giết FPS trên Iris Xe — máy đích của dự án này.
 *  2. Phải VẼ LẬT: thẻ <video> đang được CSS lật gương còn canvas thì không,
 *     nên mẩu ảnh vẽ đè phải lật lại cho khớp nền phía dưới.
 *  3. Hạt phim lát từ ảnh dựng sẵn, không sinh nhiễu mỗi khung hình.
 */
function drawFilmFrame(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  frame: FrameInfo,
  box: Box,
  dest: { x: number; y: number; w: number; h: number },
  armed: boolean,
  progress: number,
  countdown: number,
  /** Ô do chính bàn tay sinh ra (đổi màu để phân biệt với ô hai tay ngắm). */
  onHand: boolean,
) {
  if (dest.w < 2 || dest.h < 2 || frame.width === 0) return;
  const src = boxToSourceRect(box, frame.width, frame.height);

  ctx.save();
  ctx.beginPath();
  ctx.rect(dest.x, dest.y, dest.w, dest.h);
  ctx.clip();

  // ---- ảnh đen–trắng, lật cho khớp ảnh gương phía dưới ----
  ctx.save();
  ctx.filter = "grayscale(1) contrast(1.28) brightness(1.04)";
  ctx.translate(dest.x + dest.w, dest.y);
  ctx.scale(-1, 1);
  try {
    ctx.drawImage(video, src.sx, src.sy, src.sw, src.sh, 0, 0, dest.w, dest.h);
  } catch {
    // khung hình chưa sẵn sàng — bỏ qua, khung sau vẽ lại
  }
  ctx.restore();

  // ---- hạt phim ----
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.globalCompositeOperation = "overlay";
  const tile = ctx.createPattern(getGrainTile(), "repeat");
  if (tile) {
    ctx.fillStyle = tile;
    ctx.fillRect(dest.x, dest.y, dest.w, dest.h);
  }
  ctx.restore();

  // ---- đếm ngược: làm tối ô và đếm số to giữa ô ----
  if (armed && countdown > 0) {
    ctx.fillStyle = "rgba(0,0,0,.45)";
    ctx.fillRect(dest.x, dest.y, dest.w, dest.h);
    ctx.font = `700 ${Math.max(48, Math.min(dest.w, dest.h) * 0.4)}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#f5c518";
    ctx.fillText(String(countdown), dest.x + dest.w / 2, dest.y + dest.h / 2);
  }
  ctx.restore();

  // ---- viền + bốn góc ----
  const color = armed ? "#37c9b3" : onHand ? "#4ea8f0" : "#f5c518";
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.strokeRect(dest.x, dest.y, dest.w, dest.h);
  const arm = Math.min(18, Math.min(dest.w, dest.h) * 0.25);
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  for (const [cx, cy, dx, dy] of [
    [dest.x, dest.y, 1, 1],
    [dest.x + dest.w, dest.y, -1, 1],
    [dest.x, dest.y + dest.h, 1, -1],
    [dest.x + dest.w, dest.y + dest.h, -1, -1],
  ] as [number, number, number, number][]) {
    ctx.beginPath();
    ctx.moveTo(cx, cy + arm * dy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + arm * dx, cy);
    ctx.stroke();
  }

  // ---- vạch tiến trình lúc đang giữ chụm ----
  if (!armed && progress > 0) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(dest.x, dest.y + dest.h);
    ctx.lineTo(dest.x + dest.w * Math.min(progress, 1), dest.y + dest.h);
    ctx.stroke();
  }
  // ---- nhãn sống của khung 2 ngón trỏ: chụm vào / giãn ra đổi cỡ ----
  // Khung do 2 đầu ngón trỏ sinh ra (không phải ô tự bám tay): hiện kích thước
  // tương đối + câu nhắc để người dùng biết "chụm vào là nhỏ lại, giãn ra là
  // to ra". Chữ vẽ bằng canvas nên không tốn render React mỗi khung hình.
  if (!onHand && !armed && dest.w > 60 && dest.h > 40) {
    const label = progress > 0 ? "GIỮ NGUYÊN…" : "CHỤM / GIÃN 2 NGÓN TRỎ ĐỔI CỠ";
    ctx.save();
    ctx.font = "600 11px system-ui";
    const tw = ctx.measureText(label).width;
    const bx = dest.x + Math.min(Math.max(dest.w - tw - 16, 0), Math.max(dest.w / 2 - tw / 2, 0));
    const by = dest.y - 24;
    if (by > 4) {
      ctx.fillStyle = "rgba(0,0,0,.62)";
      ctx.beginPath();
      ctx.roundRect(bx, by, tw + 16, 18, 9);
      ctx.fill();
      ctx.fillStyle = "#f5c518";
      ctx.fillText(label, bx + 8, by + 13);
    }
    ctx.restore();
  }
  // ---- ô tự bám TAY NGANG: đường trục cẳng tay + nhãn ----
  // Tay giơ ngang thì trục cổ tay–cẳng tay gần như nằm ngang; kẻ một đường trục
  // mờ trong ô để người dùng thấy máy đã "hiểu" hướng tay, không cắt cụt.
  if (onHand && !armed && dest.w > 80) {
    ctx.save();
    ctx.strokeStyle = "rgba(78,168,240,.65)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([7, 6]);
    ctx.beginPath();
    ctx.moveTo(dest.x + 6, dest.y + dest.h / 2);
    ctx.lineTo(dest.x + dest.w - 6, dest.y + dest.h / 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = "600 11px system-ui";
    const tag = "ĐANG QUÉT TAY";
    const tww = ctx.measureText(tag).width;
    ctx.fillStyle = "rgba(0,0,0,.62)";
    ctx.beginPath();
    ctx.roundRect(dest.x + 6, dest.y + 6, tww + 16, 18, 9);
    ctx.fill();
    ctx.fillStyle = "#bfe0ff";
    ctx.fillText(tag, dest.x + 14, dest.y + 19);
    ctx.restore();
  }
  ctx.restore();
}

function cmsSourceVISION_PARTS() { return VISION_PARTS; }
function cmsSourceCATS() { return CATS; }
function cmsSourceSYSTEMS() { return SYSTEMS; }
