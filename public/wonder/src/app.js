// WonderSnap (browser): snap -> particle burst, fist -> form a model, open hand -> next wonder or EXPLODED VIEW
// (hand openness = how far apart the parts fly), twist = rotate, left 👍 = next model, right 👍 = next system, ☝ = pick, pinch = pull
// out, two hands = zoom, snap = dissolve. Plus quiz, voice, cut-away, recording, beating heart / breathing lungs.
// MediaPipe (hands) + WebGL2 (GPU particles via transform feedback) + procedural models.
import { CATALOG, isMachine, buildModelAsync } from './models/catalog.js';
import { Controller } from './logic/controller.js';
import { OPEN, FIST, PEACE, POINT, THUMB, NONE } from './logic/gestures.js';
import { IDLE, SPHERE, FORMED, DISSOLVE, SIM } from './logic/state.js';
import { Renderer, perspective, mul4, translate4, rotY4, project } from './gl/renderer.js';
import { HandCamera } from './hands.js';
import { hand as synthHand } from './logic/synth.js';
import { rotX, rotY, matMul, matVec, deg } from './lib/vec.js';
import { parseCommand, commandFeedback, readingText, Voice, Speaker, Recorder } from './features.js';
import { availableInspectionViews, inspectionVisible } from './models/inspection.js';
import { previewTransform,previewPoint,previewSource } from './lib/preview-projection.js';
import { ScanPanel } from './lib/scan-panel.js';
import { RenderQuality } from './lib/render-quality.js';
import { overviewLabels,layoutLabels,SYSTEM_LABELS } from './lib/label-layout.js';
import { HandYaw,PartSeparation,inspectionLabelsVisible,selectionFor,selectionKey,singleVisibleGroup,systemBlocks,selectedPull,fitPullDistance,pullEnvelope,partLayout,partTransform } from './logic/inspection-controls.js';
import { setMuscleSeparation } from './models/muscle-separation.js';
import { InspectionTransition } from './logic/inspection-transition.js';
import { ModelTransition } from './logic/model-transition.js';
import { inspectionFrame } from './logic/inspection-frame.js';

const qs = new URLSearchParams(location.search);
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

const DWELL_S = 0.45;          // point at a part this long to select it
const QUIZ_LEN = 10;

const REGION_START=CATALOG.findIndex(d=>d.id===qs.get('region'));
const DEFAULT_START = Math.max(0, CATALOG.findIndex((d) => d.name === 'Đầu · cổ · thân trên'));
const CFG = {
  n: clamp(parseInt(qs.get('n'), 10) || 60000, 5000, 1000000),
  manual: qs.get('manual') === '1',             // tests: deterministic clock, frames only via wonderSnap.advance()
  autostart: qs.get('autostart'),                // 'camera' | 'nocamera'
  start: REGION_START>=0 ? REGION_START : qs.get('model') !== null ? clamp(parseInt(qs.get('model'), 10) || 0, 0, CATALOG.length - 1) : DEFAULT_START,
  dpr: qs.get('dpr') ? parseFloat(qs.get('dpr')) : Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.5 : 2),
  trails: qs.get('trails') !== '0',
};

const HAND_EDGES = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]];
const POSE_UI = { [OPEN]: ['✋', 'Mở tay'], [FIST]: ['✊', 'Nắm tay'], [PEACE]: ['✌', 'Peace'], [POINT]: ['☝', 'Đang chỉ'], [THUMB]: ['👍', 'Ngón cái'], other: ['🤚', 'Đang cử động'], [NONE]: ['·', 'Chưa thấy tay'] };
const STATE_VI = { idle: 'Chờ', sphere: 'Gọi hạt', formed: 'Tạo hình', dissolve: 'Làm tan' };
const POSE_COLOR = { [OPEN]: '#66e0ff', [FIST]: '#ffd166', [PEACE]: '#ff6bd6', [POINT]: '#7dff9b', [THUMB]: '#ffb347', other: '#e8f1ff', [NONE]: '#e8f1ff' };
const rgbCss = (c, a = 1) => `rgba(${Math.round(c[0] * 255)}, ${Math.round(c[1] * 255)}, ${Math.round(c[2] * 255)}, ${a})`;
function modelGroup(d){
 if(/tay|ngón|chi trên/i.test(d.name))return 'Chi trên';
 if(/thân trên/i.test(d.name))return 'Thân trên';
 if(/đầu|cổ|\b(Brain|Eye|Ear|Tooth|Skull)\b/i.test(d.name))return 'Đầu và cổ';
 if(/Body|Skeleton|Hệ cơ/.test(d.name))return 'Toàn thân';
 return 'Nội tạng';
}
const CATEGORIES = ['Toàn thân','Đầu và cổ','Thân trên','Chi trên','Nội tạng'];

// ---------------------------------------------------------------- model cache (built in a worker)
class ModelStore {
  constructor(n) {
    this.n = n; this.cache = new Map(); this.pending = new Map(); this.lru = []; this.nextId = 1; this.errors = [];
    try {
      this.worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
      this.worker.onmessage = (e) => this.onResult(e.data);
      this.worker.onerror = (e) => { console.warn('model worker failed, building on the main thread', e); this.worker = null; this.flushSync(); };
    } catch { this.worker = null; }
  }
  get(i) { const m = this.cache.get(i); if (m) this.touch(i); return m || null; }
  touch(i) { this.lru = [i, ...this.lru.filter((k) => k !== i)]; const bytes=()=>[...this.cache.values()].reduce((sum,m)=>sum+(m.surface?.positions.byteLength||0)+(m.surface?.normals?.byteLength||0)+m.target.byteLength+m.offset.byteLength+m.tint.byteLength+m.pick.byteLength,0);while(this.lru.length>3||(this.lru.length>1&&bytes()>220*1024*1024))this.cache.delete(this.lru.pop()); }
  request(i) {
    if (this.cache.has(i)) return Promise.resolve(this.cache.get(i));
    if (this.pending.has(i)) return this.pending.get(i).promise;
    let resolve, reject;
    const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
    const job = { id: this.nextId++, promise, resolve, reject };
    this.pending.set(i, job);
    if (this.worker) this.worker.postMessage({ id: job.id, index: i, n: this.n });
    else setTimeout(() => this.buildSync(i), 0);
    return promise;
  }
  async buildSync(i) {
    if (!this.pending.has(i)) return;
    try { const m = await buildModelAsync(i, this.n); this.onResult({ ...m, index: i }); } catch (e) { this.onResult({ index: i, error: String(e.stack || e) }); }
  }
  flushSync() { for (const i of [...this.pending.keys()]) this.buildSync(i); }
  onResult(d) {
    const job = this.pending.get(d.index);
    this.pending.delete(d.index);
    if (d.error) { this.errors.push(d.error); console.error('model build failed', CATALOG[d.index]?.name, d.error); job?.reject(new Error(d.error)); return; }
    const m = { ...d, def: CATALOG[d.index] };
    this.cache.set(d.index, m); this.touch(d.index);
    job?.resolve(m);
  }
}

// ---------------------------------------------------------------- scripted demo (synthetic hand, no camera needed)
class Demo {
  constructor(app) {
    this.app = app; this.t0 = null; this.segs = []; this.cur = -1;
    const at = { cx: 0.2, cy: 0.55, s: 0.09 };
    const H = (pose) => () => synthHand({ ...at, pose });
    const add = (dur, hand, onStart) => this.segs.push({ dur, hand, onStart });
    const snap = () => { add(0.13, H('snap_pressed')); add(0.3, H('snap_released')); };
    const pick = (i) => () => { app.ctl.state.index = i; app.ctl.state.targetDirty = true; app.store.request(i); };
    if (app.ctl.state.state !== IDLE) { snap(); add(1.5, () => null); }
    for (const name of ['Human Body', 'Human Brain', 'Human Heart', 'Lungs', 'Gan & Túi mật', 'Dạ dày']) {
      const i = CATALOG.findIndex((d) => d.name === name);
      add(0.4, () => null, pick(i)); snap(); add(1.4, H('open')); add(3.0, H('fist'));
      if (isMachine(i)) {
        add(2.6, (u) => synthHand({ ...at, pose: 'partial', f: u }));
        add(1.4, H('open'));
        add(3.2, (u) => synthHand({ ...at, pose: 'open', angle: 0.55 * Math.sin(u * Math.PI * 2) }));   // twist to turn it
        add(2.2, (u) => synthHand({ ...at, pose: 'partial', f: 1 - u }));
        add(1.2, H('fist'));
      } else add(1.5, H('fist'));
      snap(); add(1.6, () => null);
    }
  }
  tick(t) {
    if (this.t0 === null) this.t0 = t;
    let el = t - this.t0, i = 0;
    while (i < this.segs.length && el > this.segs[i].dur) { el -= this.segs[i].dur; i++; }
    if (i >= this.segs.length) { this.app.stopDemo(); return; }
    const s = this.segs[i];
    if (i !== this.cur) { this.cur = i; s.onStart?.(); }
    this.app.demoHand = s.hand(clamp(el / s.dur, 0, 1));
  }
}

// ---------------------------------------------------------------- app
class App {
  constructor() {
    const $ = (id) => document.getElementById(id);
    this.$ = $;
    this.canvas = $('gl'); this.overlay = $('overlay'); this.octx = this.overlay.getContext('2d');
    this.video = $('cam');
    this.renderer = new Renderer(this.canvas, CFG.n, { preserve: CFG.manual });
    this.ctl = new Controller(CATALOG.length, isMachine);
    this.transition = new ModelTransition();this.inspectionTransition=new InspectionTransition();
    this.motionTime = 0;
    this.labelPage = 0;
    this.labelPageCount = 1;
    this.locale = qs.get('lang') === 'en' ? 'en' : 'vi';
    this.ctl.state.index = CFG.start;
    this.store = new ModelStore(CFG.n);
    this.model = null; this.uploaded = -1; this.uploadT = 0;
    this.cam = null; this.camOn = false; this.hasVideo = false;
    this.color = [...CATALOG[CFG.start].color];
    this.explode = 0; this.manualExplode = 0; this.tintMix = 0; this.scale = 1;
    this.spin = 0; this.pitch = 0; this.grab = null; this.handRotate = true; this.handRotating = false;
    this.dragYaw = 0; this.dragYawTarget=0; this.autoRotate = !CATALOG[CFG.start].surface; this.labelsOn = true; this.trails = CFG.trails;
    this.zoom = 1; this.zoomTarget = 1; this.zoomGrab = null;
    this.pulse = 1; this.flow = 0; this.expHist = []; this.wasBusy = false;
    this.sel = -1; this.selection = null; this.partSeparation = new PartSeparation(); this.handYaw = new HandYaw({upright:true});
    this.pulled = false; this.pullAmt = 0; this.hover = { li: -1, t0: 0 }; this.anchors = []; this.labelHits = []; this.pointer = null; this.lostT = 0;
    this.quiz = null;
    this.cut = { on: false, x: 0.35, target: 0.35 };
    this.voiceLanguage=qs.get('lang')==='en'?'en':'vi';this.voiceOn=false;this.autoRead=false;this.spoken=[];this.lastHeard='';this.hiddenSystems=new Set();
    this.voice=new Voice(text=>this.voiceCommand(text),{language:this.voiceLanguage,onState:state=>{this.voiceOn=['starting','listening','paused'].includes(state);this.voiceState=state;this.updateVoiceUI();},onError:error=>this.voiceError(error)});
    this.speaker=new Speaker({voice:this.voice,onState:state=>{this.speakerState=state;this.updateVoiceUI();},onError:error=>this.voiceError(error)});
    this.recorder = new Recorder(this.canvas, this.overlay); this.lastRecording = null;
    this.t = 0; this.last = null; this.frames = 0; this.fps = 0; this._fpsN = 0; this._fpsT = 0;
    this.handSource = null; this.handSource2 = null; this.lastSynthT = -1; this.demo = null; this.demoHand = undefined;
    this.hudTick = 0; this.lastIndexShown = -1; this.sliderActive = false;
    this.activeCat = modelGroup(CATALOG[CFG.start]);
    this.gain = clamp(0.22 * Math.sqrt(250000 / CFG.n), 0.15, 0.6);
    this.renderQuality=new RenderQuality(CFG.dpr);
    this.resize();
    addEventListener('resize', () => this.resize());
    this.buildUI();
    $('renderQuality').onchange=()=>{CFG.dpr=this.renderQuality.setMode($('renderQuality').value);this.resize();};
    this.bindInput();
    this.store.request(CFG.start).then(() => this.prefetch()).catch(error=>this.modelError(CFG.start,error));
  }

  word(vi,en) { return this.locale === 'en' ? en : vi; }
  modelName(def) {
    const name=this.locale==='vi'&&/[\u00C0-\u1EF9]/.test(def.name)?def.name:readingText(null,def,this.locale,'name').text;
    return name.charAt(0).toUpperCase()+name.slice(1);
  }
  prefetch() { const next=(this.ctl.state.index+1)%CATALOG.length;if(!['body','bust','thorax','muscles','head'].includes(CATALOG[next].id))this.store.request(next).catch(()=>{}); }
  modelError(index,error) {
    if(this.transition.pending?.index!==index&&this.ctl.state.index!==index)return;
    this.transition.complete();this.ctl.suspended=!!this.scanActive;
    const st=this.ctl.state;
    if(this.model&&this.uploaded>=0){st.index=this.uploaded;st.targetDirty=false;st.go(FORMED,this.t);this.surfaceRevealT=null;}
    else{st.targetDirty=false;st.go(IDLE,this.t);}
    this.announceModel(st.index);
    this.toast(this.word('Không tải được mô hình. Hãy chọn lại để thử.','Could not load the model. Select it again to retry.'));
    console.error(error);
  }
  resetPose() {
    this.zoom=this.zoomTarget=1;this.zoomGrab=null;
    this.spin=this.pitch=this.dragYaw=this.dragYawTarget=0;this.grab=null;
    this.autoRotate=false;this.handRotating=false;this.handYaw.reset();
    this.manualExplode=this.explode=0;this.expHist=[];this.wasBusy=false;
    this.inspectionCenter=[0,0,0];this.inspectionSignature=null;this.inspectionFit=null;
    this.cut.on=false;this.cut.x=this.cut.target=.35;this.labelPage=0;
  }

