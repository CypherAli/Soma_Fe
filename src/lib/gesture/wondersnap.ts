import { LM, type Landmark } from "./handModel";
import type { FingerState } from "./gestures";

// LỚP CỬ CHỈ KIỂU WONDERSNAP — snap / nắm / mở / peace lái toàn cảnh.
//
// Vì sao tách riêng thay vì sửa `gestures.ts`: bộ cử chỉ gốc của trang này coi
// tay như CON CHUỘT (trỏ → bấm, xoè → xoay, nắm → kéo), còn WonderSnap coi tay
// như LỆNH ĐIỀU KHIỂN CẢNH (búng → gọi/tan, nắm → gộp, mở → bung liên tục theo
// độ xoè, peace → mẫu tiếp). Hai triết lý khác nhau nên giữ hai module song
// song, chung nhau mỗi `readHand` (nhận diện ngón bằng GÓC KHỚP — chính xác hơn
// cách đo khoảng cách tới cổ tay của WonderSnap gốc khi tay chĩa vào camera).

export type WonderPose = "open" | "fist" | "peace" | "point" | "other" | "none";

/**
 * Pose rời rạc từ trạng thái ngón đã đọc. Peace cần đúng trỏ+giữa duỗi (✌),
 * point cần đúng một ngón trỏ.
 *
 * Khác WonderSnap gốc ở đúng một điểm: OPEN chỉ cần 4 ngón duỗi, KHÔNG bắt
 * ngón cái xoè (bản gốc bắt thumbOut). Tay người mở tự nhiên hay khép cái vào,
 * bắt cái là mở tay bị đọc thành "other" và model đứng im — đúng cảm giác "không
 * điều khiển được". Độ xoè của cái vẫn tính trong openness liên tục.
 */
