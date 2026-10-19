import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import ts from 'typescript';
const cache=new Map();
async function records(reference){
 if(cache.has(reference))return cache.get(reference);
 assert.ok(reference.startsWith('src/lib/humanAtlas/scenes/')&&!reference.includes('..'));
 const source=ts.createSourceFile(reference,await fs.readFile(reference,'utf8'),ts.ScriptTarget.Latest,true),entries=[];
 function field(node,key){return node.properties?.find(p=>ts.isPropertyAssignment(p)&&p.name.text===key)?.initializer;}
 function visit(node){
  if(ts.isObjectLiteralExpression(node)){
   const parts=field(node,'parts'),note=field(node,'note'),vi=note&&field(note,'vi');
   if(parts&&ts.isArrayLiteralExpression(parts)&&vi&&ts.isStringLiteral(vi))entries.push({ids:parts.elements.filter(ts.isStringLiteral).map(p=>p.text),description:vi.text});
  }
  ts.forEachChild(node,visit);
 }
 visit(source);cache.set(reference,entries);return entries;
}
let exact=0,context=0;
for(const file of await fs.readdir('public/wonder/assets/regions')){
 if(!file.endsWith('.json'))continue;
 const meta=JSON.parse(await fs.readFile('public/wonder/assets/regions/'+file,'utf8'));
 for(const group of meta.groups){
  if(group.description){
   assert.ok((await records(group.reference)).some(r=>r.ids.length===1&&r.ids[0]===group.sourceId&&r.description===group.description),'individual note must match one exact source ID');exact++;
  }
  for(const topic of group.learningNotes||[]){
   assert.ok((await records(topic.reference)).some(r=>r.ids.length===topic.partCount&&r.ids.length>1&&r.ids.includes(group.sourceId)&&r.description===topic.description),'group context must include the selected structure');context++;
  }
 }
}
console.log('PASS',exact,'individual notes and',context,'group notes match their actual source IDs');
