const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
export function wheelZoom(zoom, delta, mode = 0, height = 800) {
  const pixels = delta * (mode === 1 ? 16 : mode === 2 ? height : 1);
  return clamp(zoom * Math.exp(-clamp(pixels, -240, 240) * .0018), .5, 2.6);
}

// Filter camera samples before the render-time damping. A short tracking gap
// keeps the anchor; reacquisition after a real release starts at the current zoom.
export class HandZoom {
  reset() { this.anchor = null; this.lastActive = -Infinity; }
  constructor() { this.reset(); }
  pause(time) { if (time - this.lastActive > .35) this.reset(); }
  update(spread, time, zoom) {
    if (!Number.isFinite(spread) || spread < .08) return zoom;
    if (!this.anchor || time - this.lastActive > .35) this.anchor = { spread, zoom, filtered: spread, time };
    const anchor = this.anchor, dt = Math.max(0, time - anchor.time);
    anchor.filtered += (spread - anchor.filtered) * (1 - Math.exp(-dt * 12));
    anchor.time = time; this.lastActive = time;
    const delta = Math.log(anchor.filtered / anchor.spread);
    const stable = Math.sign(delta) * Math.max(0, Math.abs(delta) - .012);
    return clamp(anchor.zoom * Math.exp(stable), .5, 2.6);
  }
}

// WonderSnap's relative vertical grab, independent from wrist yaw.
export class HandTilt {
  constructor() { this.reset(); }
  reset() { this.anchor = null; }
  update(pitch, handY, active, dt) {
    if (!active) { this.reset(); return pitch; }
    if (!Number.isFinite(handY)) return pitch;
    this.anchor ??= { handY, pitch };
    const target = clamp(this.anchor.pitch + 2.5 * (handY - this.anchor.handY), -.75, .75);
    return pitch + (target - pitch) * (1 - Math.exp(-Math.max(0, dt) * 9));
  }
}

// Two hands own zoom before one-hand point/pinch classification. Navigation
// thumbs, scanning and model transitions retain their explicit ownership.
export function twoHandZoomActive({ manual, blocked, visible, second, formed, navigation }) {
  return !manual && !blocked && visible && second && formed && !navigation;
}
