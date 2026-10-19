import { ShapeUtils, Vector2 } from 'three';

// Close only verifiable closed intersection contours. Open/non-manifold contours
// remain reported; never invent a bridge across missing source anatomy.
export function sectionCaps(segments, axis, limit, outward) {
  const axes=[0,1,2].filter(k=>k!==axis), points=new Map(), edges=new Map();
  const key=v=>v.slice(0,3).map(n=>Math.round(n*1e7)).join(',');
  for(const [a,b] of segments){const ka=key(a),kb=key(b);if(ka===kb)continue;
    points.set(ka,a.slice(0,3));points.set(kb,b.slice(0,3));
    const id=[ka,kb].sort().join('|');if(edges.has(id))edges.delete(id);else edges.set(id,[ka,kb]);
  }
  const adjacent=new Map();for(const [a,b] of edges.values()){for(const [u,v] of [[a,b],[b,a]]){if(!adjacent.has(u))adjacent.set(u,[]);adjacent.get(u).push(v);}}
  const visited=new Set(),loops=[];let unresolved=0;
  for(const seed of adjacent.keys()){
    if(visited.has(seed))continue;const component=[],queue=[seed];visited.add(seed);
    while(queue.length){const u=queue.pop();component.push(u);for(const v of adjacent.get(u)){if(!visited.has(v)){visited.add(v);queue.push(v);}}}
    if(component.some(u=>adjacent.get(u).length!==2)){unresolved++;continue;}
    const loop=[];let current=seed,previous=null;
    do{loop.push(points.get(current));const next=adjacent.get(current).find(v=>v!==previous);previous=current;current=next;}while(current!==seed&&loop.length<=component.length);
    if(current!==seed||loop.length<3){unresolved++;continue;}loops.push(loop);
  }
  const inside=(p,loop)=>{let yes=false;for(let i=0,j=loop.length-1;i<loop.length;j=i++){
    const a=loop[i],b=loop[j];if((a[axes[1]]>p[axes[1]])!==(b[axes[1]]>p[axes[1]])&&p[axes[0]]<(b[axes[0]]-a[axes[0]])*(p[axes[1]]-a[axes[1]])/(b[axes[1]]-a[axes[1]])+a[axes[0]])yes=!yes;}return yes;};
  const depth=loops.map(loop=>loops.filter(other=>other!==loop&&inside(loop[0],other)).length);
  const positions=[],normals=[];
  loops.forEach((outer,i)=>{
    if(depth[i]%2)return;
    const holes=loops.filter((hole,j)=>depth[j]===depth[i]+1&&inside(hole[0],outer));
    const flatten=[outer,...holes].flat();
    const faces=ShapeUtils.triangulateShape(outer.map(v=>new Vector2(v[axes[0]],v[axes[1]])),holes.map(loop=>loop.map(v=>new Vector2(v[axes[0]],v[axes[1]]))));
    for(const face of faces){let [a,b,c]=face.map(k=>flatten[k]);
      const u=b.map((v,k)=>v-a[k]),v=c.map((n,k)=>n-a[k]);
      const cross=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
      if(cross[axis]*outward<0)[b,c]=[c,b];
      for(const vertex of [a,b,c]){positions.push(...vertex.map((v,k)=>k===axis?limit:v));normals.push(...[0,1,2].map(k=>k===axis?outward:0));}
    }
  });
  return {positions,normals,loops:loops.length,unresolved};
}
