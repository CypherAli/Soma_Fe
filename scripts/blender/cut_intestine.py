import bpy, bmesh, sys
from mathutils import Vector

# Ruột non (Jejunum) lưu dạng CURVE có bevel tròn (không phải Mesh) trong
# Startup.blend — ĐÃ TEST RIÊNG convert Curve->Mesh trong bbox nhỏ (không đổi
# bevel_depth, không cap gì) và verify hình dạng cuộn ruột ra ĐÚNG, KHÔNG bị
# phồng to như lần thất bại trước với Abdominal aorta/IVC (nghi ngờ lần đó do
# chủ động TĂNG bevel_depth trước khi convert — script này giữ nguyên bevel
# gốc). Sau khi có mesh thật, cắt 1 mặt phẳng ngang (Z) xuyên qua khối ruột
# cuộn để lộ NHIỀU mặt cắt tròn cùng lúc (giống cắt qua bó mì) — cách trực
# quan thể hiện "cross section" cho 1 ống dài cuộn nhiều vòng.

argv = sys.argv[sys.argv.index('--') + 1:]
out = argv[0]
Z_CUT = float(argv[1])
KEEP_UPPER = argv[2] == '1'  # 1 = giữ phần Z lớn hơn Z_CUT

jejunum = bpy.data.objects.get("Jejunum")
if not jejunum or jejunum.type != 'CURVE':
    print("MISSING Jejunum"); sys.exit(1)

with bpy.context.temp_override(active_object=jejunum, object=jejunum,
                                selected_objects=[jejunum], selected_editable_objects=[jejunum]):
    bpy.ops.object.convert(target='MESH')
print("CONVERTED Jejunum", "verts", len(jejunum.data.vertices))

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

bisect_and_cap(jejunum, Vector((0, 0, Z_CUT)), Vector((0, 0, 1)), KEEP_UPPER)

for o in bpy.data.objects:
    try: o.select_set(False)
    except Exception: pass
jejunum.hide_viewport = False
try: jejunum.hide_set(False)
except Exception: pass
jejunum.select_set(True)

print("EXPORT 1 approx_tris", len(jejunum.data.polygons))
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_apply=False, export_yup=True)
print("DONE", out)
