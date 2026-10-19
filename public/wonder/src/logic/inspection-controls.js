// Shared gesture contract: yaw only, global separation OR selected-part separation.
const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
export class HandYaw {
  constructor({ upright = false } = {}) { this.upright = upright; this.reset(); }
  reset() { this.anchor = null; this.paused = 0; }
  update(yaw, roll, active, dt, transient = false) {
    if (!active) {
      // One noisy camera sample freezes rotation without losing its grab.
      // Deliberate gestures, leaving the frame and explicit actions release it.
      this.paused += Math.max(0, dt);
      if (!transient || this.paused > .18) this.reset();
      return yaw;
    }
    if (!Number.isFinite(roll)) return yaw;
    this.paused = 0;
    if (!this.anchor) this.anchor = { roll, yaw };
    const delta = this.upright ? roll : roll - this.anchor.roll;
    // WonderSnap's original relative wrist grab, gain and render-time damping.
    const angle = Math.atan2(Math.sin(delta), Math.cos(delta));
    // In the agreed upright mode, vertical wrist = front. Retain WonderSnap's
    // twist gain/damping, with a 5-degree neutral band to reject resting noise.
    const neutral = this.upright ? Math.sign(angle) * Math.max(0, Math.abs(angle) - Math.PI / 36) : angle;
    const target = (this.upright ? 0 : this.anchor.yaw) + 2.2 * neutral;
    return yaw + (target - yaw) * (1 - Math.exp(-Math.max(0, dt) * 9));
  }
}

export function inspectionLabelsVisible({ enabled, explode, explodeTarget, partAmount, partTarget, handActive, openness, pointing }) {
  if (!enabled) return false;
  // Hide names as soon as reassembly starts, including the still-selected part.
  if (handActive && openness < .55) return false;
  if (explode > explodeTarget + .025 || partAmount > partTarget + .025) return false;
  return pointing || Math.max(explode, partAmount) > .15;
}

export class PartSeparation {
  constructor() { this.clear(); }
  clear() { this.target = 0; this.amount = 0; this.armed = false; this.sample = null; }
  select() { this.clear(); }
  set(value) { this.target = clamp(value); this.armed = false; this.sample = null; }
  update(openness, active, sampleTime, dt) {
    if (!active) { this.armed = false; this.sample = null; }
    else if (sampleTime !== this.sample?.time) {
      if (!this.sample) this.sample = { time: sampleTime, openness, target: this.target };
      else {
        const start = this.sample;
        // Releasing a point/pinch does not immediately pull the new selection.
        // The first deliberate change in openness takes ownership from buttons.
        if (Math.abs(openness - start.openness) > .08) this.armed = true;
        if (this.armed) {
          const delta = openness - start.openness;
          this.target = delta >= 0
            ? start.target + (1 - start.target) * delta / Math.max(.15, .85 - start.openness)
            : start.target + start.target * delta / Math.max(.15, start.openness - .12);
          // Once the hand has closed, opening must still pull it out again.
          if (openness <= .12) { this.target = 0; this.sample = { time: sampleTime, openness: .12, target: 0 }; }
          if (openness >= .85) { this.target = 1; this.sample = { time: sampleTime, openness: .85, target: 1 }; }
          this.target = clamp(this.target);
        }
      }
    }
    this.amount += (this.target - this.amount) * (1 - Math.exp(-Math.max(0, dt) * 8));
    if (Math.abs(this.target - this.amount) < 1e-4) this.amount = this.target;
    return this.amount;
  }
}

