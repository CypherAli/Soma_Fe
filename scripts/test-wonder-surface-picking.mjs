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
front.userData.pickable=true;
assert.equal(surface.pick(200,200,400,400),10,'a detailed source proxy remains pickable under its batched overview');
front.userData.pickable=false;
assert.equal(surface.pick(200,200,400,400),20,'a filtered source proxy cannot intercept clicks');
delete front.userData.pickable;
front.visible=true;front.userData.uniforms.cutOn.value=1;front.userData.uniforms.cut.value=-.1;
assert.equal(surface.pick(200,200,400,400),20,'discarded cross-section does not intercept clicks');
assert.equal(surface.pick(0,0,400,400),-1,'empty background does not select a nearby tag');
surface.ready=false;assert.equal(surface.pick(200,200,400,400),-1);
for(const mesh of surface.meshes){mesh.geometry.dispose();mesh.material.dispose();}
const vertices=new T.BufferAttribute(new Float32Array([-.5,-.5,-2,.5,-.5,-2,0,.5,-2,-.5,-.5,-4,.5,-.5,-4,0,.5,-4]),3);
const proxies=[0,1].map(i=>{
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',vertices);geometry.setDrawRange(i*3,3);
 geometry.boundingBox=new T.Box3(new T.Vector3(-.5,-.5,-2-i*2),new T.Vector3(.5,.5,-2-i*2));
 geometry.boundingSphere=geometry.boundingBox.getBoundingSphere(new T.Sphere());
 const mesh=new T.Mesh(geometry,new T.MeshStandardMaterial());mesh.visible=false;
 mesh.userData={g:{pick:51+i},pickable:true,uniforms:{cutOn:{value:0},cut:{value:0}}};mesh.updateMatrixWorld();return mesh;
});
surface.ready=true;surface.meshes=proxies;
assert.equal(surface.pick(200,200,400,400),51,'shared buffer draw ranges preserve exact front-part picking');
proxies[0].userData.pickable=false;
assert.equal(surface.pick(200,200,400,400),52,'filtering one range reveals the other source part');
for(const mesh of proxies){mesh.geometry.dispose();mesh.material.dispose();}
console.log('PASS visible surface picking, occlusion, hidden meshes, cross-sections and background');
