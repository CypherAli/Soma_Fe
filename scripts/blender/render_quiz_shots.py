"""Render ảnh câu hỏi Spotting Quiz từ CHÍNH mô hình 3D của dự án.

    blender -b --python render_quiz_shots.py -- <shots.json> <outdir> [gioi_han_scene]

Mỗi ảnh: một cấu trúc được tô nổi bật trên nền các cấu trúc còn lại đã làm nhạt,
để hỏi "đây là cấu trúc gì?". Dùng ảnh tự render thay vì ảnh atlas có bản quyền.

Bản kê lấy từ API /api/quiz-shots để chỉ có MỘT nguồn sự thật là sceneModules.

Mỗi scene chỉ MỞ FILE MỘT LẦN rồi render nhiều ảnh: mở lại .glb cho từng
hotspot thì 629 ảnh mất hàng giờ chỉ để nạp đi nạp lại cùng một file.
"""
import json
import math
import os
import sys

import bpy
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:]
MANIFEST, OUTDIR = argv[0], argv[1]
LIMIT = int(argv[2]) if len(argv) > 2 else 10 ** 9
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

HL = (0.85, 0.13, 0.07, 1)      # màu nhấn, cho cấu trúc được hỏi
DIM = (0.62, 0.58, 0.52, 1)     # phần còn lại: xám ngả nâu, đủ tương phản với màu nhấn


def sanitize(name: str) -> str:
    """Giống PropertyBinding.sanitizeNodeName của three, để khớp tên mesh."""
    return "".join(c if (c.isalnum() or c in "_-") else ("_" if c == " " else "") for c in name)


def look_at(cam, target, dist):
    cam.location = target + Vector((dist * 0.35, -dist, dist * 0.22))
    d = (target - cam.location).normalized()
    cam.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()


def setup_world():
    w = bpy.data.worlds.new("w")
    w.use_nodes = True
    w.node_tree.nodes["Background"].inputs[0].default_value = (0.957, 0.937, 0.902, 1)
    w.node_tree.nodes["Background"].inputs[1].default_value = 0.75
    bpy.context.scene.world = w
    sc = bpy.context.scene
    sc.render.engine = "BLENDER_EEVEE"
    sc.render.resolution_x = 700
    sc.render.resolution_y = 560
    sc.render.image_settings.file_format = "JPEG"
    sc.render.image_settings.quality = 82


def main():
    data = json.load(open(MANIFEST, encoding="utf-8"))
    os.makedirs(OUTDIR, exist_ok=True)
    made, missing = [], []

    for si, scene in enumerate(data["scenes"][:LIMIT]):
        glb = os.path.join(ROOT, "public", scene["modelFile"].lstrip("/"))
        if not os.path.exists(glb):
            print(f"[{scene['slug']}] THIEU FILE {glb}", flush=True)
            continue

        bpy.ops.wm.read_factory_settings(use_empty=True)
        bpy.ops.import_scene.gltf(filepath=glb)
        setup_world()

        meshes = [o for o in bpy.data.objects if o.type == "MESH"]
        if not meshes:
            continue

        # vật liệu dùng chung: gán một lần cho tất cả, sau chỉ đổi màu ĐÚNG
        # mesh đang hỏi -> không phải tạo lại vật liệu cho từng ảnh
        mat_dim = bpy.data.materials.new("dim"); mat_dim.use_nodes = True
        mat_dim.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = DIM
        mat_dim.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.85
        mat_hl = bpy.data.materials.new("hl"); mat_hl.use_nodes = True
        mat_hl.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = HL
        mat_hl.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.55
        for o in meshes:
            o.data.materials.clear()
            o.data.materials.append(mat_dim)

        # khung hình chung cho cả scene
        mn = Vector((1e9,) * 3); mx = Vector((-1e9,) * 3)
        for o in meshes:
            for c in o.bound_box:
                w = o.matrix_world @ Vector(c)
                for i in range(3):
                    mn[i] = min(mn[i], w[i]); mx[i] = max(mx[i], w[i])
        ctr = (mn + mx) / 2
        rad = max(mx - mn) / 2 or 0.1

        cam_d = bpy.data.cameras.new("c"); cam = bpy.data.objects.new("c", cam_d)
        bpy.context.scene.collection.objects.link(cam)
        cam_d.lens = 55
        look_at(cam, ctr, rad * 3.1)
        bpy.context.scene.camera = cam
        for pos, e in (((rad * 4, -rad * 5, rad * 4), 4.0), ((-rad * 4, -rad * 3, rad * 2), 1.5)):
            ld = bpy.data.lights.new("l", "SUN"); ld.energy = e
            lo = bpy.data.objects.new("l", ld)
            bpy.context.scene.collection.objects.link(lo)
            lo.location = ctr + Vector(pos)
            lo.rotation_euler = (ctr - lo.location).normalized().to_track_quat("-Z", "Y").to_euler()

        by_name = {}
        for o in meshes:
            by_name.setdefault(sanitize(o.name), o)
            by_name.setdefault(o.name, o)

        for h in scene["hotspots"]:
            target = by_name.get(sanitize(h["meshName"])) or by_name.get(h["meshName"])
            if target is None:
                missing.append(f"{scene['slug']}/{h['key']}")
                continue
            target.data.materials.clear()
            target.data.materials.append(mat_hl)
            # Cấu trúc đang hỏi phải THẤY ĐƯỢC kể cả khi bị tạng khác che: túi
            # mật nằm khuất sau gan, không bật cái này thì ảnh chỉ hở một mẩu
            # đỏ bằng đầu ngón tay, đố kiểu gì cũng không ra.
            target.show_in_front = True

            fn = f"{scene['slug']}__{h['key']}.jpg"
            bpy.context.scene.render.filepath = os.path.join(OUTDIR, fn)
            bpy.ops.render.render(write_still=True)
            made.append({"scene": scene["slug"], "key": h["key"], "file": fn})

            target.show_in_front = False
            target.data.materials.clear()
            target.data.materials.append(mat_dim)

        print(f"[{si+1}/{min(LIMIT,len(data['scenes']))}] {scene['slug']}: "
              f"{len(scene['hotspots'])} anh", flush=True)

    json.dump({"shots": made, "missing": missing},
              open(os.path.join(OUTDIR, "manifest.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print(f"XONG: {len(made)} anh | khong tim thay mesh: {len(missing)}", flush=True)


main()
