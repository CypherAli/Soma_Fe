// Generate a temporary visual QA page using the real scan markup, CSS and module.
// Run from Soma_Fe, then open /__scan-ui-fixture.html. Remove the generated file after QA.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const source = fs.readFileSync('public/wonder/index.html', 'utf8');
const start = source.indexOf('    <div id="cameraPreview"');
const end = source.indexOf('    <div class="icons"', start);
assert.ok(start >= 0 && end > start, 'real camera markup must be available');
const markup = source.slice(start, end);
fs.writeFileSync('public/__scan-ui-fixture.html', `<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Scan UI QA · dữ liệu mô phỏng</title><link rel="stylesheet" href="/wonder/styles.css?v=20261008-scan"><style>.qa{position:fixed;left:12px;top:12px;z-index:20;font-size:12px}.qa button{padding:6px;margin:3px;background:#202327;border:1px solid #666;border-radius:5px}.qa p{max-width:180px}@media(max-width:600px){.qa{top:auto;bottom:0}.qa p{display:none}.qa button{padding:3px;font-size:10px}}</style><div class="qa"><p>Kiểm thử bố cục bằng dữ liệu mô phỏng. Không phải camera thật.</p><button id="qaHand">Một tay</button><button id="qaFrame">Hai tay</button><button id="qaFull">Toàn khung</button><button id="qaBusy">Đang xử lý</button><button id="qaResults">Kết quả</button><button id="qaError">Ảnh mờ</button><output id="qaSelected"></output></div><div class="top-right">${markup}</div><script type="module">
import {ScanPanel} from '/wonder/src/lib/scan-panel.js';
const root=document.getElementById('cameraPreview');
const panel=new ScanPanel(root,{onStart:()=>show('hand'),onCancel:()=>panel.close(),onSelect:id=>{document.getElementById('qaSelected').textContent='Đã chọn '+id;panel.close();}});
panel.camera(true);root.classList.add('live');document.getElementById('cameraStatus').textContent='Camera mô phỏng · kiểm thử UI';
const canvas=document.getElementById('cameraCanvas');canvas.width=640;canvas.height=360;
const ctx=canvas.getContext('2d');ctx.fillStyle='#30383d';ctx.fillRect(0,0,640,360);ctx.strokeStyle='#536469';
for(let x=0;x<640;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,360);ctx.stroke();}
for(let y=0;y<360;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(640,y);ctx.stroke();}
ctx.strokeStyle='#5ed5bb';ctx.lineWidth=3;ctx.strokeRect(180,65,280,230);
const catalog=[{id:'arm'},{id:'wrist'},{id:'hand'}];
function show(mode,phase='locking'){panel.begin();panel.frame({mode,phase,progress:.65,box:{x:0,y:0,w:1,h:1}});}
document.getElementById('qaHand').onclick=()=>show('hand');document.getElementById('qaFrame').onclick=()=>show('frame');document.getElementById('qaFull').onclick=()=>show('none','framing');document.getElementById('qaBusy').onclick=()=>show('hand','busy');
document.getElementById('qaResults').onclick=()=>panel.result({shot:canvas.toDataURL(),rows:[{id:'arm',name:'Cánh tay · khớp rõ'},{id:'wrist',name:'Cổ tay · có thể'},{id:'hand',name:'Bàn tay chi tiết · gợi ý'}]},catalog);
document.getElementById('qaError').onclick=()=>panel.result({shot:canvas.toDataURL(),error:'Ảnh mờ: giữ yên và tránh đưa quá sát camera.'},catalog);
show('hand');
</script></html>`);
console.log('Created public/__scan-ui-fixture.html (temporary QA page)');
