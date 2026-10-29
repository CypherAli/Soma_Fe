import assert from 'node:assert/strict';
import { nextModelIndex } from '../public/wonder/src/logic/model-navigation.js';
import { ModelTransition } from '../public/wonder/src/logic/model-transition.js';
import { CATALOG } from '../public/wonder/src/models/catalog.js';

const index = id => CATALOG.findIndex(model => model.id === id);
assert.equal(CATALOG[nextModelIndex(CATALOG,index('fingers'))].id,'head');
assert.equal(CATALOG[nextModelIndex(CATALOG,index('head'),-1)].id,'fingers');
assert.equal(CATALOG[nextModelIndex(CATALOG,index('index-finger'))].id,'head');
assert.equal(CATALOG[nextModelIndex(CATALOG,index('index-finger'),-1)].id,'fingers');
assert.equal(CATALOG.filter(model=>model.detailOf).length,5);
for(const model of CATALOG.filter(model=>model.detailOf)) assert.ok(index(model.detailOf)>=0);

const start=index('bust'),visited=new Set();
let current=start;
do {
  assert.ok(!visited.has(current),'Every quick-cycle model is visited once');
  assert.ok(!CATALOG[current].detailOf);
  visited.add(current);
  const next=nextModelIndex(CATALOG,current);
  assert.equal(nextModelIndex(CATALOG,next,-1),current,'Previous reverses next');
  current=next;
} while(current!==start);
assert.equal(visited.size,CATALOG.filter(model=>!model.detailOf).length);

const transition=new ModelTransition();
transition.begin(nextModelIndex(CATALOG,start),0,true);
const first=transition.pending.index;
const second=nextModelIndex(CATALOG,start,1,transition.pending);
assert.notEqual(second,first,'Rapid next starts from the requested model while the old model remains visible');
transition.begin(second,0.1,true);
assert.equal(nextModelIndex(CATALOG,start,-1,transition.pending),first);
assert.equal(nextModelIndex([],0),-1);
assert.equal(nextModelIndex([{detailOf:'parent'}],0),0);
console.log(`PASS ${visited.size} unique quick-cycle models, five directly selectable details, wraparound, reverse and rapid pending navigation`);
