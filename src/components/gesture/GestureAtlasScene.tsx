"use client";


import { ContentSurface } from "@/components/content/ContentProvider";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SYSTEMS, type Atlas } from "@/lib/humanAtlas/anatomy";
import { loadAtlasChunk, loadAtlasManifest } from "@/lib/humanAtlas/atlasCache";
import { sceneFrameIds, scenePartIds, type AtlasSceneDef } from "@/lib/humanAtlas/scenes/types";
import { groupVisibility, type AtlasLayerState } from "@/lib/anatomy/controlModels";
import { pick, type Loc } from "@/lib/homeContent";
import { sideFromCenterX, type ModelSide } from "@/lib/vision/orientation";
import { useBoxReady, useStageDark, type Transform } from "./GestureArmScene";
import { RoomEnvironment } from "@/lib/humanAtlas/roomEnvironment";
import { WONDER_PULL_DIST } from "@/lib/gesture/wondersnap";
import {
  MIN_PER_GROUP,
  PARTICLE_BUDGET_ATLAS,
  dotsOpacityOf,
  fitPointSize,
  makeScatterPoints,
  meshFadeOf,
  sampleSurfacePoints,
  stepScatter,
  type ScatterState,
  type ScatterUniforms,
} from "@/lib/gesture/particles";

/** Vector tạm cho chiếu nhãn (không cấp phát mỗi khung hình). */
const _pv = new THREE.Vector3();

/** Một nhãn gọn: div tên + đường chỉ + chấm neo (DOM dựng một lần). */
type LabelItem = {
  key: string;
  div: HTMLDivElement;
  line: SVGLineElement;
  dot: SVGCircleElement;
  w: number;
  h: number;
  shown: boolean;
};

/**
 * Trạng thái hiệu ứng ghi MỖI KHUNG (tan hạt, phát sáng, hiện/ẩn, nhãn).
 * Giữ ở module theo Built — vòng lặp real-time ghi thẳng object này mà luật
 * immutability chỉ cấm mutate qua prop/ref/state, đúng mẫu `dotsByScene`.
 */
type BuiltFx = {
  mats: THREE.MeshStandardMaterial[];
  dots: { pts: THREE.Points; u: ScatterUniforms }[];
  vis: { node: THREE.Group; key: string }[];
};
const fxByBuilt = new WeakMap<Built, BuiltFx>();
/** Nhãn DOM theo host phủ — cùng lý do như trên. */
const labelsByHost = new WeakMap<HTMLDivElement, LabelItem[]>();

/**
 * Ánh sáng IBL y hệt atlas viewer: `scene.environment` dựng bằng PMREM từ
 * RoomEnvironment nội bộ (không tải HDR qua mạng nên offline vẫn chạy).
 * Không có env thì MeshStandardMaterial chỉ ăn đèn trực tiếp, mất hết phản xạ
 * môi trường — đúng thứ khiến trang cử chỉ nhìn bẹt, chết sáng khi đặt cạnh
 * trang viewer dù cùng một bộ dữ liệu BodyParts3D.
 */
export function applyViewerLighting(state: { gl: THREE.WebGLRenderer; scene: THREE.Scene }) {
  const { gl, scene } = state;
  gl.toneMappingExposure = 1.12;
  const pmrem = new THREE.PMREMGenerator(gl);
  const room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room, 0.04).texture;
  room.dispose();
  pmrem.dispose();
}

/**
 * KHUNG 3D CỦA CHẾ ĐỘ ĐIỀU KHIỂN, ĐỌC THẲNG SCENE ATLAS.
 *
 * Vì sao không dùng lại AtlasScene của trang thư viện: bộ đó có OrbitControls,
 * sàn, bệ, nhãn và vòng lặp dựng hình riêng — sinh ra để cầm chuột. Ở đây mô
 * hình phải chịu ĐÚNG bộ biến đổi của cử chỉ tay (`transformRef`: xoay, nghiêng,
 * lật gương, phóng, kéo, tách lớp) và raycast theo con trỏ ngón trỏ, y như
 * GestureArmScene. Nên chỉ dựng những mảnh CỦA SCENE (vài chục đến vài trăm),
 * gom theo NHÓM CẤU TRÚC — con trỏ trỏ vào là ra tên nhóm ("Cơ nhị đầu cánh
 * tay"), không phải tên mảnh thô của bộ dữ liệu.
 *
 * Toạ độ atlas: mét, trục y hướng lên, người nhìn về +z, bên TRÁI của người là
 * x dương (đo trên dữ liệu). Máy ảnh đặt ở +z nên nhìn thẳng mặt trước.
 */

export type AtlasHover = { name: string; raw: string } | null;

/**
 * Cạnh lớn nhất của khung ngắm sau khi co về hệ của máy ảnh (fov 40°, z = 2,4 →
 * khung nhìn cao ~1,75). 1,1 chừa nhiều khoảng thở nhưng mô hình lọt thỏm giữa
 * khung rộng; 1,45 thì bài khuỷu tràn cả trên lẫn dưới vì khung ngắm của bài bộ
 * phận chỉ ôm VÙNG KHỚP còn xương dài chạy ra ngoài. 1,3 là giữa: mô hình choán
 * ~3/4 chiều cao khung, xương dài thò ra ở bài khớp là đúng giải phẫu.
 */
const FRAME_SIZE = 1.3;

const HIGHLIGHT = new THREE.MeshStandardMaterial({
  color: "#ffb347",
  emissive: "#c2600c",
  emissiveIntensity: 0.55,
  roughness: 0.5,
  side: THREE.DoubleSide,
});

