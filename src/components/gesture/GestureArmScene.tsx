"use client";



import { useContent } from "@/components/content/ContentProvider";
import { ContentSurface } from "@/components/content/ContentProvider";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  PARTICLE_BUDGET_GLB,
  dotsOpacityOf,
  fitPointSize,
  makeScatterPoints,
  sampleSurfacePoints,
  stepScatter,
  type ScatterState,
} from "@/lib/gesture/particles";

/**
 * Đám hạt theo cây cảnh GLB. Giữ ở module (không phải ref) vì vòng lặp
 * real-time ghi uniform mỗi khung hình mà luật immutability cấm mutate qua
 * ref/state/prop — WeakMap tự thu hồi khi scene bị gỡ, không rò rỉ.
 */
const dotsByScene = new WeakMap<object, THREE.Points[]>();
const NO_DOTS: THREE.Points[] = [];
/** Mesh + vật liệu theo cây cảnh GLB (hologram ghi qua đây, không đụng ref). */
type GlbEntry = { meshes: THREE.Mesh[]; mats: THREE.Material[] };
const meshesByScene = new WeakMap<object, GlbEntry>();
const NO_ENTRY: GlbEntry = { meshes: [], mats: [] };
/** Độ mờ gốc từng vật liệu (lớp mờ 0,12) — vòng lặp nhân thêm khi hologram. */
const baseOpByMat = new WeakMap<object, number>();
import { Bounds, Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "@/lib/humanAtlas/roomEnvironment";
import {
  CATS,
  MAT,
  ORGAN_ALL_SUBMATS,
  organMat,
  pickCat,
  type CatKey,
} from "@/lib/anatomy/layers";
import { WONDER_PULL_DIST } from "@/lib/gesture/wondersnap";

export type LayerState = Record<CatKey, { visible: boolean; faded: boolean }>;

/** Trạng thái biến đổi mô hình do cử chỉ điều khiển (đọc mỗi khung hình, không qua React). */
export type Transform = {
  rotX: number; // ngửa/cúi (quanh trục ngang)
  rotY: number; // quay trái/phải (quanh trục dọc)
  /**
   * NGHIÊNG trong mặt phẳng màn hình. Thêm vào để mô hình xoay khớp góc của bộ
   * phận thật vừa quét — cẳng tay nằm ngang thì mô hình cũng nằm ngang.
   * Cử chỉ tay KHÔNG đụng tới trục này; nó chỉ do lần quét đặt ra, và nút
   * "về vị trí ban đầu" xoá đi.
   */
  rotZ: number;
  /**
   * Lật gương. Mọi mô hình chi của dự án đều dựng BÊN PHẢI; quét bên trái thì
   * lật để đúng bên. Lật một mô hình chi phải cho ra đúng một chi trái.
   */
  mirror: boolean;
  zoom: number; // 1 = kích thước gốc
  panX: number;
  panY: number;
  explode: number; // 0 = gộp, 1 = tách lớp
};

export const defaultTransform = (): Transform => ({
  rotX: 0,
  rotY: 0,
  rotZ: 0,
  mirror: false,
  zoom: 1,
  panX: 0,
  panY: 0,
  explode: 0,
});

/** Vật liệu tô sáng cấu trúc đang được ngón trỏ nhắm tới. */
const HIGHLIGHT = new THREE.MeshStandardMaterial({
  color: "#ffb347",
  emissive: "#c2600c",
  emissiveIntensity: 0.55,
  roughness: 0.5,
});

/** Đọc tên hiển thị gọn từ tên mesh glTF (bỏ hậu tố .r/.001, gạch dưới…). */
export function prettyMeshName(raw: string): string {
  return raw
    .replace(/\.\d+$/, "")
    .replace(/\.[lr]$/i, "")
    .replace(/_/g, " ")
    .trim();
}

function ForearmModel({
  url,
  layers,
  cursorRef,
  onHover,
  transformRef,
  hidden,
  pull,
  dissolved = false,
  hologram = false,
}: {
  url: string;
  layers: LayerState;
  cursorRef: React.RefObject<{ x: number; y: number; active: boolean }>;
  onHover: (info: { name: string; raw: string; cat: CatKey } | null) => void;
  transformRef: React.RefObject<Transform>;
  /** Tên mesh đã bị "vứt" đi — ẩn hẳn, và Undo sẽ lấy lại. */
  hidden: string[];
  /**
   * Part đang bị kéo tiến về phía người xem (pinch kiểu WonderSnap).
   * Đổi tham chiếu mới chỉ khi bấm chụm/đổi part — render lại rẻ, còn nội suy
   * mượt chạy trong useFrame.
   */
  pull?: { key: string; target: number } | null;
  /** true = model đang tan thành hạt (búng tay) — hạt gom lại khi false. */
  dissolved?: boolean;
  /** true = chấm phát sáng thay model đặc (kiểu WonderSnap, chỉ trang này). */
  hologram?: boolean;
}) {
  const cmsContent = useContent();
  const CATS = cmsContent.resolve(cmsSourceCATS());

  const { scene } = useGLTF(url, "/draco/");
  const { camera, gl } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const hoveredRef = useRef<THREE.Mesh | null>(null);

  // gán vật liệu theo lớp + ghi nhớ vị trí gốc để "tách lớp"
  const scn = useMemo(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const cat = pickCat(`${m.name} ${m.parent?.name ?? ""}`);
      m.userData.cat = cat;
      m.userData.baseMaterial = cat === "organ" ? organMat(m.name) : MAT[cat];
      m.material = m.userData.baseMaterial;
      m.renderOrder = cat === "skin" ? 10 : 0;
      if (!m.userData.homePosition) m.userData.homePosition = m.position.clone();
    });
    return scene;
  }, [scene]);

  // Duyệt cây cảnh MỘT LẦN rồi giữ lại mảng mesh. Mô hình cẳng tay có hàng trăm
  // node; traverse() lại mỗi khung hình (60 lần/giây) chỉ để dịch vị trí lớp là
  // lãng phí thấy rõ trên máy yếu — mà đây lại đúng là máy chạy song song cả
  // nhận diện tay.
  /** Những mesh con trỏ được phép bắt: đang hiện VÀ không bị làm mờ. */
  const pickableRef = useRef<THREE.Mesh[]>([]);
  /** Vị trí tách lớp đã áp dụng — chỉ dịch lại khi hệ số thay đổi thật. */
  const explodeRef = useRef(-1);
  /** Tan/gom hạt kiểu WonderSnap: đích theo prop `dissolved` (sự kiện). */
  const scatterRef = useRef<ScatterState>({ value: 0, target: 0 });
  const scatterTimeRef = useRef(0);
  /** Hologram: 0 = model đặc, 1 = chấm phát sáng — nội suy mượt như tan/gom. */
  const holoRef = useRef(0);
  useEffect(() => {
    scatterRef.current.target = dissolved ? 1 : 0;
    if (dissolved && hoveredRef.current) {
      hoveredRef.current.material = hoveredRef.current.userData.baseMaterial;
      hoveredRef.current = null;
    }
  }, [dissolved]);
  // Lấy mẫu hạt MỘT LẦN mỗi model: gom mesh theo lớp, nướng ma trận lúc dựng
  // vào vị trí hạt rồi gắn vào cây cảnh. Gỡ sạch khi đổi model (scene của
  // useGLTF dùng chung bộ nhớ đệm nên không được để sót).
  useEffect(() => {
    scn.updateMatrixWorld(true);
    const inv = new THREE.Matrix4().copy(scn.matrixWorld).invert();
    const rel = new THREE.Matrix4();
    const buckets = new Map<string, { geos: { geo: THREE.BufferGeometry; m: THREE.Matrix4 }[]; verts: number; color: THREE.Color }>();
    let totalVerts = 0;
    const meshes: THREE.Mesh[] = [];
    const matSet = new Set<THREE.Material>();
    scn.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh || !m.visible) return;
      meshes.push(m);
      if (m.material) matSet.add(m.material as THREE.Material);
      const geo = m.geometry as THREE.BufferGeometry;
      const p = geo.getAttribute("position") as THREE.BufferAttribute | undefined;
      if (!p || p.count === 0) return;
      const cat = String(m.userData.cat ?? "organ");
      let b = buckets.get(cat);
      if (!b) {
        const base = m.userData.baseMaterial as THREE.Material | undefined;
        const col =
          base && "color" in base ? ((base as THREE.MeshStandardMaterial).color.clone() as THREE.Color) : new THREE.Color("#ffe9d0");
        b = { geos: [], verts: 0, color: col };
        buckets.set(cat, b);
      }
      rel.multiplyMatrices(inv, m.matrixWorld);
      b.geos.push({ geo, m: rel.clone() });
      b.verts += p.count;
      totalVerts += p.count;
    });
    const bb = new THREE.Box3().setFromObject(scn);
    const bsize = bb.getSize(new THREE.Vector3());
    const maxDim = Math.max(bsize.x, bsize.y, bsize.z, 1e-3);
    const made: THREE.Points[] = [];
    buckets.forEach((b) => {
      if (!b.geos.length || totalVerts <= 0) return;
      const budget = Math.max(200, Math.round((PARTICLE_BUDGET_GLB * b.verts) / totalVerts));
      const pos: number[] = [];
      const seed: number[] = [];
      for (const g of b.geos) {
        const gv = (g.geo.getAttribute("position") as THREE.BufferAttribute).count;
        const c = Math.max(1, Math.round((budget * gv) / Math.max(b.verts, 1)));
        const d = sampleSurfacePoints(g.geo, g.m, c);
        for (let i = 0; i < d.positions.length; i++) pos.push(d.positions[i]);
        for (let i = 0; i < d.seeds.length; i++) seed.push(d.seeds[i]);
      }
      const pts = makeScatterPoints(
        { positions: new Float32Array(pos), seeds: new Float32Array(seed) },
        b.color,
        maxDim * 0.5,
      );
      const u = (pts.material as THREE.ShaderMaterial).uniforms as unknown as { uSize: { value: number } };
      u.uSize.value = fitPointSize(gl, camera, maxDim * 0.006);
      scn.add(pts);
      made.push(pts);
    });
    dotsByScene.set(scn, made);
    meshesByScene.set(scn, { meshes, mats: [...matSet] });
    // Chốt ngay trạng thái hiện tại (đổi model lúc đang ẩn thì ẩn luôn).
    scatterRef.current.value = scatterRef.current.target;
    return () => {
      for (const pts of made) {
        scn.remove(pts);
        pts.geometry.dispose();
        (pts.material as THREE.Material).dispose();
      }
      dotsByScene.delete(scn);
      meshesByScene.delete(scn);
    };
  }, [scn, gl, camera]);
  /** Kéo part (pinch): tiến mượt về đích, áp cùng lượt với tách lớp. */
  const pullAmtRef = useRef(0);
  const pullSigRef = useRef("");
  const lastPickRef = useRef(0);

  // hiện/mờ theo lớp
  useEffect(() => {
    CATS.forEach((c) => {
      const mat = MAT[c.key];
      const faded = layers[c.key]?.faded;
      mat.transparent = !!faded;
      mat.opacity = faded ? 0.12 : 1;
      mat.depthWrite = !faded;
      mat.needsUpdate = true;
      baseOpByMat.set(mat, faded ? 0.12 : 1);
    });
    const organFaded = layers.organ?.faded;
    ORGAN_ALL_SUBMATS.forEach((mat) => {
      mat.transparent = !!organFaded;
      mat.opacity = organFaded ? 0.12 : 1;
      mat.depthWrite = !organFaded;
      mat.needsUpdate = true;
      baseOpByMat.set(mat, organFaded ? 0.12 : 1);
    });
    // Lớp bị làm mờ thì con trỏ phải XUYÊN QUA (nhìn thấy lờ mờ nhưng chọn được
    // thứ bên dưới) — trước đây nhận biết bằng cách so opacity với 0.12, hỏng
    // ngay khi ai đó đổi con số đó ở chỗ khác. Giờ suy thẳng từ trạng thái lớp.
    const dropped = new Set(hidden);
    const pickable: THREE.Mesh[] = [];
    scn.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const st = layers[m.userData.cat as CatKey];
      m.visible = (st?.visible ?? true) && !dropped.has(m.name);
      m.userData.baseVis = m.visible;
      // Danh sách này chính là thứ con trỏ dò tới, dựng sẵn ở đây để vòng lặp
      // vẽ không phải duyệt lại cả cây cảnh mỗi lần bắn tia.
      if (m.visible && !st?.faded) pickable.push(m);
    });
    pickableRef.current = pickable;
  }, [scn, layers, hidden, CATS]);

  useFrame((_, delta) => {
    const t = transformRef.current;
    const group = groupRef.current;
    if (group && t) {
      // Làm mượt theo THỜI GIAN THẬT, không theo số khung hình: hằng số 0.25
      // mỗi khung khiến màn hình 144 Hz đuổi theo nhanh gấp 2,4 lần màn hình
      // 60 Hz, tức là cùng một động tác tay lại cho tốc độ khác nhau tuỳ máy.
      const a = 1 - Math.exp(-delta / 0.06); // hằng số thời gian 60 ms
      // Thứ tự YXZ: nghiêng (Z) áp SAU CÙNG nên nó là nghiêng TRONG MẶT PHẲNG
      // MÀN HÌNH, đúng thứ ta đo được từ ảnh camera. Để thứ tự mặc định XYZ thì
      // góc nghiêng bị trộn vào hai trục kia và mô hình lệch đi khi vừa xoay
      // vừa nghiêng.
      group.rotation.order = "YXZ";
      group.rotation.y += (t.rotY - group.rotation.y) * a;
      group.rotation.x += (t.rotX - group.rotation.x) * a;
      group.rotation.z += (t.rotZ - group.rotation.z) * a;
      // Lật gương bằng tỉ lệ ÂM trên trục x. Three.js tự đảo ma trận pháp tuyến
      // nên ánh sáng vẫn đúng; chỉ cần đảo luôn chiều mặt để không bị cắt mặt
      // trước (xem `flipSide` bên dưới).
      const sx = (t.mirror ? -1 : 1) * t.zoom;
      group.scale.x += (sx - group.scale.x) * a;
      group.scale.y += (t.zoom - group.scale.y) * a;
      group.scale.z += (t.zoom - group.scale.z) * a;
      group.position.x += (t.panX - group.position.x) * a;
      group.position.y += (t.panY - group.position.y) * a;
    }

    // "tách lớp": đẩy từng nhóm ra xa tâm theo hệ số explode.
    // Chỉ tính lại khi hệ số ĐỔI — lúc đứng yên (phần lớn thời gian) thì bỏ qua.
    // Part bị pinch-kéo thì tiến thêm về phía người xem (kiểu WonderSnap).
    const k = t?.explode ?? 0;
    const pullKey = pull?.key ?? null;
    const pullTarget = pullKey ? (pull?.target ?? 1) : 0;
    pullAmtRef.current += (pullTarget - pullAmtRef.current) * (1 - Math.exp(-delta / 0.06));
    if (Math.abs(pullAmtRef.current - pullTarget) < 1e-3) pullAmtRef.current = pullTarget;
    const pullSig = `${k}|${pullKey ?? ""}|${pullAmtRef.current.toFixed(3)}`;
    if (pullSig !== pullSigRef.current) {
      pullSigRef.current = pullSig;
      explodeRef.current = k;
      const offsets: Record<string, number> = {
        skin: 0.16, muscle: 0.09, artery: 0.045, vein: 0.03, nerve: 0.015, bone: 0,
      };
      scn.traverse((o) => {
        const m = o as THREE.Mesh;
        const home = m.userData.homePosition as THREE.Vector3 | undefined;
        if (!m.isMesh || !home) return;
        const off = offsets[m.userData.cat as string] ?? 0.05;
        m.position.copy(home);
        m.position.x += off * k;
        if (pullKey && m.name === pullKey) m.position.z += WONDER_PULL_DIST * pullAmtRef.current;
      });
    }

    // raycast từ con trỏ ngón trỏ vào mô hình
    const cur = cursorRef.current;
    if (!cur?.active) {
      if (hoveredRef.current) {
        hoveredRef.current.material = hoveredRef.current.userData.baseMaterial;
        hoveredRef.current = null;
        onHover(null);
      }
      return;
    }
    // Tan/gom hạt + hologram (xem khối trên): vật liệu chung theo lớp nên giữ
    // độ mờ gốc riêng từng cái trong baseOpByMat để pha mờ không lan.
    const sc = scatterRef.current;
    stepScatter(sc, delta);
    scatterTimeRef.current += delta;
    const sk = sc.value;
    // Hologram: mesh mờ dần về 0 (vật liệu chung nên giữ baseOp riêng từng cái),
    // hạt nền hiện lên thay thế. Ghi qua entry module để lint yên.
    holoRef.current += ((hologram ? 1 : 0) - holoRef.current) * (1 - Math.exp(-delta / 0.25));
    const hh = holoRef.current;
    const entry = meshesByScene.get(scn) ?? NO_ENTRY;
    for (const mat of entry.mats) {
      const mm = mat as THREE.MeshStandardMaterial;
      const base = baseOpByMat.get(mat) ?? 1;
      mm.opacity = base * (1 - hh);
      const transp = hh > 0 || base < 1;
      mm.transparent = transp;
      mm.depthWrite = !transp;
    }
    const holoHidden = hh > 0.5;
    for (const m of entry.meshes) m.visible = (m.userData.baseVis ?? true) && !holoHidden;
    const dotsOp = Math.max(dotsOpacityOf(sk), hh * 0.85);
    for (const pts of dotsByScene.get(scn) ?? NO_DOTS) {
      const u = (pts.material as THREE.ShaderMaterial).uniforms as unknown as {
        uScatter: { value: number };
        uOpacity: { value: number };
        uTime: { value: number };
      };
      u.uScatter.value = sk;
      u.uOpacity.value = dotsOp;
      u.uTime.value = scatterTimeRef.current;
      pts.visible = dotsOp > 0.01;
    }
    if (group) group.visible = sc.target === 1 ? sk <= 0.6 : sk <= 0.4;
    const transitioning = (sc.target === 1 && sk < 0.995) || (sc.target === 0 && sk > 0.005);

    // Bắn tia ~30 lần/giây là quá đủ cho con trỏ tay (bản thân nhận diện chỉ
    // ~25 Hz); bắn mỗi khung hình chỉ tốn CPU mà mắt không phân biệt được.
    // Đang tan/gom thì bỏ bắt điểm.
    const nowMs = performance.now();
    if (nowMs - lastPickRef.current < 33 || transitioning) return;
    lastPickRef.current = nowMs;

    const ndc = new THREE.Vector2(cur.x * 2 - 1, -(cur.y * 2 - 1));
    raycaster.setFromCamera(ndc, camera);
    // Chỉ dò trong danh sách đã lọc (hiện + không mờ), và `false` = không duyệt
    // xuống con, vì danh sách đã là mesh lá rồi.
    const hits = raycaster.intersectObjects(pickableRef.current, false);
    const mesh = (hits[0]?.object as THREE.Mesh) ?? null;

    if (mesh !== hoveredRef.current) {
      if (hoveredRef.current) hoveredRef.current.material = hoveredRef.current.userData.baseMaterial;
      hoveredRef.current = mesh;
      if (mesh) {
        mesh.material = HIGHLIGHT;
        onHover({ name: prettyMeshName(mesh.name), raw: mesh.name, cat: mesh.userData.cat as CatKey });
      } else {
        onHover(null);
      }
    }
  });

  // Rời trang thì trả vật liệu gốc: `scene` của useGLTF được dùng chung trong
  // bộ nhớ đệm, để nguyên vật liệu tô sáng thì lần sau mở lại sẽ thấy một cấu
  // trúc sáng rực vô cớ.
  useEffect(() => {
    const hovered = hoveredRef;
    return () => {
      const m = hovered.current;
      if (m) m.material = m.userData.baseMaterial as THREE.Material;
      hovered.current = null;
    };
  }, []);

  // Center phải nằm BÊN TRONG nhóm biến đổi: có vậy tâm xoay/phóng mới là tâm
  // mô hình. Nếu đặt ngược lại, tâm xoay rơi vào gốc toạ độ Blender ở rất xa và
  // mô hình bị văng khỏi khung ngay khi xoay hoặc phóng to.
  return <ContentSurface scope="src/components/gesture/GestureArmScene.tsx">{(
    <group ref={groupRef}>
      <Center>
        <primitive object={scn} />
      </Center>
    </group>
  )}</ContentSurface>;
}

