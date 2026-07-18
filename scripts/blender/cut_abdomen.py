import bpy, sys, bmesh, re
from mathutils import Vector

argv = sys.argv[sys.argv.index('--')+1:]
out = argv[0]
col_names = argv[1:]

Z_TOP = 1.28     # mặt cắt ngang trên (trên tạng bụng) — mở bụng
Z_BOT = 0.87     # nâng cao hơn khớp mu, KHÔNG chứa bộ phận sinh dục
X_ARM = 0.165    # mesh có TÂM |X|>ngưỡng = tay/vai bên → xoá (thân bụng ~±0.15)
X_CLIP = 0.19    # cắt phẳng đứng 2 bên bỏ overhang lateral (mẩu vai/tay sát thân)

# Cấu trúc CẦN giữ riêng để còn bấm chọn được (hotspot) — không gộp/giảm poly.
HERO_NAMES = {"Vertebra T12", "Liver", "Stomach", "Spleen", "Kidney.l", "Kidney.r",
              "Abdominal aorta", "Inferior vena cava (abdominal part)"}

# Z-Anatomy lưu mạch máu chính (động mạch chủ bụng, tĩnh mạch chủ dưới) dạng
# CURVE có bevel (ống tròn), KHÔNG PHẢI Mesh — script trước giờ chỉ gom
# object type Mesh từ collection nên bỏ sót hoàn toàn 2 mạch này dù chúng có
# thật trong file gốc (xác nhận qua TA2.csv của Z-Anatomy + kiểm tra trực
# tiếp: material đã đúng sẵn "Artery"/"Vein", nằm trong "5: Cardiovascular
# system"). Chuyển Curve → Mesh thủ công rồi bơm thẳng vào luồng xử lý chung.
VESSEL_CURVE_NAMES = ["Abdominal aorta", "Inferior vena cava (abdominal part)"]

# Bỏ chi (tay/chân) + vai theo TÊN (lọc |X| không tách hết mẩu vai sát thân).
LIMB_KW = ["brachi", "humer", "radius", "ulna", "carp", "metacarp", "digitorum",
           "digiti", "pollic", " hand", "finger", "phalan", "antebrach", "forearm",
           "deltoid", "bicep", "tricep", "femor", "femur", "thigh", "patell",
           "tibia", "fibula", "gastrocn", "soleus", "tarsal", " foot", " toe",
           "hallucis", "peroneus", "popliteus", "sartorius", "gracilis",
           "quadratus femoris", "obturator", "teres", "infraspin", "supraspin",
           "subscapular", "scapula", "clavicle", "coracobrach", "acromio",
           "supinator", "pronator", "anconeus", "brachii", "brachial", "axilla",
           "pector", "trapez", "latissimus", "rhomboid", "serratus", "levator scapul"]
# Cấu trúc vùng CHẬU — thấp hơn hẳn mức T12, KHÔNG thuộc scene này. Lọc theo
# Z_BOT không đủ vì vài object (VD xương chậu, bàng quang) có bbox tràn lên
# một chút vào dải Z_BOT..Z_TOP → chỉ bị CẮT chứ không bị XOÁ, để lại mẩu
# lộ ra ngoài da (đã thấy thật: "Xương chậu 1" chìa ra 2 bên, "Urinary
# bladder" xuất hiện khi click ngẫu nhiên). Xoá thẳng theo TÊN bất kể Z.
PELVIC_KW = ["pelvis", "hip bone", "ilium", "ischium", "pubis", "sacrum",
             "coccyx", "bladder"]
# Tương tự nhưng ở mép TRÊN: tim/phổi/màng phổi thuộc LỒNG NGỰC, cao hơn
# hẳn T12, nhưng bbox chạm nhẹ Z_TOP nên chỉ bị CẮT chứ không bị XOÁ — xác
# nhận thật qua chẩn đoán OPEN_CAP (Right/Left atrium+ventricle, Pleura,
# các đoạn phổi đều hở, không bịt nắp được vì hình dạng quá phức tạp).
THORACIC_KW = ["atrium", "ventricle", "pleura", "lung", "bronch", "trachea", "pericard"]
# Đốt sống KHÁC T12 (VD "Vertebra T10 1", T11, L1) cùng lỗi bbox chạm nhẹ
# Z_TOP/Z_BOT như tim/xương chậu — xác nhận thật (click trúng "Vertebra T10
# 1" khi xem từ trên xuống). Regex tránh nhầm "T1" khớp nhầm vào "T12".
def other_vertebra_name(nm):
    m = re.match(r"vertebra\s+([tl])(\d+)", nm.lower())
    if not m:
        return False
    return not (m.group(1) == "t" and m.group(2) == "12")