  resize() {
    this.inspectionSignature=null;
    const w = innerWidth, h = innerHeight, dpr = CFG.dpr;
    for (const c of [this.canvas, this.overlay]) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    const aspect = w / h;
    this.offX = 0;
    this.dist = Math.max(3.4, 1.25 / (Math.tan((20 * Math.PI) / 180) * aspect));
    // Keep the model above the bottom control drawer on phones.
    this.offY = w <= 600 ? this.dist * Math.tan(deg(20)) * .25 : 0;
    this.proj = perspective(40, aspect, 0.05, 30);
    this.projView = mul4(this.proj, translate4(this.offX, this.offY, -this.dist));
  }

  // ------------------------------------------------------------ frame
  frame(t) {
    if(!CFG.manual){const nextDpr=this.renderQuality.sample(this.last===null?0:t-this.last,{visible:document.visibilityState==='visible',camera:!!this.cam?.running,busy:!this.model||this.uploaded!==this.ctl.state.index||!!this.recorder.on});if(nextDpr!==CFG.dpr){CFG.dpr=nextDpr;this.resize();}}
    const dt = this.last === null ? 1 / 60 : clamp(t - this.last, 0, 1 / 30);   // clamp dt: spring physics stays stable on hitches
    this.last = t; this.t = t;
    this.motionTime += dt;
    const ctl = this.ctl, st = ctl.state;
    this.inspectionTransition.tick(this.motionTime);
    ctl.suspended = !!this.scanActive || !!this.transition.pending || !!this.inspectionTransition.pending;
    const switchTo = this.transition.commit(this.motionTime);
    if(switchTo!==null){
      this.hiddenSystems.clear();this.deselect();this.resetPose();st.select(switchTo,t);
      this.$('systemFocus').value='-1';this.$('inspectionView').value='all';this.$('separationMode').value='systems';
      this.surfaceRevealT=null;this.lastSolidBlend=0;
      if(CATALOG[switchTo].surface){this.spin=0;this.pitch=0;this.dragYaw=0;this.dragYawTarget=0;this.autoRotate=false;}
    }

    // 1. hand input — real camera (up to 2 hands), else synthetic streams (tests / demo) at camera rate (30 Hz)
    ctl.aspect = this.cam?.running && this.video.videoWidth ? this.video.videoWidth / this.video.videoHeight : 1;
    if (this.cam?.running) {
      const hands = this.cam.poll();
      if (hands !== undefined) ctl.onHands(hands, t);
      if (this.cam.newFrame) { this.cam.newFrame = false; this.hasVideo = true; } // Camera is drawn only in its small 2D preview.
    }
    if (this.demo) this.demo.tick(t);
    const src = this.demo ? () => this.demoHand ?? null : this.handSource;
    if (src && t - this.lastSynthT >= 1 / 30 - 1e-6) {
      this.lastSynthT = t;
      ctl.onHands([src(t), this.handSource2?.(t)].filter(Boolean), t);
    }
    for (const action of ctl.navigation.splice(0)) {
      if (this.scanActive) continue;
      if (action === 'model') { this.selectModel(st.index + 1, true); this.toast('Tay trái · mô hình tiếp'); }
      else this.nextBlock();
    }
    if(!this.scanActive&&!this.transition.pending&&!this.inspectionTransition.pending)ctl.tick(t);

    // 2. make sure the current model is on the GPU (built in the worker)
    if (st.targetDirty) {
      const m = this.store.get(st.index);
      if (m) {
        this.renderer.setModel(m); this.model = {...m,labels:m.labels.map(label=>({...label,labelVi:label.label,label:this.locale==='en'?(label.sourceName||label.info||label.label):label.label}))}; this.uploaded = st.index; this.uploadT = t; st.targetDirty = false;
        this.transition.uploaded(st.index,this.motionTime);
        if(this.transition.pending&&!this.transition.pending.autoForm)this.transition.complete();
        this.surfaceRevealT=null;
        this.manualExplode = this.quiz ? 1 : 0; this.deselect(); this.handYaw.reset(); this.zoomTarget = 1; this.prefetch();
      } else {const index=st.index;this.store.request(index).catch(error=>this.modelError(index,error));}
    }
    if(this.transition.shouldForm(this.motionTime)&&st.state===SPHERE)ctl.keyPose(FIST,t);
    const ready = this.uploaded === st.index && !st.targetDirty;
    const machine = ready && isMachine(st.index);
    const formed = st.state === FORMED && ready;
    let mode = st.simMode(), formT = st.formT(t);
    if (st.state === FORMED && !ready) mode = SIM.sphere;                 // hold the swirl until the model is uploaded
    if(formed){
      if(this.formStateTime!==st.tState||this.formUpload!==this.uploadT){this.formStateTime=st.tState;this.formUpload=this.uploadT;this.formMotionStart=this.motionTime;}
      formT=this.motionTime-this.formMotionStart;
    }
    const vis = ctl.handVisible(t);
    const pointing = !this.scanActive && vis && (ctl.pose === POINT || ctl.rawPose === POINT);
    const busyHand = this.scanActive || !!this.transition.pending || !!this.inspectionTransition.pending || pointing || ctl.pinch || vis && (ctl.navigationActive||ctl.rawPose===THUMB||ctl.pose===THUMB);
    const twoHands = !busyHand && vis && ctl.secondVisible(t) && formed;
    const visibleBlock = this.sel < 0 && machine && !this.quiz && this.$('separationMode').value !== 'muscles'
      ? singleVisibleGroup(this.model.labels, this.visiblePicks()) : null;

    // 3. Selecting a part freezes the assembled/exploded layout. Openness then owns only that selection.
    let target = 0;
    if (formed && machine) {
      // only a hand in THIS frame steers it (a hand that just left keeps its last openness for a while)
      if (this.sel < 0 && !visibleBlock && vis && ctl.landmarks && !busyHand && !twoHands && !this.sliderActive) { target = smooth(0.12, 0.85, ctl.openness); this.manualExplode = target; }
      else target = this.manualExplode;
      // curling the fingers into a point / pinch briefly reads as "closing": restore the openest recent value
      this.expHist.push([t, target]);
      while (this.expHist[0][0] < t - 0.5) this.expHist.shift();
      if (this.sel < 0 && busyHand && !this.wasBusy) { this.manualExplode = Math.max(...this.expHist.map((h) => h[1])); target = this.manualExplode; }
    } else this.expHist = [];
    this.wasBusy = busyHand;
    this.explode += (target - this.explode) * (1 - Math.exp(-dt * 7));
    if (Math.abs(this.explode - target) < 1e-4) this.explode = target;

    // 4. zoom: two hands apart = bigger, together = smaller (relative to where they started)
    if (twoHands) {
      const a = ctl.landmarks[9], b = ctl.second[9], spread = Math.hypot((a[0] - b[0]) * ctl.aspect, a[1] - b[1]);
      if (!this.zoomGrab) this.zoomGrab = { spread: Math.max(spread, 0.02), zoom: this.zoomTarget };
      this.zoomTarget = clamp((this.zoomGrab.zoom * spread) / this.zoomGrab.spread, 0.5, 2.6);
    } else this.zoomGrab = null;
    this.zoom += (this.zoomTarget - this.zoom) * (1 - Math.exp(-dt * 8));

    // 5. Hand rotation is yaw only. Vertical palm motion never tilts the model.
    const def = CATALOG[st.index];
    const handRot = this.handRotate && formed && vis && !!ctl.landmarks && !busyHand && !twoHands;
    const transientRot = this.handRotate && formed && vis && !this.transition.pending && !this.scanActive && !twoHands && ctl.pose !== POINT && ctl.rawPose!==THUMB && !ctl.pinch && !ctl.navigationActive;
    if (handRot && !this.handYaw.anchor) ctl.rebaseRoll();
    // Hand yaw is measured in world view, so a previous mouse/preset yaw must
    // not remain as a second offset when the upright hand takes control.
    const nextYaw = this.handYaw.update(this.spin + this.dragYaw, ctl.roll, handRot, dt, transientRot);
    if (handRot) { this.spin = nextYaw; this.dragYaw = 0; this.dragYawTarget = 0; }
    this.pitch = 0;
    if (!handRot && !(vis && (busyHand || twoHands)) && this.autoRotate && this.sel < 0) this.spin += dt * .35 * (1 - this.explode);
    this.handRotating = handRot;
    this.dragYaw += ((this.dragYawTarget??this.dragYaw)-this.dragYaw)*(1-Math.exp(-dt*14));
    const rot = matMul(rotX(deg(def.tilt || 0) + this.pitch), rotY(this.spin + this.dragYaw));

    // 6. life: the heart beats (lub-dub), the lungs breathe; light pulses flow through them
    const life = formed ? smooth(0.5, 1.5, formT) : 0;
    let pulse = 1, flow = 0;
    if (def.pulse) {
      const p = ((t * def.pulse.bpm) / 60) % 1, g = (x) => Math.exp(-((x / 0.065) ** 2));
      pulse = 1 - def.pulse.amp * (g(p) + g(p - 1) + 0.6 * g(p - 0.3)); flow = 1;
    } else if (def.breath) {
      pulse = 1 + def.breath.amp * 0.5 * (1 - Math.cos((2 * Math.PI * t) / def.breath.period)); flow = 0.6;
    }
    this.pulse = 1 + (pulse - 1) * life; this.flow = flow * life;

    const m = ready ? this.model : null;
    this.scale = m ? 1 + (m.fitScale - 1) * this.explode : 1;
    let scale = this.scale * this.pulse * (def.displayScale || 1);
    const focusPick=Number(this.$('systemFocus').value);
    const restricted=focusPick>=0||this.$('inspectionView').value!=='all'||this.hiddenSystems.size>0;
    const signature=[this.uploaded,focusPick,this.$('inspectionView').value,this.$('showCover').checked,[...this.hiddenSystems].join(','),this.explode.toFixed(3)].join('|');
    if(signature!==this.inspectionSignature){
      this.inspectionSignature=signature;
      const aspect=this.overlay.width/this.overlay.height;
      const radius=Math.min(.85,this.dist*Math.sin(deg(20))*Math.min(.75,aspect*.6));
      this.inspectionFit=restricted&&m?.surface?inspectionFrame(m.surface,this.visiblePicks(),radius,{explode:this.explode,exCenter:m.exCenter}):null;
    }
    this.inspectionCenter=this.inspectionFit?.center||[0,0,0];
    // Restricted views already fit the source bounds, including their offsets.
    // Applying the whole-model fit a second time makes separated parts tiny.
    if(this.inspectionFit)scale=this.inspectionFit.scale*this.pulse;
    const exCenter = m ? m.exCenter : [0, 0, 0];
    this.drawScale=scale;
    // Pull toward the observer without pushing a selected top-row part out of the viewport.
    const corners=[],es=this.explode*this.explode*(3-2*this.explode);
    for(const envelope of this.selection?.envelope||[])for(const point of envelope.corners)corners.push(matVec(rot,point.map((v,k)=>(v+envelope.offset[k]*es-exCenter[k]*this.explode-this.inspectionCenter[k])*scale)));
    this.pullDistance=this.selection?.layout?0:fitPullDistance(corners,this.dist/this.zoom,this.overlay.height/CFG.dpr);
    // while exploded, slide the model toward the middle so both label columns have room
    this.projView = mul4(this.proj, translate4(this.offX * (1 - 0.45 * this.explode), this.offY, -this.dist / this.zoom));

    // 7. parts: screen anchors, point-to-pick (dwell), pinch-to-pull, quiz, cut-away plane
    this.computeAnchors(formed && machine && m && !this.transition.pending, rot, exCenter, scale);
    if (this.pendingBlock != null && formed && machine) {
      const pick=this.pendingBlock;this.pendingBlock=null;
      this.selectPart(pick,'cycle','system');
    }
    if (visibleBlock && formed && vis && ctl.landmarks && !busyHand && !twoHands && !this.sliderActive) {
      this.selectPart(visibleBlock.pick, 'gesture', 'group');
      // An unselected, single visible block follows the existing absolute
      // open-hand contract. Explicit point/click selections retain their safe
      // relative baseline, so releasing a point cannot yank them apart.
      this.partSeparation.set(smooth(.12, .85, ctl.openness));
    }
    this.updatePicking(t, pointing, formed && machine && !this.inspectionTransition.pending);
    this.pullAmt = this.partSeparation.update(ctl.openness, this.sel >= 0 && formed && vis && !!ctl.landmarks && !busyHand && !twoHands && !this.sliderActive, ctl.lastHandT, dt);
    this.pulled = this.partSeparation.target > .01;
    // Anchors and solid meshes must use the same current-frame pull amount.
    this.computeAnchors(formed && machine && m && !this.transition.pending, rot, exCenter, scale);
    this.updateQuiz(t, formed && machine && m);
    if (this.cut.on) {
      if (vis && !busyHand && ctl.landmarks) {
        const c0 = project(this.projView, [0, 0, 0]), rr = this.globeRadiusPx();
        const px = this.toScreen([ctl.handX, ctl.handY])[0], cx = (c0[0] * 0.5 + 0.5) * this.overlay.width;
        this.cut.target = clamp((px - cx) / rr, -1.25, 1.25);
      }
      this.cut.x += (this.cut.target - this.cut.x) * (1 - Math.exp(-dt * 10));
    }

    let simulationFormT=formT;
    if(this.inspectionTransition.pending){
      const view=this.inspectionTransition.pending;
      mode=view.phase==='out'?SIM.sphere:SIM.formed;
      simulationFormT=view.phase==='in'?this.motionTime-view.time:0;
    }
    const kick = st.consumeKick() ? 1 : 0;                                // one-frame impulse, read exactly once
    const sel = this.sel >= 0 && formed ? this.sel : -100;
    if(!formed||this.lastSolidBlend!==1||this.transition.pending||this.inspectionTransition.pending)this.renderer.step({ dt, time: t, mode, formT:simulationFormT, kick, rot, sphereR: 0.85, explode: this.explode, scale, exCenter, sel, partAmount:this.pullAmt,partScale:this.selection?.layout?.scale??1,pull: [0, 0, this.pullDistance * this.pullAmt] });

    // 8. colour morph + per-part colours once a machine has formed
    const k = 1 - Math.exp(-dt * 4);
    for (let i = 0; i < 3; i++) this.color[i] += (def.color[i] - this.color[i]) * k;
    const tintT = machine && st.state === FORMED ? smooth(0.2, 1.4, formT) : 0;
    this.tintMix += (tintT - this.tintMix) * (1 - Math.exp(-dt * 5));
    const alpha = st.alpha(t);
    let solidBlend=0;
    if(!formed)this.surfaceRevealT=null;
    else if(m?.surface&&formT>.55&&this.renderer.atlasSurface?.ready){
      if(this.surfaceRevealT==null)this.surfaceRevealT=this.motionTime;
      solidBlend=smooth(0,1.2,this.motionTime-this.surfaceRevealT);
    }
    if(this.transition.pending?.phase==='out')solidBlend=this.transition.outgoingBlend(this.motionTime);
    else if(solidBlend===1&&this.transition.pending?.phase==='gathering')this.transition.complete();

    solidBlend*=this.inspectionTransition.blend(this.motionTime);
    this.lastSolidBlend=solidBlend;
    this.renderer.draw({
      showCover:this.$('showCover')?.checked,
      systemFocus:Number(this.$('systemFocus').value),
      inspectionView:this.$('inspectionView').value,
      hiddenSystems:this.hiddenSystems,selectedPicks:this.selection?.ids,
      partLayout:this.selection?.layout,partAmount:this.pullAmt,
      inspectionCenter:this.inspectionCenter,
      solidBlend,projection:this.proj,view:translate4(this.offX*(1-.45*this.explode),this.offY,-this.dist/this.zoom),rot,explode:this.explode,scale,exCenter,pull:[0,0,this.pullDistance*this.pullAmt],
      projView: this.projView, globeMvp: mul4(this.projView, rotY4(0.1 * t)), color: this.color, tintMix: this.tintMix,
      alpha, trails: this.trails, trailLen: 0.06, pointPx: this.canvas.height * 0.012 * Math.sqrt(this.zoom) * (def.pointScale || 1), gain: this.gain * (def.gainScale || 1),
      video: { has: false, dim: 0.65 }, sel, cutOn: this.cut.on && formed, cut: this.cut.x, flow: this.flow, time: t,
    });
    this.drawOverlay(t, machine, formT, pointing);
    this.recorder.frame();
    this.frames++; this._fpsN++;
    if (t - this._fpsT >= 1) { this.fps = this._fpsN / (t - this._fpsT); this._fpsN = 0; this._fpsT = t; }
    if (t-(this.hudTime??-1)>=.2 || CFG.manual) {this.hudTime=t;this.updateHud(t, formT);}
  }

