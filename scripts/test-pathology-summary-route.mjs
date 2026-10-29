import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';

const hook=registerHooks({resolve(specifier,context,next){return next(specifier==='next/server'?'next/server.js':specifier,context);}});
const { POST }=await import('../src/app/api/pathology-chat/route.ts');
const previous=process.env.AI_API_KEY,originalFetch=globalThis.fetch;
process.env.AI_API_KEY='test-only-never-send';
const record={id:'local',slug:'local',nameVi:'Bài thử',nameEn:'Test article',nameZh:'测试',source:'Stored source',sourcePage:221,content:[{locale:'vi',description:'Nội dung có sẵn để kiểm tra luồng dữ liệu.'}]};
let calls=[];
globalThis.fetch=async url=>{calls.push(String(url));assert.ok(String(url).includes('/pathologies'),'A summary must never call an AI provider');return Response.json([record]);};
try{
 for(const mode of ['ask','disease','symptoms'])for(const question of ['tóm tắt bài viết Bài thử','summarize Test article','summary Test article','tom tat Bai thu','recap Test article']){
  calls=[];
  const response=await POST(new Request('http://localhost/api/pathology-chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({question,mode,slug:mode==='disease'?'local':undefined,locale:'vi'})}));
  const result=await response.json();
  assert.equal(response.status,200);assert.equal(result.engine,'prepared-summary');
  assert.ok(result.answer.includes(record.content[0].description));
  assert.equal(calls.length,1,'Only stored pathology data is read; no LLM call');
 }
 globalThis.fetch=async()=>{throw new Error('Unavailable');};
 const response=await POST(new Request('http://localhost/api/pathology-chat',{method:'POST',body:JSON.stringify({question:'summary',mode:'disease',slug:'missing'})}));
 assert.equal((await response.json()).engine,'prepared-summary','Missing source data must not fall through to a paid model');
 console.log('PASS summary route: Vietnamese/English in all three modes, AI key configured, no provider calls, missing-data guard');
}finally{globalThis.fetch=originalFetch;if(previous===undefined)delete process.env.AI_API_KEY;else process.env.AI_API_KEY=previous;hook.deregister();}