# Lớp KHÔNG bịt nắp (để hở nhìn vào trong): da/mạc + peritoneum (bao lớn che tạng).
NO_CAP_MAT = ["fascia", "superficial", "skin", "peritoneum"]

def limb_name(nm):
    low = nm.lower()
    return any(k in low for k in LIMB_KW)

def pelvic_name(nm):
    low = nm.lower()
    return any(k in low for k in PELVIC_KW)

def thoracic_name(nm):
    low = nm.lower()
    return any(k in low for k in THORACIC_KW)

def mat_is_wall(o):
    for m in o.data.materials:
        if m and any(k in m.name.lower() for k in NO_CAP_MAT):
            return True
    return False

def mat_base(o):
    if not o.data.materials or not o.data.materials[0]:
        return "misc"
    import re
    return re.sub(r"-\d+$", "", o.data.materials[0].name).strip() or "misc"

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

# TẠM TẮT: chuyển Curve mạch máu sang Mesh — verify thật cho thấy hình dạng
# bị phồng to bất thường quấn quanh cả thân (nghi bevel_object riêng của
# curve bị phóng to nhầm theo bevel_depth mới tăng, chưa rõ nguyên nhân kỹ
# hơn). Đã revert để phục hồi bản sạch trước đó — CHƯA bật lại cho tới khi
# điều tra kỹ và verify hình dạng đúng kích thước thật trước khi export.
# for vname in VESSEL_CURVE_NAMES:
#     vobj = bpy.data.objects.get(vname)
#     if not vobj or vobj.type != 'CURVE':
#         print("VESSEL NOTFOUND", vname); continue
#     if vobj.data.bevel_depth < 0.007:
#         vobj.data.bevel_depth = 0.009
#     with bpy.context.temp_override(active_object=vobj, object=vobj,
#                                     selected_objects=[vobj], selected_editable_objects=[vobj]):
#         bpy.ops.object.convert(target='MESH')
#     objs.append(vobj)
#     print("VESSEL CONVERTED", vobj.name)

kept = []
deleted = 0
for o in objs:
    try:
        (xmn,ymn,zmn),(xmx,ymx,zmx) = world_bbox(o)
    except Exception:
        continue
    xc = (xmn + xmx) / 2
    is_hero = o.name in HERO_NAMES
    # Xoá nếu: hẳn ngoài dải bụng / tâm lệch bên (tay-chân bên) / tên là chi.
    # Hero KHÔNG bị lọc theo X (VD Kidney.r có thể lệch phải hơn ngưỡng chung).
    if zmn > Z_TOP or zmx < Z_BOT or limb_name(o.name) or pelvic_name(o.name) or thoracic_name(o.name) or other_vertebra_name(o.name) or (not is_hero and abs(xc) > X_ARM):
        try:
            bpy.data.objects.remove(o, do_unlink=True); deleted += 1
        except: pass
        continue
    kept.append(o)
print("KEPT", len(kept), "DELETED", deleted)

