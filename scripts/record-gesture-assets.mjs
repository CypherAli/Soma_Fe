import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { CATS, MAT } from '../src/lib/anatomy/layers.ts';
const base='public/models/gesture/';
const manifest=JSON.parse(await fs.readFile(base+'manifest.json','utf8'));
for(const [id,zRange] of [['head',[1.49,1.8]],['neck',[1.425,1.575]],['thorax',[1.2,1.425]],['bust',[1.2,1.8]]]){
  const raw=await fs.readFile(base+id+'.glb');
  const json=JSON.parse(raw.subarray(20,20+raw.readUInt32LE(12)).toString());
  manifest.regions[id]={...manifest.regions[id],zRange,bytes:raw.length,sha256:createHash('sha256').update(raw).digest('hex'),meshes:json.meshes.length,
    parts:json.nodes.filter(n=>n.mesh!==undefined).map(n=>({name:n.extras?.anatomyName||n.name,system:n.extras?.anatomySystem||''}))};
  const file=`public/wonder/assets/regions/${id}.json`;
  const meta=JSON.parse(await fs.readFile(file,'utf8'));
  if(meta.source==='/human-atlas/atlas.json')throw new Error('BodyParts3D runtime: use export-wonder-atlas-regions.mjs; legacy Z-Anatomy records must not overwrite these assets.');
  for(const g of meta.groups){g.info=g.label;const cat=CATS.find(c=>c.label===g.label);if(cat)g.color='#'+MAT[cat.key].color.getHexString();}
  meta.sourceGlbSha256=manifest.regions[id].sha256;
  meta.surfaceGzipSha256=createHash('sha256').update(await fs.readFile(`public/wonder/assets/regions/${id}.bin.gz`)).digest('hex');
  await fs.writeFile(file,JSON.stringify(meta));
}
await fs.writeFile(base+'manifest.json',JSON.stringify(manifest,null,2));