  // ------------------------------------------------------------ parts: anchors, picking, pulling
  globeRadiusPx() { const P = this.projView, c0 = project(P, [0, 0, 0]); return Math.abs((project(P, [0, 1, 0])[1] - c0[1]) * 0.5 * this.overlay.height); }
  computeAnchors(on, rot, exCenter, scale) {
    this.anchors = [];
    if (!on) return;
    const W = this.overlay.width, H = this.overlay.height, P = this.projView;
    if(this.anchorModel!==this.model){
      this.anchorModel=this.model;this.anchorGroups=new Map();this.coverPicks=new Set();
      for(const group of this.model.surface?.groups||[]){if(!this.anchorGroups.has(group.pick))this.anchorGroups.set(group.pick,group);if(group.cover)this.coverPicks.add(group.pick);}
    }
    const showCover=this.$('showCover').checked,view=this.$('inspectionView').value,focus=Number(this.$('systemFocus').value);
    this.model.labels.forEach((L, li) => {
      if(this.coverPicks.has(li)&&!showCover)return;
      const group=this.anchorGroups.get(li);
      if(group&&!inspectionVisible(group,view,this.hiddenSystems))return;
      if(focus>=0&&li!==focus)return;
      const s0 = this.model.surface ? this.explode : clamp((this.explode - L.stage) / Math.max(1 - L.stage, 1e-3), 0, 1), s = s0 * s0 * (3 - 2 * s0);
      const q = [0, 1, 2].map((i) => ((L.surfaceAnchor||L.centroid)[i] + L.offset[i] * s - exCenter[i] * this.explode - (this.inspectionCenter?.[i]||0)) * scale);
      const local=partTransform(li,this.selection?.layout,this.pullAmt);
      const w = matVec(rot, q.map((v,k)=>v*local.scale+local.offset[k]));
      w[2] += selectedPull(li,this.selection,this.pullAmt,this.pullDistance)[2];
      const [nx, ny] = project(P, w);
      this.anchors.push({ li, L, px: (nx * 0.5 + 0.5) * W, py: (0.5 - ny * 0.5) * H });
    });
  }
  nearestAnchor(x, y, maxPx) {
    let best = -1, bd = maxPx;
    for (const a of this.anchors) { const d = Math.hypot(a.px - x, a.py - y); if (d < bd) { bd = d; best = a.li; } }
    return best;
  }
  visiblePicks(ignoreFocus=false) {
    const ids = new Set(), focus = ignoreFocus ? -1 : Number(this.$('systemFocus').value);
    for (const group of this.model?.surface?.groups || []) {
      if (group.cover && !this.$('showCover').checked) continue;
      if (focus >= 0 && group.pick !== focus) continue;
      if (inspectionVisible(group, this.$('inspectionView').value, this.hiddenSystems)) ids.add(group.pick);
    }
    return ids;
  }
  modelBlocks() {
    const ids=new Set();
    for(const group of this.model?.surface?.groups||[]){
      if(!this.hiddenSystems.has(group.system)&&(!group.cover||this.$('showCover').checked))ids.add(group.pick);
    }
    return systemBlocks(this.model?.labels||[],ids);
  }
  changeInspection(apply) {
    if(this.transition.pending||this.scanActive)return;
    if(this.model?.surface&&this.ctl.state.state===FORMED)this.inspectionTransition.begin(()=>{apply();this.inspectionSignature=null;},this.motionTime);
    else apply();
  }
  nextBlock() {
    if(this.quiz){this.toast('Kết thúc luyện tập để chuyển hệ bên trong');return;}
    if(this.scanActive||this.transition.pending||this.inspectionTransition.pending||this.uploaded!==this.ctl.state.index||this.ctl.state.state!==FORMED||!this.model?.surface){this.toast('Chờ mô hình hiện ra để chuyển hệ bên trong');return;}
    const blocks=this.modelBlocks();if(!blocks.length)return;
    const current=this.selection?.system||this.$('inspectionView').value.replace(/^system:/,'');
    const index=(blocks.findIndex(block=>block.system===current)+1)%blocks.length,block=blocks[index];
    this.changeInspection(()=>{
    this.deselect();setMuscleSeparation(this.model,false);
    this.$('inspectionView').value='system:'+block.system;
    if(this.$('inspectionView').value!=='system:'+block.system){
      const profile=availableInspectionViews(this.model.surface.groups).find(view=>view.systems?.length===1&&view.systems[0]===block.system);
      this.$('inspectionView').value=profile?.id||'all';
    }
    this.$('systemFocus').value='-1';this.manualExplode=0;this.explode=0;this.expHist=[];this.pendingBlock=block.pick;
    this.populateFocus();this.toast(`Tay phải · ${SYSTEM_LABELS[block.system]||block.system} · ${index+1}/${blocks.length}`);
    });
  }
  pickTarget(x,y) {
    const tag=this.labelHits.find(a=>x>=a.x&&x<=a.x+a.w&&y>=a.y&&y<=a.y+a.h);
    if(tag)return {li:tag.li,scope:tag.scope||'part'};
    const solid=this.lastSolidBlend>=.99&&this.renderer.atlasSurface?.ready;
    const li=solid?this.renderer.atlasSurface.pick(x,y,this.canvas.width,this.canvas.height):this.nearestAnchor(x,y,45*CFG.dpr);
    const group=!!this.model?.surface&&this.$('selectionScope').value==='group'&&this.$('separationMode').value!=='muscles'&&!this.quiz;
    return {li,scope:group?'group':'part'};
  }
  updatePicking(t, pointing, active) {
    const ctl = this.ctl;
    this.pointer = null;
    if (!active) { this.hover = { li: -1, t0: t }; return; }
    if (pointing && ctl.landmarks) {
      const [x, y] = this.toScreen(ctl.landmarks[8]);
      // One hit test per inference frame, not sixty raycasts for the same fingertip.
      if(this.pointSample!==ctl.lastHandT){this.pointHit=this.pickTarget(x,y);this.pointSample=ctl.lastHandT;}
      const {li,scope}=this.pointHit;
      const key=selectionFor(this.model.labels,li,scope)?.key;
      if (key !== this.hover.key) this.hover = { li, key, t0: t };
      const prog = li >= 0 ? clamp((t - this.hover.t0) / DWELL_S, 0, 1) : 0;
      this.pointer = { x, y, li, prog };
      if (li >= 0 && prog >= 1 && key !== this.selection?.key) this.selectPart(li, 'point',scope);
    } else {this.hover = { li: -1, t0: t };this.pointSample=null;}
    if (ctl.pinchStart) {
      ctl.pinchStart = false;
      if (this.sel >= 0) { this.setSeparation(this.partSeparation.target>.5?0:1); this.toast(this.pulled ? 'Đã kéo phần được chọn ra' : 'Đã lắp phần được chọn lại'); }
    }
  }
  selectPart(li, source = 'click',scope='part') {
    if (!this.model || !this.model.labels[li]) return;
    if (this.quiz && !this.quiz.done && this.quiz.phase === 'ask') { this.answerQuiz(li); return; }
    if(this.$('separationMode').value==='selected')this.$('separationMode').value=this.separationBeforeSelection||'systems';
    this.sel = li; this.selection=selectionFor(this.model.labels,li,scope,this.visiblePicks()); this.partSeparation.select(); this.pullAmt=0; this.pulled = false;
    this.selection.envelope=pullEnvelope(this.model.surface,this.selection.ids);
    const height=this.overlay.height/CFG.dpr,width=this.overlay.width/CFG.dpr;
    const radius=this.dist/this.zoom*Math.sin(deg(20))*Math.max(.2,Math.min(width<=600?.35:.75,(height-200)/height,width/height*.55))*.94;
    this.selection.layout=partLayout(this.model.surface,this.selection.ids,{scale:this.drawScale||1,explode:this.explode,exCenter:this.model.exCenter,inspectionCenter:this.inspectionCenter,radius});
    if(this.selection.layout){this.separationBeforeSelection=this.$('separationMode').value;this.$('separationMode').value='selected';}
    this.manualExplode=this.explode;this.expHist=[];this.handYaw.reset();this.autoRotate=false;
    this.renderer.setSelection(this.selection.ids,li,this.selection.layout);
    const L = this.selectionLabel();
    if(this.autoRead&&source!=='voice-external'&&source!=='gesture')this.readSelected();
    this.toast(`☝ ${L.label}`);
  }
  selectionLabel() {
    const L=this.model?.labels[this.sel];if(!L||!this.selection||this.selection.ids.size<=1)return L;
    const name=this.selection.skull?'Khối hộp sọ':SYSTEM_LABELS[this.selection.system]||L.label;
    return {...L,label:name,labelVi:name,info:this.selection.skull?'Gồm xương sọ, hàm và răng nguồn':'Nhóm giải phẫu',sourceName:this.selection.skull?'Skull':name,sourceId:'',latin:'',description:'Đang chọn cả khối gồm '+this.selection.ids.size+' cấu trúc nguồn. Nắm rồi xòe tay để tách từng cấu trúc bên trong; nắm lại để lắp về đúng vị trí. Các hệ khác giữ nguyên.',descriptionEn:'Selected group: '+this.selection.ids.size+' source structures. Close then open your hand to separate its individual structures; close to reassemble. Other systems stay fixed.',learningNotes:[]};
  }
  setSeparation(value) {
    if(this.sel<0&&this.model?.surface&&!this.quiz&&this.$('separationMode').value!=='muscles'){
      const block=singleVisibleGroup(this.model.labels,this.visiblePicks());
      if(block)this.selectPart(block.pick,'button','group');
    }
    if(this.sel>=0){this.partSeparation.set(value);this.pulled=value>.01;}else this.manualExplode=value;
  }
  splitSelected() {
    if(!this.model?.surface)return;
    if(!this.selection?.layout){
      const block=singleVisibleGroup(this.model.labels,this.visiblePicks());
      const li=this.sel>=0?this.sel:block?.pick??(this.anchors.find(a=>selectionKey(a.L)==='skull')||this.anchors[0])?.li;
      if(li==null)return;
      this.selectPart(li,'button','group');
    }
    this.setSeparation(this.partSeparation.target>.5?0:1);
  }
  deselect() { this.pendingBlock=null;if(this.$('separationMode').value==='selected')this.$('separationMode').value=this.separationBeforeSelection||'systems';this.separationBeforeSelection=null;this.sel = -1; this.selection=null;this.partSeparation.clear();this.pullAmt=0;this.pulled = false;this.handYaw.reset();this.hover={li:-1,t0:this.t||0};this.pointSample=null;this.labelHits=[];this.renderer?.setSelection(null,-1); }
  say(text) { this.spoken.push(text); if (this.autoRead) void this.speaker.speak(text,{language:this.voiceLanguage}); }

