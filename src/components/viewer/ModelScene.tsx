"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Bounds } from "@react-three/drei";
import * as THREE from "three";
import { useAnatomyStore, type SelectedPart, type SystemKey } from "@/store/useAnatomyStore";
import Hotspots from "./Hotspots";
import { defaultViewerHotspots, type SceneHotspot } from "@/lib/sceneModules";

export const SYSTEM_FILES: Record<SystemKey, string> = {
  skeletal: "/models/skeletal.glb",
  muscular: "/models/muscular.glb",
  nervous: "/models/nervous.glb",
  cardiovascular: "/models/cardiovascular.glb",
  visceral: "/models/visceral.glb",
  lymphoid: "/models/lymphoid.glb",
  joints: "/models/joints.glb",
};

/** Bỏ hậu tố .l/.r/.j và ngoặc trong tên mesh Z-Anatomy → tên hiển thị gọn. */
function cleanName(raw: string): string {
  let n = raw.replace(/_/g, " ");
  const m = n.match(/\.(ol|or|l|r|j)$/i);
  let side = "";
  if (m) {
    const s = m[1].toLowerCase();
    side = s === "l" || s === "ol" ? " · trái" : s === "r" || s === "or" ? " · phải" : "";
    n = n.slice(0, m.index);
  }
  n = n.replace(/^\(/, "").replace(/\)$/, "").trim();
  return n + side;
}

function getStd(mesh: THREE.Mesh): THREE.MeshStandardMaterial | null {
  const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  return mat && (mat as THREE.MeshStandardMaterial).isMeshStandardMaterial
    ? (mat as THREE.MeshStandardMaterial)
    : null;
}

/**
 * Màu mô THẬT theo đúng tên material gốc Z-Anatomy (đã đọc trực tiếp JSON
 * chunk của từng .glb để xác nhận tên tồn tại thật — không tự đặt tên khác).
 * Chỉ áp khi material KHÔNG có baseColorFactor thật trong file (mặc định
 * trắng [1,1,1] theo spec glTF) — các material đã có màu thật do Z-Anatomy
 * gán sẵn (VD Peritoneum cam, Lung hồng, Fascia xanh nhạt, Brain nâu đỏ...)
 * được GIỮ NGUYÊN, không ghi đè.
 */
const TISSUE_COLORS: Record<string, string> = {
  Bone: "#e8dfc8",
  Teeth: "#f2ede0",
  "Teeth-roots": "#f2ede0",
  Ligament: "#e0d3a0",
  Tendon: "#e0c98a",
  Artery: "#c23b3b",
  Vein: "#3a5fc2",
  Organ: "#c98a7c",
  Mucosa: "#d98a94",
  Gland: "#d9b89a",
  Bronchi: "#d9a08a",
  Ductus: "#d9b89a",
  Nerve: "#e8c468",
  "Articular capsule": "#d9c9a0",
};

const SYSTEM_FALLBACK_COLOR: Record<SystemKey, string> = {
  skeletal: "#e8dfc8",
  muscular: "#a5433e",
  nervous: "#e8c468",
  cardiovascular: "#c23b3b",
  visceral: "#c98a7c",
  lymphoid: "#a8c98a",
  joints: "#d9c9a0",
};

/**
 * Màu ÉP BUỘC — ghi đè cả material đã có màu thật. Dùng cho lớp "vỏ ngoài"
 * (Fascia = mạc nông, đóng vai da) để tô tông da ấm giống atlas thương mại
 * (lựa chọn 3A của user) thay vì màu teal quy ước gốc Z-Anatomy.
 */
const FORCED_COLORS: Record<string, string> = {
  Fascia: "#d8b090",
  Superficial: "#cfa07e",
};

/**
 * Độ nhám bề mặt theo LOẠI MÔ để bớt cảm giác "phẳng nhựa" — tạng/niêm mạc
 * ẩm & bóng nhẹ (roughness thấp), xương/mạc/gân khô & mờ (roughness cao).
 * Chưa có texture PBR thật nên đây là cách rẻ nhất tạo chiều sâu chất liệu.
 */
const TISSUE_ROUGHNESS: Record<string, number> = {
  Organ: 0.42,
  Mucosa: 0.38,
  Intestine: 0.45,
  Gallbladder: 0.4,
  Lung: 0.55,
  Peritoneum: 0.35,
  Gland: 0.45,
  Bone: 0.7,
  Teeth: 0.35,
  Cartilage: 0.5,
  Fascia: 0.78,
  Superficial: 0.72,
  Ligament: 0.6,
  Tendon: 0.55,
  Artery: 0.5,
  Vein: 0.5,
  Nerve: 0.6,
};

