import bpy, sys, os, glob, json
from mathutils import Vector

# BÙ ĐOẠN RUỘT THIẾU TỪ BODYPARTS3D.
#
# Z-Anatomy (Startup.blend) KHÔNG có hồi tràng, manh tràng, trực tràng — ruột
# đứt đoạn giữa hỗng tràng và đại tràng lên. BodyParts3D (CC BY-SA 2.1 JP, cùng
# nguồn gốc mà Z-Anatomy dẫn xuất ra) có đủ, nên lấy từ đó.
#
# CĂN KHỚP — đo trên 4 tạng có ở CẢ HAI nguồn (dạ dày, gan, tá tràng, đại tràng
# lên), không chỉnh tay:
#     tỉ lệ  ≈ 1:1 (chỉ cần đổi mm -> m), sai lệch kích thước 0,99–1,08
#     lệch   X ≈ 0,000   Y ≈ +0,101   Z ≈ +0,064   (mét)
# Bốn mốc cho ra cùng một con số nên đây là phép dời cứng thật, không phải số
# chỉnh cho vừa mắt. ĐỪNG lấy hỗng tràng làm mốc: Z-Anatomy không có mesh hỗng
# tràng (chỉ có curve cùng tên), lấy nhầm là ra tỉ lệ lệch 0,5–0,9 và manh
# tràng rơi xuống ngang đùi (đã dính).
#
#   blender -b Startup.blend --python import_bp3d_gut.py -- <thu_muc_bp3d> <out.glb>

argv = sys.argv[sys.argv.index('--') + 1:]
BP3D_DIR, OUT = argv[0], argv[1]
MANIFEST = json.load(open(os.path.join(BP3D_DIR, "manifest.json")))


def world_bbox(objs):
    mn = Vector((1e9, 1e9, 1e9))
    mx = Vector((-1e9, -1e9, -1e9))
    for o in objs:
        for c in o.bound_box:
            w = o.matrix_world @ Vector(c)
            for i in range(3):
                mn[i] = min(mn[i], w[i]); mx[i] = max(mx[i], w[i])
    return mn, mx


def import_group(name):
    """Nhập mọi mảnh OBJ của một đoạn ruột, trả về danh sách object."""
    before = set(bpy.data.objects.keys())
    for path in sorted(glob.glob(os.path.join(BP3D_DIR, name, "*.obj"))):
        # forward_axis='Y', up_axis='Z': BẮT BUỘC. Mặc định của Blender xoay
        # theo quy ước OBJ Y-up và làm lệch hoàn toàn hệ quy chiếu.
        bpy.ops.wm.obj_import(filepath=path, forward_axis='Y', up_axis='Z')
    objs = [bpy.data.objects[n] for n in (set(bpy.data.objects.keys()) - before)]
    for o in objs:
        o.scale = (0.001, 0.001, 0.001)      # BodyParts3D dùng mm
    bpy.context.view_layer.update()
    return objs


def za(name):
    o = bpy.data.objects.get(name)
    return [o] if o else []


# ---- 1) đo phép dời trên từng cặp tạng có ở cả hai nguồn ----
ANCHORS = [("Stomach", "stomach"), ("Liver", "liver"),
           ("Duodenum", "duodenum"), ("Ascending colon", "ascending_colon")]
deltas = []
for za_name, bp_dir in ANCHORS:
    za_objs = za(za_name)
    if not za_objs or not MANIFEST.get(bp_dir):
        print(f"[moc] bo qua {za_name} (thieu mot ben)")
        continue
    za_mn, za_mx = world_bbox(za_objs)
    bp_objs = import_group(bp_dir)
    bp_mn, bp_mx = world_bbox(bp_objs)
    d = (za_mn + za_mx) / 2 - (bp_mn + bp_mx) / 2
    ratio = [(za_mx - za_mn)[i] / max((bp_mx - bp_mn)[i], 1e-6) for i in range(3)]
    print(f"[moc] {za_name:<16} lech=({d.x:+.4f},{d.y:+.4f},{d.z:+.4f})  "
          f"ti le co={ratio[0]:.3f},{ratio[1]:.3f},{ratio[2]:.3f}")
    deltas.append(d)
    for o in bp_objs:
        bpy.data.objects.remove(o, do_unlink=True)

