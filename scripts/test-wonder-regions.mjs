import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { trianglePart } from '../public/wonder/src/models/gesture-regions.js';
import { makeRng } from '../public/wonder/src/lib/rng.js';
import { CATALOG,buildModelAsync } from '../public/wonder/src/models/catalog.js';
import { SYSTEMS } from '../src/lib/humanAtlas/anatomy.ts';
import { WonderState, FORMED } from '../public/wonder/src/logic/state.js';
import { THUMB } from '../public/wonder/src/logic/gestures.js';
import { ATLAS_PRESETS } from '../public/wonder/src/models/atlas-presets.js';
assert.equal(CATALOG.length,ATLAS_PRESETS.length);
for(const id of ['arm','upper-limb','forearm','wrist','hand','fingers','thumb','index-finger','middle-finger','ring-finger','little-finger'])assert.ok(ATLAS_PRESETS.some(p=>p.id===id));
assert.ok(CATALOG.every(d=>d.category==='Anatomy'));
const navigation=new WonderState(CATALOG.length,()=>true,CATALOG.length-1);
navigation.go(FORMED,0);
navigation.update(THUMB,true,false,1);
assert.equal(CATALOG[navigation.index].name,'Human Brain','thumb wraps from bust to brain');
navigation.advance(-1);
assert.equal(CATALOG[navigation.index].name,'Đầu · cổ · thân trên');
console.log('PASS anatomy-only navigation and gesture wraparound');
const part=trianglePart(new Float32Array([0,0,0,1,0,0,0,1,0,10,0,0,12,0,0,10,2,0]));
const points=new Float64Array(60000);part.sample(20000,makeRng(123),points,0);
let large=0;
for(let i=0;i<20000;i++){assert.equal(points[i*3+2],0);if(points[i*3]>9)large++;}
assert.ok(large>15500&&large<16500,'allocation proportional to triangle area');
globalThis.fetch=async url=>new Response(await fs.readFile(new URL(url)));
const atlas=JSON.parse(await fs.readFile('public/human-atlas/atlas.json','utf8'));
const ids=new Set(atlas.parts.map(p=>p.id));
for(const {id,name,sourceLabel} of ATLAS_PRESETS){
  const meta=JSON.parse(await fs.readFile(`public/wonder/assets/regions/${id}.json`,'utf8'));
  if(id==='hand'){
    assert.equal(meta.parts.filter(p=>/phalanx.*finger|phalanx.*thumb/.test(p.name)).length,14,'complete five-finger skeleton');
    assert.ok(['skeletal','muscular','arterial','venous'].every(system=>meta.parts.some(p=>p.system===system)));
  }
  if(id==='wrist')assert.equal(meta.parts.filter(p=>/^Left (capitate|hamate|lunate|pisiform|scaphoid|trapezium|trapezoid|triquetral)$/.test(p.name)).length,8,'all eight carpal bones');
  if(['thumb','index-finger','middle-finger','ring-finger','little-finger'].includes(id))assert.equal(meta.parts.filter(p=>/phalanx/.test(p.name)).length,id==='thumb'?2:3,'correct number of finger phalanges');
  assert.equal(meta.source,sourceLabel?'/models/'+sourceLabel:'/human-atlas/atlas.json');assert.ok(meta.parts.every(p=>sourceLabel||ids.has(p.id)));
  assert.ok(meta.groups.every(g=>g.color===SYSTEMS.find(s=>s.id===g.system)?.color));
  const i=CATALOG.findIndex(d=>d.name===name);assert.ok(i>=0);
  const m=await buildModelAsync(i,200000);
  if(['head','neck','hand','wrist','arm','forearm','upper-limb'].includes(id))assert.equal(m.labels.length,meta.groups.length,'all source meshes remain selectable, including zero-particle structures');
  assert.equal(m.target.length,600000);assert.ok(m.labels.length>=1);
  assert.ok(m.target.every(Number.isFinite));assert.ok(m.offset.every(Number.isFinite));
  assert.ok(m.labels.every(g=>g.stage===0));
  assert.ok(m.surface?.positions.length>0,'solid triangle geometry is retained');
  assert.ok(m.surface.positions.every(Number.isFinite));
  assert.equal(m.surface.normals.length,m.surface.positions.length);assert.ok(m.surface.normals.every(Number.isFinite));
  assert.ok(m.surface.groups.every(g=>Number.isInteger(g.start)&&g.count%3===0&&g.start+g.count<=m.surface.positions.length/3));
  for(const group of m.surface.groups){const anchor=m.labels[group.pick]?.surfaceAnchor;if(!anchor)continue;let found=false;for(let p=group.start*3;p<(group.start+group.count)*3;p+=3){if(anchor.every((v,k)=>v===m.surface.positions[p+k])){found=true;break;}}assert.ok(found,'label anchor belongs to its exact source mesh');}
  let boxes=m.surface.groups.filter(g=>!g.cover).map(g=>{
    const lo=[Infinity,Infinity],hi=[-Infinity,-Infinity];
    for(let j=g.start*3;j<(g.start+g.count)*3;j+=3)for(let k=0;k<2;k++){const v=m.surface.positions[j+k]+g.offset[k];lo[k]=Math.min(lo[k],v);hi[k]=Math.max(hi[k],v);}
    return {lo,hi,system:g.system};
  });
  if(['hand','wrist','fingers','head','neck','arm','forearm','upper-limb'].includes(id)){
    // Structures of a system stay together; compare the UNION of each system.
    boxes=[...new Set(boxes.map(b=>b.system))].map(system=>{const members=boxes.filter(b=>b.system===system);return {lo:[0,1].map(k=>Math.min(...members.map(b=>b.lo[k]))),hi:[0,1].map(k=>Math.max(...members.map(b=>b.hi[k])))};});
  }
  for(let a=0;a<boxes.length;a++)for(let b=a+1;b<boxes.length;b++)assert.ok([0,1].some(k=>boxes[a].hi[k]<=boxes[b].lo[k]||boxes[b].hi[k]<=boxes[a].lo[k]),'separated systems must not overlap in front view');
  console.log('PASS',name,m.labels.length,'layers',Math.round(m.ms),'ms');
}
console.log('PASS surface area sampling, exact particle budget, local assets, finite transforms');
