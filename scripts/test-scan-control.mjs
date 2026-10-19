import fs from 'node:fs';
import assert from 'node:assert/strict';
import { scanControlModel as f, scanControlModelName } from '../src/lib/vision/scanControlModel.ts';
import { ATLAS_PRESETS } from '../public/wonder/src/models/atlas-presets.js';
for(const slug of ['giai-phau-dau','giai-phau-co','bo-phan-ban-tay','giai-phau-cang-tay'])assert.equal(scanControlModelName(slug),ATLAS_PRESETS.find(p=>p.id===f(slug)).name);
for(const [slug,part,id] of [['giai-phau-cang-tay',null,'forearm'],['bo-phan-co-tay',null,'wrist'],['bo-phan-ban-tay',null,'hand'],['giai-phau-dau',null,'head'],['giai-phau-co',null,'neck'],['nua-than-tren',null,'bust'],['','upper-arm','arm'],['','wrist','wrist'],['','hand','hand']])assert.equal(f(slug,part),id);
const page=fs.readFileSync('src/app/[locale]/cu-chi/page.tsx','utf8');assert.ok(!page.includes('if (next === "control") setEnabled(false)'));assert.ok(page.includes('paused: viewMode === "control"'));console.log('PASS scan selection mapping and camera handoff invariants');

const hook=fs.readFileSync('src/lib/gesture/useHandTracking.ts','utf8');
assert.ok(hook.includes('cameraStreamRef.current = stream;'));
assert.ok(hook.includes('const stream = cameraStreamRef.current;'));
assert.ok(!page.includes('const stream = videoRef.current?.srcObject;'));
assert.ok(page.includes('const stream = cameraStreamRef.current;'));
console.log('PASS camera ownership survives scan video unmount');
