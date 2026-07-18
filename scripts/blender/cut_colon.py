import bpy, bmesh, sys
from mathutils import Vector

# Đại tràng: 4 đoạn (Ascending/Transverse/Descending/Sigmoid colon) đều là
# mesh THẬT, giữ nguyên khối để thấy khung đại tràng bao quanh ổ bụng.
# CHỈ cắt riêng Sigmoid colon (đoạn cuối, hình chữ S) để lộ lòng ống — tương
# tự mẫu Stomach+Duodenum. LƯU Ý: dữ liệu Z-Anatomy KHÔNG có Cecum (manh
# tràng) và KHÔNG có Rectum (trực tràng) dưới bất kỳ dạng nào (đã tìm kỹ cả
# Mesh lẫn Curve) — Ascending colon trong data này bắt đầu ngay chỗ đáng lẽ
# là manh tràng, không vẽ thêm phần thiếu.

argv = sys.argv[sys.argv.index('--') + 1:]
out = argv[0]
Y_CUT = float(argv[1])
KEEP_POS_Y = argv[2] == '1'

names_whole = ["Ascending colon", "Transverse colon", "Descending colon", "Vermiform appendix"]
sigmoid = bpy.data.objects.get("Sigmoid colon")
if not sigmoid:
    print("MISSING Sigmoid colon"); sys.exit(1)

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
    print("OPEN_CAP", o.name, "open_edges", open_edges)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    bm.to_mesh(me)
    me.update()
    bm.free()

bisect_and_cap(sigmoid, Vector((0, Y_CUT, 0)), Vector((0, 1, 0)), KEEP_POS_Y)

kept = [sigmoid]
for nm in names_whole:
    o = bpy.data.objects.get(nm)
    if not o:
        print("MISSING", nm); continue
    kept.append(o)

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
