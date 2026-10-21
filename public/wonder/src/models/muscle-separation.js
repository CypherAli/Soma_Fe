import { partLayout } from '../logic/inspection-controls.js';
export function setMuscleSeparation(model, enabled) {
 if(!model?.surface)return;
 model.systemLayout??={fitScale:model.fitScale,exCenter:[...model.exCenter],offsets:model.surface.groups.map(g=>[...g.offset])};
 const original=model.systemLayout;
 model.surface.groups.forEach((g,i)=>{g.offset=[...original.offsets[i]];if(model.labels[g.pick])model.labels[g.pick].offset=[...g.offset];});
 model.fitScale=original.fitScale;model.exCenter=[...original.exCenter];
 model.surface.individualSystems=[];
 if(!enabled)return;
 const muscles=model.surface.groups.filter(g=>g.system==='muscular');
 const layout=partLayout(model.surface,new Set(muscles.map(g=>g.pick)),{radius:1.2});
 if(!layout)return;
 // A source part can have separate main/cut-face ranges. Move them together.
 muscles.forEach(g=>{g.offset=layout.offsets.get(g.pick).map(v=>v/layout.scale);model.labels[g.pick].offset=[...g.offset];});
 model.surface.individualSystems=['muscular'];
 model.exCenter=[0,0,0];model.fitScale=Math.min(1,layout.scale);
}
