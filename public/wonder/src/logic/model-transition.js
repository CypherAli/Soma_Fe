const smooth = (t) => {
  t = Math.max(0, Math.min(1, t));
  return t * t * (3 - 2 * t);
};

/** Finish the outgoing animation and wait for the new asset before assembling. */
export class ModelTransition {
  constructor() {
    this.pending = null;
  }
  begin(index, time, outgoing, autoForm = true) {
    this.pending = {
      index,
      time,
      autoForm,
      phase: outgoing ? "out" : "loading",
      uploadedAt: null,
    };
  }
  outgoingBlend(time) {
    return this.pending?.phase === "out"
      ? 1 - smooth((time - this.pending.time - 0.12) / 0.55)
      : 0;
  }
  commit(time) {
    const p = this.pending;
    if (!p || p.phase === "gathering" || (p.phase === "loading" && p.committed))
      return null;
    if (p.phase === "out" && time - p.time < 0.67) return null;
    p.phase = "loading";
    p.committed = true;
    return p.index;
  }
  uploaded(index, time) {
    const p = this.pending;
    if (!p || p.index !== index || !p.committed) return;
    p.phase = "gathering";
    p.uploadedAt = time;
  }
  shouldForm(time) {
    const p = this.pending;
    if (
      !p ||
      p.phase !== "gathering" ||
      !p.autoForm ||
      p.formed ||
      time - p.uploadedAt < 0.7
    )
      return false;
    p.formed = true;
    return true;
  }
  complete() {
    this.pending = null;
  }
}
