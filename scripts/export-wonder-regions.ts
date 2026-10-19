import fs from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { NodeIO } from '@gltf-transform/core';
import { KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { weld, simplify } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
import { createRequire } from 'node:module';
import { Matrix4, Vector3 } from 'three';
import { CATS, MAT, pickCat } from '../src/lib/anatomy/layers.ts';
import { GESTURE_REGIONS, REGION_OFFSETS } from '../src/lib/anatomy/gestureRegions.ts';

const draco = createRequire(import.meta.url)('draco3dgltf');
const io = new NodeIO().registerExtensions([KHRDracoMeshCompression]).registerDependencies({'draco3d.decoder': await draco.createDecoderModule()});
await MeshoptSimplifier.ready;
// Historical Z-Anatomy pipeline. Current /cu-chi uses export-wonder-atlas-regions.mjs.
const output='public/wonder/assets/legacy-regions';
await fs.mkdir(output, {recursive:true});
for (const region of GESTURE_REGIONS) {
  if (process.argv[2] && region.id !== process.argv[2]) continue;
  const doc = await io.read(`public/models/gesture/${region.id}.glb`);
  await doc.transform(weld(),simplify({simplifier:MeshoptSimplifier,ratio:.4,error:.0005}));
  const groups = new Map<string, number[]>();
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh(); if (!mesh) continue;
    const name = String(node.getExtras().anatomyName || node.getName());
    const cat = pickCat(name);
    const triangles = groups.get(cat) || []; groups.set(cat,triangles);
    const matrix = new Matrix4().fromArray(node.getWorldMatrix());
    for (const prim of mesh.listPrimitives()) {
      const positions = prim.getAttribute('POSITION')!;
      const indices = prim.getIndices(); const count = indices?.getCount() || positions.getCount();
      const v = new Vector3(); const xyz:number[] = [];
      for (let i=0;i<count;i++) {
        const vertex=matrix.determinant()<0 ? i-i%3+[0,2,1][i%3] : i;
        positions.getElement(indices ? indices.getScalar(vertex) : vertex, xyz);
        v.fromArray(xyz).applyMatrix4(matrix);
        triangles.push(v.x,v.y,v.z);
      }
    }
  }
  let start=0; const metadata=[]; const buffers=[];
  for (const [cat, triangles] of groups) {
    const data = new Float32Array(triangles);
    const c = CATS.find(c=>c.key===cat)!;
    metadata.push({label:c.label,color:'#'+MAT[c.key].color.getHexString(),offset:REGION_OFFSETS[c.key].map(v=>v*.22),stage:0,start,count:data.length,info:`${c.label} · ${region.latin}`});
    buffers.push(Buffer.from(data.buffer)); start+=data.length;
  }
  await fs.writeFile(`${output}/${region.id}.bin.gz`,gzipSync(Buffer.concat(buffers)));
  await fs.writeFile(`${output}/${region.id}.json`,JSON.stringify({groups:metadata}));
  console.log(region.id, start/9, 'triangles',start*4,'bytes');
}
