import { atlasScenes } from './scenes';
import { pick, type Loc } from '../homeContent';
import type { AtlasSceneGroup } from './scenes/types';
import { partLearning } from './learning';
import type { ContentResolver } from '../content/resolve';
import type { Concept } from './anatomy';
import { bindContentSource } from '../content/source';

const CONCEPT_NAMES=bindContentSource('data:src/lib/humanAtlas/partNames.ts#CONCEPT_NAMES',{
  heart:{vi:'Tim',en:'Heart',zh:'心脏'},brain:{vi:'Não',en:'Brain',zh:'脑'},
  liver:{vi:'Gan',en:'Liver',zh:'肝'},stomach:{vi:'Dạ dày',en:'Stomach',zh:'胃'},
  spleen:{vi:'Lách',en:'Spleen',zh:'脾'},pancreas:{vi:'Tụy',en:'Pancreas',zh:'胰腺'},
  'urinary bladder':{vi:'Bàng quang',en:'Urinary bladder',zh:'膀胱'},trachea:{vi:'Khí quản',en:'Trachea',zh:'气管'},
});

// Use the narrowest editorial group. A group label is kept distinct from an
// exact mesh name by appending its source ID when no individual term is known.
const groupsByPart=new Map<string,AtlasSceneGroup>();
const groupsByName=new Map<string,AtlasSceneGroup>();
for(const scene of Object.values(atlasScenes))for(const group of scene.groups){
  if(!groupsByName.has(group.name.en.toLowerCase()))groupsByName.set(group.name.en.toLowerCase(),group);
  for(const id of group.parts){
    const old=groupsByPart.get(id);
    if(!old||group.parts.length<old.parts.length)groupsByPart.set(id,group);
  }
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
    return `${name} — ${part.name}`;
  }
  return `${pick({vi:'Cấu trúc',en:'Structure',zh:'结构'},loc)} · ${part.id}`;
}

/** A compound concept must never inherit the identity of its first mesh. */
export function conceptGroup(concept: Concept, content?: Pick<ContentResolver,'resolve'>) {
  const source=groupsByName.get(concept.name.toLowerCase());
  return content?.resolve(source)??source;
}

export function localizedConceptName(concept: Concept, loc: Loc, content?: Pick<ContentResolver,'document'|'resolve'>): string {
  const names=content?.resolve(CONCEPT_NAMES)??CONCEPT_NAMES;
  const common=names[concept.name.toLowerCase() as keyof typeof names];
  if(common)return pick(common,loc);
  const group=conceptGroup(concept,content);
  return group?pick(group.name,loc):concept.name;
}

export function localizedPartNames(parts:readonly {id:string;name:string;system?:string}[],loc:Loc,content?:Pick<ContentResolver,'document'|'resolve'>){
  return Object.fromEntries(parts.map(part=>[part.id,localizedPartName(part,loc,content)]));
}
