"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HandLandmarker, HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { Point2DFilter } from "./oneEuro";

// Hằng số và kiểu mô tả bàn tay nằm ở `handModel.ts` (thuần, không dính
// React) — re-export ở đây để mọi nơi đang import từ file này không phải sửa.
export {
  LM,
  HAND_BONES,
  type Landmark,
  type TrackedHand,
  type FrameInfo,
  type FrameMeta,
} from "./handModel";
import { LM, type TrackedHand, type FrameInfo, type FrameMeta } from "./handModel";
import type { WorkerIn, WorkerOut } from "./handWorker";


type Options = {
  /** Pause inference while another view uses the same camera stream. */
  paused?: boolean;
  /**
   * Gọi MỖI KHUNG HÌNH MÀN HÌNH với dữ liệu tay mới nhất. Chạy ngoài vòng đời
   * React — TUYỆT ĐỐI không setState ở đây trừ khi có sự kiện thật (chọn/hủy),
   * nếu không sẽ gây bão re-render và tụt FPS.
   */
  onFrame?: (hands: TrackedHand[], frame: FrameInfo, timestampMs: number, meta: FrameMeta) => void;
  /** Số tay tối đa cần theo dõi (1 nhẹ hơn, 2 cho cử chỉ hai tay). */
  maxHands?: number;
  /**
   * Giãn cách tối thiểu giữa 2 lần NHẬN DIỆN (ms). Nhận diện là khâu tốn nhất;
   * chạy ~25 lần/giây là đủ cho cử chỉ. Overlay vẫn vẽ theo nhịp màn hình nên
   * con trỏ không hề giật vì con số này.
   */
  detectIntervalMs?: number;
  /** Độ phân giải webcam yêu cầu — thấp hơn = nhận diện nhanh hơn nhiều. */
  videoWidth?: number;
  videoHeight?: number;
  /**
   * HAI ĐỘ PHÂN GIẢI TRÊN MỘT LUỒNG. Khác 0 thì mỗi lần nhận diện, khung hình
   * được thu nhỏ về bề ngang này rồi mới đưa cho MediaPipe.
   *
   * Vì sao cần: trang điều khiển bằng cử chỉ chỉ cần 480×360 (nhận diện càng
   * nhỏ càng nhanh), nhưng trang QUÉT lại phải cắt một mẩu nhỏ trong khung hình
   * rồi gửi đi nhận diện — cắt 25% của ảnh 480×360 chỉ còn ~200 px, dưới mức
   * dùng được. Mở camera ở 1280×720 rồi thu nhỏ riêng cho MediaPipe thì được cả
   * hai: tay vẫn bắt nhanh như cũ, ảnh chụp vẫn đủ nét. Landmark trả về là toạ
   * độ chuẩn hoá 0..1 nên không đổi gì khi thu nhỏ.
   *
   * Chi phí: một lệnh vẽ thu nhỏ mỗi lần nhận diện (~25 lần/giây) — rẻ hơn
   * nhiều so với việc bắt MediaPipe xử lý thẳng ảnh 720p.
   */
  detectWidth?: number;
};

/** Vì sao không chạy được — để giao diện nói đúng cách khắc phục. */
export type HandTrackingErrorCode =
  | "insecure-context"
  | "unsupported"
  | "permission-denied"
  | "no-camera"
  | "camera-busy"
  | "model-load"
  | "camera-lost"
  | "unknown";

export type HandTrackingState = {
  /** Số lần NHẬN DIỆN mỗi giây (không phải nhịp vẽ). */
  fps: number;
  /** Nhịp vẽ overlay mỗi giây — cho biết giao diện có mượt không. */
  renderFps: number;
  handCount: number;
  status: "idle" | "loading" | "running" | "error";
  /** Bộ tăng tốc thực sự đang chạy: GPU hay CPU (có máy không hỗ trợ WebGPU/WebGL). */
  backend: "gpu" | "cpu" | null;
  error: string | null;
  errorCode: HandTrackingErrorCode | null;
};

