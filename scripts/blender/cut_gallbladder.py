import bpy, bmesh, sys
from mathutils import Vector

# Túi mật cắt theo mặt phẳng đứng (X, gần "sagittal" thật của cơ quan nhỏ
# này) để lộ lòng chứa mật — Bile duct (Curve, ĐÃ TEST convert an toàn,
# không phồng to, xem query_bileduct.py/test_gb_bileduct.py) giữ nguyên
# không cắt để thấy điểm nối qua cổ túi mật.

argv = sys.argv[sys.argv.index('--') + 1:]
out = argv[0]
X_CUT = float(argv[1])
KEEP_POS_X = argv[2] == '1'

gb = bpy.data.objects.get("Gallbladder")
bd = bpy.data.objects.get("Bile duct")
if not gb:
    print("MISSING Gallbladder"); sys.exit(1)

if bd:
    with bpy.context.temp_override(active_object=bd, object=bd,
                                    selected_objects=[bd], selected_editable_objects=[bd]):
        bpy.ops.object.convert(target='MESH')
else:
    print("MISSING Bile duct")

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

bisect_and_cap(gb, Vector((X_CUT, 0, 0)), Vector((1, 0, 0)), KEEP_POS_X)

kept = [gb]
if bd:
    kept.append(bd)

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