// Names come from BodyParts3D; exclude cervical bones, hyoid and laryngeal cartilage.
const SKULL = /\b(ethmoid|frontal bone|sphenoid|occipital bone|parietal bone|temporal bone|zygomatic bone|nasal bone|palatine bone|maxilla|mandible|vomer|tooth|gingiva)\b/i;
export function selectionKey(label) {
  if (label.system === 'skeletal' && SKULL.test(label.sourceName || label.info || label.label)) return 'skull';
  return 'system:' + (label.system || label.sourceId || label.label);
}
export function selectionFor(labels, pick, scope = 'part', visible = null) {
  const label = labels[pick];
  if (!label) return null;
  const key = scope === 'system' ? 'system:' + label.system : scope === 'group' ? selectionKey(label) : 'part:' + pick;
  const ids = scope !== 'part'
    ? labels.flatMap((item, index) => (scope==='system'?item.system===label.system:selectionKey(item)===key) && (!visible || visible.has(index)) ? [index] : [])
    : [pick];
  return { key, ids: new Set(ids), pick, system: label.system, skull: key === 'skull' };
}
// With only one anatomical block visible there is no system-to-system motion
// to show. Open/close should separate its source structures directly.
export function singleVisibleGroup(labels, visible) {
  let pick = null, key = null, count = 0;
  for (const index of visible) {
    const label = labels[index];
    if (!label) continue;
    const next = selectionKey(label);
    if (key !== null && key !== next) return null;
    key = next; pick ??= index; count++;
  }
  return count > 1 ? { pick, key, count } : null;
}
export function remapSelection(original, ids, representative) {
  return Float32Array.from(original, value => ids?.has(value) ? representative : value);
}
export function systemBlocks(labels, visible) {
  const blocks = new Map();
  for (const pick of visible) {
    const system = labels[pick]?.system;
    if (!system) continue;
    if (!blocks.has(system)) blocks.set(system, { system, pick, count: 0 });
    blocks.get(system).count++;
  }
  const order = ['muscular','sensory','venous','arterial','skeletal','nervous','connective'];
  const rank = system => order.includes(system) ? order.indexOf(system) : order.length;
  return [...blocks.values()].sort((a,b)=>rank(a.system)-rank(b.system));
}
// Pack actual source structures, not their system IDs. Small teeth get small
// cells; every bone keeps its source geometry and its relative vertex positions.
// This layout is built once on selection, not in the animation loop.
export function partLayout(surface, ids, { scale = 1, explode = 0, exCenter = [0,0,0], inspectionCenter = [0,0,0], radius = .85 } = {}) {
  const boxes=new Map();
  if(!surface||ids.size<2)return null;
  for(const g of surface.groups){
    if(!ids.has(g.pick))continue;
    let box=boxes.get(g.pick);
    if(!box){box={pick:g.pick,lo:[Infinity,Infinity,Infinity],hi:[-Infinity,-Infinity,-Infinity],offset:g.offset};boxes.set(g.pick,box);}
    for(let p=g.start*3;p<(g.start+g.count)*3;p+=3)for(let k=0;k<3;k++){
      box.lo[k]=Math.min(box.lo[k],surface.positions[p+k]);box.hi[k]=Math.max(box.hi[k],surface.positions[p+k]);
    }
  }
  const items=[...boxes.values()];if(items.length<2)return null;
  const gap=Math.max(...items.map(b=>Math.max(b.hi[0]-b.lo[0],b.hi[1]-b.lo[1])))*.09;
  for(const b of items){b.center=b.lo.map((v,k)=>(v+b.hi[k])/2);b.w=b.hi[0]-b.lo[0]+gap;b.h=b.hi[1]-b.lo[1]+gap;}
  items.sort((a,b)=>b.h-a.h||a.pick-b.pick);
  const rowWidth=Math.max(Math.max(...items.map(b=>b.w)),Math.sqrt(items.reduce((sum,b)=>sum+b.w*b.h,0)*1.45));
  const rows=[];
  for(const b of items){
    let row=rows.find(r=>r.w+b.w<=rowWidth);
    if(!row){row={w:0,h:b.h,items:[]};rows.push(row);}
    row.items.push(b);row.w+=b.w;
  }
  const height=rows.reduce((sum,r)=>sum+r.h,0),width=Math.max(...rows.map(r=>r.w));
  let y=height/2,maxRadius=0;
  for(const row of rows){let x=-row.w/2;for(const b of row.items){
    b.target=[x+b.w/2,y-row.h/2,0];x+=b.w;
    maxRadius=Math.max(maxRadius,Math.hypot(Math.abs(b.target[0])+(b.w-gap)/2,Math.abs(b.target[1])+(b.h-gap)/2,(b.hi[2]-b.lo[2])/2));
  }y-=row.h;}
  const absoluteScale=Math.max(.03,radius)/Math.max(maxRadius,1e-6);
  const localScale=absoluteScale/Math.max(scale,1e-6),s=explode*explode*(3-2*explode),offsets=new Map();
  for(const b of items){
    const original=b.center.map((v,k)=>(v+b.offset[k]*s-exCenter[k]*explode-inspectionCenter[k])*scale);
    offsets.set(b.pick,b.target.map((v,k)=>v*absoluteScale-original[k]*localScale));
  }
  return {offsets,scale:localScale,width:width*absoluteScale,height:height*absoluteScale,gap:gap*absoluteScale};
}
export function partTransform(pick,layout,amount){
  const offset=layout?.offsets.get(pick);if(!offset)return {scale:1,offset:[0,0,0]};
  const e=clamp(amount),s=e*e*(3-2*e);
  return {scale:1+(layout.scale-1)*s,offset:offset.map(v=>v*s)};
}
export function particlePartOffsets(original,layout){
  const data=new Float32Array(original.length*3);
  if(layout)for(let i=0;i<original.length;i++){const offset=layout.offsets.get(original[i]);if(offset)data.set(offset,i*3);}
  return data;
}
export function selectedPull(pick, selection, amount, distance = .5) {
  return selection?.ids.has(pick) ? [0, 0, distance * amount] : [0, 0, 0];
}
export function fitPullDistance(corners, cameraDistance, height, fov = 40) {
  const ndcLimit = Math.max(.3, 1 - 2 * Math.min(12, height * .04) / height);
  const f = 1 / Math.tan(fov * Math.PI / 360);
  let distance = .5;
  for (const [x, y, z] of corners) {
    if (!Number.isFinite(x + y + z)) continue;
    distance = Math.min(distance, cameraDistance - z - Math.abs(y) * f / ndcLimit);
  }
  return clamp(distance, 0, .5);
}

