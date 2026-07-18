import bpy, bmesh, sys
from mathutils import Vector

# Cắt riêng dạ dày (mặt phẳng đứng theo trục Y, hệ toạ độ gốc Z-Anatomy) để lộ
# lòng rỗng hình chữ J — Duodenum giữ nguyên không cắt (bối cảnh nối tiếp).
# LƯU Ý: "Mucosa of stomach" trong Startup.blend là mesh RỖNG (0 vertex, đã
# verify qua query_stomach_bbox.py) — không có dữ liệu nếp nhăn niêm mạc thật,
# nên scene này CHỈ thể hiện đúng những gì có thật: thành dạ dày bị cắt hở,
# không vẽ thêm chi tiết niêm mạc bịa.

argv = sys.argv[sys.argv.index('--') + 1:]
out = argv[0]
Y_CUT = float(argv[1])       # mặt cắt theo Y (hệ toạ độ Blender gốc, Z-up)
KEEP_POS_Y = argv[2] == '1'  # 1 = giữ phần Y lớn hơn Y_CUT, 0 = giữ phần nhỏ hơn

stomach = bpy.data.objects.get("Stomach")
duodenum = bpy.data.objects.get("Duodenum")
if not stomach:
    print("MISSING Stomach"); sys.exit(1)

def bisect_and_cap(o, co, no, keep_pos):
    me = o.data
    bm = bmesh.new(); bm.from_mesh(me)
    mw = o.matrix_world; mwi = mw.inverted()
    co_local = mwi @ co
    no_local = (mwi.to_3x3() @ no).normalized()
    geom = bm.verts[:] + bm.edges[:] + bm.faces[:]
    res = bmesh.ops.bisect_plane(bm, geom=geom, dist=1e-6,
                                  plane_co=co_local, plane_no=no_local,
                                  clear_inner=keep_pos, clear_outer=not keep_pos)
    cut = [e for e in res['geom_cut'] if isinstance(e, bmesh.types.BMEdge)]
    if cut:
        before = len(bm.faces)
        try: bmesh.ops.edgeloop_fill(bm, edges=cut)
        except Exception: pass
        if len(bm.faces) == before:
            try: bmesh.ops.holes_fill(bm, edges=cut, sides=0)
            except Exception: pass
        if len(bm.faces) == before:
            try: bmesh.ops.triangle_fill(bm, edges=cut, use_beauty=True)
            except Exception: pass
    open_edges = sum(1 for e in bm.edges if len(e.link_faces) < 2)
    if open_edges:
        print("OPEN_CAP", o.name, "open_edges", open_edges)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    bm.to_mesh(me)
    me.update()
    bm.free()

bisect_and_cap(stomach, Vector((0, Y_CUT, 0)), Vector((0, 1, 0)), KEEP_POS_Y)

kept = [stomach]
if duodenum:
    kept.append(duodenum)
else:
    print("MISSING Duodenum")

for o in bpy.data.objects:
    try: o.select_set(False)
    except Exception: pass
for o in kept:
    o.hide_viewport = False
    try: o.hide_set(False)
    except Exception: pass
    o.select_set(True)

total_tris = sum(len(o.data.polygons) for o in kept)
print("EXPORT", len(kept), "approx_tris", total_tris)
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_apply=False, export_yup=True)
print("DONE", out)
