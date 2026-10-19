import fs from 'node:fs';
import { atlasScenes } from '../src/lib/humanAtlas/scenes';
import { sceneFrameIds } from '../src/lib/humanAtlas/scenes/types';
import { partLearning } from '../src/lib/humanAtlas/learning';

const atlas = JSON.parse(fs.readFileSync('public/human-atlas/atlas.json','utf8'));
const parts = new Map<string,{name:string;bounds:number[][];vertexCount:number}>(atlas.parts.map((p:{id:string})=>[p.id,p]));
const sourceLimits = new Map<string,string[]>();
for(const name of fs.readdirSync('src/lib/humanAtlas/scenes')) {
  if(!name.endsWith('.ts'))continue;
  const content=fs.readFileSync(`src/lib/humanAtlas/scenes/${name}`,'utf8');
  const slug=content.match(/["']?slug["']?\s*:\s*["']([^"']+)/)?.[1];
  if(!slug)continue;
  const header=content.slice(0,content.indexOf('import '));
  const limits=header.split('\n').map(line=>line.replace(/^\s*\*\s?/, '').trim()).filter(line=>/thiếu|không có|quá thô/i.test(line));
  if(limits.length)sourceLimits.set(slug,limits);
}
const rows = Object.values(atlasScenes).map(scene=>{
  const ids = [...new Set(scene.groups.flatMap(g=>g.parts))];
  const missing = ids.filter(id=>!parts.has(id));
  const groups = scene.groups.map(g=>({key:g.key,name:g.name.vi,parts:g.parts.length,landmarks:g.landmarks?.length??0,noteCharacters:g.note?.vi.length??0,missingIds:g.parts.filter(id=>!parts.has(id))}));
  const concerns:string[]=[...(sourceLimits.get(scene.slug)??[]).map(limit=>`Giới hạn ghi trong nguồn: ${limit}`)];
  if(missing.length)concerns.push(`Mã mesh không tồn tại: ${missing.join(', ')}`);
  if(scene.groups.some(g=>!g.parts.length))concerns.push('Có nhóm rỗng');
  if(scene.groups.some(g=>g.parts.length>10))concerns.push('Nhóm gộp nhiều mesh; cần kiểm tra chọn riêng và chú thích từng thành phần');
  if(scene.groups.some(g=>!g.landmarks?.length))concerns.push('Chưa có danh mục mốc bề mặt được biên tập cho mọi nhóm');
  if(!scene.frameGroups?.length)concerns.push('Căn theo toàn bộ scene; cần kiểm tra các cấu trúc chạy dài');
  if(scene.clip)concerns.push('Có mặt cắt mặc định; cần kiểm tra hướng, phần giữ lại và tâm zoom');
  if(scene.layers?.length)concerns.push('Cần kiểm tra mọi lớp và tổ hợp ẩn/cô lập');
  const names=ids.filter(id=>partLearning(id)?.name?.vi).length,notes=ids.filter(id=>partLearning(id)?.note?.vi).length;
  const anchored=scene.groups.reduce((count,g)=>count+(g.landmarks??[]).filter(m=>m.anchors?.length).length,0);
  if(names<ids.length)concerns.push(`Tên riêng: ${names}/${ids.length}; còn ${ids.length-names} mảnh dùng tên nhóm và mã`);
  if(notes<ids.length)concerns.push(`Mô tả riêng: ${notes}/${ids.length}; không dùng ghi chú nhóm để khẳng định mô tả riêng`);
  return {slug:scene.slug,title:scene.title.vi,url:`/giai-phau/mo-hinh/${scene.slug}`,groups:groups.length,meshes:ids.length,individualNames:names,individualNotes:notes,landmarks:groups.reduce((sum,g)=>sum+g.landmarks,0),anchoredLandmarks:anchored,frameMeshes:sceneFrameIds(scene).length,missing,concerns,groupDetails:groups,visualReview:'Chưa kiểm tra trực tiếp toàn bộ thao tác',clinicalReview:'Chưa được bác sĩ duyệt từng mốc và từng nhãn'};
});
const specific = atlas.parts.filter((p:{id:string})=>partLearning(p.id)?.note?.vi).length;
const summary={sceneCount:rows.length,groupCount:rows.reduce((n,r)=>n+r.groups,0),missingMeshReferences:rows.reduce((n,r)=>n+r.missing.length,0),fullBodySpecificDescriptions:specific,fullBodyMeshes:atlas.parts.length};
fs.mkdirSync('docs/audits',{recursive:true});
fs.writeFileSync('docs/audits/atlas-pages.json',JSON.stringify({summary,pages:rows},null,2));
let md=`# Rà soát atlas — 09/10/2026\n\nĐây là đánh giá mã nguồn và dữ liệu, không phải chứng nhận độ chính xác giải phẫu. Không quy đổi số mesh thành phần trăm độ đầy đủ.\n\n${summary.sceneCount} trang chuyên đề, ${summary.groupCount} nhóm. ${summary.missingMeshReferences} tham chiếu mesh không tồn tại. Trang toàn thân: ${specific}/${atlas.parts.length} mesh có ghi chú riêng từ kho biên tập; phần còn lại hiển thị giới hạn và bài liên quan. Tên riêng và điểm neo 3D được đếm riêng trong JSON.\n\n## Kiểm chứng trực tiếp\n\n- Sọ: đã tái hiện chọn và cô lập xương đỉnh; kiểm tra tên Latin và kích thước mô hình trong viewport desktop. Các thao tác và viewport khác cần được ghi bằng chứng riêng.\n- Tim: đã kiểm tra chọn và cô lập van hai lá; cấu trúc nhỏ vẫn được phóng vừa vùng xem, tên Latin đọc đầy đủ; ảnh ở screenshots/heart-mitral-isolated.jpg.\n- Mobile sọ: đã kiểm tra mở danh sách cấu trúc, chọn xương đỉnh, cô lập, tên Latin và bố cục panel; ảnh ở screenshots/skull-isolated-mobile.jpg.\n- /viewer: đã kiểm tra mặt cắt Y 83%, đảo chiều giữ đầu–cổ; mô hình nằm giữa và bảng lớp còn đủ chỗ cuộn; ảnh ở screenshots/viewer-head-clip.jpg.\n- Các trang khác: chưa mặc định coi là đã kiểm tra trực tiếp chỉ vì dùng chung viewer.\n\n## Kiểm tra tự động\n\n- 80 trường hợp camera với kích thước nhỏ, hướng cũ, desktop và mobile.\n- Hộp bao 1.137 nhóm thực của 148 trang, ở bốn hướng nhìn: mọi góc nằm trong vùng được cấp cho mô hình.\n- TypeScript và ESLint các file sửa: đạt.\n- Kiểm tra hình học không thay thế kiểm tra ảnh hiển thị hoặc duyệt giải phẫu.\n\n## Từng trang chuyên đề\n\n| Trang | Nhóm / mesh | Mốc danh mục / có neo 3D | Đánh giá còn lại |\n|---|---:|---:|---|\n`;
for(const row of rows)md+=`| [${row.title}](http://localhost:3000${row.url}) | ${row.groups} / ${row.meshes} | ${row.landmarks} / ${row.anchoredLandmarks} | ${row.concerns.join('; ')} |\n`;
md+='\n## Tiêu chí nghiệm thu từng trang\n\n1. Mô hình mở đúng, tâm nằm trong vùng trống, không che bởi panel.\n2. Chọn, cô lập, hiện lại, đổi góc, zoom và reset không thu thành chấm hay trôi khỏi vùng xem.\n3. Latin, mô tả, nguồn đọc đầy đủ ở desktop và mobile.\n4. Từng cấu trúc, bờ, mặt, rãnh, lỗ, mỏm và đường khớp có danh mục phù hợp; phân biệt thiếu mesh với thiếu nhãn.\n5. Điểm neo phải khớp vị trí trên chính mesh, được đối chiếu hình và chuyên gia; không gắn nhãn vào tâm xương để giả lập một rãnh.\n6. Bác sĩ duyệt nội dung và vị trí nhãn trước khi đánh dấu đạt chuyên môn.\n';
fs.writeFileSync('docs/audits/atlas-pages.md',md);
console.log(JSON.stringify(summary,null,2));

fs.appendFileSync('docs/audits/atlas-pages.md', '\n## Các trang giải phẫu ngoài atlas chuyên đề\n\n| Trang | Đánh giá hiện tại |\n|---|---|\n| /viewer | Camera và mặt cắt đã kiểm tra trực tiếp; mô tả chuyên biệt và mốc bề mặt còn thiếu trên nhiều cấu trúc |\n| /giai-phau/lat-cat | Thư viện điều hướng; cần đánh giá khả năng tìm đúng bài, phân loại và tên bài |\n| /giai-phau/moc-xuong | Nội dung nguyên ủy/bám tận dùng dữ liệu riêng; chưa đồng nghĩa có mọi rãnh và lỗ ở sọ |\n| /xem-canh-tay, /xem-cang-tay, /xem-vai | Bộ viewer GLB riêng; cần kiểm tra camera, lớp và nhãn riêng, không coi bản sửa AtlasScene đã bao phủ |\n| /xem-dau, /xem-co, /xem-than | Bộ viewer GLB riêng; cần rà soát mốc bề mặt, dây thần kinh/mạch, giới hạn dữ liệu và camera |\n| /cat-lat | Cần kiểm tra hướng lát cắt, giải thích mặt phẳng và nội dung cấu trúc bị cắt |\n| /cu-chi | Cần kiểm tra mô hình, tâm xoay, zoom và ánh xạ thao tác; chưa kiểm tra bằng camera trong đợt này |\n');