/**
 * Lớp DA toàn thân — một mesh duy nhất bọc voxel quanh cơ + xương chi/sọ
 * (`scripts/blender/region_config.py`, vùng "fullbody_skin").
 *
 * Trước đây lớp ngoài cùng của model toàn thân là "Fascia" của Z-Anatomy: hở
 * ở cổ tay, cổ chân, háng và không có hình đầu, nên nhìn như ma-nơ-canh vỡ.
 * Lớp da này chỉ thêm ĐÚNG MỘT draw call nên không ảnh hưởng hiệu năng của
 * scene 7 hệ, và không tham gia raycast để bấm vẫn chọn được cấu trúc bên dưới.
 */
const SKIN_URL = "/models/fullbody_skin.glb";

const SKIN_MATERIAL = new THREE.MeshStandardMaterial({
  color: "#e7b697",
  roughness: 0.72,
  metalness: 0,
});

function SkinLayer() {
  const { scene } = useGLTF(SKIN_URL, "/draco/");
  const skinVisible = useAnatomyStore((s) => s.skinVisible);
  const skinFaded = useAnatomyStore((s) => s.skinFaded);

  const prepared = useMemo(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.material = SKIN_MATERIAL;
      mesh.raycast = () => {};      // không chắn chuột khi chọn cấu trúc bên trong
      mesh.renderOrder = 10;        // vẽ sau cùng để phần trong suốt chồng đúng
    });
    return scene;
  }, [scene]);

  useEffect(() => {
    SKIN_MATERIAL.transparent = skinFaded;
    SKIN_MATERIAL.opacity = skinFaded ? 0.16 : 1;
    SKIN_MATERIAL.depthWrite = !skinFaded;
    SKIN_MATERIAL.needsUpdate = true;
  }, [skinFaded]);

  return <primitive object={prepared} visible={skinVisible} />;
}

function SystemModel({
  url,
  visible,
  faded,
  systemKey,
}: {
  url: string;
  visible: boolean;
  /** Cả hệ đang ở trạng thái mờ — để nhìn xuyên qua mà không phải tắt hẳn. */
  faded: boolean;
  systemKey: SystemKey;
}) {
  const { scene } = useGLTF(url, "/draco/");
  const hiddenIds = useAnatomyStore((s) => s.hiddenIds);
  const fadedIds = useAnatomyStore((s) => s.fadedIds);
  const isolatedId = useAnatomyStore((s) => s.isolatedId);

  useEffect(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;

      // Nhãn text 3D của Z-Anatomy (tên hệ nổi lơ lửng "VISCERAL SYSTEMS"...)
      // KHÔNG phải giải phẫu → ẩn. Bắt theo 2 dấu hiệu vì có nhãn dùng material
      // "Text", có nhãn lại KHÔNG có material (nên chỉ lọc material sẽ sót):
      //  - tên mesh (đã sanitize) kết thúc "_systemg"/"_systemsg" (từ "X system(s).g")
      //  - hoặc material tên "Text".
      const stdEarly = getStd(mesh);
      if (/_systems?g$/i.test(mesh.name) || stdEarly?.name === "Text") {
        mesh.userData.isLabel = true;
      }

      // Lớp "da giả" cũ: Z-Anatomy không có da nên trước đây mạc nông (Fascia,
      // Superficial) bị tô tông da để đóng vai lớp ngoài — nhưng nó hở ở cổ
      // tay, cổ chân, háng và không có mặt. Giờ đã có lớp da voxel thật
      // (fullbody_skin.glb) nên ẩn hẳn mạc nông đi, nếu không hai lớp chồng
      // nhau và bấm "mờ da" trông như không có tác dụng.
      // Lọc theo TÊN MESH, không theo tên material: "Superficial" trong
      // Z-Anatomy là tên NHÓM CƠ NÔNG (platysma, cơ trán…) chứ không phải mạc
      // — lọc theo material sẽ ẩn nhầm hàng trăm cơ thật (đã dính bug này).
      if (/fascia|aponeurosis/i.test(mesh.name)) {
        mesh.userData.isOldSkin = true;
      }

      if (!mesh.material) return;
      // Mỗi mesh một material riêng để highlight độc lập.
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map((m) => m.clone())
        : mesh.material.clone();
      const std = getStd(mesh);
      if (!std) return;

      // Toàn bộ material export đều có emissiveFactor=[1,1,1] (tự phát sáng
      // trắng toàn phần) — lỗi ở bước export đè mất màu mô thật. Tắt hẳn.
      std.emissive.setScalar(0);
      std.emissiveIntensity = 0;

      const base = std.name.replace(/-\d+$/, "").trim();

      // Ưu tiên màu ép buộc (vỏ ngoài → da ấm); nếu không, chỉ điền màu khi
      // material CHƯA có màu thật (còn trắng mặc định theo spec glTF).
      const isDefaultWhite = std.color.r === 1 && std.color.g === 1 && std.color.b === 1;
      if (FORCED_COLORS[base]) {
        std.color.set(FORCED_COLORS[base]);
      } else if (isDefaultWhite) {
        std.color.set(TISSUE_COLORS[base] ?? SYSTEM_FALLBACK_COLOR[systemKey]);
      }

      // Chất liệu: không kim loại, độ nhám theo loại mô (bớt phẳng). Tên như
      // "Lung-3" khớp tiền tố "Lung"; không khớp thì mặc định hơi ẩm 0.5.
      std.metalness = 0;
      const roughKey = Object.keys(TISSUE_ROUGHNESS).find((k) => base.startsWith(k));
      std.roughness = roughKey ? TISSUE_ROUGHNESS[roughKey] : 0.5;
    });
  }, [scene, systemKey]);

  // Ẩn/Mờ/Cô lập tra đúng theo TÊN MESH THẬT (m.name = tên giải phẫu gốc
  // Z-Anatomy/TA2) — không suy đoán theo nhóm, mỗi mesh xử lý độc lập.
  useEffect(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const isolatedOut = isolatedId !== null && mesh.name !== isolatedId;
      mesh.visible =
        !mesh.userData.isLabel && !mesh.userData.isOldSkin && !hiddenIds[mesh.name] && !isolatedOut;
      const std = getStd(mesh);
      if (std) {
        // mờ theo mesh (nút Mờ ở panel thông tin) HOẶC mờ cả hệ (bảng lớp bên trái)
        const dim = faded || !!fadedIds[mesh.name];
        std.transparent = dim;
        std.opacity = dim ? 0.15 : 1;
        std.depthWrite = !dim;
      }
    });
  }, [scene, hiddenIds, fadedIds, isolatedId, faded]);

  return <primitive object={scene} visible={visible} />;
}

