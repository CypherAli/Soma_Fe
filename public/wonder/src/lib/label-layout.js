import { selectionKey } from '../logic/inspection-controls.js';
export const SYSTEM_LABELS={skeletal:'Hệ xương',muscular:'Hệ cơ',arterial:'Động mạch',venous:'Tĩnh mạch',nervous:'Hệ thần kinh',sensory:'Cơ quan giác quan',connective:'Mô liên kết',digestive:'Hệ tiêu hóa',respiratory:'Hệ hô hấp',urinary:'Hệ tiết niệu',reproductive:'Hệ sinh dục',lymphatic:'Hệ bạch huyết',endocrine:'Hệ nội tiết',integumentary:'Bề mặt cơ thể',cardiac:'Tim'};

// Keep exact picking anchors untouched. Overview tags summarize each visible system.
export function overviewLabels(anchors,selected=-1,selection=null){
 const systems=new Map();
 for(const a of anchors){const key=selectionKey(a.L);let bucket=systems.get(key);if(!bucket){bucket={...a,key,scope:'group',L:{...a.L,label:key==='skull'?'Khối hộp sọ':SYSTEM_LABELS[a.L.system]||a.L.label},size:0,px:0,py:0};systems.set(key,bucket);}bucket.size++;bucket.px+=a.px;bucket.py+=a.py;}
 const result=[...systems.values()].map(a=>({...a,px:a.px/a.size,py:a.py/a.size,L:{...a.L,label:a.L.label+' · '+a.size}}));
 if(selection?.ids.size>1)return result.sort((a,b)=>(b.key===selection.key)-(a.key===selection.key));
 const exact=anchors.find(a=>a.li===selected);
 if(exact)return [exact,...result.filter(a=>a.L.system!==exact.L.system)];
 return result;
}
export function intersects(a,b,gap=6){return a.x<b.x+b.w+gap&&a.x+a.w+gap>b.x&&a.y<b.y+b.h+gap&&a.y+a.h+gap>b.y;}
export function layoutLabels(items,bounds,obstacles=[],gap=6){
 const placed=[];
 for(const item of items){
  if(![item.px,item.py,item.w,item.h].every(Number.isFinite)||item.w>bounds.w||item.h>bounds.h)continue;
  let chosen=null;
  const pad=gap*2+4,pitch=item.h+gap+4;
  const rows=Array.from({length:5},(_,i)=>[pad+i*pitch,-item.h-pad-i*pitch]).flat();
  for(const dy of rows){
   for(const dx of [0,-item.w*.6-12,item.w*.6+12]){
    const rect={x:Math.max(bounds.x,Math.min(bounds.x+bounds.w-item.w,item.px-item.w/2+dx)),y:Math.max(bounds.y,Math.min(bounds.y+bounds.h-item.h,item.py+dy)),w:item.w,h:item.h};
    if([...placed,...obstacles].some(other=>intersects(rect,other,gap)))continue;
    chosen={...item,...rect};break;
   }if(chosen)break;
  }
  if(chosen)placed.push(chosen);
 }return placed;
}

// Two annotation rails keep the separated anatomy clear in the middle.
export function layoutSideLabels(items,bounds,obstacles=[],gap=6){
 const placed=[],middle=bounds.x+bounds.w/2;
 for(const item of [...items].sort((a,b)=>a.py-b.py)){
  if(![item.px,item.py,item.w,item.h].every(Number.isFinite)||item.w>bounds.w||item.h>bounds.h)continue;
  const sides=item.px<middle?[0,1]:[1,0];let chosen=null;
  for(const side of sides){
   const x=side?bounds.x+bounds.w-item.w:bounds.x;
   for(let step=0;step<20;step++){
    const offset=Math.ceil(step/2)*(step%2?1:-1)*(item.h+gap);
    const y=Math.max(bounds.y,Math.min(bounds.y+bounds.h-item.h,item.py-item.h/2+offset));
    const rect={x,y,w:item.w,h:item.h};
    if([...placed,...obstacles].some(other=>intersects(rect,other,gap)))continue;
    chosen={...item,...rect};break;
   }
   if(chosen)break;
  }
  if(chosen)placed.push(chosen);
 }
 return placed;
}
