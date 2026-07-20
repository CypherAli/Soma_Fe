"""Thư viện dùng chung cho các script export scene Z-Anatomy → glTF.

Gom phần lặp lại giữa export_endocrine/urinary/eye/respiratory/skeletal...:
thu thập object theo tên, convert Curve→Mesh an toàn, chọn và xuất GLB Draco.

Đây là THƯ VIỆN, không chạy trực tiếp. Script scene dùng như sau:

    import sys, os
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    from soma_export import collect, export_glb, parse_out

    out = parse_out()
    kept = collect(mesh_names=[...], curve_names=[...])
    export_glb(kept, out)

QUY TẮC AN TOÀN đã đúc kết qua nhiều phiên, ĐỪNG bỏ:
  - Curve→Mesh: TUYỆT ĐỐI KHÔNG tăng `bevel_depth` trước khi convert.
    Lần tăng 0.0005→0.009 làm mạch máu phồng thành khối khổng lồ.
  - Cặp .l/.r thường DÙNG CHUNG một data-block. Phải `data.copy()` trước
    khi convert, nếu không convert `.l` sẽ làm mất `.r`.
"""

import sys

import bpy


def parse_out() -> str:
    """Lấy đường dẫn file .glb đầu ra từ argv sau dấu `--`."""
    argv = sys.argv[sys.argv.index("--") + 1 :]
    if not argv:
        raise SystemExit("THIẾU tham số: đường dẫn file .glb đầu ra")
    return argv[0]


def _convert_curve(obj) -> bool:
    """Convert Curve→Mesh tại chỗ. Trả về True nếu ra mesh có hình học."""
    # Tách data-block dùng chung, nếu không convert .l sẽ xoá mất .r
    if obj.data.users > 1:
        obj.data = obj.data.copy()
    # KHÔNG đụng vào bevel_depth — giữ nguyên giá trị gốc trong file
    with bpy.context.temp_override(
        active_object=obj,
        object=obj,
        selected_objects=[obj],
        selected_editable_objects=[obj],
    ):
        bpy.ops.object.convert(target="MESH")
    return obj.type == "MESH" and len(obj.data.vertices) > 0


def collect(mesh_names: list[str] = (), curve_names: list[str] = ()) -> list:
    """Thu thập object theo tên. In rõ cái nào thiếu thay vì im lặng bỏ qua."""
    kept = []

    for name in mesh_names:
        obj = bpy.data.objects.get(name)
        if obj is None or obj.type != "MESH":
            print("MISSING_MESH", name)
        elif len(obj.data.vertices) == 0:
            print("EMPTY_MESH", name)
        else:
            kept.append(obj)

    for name in curve_names:
        obj = bpy.data.objects.get(name)
        if obj is None or obj.type != "CURVE":
            print("MISSING_CURVE", name)
        elif _convert_curve(obj):
            kept.append(obj)
        else:
            print("CONVERT_EMPTY", name)

    return kept


def export_glb(objs: list, out: str) -> None:
    """Chọn đúng `objs` rồi xuất GLB nén Draco."""
    if not objs:
        raise SystemExit("KHÔNG có object nào để xuất — kiểm tra lại tên")

    for obj in bpy.data.objects:
        try:
            obj.select_set(False)
        except Exception:
            pass  # object ở collection ẩn không select được, bỏ qua vô hại

    for obj in objs:
        obj.hide_viewport = False
        try:
            obj.hide_set(False)
        except Exception:
            pass
        obj.select_set(True)

    tris = sum(len(o.data.polygons) for o in objs if o.type == "MESH")
    print("EXPORT", len(objs), "tris", tris)
    print("KEPT_NAMES", [o.name for o in objs])

    bpy.ops.export_scene.gltf(
        filepath=out,
        export_format="GLB",
        use_selection=True,
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=6,
        export_apply=False,
        export_yup=True,
    )
    print("DONE", out)


def export_batch(scenes: dict[str, dict], out_dir: str) -> None:
    """Xuất nhiều scene trong 1 lần chạy Blender.

    `scenes` dạng {"tên_file.glb": {"mesh": [...], "curve": [...]}}.
    Mẫu này (từ export_skeletal.py) tránh phải khởi động lại Blender cho
    từng scene — file Startup.blend 293MB nên mỗi lần mở rất tốn thời gian.
    """
    import os

    for filename, spec in scenes.items():
        print(f"===== SCENE {filename} =====")
        kept = collect(spec.get("mesh", []), spec.get("curve", []))
        export_glb(kept, os.path.join(out_dir, filename))