/**
 * Mặt cắt lát (clipping plane) toàn thân — áp `std.clippingPlanes` lên MỌI
 * mesh của cả 7 hệ, tính vị trí lát cắt từ bbox THẬT của scene đã nạp (không
 * đoán tọa độ cố định) nên luôn đúng theo kích thước model thực tế.
 * Bật DoubleSide khi cắt để lộ mặt trong của vỏ mesh thay vì để hổng/đen.
 */
function ClipRig() {
  const { scene } = useThree();
  const clipEnabled = useAnatomyStore((s) => s.clipEnabled);
  const clipAxis = useAnatomyStore((s) => s.clipAxis);
  const clipPercent = useAnatomyStore((s) => s.clipPercent);
  const clipKeepPositive = useAnatomyStore((s) => s.clipKeepPositive);

  const plane = useMemo(() => {
    if (!clipEnabled) return null;
    const box = new THREE.Box3().setFromObject(scene);
    if (box.isEmpty()) return null;
    const min = box.min[clipAxis];
    const max = box.max[clipAxis];
    const cut = min + ((max - min) * clipPercent) / 100;
    const axisUnit = new THREE.Vector3(
      clipAxis === "x" ? 1 : 0,
      clipAxis === "y" ? 1 : 0,
      clipAxis === "z" ? 1 : 0,
    );
    // Giữ nửa dương: normal cùng chiều trục, constant = -cut (dot(N,p)+C>=0 <=> p>=cut).
    // Giữ nửa âm: normal ngược chiều trục, constant = +cut (<=> p<=cut).
    const normal = clipKeepPositive ? axisUnit.clone() : axisUnit.clone().negate();
    const constant = clipKeepPositive ? -cut : cut;
    return new THREE.Plane(normal, constant);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, clipEnabled, clipAxis, clipPercent, clipKeepPositive, scene.children.length]);

  useEffect(() => {
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const std = getStd(mesh);
      if (!std) return;
      std.clippingPlanes = plane ? [plane] : null;
      std.clipShadows = true;
      std.side = plane ? THREE.DoubleSide : THREE.FrontSide;
    });
  }, [scene, plane]);

  return null;
}