if not deltas:
    raise SystemExit("KHONG DO DUOC PHEP DOI — thieu tang lam moc")

OFFSET = Vector((sum(d.x for d in deltas) / len(deltas),
                 sum(d.y for d in deltas) / len(deltas),
                 sum(d.z for d in deltas) / len(deltas)))
spread = max(max(abs(d[i] - OFFSET[i]) for d in deltas) for i in range(3)) * 1000
print(f"[moc] phep doi trung binh {tuple(round(v,4) for v in OFFSET)} m, "
      f"cac moc lech nhau toi da {spread:.1f} mm")
if spread > 15:
    print("[moc] CANH BAO: cac moc khong dong thuan, dung nhan ket qua")


def fit(objs):
    """Chỉ tịnh tiến — hai bộ dữ liệu cùng tỉ lệ, đo được trên 4 tạng."""
    for o in objs:
        o.location = o.location + OFFSET
    # BẮT BUỘC: matrix_world chỉ được tính lại sau khi cập nhật depsgraph. Thiếu
    # dòng này thì world_bbox ở dưới in ra toạ độ CŨ, tưởng phép dời không ăn.
    bpy.context.view_layer.update()

# ---- 2) nhập các đoạn thiếu và áp đúng phép biến đổi đó ----
# KHÔNG thêm "mesentery of small intestine": trong BodyParts3D nó dùng CHUNG
# file phần tử FJ3396 với phúc mạc, nhập cả hai là trùng geometry.
NAMES = {"ileum": "Ileum", "cecum": "Caecum", "rectum": "Rectum",
         "peritoneum": "Peritoneum"}
kept = []
for key, nice in NAMES.items():
    if not MANIFEST.get(key):
        continue
    objs = import_group(key)
    fit(objs)
    mn, mx = world_bbox(objs)
    print(f"[{nice}] {len(objs)} manh  bbox x=({mn.x:.3f},{mx.x:.3f}) "
          f"y=({mn.y:.3f},{mx.y:.3f}) z=({mn.z:.3f},{mx.z:.3f})")
    # gộp các mảnh thành MỘT object mang đúng tên giải phẫu
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.hide_viewport = False
        try:
            o.hide_set(False)
        except Exception:
            pass
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    if len(objs) > 1:
        bpy.ops.object.join()
    merged = bpy.context.view_layer.objects.active
    merged.name = nice
    # Phải đổi TÊN CẢ DATA-BLOCK, không chỉ tên object: glTF ghi tên data-block
    # vào mesh, và khi mesh có nhiều primitive thì GLTFLoader tạo Group theo tên
    # node còn các Mesh con lấy tên data-block — panel hiện ra "FJ2601 5".
    merged.data.name = nice
    # BodyParts3D chia mỗi mảnh một material (32 cái cho hồi tràng) nên xuất ra
    # 32 primitive. Gộp về MỘT material, mượn luôn material đại tràng của
    # Z-Anatomy để đoạn ruột bù vào không lệch tông với phần ruột sẵn có.
    merged.data.materials.clear()
    donor = bpy.data.objects.get("Ascending colon")
    if donor and donor.data.materials:
        merged.data.materials.append(donor.data.materials[0])
    kept.append(merged)

bpy.ops.object.select_all(action='DESELECT')
for o in kept:
    o.select_set(True)
print("EXPORT", [o.name for o in kept], "tris",
      sum(len(o.data.polygons) for o in kept))
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True,
                          export_draco_mesh_compression_enable=True,
                          export_draco_mesh_compression_level=6,
                          export_apply=True, export_yup=True)
print("DONE", OUT)
