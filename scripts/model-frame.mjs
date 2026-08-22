// KHUNG HÌNH CHUẨN CỦA MỘT MODEL — đọc thẳng .glb, không cần three.js/Blender.
//
// Vì sao phải có file này: trước đây mỗi nơi tự canh khung một kiểu — viewer
// dùng <Bounds fit> của drei (canh theo mesh nào ĐANG mount), còn ảnh thumbnail
// dùng công thức riêng trong render_glb_preview.py. Hai công thức khác nhau cho
// ra hai khung hình khác nhau, và cả hai đều phụ thuộc vào hộp bao TOÀN BỘ, nên
// chỉ cần lần xuất sau lọt thêm một sợi thần kinh trườn ra ngoài vùng là cả mô
// hình bị đẩy lệch và thu nhỏ lại. Đó chính là chuyện "mỗi lần dựng lại xem
// khác nhau".
//
// Cách chữa: tính khung hình MỘT LẦN ở đây, cất vào modelFrames.json, mọi nơi
// khác chỉ việc đọc.
//
// Khung hình dùng hộp bao THEO PHÂN VỊ có trọng số, không phải hộp bao tuyệt
// đối: mỗi primitive góp 8 đỉnh hộp bao của nó, nặng bằng số đỉnh lưới của nó.
// Một sợi mạch lạc chỉ vài trăm đỉnh sẽ bị cắt khỏi phân vị, còn khối cơ hay
// lớp da hàng chục nghìn đỉnh thì quyết định khung. Thuần hình học, KHÔNG đọc
// tên mesh — cố ý: luật phân lớp theo tên (`pickCat`) đã hai lần trôi lệch giữa
// viewer và trình render ảnh, đây là chỗ không được phép lệch nữa.

import { readFileSync } from "node:fs";

/** Cắt bao nhiêu phần trăm khối lượng đỉnh ở mỗi đầu trục. */
export const TRIM = 0.01;
/** Nới khung ra một chút để cấu trúc mảnh vừa bị cắt vẫn nằm trong hình. */
export const FRAME_PAD = 1.06;

function mul(a, b) {
  const o = new Array(16);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
      o[c * 4 + r] = s;
    }
  return o;
}

function trs(n) {
  if (n.matrix) return n.matrix;
  const t = n.translation || [0, 0, 0];
  const [x, y, z, w] = n.rotation || [0, 0, 0, 1];
  const s = n.scale || [1, 1, 1];
  const x2 = x + x, y2 = y + y, z2 = z + z;
  const xx = x * x2, xy = x * y2, xz = x * z2;
  const yy = y * y2, yz = y * z2, zz = z * z2;
  const wx = w * x2, wy = w * y2, wz = w * z2;
  return [
    (1 - (yy + zz)) * s[0], (xy + wz) * s[0], (xz - wy) * s[0], 0,
    (xy - wz) * s[1], (1 - (xx + zz)) * s[1], (yz + wx) * s[1], 0,
    (xz + wy) * s[2], (yz - wx) * s[2], (1 - (xx + yy)) * s[2], 0,
    t[0], t[1], t[2], 1,
  ];
}

const applyM = (m, p) => [
  m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12],
  m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13],
  m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14],
];

/** Đọc chunk JSON của .glb. */
export function readGlb(file) {
  const buf = readFileSync(file);
  if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error(`${file}: không phải .glb`);
  const jsonLen = buf.readUInt32LE(12);
  return { json: JSON.parse(buf.subarray(20, 20 + jsonLen).toString("utf8")), bytes: buf.length };
}

/**
 * Liệt kê primitive kèm hộp bao ĐÃ ĐƯA VỀ TOẠ ĐỘ THẾ GIỚI và số đỉnh.
 *
 * Đọc `min`/`max` của accessor POSITION chứ không giải nén hình học: glTF bắt
 * buộc phải có hai trường này, kể cả khi lưới nén Draco — nhờ vậy đo được file
 * đã nén mà không cần bộ giải nén.
 */
