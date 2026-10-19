// Webcam + MediaPipe HandLandmarker (Tasks API, VIDEO mode). The render loop calls poll() once per frame;
// detection only runs when the camera delivered a new frame, and timestamps strictly increase.
const VISION = '../node_modules/@mediapipe/tasks-vision/vision_bundle.mjs';
const WASM = 'node_modules/@mediapipe/tasks-vision/wasm';
const MODEL = 'models/hand_landmarker.task';
import { mirrorHandResults } from './logic/hand-navigation.js';

export class HandCamera {
  constructor(video) {
    this.video = video;
    this.landmarker = null;
    this.stream = null;
    this.running = false;
    this.delegate = null;
    this.lastVideoTime = -1;
    this.lastTs = 0;
    this.frames = 0;             // camera frames processed
    this.fps = 0;
    this.detectMs = 0;
    this._n = 0; this._t = performance.now();
    this.newFrame = false;       // a new video frame arrived since the last poll (renderer uploads it)
  }

  async start(onStatus = () => {}, sharedStream = null) {
    if (!sharedStream && !navigator.mediaDevices?.getUserMedia) throw new Error('This browser cannot access a camera (getUserMedia missing — use https or localhost).');
    onStatus('Requesting camera…');
    this.ownsStream = !sharedStream;
    // Capture at 720p for preview/crops; inference still receives only 320px frames.
    this.stream = sharedStream || await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user', frameRate: { ideal: 30 } }, audio: false });
    this.video.srcObject = this.stream;
    this.video.muted = true; this.video.playsInline = true;
    await this.video.play();
    onStatus('Loading hand tracker…');
    try{
      await this.startWorker();this.delegate='CPU worker';this.running=true;onStatus('');return;
    }catch(error){this.worker?.terminate();this.worker=null;console.warn('Hand worker unavailable; using throttled fallback',error);}
    const { FilesetResolver, HandLandmarker } = await import(VISION);
    const fileset = await FilesetResolver.forVisionTasks(WASM);
    const make = (delegate) => HandLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODEL, delegate },
      runningMode: 'VIDEO', numHands: 2,
      minHandDetectionConfidence: 0.5, minHandPresenceConfidence: 0.5, minTrackingConfidence: 0.5,
    });
    try { this.landmarker = await make('GPU'); this.delegate = 'GPU'; }
    catch (e) { console.warn('GPU delegate failed, falling back to CPU', e); this.landmarker = await make('CPU'); this.delegate = 'CPU'; }
    this.running = true;
    onStatus('');
  }

  /** Returns undefined when there is no new camera frame, else a list of hands (mirrored, selfie view), possibly empty. */
  poll() {
    const v = this.video;
    if(this.worker){
      const hands=this.result;this.result=undefined;
      const now=performance.now();
      if(this.running&&v.readyState>=2&&!this.busy&&v.currentTime!==this.lastVideoTime){
        // Like WonderSnap, process each available new frame. Backpressure keeps
        // exactly one request in flight; no extra timer caps a fast tracker.
        this.busy=true;this.lastVideoTime=v.currentTime;
        const worker=this.worker,ts=Math.max(Math.round(now),this.lastTs+1);this.lastTs=ts;
        createImageBitmap(v, {resizeWidth:320,resizeHeight:Math.max(1,Math.round(320*(v.videoHeight||360)/(v.videoWidth||640))),resizeQuality:"low"}).then(frame=>{if(this.worker!==worker||!this.running){frame.close();return;}worker.postMessage({type:'detect',frame,timestamp:ts},[frame]);}).catch(()=>{this.busy=false;});
      }
      return hands;
    }
    if (!this.running || v.readyState < 2 || v.currentTime === this.lastVideoTime) return undefined;
    if(performance.now()<(this.nextDetection||0))return undefined;
    this.nextDetection=performance.now()+(this.delegate==='GPU'?0:100);
    this.lastVideoTime = v.currentTime;
    this.newFrame = true;
    const ts = Math.max(Math.round(performance.now()), this.lastTs + 1);      // must strictly increase
    this.lastTs = ts;
    const t0 = performance.now();
    const res = this.landmarker.detectForVideo(v, ts);
    this.detectMs = performance.now() - t0;
    this.frames++; this._n++;
    const now = performance.now();
    if (now - this._t > 1000) { this.fps = (this._n * 1000) / (now - this._t); this._n = 0; this._t = now; }
    return mirrorHandResults(res);
  }

  stop() {
    this.running = false;
    this.worker?.terminate();this.worker=null;this.previewFrame?.close();this.previewFrame=null;this.result=undefined;this.busy=false;
    if(this.ownsStream) this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.landmarker?.close?.();
    this.landmarker = null;
  }

  startWorker(){
    return new Promise((resolve,reject)=>{
      // MediaPipe's WASM loader uses importScripts, which needs a classic worker.
      const worker=this.worker=new Worker(new URL('./hand-worker.js',import.meta.url));
      const timeout=setTimeout(()=>reject(new Error('Hand worker startup timeout')),20000);
      worker.onerror=error=>{clearTimeout(timeout);reject(error);if(this.running)this.stop();};
      worker.onmessage=({data})=>{
        if(data.type==='progress')return;
        if(data.type==='ready'){clearTimeout(timeout);resolve();return;}
        if(data.type==='error'){clearTimeout(timeout);this.busy=false;reject(new Error(data.error));if(this.running)this.stop();return;}
        this.previewFrame?.close();this.previewFrame=data.frame;this.result=data.hands;this.detectMs=data.detectMs;this.busy=false;this.newFrame=true;
        this.frames++;this._n++;const now=performance.now();if(now-this._t>=1000){this.fps=this._n*1000/(now-this._t);this._n=0;this._t=now;}
      };
      worker.postMessage({type:'init'});
    });
  }
}
