// Retain official source faces/normals in the packed atlas coordinate system.
export function parseBodyPartsObj(text) {
 const positions=[], normals=[], indices=[];
 for(const line of text.split(/\r?\n/)) {
  const fields=line.trim().split(/\s+/),kind=fields.shift();
  if(kind==='v') { const [x,y,z]=fields.map(Number);positions.push(x*.001,z*.001+.0781112,-y*.001-.1); }
  if(kind==='vn') {const [x,y,z]=fields.map(Number);normals.push(...[x,z,-y].map(n=>Math.round(n*32767)));}
  if(kind==='f') {const face=fields.map(s=>{const refs=s.split('/');if(refs[2]&&refs[2]!==refs[0])throw Error('OBJ needs separate normal indices');return Number(refs[0])-1;});for(let j=1;j<face.length-1;j++)indices.push(face[0],face[j],face[j+1]);}
 }
 if(!positions.length||positions.length!==normals.length||indices.some(i=>!Number.isInteger(i)||i<0||i>=positions.length/3)||positions.some(n=>!Number.isFinite(n)))throw Error('Invalid BodyParts3D OBJ');
 return {pos:new Float32Array(positions),norm:new Int16Array(normals),idx:new Uint32Array(indices)};
}
