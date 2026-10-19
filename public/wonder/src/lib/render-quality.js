// Change pixel density only; anatomical geometry and picking IDs stay intact.
export class RenderQuality {
 constructor(deviceDpr=1,mode='auto'){this.deviceDpr=Math.max(1,Math.min(2,deviceDpr));this.mode=mode;this.dpr=this.deviceDpr;this.reset();}
 reset(){this.elapsed=0;this.frames=0;this.fast=0;}
 setMode(mode){this.mode=['auto','smooth','detail'].includes(mode)?mode:'auto';this.dpr=this.mode==='smooth'?1:this.mode==='detail'?2:this.deviceDpr;this.reset();return this.dpr;}
 sample(dt,{visible=true,busy=false,camera=false}={}){
  if(this.mode!=='auto')return this.dpr;
  if(!visible||busy||dt<=0||dt>.5){this.reset();return this.dpr;}
  const ceiling=Math.min(this.deviceDpr,camera?1.5:2);
  if(this.dpr>ceiling){this.dpr=ceiling;this.reset();return this.dpr;}
  this.elapsed+=dt;this.frames++;
  if(this.elapsed<2)return this.dpr;
  const fps=this.frames/this.elapsed;this.elapsed=0;this.frames=0;
  if(fps<38){this.dpr=Math.max(1,this.dpr-.25);this.fast=0;}
  else if(fps>55){if(++this.fast>=4){this.dpr=Math.min(ceiling,this.dpr+.25);this.fast=0;}}
  else this.fast=0;
  return this.dpr;
 }
}
