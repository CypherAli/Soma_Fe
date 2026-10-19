import data from './data/learning.generated.json' with {type:'json'};
import type { T3 } from '../homeContent';
import type { ContentResolver } from '../content/resolve';

export interface LearningSource {title:string;page?:number;path?:string;url?:string}
export interface PartLearning {name?:T3;latin?:string;note?:T3;sources:LearningSource[];topics:{name:T3;latin?:string;note:T3;slug:string;key:string;parts:number}[]}
const entries=data.entries as Record<string,Omit<PartLearning,'topics'>&{topics:string[]}>;
const topics=data.topics as Record<string,PartLearning['topics'][number]>;
export function partLearning(id:string,content?:Pick<ContentResolver,'document'>):PartLearning|undefined{
  const original=entries[id];
  if(!original)return undefined;
  const entry=content?.document(`learning:${id}`,original)??original;
  return {...entry,topics:entry.topics.map(key=>content?.document(`topic:${key}`,topics[key])??topics[key]).filter(Boolean)};
}
