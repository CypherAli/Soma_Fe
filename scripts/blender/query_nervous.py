"""Liệt kê toàn bộ object trong collection Hệ thần kinh + Giác quan.

    blender --background Startup.blend --python query_nervous.py
"""

import bpy

COLL_NAME = "7: Nervous system & Sense organs"
MIN_REAL_VERTS = 10
MARKER_SUFFIXES = (".j", ".t", ".g")


def classify(obj) -> tuple[str, str]:
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
    coll = bpy.data.collections.get(COLL_NAME)
    if coll is None:
        print("KHONG TIM THAY COLLECTION", COLL_NAME)
        print("Cac collection co san:", [c.name for c in bpy.data.collections])
        return

    buckets: dict[str, list[str]] = {}

    def walk(c):
        for obj in c.objects:
            group, detail = classify(obj)
            buckets.setdefault(group, []).append(f"{obj.name} | {detail}")
        for child in c.children:
            walk(child)

    walk(coll)

    total = sum(len(v) for v in buckets.values())
    print(f"TOTAL {total}")
    for group in ("MESH", "CURVE", "EMPTY", "OTHER", "MARKER"):
        rows = sorted(buckets.get(group, []))
        print(f"--- {group} ({len(rows)}) ---")
        for row in rows:
            print(f"{group} {row}")


main()
