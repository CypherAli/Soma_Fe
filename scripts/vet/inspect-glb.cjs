// LIỆT KÊ TÊN MESH / NODE / VẬT LIỆU trong một tệp .glb
//
//   node scripts/vet/inspect-glb.cjs .cache/vet-soft-tissue/<uid>.glb
//
// Dùng để trả lời đúng một câu hỏi: mẫu vật này có tách được bộ phận không.
// Mẫu quét thú y KHÔNG đặt tên mesh (toàn "Object_0"…), nên chỗ duy nhất còn
// nhãn giải phẫu là TÊN VẬT LIỆU. Ra nhiều vật liệu có tên đọc được
// ("default_05b_Liver_1") thì khai vào `parts` ở src/lib/vet/softTissue.ts.
// Ra đúng một vật liệu ("material_0", "Solid", "Scene_-_Root") thì mẫu là khối
// liền thật — để `parts` trống, ĐỪNG bịa bộ phận.
//
// Chạy trên tệp GỐC trong .cache/, không phải tệp đã nén trong public/: tuy
// bước nén đã được cấm gộp vật liệu, đọc bản gốc vẫn là cách chắc chắn nhất.
const { NodeIO } = require("@gltf-transform/core");
const { ALL_EXTENSIONS } = require("@gltf-transform/extensions");
const draco = require("draco3dgltf");

(async () => {
  const file = process.argv[2];
  if (!file) {
    console.error("Dùng: node scripts/vet/inspect-glb.cjs <tệp .glb>");
    process.exit(1);
  }
  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({ "draco3d.decoder": await draco.createDecoderModule() });
  const root = (await io.read(file)).getRoot();
  const names = (list) => list.map((x) => x.getName() || "(không tên)").join(" · ");
  console.log(`mesh ${root.listMeshes().length} · node ${root.listNodes().length}`);
  console.log(`VẬT LIỆU (${root.listMaterials().length}): ${names(root.listMaterials())}`);
  console.log(`MESH: ${names(root.listMeshes()).slice(0, 600)}`);
})();
