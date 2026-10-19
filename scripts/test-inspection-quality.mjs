import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { sectionCaps } from './lib/region-caps.mjs';
import { inspectionVisible, availableInspectionViews } from '../public/wonder/src/models/inspection.js';
const square=(a,b)=>[[a,0,a],[b,0,a],[b,0,b],[a,0,b]];
const edges=loop=>loop.map((p,i)=>[p,loop[(i+1)%loop.length]]);
const cap=sectionCaps([...edges(square(-2,2)),...edges(square(-1,1))],1,0,-1);
let area=0;
for(let i=0;i<cap.positions.length;i+=9){const p=cap.positions.slice(i,i+9);const ux=p[3]-p[0],uz=p[5]-p[2],vx=p[6]-p[0],vz=p[8]-p[2];const cross=uz*vx-ux*vz;assert.ok(cross<0,'cap faces outward');area+=Math.abs(cross)/2;}
assert.equal(area,12,'cap preserves inner holes instead of filling vessels solid');
assert.equal(cap.unresolved,0);
assert.equal(sectionCaps([[[0,0,0],[1,0,0]]],1,0,-1).positions.length,0,'open source contour never invented');
assert.equal(inspectionVisible({system:'arterial'},'skeletal'),false);
assert.equal(inspectionVisible({system:'skeletal'},'skeletal'),true);
assert.equal(availableInspectionViews([{system:'skeletal'}]).some(v=>v.id==='nerves'),false,'missing systems not offered');
for(const id of ['hand','wrist']){
 const meta=JSON.parse(await fs.readFile(`public/wonder/assets/regions/${id}.json`));
 const phalanges=meta.parts.filter(p=>/phalanx/.test(p.name));
 const carpals=meta.parts.filter(p=>/^Left (capitate|hamate|lunate|pisiform|scaphoid|trapezium|trapezoid|triquetral)$/.test(p.name));
 assert.equal(phalanges.length,14);assert.equal(carpals.length,8);
 assert.ok([...phalanges,...carpals].every(p=>p.complete&&p.triangles===p.sourceTriangles),'small bones preserve original triangles');
 assert.ok(meta.parts.every(p=>! /\bright\b/i.test(p.name)),'left-hand model contains no right-sided structure');
 assert.ok(meta.groups.length>90,'structures remain individually inspectable');
 assert.equal(meta.quality.unresolvedCuts,0);assert.ok(meta.quality.capLoops>0);
 assert.equal(meta.quality.texture,false);
 for(const group of meta.groups){assert.ok(group.capCount<=group.count);assert.equal(group.capCount%9,0);}
 console.log('PASS',id,meta.parts.length,'structures, intact small bones, closed crop contours');
}
console.log('PASS cap orientation/holes, source integrity and inspection filters');