  // ------------------------------------------------------------ quiz: "find the hippocampus"
  startQuiz() {
    this.$('systemFocus').value='-1';
    const st = this.ctl.state;
    if (!isMachine(st.index)) this.selectModel(CATALOG.findIndex((d) => d.name === 'Human Brain'));
    else if (st.state !== FORMED) this.selectModel(st.index);
    this.quiz = { pending: true, total: QUIZ_LEN, asked: 0, score: 0, target: -1, phase: 'wait', nextAt: 0, done: false, feedback: '', seed: this.frames };
    this.manualExplode = 1;
    this.toast(this.word('🎓 Luyện tập: chỉ vào cấu trúc được gọi tên','🎓 Quiz: point at the named structure'));
  }
  stopQuiz() { this.quiz = null; this.deselect(); }
  updateQuiz(t, ready) {
    const q = this.quiz;
    if (!q || !ready) return;
    if (q.pending) {
      q.pending = false;
      const n = this.model.labels.length, order = [...Array(n).keys()].filter(i=>!this.model.surface?.groups.some(g=>g.pick===i&&g.cover)||this.$('showCover').checked);
      let s = (q.seed * 2654435761) >>> 0;
      for (let i = order.length - 1; i > 0; i--) { s = (s * 1664525 + 1013904223) >>> 0; const j = s % (i + 1); [order[i], order[j]] = [order[j], order[i]]; }
      q.order = order; this.manualExplode = 1; this.nextQuestion();
    }
    if (q.phase === 'feedback' && t >= q.nextAt) this.nextQuestion();
    if (q.done && t >= q.nextAt + 4) this.stopQuiz();
  }
  nextQuestion() {
    const q = this.quiz;
    this.deselect();
    if (q.asked >= q.total) {
      q.done = true; q.phase = 'done'; q.nextAt = this.t;
      q.feedback = this.word(`🏆 Điểm ${q.score} / ${q.total}`,`🏆 Score ${q.score} / ${q.total}`);
      this.say(this.voiceLanguage==='en'?`Quiz finished. You scored ${q.score} out of ${q.total}.`:`Kết thúc kiểm tra. Bạn đạt ${q.score} trên ${q.total} điểm.`);
      return;
    }
    q.target = q.order[q.asked % q.order.length]; q.asked++; q.phase = 'ask'; q.feedback = '';
    const name=readingText(this.model.labels[q.target],null,this.voiceLanguage,'name').text;
    this.say(this.voiceLanguage==='en'?`Find the ${name}`:`Tìm ${name}`);
  }
  answerQuiz(li) {
    const q = this.quiz, L = this.model.labels;
    const ok = li === q.target;
    if (ok) q.score++;
    q.phase = 'feedback'; q.nextAt = this.t + 1.8;
    q.feedback = ok ? this.word(`✅ Đúng! ${L[li].label}`,`✅ Correct! ${L[li].label}`) : this.word(`❌ Bạn chọn ${L[li].label}. Đáp án: ${L[q.target].label}.`,`❌ That's the ${L[li].label}. Here is the ${L[q.target].label}.`);
    this.selectPart(q.target,'quiz');                                  // reveal the right answer
    const name=readingText(L[li],null,this.voiceLanguage,'name').text;
    this.say(this.voiceLanguage==='en'?(ok?`Correct! ${name}`:`No, that's the ${name}.`):(ok?`Đúng! ${name}`:`Chưa đúng. Đây là ${name}.`));
  }

  // ------------------------------------------------------------ voice
  voiceCommand(text,options={}) {
    this.lastHeard = text;
    const acts = parseCommand(text, CATALOG, this.model && isMachine(this.uploaded) && this.uploaded === this.ctl.state.index ? this.model.labels : []);
    const st = this.ctl.state, done = [];
    for (const a of acts) {
      if (a.type === 'model') { const index=CATALOG.findIndex(d=>d.id===a.id);if(index<0)continue;this.selectModel(index);done.push(a.name); }
      else if (a.type === 'part') { const L=this.model?.labels[a.index];if(!L)continue;this.hiddenSystems.delete(L.system);this.$('inspectionView').value='all';if(this.model.surface?.groups.some(g=>g.pick===a.index&&g.cover))this.$('showCover').checked=true;this.populateFocus();this.selectPart(a.index,options.external?'voice-external':'voice');done.push(L.label); }
      else if (a.type === 'explode') { this.setSeparation(1); done.push('explode'); }
      else if (a.type === 'assemble') { this.setSeparation(0);this.ctl.keyPose(FIST,this.t);done.push('assemble'); }
      else if (a.type === 'next') { this.selectModel(st.index + 1); done.push('next'); }
      else if (a.type === 'prev') { this.selectModel(st.index - 1); done.push('previous'); }
      else if (a.type === 'snap') { if (st.state === IDLE) this.ctl.keySnap(this.t); done.push('snap'); }
      else if (a.type === 'dissolve') { if (st.state !== IDLE) this.ctl.keySnap(this.t); done.push('dissolve'); }
      else if (a.type === 'quiz') { this.startQuiz(); done.push('quiz'); }
      else if (a.type === 'stopQuiz') { this.stopQuiz(); done.push('stop quiz'); }
      else if (a.type === 'cut') { this.cut.on=true;this.$('bCut').classList.add('on');done.push('cut'); }
      else if (a.type === 'zoomIn') { this.zoomTarget = clamp(this.zoomTarget * 1.3, 0.5, 2.6); done.push('zoom in'); }
      else if (a.type === 'zoomOut') { this.zoomTarget = clamp(this.zoomTarget / 1.3, 0.5, 2.6); done.push('zoom out'); }
      else if (a.type === 'rotate') { this.autoRotate=a.value;this.$('bRotate').classList.toggle('on',a.value);done.push(a.value?'rotate':'stop rotation'); }
      else if (a.type === 'record') { if(!this.recorder.on)void this.toggleRecord();done.push('record'); }
      else if (a.type === 'stopRecord') { if(this.recorder.on)void this.toggleRecord();done.push('stop recording'); }
      else if (a.type === 'describe') {
        if(!options.external)this.readSelected();done.push('describe');
      }
      else if(a.type==='stopRead'){this.speaker.stop();done.push('stop reading');}
      else if(a.type==='micOff'){this.voice.stop();done.push('microphone off');}
      else if(a.type==='cameraOn'){if(!this.camOn)void this.startCamera();done.push('camera on');}
      else if(a.type==='cameraOff'){if(this.camOn)this.stopCamera();done.push('camera off');}
      else if(a.type==='scan'){if(!this.camOn){this.toast(this.voiceLanguage==='en'?'Turn on the camera before scanning':'Bật camera trước khi quét');continue;}this.$('scanCamera').click();done.push('scan');}
      else if(a.type==='scanCancel'){this.$('scanCancel').click();done.push('cancel scan');}
      else if(['front','back','side','reset'].includes(a.type)){this.$({front:'viewFront',back:'viewBack',side:'viewSide',reset:'viewReset'}[a.type]).click();done.push(a.type);}
      else if(a.type==='cutOff'){this.cut.on=false;this.$('bCut').classList.remove('on');done.push('cut off');}
      else if(a.type==='labelsOn'||a.type==='labelsOff'){this.labelsOn=a.type==='labelsOn';this.$('bLabels').classList.toggle('on',this.labelsOn);done.push(a.type);}
      else if(a.type==='clear'){this.deselect();done.push('clear');}
      else if(a.type==='pull'||a.type==='putBack'){if(this.sel<0)continue;this.setSeparation(a.type==='pull'?1:0);done.push(a.type);}
      else if(a.type==='muscleSplit'||a.type==='systemSplit'){if(a.type==='muscleSplit'&&!this.model?.surface?.groups.some(g=>g.system==='muscular'))continue;this.hiddenSystems.clear();this.$('separationMode').value=a.type==='muscleSplit'?'muscles':'systems';this.$('separationMode').dispatchEvent(new Event('change'));done.push(a.type);}
      else if(a.type==='showAll'){this.hiddenSystems.clear();this.$('inspectionView').value='all';this.$('showCover').checked=true;this.populateFocus();done.push(a.type);}
      else if(['layerOn','layerOff','layerOnly'].includes(a.type)){
        const available=new Set(this.model?.surface?.groups.map(g=>g.system));const systems=a.systems.filter(system=>available.has(system));if(!systems.length)continue;
        if(a.type==='layerOnly')this.hiddenSystems=new Set([...available].filter(system=>!systems.includes(system)));
        else for(const system of systems){if(a.type==='layerOff')this.hiddenSystems.add(system);else this.hiddenSystems.delete(system);}
        this.$('inspectionView').value='all';this.$('systemFocus').value='-1';this.deselect();
        if(systems.includes('integumentary'))this.$('showCover').checked=a.type!=='layerOff';
        this.populateFocus();done.push(a.type);
      }
    }
    this.$('voiceHeard').textContent='“'+text+'”';
    this.toast(`🎤 “${text}”${done.length ? ' → ' + commandFeedback(done,CATALOG,this.model?.labels,this.locale) : this.word(' · Chưa khớp lệnh hoặc cấu trúc duy nhất',' · No matching command or unique structure')}`);
    return done;
  }
  toggleVoice() {
    if(this.voice.on)this.voice.stop();
    else{this.$('voicePanel').open=true;this.speaker.stop();this.$('voiceNote').textContent='';if(window.parent!==window)window.parent.postMessage({type:'soma-voice-owner',owner:'vision'},location.origin);this.voice.start(this.voiceLanguage);}
  }
  updateVoiceUI(){
    const en=this.locale==='en',language=this.voiceLanguage==='en'?this.word('tiếng Anh','English'):this.word('tiếng Việt','Vietnamese'),states=en?{off:'Microphone off',starting:'Starting microphone…',listening:'Listening · '+language,paused:'Microphone paused while reading',error:'Microphone error',unsupported:'Speech recognition unavailable'}:{off:'Micro đang tắt',starting:'Đang mở micro…',listening:'Đang nghe · '+language,paused:'Tạm ngừng nghe khi loa đọc',error:'Micro gặp lỗi',unsupported:'Trình duyệt chưa hỗ trợ nhận dạng'};
    this.$('micStatus').textContent=states[this.voiceState||'off'];this.$('bVoice').classList.toggle('on',this.voiceOn);
    this.$('bVoice').setAttribute('aria-label',en?(this.voiceOn?'Turn off voice microphone':'Turn on voice microphone'):(this.voiceOn?'Tắt micro điều khiển':'Bật micro điều khiển'));
    this.$('speakerStatus').textContent=this.speakerState==='speaking'?(en?'Reading aloud…':'Đang đọc…'):this.speakerState==='loading'?(en?'Loading voices…':'Đang nạp giọng đọc…'):(en?'Speaker idle':'Loa đang nghỉ');
  }
  voiceError(error){
    this.$('voicePanel').open=true;
    const en=this.locale==='en';this.$('voiceNote').textContent=error.startsWith('missing-')?this.word('Thiết bị chưa có giọng '+(this.voiceLanguage==='en'?'tiếng Anh':'tiếng Việt')+'. Chọn ngôn ngữ khác hoặc cài giọng đọc.','This device has no '+(this.voiceLanguage==='en'?'English':'Vietnamese')+' voice. Choose another language or install a voice.'):['not-allowed','service-not-allowed'].includes(error)?(en?'Microphone permission was denied.':'Quyền micro đã bị từ chối.'):error==='network'?(en?'Speech recognition has a network error. Retry in Chrome/Edge or use the text command below.':'Dịch vụ giọng nói đang lỗi mạng. Thử Chrome/Edge hoặc nhập lệnh văn bản bên dưới.'):error==='audio-capture'?(en?'No microphone is available. Check your audio input or use a text command.':'Không tìm thấy micro. Kiểm tra thiết bị đầu vào hoặc dùng lệnh văn bản.'):error==='start-timeout'?(en?'The speech service did not start. Retry or use a text command.':'Dịch vụ giọng nói chưa khởi động. Bấm thử lại hoặc dùng lệnh văn bản.'):(en?'Voice is unavailable or could not start. Use Chrome/Edge or a text command.':'Giọng nói chưa hỗ trợ hoặc không khởi động được. Dùng Chrome/Edge hoặc lệnh văn bản.');
  }
  readSelected(){
    if(window.parent!==window)window.parent.postMessage({type:'soma-voice-owner',owner:'vision'},location.origin);
    const content=readingText(this.selectionLabel(),CATALOG[this.ctl.state.index],this.voiceLanguage,this.$('readDetail').value);
    this.$('voiceNote').textContent=content.missing?(this.voiceLanguage==='en'?this.word('Nguồn chưa có mô tả tiếng Anh; chỉ đọc tên gốc.','No English description in the source; reading the source name only.'):this.word('Nguồn chưa có mô tả riêng; đọc tên cấu trúc và nội dung có sẵn.','No Vietnamese description in the source; reading the available structure name.')) :'';
    this.spoken.push(content.text);void this.speaker.speak(content.text,{language:this.voiceLanguage});
  }

