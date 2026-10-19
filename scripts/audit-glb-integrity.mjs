import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const files = [];
function scan(directory) {
  for (const entry of fs.readdirSync(directory,{withFileTypes:true})) {
    const file=path.join(directory,entry.name);
    if(entry.isDirectory() && entry.name!=='node_modules') scan(file);
    else if(entry.isFile() && file.endsWith('.glb')) files.push(file);
  }
}
scan('public');
const records=[];
for(const file of files) {
  try {
    const buffer=fs.readFileSync(file); assert.equal(buffer.readUInt32LE(0),0x46546c67); assert.equal(buffer.readUInt32LE(4),2); assert.equal(buffer.readUInt32LE(8),buffer.length);
    const length=buffer.readUInt32LE(12); assert.equal(buffer.readUInt32LE(16),0x4e4f534a); assert(20+length<=buffer.length);
    const gltf=JSON.parse(buffer.subarray(20,20+length).toString('utf8').trim()); assert.equal(gltf.asset.version,'2.0');
    assert(gltf.meshes?.length>0);
    for(const view of gltf.bufferViews??[]) { const source=gltf.buffers?.[view.buffer]; assert(source); assert((view.byteOffset??0)>=0 && view.byteLength>0 && (view.byteOffset??0)+view.byteLength<=source.byteLength); }
    for(const mesh of gltf.meshes) for(const primitive of mesh.primitives) {
      const position=gltf.accessors?.[primitive.attributes.POSITION]; assert(position && position.count>0);
      if(position.min && position.max) assert(position.min.every((value,i)=>Number.isFinite(value) && Number.isFinite(position.max[i]) && value<=position.max[i]));
      if(primitive.indices!==undefined) assert(gltf.accessors?.[primitive.indices]?.count>0);
      if(primitive.material!==undefined) assert(gltf.materials?.[primitive.material]);
    }
    for(const node of gltf.nodes??[]) {
      if(node.mesh!==undefined) assert(gltf.meshes[node.mesh]);
      for(const child of node.children??[]) assert(gltf.nodes[child]);
      for(const key of ['matrix','translation','rotation','scale']) if(node[key]) assert(node[key].every(Number.isFinite));
    }
    records.push({file:file.replaceAll('\\','/'),bytes:buffer.length,meshes:gltf.meshes.length,passed:true});
  } catch(error) {records.push({file:file.replaceAll('\\','/'),passed:false,error:error.message});}
}
const report={at:new Date().toISOString(),files:records.length,failures:records.filter(row=>!row.passed),records};
fs.writeFileSync('docs/audits/glb-integrity-qa.json',JSON.stringify(report,null,2)+'\n');
console.log(`${report.files} GLB files checked recursively: ${report.failures.length} invalid headers, meshes, buffer ranges or transforms.`);
assert.equal(report.failures.length,0);
