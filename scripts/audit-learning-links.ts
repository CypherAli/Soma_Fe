import fs from 'node:fs';
import { atlasScenes } from '../src/lib/humanAtlas/scenes';
import { PATHOLOGY_SCENE } from '../src/lib/pathologyScene';
import { catalogScenes } from '../src/lib/catalog';
const rows=Object.entries(PATHOLOGY_SCENE).map(([disease,target])=>{
  const scene=atlasScenes[target.scene];
  return {disease,...target,title:scene?.title.vi,valid:!!scene&&(!target.focus||scene.groups.some(group=>group.key===target.focus))};
});
const chunks=fs.readFileSync('data/pathology-chunks.jsonl','utf8').trim().split(/\r?\n/).map(line=>JSON.parse(line));
const summary={modelLessons:catalogScenes.length,pathologyLinks:rows.length,invalidLinks:rows.filter(row=>!row.valid),pathologyChunks:chunks.length,pathologyArticles:new Set(chunks.map(chunk=>chunk.slug)).size,chunksWithoutPage:chunks.filter(chunk=>!chunk.page||!chunk.pdfPage).length};
fs.writeFileSync('docs/audits/learning-links.json',JSON.stringify({summary,pathology:rows},null,2));
console.log(JSON.stringify(summary,null,2));
