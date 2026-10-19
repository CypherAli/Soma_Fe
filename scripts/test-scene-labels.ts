import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createSceneLabels } from '../src/lib/humanAtlas/sceneLabels';
import { atlasScenes } from '../src/lib/humanAtlas/scenes';
import { localizedPartName } from '../src/lib/humanAtlas/partNames';

const atlas=JSON.parse(fs.readFileSync('public/human-atlas/atlas.json','utf8'));
let groups=0;
for(const scene of Object.values(atlasScenes)) {
  const exploded=createSceneLabels(scene,atlas.parts,'vi',{isolate:false,selected:[],explode:1});
  const ids=new Set(scene.groups.flatMap(group=>group.parts));
  const tagged=new Set(exploded.filter(label=>!label.anchor).flatMap(label=>label.ids));
  assert.deepEqual(tagged,ids,`Every exploded mesh needs a tag in ${scene.slug}`);
  assert.equal(new Set(exploded.map(label=>label.key)).size,exploded.length,'Keys must be unique');
  for(const group of scene.groups) {
    const labels=createSceneLabels(scene,atlas.parts,'vi',{isolate:true,selected:group.parts,explode:0});
    assert(labels.length>0);
    assert(labels.every(label=>label.ids.every(id=>group.parts.includes(id))),`Isolation leaked unrelated labels in ${scene.slug}/${group.key}`);
    groups++;
  }
}
const skull=atlasScenes['giai-phau-so'];
const frontal=skull.groups.find(group=>group.key==='xuong-tran')!;
const frontalPart=atlas.parts.find((part:{id:string})=>part.id===frontal.parts[0]);
assert.equal(createSceneLabels(skull,atlas.parts,'vi',{isolate:true,selected:frontal.parts,explode:0})[0].text,'Xương trán');
assert.equal(localizedPartName(frontalPart,'vi'),'Xương trán');
assert.equal(localizedPartName(frontalPart,'en'),frontalPart.name);
assert.equal(localizedPartName({id:'untranslated',name:'Unknown English structure'},'vi'),'Cấu trúc · untranslated');
const both=createSceneLabels(skull,atlas.parts,'vi',{isolate:true,selected:['FJ3274','FJ3380'],explode:0});
assert.equal(both.filter(label=>label.anchor).length,1,'The assembled suture should have one tag');
const separate=createSceneLabels(skull,atlas.parts,'vi',{isolate:true,selected:['FJ3274','FJ3380'],explode:1});
assert.equal(separate.filter(label=>label.anchor).length,2,'Each separated sutural edge needs its own attached tag');
const right=createSceneLabels(skull,atlas.parts,'vi',{isolate:true,selected:['FJ3380'],explode:0});
assert(right.every(label=>label.ids.length===1&&label.ids[0]==='FJ3380'));
for(const label of separate.filter(label=>label.anchor)) {
  const part=atlas.parts.find((p:{id:string})=>p.id===label.ids[0]);
  const file=atlas.chunks[part.chunk].url.split('/').pop();
  const buffer=fs.readFileSync(`public/human-atlas/${file}`);
  let distance=Infinity;
  for(let i=0;i<part.vertexCount;i++)distance=Math.min(distance,Math.hypot(...label.anchor!.map((value,axis)=>value-buffer.readFloatLE(part.positions+(i*3+axis)*4))));
  assert(distance<1e-7,'Suture tag must use an actual vertex of its owning bone');
}
console.log(`Passed tag coverage for ${Object.keys(atlasScenes).length} pages and isolation for ${groups} groups; sagittal anchors match real mesh vertices.`);
