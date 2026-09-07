"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bounds, Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import {
  CATS,
  MAT,
  ORGAN_ALL_SUBMATS,
  organMat,
  pickCat,
  type CatKey,
} from "@/lib/anatomy/layers";

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
}: {
  url: string;
  layers: LayerState;
  cursorRef: React.RefObject<{ x: number; y: number; active: boolean }>;
  onHover: (info: { name: string; raw: string; cat: CatKey } | null) => void;
  transformRef: React.RefObject<Transform>;
  /** Tên mesh đã bị "vứt" đi — ẩn hẳn, và Undo sẽ lấy lại. */
  hidden: string[];
}) {
  const { scene } = useGLTF(url, "/draco/");
  const { camera } = useThree();
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
    });
    const organFaded = layers.organ?.faded;
    ORGAN_ALL_SUBMATS.forEach((mat) => {
      mat.transparent = !!organFaded;
      mat.opacity = organFaded ? 0.12 : 1;
      mat.depthWrite = !organFaded;
      mat.needsUpdate = true;
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
      // Danh sách này chính là thứ con trỏ dò tới, dựng sẵn ở đây để vòng lặp
      // vẽ không phải duyệt lại cả cây cảnh mỗi lần bắn tia.
      if (m.visible && !st?.faded) pickable.push(m);
    });
    pickableRef.current = pickable;
  }, [scn, layers, hidden]);

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
    const k = t?.explode ?? 0;
    if (k !== explodeRef.current) {
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
    // Bắn tia ~30 lần/giây là quá đủ cho con trỏ tay (bản thân nhận diện chỉ
    // ~25 Hz); bắn mỗi khung hình chỉ tốn CPU mà mắt không phân biệt được.
    const nowMs = performance.now();
    if (nowMs - lastPickRef.current < 33) return;
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
  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scn} />
      </Center>
    </group>
  );
}

// Cùng một bẫy đã gặp ở /xem: <Canvas> gắn vào khung chưa đo được nên kẹt ở
// cỡ mặc định 300x150 và không bao giờ tải mô hình. Dùng lại đúng cách chữa đó.
function useBoxReady() {
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
}) {
  const { url = "/models/forearm.glb", ...rest } = props;
  const { ref: boxRef, ready: boxReady } = useBoxReady();
  return (
    <div ref={boxRef} style={{ width: "100%", height: "100%" }}>
      {boxReady && (
      <Canvas
      // dpr trần 1,25 chứ không 1,5: trang này vẽ mô hình vài trăm mesh SONG
      // SONG với nhận diện tay (cũng ăn GPU). 1,5 → 1,25 cắt ~30% số điểm ảnh
      // phải tô, và ở cỡ này mắt gần như không phân biệt được — nhưng nhịp vẽ
      // thì có, mà nhịp vẽ chính là trần của độ mượt con trỏ.
      dpr={[1, 1.25]}
      camera={{ position: [0, 0, 2.4], fov: 40, near: 0.01, far: 100 }}
      // preserveDrawingBuffer: cho phép đọc lại khung đã vẽ để tự kiểm chứng/chụp ảnh
      // powerPreference: máy hai card (Intel + rời) mặc định giao WebGL cho card
      // tích hợp; xin thẳng card mạnh là thứ rẻ nhất có thể làm cho nhịp vẽ.
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        preserveDrawingBuffer: true,
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#f4efe6"]} />
      <hemisphereLight args={["#fff6ea", "#cbb9a0", 0.75]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 5, 4]} intensity={1.15} color="#fff3e2" />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#e7d9c4" />
      {/* KHÔNG dùng observe (căn lại khung mỗi lần zoom) và KHÔNG dùng clip
          (siết near/far sát mô hình -> vừa xoay/zoom là bị cắt mất hình) */}
      {/* Suspense NẰM TRONG Canvas là bắt buộc: `useGLTF` treo (suspend) trong
          lúc tải, mà trang cử chỉ đổi mô hình NGAY GIỮA phiên. Không có ranh
          giới ở đây thì cú treo ấy leo lên tận trang, React gỡ cả cây — kể cả
          thẻ <video> — và camera bị tắt rồi phải xin quyền lại. */}
      <Suspense fallback={null}>
        <Bounds fit margin={1.1} key={url}>
          <ForearmModel url={url} {...rest} />
        </Bounds>
      </Suspense>
      </Canvas>
      )}
    </div>
  );
}

useGLTF.preload("/models/forearm.glb", "/draco/");
