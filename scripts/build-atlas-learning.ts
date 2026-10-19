import fs from 'node:fs';
import { atlasScenes } from '../src/lib/humanAtlas/scenes';
import { sceneModules } from '../src/lib/sceneModules';
import type { T3 } from '../src/lib/homeContent';
import { upperLimbName } from './lib/upper-limb-names.mjs';

type Source={title:string;page?:number;path?:string;url?:string};
type Topic={name:T3;latin?:string;note:T3;slug:string;key:string;parts:number};
type Entry={name?:T3;latin?:string;note?:T3;sources:Source[];topics:Topic[]};
const atlas=JSON.parse(fs.readFileSync('public/human-atlas/atlas.json','utf8')) as {parts:{id:string;name:string}[]};
const canonical=(value:string)=>value.toLowerCase().replace(/\.([lr])$/,'').replace(/[_-]/g,' ').replace(/\b(left|right|muscle|bone)\b/g,'').replace(/\s+/g,' ').trim();
const sideOf=(value:string)=>/\bleft\b|\.l$/i.test(value.replace(/_/g,' '))?'left':/\bright\b|\.r$/i.test(value.replace(/_/g,' '))?'right':'';
const entries:Record<string,Entry>=Object.fromEntries(atlas.parts.map(part=>[part.id,{sources:[],topics:[]}]));
const names=new Map<string,{name:T3;latin?:string;note?:T3;source:Source}>();
for(const scene of Object.values(sceneModules))for(const h of scene.hotspots){
  if(!h.label||!h.note||/\.(or|er)(?:\.[lr])?$/i.test(h.meshName)||/origin|insertion/i.test(h.label.en))continue;
  const key=canonical(h.meshName)+'|'+sideOf(h.meshName);
  if(!names.has(key))names.set(key,{name:h.label,latin:h.latinName,note:h.note,source:{title:'Chú thích giải phẫu đã biên tập trong Soma',path:`src/lib/scenes (${scene.slug}/${h.key})`}});
}
for(const part of atlas.parts){
  const match=names.get(canonical(part.name)+'|'+sideOf(part.name))??names.get(canonical(part.name)+'|');
  if(match)Object.assign(entries[part.id],{name:match.name,latin:match.latin,note:match.note,sources:[match.source]});
}
const paired=new Map<string,Set<string>>();
for(const part of atlas.parts){const key=canonical(part.name),sides=paired.get(key)??new Set<string>();sides.add(sideOf(part.name));paired.set(key,sides);}
for(const part of atlas.parts){
  const key=canonical(part.name),entry=entries[part.id],sides=paired.get(key);
  if(entry.name||!sides?.has('left')||!sides.has('right'))continue;
  const opposite=names.get(key+'|'+(sideOf(part.name)==='left'?'right':'left'));if(!opposite)continue;
  entry.name={vi:opposite.name.vi.replace(/\s*[([]?\b(trái|phải)\b[)\]]?/gi,'').trim(),en:opposite.name.en.replace(/\b(left|right)\b/gi,'').replace(/\s+/g,' ').trim(),zh:opposite.name.zh.replace(/[左右]/g,'')};
  entry.latin=opposite.latin;entry.sources.push({...opposite.source,title:'Thuật ngữ của cấu trúc tương ứng hai bên — ghi chú từng bên không được sao chép'});
}
for(const scene of Object.values(atlasScenes))for(const group of scene.groups){
  const members=atlas.parts.filter(part=>group.parts.includes(part.id));
  const paired=members.length===2&&canonical(members[0].name)===canonical(members[1].name)&&members.every(part=>/\b(left|right)\b/i.test(part.name));
  for(const id of group.parts){
    const entry=entries[id];if(!entry)throw new Error(`Missing mesh ${id}`);
    if(group.note&&!entry.topics.some(topic=>topic.key===group.key&&topic.note.vi===group.note!.vi))entry.topics.push({name:group.name,latin:group.latin,note:group.note,slug:scene.slug,key:group.key,parts:group.parts.length});
    if(group.parts.length===1||paired){
      if(!entry.name||!entry.note){entry.name=group.name;entry.latin=group.latin;entry.note=group.note;entry.sources.push({title:'Bài giải phẫu Soma',path:`src/lib/humanAtlas/scenes (${scene.slug}/${group.key})`,url:`/giai-phau/mo-hinh/${scene.slug}?focus=${group.key}`});}
    }
  }
}
// Only exact bilingual headings are reused from the supplied textbook. No
// inferred diagnoses, auto-translated paragraphs, or whole-book text is shipped.
const book='Giải phẫu học — giáo trình Y Hà Nội';
const raw=fs.readFileSync('../soma_be/resources/medical_kb/text/giai-phau-yhn.txt','utf8');
const glossary=new Map<string,{vi:string;page:number}>();
let page=0;
for(const line of raw.split(/\r?\n/)){
  const pageMatch=line.match(/\[\[page (\d+)\]\]/);if(pageMatch){page=Number(pageMatch[1]);continue;}
  const match=line.match(/^\s*(?:\d+(?:\.\d+)*[.)]?\s*)?((?:Cơ|Xương|Động mạch|Tĩnh mạch|Thần kinh|Khớp|Dây chằng|Hồi|Rãnh|Nhân|Thuỳ|Thùy|Lỗ|Mỏm|Gan|Thận|Tuỷ|Tủy|Phế quản|Thanh quản|Thực quản|Dạ dày|Tá tràng|Hỗng tràng|Hồi tràng|Bàng quang)[^()]{0,75})\s*\(([A-Za-z][A-Za-z ,'-]{2,85})\)/i);
  if(!match)continue;
  const key=canonical(match[2]),vi=match[1].replace(/\s+/g,' ').trim();
  if(!glossary.has(key))glossary.set(key,{vi,page});
}
let bookNames=0;
for(const part of atlas.parts){
  const term=glossary.get(canonical(part.name)),entry=entries[part.id];
  const muscle=upperLimbName(part.name);
  if(muscle&&!entry.name){entry.name={vi:muscle,en:part.name,zh:''};entry.sources.push({title:'Từ điển thuật ngữ cơ chi trên của Soma',path:'scripts/lib/upper-limb-names.mjs'});}
  if(term&&!entry.name){entry.name={vi:term.vi,en:part.name,zh:''};entry.sources.push({title:book,page:term.page,path:'medical_kb/text/giai-phau-yhn.txt',url:`/tai-lieu-y-khoa?file=${encodeURIComponent('Giải Phẫu Người Y Hà Nội 2006 Đỏ Đen.pdf')}&page=${term.page}`});bookNames++;}
  entry.topics.sort((a,b)=>a.parts-b.parts);
}
fs.mkdirSync('src/lib/humanAtlas/data',{recursive:true});
const topics:Record<string,Topic>={};
const compact=Object.fromEntries(Object.entries(entries).map(([id,entry])=>[id,{...entry,topics:entry.topics.map(topic=>{const key=`${topic.slug}/${topic.key}`;topics[key]=topic;return key;})}]));
fs.writeFileSync('src/lib/humanAtlas/data/learning.generated.json',JSON.stringify({entries:compact,topics}));
const summary={meshes:atlas.parts.length,individualNames:Object.values(entries).filter(entry=>entry.name).length,individualDescriptions:Object.values(entries).filter(entry=>entry.note).length,withLearningTopics:Object.values(entries).filter(entry=>entry.topics.length).length,bookNames};
fs.writeFileSync('docs/audits/atlas-learning-coverage.json',JSON.stringify(summary,null,2));
console.log(summary);
