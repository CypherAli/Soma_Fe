import { separateSystems } from './separation.js';
export function setMuscleSeparation(model, enabled) {
 if(!model?.surface)return;
 model.systemLayout??={fitScale:model.fitScale,exCenter:[...model.exCenter],offsets:model.surface.groups.map(g=>[...g.offset])};
 const original=model.systemLayout;
 model.surface.groups.forEach((g,i)=>{g.offset=[...original.offsets[i]];if(model.labels[g.pick])model.labels[g.pick].offset=[...g.offset];});
 model.fitScale=original.fitScale;model.exCenter=[...original.exCenter];
 if(!enabled)return;
 const muscles=model.surface.groups.filter(g=>g.system==='muscular');
 const arranged=muscles.map(g=>({...g,start:g.start*3,count:g.count*3,separateTogether:false}));
 separateSystems(arranged,model.surface.positions,Math.ceil(muscles.length/2));
 const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
 muscles.forEach((g,i)=>{g.offset=arranged[i].offset;model.labels[g.pick].offset=[...g.offset];for(let p=g.start*3;p<(g.start+g.count)*3;p+=3)for(let k=0;k<3;k++){const v=model.surface.positions[p+k]+g.offset[k];lo[k]=Math.min(lo[k],v);hi[k]=Math.max(hi[k],v);}});
 if(muscles.length){model.exCenter=lo.map((v,k)=>(v+hi[k])/2);model.fitScale=Math.min(1,1.2/Math.hypot(...hi.map((v,k)=>(v-lo[k])/2)));}
}
