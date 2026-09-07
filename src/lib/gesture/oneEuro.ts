// One-Euro filter — khử rung landmark của MediaPipe mà không thêm độ trễ đáng kể.
// Đứng yên thì lọc mạnh (hết rung), di chuyển nhanh thì lọc nhẹ (không "trôi" theo tay).

class LowPass {
  private y: number | null = null;
  filter(x: number, alpha: number): number {
    this.y = this.y === null ? x : alpha * x + (1 - alpha) * this.y;
    return this.y;
  }
  get value(): number | null {
    return this.y;
  }
}

export class OneEuroFilter {
  private xFilter = new LowPass();
  private dxFilter = new LowPass();
  private lastTime: number | null = null;

  constructor(
    private minCutoff = 1.0,
    private beta = 0.02,
    private dCutoff = 1.0,
  ) {}

  private alpha(cutoff: number, dt: number): number {
    const tau = 1 / (2 * Math.PI * cutoff);
    return 1 / (1 + tau / dt);
  }

  filter(x: number, timestampMs: number): number {
    const dt = this.lastTime === null ? 1 / 60 : Math.max((timestampMs - this.lastTime) / 1000, 1e-4);
    this.lastTime = timestampMs;

    const prev = this.xFilter.value;
    const dx = prev === null ? 0 : (x - prev) / dt;
    const edx = this.dxFilter.filter(dx, this.alpha(this.dCutoff, dt));
    const cutoff = this.minCutoff + this.beta * Math.abs(edx);
    return this.xFilter.filter(x, this.alpha(cutoff, dt));
  }
}

/** Lọc một điểm 2D (x, y) — mỗi trục một filter riêng. */
export class Point2DFilter {
  private fx: OneEuroFilter;
  private fy: OneEuroFilter;
  constructor(minCutoff = 1.0, beta = 0.02) {
    this.fx = new OneEuroFilter(minCutoff, beta);
    this.fy = new OneEuroFilter(minCutoff, beta);
  }
  filter(x: number, y: number, t: number): { x: number; y: number } {
    return { x: this.fx.filter(x, t), y: this.fy.filter(y, t) };
  }
}

/**
 * Làm mượt Ở NHỊP VẼ, khác One-Euro vốn chạy ở nhịp nhận diện.
 *
 * Nhận diện chỉ ~25 lần/giây nên toạ độ con trỏ nhảy từng nấc; màn hình vẽ 60
 * lần/giây, nếu vẽ thẳng toạ độ ấy thì mắt thấy con trỏ "giật cấp". Lớp này
 * giữ vị trí đang vẽ và mỗi khung hình tiến một phần về phía đích, theo HẰNG
 * SỐ THỜI GIAN chứ không theo hệ số cố định — nhờ vậy tốc độ đuổi theo không
 * đổi dù máy chạy 30 hay 144 khung hình/giây.
 */
export class CursorSmoother {
  private x: number | null = null;
  private y: number | null = null;
  private last = 0;
  /**
   * Bản BÁM CHẬM của đích (τ = VEL_TAU_MS). Vận tốc suy ra từ khoảng cách giữa
   * đích và bản chậm này, chứ KHÔNG lấy hiệu hai khung hình liên tiếp: nhận
   * diện chỉ ~25 Hz còn hàm này chạy ~60 Hz, nên hiệu hai khung liên tiếp lúc
   * thì bằng 0 (khung không có dữ liệu mới), lúc thì vọt lên gấp mấy lần —
   * bù theo con số đó là con trỏ giật nảy mỗi nhịp nhận diện.
   */
  private sx = 0;
  private sy = 0;
  private tauMs: number;
  private leadMs: number;

  /**
   * @param tauMs hằng số thời gian; nhỏ = bám sát tay, lớn = mượt nhưng trễ.
   * @param leadMs NHÌN TRƯỚC bao nhiêu mili giây theo vận tốc hiện tại.
   *
   * VÌ SAO CÓ "NHÌN TRƯỚC": mọi khâu trong chuỗi đều cộng thêm trễ — camera
   * ~30 ms, nhận diện ~40 ms một nhịp, One-Euro vài chục ms, rồi lớp mượt này
   * thêm đúng `tauMs` nữa. Cộng lại là con trỏ luôn LÊ SAU đầu ngón tay một
   * quãng thấy rõ khi vẩy tay, dù đứng yên thì rất mượt — đúng cái cảm giác
   * "trễ một khoảng nhỏ, chưa thuận tay".
   *
   * Hạ `tauMs` xuống thì hết trễ nhưng con trỏ rung trở lại. Cách thoát khỏi
   * đánh đổi đó là bù bằng VẬN TỐC: tay đang chạy 1 px/ms thì đích thật của
   * nó, `leadMs` nữa, sẽ ở phía trước `leadMs` px. Nhắm vào đó thay vì nhắm
   * vào chỗ tay VỪA ở. Vận tốc dùng để bù cũng được làm mượt (τ = 90 ms) nên
   * lúc tay đứng yên vận tốc ≈ 0, phần bù tắt hẳn và con trỏ đứng im tuyệt
   * đối — không hề rung thêm so với trước.
   *
   * Phần bù bị chặn ở `MAX_LEAD_PX` để một cú nhận diện nhảy bậy không bắn con
   * trỏ ra khỏi màn hình.
   */
  constructor(tauMs = 55, leadMs = 0) {
    this.tauMs = tauMs;
    this.leadMs = leadMs;
  }

  sample(targetX: number, targetY: number, now: number): { x: number; y: number } {
    if (this.x === null || this.y === null) {
      this.x = targetX;
      this.y = targetY;
      this.sx = targetX;
      this.sy = targetY;
      this.last = now;
      return { x: this.x, y: this.y };
    }
    const dt = Math.max(now - this.last, 0);
    this.last = now;

    const kv = 1 - Math.exp(-dt / VEL_TAU_MS);
    this.sx += (targetX - this.sx) * kv;
    this.sy += (targetY - this.sy) * kv;
    // v ≈ (đích - bản chậm) / τ  — sai khác một hằng số, và hằng số ấy đã nằm
    // trong `leadMs` khi chỉnh tay, nên không cần chính xác tuyệt đối.
    const lead = this.leadMs / VEL_TAU_MS;
    const aimX = targetX + clampLead((targetX - this.sx) * lead);
    const aimY = targetY + clampLead((targetY - this.sy) * lead);

    // 1 - e^(-dt/tau): tiến đúng một phần theo thời gian trôi qua
    const k = 1 - Math.exp(-dt / this.tauMs);
    this.x += (aimX - this.x) * k;
    this.y += (aimY - this.y) * k;
    return { x: this.x, y: this.y };
  }

  /** Nhảy thẳng tới đích (dùng khi bàn tay vừa xuất hiện lại). */
  reset(): void {
    this.x = null;
    this.y = null;
  }
}

/** Hằng số thời gian làm mượt VẬN TỐC — dài hơn vị trí, vì vận tốc nhiễu hơn nhiều. */
const VEL_TAU_MS = 90;
/** Trần của phần bù nhìn trước, tính bằng pixel màn hình. */
const MAX_LEAD_PX = 120;
const clampLead = (v: number) => Math.min(MAX_LEAD_PX, Math.max(-MAX_LEAD_PX, v));
