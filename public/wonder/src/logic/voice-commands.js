import { modelVoiceCommand } from './model-voice-commands.js';
// Exact bilingual intents. Anatomy targets are resolved only from the current catalog.
export const MODEL_NAMES = {
  brain:['não','brain','human brain'], heart:['tim','heart','human heart'], kidney:['thận','kidney','kidneys'],
  lungs:['phổi','lung','lungs'], eye:['mắt','eye','eyes','human eye'], ear:['tai','ear','ears','human ear'],
  tooth:['răng','răng hàm','tooth','teeth','molar'], skull:['sọ','skull'], skeleton:['bộ xương','xương','skeleton'],
  body:['cơ thể','toàn thân','human body','body'], arm:['cánh tay','upper arm','arm'],
  liver:['gan','gan và túi mật','liver','liver and gallbladder'], stomach:['dạ dày','stomach'],
  gut:['ruột','ruột non và đại tràng','intestine','intestines'], pancreas:['tụy','lá lách','tụy và lá lách','pancreas','spleen'],
  muscles:['hệ cơ','cơ','muscles','muscular system'], 'upper-limb':['chi trên','toàn bộ chi trên','upper limb'],
  forearm:['cẳng tay','forearm'], wrist:['cổ tay','wrist'], hand:['bàn tay','bàn tay chi tiết','hand'],
  fingers:['ngón tay','các ngón tay','fingers'], thumb:['ngón cái','thumb'], 'index-finger':['ngón trỏ','index finger'],
  'middle-finger':['ngón giữa','middle finger'], 'ring-finger':['ngón áp út','ring finger'], 'little-finger':['ngón út','little finger','pinky'],
  head:['đầu','đầu đầy đủ','head'], neck:['cổ','neck'], thorax:['thân trên','ngực','thorax','upper torso'],
  bust:['đầu cổ thân trên','đầu và cổ và thân trên','bust','head neck and upper torso'],
};
export const MODEL_EN={brain:'Human brain',heart:'Human heart',kidney:'Kidney',lungs:'Lungs',eye:'Human eye',ear:'Human ear',tooth:'Molar tooth',skull:'Skull',skeleton:'Skeleton',body:'Human body',arm:'Upper arm',liver:'Liver and gallbladder',stomach:'Stomach',gut:'Small and large intestines',pancreas:'Pancreas and spleen',muscles:'Muscular system','upper-limb':'Upper limb',forearm:'Forearm',wrist:'Wrist',hand:'Detailed hand',fingers:'Fingers',thumb:'Thumb','index-finger':'Index finger','middle-finger':'Middle finger','ring-finger':'Ring finger','little-finger':'Little finger',head:'Full head',neck:'Neck',thorax:'Upper torso',bust:'Head, neck and upper torso'};
export function normalizeVoice(text){return String(text||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();}
const rawKey=text=>String(text||'').toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim();
function target(query,items,names){
  const n=normalizeVoice(query),raw=rawKey(query);if(!n)return null;
  const exact=items.filter(item=>names(item).some(name=>rawKey(name)===raw));
  if(exact.length===1)return exact[0];if(exact.length>1)return null;
  const matches=items.filter(item=>names(item).some(name=>normalizeVoice(name)===n));
  return matches.length===1?matches[0]:null;
}
function labelNames(label){
  const names=[label.label,label.sourceName,label.info,label.latin,label.sourceId].filter(Boolean);
  return [...new Set(names.flatMap(name=>[name,name.replace(/\s*\((trái|phải|left|right)\)\s*$/i,''),name.replace(/^(left|right)\s+/i,'')]))];
}
export function resolveVoiceTarget(query,catalog,labels=[],modelOnly=false){
  const part=!modelOnly&&target(query,labels.map((label,index)=>({...label,index})),labelNames);
  if(part)return {type:'part',index:part.index};
  const model=target(query,catalog,d=>[d.name,...(MODEL_NAMES[d.id]||[])]);
  return model?{type:'model',id:model.id,name:model.name}:null;
}
export const SYSTEM_NAMES={
  muscular:['cơ','hệ cơ','muscle','muscles'],skeletal:['xương','hệ xương','bone','bones','skeleton'],
  connective:['mô liên kết','gân','connective tissue','tendons'],arterial:['động mạch','arteries'],venous:['tĩnh mạch','veins'],
  nervous:['thần kinh','nerves','nervous system'],sensory:['giác quan','sensory'],digestive:['tiêu hóa','digestive'],
  respiratory:['hô hấp','respiratory'],urinary:['tiết niệu','urinary'],reproductive:['sinh dục','reproductive'],
  lymphatic:['bạch huyết','lymphatic'],endocrine:['nội tiết','endocrine'],integumentary:['da','bề mặt cơ thể','skin'],cardiac:['tim','heart'],
};
export function resolveVoiceSystems(query){
  const n=normalizeVoice(query).replace(/^(he |lop |system |layer )/,'');
  if(['mach mau','blood vessels','vessels'].includes(n))return ['arterial','venous'];
  return Object.entries(SYSTEM_NAMES).filter(([,names])=>names.some(name=>normalizeVoice(name)===n)).map(([id])=>id);
}
// No substring scoring: "left" alone, negated instructions and unknown models do nothing.
export function parseCommand(text,catalog,labels=[]){
  const raw=String(text||'').trim().replace(/^(soma\s*(ơi|oi)?\s*|please\s+)/i,'').replace(/\s+(giúp mình|giup minh|please|nhé|nhe)$/i,'').trim();
  const t=normalizeVoice(raw);if(!t)return [];
  if(['dung xoay','ngung xoay','tat xoay','khong xoay','do not rotate','stop rotating','stop rotation'].includes(t))return [{type:'rotate',value:false}];
  const rules=[
    ['stopQuiz',['dung kiem tra','ket thuc kiem tra','stop quiz','end quiz','quit quiz']],
    ['quiz',['kiem tra','do vui','quiz','test me']],
    ['stopRead',['dung doc','tat loa','stop reading','stop speaking','mute']],
    ['describe',['doc','doc chu thich','doc mo ta','giai thich','thuyet minh','day la gi','read','read description','describe','explain','what is this','what is that','tell me']],
    ['micOff',['tat micro','dung nghe','stop listening','microphone off']],
    ['scanCancel',['huy quet','cancel scan']],['scan',['quet','quet lai','quet bo phan','scan','scan again','scan body part']],
    ['cameraOn',['bat camera','camera on','turn on camera']],['cameraOff',['tat camera','camera off','turn off camera']],
    ['explode',['tach lop','tach roi','tach','bung','mo','explode','open','apart','expand']],
    ['assemble',['lap lai','ghep lai','ghep','dong','assemble','close','collapse']],
    ['muscleSplit',['tach tung co','separate muscles']],['systemSplit',['tach cac he','separate systems']],
    ['next',['tiep','ke tiep','mau tiep','mo hinh tiep','next','next model']],['prev',['lui','mau truoc','mo hinh truoc','previous','previous model','go back']],
    ['snap',['goi mo hinh','hien mo hinh','summon','snap']],['dissolve',['an mo hinh','lam tan','dissolve','hide model']],
    ['zoomIn',['phong to','to hon','zoom in','bigger','closer']],['zoomOut',['thu nho','nho hon','zoom out','smaller']],
    ['reset',['dat lai','dat lai goc nhin','reset','reset view']],['front',['phia truoc','mat truoc','front','front view']],
    ['back',['phia sau','mat sau','back view']],['side',['nhin ben','ben','side','side view']],
    ['rotate',['xoay','bat xoay','rotate','spin','start rotating']],
    ['record',['ghi hinh','bat ghi hinh','record','start recording']],['stopRecord',['dung ghi hinh','tat ghi hinh','stop recording']],
    ['cut',['mat cat','bat mat cat','cut','slice','cross section']],['cutOff',['tat mat cat','turn off cross section']],
    ['labelsOn',['bat chu thich','hien chu thich','show labels']],['labelsOff',['tat chu thich','an chu thich','hide labels']],
    ['clear',['bo chon','clear selection']],['pull',['keo ra','pull out']],['putBack',['dat vao','put back']],
    ['showAll',['hien tat ca','xem tat ca','show all','show all layers']],
  ];
  for(const [type,phrases] of rules)if(phrases.includes(t))return [{type,...(type==='rotate'?{value:true}:{})}];
  const manipulation=modelVoiceCommand(raw,catalog,normalizeVoice,resolveVoiceTarget);
  if(manipulation)return [manipulation];
  if(/\b(khong|dung|do not|dont|don t|never)\b/.test(t))return [];
  const layer=t.match(/^(bat lop|hien lop|tat lop|an lop|xem he|chi xem|show layer|hide layer|show system|show only) (.+)$/);
  if(layer){const systems=resolveVoiceSystems(layer[2]);return systems.length?[{type:layer[1].startsWith('tat')||layer[1].startsWith('an')||layer[1].startsWith('hide')?'layerOff':layer[1].includes('only')||layer[1].startsWith('xem')||layer[1].startsWith('chi')?'layerOnly':'layerOn',systems}]:[];}
  // Remove command prefixes from ORIGINAL text, retaining dấu for cổ/cơ and mắt/mặt.
  const query=raw.replace(/^(mở mô hình|mo mo hinh|mở|mo|chọn cấu trúc|chon cau truc|chọn|chon|open model|open the|open|show me the|show me|show the|show|select|pick)\s+/i,'').replace(/\s+model$/i,'');
  const modelOnly=/^(mở|mo|open)\s/i.test(raw);
  const chosen=resolveVoiceTarget(query,catalog,labels,modelOnly);
  return chosen?[chosen]:[];
}

export function readingText(label,model,language='vi',detail='description'){
  if(!label){return {text:language==='en'?(MODEL_EN[model?.id]||model?.name||'No model selected'):(MODEL_NAMES[model?.id]?.[0]||model?.name||'Chưa chọn mô hình'),missing:false};}
  const name=language==='en'?(label.sourceName||label.info||label.label):(label.labelVi||label.label);
  if(detail==='name')return {text:name,missing:false};
  const description=language==='en'?label.descriptionEn:label.description;
  const notes=detail==='group'?(label.learningNotes||[]).map(note=>language==='en'?note.descriptionEn:note.description).filter(Boolean):[];
  return {text:[name,description,...notes.map(note=>(language==='en'?'Anatomical group. ':'Ghi chú nhóm giải phẫu. ')+note)].filter(Boolean).join('. '),missing:!description&&notes.length===0};
}

const CONFIRMATIONS={explode:['Đã tách lớp','Layers separated'],assemble:['Đã lắp lại','Assembled'],next:['Mô hình tiếp theo','Next model'],previous:['Mô hình trước','Previous model'],snap:['Đã hiện mô hình','Model shown'],dissolve:['Đã ẩn mô hình','Model hidden'],quiz:['Bắt đầu kiểm tra','Quiz started'],'stop quiz':['Đã dừng kiểm tra','Quiz stopped'],cut:['Đã bật mặt cắt','Cross section on'],'cut off':['Đã tắt mặt cắt','Cross section off'],'zoom in':['Đã phóng to','Zoomed in'],'zoom out':['Đã thu nhỏ','Zoomed out'],rotate:['Đã bật tự xoay','Auto rotation on'],'stop rotation':['Đã dừng tự xoay','Auto rotation off'],record:['Đang ghi hình','Recording requested'],'stop recording':['Đã dừng ghi hình','Recording stopped'],'stop reading':['Đã dừng đọc','Reading stopped'],'microphone off':['Đã tắt micro','Microphone off'],'camera on':['Đang mở camera','Starting camera'],'camera off':['Đã tắt camera','Camera off'],scan:['Đang quét','Scanning'],'cancel scan':['Đã hủy quét','Scan cancelled'],front:['Góc trước','Front view'],back:['Góc sau','Back view'],side:['Góc bên','Side view'],reset:['Đã đặt lại góc nhìn','View reset'],labelsOn:['Đã bật chú thích','Labels on'],labelsOff:['Đã tắt chú thích','Labels off'],clear:['Đã bỏ chọn','Selection cleared'],pull:['Đã kéo cấu trúc ra','Structure pulled out'],putBack:['Đã đặt cấu trúc vào','Structure put back'],muscleSplit:['Đã tách từng cơ','Muscles separated'],systemSplit:['Đã tách các hệ','Systems separated'],showAll:['Đã hiện tất cả các hệ','All systems shown'],layerOn:['Đã hiện hệ được chọn','Selected systems shown'],layerOff:['Đã ẩn hệ được chọn','Selected systems hidden'],layerOnly:['Chỉ hiện hệ được chọn','Showing only selected systems'],describe:['Đọc cấu trúc được chọn','Reading selected structure']};
export function commandFeedback(done,catalog,labels,language='vi'){
  return done.map(item=>{
    if(item==='preparing')return language==='en'?'Loading the model before applying the command':'Đang tải mô hình để thực hiện lệnh';
    if(item.startsWith('rotateDegrees:')){const degrees=Number(item.split(':')[1]);return language==='en'?`Rotated ${Math.abs(degrees)} degrees ${degrees<0?'left':'right'}`:`Đã xoay ${degrees<0?'trái':'phải'} ${Math.abs(degrees)} độ`;}
    if(CONFIRMATIONS[item])return CONFIRMATIONS[item][language==='en'?1:0];
    const part=labels?.find(label=>label.label===item);if(part)return readingText(part,null,language,'name').text;
    const model=catalog.find(model=>model.name===item);return model?readingText(null,model,language,'name').text:item;
  }).join('. ');
}
