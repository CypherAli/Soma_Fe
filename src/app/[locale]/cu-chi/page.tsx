"use client";

import { use, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import GestureArmScene, {
  defaultTransform,
  type LayerState,
} from "@/components/gesture/GestureArmScene";
import { useProgress } from "@react-three/drei";
import { CATS, type CatKey } from "@/lib/anatomy/layers";
import {
  DEFAULT_LAYERED_SLUG,
  getLayeredModel,
  type LayeredModel,
} from "@/lib/anatomy/layeredModels";
import { pick, type Loc } from "@/lib/homeContent";
import type { Landmark } from "@/lib/gesture/handModel";
import { gestureText } from "@/lib/gesture/gestureText";
import { CursorSmoother } from "@/lib/gesture/oneEuro";
import {
  ModeStabilizer,
  PinchClick,
  analyze,
  angleDelta,
  deadzone,
  isPinching,
  twoHandSpan,
  zoomFromTwoHands,
  type HandMode,
} from "@/lib/gesture/gestures";
import {
  HAND_BONES,
  probeHandWorker,
  useHandTracking,
  type FrameInfo,
  type FrameMeta,
  type TrackedHand,
} from "@/lib/gesture/useHandTracking";
import { useRouter } from "@/i18n/navigation";
import { getScene } from "@/lib/catalog";
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
  isVisionPartKey,
  rankGuesses,
  type VisionGuess,
  type VisionPartKey,
} from "@/lib/vision/parts";
import { visionText } from "@/lib/vision/visionText";
import { detectPoseOnce, disposePose, preloadPose } from "@/lib/vision/poseOnce";
import { orientationFor, type OrientationSnapshot } from "@/lib/vision/orientation";
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

/** Chỉ số mốc cổ tay trong bộ 21 điểm bàn tay. */
const LM_WRIST = 0;

const DWELL_MS = 1200;
const TRASH_DWELL_MS = 2500; // "vứt" là hành động phá huỷ → cố ý bắt giữ lâu hơn
const DWELL_MOVE_TOL_PX = 70;
/** Giữ quá nửa vòng tiến trình thì KHOÁ mục tiêu: tay lệch nhẹ không mất công giữ. */
const DWELL_LOCK_AT = 0.45;
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
function initLayers(model: LayeredModel): LayerState {
  return Object.fromEntries(
    CATS.map((c) => [
      c.key,
      { visible: true, faded: model.faded.includes(c.key) },
    ]),
  ) as LayerState;
}
const PAN_LIMIT = 0.28;
const ROT_STEP_MAX = 0.25;
/** Vùng chết: tay phải đi quá ngần này (tỉ lệ màn hình / radian) mới tính là cố ý. */
const PAN_DEAD = 0.035;
const ROT_DEAD = 0.12;
const TILT_DEAD = 0.09;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const CURSOR_COLOR: Record<HandMode, string> = {
  point: "#ffffff",
  zoom: "#b98cff",
  rotate: "#ffb347",
  pan: "#7fb2ff",
};

type Picked = { name: string; raw: string; cat: CatKey };
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
};

/** Một bước có thể hoàn tác. */
type UndoStep = { label: string; undo: () => void };

function GuideLine({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <li>
      • {parts.map((p, i) => (i % 2 ? <b key={i}>{p}</b> : <span key={i}>{p}</span>))}
    </li>
  );
}

