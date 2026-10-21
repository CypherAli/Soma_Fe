const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
// Switch a view only at zero solid opacity, keeping model buffers and camera.
export class InspectionTransition {
  constructor(){this.pending=null;}
  begin(apply,time){
    const from=this.blend(time);
    this.pending={apply,time,from,phase:'out'};
  }
  tick(time){
    const p=this.pending;if(!p)return;
    if(p.phase==='out'&&time-p.time>=.4){p.phase='in';p.time=time;p.apply();}
    else if(p.phase==='in'&&time-p.time>=.85)this.pending=null;
  }
  blend(time){const p=this.pending;return !p?1:p.phase==='out'?p.from*(1-smooth((time-p.time)/.4)):smooth((time-p.time-.15)/.7);}
  cancel(){this.pending=null;}
}