/** Góc nhìn mở bài, đổi thành phép xoay mô hình (máy ảnh đứng yên ở +z). */
function viewRotation(view: AtlasSceneDef["view"]): THREE.Euler {
  switch (view) {
    case "top":
      return new THREE.Euler(Math.PI / 2 - 0.34, 0, 0);
    case "bottom":
      return new THREE.Euler(-Math.PI / 2 + 0.34, 0, 0);
    case "back":
      return new THREE.Euler(0.1, Math.PI, 0);
    case "side":
      return new THREE.Euler(0.1, -Math.PI / 2 + 0.15, 0);
    case "front":
      return new THREE.Euler(0.05, 0, 0);
    default:
      // ¾ trước — cùng hướng nhìn mặc định của trang thư viện.
      return new THREE.Euler(0.1, -0.2, 0);
  }
}

type Built = {
  root: THREE.Group;
  /** Nhóm cấu trúc -> nút chứa các mảnh của nó. */
  groups: Map<string, THREE.Group>;
  /** Hướng tách lớp của từng nhóm (hệ atlas, đã nhân biên độ). */
  spread: Map<string, THREE.Vector3>;
  /** Đám hạt của từng nhóm (con của nút nhóm nên tự bay theo khi tách lớp). */
  dots: Map<string, THREE.Points>;
  /** Mọi vật liệu gốc (phát sáng mờ + mờ dần khi tan đều qua đây). */
  mats: THREE.MeshStandardMaterial[];
  /** Màu của từng nhóm (điểm màu + nhãn + đường chỉ dùng chung). */
  colors: Map<string, string>;
  /** Neo tâm từng nhóm (hệ atlas) để chiếu nhãn lên màn hình. */
  anchors: Map<string, THREE.Object3D>;
  /** Khoá nhóm xếp theo số đỉnh giảm dần (giới hạn số nhãn khi bài quá đông). */
  order: string[];
  /** Cự ly hạt bay lúc tan (đơn vị atlas) + cỡ dot (đơn vị atlas). */
  scatterSpread: number;
  dotWorld: number;
  side: ModelSide;
  dispose: () => void;
};