export default function GestureControlPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: rawLocale } = use(params);
  // Đọc `?che-do=quet` qua PROP chứ không qua window.location: prop này máy chủ
  // cũng thấy, nên HTML dựng sẵn và HTML trình duyệt dựng ra giống nhau. Đọc từ
  // window trong lúc render là nguyên nhân gây lỗi hydration đã gặp.
  const initialMode = use(searchParams)["che-do"] === "quet" ? "scan" : "control";
  const locale = (["vi", "en", "zh"].includes(rawLocale) ? rawLocale : "vi") as Loc;
  const t = useMemo(() => gestureText(locale), [locale]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const camCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneBoxRef = useRef<HTMLDivElement | null>(null);

  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState<Picked | null>(null);
  const [picked, setPicked] = useState<Picked | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);
  const [undoDepth, setUndoDepth] = useState(0);
  const [modes, setModes] = useState<{ side: string; mode: HandMode }[]>([]);
  /**
   * MÔ HÌNH ĐANG ĐIỀU KHIỂN. Trước đây trang này đóng đinh vào cẳng tay; nay
   * quét ra vùng nào thì nạp thẳng mô hình vùng đó vào đúng chế độ điều khiển
   * này — cả vòng từ quét tới bóc lớp không rời trang, không đụng chuột.
   */
  const [target, setTarget] = useState<LayeredModel>(
    () => getLayeredModel(DEFAULT_LAYERED_SLUG)!,
  );
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
  const [layers, setLayers] = useState<LayerState>(() => initLayers(getLayeredModel(DEFAULT_LAYERED_SLUG)!));

  // ---- chế độ quét (dùng chung camera và vòng lặp tay với chế độ điều khiển) ----
  const tv = useMemo(() => visionText(locale), [locale]);
  const router = useRouter();
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
  const modeSigRef = useRef("");
  const stabilizersRef = useRef<Map<string, ModeStabilizer>>(new Map());
  const pinchRef = useRef<Map<string, PinchClick>>(new Map());
  const smoothRef = useRef<Map<string, CursorSmoother>>(new Map());
  const flashRef = useRef<Map<string, number>>(new Map());
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

  const undo = useCallback(() => {
    const step = undoRef.current.pop();
    setUndoDepth(undoRef.current.length);
    step?.undo();
  }, []);

  useEffect(() => {
    (window as unknown as { somaGesture?: unknown }).somaGesture = transformRef.current;
  }, []);

  // Model tư thế chiếm bộ nhớ GPU đáng kể; rời trang thì trả lại.
  useEffect(() => () => disposePose(), []);

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

  const handleHover = useCallback((info: Picked | null) => {
    if (hoveredRef.current?.raw === info?.raw) return;
    hoveredRef.current = info;
    setHovered(info);
  }, []);

  const choose = useCallback((info: Picked | null) => {
    pickedRef.current = info;
    setPicked(info);
  }, []);

  const resetView = useCallback(() => {
    const tr = transformRef.current;
    tr.rotX = 0;
    tr.rotY = 0;
    // Xoá cả góc nghiêng và phép lật do lần quét đặt vào: "về vị trí ban đầu"
    // mà vẫn còn nghiêng thì nút ấy nói dối.
    tr.rotZ = 0;
    tr.mirror = false;
    setOriented(false);
    tr.zoom = 1;
    tr.panX = 0;
    tr.panY = 0;
    // Mốc neo cũ vô nghĩa sau khi về vị trí gốc — xoá để lần giơ tay kế tiếp neo
    // lại từ đầu, nếu không mô hình sẽ nhảy ngược về chỗ cũ.
    anchorsRef.current.clear();
    zoomAnchorRef.current = null;
  }, []);

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
    setStage("scan");
    stageRef.current = "scan";
    setShot(null);
    setQuality(null);
    setGuesses([]);
    setFailure(null);
  }, []);

  /** Hỏi dịch vụ GPU. Trả về null nếu không dùng được (chưa cấu hình, lỗi, mạng hỏng). */
  const askGpu = useCallback(async (dataUrl: string): Promise<GpuAnswer> => {
    try {
      const res = await fetch("/api/vision/identify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      const data = (await res.json().catch(() => ({}))) as { results?: unknown; error?: string };
      if (!res.ok) return { rows: null, offline: data.error === "vision-offline" };
      const confident = rankGuesses(data.results, 3).filter((g) => g.score >= VISION_MIN_SCORE);
      return { rows: confident.length > 0 ? confident : null };
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

      // Chỉ chấm chất lượng trên PHẦN ẢNH THẬT, không tính viền xám: viền phẳng
      // lì sẽ kéo phương sai Laplacian xuống và ảnh nét cũng bị báo là nhoè.
      const q = assessCrop(
        ctx.getImageData(fit.dx, fit.dy, fit.dw, fit.dh),
        Math.max(rect.sw, rect.sh),
        Math.min(rect.sw, rect.sh),
      );
      const url = c.toDataURL("image/jpeg", 0.85);

      // Ảnh CẢ KHUNG HÌNH tại đúng thời điểm chụp, để tầng mốc giải phẫu xét
      // trên chính khoảnh khắc đó chứ không phải khung hình vài chục mili giây
      // sau. Thu nhỏ về 640 px: Pose không cần hơn, mà nhỏ thì nhanh hơn hẳn.
      const full = document.createElement("canvas");
      const fw = 640;
      full.width = fw;
      full.height = Math.max(1, Math.round((fw * v.videoHeight) / v.videoWidth));
      full.getContext("2d")?.drawImage(v, 0, 0, full.width, full.height);

      const gen = (scanGenRef.current += 1);
      shotBoxRef.current = { aspect: rect.sw / rect.sh, shot: url };
      orientSnapRef.current = handSnap ? { hand: handSnap } : {};
      setShot(url);
      setQuality(q);
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
      void runRecognition(url, full, box, v.videoWidth / v.videoHeight, handWrist, gen).finally(
        () => {
          // Chỉ hạ cờ bận nếu vẫn còn là phiên của mình: phiên sau đã tự hạ rồi,
          // hạ đè lên là mở đường cho một lần chụp trùng.
          if (gen === scanGenRef.current) busyRef.current = false;
        },
      );
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
    (targetKey: string) => {
      const tr = transformRef.current;
      // ---- mục tiêu của chế độ quét ----
      if (targetKey.startsWith("part:")) {
        const key = targetKey.slice(5);
        if (isVisionPartKey(key)) {
          pickedPartRef.current = key;
          setScanPart(key);
        }
        return;
      }
      // "control:<slug>" — NẠP MÔ HÌNH VÀO NGAY CHẾ ĐỘ ĐIỀU KHIỂN.
      // Đây là mắt xích khiến cả vòng không cần chuột: quét ra vùng → chọn →
      // mô hình vùng đó hiện ra ngay tại chỗ, tay vẫn đang giơ, xoay/bóc lớp
      // tiếp bằng cử chỉ. Không điều hướng, không tải lại trang, nên luồng
      // webcam không hề bị ngắt.
      if (targetKey.startsWith("control:")) {
        const model = getLayeredModel(targetKey.slice(8));
        if (!model) return;
        setTarget(model);
        setScanFrame(shotBoxRef.current);
        // XOAY MÔ HÌNH THEO GÓC BỘ PHẬN THẬT. Chỉ áp thứ đo được (nghiêng trong
        // mặt phẳng ảnh + bên trái/phải); ngửa/sấp và ngửa/cúi thì để nguyên vì
        // không đo nổi cho ra hồn — xem `orientation.ts`.
        const part = pickedPartRef.current;
        const ori = part ? orientationFor(part, orientSnapRef.current) : null;
        setOriented(!!ori);
        setLayers(initLayers(model));
        // Mô hình mới thì mọi thứ gắn với mô hình cũ đều vô nghĩa.
        setHidden([]);
        undoRef.current = [];
        setUndoDepth(0);
        choose(null);
        handleHover(null);
        resetView();
        if (ori) {
          transformRef.current.rotZ = ori.rollRad;
          transformRef.current.mirror = ori.mirror;
        }
        setViewMode("control");
        modeRef.current = "control";
        dwellsRef.current.clear();
        return;
      }
      if (targetKey.startsWith("scene:")) {
        const scene = getScene(targetKey.slice(6));
        if (scene) router.push(scene.href);
        return;
      }
      if (targetKey === "rescan") return rescan();
      if (targetKey === "consent:yes") return saveConsent(true);
      if (targetKey === "consent:no") return saveConsent(false);

      if (targetKey.startsWith("mesh:")) choose(hoveredRef.current);
      else if (targetKey.startsWith("layer:")) {
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
    [choose, dropPicked, handleHover, pushUndo, rescan, resetView, router, saveConsent, toggleLayer, undo],
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
   * Tìm nút mà con trỏ đang nhắm tới, KÈM LỰC HÚT.
   *
   * Chỉ dùng `elementFromPoint` thì phải giữ tay đúng trong lòng nút suốt hơn
   * một giây — với bàn tay lơ lửng giữa không khí thì gần như bất khả thi. Nên
   * nếu không trúng nút nào, ta tìm nút gần nhất trong bán kính rồi kéo con trỏ
   * về tâm nó.
   */
  const aimTarget = useCallback((x: number, y: number) => {
    const direct = (document.elementFromPoint(x, y) as HTMLElement | null)?.closest<HTMLElement>(
      "[data-gesture-target]",
    );
    if (direct) {
      const r = direct.getBoundingClientRect();
      return {
        key: direct.dataset.gestureTarget ?? "",
        x: r.left + r.width / 2,
        y: r.top + r.height / 2,
      };
    }
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
  }, []);

  const handleFrame = useCallback(
    (hands: TrackedHand[], frame: FrameInfo, now: number, meta: FrameMeta) => {
      const txt = textRef.current;
      const analyzed = analyze(hands, stabilizersRef.current);
      const scanning = modeRef.current === "scan";

      // ---- CHẾ ĐỘ QUÉT: nhịp ngắm → chốt → đếm ngược → chụp ----
      // Chạy TRƯỚC phần vẽ để khung vẽ ra luôn là khung mới nhất của khung hình này.
      let scanBox: Box | null = null;
      let scanArmed = false;
      let scanOnHand = false;
      let scanProgress = 0;
      let scanCount = 0;
      if (scanning && stageRef.current === "scan" && frame.height > 0) {
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
      const bothPinch =
        !scanning && analyzed.length === 2 && analyzed.every((a) => isPinching(a.fingers));
      if (bothPinch) {
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
        for (const a of analyzed) {
          const color = bothPinch ? CURSOR_COLOR.zoom : CURSOR_COLOR[a.mode];
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

        if (bothPinch) {
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
      }

      const ov = fitCanvas(cursorCanvasRef.current);
      const ow = ov?.w ?? 0;
      const oh = ov?.h ?? 0;
      const octx = ov?.ctx ?? null;
      octx?.clearRect(0, 0, ow, oh);

      const sig = bothPinch
        ? "zoom2"
        : analyzed.map((a) => `${a.hand.handedness}:${a.mode}`).join("|");
      if (sig !== modeSigRef.current) {
        modeSigRef.current = sig;
        setModes(
          bothPinch
            ? [{ side: "", mode: "zoom" as HandMode }]
            : analyzed.map((a) => ({ side: a.hand.handedness, mode: a.mode })),
        );
      }

      if (scanning && stageRef.current === "scan") {
        // Đang ngắm khung thì hai tay đều bận giữ góc — hiện thêm con trỏ chỉ
        // làm rối, và dwell sẽ bấm nhầm nút phía sau.
        cursorRef.current.active = false;
        dwellsRef.current.clear();
        return;
      }

      if (analyzed.length === 0) {
        cursorRef.current.active = false;
        dwellsRef.current.clear();
        anchorsRef.current.clear();
        smoothRef.current.clear();
        return;
      }

      const tr = transformRef.current;
      const box = sceneBoxRef.current?.getBoundingClientRect();

      for (const a of analyzed) {
        const id = a.hand.handedness;
        const mode: HandMode = bothPinch ? "zoom" : a.mode;

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

        if (meta.fresh && !bothPinch && !scanning) {
          if (mode === "rotate") {
            // Xoay = góc nghiêng bàn tay so với LÚC BẮT ĐẦU xoè tay, trừ vùng chết.
            const dA = deadzone(angleDelta(a.fingers.angle, anchor.angle), ROT_DEAD);
            const targetY = anchor.rotY + dA * 1.8;
            tr.rotY += clamp(targetY - tr.rotY, -ROT_STEP_MAX, ROT_STEP_MAX);
            const dy = deadzone((raw.y - anchor.y) / Math.max(oh, 1), TILT_DEAD);
            const targetX = clamp(anchor.rotX + dy * Math.PI * 1.2, -Math.PI / 2, Math.PI / 2);
            tr.rotX += clamp(targetX - tr.rotX, -ROT_STEP_MAX, ROT_STEP_MAX);
          } else if (mode === "pan") {
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

        if (mode === "point") {
          // Đã giữ quá nửa thì khoá mục tiêu lại, tay lệch ra không mất công giữ.
          const locked = dwell.progress >= DWELL_LOCK_AT ? dwell.key : "";
          const aim = aimTarget(sx, sy);
          if (aim && !locked) {
            sx += (aim.x - sx) * 0.35;
            sy += (aim.y - sy) * 0.35;
          }

          if (box && (id === "Right" || analyzed.length === 1)) {
            const rx = (sx - box.left) / box.width;
            const ry = (sy - box.top) / box.height;
            cursorRef.current.x = rx;
            cursorRef.current.y = ry;
            cursorRef.current.active = rx >= 0 && rx <= 1 && ry >= 0 && ry <= 1;
          }

          const aimed = locked || aim?.key || "";
          const targetKey =
            !aimed && cursorRef.current.active && hoveredRef.current && id === "Right"
              ? `mesh:${hoveredRef.current.raw}`
              : aimed;

          const dwellMs = targetKey === "trash" ? TRASH_DWELL_MS : DWELL_MS;
          if (
            meta.fresh &&
            pinch.push(a.fingers.pinchSpan, now) &&
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
          if (id === "Right") cursorRef.current.active = false;
        }

        // ---- vẽ con trỏ ----
        if (octx) {
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
          const text = `${id === "Right" ? "A" : "B"} · ${txt.mode[mode]}`;
          octx.font = "600 12px system-ui";
          const tw = octx.measureText(text).width;
          octx.fillStyle = "rgba(20,16,12,.82)";
          octx.beginPath();
          octx.roundRect(sx + 22, sy - 22, tw + 14, 22, 6);
          octx.fill();
          octx.fillStyle = "#fff";
          octx.fillText(text, sx + 29, sy - 7);
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
        }
      }
    },
    [aimTarget, capture, fireTarget, fitCanvas],
  );

  const { fps, renderFps, handCount, status, error, errorCode, backend } = useHandTracking(
    videoRef,
    enabled,
    {
      onFrame: handleFrame,
      maxHands: 2,
      // HAI ĐỘ PHÂN GIẢI TRÊN MỘT LUỒNG, đặt chung cho cả hai chế độ nên đổi
      // chế độ KHÔNG phải mở lại camera: ảnh gốc 720p để mẩu cắt lúc quét còn
      // đủ nét, còn MediaPipe vẫn chỉ nhận ảnh thu nhỏ 480 px như trước nên
      // tốc độ bắt tay không đổi trên máy yếu.
      videoWidth: 1280,
      videoHeight: 720,
      detectWidth: 480,
    },
  );

  /**
   * Đổi chế độ. Luôn ĐẶT LẠI nhịp quét: bỏ dở giữa chừng rồi quay lại mà máy
   * vẫn đang đếm ngược thì nó tự chụp một khung hình vô nghĩa.
   */
  const switchMode = useCallback(
    (next: "control" | "scan") => {
      if (next === viewMode) return;
      rescan();
      setViewMode(next);
      modeRef.current = next;
      dwellsRef.current.clear();
      anchorsRef.current.clear();
      cursorRef.current.active = false;
    },
    [rescan, viewMode],
  );

  const scanHint =
    scanPhase === "busy" ? tv.hintBusy
    : scanPhase === "armed" ? tv.hintArmed
    : scanMode === "hand"
      ? scanPhase === "locking" ? tv.hintHandHold : tv.hintHand
      : scanPhase === "locking" ? tv.hintLocking
      : scanPhase === "framing" ? tv.hintFraming
      : tv.hintIdle;

  // Mô hình 3D nặng vài MB: không báo gì thì lúc đổi mô hình trông như treo máy.
  const { active: loadingModel } = useProgress();

  const modeLabel = modes.length
    ? modes
        .map((m) => (m.side ? `${m.side === "Right" ? t.right : t.left}: ` : "") + t.mode[m.mode])
        .join(" · ")
    : t.noHand;

  return (
    <div className="bd flex h-screen flex-col bg-[var(--surf-3)]">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[var(--line)] bg-[var(--surf)] px-4">
        <h1 className="text-sm font-semibold text-[var(--ink)]">
          {viewMode === "scan" ? tv.title : t.title}
        </h1>
        <div className="flex rounded-lg border border-[var(--line)] p-0.5">
          {(["scan", "control"] as const).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                viewMode === m
                  ? "bg-[var(--ink)] text-[var(--surf)]"
                  : "text-[var(--body-fg)] hover:bg-[var(--surf-2)]"
              }`}
            >
              {m === "scan" ? tv.tabScan : tv.tabControl}
            </button>
          ))}
        </div>
        {viewMode === "control" && (
          <>
            <span className="hidden max-w-[14rem] truncate rounded-full bg-[var(--surf-2)] px-3 py-1 text-xs font-semibold text-[var(--ink)] md:inline">
              {pick(target.title, locale)}
            </span>
            <span className="hidden rounded-full bg-[var(--surf-2)] px-3 py-1 text-xs text-[var(--body-fg)] lg:inline">
              {loadingModel ? tv.loadingModel : modeLabel}
            </span>
          </>
        )}
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-[var(--muted)]">
            {t.detectFps}{" "}
            <b style={{ color: fps >= 20 ? "#0f8a7c" : fps >= 12 ? "#a9701a" : "#c0453b" }}>{fps}</b>
            {" · "}
            {t.renderFps} <b>{renderFps}</b>
            {" · "}
            {t.hands} {handCount}
            {backend ? ` · ${t.backend(backend)}` : ""}
          </span>
          <button
            onClick={() => setEnabled((v) => !v)}
            className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--body-fg)] hover:bg-[var(--surf-2)]"
          >
            {enabled ? t.stop : t.start}
          </button>
        </div>
      </header>

      <div className="flex flex-1 gap-4 overflow-hidden p-4">
        <main
          ref={sceneBoxRef}
          className="relative flex-1 overflow-hidden rounded-xl border border-[var(--line)]"
        >
          {scanFrame ? (
            // Khung 3D ĐÚNG TỶ LỆ ô vừa cắt, đặt giữa, kèm chính tấm ảnh đã
            // chụp ở góc để đối chiếu ngay bằng mắt.
            <div className="absolute inset-0 flex items-center justify-center bg-[#f4efe6] p-2">
              <div ref={scanFrameRef} className="relative">
                <GestureArmScene
                  url={target.url}
                  layers={layers}
                  cursorRef={cursorRef}
                  onHover={handleHover}
                  transformRef={transformRef}
                  hidden={hidden}
                />
                <div className="pointer-events-none absolute inset-0 border-2 border-[#f5c518]/70" />
              </div>
            </div>
          ) : (
            <GestureArmScene
              url={target.url}
              layers={layers}
              cursorRef={cursorRef}
              onHover={handleHover}
              transformRef={transformRef}
              hidden={hidden}
            />
          )}

          {/* Nói thẳng khi mô hình đang bị xoay theo bộ phận thật, kèm lối gỡ.
              Mô hình tự xoay mà người dùng không hiểu vì sao và không tắt được
              thì đó là cái bẫy, không phải tiện ích. */}
          {oriented && (
            <button
              data-gesture-target="reset"
              onClick={resetView}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-[#0f8a7c]/50 bg-[#0f8a7c]/12 px-4 py-1.5 text-xs text-[var(--ink)] hover:bg-[#0f8a7c]/20"
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

          {/* VÙNG "VỨT" — góc trên-phải khung 3D, đúng chỗ đã chốt trong thiết kế.
              Giữ con trỏ trong đây 2,5 giây (có đếm ngược) thì cấu trúc đang chọn
              bị ẩn; luôn lấy lại được bằng Undo. */}
          <div
            data-gesture-target="trash"
            onClick={dropPicked}
            className="absolute right-3 top-3 flex h-24 w-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#d0453b]/60 bg-[#d0453b]/10 text-center text-xs font-semibold text-[#c0453b]"
          >
            <span className="text-lg">🗑</span>
            {t.trash}
            <span className="mt-0.5 font-normal opacity-70">{t.trashHint}</span>
          </div>

          {/* MỘT thẻ <video> duy nhất cho cả hai chế độ — chỉ đổi lớp CSS.
              Chuyển nó sang chỗ khác trong cây React sẽ dựng lại phần tử và
              MẤT luồng camera, buộc xin quyền lại. */}
          <div
            className={
              viewMode === "scan"
                ? "absolute inset-0 overflow-hidden bg-black"
                : "absolute bottom-3 left-3 w-52 overflow-hidden rounded-lg border border-[var(--line)] bg-black"
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
        </main>

        <aside className="flex w-72 shrink-0 flex-col gap-3 overflow-y-auto" data-lenis-prevent>
          {viewMode === "scan" ? (
            <ScanSidebar t={tv} locale={locale} shownPart={scanPart} consent={consent} fire={fireTarget} />
          ) : (
          <>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surf)] p-4">
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

          <div className="rounded-xl border border-[var(--line)] bg-[var(--surf)] p-4">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
              {t.layers}
            </h2>
            <div className="space-y-1.5">
              {CATS.filter((c) => target.cats.includes(c.key)).map((c) => {
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

          <div className="rounded-xl border border-[var(--line)] bg-[var(--surf)] p-4">
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

          <div className="rounded-xl border border-[var(--line)] bg-[var(--surf)] p-4">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-2)]">
              {t.guide}
            </h2>
            <ul className="space-y-1.5 text-xs leading-relaxed text-[var(--body-fg)]">
              {t.guideItems.map((line) => (
                <GuideLine key={line} text={line} />
              ))}
              <li className="pt-1 text-[var(--muted)]">{t.bothHands}</li>
              <li className="pt-1 text-[var(--muted)]">{t.privacy}</li>
            </ul>
          </div>
          </>
          )}
        </aside>
      </div>

      <canvas
        ref={cursorCanvasRef}
        className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      />
    </div>
  );
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
  ctx.restore();
}