const IDLE_STATE: HandTrackingState = {
  fps: 0,
  renderFps: 0,
  handCount: 0,
  status: "idle",
  backend: null,
  error: null,
  errorCode: null,
};

/** Phân loại lỗi thành mã + câu tiếng Việt nói rõ phải làm gì. */
function classifyError(err: unknown): { code: HandTrackingErrorCode; message: string } {
  const name = (err as { name?: string })?.name ?? "";
  const raw = err instanceof Error ? err.message : String(err);

  if (name === "NotAllowedError" || name === "SecurityError" || /permission/i.test(raw)) {
    return {
      code: "permission-denied",
      message: "Trình duyệt chưa được cấp quyền dùng camera. Bấm vào biểu tượng camera trên thanh địa chỉ rồi chọn Cho phép.",
    };
  }
  if (name === "NotFoundError" || name === "OverconstrainedError") {
    return { code: "no-camera", message: "Không tìm thấy webcam nào trên máy này." };
  }
  if (name === "NotReadableError" || name === "AbortError") {
    return {
      code: "camera-busy",
      message: "Camera đang bị ứng dụng khác chiếm (Zoom, Meet, Teams…). Đóng ứng dụng đó rồi thử lại.",
    };
  }
  if (/wasm|\.task|fetch|network|failed to load/i.test(raw)) {
    return {
      code: "model-load",
      message: "Không nạp được mô hình nhận diện tay. Kiểm tra thư mục /mediapipe (hand_landmarker.task và wasm) còn đủ không.",
    };
  }
  return { code: "unknown", message: raw };
}

/**
 * TỰ KIỂM CHỨNG KHÔNG CẦN WEBCAM — dựng worker, nạp model, rồi đóng lại.
 *
 * Cùng truyền thống với `window.somaGesture` và `window.somaScan`: phần khó
 * kiểm nhất của tính năng này là "worker có dựng được trên máy/trình duyệt
 * ấy không", mà câu hỏi đó KHÔNG cần tới camera. Trang cử chỉ gắn hàm này vào
 * `window.somaHandWorker` ở bản dev, nên chỉ cần mở console gõ
 *
 *   await window.somaHandWorker()
 *
 * là biết ngay máy này chạy nhận diện trong worker (và bằng GPU hay CPU) hay
 * phải lui về luồng chính.
 */
export async function probeHandWorker(maxHands = 2): Promise<
  | { ok: true; backend: "gpu" | "cpu"; ms: number; detectMs: number; hands: number }
  | { ok: false; reason: string }
> {
  const t0 = performance.now();
  let worker: Worker;
  try {
    worker = new Worker(new URL("./handWorker.ts", import.meta.url), { type: "module" });
  } catch (err) {
    return { ok: false, reason: `không dựng được worker: ${String(err)}` };
  }
  try {
    return await new Promise((resolve) => {
      const timer = setTimeout(() => resolve({ ok: false, reason: "quá hạn 30 giây" }), 30_000);
      worker.onmessage = (ev: MessageEvent<WorkerOut>) => {
        if (ev.data.type === "ready") {
          // Nạp được model chưa đủ: phần dễ hỏng là ĐƯỜNG TRUYỀN ẢNH — chuyển
          // quyền sở hữu ImageBitmap sang worker rồi nhận kết quả về. Bắn thử
          // một khung trống để đo đúng vòng đó (đương nhiên ra 0 bàn tay).
          const backend = ev.data.backend;
          const t1 = performance.now();
          const cv = document.createElement("canvas");
          cv.width = 480;
          cv.height = 360;
          cv.getContext("2d")?.fillRect(0, 0, 1, 1);
          void createImageBitmap(cv).then((bitmap) => {
            worker.onmessage = (e2: MessageEvent<WorkerOut>) => {
              if (e2.data.type !== "result") return;
              clearTimeout(timer);
              resolve({
                ok: true,
                backend,
                ms: Math.round(performance.now() - t0),
                detectMs: Math.round(performance.now() - t1),
                hands: e2.data.hands.length,
              });
            };
            worker.postMessage({ type: "detect", bitmap, timestamp: 1, frameId: 1 } satisfies WorkerIn, [
              bitmap,
            ]);
          });
        } else if (ev.data.type === "error") {
          clearTimeout(timer);
          resolve({ ok: false, reason: ev.data.message });
        }
      };
      worker.onerror = (e) => {
        clearTimeout(timer);
        resolve({ ok: false, reason: e.message || "worker lỗi" });
      };
      worker.postMessage({ type: "init", maxHands } satisfies WorkerIn);
    });
  } finally {
    worker.terminate();
  }
}

