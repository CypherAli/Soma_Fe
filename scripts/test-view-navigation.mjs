import assert from 'node:assert/strict';
import { HandZoom, HandTilt, twoHandZoomActive, wheelZoom } from '../public/wonder/src/logic/view-navigation.js';
import { layoutSideLabels, intersects } from '../public/wonder/src/lib/label-layout.js';

assert.ok(wheelZoom(1,-1)>1&&wheelZoom(1,-1)<1.01,'Small trackpad deltas cannot produce a ten-percent jump');
assert.equal(wheelZoom(1,3,1),wheelZoom(1,48,0),'Wheel lines normalize to pixels');
let zoom=1;for(let i=0;i<12;i++)zoom=wheelZoom(zoom,-10);
assert.ok(Math.abs(zoom-wheelZoom(1,-120))<1e-9,'Zoom is independent of wheel event batching');
assert.equal(wheelZoom(2.6,-1000),2.6);assert.equal(wheelZoom(.5,1000),.5);
for(const fps of [6,10,30]){
 const hand=new HandZoom();let target=1;
 for(let i=0;i<fps*2;i++)target=hand.update(.4+(i%2?1:-1)*.001,i/fps,target);
 assert.ok(Math.abs(target-1)<.001,'Resting hand jitter does not change zoom');
 for(let i=0;i<fps;i++)target=hand.update(.6,2+i/fps,target);
 assert.ok(target>1.4&&target<1.5,'Deliberate spread responds at low camera FPS');
 const held=target;assert.equal(hand.update(.2,4,held),held,'Reacquiring after tracking loss cannot jump');
 assert.equal(hand.update(.01,4.1,held),held,'Overlapping hands cannot create an unstable division');
}
const bounds={x:0,y:0,w:800,h:600},obstacle={x:0,y:0,w:170,h:90};
assert.equal(twoHandZoomActive({manual:false,blocked:false,visible:true,second:true,formed:true,navigation:false}),true,'Two-hand pinch/point must not be blocked by one-hand gestures');
assert.equal(twoHandZoomActive({manual:false,blocked:false,visible:true,second:true,formed:true,navigation:true}),false,'Navigation keeps explicit ownership');
for(const fps of [6,10,30,60]){
 const tilt=new HandTilt();let pitch=.1;tilt.update(pitch,.5,true,1/fps);
 for(let i=0;i<fps;i++)pitch=tilt.update(pitch,.7,true,1/fps);
 assert.ok(Math.abs(pitch-.6)<.001,'Relative vertical hand movement restores WonderSnap pitch');
 tilt.update(pitch,.2,false,1/fps);assert.equal(tilt.update(pitch,.2,true,1/fps),pitch,'Reacquisition cannot snap tilt');
}
const items=Array.from({length:6},(_,i)=>({px:300+i*35,py:180+i*20,w:160,h:26}));
const labels=layoutSideLabels(items,bounds,[obstacle],8);
assert.equal(labels.length,6);
for(let i=0;i<labels.length;i++){
 assert.ok(labels[i].x===0||labels[i].x===640,'Tags stay on the two outer rails');
 assert.ok(!intersects(labels[i],obstacle,8));
 for(let j=0;j<i;j++)assert.ok(!intersects(labels[i],labels[j],8));
}
console.log('PASS proportional wheel zoom, jitter filtering at 6/10/30 Hz, reacquisition, limits and annotation rails');
