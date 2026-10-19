import assert from 'node:assert/strict';
import fs from 'node:fs';
import { atlasScenes } from '../src/lib/humanAtlas/scenes';
import { partLearning } from '../src/lib/humanAtlas/learning';
import { searchAtlasKnowledge } from '../src/lib/humanAtlas/knowledge';
const atlas=JSON.parse(fs.readFileSync('public/human-atlas/atlas.json','utf8'));
let links=0;
for(const part of atlas.parts){
  const info=partLearning(part.id);assert(info);
  if(info.name||info.note)assert(info.sources.length,'Individual terms and notes must retain their provenance');
  for(const topic of info.topics){
    assert(atlasScenes[topic.slug]?.groups.find(g=>g.key===topic.key)?.parts.includes(part.id),'Related notes must belong to the selected mesh');links++;
  }
}
const foramen=searchAtlasKnowledge('lo bau duc','vi')[0];
assert.equal(foramen.title,'Lỗ bầu dục');
assert(foramen.href.includes('focus=xuong-buom'));
assert(foramen.detail.includes('V3'));
assert(searchAtlasKnowledge('khop doc','vi').some(hit=>hit.title==='Khớp dọc'));
assert(searchAtlasKnowledge('van hai la','vi').some(hit=>hit.title.toLowerCase().includes('hai lá')));
assert.deepEqual(searchAtlasKnowledge('zzunknownxyz','vi'),[]);
assert(partLearning('FJ3394')?.name?.vi==='Xương bướm');
console.log(`Passed provenance and ownership for ${atlas.parts.length} meshes / ${links} related notes, Vietnamese atlas retrieval and empty results.`);
