import assert from "node:assert/strict";
import {
  HandNavigation,
  mirrorHandResults,
} from "../public/wonder/src/logic/hand-navigation.js";
import { Controller } from "../public/wonder/src/logic/controller.js";
import { hand } from "../public/wonder/src/logic/synth.js";
import {
  systemBlocks,
  selectionFor,
} from "../public/wonder/src/logic/inspection-controls.js";
import fs from "node:fs";

const raw = {
  landmarks: [[{ x: 0.2, y: 0.3 }]],
  handedness: [[{ categoryName: "Right", score: 0.98 }]],
};
const mirrored = mirrorHandResults(raw)[0];
assert.equal(mirrored.handedness, "left");
assert.equal(mirrored[0][0], 0.8);
assert.equal(mirrorHandResults(raw, true)[0].handedness, "right");
assert.equal(
  structuredClone([mirrored])[0].handedness,
  "left",
  "Worker transfer preserves side metadata",
);
assert.equal(
  mirrorHandResults({ landmarks: raw.landmarks })[0].handedness,
  null,
);
for (const fps of [6, 9, 11, 30]) {
  const gate = new HandNavigation();
  let events = [];
  const feed = (pose, side, start, seconds, cx = 0.5) => {
    for (let i = 0; i < Math.ceil(seconds * fps); i++)
      events.push(
        ...gate.update([hand({ pose, handedness: side, cx })], start + i / fps),
      );
  };
  feed("like", "left", 0, 3, 0.9);
  assert.deepEqual(
    events,
    ["model"],
    "Left hand selects one model regardless of screen position",
  );
  events = [];
  feed("fist", "left", 3, 0.5);
  feed("like", "left", 3.5, 1, 0.1);
  assert.deepEqual(events, ["model"], "Neutral pose rearms");
  events = [];
  feed("like", "right", 5, 3, 0.1);
  assert.deepEqual(events, ["block"], "Right hand selects one internal block");
  for (const t of [8, 8.1, 8.2]) gate.update([], t);
  events = [];
  feed("like", "right", 8.3, 1, 0.9);
  assert.deepEqual(events, [], "Short dropout cannot repeat the command");
  const unknown = new HandNavigation();
  assert.deepEqual(
    unknown.update([hand({ pose: "like" })], 10),
    [],
    "Unknown side never guesses a global command",
  );
  const both = new HandNavigation();
  for (let i = 0; i < fps * 2; i++)
    assert.deepEqual(
      both.update(
        [
          hand({ pose: "like", handedness: "left" }),
          hand({ pose: "like", handedness: "right" }),
        ],
        i / fps,
      ),
      [],
      "Two simultaneous likes are suppressed",
    );
  assert.equal(both.active, true, "Two-like guard also blocks zoom");
}
const fresh = new HandNavigation();
for (let i = 0; i < 30; i++) fresh.update([], i / 9, true);
const first = [];
for (let i = 0; i < 10; i++)
  first.push(
    ...fresh.update([hand({ pose: "like", handedness: "left" })], 4 + i / 9),
  );
assert.deepEqual(
  first,
  ["model"],
  "A hand absent during loading must accept its first navigation command",
);
const snapGuard = new Controller(5, () => true);
snapGuard.state.go("formed", 0);
snapGuard.snap.pressedAt = -0.02;
snapGuard.onHands([hand({ pose: "like", handedness: "left" })], 0);
assert.equal(
  snapGuard.state.state,
  "formed",
  "Releasing a thumb into a like must not fire the snap/dissolve gesture",
);
assert.equal(
  snapGuard.snap.pressedAt,
  null,
  "Navigation clears a pending snap press",
);
const controller = new Controller(5, () => true);
controller.state.go("formed", 0);
controller.onHands([hand({ pose: "like", handedness: "right" })], -0.2);
assert.equal(
  controller.navigationActive,
  false,
  "One raw like cannot interrupt wrist rotation",
);
controller.onHands([hand({ pose: "open", handedness: "right" })], -0.1);
assert.equal(
  controller.navigationActive,
  false,
  "A noisy like clears without stealing rotation",
);
for (let i = 0; i < 40; i++)
  controller.onHands([hand({ pose: "like", handedness: "right" })], i / 30);
assert.equal(
  controller.navigationActive,
  true,
  "Confirmed like pauses rotation before navigation",
);
assert.equal(
  controller.state.index,
  0,
  "Right like cannot also advance WonderState",
);
assert.deepEqual(controller.navigation, ["block"]);
controller.navigation = [];
controller.suspended = true;
for (let i = 0; i < 40; i++)
  controller.onHands([hand({ pose: "like", handedness: "left" })], 2 + i / 30);
assert.deepEqual(
  controller.navigation,
  [],
  "Integrated scan never navigates models",
);
const labels = JSON.parse(
  fs.readFileSync(
    new URL("../public/wonder/assets/regions/fingers.json", import.meta.url),
  ),
).groups;
const blocks = systemBlocks(labels, new Set(labels.map((_, i) => i)));
assert.deepEqual(
  blocks.slice(0, 5).map((block) => block.system),
  ["muscular", "sensory", "venous", "arterial", "skeletal"],
);
for (const block of blocks)
  assert.equal(
    selectionFor(labels, block.pick, "system").ids.size,
    block.count,
  );
console.log(
  "PASS physical handedness, worker metadata, 6/9/11/30 FPS one-shot, crossed hands, release/dropout, two-hand guard, right-hand state isolation, scan suppression and source system cycle",
);
