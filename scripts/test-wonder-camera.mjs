import assert from 'node:assert/strict';
import {previewTransform,previewPoint,previewSource} from '../public/wonder/src/lib/preview-projection.js';
import {HandCamera} from '../public/wonder/src/hands.js';
for(const [w,h] of [[640,360],[640,480],[360,640]]){
 const fit=previewTransform(w,h,320,180);
 for(const x of [.1,.5,.9]){
  const point=previewPoint([1-x,.4],fit);
  assert.ok(Math.abs(point[0]-(320-(fit.dx+x*fit.w)))<1e-8,'landmark matches mirrored video, including cover crop');
  assert.equal(point[1],fit.dy+.4*fit.h);
 }
}
let posted=0;
globalThis.createImageBitmap=async()=>({close(){}});
const camera=new HandCamera({readyState:2,currentTime:1});camera.running=true;
camera.landmarker={detectForVideo(){throw Error('inference must not run on UI thread');}};
camera.worker={postMessage(){posted++;},terminate(){}};
assert.equal(camera.poll(),undefined);assert.equal(camera.busy,true);
await Promise.resolve();await Promise.resolve();camera.poll();assert.equal(posted,1,'only one inference request in flight');
camera.busy=false;camera.video.currentTime=2;camera.nextDetection=Infinity;
camera.poll();await Promise.resolve();await Promise.resolve();assert.equal(posted,2,'Worker processes the next available frame without an extra timer');
camera.result=[];assert.deepEqual(camera.poll(),[]);camera.stop();
console.log('PASS single selfie mirror, aspect/crop alignment, asynchronous polling, one pending frame');

let stopped=0;
const shared={active:true,getTracks:()=>[{stop:()=>stopped++}]};
const borrowed=new HandCamera({play:async()=>{}});
borrowed.startWorker=async()=>{};
await borrowed.start(()=>{},shared);
assert.equal(borrowed.video.srcObject,shared,'scan stream adopted without getUserMedia');
borrowed.stop();assert.equal(stopped,0,'control must not stop scan-owned tracks');
borrowed.stream=shared;borrowed.ownsStream=true;borrowed.stop();assert.equal(stopped,1,'owned tracks cleaned up');
console.log('PASS shared camera handoff and stream ownership');
const original={readyState:2,videoWidth:1280,videoHeight:720};
const reduced={width:320,height:180};
assert.equal(previewSource(original,reduced),original,'preview and scan crop use the original camera image');
assert.equal(previewSource({...original,readyState:1},reduced),reduced,'worker image is a fallback while video is unavailable');
assert.equal(previewSource({...original,videoWidth:0},reduced),reduced,'an empty video frame cannot replace the valid fallback');
console.log('PASS full-resolution preview source with safe loading fallback');
