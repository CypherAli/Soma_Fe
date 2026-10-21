import { Part } from '../lib/sampling.js';
import { ATLAS_PRESETS } from './atlas-presets.js';
import { separateSystems } from './separation.js';
import { sourceGroups,sourceDisplayName } from './source-groups.js';
import { correctSystem } from './system-corrections.js';

let translatedNames;
function loadNames() {
  return translatedNames ||= fetch(new URL('../../assets/anatomy-names.json', import.meta.url))
    .then(response => { if (!response.ok) throw new Error('Không tải được tên giải phẫu'); return response.json(); })
    .then(data => data.vi)
    .catch(error => { translatedNames = null; throw error; });
}

// Surface triangles, never a recycled seed cloud. Assets are local and loaded in the worker.
export function trianglePart(vertices) {
  const count=vertices.length/9, cdf=new Float64Array(count); let area=0;
  for(let t=0;t<count;t++) {
    const i=t*9, ux=vertices[i+3]-vertices[i],uy=vertices[i+4]-vertices[i+1],uz=vertices[i+5]-vertices[i+2];
    const vx=vertices[i+6]-vertices[i],vy=vertices[i+7]-vertices[i+1],vz=vertices[i+8]-vertices[i+2];
    area+=Math.hypot(uy*vz-uz*vy,uz*vx-ux*vz,ux*vy-uy*vx)/2; cdf[t]=area;
  }
  if (!(area>0)) throw new Error('Empty anatomical surface');
  return new Part((rng,out,p)=>{
    const r=rng.random()*area; let lo=0,hi=count-1;
    while(lo<hi){const mid=(lo+hi)>>1;if(cdf[mid]<r)lo=mid+1;else hi=mid;}
    const i=lo*9,s=Math.sqrt(rng.random()),v=s*(1-rng.random()),w=s-v,u=1-s;
    for(let k=0;k<3;k++)out[p*3+k]=vertices[i+k]*u+vertices[i+3+k]*v+vertices[i+6+k]*w;
  },area);
}
const regions=ATLAS_PRESETS.map(p=>[p.id,p.name,p.name+' · '+(p.sourceLabel?'Mô hình giải phẫu 3D':'BodyParts3D'),['hand','wrist','fingers','head','neck'].includes(p.id) ? 1.05 : p.groupByPart ? .9 : .95]);
export const GESTURE_MODELS=regions.map(([id,name,fact,displayScale])=>{
  let groups=null,loading=null,surface=null;
  return {id,name,fact,color:[.9,.5,.4],tilt:0,pointScale:.7,gainScale:1,hideTitle:true,displayScale,
    async load(){
      if(groups)return;
      if(!loading)loading=(async()=>{
        const base=new URL(`../../assets/regions/${id}`,import.meta.url);
        const [meta,raw,names]=await Promise.all([fetch(base+'.json'),fetch(base+'.bin.gz'),loadNames()]);
        if(!meta.ok||!raw.ok)throw new Error(`Không tải được ${name}`);
        const manifest=await meta.json(),data=new Float32Array(await new Response(raw.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
        let normals=null;
        if(manifest.normals){const response=await fetch(base+'.normals.bin.gz');if(!response.ok)throw Error('Missing atlas normals');normals=new Float32Array(await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());if(normals.length!==data.length)throw Error('Invalid atlas normals');}
        const expanded=sourceGroups(manifest);
        const baseGroups=manifest.groups.map(g=>correctSystem({...g,separateTogether:['hand','wrist','fingers','head','neck','arm','forearm','upper-limb'].includes(id),color:[1,3,5].map(i=>parseInt(g.color.slice(i,i+2),16)/255)},manifest.parts));
        // Keep the existing system layout; source parts within a system share it.
        separateSystems(baseGroups,data);
        groups=expanded.groups.map(g=>{
          const parent=baseGroups[g.parentIndex];
          return correctSystem({...g,separateTogether:true,color:parent.color,offset:parent.offset,stage:parent.stage,
            info:g.info===g.label?'':g.info,label:sourceDisplayName(g,names),
            parts:g.ranges.filter(range=>range.count).map(range=>trianglePart(data.subarray(range.start,range.start+range.count)))},manifest.parts);
        });
        const overview=expanded.overview.length?baseGroups.filter(parent=>groups.filter(g=>g.parentId===parent.id).every(g=>g.system===parent.system)):[];
        const surfaceGroup=(g,range,groupIndex)=>({system:g.system,id:g.id,groupIndex,overviewId:overview.some(parent=>parent.id===(g.parentId||g.id))?(g.parentId||g.id):null,capCount:(range.capCount||0)/3,start:range.start/3,count:range.count/3,color:g.color,offset:g.offset,stage:g.stage,cover:g.cover||g.label==='Da'});
        surface={quality:manifest.quality,partCount:manifest.parts.length,positions:data,normals,
          groups:groups.flatMap((g,i)=>g.ranges.filter(range=>range.count).map(range=>surfaceGroup(g,range,i))),
          overviewGroups:overview.map(g=>surfaceGroup(g,g,-1))};
      })().catch(e=>{loading=null;throw e;});
      await loading;
    },surface(){return surface;},release(){groups=null;loading=null;surface=null;},groups(){if(!groups)throw new Error('Region not loaded');return groups;}};
});