def bisect_obj(o, do_cap, do_xclip=True):
    me = o.data
    bm = bmesh.new(); bm.from_mesh(me)
    mw = o.matrix_world; mwi = mw.inverted()
    planes = [
        (Vector((0,0,Z_TOP)),  Vector((0,0,1)),  True,  do_cap),
        (Vector((0,0,Z_BOT)),  Vector((0,0,1)),  False, False),
    ]
    if do_xclip:
        # BUG ĐÃ SỬA: 2 mặt cắt bên này trước đây luôn cap=False (không bịt
        # nắp) — với mesh nào bị lộ ra ở đúng mặt cắt X (VD cơ cạnh sống,
        # nhìn thấy từ một số góc) thì để hở thành vệt đen chạy dọc suốt
        # chiều cao. Dùng chung `do_cap` như mặt trên để bịt kín luôn.
        planes += [
            (Vector((X_CLIP,0,0)), Vector((1,0,0)),  True,  do_cap),
            (Vector((-X_CLIP,0,0)),Vector((1,0,0)),  False, do_cap),
        ]
    for co_w, no_w, keep_neg, cap in planes:
        co_local = mwi @ co_w
        no_local = (mwi.to_3x3() @ no_w).normalized()
        geom = bm.verts[:] + bm.edges[:] + bm.faces[:]
        res = bmesh.ops.bisect_plane(bm, geom=geom, dist=1e-6,
                                     plane_co=co_local, plane_no=no_local,
                                     clear_inner=(not keep_neg),
                                     clear_outer=keep_neg)
        if cap:
            cut = [e for e in res['geom_cut'] if isinstance(e, bmesh.types.BMEdge)]
            if cut:
                # edgeloop_fill chỉ xử lý đúng 1 vòng biên đơn giản — mặt cắt
                # cơ/xương phức tạp (nhiều vòng, lõm) hay làm nó FAIL ÂM THẦM
                # (không báo lỗi nhưng không tạo mặt nào) → để lại lỗ hở đen.
                # Kiểm tra thật số mặt tăng lên, không chỉ dựa vào exception.
                before = len(bm.faces)
                try: bmesh.ops.edgeloop_fill(bm, edges=cut)
                except Exception: pass
                if len(bm.faces) == before:
                    try: bmesh.ops.holes_fill(bm, edges=cut, sides=0)
                    except Exception: pass
                if len(bm.faces) == before:
                    try: bmesh.ops.triangle_fill(bm, edges=cut, use_beauty=True)
                    except Exception: pass
    # CHẨN ĐOÁN: quét biên hở (boundary edge, <2 mặt liền kề) còn sót SAU khi
    # đã thử bịt nắp — báo đúng tên object + hở ở mặt nào (trên/bên), để tìm
    # thủ phạm thật thay vì đoán mò rồi chạy lại nhiều lần.
    open_top = open_xclip = 0
    for e in bm.edges:
        if len(e.link_faces) < 2:
            mid_w = mw @ ((e.verts[0].co + e.verts[1].co) / 2)
            if abs(mid_w.z - Z_TOP) < 0.01:
                open_top += 1
            elif do_xclip and abs(abs(mid_w.x) - X_CLIP) < 0.01:
                open_xclip += 1
    if (open_top or open_xclip) and do_cap:
        print("OPEN_CAP", o.name, "top_edges", open_top, "xclip_edges", open_xclip)
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
        # Hero KHÔNG cắt X (giữ nguyên hình dạng thật để label/bbox chuẩn).
        bisect_obj(o, do_cap=not mat_is_wall(o), do_xclip=(o.name not in HERO_NAMES))
        capped += 1
    except Exception as e:
        print("BISECT FAIL", o.name, str(e)[:60])
print("CAPPED", capped)

for o in list(kept):
    if o.type=='MESH' and len(o.data.vertices)==0:
        try:
            bpy.data.objects.remove(o, do_unlink=True); kept.remove(o)
        except: pass

# KHÔNG gộp (join) theo tên material nữa: Z-Anatomy TÁI SỬ DỤNG tên material
# dùng chung giữa các cơ quan không liên quan (VD "Right atrium" từng dính
# material tên "Trapezius" của cơ lưng) — join theo tên material đã LÀM
# HỎNG GIẢI PHẪU (dính nhầm tim vào cơ lưng thành 1 khối). Giữ mỗi object
# riêng biệt, chỉ giảm poly từng cái — an toàn, không đổi danh tính mesh.
merged = [o for o in kept if o.name not in HERO_NAMES]
print("NON-HERO (giữ riêng, sẽ giảm poly)", len(merged))

# Giảm poly khối đã gộp (không phải hero) — decimate_collapse qua bmesh, ratio
# thấp vẫn đủ nhận diện hình khối/màu ở bối cảnh nền, không cần chi tiết mịn.
DECIMATE_RATIO = 0.35
decimated = 0
for o in merged:
    if o.name in HERO_NAMES:
        continue
    try:
        mod = o.modifiers.new(name="Decimate", type='DECIMATE')
        mod.ratio = DECIMATE_RATIO
        with bpy.context.temp_override(active_object=o, object=o, selected_objects=[o],
                                        selected_editable_objects=[o]):
            bpy.ops.object.modifier_apply(modifier=mod.name)
        decimated += 1
    except Exception as e:
        print("DECIMATE FAIL", o.name, str(e)[:80])
print("DECIMATED", decimated, "/", len(merged) - len(HERO_NAMES & {o.name for o in merged}))

final = [o for o in bpy.data.objects
         if o.type=='MESH' and (o in merged or o.name in HERO_NAMES) and len(o.data.vertices)>0]
for o in final:
    o.hide_viewport=False
    try: o.hide_set(False)
    except: pass
    o.select_set(True)
total_tris = sum(len(o.data.polygons) for o in final)
print("EXPORT", len(final), "approx_tris", total_tris)
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True,
    export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
    export_apply=False, export_yup=True)
print("DONE", out)
