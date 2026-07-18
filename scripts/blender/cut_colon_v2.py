import bpy, bmesh, sys
from mathutils import Vector

# Bản v2 của cut_colon.py: bổ sung Rectum + Ileocecal junction lấy từ
# BodyParts3D (nguồn gốc CC BY-SA 2.1 JP mà Z-Anatomy cũng dẫn xuất từ đó) —
# Startup.blend KHÔNG có 2 cấu trúc này. Đã verify offset toạ độ thực
# nghiệm (xem import_bp3d_test.py): trục X/Z trùng hệ quy chiếu Z-Anatomy
# khi import với forward_axis='Y', up_axis='Z'; trục Y cần bù offset do
# khác gốc toạ độ giữa 2 bộ dữ liệu.

argv = sys.argv[sys.argv.index('--') + 1:]
out = argv[0]
Y_CUT = float(argv[1])
KEEP_POS_Y = argv[2] == '1'
rectum_path = argv[3]
ileocecal_path = argv[4]

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

# Nhập Rectum + Ileocecal junction từ BodyParts3D
before_objs = set(bpy.data.objects.keys())
bpy.ops.wm.obj_import(filepath=rectum_path, forward_axis='Y', up_axis='Z')
bpy.ops.wm.obj_import(filepath=ileocecal_path, forward_axis='Y', up_axis='Z')
after_objs = set(bpy.data.objects.keys())
new_objs = {o.name: o for o in (bpy.data.objects[n] for n in (after_objs - before_objs))}
rectum = new_objs.get("FJ2571")
ileocecal = new_objs.get("FJ2599")
if not rectum or not ileocecal:
    print("MISSING BP3D import"); sys.exit(1)
rectum.name = "Rectum"
ileocecal.name = "Ileocecal junction"
for o in (rectum, ileocecal):
    o.scale = (0.001, 0.001, 0.001)
bpy.context.view_layer.update()
rectum.location.y += 0.0895
ileocecal.location.x += -0.0225
ileocecal.location.y += 0.109
bpy.context.view_layer.update()

kept = [sigmoid, rectum, ileocecal]
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
    export_apply=True, export_yup=True)
print("DONE", out)
