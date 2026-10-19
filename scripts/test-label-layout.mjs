import assert from 'node:assert/strict';
import { layoutLabels,intersects,overviewLabels } from '../public/wonder/src/lib/label-layout.js';
import { availableInspectionViews,inspectionVisible } from '../public/wonder/src/models/inspection.js';
import { correctSystem } from '../public/wonder/src/models/system-corrections.js';
import { readFileSync } from 'node:fs';
const bounds={x:300,y:80,w:650,h:600},obstacles=[{x:700,y:300,w:200,h:150}];
const items=Array.from({length:12},(_,li)=>({li,px:650,py:300,w:190,h:26}));
const placed=layoutLabels(items,bounds,obstacles,7);
assert.ok(placed.length>=6,'dense identical anchors retain multiple useful tags');
assert.equal(placed[0].li,0,'selected priority is retained');
for(const a of placed){assert.ok(a.x>=bounds.x&&a.x+a.w<=bounds.x+bounds.w&&a.y>=bounds.y&&a.y+a.h<=bounds.y+bounds.h);assert.ok(obstacles.every(b=>!intersects(a,b,7)));for(const b of placed)if(a!==b)assert.ok(!intersects(a,b,7),'labels never intersect');}
assert.deepEqual(layoutLabels(items,{x:0,y:0,w:50,h:20}),[],'hide labels when space is insufficient rather than overlap');
const anchors=Array.from({length:20},(_,li)=>({li,px:li,py:li,L:{system:li<10?'skeletal':'nervous',label:'part '+li}}));
const grouped=overviewLabels(anchors,3);assert.equal(grouped.length,2);assert.equal(grouped[0].L.label,'part 3');assert.equal(grouped[1].L.label,'Hệ thần kinh · 10');assert.equal(anchors[0].L.label,'part 0','summary does not mutate precise picking anchors');
console.log('PASS dense explosion labels, obstacles/bounds, insufficient space and exact selected labels');
const views=availableInspectionViews([{system:'skeletal'},{system:'endocrine'}]);
assert.equal(views.filter(v=>v.systems?.length===1&&v.systems[0]==='skeletal').length,1,'no duplicate system choices');
assert.ok(views.some(v=>v.id==='system:endocrine'));
assert.equal(inspectionVisible({system:'skeletal'},'system:endocrine'),false);
assert.equal(inspectionVisible({system:'endocrine'},'system:endocrine'),true);
assert.ok(!views.some(v=>v.id==='system:cardiac'),'unavailable systems are not offered');
for(const region of ['head','brain']){
 const manifest=JSON.parse(readFileSync(new URL('../public/wonder/assets/regions/'+region+'.json',import.meta.url)));
 const corrected=manifest.groups.map(g=>correctSystem(g,manifest.parts));
 assert.equal(corrected.filter(g=>g.system==='cardiac').length,0);
 assert.equal(corrected.length,manifest.groups.length);
 corrected.forEach((g,i)=>{assert.equal(g.count,manifest.groups[i].count);assert.equal(g.color,manifest.groups[i].color);});
}
const heart={id:'cardiac',system:'cardiac',label:'Tim'};
assert.equal(correctSystem(heart,[{id:'FJ1730',system:'cardiac'},{id:'real-heart',system:'cardiac'}]),heart,'mixed heart groups must remain unchanged');
