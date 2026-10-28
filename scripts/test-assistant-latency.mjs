import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
const hook=registerHooks({resolve(specifier,context,next){return next(specifier==='next/server'?'next/server.js':specifier,context);}});
const { POST }=await import('../src/app/api/assistant/route.ts');
const original=globalThis.fetch;
const previous={ AI_API_KEY:process.env.AI_API_KEY, AI_PROVIDER:process.env.AI_PROVIDER, AI_BASE_URL:process.env.AI_BASE_URL };
Object.assign(process.env,{AI_API_KEY:'test-only-never-transmitted',AI_PROVIDER:'openai',AI_BASE_URL:'https://fixture.invalid'});
try {
 for(const [question,locale,voice] of [['Tim có mấy buồng?','vi',true],['How many bones are in the human body?','en',true],['Gan nằm ở đâu?','vi',false]]) {
  const calls=[];
  globalThis.fetch=async(url,options)=>{
   if(String(url).endsWith('/membership/consume')) {calls.push('quota');return Response.json({remaining:29,limit:30});}
   if(String(url).startsWith('https://fixture.invalid/')) {
    const body=JSON.parse(options.body);calls.push('answer');
    assert.equal(body.max_tokens,voice?550:900);
    return Response.json({choices:[{message:{content:locale==='en'?'The adult human body has 206 bones [1].':'Câu trả lời thử nghiệm có dẫn nguồn [1].'}}]});
   }
   return Response.json([]);
  };
  const response=await POST(new Request('http://localhost/api/assistant',{method:'POST',headers:{Authorization:'Bearer qa-token','content-type':'application/json'},body:JSON.stringify({question,locale,voice})}));
  assert.equal(response.status,200);
  assert.equal((await response.json()).engine,'ai');
  assert.deepEqual(calls,['quota','answer'],'One grounded answer call, after the normal quota check; no classifier call');
 }
 console.log('PASS latency path: clear VI/EN questions use one answer call instead of two sequential model calls; voice token budget 550, text 900; quota remains first and citations required. No paid API calls.');
} finally {
 globalThis.fetch=original;
 for(const [key,value] of Object.entries(previous)){if(value===undefined)delete process.env[key];else process.env[key]=value;}
 hook.deregister();
}
