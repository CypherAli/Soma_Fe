/** Union of original source geometry, used to frame an isolated system or part. */
export function inspectionFrame(
  surface,
  ids,
  radius = 0.85,
  { explode = 0, exCenter = [0, 0, 0] } = {},
) {
  const lo = [Infinity, Infinity, Infinity],
    hi = [-Infinity, -Infinity, -Infinity];
  let found = false;
  for (const group of surface?.groups || []) {
    if (!ids.has(group.pick)) continue;
    const bounds = group.bounds;
    const e = explode * explode * (3 - 2 * explode),
      shift = (group.offset || [0, 0, 0]).map(
        (value, k) => value * e - exCenter[k] * explode,
      );
    if (bounds) {
      for (let k = 0; k < 3; k++) {
        lo[k] = Math.min(lo[k], bounds[0][k] + shift[k]);
        hi[k] = Math.max(hi[k], bounds[1][k] + shift[k]);
      }
    } else {
      for (let p = group.start * 3; p < (group.start + group.count) * 3; p += 3)
        for (let k = 0; k < 3; k++) {
          lo[k] = Math.min(lo[k], surface.positions[p + k] + shift[k]);
          hi[k] = Math.max(hi[k], surface.positions[p + k] + shift[k]);
        }
    }
    found = true;
  }
  if (!found || !lo.every(Number.isFinite) || !hi.every(Number.isFinite))
    return null;
  const center = lo.map((v, k) => (v + hi[k]) / 2);
  const sourceRadius = Math.hypot(...hi.map((v, k) => (v - lo[k]) / 2));
  return {
    center,
    scale: Math.min(24, radius / Math.max(sourceRadius, 0.001)),
    bounds: [lo, hi],
  };
}
