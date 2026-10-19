import assert from "node:assert/strict";
import fs from "node:fs";
import zlib from "node:zlib";
import { inspectionFrame } from "../public/wonder/src/logic/inspection-frame.js";

const meta = JSON.parse(
  fs.readFileSync("public/wonder/assets/regions/head.json", "utf8"),
);
const raw = zlib.gunzipSync(
  fs.readFileSync("public/wonder/assets/regions/head.bin.gz"),
);
const positions = new Float32Array(Uint8Array.from(raw).buffer);
const original = positions.slice();
const groups = meta.groups.map((group, pick) => ({
  ...group,
  pick,
  start: group.start / 3,
  count: group.count / 3,
}));
const surface = { positions, groups };
for (const system of ["endocrine", "respiratory", "nervous"]) {
  const ids = new Set(
    groups
      .filter((group) => group.system === system)
      .map((group) => group.pick),
  );
  assert.ok(ids.size > 0, system);
  const fitted = inspectionFrame(surface, ids);
  assert.ok(fitted && Number.isFinite(fitted.scale) && fitted.scale > 0);
  for (const group of groups.filter((group) => ids.has(group.pick)))
    for (let p = group.start * 3; p < (group.start + group.count) * 3; p += 3) {
      const point = [0, 1, 2].map(
        (k) => (positions[p + k] - fitted.center[k]) * fitted.scale,
      );
      assert.ok(
        Math.hypot(...point) <= 0.850001,
        `${system} remains inside the centered frame`,
      );
    }
}
assert.deepEqual(positions, original, "Framing must not modify source anatomy");
assert.equal(inspectionFrame(surface, new Set()), null);
const boundsSurface = {
  groups: [
    {
      pick: 1,
      bounds: [
        [4, -5, 2],
        [6, -3, 4],
      ],
      offset: [2, 1, 0],
    },
  ],
};
assert.deepEqual(
  inspectionFrame(boundsSurface, new Set([1])).center,
  [5, -4, 3],
);
assert.deepEqual(
  inspectionFrame(boundsSurface, new Set([1]), 0.85, {
    explode: 1,
    exCenter: [1, 1, 0],
  }).center,
  [6, -4, 3],
);
console.log(
  "PASS actual endocrine, respiratory and neural source geometry fits centrally; cached bounds, exploded offsets and immutable source",
);
