"""Xuất bộ xương LỢN từ Z-PIG.blend (Z-Anatomy, CC BY-SA 4.0) ra .glb cho web.

    blender --background Z-PIG.blend --python scripts/blender/export_pig.py -- \
        scripts/vet/pig-bones.json public/models/vet

Sinh ra hai tệp:
  • pig-skeleton.glb — toàn thân, 120 xương, giảm lưới theo ngân sách tam giác;
  • pig-skull.glb    — sọ + hàm dưới + xương móng, giữ gần như nguyên độ chi
    tiết (răng lợn là nội dung dạy thật, giảm lưới là mất luôn ranh giới răng).

VÌ SAO ĐÁNG LÀM RIÊNG MỘT SCRIPT thay vì dùng `import-vet-model.mjs`:
Z-PIG là mẫu thú y ĐẦU TIÊN có tên từng xương. Đường ống mô mềm cũ được viết
cho mẫu quét khối liền: nó chạy `gltf-transform optimize`, mà bước `join` và
`palette` của công cụ ấy XOÁ SẠCH tên vật liệu để giảm draw call — tức là xoá
đúng thứ duy nhất khiến bộ xương này có giá trị. Ở đây nén bằng Draco ngay
trong Blender và KHÔNG đụng tới gltf-transform.

BA ĐIỂM PHẢI GIỮ:
 1. TÊN VẬT LIỆU = slug trong pig-bones.json. Trang xem (`VetModelScene`) gom
    mesh theo tên vật liệu; đặt sai một ký tự là bộ phận đó biến mất khỏi danh
    sách mà không báo lỗi gì.
 2. Object nào KHÔNG có trong sổ thì bỏ hẳn — Z-PIG có 39 object rỗng làm nhóm
    ("Colonne vertébrale", "Squelette axial"…). Xuất chúng ra thì tệp .glb có
    node rỗng, còn danh sách bộ phận thì thừa mục bấm vào không thấy gì.
 3. Giảm lưới BỎ QUA xương nhỏ (dưới SMALL tam giác). Đốt ngón và xương cổ tay
    vốn chỉ vài trăm mặt; giảm tiếp là mất hẳn hình khối khớp.
"""

import json
import os
import sys

import bpy

# ── tham số ────────────────────────────────────────────────────────────────
argv = sys.argv[sys.argv.index("--") + 1:]
if len(argv) < 2:
    raise SystemExit("Cần: <pig-bones.json> <thư mục ra>")
BONES_JSON, OUT_DIR = os.path.abspath(argv[0]), os.path.abspath(argv[1])

# Ngân sách tam giác. Bộ xương chó của khu thú y là 260.000 tam giác trong 1,1 MB
# — lấy đó làm mốc. Sọ để riêng nên được nhiều hơn.
BUDGET_SKELETON = 620_000
BUDGET_SKULL = 260_000
SMALL = 1_200  # dưới ngưỡng này giữ nguyên, không giảm

HEAD_SLUGS = {"cranium", "mandibula", "os-hyoideum"}

with open(BONES_JSON, encoding="utf8") as fh:
    BONES = json.load(fh)

# tên tiếng Pháp trong file .blend → slug
FR_TO_SLUG = {fr: b["slug"] for b in BONES for fr in b["fr"]}


def bone_objects():
    """Object mesh CÓ hình học và CÓ trong sổ tên. Báo rõ cái nào rơi ra."""
    kept, unknown = [], []
    for obj in bpy.data.objects:
        if obj.type != "MESH" or len(obj.data.vertices) == 0:
            continue
        slug = FR_TO_SLUG.get(obj.name)
        if slug is None:
            unknown.append(obj.name)
            continue
        kept.append((obj, slug))
    if unknown:
        # Không tự ý bỏ qua: mesh có hình học mà không có tên trong sổ nghĩa là
        # sổ đã lỗi thời so với file .blend — phải chạy lại build-pig-bones.mjs.
        raise SystemExit(
            "MESH KHÔNG CÓ TRONG SỔ TÊN (%d): %s" % (len(unknown), ", ".join(sorted(unknown)))
        )
    return kept


