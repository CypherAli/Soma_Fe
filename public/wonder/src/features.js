export { parseCommand, MODEL_NAMES, normalizeVoice, readingText, resolveVoiceSystems, commandFeedback } from './logic/voice-commands.js';
export { Voice, Speaker, speak } from './logic/speech.js';

/** Records the particle canvas + overlay (labels, hand skeleton) into a WebM video. */
export class Recorder {
  constructor(gl, overlay) { this.gl = gl; this.overlay = overlay; this.on = false; this.t0 = 0; }
  static supported() { return typeof MediaRecorder !== 'undefined' && !!HTMLCanvasElement.prototype.captureStream; }
  start() {
    const W = Math.min(this.gl.width, 1920), H = Math.round((W * this.gl.height) / this.gl.width);
    this.comp = document.createElement('canvas'); this.comp.width = W; this.comp.height = H;
    this.ctx = this.comp.getContext('2d');
    const stream = this.comp.captureStream(30);
    const type = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find((m) => MediaRecorder.isTypeSupported(m)) || '';
    this.type = type || 'video/webm';
    this.chunks = [];
    this.mr = new MediaRecorder(stream, type ? { mimeType: type, videoBitsPerSecond: 8e6 } : undefined);
    this.mr.ondataavailable = (e) => { if (e.data.size) this.chunks.push(e.data); };
    this.mr.start(250);
    this.on = true; this.t0 = performance.now();
  }
  /** Call right after drawing a frame (the WebGL buffer is still valid in the same task). */
  frame() {
    if (!this.on) return;
    const { ctx, comp } = this;
    ctx.drawImage(this.gl, 0, 0, comp.width, comp.height);
    ctx.drawImage(this.overlay, 0, 0, comp.width, comp.height);
  }
  seconds() { return this.on ? (performance.now() - this.t0) / 1000 : 0; }
  stop() {
    return new Promise((resolve) => {
      if (!this.on) { resolve(null); return; }
      this.mr.onstop = () => resolve(new Blob(this.chunks, { type: this.type }));
      this.frame(); this.mr.stop(); this.on = false;
    });
  }
}

