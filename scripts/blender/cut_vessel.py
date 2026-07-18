import bpy, bmesh, sys
from mathutils import Vector

# Cắt ngang 1 đoạn mạch máu (Curve, bevel mảnh) để lộ mặt cắt tròn — dùng
# cho scene "Artery/Vein Cross Section". Convert Curve->Mesh GIỮ NGUYÊN
# bevel_depth gốc (đã verify an toàn, không phồng to như lần thất bại
# trước khi TĂNG bevel_depth). Trung thực: dữ liệu KHÔNG có lớp thành mạch
# (tunica intima/media/adventitia) nên mặt cắt chỉ thể hiện khẩu kính lòng
# mạch, không phải cấu trúc mô học 3 lớp — ghi rõ trong description.

argv = sys.argv[sys.argv.index('--') + 1:]
out = argv[0]
vessel_name = argv[1]
Z_CUT = float(argv[2])
KEEP_UPPER = argv[3] == '1'

o = bpy.data.objects.get(vessel_name)
if not o or o.type != 'CURVE':
    print("MISSING", vessel_name); sys.exit(1)

with bpy.context.temp_override(active_object=o, object=o,
                                selected_objects=[o], selected_editable_objects=[o]):
    bpy.ops.object.convert(target='MESH')
print("CONVERTED", vessel_name, "verts", len(o.data.vertices))

def bisect_and_cap(obj, co, no, keep_pos):
    me = obj.data
    bm = bmesh.new(); bm.from_mesh(me)
    mw = obj.matrix_world; mwi = mw.inverted()
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
    print("OPEN_CAP", obj.name, "open_edges", open_edges)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    bm.to_mesh(me)
    me.update()
    bm.free()

bisect_and_cap(o, Vector((0, 0, Z_CUT)), Vector((0, 0, 1)), KEEP_UPPER)

for x in bpy.data.objects:
    try: x.select_set(False)
    except Exception: pass
o.hide_viewport = False
try: o.hide_set(False)
except Exception: pass
o.select_set(True)

print("EXPORT 1 approx_tris", len(o.data.polygons))
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True,
    export_apply=False, export_yup=True)
print("DONE", out)
