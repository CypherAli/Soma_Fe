import { LM, type Landmark, type TrackedHand } from "./handModel";

// Nhận dạng tư thế bàn tay từ 21 landmark.
//
// HAI NGUYÊN TẮC ĐỂ CỬ CHỈ BẮT ỔN ĐỊNH:
//  1. Mọi khoảng cách đều chia cho "cỡ bàn tay" (cổ tay → khớp bàn ngón trỏ),
//     nên ngưỡng không đổi khi tay ở xa hay gần camera.
//  2. Ngón duỗi hay gập xét bằng GÓC GẬP tại khớp, không phải khoảng cách tới
//     cổ tay. Cách cũ (so tip–cổ tay với pip–cổ tay) sai hẳn khi bàn tay chĩa
//     về phía camera hoặc nằm ngang: lúc đó mọi điểm gần như cùng khoảng cách
//     tới cổ tay nên nắm tay vẫn bị đọc thành xoè tay.

const dist = (a: Landmark, b: Landmark) => Math.hypot(a.x - b.x, a.y - b.y);

/** Cỡ bàn tay dùng để chuẩn hoá mọi khoảng cách. */
export function handScale(lms: Landmark[]): number {
  // Lấy cạnh DÀI HƠN trong hai cạnh của lòng bàn tay: khi bàn tay nghiêng,
  // một trong hai cạnh bị co ngắn do phối cảnh, lấy cạnh dài hơn thì tỉ lệ
  // chuẩn hoá ổn định hơn nhiều.
  const wrist = lms[LM.WRIST];
  return Math.max(
    dist(wrist, lms[LM.INDEX_MCP]),
    dist(wrist, lms[LM.PINKY_MCP]),
    1e-4,
  );
}

/** Góc tại đỉnh `b` của ba điểm a–b–c, tính bằng radian (0 = gập hết). */
function jointAngle(a: Landmark, b: Landmark, c: Landmark): number {
  const v1x = a.x - b.x, v1y = a.y - b.y;
  const v2x = c.x - b.x, v2y = c.y - b.y;
  const n1 = Math.hypot(v1x, v1y) || 1e-6;
  const n2 = Math.hypot(v2x, v2y) || 1e-6;
  const cos = Math.min(1, Math.max(-1, (v1x * v2x + v1y * v2y) / (n1 * n2)));
  return Math.acos(cos);
}

/**
 * Ngón duỗi hay gập, xét bằng góc gập ở khớp GIỮA (PIP) — thẳng thì góc gần
 * 180°, gập lại thì góc nhỏ. Ngưỡng 130° chịu được cả ngón hơi cong.
 */
function fingerExtended(lms: Landmark[], mcp: number, pip: number, tip: number): boolean {
  return jointAngle(lms[mcp], lms[pip], lms[tip]) > (130 * Math.PI) / 180;
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
  /** Số ngón (trỏ, giữa, nhẫn, út) đang duỗi — 0 = nắm tay, 4 = xoè hết. */
  extendedCount: number;
};

export function readHand(lms: Landmark[]): FingerState {
  const s = handScale(lms);
  const index = fingerExtended(lms, LM.INDEX_MCP, LM.INDEX_PIP, LM.INDEX_TIP);
  const middle = fingerExtended(lms, LM.MIDDLE_MCP, LM.MIDDLE_PIP, LM.MIDDLE_TIP);
  const ring = fingerExtended(lms, 13, LM.RING_PIP, LM.RING_TIP);
  const pinky = fingerExtended(lms, LM.PINKY_MCP, LM.PINKY_PIP, LM.PINKY_TIP);
  return {
    index,
    middle,
    ring,
    pinky,
    // ngón cái xoè ra xa khớp bàn ngón trỏ = đang mở, khép sát = đang thu
    thumbOut: dist(lms[LM.THUMB_TIP], lms[LM.INDEX_MCP]) / s > 1.05,
    pinchSpan: dist(lms[LM.THUMB_TIP], lms[LM.INDEX_TIP]) / s,
    // Trục lòng bàn tay: cổ tay → khớp bàn ngón GIỮA. Dùng khớp bàn (MCP) chứ
    // không dùng khớp giữa ngón (PIP) như trước: PIP di chuyển theo động tác
    // gập duỗi ngón, làm góc "xoay" nhảy dù bàn tay đứng yên.
    angle: Math.atan2(
      lms[LM.MIDDLE_MCP].y - lms[LM.WRIST].y,
      lms[LM.MIDDLE_MCP].x - lms[LM.WRIST].x,
    ),
    extendedCount: [index, middle, ring, pinky].filter(Boolean).length,
  };
}

export type HandMode = "point" | "zoom" | "rotate" | "pan";

