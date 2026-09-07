import type { PoseLm } from "./bodyRegions";

// CHẠY POSE ĐÚNG MỘT LẦN, TẠI THỜI ĐIỂM CHỤP.
//
// Vì sao KHÔNG chạy mỗi khung hình như hand tracking: nhận diện tư thế nặng hơn
// nhiều, và ta không cần nó liên tục — chỉ cần biết ô vừa chụp trùng với đoạn
// xương nào, đúng một lần. Chạy nền liên tục sẽ ăn hết phần FPS đang dành cho
// bàn tay trên máy yếu (Iris Xe), đổi lại chẳng thêm gì.
//
// Model tự host trong /public/mediapipe (5,5 MB) — cùng cách với hand_landmarker,
// nên vẫn chạy được khi không có mạng và không phụ thuộc CDN.
//
// NẠP LƯỜI: chỉ tải khi người dùng thật sự bấm chụp lần đầu. Ai chỉ vào xem
// trang thì không phải tải thêm megabyte nào.

/** Vẫn đo và trả về thời gian thật: đây là con số quyết định tầng này sống hay chết. */
export type PoseResult = {
  landmarks: PoseLm[];
  /** Thời gian nhận diện, ms. */
  ms: number;
  /** Vì sao không có kết quả (nếu landmarks rỗng). */
  reason?: "no-model" | "no-person" | "failed";
};

type Landmarker = {
  detect: (image: HTMLVideoElement | HTMLCanvasElement) => {
    landmarks?: { x: number; y: number; z: number; visibility?: number }[][];
  };
  close: () => void;
};

let landmarker: Landmarker | null = null;
/** Đã chạy một lần giả để dựng sẵn đường đồ hoạ chưa. */
let warmed = false;
let loading: Promise<Landmarker | null> | null = null;

async function getLandmarker(): Promise<Landmarker | null> {
  if (landmarker) return landmarker;
  if (loading) return loading;
  loading = (async () => {
    try {
      const vision = await import("@mediapipe/tasks-vision");
      const fileset = await vision.FilesetResolver.forVisionTasks("/mediapipe/wasm");
      const make = (delegate: "GPU" | "CPU") =>
        vision.PoseLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: "/mediapipe/pose_landmarker_lite.task", delegate },
          // IMAGE chứ không phải VIDEO: mỗi lần chụp là một ảnh rời rạc, không
          // có chuỗi thời gian nào để bám nên chế độ VIDEO chỉ tốn thêm.
          runningMode: "IMAGE",
          numPoses: 1,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
        });
      let lm: Landmarker;
      try {
        lm = (await make("GPU")) as unknown as Landmarker;
      } catch {
        // Máy ảo, driver cũ, GPU bị chặn — CPU chậm hơn nhưng vẫn ra kết quả.
        lm = (await make("CPU")) as unknown as Landmarker;
      }
      landmarker = lm;
      return lm;
    } catch {
      return null;
    } finally {
      loading = null;
    }
  })();
  return loading;
}

/**
 * Tìm mốc tư thế trên CẢ KHUNG HÌNH (không phải trên mẩu ảnh đã cắt).
 *
 * Đây là điểm dễ làm sai nhất của cả tầng này: Pose được huấn luyện để nhìn cả
 * người. Đưa cho nó một mẩu da cắt sẵn thì gần như chắc chắn không ra gì. Ta
 * cần mốc trên khung hình đầy đủ, rồi mới đối chiếu với ô đã ngắm.
 */
export async function detectPoseOnce(
  source: HTMLVideoElement | HTMLCanvasElement,
): Promise<PoseResult> {
  const lm = await getLandmarker();
  if (!lm) return { landmarks: [], ms: 0, reason: "no-model" };
  const t0 = performance.now();
  try {
    const res = lm.detect(source);
    const ms = performance.now() - t0;
    const pts = res.landmarks?.[0];
    if (!pts || pts.length < 33) return { landmarks: [], ms, reason: "no-person" };
    return { landmarks: pts.map((p) => ({ x: p.x, y: p.y, visibility: p.visibility })), ms };
  } catch {
    return { landmarks: [], ms: performance.now() - t0, reason: "failed" };
  }
}

/**
 * Nạp trước model, gọi ngay khi người dùng vào chế độ quét.
 *
 * Nếu để tới lúc bấm chụp mới tải thì 5,5 MB ấy rơi đúng vào giữa ngân sách
 * 800 ms — lần quét đầu tiên sẽ chậm thảm hại trong khi mọi lần sau lại nhanh.
 * Tải trước khiến thời gian quét đều nhau, thứ còn quan trọng hơn cả nhanh.
 */
export function preloadPose(): void {
  void (async () => {
    const lm = await getLandmarker();
    if (!lm || warmed) return;
    warmed = true;
    try {
      // LÀM NÓNG bằng một lần chạy giả. Đo thật: tải xong model rồi thì lần
      // suy luận ĐẦU TIÊN vẫn mất ~1,5 giây (dựng và biên dịch shader), còn
      // những lần sau chỉ 25–41 ms. Không làm nóng thì cái giá 1,5 giây ấy rơi
      // đúng vào lần quét đầu của người dùng.
      // Kích thước phải BẰNG kích thước dùng thật, nếu không đường dựng hình
      // được làm nóng lại là đường khác.
      const c = document.createElement("canvas");
      c.width = 640;
      c.height = 360;
      lm.detect(c);
    } catch {
      /* làm nóng hụt cũng không sao — chỉ là lần đầu chậm hơn */
    }
  })();
}

/**
 * MÓC TỰ KIỂM CHỨNG (chỉ ở bản phát triển) — cùng truyền thống với
 * `window.somaGesture` của trang cử chỉ: đo được tầng này mà KHÔNG cần webcam.
 *
 *   await window.somaPose.detect(canvasBatKy)   → { ms, landmarks }
 *
 * Con số `ms` chính là thứ quyết định tầng mốc giải phẫu có sống nổi trên máy
 * yếu hay không, nên phải đo được chứ không phải ước lượng.
 */
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as unknown as { somaPose?: unknown }).somaPose = {
    detect: detectPoseOnce,
    preload: () => void getLandmarker(),
  };
}

/** Giải phóng khi rời trang — model chiếm bộ nhớ GPU đáng kể. */
export function disposePose(): void {
  landmarker?.close();
  landmarker = null;
  warmed = false;
}
