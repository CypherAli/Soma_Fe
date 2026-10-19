import assert from 'node:assert/strict';
import * as T from '../public/wonder/vendor/three.module.js';
import { AtlasSurface } from '../public/wonder/src/gl/atlas-surface.js';
const surface=Object.create(AtlasSurface.prototype);
surface.ready=true;surface.camera=new T.PerspectiveCamera(50,1,.1,100);
surface.camera.updateMatrixWorld();
function box(z,pick){
 const mesh=new T.Mesh(new T.BoxGeometry(1,1,.4),new T.MeshStandardMaterial());
 mesh.position.z=z;mesh.updateMatrixWorld();
 mesh.userData={g:{pick},uniforms:{cutOn:{value:0},cut:{value:0}}};return mesh;
}
const front=box(-2,10),back=box(-4,20);surface.meshes=[back,front];
assert.equal(surface.pick(200,200,400,400),10,'select visible front surface, not overlapping rear label');
front.visible=false;assert.equal(surface.pick(200,200,400,400),20,'hidden structures cannot intercept clicks');
front.visible=true;front.userData.uniforms.cutOn.value=1;front.userData.uniforms.cut.value=-.1;
assert.equal(surface.pick(200,200,400,400),20,'discarded cross-section does not intercept clicks');
assert.equal(surface.pick(0,0,400,400),-1,'empty background does not select a nearby tag');
surface.ready=false;assert.equal(surface.pick(200,200,400,400),-1);
for(const mesh of surface.meshes){mesh.geometry.dispose();mesh.material.dispose();}
console.log('PASS visible surface picking, occlusion, hidden meshes, cross-sections and background');
