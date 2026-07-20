"""Tra cứu cấu trúc trong file Blender Z-Anatomy theo từ khoá.

Thay cho query_skeletal.py / query_muscular.py (mỗi hệ một file trùng lặp).
Quét TOÀN BỘ file, không giới hạn 1 collection, vì dữ liệu một hệ thường
nằm rải ở nhiều collection (VD hô hấp: phổi ở "8: Visceral systems",
sụn thanh quản ở "1: Skeletal system", cơ hoành ở "4: Muscular system").

    blender --background Startup.blend --python query_structures.py -- cochlea labyrinth

Phân loại đầu ra:
  MESH   - mesh thật, có hình học (verts >= MIN_REAL_VERTS)
  CURVE  - curve (mạch máu/ống), cần convert->mesh khi export
  MARKER - hậu tố .j/.t/.g hoặc mesh quá ít vert: nhãn/điểm đánh dấu, KHÔNG dùng được
  EMPTY  - type MESH nhưng 0 vertex (VD "Mucosa of stomach") — coi như không có dữ liệu
"""

import sys

import bpy

MIN_REAL_VERTS = 10
MARKER_SUFFIXES = (".j", ".t", ".g")


def parse_keywords() -> list[str]:
    argv = sys.argv
    args = argv[argv.index("--") + 1 :] if "--" in argv else []
    return [a.lower() for a in args if a.strip()]


def collection_of(obj) -> str:
    return obj.users_collection[0].name if obj.users_collection else "?"


def classify(obj) -> tuple[str, str]:
    """Trả về (nhóm, chi tiết) cho một object."""
    if obj.name.endswith(MARKER_SUFFIXES):
        return "MARKER", f"suffix {obj.name[-2:]}"
    if obj.type == "CURVE":
        bevel = getattr(obj.data, "bevel_depth", 0.0)
        return "CURVE", f"bevel_depth={bevel:.5f} users={obj.data.users}"
    if obj.type != "MESH":
        return "OTHER", obj.type
    nverts = len(obj.data.vertices)
    if nverts == 0:
        return "EMPTY", "0 vertex"
    if nverts < MIN_REAL_VERTS:
        return "MARKER", f"chỉ {nverts} vert"
    return "MESH", f"verts={nverts} users={obj.data.users}"


def main() -> None:
    keywords = parse_keywords()
    if not keywords:
        print("USAGE: -- <từ khoá> [từ khoá ...]")
        return

    print(f"KEYWORDS {' '.join(keywords)}")
    buckets: dict[str, list[str]] = {}

    for obj in bpy.data.objects:
        lname = obj.name.lower()
        if not any(kw in lname for kw in keywords):
            continue
        group, detail = classify(obj)
        line = f"{obj.name} | {detail} | coll={collection_of(obj)}"
        buckets.setdefault(group, []).append(line)

    for group in ("MESH", "CURVE", "EMPTY", "OTHER", "MARKER"):
        rows = sorted(buckets.get(group, []))
        print(f"--- {group} ({len(rows)}) ---")
        for row in rows:
            print(f"{group} {row}")


main()