/** Tự raycast hover + click (R3F event không nhận cây gltf ngoài đáng tin cậy). */
function Picker() {
  const { camera, gl, raycaster, scene } = useThree();
  const setSelected = useAnatomyStore((s) => s.setSelected);
  const setHovered = useAnatomyStore((s) => s.setHovered);
  const hoverRef = useRef<THREE.Mesh | null>(null);
  const selRef = useRef<THREE.Mesh | null>(null);
  const downRef = useRef<[number, number] | null>(null);

  useEffect(() => {
    const el = gl.domElement;
    const HL_HOVER = new THREE.Color("#0ea5e9");
    const HL_SEL = new THREE.Color("#38bdf8");

    const paint = (mesh: THREE.Mesh | null, color: THREE.Color | null, intensity: number) => {
      if (!mesh) return;
      const std = getStd(mesh);
      if (std) {
        std.emissive.copy(color ?? new THREE.Color("#000000"));
        std.emissiveIntensity = intensity;
      }
    };

    const pickAt = (clientX: number, clientY: number): THREE.Mesh | null => {
      const rect = el.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      for (const h of hits) {
        const m = h.object as THREE.Mesh;
        if (m.isMesh && m.name && m.visible) return m;
      }
      return null;
    };

    const onMove = (e: PointerEvent) => {
      const m = pickAt(e.clientX, e.clientY);
      if (m === hoverRef.current) return;
      if (hoverRef.current && hoverRef.current !== selRef.current) paint(hoverRef.current, null, 0);
      hoverRef.current = m;
      if (m && m !== selRef.current) paint(m, HL_HOVER, 0.35);
      setHovered(m ? m.name : null);
      el.style.cursor = m ? "pointer" : "default";
    };

    const onDown = (e: PointerEvent) => {
      downRef.current = [e.clientX, e.clientY];
    };

    const onUp = (e: PointerEvent) => {
      const d = downRef.current;
      downRef.current = null;
      if (!d) return;
      if (Math.abs(e.clientX - d[0]) > 5 || Math.abs(e.clientY - d[1]) > 5) return; // drag = xoay
      const m = pickAt(e.clientX, e.clientY);
      if (selRef.current) paint(selRef.current, null, 0);
      selRef.current = m;
      if (m) {
        paint(m, HL_SEL, 0.6);
        const payload: SelectedPart = { id: m.name, name: cleanName(m.name), latin: m.name.replace(/_/g, " ") };
        setSelected(payload);
      } else {
        setSelected(null);
      }
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
    };
  }, [camera, gl, raycaster, scene, setSelected, setHovered]);

  return null;
}

export default function ModelScene({
  hotspots = defaultViewerHotspots,
  requiredSystems = ["visceral"],
  autoFocusOnLoad = false,
}: {
  hotspots?: SceneHotspot[];
  requiredSystems?: SystemKey[];
  autoFocusOnLoad?: boolean;
}) {
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const visibleSystems = useAnatomyStore((s) => s.visibleSystems);
  const fadedSystems = useAnatomyStore((s) => s.fadedSystems);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 2.6], fov: 40, near: 0.01, far: 100 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      onCreated={({ gl }) => {
        gl.localClippingEnabled = true;
        gl.toneMappingExposure = 1.0;
      }}
    >
      <color attach="background" args={["#f4efe6"]} />
      {/* Studio 3-point: key ấm trước-trên-phải, fill lạnh nhẹ trái, rim sau
          tách khối khỏi nền, hemisphere trời ấm/đất trung tính làm nền dịu.
          Cường độ giữ vừa phải để mô nhạt (xương/da) không cháy trắng. */}
      <hemisphereLight args={["#fff4e6", "#c9ccd4", 0.45]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 6, 5]} intensity={1.25} color="#fff3e2" />
      <directionalLight position={[-5, 1, 2]} intensity={0.35} color="#dbe6f5" />
      <directionalLight position={[-2, 3, -6]} intensity={0.5} color="#ffffff" />
      <Bounds fit clip observe margin={1.1}>
        <Center>
          <group>
            <SkinLayer />
            {(Object.keys(SYSTEM_FILES) as SystemKey[]).map((key) => (
              <SystemModel
                key={key}
                url={SYSTEM_FILES[key]}
                visible={visibleSystems[key]}
                faded={fadedSystems[key]}
                systemKey={key}
              />
            ))}
          </group>
        </Center>
      </Bounds>
      <Picker />
      <ClipRig />
      <Hotspots
        controlsRef={controls}
        hotspots={hotspots}
        requiredSystems={requiredSystems}
        autoFocusOnLoad={autoFocusOnLoad}
      />
      <OrbitControls ref={controls} makeDefault enablePan={false} minDistance={0.15} maxDistance={10} />
    </Canvas>
  );
}

Object.values(SYSTEM_FILES).forEach((url) => useGLTF.preload(url, "/draco/"));
useGLTF.preload(SKIN_URL, "/draco/");