function build(atlas: Atlas, scene: AtlasSceneDef, buffers: Map<number, ArrayBuffer>): Built {
  const index = new Map(atlas.parts.map((p, i) => [p.id, i]));
  const sysColor = new Map(SYSTEMS.map((s) => [s.id, s.color]));
  const disposables: { dispose: () => void }[] = [];
  const box = (ids: string[]) => {
    const b = new THREE.Box3();
    for (const id of ids) {
      const i = index.get(id);
      if (i === undefined) continue;
      const [lo, hi] = atlas.parts[i].bounds;
      b.expandByPoint(new THREE.Vector3().fromArray(lo)).expandByPoint(new THREE.Vector3().fromArray(hi));
    }
    return b;
  };

  const frameIds = sceneFrameIds(scene);
  const frame = box(frameIds.length ? frameIds : scenePartIds(scene));
  const center = frame.getCenter(new THREE.Vector3());
  const size = frame.getSize(new THREE.Vector3());
  // Bài lát cắt (mặt cắt ngang bụng, nền sọ) được nhìn THẲNG VÀO MẶT CẮT, nên bề
  // dày dọc trục cắt không hiện ra màn hình. Tính cả nó thì khung co theo chiều
  // cao thân người và lát cắt chỉ còn một đốm giữa khung (đã thấy trên trang thật).
  const axes = (["x", "y", "z"] as const).filter((a) => a !== scene.clip?.axis);
  const k = FRAME_SIZE / Math.max(...axes.map((a) => size[a]), 1e-3);

  const root = new THREE.Group();
  root.rotation.copy(viewRotation(scene.view));
  const offset = new THREE.Group();
  offset.scale.setScalar(k);
  offset.position.copy(center).multiplyScalar(-k);
  root.add(offset);

  const groups = new Map<string, THREE.Group>();
  const spread = new Map<string, THREE.Vector3>();
  const dots = new Map<string, THREE.Points>();
  const allMats: THREE.MeshStandardMaterial[] = [];
  const colors = new Map<string, string>();
  const anchors = new Map<string, THREE.Object3D>();
  const vertCount = new Map<string, number>();
  const reach = Math.max(size.x, size.y, size.z) * 0.45;

  scene.groups.forEach((g, gi) => {
    const node = new THREE.Group();
    node.userData.key = g.key;
    node.userData.name = g.name;
    const mats = new Map<string, THREE.MeshStandardMaterial>();
    for (const id of g.parts) {
      const i = index.get(id);
      if (i === undefined) continue;
      const p = atlas.parts[i];
      const buf = buffers.get(p.chunk);
      if (!buf) continue;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(buf, p.positions, p.vertexCount * 3), 3));
      geo.setAttribute("normal", new THREE.BufferAttribute(new Int16Array(buf, p.normals, p.vertexCount * 3), 3, true));
      geo.setIndex(new THREE.BufferAttribute(new Uint32Array(buf, p.indices, p.indexCount), 1));
      geo.computeBoundingSphere();
      disposables.push(geo);
      const color = g.tint ?? sysColor.get(p.system) ?? "#aebbb8";
      let mat = mats.get(color);
      if (!mat) {
        mat = new THREE.MeshStandardMaterial({ color, roughness: 0.53, metalness: 0.08, side: THREE.DoubleSide });
        // Phát sáng mờ khi tách lớp (kiểu WonderSnap): sẵn màu emissive đúng
        // màu nhóm, cường độ 0 lúc gộp, vòng lặp nâng dần theo độ bung.
        mat.emissive = new THREE.Color(color);
        mat.emissiveIntensity = 0;
        mats.set(color, mat);
        disposables.push(mat);
      }
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData.baseMaterial = mat;
      mesh.userData.group = g.key;
      node.add(mesh);
    }
    // Tách lớp: đẩy mỗi nhóm ra xa tâm khung theo hướng tâm của chính nó. Nhóm
    // nằm ngay tâm (xương trục) thì đi theo một hướng xoè đều, không đứng im.
    const gbc = box(g.parts).getCenter(new THREE.Vector3());
    const gc = gbc.clone().sub(center);
    if (gc.lengthSq() < 1e-6) {
      const a = (gi / Math.max(1, scene.groups.length)) * Math.PI * 2;
      gc.set(Math.cos(a), 0, Math.sin(a));
    }
    spread.set(g.key, gc.normalize().multiplyScalar(reach));
    groups.set(g.key, node);
    offset.add(node);
    const anchor = new THREE.Object3D();
    anchor.position.copy(gbc);
    node.add(anchor);
    anchors.set(g.key, anchor);
  });

  // Hạt hoá: lấy mẫu đều trên mặt từng nhóm (chia ngân sách theo số đỉnh),
  // màu đúng màu nhóm. Hạt là con của nút nhóm nên tự bay theo khi tách lớp.
  {
    let totalVerts = 0;
    const perGroup: { key: string; node: THREE.Group; geos: THREE.BufferGeometry[]; verts: number }[] = [];
    groups.forEach((node, key) => {
      const geos: THREE.BufferGeometry[] = [];
      let verts = 0;
      node.children.forEach((o) => {
        if (!(o as THREE.Mesh).isMesh) return;
        const geo = (o as THREE.Mesh).geometry as THREE.BufferGeometry;
        geos.push(geo);
        verts += (geo.getAttribute("position") as THREE.BufferAttribute).count;
      });
      totalVerts += verts;
      perGroup.push({ key, node, geos, verts });
    });
    const ident = new THREE.Matrix4();
    const maxDim = Math.max(size.x, size.y, size.z);
    const scatterSpread = Math.max(maxDim * 0.45, 1e-3);
    for (const pg of perGroup) {
      vertCount.set(pg.key, pg.verts);
      if (!pg.geos.length || totalVerts <= 0) continue;
      const count = Math.max(MIN_PER_GROUP, Math.round((PARTICLE_BUDGET_ATLAS * pg.verts) / totalVerts));
      const pos: number[] = [];
      const seed: number[] = [];
      // Chia đều ngân sách nhóm cho các mesh (theo số đỉnh từng mesh).
      for (const geo of pg.geos) {
        const gv = (geo.getAttribute("position") as THREE.BufferAttribute).count;
        const c = Math.max(1, Math.round((count * gv) / Math.max(pg.verts, 1)));
        const d = sampleSurfacePoints(geo, ident, c);
        for (let i = 0; i < d.positions.length; i++) pos.push(d.positions[i]);
        for (let i = 0; i < d.seeds.length; i++) seed.push(d.seeds[i]);
      }
      const data = {
        positions: new Float32Array(pos),
        seeds: new Float32Array(seed),
      };
      const mat = pg.node.children.find((o) => (o as THREE.Mesh).isMesh)
        ? ((pg.node.children.find((o) => (o as THREE.Mesh).isMesh) as THREE.Mesh).userData.baseMaterial as THREE.MeshStandardMaterial).color.clone()
        : new THREE.Color("#ffffff");
      const pts = makeScatterPoints(data, mat, scatterSpread);
      pg.node.add(pts);
      dots.set(pg.key, pts);
      disposables.push(pts.geometry, pts.material as THREE.Material);
    }
  }
  groups.forEach((node) => {
    node.children.forEach((o) => {
      if (!(o as THREE.Mesh).isMesh) return;
      const base = (o as THREE.Mesh).userData.baseMaterial as THREE.MeshStandardMaterial;
      if (!allMats.includes(base)) allMats.push(base);
    });
  });
  scene.groups.forEach((g) => {
    const node = groups.get(g.key);
    if (!node) return;
    const mesh = node.children.find((o) => (o as THREE.Mesh).isMesh) as THREE.Mesh | undefined;
    const base = mesh?.userData.baseMaterial as THREE.MeshStandardMaterial | undefined;
    colors.set(g.key, `#${(base?.color ?? new THREE.Color("#ffffff")).getHexString()}`);
  });

  const order = [...groups.keys()].sort((a, b) => (vertCount.get(b) ?? 0) - (vertCount.get(a) ?? 0));
  const maxDim = Math.max(size.x, size.y, size.z);

  const ret: Built = {
    root,
    groups,
    spread,
    dots,
    mats: allMats,
    colors,
    anchors,
    order,
    scatterSpread: Math.max(maxDim * 0.45, 1e-3),
    dotWorld: Math.max(maxDim * 0.006, 1e-4),
    side: sideFromCenterX(center.x),
    dispose: () => disposables.forEach((d) => d.dispose()),
  };
  // Đăng ký hiệu ứng khung-hình (không qua prop/ref để lint yên tâm).
  fxByBuilt.set(ret, {
    mats: allMats,
    dots: [...dots.values()].map((pts) => ({
      pts,
      u: (pts.material as THREE.ShaderMaterial).uniforms as unknown as ScatterUniforms,
    })),
    vis: [...groups.entries()].map(([key, node]) => ({ node, key })),
  });
  return ret;
}

