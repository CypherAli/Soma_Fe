import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';

// Metadata corrections only; binary geometry offsets and original names stay intact.
const file='public/human-atlas/atlas.json';
const source=readFileSync(file,'utf8');
const atlas=JSON.parse(source);
const brain=new Set(['FJ1730','FJ1731','FJ1752','FJ1767','FJ1814']);
const papillary=new Set(['FJ2418','FJ2419','FJ2429','FJ2430','FJ2437']);
for(const part of atlas.parts){
  if(brain.has(part.id)){
    assert(/ventricle|interventricular foramen/i.test(part.name));
    part.system='nervous';
  }
  if(papillary.has(part.id)){
    assert(/papillary muscle/i.test(part.name));
    part.system='cardiac';
  }
}
const indentation=source.includes('\n  "')?2:undefined;
writeFileSync(file,JSON.stringify(atlas,null,indentation)+(source.endsWith('\n')?'\n':''));
const sceneFile='src/lib/humanAtlas/scenes/wholeBody.ts';
let scene=readFileSync(sceneFile,'utf8');
for(const system of new Set(atlas.parts.map(part=>part.system))){
  assert(/^[a-z]+$/.test(system));
  const expression=new RegExp('("key": "'+system+'"[\\s\\S]*?"parts": )\\[[^\\]]*\\]');
  assert(expression.test(scene),`Missing whole-body group ${system}`);
  scene=scene.replace(expression,(_,prefix)=>prefix+JSON.stringify(atlas.parts.filter(part=>part.system===system).map(part=>part.id)));
}
writeFileSync(sceneFile,scene);
console.log('Corrected cerebral ventricles and cardiac papillary muscles; regenerated whole-body memberships.');
