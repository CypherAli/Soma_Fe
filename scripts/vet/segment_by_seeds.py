# PHÂN MẢNH LƯỚI THEO ĐIỂM MỒI — biến một khối quét liền thành các vùng tách được
#
#   blender -b --python segment_by_seeds.py -- in.glb out.glb seeds.json
#
# seeds.json: [{"id": "dogcat-trapezius", "position": [x, y, z]}, ...]
#   toạ độ theo hệ glTF và tính bằng ĐỘ LỆCH SO VỚI TÂM HỘP BAO, đúng như
#   `hotspot_probe.py` in ra và đúng như `softTissue.ts` lưu.
#
# ────────────────────────────────────────────────────────────────────────────
# VÌ SAO CẦN
#
# Mẫu quét thú y mở là MỘT lưới, MỘT vật liệu, tên mesh là "Object_0". Không có
# ranh giới nào trong dữ liệu để nói đây là cơ thang, kia là cơ lưng rộng — nên
# không ẩn được, không cô lập được, không bấm chọn được từng cơ như bên người.
#
# Tách theo mảnh hình học rời thì vô dụng: écorché mèo ra 9.050 mảnh, toàn vụn
# của phép quét.
#
# CÁCH LÀM Ở ĐÂY: mỗi cấu trúc đã đánh dấu là một ĐIỂM MỒI. Chạy Dijkstra ĐA
# NGUỒN trên đồ thị cạnh của lưới, mỗi đỉnh thuộc về điểm mồi gần nó nhất TÍNH
# THEO ĐƯỜNG ĐI TRÊN BỀ MẶT. Kết quả là một phân hoạch Voronoi trắc địa: các
# vùng bám theo hình khối thật của con vật.
#
# Vì sao phải là khoảng cách trên bề mặt chứ không phải khoảng cách thẳng: đo
# thẳng thì một điểm ở đùi trái "gần" điểm ở đùi phải hơn là gần điểm ở hông
# cùng bên, và vùng sẽ cắt xuyên qua thân con vật. Đi theo bề mặt thì hai chân
# tách nhau đúng như trên mẫu vật thật.
#
# ────────────────────────────────────────────────────────────────────────────
# ĐÂY LÀ VÙNG ƯỚC LƯỢNG, KHÔNG PHẢI RANH GIỚI GIẢI PHẪU
#
# Ranh giới giữa hai vùng nằm ở chỗ cách đều hai điểm mồi, không phải ở chỗ hai
# cơ thật sự giáp nhau. Vùng bám sát cơ thật đến đâu là tuỳ điểm mồi đặt khéo
# đến đâu. Trang phải nói thẳng điều này với người học — xem `partsApprox`
# trong `copy.ts`. Không được để ai tưởng đây là mesh gắn nhãn như Z-Anatomy.
#
# Điểm mồi đặt càng nhiều và càng đúng giữa bụng cơ thì vùng càng đúng. Cách
# kiểm: chạy xong, mở tệp ra render từng vùng một mà nhìn.

import bpy, sys, os, json, heapq
from mathutils import Vector

args = sys.argv[sys.argv.index('--') + 1:]
SRC, DST, SEEDS = os.path.abspath(args[0]), os.path.abspath(args[1]), os.path.abspath(args[2])

with open(SEEDS, encoding='utf-8') as f:
    seeds = json.load(f)
if len(seeds) < 2:
    raise SystemExit('[seg] cần ít nhất hai điểm mồi thì phân hoạch mới có nghĩa')

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=SRC)

meshes = [o for o in bpy.data.objects if o.type == 'MESH' and len(o.data.polygons)]
if not meshes:
    raise SystemExit('[seg] tệp không có lưới nào')

# Gộp về một đối tượng: mẫu quét hay bị cắt thành vài mesh chỉ vì giới hạn số
# đỉnh của định dạng, không phải vì chúng là bộ phận khác nhau. Muốn đường đi
# trên bề mặt chạy liên tục qua cả con vật thì phải gộp trước.
bpy.ops.object.select_all(action='DESELECT')
for o in meshes:
    o.select_set(True)
bpy.context.view_layer.objects.active = meshes[0]
if len(meshes) > 1:
    bpy.ops.object.join()
obj = bpy.context.view_layer.objects.active

mesh = obj.data

# Hàn các đỉnh trùng chỗ. Lưới xuất từ glTF tách đỉnh theo pháp tuyến và toạ độ
# ảnh, nên hai tam giác kề nhau có thể KHÔNG dùng chung đỉnh — đồ thị cạnh khi
# ấy đứt thành hàng nghìn mảnh và Dijkstra không đi qua được. Đây là chỗ dễ sai
# nhất của cả script: bỏ bước này thì chạy vẫn xong nhưng vùng ra lỗ chỗ.
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.remove_doubles(threshold=1e-5)
bpy.ops.object.mode_set(mode='OBJECT')

