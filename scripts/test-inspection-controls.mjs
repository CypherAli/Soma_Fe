import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as T from '../public/wonder/vendor/three.module.js';
import { AtlasSurface } from '../public/wonder/src/gl/atlas-surface.js';
import { HandYaw, PartSeparation, inspectionLabelsVisible, selectionFor, singleVisibleGroup, selectedPull, remapSelection,fitPullDistance,pullEnvelope,partLayout,partTransform,particlePartOffsets,partPageVisible } from '../public/wonder/src/logic/inspection-controls.js';
import { buildModelAsync,CATALOG } from '../public/wonder/src/models/catalog.js';
import { overviewLabels } from '../public/wonder/src/lib/label-layout.js';
import { rotY, matVec } from '../public/wonder/src/lib/vec.js';

const close=(a,b,tolerance=1e-7)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`);
for(const fps of [30,60,120]){
  const yaw=new HandYaw();let angle=0;
  yaw.update(angle,3.1,true,1/fps);
  for(let i=0;i<fps;i++)angle=yaw.update(angle,3.5,true,1/fps);
  close(angle,2.2*.4,.001);
  yaw.update(angle,-2,false,1/fps);
  close(yaw.update(angle,-2,true,1/fps),angle); // hand reacquisition must not jump
  const upright=matVec(rotY(angle),[0,1,0]);assert.deepEqual(upright,[0,1,0]);
}
const held=new HandYaw();held.update(0,0,true,1/60);
held.update(.2,.2,false,.09,true);assert.ok(held.anchor,'One missing 11 Hz sample retains the wrist grab');
assert.ok(held.update(.2,.2,true,1/60)>.2,'Rotation continues from its old grab after brief noise');
held.update(.2,1,false,.2,true);assert.equal(held.anchor,null,'Long interruption releases the grab');
close(held.update(.2,1,true,1/60),.2);
const labelState={enabled:true,explode:.9,explodeTarget:.9,partAmount:.8,partTarget:.8,handActive:true,openness:.9,pointing:false};
assert.equal(inspectionLabelsVisible(labelState),true,'Separated structures retain tags');
assert.equal(inspectionLabelsVisible({...labelState,openness:.1}),false,'Closing hand hides even selected tags');
assert.equal(inspectionLabelsVisible({...labelState,openness:.45}),false,'Partly curled fingers already clear the tags');
assert.equal(inspectionLabelsVisible({...labelState,partTarget:0}),false,'Tags disappear before local reassembly finishes');
assert.equal(inspectionLabelsVisible({...labelState,explodeTarget:0}),false,'Global reassembly also hides tags');
assert.equal(inspectionLabelsVisible({...labelState,explode:0,explodeTarget:0,partAmount:0,partTarget:0,handActive:false}),false,'Assembled model is clear');
assert.equal(inspectionLabelsVisible({...labelState,enabled:false,pointing:true}),false,'Label toggle applies to selection too');
console.log('PASS WonderSnap yaw-only rotation, angle seam, frame-rate independence, transient grab retention and reassembly tag visibility');

const part=new PartSeparation();part.select();
part.update(.9,true,0,.016);
for(let i=1;i<20;i++)part.update(.9,true,i/10,.016);
close(part.target,0); // pointing -> open must not yank a fresh selection out
part.update(.08,true,2,.016);
part.update(.5,true,2.1,.016);assert.ok(part.target>.4&&part.target<.7);
part.update(.95,true,2.2,.016);close(part.target,1);
for(let i=0;i<60;i++)part.update(.95,true,2.2,.016);
assert.ok(part.amount>.99);
part.update(.08,true,3,.016);close(part.target,0);
part.set(.7);part.update(.95,false,4,.016);close(part.target,.7);
part.update(.95,true,5,.016);close(part.target,.7); // reacquisition keeps slider/button value
part.select();close(part.amount,0);close(part.target,0);
console.log('PASS local open/close cycle, continuous amount, no initial jump, manual ownership and switching selection');

const manifest=JSON.parse(fs.readFileSync(new URL('../public/wonder/assets/regions/head.json',import.meta.url)));
const labels=manifest.groups.map(g=>({...g,sourceName:g.sourceName||g.info||g.label}));
const pick=labels.findIndex(l=>l.id==='FJ3200');assert.ok(pick>=0);
const selection=selectionFor(labels,pick,'group');
assert.ok(selection.skull&&selection.ids.size>15);
for(const id of ['FJ3199','FJ3269','FJ3289','FJ3309','FJ3375'])assert.ok(selection.ids.has(labels.findIndex(l=>l.id===id)),id+' is part of the skull block');
for(const id of ['FJ3176','FJ3177','FJ3201','FJ2808'])assert.ok(!selection.ids.has(labels.findIndex(l=>l.id===id)),id+' must stay outside the skull selection');
const exact=selectionFor(labels,pick,'part');assert.equal(exact.ids.size,1);
const particles=Float32Array.from(labels,(_,i)=>i),mapped=remapSelection(particles,selection.ids,pick);
for(let i=0;i<labels.length;i++)assert.equal(mapped[i],selection.ids.has(i)?pick:i);
assert.equal(particles[pick+1],pick+1,'source picking IDs are immutable');
const tags=overviewLabels(labels.map((L,li)=>({L,li,px:li,py:li})),pick,selection);
assert.equal(tags[0].key,'skull');assert.equal(tags[0].scope,'group');
console.log('PASS actual source skull membership, precise part selection, semantic group tags and particle selection mask');
const forearmLabels=JSON.parse(fs.readFileSync(new URL('../public/wonder/assets/regions/forearm.json',import.meta.url))).groups;
const visibleBones=new Set(forearmLabels.flatMap((label,index)=>label.system==='skeletal'?[index]:[]));
const visibleBlock=singleVisibleGroup(forearmLabels,visibleBones);
assert.equal(visibleBlock.count,3);
assert.equal(visibleBlock.key,'system:skeletal');
assert.deepEqual(selectionFor(forearmLabels,visibleBlock.pick,'group',visibleBones).ids,visibleBones);
assert.equal(singleVisibleGroup(forearmLabels,new Set(forearmLabels.map((_,i)=>i))),null,'A mixed view retains system separation');
assert.equal(singleVisibleGroup(forearmLabels,new Set([visibleBlock.pick])),null,'A single structure cannot be split into invented geometry');
console.log('PASS real forearm single-block routing, three source structures, mixed-view and single-structure guards');

// Exercise the real solid draw transform, with a no-op renderer instead of a GPU.
const surface=Object.create(AtlasSurface.prototype);
surface.renderer={resetState(){},setViewport(){},clearDepth(){},render(){}};
surface.camera=new T.PerspectiveCamera();surface.camera.matrixAutoUpdate=false;
surface.root=new T.Group();surface.meshes=[];
surface.surface={individualSystems:[]};
for(const index of [pick,labels.findIndex(l=>l.id==='FJ3375'),labels.findIndex(l=>l.id==='FJ3176')]){
  const mesh=new T.Mesh(new T.BoxGeometry(.1,.1,.1),new T.MeshStandardMaterial());
  mesh.userData={g:{pick:index,system:'skeletal',offset:[.3,.2,0]},uniforms:{reveal:{},cutOn:{},cut:{}}};
  surface.root.add(mesh);surface.meshes.push(mesh);
}
const d={width:800,height:600,projection:new T.Matrix4().elements,view:new T.Matrix4().elements,rot:rotY(0),explode:.99,scale:.4,exCenter:[.2,.1,0],sel:pick,selectedPicks:selection.ids,systemFocus:-1,inspectionView:'all',solidBlend:1,pull:[0,0,0]};
for(const angle of [0,.5,Math.PI,-Math.PI/2]){
  d.rot=rotY(angle);surface.draw({...d,pull:[0,0,0]});
  const initial=surface.meshes.map(m=>m.getWorldPosition(new T.Vector3()).clone());
  surface.draw({...d,pull:[0,0,.5]});
  for(let i=0;i<surface.meshes.length;i++){
    const index=surface.meshes[i].userData.g.pick,actual=surface.meshes[i].getWorldPosition(new T.Vector3()),pull=selectedPull(index,selection,1);
    close(actual.x,initial[i].x);close(actual.y,initial[i].y);close(actual.z,initial[i].z+pull[2]);
  }
}
console.log('PASS real mesh transforms: selected skull moves, neck stays fixed, anchors agree at front/back/side yaw');
assert.equal(fitPullDistance([[0,.1,0]],3.4,640),.5);
const nearTop=[[0,1.1,0]],safe=fitPullDistance(nearTop,3.4,640);
assert.ok(safe>=0&&safe<.5);assert.ok(nearTop[0][1]/Math.tan(20*Math.PI/180)/(3.4-safe)<=.963+1e-6);
assert.equal(fitPullDistance([[0,3,0]],3.4,640),0,'already clipped parts cannot be pulled further out of frame');
console.log('PASS selected pull stays within vertical viewport limits');
const envelope=pullEnvelope({positions:Float32Array.from([0,1.1,0,0,.3,1.2,.1,.5,.8]),groups:[{pick:1,start:0,count:3,offset:[0,0,0]}]},new Set([1]));
assert.ok(fitPullDistance(envelope[0].corners,3.4,640)>0,'source bands must not combine the skull top with a distant jaw into a phantom corner');
assert.deepEqual(pullEnvelope(null,new Set([1])),[]);
console.log('PASS source envelope avoids phantom bounding corners without changing anatomy');

// Real OBJ-source mesh bounds: every skull structure gets its own non-overlapping
// cell. This catches the previous false-positive where the entire block moved.
const originalFetch=globalThis.fetch;
let head;
try {
  globalThis.fetch=async url=>new Response(fs.readFileSync(new URL(url)));
  head=await buildModelAsync(CATALOG.findIndex(d=>d.id==='head'),1000);
}finally{globalThis.fetch=originalFetch;}
const headPick=head.labels.findIndex(l=>l.sourceId==='FJ3200'),skull=selectionFor(head.labels,headPick,'group');
const layout=partLayout(head.surface,skull.ids,{scale:.3,explode:1,exCenter:head.exCenter,radius:.85});
assert.equal(layout.offsets.size,skull.ids.size);
const splitBoxes=[];
for(const g of head.surface.groups.filter(g=>skull.ids.has(g.pick))){
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(head.surface.positions.subarray(g.start*3,(g.start+g.count)*3),3));
 const mesh=new T.Mesh(geometry,new T.MeshStandardMaterial());mesh.userData={g,uniforms:{reveal:{},cutOn:{},cut:{}}};
 surface.root.add(mesh);surface.meshes.push(mesh);
}
const realMeshes=surface.meshes.slice(3),realDraw={...d,sel:headPick,rot:rotY(0),explode:1,scale:.3,exCenter:head.exCenter,selectedPicks:skull.ids,partLayout:layout,pull:[0,0,0]};
surface.draw({...realDraw,partAmount:0});const assembled=realMeshes.map(m=>m.position.toArray());
surface.draw({...realDraw,partAmount:1});
for(const mesh of realMeshes){
 mesh.geometry.computeBoundingBox();const box=mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld);splitBoxes.push(box);
 assert.ok(Math.max(...box.min.toArray().map(Math.abs),...box.max.toArray().map(Math.abs))<=.85+1e-6);
}
for(let i=0;i<splitBoxes.length;i++)for(let j=0;j<i;j++){
 const a=splitBoxes[i],b=splitBoxes[j];assert.ok(a.max.x<b.min.x||b.max.x<a.min.x||a.max.y<b.min.y||b.max.y<a.min.y,'source structures have visible gaps, not one shared translation');
}
surface.draw({...realDraw,partAmount:0});
realMeshes.forEach((m,i)=>m.position.toArray().forEach((v,k)=>close(v,assembled[i][k])));
const particleOffsets=particlePartOffsets(head.pick,layout);
for(let i=0;i<head.pick.length;i++)for(let k=0;k<3;k++)close(particleOffsets[i*3+k],layout.offsets.get(head.pick[i])?.[k]||0,1e-6);
assert.deepEqual(partTransform(-1,layout,1),{scale:1,offset:[0,0,0]});
assert.equal(partLayout(head.surface,new Set([headPick])),null,'a single source mesh cannot invent inner bones');
console.log('PASS '+skull.ids.size+' real skull structures: distinct cells with gaps, uniform geometry scale, exact reassembly, unchanged non-selection and matching GPU attributes');

const paged=new Set();
for(let page=0;page<Math.ceil(skull.ids.size/20);page++){
 const current=partLayout(head.surface,skull.ids,{scale:.3,explode:1,exCenter:head.exCenter,radius:.85,page,pageSize:20});
 assert.ok(current.visible.size<=20);
 for(const pick of current.visible){assert.ok(!paged.has(pick));paged.add(pick);}
 for(const pick of skull.ids){assert.equal(partPageVisible(pick,current,1),current.visible.has(pick));assert.equal(partPageVisible(pick,current,0),true);}
 for(const angle of [0,Math.PI/4,Math.PI/2]){
  surface.draw({...realDraw,rot:rotY(angle),partLayout:current,partAmount:1});
  const visible=realMeshes.filter(mesh=>mesh.visible);
  for(const mesh of visible)assert.ok(current.visible.has(mesh.userData.g.pick));
  const boxes=visible.map(mesh=>mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrix));
  for(let i=0;i<boxes.length;i++)for(let j=0;j<i;j++)assert.ok(!boxes[i].intersectsBox(boxes[j]),'Paged structures must not intersect in the rotating grid');
 }
}
assert.deepEqual(paged,skull.ids,'Every source structure remains reachable across pages');
console.log('PASS pages of 20: complete source coverage, hidden meshes cannot be picked, cell gaps and stable visibility through yaw, full reassembly');
