import * as T from '../../vendor/three.module.js';
import { TISSUE_MATERIALS, inspectionVisible } from '../models/inspection.js';
import { RoomEnvironment } from '../../vendor/RoomEnvironment.js';
import { partTransform, partPageVisible } from '../logic/inspection-controls.js';

// PBR pipeline and room IBL shared with, tissue materials and inspection lighting adapted from /viewer/AtlasScene.
// Only the pose comes from WonderSnap; there is no second camera/gesture controller.
export class AtlasSurface {
 pick(x,y,width,height){
  if(!this.ready||!width||!height)return -1;
  this.raycaster??=new T.Raycaster();
  this.raycaster.setFromCamera(new T.Vector2(x/width*2-1,1-y/height*2),this.camera);
  for(const hit of this.raycaster.intersectObjects(this.meshes.filter(mesh=>mesh.userData.pickable??mesh.visible),false)){
   const {g,uniforms}=hit.object.userData;
   if(uniforms.cutOn.value>.5&&hit.point.x>uniforms.cut.value)continue;
   if(g.pick>=0)return g.pick;
  }
  return -1;
 }
 constructor(canvas,gl){
  this.renderer=new T.WebGLRenderer({canvas,context:gl});this.renderer.autoClear=false;
  this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=.75;
  this.scene=new T.Scene();this.root=new T.Group();this.scene.add(this.root);this.camera=new T.PerspectiveCamera();this.camera.matrixAutoUpdate=false;
  const room=new RoomEnvironment(),pmrem=new T.PMREMGenerator(this.renderer);this.env=pmrem.fromScene(room,.04);this.scene.environment=this.env.texture;this.scene.environmentIntensity=.55;room.dispose();pmrem.dispose();
  this.scene.add(new T.HemisphereLight(0xffffff,0x66717f,.45));
  const key=new T.DirectionalLight(0xfffaf4,1.8);key.position.set(-2,4,3);this.scene.add(key);
  const rim=new T.DirectionalLight(0xe9f0ff,.9);rim.position.set(2,2,-3);this.scene.add(rim);this.meshes=[];this.renderer.resetState();
 }
 setModel(surface){
  this.surface=surface;
  this.ready=false;const epoch=this.epoch=(this.epoch||0)+1;
  for(const m of this.meshes){m.geometry.dispose();for(const material of [m.material].flat())material.dispose();this.root.remove(m);}this.meshes=[];
  if(!surface)return;
  const position=new T.BufferAttribute(surface.positions,3),normal=surface.normals?new T.BufferAttribute(surface.normals,3):null;
  this.hasOverview=!!surface.overviewGroups?.length;
  for(const g of [...surface.groups,...(surface.overviewGroups||[])]){
   const overview=g.groupIndex===-1;
   const geometry=new T.BufferGeometry();geometry.setAttribute('position',position);geometry.setDrawRange(g.start,g.count);
   if(normal)geometry.setAttribute('normal',normal);else geometry.computeVertexNormals();
   geometry.boundingBox=new T.Box3(new T.Vector3(...g.bounds[0]),new T.Vector3(...g.bounds[1]));geometry.boundingSphere=new T.Sphere(new T.Vector3(...g.center),g.radius);
   const hex='#'+g.color.map(c=>Math.round(c*255).toString(16).padStart(2,'0')).join('');
   const material=new T.MeshStandardMaterial({color:hex,...(TISSUE_MATERIALS[g.system]||{metalness:0,roughness:.6}),side:T.FrontSide});
   const uniforms={reveal:{value:1},cutOn:{value:0},cut:{value:0}};
   material.onBeforeCompile=shader=>{
    Object.assign(shader.uniforms,uniforms);shader.vertexShader='varying vec3 surfaceWorld;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nsurfaceWorld=(modelMatrix*vec4(transformed,1.)).xyz;');
    shader.fragmentShader='uniform float reveal; uniform float cutOn; uniform float cut; varying vec3 surfaceWorld;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\nif(cutOn>.5&&surfaceWorld.x>cut)discard;\nfloat threshold=fract(dot(mod(floor(gl_FragCoord.xy),vec2(4.)),vec2(.25,.0625)));if(threshold>=reveal)discard;');
   };
   let materials=material;
   if(g.capCount){
    const cutMaterial=material.clone();cutMaterial.color.set('#86776b');cutMaterial.roughness=.9;cutMaterial.onBeforeCompile=material.onBeforeCompile;
    geometry.addGroup(g.start,g.count-g.capCount,0);geometry.addGroup(g.start+g.count-g.capCount,g.capCount,1);materials=[material,cutMaterial];
   }
   const mesh=new T.Mesh(geometry,materials);mesh.frustumCulled=false;mesh.userData={g,uniforms,overview,pickable:false};this.root.add(mesh);this.meshes.push(mesh);
  }
  this.renderer.compileAsync(this.scene,this.camera).then(()=>{if(this.epoch===epoch)this.ready=true;}).catch(error=>console.error('Atlas shader compilation failed',error));
  this.renderer.resetState();
 }
 draw(d){
  this.renderer.resetState();this.renderer.setViewport(0,0,d.width,d.height);this.renderer.clearDepth();
  this.camera.projectionMatrix.fromArray(d.projection);this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert();
  this.camera.matrix.fromArray(d.view).invert();this.camera.updateMatrixWorld(true);
  const r=d.rot;this.root.matrixAutoUpdate=false;this.root.matrix.set(r[0][0],r[0][1],r[0][2],0,r[1][0],r[1][1],r[1][2],0,r[2][0],r[2][1],r[2][2],0,0,0,0,1);
  const e=d.explode,s=e*e*(3-2*e);
  const batch=this.hasOverview&&d.systemFocus<0;
  const detailedSystems=new Set([...(this.surface.individualSystems||[]),...this.meshes.filter(mesh=>!mesh.userData.overview&&d.selectedPicks?.has(mesh.userData.g.pick)).map(mesh=>mesh.userData.g.system)]);
  for(const mesh of this.meshes){const {g,uniforms,overview}=mesh.userData;
   const visible=inspectionVisible(g,d.inspectionView,d.hiddenSystems)&&(!g.cover||d.showCover)&&(d.systemFocus<0||g.pick===d.systemFocus)&&partPageVisible(g.pick,d.partLayout,d.partAmount||0);
   mesh.userData.pickable=visible&&!overview;
   mesh.visible=visible&&(overview?batch&&!detailedSystems.has(g.system):!batch||!g.overviewId||detailedSystems.has(g.system));
   // Invisible detailed meshes still need the current transform for raycasting.
   if(!visible)continue;
   const local=partTransform(g.pick,d.partLayout,d.partAmount||0);
   mesh.scale.setScalar(d.scale*local.scale);const center=d.inspectionCenter||[0,0,0];
   mesh.position.set(...g.offset.map((v,k)=>(v*s-d.exCenter[k]*e-center[k])*d.scale));
   mesh.position.set(mesh.position.x*local.scale+local.offset[0],mesh.position.y*local.scale+local.offset[1],mesh.position.z*local.scale+local.offset[2]);
   // Pull is world-space; convert back through the shared rotation.
   const selected=d.selectedPicks?d.selectedPicks.has(g.pick):g.pick===d.sel;
   if(selected){const p=d.pull;mesh.position.x+=r[0][0]*p[0]+r[1][0]*p[1]+r[2][0]*p[2];mesh.position.y+=r[0][1]*p[0]+r[1][1]*p[1]+r[2][1]*p[2];mesh.position.z+=r[0][2]*p[0]+r[1][2]*p[1]+r[2][2]*p[2];}
   uniforms.reveal.value=d.solidBlend;uniforms.cutOn.value=d.cutOn?1:0;uniforms.cut.value=d.cut||0;
   for(const material of [mesh.material].flat())material.emissive.setHex(selected?0x3b2710:0x000000);
  }
  this.root.updateMatrixWorld(true);this.renderer.render(this.scene,this.camera);this.renderer.resetState();
 }
}