/**
 * Chế độ của TỪNG bàn tay (mỗi tay độc lập → hai tay có thể làm hai việc khác nhau):
 *   nắm tay              → di chuyển
 *   xoè cả bàn tay       → xoay (theo góc nghiêng bàn tay)
 *   trỏ + cái tách xa    → phóng to/thu nhỏ (theo độ mở hai ngón)
 *   chỉ ngón trỏ         → con trỏ / chọn (chụm cái vào trỏ = bấm)
 */
export function detectHandMode(f: FingerState): HandMode {
  if (f.extendedCount === 0) return "pan";
  if (f.extendedCount >= 3) return "rotate";
  return "point";
}

/**
 * Ngón cái đang chạm ngón trỏ? Dùng cho cả cú BẤM một tay lẫn cử chỉ zoom hai tay.
 *
 * Vì sao KHÔNG còn chế độ zoom một tay: bản thiết kế chốt "hai tay chụm/mở =
 * zoom". Bản làm thử để zoom theo độ mở ngón cái–trỏ của MỘT tay, hậu quả là
 * chỉ cần giơ tay trỏ vào mô hình mà ngón cái hơi xoè là cả mô hình tự phóng
 * to — đây chính là cảm giác "cực kì khó kiểm soát". Một tay giờ chỉ còn ba
 * việc rạch ròi: trỏ, xoay (xoè), di chuyển (nắm).
 */
export function isPinching(f: FingerState): boolean {
  return f.pinchSpan < PINCH_ON;
}

/**
 * Khoảng cách giữa HAI bàn tay, chuẩn hoá theo cỡ bàn tay nên không đổi khi
 * người dùng ngồi xa hay gần camera.
 */
export function twoHandSpan(a: Landmark[], b: Landmark[]): number {
  const scale = (handScale(a) + handScale(b)) / 2;
  return dist(a[LM.INDEX_TIP], b[LM.INDEX_TIP]) / Math.max(scale, 1e-4);
}

/**
 * VÙNG CHẾT — thứ quyết định cảm giác "điều khiển được".
 *
 * Tay người không bao giờ đứng yên: chỉ cần thở là landmark đã trôi vài phần
 * trăm. Nếu lấy thẳng độ lệch so với lúc bắt đầu thì mô hình rung liên tục và
 * không cách nào đặt nó vào đúng chỗ mong muốn. Hàm này bỏ qua phần lệch nhỏ
 * hơn `dead`, và phần vượt ra thì tính từ 0 — nên lúc vừa vượt ngưỡng mô hình
 * KHÔNG giật nảy một cái (đó là lỗi của cách "vượt ngưỡng rồi lấy nguyên delta").
 */
export function deadzone(delta: number, dead: number): number {
  if (delta > dead) return delta - dead;
  if (delta < -dead) return delta + dead;
  return 0;
}

