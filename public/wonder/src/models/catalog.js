// Everything that can be summoned, in display order, plus the builder that turns a model into GPU buffers:
//   target (xyz, normalized into the unit globe), offset (xyz explode vector + w stage), tint (rgb per particle).
import { GESTURE_MODELS } from './gesture-regions.js';
import { makeRng } from '../lib/rng.js';
import { build, flatten, allocate, shuffleIndex, normalize } from '../lib/sampling.js';

export const CATALOG = [
  // One shared anatomy-only catalog for UI, gestures, voice, prefetch and worker.
  ...GESTURE_MODELS.map((a) => ({ ...a, kind: 'machine', category: 'Anatomy' })),
];

// Alias tiếng Việt -> tên model (voice + tìm kiếm)
export const VN_ALIAS = {
  nao: 'Human Brain', não: 'Human Brain', tim: 'Human Heart', phổi: 'Lungs', phoi: 'Lungs',
  than: 'Kidney', thận: 'Kidney', mat: 'Human Eye', mắt: 'Human Eye', tai: 'Human Ear',
  rang: 'Tooth (Molar)', răng: 'Tooth (Molar)', so: 'Skull', sọ: 'Skull',
  xuong: 'Skeleton', xương: 'Skeleton', cothe: 'Human Body', 'cơ thể': 'Human Body',
  gan: 'Gan & Túi mật', daday: 'Dạ dày', 'dạ dày': 'Dạ dày', ruot: 'Ruột non & Đại tràng',
  ruôt: 'Ruột non & Đại tràng', tuy: 'Tụy & Lá lách', co: 'Hệ cơ', cơ: 'Hệ cơ', canhtay: 'Cánh tay', 'cánh tay': 'Cánh tay',
  'cẳng tay':'Cẳng tay', 'cổ tay':'Cổ tay', 'bàn tay':'Bàn tay chi tiết', 'ngón tay':'Các ngón tay',
  'ngón cái':'Ngón cái', 'ngón trỏ':'Ngón trỏ', 'ngón giữa':'Ngón giữa', 'ngón áp út':'Ngón áp út', 'ngón út':'Ngón út', 'chi trên':'Toàn bộ chi trên',
};

export const isMachine = (i) => CATALOG[i]?.kind === 'machine';

export async function buildModelAsync(index,n,seed=0) {
  await CATALOG[index]?.load?.();
  try { return buildModel(index,n,seed); }
  finally { CATALOG[index]?.release?.(); }
}

const FIT_RADIUS = 1.18;   // the fully exploded view is scaled to fit this radius (globe = 1.0)

