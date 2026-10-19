import { atlasScenes } from './scenes';
import { pick, type Loc } from '../homeContent';
import type { AtlasSceneGroup } from './scenes/types';
import { partLearning } from './learning';
import type { ContentResolver } from '../content/resolve';

// Use the narrowest editorial group. A group label is kept distinct from an
// exact mesh name by appending its source ID when no individual term is known.
const groupsByPart=new Map<string,AtlasSceneGroup>();
for(const scene of Object.values(atlasScenes))for(const group of scene.groups)for(const id of group.parts){
  const old=groupsByPart.get(id);
  if(!old||group.parts.length<old.parts.length)groupsByPart.set(id,group);
}

export function localizedPartName(part:{id:string;name:string;system?:string},loc:Loc,content?:Pick<ContentResolver,'document'|'resolve'>):string {
  if(loc==='en')return part.name;
  const individual=partLearning(part.id,content)?.name?.[loc];
  if(individual){const side=/\bleft\b/i.test(part.name)?pick({vi:'trái',en:'left',zh:'左'},loc):/\bright\b/i.test(part.name)?pick({vi:'phải',en:'right',zh:'右'},loc):'';return side&&!individual.toLowerCase().includes(side)?`${individual} · ${side}`:individual;}
  const originalGroup=groupsByPart.get(part.id);
  const group=content?.resolve(originalGroup)??originalGroup;
  const side=/^left\b/i.test(part.name)?pick({vi:'trái',en:'left',zh:'左'},loc):/^right\b/i.test(part.name)?pick({vi:'phải',en:'right',zh:'右'},loc):'';
  if(group){
    const name=pick(group.name,loc);
    if(group.parts.length===1)return name;
    if(group.parts.length===2&&side)return `${name} · ${side}`;
    return `${name} · ${part.id}`;
  }
  return `${pick({vi:'Cấu trúc',en:'Structure',zh:'结构'},loc)} · ${part.id}`;
}

export function localizedPartNames(parts:readonly {id:string;name:string;system?:string}[],loc:Loc,content?:Pick<ContentResolver,'document'|'resolve'>){
  return Object.fromEntries(parts.map(part=>[part.id,localizedPartName(part,loc,content)]));
}
