/**
 * MẶT NẠ NGƯỜI (pixel nào là người, pixel nào là nền) cho tia quét tầng 1.
 *
 * Vì sao không dùng bbox của pose: bbox là hình chữ nhật — hai bên đầu/vai vẫn
 * dính tường/tủ vào tia quét. Chỉ mask từng pixel mới ôm khít cơ thể.
 *
 * Chạy ĐÚNG MỘT LẦN lúc đếm ngược (IMAGE mode, model selfie_multiclass 256 tự
 * host trong /public/mediapipe như pose/hand — offline vẫn chạy). Không chạy
 * mỗi khung hình: nặng gấp nhiều lần pose mà tia quét không cần cập nhật theo
 * người (người đứng yên trong 3 giây quét theo luật của nghi thức).
 */

export type PersonMask = {
  /** 1 = pixel người, 0 = nền, hàng-major theo w*h. */
  data: Uint8Array;
  w: number;
  h: number;
  /** Hàng trên/dưới cùng có người (pixel, theo h) — tia chỉ quét trong khoảng này. */
  top: number;
  bottom: number;
  /** Cột trái/phải cùng có người (pixel, theo w) — crop khít. */
  left: number;
  right: number;
  /** Canvas silhouette trắng-trên-trong-suốt dựng sẵn, để dim nền mỗi khung hình. */
  shape: HTMLCanvasElement;
  ms: number;
  reason?: "no-model" | "no-person" | "failed";
};

type Segmenter = {
  segment: (image: HTMLVideoElement | HTMLCanvasElement) => {
    categoryMask?: {
      width: number;
      height: number;
      getAsUint8Array: () => Uint8Array;
    } | null;
  };
  close: () => void;
};

let segmenter: Segmenter | null = null;
let loading: Promise<Segmenter | null> | null = null;

async function getSegmenter(): Promise<Segmenter | null> {
  if (segmenter) return segmenter;
  if (loading) return loading;
  loading = (async () => {
    try {
      const vision = await import("@mediapipe/tasks-vision");
      const fileset = await vision.FilesetResolver.forVisionTasks("/mediapipe/wasm");
      const make = (delegate: "GPU" | "CPU") =>
        vision.ImageSegmenter.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: "/mediapipe/selfie_multiclass_256x256.tflite",
            delegate,
          },
          runningMode: "IMAGE",
          outputCategoryMask: true,
          outputConfidenceMasks: false,
        });
      let s: Segmenter;
      try {
        s = (await make("GPU")) as unknown as Segmenter;
      } catch {
        s = (await make("CPU")) as unknown as Segmenter;
      }
      segmenter = s;
      return s;
    } catch {
      return null;
    } finally {
      loading = null;
    }
  })();
  return loading;
}

/** Nạp trước trong lúc đếm ngược để lần segment không phải chờ tải model. */
export function preloadPersonMask(): void {
  void getSegmenter();
}

export function disposePersonMask(): void {
  try {
    segmenter?.close();
  } catch {
    /* bỏ qua */
  }
  segmenter = null;
}

/**
 * Segment MỘT lần trên khung video. Người = mọi pixel KHÁC background (không
 * phụ thuộc mã nhãn từng lớp tóc/da/áo của model — model đổi nhãn cũng không hỏng).
 */
export async function segmentPersonOnce(
  source: HTMLVideoElement | HTMLCanvasElement,
): Promise<PersonMask | null> {
  const t0 = performance.now();
  const s = await getSegmenter();
  if (!s) return null;
  let raw: Uint8Array;
  let w: number;
  let h: number;
  try {
    const out = s.segment(source);
    const m = out.categoryMask;
    if (!m) return null;
    w = m.width;
    h = m.height;
    raw = m.getAsUint8Array();
  } catch {
    return null;
  }
  const data = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    if (raw[i] !== 0) data[i] = 1;
  }
  // GỌT VIỀN (erosion 3x3, 2 lượt): model hay lem 1–2px bóng đổ/viền tường
  // thành "người" khiến tia quét tràn ra ngoài. Gọt vào trong cho tia ôm sát
  // da thật. Chạy một lần lúc segment nên không tốn gì mỗi khung hình.
  for (let pass = 0; pass < 2; pass++) {
    const src = data.slice();
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        if (
          !src[i - w - 1] || !src[i - w] || !src[i - w + 1] ||
          !src[i - 1] || !src[i + 1] ||
          !src[i + w - 1] || !src[i + w] || !src[i + w + 1]
        ) {
          data[i] = 0;
        }
      }
    }
  }
  let top = -1;
  let bottom = -1;
  let left = w;
  let right = -1;
  let count = 0;
  for (let i = 0; i < w * h; i++) {
    if (data[i] === 1) {
      count++;
      const y = Math.floor(i / w);
      const x = i % w;
      if (top < 0) top = y;
      bottom = y;
      if (x < left) left = x;
      if (x > right) right = x;
    }
  }
  // Ít hơn 1% khung hình là người thì coi như không thấy ai (bóng mờ, ảnh hỏng).
  if (top < 0 || count < w * h * 0.01) return null;
  if (left > right) {
    left = 0;
    right = w - 1;
  }
  const shape = document.createElement("canvas");
  shape.width = w;
  shape.height = h;
  const g = shape.getContext("2d");
  if (!g) return null;
  const img = g.createImageData(w, h);
  for (let i = 0; i < w * h; i++) {
    img.data[i * 4] = 255;
    img.data[i * 4 + 1] = 255;
    img.data[i * 4 + 2] = 255;
    img.data[i * 4 + 3] = data[i] ? 255 : 0;
  }
  g.putImageData(img, 0, 0);
  return { data, w, h, top, bottom, left, right, shape, ms: performance.now() - t0 };
}

