import * as THREE from 'three';

/** Area in the geometry's current coordinates; callers bake world transforms first. */
export function surfaceDistribution(geo: THREE.BufferGeometry) {
  const p = geo.getAttribute('position'), ix = geo.getIndex();
  const count = Math.floor((ix?.count ?? p.count) / 3);
  const cdf = new Float64Array(count);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  let area = 0;
  for (let t = 0; t < count; t++) {
    a.fromBufferAttribute(p, ix ? ix.getX(t * 3) : t * 3);
    b.fromBufferAttribute(p, ix ? ix.getX(t * 3 + 1) : t * 3 + 1).sub(a);
    c.fromBufferAttribute(p, ix ? ix.getX(t * 3 + 2) : t * 3 + 2).sub(a);
    area += b.cross(c).length() * .5;
    cdf[t] = area;
  }
  return { cdf, area };
}

/** Deterministic, fresh barycentric samples. No seed-cloud reuse or XYZ jitter. */
export function sampleRegionSurface(geo: THREE.BufferGeometry, count: number, seed = 73) {
  const { cdf, area } = surfaceDistribution(geo);
  if (!Number.isFinite(area) || area <= 0) throw new Error('Empty anatomical surface');
  let state = seed >>> 0;
  const random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
  const p = geo.getAttribute('position'), ix = geo.getIndex();
  const xyz = new Float32Array(count * 3);
  for (let n = 0; n < count; n++) {
    const r = random() * area;
    let lo = 0, hi = cdf.length - 1;
    while (lo < hi) { const mid = (lo + hi) >>> 1; if (cdf[mid] <= r) lo = mid + 1; else hi = mid; }
    const a = ix ? ix.getX(lo * 3) : lo * 3;
    const b = ix ? ix.getX(lo * 3 + 1) : lo * 3 + 1;
    const c = ix ? ix.getX(lo * 3 + 2) : lo * 3 + 2;
    const s = Math.sqrt(random()), v = s * random(), u = 1 - s, w = s - v;
    xyz[n * 3] = p.getX(a) * u + p.getX(b) * v + p.getX(c) * w;
    xyz[n * 3 + 1] = p.getY(a) * u + p.getY(b) * v + p.getY(c) * w;
    xyz[n * 3 + 2] = p.getZ(a) * u + p.getZ(b) * v + p.getZ(c) * w;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(xyz, 3));
  return out;
}

export function allocateSurfaceCounts(areas: number[], budget: number, minimum = 300) {
  if (!areas.length) return [];
  const base = Math.min(minimum, Math.floor(budget / areas.length));
  const remaining = budget - base * areas.length;
  const total = areas.reduce((a,b) => a+b,0);
  const raw = areas.map(a => remaining * a / total);
  const counts = raw.map(a => base + Math.floor(a));
  const order = raw.map((v,i) => ({i,r:v-Math.floor(v)})).sort((a,b)=>b.r-a.r);
  const left = budget - counts.reduce((a,b)=>a+b,0);
  for(let i=0;i<left;i++) counts[order[i].i]++;
  return counts;
}
