import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
const hook=registerHooks({resolve(specifier,context,next){return next(specifier==='next/server'?'next/server.js':specifier,context);}});
const { reserveAssistantQuestion }=await import('../src/lib/assistantQuota.ts');
const { POST }=await import('../src/app/api/assistant/route.ts');
const original=globalThis.fetch,previous=process.env.AI_API_KEY;process.env.AI_API_KEY='never-send-test-only';
let calls=[];
const request=()=>new Request('http://localhost/api/assistant',{method:'POST',headers:{Authorization:'Bearer qa-token','content-type':'application/json'},body:JSON.stringify({question:'Tim có mấy buồng?',locale:'vi'})});
try{
 globalThis.fetch=async url=>{calls.push(String(url));throw Error('Unexpected network');};
 const guest=await reserveAssistantQuestion(new Request('http://localhost'),'vi');assert.equal(guest.status,401);assert.equal(calls.length,0);
 globalThis.fetch=async (url,options)=>{calls.push(String(url));assert.ok(String(url).endsWith('/membership/consume'),'Quota must stop processing before any AI request');assert.equal(options.headers.Authorization,'Bearer qa-token');return Response.json({remaining:0,limit:10,resetsAt:'2026-10-31T17:00:00Z'},{status:429});};
 const response=await POST(request());assert.equal(response.status,429);const data=await response.json();assert.equal(data.code,'MONTHLY_QUOTA_EXCEEDED');assert.equal(data.limit,10);assert.equal(calls.length,1);
 globalThis.fetch=async()=>Response.json({remaining:29,limit:30});
 assert.equal(await reserveAssistantQuestion(request(),'en'),null);
 globalThis.fetch=async()=>{throw Error('Offline');};
 assert.equal((await reserveAssistantQuestion(request(),'vi')).status,503,'An unavailable quota service cannot open the paid AI boundary');
 console.log('PASS quota boundary: login required, authenticated backend consumption, exhausted quota blocks before classifier/LLM, Premium accepted, backend failure closed');
}finally{globalThis.fetch=original;if(previous===undefined)delete process.env.AI_API_KEY;else process.env.AI_API_KEY=previous;hook.deregister();}
