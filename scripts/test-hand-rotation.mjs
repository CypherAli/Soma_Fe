import assert from 'node:assert/strict';
import {Controller} from '../public/wonder/src/logic/controller.js';
import {HandYaw} from '../public/wonder/src/logic/inspection-controls.js';
const controller=new Controller(30,()=>true);
function hand(angle){const lm=Array.from({length:21},()=>[.5,.5]);lm[0]=[.5,.5];lm[9]=[.5+Math.sin(angle)*.15,.5-Math.cos(angle)*.15];return lm;}
let last=0;
for(let i=0;i<100;i++){controller.onHand(hand(i*.05),i*.04);if(i)assert.ok(Math.abs(controller.roll-last)<.06,'continuous rotation across the atan2 seam');last=controller.roll;}
assert.ok(controller.roll>Math.PI,'roll remains unwrapped through 180 degrees');
controller.onHand(hand(-1),5);assert.equal(controller.roll,-1,'reappearance starts a fresh angle reference');
console.log('PASS continuous hand roll and reacquisition');
let transitions=0;controller.state.update=()=>{transitions++;};controller.suspended=true;
controller.onHand(hand(.5),6);assert.equal(transitions,0,'scan keeps tracking while suppressing model gestures');assert.ok(controller.landmarks,'scan still receives hand landmarks');
controller.suspended=false;controller.onHand(hand(.6),6.05);assert.equal(transitions,1,'gesture control resumes after scanning');
console.log('PASS scan gesture suspension and resume');
// Replay the original two-stage WonderSnap formula at real input/render rates.
for(const inputFps of [6,11,30])for(const renderFps of [30,60,120]){
 const ctl=new Controller(30,()=>true),yaw=new HandYaw();let model=0,expected=0,filtered=0,next=0,anchor=null;
 for(let frame=0;frame<renderFps*3;frame++){
  const time=frame/renderFps;
  if(time>=next){
   const raw=.45*Math.sin(time*2);
   filtered+=Math.atan2(Math.sin(raw-filtered),Math.cos(raw-filtered))*.5;
   ctl.onHand(hand(raw),time);next+=1/inputFps;
   assert.ok(Math.abs(ctl.roll-filtered)<1e-9,'Wrist filtering matches WonderSnap at '+inputFps+' Hz');
  }
  anchor??=filtered;
  const target=2.2*Math.atan2(Math.sin(filtered-anchor),Math.cos(filtered-anchor));
  expected+=(target-expected)*(1-Math.exp(-9/renderFps));
  model=yaw.update(model,ctl.roll,true,1/renderFps);
  assert.ok(Math.abs(model-expected)<1e-9,'Render yaw matches WonderSnap at '+renderFps+' FPS');
 }
}
console.log('PASS original WonderSnap wrist/yaw parity at 6/11/30 Hz input and 30/60/120 FPS rendering');
for(const inputFps of [6,10,30]){
 const ctl=new Controller(30,()=>true),yaw=new HandYaw();
 ctl.onHand(hand(.8),0);ctl.onHand(hand(0),1/inputFps);
 assert.ok(ctl.roll>.3,'Prior gesture leaves a filtered angle tail');
 ctl.rebaseRoll();let angle=yaw.update(.7,ctl.roll,true,1/60);
 for(let i=2;i<inputFps*2;i++){
  ctl.onHand(hand(0),i/inputFps);
  for(let f=0;f<Math.round(60/inputFps);f++)angle=yaw.update(angle,ctl.roll,true,1/60);
 }
 assert.ok(Math.abs(angle-.7)<1e-9,'An upright stationary wrist cannot rotate after reacquiring');
 ctl.onHand(hand(.3),2);angle=yaw.update(angle,ctl.roll,true,1/60);
 assert.ok(angle>.7,'Deliberate twist after reacquiring still rotates');
}
console.log('PASS no filter-tail rotation when resuming a stationary wrist at 6/10/30 Hz');
for(const fps of [30,60,120]){
 const yaw=new HandYaw({upright:true});let angle=1.3;
 for(let i=0;i<fps;i++)angle=yaw.update(angle,0,true,1/fps);
 assert.ok(Math.abs(angle)<.001,'Upright wrist returns to front even from an old yaw');
 for(const jitter of [-.08,.03,.07])for(let i=0;i<fps/5;i++)angle=yaw.update(angle,jitter,true,1/fps);
 assert.ok(Math.abs(angle)<.001,'Neutral band rejects upright resting noise');
 for(let i=0;i<fps;i++)angle=yaw.update(angle,.5,true,1/fps);
 assert.ok(angle>.8,'Clockwise wrist drives positive yaw');
 yaw.reset();for(let i=0;i<fps;i++)angle=yaw.update(angle,-.5,true,1/fps);
 assert.ok(angle<-.8,'Counterclockwise wrist drives negative yaw regardless of previous grab');
 const frozen=angle;for(let i=0;i<fps;i++)angle=yaw.update(angle,0,false,1/fps);
 assert.equal(angle,frozen,'Leaving the frame holds the current view');
 for(let i=0;i<fps;i++)angle=yaw.update(angle,0,true,1/fps);
 assert.ok(Math.abs(angle)<.001,'Upright reacquisition smoothly restores front');
}
console.log('PASS agreed upright/front mapping, neutral jitter rejection, left/right direction and reacquisition at 30/60/120 FPS');
