// Read-only CPU audit. Run from any directory: node research/wondersnap/audit.mjs
import fs from 'node:fs';
import crypto from 'node:crypto';
import { CATALOG, buildModel } from '../../../public/wonder/src/models/catalog.js';
const local = new URL('../../../public/wonder/', import.meta.url);
const upstream = new URL('../../../../../wondersnap/', import.meta.url);
const hash = u => crypto.createHash('sha256').update(fs.readFileSync(u)).digest('hex');
const comparisons = ['src/models/body.js', 'src/lib/sampling.js', 'src/lib/shapes.js', 'src/gl/renderer.js', 'src/gl/shaders.js'].map(file => ({file, local:hash(new URL(file,local)), upstream:hash(new URL(file,upstream))}));
const models = ['Human Body','Cánh tay'].map(name => {
  const index = CATALOG.findIndex(d => d.name === name);
  if (index < 0) throw new Error(`Missing ${name}`);
  const m = buildModel(index, 200000, 42);
  const lo = [Infinity,Infinity,Infinity], hi = [-Infinity,-Infinity,-Infinity];
  for(let j=0;j<m.target.length;j++) {
    if(!Number.isFinite(m.target[j])) throw new Error('Non-finite target');
    const k=j%3; lo[k]=Math.min(lo[k],m.target[j]); hi[k]=Math.max(hi[k],m.target[j]);
  }
  return {name,index,n:m.n,extent:hi.map((v,k)=>v-lo[k]),fitScale:m.fitScale,groups:m.labels.map(l=>{
    const t=Math.min(1,Math.max(0,(.32-l.stage)/(1-l.stage)));
    return {label:l.label,count:l.count,stage:l.stage,offsetFractionAt32:t*t*(3-2*t)};
  })};
});
console.log(JSON.stringify({date:'2026-10-06',scope:'CPU only; no GPU screenshot validation',comparisons,models},null,2));
