import { LM, type Landmark, type TrackedHand } from "./useHandTracking";

// Nhận dạng tư thế bàn tay từ 21 landmark. Toạ độ chuẩn hoá, y hướng XUỐNG.

/** Ngón có duỗi không: đầu ngón cao hơn (y nhỏ hơn) khớp giữa. */
function isExtended(lms: Landmark[], tip: number, pip: number): boolean {
  return lms[tip].y < lms[pip].y - 0.02;
}

/** Đếm số ngón đang duỗi (không tính ngón cái). */
export function countExtendedFingers(lms: Landmark[]): number {
  let n = 0;
  if (isExtended(lms, LM.INDEX_TIP, LM.INDEX_PIP)) n++;
  if (isExtended(lms, LM.MIDDLE_TIP, LM.MIDDLE_PIP)) n++;
  if (isExtended(lms, LM.RING_TIP, LM.RING_PIP)) n++;
  if (isExtended(lms, LM.PINKY_TIP, LM.PINKY_PIP)) n++;
  return n;
}

/** Chụm ngón cái với ngón trỏ. */
export function isPinching(lms: Landmark[], threshold = 0.06): boolean {
  const a = lms[LM.INDEX_TIP];
  const b = lms[LM.THUMB_TIP];
  return Math.hypot(a.x - b.x, a.y - b.y) < threshold;
}

/** Nắm tay: cả 4 ngón đều gập. */
export function isFist(lms: Landmark[]): boolean {
  return countExtendedFingers(lms) === 0;
}

/** Bàn tay xoè: cả 4 ngón đều duỗi. */
export function isOpenPalm(lms: Landmark[]): boolean {
  return countExtendedFingers(lms) === 4;
}

/** Khoảng cách giữa cổ tay hai bàn tay — dùng cho cử chỉ zoom hai tay. */
export function twoHandSpan(hands: TrackedHand[]): number | null {
  if (hands.length < 2) return null;
  const a = hands[0].landmarks[LM.WRIST];
  const b = hands[1].landmarks[LM.WRIST];
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export type GestureMode = "idle" | "point" | "rotate" | "pan" | "zoom";

/** Xác định chế độ thao tác hiện tại từ (các) bàn tay đang thấy. */
export function detectMode(hands: TrackedHand[]): GestureMode {
  if (hands.length === 0) return "idle";
  if (hands.length >= 2) {
    // hai tay cùng chụm = phóng to/thu nhỏ
    if (hands.every((h) => isPinching(h.landmarks))) return "zoom";
  }
  const primary = hands.find((h) => h.handedness === "Right") ?? hands[0];
  if (isFist(primary.landmarks)) return "pan";
  if (isPinching(primary.landmarks)) return "rotate";
  return "point";
}