// Nền 3D theo theme: light = giấy ấm, dark = đen. Đọc `data-theme` trên
// <html> (do ThemeToggle đặt) thay vì hard-code — trước đây dark mode vẫn để
// nền kem sáng nên cả khung mô hình chói giữa trang tối.
export function useStageDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const read = () => setDark(el.getAttribute("data-theme") === "dark");
    read();
    const ro = new MutationObserver(read);
    ro.observe(el, { attributes: true, attributeFilter: ["data-theme", "class"] });
    return () => ro.disconnect();
  }, []);
  return dark;
}

// Cùng một bẫy đã gặp ở /xem: <Canvas> gắn vào khung chưa đo được nên kẹt ở
// cỡ mặc định 300x150 và không bao giờ tải mô hình. Dùng lại đúng cách chữa đó.
export function useBoxReady() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      const r = el.getBoundingClientRect();
      if (r.width > 1 && r.height > 1) setReady(true);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    // Lưới an toàn: ResizeObserver chỉ được gọi trong bước dựng hình của trình
    // duyệt, nên nếu khung chứa mới có kích thước đúng lúc tab đang bị ẩn /
    // không dựng hình thì lần gọi ấy MẤT LUÔN, và trang đứng im vĩnh viễn với
    // một khung trắng. Vài lần kiểm lại bằng đồng hồ khiến việc đó không xảy ra.
    const timers = [150, 500, 1200, 2500].map((ms) => window.setTimeout(check, ms));
    return () => {
      ro.disconnect();
      timers.forEach(window.clearTimeout);
    };
  }, []);

  // Vẫn bắn một sự kiện resize sau khi <Canvas> đã gắn: đo trên chính máy dựng
  // (Chrome nhúng của công cụ) thấy ResizeObserver KHÔNG luôn kích hoạt lần
  // đầu, mà thư viện đo khung của R3F chỉ dựa vào ResizeObserver và sự kiện
  // resize của cửa sổ. Không có dòng này thì canvas vẫn kẹt ở cỡ 300x150 dù
  // khung chứa đã đúng kích thước.
  useEffect(() => {
    if (!ready) return;
    // Bắn VÀI LẦN chứ không một lần: bắn ngay ở khung hình kế tiếp thì bố cục
    // đôi khi chưa xong nên phép đo vẫn ra 0. Dừng ngay khi canvas đã được đặt
    // đúng cỡ (khác cỡ mặc định 300x150 của thẻ canvas).
    const timers = [0, 120, 400, 900].map((ms) =>
      window.setTimeout(() => {
        const el = ref.current?.querySelector("canvas");
        if (el && el.width > 300) return;
        window.dispatchEvent(new Event("resize"));
      }, ms),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [ready]);

  return { ref, ready };
}

export default function GestureArmScene(props: {
  url?: string;
  layers: LayerState;
  cursorRef: React.RefObject<{ x: number; y: number; active: boolean }>;
  onHover: (info: { name: string; raw: string; cat: CatKey } | null) => void;
  transformRef: React.RefObject<Transform>;
  hidden: string[];
  /**
   * Nền trong suốt để video webcam lót bên dưới (sân khấu kiểu WonderSnap).
   * Mặc định false: giữ nguyên nền đặc như cũ.
   */
  transparentBg?: boolean;
  /** Mesh đang bị pinch-kéo (kiểu WonderSnap) — truyền xuống ForearmModel. */
  pull?: { key: string; target: number } | null;
  /** true = model đang tan thành hạt (búng tay) — truyền xuống ForearmModel. */
  dissolved?: boolean;
  /** true = chấm phát sáng thay model đặc — truyền xuống ForearmModel. */
  hologram?: boolean;
}) {
  const { url = "/models/forearm.glb", transparentBg = false, ...rest } = props;
  const { ref: boxRef, ready: boxReady } = useBoxReady();
  const dark = useStageDark();
  const bg = dark ? "#12110f" : "#f4efe6";
  return <ContentSurface scope="src/components/gesture/GestureArmScene.tsx">{(
    <div ref={boxRef} style={{ width: "100%", height: "100%" }}>
      {boxReady && (
      <Canvas
      // dpr trần 2 cho nét ngang trang viewer (atlas viewer cũng dpr 2):
      // trước đây kẹp 1,25 để nhẹ GPU khi chạy song song nhận diện tay, nhưng
      // đo thực tế nhận diện ăn CPU/MediaPipe còn GPU vẫn còn dư, trong khi
      // viền cơ/mạch bị răng cưa thấy rõ khi so với trang viewer.
      dpr={[1, 2]}
      camera={{ position: [0, 0, 2.4], fov: 40, near: 0.01, far: 100 }}
      // preserveDrawingBuffer: cho phép đọc lại khung đã vẽ để tự kiểm chứng/chụp ảnh
      // powerPreference: máy hai card (Intel + rời) mặc định giao WebGL cho card
      // tích hợp; xin thẳng card mạnh là thứ rẻ nhất có thể làm cho nhịp vẽ.
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        preserveDrawingBuffer: true,
      }}
      onCreated={(state) => {
        // Cùng IBL + exposure với scene atlas bên cạnh: hai loại mô hình đứng
        // chung một trang phải ăn chung một ánh sáng, nếu không đổi mô hình là
        // thấy như hai trang khác nhau.
        state.gl.toneMappingExposure = 1.12;
        const pmrem = new THREE.PMREMGenerator(state.gl);
        const room = new RoomEnvironment();
        state.scene.environment = pmrem.fromScene(room, 0.04).texture;
        room.dispose();
        pmrem.dispose();
      }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Sân khấu WonderSnap thì bỏ nền đặc để thấy video bên dưới. */}
      {!transparentBg && <color attach="background" args={[bg]} />}
      {/* Giàn đèn COPY NGUYÊN từ atlas viewer: key mạnh, rim lạnh tách khối,
          hemisphere sáng. Trước đây đèn yếu (key 1.15) nên mô hình bẹt, nhợt. */}
      <hemisphereLight args={["#ffffff", "#a7acb2", 1.05]} />
      <directionalLight position={[-2, 4, 3]} intensity={2.3} color="#fffaf4" />
      <directionalLight position={[2, 2, -3]} intensity={1.8} color="#e9f0ff" />
      {/* KHÔNG dùng observe (căn lại khung mỗi lần zoom) và KHÔNG dùng clip
          (siết near/far sát mô hình -> vừa xoay/zoom là bị cắt mất hình).
          margin 1.02 = cắt gọn, mô hình choán gần hết khung; đừng về 1.0 tròn
          vì phép fit theo mặt cầu bao sẽ chạm viền ở đúng cạnh khung. */}
      {/* Suspense NẰM TRONG Canvas là bắt buộc: `useGLTF` treo (suspend) trong
          lúc tải, mà trang cử chỉ đổi mô hình NGAY GIỮA phiên. Không có ranh
          giới ở đây thì cú treo ấy leo lên tận trang, React gỡ cả cây — kể cả
          thẻ <video> — và camera bị tắt rồi phải xin quyền lại. */}
      <Suspense fallback={null}>
        <Bounds fit margin={1.02} key={url}>
          <ForearmModel url={url} {...rest} />
        </Bounds>
      </Suspense>
      </Canvas>
      )}
    </div>
  )}</ContentSurface>;
}

useGLTF.preload("/models/forearm.glb", "/draco/");

function cmsSourceCATS() { return CATS; }
