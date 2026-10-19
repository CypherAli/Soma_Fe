"use client";



import { useContent } from "@/components/content/ContentProvider";
import { ContentSurface } from "@/components/content/ContentProvider";
/**
 * Bộ dựng hình atlas toàn thân — chuyển gần như NGUYÊN VĂN từ
 * human-atlas/app/scene.tsx (MIT). Cố ý giữ nguyên lối viết dày đặc của bản
 * gốc để còn diff được với thượng nguồn khi họ sửa; chỉ đổi đường dẫn import,
 * thêm "use client" cho Next App Router, và bọc atlasAsset() quanh URL chunk
 * vì bộ dữ liệu nằm ở /human-atlas/ chứ không phải /models/.
 *
 * Ba điểm cốt lõi khiến nó chạy mượt với 2,29 triệu tam giác, đừng phá:
 *  - Gộp geometry theo hệ trong từng chunk rồi điều khiển ẩn/hiện/chọn TRÊN GPU
 *    bằng DataTexture + onBeforeCompile, nên 2.234 mảnh chỉ tốn ~100 draw call.
 *  - Mesh picker riêng (không thêm vào scene) để raycast vẫn chính xác từng mảnh.
 *  - Chỉ render khi dirty=true, không vẽ mỗi khung hình.
 */
