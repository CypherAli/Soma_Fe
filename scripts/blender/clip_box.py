"""Cắt mesh theo hộp/mặt phẳng — dùng chung cho MỌI script export vùng.

Vì sao có file này: bản cắt đầu tiên (viết lặp lại trong export_arm_v3,
export_forearm, export_shoulder, export_neck, export_trunk, export_head và cả
export_region) chỉ XOÁ NGUYÊN MẶT TAM GIÁC nào có tâm nằm ngoài hộp. Hai hậu
quả nhìn thấy ngay trên ảnh chụp model:

  1. Mép cắt răng cưa "tua rua" theo đúng hình tam giác của lưới, không phải
     một đường thẳng như tiêu bản giải phẫu.
  2. Bụng cơ bị cắt để HỞ thành ống rỗng — nhìn xuyên vào trong thấy mặt sau,
     mà scene web dựng FrontSide nên chỗ đó thành mảng đen.

Cách đúng: `bisect_plane` chia đôi đúng những tam giác vắt qua mặt phẳng (mép
thẳng tuyệt đối) rồi `holes_fill` vá vòng cạnh vừa cắt thành MẶT NẮP phẳng.
Phải tính lại pháp tuyến sau khi vá, nếu không mặt nắp quay ngược.
"""

import bmesh
from mathutils import Vector


def clip_planes(o, planes):
    """Cắt object `o` bằng danh sách mặt phẳng, mỗi mặt là (điểm, pháp tuyến).

    Pháp tuyến hướng RA NGOÀI phần muốn giữ lại — phần nằm phía pháp tuyến bị
    cắt bỏ. Toạ độ của `planes` là toạ độ THẾ GIỚI.
    """
    me = o.data
    mw = o.matrix_world
    try:
        inv = mw.inverted()
    except ValueError:
        return  # ma trận suy biến (scale 0): thà không cắt còn hơn làm hỏng mesh
    bm = bmesh.new()
    bm.from_mesh(me)
    bm.transform(mw)
    for co, no in planes:
        geom = bm.verts[:] + bm.edges[:] + bm.faces[:]
        if not geom:
            break
        res = bmesh.ops.bisect_plane(
            bm, geom=geom, dist=1e-6,
            plane_co=Vector(co), plane_no=Vector(no),
            clear_outer=True,
        )
        cut = [e for e in res.get("geom_cut", []) if isinstance(e, bmesh.types.BMEdge)]
        if cut:
            # sides=0 vá mọi vòng cạnh hở. Tấm mỏng (cân, dây chằng, màng) cắt
            # ra chỉ còn một đường hở không khép kín nên không sinh mặt thừa.
            try:
                bmesh.ops.holes_fill(bm, edges=cut, sides=0)
            except RuntimeError:
                pass
    loose = [v for v in bm.verts if not v.link_faces]
    if loose:
        # Xoá đỉnh mồ côi là BẮT BUỘC: để lại thì bbox mesh vẫn trải dài tới vị
        # trí cũ, khiến bước bọc da voxel remesh vượt hạn mức độ phân giải.
        bmesh.ops.delete(bm, geom=loose, context='VERTS')
    if bm.faces:
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    bm.transform(inv)
    bm.to_mesh(me)
    bm.free()


def box_planes(x0, x1, y0, y1, z0, z1, margin=0.0):
    """Sáu mặt của hộp cắt, pháp tuyến hướng ra ngoài."""
    return (
        (Vector((x0 - margin, 0, 0)), Vector((-1, 0, 0))),
        (Vector((x1 + margin, 0, 0)), Vector((1, 0, 0))),
        (Vector((0, y0 - margin, 0)), Vector((0, -1, 0))),
        (Vector((0, y1 + margin, 0)), Vector((0, 1, 0))),
        (Vector((0, 0, z0 - margin)), Vector((0, 0, -1))),
        (Vector((0, 0, z1 + margin)), Vector((0, 0, 1))),
    )


def clip_box(o, x0, x1, y0, y1, z0, z1, margin=0.0):
    clip_planes(o, box_planes(x0, x1, y0, y1, z0, z1, margin))


def ellipse_z_planes(cx, cy, rx, ry, n=28):
    """Xấp xỉ TRỤ ELIP đứng bằng n mặt phẳng tiếp tuyến (pháp tuyến hướng ra).

    bisect_plane chỉ cắt được theo mặt phẳng, nên trụ elip (dùng cho vùng cổ và
    thân mình) được thay bằng đa giác ngoại tiếp. n=28 thì sai lệch bán kính
    dưới 0,7% — mắt thường không thấy cạnh, mà vẫn được mép cắt thẳng và có nắp.
    """
    import math
    planes = []
    for i in range(n):
        t = 2 * math.pi * i / n
        px = cx + rx * math.cos(t)
        py = cy + ry * math.sin(t)
        nx = math.cos(t) / rx
        ny = math.sin(t) / ry
        ln = math.hypot(nx, ny) or 1.0
        planes.append((Vector((px, py, 0.0)), Vector((nx / ln, ny / ln, 0.0))))
    return planes


def clip_ellipse_z(o, cx, cy, rx, ry, z_lo=None, z_hi=None, n=28):
    planes = list(ellipse_z_planes(cx, cy, rx, ry, n))
    if z_hi is not None:
        planes.append((Vector((0, 0, z_hi)), Vector((0, 0, 1))))
    if z_lo is not None:
        planes.append((Vector((0, 0, z_lo)), Vector((0, 0, -1))))
    clip_planes(o, planes)


def clip_above_z(o, z, margin=0.0):
    """Cắt bỏ phần CAO hơn mặt phẳng z (dùng cho cắt ngang khuỷu, cổ…)."""
    clip_planes(o, ((Vector((0, 0, z + margin)), Vector((0, 0, 1))),))


def clip_below_z(o, z, margin=0.0):
    clip_planes(o, ((Vector((0, 0, z - margin)), Vector((0, 0, -1))),))
