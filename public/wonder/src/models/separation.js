// At full separation every system occupies its own non-overlapping cell.
export function separateSystems(groups,positions,columns=null){
 const systems=[...new Set(groups.map(g=>g.system||g.label))];
 if(systems.length<groups.length&&groups.some(g=>g.separateTogether)){
   const buckets=systems.map(system=>({system,cover:groups.filter(g=>(g.system||g.label)===system).every(g=>g.cover),start:0,count:0}));
   const packed=[];
   buckets.forEach(bucket=>{bucket.start=packed.length;for(const g of groups.filter(g=>(g.system||g.label)===bucket.system))for(let i=g.start;i<g.start+g.count;i++)packed.push(positions[i]);bucket.count=packed.length-bucket.start;});
   separateSystems(buckets,packed);
   for(const g of groups)g.offset=[...buckets.find(b=>(g.system||g.label)===b.system).offset];
   return;
 }
 const bounds=groups.map(g=>{
  const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
  for(let i=g.start;i<g.start+g.count;i+=3)for(let k=0;k<3;k++){lo[k]=Math.min(lo[k],positions[i+k]);hi[k]=Math.max(hi[k],positions[i+k]);}
  return {lo,hi,center:lo.map((v,k)=>(v+hi[k])/2)};
 });
 const visible=groups.map((g,i)=>g.cover?-1:i).filter(i=>i>=0);
 if(visible.length<2){groups.forEach(g=>g.offset=[0,0,0]);return;}
 const cols=columns?Math.min(visible.length,columns):Math.min(4,Math.ceil(Math.sqrt(visible.length))),rows=Math.ceil(visible.length/cols);
 const width=Math.max(...bounds.map(b=>b.hi[0]-b.lo[0]))*1.18;
 const height=Math.max(...bounds.map(b=>b.hi[1]-b.lo[1]))*1.18;
 const center=[0,0,0];for(const b of bounds)for(let k=0;k<3;k++)center[k]+=b.center[k]/bounds.length;
 visible.forEach((i,j)=>{const row=Math.floor(j/cols),rowSize=Math.min(cols,visible.length-row*cols);
  const target=[center[0]+(j%cols-(rowSize-1)/2)*width,center[1]+((rows-1)/2-row)*height,center[2]];
  groups[i].offset=target.map((v,k)=>v-bounds[i].center[k]);
 });
 groups.forEach(g=>{if(g.cover)g.offset=[0,0,-height];});
}
