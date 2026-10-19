// Temporary, deterministic UI for the real renderer. No webcam or fake model.
import fs from "node:fs";
fs.writeFileSync(
  "public/__transition-ui-fixture.html",
  `<!doctype html>
<html lang="vi"><meta charset="utf-8"><title>Kiểm thử chuyển mô hình</title>
<style>body{margin:0;background:#171a1d;color:white;font:13px system-ui}header{height:68px;padding:8px 16px;box-sizing:border-box}button{padding:7px 12px}iframe{width:100%;height:calc(100vh - 68px);border:0}output{display:block;margin-top:5px}</style>
<header><button id="init" disabled>Khởi tạo mô hình</button><button id="out" disabled>Tay trái: chuyển mô hình</button><button id="finish" disabled>Hoàn tất chuyển</button><button id="labels" disabled>Kiểm tra chi tiết</button><button id="systems" disabled>Căn hệ nội tiết / hô hấp</button><button id="mobile" disabled>Khung điện thoại</button><output id="result">Kiểm thử mô hình thật, thời gian dựng hình xác định; không dùng camera.</output></header>
<iframe id="scene" src="/wonder/index.html?region=forearm&autostart=nocamera&manual=1&n=5000&dpr=1"></iframe>
<script type="module">
const frame=document.getElementById('scene'),result=document.getElementById('result');
const {project}=await import('/wonder/src/gl/renderer.js');
let api,next;
const check=(value,message)=>{if(!value)throw Error(message);};
const waitShader=async()=>{for(let i=0;i<250&&!api.app.renderer.atlasSurface.ready;i++)await new Promise(resolve=>setTimeout(resolve,20));check(api.app.renderer.atlasSurface.ready,'Biên dịch vật liệu mô hình');};
const bind=(id,action)=>document.getElementById(id).onclick=async()=>{try{result.textContent='Đang kiểm tra…';await action();}catch(error){result.textContent='FAIL: '+error.message;console.error(error);}};
bind('init',async()=>{
 for(let i=0;i<250&&!frame.contentWindow.wonderSnap;i++)await new Promise(resolve=>setTimeout(resolve,20));
 api=frame.contentWindow.wonderSnap;check(api,'Bộ dựng hình đã khởi động');await api.ready();api.select(api.CFG.start,true);await api.advance(.1,null);await waitShader();await api.advance(3,null);
 check(api.app.lastSolidBlend===1&&!api.app.transition.pending,'Mô hình cũ đã hiện đầy đủ');document.getElementById('out').disabled=false;result.textContent='PASS: cẳng tay đã hiện đầy đủ';
});
bind('out',async()=>{
 const previous=api.app.uploaded;next=(previous+1)%api.CATALOG.length;
 api.app.zoom=api.app.zoomTarget=2.13;api.app.zoomGrab={spread:.2,zoom:2.13};api.app.spin=.65;api.app.dragYaw=api.app.dragYawTarget=.3;api.app.cut.on=true;
 api.app.ctl.snap.pressedAt=api.app.t;
 await api.advance(.73,api.synth({pose:'like',handedness:'left'}));
 check(api.app.transition.pending.phase==='out'&&api.app.uploaded===previous,'Không thay mô hình cũ trước khi tan');check(api.app.lastSolidBlend>0&&api.app.lastSolidBlend<1,'Lưới đặc chuyển thành hạt');
 check(api.app.transition.pending.index===next,'Tay trái chọn mô hình tiếp đúng một lần');
 check([...api.app.renderer.readParticles(20)].every(Number.isFinite),'Hạt hữu hạn');document.getElementById('finish').disabled=false;result.textContent='PASS: tay trái phát lệnh chuyển; mô hình cũ tan thành hạt trước khi đổi';
});
bind('finish',async()=>{
 await api.app.store.request(next);await api.advance(.4,null);await waitShader();await api.advance(3,null);
 check(api.app.uploaded===next&&api.app.lastSolidBlend===1&&!api.app.transition.pending,'Gom hạt và hoàn tất mô hình mới');
 check(api.app.zoom===1&&api.app.zoomTarget===1&&api.app.spin===0&&api.app.dragYaw===0&&api.app.pitch===0&&!api.app.zoomGrab&&!api.app.cut.on,'Đổi mô hình trả mọi góc nhìn và phóng đại về mặc định');
 check(api.app.manualExplode===0&&api.app.explode===0&&api.app.sel===-1,'Không mang tách lớp hoặc cấu trúc đã chọn sang mô hình mới');
 document.getElementById('labels').disabled=false;result.textContent='PASS: chuyển bằng tay trái hoàn tất; góc trước, phóng đại 1×, không còn lựa chọn cũ';
});
bind('labels',async()=>{
 const head=api.CATALOG.findIndex(model=>model.id==='head');api.select(head,true);await api.app.store.request(head);await api.advance(.8,null);await waitShader();await api.advance(3,null);
 const app=api.app;check(app.model.labels.find(label=>label.sourceId==='FJ1833').label==='Hồi trán trên (trái)','Tên hồi trán trên đúng nguồn và đúng bên');check(app.model.labels.find(label=>label.sourceId==='FJ1806').label==='Chất trắng bán cầu đại não (phải)','Tên chất trắng đúng nguồn và đúng bên');
 const view=app.$('inspectionView');view.value='system:nervous';view.dispatchEvent(new Event('change'));app.$('selectionScope').value='part';app.$('bOpen').click();await api.advance(1,null);
 check(app.labelHits.length>0&&app.labelPageCount>1,'Nhãn có trang tiếp, không còn bị giới hạn ở 10 tên');
 check(app.$('structureList').querySelectorAll('button').length===144,'Danh sách chứa đầy đủ 144 cấu trúc của hệ');
 check(Math.abs(app.drawScale-app.inspectionFit.scale*app.pulse)<1e-6,'Hệ tách cấu trúc chỉ căn khung một lần, không bị thu nhỏ hai lần');
 app.$('labelsNext').click();await api.advance(.05,null);check(app.labelPage===1&&app.labelHits.length>0,'Chuyển được trang nhãn');
 check(app.labelHits.every(label=>!/(Left|Right|White matter|gyrus|nerve)/.test(label.L.label)),'Không lộ tên Anh trên nhãn Việt');
 const search=app.$('structureSearch');
 for(const term of ['hoi tran tren','superior frontal gyrus','FJ1833']){
  search.value=term;search.dispatchEvent(new Event('input'));
  check(app.$('structureList').querySelectorAll('button').length>0,'Tìm bằng tiếng Việt không dấu, tên nguồn Anh hoặc mã nguồn');
 }
 app.zoom=app.zoomTarget=2.13;app.spin=.5;app.$('structureList').querySelector('button').click();await api.advance(.1,null);
 check(app.model.labels[app.sel].sourceId==='FJ1833'&&app.visiblePicks().size===1&&app.inspectionFit&&app.zoom===1&&app.spin===0,'Chọn đúng cấu trúc nguồn và căn riêng ở góc mặc định');
 app.zoom=app.zoomTarget=2;app.spin=.5;app.$('partSystem').click();await api.advance(.1,null);
 check(app.zoom===1&&app.spin===0&&app.$('systemFocus').value==='-1','Xem riêng hệ từ thẻ cấu trúc cũng đặt lại góc');
 search.value='';search.dispatchEvent(new Event('input'));app.$('bOpen').click();await api.advance(1,null);
 app.$('renderQuality').value='detail';app.$('renderQuality').dispatchEvent(new Event('change'));await api.advance(.05,null);
 check(api.CFG.dpr===2,'Chế độ Chi tiết tăng độ phân giải thực lên 2 lần');
 document.getElementById('systems').disabled=false;result.textContent='PASS: đủ 144 cấu trúc, tìm kiếm và nhiều trang nhãn tiếng Việt trên mô hình thật';
});
bind('systems',async()=>{
 const app=api.app,view=app.$('inspectionView');
 for(const system of ['endocrine','respiratory']){
  app.zoom=app.zoomTarget=2.13;app.spin=.5;view.value='system:'+system;view.dispatchEvent(new Event('change'));await api.advance(.1,null);
  check(app.zoom===1&&app.spin===0&&app.inspectionFit,'Hệ mới khôi phục góc trước và tự căn giữa');
  let width=0,height=0;const lo=[1,1],hi=[-1,-1];
  for(const mesh of app.renderer.atlasSurface.meshes.filter(mesh=>mesh.visible)){
   const bounds=mesh.userData.g.bounds;
   for(const x of [bounds[0][0],bounds[1][0]])for(const y of [bounds[0][1],bounds[1][1]])for(const z of [bounds[0][2],bounds[1][2]]){
    const p=project(app.projView,[x,y,z].map((value,k)=>(value-app.inspectionCenter[k])*app.drawScale));
    check(Math.abs(p[0])<.95&&Math.abs(p[1])<.95,'Toàn bộ hệ nằm trong khung nhìn');
    for(let k=0;k<2;k++){lo[k]=Math.min(lo[k],p[k]);hi[k]=Math.max(hi[k],p[k]);}
   }
  }
  width=hi[0]-lo[0];height=hi[1]-lo[1];check(Math.max(width,height)>.15,'Hệ nhỏ được phóng vừa khung, không thành chấm nhỏ');
 }
 result.textContent='PASS: hệ nội tiết và hô hấp căn giữa, đủ lớn, nằm trọn khung và trở về 1×';
 document.getElementById('mobile').disabled=false;
});
bind('mobile',async()=>{
 frame.style.width='375px';frame.style.height='744px';await new Promise(requestAnimationFrame);
 const app=api.app;app.resize();await api.advance(.1,null);
 const drawer=app.$('panel').getBoundingClientRect();
 for(const mesh of app.renderer.atlasSurface.meshes.filter(mesh=>mesh.visible)){
  const bounds=mesh.userData.g.bounds;
  for(const x of [bounds[0][0],bounds[1][0]])for(const y of [bounds[0][1],bounds[1][1]])for(const z of [bounds[0][2],bounds[1][2]]){
   const p=project(app.projView,[x,y,z].map((value,k)=>(value-app.inspectionCenter[k])*app.drawScale));
   const sx=(p[0]*.5+.5)*375,sy=(.5-p[1]*.5)*744;
   check(sx>12&&sx<363&&sy>65&&sy<drawer.top-8,'Hệ nguồn nằm trọn vùng dựng hình phía trên bảng điều khiển điện thoại');
  }
 }
 result.textContent='PASS: mô hình nguồn nằm trên bảng điều khiển ở khung 375×744';
});
document.getElementById('init').disabled=false;
</script></html>`,
);
console.log("Created temporary public/__transition-ui-fixture.html");
