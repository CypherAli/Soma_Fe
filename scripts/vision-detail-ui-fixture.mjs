import fs from 'node:fs/promises';
await fs.writeFile('public/__vision-detail-qa.html',`<!doctype html><html lang="vi"><meta charset="utf-8"><title>Kiểm tra Vision: cấu trúc nguồn và holo</title>
<style>body{margin:0;background:#181b1d;color:#eef4f3;font:14px system-ui}header{padding:10px;display:flex;flex-wrap:wrap;gap:8px;align-items:center}button{padding:8px}output{width:100%}iframe{display:block;width:100%;height:calc(100dvh - 108px);border:0}</style>
<header><button id="init">1. Thân trên</button><button id="out" disabled>2. Bắt đầu holo động mạch</button><button id="finish" disabled>3. Hoàn tất holo</button><button id="part" disabled>4. Chọn và tách cấu trúc</button><button id="limb" disabled>5. Toàn bộ chi trên</button><button id="body" disabled>6. Toàn thân</button><button id="muscles" disabled>7. Tách cơ thân trên</button><button id="handoff" disabled>8. Nhớ mô hình</button><output id="result">Kiểm tra mô hình thật, không dùng camera. Đồng hồ kiểm thử xác định.</output></header>
<iframe id="scene" src="/wonder/index.html?lang=vi&region=thorax&manual=1&n=5000&dpr=1"></iframe>
<script type="module">
let api,remembered=null;const frame=document.querySelector('iframe'),result=document.querySelector('output');
window.addEventListener('message',event=>{if(event.source===frame.contentWindow&&event.origin===location.origin&&event.data?.type==='soma-control-model')remembered=event.data.id;});
const check=(value,message)=>{if(!value)throw Error(message);};
const wait=async(test)=>{for(let i=0;i<600&&!test();i++)await new Promise(resolve=>setTimeout(resolve,20));check(test(),'Khởi tạo mô hình');};
const bind=(id,fn)=>document.getElementById(id).onclick=async()=>{try{result.textContent='Đang kiểm tra…';await fn();}catch(e){result.textContent='FAIL: '+e.message;console.error(e);}};
const ready=async()=>{await wait(()=>api.app.renderer.atlasSurface?.ready);await api.advance(3,null);};
const open=async(id)=>{const i=api.CATALOG.findIndex(m=>m.id===id);api.select(i,true);await api.app.store.request(i);await api.advance(.8,null);await ready();};
bind('init',async()=>{await wait(()=>!!frame.contentWindow.wonderSnap);api=frame.contentWindow.wonderSnap;await api.ready();api.enter(api.CATALOG[api.CFG.start].id,null);await api.advance(.1,null);await ready();
 check(api.app.model.labels.length===1062,'Đủ 1062 cấu trúc thân trên');check(api.app.lastSolidBlend===1,'Lưới đặc hiện đầy đủ');
 check(api.app.renderer.atlasSurface.meshes.filter(m=>m.visible).length<20,'Tổng quan vẫn gộp các khối hệ');document.getElementById('out').disabled=false;document.getElementById('handoff').disabled=false;document.getElementById('muscles').disabled=false;result.textContent='PASS: thân trên có 1062 cấu trúc, tổng quan dưới 20 khối hệ đang vẽ';});
bind('out',async()=>{const app=api.app;app.spin=.3;app.$('inspectionView').value='system:arterial';app.$('inspectionView').dispatchEvent(new Event('change'));await api.advance(.2,null);
 check(app.inspectionTransition.pending?.phase==='out','Có pha holo đi ra');check(app.$('inspectionView').value==='all','Giữ phần cũ cho tới khi tan');check(app.lastSolidBlend>0&&app.lastSolidBlend<1,'Lưới tan dần thành hạt');check(app.spin===.3,'Giữ góc xoay');document.getElementById('finish').disabled=false;result.textContent='PASS: lớp cũ đang tan thành hạt, chưa đổi hệ, giữ nguyên góc xoay';});
bind('finish',async()=>{await api.advance(1.4,null);const app=api.app;check(!app.inspectionTransition.pending&&app.lastSolidBlend===1,'Holo lắp lại hoàn tất');check(app.$('inspectionView').value==='system:arterial','Đúng hệ động mạch');check(Number(app.$('structureCount').textContent)>100,'Có chi tiết từng mạch');check(app.spin===.3,'Góc xoay không nhảy');document.getElementById('part').disabled=false;result.textContent='PASS: holo hoàn tất, '+app.$('structureCount').textContent+' động mạch chọn riêng được';});
bind('part',async()=>{const app=api.app;const first=[...app.visiblePicks()][0];app.$('systemFocus').value=String(first);app.$('systemFocus').dispatchEvent(new Event('change'));await api.advance(1.4,null);
 check(app.sel===first,'Chọn đúng mảnh nguồn');check(app.renderer.atlasSurface.meshes.filter(m=>m.visible).every(m=>m.userData.g.pick===first),'Chỉ hiện cấu trúc đã chọn');
 app.$('systemFocus').value='-1';app.$('systemFocus').dispatchEvent(new Event('change'));await api.advance(1.4,null);app.splitSelected();await api.advance(.5,null);check(app.selection?.ids.size>100,'Tách các cấu trúc của hệ đang xem');
 app.$('partCard').scrollIntoView({block:'end'});await api.advance(.1,null);const column=app.$('partCard').parentElement;
 check(column.scrollWidth<=column.clientWidth+1,'Thanh công cụ không bị cắt ngang');check(app.$('partCard').getBoundingClientRect().bottom<=frame.clientHeight+1,'Cuộn tới cuối thẻ cấu trúc');
 document.getElementById('limb').disabled=false;result.textContent='PASS: chọn đúng mạch, tách '+app.selection.ids.size+' cấu trúc, đọc được toàn bộ thẻ';});
bind('limb',async()=>{await open('upper-limb');const app=api.app;const names=app.model.labels.map(l=>l.sourceName||l.info);for(const name of ['Left clavicle','Left scapula','Left humerus','Left radius','Left ulna'])check(names.includes(name),'Có '+name);
 check(names.filter(n=>/phalanx/.test(n)).length===14,'Đủ 14 đốt ngón');check(!names.some(n=>/iliotibial|fasciae latae/.test(n)),'Không lọt cấu trúc đùi');document.getElementById('body').disabled=false;result.textContent='PASS: chi trên trái có đai vai, cánh tay, cẳng tay và đủ 14 đốt ngón';});
bind('body',async()=>{await open('body');check(api.app.model.labels.length===2234,'Toàn thân có 2234 cấu trúc');check(api.app.model.def.id==='body','Toàn thân không mở cánh tay');result.textContent='PASS: toàn thân độc lập có 2234 cấu trúc nguồn';});
bind('muscles',async()=>{if(api.app.model.def.id!=='thorax')await open('thorax');const app=api.app;
 app.$('separationMode').value='muscles';app.$('separationMode').dispatchEvent(new Event('change'));await api.advance(2,null);
 check(app.model.surface.individualSystems.includes('muscular'),'Tách theo cơ nguồn');
 const meshes=app.renderer.atlasSurface.meshes.filter(mesh=>mesh.visible);check(meshes.length>50&&meshes.every(mesh=>!mesh.userData.overview),'Bỏ gộp lệnh vẽ khi tách từng cơ');
 const seen=new Map();for(const mesh of meshes){const g=mesh.userData.g;if(seen.has(g.pick))check(JSON.stringify(g.offset)===JSON.stringify(seen.get(g.pick)),'Giữ mặt cắt cùng cơ');seen.set(g.pick,g.offset);}
 result.textContent='PASS: tách '+seen.size+' cơ thân trên, mặt cắt đi cùng cấu trúc gốc';
});
bind('handoff',async()=>{await open('upper-limb');await wait(()=>remembered==='upper-limb');
 const wanted=remembered;api.enter(wanted,null);await api.advance(.1,null);check(api.app.model.def.id===wanted,'Kết nối lại giữ mô hình chi trên');
 const loaded=new Promise(resolve=>frame.onload=resolve);frame.contentWindow.location.reload();await loaded;await wait(()=>!!frame.contentWindow.wonderSnap);api=frame.contentWindow.wonderSnap;
 check(remembered===wanted,'Khởi động iframe không ghi đè lựa chọn cha');api.enter(remembered,null);await api.app.store.request(api.CATALOG.findIndex(model=>model.id===wanted));await api.advance(.8,null);await ready();
 check(api.app.model.def.id===wanted,'Tải lại iframe vẫn mở mô hình đã chọn');result.textContent='PASS: cha nhớ chi trên; kết nối lại và tải lại iframe không đưa về cẳng tay';
});
</script></html>`);
console.log('Created temporary public/__vision-detail-qa.html');
