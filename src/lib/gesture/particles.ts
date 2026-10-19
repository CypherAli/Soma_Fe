import * as THREE from "three";

// CHẤM SÁNG KIỂU WONDERSNAP — hạt lấy mẫu trên mặt mesh, gom/tan theo cử chỉ.
// Thuần three.js (không React) để cả hai viewer (atlas + .glb) dùng chung.
// Mọi thứ chạy qua ref + uniform trong useFrame: KHÔNG setState mỗi khung hình.

/** Tổng số hạt cho một mô hình atlas (máy đồ án khỏe, không cần nương tay). */
export const PARTICLE_BUDGET_ATLAS = 150000;
/** Mô hình .glb: một đám hạt chung cho cả cây cảnh. */
export const PARTICLE_BUDGET_GLB = 100000;
export const MIN_PER_GROUP = 400;
/** Thời gian tan/gom (giây) — ngang DISSOLVE của WonderSnap (~1,2 s). */
export const SCATTER_TAU = 0.35;

const smooth01 = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Mesh mờ dần khi hạt bay ra (giữ lại lớp mờ 0,14 của bảng lớp). */
export const meshFadeOf = (k: number) => 1 - smooth01(0, 0.55, k);
/** Hạt hiện lên lúc bay ra, mờ dần ở chót để "tan biến" hẳn. */
export const dotsOpacityOf = (k: number) => smooth01(0.02, 0.15, k) * (1 - smooth01(0.7, 1, k));

export type ScatterState = { value: number; target: number };

/** Tiến mượt value → target theo thời gian thật. */
export function stepScatter(s: ScatterState, delta: number): void {
  s.value += (s.target - s.value) * (1 - Math.exp(-delta / SCATTER_TAU));
  if (Math.abs(s.target - s.value) < 1e-3) s.value = s.target;
}

const _va = new THREE.Vector3();
const _vb = new THREE.Vector3();
const _vc = new THREE.Vector3();

function triArea(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): number {
  const abx = b.x - a.x, aby = b.y - a.y, abz = b.z - a.z;
  const acx = c.x - a.x, acy = c.y - a.y, acz = c.z - a.z;
  const cx = aby * acz - abz * acy, cy = abz * acx - abx * acz, cz = abx * acy - aby * acx;
  return 0.5 * Math.hypot(cx, cy, cz);
}

/**
 * Lấy mẫu đều trên mặt lưới (theo diện tích tam giác) rồi biến đổi bằng
 * `matrix`. Trả về vị trí + hạt giống ngẫu nhiên (hướng bay xyz, w = 0..1).
 */
export function sampleSurfacePoints(
  geometry: THREE.BufferGeometry,
  matrix: THREE.Matrix4,
  count: number,
): { positions: Float32Array; seeds: Float32Array } {
  const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
  const idx = geometry.getIndex();
  const triCount = Math.floor((idx ? idx.count : pos.count) / 3);
  const positions = new Float32Array(Math.max(count, 1) * 3);
  const seeds = new Float32Array(Math.max(count, 1) * 4);
  if (triCount <= 0 || count <= 0) return { positions, seeds };
  const cum = new Float64Array(triCount);
  let total = 0;
  const get = (vi: number, out: THREE.Vector3) => {
    out.set(pos.getX(vi), pos.getY(vi), pos.getZ(vi)).applyMatrix4(matrix);
    return out;
  };
  for (let t = 0; t < triCount; t++) {
    const a = idx ? idx.getX(t * 3) : t * 3;
    const b = idx ? idx.getX(t * 3 + 1) : t * 3 + 1;
    const c = idx ? idx.getX(t * 3 + 2) : t * 3 + 2;
    total += triArea(get(a, _va), get(b, _vb), get(c, _vc));
    cum[t] = total;
  }
  if (total <= 1e-9) return { positions, seeds };
  for (let n = 0; n < count; n++) {
    const r = Math.random() * total;
    let lo = 0, hi = triCount - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] < r) lo = mid + 1;
      else hi = mid;
    }
    const a = idx ? idx.getX(lo * 3) : lo * 3;
    const b = idx ? idx.getX(lo * 3 + 1) : lo * 3 + 1;
    const c = idx ? idx.getX(lo * 3 + 2) : lo * 3 + 2;
    get(a, _va);
    get(b, _vb);
    get(c, _vc);
    const r1 = Math.random(), r2 = Math.random();
    const s1 = Math.sqrt(r1), u = 1 - s1, v = s1 * (1 - r2), w = s1 * r2;
    positions[n * 3] = _va.x * u + _vb.x * v + _vc.x * w;
    positions[n * 3 + 1] = _va.y * u + _vb.y * v + _vc.y * w;
    positions[n * 3 + 2] = _va.z * u + _vb.z * v + _vc.z * w;
    // Hướng bay ngẫu nhiên (phân phối cầu) + hệ số cự ly/kích cỡ.
    let dx = Math.random() * 2 - 1, dy = Math.random() * 2 - 1, dz = Math.random() * 2 - 1;
    const l = Math.hypot(dx, dy, dz) || 1;
    dx /= l;
    dy /= l;
    dz /= l;
    seeds[n * 4] = dx;
    seeds[n * 4 + 1] = dy;
    seeds[n * 4 + 2] = dz;
    seeds[n * 4 + 3] = Math.random();
  }
  return { positions, seeds };
}