# Toạ độ THẾ GIỚI, không phải toạ độ cục bộ.
#
# ĐÃ MẮC RỒI MỚI THẤY: `hotspot_probe.py` đo bằng `o.matrix_world @ v.co`, còn
# `mesh.vertices[i].co` là hệ cục bộ. Bộ nhập glTF của Blender treo mesh dưới
# một nút gốc có phép xoay +90° quanh X, nên hai hệ hoán vị trục Y và Z —
# điểm mồi rơi lung tung mà script vẫn chạy xong, chỉ có phân hoạch là vô nghĩa.
# Dấu hiệu nhận ra: hộp bao in ra không khớp với hộp bao probe in.
#
# Thử `transform_apply` để nướng phép xoay vào đỉnh thì KHÔNG chữa được, vì phép
# xoay nằm ở nút cha chứ không ở chính đối tượng. Đọc thẳng ma trận thế giới mới
# đúng, và cũng là cách probe làm.
mw = obj.matrix_world
verts = [mw @ v.co for v in mesh.vertices]
n = len(verts)
print(f'[seg] {n} đỉnh · {len(mesh.polygons)} mặt · {len(seeds)} điểm mồi')

# Đồ thị kề: mỗi cạnh của lưới là một cung hai chiều, trọng số là độ dài thật.
adj = [[] for _ in range(n)]
for e in mesh.edges:
    a, b = e.vertices
    w = (verts[a] - verts[b]).length
    adj[a].append((b, w))
    adj[b].append((a, w))

# ── VỎ RỜI ──────────────────────────────────────────────────────────────────
#
# Đo ra mới biết: écorché mèo KHÔNG phải một mặt liền mà là 402 vỏ rời, mỗi vỏ
# là một mảnh cơ được điêu khắc riêng. Đó là món quà — ranh giới giữa các mảnh
# CHÍNH LÀ ranh giới cơ mà người tạc mẫu đã dựng, chuẩn hơn bất cứ phép cắt nào
# ta tự nghĩ ra.
#
# Nên thuật toán chạy hai tầng:
#   1. Vỏ nào CHỨA điểm mồi → chạy Dijkstra trong vỏ ấy để chia (hiếm, chỉ xảy
#      ra khi hai cấu trúc nằm trên cùng một mảnh liền).
#   2. Vỏ nào KHÔNG chứa điểm mồi nào → gán TRỌN VỎ cho điểm mồi gần nó nhất,
#      đo bằng khoảng cách tới đỉnh gần nhất của vỏ chứ không phải tới trọng tâm
#      (mảnh cơ dài như cơ lưng rộng có trọng tâm nằm xa cả hai đầu).
#
# Gán trọn vỏ nghĩa là KHÔNG BAO GIỜ cắt ngang một mảnh cơ — thứ mà phép Voronoi
# thuần trên bề mặt vẫn làm, và làm rất xấu.
comp = [-1] * n
shells = []
for start in range(n):
    if comp[start] >= 0:
        continue
    idx = len(shells)
    stack = [start]
    comp[start] = idx
    members = []
    while stack:
        u = stack.pop()
        members.append(u)
        for v, _ in adj[u]:
            if comp[v] < 0:
                comp[v] = idx
                stack.append(v)
    shells.append(members)
print(f'[seg] bề mặt gồm {len(shells)} vỏ rời, vỏ lớn nhất {max(len(x) for x in shells)} đỉnh')

# Toạ độ điểm mồi: seeds ghi theo hệ glTF và lệch so với tâm hộp bao, phải đổi
# về hệ Blender rồi cộng tâm lại. Nghịch đảo của phép `to_gltf` trong
# hotspot_probe.py: gltf (x, y, z) → blender (x, -z, y).
mn = Vector((min(v.x for v in verts), min(v.y for v in verts), min(v.z for v in verts)))
mx = Vector((max(v.x for v in verts), max(v.y for v in verts), max(v.z for v in verts)))
centre = (mn + mx) / 2
span = max(mx - mn)
print(f'[seg] hộp bao {(mx - mn).x:.3f} x {(mx - mn).y:.3f} x {(mx - mn).z:.3f}')

targets = []
for s_ in seeds:
    gx, gy, gz = s_['position']
    targets.append(centre + Vector((gx, -gz, gy)))

# Đỉnh nguồn của mỗi điểm mồi và vỏ chứa nó.
label = [-1] * n
seed_vert = []
for i, target in enumerate(targets):
    best, bd = 0, float('inf')
    for vi, co in enumerate(verts):
        d = (co - target).length_squared
        if d < bd:
            bd, best = d, vi
    seed_vert.append(best)
    print(f"[seg]   mồi {i}: {seeds[i]['id']:34} → vỏ {comp[best]:4}, lệch {bd ** 0.5:.4f}")

