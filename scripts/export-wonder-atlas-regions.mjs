// Use the exact packed BodyParts3D atlas served by /viewer, including its smooth normals.
import fs from 'node:fs/promises';
import path from 'node:path';
import { gzipSync, gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { sectionCaps } from './lib/region-caps.mjs';
import { unzipSync } from 'fflate';
import { parseBodyPartsObj } from './lib/bodyparts-obj.mjs';
import { SYSTEMS } from '../src/lib/humanAtlas/anatomy.ts';
import { ATLAS_PRESETS } from '../public/wonder/src/models/atlas-presets.js';
const root='public/human-atlas',out='public/wonder/assets/regions';
const rawManifest=await fs.readFile(root+'/atlas.json');const atlas=JSON.parse(rawManifest);
const cache=new Map();
const sourceZip=process.env.WONDER_OBJ_ZIP;
const requested=ATLAS_PRESETS.filter(p=>process.argv.slice(2).includes(p.id));
if(sourceZip&&!requested.length)throw Error('Select explicit source regions');
const wanted=new Set(atlas.parts.filter(p=>requested.some(s=>(!s.partIds||s.partIds.includes(p.id))&&(!s.side||!/\bright\b/i.test(p.name))&&(!s.pattern||new RegExp(s.pattern,'i').test(p.name))&&(!s.systems||s.systems.includes(p.system))&&p.bounds[1][1]>=(s.y0??-.1)&&p.bounds[0][1]<=(s.y1??1.9)&&p.bounds[1][0]>=(s.x0??-(s.x??.8))&&p.bounds[0][0]<=(s.x??.8))).map(p=>p.id));
const zipBytes=sourceZip?await fs.readFile(sourceZip):null;
const geometrySourceSha256=zipBytes?createHash('sha256').update(zipBytes).digest('hex'):null;
const objFiles=sourceZip?unzipSync(zipBytes,{filter:file=>file.name.endsWith('.obj')&&wanted.has(path.basename(file.name,'.obj'))}):null;
const objById=new Map(Object.entries(objFiles||{}).map(([name,data])=>[path.basename(name,'.obj'),data]));
const objCache=new Map();
async function chunk(i){if(!cache.has(i)){const c=atlas.chunks[i],raw=await fs.readFile(path.join(root,path.basename(c.gzip||c.url)));const b=c.gzip?gunzipSync(raw):raw;if(b.length!==c.bytes)throw Error('Invalid atlas chunk');cache.set(i,b);}return cache.get(i);}
// Sutherland–Hodgman clipping interpolates the ORIGINAL vertex normals at every cut.
export function clip(poly,axis,limit,sign){
 const out=[];let a=poly.at(-1);
 for(const b of poly){const da=sign*(a[axis]-limit),db=sign*(b[axis]-limit);
  if((da>=0)!==(db>=0)){const t=da/(da-db);out.push(a.map((v,k)=>v+(b[k]-v)*t));}
  if(db>=0)out.push(b);a=b;
 }return out;
}
const offsets={skeletal:[0,0,-.045],muscular:[-.14,0,.035],nervous:[-.22,0,-.02],arterial:[.14,0,.025],venous:[.2,0,-.025],lymphatic:[.1,-.04,.08]};
// Check every destination before writing anything: a default rebuild must not
// silently downgrade detailed source subsets or partially overwrite a catalog.
if(!sourceZip)for(const preset of ATLAS_PRESETS){
 if(preset.sourceLabel||(process.argv.length>2&&!process.argv.slice(2).includes(preset.id)))continue;
 let existing;try{existing=JSON.parse(await fs.readFile(`${out}/${preset.id}.json`,'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
 if(existing?.geometrySourceSha256)throw Error('Refusing to replace source OBJ geometry with packed atlas: '+preset.id+'. Set WONDER_OBJ_ZIP to the recorded source archive.');
}
await fs.mkdir(out,{recursive:true});
for(const preset of ATLAS_PRESETS){
 if(process.argv.length>2&&!process.argv.slice(2).includes(preset.id))continue;
 if(preset.sourceLabel){console.log('Use export-wonder-organ-surfaces.mjs for',preset.id);continue;}
 const {id,y0=-.1,y1=1.9,x=.8,x0=-x}=preset;
 const groups=new Map(),parts=[];let capLoops=0,unresolvedCuts=0;
 for(const p of atlas.parts){
  if(preset.partIds&&!preset.partIds.includes(p.id))continue;
  if(preset.side==='left' && /\bright\b/i.test(p.name))continue;
  if(preset.systems&&!preset.systems.includes(p.system))continue;
  if(preset.pattern&&!new RegExp(preset.pattern,'i').test(p.name))continue;
  if(p.bounds[1][1]<y0||p.bounds[0][1]>y1||p.bounds[1][0]<x0||p.bounds[0][0]>x)continue;
  let pos,norm,idx;
  if(sourceZip){if(!objCache.has(p.id)){const data=objById.get(p.id);if(!data)throw Error('Source OBJ missing '+p.id);objCache.set(p.id,parseBodyPartsObj(new TextDecoder().decode(data)));}({pos,norm,idx}=objCache.get(p.id));}
  else {const b=await chunk(p.chunk);pos=new Float32Array(b.buffer,b.byteOffset+p.positions,p.vertexCount*3);norm=new Int16Array(b.buffer,b.byteOffset+p.normals,p.vertexCount*3);idx=new Uint32Array(b.buffer,b.byteOffset+p.indices,p.indexCount);}
  const key=preset.groupByPart?p.id:p.system;
  let g=groups.get(key);if(!g){g={pos:[],norm:[],caps:[],capNorm:[],system:p.system,label:preset.groupByPart?p.name:null,id:p.id};groups.set(key,g);}let count=0;
  const wholeBone=preset.preserveSmallBones&&p.system==='skeletal'&&p.bounds[1][1]-p.bounds[0][1]<.12&&p.bounds[0][0]>=x0&&p.bounds[1][0]<=x;
  const planes=wholeBone||preset.wholeParts?[]:[[1,y0,1],[1,y1,-1],[0,x0,1],[0,x,-1]];
  const sections=planes.map(()=>[]);
  for(let t=0;t<idx.length;t+=3){let poly=[0,1,2].map(k=>{const i=idx[t+k]*3;return [pos[i],pos[i+1],pos[i+2],norm[i]/32767,norm[i+1]/32767,norm[i+2]/32767];});
   for(const [axis,limit,sign] of planes){if(!poly.length)break;poly=clip(poly,axis,limit,sign);}
   planes.forEach(([axis,limit],plane)=>{for(let k=0;k<poly.length;k++){const a=poly[k],b=poly[(k+1)%poly.length];if(Math.abs(a[axis]-limit)<1e-8&&Math.abs(b[axis]-limit)<1e-8)sections[plane].push([a,b]);}});
   for(let k=1;k<poly.length-1;k++){for(const v of [poly[0],poly[k],poly[k+1]]){g.pos.push(...v.slice(0,3));const len=Math.hypot(...v.slice(3));g.norm.push(...v.slice(3).map(n=>n/Math.max(len,1e-9)));}count++;}
  }
  let capTriangles=0;
  planes.forEach(([axis,limit,sign],i)=>{const cap=sectionCaps(sections[i],axis,limit,-sign);for(const value of cap.positions)g.caps.push(value);for(const value of cap.normals)g.capNorm.push(value);capTriangles+=cap.positions.length/9;capLoops+=cap.loops;unresolvedCuts+=cap.unresolved;});
  if(count)parts.push({id:p.id,name:p.name,system:p.system,triangles:count,sourceTriangles:idx.length/3,packedTriangles:p.indexCount/3,complete:!!preset.wholeParts||wholeBone||(p.bounds[0][1]>=y0&&p.bounds[1][1]<=y1&&p.bounds[0][0]>=x0&&p.bounds[1][0]<=x),capTriangles});
 }
 let start=0;const metadata=[],positions=[],normals=[];
 for(const g of groups.values()){const system=g.system;if(!g.pos.length)continue;const s=SYSTEMS.find(s=>s.id===system);if(!s)throw Error('Unknown atlas system '+system);
  let label=g.label||s.name;
  if(g.label){label=label.replace(/^Distal phalanx of left /,'Đốt xa — ').replace(/^Middle phalanx of left /,'Đốt giữa — ').replace(/^Proximal phalanx of left /,'Đốt gần — ').replace(/index finger/,'ngón trỏ').replace(/middle finger/,'ngón giữa').replace(/ring finger/,'ngón áp út').replace(/little finger/,'ngón út').replace(/thumb/,'ngón cái').replace(/^Left (first|second|third|fourth|fifth) metacarpal bone$/,(_,n)=>'Xương bàn '+({first:'I',second:'II',third:'III',fourth:'IV',fifth:'V'}[n]));}
  const names={'Left capitate':'Xương cả','Left hamate':'Xương móc','Left lunate':'Xương nguyệt','Left pisiform':'Xương đậu','Left scaphoid':'Xương thuyền','Left trapezium':'Xương thang','Left trapezoid':'Xương thê','Left triquetral':'Xương tháp','Left radius':'Xương quay','Left ulna':'Xương trụ','Flexor retinaculum of left wrist':'Mạc giữ gân gấp cổ tay'};
  label=names[label]||label;
  const capCount=g.caps.length;for(const value of g.caps)g.pos.push(value);for(const value of g.capNorm)g.norm.push(value);
  metadata.push({id:g.id,capCount,system,label,color:s.color,cover:system==='integumentary',offset:offsets[system]||[0,0,.12],stage:0,start,count:g.pos.length,info:g.label?g.label:s.name});
  positions.push(Buffer.from(new Float32Array(g.pos).buffer));normals.push(Buffer.from(new Float32Array(g.norm).buffer));start+=g.pos.length;
 }
 const binary=gzipSync(Buffer.concat(positions));await fs.writeFile(`${out}/${id}.bin.gz`,binary);await fs.writeFile(`${out}/${id}.normals.bin.gz`,gzipSync(Buffer.concat(normals)));
 await fs.writeFile(`${out}/${id}.json`,JSON.stringify({source:'/human-atlas/atlas.json',sourceSha256:createHash('sha256').update(rawManifest).digest('hex'),sourceDataset:atlas.source,geometrySourceSha256,geometrySourceUrl:sourceZip?'https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_BP3D_4.0_obj_99.zip':null,region:{y0,y1,x0,x},quality:{capLoops,unresolvedCuts,texture:false,sourceOptimized:sourceZip?false:atlas.optimized,geometrySource:sourceZip?'BodyParts3D 4.0 official OBJ (99), no further simplification':'packed atlas',context:preset.context||null},normals:true,groups:metadata,parts,surfaceGzipSha256:createHash('sha256').update(binary).digest('hex')}));
 console.log(id,parts.length,'atlas parts',start/9,'triangles',binary.length,'gzip bytes');
}
