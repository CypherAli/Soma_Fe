// Builds model point clouds off the main thread (a 200k-point engine takes a few hundred ms),
// so switching models never stutters the render loop. Buffers are transferred, not copied.
import { buildModelAsync } from './models/catalog.js';

self.onmessage = async (e) => {
  const { id, index, n } = e.data;
  try {
    const m = await buildModelAsync(index, n);
    const out = { id, index, n, target: m.target, offset: m.offset, tint: m.tint, pick: m.pick, labels: m.labels, groups: m.groups, fitScale: m.fitScale, exCenter: m.exCenter, ms: m.ms };
    out.surface=m.surface;
    self.postMessage(out, [m.target.buffer, m.offset.buffer, m.tint.buffer, m.pick.buffer,...(m.surface?[m.surface.positions.buffer,...(m.surface.normals?[m.surface.normals.buffer]:[])]:[])]);
  } catch (err) {
    self.postMessage({ id, index, error: String((err && err.stack) || err) });
  }
};