  // ------------------------------------------------------------ cut-away + recording
  toggleCut() { this.cut.on = !this.cut.on; this.$('bCut').classList.toggle('on', this.cut.on); this.toast(this.cut.on ? this.word('✂ Mặt cắt: di chuyển tay hoặc chuột sang trái/phải','✂ Cut-away: move your hand or mouse left/right') : this.word('✂ Đã tắt mặt cắt','✂ Cut-away off')); }
  async toggleRecord() {
    if (!Recorder.supported()) { this.toast(this.word('Trình duyệt này không hỗ trợ ghi hình','Recording is not supported in this browser')); return; }
    if (!this.recorder.on) { this.recorder.start(); this.$('bRec').classList.add('on'); this.toast(this.word('⏺ Đang ghi hình…','⏺ Recording…')); return; }
    const blob = await this.recorder.stop();
    this.$('bRec').classList.remove('on');
    if (!blob) return;
    this.lastRecording = { size: blob.size, type: blob.type };
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `wondersnap-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.webm`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 10000);
    this.toast(this.word(`💾 Đã lưu video ${(blob.size / 1e6).toFixed(1)} MB`,`💾 Saved ${(blob.size / 1e6).toFixed(1)} MB video`));
  }

  // ------------------------------------------------------------ overlay: hands, pointer, labels
  videoAspect() { return this.hasVideo && this.camOn && this.video.videoWidth ? this.video.videoWidth / this.video.videoHeight : 16 / 9; }
  toScreen([x, y]) {
    const W = this.overlay.width, H = this.overlay.height, va = this.videoAspect();
    if (va > W / H) { const dw = H * va; return [(x - 0.5) * dw + W / 2, y * H]; }
    const dh = W / va; return [x * W, (y - 0.5) * dh + H / 2];
  }
  toNorm([px, py]) {
    const W = this.overlay.width, H = this.overlay.height, va = this.videoAspect();
    if (va > W / H) { const dw = H * va; return [(px - W / 2) / dw + 0.5, py / H]; }
    const dh = W / va; return [px / W, (py - H / 2) / dh + 0.5];
  }
  drawHand(g, lm, col, dpr) {
    const P = lm.map((p) => this.toScreen(p));
    g.lineWidth = 2 * dpr; g.strokeStyle = col; g.globalAlpha = 0.75; g.shadowColor = col; g.shadowBlur = 10 * dpr;
    g.beginPath();
    for (const [a, b] of HAND_EDGES) { g.moveTo(P[a][0], P[a][1]); g.lineTo(P[b][0], P[b][1]); }
    g.stroke();
    g.fillStyle = '#fff'; g.globalAlpha = 0.9;
    for (const p of P) { g.beginPath(); g.arc(p[0], p[1], 2.6 * dpr, 0, Math.PI * 2); g.fill(); }
    return P;
  }
  drawOverlay(t, machine, formT, pointing) {
    this.labelHits=[];
    this.drawCameraPreview(t);
    const g = this.octx, W = this.overlay.width, H = this.overlay.height, dpr = CFG.dpr, ctl = this.ctl;
    g.clearRect(0, 0, W, H);
    const lm = null; // Hand skeleton lives in the camera preview; picking cursor stays on the model.
    if (lm) {
      const P = this.drawHand(g, lm, ctl.pinch ? '#ff9f43' : POSE_COLOR[ctl.pose] || '#fff', dpr);
      if (machine && ctl.state.state === FORMED && !pointing && !ctl.secondVisible(t)) {   // openness ring around the palm
        const c = this.toScreen([(lm[0][0] + lm[9][0]) / 2, (lm[0][1] + lm[9][1]) / 2]);
        const r = Math.hypot(P[0][0] - P[9][0], P[0][1] - P[9][1]) * 1.4;
        g.globalAlpha = 0.25; g.lineWidth = 6 * dpr; g.beginPath(); g.arc(c[0], c[1], r, 0, Math.PI * 2); g.stroke();
        g.globalAlpha = 0.95; g.strokeStyle = '#ffd166'; g.shadowColor = '#ffd166';
        g.beginPath(); g.arc(c[0], c[1], r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * this.explode); g.stroke();
      }
      g.shadowBlur = 0; g.globalAlpha = 1;
    }
    if (lm && ctl.secondVisible(t)) {                                  // second hand + zoom bridge
      const P2 = this.drawHand(g, ctl.second, '#b69cff', dpr);
      if (lm) {
        const a = this.toScreen(lm[9]), b = P2[9];
        g.shadowBlur = 0; g.setLineDash([6 * dpr, 6 * dpr]); g.strokeStyle = '#b69cff'; g.globalAlpha = 0.8; g.lineWidth = 2 * dpr;
        g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); g.setLineDash([]);
        g.fillStyle = '#e8dcff'; g.font = `700 ${13 * dpr}px ui-sans-serif, system-ui, sans-serif`; g.textAlign = 'center';
        g.fillText(`🔍 ${this.word('Phóng đại','Zoom')} ${this.zoom.toFixed(2)}×`, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 12 * dpr);
      }
      g.shadowBlur = 0; g.globalAlpha = 1;
    }
    if (this.pointer) {                                                 // fingertip cursor + dwell ring
      const { x, y, li, prog } = this.pointer;
      g.strokeStyle = '#7dff9b'; g.lineWidth = 2 * dpr; g.globalAlpha = 0.9;
      g.beginPath(); g.arc(x, y, 14 * dpr, 0, Math.PI * 2); g.stroke();
      if (li >= 0) {
        g.lineWidth = 4 * dpr; g.beginPath(); g.arc(x, y, 20 * dpr, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * prog); g.stroke();
        const a = this.anchors.find((q) => q.li === li);
        if (a) { g.setLineDash([4 * dpr, 4 * dpr]); g.beginPath(); g.moveTo(x, y); g.lineTo(a.px, a.py); g.stroke(); g.setLineDash([]); }
      }
      g.globalAlpha = 1;
    }
    if (this.cut.on && ctl.state.state === FORMED) {                    // cut plane marker
      const c0 = project(this.projView, [0, 0, 0]), rr = this.globeRadiusPx();
      const x = (c0[0] * 0.5 + 0.5) * W + this.cut.x * rr, cy = (0.5 - c0[1] * 0.5) * H;
      g.strokeStyle = '#ffffff'; g.globalAlpha = 0.5; g.setLineDash([8 * dpr, 6 * dpr]); g.lineWidth = 1.5 * dpr;
      g.beginPath(); g.moveTo(x, cy - rr * 1.1); g.lineTo(x, cy + rr * 1.1); g.stroke(); g.setLineDash([]);
      g.globalAlpha = 0.9; g.fillStyle = '#fff'; g.font = `600 ${12 * dpr}px ui-sans-serif, system-ui, sans-serif`; g.textAlign = 'center';
      g.fillText(this.word('✂ Mặt cắt','✂ Cross-section'), x, cy - rr * 1.1 - 8 * dpr); g.globalAlpha = 1;
    }
    if (!this.anchors.length) return;
    if (!inspectionLabelsVisible({
      enabled:this.labelsOn,explode:this.explode,explodeTarget:this.manualExplode,
      partAmount:this.pullAmt,partTarget:this.partSeparation.target,
      handActive:!this.scanActive&&ctl.handVisible(t)&&!!ctl.landmarks&&!pointing&&!ctl.pinch&&!ctl.navigationActive,
      openness:ctl.openness,pointing,
    })) return;
    const showAll = this.labelsOn && this.explode > 0.15;
    let candidates=this.anchors.filter(a=>showAll||a.li===this.sel||this.selection?.ids.has(a.li)).sort((a,b)=>(b.li===this.sel)-(a.li===this.sel)||b.L.count-a.L.count);
    if(this.model?.surface&&(this.explode>.65||this.selection?.ids.size>1)&&this.$('separationMode').value!=='muscles'&&this.$('selectionScope').value==='group'){
      const localSplit=this.selection?.layout&&this.pullAmt>.12;
      const overview=overviewLabels(localSplit?candidates.filter(a=>!this.selection.ids.has(a.li)):candidates,this.sel,this.selection);
      candidates=localSplit?[...candidates.filter(a=>this.selection.ids.has(a.li)),...overview]:overview;
    }
    const panel=this.$('panel').getBoundingClientRect(),tools=document.querySelector('.top-right').getBoundingClientRect();
    const desktop=window.innerWidth>900,left=desktop?(panel.right+14)*dpr:12*dpr,right=desktop?(tools.left-14)*dpr:W-12*dpr;
    const bounds={x:left,y:80*dpr,w:Math.max(0,right-left),h:Math.max(0,H-160*dpr)};
    const obstacles=[this.$('panel'),document.querySelector('.top-right'),this.$('partCard'),document.querySelector('.view-presets'),this.$('labelPager'),this.$('quiz')].filter(el=>el&&!el.hidden).map(el=>{const r=el.getBoundingClientRect();return {x:r.x*dpr,y:r.y*dpr,w:r.width*dpr,h:r.height*dpr};});
    const font=`600 ${12*dpr}px ui-sans-serif,system-ui`;g.font=font;
    const pageSize=12;this.labelPageCount=Math.max(1,Math.ceil(candidates.length/pageSize));this.labelPage=Math.min(this.labelPage,this.labelPageCount-1);
    const page=candidates.slice(this.labelPage*pageSize,(this.labelPage+1)*pageSize);
    const selected=candidates.find(item=>item.li===this.sel&&this.selection?.ids.size===1);
    if(selected&&!page.includes(selected))page.unshift(selected);
    const width=Math.min(280*dpr,bounds.w),items=page.map(it=>{
      let title=it.L.label;
      while(title.length&&g.measureText(title).width+20*dpr>width)title=title.slice(0,-1);
      if(title!==it.L.label)title=title.slice(0,-1)+'…';
      return {...it,title,w:Math.min(width,g.measureText(title).width+20*dpr),h:26*dpr};
    });
    const alpha=showAll?smooth(.15,.45,this.explode)*smooth(.6,1.4,formT):1;
    g.textAlign='center';g.textBaseline='middle';
    for(const it of layoutLabels(items,bounds,obstacles,7*dpr)){
      const selected=it.scope==='group'?it.key===this.selection?.key:it.li===this.sel;g.globalAlpha=selected?1:alpha;
      g.strokeStyle=rgbCss(it.L.color);g.lineWidth=dpr;g.beginPath();g.moveTo(it.px,it.py);g.lineTo(Math.max(it.x,Math.min(it.x+it.w,it.px)),Math.max(it.y,Math.min(it.y+it.h,it.py)));g.stroke();g.fillStyle=rgbCss(it.L.color);g.beginPath();g.arc(it.px,it.py,2.5*dpr,0,Math.PI*2);g.fill();
      g.fillStyle='rgba(20,24,28,.95)';g.fillRect(it.x,it.y,it.w,it.h);
      g.strokeStyle=selected?'#5ed5bb':'rgba(170,185,199,.3)';g.strokeRect(it.x,it.y,it.w,it.h);
      g.fillStyle='#eef6ff';g.fillText(it.title,it.x+it.w/2,it.y+it.h/2);
      if(g.globalAlpha>.5)this.labelHits.push(it);
    }
    g.globalAlpha = 1;
  }

  // ------------------------------------------------------------ HUD
  drawCameraPreview(t){
    const activeNow=this.hasVideo&&this.camOn;
    if(this.previewLive===activeNow&&t-(this.previewDrawTime??-1)<1/30)return;
    this.previewDrawTime=t;
    const canvas=this.$('cameraCanvas'),ctx=this.cameraContext||(this.cameraContext=canvas.getContext('2d'));
    const targetWidth=this.scanActive?640:320,targetHeight=Math.round(targetWidth/(this.scanActive?this.videoAspect():16/9));if(canvas.width!==targetWidth||canvas.height!==targetHeight){canvas.width=targetWidth;canvas.height=targetHeight;canvas.style.aspectRatio=targetWidth+" / "+targetHeight;}
    const W=canvas.width,H=canvas.height;ctx.fillStyle='#202327';ctx.fillRect(0,0,W,H);
    const active=this.hasVideo&&this.camOn;
    if(this.previewLive!==active){this.previewLive=active;this.$('cameraPreview').classList.toggle('live',active);this.$('cameraStatus').textContent=active?'Camera điều khiển':'Camera đang tắt';this.scanPanel?.camera(active);}
    if(!active){ctx.fillStyle='#a7acb4';ctx.font='14px system-ui';ctx.textAlign='center';ctx.fillText('Bật camera để dùng cử chỉ',W/2,H/2);return;}
    const video=previewSource(this.video,this.cam?.previewFrame);if(!video)return;
    const sourceWidth=video.videoWidth||video.width,sourceHeight=video.videoHeight||video.height,transform=previewTransform(sourceWidth,sourceHeight,W,H),{w:vw,h:vh,dx,dy}=transform;
    ctx.save();ctx.translate(W,0);ctx.scale(-1,1);ctx.drawImage(video,dx,dy,vw,vh);ctx.restore();
    if(this.scanActive&&this.scanState?.box&&this.scanState.mode==='frame'){
      const b=this.scanState.box,[x,y]=previewPoint([b.x,b.y],transform);
      ctx.save();ctx.beginPath();ctx.rect(x,y,b.w*vw,b.h*vh);ctx.clip();
      ctx.filter='grayscale(1) contrast(1.28) brightness(1.04)';
      ctx.translate(W,0);ctx.scale(-1,1);ctx.drawImage(video,dx,dy,vw,vh);ctx.restore();
    }
    for(const hand of [this.ctl.handVisible(t)?this.ctl.landmarks:null,this.ctl.secondVisible(t)?this.ctl.second:null]){
      if(!hand)continue;const points=hand.map(p=>previewPoint(p,transform));
      ctx.strokeStyle='#5ed5bb';ctx.lineWidth=2;ctx.beginPath();for(const [a,b] of HAND_EDGES){ctx.moveTo(...points[a]);ctx.lineTo(...points[b]);}ctx.stroke();
      ctx.fillStyle='#f4f7f6';for(const p of points){ctx.beginPath();ctx.arc(p[0],p[1],2,0,Math.PI*2);ctx.fill();}
    }
    const state=this.scanState;
    if(this.scanActive&&state?.box){const b=state.box,[x,y]=previewPoint([b.x,b.y],transform),w=b.w*transform.w,h=b.h*transform.h;
      // Boxes and landmarks already share selfie coordinates; never mirror again.
      ctx.strokeStyle=state.mode==='hand'?'#5ed5bb':'#f0ca66';ctx.lineWidth=3;ctx.strokeRect(x+1.5,y+1.5,Math.max(0,w-3),Math.max(0,h-3));
      ctx.fillStyle='rgba(94,213,187,.16)';ctx.fillRect(x,y+h-6,w*state.progress,6);
      // Only the full-frame sweep moves. A hand box stays calm while holding.
      if(state.phase!=='busy'&&state.mode==='none'){const line=y+state.progress*h;ctx.strokeStyle='#70f9d8';ctx.beginPath();ctx.moveTo(x,line);ctx.lineTo(x+w,line);ctx.stroke();}
    }
  }
  buildUI() {
    const tabs = this.$('catTabs'), chips = this.$('catChips');
    this.tabs = {}; this.chips = [];
    const group=this.$('modelGroup');
    for(const category of CATEGORIES){const option=document.createElement('option');option.value=category;option.textContent=category;group.appendChild(option);}
    group.addEventListener('change',()=>this.showCategory(group.value));
    this.$('modelSelect').addEventListener('change',()=>this.selectModel(Number(this.$('modelSelect').value)));
    this.$('bPanel').addEventListener('click',()=>{const collapsed=this.$('panel').classList.toggle('collapsed');this.$('bPanel').setAttribute('aria-expanded',String(!collapsed));this.$('bPanel').textContent=collapsed?'›':'‹';});
    for (const c of CATEGORIES) {
      const b = document.createElement('button');
      b.className = 'tab'; b.textContent = `${c} · ${CATALOG.filter((d) => modelGroup(d) === c).length}`; b.dataset.cat = c;
      b.addEventListener('click', () => this.showCategory(c));
      tabs.appendChild(b); this.tabs[c] = b;
    }
    CATALOG.forEach((d, i) => {
      const b = document.createElement('button');
      b.className = 'chip'; b.dataset.index = i; b.dataset.cat = modelGroup(d);
      b.innerHTML = `<i style="color:${rgbCss(d.color)};background:${rgbCss(d.color)}"></i>${this.modelName(d)}`;
      b.addEventListener('click', () => this.selectModel(i));
      chips.appendChild(b); this.chips[i] = b;
    });
    this.showCategory(this.activeCat);
  }
  showCategory(c) {
    this.activeCat = c;
    this.$('modelGroup').value=c;
    const select=this.$('modelSelect');select.replaceChildren();
    CATALOG.forEach((d,i)=>{if(modelGroup(d)!==c)return;const option=document.createElement('option');option.value=i;option.textContent=this.modelName(d);select.appendChild(option);});
    const index=this.ctl.state.index;if(modelGroup(CATALOG[index])===c)select.value=String(index);
    for (const [k, b] of Object.entries(this.tabs)) b.classList.toggle('active', k === c);
    this.chips.forEach((b) => { b.hidden = b.dataset.cat !== c; });
  }

  guideItems(machine) {
    return [
      ['snap', '🫰', '<b>Búng tay</b> — gọi hạt, làm tan'],
      ['fist', '✊', machine ? '<b>Nắm tay</b> — lắp lại' : '<b>Nắm tay</b> — tạo hình'],
      ['open', '✋', machine ? '<b>Mở tay chậm</b> — bóc tách, xem bên trong' : '<b>Mở tay</b> — chuyển mẫu tiếp'],
      ['twist', '🔄', '<b>Xoay cổ tay</b> — chỉ xoay trái/phải'],
      ...(machine ? [['point', '☝', '<b>Trỏ và giữ</b> để chọn · <b>xòe/nắm</b> chỉ kéo phần đã chọn ra–lắp lại · Esc để bỏ chọn']] : []),
      ['zoom', '🙌', '<b>Hai tay</b> dang ra, chụm vào — thu phóng'],
      ['like', '👍', '<b>Like tay trái</b> — mô hình tiếp · <b>tay phải</b> — hệ tiếp trong mô hình. Hạ ngón cái rồi giơ lại.'],
      ['peace', '✌', '<b>Peace</b> — tính năng sau'],
    ];
  }

  toast(msg) {
    const el = this.$('toast');
    el.textContent = msg; el.classList.add('show');
    clearTimeout(this._toastT); this._toastT = setTimeout(() => el.classList.remove('show'), 2200);
  }

  populateFocus(){
    const focus=this.$('systemFocus'),previous=focus.value;focus.replaceChildren();
    const list=this.$('structureList');list.replaceChildren();
    const ids=this.visiblePicks(true);let count=0;this.labelPage=0;
    const query=this.$('structureSearch').value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/đ/g,'d').trim();
    const all=document.createElement('option');all.value='-1';all.textContent='Tất cả cấu trúc';focus.appendChild(all);
    this.model?.labels.forEach((label,i)=>{
      if(this.model.surface&&!ids.has(i))return;
      const text=[label.label,label.sourceName,label.info,label.sourceId,label.latin].join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/đ/g,'d');
      if(query&&!text.includes(query))return;
      const option=document.createElement('option');option.value=i;option.textContent=label.label+(label.sourceId&&!label.label.endsWith(label.sourceId)?' · '+label.sourceId:'');focus.appendChild(option);
      const item=document.createElement('div');item.setAttribute('role','listitem');
      const button=document.createElement('button');button.type='button';button.textContent=label.label;
      button.setAttribute('aria-label',this.word('Xem cấu trúc: ','Inspect structure: ')+label.label);
      if(label.sourceId){const source=document.createElement('small');source.textContent=label.sourceId;button.append(source);}
      button.disabled=!!this.transition.pending;
      button.onclick=()=>{if(this.transition.pending)return;focus.value=String(i);focus.dispatchEvent(new Event('change'));};
      item.append(button);list.append(item);count++;
    });
    this.$('structureCount').textContent=String(count);
    this.$('viewStructures').textContent=this.word(`Xem ${count} cấu trúc`,`Browse ${count} structures`);
    if(!count){const empty=document.createElement('p');empty.textContent=this.word('Không có cấu trúc khớp tên tìm kiếm.','No matching structures.');list.append(empty);}
    if([...focus.options].some(option=>option.value===previous))focus.value=previous;
    else{focus.value='-1';this.deselect();}
    this.appliedInspectionView=this.$('inspectionView').value;this.appliedSystemFocus=focus.value;
  }
  updateHud(t, formT) {
    const st = this.ctl.state, def = CATALOG[st.index], $ = this.$, ctl = this.ctl;
    this.updateToolbar();
    const isM = isMachine(st.index);
    if (this.lastIndexShown !== st.index) {
      this.lastIndexShown = st.index;
      $('cat').textContent = this.word('Giải phẫu học','Anatomy'); $('name').textContent = this.modelName(def); $('fact').textContent = def.fact || '';
      $('bigTitle').querySelector('.t').textContent = this.modelName(def); $('bigTitle').querySelector('.s').textContent = def.fact || '';
      $('explodeBox').hidden = !isM;
      $('surfaceControls').hidden = !def.surface;
      $('systemFocus').innerHTML='<option value="-1">Tất cả các hệ</option>';
      this.chips.forEach((c, i) => c.classList.toggle('active', i === st.index));
      if (this.activeCat !== modelGroup(def)) this.showCategory(modelGroup(def));
      $('modelSelect').value=String(st.index);
      this.guideKey = null;
    }
    if(this.uploaded===st.index&&this.focusModel!==this.model){
      this.focusModel=this.model;
      const focus=$('systemFocus');focus.innerHTML='<option value="-1">Tất cả các hệ</option>';
      focus.options[0].textContent='Tất cả cấu trúc';
      this.model.labels.forEach((label,i)=>{const option=document.createElement('option');option.value=i;option.textContent=label.label;focus.appendChild(option);});
      const views=$('inspectionView');views.replaceChildren();
      for(const profile of availableInspectionViews(this.model.surface?.groups||[])){const option=document.createElement('option');option.value=profile.id;option.textContent=profile.name;views.appendChild(option);}
      views.value='all';$('separationMode').value='systems';$('separationMode').options[1].disabled=!this.model.surface?.groups.some(g=>g.system==='muscular');$('structureSearch').value='';this.populateFocus();
      const quality=this.model.surface?.quality;
      $('modelQuality').textContent=quality ? ((quality.context||'')+' '+this.model.surface.partCount+' cấu trúc nguồn. '+(quality.sourceOptimized===false?'Lưới OBJ nguồn, không giản lược thêm. ':'')+(quality.capLoops?'Mặt cắt màu nâu là ranh giới kỹ thuật. ':'')+(quality.unresolvedCuts?'Còn '+quality.unresolvedCuts+' đường biên nguồn hở; không tự lấp. ':'')+'Nguồn không có texture mô thật.').trim() : 'Giữ màu và hình học của dữ liệu nguồn.';
    }
    const pill = $('statePill');
    const transitionPhase=this.transition.pending?.phase||(this.inspectionTransition.pending?.phase==='out'?'out':this.inspectionTransition.pending?'gathering':'steady');
    pill.dataset.state=st.state;pill.dataset.transition=transitionPhase;
    pill.textContent=transitionPhase==='out'?this.word('Đang tách thành hạt','Dissolving into particles'):transitionPhase==='loading'?this.word('Đang tải mô hình','Loading model'):transitionPhase==='gathering'?this.word('Đang gom mô hình','Assembling model'):(STATE_VI[st.state]??st.state);
    const transitionStatus=$('modelTransitionStatus');transitionStatus.hidden=transitionPhase==='steady';transitionStatus.textContent=transitionStatus.hidden?'':pill.textContent+'…';
    for(const id of ['bSnap','bForm','bOpen','explodeSlider','systemFocus','inspectionView','separationMode'])$(id).disabled=!!this.transition.pending||!!this.inspectionTransition.pending;
    $('viewStructures').disabled=!this.model||!!this.transition.pending;
    $('structureSearch').disabled=!!this.transition.pending;
    if(this.structuresBusy!==!!this.transition.pending){this.structuresBusy=!!this.transition.pending;for(const button of $('structureList').querySelectorAll('button'))button.disabled=this.structuresBusy;}
    $('labelPager').hidden=this.labelPageCount<=1||!this.labelsOn||!this.labelHits.length||!!this.transition.pending;
    $('labelPageStatus').textContent=this.word(`Nhóm nhãn ${this.labelPage+1}/${this.labelPageCount}`,`Label group ${this.labelPage+1}/${this.labelPageCount}`);
    $('labelsPrevious').disabled=this.labelPage===0;$('labelsNext').disabled=this.labelPage>=this.labelPageCount-1;
    const vis = ctl.handVisible(t), pose = vis ? (ctl.pinch ? 'pinch' : ctl.pose) : NONE;
    const [emo, label] = pose === 'pinch' ? ['🤏', 'Đang véo'] : POSE_UI[pose] || POSE_UI.other;
    const side=ctl.landmarks?.handedness;
    const pt = pose===THUMB?`👍 ${side==='left'?'Tay trái · mô hình tiếp':side==='right'?'Tay phải · hệ tiếp':'Chưa rõ tay trái/phải'}`:`${emo} ${label}${ctl.secondVisible(t) ? ' + 🖐' : ''}`;
    if ($('posePill').textContent !== pt) $('posePill').textContent = pt;
    const op = vis ? ctl.openness : 0;
    $('openBar').style.width = `${Math.round(op * 100)}%`; $('openPct').textContent = `${Math.round(op * 100)}%`;
    const separation=this.sel>=0?this.pullAmt:this.explode;
    $('explodePct').textContent = `${Math.round(separation * 100)}%`;
    if (!this.sliderActive) $('explodeSlider').value = Math.round(separation * 100);
    $('separationLabel').textContent=this.selection?.layout?'Tách từng cấu trúc đã chọn':this.sel>=0?'Kéo cấu trúc đã chọn':'Tách toàn mô hình';
    $('separationHint').textContent=this.selection?.layout?'Nắm rồi xòe tay để tách từng mảnh · nắm lại để lắp':this.sel>=0?'Nắm rồi xòe tay để kéo cấu trúc ra · các phần khác giữ nguyên':'Mở tay để tách các hệ · chọn một khối để tách từng cấu trúc';
    const split=$('splitParts'),hasSkull=this.anchors.some(a=>selectionKey(a.L)==='skull'),block=singleVisibleGroup(this.model?.labels||[],this.visiblePicks());
    split.disabled=!this.model?.surface||!this.anchors.length||!!this.inspectionTransition.pending;
    split.textContent=this.selection?.layout&&this.partSeparation.target>.5?'Lắp lại phần đã chọn':this.selection?.layout&&!this.selection.skull?'Tách '+this.selection.ids.size+' cấu trúc':hasSkull?'Tách xương sọ':block?'Tách '+block.count+' cấu trúc':'Tách từng cấu trúc';
    $('splitHint').textContent=this.selection?.layout?`${this.selection.ids.size} cấu trúc · xòe tay để tách · nắm tay để lắp lại`:block?`${block.count} cấu trúc đang hiện · xòe tay để tách riêng`:'Tách riêng các mảnh nguồn · chọn khối cần tách';
    const blocks=this.modelBlocks(),activeBlock=blocks.findIndex(item=>item.system===this.selection?.system);
    $('bNextBlock').disabled=!!this.inspectionTransition.pending||!!this.transition.pending||st.state!==FORMED||this.uploaded!==st.index||!blocks.length;
    $('blockCycleStatus').textContent=activeBlock>=0?`${SYSTEM_LABELS[blocks[activeBlock].system]||blocks[activeBlock].system} · ${activeBlock+1}/${blocks.length} hệ`:'Like trái: mô hình tiếp · like phải: hệ tiếp';
    const hot = st.state === IDLE || st.state === DISSOLVE ? 'snap' : st.state === SPHERE ? 'fist' : 'open';
    const gk = `${isM}|${hot}`;
    if (this.guideKey !== gk) {
      this.guideKey = gk;
      $('guide').innerHTML = this.guideItems(isM).map(([k, e, txt]) => `<li class="${k === hot || (k === 'like' && (st.state === SPHERE || st.state === FORMED)) || (['twist', 'point'].includes(k) && st.state === FORMED) ? 'hot' : ''}"><span class="e">${e}</span><span>${txt}</span></li>`).join('');
    }
    $('bigTitle').classList.toggle('show', !def.hideTitle && st.state === FORMED && formT > 0.8 && this.uploaded === st.index && this.explode < 0.15 && this.sel < 0 && !this.quiz);
    // part card
    const card = $('partCard'), L = this.sel >= 0 && this.selectionLabel();
    card.hidden = !(L && st.state === FORMED && !this.quiz);
    if (L && card.dataset.key !== `${st.index}:${this.selection?.key}:${this.sel}`) {
      card.dataset.key = `${st.index}:${this.selection?.key}:${this.sel}`;
      card.querySelector('.swatch').style.background = rgbCss(L.color);
      card.querySelector('.pname').textContent = L.label;
      card.querySelector('.pinfo').textContent = [L.sourceId&&L.sourceName?this.word('Tên nguồn (Anh): ','Source name: ')+L.sourceName:L.info,L.latin?'Latin: '+L.latin:''].filter(Boolean).join(' · ');
      const description=card.querySelector('.pdescription');description.textContent=L.description;description.hidden=!L.description;
      const learning=card.querySelector('.plearning');learning.replaceChildren();
      for(const topic of L.learningNotes||[]){const details=document.createElement('details'),summary=document.createElement('summary'),text=document.createElement('p');summary.textContent='Nhóm giải phẫu: '+topic.name;text.textContent=topic.description;details.append(summary,text);learning.appendChild(details);}
      card.querySelector('.pmodel').textContent = `${this.modelName(def)} · ${this.selection?.ids.size>1?this.selection.ids.size+' cấu trúc được chọn':L.sourceId || ('cấu trúc '+(this.sel+1))}`;
    }
    card.classList.toggle('pulled', this.pulled);
    $('partPull').textContent=this.partSeparation.target>.5?'Lắp lại':this.selection?.layout?'Tách từng cấu trúc':'Kéo ra';
    // quiz banner
    const qb = $('quiz'), q = this.quiz;
    qb.hidden = !q;
    if (q) {
      const target = q.target >= 0 && this.model?.labels[q.target];
      qb.querySelector('.q').textContent = q.done ? this.word('🎓 Đã hoàn thành','🎓 Quiz finished') : target ? this.word(`🎓 Tìm: ${target.label}`,`🎓 Find: ${target.label}`) : this.word('🎓 Chuẩn bị…','🎓 Get ready…');
      qb.querySelector('.qs').textContent = this.word(`Câu ${Math.max(q.asked, 1)} / ${q.total} · điểm ${q.score}`,`Question ${Math.max(q.asked, 1)} / ${q.total} · score ${q.score}`);
      qb.querySelector('.qf').textContent = q.feedback || this.word('Chỉ một ngón tay vào cấu trúc (hoặc bấm chọn)','Point at the structure (or click it)');
      qb.classList.toggle('good', q.feedback.startsWith('✅') || q.done);
      qb.classList.toggle('bad', q.feedback.startsWith('❌'));
    }
    const modelStats=this.lastSolidBlend===1 ? this.word('mô hình 3D đặc','solid 3D model') : `<b>${(CFG.n / 1000).toFixed(0)}k</b> ${this.word('hạt','particles')}`;
    $('stats').innerHTML = `<div><b>${this.fps.toFixed(0)}</b> fps · ${modelStats}</div><div>${this.cam?.running?`Camera <b>${this.cam.fps.toFixed(0)}</b> fps · ${this.cam.delegate}`:this.word('Camera đang tắt','Camera off')}</div><div>${this.cam?.running?`${this.word('Nhận diện','Detection')} <b>${this.cam.detectMs.toFixed(0)}</b> ms`:this.word('Nhận diện —','Detection —')}</div><div>${this.word('Phóng đại','Zoom')} <b>${this.zoom.toFixed(2)}×</b>${this.recorder.on?' · '+this.word('Đang ghi','Recording'):''}${this.voiceOn?' · Micro':''}</div>`;
    $('renderResolution').textContent=`Độ phân giải ${CFG.dpr.toFixed(2)}× · giữ nguyên chi tiết giải phẫu`;
    for (const e of st.events.splice(0)) {
      const name = this.modelName(CATALOG[st.index]);
      if (e === 'snap') this.toast(this.word('🫰 Đã gọi hạt','🫰 Particles summoned'));
      else if (e === 'form') this.toast(this.word(`✊ Đang tạo hình: ${name}`,`✊ Assembling: ${name}`));
      else if (e === 'next') this.toast(this.word(`✌ Mô hình tiếp: ${name}`,`✌ Next: ${name}`));
      else if (e === 'select') this.toast(`→ ${name}`);
      else if (e === 'dissolve') this.toast(this.word('💥 Đã làm tan mô hình','💥 Dissolved'));
    }
  }

  // ------------------------------------------------------------ input
  announceModel(index) {
    this.enteredId=CATALOG[index].id;
    if(this.bridgeReady&&window.parent!==window)window.parent.postMessage({type:'soma-control-model',id:this.enteredId},location.origin);
  }
  selectModel(i, autoForm = true) {
    this.inspectionTransition.cancel();
    const n = CATALOG.length;
    i = ((i % n) + n) % n;
    this.announceModel(i);
    if(i===this.ctl.state.index&&this.ctl.state.state===FORMED){this.transition.complete();return;}
    this.speaker.stop();
    this.stopDemo();
    const outgoing=this.uploaded===this.ctl.state.index&&this.ctl.state.state===FORMED&&this.lastSolidBlend>.95;
    this.transition.begin(i,this.motionTime,outgoing,autoForm);
    this.store.request(i).catch(error=>this.modelError(i,error));
  }

  bindInput() {
    const $ = this.$, ctl = this.ctl;
    const now = () => this.t;
    addEventListener('keydown', (e) => {
      if (e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement || (e.target instanceof HTMLInputElement && e.target.type !== 'range')) return;
      const k = e.key.toLowerCase(), st = ctl.state;
      if(this.transition.pending&&[' ','f','o','e','arrowup','arrowdown'].includes(k)){e.preventDefault();return;}
      if (k !== 'd') this.stopDemo();
      if (k === ' ') { e.preventDefault(); ctl.keySnap(now()); }
      else if (k === 'f') ctl.keyPose(FIST, now());
      else if (k === 'o') ctl.keyPose(OPEN, now());
      else if (k === 'v') this.selectModel(st.index + 1);
      else if (k === 'arrowright' || k === 'n') this.selectModel(st.index + 1);
      else if (k === 'arrowleft' || k === 'p') this.selectModel(st.index - 1);
      else if (k === 'e') this.setSeparation((this.sel>=0?this.partSeparation.target:this.manualExplode)>.5?0:1);
      else if (k === 'arrowup' || k === ']') { e.preventDefault(); this.setSeparation(clamp((this.sel>=0?this.partSeparation.target:this.manualExplode)+.1,0,1)); }
      else if (k === 'arrowdown' || k === '[') { e.preventDefault(); this.setSeparation(clamp((this.sel>=0?this.partSeparation.target:this.manualExplode)-.1,0,1)); }
      else if (k === '+' || k === '=') this.zoomTarget = clamp(this.zoomTarget * 1.15, 0.5, 2.6);
      else if (k === '-' || k === '_') this.zoomTarget = clamp(this.zoomTarget / 1.15, 0.5, 2.6);
      else if (k === '0') this.zoomTarget = 1;
      else if (k === 'x') this.toggleCut();
      else if (k === ',') this.cut.target = clamp(this.cut.target - 0.1, -1.25, 1.25);
      else if (k === '.') this.cut.target = clamp(this.cut.target + 0.1, -1.25, 1.25);
      else if (k === 'q') { if (this.quiz) this.stopQuiz(); else this.startQuiz(); }
      else if (k === 'm') this.toggleVoice();
      else if (k === 'k') this.toggleRecord();
      else if (k === 'i') this.voiceCommand('what is this');
      else if (k === 'escape') { if (this.quiz) this.stopQuiz(); this.deselect(); }
      else if (k === 'r') this.toggle('autoRotate', 'bRotate');
      else if (k === 'g') { this.toggle('handRotate', 'bHandRot'); this.toast(this.word(`🔄 Xoay theo tay: ${this.handRotate ? 'bật' : 'tắt'}`,`🔄 Hand rotation ${this.handRotate ? 'on' : 'off'}`)); }
      else if (k === 'l') this.toggle('labelsOn', 'bLabels');
      else if (k === 't') this.trails = !this.trails;
      else if (k === 'c') this.toggleCamera();
      else if (k === 'd') this.toggleDemo();
      else if (k === 'h' || k === '?') $('help').hidden = !$('help').hidden;
    });
    $('bSnap').onclick = () => { this.stopDemo(); ctl.keySnap(now()); };
    $('bForm').onclick = () => { this.stopDemo(); ctl.keyPose(FIST, now()); };
    $('bOpen').onclick = () => {
      this.stopDemo();
      if (isMachine(ctl.state.index) && ctl.state.state === FORMED) this.setSeparation((this.sel>=0?this.partSeparation.target:this.manualExplode)>.5?0:1);
      else ctl.keyPose(OPEN, now());
    };
    $('structureSearch').oninput=()=>this.populateFocus();
    $('showCover').onchange=()=>{const next=$('showCover').checked;$('showCover').checked=!next;this.changeInspection(()=>{$('showCover').checked=next;this.deselect();this.populateFocus();});};
    $('selectionScope').onchange=()=>{this.deselect();};
    $('separationMode').onchange=()=>{const mode=$('separationMode').value;if(mode==='selected'){this.splitSelected();return;}this.changeInspection(()=>{const muscles=mode==='muscles';setMuscleSeparation(this.model,muscles);$('inspectionView').value=muscles?'muscular':'all';$('systemFocus').value='-1';this.deselect();$('separationMode').value=mode;this.manualExplode=muscles?1:0;this.populateFocus();});};
    $('systemFocus').onchange=()=>{const next=$('systemFocus').value;$('systemFocus').value=this.appliedSystemFocus||'-1';this.changeInspection(()=>{this.deselect();$('systemFocus').value=next;const li=Number(next);if(li>=0)this.selectPart(li,'list');this.appliedSystemFocus=next;});};
    $('inspectionView').onchange=()=>{const next=$('inspectionView').value;$('inspectionView').value=this.appliedInspectionView||'all';this.changeInspection(()=>{$('inspectionView').value=next;this.deselect();$('systemFocus').value='-1';this.populateFocus();});};
    for(const [id,yaw] of [['viewFront',0],['viewBack',Math.PI],['viewSide',Math.PI/2]])$(id).onclick=()=>{this.grab=null;this.handYaw.reset();this.spin=0;this.dragYaw=yaw;this.dragYawTarget=yaw;this.pitch=0;this.autoRotate=false;};
    $('viewReset').onclick=()=>{this.hiddenSystems.clear();this.deselect();this.resetPose();$('systemFocus').value='-1';$('inspectionView').value='all';$('structureSearch').value='';this.populateFocus();};
    $('labelsPrevious').onclick=()=>{this.labelPage=Math.max(0,this.labelPage-1);};
    $('labelsNext').onclick=()=>{this.labelPage=Math.min(this.labelPageCount-1,this.labelPage+1);};
    $('viewStructures').onclick=()=>{$('structureListPanel').open=true;$('structureListPanel').scrollIntoView({block:'nearest',behavior:'smooth'});};
    $('bNext').onclick = () => this.selectModel(ctl.state.index + 1,true);
    $('bNextBlock').onclick = () => this.nextBlock();
    $('bLabels').onclick = () => this.toggle('labelsOn', 'bLabels');
    $('bRotate').onclick = () => this.toggle('autoRotate', 'bRotate');
    $('bHandRot').onclick = () => this.toggle('handRotate', 'bHandRot');
    $('bCam').onclick = () => this.toggleCamera();
    $('bDemo').onclick = () => this.toggleDemo();
    $('bCut').onclick = () => this.toggleCut();
    $('bQuiz').onclick = () => { if (this.quiz) this.stopQuiz(); else this.startQuiz(); };
    $('bVoice').onclick = () => this.toggleVoice();
    $('bRec').onclick = () => this.toggleRecord();
    $('bHelp').onclick = () => { $('help').hidden = !$('help').hidden; };
    $('partClose').onclick = () => this.deselect();
    $('partSystem').onclick=()=>{const system=this.model?.labels[this.sel]?.system;if(!system)return;const view=availableInspectionViews(this.model.surface?.groups||[]).find(profile=>profile.systems?.length===1&&profile.systems[0]===system);if(!view)return;this.changeInspection(()=>{this.deselect();$('inspectionView').value=view.id;$('systemFocus').value='-1';this.populateFocus();});};
    $('partPull').onclick = () => { if (this.sel >= 0) this.setSeparation(this.partSeparation.target>.5?0:1); };
    $('splitParts').onclick=()=>this.splitSelected();
    $('partSpeak').onclick = () => this.readSelected();
    $('voiceLanguage').value=this.voiceLanguage;
    document.documentElement.lang=this.locale;
    $('voiceLanguage').onchange=()=>{this.speaker.stop();this.voiceLanguage=$('voiceLanguage').value;this.voice.setLanguage(this.voiceLanguage);$('voiceNote').textContent='';$('voiceExamples').textContent=this.voiceLanguage==='en'?'“Explode”, “open wrist”, “select left brachioradialis”, “scan”, “read description”.':'“Tách lớp”, “mở cổ tay”, “chọn cơ cánh tay-quay”, “quét”, “đọc chú thích”.';this.updateVoiceUI();};
    $('voiceLanguage').onchange();
    $('autoRead').onchange=()=>{this.autoRead=$('autoRead').checked;if(!this.autoRead)this.speaker.stop();};
    $('readSelected').onclick=()=>this.readSelected();$('stopReading').onclick=()=>this.speaker.stop();this.updateVoiceUI();
    $('voiceSend').onclick=()=>this.voiceCommand($('voiceText').value);$('voiceText').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();$('voiceSend').click();}};
    $('quizStop').onclick = () => this.stopQuiz();
    const slider = $('explodeSlider');
    slider.addEventListener('input', () => { this.sliderActive = true; this.setSeparation(slider.value / 100); });
    slider.addEventListener('change', () => { this.sliderActive = false; });
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.ctrlKey || !isMachine(ctl.state.index)) this.zoomTarget = clamp(this.zoomTarget * (e.deltaY < 0 ? 1.1 : 1 / 1.1), 0.5, 2.6);
      else this.setSeparation(clamp((this.sel>=0?this.partSeparation.target:this.manualExplode)-Math.sign(e.deltaY)*.08,0,1));
    }, { passive: false });
    let drag = null;
    const px = (e) => [e.clientX * CFG.dpr, e.clientY * CFG.dpr];
    this.canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, yaw: this.dragYawTarget??this.dragYaw, moved: false }; this.canvas.setPointerCapture(e.pointerId); });
    this.canvas.addEventListener('pointermove', (e) => {
      if (drag) { if (Math.abs(e.clientX - drag.x) > 4) drag.moved = true; this.dragYawTarget = drag.yaw + (e.clientX - drag.x) * 0.008; }
      else if (this.cut.on && !this.ctl.handVisible(this.t)) {
        const c0 = project(this.projView, [0, 0, 0]), rr = this.globeRadiusPx();
        this.cut.target = clamp((px(e)[0] - (c0[0] * 0.5 + 0.5) * this.overlay.width) / rr, -1.25, 1.25);
      }
    });
    this.canvas.addEventListener('pointerup', (e) => {
      if (drag && !drag.moved && this.anchors.length) {
        const [x,y]=px(e);
        const {li,scope}=this.pickTarget(x,y);
        if (li >= 0) this.selectPart(li, 'click',scope); else if (!this.quiz) this.deselect();
      }
      drag = null;
    });
  }

  updateToolbar() {
    const en=this.locale==='en';
    const states={bCam:this.camOn,bLabels:this.labelsOn,bRotate:this.autoRotate,bHandRot:this.handRotate,bCut:this.cut.on,bQuiz:!!this.quiz,bVoice:this.voiceOn,bRec:this.recorder.on,bDemo:!!this.demo,bHelp:!this.$('help').hidden};
    for(const [id,value] of Object.entries(states)) {
      const button=this.$(id),on=!!value,label=en?button.dataset.labelEn:button.dataset.labelVi;
      const stateAttribute=id==='bHelp'?'aria-expanded':'aria-pressed';
      const state=String(on);
      if(button.getAttribute(stateAttribute)!==state)button.setAttribute(stateAttribute,state);
      if(button.classList.contains('on')!==on)button.classList.toggle('on',on);
      const action=id==='bHelp'?(en?(on?'Close ':'Open '):(on?'Đóng ':'Mở ')):(en?(on?'Turn off ':'Turn on '):(on?'Tắt ':'Bật '));
      const name=action+label;
      if(button.getAttribute('aria-label')!==name)button.setAttribute('aria-label',name);
      const title=label+' ('+button.dataset.shortcut+') · '+(en?(on?'On':'Off'):(on?'Đang bật':'Đang tắt'));
      if(button.title!==title)button.title=title;
    }
  }

  toggle(prop, btn) { this[prop] = !this[prop]; this.$(btn).classList.toggle('on', this[prop]);this.updateToolbar(); }

  async startCamera(sharedStream = null) {
    const msg = this.$('startMsg');
    try {
      this.cam = this.cam || new HandCamera(this.video);
      await this.cam.start((s) => { msg.textContent = s; if (s) this.toast(s); }, sharedStream);
      this.camOn = true; this.$('bCam').classList.add('on');
      this.toast(this.word('📷 Đã bật camera — búng tay để gọi hạt!','📷 Camera on — snap your fingers!'));
      return true;
    } catch (e) {
      console.error(e);
      const text = e.name === 'NotAllowedError' ? this.word('Quyền camera bị từ chối. Bạn vẫn có thể dùng bàn phím, chuột và chế độ minh họa.','Camera permission was denied. You can still use the keyboard, mouse and demo.')
        : e.name === 'NotFoundError' ? this.word('Không tìm thấy camera. Bạn vẫn có thể dùng bàn phím, chuột và chế độ minh họa.','No camera found. You can still use the keyboard, mouse and demo.') : this.word(`Lỗi camera: ${e.message}`,`Camera error: ${e.message}`);
      msg.textContent = text; this.toast(text);
      this.cam?.stop(); this.cam = null; this.camOn = false;
      return false;
    }
  }
  stopCamera() { this.cam?.stop(); this.cam = null; this.camOn = false; this.hasVideo = false; this.$('bCam').classList.remove('on'); this.toast(this.word('Đã tắt camera','Camera off')); }
  toggleCamera() { if (this.camOn) this.stopCamera(); else this.startCamera(); }

  toggleDemo() { if (this.demo) this.stopDemo(); else { this.demo = new Demo(this); this.$('bDemo').classList.add('on'); this.toast(this.word('▶ Minh họa cử chỉ tự động','▶ Demo — synthetic hand')); } }
  stopDemo() { if (!this.demo) return; this.demo = null; this.demoHand = undefined; this.$('bDemo').classList.remove('on'); this.ctl.onHands([], this.t); }

  // ------------------------------------------------------------ deterministic stepping (tests)
  setHand(h, h2) {
    if (h !== undefined) this.handSource = h === null ? () => null : typeof h === 'function' ? h : () => h;
    this.handSource2 = h2 ? (typeof h2 === 'function' ? h2 : () => h2) : null;
    this.lastSynthT = -1;
  }
  async advance(seconds, hand, hand2) {
    this.setHand(hand, hand2);
    const steps = Math.max(1, Math.round(seconds * 60));
    for (let i = 0; i < steps; i++) {
      const st = this.ctl.state;
      if (st.targetDirty && !this.store.get(st.index)) await this.store.request(st.index);
      this.frame(this.t + 1 / 60);
      if(CFG.manual&&i%12===11)await new Promise(resolve=>{const channel=new MessageChannel();channel.port1.onmessage=()=>{channel.port1.close();channel.port2.close();resolve();};channel.port2.postMessage(0);});
    }
  }
}

