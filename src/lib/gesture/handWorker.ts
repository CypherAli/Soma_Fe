/// <reference lib="webworker" />

// NHẬN DIỆN TAY CHẠY TRONG WEB WORKER — gỡ khâu nặng nhất khỏi luồng chính.
//
// VÌ SAO: `detectForVideo` của MediaPipe chạy ĐỒNG BỘ. Dù suy luận trên GPU,
// lời gọi ấy vẫn CHẶN luồng chính cho tới khi có kết quả. Trên máy đo thật
// (HP + Iris Xe, đúng máy dùng để bảo vệ) trang cử chỉ tụt xuống 10 khung
// hình/giây — và nhịp vẽ chính là TRẦN của độ mượt con trỏ: lọc kiểu gì,
// nhìn trước bao nhiêu mili giây cũng không vượt qua được cái trần đó.
//
// Ở đây luồng chính chỉ còn hai việc rẻ: `createImageBitmap(video)` (~1–2 ms,
// chép ảnh phía GPU) và nhận về 21 điểm. Toàn bộ WASM + suy luận nằm trong
// worker, nên trong lúc nó chạy thì luồng chính vẫn vẽ mô hình 3D và con trỏ
// bình thường.
//
// HAI ĐIỂM DỄ SAI, ĐỪNG BỎ:
//  1. PHẢI `close()` mọi ImageBitmap. Mỗi cái là một ảnh 480 px giữ trong bộ
//     nhớ GPU; quên đóng thì rò bộ nhớ rất nhanh (25 ảnh/giây).
//  2. Mốc thời gian đưa cho `detectForVideo` phải TĂNG NGHIÊM NGẶT. MediaPipe
//     ném lỗi và bỏ khung hình nếu mốc mới không lớn hơn mốc trước — mà đồng
//     hồ của worker khác đồng hồ luồng chính, nên lấy mốc do luồng chính gửi
//     sang và tự nhích lên nếu trùng.

import type { HandLandmarker, HandLandmarkerResult } from "@mediapipe/tasks-vision";

export type WorkerIn =
  | { type: "init"; maxHands: number }
  | { type: "detect"; bitmap: ImageBitmap; timestamp: number; frameId: number }
  | { type: "close" };

export type WorkerOut =
  | { type: "ready"; backend: "gpu" | "cpu" }
  | { type: "error"; message: string }
  | {
      type: "result";
      frameId: number;
      /** Toạ độ THÔ của MediaPipe (chưa lật gương) — luồng chính lo phần đó. */
      hands: { points: { x: number; y: number; z: number }[]; handedness: string; score: number }[];
    };

const ctx = self as unknown as DedicatedWorkerGlobalScope;

let landmarker: HandLandmarker | null = null;
let lastStamp = 0;

async function init(maxHands: number) {
  const vision = await import("@mediapipe/tasks-vision");
  const fileset = await vision.FilesetResolver.forVisionTasks("/mediapipe/wasm");
  const make = (delegate: "GPU" | "CPU") =>
    vision.HandLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: "/mediapipe/hand_landmarker.task", delegate },
      runningMode: "VIDEO",
      numHands: maxHands,
      // Giữ ĐÚNG các ngưỡng của bản chạy trên luồng chính: hai đường phải cho
      // cùng một kết quả, nếu không thì tuỳ máy mà cử chỉ nhạy khác nhau.
      minHandDetectionConfidence: 0.7,
      minHandPresenceConfidence: 0.7,
      minTrackingConfidence: 0.6,
    });

  let backend: "gpu" | "cpu" = "gpu";
  try {
    landmarker = await make("GPU");
  } catch {
    backend = "cpu";
    landmarker = await make("CPU");
  }
  // KHỞI ĐỘNG NGUỘI: lần suy luận ĐẦU TIÊN tốn tới ~6 giây (biên dịch shader,
  // cấp phát bộ đệm GPU), đo thật trên máy dựng. Chạy sẵn một khung trống ngay
  // tại đây thì cú đó rơi vào lúc người dùng còn đang bật camera, chứ không
  // rơi vào khung hình đầu tiên có bàn tay thật.
  try {
    const blank = new OffscreenCanvas(480, 360);
    blank.getContext("2d")?.fillRect(0, 0, 1, 1);
    const bmp = blank.transferToImageBitmap();
    landmarker.detectForVideo(bmp, 0);
    bmp.close();
    lastStamp = 0;
  } catch {
    // Không hâm nóng được thì thôi — chỉ là chậm khung đầu, không phải lỗi.
  }

  ctx.postMessage({ type: "ready", backend } satisfies WorkerOut);
}

ctx.onmessage = async (ev: MessageEvent<WorkerIn>) => {
  const msg = ev.data;

  if (msg.type === "init") {
    try {
      await init(msg.maxHands);
    } catch (err) {
      ctx.postMessage({
        type: "error",
        message: err instanceof Error ? err.message : String(err),
      } satisfies WorkerOut);
    }
    return;
  }

  if (msg.type === "close") {
    landmarker?.close();
    landmarker = null;
    return;
  }

  // ---- detect ----
  if (!landmarker) {
    msg.bitmap.close();
    return;
  }
  const stamp = msg.timestamp > lastStamp ? msg.timestamp : lastStamp + 1;
  lastStamp = stamp;
  let result: HandLandmarkerResult | null = null;
  try {
    result = landmarker.detectForVideo(msg.bitmap, stamp);
  } catch {
    result = null;
  } finally {
    // Đóng NGAY, cả khi nhận diện ném lỗi — đây là chỗ rò bộ nhớ GPU nếu quên.
    msg.bitmap.close();
  }

  ctx.postMessage({
    type: "result",
    frameId: msg.frameId,
    hands: (result?.landmarks ?? []).map((points, i) => ({
      points: points.map((p) => ({ x: p.x, y: p.y, z: p.z })),
      handedness: result?.handedness[i]?.[0]?.categoryName ?? "Right",
      score: result?.handedness[i]?.[0]?.score ?? 0,
    })),
  } satisfies WorkerOut);
};