// A single box combines the skull's highest point with its furthest-forward jaw,
// creating a phantom corner. Narrow source-space bands keep a safe, useful bound.
export function pullEnvelope(surface, ids, bands = 32) {
  const result=[],positions=surface?.positions;
  if(!positions)return result;
  for(const group of surface.groups){
    if(!ids.has(group.pick))continue;
    const start=group.start*3,end=(group.start+group.count)*3;
    let minY=Infinity,maxY=-Infinity;
    for(let i=start;i<end;i+=3){minY=Math.min(minY,positions[i+1]);maxY=Math.max(maxY,positions[i+1]);}
    const boxes=new Map();
    for(let i=start;i<end;i+=3){
      const index=Math.min(bands-1,Math.floor((positions[i+1]-minY)/Math.max(1e-9,maxY-minY)*bands));
      let box=boxes.get(index);if(!box){box={lo:[Infinity,Infinity,Infinity],hi:[-Infinity,-Infinity,-Infinity]};boxes.set(index,box);}
      for(let k=0;k<3;k++){box.lo[k]=Math.min(box.lo[k],positions[i+k]);box.hi[k]=Math.max(box.hi[k],positions[i+k]);}
    }
    const corners=[];
    for(const box of boxes.values())for(const x of [box.lo[0],box.hi[0]])for(const y of [box.lo[1],box.hi[1]])for(const z of [box.lo[2],box.hi[2]])corners.push([x,y,z]);
    result.push({offset:group.offset,corners});
  }
  return result;
}
