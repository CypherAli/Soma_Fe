import { SYSTEM_LABELS } from '../lib/label-layout.js';
export const TISSUE_MATERIALS={
 skeletal:{roughness:.76,metalness:0},
 muscular:{roughness:.64,metalness:0},
 connective:{roughness:.38,metalness:0},
 arterial:{roughness:.46,metalness:0},
 venous:{roughness:.48,metalness:0},
 nervous:{roughness:.58,metalness:0},
 sensory:{roughness:.48,metalness:0},
 integumentary:{roughness:.7,metalness:0},
};
export const INSPECTION_VIEWS=[
 {id:'all',name:'Tổng quan',systems:null},
 {id:'structure',name:'Cơ · xương · mô liên kết',systems:['skeletal','muscular','connective']},
 {id:'skeletal',name:'Xương và khớp',systems:['skeletal']},
 {id:'muscular',name:'Hệ cơ',systems:['muscular']},
 {id:'connective',name:'Mô liên kết',systems:['connective']},
 {id:'vessels',name:'Mạch máu',systems:['arterial','venous']},
 {id:'nerves',name:'Thần kinh và giác quan',systems:['nervous','sensory']},
];
export function inspectionVisible(group,view='all',hiddenSystems){
 if(hiddenSystems?.has(group.system))return false;
 if(view.startsWith('system:'))return group.system===view.slice(7);
 const profile=INSPECTION_VIEWS.find(p=>p.id===view);
 return !profile?.systems||profile.systems.includes(group.system);
}
export function availableInspectionViews(groups){
 const profiles=INSPECTION_VIEWS.filter(view=>!view.systems||groups.some(group=>view.systems.includes(group.system)));
 const single=new Set(profiles.filter(view=>view.systems?.length===1).map(view=>view.systems[0]));
 return [...profiles,...Object.entries(SYSTEM_LABELS).filter(([system])=>!single.has(system)&&groups.some(group=>group.system===system)).map(([system,name])=>({id:'system:'+system,name,systems:[system]}))];
}
