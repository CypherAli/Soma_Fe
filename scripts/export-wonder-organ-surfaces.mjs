// Fill the two organ surfaces missing from the packed atlas with existing local anatomical GLBs.
import fs from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { createRequire } from 'node:module';
import { NodeIO } from '@gltf-transform/core';
import { KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { Matrix4,Matrix3,Vector3 } from 'three';
import { SYSTEMS } from '../src/lib/humanAtlas/anatomy.ts';
const draco=createRequire(import.meta.url)('draco3dgltf');
const io=new NodeIO().registerExtensions([KHRDracoMeshCompression]).registerDependencies({'draco3d.decoder':await draco.createDecoderModule()});
for(const [id,file,system] of [['lungs','lung_anatomy','respiratory'],['liver','liver_anatomy','digestive']]){
 const doc=await io.read(`public/models/${file}.glb`),groups=[],parts=[],pos=[],norm=[];let start=0;
 for(const node of doc.getRoot().listNodes()){
  const mesh=node.getMesh();if(!mesh)continue;
  const matrix=new Matrix4().fromArray(node.getWorldMatrix()),normalMatrix=new Matrix3().getNormalMatrix(matrix),positions=[],normals=[];
  for(const prim of mesh.listPrimitives()){
   const p=prim.getAttribute('POSITION'),n=prim.getAttribute('NORMAL'),idx=prim.getIndices(),length=idx?.getCount()||p.getCount();
   for(let j=0;j<length;j++){
    const winding=matrix.determinant()<0?j-j%3+[0,2,1][j%3]:j,i=idx?idx.getScalar(winding):winding,xyz=[];
    p.getElement(i,xyz);const v=new Vector3().fromArray(xyz).applyMatrix4(matrix);positions.push(v.x,v.y,v.z);
    if(n){n.getElement(i,xyz);v.fromArray(xyz).applyMatrix3(normalMatrix).normalize();normals.push(v.x,v.y,v.z);}else normals.push(0,0,1);
   }
  }
  const label=node.getName(),count=positions.length;
  groups.push({system,label,color:SYSTEMS.find(s=>s.id===system).color,offset:[0,0,0],stage:0,start,count,info:'',cover:false});
  parts.push({id:label,name:label,system,triangles:count/9});pos.push(Buffer.from(new Float32Array(positions).buffer));norm.push(Buffer.from(new Float32Array(normals).buffer));start+=count;
 }
 const base=`public/wonder/assets/regions/${id}`;
 await fs.writeFile(base+'.bin.gz',gzipSync(Buffer.concat(pos)));await fs.writeFile(base+'.normals.bin.gz',gzipSync(Buffer.concat(norm)));
 await fs.writeFile(base+'.json',JSON.stringify({source:`/models/${file}.glb`,normals:true,groups,parts}));
 console.log('PASS local solid organ',id,parts.length,'parts',start/9,'triangles');
}
