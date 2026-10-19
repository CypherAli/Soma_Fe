import type { SceneLabel } from './anatomy';
import type { AtlasSceneDef } from './scenes/types';
import { pick, type Loc } from '../homeContent';
import { localizedPartName } from './partNames';

export function createSceneLabels(scene:AtlasSceneDef, parts:readonly {id:string;name:string}[], loc:Loc, state:{isolate:boolean;selected:string[];explode:number}):SceneLabel[] {
  const names=new Map(parts.map(part=>[part.id,part.name]));
  const numbered=new Map([...new Set(scene.groups.flatMap(group=>group.parts))].map((id,index)=>[id,index+1]));
  const selected=new Set(state.selected);
  const individual=state.isolate||state.explode>0;
  const crowded=!state.isolate&&numbered.size>12&&state.explode>0;
  const labels:SceneLabel[]=[];
  const seen=new Set<string>();
  for(const group of scene.groups) {
    const ids=group.parts.filter(id=>!state.isolate||selected.has(id));
    if(!ids.length)continue;
    const color=group.tint??'#9aa4ae';
    if(individual) {
      for(const id of ids) {
        if(seen.has(id))continue;
        seen.add(id);
        const number=numbered.get(id)!;
        const sourceName=names.get(id)??pick(group.name,loc);
        const name=localizedPartName({id,name:sourceName},loc);
        labels.push({key:`${group.key}::part::${id}`,ids:[id],text:crowded?String(number):name,title:`${number}. ${name}`,color});
      }
    } else if(!scene.fadedGroups?.includes(group.key)) {
      labels.push({key:group.key,ids,text:pick(group.name,loc),color});
    }
    group.landmarks?.forEach((landmark,index)=>{
      const anchors=landmark.anchors?.filter(anchor=>ids.includes(anchor.partId))??[];
      for(const anchor of state.explode>0?anchors:anchors.slice(0,1)) {
        labels.push({key:`${group.key}::landmark::${index}::${anchor.partId}`,ids:[anchor.partId],anchor:anchor.position,text:pick((state.explode>0||ids.length===1)?landmark.separatedName??landmark.name:landmark.name,loc),title:landmark.latin,color:'#d69c50'});
      }
    });
  }
  return labels;
}