def label(obj, slug):
    """Đặt tên object, tên mesh VÀ tên vật liệu đều bằng slug."""
    obj.name = slug
    obj.data.name = slug
    obj.data.materials.clear()
    mat = bpy.data.materials.get(slug)
    if mat is None:
        mat = bpy.data.materials.new(slug)
        mat.use_nodes = True
        bsdf = mat.node_tree.nodes.get("Principled BSDF")
        if bsdf:
            # Màu xương ngà, nhám — cùng tông với các mẫu xương khác của khu thú y.
            bsdf.inputs["Base Color"].default_value = (0.902, 0.874, 0.804, 1.0)
            if "Roughness" in bsdf.inputs:
                bsdf.inputs["Roughness"].default_value = 0.85
            if "Metallic" in bsdf.inputs:
                bsdf.inputs["Metallic"].default_value = 0.0
    obj.data.materials.append(mat)


def decimate(objs, budget):
    """Giảm lưới theo MỘT tỉ lệ chung cho mọi xương lớn.

    Dùng chung một tỉ lệ chứ không cân theo từng xương: cân riêng thì xương to
    bị giảm mạnh còn xương nhỏ giữ nguyên, nhìn tổng thể thành ra chỗ mịn chỗ
    thô ngay cạnh nhau. Một tỉ lệ chung giữ được cảm giác đồng đều.
    """
    tris = {obj.name: len(obj.data.polygons) for obj, _ in objs}
    total = sum(tris.values())
    print("[pig] %d xương · %d tam giác" % (len(objs), total))
    if total <= budget:
        print("[pig] đã dưới ngân sách, không giảm lưới")
        return
    keep_small = sum(t for t in tris.values() if t <= SMALL)
    big = total - keep_small
    ratio = max(0.05, min(1.0, (budget - keep_small) / big))
    print("[pig] tỉ lệ giảm %.3f (giữ nguyên %d tam giác của xương nhỏ)" % (ratio, keep_small))
    for obj, _ in objs:
        if tris[obj.name] <= SMALL:
            continue
        mod = obj.modifiers.new("pig_dec", "DECIMATE")
        mod.ratio = ratio


def export(objs, path):
    for obj in bpy.data.objects:
        try:
            obj.select_set(False)
        except Exception:
            pass  # object trong collection ẩn không select được — vô hại
    for obj, _ in objs:
        obj.hide_viewport = False
        obj.hide_render = False
        try:
            obj.hide_set(False)
        except Exception:
            pass
        obj.select_set(True)
    print("[pig] xuất %d object → %s" % (len(objs), path))
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format="GLB",
        use_selection=True,
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=6,
        # PHẢI True: modifier Decimate ở trên chỉ tồn tại trong depsgraph, để
        # False là xuất ra lưới gốc chưa giảm — file phình gấp năm mà không ai
        # thấy lỗi gì.
        export_apply=True,
        export_yup=True,
        export_materials="EXPORT",
    )


everything = bone_objects()
for obj, slug in everything:
    label(obj, slug)

os.makedirs(OUT_DIR, exist_ok=True)

# ── SỌ trước (còn nguyên độ chi tiết, chưa dính modifier của bản toàn thân) ──
head = [(o, s) for o, s in everything if s in HEAD_SLUGS]
decimate(head, BUDGET_SKULL)
export(head, os.path.join(OUT_DIR, "pig-skull.glb"))
for obj, _ in head:
    for mod in list(obj.modifiers):
        if mod.name == "pig_dec":
            obj.modifiers.remove(mod)

# ── TOÀN THÂN ───────────────────────────────────────────────────────────────
decimate(everything, BUDGET_SKELETON)
export(everything, os.path.join(OUT_DIR, "pig-skeleton.glb"))
print("[pig] XONG")
