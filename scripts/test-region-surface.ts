import assert from 'node:assert/strict';
import * as THREE from 'three';
import { allocateSurfaceCounts, sampleRegionSurface, surfaceDistribution } from '../src/lib/anatomy/regionSurface.ts';

// Two disconnected triangles, areas .5 and 2. Sampling should favour the latter 4:1.
const geo=new THREE.BufferGeometry();
geo.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0, 1,0,0, 0,1,0, 10,0,0, 12,0,0, 10,2,0],3));
assert.equal(surfaceDistribution(geo).area,2.5);
const samples=sampleRegionSurface(geo,10000,42);
const positions=samples.getAttribute('position');
let right=0;
for(let i=0;i<positions.count;i++){
  const x=positions.getX(i),y=positions.getY(i);
  assert.equal(positions.getZ(i),0,'Every sample stays on the exact surface');
  if(x>=10){right++;assert(x-10+y<=2.000001);}else assert(x+y<=1.000001);
}
assert(right>7800 && right<8200,`Area allocation: ${right}`);
assert.deepEqual(samples.getAttribute('position').array,sampleRegionSurface(geo,10000,42).getAttribute('position').array);
const counts=allocateSurfaceCounts([1,4,5],90000);
assert.equal(counts.reduce((a,b)=>a+b,0),90000);
assert(counts[2]>counts[1] && counts[1]>counts[0]);
assert.deepEqual(allocateSurfaceCounts([1,1,1],2),[1,1,0]);
assert.deepEqual(allocateSurfaceCounts([],10),[]);
console.log('PASS: exact surface, area-weighted sampling, deterministic seed, exact budgets');
