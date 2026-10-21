import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { sourceGroups,sourceDisplayName } from '../public/wonder/src/models/source-groups.js';
import { InspectionTransition } from '../public/wonder/src/logic/inspection-transition.js';

assert.equal(sourceDisplayName({id:'FJ1846',label:'Celiac artery'},{FJ1846:'Cấu trúc thuộc Động mạch chủ bụng và thân tạng · FJ1846'}),'Celiac artery');
assert.equal(sourceDisplayName({id:'FJ1833',label:'Left superior frontal gyrus'},{FJ1833:'Hồi trán trên (trái)'}),'Hồi trán trên (trái)');

for (const id of ['body','bust','thorax','skeleton','muscles','upper-limb']) {
  const manifest=JSON.parse(await fs.readFile(`public/wonder/assets/regions/${id}.json`,'utf8'));
  const {groups}=sourceGroups(manifest);
  assert.equal(groups.length,manifest.parts.length,id+' retains every real source structure');
  const ranges=groups.flatMap(g=>g.ranges).sort((a,b)=>a.start-b.start);
  let end=0;
  for(const range of ranges){assert.equal(range.start,end,'no overlapping or missing geometry');end+=range.count;}
  assert.equal(end,manifest.groups.reduce((sum,g)=>sum+g.count,0));
  for(const g of groups)assert.ok(manifest.parts.some(p=>p.id===g.id));
  if(id==='thorax')assert.ok(groups.filter(g=>g.system==='arterial').length>100,'arteries are individual source structures');
  if(id==='upper-limb'){
    for(const name of ['Left clavicle','Left scapula','Left humerus','Left radius','Left ulna'])assert.ok(manifest.parts.some(p=>p.name===name&&p.complete),name+' is complete');
    assert.equal(manifest.parts.filter(p=>/phalanx/.test(p.name)).length,14);
    assert.ok(manifest.parts.every(p=>!/(iliotibial|fasciae latae)/i.test(p.name)));
  }
  console.log('PASS',id,groups.length,'selectable source structures');
}
const transition=new InspectionTransition();let committed=0;
transition.begin(()=>committed++,0);
assert.equal(transition.blend(0),1);
assert.ok(transition.blend(.2)>0&&transition.blend(.2)<1);
transition.tick(.39);assert.equal(committed,0);
transition.tick(.4);assert.equal(committed,1);assert.equal(transition.blend(.4),0);
transition.tick(.7);assert.equal(committed,1);assert.ok(transition.blend(.7)>0);
transition.tick(1.3);assert.equal(transition.pending,null);assert.equal(transition.blend(1.3),1);
transition.begin(()=>committed++,2);transition.begin(()=>committed+=10,2.2);
transition.tick(2.7);assert.equal(committed,11,'only the latest request commits');
transition.cancel();assert.equal(transition.pending,null);
console.log('PASS internal hologram dissolve/commit/reassemble and cancellation');
