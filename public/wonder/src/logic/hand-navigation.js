import { classify, THUMB } from './gestures.js';

// Inference receives the original, unmirrored camera image. MediaPipe's hand
// classifier assumes a selfie image; correct its label before mirroring points.
// Never infer physical handedness from screen position (hands may cross).
export function mirrorHandResults(result, inputMirrored = false) {
  return (result.landmarks || []).map((points, index) => {
    const hand = points.map(point => [inputMirrored ? point.x : 1 - point.x, point.y]);
    const category = result.handedness?.[index]?.[0];
    const name = category?.categoryName?.toLowerCase();
    hand.handedness = name === 'left' || name === 'right'
      ? inputMirrored ? name : name === 'left' ? 'right' : 'left' : null;
    hand.handednessScore = category?.score || 0;
    return hand;
  });
}

export class HandNavigation {
  constructor() { this.slots = { left: {}, right: {} }; }
  update(hands, time, suspended = false) {
    this.active = false;
    const thumbs = new Map();
    for (const hand of hands) {
      if (!(hand?.handedness in this.slots) || hand.handednessScore < .75) continue;
      thumbs.set(hand.handedness, classify(hand) === THUMB);
    }
    // The two-like guard also owns the gesture; it must not become zoom.
    this.active = !suspended && !!(thumbs.get('left') && thumbs.get('right'));
    const events = [];
    for (const [side, slot] of Object.entries(this.slots)) {
      const present = thumbs.has(side), thumb = thumbs.get(side);
      if (present) slot.lastSeen = time;
      if (suspended || thumbs.get('left') && thumbs.get('right')) {
        slot.since = null;
        if(thumb){slot.latched=true;slot.release=null;}
        else if(present){slot.release??=time;if(time-slot.release>=.2)slot.latched=false;}
        else if(slot.lastSeen!==undefined&&time-slot.lastSeen>=.8)slot.latched=false;
      } else if (thumb) {
        slot.release = null;
        slot.since ??= time;
        // A single raw like must not steal the wrist rotation gesture.
        if (time - slot.since >= .12) this.active = true;
        if (!slot.latched && time - slot.since >= .4) {
          events.push(side === 'left' ? 'model' : 'block'); slot.latched = true;
        }
      } else {
        slot.since = null;
        if (present) {
          slot.release ??= time;
          if (time - slot.release >= .2) slot.latched = false;
        } else if (time - (slot.lastSeen ?? time) >= .8) slot.latched = false;
      }
    }
    return events;
  }
}
