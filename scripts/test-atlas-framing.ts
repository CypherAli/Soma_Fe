import assert from 'node:assert/strict';
import fs from 'node:fs';
import { atlasScenes } from '../src/lib/humanAtlas/scenes';
import { Box3, PerspectiveCamera, Vector3 } from 'three';
import { frameAnatomyBox } from '../src/lib/humanAtlas/cameraFraming';

let cases = 0;
for (const [width, height] of [[1920, 860], [1280, 720], [390, 844], [844, 390]]) {
  const viewport = { left: width * .2, right: width * .78, top: height * .15, bottom: height * .75 };
  for (const scale of [.0001, .1, 1, 10]) {
    const box = new Box3(new Vector3(-.2, 1.5, -.1).multiplyScalar(scale), new Vector3(.2, 1.8, .1).multiplyScalar(scale));
    for (const direction of [new Vector3(.2,.1,1), new Vector3(1,.1,.15), new Vector3(0,1,-.35), new Vector3(0,-1,-.35), new Vector3(-.2,.1,-1)]) {
      const camera = new PerspectiveCamera(40,width/height,.00001,1000);
      camera.position.set(100,-60,30);camera.lookAt(-20,30,4);
      const result = frameAnatomyBox(camera,box,direction,width,height,viewport);
      assert(Number.isFinite(result.distance));
      const center = result.center.clone().project(camera);
      assert(Math.abs((center.x+1)*width/2-(viewport.left+viewport.right)/2)<1e-6);
      assert(Math.abs((1-center.y)*height/2-(viewport.top+viewport.bottom)/2)<1e-6);
      for(let corner=0;corner<8;corner++) {
        const p=new Vector3(corner&1?box.max.x:box.min.x,corner&2?box.max.y:box.min.y,corner&4?box.max.z:box.min.z).project(camera);
        const x=(p.x+1)*width/2,y=(1-p.y)*height/2;
        assert(x>=viewport.left&&x<=viewport.right&&y>=viewport.top&&y<=viewport.bottom,`Clipped corner: ${x}, ${y}`);
      }
      cases++;
    }
  }
}
console.log(`Passed ${cases} framing cases, including tiny isolated structures and stale camera poses.`);

const atlas = JSON.parse(fs.readFileSync('public/human-atlas/atlas.json','utf8'));
const parts = new Map(atlas.parts.map((p:{id:string;bounds:number[][]})=>[p.id,p.bounds]));
let groups = 0;
for (const scene of Object.values(atlasScenes)) {
  for (const group of scene.groups) {
    const box = new Box3();
    for (const id of group.parts) {
      const bounds = parts.get(id) as number[][] | undefined;
      assert(bounds,`Missing mesh ${scene.slug}/${group.key}/${id}`);
      box.union(new Box3(new Vector3().fromArray(bounds[0]),new Vector3().fromArray(bounds[1])));
    }
    assert(!box.isEmpty(),`Empty group ${scene.slug}/${group.key}`);
    for (const direction of [new Vector3(.2,.1,1),new Vector3(1,.1,.15),new Vector3(-.2,.1,-1),new Vector3(0,1,-.35)]) {
      const camera = new PerspectiveCamera(40,1280/720,.01,1000);
      const viewport = {left:330,right:860,top:150,bottom:540};
      const result = frameAnatomyBox(camera,box,direction,1280,720,viewport);
      assert(Number.isFinite(result.distance));
      for(let corner=0;corner<8;corner++) {
        const p = new Vector3(corner&1?box.max.x:box.min.x,corner&2?box.max.y:box.min.y,corner&4?box.max.z:box.min.z).project(camera);
        const x=(p.x+1)*640,y=(1-p.y)*360;
        assert(x>=viewport.left&&x<=viewport.right&&y>=viewport.top&&y<=viewport.bottom,`Group fit failed ${scene.slug}/${group.key}`);
      }
    }
    groups++;
  }
}
console.log(`Passed bounds projection for ${groups} real groups across ${Object.keys(atlasScenes).length} pages in four camera directions.`);
