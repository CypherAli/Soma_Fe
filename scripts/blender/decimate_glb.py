import bpy, sys, os

# GIẢM LƯỚI cho một file .glb đã xuất, GIỮ NGUYÊN TÊN mọi mesh.
#
#   blender --background --python decimate_glb.py -- in.glb out.glb 1500000
#
# Vì sao cần: bốn model dựng từ các script đời đầu (đầu, thân trên, cây động
# mạch, hệ cơ toàn thân) nặng 1,8–2,45 triệu tam giác, vượt ngân sách mà
# `verify:models` đặt ra (1,8 triệu) — máy tích hợp GPU yếu mở lên là giật.
# `export_region.py` có sẵn bước giảm lưới, nhưng bốn file này không đi qua nó.
#
# Chỉ giảm những mesh LỚN: mesh nhỏ (dây chằng, hạch, ống mạch) vốn đã ít mặt,
# giảm nữa là méo hình. Tên mesh không đổi nên mọi `meshName` trong scene và
# mọi hotspot vẫn khớp — chạy `npm run verify:scenes` sau khi giảm để chắc.

args = sys.argv[sys.argv.index('--') + 1:]
SRC, DST = os.path.abspath(args[0]), os.path.abspath(args[1])
BUDGET = int(args[2]) if len(args) > 2 else 1_500_000
SMALL = 1_500          # dưới ngưỡng này thì giữ nguyên

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SRC)

meshes = [o for o in bpy.data.objects if o.type == 'MESH' and len(o.data.polygons)]
tris = {o.name: len(o.data.polygons) for o in meshes}
total = sum(tris.values())
print(f"[decimate] {os.path.basename(SRC)}: {len(meshes)} mesh · {total} tam giác")

if total > BUDGET:
    keep_small = sum(t for t in tris.values() if t <= SMALL)
    big = total - keep_small
    ratio = max(0.10, min(1.0, (BUDGET - keep_small) / big))
    print(f"[decimate] tỉ lệ {ratio:.3f} (giữ nguyên {keep_small} tam giác của mesh nhỏ)")
    for o in meshes:
        if tris[o.name] <= SMALL:
            continue
        mod = o.modifiers.new("soma_dec", 'DECIMATE')
        mod.ratio = ratio
        dg = bpy.context.evaluated_depsgraph_get()
        try:
            me = bpy.data.meshes.new_from_object(o.evaluated_get(dg))
        except Exception:
            o.modifiers.remove(mod)
            continue
        o.modifiers.remove(mod)
        if me and len(me.polygons):
            o.data = me
    after = sum(len(o.data.polygons) for o in meshes)
    print(f"[decimate] còn {after} tam giác")
else:
    print("[decimate] đã dưới ngân sách, không đụng tới")

bpy.ops.object.select_all(action='DESELECT')
for o in meshes:
    o.hide_viewport = False
    try:
        o.hide_set(False)
    except Exception:
        pass
    o.select_set(True)

bpy.ops.export_scene.gltf(filepath=DST, export_format='GLB', use_selection=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_apply=False, export_yup=True)
print("[decimate] DONE ->", DST)
