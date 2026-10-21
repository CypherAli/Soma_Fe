import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {CATALOG,buildModelAsync} from '../public/wonder/src/models/catalog.js';
import {setMuscleSeparation} from '../public/wonder/src/models/muscle-separation.js';
globalThis.fetch=async url=>new Response(await fs.readFile(new URL(url)));
const model=await buildModelAsync(CATALOG.findIndex(d=>d.name==='Cẳng tay'),60000);
const offsets=model.surface.groups.map(g=>[...g.offset]),center=[...model.exCenter],fit=model.fitScale;
setMuscleSeparation(model,true);
const muscles=model.surface.groups.filter(g=>g.system==='muscular');
assert.ok(muscles.length>10);
assert.equal(new Set(muscles.map(g=>g.offset.join(','))).size,muscles.length);
for(const g of muscles)assert.deepEqual(model.labels[g.pick].offset,g.offset);
assert.ok(Number.isFinite(model.fitScale)&&model.fitScale>0);
setMuscleSeparation(model,false);
assert.deepEqual(model.surface.groups.map(g=>g.offset),offsets);
assert.deepEqual(model.exCenter,center);assert.equal(model.fitScale,fit);
console.log('PASS individual muscle separation, label transforms and reversible system layout');

const torso=await buildModelAsync(CATALOG.findIndex(d=>d.id==='thorax'),5000);
const originalRanges=torso.surface.groups.map(g=>[...g.offset]);
setMuscleSeparation(torso,true);
const byPick=new Map();
for(const group of torso.surface.groups.filter(g=>g.system==='muscular')){
  if(byPick.has(group.pick))assert.deepEqual(group.offset,byPick.get(group.pick),'main and cut-face ranges move together');
  byPick.set(group.pick,group.offset);
}
assert.ok(byPick.size>50);
assert.equal(new Set([...byPick.values()].map(offset=>offset.join(','))).size,byPick.size);
assert.deepEqual(torso.surface.individualSystems,['muscular']);
setMuscleSeparation(torso,false);
assert.deepEqual(torso.surface.groups.map(g=>g.offset),originalRanges);
assert.deepEqual(torso.surface.individualSystems,[]);
console.log('PASS detailed torso muscles keep their cut faces and restore overview batching');
