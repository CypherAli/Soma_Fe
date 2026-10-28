import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import { join } from 'node:path';
const require=createRequire(import.meta.url);
const {chromium}=require(join(homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
let debugPage;
try{
 const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'});
 debugPage=page;page.setDefaultTimeout(15000);page.setDefaultNavigationTimeout(90000);
 await page.addInitScript(()=>{
  const qa=window.__speechQA={engines:[],spoken:[],voices:[{lang:'vi-VN',name:'QA Vietnamese'}],utterance:null};
  class Recognition{
   constructor(){qa.engines.push(this);}
   start(){this.onstart?.();}abort(){this.aborted=true;this.onend?.();}
  }
  window.SpeechRecognition=Recognition;window.webkitSpeechRecognition=Recognition;
  window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
  const synth=new EventTarget();synth.getVoices=()=>qa.voices;
  synth.cancel=()=>{qa.utterance?.onend?.();qa.utterance=null;};
  synth.speak=u=>{qa.utterance=u;qa.spoken.push(u.text);u.onstart?.();};
  Object.defineProperty(window,'speechSynthesis',{configurable:true,value:synth});
  qa.emit=(text,final=true)=>qa.engines.at(-1)?.onresult?.({resultIndex:0,results:[{isFinal:final,length:1,0:{transcript:text}}]});
  qa.finish=()=>{const u=qa.utterance;qa.utterance=null;u?.onend?.();};
 });
 let calls=0;
 await page.route('**/api/assistant',route=>{calls++;return route.fulfill({json:{answer:calls===1?'Tim có bốn buồng.':'Gan nằm chủ yếu ở phần trên bên phải ổ bụng.',sources:[],suggestions:[],engine:'ai'}});});
 await page.goto('http://localhost:3000/vi/thu-vien',{timeout:90000});
 await page.getByRole('button',{name:'Hỏi Soma Bot',exact:true}).click({force:true});
 console.log('Opened chatbot');
 const chat=page.locator('.soma-bot');
 await chat.getByRole('button',{name:/Trò chuyện bằng giọng nói/}).click();
 await page.waitForFunction(()=>window.__speechQA.engines.length===1);
 console.log('Continuous microphone ready');
 await page.evaluate(()=>window.__speechQA.emit('Tim có',false));
 assert.equal(calls,0,'Interim speech must not consume a question');
 await page.evaluate(()=>window.__speechQA.emit('Tim có mấy buồng?'));
 console.log('Question sent',calls);
 await page.waitForFunction(()=>window.__speechQA.spoken.length===1);
 assert.equal(calls,1,'Natural questions need no wake word while chat is open');
 assert.ok(await page.evaluate(()=>window.__speechQA.engines[0].aborted),'Microphone pauses before speaking');
 await page.evaluate(()=>window.__speechQA.emit('echo of the answer'));
 assert.equal(calls,1,'Speaker output cannot become a new question');
 await page.evaluate(()=>window.__speechQA.finish());
 await page.waitForFunction(()=>window.__speechQA.engines.length===2);
 await page.evaluate(()=>window.__speechQA.emit('Gan ở đâu?'));
 await page.waitForFunction(()=>window.__speechQA.spoken.length===2);
 assert.equal(calls,2,'Conversation resumes automatically after the answer');
 assert.ok(await chat.getByText('AI + Soma Library',{exact:true}).count()>0);
 await page.evaluate(()=>{window.__speechQA.finish();window.__speechQA.voices=[{lang:'en-US',name:'QA English'}];});
 await page.waitForFunction(()=>window.__speechQA.engines.length===3);
 await chat.getByRole('button',{name:'Đọc câu trả lời',exact:true}).first().click();
 await chat.getByText('Máy này chưa cài giọng đọc tiếng Việt nên mình chưa đọc được.',{exact:true}).waitFor();
 assert.equal(await page.evaluate(()=>window.__speechQA.spoken.length),2,'No wrong-language speech fallback');
 await chat.getByRole('button',{name:/Dừng trò chuyện giọng nói/}).click();
 console.log('PASS voice conversation: interim preview, natural question → one request → spoken answer → listening again, echo suppression, AI label and visible missing-voice error; no paid provider calls.');
}catch(error){if(debugPage){console.log((await debugPage.locator('.soma-bot').innerText()).slice(-2200));console.log(await debugPage.evaluate(()=>({engines:window.__speechQA?.engines.length,spoken:window.__speechQA?.spoken})));}throw error;}finally{await browser.close();}
