import { LM, type Landmark, type TrackedHand } from "./useHandTracking";

// Nhận dạng tư thế bàn tay từ 21 landmark.
// MỌI phép đo đều chia cho "cỡ bàn tay" (cổ tay → khớp bàn ngón trỏ) nên
// ngưỡng không đổi khi tay ở xa hay gần camera — đây là chìa khoá để cử chỉ
// bắt ổn định.

const dist = (a: Landmark, b: Landmark) => Math.hypot(a.x - b.x, a.y - b.y);

/** Cỡ bàn tay dùng để chuẩn hoá mọi khoảng cách. */
export function handScale(lms: Landmark[]): number {
  return Math.max(dist(lms[LM.WRIST], lms[LM.INDEX_MCP]), 1e-4);
}

/** Ngón duỗi hay gập: đo khoảng cách đầu ngón tới cổ tay so với khớp giữa. */
function fingerExtended(lms: Landmark[], tip: number, pip: number): boolean {
  const w = lms[LM.WRIST];
  return dist(lms[tip], w) > dist(lms[pip], w) * 1.15;
}

export type FingerState = {
  index: boolean;
  middle: boolean;
  ring: boolean;
  pinky: boolean;
  thumbOut: boolean;
  /** Khoảng cách ngón cái–ngón trỏ đã chuẩn hoá (0 = chạm nhau, ~1.5 = mở hết). */
  pinchSpan: number;
  /** Góc nghiêng bàn tay trong mặt phẳng camera (radian). */
  angle: number;
};

export function readHand(lms: Landmark[]): FingerState {
  const s = handScale(lms);
  return {
    index: fingerExtended(lms, LM.INDEX_TIP, LM.INDEX_PIP),
    middle: fingerExtended(lms, LM.MIDDLE_TIP, LM.MIDDLE_PIP),
    ring: fingerExtended(lms, LM.RING_TIP, LM.RING_PIP),
    pinky: fingerExtended(lms, LM.PINKY_TIP, LM.PINKY_PIP),
    // ngón cái xoè ra xa khớp bàn ngón trỏ = đang mở, khép sát = đang thu
    thumbOut: dist(lms[LM.THUMB_TIP], lms[LM.INDEX_MCP]) / s > 1.05,
    pinchSpan: dist(lms[LM.THUMB_TIP], lms[LM.INDEX_TIP]) / s,
    angle: Math.atan2(
      lms[LM.MIDDLE_PIP].y - lms[LM.WRIST].y,
      lms[LM.MIDDLE_PIP].x - lms[LM.WRIST].x,
    ),
  };
}

export type HandMode = "point" | "zoom" | "rotate" | "pan";

/**
 * Chế độ của TỪNG bàn tay (mỗi tay độc lập → hai tay có thể làm hai việc khác nhau):
 *   nắm tay              → di chuyển
 *   xoè cả bàn tay       → xoay (theo góc nghiêng bàn tay)
 *   ngón cái + trỏ mở    → phóng to/thu nhỏ (theo độ mở hai ngón)
 *   chỉ ngón trỏ         → con trỏ / chọn
 */
export function detectHandMode(f: FingerState): HandMode {
  const fingers = [f.index, f.middle, f.ring, f.pinky].filter(Boolean).length;
  if (fingers === 0) return "pan";
  if (fingers >= 3) return "rotate";
  if (f.index && !f.middle && !f.ring && !f.pinky && f.thumbOut) return "zoom";
  return "point";
}

export const MODE_LABEL: Record<HandMode, string> = {
  point: "Trỏ",
  zoom: "Phóng to / thu nhỏ",
  rotate: "Xoay",
  pan: "Di chuyển",
};

/**
 * Giữ chế độ ổn định: chỉ đổi khi tư thế mới lặp lại đủ số khung hình.
 * Không có bước này, nhận diện ngón chập chờn sẽ làm chế độ nhảy liên tục
 * và mọi thao tác "lộn hết cả lên".
 */
export class ModeStabilizer {
  private current: HandMode = "point";
  private candidate: HandMode = "point";
  private count = 0;
  constructor(private needed = 4) {}

  push(mode: HandMode): HandMode {
    if (mode === this.current) {
      this.candidate = mode;
      this.count = 0;
      return this.current;
    }
    if (mode === this.candidate) {
      this.count += 1;
      if (this.count >= this.needed) {
        this.current = mode;
        this.count = 0;
      }
    } else {
      this.candidate = mode;
      this.count = 1;
    }
    return this.current;
  }
}

/** Gói dữ liệu một bàn tay đã phân tích, dùng trực tiếp trong vòng lặp. */
export type AnalyzedHand = {
  hand: TrackedHand;
  fingers: FingerState;
  mode: HandMode;
};

export function analyze(
  hands: TrackedHand[],
  stabilizers?: Map<string, ModeStabilizer>,
): AnalyzedHand[] {
  return hands.map((hand) => {
    const fingers = readHand(hand.landmarks);
    let mode = detectHandMode(fingers);
    if (stabilizers) {
      let st = stabilizers.get(hand.handedness);
      if (!st) {
        st = new ModeStabilizer();
        stabilizers.set(hand.handedness, st);
      }
      mode = st.push(mode);
    }
    return { hand, fingers, mode };
  });
}

/** Độ mở hai ngón → hệ số phóng to, ánh xạ TUYỆT ĐỐI nên không bao giờ trôi. */
export function zoomFromSpan(span: number, min = 0.5, max = 2.6): number {
  const SPAN_MIN = 0.3;
  const SPAN_MAX = 1.7;
  const k = Math.min(1, Math.max(0, (span - SPAN_MIN) / (SPAN_MAX - SPAN_MIN)));
  return min + k * (max - min);
}
