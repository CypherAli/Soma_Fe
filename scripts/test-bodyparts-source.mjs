import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { unzipSync } from 'fflate';
import { createHash } from 'node:crypto';
import { parseBodyPartsObj } from './lib/bodyparts-obj.mjs';
const mesh=parseBodyPartsObj('v 10 20 30\nv 20 20 30\nv 10 30 30\nvn 0 1 0\nvn 0 1 0\nvn 0 1 0\nf 1//1 2//2 3//3');
assert.ok(Math.abs(mesh.pos[0]-.01)<1e-7);
assert.ok(Math.abs(mesh.pos[1]-.1081112)<1e-7);
assert.ok(Math.abs(mesh.pos[2]+.12)<1e-7);
assert.deepEqual([...mesh.norm.slice(0,3)],[0,0,-32767]);
assert.deepEqual([...mesh.idx],[0,1,2]);
assert.throws(()=>parseBodyPartsObj('v 0 0 0\nvn 0 1 0\nf 1//2 1//2 1//2'));
const sources=new Map();let archiveHash=null;
for(const id of ['arm','forearm','upper-limb','hand','wrist','fingers','thumb','index-finger','middle-finger','ring-finger','little-finger','head','neck']){
 const meta=JSON.parse(await fs.readFile(`public/wonder/assets/regions/${id}.json`));
 assert.equal(meta.quality.sourceOptimized,false);
 assert.match(meta.geometrySourceSha256,/^[a-f0-9]{64}$/);
 archiveHash??=meta.geometrySourceSha256;assert.equal(meta.geometrySourceSha256,archiveHash);
 for(const part of meta.parts){if(sources.has(part.id))assert.equal(sources.get(part.id),part.sourceTriangles);sources.set(part.id,part.sourceTriangles);}
 assert.ok(meta.parts.reduce((n,p)=>n+p.sourceTriangles,0)>meta.parts.reduce((n,p)=>n+p.packedTriangles,0),'must contain additional real source geometry');
 assert.ok(Number.isInteger(meta.quality.unresolvedCuts)&&meta.quality.unresolvedCuts>=0);
 if(['hand','wrist','fingers','head'].includes(id))assert.equal(meta.quality.unresolvedCuts,0);
 console.log('PASS source detail',id,meta.parts.length,'structures');
}
// Validate the locally cached build input when available; it is not a runtime asset.
let archive;
try{archive=await fs.readFile(process.env.WONDER_OBJ_ZIP||'.cache/bodyparts3d/isa_BP3D_4.0_obj_99.zip');}catch(error){if(error.code!=='ENOENT')throw error;}
if(archive){
 assert.equal(createHash('sha256').update(archive).digest('hex'),archiveHash);
 const files=unzipSync(archive,{filter:f=>f.name.endsWith('.obj')&&sources.has(path.basename(f.name,'.obj'))});
 assert.equal(Object.keys(files).length,sources.size);
 for(const [name,data] of Object.entries(files)){const mesh=parseBodyPartsObj(new TextDecoder().decode(data));assert.equal(mesh.idx.length/3,sources.get(path.basename(name,'.obj')));}
 console.log('PASS archive hash, source face counts and original normal indices',sources.size,'OBJ meshes');
}
