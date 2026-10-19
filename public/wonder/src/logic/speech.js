export class Voice {
  constructor(onText,{language='vi',onState=()=>{},onError=()=>{}}={}){
    this.SR=globalThis.window?.SpeechRecognition||globalThis.window?.webkitSpeechRecognition||null;
    this.supported=!!this.SR;this.onText=onText;this.onState=onState;this.onError=onError;
    this.language=language;this.on=false;this.rec=null;this.pauses=new Set();this.last='';this.timer=null;this.startTimer=null;
  }
  start(language=this.language){
    this.stop();this.language=language;
    if(!this.SR){this.onState('unsupported');return false;}
    let rec;try{rec=new this.SR();}catch{this.onState('error');this.onError('start-failed');return false;}this.rec=rec;this.on=true;
    rec.continuous=true;rec.interimResults=false;rec.maxAlternatives=3;rec.lang=language==='en'?'en-US':'vi-VN';
    rec.onstart=()=>{if(this.rec===rec&&this.on){clearTimeout(this.startTimer);this.onState(this.pauses.size?'paused':'listening');}};
    rec.onresult=e=>{
      if(this.rec!==rec||!this.on||this.pauses.size)return;
      for(let i=e.resultIndex??0;i<e.results.length;i++){const r=e.results[i];if(r.isFinal===false)continue;this.last=r[0].transcript;this.onText(this.last);}
    };
    rec.onerror=e=>{if(this.rec!==rec||!this.on)return;if(e.error==='aborted')return;
      if(e.error==='no-speech')return;
      this.on=false;clearTimeout(this.timer);clearTimeout(this.startTimer);try{rec.abort();}catch{}this.onState('error');this.onError(e.error||'failed');
    };
    rec.onend=()=>{
      if(this.rec!==rec||!this.on)return;clearTimeout(this.startTimer);
      if(this.pauses.size){this.onState('paused');return;}
      clearTimeout(this.timer);this.timer=setTimeout(()=>{if(this.rec===rec&&this.on&&!this.pauses.size)this.begin(rec);},350);
    };
    if(this.pauses.size){this.onState('paused');return true;}return this.begin(rec);
  }
  begin(rec){clearTimeout(this.startTimer);this.startTimer=setTimeout(()=>{if(this.on&&this.rec===rec&&!this.pauses.size){this.on=false;clearTimeout(this.timer);try{rec.abort();}catch{}this.onState('error');this.onError('start-timeout');}},10000);try{this.onState('starting');rec.start();return true;}catch{clearTimeout(this.startTimer);this.on=false;this.onState('error');this.onError('start-failed');return false;}}
  stop(){this.on=false;clearTimeout(this.timer);clearTimeout(this.startTimer);const rec=this.rec;this.rec=null;try{rec?.abort();}catch{}this.onState('off');}
  pause(reason='speech'){this.pauses.add(reason);clearTimeout(this.startTimer);if(this.on){try{this.rec?.abort();}catch{}this.onState('paused');}}
  resume(reason='speech'){
    const paused=this.pauses.delete(reason);if(!paused||!this.on||this.pauses.size||!this.rec)return;
    clearTimeout(this.timer);const rec=this.rec;this.timer=setTimeout(()=>{if(this.on&&this.rec===rec&&!this.pauses.size)this.begin(rec);},350);
  }
  setLanguage(language){if(this.language===language)return;const active=this.on;this.language=language;if(active)this.start(language);}
  dispose(){this.stop();this.pauses.clear();}
}

export class Speaker {
  constructor({voice=null,onState=()=>{},onError=()=>{}}={}){this.voice=voice;this.onState=onState;this.onError=onError;this.serial=0;this.finish=null;this.waitCancel=null;}
  stop(){this.serial++;this.waitCancel?.();this.waitCancel=null;if(this.finish)globalThis.window?.speechSynthesis?.cancel();this.finish?.();this.finish=null;this.voice?.resume('speech');this.onState('off');}
  async voices(){
    const synth=window.speechSynthesis,ready=synth.getVoices();if(ready.length)return ready;
    return new Promise(resolve=>{
      let timer;const done=()=>{clearTimeout(timer);synth.removeEventListener('voiceschanged',done);this.waitCancel=null;resolve(synth.getVoices());};
      synth.addEventListener('voiceschanged',done);timer=setTimeout(done,1500);this.waitCancel=done;
    });
  }
  async speak(text,{language='vi'}={}){
    this.stop();const serial=this.serial;
    if(!globalThis.window?.speechSynthesis||typeof SpeechSynthesisUtterance==='undefined'){this.onError('unsupported');return false;}
    this.onState('loading');const voices=await this.voices();if(serial!==this.serial)return false;
    const lang=language==='en'?'en-US':'vi-VN',prefix=lang.slice(0,2);
    const selected=voices.find(v=>v.lang.replace('_','-').toLowerCase()===lang.toLowerCase())||voices.find(v=>v.lang.toLowerCase().startsWith(prefix));
    if(!selected){this.onState('off');this.onError('missing-'+prefix);return false;}
    const utterance=new SpeechSynthesisUtterance(text);utterance.lang=selected.lang;utterance.voice=selected;utterance.rate=language==='vi'?.94:1;utterance.pitch=1;
    this.voice?.pause('speech');this.onState('speaking');
    let done=false;const finish=()=>{if(done)return;done=true;if(serial!==this.serial)return;this.finish=null;this.voice?.resume('speech');this.onState('off');};
    this.finish=finish;utterance.onend=finish;utterance.onerror=e=>{finish();if(serial===this.serial)this.onError(e.error||'speech-failed');};
    try{window.speechSynthesis.speak(utterance);return true;}catch{finish();this.onError('speech-failed');return false;}
  }
}
let defaultSpeaker;
export function speak(text,options){defaultSpeaker??=new Speaker();return defaultSpeaker.speak(text,options);}
