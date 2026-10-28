import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { seedPathologies } from '../../soma_be/prisma/data/pathologies.ts';
import { seedContent } from '../../soma_be/prisma/data/pathology-content.ts';

const require=createRequire(import.meta.url);
const playwright=require(process.env.PLAYWRIGHT_MODULE||join(homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const base=process.env.SOMA_QA_URL||'http://localhost:3000';
const output=join(process.cwd(),'.cache','vision-summary-qa');await mkdir(output,{recursive:true});
const browser=await playwright.chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const watchdog=setTimeout(()=>void browser.close(),180000);
try{
 const page=await browser.newPage({viewport:{width:1280,height:800},deviceScaleFactor:1,locale:'vi-VN'});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(base+'/wonder/index.html?manual=1&region=head&autostart=nocamera&n=5000&dpr=1');
 await page.waitForFunction(()=>!!window.wonderSnap);
 console.log('Vision page loaded');
 await page.evaluate(async()=>{const api=window.wonderSnap;await api.ready();api.select(api.CATALOG.findIndex(model=>model.id==='head'),true);await api.advance(4,null);});
 await page.waitForFunction(()=>window.wonderSnap.app.renderer.atlasSurface?.ready);
 console.log('Head surface compiled');
 await page.selectOption('#inspectionView','system:nervous');
 await page.evaluate(async()=>{await window.wonderSnap.advance(4,null);});
 await page.click('#splitParts');
 await page.evaluate(async()=>{await window.wonderSnap.advance(2,null);});
 const first=await page.evaluate(()=>{const a=window.wonderSnap.app;return {count:a.selection.ids.size,visible:[...a.selection.layout.visible],pages:a.selection.layout.pageCount,labels:a.labelHits.length,amount:a.pullAmt};});
 console.log('Split state',first);
 assert.ok(first.count>100,'Replay the dense nervous system from the reported screenshot');
 assert.equal(first.visible.length,20);assert.ok(first.pages>1);assert.ok(first.labels<=6);assert.ok(first.amount>.99);
 assert.equal(await page.locator('#structurePager').isVisible(),true);
 const seen=new Set(first.visible);
 for(let i=1;i<first.pages;i++){
  await page.click('#structuresNext');
  await page.evaluate(async()=>{await window.wonderSnap.advance(.25,null);});
  const visible=await page.evaluate(()=>[...window.wonderSnap.app.selection.layout.visible]);
  for(const pick of visible){assert.ok(!seen.has(pick));seen.add(pick);}
 }
 assert.equal(seen.size,first.count,'All original anatomy remains accessible');
 assert.equal(await page.locator('#structuresNext').isDisabled(),true);
 await page.evaluate(async()=>{const a=window.wonderSnap.app;a.layoutSelection(0);a.renderer.setSelection(a.selection.ids,a.sel,a.selection.layout);await window.wonderSnap.advance(.3,null);});
 const before=await page.evaluate(()=>({zoom:window.wonderSnap.app.zoom,split:window.wonderSnap.app.partSeparation.target}));
 await page.mouse.move(850,480);await page.mouse.wheel(0,-80);
 await page.evaluate(async()=>{await window.wonderSnap.advance(.8,null);});
 const after=await page.evaluate(()=>({zoom:window.wonderSnap.app.zoom,split:window.wonderSnap.app.partSeparation.target}));
 assert.ok(after.zoom>before.zoom);assert.equal(after.split,before.split,'Ordinary wheel zoom must not alter separation');
 await page.evaluate(async()=>{const a=window.wonderSnap;a.app.handYaw.reset();await a.advance(.5,a.synth({pose:'open',angle:0}));});
 const yawBefore=await page.evaluate(()=>window.wonderSnap.status().yaw);
 await page.mouse.move(800,500);await page.mouse.down();await page.mouse.move(1060,500,{steps:12});
 await page.evaluate(async()=>{const a=window.wonderSnap;await a.advance(.5,a.synth({pose:'open',angle:.5}));});
 const dragging=await page.evaluate(()=>window.wonderSnap.status());
 assert.equal(dragging.handRotating,false);assert.ok(dragging.yaw-yawBefore>.7);
 await page.mouse.up();
 await page.evaluate(async()=>{const a=window.wonderSnap;await a.advance(2,a.synth({pose:'open',angle:0}));});
 const held=await page.evaluate(()=>window.wonderSnap.status().yaw);
 await page.evaluate(async()=>{const a=window.wonderSnap;await a.advance(1,a.synth({pose:'open',angle:0}));});
 assert.ok(Math.abs(await page.evaluate(()=>window.wonderSnap.status().yaw)-held)<.01,'A neutral hand cannot reset a mouse rotation');
 await page.click('#viewFront');await page.evaluate(async()=>{await window.wonderSnap.advance(.3,null);});
 await page.screenshot({path:join(output,'vision-separated.png')});
 await page.click('#splitParts');await page.evaluate(async()=>{await window.wonderSnap.advance(2,null);});
 assert.ok(await page.evaluate(()=>window.wonderSnap.app.pullAmt)<.001);
 assert.equal(await page.locator('#structurePager').isVisible(),false);
 console.log('PASS browser: nervous-system pages, all structures reachable, six labels, wheel zoom, mouse priority over hands, neutral reacquisition and reassembly');

 const motion=await page.evaluate(async()=>{
  const api=window.wonderSnap,a=api.app;a.resetPose();a.manualViewUntil=0;a.handSource=null;a.handSource2=null;
  const initialSelection=a.sel;
  for(let i=0;i<18;i++){
   const spread=.3+Math.min(i,10)*.025;
   a.ctl.onHands([api.synth({pose:'pinch',cx:.5-spread/2}),api.synth({pose:'pinch',cx:.5+spread/2})],a.t);
   await api.advance(.1);
  }
  const zoom=api.status().zoom,selected=a.sel;
  await api.advance(.6,api.synth({pose:'open',cy:.5,angle:0}));
  await api.advance(.8,api.synth({pose:'open',cy:.65,angle:.5}));
  return {zoom,selected,initialSelection,yaw:api.status().yaw,pitch:api.status().pitch};
 });
 assert.ok(motion.zoom>1.65,'Two pinched hands must zoom at 10 Hz');
 assert.equal(motion.selected,motion.initialSelection,'Zoom cannot trigger selection or separation');
 assert.ok(motion.yaw>.6&&motion.pitch>.25,'WonderSnap wrist yaw and vertical tilt both respond');
 console.log('PASS real 3D motion: two-hand pinch at 10 Hz, no selection interference, relative wrist yaw and vertical tilt',motion);
 await page.click('#viewFront');
 await page.evaluate(async()=>{await window.wonderSnap.advance(.4,window.wonderSnap.synth({pose:'open',cy:.65,angle:.5}));});
 assert.ok(Math.abs(await page.evaluate(()=>window.wonderSnap.status().pitch))<.001,'Preset view rebases the vertical hand grab');

 const records=seedPathologies.map((record,index)=>({...record,id:'qa-'+index,structure:null,content:seedContent.filter(content=>content.slug===record.slug)}));
 const record=records.find(record=>record.slug==='viem-khop-phan-ung');assert.ok(record?.content.length);
 await page.route('**/pathologies',route=>route.fulfill({json:records,headers:{'access-control-allow-origin':'*'}}));
 let requests=0;
 await page.route('**/api/pathology-chat',route=>{requests++;return route.fulfill({json:{answer:'**Tiêu đề**\n\n* Mục thứ nhất\n* Mục thứ hai',sources:[],engine:'lookup'}});});
 await page.goto(base+'/vi/benh-ly?open='+record.slug,{timeout:90000});
 const dialog=page.getByRole('dialog');await dialog.waitFor({timeout:60000});
 const assistant=dialog.locator('.pth-ai');
 const summary=dialog.locator('.pth-summary');
 assert.ok((await summary.locator(':scope > .pth-summary-points').innerText()).length<=700);
 assert.equal(await summary.locator(':scope > .pth-summary-points > div').count(),3);
 assert.equal(await dialog.locator('.pth-full-article').getAttribute('open'),null);
 console.log('Article assistant loaded:',await assistant.locator('h3').innerText());
 await assistant.getByRole('button',{name:'Đọc tóm tắt có sẵn'}).click();
 assert.ok((await assistant.locator('.pth-ai-answer').innerText()).length<900);
 for(const question of ['tóm tắt bài viết','tom tat','Tóm lược','summary','summarize this article','summarise','recap','TL;DR','main points']){
  await assistant.locator('input').fill(question);await assistant.locator('button[type=submit]').click();
  await assistant.locator('.pth-ai-note').waitFor();
  assert.ok((await assistant.locator('.pth-ai-answer').innerText()).length<900);
 }
 assert.equal(requests,0,'Every summary action uses already loaded article fields without network');
 await dialog.evaluate(element=>{element.scrollTop=0;});
 await page.screenshot({path:join(output,'pathology-summary.png')});
 await assistant.locator('input').fill('Tiêu chuẩn chẩn đoán?');await assistant.locator('button[type=submit]').click();
 await page.waitForFunction(()=>document.querySelector('.pth-ai-answer')?.textContent.includes('Mục thứ hai'));
 assert.equal(requests,1,'Other intentional questions retain their existing lookup');
 assert.equal(await assistant.locator('.pth-ai-answer ul li').count(),2);
 assert.equal(await assistant.locator('.pth-ai-answer strong').innerText(),'Tiêu đề');
 assert.ok(!(await assistant.locator('.pth-ai-answer').innerText()).includes('*'));
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:join(output,'pathology-mobile.png')});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile page must not overflow horizontally');
 assert.deepEqual(errors,[]);
 console.log('PASS browser: prepared summaries in VI/EN, zero summary API requests, normal questions preserved, semantic Markdown rendering, desktop and mobile layouts');
 console.log('Screenshots: '+output);
}finally{clearTimeout(watchdog);await browser.close();}