export function primitives(json) {
  const out = [];
  const walk = (idx, parent) => {
    const n = json.nodes[idx];
    const m = mul(parent, trs(n));
    if (n.mesh !== undefined) {
      for (const p of json.meshes[n.mesh].primitives || []) {
        const a = json.accessors[p.attributes?.POSITION];
        if (!a?.min || !a?.max) continue;
        const lo = [Infinity, Infinity, Infinity];
        const hi = [-Infinity, -Infinity, -Infinity];
        for (let i = 0; i < 8; i++) {
          const w = applyM(m, [
            i & 1 ? a.max[0] : a.min[0],
            i & 2 ? a.max[1] : a.min[1],
            i & 4 ? a.max[2] : a.min[2],
          ]);
          for (let k = 0; k < 3; k++) {
            if (w[k] < lo[k]) lo[k] = w[k];
            if (w[k] > hi[k]) hi[k] = w[k];
          }
        }
        out.push({ name: n.name || "", lo, hi, verts: a.count || 0, tris: triCount(json, p) });
      }
    }
    for (const c of n.children || []) walk(c, m);
  };
  const I = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  for (const root of json.scenes?.[json.scene ?? 0]?.nodes || []) walk(root, I);
  return out;
}

function triCount(json, prim) {
  const acc = prim.indices !== undefined ? json.accessors[prim.indices] : json.accessors[prim.attributes.POSITION];
  return Math.floor((acc?.count || 0) / 3);
}

/** Phân vị có trọng số trên một trục. */
function weightedQuantile(points, q) {
  const sorted = [...points].sort((a, b) => a.v - b.v);
  const total = sorted.reduce((s, p) => s + p.w, 0);
  if (!total) return sorted.length ? sorted[0].v : 0;
  let acc = 0;
  for (const p of sorted) {
    acc += p.w;
    if (acc >= total * q) return p.v;
  }
  return sorted[sorted.length - 1].v;
}

/**
 * Khung hình chuẩn của model.
 *
 * `box` là hộp bao tuyệt đối (dùng để kiểm tra, ví dụ model có bị lệch trục
 * không); `frame` là hộp đã cắt phân vị — đây mới là thứ camera bám theo.
 */
export function frameOf(file) {
  const { json, bytes } = readGlb(file);
  const prims = primitives(json);
  if (!prims.length) throw new Error(`${file}: không có primitive nào có POSITION.min`);

  const lo = [Infinity, Infinity, Infinity];
  const hi = [-Infinity, -Infinity, -Infinity];
  for (const p of prims)
    for (let k = 0; k < 3; k++) {
      if (p.lo[k] < lo[k]) lo[k] = p.lo[k];
      if (p.hi[k] > hi[k]) hi[k] = p.hi[k];
    }

  const fLo = [0, 0, 0];
  const fHi = [0, 0, 0];
  for (let k = 0; k < 3; k++) {
    const pts = [];
    for (const p of prims) {
      const w = Math.max(1, p.verts);
      pts.push({ v: p.lo[k], w }, { v: p.hi[k], w });
    }
    fLo[k] = weightedQuantile(pts, TRIM);
    fHi[k] = weightedQuantile(pts, 1 - TRIM);
    // Phân vị có thể nuốt trọn một trục dẹt (model phẳng như hoành cách mô):
    // rơi về hộp thật để khung không bao giờ mỏng bằng không.
    if (!(fHi[k] > fLo[k])) {
      fLo[k] = lo[k];
      fHi[k] = hi[k];
    }
  }

  const center = [0, 1, 2].map((k) => (fLo[k] + fHi[k]) / 2);
  const size = [0, 1, 2].map((k) => fHi[k] - fLo[k]);
  // Bán kính là NỬA ĐƯỜNG CHÉO của khung, không phải cạnh dài nhất: camera đặt
  // theo cạnh dài nhất thì vật thể dẹt xoay ngang sẽ tràn ra ngoài khung hình.
  const radius = (Math.hypot(size[0], size[1], size[2]) / 2) * FRAME_PAD;

  return {
    bytes,
    nodes: json.nodes?.length || 0,
    meshes: prims.length,
    tris: prims.reduce((s, p) => s + p.tris, 0),
    box: { min: round(lo), max: round(hi), size: round([0, 1, 2].map((k) => hi[k] - lo[k])) },
    center: round(center),
    size: round(size),
    radius: Number(radius.toFixed(5)),
  };
}

const round = (a) => a.map((v) => Number(v.toFixed(5)));