export type ScatterUniforms = {
  uScatter: { value: number };
  uOpacity: { value: number };
  uColor: { value: THREE.Color };
  uSize: { value: number };
  uSpread: { value: number };
  uTime: { value: number };
};

/** Chất liệu chấm phát sáng (cộng sáng, sprite tròn mềm, nhấp nháy nhẹ). */
export function makeScatterMaterial(color: THREE.ColorRepresentation, spread: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uScatter: { value: 0 },
      uOpacity: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uSize: { value: 7 },
      uSpread: { value: spread },
      uTime: { value: 0 },
    } as ScatterUniforms,
    vertexShader: /* glsl */ `
      attribute vec4 aSeed;
      uniform float uScatter;
      uniform float uSpread;
      uniform float uSize;
      varying float vTw;
      void main() {
        vec3 p = position + aSeed.xyz * (uScatter * uSpread * (0.3 + 0.7 * aSeed.w));
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float dist = max(-mv.z, 0.1);
        gl_PointSize = uSize * (0.5 + 0.9 * aSeed.w) / dist;
        vTw = aSeed.w;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uTime;
      varying float vTw;
      void main() {
        // Chấm đặc màu nhóm, viền mềm — che nhau chứ không cộng sáng nên chỗ
        // dày vẫn giữ màu như WonderSnap, không cháy trắng.
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.18, d) * uOpacity;
        if (a < 0.01) discard;
        float tw = 0.9 + 0.1 * sin(uTime * 2.6 + vTw * 43.0);
        gl_FragColor = vec4(uColor * tw, a);
      }
    `,
    transparent: true,
    depthWrite: true,
    blending: THREE.NormalBlending,
  });
}

/** Đám hạt từ dữ liệu lấy mẫu — tắt kiểm tra biên (hạt bay ra ngoài hộp). */
export function makeScatterPoints(
  data: { positions: Float32Array; seeds: Float32Array },
  color: THREE.ColorRepresentation,
  spread: number,
): THREE.Points {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
  g.setAttribute("aSeed", new THREE.BufferAttribute(data.seeds, 4));
  const p = new THREE.Points(g, makeScatterMaterial(color, spread));
  p.frustumCulled = false;
  p.visible = false;
  p.renderOrder = 20;
  return p;
}

/**
 * Cỡ điểm (pixel) cho dot cỡ `worldSize` ở khoảng cách đơn vị — nhân với
 * chiều cao bộ đệm vẽ và fov để dot to đều mọi màn hình.
 */
export function fitPointSize(gl: THREE.WebGLRenderer, camera: THREE.Camera, worldSize: number): number {
  const size = new THREE.Vector2();
  gl.getDrawingBufferSize(size);
  const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 40;
  return (worldSize * size.y) / (2 * Math.tan((fov * Math.PI) / 180));
}
