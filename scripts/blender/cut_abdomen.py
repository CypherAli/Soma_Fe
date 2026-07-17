import bpy, sys, bmesh
from mathutils import Vector

argv = sys.argv[sys.argv.index('--')+1:]
out = argv[0]
col_names = argv[1:]

Z_TOP = 1.28     # mặt cắt ngang trên (trên tạng bụng) — mở bụng
Z_BOT = 0.78     # cắt dưới ~vành chậu, bỏ chân
X_ARM = 0.20     # mesh có TÂM |X|>ngưỡng = tay/chi bên → xoá

# Bỏ chi (tay/chân) + đầu-cổ theo TÊN (lọc |X| không tách được tay sát thân).
LIMB_KW = ["brachi", "humer", "radius", "ulna", "carp", "metacarp", "digitorum",
           "digiti", "pollic", " hand", "finger", "phalan", "antebrach", "forearm",
           "deltoid", "bicep", "tricep", "femor", "femur", "thigh", "patell",
           "tibia", "fibula", "gastrocn", "soleus", "tarsal", " foot", " toe",
           "hallucis", "peroneus", "popliteus", "sartorius", "gracilis",
           "quadratus femoris", "obturator"]
# Lớp "vỏ ngoài" (da/mạc) — KHÔNG bịt nắp để hở thành vòng nhìn vào trong.
NO_CAP_MAT = ["fascia", "superficial", "skin"]

def limb_name(nm):
    low = nm.lower()
    return any(k in low for k in LIMB_KW)

def mat_is_wall(o):
    for m in o.data.materials:
        if m and any(k in m.name.lower() for k in NO_CAP_MAT):
            return True
    return False

def world_bbox(obj):
    mw = obj.matrix_world
    cs = [mw @ Vector(c) for c in obj.bound_box]
    xs=[c.x for c in cs]; ys=[c.y for c in cs]; zs=[c.z for c in cs]
    return (min(xs),min(ys),min(zs)),(max(xs),max(ys),max(zs))

# Gom object từ các collection chỉ định
objs = []
for cname in col_names:
    col = bpy.data.collections.get(cname)
    if not col:
        print("WARN missing collection", cname); continue
    for o in col.all_objects:
        if o.type == 'MESH':
            objs.append(o)
print("CANDIDATES", len(objs))

for o in bpy.data.objects:
    try: o.select_set(False)
    except: pass

kept = []
deleted = 0
for o in objs:
    try:
        (xmn,ymn,zmn),(xmx,ymx,zmx) = world_bbox(o)
    except Exception:
        continue
    xc = (xmn + xmx) / 2
    # Xoá nếu: hẳn ngoài dải bụng / tâm lệch bên (tay-chân bên) / tên là chi.
    if zmn > Z_TOP or zmx < Z_BOT or abs(xc) > X_ARM or limb_name(o.name):
        try:
            bpy.data.objects.remove(o, do_unlink=True); deleted += 1
        except: pass
        continue
    kept.append(o)
print("KEPT", len(kept), "DELETED", deleted)

# Bisect từng object đang chồng lên dải: cắt trên (bỏ phần trên, bịt nắp),
# cắt dưới (bỏ phần dưới). Dùng bmesh để ổn định hơn bpy.ops.
def bisect_obj(o, do_cap):
    me = o.data
    bm = bmesh.new(); bm.from_mesh(me)
    mw = o.matrix_world; mwi = mw.inverted()
    # local plane co/no cho Z_TOP (bỏ phần z>Z_TOP, fill)
    for zc, keep_below in ((Z_TOP, True), (Z_BOT, False)):
        co_local = mwi @ Vector((0,0,zc))
        no_local = (mwi.to_3x3() @ Vector((0,0,1))).normalized()
        geom = bm.verts[:] + bm.edges[:] + bm.faces[:]
        res = bmesh.ops.bisect_plane(bm, geom=geom, dist=1e-6,
                                     plane_co=co_local, plane_no=no_local,
                                     clear_inner=(not keep_below),
                                     clear_outer=keep_below)
        # Bịt nắp mặt cắt TRÊN — trừ lớp da/mạc (để hở nhìn vào trong).
        if keep_below and do_cap:
            cut = [e for e in res['geom_cut'] if isinstance(e, bmesh.types.BMEdge)]
            if cut:
                try: bmesh.ops.edgeloop_fill(bm, edges=cut)
                except Exception:
                    try: bmesh.ops.triangle_fill(bm, edges=cut, use_beauty=True)
                    except: pass
    # Recalc normal hướng ra ngoài — bisect/fill có thể để normal lộn xộn khiến
    # mặt bị cull (FrontSide) → model trắng/vô hình khi render.
    try:
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    except Exception:
        pass
    bm.to_mesh(me)
    me.update()
    bm.free()

capped = 0
for o in list(kept):
    try:
        bisect_obj(o, do_cap=not mat_is_wall(o)); capped += 1
    except Exception as e:
        print("BISECT FAIL", o.name, str(e)[:60])
print("CAPPED", capped)

# Xoá object rỗng sau khi cắt
for o in list(kept):
    if o.type=='MESH' and len(o.data.vertices)==0:
        try: bpy.data.objects.remove(o, do_unlink=True)
        except: pass

# Chọn & xuất
final = [o for o in bpy.data.objects if o.type=='MESH' and o in kept and len(o.data.vertices)>0]
for o in final:
    o.hide_viewport=False
    try: o.hide_set(False)
    except: pass
    o.select_set(True)
print("EXPORT", len(final))
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_apply=False, export_yup=True)
print("DONE", out)
