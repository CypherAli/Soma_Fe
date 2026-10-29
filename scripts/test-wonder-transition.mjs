import assert from "node:assert/strict";
import { ModelTransition } from "../public/wonder/src/logic/model-transition.js";

const transition = new ModelTransition();
transition.begin(2, 10, true);
assert.equal(
  transition.commit(10.4),
  null,
  "Keep the outgoing asset until its dissolve finishes",
);
assert.equal(transition.outgoingBlend(10), 1);
assert.ok(
  transition.outgoingBlend(10.4) > 0 && transition.outgoingBlend(10.4) < 1,
);
assert.equal(transition.commit(10.7), 2);
assert.equal(transition.commit(11), null, "Commit only once");
assert.equal(
  transition.shouldForm(20),
  false,
  "A slow load must not consume the assembly animation",
);
transition.uploaded(1, 20);
assert.equal(
  transition.shouldForm(21),
  false,
  "A stale model cannot trigger assembly",
);
transition.uploaded(2, 22);
assert.equal(transition.shouldForm(22.5), false);
assert.equal(transition.shouldForm(22.8), true);
assert.equal(
  transition.shouldForm(23),
  false,
  "Only one form command per transition",
);
transition.complete();
assert.equal(transition.pending, null);

transition.begin(1, 30, true);
transition.begin(3, 30.2, true);
assert.equal(transition.commit(30.8), null);
assert.equal(
  transition.commit(30.9),
  3,
  "The latest choice owns the transition",
);
transition.uploaded(1, 31);
assert.equal(transition.shouldForm(32), false);
transition.uploaded(3, 33);
assert.equal(transition.shouldForm(34), true);

transition.begin(0, 40, false, false);
assert.equal(
  transition.commit(40),
  0,
  "Initial load needs no outgoing animation",
);
transition.uploaded(0, 42);
assert.equal(
  transition.shouldForm(100),
  false,
  "Manual assembly remains manual",
);
console.log(
  "PASS outgoing dissolve, cold-load timing, stale results, latest selection, one-shot assembly and manual mode",
);

const repeated = new ModelTransition();
assert.equal(repeated.begin(4, 0, true), true);
assert.equal(repeated.begin(4, 0.5, true), false);
assert.equal(repeated.commit(0.7), 4, 'Repeated selection keeps the original dissolve deadline');
assert.equal(repeated.begin(4, 2, false), false);
repeated.uploaded(4, 3);
assert.equal(repeated.begin(4, 3.5, true), false);
assert.equal(repeated.shouldForm(3.8), true, 'Repeated selection cannot restart a slow load or assembly');
console.log('PASS duplicate selections preserve outgoing, loading and gathering progress');
