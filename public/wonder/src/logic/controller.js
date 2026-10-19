// Glue between hand landmarks and the state machine. Pure logic -> unit-testable with synthetic hands.
import { classify, openness, pinched, PoseDebouncer, SnapDetector, NONE, THUMB } from './gestures.js';
import { HandNavigation } from './hand-navigation.js';
import { WonderState } from './state.js';

export class Controller {
  constructor(n, isMachine = () => false, holdFrames = 4) {
    this.state = new WonderState(n, isMachine);
    this.debounce = new PoseDebouncer(holdFrames);
    this.snap = new SnapDetector();
    this.pose = NONE;
    this.rawPose = NONE;
    this.openness = 0;          // 0 fist .. 1 open (raw, per camera frame)
    this.handX = 0.5;           // palm centre in mirrored image coordinates
    this.handY = 0.5;
    this.lastHandT = -1e9;
    this.landmarks = null;
    this.aspect = 1;            // image width / height (landmark x and y are normalized separately)
    this.roll = 0;              // smoothed hand twist in the image plane, radians (0 = fingers up, + = clockwise)
    this.pinch = false; this.pinchStart = false; this._pinchN = 0;   // debounced pinch + rising edge
    this.second = null; this.secondT = -1e9; this.primaryWrist = null;   // optional second hand (two-hand zoom)
    this.handNavigation = new HandNavigation(); this.navigation = [];
  }

  /** All hands of one camera frame. The primary hand (gestures) is the one nearest the previous primary. */
  onHands(hands, t) {
    this.navigation.push(...this.handNavigation.update(hands, t, this.suspended));
    this.navigationActive = this.handNavigation.active;
    let primary = hands[0] || null, second = null;
    if (hands.length >= 2) {
      const ref = this.primaryWrist, dist = (h) => (ref ? Math.hypot(h[0][0] - ref[0], h[0][1] - ref[1]) : 0);
      [primary, second] = dist(hands[0]) <= dist(hands[1]) ? [hands[0], hands[1]] : [hands[1], hands[0]];
    }
    if (primary) this.primaryWrist = primary[0];
    this.second = second;
    if (second) this.secondT = t;
    return this.onHand(primary, t);
  }
  secondVisible(t) { return !!this.second && t - this.secondT < 0.35; }

  /** Hand twist from the wrist -> middle-knuckle direction; unaffected by opening/closing the fingers. */
  static rollOf(lm, aspect = 1) {
    return Math.atan2((lm[9][0] - lm[0][0]) * aspect, -(lm[9][1] - lm[0][1]));
  }

  rebaseRoll() {
    // A new grab must start from the current wrist, not the filter tail left
    // by a preceding point/like pose. Subsequent samples keep WonderSnap smoothing.
    if (this.landmarks) this.roll = Controller.rollOf(this.landmarks, this.aspect);
  }

  /** Call once per camera frame (lm = 21 [x, y] pairs or null). Returns true if a snap fired. */
  onHand(lm, t) {
    const raw = classify(lm);
    const [stable, changed] = this.debounce.update(raw);
    const navigationPose = raw === THUMB || this.navigationActive || this.suspended;
    if (navigationPose) this.snap.reset();
    const snapped = navigationPose ? false : this.snap.update(lm, t);
    this.rawPose = raw;
    this._pinchN = pinched(lm) ? this._pinchN + 1 : 0;
    const was = this.pinch;
    this.pinch = this._pinchN >= 3;
    this.pinchStart = this.pinchStart || (!was && this.pinch);        // latched until the app consumes it
    this.pose = stable;
    this.landmarks = lm;
    if (lm) {
      const r = Controller.rollOf(lm, this.aspect);
      if (t - this.lastHandT > 0.5) this.roll = r;                                     // WonderSnap reacquisition
      else this.roll += Math.atan2(Math.sin(r - this.roll), Math.cos(r - this.roll)) * .5; // WonderSnap wrist filter
      this.openness = openness(lm);
      this.handX = (lm[0][0] + lm[9][0]) / 2;
      this.handY = (lm[0][1] + lm[9][1]) / 2;
      this.lastHandT = t;
    }
    if(!this.suspended&&!navigationPose)this.state.update(stable===THUMB?NONE:stable, changed&&stable!==THUMB, snapped, t);
    return snapped;
  }

  handVisible(t) { return t - this.lastHandT < 0.35; }

  // keyboard / UI fallbacks (also handy while tuning gestures)
  keySnap(t) { this.state.update(this.pose, false, true, t); }
  keyPose(pose, t) { this.state.update(pose, true, false, t); }
  tick(t) { this.state.update(this.pose, false, false, t); }     // timers (DISSOLVE -> IDLE) without camera input
}
