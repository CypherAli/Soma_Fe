"""Vá hình học cho .glb đời cũ: hàn đỉnh, lấp lỗ nhỏ, tính lại pháp tuyến.

    blender --background --python repair_glb_geometry.py -- <vao.glb> <ra.glb>

Model xuất tháng 7/2026 (bằng cut_*.py và export_system.py) KHÔNG qua bước hàn
đỉnh: nhiều mesh là các tam giác RỜI RẠC hoàn toàn — cơ chéo bụng ngoài có
88.540 cạnh hở trên 29.534 mặt, đúng bằng 3 cạnh mỗi tam giác. Cộng thêm các lỗ
do bước cắt để lại, viewer render MỘT MẶT nên nhìn xuyên qua chỗ thủng vào lòng
khối và ra thành mảng ĐEN trên mô hình.

Ba bước, đúng thứ tự:
 1. remove_doubles  — nối các tam giác rời thành mặt liền;
 2. holes_fill      — chỉ vá lỗ viền tối đa 8 cạnh, để nguyên miệng ống và mặt
                      cắt lớn (vá cả những chỗ đó là bịt kín lòng ruột, lòng mạch);
 3. recalc_face_normals — quay pháp tuyến ra ngoài sau khi đã liền mặt.

Đo trên abdomen_section.glb: 121.767 -> 9.130 cạnh hở, mảng đen biến mất.
KHÔNG cần chạy cho model xuất bằng export_region.py — pipeline đó đã làm sẵn.
"""
import bpy, bmesh, sys, os
a = sys.argv[sys.argv.index('--')+1:]
src, dst = os.path.abspath(a[0]), os.path.abspath(a[1])
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
b4 = af = 0
for o in [x for x in bpy.data.objects if x.type == 'MESH']:
    bm = bmesh.new(); bm.from_mesh(o.data)
    b4 += sum(1 for e in bm.edges if len(e.link_faces) == 1)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    # vá các lỗ nhỏ do bước cắt cũ để lại (viền tối đa 8 cạnh)
    holes = [e for e in bm.edges if len(e.link_faces) == 1]
    if holes:
        bmesh.ops.holes_fill(bm, edges=holes, sides=8)
        bmesh.ops.triangulate(bm, faces=[f for f in bm.faces if len(f.verts) > 3])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    af += sum(1 for e in bm.edges if len(e.link_faces) == 1)
    bm.to_mesh(o.data); bm.free(); o.data.update()
print(f"FILL canh ho: {b4} -> {af}")
bpy.ops.export_scene.gltf(filepath=dst, export_format='GLB', export_draco_mesh_compression_enable=True,
                          export_apply=True, export_yup=True)