/** Chênh lệch góc, luôn quy về khoảng (-π, π] để không nhảy 2π khi qua mốc. */
export function angleDelta(now: number, base: number): number {
  let d = now - base;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

/**
 * Góc vặn bàn tay trong mặt phẳng ảnh (radian, 0 = ngón hướng lên,
 * + = cùng chiều kim đồng hồ trên màn hình) — đúng công thức `rollOf` của
 * WonderSnap: trục cổ tay → khớp bàn ngón giữa, x nhân aspect vì x/y landmark
 * được chuẩn hoá riêng theo từng chiều (video 480×360 mà không nhân thì gain
 * xoay méo tới ~8° ở hướng chéo). Không phụ thuộc ngón gập/duỗi.
 */
export function handRoll(lms: Landmark[], aspect = 1): number {
  return Math.atan2(
    (lms[LM.MIDDLE_MCP].x - lms[LM.WRIST].x) * aspect,
    -(lms[LM.MIDDLE_MCP].y - lms[LM.WRIST].y),
  );
}

/**
 * Độ lật lòng bàn tay (−1..1): thành phần x của pháp tuyến lòng bàn tay
 * (Newell trên đa giác cổ tay + 4 khớp bàn). Vặn cổ tay kiểu núm cửa gần như
 * KHÔNG đổi trục cổ tay→ngón giữa (handRoll đứng yên) nhưng lật pháp tuyến
 * này — đây mới là tín hiệu của "xoay bàn tay". Lấy tương đối so với neo nên
 * dấu tuyệt đối (trái/phải, sấp/ngửa) không quan trọng.
 */
export function handTwist(lms: Landmark[]): number {
  const ids = [LM.WRIST, LM.INDEX_MCP, LM.MIDDLE_MCP, LM.RING_MCP, LM.PINKY_MCP];
  let nx = 0, ny = 0, nz = 0;
  for (let i = 0; i < ids.length; i++) {
    const a = lms[ids[i]], b = lms[ids[(i + 1) % ids.length]];
    nx += (a.y - b.y) * (a.z + b.z);
    ny += (a.z - b.z) * (a.x + b.x);
    nz += (a.x - b.x) * (a.y + b.y);
  }
  return nx / (Math.hypot(nx, ny, nz) || 1e-6);
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
  // Viết tường minh thay vì "parameter property" của TypeScript: node chạy .ts
  // ở chế độ chỉ-xoá-kiểu không hiểu cú pháp đó, mà file này cần chạy được
  // trong node cho `npm run test:gestures`.
  private needed: number;
  constructor(needed = 4) {
    this.needed = needed;
  }

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

// ---- BẤM BẰNG CÁCH CHỤM NGÓN ----------------------------------------------
// Hai ngưỡng khác nhau (trễ – hysteresis) để không "rung bấm" quanh một ngưỡng
// duy nhất: phải chụm sát hơn PINCH_ON mới tính là bấm xuống, và phải tách xa
// hơn PINCH_OFF mới tính là nhả ra.
export const PINCH_ON = 0.42;
export const PINCH_OFF = 0.62;
/** Bấm nhanh hơn mức này coi như nhiễu, không tính. */
const PINCH_MIN_MS = 60;
/** Hai lần bấm cách nhau dưới mức này coi như một lần (chống bấm kép). */
const PINCH_COOLDOWN_MS = 350;

export type PinchPhase = "open" | "closed";

/**
 * Máy trạng thái cho động tác chụm ngón cái vào ngón trỏ = một cú bấm.
 *
 * Vì sao cần cả cái này lẫn "giữ yên để chọn" (dwell): dwell không cần học
 * nhưng chậm 1,5 giây mỗi lần; chụm ngón thì bấm tức thì, hợp với người đã
 * quen. Cả hai cùng chạy nên người dùng chọn cách nào cũng được.
 */
export class PinchClick {
  private phase: PinchPhase = "open";
  private since = 0;
  private lastClick = -Infinity;

  /** Trả về true đúng MỘT lần tại thời điểm ngón vừa chụm lại thành cú bấm. */
  push(span: number, now: number): boolean {
    if (this.phase === "open") {
      if (span < PINCH_ON) {
        this.phase = "closed";
        this.since = now;
        if (now - this.lastClick >= PINCH_COOLDOWN_MS) {
          this.lastClick = now;
          return true;
        }
      }
      return false;
    }
    // đang chụm: chỉ nhả khi tách đủ xa, và phải giữ tối thiểu vài chục ms
    if (span > PINCH_OFF && now - this.since >= PINCH_MIN_MS) this.phase = "open";
    return false;
  }

  get isClosed(): boolean {
    return this.phase === "closed";
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
  /**
   * Khoá định danh một bàn tay qua các khung hình. Mặc định là nhãn
   * `handedness` của MediaPipe — NHƯNG nhãn này lật liên tục (tay phải giơ trỏ
   * hay bị đọc thành "Left" rồi lại "Right"), mỗi lần lật là bộ ổn định tưởng
   * tay mới và chế độ chập chờn. Truyền khoá bám theo VỊ TRÍ (do trang gọi tự
   * ghép) thì lật nhãn cũng không mất dấu tay.
   */
  keyOf: (hand: TrackedHand, index: number) => string = (hand) => hand.handedness,
): AnalyzedHand[] {
  return hands.map((hand, index) => {
    const fingers = readHand(hand.landmarks);
    let mode = detectHandMode(fingers);
    if (stabilizers) {
      const k = keyOf(hand, index);
      let st = stabilizers.get(k);
      if (!st) {
        st = new ModeStabilizer();
        stabilizers.set(k, st);
      }
      mode = st.push(mode);
    }
    return { hand, fingers, mode };
  });
}

export const ZOOM_MIN = 0.5;
export const ZOOM_MAX = 2.6;

/**
 * Hệ số phóng to khi hai tay chụm/mở.
 *
 * Tính từ MỘT MỐC NEO cố định (cỡ mô hình và khoảng cách hai tay tại đúng thời
 * điểm bắt đầu chụm), nên:
 *  • vừa vào chế độ thì hệ số bằng đúng cỡ đang có → mô hình không nhảy;
 *  • không nhân dồn qua từng khung hình → không bao giờ trôi mất mô hình.
 * Vùng chết 0,12 để hai tay run nhẹ chưa làm đổi cỡ.
 */
export function zoomFromTwoHands(
  span: number,
  anchorSpan: number,
  anchorZoom: number,
): number {
  const d = deadzone(span - anchorSpan, 0.12);
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, anchorZoom * (1 + d * 0.55)));
}
