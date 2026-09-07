# Đo silhouette THẬT của skull.glb qua mọi góc camera OrbitControls cho phép.
#
# Điểm mấu chốt: <Center> đặt TÂM BBOX vào gốc, và Bounds fit ngắm vào gốc đó,
# nên khung hình đối xứng quanh tâm bbox. Ràng buộc không phải (max-min) mà là
# 2*max(|độ lệch so với tâm|) — mesh lệch tâm thì phía dài hơn bị cắt trước.
#
# Blender importer đổi Y-up -> Z-up, nên up ở đây là +Z.
import bpy, sys, math

argv = sys.argv[sys.argv.index("--") + 1:]
glb = argv[0]

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb)

verts = []
deps = bpy.context.evaluated_depsgraph_get()
for ob in bpy.context.scene.objects:
    if ob.type != 'MESH':
        continue
    ev = ob.evaluated_get(deps)
    me = ev.to_mesh()
    mw = ob.matrix_world
    for v in me.vertices:
        co = mw @ v.co
        verts.append((co.x, co.y, co.z))
    ev.to_mesh_clear()

xs = [v[0] for v in verts]; ys = [v[1] for v in verts]; zs = [v[2] for v in verts]
sx, sy, sz = max(xs)-min(xs), max(ys)-min(ys), max(zs)-min(zs)
cx, cy, cz = (min(xs)+max(xs))/2, (min(ys)+max(ys))/2, (min(zs)+max(zs))/2
ms = max(sx, sy, sz)
print("verts: %d" % len(verts))
print("THREE_BBOX width=%.4f height=%.4f depth=%.4f  maxSize=%.4f" % (sx, sz, sy, ms))

P = [(v[0]-cx, v[1]-cy, v[2]-cz) for v in verts]

# polar mặc định: camera [0,0.1,2.8] -> acos(0.1/|v|)
DEFAULT_POLAR = math.acos(0.1 / math.sqrt(0.1**2 + 2.8**2))
POLAR = {("%ddeg" % d): math.radians(d) for d in range(66, 111, 2)}
POLAR["default(%.1fdeg)" % math.degrees(DEFAULT_POLAR)] = DEFAULT_POLAR

def sweep(pol):
    """Trả về (extent dọc lớn nhất, nửa-chiều-cao cần, nửa-chiều-rộng cần)."""
    st, ct = math.sin(pol), math.cos(pol)
    ext_v = half_v = half_h = 0.0
    at = None
    for deg in range(0, 360, 2):
        a = math.radians(deg)
        ex, ey, ez = st*math.sin(a), st*math.cos(a), ct
        fx, fy, fz = -ex, -ey, -ez
        rx, ry = -fy, fx
        rl = math.hypot(rx, ry) or 1.0
        rx, ry = rx/rl, ry/rl
        ux, uy, uz = -fz*ry, fz*rx, fx*ry - fy*rx
        vmin = hmin = 1e9; vmax = hmax = -1e9
        for (px, py, pz) in P:
            h = px*rx + py*ry
            v = px*ux + py*uy + pz*uz
            if v < vmin: vmin = v
            if v > vmax: vmax = v
            if h < hmin: hmin = h
            if h > hmax: hmax = h
        if vmax - vmin > ext_v:
            ext_v = vmax - vmin
        hv = max(abs(vmax), abs(vmin))
        if hv > half_v:
            half_v, at = hv, deg
        half_h = max(half_h, abs(hmax), abs(hmin))
    return ext_v, half_v, half_h, at

print("")
print("%-16s %10s %10s %10s %10s" % ("polar", "ext(max-min)", "2*halfV", "2*halfH", "yaw"))
worst = 0.0
for name, pol in POLAR.items():
    ev_, hv, hh, at = sweep(pol)
    need = 2*hv
    worst = max(worst, need)
    print("%-16s %10.4f %10.4f %10.4f %10s   need/maxSize=%.3f  skew=%.1f%%"
          % (name, ev_, need, 2*hh, at, need/ms, (need/ev_ - 1)*100))

print("")
print("REQUIRED_MARGIN_MIN %.4f  (= 2*maxHalfV / maxSize)" % (worst/ms))
