import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, extname, sep, join } from 'node:path';
import { homedir } from 'node:os';

const require=createRequire(import.meta.url);
let playwright;
for(const candidate of [process.env.PLAYWRIGHT_MODULE,'playwright',join(homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')].filter(Boolean)){
  try{playwright=require(candidate);break;}catch(error){if(error.code!=='MODULE_NOT_FOUND')throw error;}
}
if(!playwright)throw Error('Install Playwright or set PLAYWRIGHT_MODULE');
const root=resolve('public');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.wasm':'application/wasm'};
const server=createServer(async(req,res)=>{
  const file=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!file.startsWith(root+sep)){res.writeHead(403).end();return;}
  try{const data=await readFile(file);res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream'}).end(data);}
  catch{res.writeHead(404).end();}
});
await new Promise(done=>server.listen(0,'127.0.0.1',done));
let browser;
try {
  const chrome=join(process.env.ProgramFiles||'C:/Program Files','Google/Chrome/Application/chrome.exe');
  browser=await playwright.chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||(existsSync(chrome)?chrome:undefined),args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:640,height:400},deviceScaleFactor:1});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/wonder/index.html?manual=1&region=heart&n=5000&lang=vi&dpr=1`);
  await page.waitForFunction(()=>!!window.wonderSnap);
  const result=await page.evaluate(async()=>{
    const api=window.wonderSnap,app=api.app;
    const index=id=>api.CATALOG.findIndex(model=>model.id===id);
    await api.ready();
    api.select(index('heart'),true);
    await api.advance(3.5,null);
    const initial=api.status();

    const rotated=api.command('xoay mô hình tim 30 độ','vi');
    await api.advance(.5,null);
    const rotation=api.status();
    api.voice('tách giải phẫu tim');
    await api.advance(2,null);
    const exploded=api.status();
    api.voice('lắp lại');
    await api.advance(2,null);
    const assembled=api.status();
    api.select(index('lungs'),true);
    await api.advance(1,null);
    api.voice('xoay mô hình tim ba mươi độ');
    await api.advance(4,null);
    const queuedRotation=api.status();
    api.voice('tách giải phẫu cổ tay');
    await api.advance(4,null);
    const queuedExplode=api.status();
    api.voice('xoay tim 90 độ');
    api.select(index('kidney'),true);
    await api.advance(4,null);
    const cancelled=api.status();
    api.select(index('heart'),true);
    await api.advance(4,null);

    document.getElementById('bNext').click();
    const first=api.CATALOG[app.transition.pending.index].id;
    document.getElementById('bNext').click();
    const second=api.CATALOG[app.transition.pending.index].id;
    const began=app.transition.pending.time;
    await api.advance(.2,null);
    api.select(index('lungs'),true);
    const duplicateKeptTime=app.transition.pending.time===began;
    await api.advance(3.5,null);
    const finished=api.status();

    api.select(index('index-finger'),true);
    await api.advance(3.5,null);
    const detail=api.status();

    // Holding a navigation key should produce a single command.
    api.select(index('heart'),true);
    await api.advance(3.5,null);
    dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight'}));
    const keyboardFirst=app.transition.pending.index;
    dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',repeat:true}));
    const keyboardKeptTarget=app.transition.pending.index===keyboardFirst;
    await api.advance(3.5,null);
    return {initial,rotated,rotation,exploded,assembled,queuedRotation,queuedExplode,cancelled,first,second,duplicateKeptTime,finished,detail,keyboardKeptTarget,keyboard:api.status(),pending:app.transition.pending};
  });
  assert.equal(result.initial.state,'formed');
  assert.equal(result.rotated.ok,true);
  assert.match(result.rotated.say,/30/);
  assert.ok(Math.abs(result.rotation.yaw-Math.PI/6)<1e-8,'Named command rotates exactly 30 degrees');
  assert.ok(result.exploded.explode>.99||result.exploded.pullAmt>.99,'Named command separates the model or its single anatomical group');
  assert.ok(result.assembled.explode<.01);
  assert.ok(result.assembled.pullAmt<.01);
  assert.equal(result.queuedRotation.name,'Human Heart');
  assert.ok(Math.abs(result.queuedRotation.yaw-Math.PI/6)<1e-8,'Queued rotation survives model loading/reset');
  assert.equal(result.queuedExplode.name,'Cổ tay');
  assert.ok(result.queuedExplode.explode>.99||result.queuedExplode.pullAmt>.99,'Cold model loading preserves the requested separation');
  assert.equal(result.cancelled.name,'Kidney');
  assert.ok(Math.abs(result.cancelled.yaw)<1e-8,'Selecting another model cancels stale voice commands');
  assert.equal(result.first,'kidney');
  assert.equal(result.second,'lungs','Rapid clicks advance from the requested target');
  assert.equal(result.duplicateKeptTime,true);
  assert.equal(result.finished.name,'Lungs');
  assert.equal(result.finished.state,'formed');
  assert.equal(result.finished.uploaded,result.finished.index);
  assert.equal(result.detail.name,'Ngón trỏ','Individual fingers remain directly selectable');
  assert.equal(result.detail.state,'formed');
  assert.equal(result.keyboardKeptTarget,true);
  assert.equal(result.keyboard.name,'Kidney');
  assert.equal(result.keyboard.state,'formed');
  assert.equal(result.pending,null);
  assert.equal(result.keyboard.modelErrors,0);
  assert.deepEqual(errors,[]);
  console.log('PASS browser: named voice actions, exact degree rotation, cold-load commands, cancellation, rapid next, assembly and held-key suppression');
} finally {
  await browser?.close();
  await new Promise(done=>server.close(done));
}
