// Runtime chung cho model convert từ atlas (Soma -> WonderSnap). Worker-safe.
import { Part } from '../lib/sampling.js';
const _dc = new Map();
export function decodeCloud(b64) {
  let f = _dc.get(b64.length + ":" + b64.slice(0, 16));
  if (!f) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    f = new Float32Array(bytes.buffer);
    _dc.set(b64.length + ":" + b64.slice(0, 16), f);
  }
  return f;
}
export function cloudPart(data, start, count, jitter) {
  return new Part((rng, o, i) => {
    const s = (start + ((rng.random() * count) | 0)) * 3;
    const j = i * 3;
    o[j] = data[s] + rng.normal() * jitter;
    o[j + 1] = data[s + 1] + rng.normal() * jitter;
    o[j + 2] = data[s + 2] + rng.normal() * jitter;
  }, count);
}
export function hexRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