/**
 * Bật webcam + MediaPipe HandLandmarker, chạy vòng lặp theo rAF.
 * Model và WASM nạp từ /public — không phụ thuộc CDN, chạy được ngoại tuyến.
 *
 * BA ĐIỂM KỸ THUẬT ĐÁNG NHỚ:
 *  1. TÁCH nhịp nhận diện khỏi nhịp vẽ. Nhận diện ~25 lần/giây (khâu nặng),
 *     nhưng `onFrame` được gọi MỖI khung hình màn hình với dữ liệu mới nhất —
 *     nhờ vậy con trỏ đi mượt theo 60 Hz thay vì giật theo 25 Hz như trước.
 *  2. GPU rồi mới tới CPU. Máy không có WebGL2/WebGPU dùng được thì tạo
 *     landmarker với delegate GPU sẽ ném lỗi; bắt lấy và dựng lại bằng CPU
 *     thay vì báo hỏng.
 *  3. Dữ liệu tay đi qua callback (ref-based), KHÔNG qua state. React chỉ
 *     render lại khi FPS/trạng thái đổi (2 lần/giây).
 */
export function useHandTracking(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  enabled: boolean,
  options: Options = {},
) {
  const {
    maxHands = 2,
    detectIntervalMs = 40,
    videoWidth = 480,
    videoHeight = 360,
    detectWidth = 0,
  } = options;
  const [state, setState] = useState<HandTrackingState>(IDLE_STATE);

  // Giữ callback mới nhất mà không phải nạp lại model: cập nhật trong effect,
  // KHÔNG gán thẳng lúc render (vi phạm quy tắc ref của React).
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const pausedRef = useRef(options.paused);
  useEffect(() => {
    pausedRef.current = options.paused;
    const video = videoRef.current, stream = cameraStreamRef.current;
    if (!options.paused && video && stream?.active && video.srcObject !== stream) {
      video.srcObject = stream;
      void video.play().catch(() => {});
    }
  }, [options.paused, videoRef]);
  const onFrameRef = useRef(options.onFrame);
  useEffect(() => {
    onFrameRef.current = options.onFrame;
  }, [options.onFrame]);

  const landmarkerRef = useRef<HandLandmarker | null>(null);
  /** Worker nhận diện — null khi máy/trình duyệt không dựng được và phải lui về luồng chính. */
  const workerRef = useRef<Worker | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef(-1);
  const lastDetectRef = useRef(0);
  const filtersRef = useRef<Map<string, Point2DFilter>>(new Map());
  /** Kết quả nhận diện gần nhất — dùng lại cho những khung hình giữa hai lần đo. */
  const latestRef = useRef<{ hands: TrackedHand[]; frame: FrameInfo }>({
    hands: [],
    frame: { width: 0, height: 0 },
  });
  /**
   * Khung tay ĐANG HIỆN — ngoại suy về HIỆN TẠI mỗi khung vẽ (xem (1.5)).
   * Khởi đầu null để khung đầu tiên hiện ngay, không trượt từ gốc toạ độ ra.
   */
  const displayRef = useRef<TrackedHand[] | null>(null);
  const lastRenderAtRef = useRef(0);
  /**
   * Lịch sử chuyển động theo TỪNG ĐIỂM (hệ màn hình, đã lật gương) để ngoại
   * suy: 2 mẫu thô gần nhất + vận tốc EMA. Khoá theo bên tay như bộ lọc.
   */
  type Motion = {
    prevT: number;
    lastT: number;
    last: { x: number; y: number; z: number }[];
    vel: { x: number; y: number; z: number }[];
  };
  const motionRef = useRef<Map<string, Motion>>(new Map());

  const stop = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    const video = videoRef.current;
    const stream = cameraStreamRef.current;
    stream?.getTracks().forEach((t) => {
      t.onended = null;
      t.stop();
    });
    cameraStreamRef.current = null;
    if (video) video.srcObject = null;
    latestRef.current = { hands: [], frame: { width: 0, height: 0 } };
    displayRef.current = null;
    lastRenderAtRef.current = 0;
    motionRef.current.clear();
    filtersRef.current.clear();
  }, [videoRef]);

  useEffect(() => {
    if (!enabled) {
      // Chỉ dừng thiết bị. KHÔNG setState ở đây — trạng thái "nghỉ" được suy ra
      // lúc trả về, tránh chuỗi render lồng nhau.
      stop();
      return;
    }

    let cancelled = false;
    const detect = { frames: 0, last: performance.now(), value: 0 };
    const render = { frames: 0, last: performance.now(), value: 0 };

    (async () => {
      try {
        // Chặn sớm hai trường hợp mà getUserMedia sẽ ném lỗi khó hiểu.
        if (typeof window !== "undefined" && !window.isSecureContext) {
          throw Object.assign(new Error("insecure"), { name: "SecurityError", secure: true });
        }
        if (!navigator.mediaDevices?.getUserMedia) {
          const e = new Error("Trình duyệt này không hỗ trợ truy cập camera (cần Chrome, Edge hoặc Safari đời mới).");
          throw Object.assign(e, { name: "UnsupportedError" });
        }

        setState((s) => ({ ...s, status: "loading", error: null, errorCode: null }));

        let backend: "gpu" | "cpu" = "gpu";

        // ---- (A) THỬ WORKER TRƯỚC ----
        // `detectForVideo` chạy ĐỒNG BỘ: dù suy luận trên GPU, lời gọi vẫn chặn
        // luồng chính 30–60 ms mỗi lần. Đó là lý do trang tụt còn 10 khung
        // hình/giây trên máy tích hợp — và nhịp vẽ là TRẦN của độ mượt con trỏ.
        // Đẩy hẳn sang worker thì luồng chính chỉ còn chép một ảnh nhỏ.
        let worker: Worker | null = null;
        try {
          worker = new Worker(new URL("./handWorker.ts", import.meta.url), { type: "module" });
        } catch {
          worker = null;
        }
        if (worker) {
          const w = worker;
          const ready = await new Promise<boolean>((resolve) => {
            // Lần đầu phải tải + dựng model 7,8 MB; đo thật mất tới ~11 giây.
            // Hết hạn thì lui về luồng chính chứ KHÔNG treo trang mãi.
            const timer = setTimeout(() => resolve(false), 30_000);
            w.onmessage = (ev: MessageEvent<WorkerOut>) => {
              if (ev.data.type === "ready") {
                clearTimeout(timer);
                backend = ev.data.backend;
                resolve(true);
              } else if (ev.data.type === "error") {
                clearTimeout(timer);
                resolve(false);
              }
            };
            w.onerror = () => {
              clearTimeout(timer);
              resolve(false);
            };
            w.postMessage({ type: "init", maxHands } satisfies WorkerIn);
          });
          if (!ready || cancelled) {
            w.terminate();
            worker = null;
          }
        }
        if (cancelled) return;
        workerRef.current = worker;

        // ---- (B) ĐƯỜNG LUI: nhận diện ngay trên luồng chính ----
        // Giữ nguyên vì không phải môi trường nào cũng dựng được worker (WebGL
        // trong worker bị chặn, trình duyệt cũ, chính sách nhúng iframe). Thà
        // chậm còn hơn trang chết.
        if (!worker) {
          const vision = await import("@mediapipe/tasks-vision");
          const fileset = await vision.FilesetResolver.forVisionTasks("/mediapipe/wasm");

          const makeLandmarker = (delegate: "GPU" | "CPU") =>
            vision.HandLandmarker.createFromOptions(fileset, {
              baseOptions: { modelAssetPath: "/mediapipe/hand_landmarker.task", delegate },
              runningMode: "VIDEO",
              numHands: maxHands,
              // ngưỡng cao hơn để không nhận nhầm cẳng tay/khuôn mặt thành bàn tay
              minHandDetectionConfidence: 0.7,
              minHandPresenceConfidence: 0.7,
              minTrackingConfidence: 0.6,
            });

          let landmarker: HandLandmarker;
          try {
            landmarker = await makeLandmarker("GPU");
          } catch {
            // Máy ảo, driver cũ, GPU bị chặn… — CPU chậm hơn nhưng vẫn dùng được.
            backend = "cpu";
            landmarker = await makeLandmarker("CPU");
          }
          if (cancelled) {
            landmarker.close();
            return;
          }
          landmarkerRef.current = landmarker;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: videoWidth },
            height: { ideal: videoHeight },
            frameRate: { ideal: 30 },
          },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        const video = videoRef.current;
        if (!video) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        cameraStreamRef.current = stream;
        video.srcObject = stream;
        await video.play();

        // Rút dây webcam hoặc bị ứng dụng khác giành mất: báo rõ thay vì đứng im.
        stream.getVideoTracks().forEach((track) => {
          track.onended = () => {
            if (cancelled) return;
            setState((s) => ({
              ...s,
              status: "error",
              errorCode: "camera-lost",
              error: "Mất kết nối với camera (bị rút ra hoặc ứng dụng khác chiếm mất).",
            }));
          };
        });

        setState((s) => ({ ...s, status: "running", backend }));

        // Ảnh trung gian để thu nhỏ khung hình trước khi nhận diện (xem
        // `detectWidth`). Dựng một lần rồi dùng lại — tạo canvas mới mỗi khung
        // hình là cách chắc chắn nhất để làm bộ dọn rác chạy liên tục.
        let shrink: HTMLCanvasElement | null = null;
        let shrinkCtx: CanvasRenderingContext2D | null = null;
        const shrinkForDetect = (v: HTMLVideoElement): HTMLVideoElement | HTMLCanvasElement => {
          if (detectWidth <= 0 || v.videoWidth <= detectWidth) return v;
          const h = Math.max(1, Math.round((detectWidth * v.videoHeight) / v.videoWidth));
          if (!shrink) {
            shrink = document.createElement("canvas");
            shrinkCtx = shrink.getContext("2d", { willReadFrequently: false });
          }
          if (!shrinkCtx) return v;
          if (shrink.width !== detectWidth || shrink.height !== h) {
            shrink.width = detectWidth;
            shrink.height = h;
          }
          shrinkCtx.drawImage(v, 0, 0, detectWidth, h);
          return shrink;
        };

        /**
         * Biến kết quả THÔ của MediaPipe thành `TrackedHand` — dùng chung cho
         * cả hai đường (worker và luồng chính), nên hai đường không thể lệch
         * nhau về cách lật gương hay cách khoá bộ lọc.
         */
        type RawHand = {
          points: { x: number; y: number; z: number }[];
          handedness: string;
          score: number;
        };
        let pendingFresh = false;
        const ingest = (raw: RawHand[], at: number) => {
          const vid = videoRef.current;
          const seen = new Set<string>();
          const hands: TrackedHand[] = raw.map((r, i) => {
            // MediaPipe trả handedness theo ảnh GỐC; ta hiển thị ảnh lật gương
            // nên phải đảo lại, nếu không "tay phải" trên màn hình lại được
            // gán nhãn trái.
            const handedness = r.handedness === "Left" ? "Right" : "Left";
            // KHOÁ BỘ LỌC theo bên tay, KHÔNG theo chỉ số i: thứ tự tay trong
            // mảng đổi liên tục giữa các khung, khoá theo i làm bộ lọc bị đánh
            // tráo và con trỏ giật mỗi khi hai tay đổi chỗ.
            let key = handedness;
            if (seen.has(key)) key = `${handedness}#${i}`; // hiếm: hai tay cùng nhãn
            seen.add(key);
            let filter = filtersRef.current.get(key);
            if (!filter) {
              // beta là hệ số "tay đi càng nhanh thì lọc càng nhẹ". Để 0,03
              // trên toạ độ chuẩn hoá 0..1 thì gần như VÔ HIỆU: vẩy tay hết bề
              // ngang khung hình trong nửa giây mới chỉ nâng tần số cắt thêm
              // 0,06 Hz, nên lúc di chuyển nhanh bộ lọc vẫn nặng tay đúng bằng
              // lúc đứng yên — đó là phần lớn cái trễ cảm nhận được ở con trỏ.
              filter = new Point2DFilter(1.4, 0.6);
              filtersRef.current.set(key, filter);
            }
            const tip = r.points[LM.INDEX_TIP];
            const cursor = filter.filter(1 - tip.x, tip.y, at); // lật x cho khớp ảnh gương
            // Toạ độ hệ MÀN HÌNH (đã lật gương) — dùng chung cho hiển thị và
            // cho lịch sử chuyển động bên dưới.
            const pts = r.points.map((q) => ({ x: 1 - q.x, y: q.y, z: q.z }));
            // Cập nhật vận tốc EMA từng điểm: mẫu mới về là tính vận tốc tức
            // thời so với mẫu trước rồi trộn một nửa vào vận tốc cũ. Tay đổi
            // hướng thì ~2 mẫu (~160 ms) là vận tốc theo kịp; tay đứng yên thì
            // vận tốc về 0 nên phần ngoại suy tự tắt, không trôi.
            const prevMo = motionRef.current.get(key);
            if (!prevMo || prevMo.last.length !== pts.length) {
              motionRef.current.set(key, {
                prevT: at,
                lastT: at,
                last: pts,
                vel: pts.map(() => ({ x: 0, y: 0, z: 0 })),
              });
            } else {
              const dtm = Math.max(at - prevMo.lastT, 1);
              const vel = prevMo.vel.map((vv, j) => ({
                x: vv.x + ((pts[j].x - prevMo.last[j].x) / dtm - vv.x) * 0.5,
                y: vv.y + ((pts[j].y - prevMo.last[j].y) / dtm - vv.y) * 0.5,
                z: vv.z + ((pts[j].z - prevMo.last[j].z) / dtm - vv.z) * 0.5,
              }));
              motionRef.current.set(key, { prevT: prevMo.lastT, lastT: at, last: pts, vel });
            }
            return {
              handedness,
              handednessScore: r.score,
              landmarks: pts,
              cursor,
            };
          });
          // dọn bộ lọc của bàn tay đã rời khung, không để map phình mãi
          for (const key of [...filtersRef.current.keys()]) {
            if (!seen.has(key)) filtersRef.current.delete(key);
          }
          for (const key of [...motionRef.current.keys()]) {
            if (!seen.has(key)) motionRef.current.delete(key);
          }
          latestRef.current = {
            hands,
            frame: { width: vid?.videoWidth ?? 0, height: vid?.videoHeight ?? 0 },
          };
          pendingFresh = true;
          detect.frames += 1;
        };

        // Có ĐÚNG MỘT khung hình đang bay sang worker tại một thời điểm. Xếp
        // hàng nhiều khung chỉ làm kết quả càng lúc càng cũ — thêm trễ chứ
        // không thêm mượt.
        let inFlight = false;
        let frameId = 0;
        if (worker) {
          worker.onmessage = (ev: MessageEvent<WorkerOut>) => {
            if (ev.data.type !== "result") return;
            inFlight = false;
            ingest(ev.data.hands, performance.now());
          };
          worker.onerror = () => {
            // Worker chết giữa chừng: mở khoá để vòng lặp không đứng im chờ
            // một kết quả không bao giờ tới.
            inFlight = false;
          };
        }

        const loop = () => {
          rafRef.current = requestAnimationFrame(loop);
          const v = videoRef.current;
          const lm = landmarkerRef.current;
          // Chạy bằng worker thì KHÔNG có landmarker ở luồng này — đòi có nó là
          // vòng lặp thoát ngay và trang đứng im không báo lỗi gì.
          if (!v || (!lm && !worker) || v.readyState < 2 || pausedRef.current) return;

          const now = performance.now();
          let fresh = false;

          // Tab bị ẩn thì rAF gần như không chạy; thêm phép kiểm này để khi máy
          // vẫn gọi (một số trình duyệt gọi ~1 Hz) thì không tốn công nhận diện.
          const visible = typeof document === "undefined" || !document.hidden;

          // ---- (1) NHẬN DIỆN: có tiết chế, và bỏ qua khung hình video trùng ----
          if (
            visible &&
            now - lastDetectRef.current >= detectIntervalMs &&
            v.currentTime !== lastVideoTimeRef.current
          ) {
            lastDetectRef.current = now;
            lastVideoTimeRef.current = v.currentTime;

            if (worker) {
              // KHÔNG chờ kết quả: gửi ảnh đi rồi vẽ tiếp ngay ở khung hình
              // này. Kết quả về lúc nào thì `ingest` cập nhật lúc đó.
              if (!inFlight) {
                inFlight = true;
                const dw =
                  detectWidth > 0 && v.videoWidth > detectWidth ? detectWidth : v.videoWidth;
                const dh = Math.max(1, Math.round((dw * v.videoHeight) / v.videoWidth));
                // createImageBitmap tự thu nhỏ ở phía trình duyệt (thường là
                // GPU) — rẻ hơn hẳn vẽ ra canvas 2D rồi đọc lại như bản cũ.
                createImageBitmap(v, { resizeWidth: dw, resizeHeight: dh, resizeQuality: "low" })
                  .then((bitmap) => {
                    const w = workerRef.current;
                    if (cancelled || !w) {
                      bitmap.close();
                      inFlight = false;
                      return;
                    }
                    frameId += 1;
                    w.postMessage(
                      { type: "detect", bitmap, timestamp: now, frameId } satisfies WorkerIn,
                      [bitmap],
                    );
                  })
                  .catch(() => {
                    inFlight = false;
                  });
              }
            } else if (lm) {
              let result: HandLandmarkerResult | null = null;
              try {
                result = lm.detectForVideo(shrinkForDetect(v), now);
              } catch {
                result = null;
              }
              if (result) {
                const res = result;
                ingest(
                  res.landmarks.map((points, i) => ({
                    points,
                    handedness: res.handedness[i]?.[0]?.categoryName ?? "Right",
                    score: res.handedness[i]?.[0]?.score ?? 0,
                  })),
                  now,
                );
              }
            }
          }

          // Kết quả của worker về BẤT KỲ lúc nào giữa hai khung vẽ; khung vẽ
          // ngay sau đó là khung "có dữ liệu mới".
          if (pendingFresh) {
            pendingFresh = false;
            fresh = true;
          }

          // ---- (1.5) NGOẠI SUY THEO NHỊP VẼ: mỗi kết quả nhận diện về tới tay
          // đã là chuyện của ~80–150 ms trước (chép ảnh + suy luận + chuyển
          // worker), mà vẽ thẳng nó ra thì khung xương MÃI MÃI đi sau tay thật
          // một quãng — đúng cái delay trong ảnh chụp màn hình. Nội suy thuần
          // còn cộng thêm trễ nên KHÔNG dùng ở đây.
          //
          // Thay vào đó, mỗi khung vẽ (60 Hz) tính vị trí HIỆN TẠI = mẫu mới
          // nhất + vận tốc × thời gian đã trôi (nhìn trước tối đa 100 ms, mỗi
          // điểm không đi quá 0,1 khung hình để một mẫu nhiễu không bắn tay đi
          // xa). Tay đang vẩy thì khung xương đón đầu đúng chỗ tay đang ở; tay
          // đứng yên thì vận tốc ≈ 0, ngoại suy tự tắt, đứng im tuyệt đối.
          // Cuối cùng trượt nhẹ (τ ≈ 30 ms) về phía dự đoán để lần nhận diện
          // mới về không làm hình "nhảy cục".
          const makeKey = () => {
            const seen = new Map<string, number>();
            return (h: TrackedHand) => {
              const n = seen.get(h.handedness) ?? 0;
              seen.set(h.handedness, n + 1);
              return n === 0 ? h.handedness : `${h.handedness}#${n}`;
            };
          };
          const prevKey = makeKey();
          const prevByKey = new Map<string, TrackedHand>();
          for (const h of displayRef.current ?? []) prevByKey.set(prevKey(h), h);
          const dtRender = Math.min(Math.max(now - (lastRenderAtRef.current || now), 0), 100);
          lastRenderAtRef.current = now;
          const kd = 1 - Math.exp(-dtRender / 30);
          const target = latestRef.current.hands;
          const curKey = makeKey();
          const shown: TrackedHand[] = target.map((h) => {
            const ck = curKey(h);
            const p = prevByKey.get(ck);
            const mo = motionRef.current.get(ck);
            let aim = h.landmarks;
            if (mo && mo.last.length === h.landmarks.length) {
              const lead = Math.min(Math.max(now - mo.lastT, 0), 100);
              if (lead > 0) {
                aim = mo.last.map((q, j) => {
                  const v = mo.vel[j];
                  const dx = Math.min(Math.max(v.x * lead, -0.1), 0.1);
                  const dy = Math.min(Math.max(v.y * lead, -0.1), 0.1);
                  const dz = Math.min(Math.max(v.z * lead, -0.1), 0.1);
                  return { x: q.x + dx, y: q.y + dy, z: q.z + dz };
                });
              }
            }
            if (!p || p.landmarks.length !== aim.length) {
              return { ...h, landmarks: aim };
            }
            return {
              ...h,
              landmarks: aim.map((q, i) => {
                const o = p.landmarks[i];
                return { x: o.x + (q.x - o.x) * kd, y: o.y + (q.y - o.y) * kd, z: o.z + (q.z - o.z) * kd };
              }),
            };
          });
          displayRef.current = shown;

          // ---- (2) VẼ: mỗi khung hình màn hình, dùng dữ liệu mới nhất ----
          const { frame } = latestRef.current;
          const hands = shown;
          onFrameRef.current?.(hands, frame, now, { fresh });
          render.frames += 1;

          // ---- (3) Đẩy state 2 lần/giây (FPS + số tay) ----
          if (now - detect.last >= 500) {
            detect.value = Math.round((detect.frames * 1000) / (now - detect.last));
            render.value = Math.round((render.frames * 1000) / (now - render.last));
            detect.frames = 0;
            render.frames = 0;
            detect.last = now;
            render.last = now;
            const d = detect.value;
            const r = render.value;
            const h = hands.length;
            setState((s) =>
              s.fps === d && s.renderFps === r && s.handCount === h
                ? s
                : { ...s, fps: d, renderFps: r, handCount: h },
            );
          }
        };
        rafRef.current = requestAnimationFrame(loop);
      } catch (err) {
        if (cancelled) return;
        const { code, message } = (err as { secure?: boolean })?.secure
          ? {
              code: "insecure-context" as const,
              message:
                "Trình duyệt chỉ cho dùng camera trên HTTPS hoặc localhost. Mở trang qua https:// rồi thử lại.",
            }
          : (err as { name?: string })?.name === "UnsupportedError"
            ? { code: "unsupported" as const, message: (err as Error).message }
            : classifyError(err);
        setState((s) => ({ ...s, status: "error", errorCode: code, error: message }));
      }
    })();

    return () => {
      cancelled = true;
      stop();
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
      // Worker giữ cả model 7,8 MB lẫn một ngữ cảnh WebGL riêng — rời trang mà
      // không đóng là bỏ quên ngần ấy trong bộ nhớ.
      workerRef.current?.postMessage({ type: "close" } satisfies WorkerIn);
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, [enabled, maxHands, detectIntervalMs, videoWidth, videoHeight, detectWidth, stop, videoRef]);

  // Tắt camera thì luôn báo "nghỉ" — suy ra tại chỗ nên không cần lưu vào state.
  return { ...(enabled ? state : IDLE_STATE), cameraStreamRef };
}