function AtlasModel({
  built,
  scene,
  locale,
  layers,
  hidden,
  cursorRef,
  transformRef,
  revealRef,
  onHover,
  pull,
  dissolved,
  wonderLabels,
  hologram,
  overlay,
}: {
  built: Built;
  scene: AtlasSceneDef;
  locale: Loc;
  layers: AtlasLayerState;
  hidden: string[];
  cursorRef: React.RefObject<{ x: number; y: number; active: boolean }>;
  transformRef: React.RefObject<Transform>;
  /** Tiến trình tia quét tầng 1 (trang đọc/ghi qua ref, không qua state). */
  revealRef?: React.RefObject<{ active: boolean; progress: number }>;
  onHover: (info: AtlasHover) => void;
  /**
   * Nhóm đang bị kéo tiến về phía người xem (pinch kiểu WonderSnap).
   * Đổi tham chiếu mới chỉ khi bấm chụm/đổi nhóm — render lại rẻ, còn nội suy
   * mượt chạy trong useFrame.
   */
  pull?: { key: string; target: number } | null;
  /** true = model đang tan thành hạt (búng tay) — hạt gom lại khi false. */
  dissolved: boolean;
  /** true = vẽ nhãn + đường chỉ khi bung (kiểu WonderSnap, chỉ kiểu wonder). */
  wonderLabels: boolean;
  /** true = chấm phát sáng thay model đặc (kiểu WonderSnap, chỉ trang này). */
  hologram: boolean;
  /** Lớp phủ nhãn (div) + đường chỉ (svg) — state của wrapper, như `built`. */
  overlay: { host: HTMLDivElement; svg: SVGSVGElement } | null;
}) {
  const { camera, gl } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pickableRef = useRef<THREE.Mesh[]>([]);
  const hoveredRef = useRef<string | null>(null);
  const lastPickRef = useRef(0);
  const explodeRef = useRef(-1);
  /** Kéo nhóm (pinch): tiến mượt về đích, áp cùng lượt với tách lớp. */
  const pullAmtRef = useRef(0);
  const pullSigRef = useRef("");
  /** Tan/gom hạt: đích theo prop `dissolved` (sự kiện), giá trị nội suy mượt. */
  const scatterRef = useRef<ScatterState>({ value: 0, target: 0 });
  const scatterTimeRef = useRef(0);
  /** Hologram: 0 = model đặc, 1 = chấm phát sáng — nội suy mượt như tan/gom. */
  const holoRef = useRef(0);
  /** Hiện/ẩn từng nhóm theo lớp (kể cả "vứt") — vòng lặp AND với trạng thái tan. */
  const layerVisRef = useRef(new Map<string, boolean>());
  const labelsShownRef = useRef(false);
  const lastLabelHoverRef = useRef<string | null>(null);
  const overlayReady = overlay !== null;
  useEffect(() => {
    scatterRef.current.target = dissolved ? 1 : 0;
    if (dissolved) {
      // Đang tan thì gỡ highlight để vật liệu gốc mờ đều, không kẹt sáng.
      const key = hoveredRef.current;
      if (key) built.groups.get(key)?.children.forEach((o) => ((o as THREE.Mesh).material = (o as THREE.Mesh).userData.baseMaterial));
      hoveredRef.current = null;
    }
  }, [dissolved, built]);
  useEffect(() => {
    // Đổi bài: chốt ngay trạng thái tan/gom, cỡ điểm theo renderer hiện tại.
    scatterRef.current.value = scatterRef.current.target;
    for (const pts of built.dots.values()) {
      const u = (pts.material as THREE.ShaderMaterial).uniforms as unknown as {
        uSize: { value: number };
      };
      u.uSize.value = fitPointSize(gl, camera, built.dotWorld);
    }
  }, [built, gl, camera]);
  // REVEAL TẦNG 1: mặt cắt ngang trượt từ đỉnh xuống đáy theo tiến trình tia
  // quét. Dùng clipping plane (renderer đã bật localClipping) thay vì đổi
  // opacity từng nhóm — một mặt phẳng cho cả scene, không đụng tới vật liệu
  // theo lớp (mờ/hiện/vứt) nên không xung đột với bảng lớp.
  // Mặt phẳng nằm trong useRef (hộp thay đổi được): compiler cấm sửa giá trị
  // do useMemo trả về, mà mỗi khung hình ta phải đổi `constant`.
  const revealPlaneRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const revealOn = useRef(false);
  const revealBox = useRef({ top: 0, span: 1 });
  useEffect(() => () => {
    revealOn.current = false;
  }, [built]);
  // Mặt cắt của bài lát cắt (mặt cắt ngang bụng, nền sọ) — tính trong hệ atlas
  // rồi đổi sang hệ thế giới mỗi khung hình, vì mô hình còn xoay/lật theo tay.
  const clip = useMemo(() => {
    const c = scene.clip;
    if (!c) return null;
    const ids = scenePartIds(scene);
    return { c, ids };
  }, [scene]);
  const localPlane = useRef<THREE.Plane | null>(null);
  const worldPlane = useMemo(() => new THREE.Plane(), []);

  useEffect(() => {
    if (!clip) return;
    // Hộp bao lấy từ chính các mảnh đã dựng (hệ atlas), cùng quy ước % với trang thư viện.
    const b = new THREE.Box3();
    built.groups.forEach((n) =>
      n.children.forEach((m) => {
        const g = (m as THREE.Mesh).geometry;
        if (!g.boundingBox) g.computeBoundingBox();
        b.union(g.boundingBox!);
      }),
    );
    const { axis, percent, keepPositive } = clip.c;
    const cut = b.min[axis] + (b.max[axis] - b.min[axis]) * (percent / 100);
    const n = new THREE.Vector3(axis === "x" ? 1 : 0, axis === "y" ? 1 : 0, axis === "z" ? 1 : 0);
    localPlane.current = keepPositive ? new THREE.Plane(n, -cut) : new THREE.Plane(n.negate(), cut);
    built.groups.forEach((node) =>
      node.children.forEach((m) => {
        const mat = (m as THREE.Mesh).userData.baseMaterial as THREE.Material;
        mat.clippingPlanes = [worldPlane];
      }),
    );
    HIGHLIGHT.clippingPlanes = [worldPlane];
    return () => {
      HIGHLIGHT.clippingPlanes = null;
    };
  }, [built, clip, worldPlane]);

  // Hiện / mờ / vứt theo lớp, và dựng sẵn danh sách mảnh con trỏ được bắt.
  // Mờ mesh khi tan hạt do vòng lặp tính (opacity gốc × độ mờ), nên effect này
  // chỉ ghi độ mờ GỐC vào userData + hiện/ẩn theo lớp vào layerVisRef — vòng
  // lặp AND hai thứ lại mỗi khung hình, không giẫm nhau.
  useEffect(() => {
    const vis = groupVisibility(scene, layers);
    const dropped = new Set(hidden);
    const pickable: THREE.Mesh[] = [];
    built.groups.forEach((node, key) => {
      const st = vis.get(key) ?? { visible: true, faded: false };
      layerVisRef.current.set(key, st.visible && !dropped.has(key));
      node.children.forEach((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        const base = m.userData.baseMaterial as THREE.MeshStandardMaterial;
        // Mỗi nhóm có vật liệu RIÊNG (dựng trong build), nên đổi độ mờ ở đây
        // không lan sang nhóm khác cùng màu hệ.
        base.userData.baseOpacity = st.faded ? 0.14 : 1;
        base.userData.layerFaded = st.faded;
        if ((layerVisRef.current.get(key) ?? true) && !st.faded) pickable.push(m);
      });
    });
    pickableRef.current = pickable;
  }, [built, scene, layers, hidden]);

  // Nhãn gọn kiểu WonderSnap: dựng MỘT LẦN mỗi bài (tên + chấm màu + đường
  // chỉ), giữ theo host phủ. Vòng lặp chỉ đổi toạ độ — không setState.
  useEffect(() => {
    if (!overlay) return;
    const { host, svg } = overlay;
    const items: LabelItem[] = [];
    const keys = built.order.slice(0, 24);
    for (const key of keys) {
      const g = scene.groups.find((x) => x.key === key);
      if (!g) continue;
      const color = built.colors.get(key) ?? "#eef6ff";
      const name = pick(g.name, locale);
      // Dòng mô tả như WonderSnap ("takes blood to the lungs…") — nhóm nào
      // không có note thì nhãn chỉ còn tên.
      const desc = g.note ? pick(g.note, locale) : "";
      const div = document.createElement("div");
      div.setAttribute(
        "style",
        "position:absolute;left:0;top:0;display:flex;align-items:flex-start;gap:6px;" +
          "color:#eef6ff;background:rgba(8,12,20,0.62);border:1px solid rgba(140,200,255,0.22);border-radius:8px;" +
          "padding:3px 8px;text-shadow:0 1px 6px rgba(0,0,0,0.9);will-change:transform;",
      );
      const dot = document.createElement("i");
      dot.setAttribute(
        "style",
        `width:8px;height:8px;border-radius:50%;background:${color};box-shadow:0 0 8px ${color};flex:none;margin-top:4px;`,
      );
      div.append(dot);
      const col = document.createElement("span");
      col.setAttribute("style", "display:flex;flex-direction:column;line-height:1.35;");
      const b = document.createElement("b");
      b.setAttribute("style", "font:700 12px ui-sans-serif,system-ui,sans-serif;white-space:nowrap;");
      b.append(document.createTextNode(name));
      col.append(b);
      if (desc) {
        const s = document.createElement("span");
        s.setAttribute(
          "style",
          "font:400 10.5px ui-sans-serif,system-ui,sans-serif;color:rgba(190,210,235,0.92);max-width:200px;",
        );
        s.append(document.createTextNode(desc));
        col.append(s);
      }
      div.append(col);
      host.append(div);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("stroke", color);
      line.setAttribute("stroke-width", "1");
      line.setAttribute("opacity", "0.6");
      svg.append(line);
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("r", "3.5");
      c.setAttribute("fill", color);
      c.setAttribute("stroke", "#fff");
      c.setAttribute("stroke-width", "1");
      svg.append(c);
      items.push({ key, div, line, dot: c, w: 0, h: 0, shown: false });
    }
    // Đo rộng nhãn lúc còn ẩn (visibility) để cột phải neo đúng mép.
    const prevDisplay = host.style.display;
    const prevVis = host.style.visibility;
    host.style.setProperty("display", "block");
    host.style.setProperty("visibility", "hidden");
    for (const it of items) {
      it.w = it.div.offsetWidth || 120;
      it.h = it.div.offsetHeight || 24;
    }
    host.style.setProperty("display", prevDisplay);
    host.style.setProperty("visibility", prevVis);
    labelsByHost.set(host, items);
    return () => {
      host.replaceChildren();
      svg.replaceChildren();
      labelsByHost.delete(host);
    };
  }, [built, scene, locale, overlay, overlayReady]);

  const setHighlight = (key: string | null) => {
    // Đang tan thành hạt thì giữ nguyên vật liệu gốc để mờ đều cả nhóm.
    if (scatterRef.current.value > 0.02) key = null;
    const prev = hoveredRef.current;
    if (prev === key) return;
    if (prev) built.groups.get(prev)?.children.forEach((o) => ((o as THREE.Mesh).material = (o as THREE.Mesh).userData.baseMaterial));
    hoveredRef.current = key;
    if (key) built.groups.get(key)?.children.forEach((o) => ((o as THREE.Mesh).material = HIGHLIGHT));
  };

  useEffect(
    () => () => {
      // Rời mô hình thì trả vật liệu gốc, kẻo lần sau mở lại một nhóm sáng rực vô cớ.
      const key = hoveredRef.current;
      if (key) built.groups.get(key)?.children.forEach((o) => ((o as THREE.Mesh).material = (o as THREE.Mesh).userData.baseMaterial));
      hoveredRef.current = null;
    },
    [built],
  );

  useFrame((_, delta) => {
    const t = transformRef.current;
    const group = groupRef.current;
    if (group && t) {
      // Cùng công thức làm mượt theo thời gian thật với GestureArmScene, để hai
      // loại mô hình phản ứng với tay giống hệt nhau.
      const a = 1 - Math.exp(-delta / 0.06);
      group.rotation.order = "YXZ";
      group.rotation.y += (t.rotY - group.rotation.y) * a;
      group.rotation.x += (t.rotX - group.rotation.x) * a;
      group.rotation.z += (t.rotZ - group.rotation.z) * a;
      const sx = (t.mirror ? -1 : 1) * t.zoom;
      group.scale.x += (sx - group.scale.x) * a;
      group.scale.y += (t.zoom - group.scale.y) * a;
      group.scale.z += (t.zoom - group.scale.z) * a;
      group.position.x += (t.panX - group.position.x) * a;
      group.position.y += (t.panY - group.position.y) * a;
    }

    const kx = t?.explode ?? 0;
    const pullKey = pull?.key ?? null;
    const pullTarget = pullKey ? (pull?.target ?? 1) : 0;
    pullAmtRef.current += (pullTarget - pullAmtRef.current) * (1 - Math.exp(-delta / 0.06));
    if (Math.abs(pullAmtRef.current - pullTarget) < 1e-3) pullAmtRef.current = pullTarget;
    // Hologram tản rộng kiểu WonderSnap (gấp ~2,4 lần lúc gộp xong): hệ số ăn
    // theo độ hologram đang nội suy nên bật/tắt không nhảy hình.
    holoRef.current += ((hologram ? 1 : 0) - holoRef.current) * (1 - Math.exp(-delta / 0.25));
    const hh = holoRef.current;
    const spreadK = kx * (1 + 1.4 * hh);
    const pullSig = `${spreadK.toFixed(3)}|${pullKey ?? ""}|${pullAmtRef.current.toFixed(3)}`;
    if (pullSig !== pullSigRef.current) {
      pullSigRef.current = pullSig;
      explodeRef.current = kx;
      built.groups.forEach((node, key) => {
        node.position.copy(built.spread.get(key)!).multiplyScalar(spreadK);
        if (pullKey && key === pullKey) node.position.z += WONDER_PULL_DIST * pullAmtRef.current;
      });
      // Phát sáng mờ theo độ bung (kiểu WonderSnap): emissive đã nhuộm sẵn
      // màu nhóm lúc dựng, ở đây chỉ nâng cường độ — qua fx module để lint yên.
      const fxGlow = fxByBuilt.get(built);
      if (fxGlow) for (const m of fxGlow.mats) m.emissiveIntensity = 0.55 * kx;
    }

    // Tan/gom hạt kiểu WonderSnap: hạt bay ra thì mesh mờ đi, gom lại thì mesh
    // hiện ra. Mọi object ghi mỗi khung nằm trong fx module (không phải
    // prop/ref) — đúng luật real-time của trang mà lint vẫn sạch.
    const fx = fxByBuilt.get(built);
    const sc = scatterRef.current;
    stepScatter(sc, delta);
    scatterTimeRef.current += delta;
    const sk = sc.value;
    // Hologram: mesh mờ dần về 0, hạt nền hiện lên thay thế (độ mờ 0,85).
    // hh đã nội suy ở khối tách lớp phía trên.
    const meshOp = meshFadeOf(sk) * (1 - hh);
    const dotsOp = Math.max(dotsOpacityOf(sk), hh * 0.85);
    if (fx) {
      for (const m of fx.mats) {
        const baseOp = (m.userData.baseOpacity as number | undefined) ?? 1;
        const faded = m.userData.layerFaded as boolean | undefined;
        m.opacity = baseOp * meshOp;
        const transp = meshOp < 1 || !!faded;
        m.transparent = transp;
        m.depthWrite = !transp;
      }
      for (const d of fx.dots) {
        d.u.uScatter.value = sk;
        d.u.uOpacity.value = dotsOp;
        d.u.uTime.value = scatterTimeRef.current;
        d.pts.visible = dotsOp > 0.01;
      }
      for (const v of fx.vis) {
        const layerVis = layerVisRef.current.get(v.key) ?? true;
        v.node.visible = layerVis && (meshOp > 0.02 || dotsOp > 0.01);
      }
    }

    // Nhãn gọn kiểu WonderSnap (ảnh 2): hiện khi bung rõ, ẩn lúc đang tan.
    // DOM viết bằng method (setProperty/setAttribute), state trong item module.
    const host = overlay?.host ?? null;
    const svg = overlay?.svg ?? null;
    const items = host ? (labelsByHost.get(host) ?? null) : null;
    const showLabels = wonderLabels && host && svg && items && items.length > 0 && kx > 0.15 && sk < 0.5;
    if (!showLabels) {
      if (labelsShownRef.current) {
        labelsShownRef.current = false;
        if (host) host.style.setProperty("display", "none");
        if (svg) svg.style.setProperty("display", "none");
      }
    } else if (host && svg && items) {
      labelsShownRef.current = true;
      host.style.setProperty("display", "block");
      svg.style.setProperty("display", "block");
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      const seen = new Set<string>();
      const proj: { key: string; x: number; y: number }[] = [];
      for (const it of items) {
        const anchor = built.anchors.get(it.key);
        if (!anchor) continue;
        anchor.getWorldPosition(_pv).project(camera);
        if (_pv.z > 1) continue;
        seen.add(it.key);
        proj.push({ key: it.key, x: (_pv.x * 0.5 + 0.5) * w, y: (-_pv.y * 0.5 + 0.5) * h });
      }
      // Chia 2 cột ở trung vị x rồi xếp chồng chống đè — đúng kiểu ảnh 2.
      const sorted = [...proj].sort((a, b) => a.x - b.x);
      const mid = sorted.length ? sorted[Math.floor(sorted.length / 2)].x : w / 2;
      const byKey = new Map(items.map((it) => [it.key, it]));
      for (const side of [-1, 1]) {
        const col = proj.filter((p) => (side < 0 ? p.x < mid : p.x >= mid)).sort((a, b) => a.y - b.y);
        let yy = -Infinity;
        let prevH = 0;
        for (const p of col) {
          const it = byKey.get(p.key)!;
          const y = Math.min(Math.max(Math.max(p.y, yy + Math.max(34, prevH + 10)), 40), h - 40);
          yy = y;
          prevH = it.h;
          const lx = side < 0 ? 10 : w - 10 - it.w;
          it.div.style.setProperty("transform", `translate(${lx.toFixed(1)}px, ${(y - it.h / 2).toFixed(1)}px)`);
          const ex = side < 0 ? lx + it.w : lx;
          it.line.setAttribute("x1", p.x.toFixed(1));
          it.line.setAttribute("y1", p.y.toFixed(1));
          it.line.setAttribute("x2", ex.toFixed(1));
          it.line.setAttribute("y2", y.toFixed(1));
          it.dot.setAttribute("cx", p.x.toFixed(1));
          it.dot.setAttribute("cy", p.y.toFixed(1));
          if (!it.shown) {
            it.shown = true;
            it.div.style.setProperty("display", "flex");
            it.line.style.setProperty("display", "");
            it.dot.style.setProperty("display", "");
          }
        }
      }
      for (const it of items) {
        if (!seen.has(it.key) && it.shown) {
          it.shown = false;
          it.div.style.setProperty("display", "none");
          it.line.style.setProperty("display", "none");
          it.dot.style.setProperty("display", "none");
        }
      }
      const hl = hoveredRef.current;
      if (hl !== lastLabelHoverRef.current) {
        const pv = lastLabelHoverRef.current && byKey.get(lastLabelHoverRef.current);
        if (pv) {
          pv.div.style.removeProperty("border-color");
          pv.div.style.removeProperty("box-shadow");
        }
        const cu = hl && byKey.get(hl);
        if (cu) {
          cu.div.style.setProperty("border-color", "#fff");
          cu.div.style.setProperty("box-shadow", "0 0 14px rgba(255,255,255,0.35)");
        }
        lastLabelHoverRef.current = hl;
      }
    }

    // Reveal đồng bộ tia quét: giữ lại phần ĐÃ quét (y >= ngưỡng), ngưỡng tụt
    // dần từ đỉnh xuống đáy. Gán/gỡ mặt phẳng đúng một lần khi bật/tắt; mỗi
    // khung hình chỉ đổi `constant` (rẻ). Mặt cắt bài lát cắt (nếu có) giữ
    // nguyên — reveal chỉ thêm/bớt đúng mặt của mình trong mảng clippingPlanes.
    const rv = revealRef?.current;
    if (rv?.active) {
      if (!revealOn.current) {
        revealOn.current = true;
        built.root.updateMatrixWorld(true);
        const bb = new THREE.Box3().setFromObject(built.root);
        const pad = Math.max(1e-3, (bb.max.y - bb.min.y) * 0.01);
        revealBox.current = { top: bb.max.y + pad, span: bb.max.y - bb.min.y + pad * 2 };
        built.groups.forEach((node) =>
          node.children.forEach((o) => {
            const base = (o as THREE.Mesh).userData.baseMaterial as THREE.Material;
            base.clippingPlanes = [...(base.clippingPlanes ?? []), revealPlaneRef.current];
          }),
        );
        HIGHLIGHT.clippingPlanes = [...(HIGHLIGHT.clippingPlanes ?? []), revealPlaneRef.current];
      }
      const { top, span } = revealBox.current;
      revealPlaneRef.current.constant = -(top - rv.progress * span);
    } else if (revealOn.current) {
      revealOn.current = false;
      built.groups.forEach((node) =>
        node.children.forEach((o) => {
          const base = (o as THREE.Mesh).userData.baseMaterial as THREE.Material;
          const rest = (base.clippingPlanes ?? []).filter((p) => p !== revealPlaneRef.current);
          base.clippingPlanes = rest.length ? rest : null;
        }),
      );
      const rest = (HIGHLIGHT.clippingPlanes ?? []).filter((p) => p !== revealPlaneRef.current);
      HIGHLIGHT.clippingPlanes = rest.length ? rest : null;
    }

    if (localPlane.current) {
      built.root.updateMatrixWorld();
      const anyMesh = built.groups.values().next().value?.parent;
      if (anyMesh) worldPlane.copy(localPlane.current).applyMatrix4(anyMesh.matrixWorld);
    }

    const cur = cursorRef.current;
    // Đang tan thành hạt thì bỏ bắt điểm (tránh trỏ trúng mesh đã mờ).
    if (!cur?.active || scatterRef.current.value > 0.5) {
      if (hoveredRef.current) {
        setHighlight(null);
        onHover(null);
      }
      return;
    }
    const now = performance.now();
    if (now - lastPickRef.current < 33) return;
    lastPickRef.current = now;
    raycaster.setFromCamera(new THREE.Vector2(cur.x * 2 - 1, -(cur.y * 2 - 1)), camera);
    const hits = raycaster.intersectObjects(pickableRef.current, false);
    // Bỏ điểm chạm ở nửa đã bị cắt: không lọc thì trỏ vào khoảng trống vẫn bắt trúng cấu trúc vô hình.
    const hit = hits.find((h) => !localPlane.current || worldPlane.distanceToPoint(h.point) >= 0);
    const key = (hit?.object.userData.group as string | undefined) ?? null;
    if (key !== hoveredRef.current) {
      setHighlight(key);
      const g = key ? scene.groups.find((x) => x.key === key) : undefined;
      onHover(g ? { name: pick(g.name, locale), raw: g.key } : null);
    }
  });

  return <ContentSurface scope="src/components/gesture/GestureAtlasScene.tsx">{(
    <group ref={groupRef}>
      <primitive object={built.root} />
    </group>
  )}</ContentSurface>;
}