# Tầng 1 — vỏ có điểm mồi: Dijkstra giới hạn trong vỏ.
seeds_of_shell = {}
for i, vi in enumerate(seed_vert):
    seeds_of_shell.setdefault(comp[vi], []).append(i)

dist = [float('inf')] * n
heap = []
for si, members in seeds_of_shell.items():
    for i in members:
        vi = seed_vert[i]
        dist[vi] = 0.0
        label[vi] = i
        heapq.heappush(heap, (0.0, vi))
while heap:
    d, u = heapq.heappop(heap)
    if d > dist[u]:
        continue
    lu = label[u]
    for v, w in adj[u]:
        nd = d + w
        if nd < dist[v]:
            dist[v] = nd
            label[v] = lu
            heapq.heappush(heap, (nd, v))

# Tầng 2 — vỏ không có điểm mồi: gán trọn vỏ.
loose = 0
for si, members in enumerate(shells):
    if si in seeds_of_shell:
        continue
    loose += 1
    best_i, best_d = 0, float('inf')
    for vi in members:
        co = verts[vi]
        for i, t in enumerate(targets):
            d = (co - t).length_squared
            if d < best_d:
                best_d, best_i = d, i
    for vi in members:
        label[vi] = best_i
print(f'[seg] {loose} vỏ không chứa điểm mồi, gán trọn vỏ theo khoảng cách gần nhất')

# Vật liệu: MỘT vật liệu cho mỗi vùng, TÊN đặt đúng bằng `factId`. Bên web gom
# mesh theo tên vật liệu (xem VetModelPart trong lib/vet/types.ts), nên tên ở
# đây chính là khoá nối vùng hình học với mục tri thức.
# Vật liệu: MỘT vật liệu cho mỗi vùng, TÊN đặt đúng bằng `factId`. Bên web gom
# mesh theo tên vật liệu (xem VetModelPart trong lib/vet/types.ts), nên tên ở
# đây chính là khoá nối vùng hình học với mục tri thức.
#
# SAO CHÉP vật liệu gốc chứ không tạo mới: mẫu có ảnh bề mặt (chi trước bò, sọ
# ngựa) mà tạo vật liệu trắng thì mất sạch ảnh, mẫu vật thành khối nhựa trơn.
# `material.copy()` mang theo cả cây node nên texture, độ nhám, tất cả đều còn.
base = mesh.materials[0] if len(mesh.materials) else None
mesh.materials.clear()
for si, s in enumerate(seeds):
    m = base.copy() if base is not None else bpy.data.materials.new(s["id"])
    m.name = s["id"]
    if base is None:
        m.use_nodes = True
    # Nhích màu một phần nghìn cho mỗi vùng.
    #
    # KHÔNG phải để nhìn: mắt không thấy nổi mức này, và việc tô màu là chuyện
    # của bên web. Đây là để các lệnh gộp trùng lặp KHỎI nhập 14 vật liệu giống
    # hệt nhau làm một — mất sạch nhãn vùng vừa cắt mà không báo gì.
    if m.use_nodes:
        bsdf = m.node_tree.nodes.get("Principled BSDF")
        if bsdf:
            c = list(bsdf.inputs["Base Color"].default_value)
            c[2] = min(1.0, c[2] + si * 0.002)
            bsdf.inputs["Base Color"].default_value = c
    mesh.materials.append(m)

# Mặt thuộc vùng nào: bỏ phiếu theo các đỉnh của nó. Hoà thì lấy đỉnh đầu —
# mặt hoà phiếu bao giờ cũng nằm ngay trên đường ranh, xếp về bên nào cũng được.
counts = [0] * len(seeds)
for p in mesh.polygons:
    tally = {}
    for vi in p.vertices:
        l = label[vi]
        tally[l] = tally.get(l, 0) + 1
    win = max(tally.items(), key=lambda kv: kv[1])[0]
    p.material_index = win
    counts[win] += 1

total = len(mesh.polygons)
for i, s in enumerate(seeds):
    print(f"[seg]   {s['id']:34} {counts[i]:7} mặt  ({counts[i] / total * 100:4.1f}%)")
empty = [seeds[i]['id'] for i, c in enumerate(counts) if c == 0]
if empty:
    # Vùng rỗng nghĩa là điểm mồi ấy bị điểm mồi khác nuốt trọn — đặt quá gần
    # nhau. Báo to chứ không im lặng: bên web sẽ hiện một bộ phận bấm vào không
    # thấy gì.
    print('[seg] CẢNH BÁO — vùng rỗng: ' + ', '.join(empty))

bpy.ops.export_scene.gltf(
    filepath=DST,
    export_format='GLB',
    export_materials='EXPORT',
    export_apply=True,
)
print(f'[seg] ĐÃ GHI {DST}')