export function wonderPoseOf(f: FingerState | null): WonderPose {
  if (!f) return "none";
  if (f.extendedCount === 4) return "open";
  if (f.extendedCount === 0) return "fist";
  if (f.index && f.middle && !f.ring && !f.pinky) return "peace";
  if (f.index && !f.middle && !f.ring && !f.pinky) return "point";
  return "other";
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const dist = (a: Landmark, b: Landmark) => Math.hypot(a.x - b.x, a.y - b.y);

/**
 * Độ mở bàn tay 0 (nắm chặt) .. 1 (xoè hết): ngón 80 %, cái 20 %.
 * Công thức ngón cái y hệt WonderSnap; phần ngón dùng số ngón duỗi đã đọc bằng
 * góc khớp (ổn định hơn khi tay nghiêng/chĩa vào camera).
 */
export function opennessOf(f: FingerState, lms: Landmark[]): number {
  const scale = Math.max(dist(lms[LM.WRIST], lms[LM.INDEX_MCP]), dist(lms[LM.WRIST], lms[LM.PINKY_MCP]), 1e-4);
  const thumb = clamp01((dist(lms[LM.THUMB_TIP], lms[LM.PINKY_MCP]) / scale - 0.9) / (1.55 - 0.9));
  return 0.8 * (f.extendedCount / 4) + 0.2 * thumb;
}

/** Nội suy mượt 0..1 (smoothstep): tay mở nửa chừng thì model bung nửa chừng. */
export function smoothOpen(a: number, b: number, x: number): number {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

/** Ngưỡng bung của WonderSnap: dưới 0.12 coi như nắm, trên 0.85 coi như xoè hết. */
export const OPEN_SMOOTH_A = 0.12;
export const OPEN_SMOOTH_B = 0.85;
/** Chụm dưới ngưỡng này thì coi là đang bận (chỉ/chụm): giữ độ bung, không lái. */
export const WONDER_BUSY_SPAN = 0.42;

/**
 * Độ bung tối đa ở kiểu wonder: bằng đúng nút "Tách lớp" cổ điển (vốn là 1).
 * Từng để 1,6 cho bung rộng hơn nhưng các nhóm bay quá xa, rời rạc khó nhìn.
 */
export const WONDER_SPREAD_MAX = 1.0;

/** Part bị kéo tiến về phía người xem bao xa (đơn vị model, y hệt WonderSnap). */
export const WONDER_PULL_DIST = 0.5;

/** Part đang bị kéo: khoá nào + đích 0/1 (scene nội suy mượt như explode). */
export type WonderPull = { key: string; target: number } | null;

/**
 * Chụm cạnh (rising edge) khi đã chọn part thì ĐỔI TRẠNG THÁI kéo: cùng part
 * đang kéo thì đặt lại, part khác thì chuyển sang kéo part đó, chưa kéo thì
 * bắt đầu kéo. Chưa chọn gì thì trả về null để phía gọi dùng làm cú bấm.
 */
export function nextPullState(cur: WonderPull, raw: string | null): WonderPull {
  if (!raw) return null;
  if (cur && cur.key === raw && cur.target > 0) return null;
  return { key: raw, target: 1 };
}

/**
 * Fit kiểu WonderSnap: cụm bung ra to gần gấp đôi (mỗi nhóm bay 45 % cỡ model)
 * trong khi khung hình fit lúc gộp — không lùi xa thì bung là tràn màn hình.
 * Trả về hệ số nhân zoom: 1 lúc gộp, ~0.53 lúc bung 1, ~0.41 lúc bung 1.6.
 */
export function wonderFitZoom(explode: number): number {
  const e = Math.max(explode, 0);
  return 1 / (1 + 0.9 * e);
}

/**
 * Pose phải lặp đủ số khung hình mới thành pose ổn định — y hệt PoseDebouncer
 * của WonderSnap (peace cần giữ lâu hơn vì dễ nhầm với mở tay).
 */
export class WonderPoseDebouncer {
  private stable: WonderPose = "none";
  private cand: WonderPose = "none";
  private n = 0;
  private hold: number;
  private holdPeace: number;
  constructor(hold = 4, holdPeace = 6) {
    this.hold = hold;
    this.holdPeace = holdPeace;
  }
  push(pose: WonderPose): { stable: WonderPose; changed: boolean } {
    if (pose === this.cand) this.n += 1;
    else {
      this.cand = pose;
      this.n = 1;
    }
    const need = pose === "peace" ? this.holdPeace : this.hold;
    if (this.n >= need && pose !== this.stable) {
      this.stable = pose;
      return { stable: pose, changed: true };
    }
    return { stable: this.stable, changed: false };
  }
  reset(): void {
    this.stable = "none";
    this.cand = "none";
    this.n = 0;
  }
}

/**
 * Tay có đang bận (chỉ/chụm) không: đang bận thì GIỮ độ bung đỉnh gần nhất chứ
 * không lái theo ngón (ngón gập khi chỉ/chụm bị đọc nhầm thành "khép").
 *
 * Dùng độ mở THÔ (span hiện tại), KHÔNG dùng trạng thái chụm đã chốt: chốt dính
 * mà landmark rung (phòng tối, fps thấp) thì kẹt ở "bận" vĩnh viễn — bung và
 * xoay cùng chết dù tay đang mở. Bấm/chọn vẫn dùng máy chốt riêng (PinchClick).
 */
export function wonderBusy(pose: WonderPose, pinchSpan: number): boolean {
  return pose === "point" || pinchSpan < WONDER_BUSY_SPAN;
}

/**
 * Búng tay: cái + giữa CHẠM rồi BUNG nhanh. Mất dấu tay giữa chừng (mờ chuyển
 * động) được du di thêm. Loại: mở chậm, giữ chụm, nắm tay mở ra, và kiểu bung
 * mà ngón giữa còn duỗi (búng thật thì ngón giữa quật XUỐNG lòng bàn tay).
 * Ngưỡng y hệt WonderSnap.
 */
export class WonderSnapDetector {
  private pressedAt: number | null = null;
  private hadDropout = false;
  private lastFire = -Infinity;
  private close: number;
  private open: number;
  private maxReleaseMs: number;
  private cooldownMs: number;
  private dropoutMs: number;
  constructor(opts: { close?: number; open?: number; maxReleaseMs?: number; cooldownMs?: number; dropoutMs?: number } = {}) {
    this.close = opts.close ?? 0.35;
    this.open = opts.open ?? 0.75;
    this.maxReleaseMs = opts.maxReleaseMs ?? 100;
    this.cooldownMs = opts.cooldownMs ?? 800;
    this.dropoutMs = opts.dropoutMs ?? 150;
  }
  /** Trả về true đúng MỘT lần khi phát hiện cú búng. */
  push(lms: Landmark[] | null, fingers: FingerState | null, tMs: number): boolean {
    if (!lms) {
      if (this.pressedAt !== null) {
        if (tMs - this.pressedAt > this.maxReleaseMs + this.dropoutMs) this.pressedAt = null;
        else this.hadDropout = true;
      }
      return false;
    }
    const scale = Math.max(
      dist(lms[LM.WRIST], lms[LM.INDEX_MCP]),
      dist(lms[LM.WRIST], lms[LM.PINKY_MCP]),
      1e-4,
    );
    const r = dist(lms[LM.THUMB_TIP], lms[LM.MIDDLE_TIP]) / scale;
    if (r < this.close) {
      // Nắm tay cũng đưa cái+giữa lại gần nhau: đó không phải cú "nhấn" búng.
      if (fingers && fingers.extendedCount === 0) this.pressedAt = null;
      else {
        this.pressedAt = tMs;
        this.hadDropout = false;
      }
      return false;
    }
    if (this.pressedAt === null) return false;
    if (tMs - this.pressedAt > this.maxReleaseMs + (this.hadDropout ? this.dropoutMs : 0)) {
      this.pressedAt = null;
      return false;
    }
    if (r > this.open) {
      this.pressedAt = null;
      if (fingers && fingers.middle) return false;
      if (tMs - this.lastFire >= this.cooldownMs) {
        this.lastFire = tMs;
        return true;
      }
    }
    return false;
  }
  reset(): void {
    this.pressedAt = null;
    this.hadDropout = false;
  }
}

export type WonderSceneState = "hidden" | "shown";
export type WonderEvent = "summon" | "dissolve" | "assemble" | "next";

/**
 * Máy trạng thái cảnh (GLB không có hạt để triệu hồi như WonderSnap nên
 * summon/dissolve map thành hiện/ẩn model có hoạt hình):
 *
 *   hidden --snap--> shown (bung 0, lắp sẵn)
 *   shown  --snap--> hidden (1.2 s tan dần, như DISSOLVE của WonderSnap)
 *   hidden --fist--> shown + assemble (nắm tay gọi model ra, đã gộp sẵn)
 *   shown  + fist--> assemble (độ bung về 0)
 *   shown  + peace--> next (mẫu tiếp, vẫn hiện)
 *   mở tay          --> không đổi trạng thái: độ bung chạy LIÊN TỤC theo openness
 */
export class WonderScene {
  state: WonderSceneState = "shown";
  update(stable: WonderPose, changed: boolean, snapped: boolean): WonderEvent[] {
    const out: WonderEvent[] = [];
    if (snapped) {
      if (this.state === "hidden") {
        this.state = "shown";
        out.push("summon");
      } else {
        this.state = "hidden";
        out.push("dissolve");
      }
      return out;
    }
    if (!changed) return out;
    if (stable === "peace") {
      // Đang ẩn mà giơ peace: gọi model ra rồi mới chuyển mẫu tiếp.
      if (this.state === "hidden") {
        this.state = "shown";
        out.push("summon");
      }
      out.push("next");
    } else if (stable === "fist") {
      if (this.state === "hidden") {
        this.state = "shown";
        out.push("summon");
      }
      out.push("assemble");
    }
    return out;
  }
  reset(): void {
    this.state = "shown";
  }
}