import {useEffect,useRef} from 'react';
import * as T from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {RoomEnvironment} from '@/lib/humanAtlas/roomEnvironment';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {createExplosionLayout} from '@/lib/humanAtlas/explosionLayout';
import {decodeModelResponse} from '@/lib/humanAtlas/modelDownload';
import {frameAnatomyBox} from '@/lib/humanAtlas/cameraFraming';
import {PointerTap} from '@/lib/humanAtlas/pointerTap';
import {SYSTEMS,atlasAsset,type Atlas,type SceneState} from '@/lib/humanAtlas/anatomy';
interface Props {atlas:Atlas;state:SceneState;onSelect:(id:string)=>void;onProgress:(n:number)=>void;onError:(s:string)=>void;onLabelPick?:(key:string)=>void}
function canvasDescription(){const lang=document.documentElement.lang;return lang==='vi'?'Mô hình giải phẫu người tương tác. Kéo để xoay, cuộn để phóng to và chọn cấu trúc để xem chi tiết.':lang==='zh'?'交互式人体解剖模型。拖动旋转，滚动缩放，选择结构查看详情。':'Interactive human anatomy. Drag to orbit, pinch or scroll to zoom, and tap a structure to inspect it.';}
export default function AnatomyScene({atlas,state,onSelect,onProgress,onError,onLabelPick}:Props){
  const cmsContent = useContent();
  const SYSTEMS = cmsContent.resolve(cmsSourceSYSTEMS());

 const host=useRef<HTMLDivElement>(null),latest=useRef(state),select=useRef(onSelect),progress=useRef(onProgress),fail=useRef(onError),labelPick=useRef(onLabelPick);
 // Bản gốc gán thẳng trong thân hàm; React 19 cấm ghi ref lúc dựng nên chuyển
 // vào effect KHÔNG có mảng phụ thuộc — chạy sau mỗi lần dựng, nên vòng lặp
 // rAF bên dưới vẫn luôn đọc được trạng thái mới nhất.
 useEffect(()=>{latest.current=state;select.current=onSelect;progress.current=onProgress;fail.current=onError;labelPick.current=onLabelPick;host.current?.querySelector('canvas')?.setAttribute('aria-label',canvasDescription());});
 useEffect(()=>{
  const el=host.current!;let disposed=false,frame=0,dirty=true,ready=false,lastView='',lastReset=-1,lastIsolate='',layoutKey='',amount=0;
  let lastState:SceneState|null=null;
  const abort=new AbortController();
  let renderer:T.WebGLRenderer;
  try{renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});}catch{fail.current('Trình duyệt này không khởi động được trình xem 3D. Hãy dùng trình duyệt có bật WebGL.');return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<768?1.5:2));renderer.localClippingEnabled=true;renderer.setClearColor('#f2f3f3');renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;el.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-label',canvasDescription());
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.005,100),controls=new OrbitControls(camera,renderer.domElement);
  camera.position.set(1.4,1.05,3.6);controls.target.set(0,.85,0);controls.enableDamping=true;controls.dampingFactor=.085;controls.zoomSpeed=.65;controls.minDistance=.07;controls.maxDistance=40;controls.maxPolarAngle=Math.PI*.96;controls.addEventListener('change',()=>{dirty=true;});
  const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
  scene.add(new T.HemisphereLight(0xffffff,0xa7acb2,1.05));
  const key=new T.DirectionalLight(0xfffaf4,2.3);key.position.set(-2,4,3);scene.add(key);
  const rim=new T.DirectionalLight(0xe9f0ff,1.8);rim.position.set(2,2,-3);scene.add(rim);
  const ground=new T.Mesh(new T.CircleGeometry(30,96),new T.MeshStandardMaterial({color:0xd5d9dc,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.019;scene.add(ground);
  const platform=new T.Mesh(new T.CylinderGeometry(.68,.7,.028,100),new T.MeshStandardMaterial({color:0xeeeeec,metalness:.12,roughness:.67}));platform.position.y=-.016;scene.add(platform);
  const ring=new T.Mesh(new T.RingGeometry(.63,.632,128),new T.MeshBasicMaterial({color:0x8c969f,transparent:true,opacity:.4,side:T.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.001;scene.add(ring);
  const innerRing=new T.Mesh(new T.RingGeometry(.55,.551,128),new T.MeshBasicMaterial({color:0xa4aeb8,transparent:true,opacity:.16,side:T.DoubleSide}));innerRing.rotation.x=-Math.PI/2;innerRing.position.y=.001;scene.add(innerRing);

  /**
   * Bản gốc chỉ có một bảng màu sáng. Soma 3D có nút sáng/tối dùng chung
   * (`document.documentElement.dataset.theme`), nên nền canvas và bộ sàn/bệ
   * phải đổi theo — nếu không, bật chế độ tối sẽ ra một khung 3D trắng loá
   * nằm giữa giao diện đen.
   *
   * Theo dõi bằng MutationObserver chứ không đọc một lần: người dùng bấm đổi
   * chế độ ngay trên trang này, không có sự kiện nào khác để bám.
   */
  let darkStage=false;
  const themeSurfaces=()=>{
   const dark=document.documentElement.dataset.theme==='dark';
   darkStage=dark;
   renderer.setClearColor(dark?'#0b0c0e':'#f2f3f3');
   (ground.material as T.MeshStandardMaterial).color.set(dark?0x15171b:0xd5d9dc);
   (platform.material as T.MeshStandardMaterial).color.set(dark?0x1d2026:0xeeeeec);
   (ring.material as T.MeshBasicMaterial).color.set(dark?0x6b7684:0x8c969f);
   (innerRing.material as T.MeshBasicMaterial).color.set(dark?0x515b67:0xa4aeb8);
   dirty=true;
  };
  themeSurfaces();
  const themeWatch=new MutationObserver(themeSurfaces);
  themeWatch.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  const width=T.MathUtils.ceilPowerOfTwo(atlas.parts.length),data=new Float32Array(width*4),partTexture=new T.DataTexture(data,width,1,T.RGBAFormat,T.FloatType);partTexture.needsUpdate=true;
  const selectedData=new Uint8Array(width*4),selectionTexture=new T.DataTexture(selectedData,width,1);selectionTexture.needsUpdate=true;
  /**
   * Kênh ghi đè màu theo mảnh. RGB là màu ĐÃ ĐỔI SANG TUYẾN TÍNH (shader làm
   * việc trong không gian tuyến tính; nhét thẳng giá trị sRGB vào là ra màu
   * nhạt hơn hẳn). A>0 nghĩa là có ghi đè.
   */
  const tintData=new Uint8Array(width*4),tintTexture=new T.DataTexture(tintData,width,1);tintTexture.needsUpdate=true;
  /**
   * Mặt cắt tự cài bằng shader thay vì `material.clippingPlanes` của three.
   *
   * Lý do: clipping có sẵn tính trên vị trí ĐÃ DỊCH CHUYỂN (shader dời từng
   * mảnh khi tách rời), nên vừa cắt vừa tách là mỗi mảnh bị xén ở chỗ nó đã
   * văng tới — ra hình vụn lệch lạc. Tính trên `position` gốc thì mỗi mảnh
   * giữ nguyên mặt cắt của nó khi bay ra, hai thao tác dùng chung được.
   * xyz = pháp tuyến, w = hằng số; bật/tắt bằng uniform riêng.
   */
  const clipUniform={value:new T.Vector4(0,-1,0,0)},clipOnUniform={value:0};
  const materials:T.Material[]=[],geometries:T.BufferGeometry[]=[],pickers:(T.Mesh|undefined)[]=[],centers=atlas.parts.map(p=>new T.Vector3().fromArray(p.bounds[0]).add(new T.Vector3().fromArray(p.bounds[1])).multiplyScalar(.5));
  const offsets:T.Vector3[]=[],bounds=atlas.parts.map(p=>new T.Box3(new T.Vector3().fromArray(p.bounds[0]),new T.Vector3().fromArray(p.bounds[1])));
  let packingWidth=1,packingHeight=1;
  const hover=document.createElement('div');hover.className='part-hover';hover.setAttribute('role','tooltip');hover.hidden=true;el.appendChild(hover);
  /**
   * Nhãn chỉ dẫn kiểu atlas giáo khoa (Soma 3D thêm). Mỗi nhóm một nhãn: điểm
   * neo là TÂM MẢNH LỚN NHẤT còn hiện của nhóm (tâm trung bình của nhóm hai bên
   * rơi vào khoảng trống giữa hai bên), nhãn xếp thành hai cột hai bên mô hình,
   * dãn dọc để không chồng nhau, nối về điểm neo bằng đường dẫn cùng màu nhóm.
   * Khi tách rời, cộng đúng độ dịch chuyển của mesh vào điểm neo.
   */
  const labelLayer=document.createElement('div');labelLayer.className='scene-labels';labelLayer.hidden=true;el.appendChild(labelLayer);
  const labelSvg=document.createElementNS('http://www.w3.org/2000/svg','svg');labelSvg.classList.add('scene-label-lines');labelLayer.appendChild(labelSvg);
  const labelEls=new Map<string,HTMLButtonElement>(),idIndex=new Map(atlas.parts.map((p,i)=>[p.id,i])),anchorP=new T.Vector3(),sizeP=new T.Vector3();
  let labelsKey='',lastLabels:SceneState['labels']=undefined,lastShowLabels:boolean|undefined=undefined;
  // Hộp khung ngắm gần nhất: điểm neo nhãn bị kẹp vào đây, nếu không tâm xương đùi/chày
  // dài nằm ngoài khung (bài gối) và nhãn chỉ ra mép màn hình.
  const frameBox=new T.Box3();
  const drawLabels=(s:SceneState)=>{
   const list=s.labels??[],w=el.clientWidth,h=el.clientHeight;
   const on=!!s.showLabels&&list.length>0&&ready&&w>=320;
   labelLayer.hidden=!on;if(!on)return;
   const key=list.map(l=>l.key+''+l.text+''+l.color).join('');
   if(key!==labelsKey){labelsKey=key;labelEls.forEach(b=>b.remove());labelEls.clear();
    for(const l of list){const b=document.createElement('button');b.type='button';b.className='scene-label';b.title=l.title??l.text;b.setAttribute('aria-label',l.title&&l.title!==l.text?l.text+' · '+l.title:l.text);const dot=document.createElement('i');dot.style.background=l.color;const tx=document.createElement('span');tx.textContent=l.text;b.append(dot,tx);b.addEventListener('click',()=>labelPick.current?.(l.key));labelLayer.appendChild(b);labelEls.set(l.key,b);}}
   const pts:{key:string;ax:number;ay:number;color:string}[]=[];
   for(const l of list){
    let best=-1,vol=-1;for(const id of l.ids){const i=idIndex.get(id);if(i===undefined||data[i*4+3]<.5)continue;bounds[i].getSize(sizeP);const v=(sizeP.x+1e-4)*(sizeP.y+1e-4)*(sizeP.z+1e-4);if(v>vol){vol=v;best=i;}}
    const b=labelEls.get(l.key)!;if(best<0){b.hidden=true;continue;}
    if(l.anchor)anchorP.fromArray(l.anchor);else anchorP.copy(centers[best]);
    if(!l.anchor&&amount<.05&&!s.isolate&&!frameBox.isEmpty())anchorP.clamp(frameBox.min,frameBox.max);
    // Mặt cắt đang bật: tâm mảnh có thể nằm ở nửa ĐÃ BỊ CẮT — nhãn chỉ vào khoảng không (bài
    // mặt cắt ngang bụng). Kéo điểm neo về đúng mặt cắt.
    if(clipOnUniform.value>.5){const d=clipPlane.distanceToPoint(anchorP);if(d<0){if(l.anchor){b.hidden=true;continue;}anchorP.addScaledVector(clipPlane.normal,-d);}}
    anchorP.add(new T.Vector3(data[best*4],data[best*4+1],data[best*4+2]));
    anchorP.project(camera);if(anchorP.z>1||anchorP.z< -1){b.hidden=true;continue;}
    pts.push({key:l.key,ax:(anchorP.x+1)/2*w,ay:(1-anchorP.y)/2*h,color:l.color});
   }
   const origin=el.getBoundingClientRect(),root=el.parentElement;
   const inspector=root?.querySelector('.detail-sheet')?.getBoundingClientRect();
   const rail=root?.querySelector('.scene-rail')?.getBoundingClientRect();
   const mobile=w<768;
   const left=mobile?12:Math.max(16,rail&&rail.right>origin.left?rail.right-origin.left+12:16);
   const right=mobile?w-12:Math.min(w-90,inspector?inspector.left-origin.left-12:w-90);
   const cx=(left+right)/2,top=mobile?180:130,bottom=mobile&&inspector?inspector.top-origin.top-16:h-175,gap=30;
   const leftX=left+10,rightX=right-10;
   let lines='';
   const place=(arr:typeof pts,x:number,alignRight:boolean)=>{
    arr.sort((a,b)=>a.ay-b.ay);let y=top;const ys=arr.map(p=>{y=Math.max(p.ay,y);const r=y;y+=gap;return r;});
    for(let k=ys.length-1,lim=bottom;k>=0;k--){if(ys[k]>lim)ys[k]=lim;lim=ys[k]-gap;}
    arr.forEach((p,k)=>{const b=labelEls.get(p.key)!;b.hidden=false;b.classList.remove('is-pin');b.style.maxWidth=`${Math.max(80,(right-left)/2-20)}px`;b.dataset.side=alignRight?'r':'l';b.style.top=`${ys[k]}px`;b.style.left=alignRight?`${x}px`:'';b.style.right=alignRight?'':`${w-x}px`;
     lines+=`<line x1="${p.ax.toFixed(1)}" y1="${p.ay.toFixed(1)}" x2="${x.toFixed(1)}" y2="${ys[k].toFixed(1)}" stroke="${p.color}"/><circle cx="${p.ax.toFixed(1)}" cy="${p.ay.toFixed(1)}" r="3.2" fill="${p.color}" stroke="#fff" stroke-width="1"/>`;});
   };
   const compact=amount>.05&&list.filter(l=>!l.anchor).length>12;
   const columns:typeof pts=[],labelByKey=new Map(list.map(label=>[label.key,label]));
   for(const p of pts){const label=labelByKey.get(p.key)!;if(compact&&!label.anchor){const b=labelEls.get(p.key)!;b.hidden=p.ax<left||p.ax>right||p.ay<top||p.ay>bottom;b.classList.add('is-pin');b.style.maxWidth='32px';b.style.left=`${p.ax+8}px`;b.style.right='';b.style.top=`${p.ay-14}px`;lines+=`<line x1="${p.ax.toFixed(1)}" y1="${p.ay.toFixed(1)}" x2="${(p.ax+8).toFixed(1)}" y2="${(p.ay-14).toFixed(1)}" stroke="${p.color}"/>`;}else columns.push(p);}
   place(columns.filter(p=>p.ax<cx),leftX,true);place(columns.filter(p=>p.ax>=cx),rightX,false);
   labelSvg.setAttribute('viewBox',`0 0 ${w} ${h}`);labelSvg.innerHTML=lines;
  };
  type Target={index:number;x:number;y:number;left:number;right:number;top:number;bottom:number};let targets:Target[]=[];
  const projected=new T.Vector3();
  const findTarget=(x:number,y:number,radius:number)=>{
   let best=-1,score=Infinity;
   for(const t of targets){const dx=Math.max(t.left-x,0,x-t.right),dy=Math.max(t.top-y,0,y-t.bottom),distance=Math.hypot(dx,dy);if(distance>radius)continue;const candidate=distance+Math.hypot(t.x-x,t.y-y)*.025;if(candidate<score){score=candidate;best=t.index;}}
   return best;
  };
  const materialFor=(system:string)=>{
   const m=new T.MeshStandardMaterial({color:SYSTEMS.find(s=>s.id===system)?.color??'#aebbb8',metalness:.08,roughness:.53,side:T.DoubleSide,transparent:system==='integumentary',opacity:system==='integumentary'?.1:1,depthWrite:system!=='integumentary'});
   m.onBeforeCompile=shader=>{
    shader.uniforms.partState={value:partTexture};shader.uniforms.selectionState={value:selectionTexture};shader.uniforms.stateWidth={value:width};shader.uniforms.partTintState={value:tintTexture};shader.uniforms.sceneClip=clipUniform;shader.uniforms.sceneClipOn=clipOnUniform;
    shader.vertexShader='attribute float partIndex; uniform sampler2D partState; uniform sampler2D selectionState; uniform sampler2D partTintState; uniform float stateWidth; uniform vec4 sceneClip; varying float partVisible; varying float partSelected; varying float partFaded; varying vec4 partTint; varying float partClip;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvec2 stateUv = vec2((partIndex + 0.5) / stateWidth, 0.5); vec4 state = texture2D(partState, stateUv); transformed += state.xyz; partVisible = state.w; vec4 pick = texture2D(selectionState, stateUv); partSelected = pick.r; partFaded = pick.g; partTint = texture2D(partTintState, stateUv); partClip = dot(sceneClip.xyz, position) + sceneClip.w;');
    shader.fragmentShader='uniform float sceneClipOn; varying float partVisible; varying float partSelected; varying float partFaded; varying vec4 partTint; varying float partClip;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\nif (partVisible < 0.5) discard;\nif (sceneClipOn > 0.5 && partClip < 0.0) discard;\nif (partFaded > 0.5) { vec2 dm = mod(floor(gl_FragCoord.xy), 2.0); if (dm.x + dm.y * 2.0 > 0.5) discard; }');
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nif (partTint.a > 0.5) diffuseColor.rgb = partTint.rgb;\ndiffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.42, 0.85, 0.78), partSelected * 0.75);');
   };materials.push(m);return m;
  };
  const mats=new Map(SYSTEMS.map(s=>[s.id,materialFor(s.id)]));

  /**
   * Nạp bảng ghi đè màu vào texture. Chỉ chạy khi bảng đổi (so bằng tham
   * chiếu) — scene tĩnh nên thực tế chỉ chạy một lần.
   */
  let tintRef:Record<string,string>|null=null;
  const tintColor=new T.Color();
  const applyTint=(tint:Record<string,string>)=>{
   if(tint===tintRef)return;
   tintRef=tint;
   tintData.fill(0);
   atlas.parts.forEach((p,i)=>{
    const hex=tint[p.id];
    if(!hex)return;
    // convertSRGBToLinear: shader tính trong không gian tuyến tính.
    tintColor.set(hex).convertSRGBToLinear();
    tintData[i*4]=Math.round(tintColor.r*255);
    tintData[i*4+1]=Math.round(tintColor.g*255);
    tintData[i*4+2]=Math.round(tintColor.b*255);
    tintData[i*4+3]=255;
   });
   tintTexture.needsUpdate=true;dirty=true;
  };

  /**
   * Mặt cắt lát — bản gốc human-atlas không có, Soma 3D thêm.
   *
   * Dùng `Plane` của three gắn vào `material.clippingPlanes`: mesh ở đây đã
   * được gộp theo hệ nên không thể cắt bằng cách ẩn từng mảnh. Vị trí lát cắt
   * tính từ HỘP BAO THẬT của toàn bộ atlas (gộp `bounds` của 2.234 mảnh trong
   * manifest) chứ không cắm toạ độ cứng, nên đúng với mọi bộ dữ liệu.
   *
   * Vật liệu vốn đã là DoubleSide (materialFor) nên mặt cắt lộ ra lòng trong
   * chứ không thủng — không phải bump needsUpdate như bên ModelScene.
   */
  const atlasBox=new T.Box3();
  for(const b of bounds)atlasBox.union(b);
  /**
   * Hộp bao dùng để đặt lát cắt.
   *
   * PHẢI theo tập `focus` khi đang ở trang chuyên đề, không thể lấy hộp bao
   * toàn thân. Đo được: hộp toàn thân Y = 0 → 1,730 nên lát cắt 50% rơi vào
   * y = 0,865 (ngang hông), trong khi quả tim nằm ở 1,252 → 1,395 — thanh
   * trượt vừa nhích là cắt trượt hết cả bài, đúng hiện tượng "50% mà mất
   * gần hết".
   */
  const clipBoxOf=(focus:string[])=>{
   if(!focus.length)return atlasBox;
   const set=new Set(focus),box=new T.Box3();
   atlas.parts.forEach((p,i)=>{if(set.has(p.id))box.union(bounds[i]);});
   return box.isEmpty()?atlasBox:box;
  };
  const clipPlane=new T.Plane(new T.Vector3(0,-1,0),0);
  let clipKey='';
  const applyClip=(c:SceneState['clip'])=>{
   const key=c.enabled?`${c.axis}:${c.percent}:${c.keepPositive}:${latest.current.focus.length}`:'';
   if(key===clipKey)return;
   clipKey=key;
   if(!c.enabled){clipOnUniform.value=0;dirty=true;return;}
   const box=clipBoxOf(latest.current.focus);
   const min=box.min[c.axis],max=box.max[c.axis];
   const cut=min+(max-min)*c.percent/100;
   const unit=new T.Vector3(c.axis==='x'?1:0,c.axis==='y'?1:0,c.axis==='z'?1:0);
   // Giữ nửa dương: pháp tuyến cùng chiều trục, hằng số = -cut (dot(N,p)+C>=0 <=> p>=cut).
   clipPlane.normal.copy(c.keepPositive?unit:unit.clone().negate());
   clipPlane.constant=c.keepPositive?-cut:cut;
   clipUniform.value.set(clipPlane.normal.x,clipPlane.normal.y,clipPlane.normal.z,clipPlane.constant);
   clipOnUniform.value=1;
   dirty=true;
  };
  let loaded=0;
  const loadChunk=async(ci:number)=>{
   const chunk=atlas.chunks[ci],compressed=!!chunk.gzip&&typeof DecompressionStream!=='undefined';const response=await fetch(atlasAsset(compressed?chunk.gzip!:chunk.url),{signal:abort.signal});const buffer=await decodeModelResponse(response,chunk.bytes,compressed);if(disposed)return;
   const groups=new Map<string,T.BufferGeometry[]>();
   atlas.parts.forEach((p,i)=>{
    if(p.chunk!==ci)return;
    const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(new Float32Array(buffer,p.positions,p.vertexCount*3),3));
    // GPU normalized signed-short normals keep the complete atlas compact in memory.
    g.setAttribute('normal',new T.BufferAttribute(new Int16Array(buffer,p.normals,p.vertexCount*3),3,true));g.setIndex(new T.BufferAttribute(new Uint32Array(buffer,p.indices,p.indexCount),1));
    g.boundingBox=bounds[i].clone();g.computeBoundingSphere();const pick=new T.Mesh(g);pick.matrixAutoUpdate=false;pickers[i]=pick;geometries.push(g);
    g.setAttribute('partIndex',new T.BufferAttribute(new Float32Array(p.vertexCount).fill(i),1));
    const list=groups.get(p.system)??[];list.push(g);groups.set(p.system,list);
   });
   groups.forEach((gs,system)=>{const geometry=mergeGeometries(gs,false);if(!geometry)throw new Error('Không dựng được hình học giải phẫu.');geometries.push(geometry);const mesh=new T.Mesh(geometry,mats.get(system as never));mesh.frustumCulled=false;scene.add(mesh);});
   lastState=null;loaded++;progress.current(Math.round(loaded/atlas.chunks.length*100));dirty=true;
  };
  (async()=>{try{let cursor=0;await Promise.all(Array.from({length:3},async()=>{while(cursor<atlas.chunks.length){const i=cursor++;await loadChunk(i);}}));if(!disposed){ready=true;dirty=true;}}catch(e){if(!disposed)fail.current(e instanceof Error?e.message:'Không tải được dữ liệu giải phẫu.');}})();
  /**
   * Khung ngắm "nguyên khối" của trang chuyên đề, do khối căn khung tính ra
   * và ghi lại ở đây.
   *
   * Vì sao cần: fit() vốn viết cho trang toàn thân nên mốc "chưa tách" của nó
   * là NGƯỜI CAO 1,7m ở khoảng cách 4. Kéo thanh tách rời tới 24% thì phần
   * nội suy `extent` vẫn bằng 0, fit() kéo máy ảnh về khung toàn thân và quả
   * tim co lại thành một chấm trên đỉnh màn hình — đúng lỗi "tách ra không ở
   * chính giữa". Ghi lại khoảng cách/tâm ngắm của scene rồi cho fit() nội suy
   * TỪ ĐÓ sang bố cục xếp mảnh là hết.
   */
  let sceneDistance=0,sceneRadius=0;const sceneTarget=new T.Vector3();
  const fit=(view:string,extent=0)=>{
   if(el.clientWidth<1||el.clientHeight<1)return;
   const focused=sceneDistance>0;
   const mobile=el.clientWidth<768,bodyDistance=mobile?Math.max(4.5,1.8*el.clientHeight/Math.max(160,el.clientHeight-350)/(2*Math.tan(T.MathUtils.degToRad(camera.fov/2)))):4;
   const normalDistance=focused?sceneDistance:bodyDistance;
   const origin=el.getBoundingClientRect(),root=el.parentElement,rail=root?.querySelector('.scene-rail,.layers-panel')?.getBoundingClientRect(),inspector=root?.querySelector('.detail-sheet')?.getBoundingClientRect();
   const left=mobile?20:Math.max(20,rail&&rail.right>origin.left?rail.right-origin.left+12:20),right=mobile?el.clientWidth-20:Math.min(el.clientWidth-90,inspector?inspector.left-origin.left-12:el.clientWidth-90),top=mobile?220:150,bottom=mobile&&inspector?inspector.top-origin.top-16:el.clientHeight-170;
   const availableHeight=Math.max(80,bottom-top),availableWidth=Math.max(100,right-left),availableAspect=availableWidth/availableHeight;
   const atlasDistance=Math.max(packingHeight,packingWidth/availableAspect)/(2*Math.tan(T.MathUtils.degToRad(camera.fov/2)))*(el.clientHeight/availableHeight)*1.1;
   if(extent>0)camera.setViewOffset(el.clientWidth,el.clientHeight,el.clientWidth/2-(left+right)/2,el.clientHeight/2-(top+bottom)/2,el.clientWidth,el.clientHeight);

   const distance=T.MathUtils.lerp(normalDistance,Math.max(.2,atlasDistance),extent);if(extent>.8)view='front';
   const direction=view==='front'?new T.Vector3(0,.02,1):view==='back'?new T.Vector3(0,.02,-1):view==='side'?new T.Vector3(1,.02,0):new T.Vector3(.35,.06,1).normalize();
   // Bố cục xếp mảnh của scene được neo quanh TÂM SCENE (xem offsets bên
   // dưới), nên tâm ngắm lúc tách hết cũng phải là tâm đó — không thì lưới
   // mảnh nằm lệch hẳn lên trên so với khung hình.
   // `-packingWidth*.12` là mẹo của TRANG TOÀN THÂN: dời bố cục sang trái để
   // né bảng lớp rộng 340px. Ở trang chuyên đề, packingWidth tính theo cỡ
   // scene nên số này thành một cú kéo ngang lớn — đúng hiện tượng kéo thanh
   // tách rời thì model trôi khỏi giữa.
   const packX=0;
   const packY=focused?sceneTarget.y:(extent>.1||mobile?.85:.68);
   // Ở trang chuyên đề, tâm ngắm chạy mượt từ tâm của scene sang tâm của bố
   // cục xếp mảnh thay vì nhảy cóc về giữa thân người.
   if(focused)controls.target.set(T.MathUtils.lerp(sceneTarget.x,packX,extent),T.MathUtils.lerp(sceneTarget.y,packY,extent),T.MathUtils.lerp(sceneTarget.z,0,extent));
   else controls.target.set(packX,packY,0);
   camera.position.copy(controls.target).addScaledVector(direction,distance);controls.update();dirty=true;
  };
  /**
   * Đồng bộ bộ đệm vẽ với khung chứa VÀ với mật độ điểm ảnh hiện thời.
   *
   * Bản gốc chỉ gọi hàm này từ ResizeObserver. Ở Soma 3D điều đó hỏng theo hai
   * đường, cả hai đều cho ra đúng một triệu chứng: model mờ nhoè.
   *
   *  1. `devicePixelRatio` ĐỔI ĐƯỢC lúc đang chạy — đổi tỉ lệ hiển thị của
   *     Windows, phóng to trang, hay kéo cửa sổ sang màn hình khác mật độ.
   *     Kích thước CSS của khung KHÔNG đổi nên observer im lặng, canvas giữ
   *     nguyên mật độ cũ và bị trình duyệt phóng lên. Đã đo tại chỗ: dpr 1.25
   *     mà bộ đệm vẫn 1600×844 thay vì 2000×1055 — vẽ ở 80% mật độ thật.
   *  2. ResizeObserver chỉ phát thông báo trong BƯỚC DỰNG HÌNH của trình
   *     duyệt. Mở trang ở tab nền thì lần quan sát đầu tiên mất luôn, canvas
   *     kẹt ở cỡ mặc định 300×150 rồi kéo giãn hơn 6 lần. Đã đo được trạng
   *     thái này. (Cùng một cái bẫy mà ModelScene phải dựng `useBoxReady` để
   *     né — xem ghi chú ở đó.)
   *
   * Vì vậy: tự so bộ đệm với kích thước mong muốn và chỉ làm việc khi lệch,
   * rồi gọi từ nhiều nguồn (observer, sự kiện resize, hẹn giờ lúc khởi động,
   * và định kỳ trong vòng lặp vẽ). Gọi thừa không tốn gì vì hàm thoát sớm.
   */
  const applySize=()=>{
   const w=el.clientWidth,h=el.clientHeight;
   if(w<1||h<1)return false;
   const ratio=Math.min(devicePixelRatio,w<768||h<600?1.5:2);
   const canvas=renderer.domElement;
   if(renderer.getPixelRatio()===ratio&&canvas.width===Math.floor(w*ratio)&&canvas.height===Math.floor(h*ratio))return true;
   layoutKey='';lastState=null;
   renderer.setPixelRatio(ratio);
   camera.aspect=w/h;camera.updateProjectionMatrix();
   renderer.setSize(w,h);
   fit(latest.current.view,amount);
   // fit() vừa kéo máy ảnh về khung TOÀN THÂN. Ở trang chuyên đề thì đó là
   // sai — phải buộc khối căn khung tính lại, không thì quả tim nằm bé tí ở
   // một góc vì khoá `isolateKey` không đổi nên nó không bao giờ chạy lại.
   lastIsolate='';
   dirty=true;
   return true;
  };
  const resize=()=>{applySize();};
  const observer=new ResizeObserver(resize);observer.observe(el);
  addEventListener('resize',resize);
  // Lưới an toàn cho lần dựng đầu: nếu tab đang ở nền thì observer không phát.
  const sizeTimers=[0,150,500,1200,2500].map(ms=>setTimeout(resize,ms));
  const raycaster=new T.Raycaster(),pointer=new T.Vector2(),tap=new PointerTap(),worldBox=new T.Box3(),hitPoint=new T.Vector3();
  const down=(e:PointerEvent)=>{hover.hidden=true;tap.down(e.pointerId,e.clientX,e.clientY,e.pointerType==='touch'?12:5);};
  const move=(e:PointerEvent)=>{tap.move(e.pointerId,e.clientX,e.clientY);if(e.buttons||amount<.5||e.pointerType==='touch'){hover.hidden=true;return;}const rect=el.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top,index=findTarget(x,y,12);hover.hidden=index<0;renderer.domElement.style.cursor=index<0?'grab':'pointer';if(index>=0){hover.textContent=latest.current.partNames?.[atlas.parts[index].id]??atlas.parts[index].name;hover.style.left=`${Math.max(8,Math.min(x+14,el.clientWidth-260))}px`;hover.style.top=`${Math.max(8,Math.min(y+18,el.clientHeight-55))}px`;}};
  const cancel=(e:PointerEvent)=>tap.cancel(e.pointerId);
  const up=(e:PointerEvent)=>{
   const validTap=tap.up(e.pointerId,e.clientX,e.clientY);if(!validTap||!ready)return;const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);
   let nearest=Infinity,found=-1;const hasSolid=atlas.parts.some((p,i)=>p.system!=='integumentary'&&data[i*4+3]>.5);
   const clipping=latest.current.clip.enabled?clipPlane:null;
   pickers.forEach((mesh,i)=>{if(!mesh||data[i*4+3]<.5||(hasSolid&&atlas.parts[i].system==='integumentary'))return;worldBox.copy(bounds[i]).translate(mesh.position);if(!raycaster.ray.intersectBox(worldBox,hitPoint))return;const hits=raycaster.intersectObject(mesh,false);
    // Bỏ điểm chạm nằm ở nửa ĐÃ BỊ CẮT: không lọc thì bấm vào khoảng trống của
    // lát cắt vẫn chọn trúng cấu trúc vô hình phía sau.
    const hit=hits.find(h=>!clipping||clipping.distanceToPoint(h.point.clone().sub(mesh.position))>=0);
    if(hit&&hit.distance<nearest){nearest=hit.distance;found=i;}});
   if(found<0&&amount>.45)found=findTarget(e.clientX-rect.left,e.clientY-rect.top,e.pointerType==='touch'?24:16);if(found>=0){hover.hidden=true;select.current(atlas.parts[found].id);}
  };
  renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointermove',move);renderer.domElement.addEventListener('pointerup',up);renderer.domElement.addEventListener('pointercancel',cancel);
  const clock=new T.Clock();let lastExtent=-1,sizeTick=0,framedReady=false;
  const animate=()=>{
   if(disposed)return;frame=requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05),s=latest.current;
   // Hai lần mỗi giây là đủ để bắt đổi mật độ điểm ảnh mà không tốn gì đáng kể;
   // applySize() thoát ngay khi mọi thứ đã khớp.
   if(++sizeTick%30===0)applySize();
   applyClip(s.clip);
   const changed=lastState?.visible!==s.visible||lastState?.selected!==s.selected||lastState?.isolate!==s.isolate||lastState?.hidden!==s.hidden||lastState?.faded!==s.faded||lastState?.focus!==s.focus||lastState?.clip!==s.clip;
   const moving=Math.abs(amount-s.explode)>.0001;
   if(moving){amount=T.MathUtils.damp(amount,s.explode,8,dt);dirty=true;}
   if(changed||moving||lastExtent<0){
    const visible=new Set(s.visible),selection=new Set(s.selected),hiddenIds=new Set(s.hidden),fadedIds=new Set(s.faded),focusIds=s.focus.length?new Set(s.focus):null;
    const visibleParts=atlas.parts.filter((p,i)=>!hiddenIds.has(p.id)&&(!s.clip.enabled||clipPlane.intersectsBox(bounds[i])||clipPlane.distanceToPoint(centers[i])>=0)&&(focusIds&&!focusIds.has(p.id)?false:s.isolate?selection.has(p.id):focusIds?true:visible.has(p.system)||selection.has(p.id)));
    const layoutIds=new Set(visibleParts.map(p=>p.id));
    const clippedParts=visibleParts.map(p=>{if(!s.clip.enabled)return p;const min=[...p.bounds[0]] as [number,number,number],max=[...p.bounds[1]] as [number,number,number],axis=s.clip.axis==='x'?0:s.clip.axis==='y'?1:2,cut=s.clip.keepPositive?-clipPlane.constant:clipPlane.constant;if(s.clip.keepPositive)min[axis]=Math.max(min[axis],cut);else max[axis]=Math.min(max[axis],cut);return {...p,bounds:[min,max] as [[number,number,number],[number,number,number]]};});
    const retainedCenters=new Map(clippedParts.map(p=>[p.id,new T.Vector3().fromArray(p.bounds[0]).add(new T.Vector3().fromArray(p.bounds[1])).multiplyScalar(.5)]));
    const nextLayoutKey=visibleParts.map(p=>p.id).join(',')+':'+camera.aspect.toFixed(3)+':'+clipKey;
    if(nextLayoutKey!==layoutKey){const layout=createExplosionLayout(clippedParts,camera.aspect);packingWidth=layout.width;packingHeight=layout.height;atlas.parts.forEach((p,i)=>{const cell=layout.cells.get(p.id),retained=retainedCenters.get(p.id);offsets[i]=cell&&retained?new T.Vector3(cell.x,cell.y+(focusIds&&sceneRadius>0?sceneTarget.y:.85),0).add(centers[i]).sub(retained):centers[i].clone();});layoutKey=nextLayoutKey;}

    // Biên độ tách rời của bản gốc là hằng số 0,48m — tính cho cơ thể cao
    // 1,7m. Áp nguyên vào một scene chuyên đề (quả tim ~9cm) thì các mảnh
    // văng ra xa gấp 5 lần kích thước chính nó và bay hết khỏi khung hình.
    // Cho biên độ tỉ lệ theo bán kính scene, giữ nguyên cảm giác của bản gốc
    // ở trang toàn thân (bán kính ~0,86 -> hệ số về đúng 0,48).
    const spread=focusIds&&sceneRadius>0?sceneRadius*.56:.48;
    const explodeCenterY=focusIds&&sceneRadius>0?sceneTarget.y:.85;
    atlas.parts.forEach((p,i)=>{
     const c=centers[i],destination=offsets[i];let dx=0,dy=0,dz=0;
     if(amount<=.45){const t=amount/.45;const group=SYSTEMS.findIndex(sys=>sys.id===p.system);const angle=group/SYSTEMS.length*Math.PI*2;dx=Math.sin(angle)*t*spread;dy=(c.y-explodeCenterY)*t*.28;dz=Math.cos(angle)*t*spread;}
     else {const t=(amount-.45)/.55,group=SYSTEMS.findIndex(sys=>sys.id===p.system),angle=group/SYSTEMS.length*Math.PI*2;dx=T.MathUtils.lerp(Math.sin(angle)*spread,destination.x-c.x,t);dy=T.MathUtils.lerp((c.y-explodeCenterY)*.28,destination.y-c.y,t);dz=T.MathUtils.lerp(Math.cos(angle)*spread,-c.z,t);}
     const selected=selection.has(p.id);
     // "An" thang tay hon moi thu khac: mot manh da an thi du dang duoc chon
     // hay dang co lap cung khong duoc ve.
     // Ở scene chuyên đề, tập `focus` thay hẳn cho công tắc theo hệ: mảnh nào
     // thuộc scene thì hiện, không phụ thuộc hệ của nó (mạch vành nằm ở hệ
     // động mạch nhưng vẫn là một phần của bài học về tim).
     const inScope=focusIds?focusIds.has(p.id):(visible.has(p.system)||selected);
     const shown=layoutIds.has(p.id)&&!hiddenIds.has(p.id)&&(s.isolate?selected:inScope);
     data.set([dx,dy,dz,shown?1:0],i*4);selectedData[i*4]=selected?255:0;selectedData[i*4+1]=fadedIds.has(p.id)?255:0;
     const mesh=pickers[i];if(mesh){mesh.position.set(dx,dy,dz);mesh.updateMatrix();mesh.updateMatrixWorld(true);}
    });partTexture.needsUpdate=true;selectionTexture.needsUpdate=true;lastState=s;lastExtent=amount;dirty=true;
   }
   applyTint(s.tint);
   applyClip(s.clip);
   if(s.labels!==lastLabels||s.showLabels!==lastShowLabels){lastLabels=s.labels;lastShowLabels=s.showLabels;dirty=true;}
   if(s.view!==lastView||s.reset!==lastReset){fit(s.view,amount);lastView=s.view;lastReset=s.reset;}
   // Fit the currently rendered bounds below, not the eventual layout of all source meshes.
   // Khung ngắm bám tập cần nhìn: khi cô lập là các mảnh đang chọn, còn ở
   // scene chuyên đề là cả tập `focus` (bản gốc chỉ có nhánh cô lập vì nó
   // luôn dựng toàn thân).
   // Căn lại MỘT LẦN sau khi tải xong: lần chạy đầu tiên các mảnh chưa có dữ
   // liệu nên hộp bao chỉ gói được vài mảnh và khung ngắm lệch hẳn.
   if(ready&&!framedReady){framedReady=true;lastIsolate='';}
   const frameIds=s.isolate?s.selected:(s.frame.length&&amount<=.05?s.frame:s.focus);
   // Chỉ ôm khung theo tập scene khi model còn NGUYÊN KHỐI. Vừa kéo tách rời
   // là nhường cho fit() lo, vì nó căn theo bố cục xếp mảnh (packingWidth/
   // Height) — giữ khung cũ thì các mảnh văng ra ngoài mép màn hình.
   const framing=true;
   // Reframe on an explicit view/reset/clip change, never on ordinary wheel zoom.
   const inspectorRect=s.inspectorOpen?el.parentElement?.querySelector('.detail-sheet')?.getBoundingClientRect():undefined;
   const inspectorLayout=inspectorRect?`${inspectorRect.top}:${inspectorRect.height}:${inspectorRect.width}`:'';
   const isolateKey=framing?frameIds.join(',')+':'+s.reset+':'+s.inspectorOpen+':'+camera.aspect+':'+s.isolate+':'+s.view+':'+clipKey+':'+inspectorLayout+':'+s.visible.join(',')+s.hidden.join(','):'';
   if(isolateKey!==lastIsolate||(framing&&moving)){
    if(framing){const box=new T.Box3();const frameSet=new Set(frameIds);// Tập `frame` khai sẵn ôm cả mảnh đang ẩn: bài bộ phận căn khung theo vùng gối
     // (gồm mạch/cơ lớp chưa bật) để khung không nhảy khi bật tắt lớp.
     const byFrame=!s.isolate&&s.frame.length>0&&amount<=.05;
     atlas.parts.forEach((p,i)=>{if((frameSet.size?frameSet.has(p.id):data[i*4+3]>.5)&&(byFrame||data[i*4+3]>.5)){const partBox=bounds[i].clone();if(s.clip.enabled){const axis=s.clip.axis,cut=s.clip.keepPositive?-clipPlane.constant:clipPlane.constant;if(s.clip.keepPositive)partBox.min[axis]=Math.max(partBox.min[axis],cut);else partBox.max[axis]=Math.min(partBox.max[axis],cut);}if(!partBox.isEmpty())box.union(partBox.translate(new T.Vector3(data[i*4],data[i*4+1],data[i*4+2])));}});
     if(!box.isEmpty()&&el.clientWidth>0&&el.clientHeight>0){frameBox.copy(box);const center=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3());
     const w=el.clientWidth,h=el.clientHeight,mobile=w<768,origin=el.getBoundingClientRect(),root=el.parentElement;
     const rail=root?.querySelector('.scene-rail,.layers-panel')?.getBoundingClientRect(),sheet=root?.querySelector('.detail-sheet')?.getBoundingClientRect();
     let left=mobile?20:Math.max(20,rail&&rail.right>origin.left?rail.right-origin.left+16:20),right=mobile?w-20:Math.min(w-90,s.inspectorOpen&&sheet?sheet.left-origin.left-16:w-90),top=mobile?(s.focus.length?220:175):150,bottom=h-180;
     if(mobile&&s.inspectorOpen&&sheet)bottom=sheet.top-origin.top-16;
     if(s.bare){left=24;right=w-24;top=24;bottom=h-24;}
// Solve the distance in camera space after updating the orientation.
const viewDir=(amount>.8?new T.Vector3(0,0,1):s.view==='top'?new T.Vector3(0,1,-.35):s.view==='bottom'?new T.Vector3(0,-1,-.35):s.view==='back'?new T.Vector3(-.2,.1,-1):s.view==='side'?new T.Vector3(1,.1,.15):s.view==='front'?new T.Vector3(0,.05,1):new T.Vector3(.2,.1,1)).normalize();
controls.enableDamping=false;controls.update();
const fitted=frameAnatomyBox(camera,box,viewDir,w,h,{left,right,top,bottom});
const distance=fitted.distance;
controls.maxDistance=Math.max(.1,distance*6);controls.minDistance=Math.max(camera.near*2,Math.min(.07,distance*.05));
// Apply the new orbit pivot after residual damping was cleared.
controls.target.copy(fitted.center);controls.update();controls.enableDamping=true;
     controls.update();dirty=true;if(!s.isolate&&amount<=.05){sceneDistance=distance;sceneTarget.copy(center);sceneRadius=Math.max(size.x,size.y,size.z)*.5;}}
    }else if(lastIsolate){camera.clearViewOffset();fit(s.view,amount);}
    lastIsolate=isolateKey;
   }
   controls.enableRotate=amount<.8;controls.mouseButtons.LEFT=amount<.8?T.MOUSE.ROTATE:T.MOUSE.PAN;controls.touches.ONE=amount<.8?T.TOUCH.ROTATE:T.TOUCH.PAN;const stageOn=amount<.5&&!s.isolate&&s.focus.length===0;platform.visible=ring.visible=innerRing.visible=stageOn;// Chế độ tối bỏ hẳn ĐĨA NỀN: nó tạo một dải xám và một đường chân trời cắt
   // ngang khung hình, phá cảm giác nền đen liền mạch. Bệ và vòng tiếp đất vẫn
   // giữ để model có chỗ đứng. Phải đặt Ở ĐÂY chứ không ở themeSurfaces vì dòng
   // này chạy mỗi khung hình và sẽ ghi đè.
   ground.visible=stageOn&&!darkStage&&!s.clip.enabled;platform.visible=ring.visible=innerRing.visible=stageOn&&!s.clip.enabled;controls.autoRotate=s.rotate&&!s.isolate&&amount<.4;controls.autoRotateSpeed=.65;controls.update();if(controls.autoRotate)dirty=true;
   if(dirty){renderer.render(scene,camera);drawLabels(s);targets=[];if(amount>.45){const hasSolid=atlas.parts.some((p,i)=>p.system!=='integumentary'&&data[i*4+3]>.5);atlas.parts.forEach((p,i)=>{if(data[i*4+3]<.5||(hasSolid&&p.system==='integumentary'))return;let left=Infinity,right=-Infinity,top=Infinity,bottom=-Infinity;for(let corner=0;corner<8;corner++){projected.set(p.bounds[(corner&1)?1:0][0]+data[i*4],p.bounds[(corner&2)?1:0][1]+data[i*4+1],p.bounds[(corner&4)?1:0][2]+data[i*4+2]).project(camera);const x=(projected.x+1)*el.clientWidth/2,y=(1-projected.y)*el.clientHeight/2;left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}projected.copy(centers[i]).add(new T.Vector3(data[i*4],data[i*4+1],data[i*4+2])).project(camera);if(projected.z< -1||projected.z>1)return;targets.push({index:i,x:(projected.x+1)*el.clientWidth/2,y:(1-projected.y)*el.clientHeight/2,left,right,top,bottom});});}dirty=false;}

  };animate();
  const contextLost=(e:Event)=>{e.preventDefault();fail.current('Thiết bị đã tạm dừng phiên 3D. Tải lại trang để tiếp tục.');};renderer.domElement.addEventListener('webglcontextlost',contextLost);
  return()=>{disposed=true;abort.abort();cancelAnimationFrame(frame);observer.disconnect();themeWatch.disconnect();removeEventListener('resize',resize);sizeTimers.forEach(clearTimeout);controls.dispose();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());scene.traverse(o=>{if(o instanceof T.Mesh&&!geometries.includes(o.geometry)){o.geometry.dispose();const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose());}});env.dispose();partTexture.dispose();selectionTexture.dispose();tintTexture.dispose();hover.remove();labelLayer.remove();renderer.dispose();renderer.domElement.remove();};
 },[SYSTEMS, atlas]);
 return <ContentSurface scope="src/components/viewer/atlas/AtlasScene.tsx"><div className="scene" ref={host}/></ContentSurface>;
}

function cmsSourceSYSTEMS() { return SYSTEMS; }
