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
