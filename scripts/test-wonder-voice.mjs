import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CATALOG } from '../public/wonder/src/models/catalog.js';
import { parseCommand, readingText, MODEL_NAMES, commandFeedback } from '../public/wonder/src/features.js';
import { Voice, Speaker } from '../public/wonder/src/logic/speech.js';
import { inspectionVisible } from '../public/wonder/src/models/inspection.js';

let checks=0;
function same(actual,expected,message){assert.deepEqual(actual,expected,message);checks++;}
const manifest=JSON.parse(await readFile(new URL('../public/wonder/assets/regions/forearm.json',import.meta.url),'utf8'));
const labels=manifest.groups.map(g=>({...g,label:g.label,info:g.sourceName||g.info}));
const command=text=>parseCommand(text,CATALOG,labels);
for(const [vi,en,type] of [['tách lớp','explode','explode'],['phóng to','zoom in','zoomIn'],['thu nhỏ','zoom out','zoomOut'],['đọc chú thích','read description','describe'],['tách từng cơ','separate muscles','muscleSplit'],['quét','scan','scan'],['dừng ghi hình','stop recording','stopRecord'],['dừng đọc','stop reading','stopRead']]){
  for(const phrase of [vi,en,vi.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d')])same(command(phrase),[{type}],phrase);
}
for(const phrase of ['không xoay','đừng xoay','do not rotate','stop rotating'])same(command(phrase),[{type:'rotate',value:false}],phrase);
same(command('xoay'),[{type:'rotate',value:true}]);
for(const phrase of ['tách giải phẫu tim','tach giai phau tim','tách mô hình tim','explode heart'])same(command(phrase),[{type:'explode',modelId:'heart'}],phrase);
for(const phrase of ['xoay mô hình tim 30 độ','xoay mô hình tim ba mươi độ','rotate heart 30 degrees','Soma ơi xoay tim 30 độ giúp mình'])same(command(phrase),[{type:'rotateDegrees',degrees:30,modelId:'heart'}],phrase);
same(command('xoay tim sang trái 90 độ'),[{type:'rotateDegrees',degrees:-90,modelId:'heart'}]);
same(command('xoay 30 độ'),[{type:'rotateDegrees',degrees:30}]);
for(const phrase of ['không tách giải phẫu tim','đừng xoay tim 30 độ','xoay tim 361 độ','xoay tim -30 độ','xoay tim 30.5 độ','xoay tim 0 độ','xoay tàu vũ trụ 30 độ','tách giải phẫu cơ quan không có'])same(command(phrase),[],phrase);
same(commandFeedback(['rotateDegrees:-30'],CATALOG,labels,'vi'),'Đã xoay trái 30 độ');
for(const phrase of ['không phóng to','do not open wrist','why does it rotate','animal cell','car','airplane','left','co'])same(command(phrase),[],phrase);
same(command('mở cổ')[0]?.id,'neck');same(command('mở cơ')[0]?.id,'muscles');
for(const model of CATALOG)for(const alias of MODEL_NAMES[model.id]||[])same(parseCommand('open model '+alias,CATALOG)[0]?.id,model.id,model.id+' / '+alias);
for(const [vi,en,id] of [['cổ tay','wrist','wrist'],['cẳng tay','forearm','forearm'],['đầu','head','head'],['cổ','neck','neck']])for(const name of [vi,en])same(command('mở '+name)[0]?.id,id);
const index=labels.findIndex(l=>l.sourceName==='Left brachioradialis');assert(index>=0);
for(const text of ['cơ cánh tay-quay trái','select left brachioradialis','show left brachioradialis','select '+labels[index].sourceId]){
  // Vietnamese label uses parentheses; punctuation is normalized.
  same(command(text),[{type:'part',index}],text);
}
same(command('show layer muscles'),[{type:'layerOn',systems:['muscular']}]);
same(command('ẩn lớp mạch máu'),[{type:'layerOff',systems:['arterial','venous']}]);
same(command('chỉ xem cơ'),[{type:'layerOnly',systems:['muscular']}]);
same(inspectionVisible({system:'muscular'},'all',new Set(['muscular'])),false);
const l={label:'Cơ thử (trái)',sourceName:'Left test muscle',description:'Mô tả riêng.',learningNotes:[{description:'Ghi chú nhóm.'}]};
same(readingText(l,null,'vi').text,'Cơ thử (trái). Mô tả riêng.');
same(readingText(l,null,'en'),{text:'Left test muscle',missing:true});
same(readingText(l,null,'en','group'),{text:'Left test muscle',missing:true});
same(readingText(l,null,'vi','group').text.includes('Ghi chú nhóm giải phẫu. Ghi chú nhóm.'),true);
same(readingText({...l,descriptionEn:'Specific description.'},null,'en').text,'Left test muscle. Specific description.');
same(commandFeedback(['explode'],CATALOG,labels,'vi'),'Đã tách lớp');
same(commandFeedback([labels[index].label],CATALOG,labels,'en'),'Left brachioradialis');
console.log(`PASS ${checks} bilingual intents, all catalog aliases, exact anatomy targets, negation, layers and source-language reading`);

class Recognition {
  static instances=[];
  start(){this.starts=(this.starts||0)+1;if(this.fail)throw Error('start');this.onstart?.();}
  abort(){this.aborts=(this.aborts||0)+1;this.onend?.();}
  constructor(){Recognition.instances.push(this);}
  result(text,final=true){this.onresult?.({resultIndex:0,results:[Object.assign([{transcript:text}],{isFinal:final})]});}
}
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
globalThis.window={SpeechRecognition:Recognition};
const states=[],heard=[],errors=[];
const voice=new Voice(text=>heard.push(text),{onState:s=>states.push(s),onError:e=>errors.push(e)});
same(voice.start('vi'),true);let rec=voice.rec;same(rec.lang,'vi-VN');same(rec.maxAlternatives,3);
rec.result('interim',false);rec.result('phóng to');same(heard,['phóng to']);
voice.pause('speech');rec.result('tách lớp');same(heard,['phóng to']);same(states.at(-1),'paused');
voice.resume('speech');await sleep(380);same(rec.starts,2);
voice.resume('not-paused');await sleep(380);same(rec.starts,2,'resuming an inactive reason must not start recognition twice');
voice.pause('speech');voice.resume('speech');rec.onerror({error:'aborted'});await sleep(380);same(voice.on,true,'a delayed intentional abort must not disable the microphone');same(rec.starts,3);
voice.setLanguage('en');same(voice.rec.lang,'en-US');const current=voice.rec;
rec.result('stale');same(heard,['phóng to']);
current.onerror({error:'not-allowed'});same(voice.on,false);same(states.at(-1),'error');same(errors.at(-1),'not-allowed');
await sleep(380);same(current.starts,1,'permission failure must not loop');
voice.start();rec=voice.rec;rec.onend();voice.stop();await sleep(380);same(rec.starts,1,'manual stop cancels pending restart');
voice.start();voice.rec.fail=true;voice.rec.onend();await sleep(380);same(errors.at(-1),'start-failed');same(voice.on,false);
window.SpeechRecognition=null;same(new Voice(()=>{}).start(),false);window.SpeechRecognition=Recognition;
window.SpeechRecognition=class {constructor(){throw Error('constructor failed');}};
const constructorErrors=[];same(new Voice(()=>{},{onError:error=>constructorErrors.push(error)}).start(),false);same(constructorErrors,['start-failed']);window.SpeechRecognition=Recognition;
const networkErrors=[];const networkVoice=new Voice(()=>assert.fail('network errors cannot execute a command'),{onError:error=>networkErrors.push(error)});
networkVoice.start();const networkRec=networkVoice.rec;networkRec.onerror({error:'network'});await sleep(380);same(networkVoice.on,false);same(networkRec.starts,1);same(networkErrors,['network']);networkVoice.dispose();

class Synthesis extends EventTarget {
  available=[];spoken=[];cancel(){this.cancelled=(this.cancelled||0)+1;}
  getVoices(){return this.available;}speak(u){this.spoken.push(u);}
}
globalThis.SpeechSynthesisUtterance=class {constructor(text){this.text=text;}};
const synth=new Synthesis();window.speechSynthesis=synth;
const speakerErrors=[];const speaker=new Speaker({voice,onError:error=>speakerErrors.push(error)});
synth.available=[{lang:'en-US',name:'English'}];
same(await speaker.speak('Tên cơ',{language:'vi'}),false);same(speakerErrors.at(-1),'missing-vi');same(synth.spoken.length,0);
synth.available.push({lang:'vi_VN',name:'Vietnamese'});
voice.start('vi');same(await speaker.speak('Tên cơ',{language:'vi'}),true);
same(synth.spoken.at(-1).lang,'vi_VN');same(voice.pauses.has('speech'),true);
const spoken=synth.spoken.at(-1);spoken.onend();await sleep(380);same(voice.pauses.size,0);same(voice.rec.starts,2);
same(await speaker.speak('English name',{language:'en'}),true);same(synth.spoken.at(-1).voice.name,'English');
speaker.stop();voice.stop();
synth.available=[];const pending=speaker.speak('Delayed',{language:'en'});speaker.stop();same(await pending,false);same(synth.spoken.length,2,'stop cancels pending voiceschanged');
const delayed=speaker.speak('Ready later',{language:'en'});synth.available=[{lang:'en-GB',name:'English UK'}];synth.dispatchEvent(new Event('voiceschanged'));same(await delayed,true);same(synth.spoken.at(-1).voice.name,'English UK');
speaker.stop();voice.dispose();
console.log(`PASS ${checks} total assertions, including speech lifecycle, missing voices, asynchronous loading, locale, pause/resume and cancellation`);