// ---------------------------------------------------------------- boot
function boot() {
  let app;
  try { app = new App(); }
  catch (e) {
    console.error(e);
    document.getElementById('startMsg').textContent = `Cannot start: ${e.message}`;
    document.getElementById('bStartCam').disabled = true; document.getElementById('bStartNoCam').disabled = true;
    return;
  }
  addEventListener('pagehide',()=>{app.stopCamera();app.speaker.stop();app.voice.dispose();},{once:true});
  const start = document.getElementById('start');
  const hideStart = () => { start.hidden = true; };
  document.getElementById('bStartCam').onclick = async () => { if (await app.startCamera()) hideStart(); };
  document.getElementById('bStartNoCam').onclick = () => { hideStart(); app.toast(app.word('Phím: Space = búng · F = nắm · O = mở · E = tách lớp · D = minh họa · H = hướng dẫn','Keys: Space = snap · F = fist · O = open · E = explode · D = demo · H = help')); };
  if (CFG.autostart === 'camera') { hideStart(); app.startCamera(); }
  else if (CFG.autostart === 'nocamera' || CFG.manual) { hideStart(); if(!CFG.manual){app.enteredId=CATALOG[CFG.start].id;app.selectModel(CFG.start,true);} }

  window.wonderSnap = {
    scanTracking:()=>({active:app.camOn,aspect:app.videoAspect(),stamp:app.ctl.lastHandT,hand:app.ctl.handVisible(app.t)?app.ctl.landmarks:null,second:app.ctl.secondVisible(app.t)?app.ctl.second:null}),
    scanUI:(active)=>{app.scanActive=active;app.ctl.suspended=active;app.ctl.pinchStart=false;app.handYaw.reset();app.scanState=null;if(active)app.scanPanel?.begin();else app.scanPanel?.close();},
    scanFrame:(state)=>{app.scanState=state;app.scanPanel?.frame(state);},
    scanSnapshot:()=>{const source=previewSource(app.video,app.cam?.previewFrame);if(!source||!app.camOn)return null;const width=source.videoWidth||source.width,height=source.videoHeight||source.height;if(!width)return null;const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;canvas.getContext('2d').drawImage(source,0,0,canvas.width,canvas.height);return {canvas,hand:app.ctl.handVisible(app.t)?app.ctl.landmarks:null,second:app.ctl.secondVisible(app.t)?app.ctl.second:null};},
    app, CATALOG, CFG, synth: synthHand,
    enter: (id, stream) => {
      app.bridgeReady=true;
      hideStart();
      const index=CATALOG.findIndex(model=>model.id===id);
      if(app.enteredId!==id){app.enteredId=id;app.selectModel(index>=0?index:CFG.start,true);}
      if(stream?.active&&!app.cam?.stream) void app.startCamera(stream);
    },
    ready: () => app.store.request(app.ctl.state.index),
    advance: (s, hand, hand2) => app.advance(s, hand, hand2),
    clearHand: () => { app.handSource = null; app.handSource2 = null; },
    select: (i, autoForm = false) => app.selectModel(i, autoForm),
    voice: (text) => app.voiceCommand(text),
    command:(text,language)=>{const done=app.voiceCommand(text,{external:true});const en=language==='en',lang=en?'en':'vi';let content=commandFeedback(done,CATALOG,app.model?.labels,lang);if(done.includes('describe')){const reading=readingText(app.selectionLabel(),CATALOG[app.ctl.state.index],lang,app.$('readDetail').value);content=reading.text+(reading.missing?(en?'. The source has no English description.':'. Nguồn chưa có mô tả riêng.'):'');}return {ok:done.length>0,say:done.length?'Vision: '+content:(en?'No matching command or unique structure in this model.':'Chưa khớp lệnh hoặc cấu trúc duy nhất trong mô hình này.')};},
    stopVoice:()=>{app.voice.stop();app.speaker.stop();},
    pauseVoice:active=>active?app.voice.pause('external'):app.voice.resume('external'),
    /** Screen position (CSS px) of a labelled part, or null. */
    anchor: (label) => { const a = app.anchors.find((q) => q.L.label === label); return a ? { x: a.px / CFG.dpr, y: a.py / CFG.dpr } : null; },
    /** Synthetic-hand params that put a pointing index fingertip at CSS pixel (x, y). */
    pointAt: (x, y, s = 0.085) => { const [nx, ny] = app.toNorm([x * CFG.dpr, y * CFG.dpr]); return { cx: nx + 0.35 * s, cy: ny + 1.1 * s, s }; },
    status: () => {
      const st = app.ctl.state, L = app.model?.labels || [], q = app.quiz;
      return {
        state: st.state, index: st.index, name: CATALOG[st.index].name, kind: CATALOG[st.index].kind, category: CATALOG[st.index].category, uploaded: app.uploaded,
        pose: app.ctl.pose, rawPose: app.ctl.rawPose, pinch: app.ctl.pinch, openness: app.ctl.openness, explode: app.explode, scale: app.scale,
        yaw: app.spin + app.dragYaw, pitch: app.pitch, handRotating: app.handRotating, roll: app.ctl.roll,
        zoom: app.zoom, twoHands: app.ctl.secondVisible(app.t), pulse: app.pulse, flow: app.flow,
        selected: app.selectionLabel()?.label||null, selectedCount:app.selection?.ids.size||0,selectionKey:app.selection?.key||null,pulled: app.pulled, pullAmt: app.pullAmt, pointing: !!app.pointer,
        cut: { ...app.cut }, labels: L.length, anchors: app.anchors.length, activeCat: app.activeCat,
        quiz: q ? { target: q.target >= 0 ? L[q.target]?.label : null, score: q.score, asked: q.asked, total: q.total, phase: q.phase, done: q.done, feedback: q.feedback } : null,
        voice: { on: app.voiceOn, supported: app.voice.supported, heard: app.lastHeard }, spoken: app.spoken.slice(-3), spokenCount: app.spoken.length,
        recording: app.recorder.on, lastRecording: app.lastRecording,
        tintMix: app.tintMix, alpha: st.alpha(app.t), t: app.t, fps: app.fps, n: CFG.n, frames: app.frames,
        modelErrors: app.store.errors.length, gl: app.renderer.info,
        camera: app.cam ? { running: app.cam.running, fps: app.cam.fps, frames: app.cam.frames, delegate: app.cam.delegate, detectMs: app.cam.detectMs, videoW: app.video.videoWidth, videoH: app.video.videoHeight } : null,
      };
    },
    /** Particle stats over the whole cloud: mean/max radius and bounding box (model space). */
    cloud: () => {
      const d = app.renderer.readParticles(CFG.n);
      let sum = 0, max = 0, finite = true, speed = 0;
      const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
      for (let i = 0; i < CFG.n; i++) {
        const x = d[i * 6], y = d[i * 6 + 1], z = d[i * 6 + 2];
        if (!Number.isFinite(x + y + z)) finite = false;
        const r = Math.hypot(x, y, z); sum += r; max = Math.max(max, r);
        speed += Math.hypot(d[i * 6 + 3], d[i * 6 + 4], d[i * 6 + 5]);
        lo[0] = Math.min(lo[0], x); lo[1] = Math.min(lo[1], y); lo[2] = Math.min(lo[2], z);
        hi[0] = Math.max(hi[0], x); hi[1] = Math.max(hi[1], y); hi[2] = Math.max(hi[2], z);
      }
      return { meanR: sum / CFG.n, maxR: max, lo, hi, finite, meanSpeed: speed / CFG.n };
    },
  };
  if(window.parent!==window){
    let starting=false,startGeneration=0,cameraOpening=null;
    const scan=async()=>{
      if(starting||['preparing','scanning','busy'].includes(app.scanPanel.phase))return;
      const request=++startGeneration;starting=true;app.scanPanel.begin();
      try{
        if(!app.camOn){
          // Retrying after cancel reuses a pending permission/start request.
          cameraOpening ||= app.startCamera().finally(()=>{cameraOpening=null;});
          if(!(await cameraOpening)){
            if(request===startGeneration)app.scanPanel.result({error:'Không mở được camera. Kiểm tra quyền camera và thiết bị rồi thử lại.'},CATALOG);
            return;
          }
        }
        if(request!==startGeneration)return;
        window.parent.postMessage({type:'soma-camera-scan'},location.origin);
      }finally{if(request===startGeneration)starting=false;}
    };
    app.scanPanel=new ScanPanel(document.getElementById('cameraPreview'),{
      onStart:scan,
      onCancel:()=>{startGeneration++;starting=false;window.wonderSnap.scanUI(false);window.parent.postMessage({type:'soma-scan-selected'},location.origin);},
      onSelect:id=>{startGeneration++;window.wonderSnap.scanUI(false);app.selectModel(CATALOG.findIndex(model=>model.id===id),true);window.parent.postMessage({type:'soma-scan-selected'},location.origin);},
    });
    app.scanPanel.camera(app.camOn);
    addEventListener('message',event=>{
      if(event.origin!==location.origin||event.source!==window.parent)return;
      if(event.data?.type==='soma-scan-open')scan();
      if(event.data?.type!=='soma-scan-result')return;
      app.scanState=null;
      app.scanPanel.result(event.data,CATALOG);
    });
    const announce=()=>window.parent.postMessage({type:'soma-control-ready'},location.origin);
    addEventListener('message',event=>{if(event.origin===location.origin&&event.source===window.parent&&event.data?.type==='soma-control-probe')announce();});
    announce();
  }
  if (!CFG.manual) {
    const loop = (ms) => { app.frame(ms / 1000); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
}
boot();
