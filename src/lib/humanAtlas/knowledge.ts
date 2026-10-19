import { atlasScenes } from './scenes';
import { fold } from '../anatomy/knowledge';
import type { Loc } from '../homeContent';

/** Curated scene groups and landmarks, kept separate from GLB quiz facts. */
export function searchAtlasKnowledge(query:string,locale:Loc,limit=6){
  const raw=query.trim().toLowerCase(),q=fold(raw);
  if(!q)return [];
  const tokens=q.split(/[^\p{L}\p{N}]+/u).filter(t=>t.length>1);
  const results=[];
  for(const scene of Object.values(atlasScenes))for(const group of scene.groups){
    const entries=[{name:group.name,latin:group.latin,note:group.note,source:undefined as string|undefined},...(group.landmarks??[])];
    for(const [index,entry] of entries.entries()){
      const detail=entry.note?.[locale];if(!detail)continue;
      const labels=[entry.name[locale],entry.name.vi,entry.name.en,entry.latin??''].filter(Boolean).map(fold);
      const name=labels.join(' '),matched=tokens.filter(token=>name.split(/[^\p{L}\p{N}]+/u).includes(token)).length;
      const exact=labels.some(label=>label===q||(` ${q} `).includes(` ${label} `));
      if(!exact&&(tokens.length<2||matched<2))continue;
      const score=(exact?40:0)+matched*8+(name.includes(q)?20:0);
      results.push({score,id:`atlas:${scene.slug}/${group.key}/${index}`,title:entry.name[locale],detail,href:`/giai-phau/mo-hinh/${scene.slug}?focus=${encodeURIComponent(group.key)}`,meta:[entry.latin,entry.source].filter(Boolean).join(' · ')});
    }
  }
  const seen=new Set<string>();
  return results.sort((a,b)=>b.score-a.score).filter(result=>{const key=result.title+'|'+result.detail;if(seen.has(key))return false;seen.add(key);return true;}).slice(0,limit);
}