export default function GestureAtlasScene({
  scene,
  locale,
  layers,
  hidden,
  cursorRef,
  transformRef,
  revealRef,
  onHover,
  onLoading,
  onSide,
  transparentBg = false,
  pull,
  dissolved = false,
  wonderLabels = false,
  hologram = false,
}: {
  scene: AtlasSceneDef;
  locale: Loc;
  layers: AtlasLayerState;
  /** Khoá nhóm đã bị "vứt". */
  hidden: string[];
  cursorRef: React.RefObject<{ x: number; y: number; active: boolean }>;
  transformRef: React.RefObject<Transform>;
  revealRef?: React.RefObject<{ active: boolean; progress: number }>;
  onHover: (info: AtlasHover) => void;
  onLoading?: (loading: boolean) => void;
  /** Báo bên của mô hình (suy từ dữ liệu) để trang quyết định có lật gương không. */
  onSide?: (side: ModelSide) => void;
  /**
   * Nền trong suốt để video webcam lót bên dưới (sân khấu kiểu WonderSnap).
   * Mặc định false: giữ nguyên nền đặc như cũ.
   */
  transparentBg?: boolean;
  /** Nhóm đang bị pinch-kéo (kiểu WonderSnap) — truyền xuống AtlasModel. */
  pull?: { key: string; target: number } | null;
  /** true = model đang tan thành hạt (búng tay) — xem AtlasModel. */
  dissolved?: boolean;
  /** true = vẽ nhãn + đường chỉ khi bung (kiểu WonderSnap, chỉ kiểu wonder). */
  wonderLabels?: boolean;
  /** true = chấm phát sáng thay model đặc (kiểu WonderSnap, chỉ trang này). */
  hologram?: boolean;
}) {
  const { ref: boxRef, ready: boxReady } = useBoxReady();
  const dark = useStageDark();
  const bg = dark ? "#12110f" : "#f4efe6";
  const [built, setBuilt] = useState<Built | null>(null);
  const [error, setError] = useState<string | null>(null);
  /** Lớp phủ nhãn + đường chỉ: state (đặt một lần lúc gắn DOM) để scene con
      ghi thẳng như `built` mà không vi phạm luật ref của lint. */
  const [overlay, setOverlay] = useState<{ host: HTMLDivElement; svg: SVGSVGElement } | null>(null);
  useEffect(() => {
    const box = boxRef.current;
    if (!box || overlay) return;
    const host = box.querySelector(":scope > [data-ws-labels]") as HTMLDivElement | null;
    const svg = box.querySelector(":scope > [data-ws-leader]") as unknown as SVGSVGElement | null;
    if (host && svg) setOverlay({ host, svg });
  }, [boxReady, boxRef, overlay]);
  const loadingRef = useRef(onLoading);
  const sideRef = useRef(onSide);
  useEffect(() => {
    loadingRef.current = onLoading;
    sideRef.current = onSide;
  });

  useEffect(() => {
    let dead = false;
    let made: Built | null = null;
    loadingRef.current?.(true);
    (async () => {
      try {
        const atlas = await loadAtlasManifest();
        const need = new Set<number>();
        const byId = new Map(atlas.parts.map((p) => [p.id, p]));
        for (const id of scenePartIds(scene)) {
          const p = byId.get(id);
          if (p) need.add(p.chunk);
        }
        const buffers = new Map<number, ArrayBuffer>();
        await Promise.all([...need].map(async (c) => buffers.set(c, await loadAtlasChunk(atlas, c))));
        if (dead) return;
        made = build(atlas, scene, buffers);
        setBuilt(made);
        setError(null);
        sideRef.current?.(made.side);
      } catch (e) {
        if (!dead) setError(e instanceof Error ? e.message : "Không tải được mô hình.");
      } finally {
        if (!dead) loadingRef.current?.(false);
      }
    })();
    return () => {
      dead = true;
      made?.dispose();
      setBuilt(null);
    };
  }, [scene]);

  return <ContentSurface scope="src/components/gesture/GestureAtlasScene.tsx">{(
    <div ref={boxRef} style={{ width: "100%", height: "100%", position: "relative" }}>
      {boxReady && (
        <Canvas
          // dpr 2 + exposure 1.12 + giàn đèn ngang atlas viewer — cùng lý do với
          // GestureArmScene: trước đây dpr 1,25 và đèn yếu nên mờ, bẹt khi đặt
          // cạnh trang viewer.
          dpr={[1, 2]}
          camera={{ position: [0, 0, 2.4], fov: 40, near: 0.01, far: 100 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            preserveDrawingBuffer: true,
          }}
          style={{ width: "100%", height: "100%" }}
          // Mặt cắt theo vật liệu (bài lát cắt ngang bụng, nền sọ) cần cờ này;
          // bật một lần lúc tạo renderer — lint cấm sửa `gl` từ hook.
          onCreated={(state) => {
            state.gl.localClippingEnabled = true;
            applyViewerLighting(state);
          }}
        >
          {/* Sân khấu WonderSnap thì bỏ nền đặc để thấy video bên dưới. */}
          {!transparentBg && <color attach="background" args={[bg]} />}
          {/* Giàn đèn COPY NGUYÊN từ atlas viewer (AtlasScene.tsx:43-45): key
              mạnh trước-trên-trái, rim lạnh sau-phải tách khối, hemisphere sáng.
              Viewer không đổi đèn theo theme — trang cử chỉ cũng vậy, chỉ nền
              là theo theme. */}
          <hemisphereLight args={["#ffffff", "#a7acb2", 1.05]} />
          <directionalLight position={[-2, 4, 3]} intensity={2.3} color="#fffaf4" />
          <directionalLight position={[2, 2, -3]} intensity={1.8} color="#e9f0ff" />
          {built && (
            <AtlasModel
              // Dựng LẠI khi đổi bài: các ref bên trong (mức tách lớp đã áp, mặt
              // phẳng cắt) thuộc về bài cũ. Không có key thì nói "tách lớp" rồi mở
              // bài khác → bài mới không tách; đi từ bài mặt cắt sang bài thường →
              // mặt phẳng cũ vẫn lọc cú trỏ, trỏ vào nửa mô hình không bắt được gì.
              key={scene.slug}
              built={built}
              scene={scene}
              locale={locale}
              layers={layers}
              hidden={hidden}
              cursorRef={cursorRef}
              transformRef={transformRef}
              revealRef={revealRef}
              onHover={onHover}
              pull={pull}
              dissolved={dissolved}
              wonderLabels={wonderLabels}
              hologram={hologram}
              overlay={overlay}
            />
          )}
        </Canvas>
      )}
      {/* Nhãn + đường chỉ kiểu WonderSnap: AtlasModel ghi thẳng DOM ở đây. */}
      <div
        data-ws-labels
        style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", display: "none" }}
      />
      <svg
        data-ws-leader
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", display: "none" }}
      />
      {error && (
        <div className="absolute inset-x-0 top-1/2 mx-auto w-fit -translate-y-1/2 rounded-md bg-red-900/85 px-3 py-2 text-xs text-white">
          {error}
        </div>
      )}
    </div>
  )}</ContentSurface>;
}
