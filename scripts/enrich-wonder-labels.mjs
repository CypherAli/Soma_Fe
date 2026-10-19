import fs from 'node:fs/promises';
import ts from 'typescript';
import { upperLimbName } from './lib/upper-limb-names.mjs';
// Reuse only exact, single-part descriptions already curated by this project.
const annotations=new Map();
const topics=new Map();
function value(node){
 if(ts.isStringLiteral(node))return node.text;
 if(ts.isArrayLiteralExpression(node))return node.elements.map(value);
 if(ts.isObjectLiteralExpression(node))return Object.fromEntries(node.properties.filter(ts.isPropertyAssignment).map(p=>[p.name.text,value(p.initializer)]));
 return undefined;
}
for(const file of await fs.readdir('src/lib/humanAtlas/scenes')){
 if(!file.endsWith('.ts'))continue;
 const source=ts.createSourceFile(file,await fs.readFile('src/lib/humanAtlas/scenes/'+file,'utf8'),ts.ScriptTarget.Latest,true);
 function visit(node){
  if(ts.isObjectLiteralExpression(node)){
   const data=value(node);
   if(data.parts?.length&&data.name?.vi&&data.note?.vi){
    for(const id of data.parts){
     const list=topics.get(id)||[];
     list.push({name:data.name.vi,latin:data.latin||'',description:data.note.vi,partCount:data.parts.length,reference:'src/lib/humanAtlas/scenes/'+file});
     topics.set(id,list);
    }
   }
   if(data.parts?.length===1&&data.name?.vi&&data.note?.vi){
    const candidate={name:data.name.vi,latin:data.latin||'',description:data.note.vi,reference:'src/lib/humanAtlas/scenes/'+file};
    if(!annotations.has(data.parts[0]))annotations.set(data.parts[0],candidate);
   }
  }
  ts.forEachChild(node,visit);
 }
 visit(source);
}
const atlas=JSON.parse(await fs.readFile('public/human-atlas/atlas.json','utf8'));
const canonical=name=>name.toLowerCase().replace(/\b(left|right)\b/g,'').replace(/\s+/g,' ').trim();
const pairedNames=new Map();
const canonicalParts=new Map();
for(const part of atlas.parts){const key=canonical(part.name),parts=canonicalParts.get(key)||[];parts.push(part);canonicalParts.set(key,parts);}
for(const part of atlas.parts){const annotation=annotations.get(part.id);const pair=canonicalParts.get(canonical(part.name));if(annotation&&pair.length===2&&pair.some(p=>/\bleft\b/i.test(p.name))&&pair.some(p=>/\bright\b/i.test(p.name)))pairedNames.set(canonical(part.name),annotation);}
let count=0,pairedCount=0;
for(const file of await fs.readdir('public/wonder/assets/regions')){
 if(!file.endsWith('.json'))continue;
 const path='public/wonder/assets/regions/'+file,meta=JSON.parse(await fs.readFile(path,'utf8'));
 for(const group of meta.groups){
  const part=meta.parts.find(p=>p.id===group.id);
  // A system mesh may contain hundreds of parts: never assign one part's note to it.
  if(!part||group.info!==part.name)continue;
  group.sourceName=part.name;group.sourceId=part.id;
  const seen=new Set();
  group.learningNotes=(topics.get(part.id)||[]).filter(topic=>topic.partCount>1).sort((a,b)=>a.partCount-b.partCount).filter(topic=>{
   const key=topic.name+'|'+topic.description;if(seen.has(key))return false;seen.add(key);return true;
  }).slice(0,2);
  const annotation=annotations.get(part.id);
  if(annotation){group.label=annotation.name+(/\bleft\b/i.test(part.name)?' (trái)':/\bright\b/i.test(part.name)?' (phải)':'');Object.assign(group,annotation);count++;}
  else{
   if(/\b(left|right)\b/i.test(group.label)&&/ngón/.test(group.label))group.label=part.name;
   if(group.nameReference){group.label=part.name;delete group.latin;delete group.nameReference;}
   const translated=upperLimbName(part.name);
   if(translated){group.label=translated;group.translationReference='scripts/lib/upper-limb-names.mjs';}
   const pair=pairedNames.get(canonical(part.name));
   if(pair){
    group.label=pair.name+(/\bleft\b/i.test(part.name)?' (trái)':/\bright\b/i.test(part.name)?' (phải)':'');
    group.latin=pair.latin;group.nameReference=pair.reference;pairedCount++;
    // A verified matching name is reusable; a unilateral note is not copied.
   }
  }
 }
 await fs.writeFile(path,JSON.stringify(meta));
}
console.log('PASS enriched',count,'exact notes,',pairedCount,'matching paired names; no unilateral notes copied');
