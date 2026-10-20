import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { localizedConceptName, localizedPartName } from './partNames';
import type { Atlas } from './anatomy';
import { wholeBodyScene } from './scenes/wholeBody';

const atlas=JSON.parse(readFileSync('public/human-atlas/atlas.json','utf8')) as Atlas;

test('heart and pulmonary valve keep distinct compound names and memberships',()=>{
  const heart=atlas.concepts.find(concept=>concept.name==='heart')!;
  const valve=atlas.concepts.find(concept=>concept.name==='pulmonary valve')!;
  assert.equal(localizedConceptName(heart,'vi'),'Tim');
  assert.equal(localizedConceptName(heart,'en'),'Heart');
  assert.equal(localizedConceptName(valve,'vi'),'Van động mạch phổi');
  assert.equal(heart.elements.length,83);
  assert.deepEqual(valve.elements,['FJ2417','FJ2427','FJ2434']);
  assert.notEqual(localizedConceptName(heart,'vi'),localizedPartName(atlas.parts.find(part=>part.id==='FJ2417')!,'vi'));
});

test('an individual valve leaflet retains its source identity',()=>{
  const part=atlas.parts.find(part=>part.id==='FJ2417')!;
  assert(localizedPartName(part,'vi').includes(part.name));
  assert.equal(localizedPartName(part,'en'),part.name);
});

test('whole-body system grouping separates cerebral ventricles from heart',()=>{
  const cardiac=atlas.parts.filter(part=>part.system==='cardiac');
  assert(!cardiac.some(part=>/lateral ventricle|third ventricle|fourth ventricle|interventricular foramen/i.test(part.name)));
  assert.equal(atlas.parts.find(part=>part.id==='FJ2419')?.system,'cardiac');
  for(const group of wholeBodyScene.groups){
    assert.deepEqual(group.parts,atlas.parts.filter(part=>part.system===group.key).map(part=>part.id));
  }
});
