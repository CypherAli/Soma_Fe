// Generate a temporary UI that drives the real app with synthetic camera landmarks.
// Open /__inspection-ui-fixture.html, click Run, then remove the generated HTML.
import fs from 'node:fs';
fs.writeFileSync('public/__inspection-ui-fixture.html', `<!doctype html><html lang="vi"><meta charset="utf-8"><title>Vision inspection QA · synthetic hands</title><style>body{margin:0;background:#171a1d;color:white;font:14px system-ui}header{height:80px;padding:8px 16px;box-sizing:border-box}button{padding:8px 16px}iframe{width:100%;height:calc(100vh - 80px);border:0}#result{white-space:pre-wrap}</style><header><button id="run">Run actual gesture regression</button> <output id="result">Synthetic landmarks; no webcam.</output></header><iframe id="scene" src="/wonder/index.html?region=head&autostart=nocamera&manual=1&n=5000&dpr=1"></iframe><script type="module">
import * as T from '/wonder/vendor/three.module.js';
import { stepParticle } from '/wonder/src/logic/simRef.js';
import { particlePartOffsets } from '/wonder/src/logic/inspection-controls.js';
const frame=document.getElementById('scene'),result=document.getElementById('result');
const check=(condition,name)=>{if(!condition)throw Error(name);};
const near=(a,b)=>Math.abs(a-b)<1e-5;
document.getElementById('run').onclick=async()=>{
 try{
  result.textContent='Running…';
  for(let i=0;!frame.contentWindow.wonderSnap&&i<600;i++)await new Promise(resolve=>requestAnimationFrame(resolve));
  const api=frame.contentWindow.wonderSnap;check(api,'App booted');await api.ready();
  const app=api.app;api.select(api.CFG.start);await api.advance(.1,null);app.ctl.keyPose('fist',app.t);await api.advance(3,null);
  for(let i=0;!app.renderer.atlasSurface?.ready&&i<600;i++)await new Promise(resolve=>requestAnimationFrame(resolve));
  check(app.renderer.atlasSurface?.ready,'Solid ready');await api.advance(2,null);
  app.$('bOpen').click();await api.advance(2,null);
  const tag=app.labelHits.find(label=>label.key==='skull');check(tag,'Skull group tag is drawn');
  const pointer=api.synth({...api.pointAt((tag.x+tag.w/2),(tag.y+tag.h/2)),pose:'point'});
  await api.advance(1,pointer);check(api.status().selectionKey==='skull','Point dwell selects the skull block');
  const snapshot=api.status(),untouched=app.renderer.atlasSurface.meshes.filter(mesh=>!app.selection.ids.has(mesh.userData.g.pick));
  const positions=untouched.map(mesh=>mesh.position.toArray());
  const selectedMeshes=app.renderer.atlasSurface.meshes.filter(mesh=>app.selection.ids.has(mesh.userData.g.pick)),assembled=selectedMeshes.map(mesh=>mesh.position.toArray());
  await api.advance(.7,api.synth({pose:'fist',cy:.5}));await api.advance(1,api.synth({pose:'open',cy:.5}));
  check(app.pullAmt>.95,'Opening separates selected structures');check(near(app.explode,snapshot.explode),'Global separation is frozen');
  check(app.selection.layout.offsets.size===48,'Every skull source structure has its own layout offset');
  const moves=selectedMeshes.map((mesh,i)=>mesh.position.toArray().map((v,k)=>Math.round((v-assembled[i][k])*1000)).join(','));
  check(new Set(moves).size>40,'Bones move separately, not as one rigid block');
  check(app.labelHits.some(tag=>tag.scope!=='group'&&app.selection.ids.has(tag.li)),'Individual bone tags are drawn after splitting');
  check(untouched.every((mesh,index)=>mesh.position.toArray().every((v,k)=>near(v,positions[index][k]))),'Other structures stay fixed');
  await api.advance(.8,api.synth({pose:'open',cy:.85}));check(near(app.pitch,0),'Raising/lowering hand cannot pitch');
  await api.advance(1,api.synth({pose:'open',cy:.25,angle:.6}));check(Math.abs(app.spin)>.7,'Hand twist produces horizontal yaw');check(near(app.pitch,0),'Twist cannot pitch');
  await api.advance(.1,api.synth({pose:'fist',angle:.6}));
  check(app.pullAmt>.1&&app.labelHits.length===0,'Tags hide immediately while the skull is still reassembling');
  await api.advance(.6,api.synth({pose:'fist',angle:.6}));check(app.pullAmt<.05,'Closing reassembles selected block');
  check(app.labelHits.length===0,'A closed hand hides all tags, including the selected skull');
  await api.advance(.5,null);const yaw=app.spin;await api.advance(1/60,api.synth({pose:'open',angle:0}));
  check(Math.abs(app.spin-yaw)<.2,'Upright reacquisition eases toward front without an instant reset');
  await api.advance(1,api.synth({pose:'open',angle:0}));check(Math.abs(app.spin)<.002,'Upright hand restores front');
  await api.advance(1,api.synth({pose:'open',angle:.55}));check(app.spin>.8,'Deliberate twist still turns the view');
  await api.advance(.6,api.synth({pose:'point',angle:.7}));
  await api.advance(1,api.synth({pose:'open',angle:0}));
  check(Math.abs(app.spin)<.002,'Returning to an upright wrist after pointing restores front without a stale filter offset');
  app.$('viewBack').click();await api.advance(.1,null);await api.advance(1,api.synth({pose:'open',angle:0}));
  check(Math.abs(api.status().yaw)<.002&&app.dragYawTarget===0,'A previous Back preset cannot remain as a second offset under hand control');
  await api.advance(.5,api.synth({pose:'open',angle:0,cx:.2,cy:.2}));await api.advance(.5,api.synth({pose:'open',angle:0,cx:.8,cy:.8}));
  check(Math.abs(api.status().yaw)<.002&&near(app.pitch,0),'Moving an upright hand around the frame cannot rotate or tilt');
  app.deselect();await api.advance(.1,null);check(!app.selection&&app.sel<0&&app.pullAmt===0,'Deselect clears local control');
  app.$('selectionScope').value='part';app.$('selectionScope').dispatchEvent(new Event('change'));await api.advance(.2,null);
  const exactTag=app.labelHits.find(label=>label.scope!=='group');check(exactTag,'Precise structure tag is drawn');
  await api.advance(1,api.synth({...api.pointAt(exactTag.x+exactTag.w/2,exactTag.y+exactTag.h/2),pose:'point'}));
  check(api.status().selectedCount===1,'Precise scope selects only one source structure');
  const global=app.explode;await api.advance(.6,api.synth({pose:'fist'}));await api.advance(1,api.synth({pose:'open'}));
  check(app.pullAmt>.95&&near(app.explode,global),'Precise selection also has local open/close');
  app.$('selectionScope').value='group';app.$('selectionScope').dispatchEvent(new Event('change'));await api.advance(.2,null);
  app.$('viewFront').click();await api.advance(.1,null);
  const selectedTag=app.labelHits.find(label=>label.key==='skull');app.selectPart(selectedTag.li,'click','group');app.$('partPull').click();await api.advance(.8,null);
  check(app.selection.layout&&app.pullDistance===0,'Group separates internally instead of one forward pull');
  // The actual transform-feedback shader must agree with the CPU contract.
  const model=app.model,renderer=app.renderer,seeds=renderer.readSeeds(32),localOffsets=particlePartOffsets(model.pick,app.selection.layout);
  const before=new Float32Array(renderer.n*6);renderer.writeParticles(before);
  const uniforms={dt:1/60,time:2,mode:2,formT:2,kick:0,rot:[[1,0,0],[0,1,0],[0,0,1]],explode:app.explode,scale:app.drawScale,exCenter:model.exCenter,sel:app.sel,pull:[0,0,0],partAmount:1,partScale:app.selection.layout.scale};
  renderer.step(uniforms);const gpu=renderer.readParticles(32);
  for(let i=0;i<32;i++){
   const group=app.selection.ids.has(model.pick[i])?app.sel:model.pick[i];
   const cpu=stepParticle([0,0,0],[0,0,0],Array.from(model.target.subarray(i*3,i*3+3)),Array.from(seeds.subarray(i*4,i*4+4)),Array.from(model.offset.subarray(i*4,i*4+4)),uniforms,group,Array.from(localOffsets.subarray(i*3,i*3+3))).flat();
   cpu.forEach((v,k)=>check(Math.abs(v-gpu[i*6+k])<2e-5,'GPU / CPU selected separation parity'));
  }
  // Reproduce the user's filtered skull screen, using the new visible button.
  app.$('inspectionView').value='skeletal';app.$('inspectionView').dispatchEvent(new Event('change'));await api.advance(2,null);
  check(!app.selection,'Filter clears prior selection');app.$('splitParts').click();await api.advance(2,null);
  check(app.selection?.skull&&app.pullAmt===1,'One visible button splits the skull from assembled view');
  const boxes=app.renderer.atlasSurface.meshes.filter(mesh=>app.selection.ids.has(mesh.userData.g.pick)).map(mesh=>new T.Box3().setFromObject(mesh));
  for(let i=0;i<boxes.length;i++)for(let j=0;j<i;j++)check(boxes[i].max.x<boxes[j].min.x||boxes[j].max.x<boxes[i].min.x||boxes[i].max.y<boxes[j].min.y||boxes[j].max.y<boxes[i].min.y,'Individual bone cells have gaps');
  for(const mesh of app.renderer.atlasSurface.meshes.filter(mesh=>app.selection.ids.has(mesh.userData.g.pick))){
   const position=mesh.geometry.getAttribute('position');
   for(let index=0;index<position.count;index++){
    const ndc=new T.Vector3().fromBufferAttribute(position,index).applyMatrix4(mesh.matrixWorld).project(app.renderer.atlasSurface.camera);
    check(Math.abs(ndc.y)<.965,'Selected skull remains inside the vertical viewport');
   }
  }
  app.$('splitParts').click();await api.advance(2,null);check(app.pullAmt===0,'The same button reassembles all bones');
  app.$('splitParts').click();await api.advance(2,null);
  const skullCount=app.selection.ids.size;
  // Reproduce the reported forearm view: filter bones, then simply open a hand.
  const forearm=api.CATALOG.findIndex(model=>model.id==='forearm');check(forearm>=0,'Forearm model exists');
  api.select(forearm,true);await api.ready();await api.advance(3,null);
  for(let i=0;!app.renderer.atlasSurface?.ready&&i<600;i++)await new Promise(resolve=>requestAnimationFrame(resolve));
  check(app.renderer.atlasSurface?.ready,'Forearm solid ready');await api.advance(2,null);
  app.$('inspectionView').value='skeletal';app.$('inspectionView').dispatchEvent(new Event('change'));await api.advance(.2,null);
  check(!app.selection&&app.explode===0,'Filtered forearm starts assembled without old system offsets');
  check(app.$('splitParts').textContent==='Tách 3 cấu trúc','Visible action identifies the three real structures');
  const bones=app.renderer.atlasSurface.meshes.filter(mesh=>mesh.visible),bonePositions=bones.map(mesh=>mesh.position.toArray()),boneScales=bones.map(mesh=>mesh.scale.toArray());
  check(bones.length===3,'The reported view has three actual source meshes');
  await api.advance(2,api.synth({pose:'open'}));
  check(app.selection?.ids.size===3&&app.selection.layout&&app.pullAmt===1,'An initial open hand splits all three bones without pointing or clicking');
  check(app.explode===0,'Open hand cannot translate the whole skeletal system');
  const boneBoxes=bones.map(mesh=>new T.Box3().setFromObject(mesh));
  for(let i=0;i<boneBoxes.length;i++)for(let j=0;j<i;j++)check(boneBoxes[i].max.x<boneBoxes[j].min.x||boneBoxes[j].max.x<boneBoxes[i].min.x||boneBoxes[i].max.y<boneBoxes[j].min.y||boneBoxes[j].max.y<boneBoxes[i].min.y,'Forearm structures have visible gaps');
  for(const mesh of bones){
   const position=mesh.geometry.getAttribute('position');
   for(let index=0;index<position.count;index++){
    const ndc=new T.Vector3().fromBufferAttribute(position,index).applyMatrix4(mesh.matrixWorld).project(app.renderer.atlasSurface.camera);
    check(Math.abs(ndc.y)<.82,'Split forearm leaves space for the bottom toolbar');
   }
  }
  check(app.labelHits.filter(tag=>app.selection.ids.has(tag.li)&&tag.scope!=='group').length===3,'Every separated forearm structure has its own tag');
  await api.advance(2,api.synth({pose:'fist'}));check(app.pullAmt===0,'A fist reassembles the forearm');
  check(app.labelHits.length===0,'Forearm reassembly is clear of tags');
  const restored=bones.every((mesh,i)=>{
   return mesh.position.toArray().every((v,k)=>near(v,bonePositions[i][k]))
    &&mesh.scale.toArray().every((v,k)=>near(v,boneScales[i][k]));
  });
  check(restored,'Forearm reassembly restores the exact source pose and scale');
  await api.advance(2,api.synth({pose:'open'}));check(app.pullAmt===1,'Forearm can reopen after a fist');
  app.$('splitParts').click();await api.advance(2,api.synth({pose:'open'}));check(app.pullAmt===0,'Steady open hand does not undo the reassemble button');
  app.$('inspectionView').dispatchEvent(new Event('change'));await api.advance(.2,null);app.$('splitParts').click();await api.advance(2,null);
  check(app.selection?.ids.size===3&&app.pullAmt===1,'One button splits the current visible forearm group');
  const fingers=api.CATALOG.findIndex(model=>model.id==='fingers');api.select(fingers,true);await api.ready();await api.advance(3,null);
  for(let i=0;!app.renderer.atlasSurface?.ready&&i<600;i++)await new Promise(resolve=>requestAnimationFrame(resolve));
  await api.advance(2,null);app.$('bOpen').click();await api.advance(2,null);
  const originalSurface=app.model.surface,originalIndex=api.status().index;
  const like=side=>api.synth({pose:'like',handedness:side,cx:side==='right'?.2:.8});
  await api.advance(1,like('right'));
  check(api.status().index===originalIndex&&app.model.surface===originalSurface,'Right like keeps the main model and source meshes');
  check(app.selection?.system==='muscular'&&app.selection.ids.size===29,'First right like selects the muscle system in the separated hand');
  check(app.renderer.atlasSurface.meshes.filter(mesh=>mesh.visible).every(mesh=>mesh.userData.g.system==='muscular'),'Only the selected system is visible');
  await api.advance(3,like('right'));check(app.selection.system==='muscular','Holding right like does not keep cycling');
  await api.advance(.5,api.synth({pose:'fist',handedness:'right'}));await api.advance(1,like('right'));
  check(app.selection.system==='sensory','A second right like selects sensory organs');
  await api.advance(.5,api.synth({pose:'fist',handedness:'right'}));await api.advance(1,like('right'));
  check(app.selection.system==='venous','A third right like selects veins');
  await api.advance(.5,api.synth({pose:'fist',handedness:'right'}));await api.advance(2,api.synth({pose:'open',handedness:'right'}));
  check(app.pullAmt===1&&app.selection.layout,'Open hand still splits the current system');
  await api.advance(1,like('left'));await api.ready();await api.advance(3,like('left'));
  check(api.status().index===(originalIndex+1)%api.CATALOG.length,'Left like advances exactly one main model');
  check(api.status().state==='formed','The next main model appears without another fist');
  for(let i=0;!app.renderer.atlasSurface?.ready&&i<600;i++)await new Promise(resolve=>requestAnimationFrame(resolve));
  check(app.renderer.atlasSurface?.ready,'Next model solid surface is ready');await api.advance(2,like('left'));
  check(app.lastSolidBlend===1,'Next model finishes its solid reveal');
  app.$('bNextBlock').click();await api.advance(2,null);
  check(app.selection?.system==='muscular','Visible system-next button uses the same routing');
  await api.advance(.4,api.synth({pose:'fist'}));check(app.labelHits.length===0,'Final closed-hand view is clear of tags');
  api.select(forearm,true);await api.ready();await api.advance(3,null);
  for(let i=0;!app.renderer.atlasSurface?.ready&&i<600;i++)await new Promise(resolve=>requestAnimationFrame(resolve));
  check(app.renderer.atlasSurface?.ready,'Final forearm solid ready');await api.advance(2,api.synth({pose:'open',angle:0}));
  check(Math.abs(api.status().yaw)<.002,'Reported forearm view is front-facing with an upright hand');
  result.textContent='PASS · upright wrist = front; preset offset cleared; position does not rotate; no stale filter drift; reassembly hides tags; left/right like routing; forearm 3 structures; skull '+skullCount+'; GPU / CPU parity. Synthetic hands, no physical webcam.';
 }catch(error){result.textContent='FAIL · '+error.message;console.error(error);}
};
</script></html>`);
console.log('Created temporary public/__inspection-ui-fixture.html');