/** Build model `index` with exactly n particles. Deterministic for a given (index, n, seed). */
export function buildModel(index, n, seed = 0) {
  const def = CATALOG[index];
  const rng = makeRng(seed + index * 7919 + 1);
  const t0 = performance.now();
  const offset = new Float32Array(n * 4);
  const tint = new Float32Array(n * 3);

  if (def.kind === 'wonder') {
    const target = build(def.build(), n, rng);
    normalize(target);
    for (let i = 0; i < n; i++) tint.set(def.color, i * 3);
    return { index, def, n, target, offset, tint, pick: new Float32Array(n).fill(-1), labels: [], groups: [], fitScale: 1, exCenter: [0, 0, 0], ms: performance.now() - t0 };
  }

  const groups = def.groups();
  const prims = [], owner = [];
  groups.forEach((g, gi) => { for (const p of flatten(g.parts)) { prims.push(p); owner.push(gi); } });
  const counts = allocate(prims.map((p) => p.weight), n);
  const tmp = new Float64Array(n * 3), gidx = new Uint16Array(n);
  let off = 0;
  prims.forEach((p, i) => { p.sample(counts[i], rng, tmp, off); gidx.fill(owner[i], off, off + counts[i]); off += counts[i]; });

  const perm = shuffleIndex(n, rng);
  const target = new Float32Array(n * 3), group = new Uint16Array(n);
  for (let i = 0; i < n; i++) {
    const s = perm[i];
    target[i * 3] = tmp[s * 3]; target[i * 3 + 1] = tmp[s * 3 + 1]; target[i * 3 + 2] = tmp[s * 3 + 2];
    group[i] = gidx[s];
  }
  const { scale, center } = normalize(target);

  // per-particle explode offset + stage + colour; per-group centroid (for the part labels)
  const gs = groups.map(() => ({ sum: [0, 0, 0], count: 0 }));
  const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < n; i++) {
    const g = groups[group[i]], o = i * 4, j = i * 3;
    offset[o] = g.offset[0] * scale; offset[o + 1] = g.offset[1] * scale; offset[o + 2] = g.offset[2] * scale; offset[o + 3] = g.stage;
    tint[j] = g.color[0]; tint[j + 1] = g.color[1]; tint[j + 2] = g.color[2];
    const st = gs[group[i]];
    for (let k = 0; k < 3; k++) {
      st.sum[k] += target[j + k];
      const e = target[j + k] + offset[o + k];
      if (e < lo[k]) lo[k] = e;
      if (e > hi[k]) hi[k] = e;
    }
    st.count++;
  }
  // fully exploded cloud: recentre on its bounding box and shrink it to fit the view
  const exCenter = [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2];
  let r2 = 0;
  for (let i = 0; i < n; i++) {
    const j = i * 3, o = i * 4;
    const x = target[j] + offset[o] - exCenter[0], y = target[j + 1] + offset[o + 1] - exCenter[1], z = target[j + 2] + offset[o + 2] - exCenter[2];
    r2 = Math.max(r2, x * x + y * y + z * z);
  }
  const fitScale = Math.min(1, FIT_RADIUS / Math.sqrt(r2));
  const surface=def.surface?.();
  const labels = [], labelOf = new Array(groups.length).fill(-1);
  groups.forEach((g, gi) => {
    if (g.showLabel === false || (!surface && gs[gi].count === 0)) return;
    const c = gs[gi].count;
    let centroid=c?gs[gi].sum.map(v=>v/c):[0,0,0];
    if(!c&&surface){const ranges=surface.groups.filter(sg=>(sg.groupIndex??surface.groups.indexOf(sg))===gi),count=ranges.reduce((sum,sg)=>sum+sg.count,0);for(const sg of ranges)for(let p=sg.start*3;p<(sg.start+sg.count)*3;p++)centroid[p%3]+=(surface.positions[p]-center[p%3])*scale/count;}
    labelOf[gi] = labels.length;
    labels.push({ label: g.label, info: g.sourceName || g.info || '', sourceName:g.sourceName||'', sourceId:g.sourceId || g.id, system:g.system, latin:g.latin||'', description:g.description||'', descriptionEn:g.descriptionEn||'', reference:g.reference||'', learningNotes:g.learningNotes||[], color: g.color, count: c, stage: g.stage,
      centroid, offset: g.offset.map((v) => v * scale) });
  });
  // unlabelled mirror halves ("Frontal lobe (L)", "Door (L)" ...) are picked/highlighted together with their labelled twin
  groups.forEach((g, gi) => { if (labelOf[gi] < 0) labelOf[gi] = twinLabel(g, labels); });
  const pick = new Float32Array(n);
  for (let i = 0; i < n; i++) pick[i] = labelOf[group[i]];
  if(surface){
    for(let i=0;i<surface.positions.length;i++)surface.positions[i]=(surface.positions[i]-center[i%3])*scale;
    [...surface.groups,...(surface.overviewGroups||[])].forEach((g,i)=>{
      g.offset=g.offset.map(v=>v*scale);g.pick=g.groupIndex===-1?-1:labelOf[g.groupIndex??i];
      const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
      for(let p=g.start*3;p<(g.start+g.count)*3;p+=3)for(let k=0;k<3;k++){lo[k]=Math.min(lo[k],surface.positions[p+k]);hi[k]=Math.max(hi[k],surface.positions[p+k]);}
      g.center=lo.map((v,k)=>(v+hi[k])/2);g.radius=Math.hypot(...hi.map((v,k)=>(v-lo[k])/2));
      g.bounds=[lo,hi];
      const label=labels[g.pick];
      if(label){let best=label.anchorDistance??Infinity,anchor=label.surfaceAnchor;for(let p=g.start*3;p<(g.start+g.count)*3;p+=3){const distance=[0,1,2].reduce((sum,k)=>sum+(surface.positions[p+k]-label.centroid[k])**2,0);if(distance<best){best=distance;anchor=Array.from(surface.positions.subarray(p,p+3));}}label.surfaceAnchor=anchor;label.anchorDistance=best;}
    });
  }
  return { index, def, n, target, offset, tint, pick, labels, groups: groups.map((g) => g.label), group, fitScale, exCenter, surface, ms: performance.now() - t0 };
}

const SUFFIX = / \((L|R|back|lower|upper|left|right)\)$/i;
/** Index of the labelled group a hidden group belongs to: same base name, else same colour and first 4 letters. */
export function twinLabel(g, labels) {
  const base = g.label.replace(SUFFIX, '');
  let i = labels.findIndex((l) => l.label === base);
  if (i < 0) i = labels.findIndex((l) => l.color.every((c, k) => c === g.color[k]) && l.label.slice(0, 4).toLowerCase() === base.slice(0, 4).toLowerCase());
  return i;
}