/**
 * BẢN ĐỒ CHI TIẾT BỀ MẶT (Sobel một lần): biên nếp da, vân áo, đường viền tóc —
 * thứ tạo cảm giác "quét chi tiết" khi reveal theo tia. Chạy MỘT lần trên ảnh
 * vuông lúc segment (512px ~ 30ms), không phải mỗi khung hình.
 *
 * Nói rõ: đây là tăng cường hiển thị từ ảnh webcam, KHÔNG phải đo nanomet thật
 * (webcam không thể). Đừng ghi nhãn "nanomet" trong UI y khoa.
 */
export function buildDetailMaps(src: HTMLCanvasElement): {
  edge: HTMLCanvasElement;
} | null {
  const w = src.width;
  const h = src.height;
  const g = src.getContext("2d", { willReadFrequently: true });
  if (!g) return null;
  let px: ImageData;
  try {
    px = g.getImageData(0, 0, w, h);
  } catch {
    return null;
  }
  const d = px.data;
  const gray = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    gray[i] = (d[i * 4] * 0.299 + d[i * 4 + 1] * 0.587 + d[i * 4 + 2] * 0.114) / 255;
  }
  const edge = document.createElement("canvas");
  edge.width = w;
  edge.height = h;
  const eg = edge.getContext("2d");
  if (!eg) return null;
  const out = eg.createImageData(w, h);
  // Ngưỡng Sobel: chỉ giữ biên vừa (nếp, vân) — bỏ nhiễu li ti và biên quá gắt.
  const LO = 0.08;
  const HI = 0.55;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const gx =
        -gray[i - w - 1] - 2 * gray[i - 1] - gray[i + w - 1] +
        gray[i - w + 1] + 2 * gray[i + 1] + gray[i + w + 1];
      const gy =
        -gray[i - w - 1] - 2 * gray[i - w] - gray[i - w + 1] +
        gray[i + w - 1] + 2 * gray[i + w] + gray[i + w + 1];
      const mag = Math.sqrt(gx * gx + gy * gy) / 4;
      const a = mag < LO || mag > HI ? 0 : Math.round(255 * (mag - LO) / (HI - LO));
      out.data[i * 4] = 140;
      out.data[i * 4 + 1] = 255;
      out.data[i * 4 + 2] = 235;
      out.data[i * 4 + 3] = a;
    }
  }
  eg.putImageData(out, 0, 0);
  // KHÔNG glow mờ quanh người: quầng blur tràn ra ngoài silhouette trông như
  // "bóng" — người dùng không cần bóng khi quét, chỉ cần chi tiết sát da.
  return { edge };
}

/**
 * Các đoạn người liên tục trên một hàng mask (pixel, theo w), để tia laser chỉ
 * vẽ đúng lên cơ thể. Trả về mảng [x0,x1] đã kẹp.
 */
export function personRuns(mask: PersonMask, row: number): [number, number][] {
  const y = Math.max(0, Math.min(mask.h - 1, Math.round(row)));
  const runs: [number, number][] = [];
  let start = -1;
  for (let x = 0; x < mask.w; x++) {
    const on = mask.data[y * mask.w + x] === 1;
    if (on && start < 0) start = x;
    else if (!on && start >= 0) {
      runs.push([start, x - 1]);
      start = -1;
    }
  }
  if (start >= 0) runs.push([start, mask.w - 1]);
  return runs;
}
