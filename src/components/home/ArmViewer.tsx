"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { useLocale } from "next-intl";
import * as THREE from "three";

import {
  CATS,
  CORNEA_MAT,
  EYE_SUBMATS,
  IRIS_MAT,
  MAT,
  ORGAN_ALL_SUBMATS,
  VITREOUS_MAT,
  organMat,
  pickCat,
  type CatKey,
} from "@/lib/anatomy/layers";
import { isSelfOrDescendantOf } from "@/components/viewer/materials";
import { cleanName, displayName, namedNode, sanitizeGltfName } from "@/components/viewer/Hotspots";
import { useAnatomyStore, type SelectedPart } from "@/store/useAnatomyStore";
import type { SceneHotspot } from "@/lib/sceneModules";
import { pick, type Loc } from "@/lib/homeContent";
import { fitDistance, modelFrame, VIEW_DIR, type ModelFrame } from "@/lib/anatomy/modelFrame";

type LayerState = Record<CatKey, { visible: boolean; faded: boolean }>;

const VIEWER_TEXT: Record<Loc, { title: string; shown: string; hidden: string; clear: string; faded: string; hint: string; layers: Record<CatKey, string> }> = {
  vi: { title: "LỚP GIẢI PHẪU", shown: "Hiện", hidden: "Ẩn", clear: "Rõ", faded: "Mờ", hint: "Nhấp vào một bộ phận để xem thông tin", layers: { skin: "Da", muscle: "Cơ", brain: "Não", organ: "Nội tạng", artery: "Động mạch", vein: "Tĩnh mạch", nerve: "Thần kinh", lymph: "Bạch huyết", eye: "Mắt", bone: "Xương" } },
  en: { title: "ANATOMICAL LAYERS", shown: "Shown", hidden: "Hidden", clear: "Solid", faded: "Faded", hint: "Select a structure to view its details", layers: { skin: "Skin", muscle: "Muscle", brain: "Brain", organ: "Organs", artery: "Arteries", vein: "Veins", nerve: "Nerves", lymph: "Lymphatic", eye: "Eye", bone: "Bone" } },
  zh: { title: "解剖层", shown: "显示", hidden: "隐藏", clear: "清晰", faded: "淡化", hint: "选择一个结构以查看详细信息", layers: { skin: "皮肤", muscle: "肌肉", brain: "脑", organ: "内脏", artery: "动脉", vein: "静脉", nerve: "神经", lymph: "淋巴", eye: "眼", bone: "骨" } },
};

const HL_HOVER = new THREE.Color("#0ea5e9");
const HL_SEL = new THREE.Color("#38bdf8");

/** Mesh nhãn text 3D của Z-Anatomy — không phải cấu trúc giải phẫu, không cho chọn. */
function isLabelMesh(m: THREE.Mesh, matName: string): boolean {
  return /_systems?g$/i.test(m.name) || matName === "Text";
}

/**
 * Vật liệu RIÊNG của một mesh, nhân bản từ vật liệu dùng chung của lớp.
 * Bắt buộc phải có: `MAT[cat]` được CẢ LỚP dùng chung, nên tô sáng/làm mờ
 * thẳng lên nó sẽ ăn vào toàn bộ lớp (chọn 1 cơ là sáng hết mọi cơ).
 */
function ownMat(m: THREE.Mesh): THREE.MeshStandardMaterial {
  let own = m.userData.ownMat as THREE.MeshStandardMaterial | undefined;
  if (!own) {
    own = (m.userData.baseMat as THREE.MeshStandardMaterial).clone();
    m.userData.ownMat = own;
  }
  return own;
}

function ArmModel({ url, layers }: { url: string; layers: LayerState }) {
  const { scene } = useGLTF(url, "/draco/");
  const hiddenIds = useAnatomyStore((s) => s.hiddenIds);
  const fadedIds = useAnatomyStore((s) => s.fadedIds);
  const isolatedId = useAnatomyStore((s) => s.isolatedId);
  const selectedId = useAnatomyStore((s) => s.selected?.id ?? null);
  const hovered = useAnatomyStore((s) => s.hovered);

  const scn = useMemo(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        const matName = (Array.isArray(m.material) ? m.material[0] : m.material)?.name ?? "";
        m.userData.isLabel = isLabelMesh(m, matName);
        const cat = pickCat(`${m.name} ${m.parent?.name ?? ""}`);
        m.userData.cat = cat;
        m.material = MAT[cat];
        m.renderOrder = cat === "skin" ? 10 : 0; // da vẽ sau để trong suốt đúng
        if (cat === "eye") {
          const nm = m.name.toLowerCase();
          if (nm.includes("iris")) m.material = IRIS_MAT;
          else if (nm.includes("vitreous") || nm.includes("posterior segment")) m.material = VITREOUS_MAT;
          else if (nm.includes("cornea")) { m.material = CORNEA_MAT; m.renderOrder = 11; }
          // còn lại (sclera) giữ MAT.eye trắng
        } else if (cat === "organ") {
          m.material = organMat(m.name); // mỗi tạng một màu
        }
        // Vật liệu "gốc" của mesh = vật liệu dùng chung của lớp. Mọi hiệu ứng
        // riêng lẻ (chọn/rê chuột/làm mờ 1 cấu trúc) đi qua bản sao, xem ownMat().
        m.userData.baseMat = m.material;
      }
    });
    return scene;
  }, [scene]);

  useEffect(() => {
    // độ mờ theo lớp (chỉnh trên material dùng chung của cả nhóm)
    CATS.forEach((c) => {
      const mat = MAT[c.key];
      if (layers[c.key].faded) {
        mat.transparent = true; mat.opacity = 0.12; mat.depthWrite = false;
      } else {
        mat.transparent = false; mat.opacity = 1; mat.depthWrite = true;
      }
      mat.needsUpdate = true;
    });
    // mắt: các vật liệu con theo trạng thái mờ của lớp "Mắt"
    const eyeFaded = layers.eye?.faded;
    EYE_SUBMATS.forEach((mat) => {
      if (eyeFaded) {
        mat.transparent = true; mat.opacity = 0.12; mat.depthWrite = false;
      } else if (mat === CORNEA_MAT) {
        mat.transparent = true; mat.opacity = 0.16; mat.depthWrite = false;
      } else {
        mat.transparent = false; mat.opacity = 1; mat.depthWrite = true;
      }
      mat.needsUpdate = true;
    });
    // nội tạng: các vật liệu con theo trạng thái mờ của lớp "Nội tạng"
    const organFaded = layers.organ?.faded;
    ORGAN_ALL_SUBMATS.forEach((mat) => {
      if (organFaded) {
        mat.transparent = true; mat.opacity = 0.12; mat.depthWrite = false;
      } else {
        mat.transparent = false; mat.opacity = 1; mat.depthWrite = true;
      }
      mat.needsUpdate = true;
    });
  }, [layers]);

  /**
   * Trạng thái TỪNG CẤU TRÚC (Ẩn/Mờ/Cô lập/đang chọn/đang rê chuột) chồng lên
   * trạng thái TỪNG LỚP ở trên. So khớp theo CÂY CON chứ không theo tên tuyệt
   * đối: nhiều "cấu trúc" trong Z-Anatomy là node cha chứa nhiều mesh con
   * (gan 8 phân thuỳ, đốt sống có thân + cung) — so tên tuyệt đối thì bấm Cô
   * lập sẽ ẩn sạch cả mô hình.
   */
  useEffect(() => {
    const rootOf = (id: string | null) => (id ? scn.getObjectByName(id) ?? null : null);
    const isolatedRoot = rootOf(isolatedId);
    const selRoot = rootOf(selectedId);
    const hoverRoot = rootOf(hovered);
    const hiddenRoots = Object.keys(hiddenIds)
      .filter((id) => hiddenIds[id])
      .map((id) => scn.getObjectByName(id))
      .filter((o): o is THREE.Object3D => !!o);
    const fadedRoots = Object.keys(fadedIds)
      .filter((id) => fadedIds[id])
      .map((id) => scn.getObjectByName(id))
      .filter((o): o is THREE.Object3D => !!o);

    scn.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const st = layers[m.userData.cat as CatKey];
      const isolatedOut = isolatedRoot !== null && !isSelfOrDescendantOf(m, isolatedRoot);
      const hidden = hiddenRoots.some((r) => isSelfOrDescendantOf(m, r));
      m.visible = (st?.visible ?? true) && !hidden && !isolatedOut;

      const base = m.userData.baseMat as THREE.MeshStandardMaterial | undefined;
      if (!base) return;
      const isSel = selRoot !== null && isSelfOrDescendantOf(m, selRoot);
      const isHover = !isSel && hoverRoot !== null && isSelfOrDescendantOf(m, hoverRoot);
      const isFaded = fadedRoots.some((r) => isSelfOrDescendantOf(m, r));

      if (!isSel && !isHover && !isFaded) {
        if (m.material !== base) m.material = base;
        return;
      }
      const own = ownMat(m);
      own.color.copy(base.color);
      own.roughness = base.roughness;
      own.metalness = base.metalness;
      own.side = base.side;
      own.transparent = base.transparent;
      own.opacity = base.opacity;
      own.depthWrite = base.depthWrite;
      own.emissive.setScalar(0);
      own.emissiveIntensity = 0;
      if (isFaded) {
        // "Làm mờ" phải THẮNG trạng thái đang chọn: nút này luôn bấm lên đúng
        // cấu trúc vừa chọn, nếu để lựa chọn ghi đè thì bấm xong không thấy gì
        // đổi. Vẫn giữ ánh xanh để biết cấu trúc mờ đó là cái đang xem.
        own.transparent = true; own.opacity = 0.12; own.depthWrite = false;
        if (isSel) { own.emissive.copy(HL_SEL); own.emissiveIntensity = 0.5; }
      } else if (isSel) {
        // Cấu trúc đang chọn luôn hiện RÕ, kể cả khi cả lớp của nó đang để mờ —
        // nếu không, bấm vào một nhãn trong lớp đang mờ sẽ như không có gì xảy ra.
        own.transparent = false; own.opacity = 1; own.depthWrite = true;
        own.emissive.copy(HL_SEL); own.emissiveIntensity = 0.55;
      } else {
        own.emissive.copy(HL_HOVER); own.emissiveIntensity = 0.3;
      }
      own.needsUpdate = true;
      m.material = own;
    });
  }, [scn, layers, hiddenIds, fadedIds, isolatedId, selectedId, hovered]);

  // Móc tự kiểm chứng (chỉ ở dev, giống `window.somaGesture` của trang /cu-chi):
  // cho phép đếm mesh còn hiển thị sau khi bấm Ẩn/Cô lập mà không cần mắt người.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    (window as unknown as { somaScene?: THREE.Object3D }).somaScene = scn;
  }, [scn]);

  return <primitive object={scn} />;
}

/**
 * ĐẶT KHUNG HÌNH theo bảng khung chuẩn.
 *
 * Chạy lại khi đổi model hoặc đổi tỉ lệ khung, KHÔNG chạy lại khi bật/tắt lớp —
 * đó là điểm khác căn bản với `<Bounds fit>` cũ: tắt lớp da không được phép làm
 * mô hình nhảy to lên. Người dùng xoay/kéo xong cũng không bị kéo về, vì effect
 * chỉ phụ thuộc url và tỉ lệ khung.
 */
function FrameCamera({ frame }: { frame: ModelFrame }) {
  // Lấy camera qua `get()` NGAY TRONG effect chứ không giữ nó từ lúc render:
  // camera của R3F là một đối tượng ba chiều phải sửa tại chỗ, mà sửa một biến
  // bắt từ thân render là đúng thứ luật `react-hooks/immutability` chặn.
  const get = useThree((s) => s.get);
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));
  // Chỉ cần biết ĐÃ có OrbitControls hay chưa: có rồi thì đặt tâm xoay cho nó,
  // chưa có thì camera tự nhìn về tâm.
  const hasControls = useThree((s) => !!s.controls);

  useEffect(() => {
    const { camera, controls } = get();
    const cam = camera as THREE.PerspectiveCamera;
    const center = new THREE.Vector3(frame.center[0], frame.center[1], frame.center[2]);
    const dist = fitDistance(frame.size, cam.fov, aspect);
    const dir = new THREE.Vector3(VIEW_DIR[0], VIEW_DIR[1], VIEW_DIR[2]).normalize();

    cam.position.copy(center).addScaledVector(dir, dist);
    // Mặt phẳng cắt phải co theo KÍCH THƯỚC vật thể: xương con tai giữa chỉ 4mm,
    // để near cố định 0,01 m là cắt sạch thành khung trống mà không báo lỗi gì.
    cam.near = Math.max(frame.radius * 0.005, 1e-5);
    cam.far = frame.radius * 200;
    cam.updateProjectionMatrix();

    const orbit = controls as unknown as { target?: THREE.Vector3; update?: () => void } | null;
    if (orbit?.target) {
      orbit.target.copy(center);
      orbit.update?.();
    } else {
      cam.lookAt(center);
    }

    // Móc tự kiểm chứng như `window.somaScene`: đọc được khung hình thật đang
    // dùng mà không phải đoán qua ảnh chụp màn hình.
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { somaFrame?: unknown }).somaFrame = {
        center: frame.center, size: frame.size, dist,
        cam: cam.position.toArray(), target: orbit?.target?.toArray() ?? null,
        near: cam.near, far: cam.far, hasControls: !!orbit?.target,
      };
    }
  }, [get, hasControls, aspect, frame]);

  return null;
}

/**
 * Raycast hover + click trên mô hình vùng. Cùng cơ chế với model mặt cắt
 * (`SectionModelScene`) — sự kiện R3F gắn thẳng lên cây glTF nạp ngoài không
 * đáng tin nên bắt pointer trên canvas rồi tự raycast.
 */
function Picker({ hotspots, locale }: { hotspots: SceneHotspot[]; locale: Loc }) {
  const { camera, gl, raycaster, scene } = useThree();
  const setSelected = useAnatomyStore((s) => s.setSelected);
  const setHovered = useAnatomyStore((s) => s.setHovered);
  const downRef = useRef<[number, number] | null>(null);

  // Tra cứu nhãn đã biên soạn theo tên mesh ĐÃ sanitize — GLTFLoader đổi
  // khoảng trắng thành "_" và xoá dấu chấm lúc chạy.
  const byMesh = useMemo(() => {
    const map = new Map<string, SceneHotspot>();
    const key = (value: string) => sanitizeGltfName(value).replace(/_\d+$/, "").toLowerCase();
    hotspots.forEach((h) => map.set(key(h.meshName), h));
    return map;
  }, [hotspots]);

  useEffect(() => {
    const el = gl.domElement;
    const visibleUpTree = (o: THREE.Object3D): boolean => {
      let cur: THREE.Object3D | null = o;
      while (cur) {
        if (!cur.visible) return false;
        cur = cur.parent;
      }
      return true;
    };
    const pickAt = (cx: number, cy: number): THREE.Mesh | null => {
      const rect = el.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((cx - rect.left) / rect.width) * 2 - 1,
        -((cy - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      for (const h of hits) {
        const m = h.object as THREE.Mesh;
        // Ẩn một lớp là đặt visible=false lên MESH, nhưng cây glTF còn các
        // Group cha có thể bị ẩn — phải duyệt ngược lên tổ tiên, không thì
        // bấm trúng thứ đang không nhìn thấy.
        if (!m.isMesh || !m.name || m.userData.isLabel || !visibleUpTree(m)) continue;
        // Lớp/cấu trúc đang để MỜ coi như "nhìn xuyên qua": người dùng làm mờ
        // da chính là để xem lớp cơ bên dưới, nếu vẫn bắt tia thì bấm chỗ nào
        // cũng chỉ ra tấm da. Bỏ qua để tia đi tiếp xuống lớp phía dưới.
        // Xét CẢ vật liệu gốc của lớp (trạng thái Rõ/Mờ của cả lớp) lẫn vật
        // liệu riêng đang gắn (Làm mờ từng cấu trúc) — mesh đang được chọn
        // dùng bản sao luôn để opacity 1, chỉ nhìn bản sao sẽ bỏ sót lớp mờ.
        const cur = (Array.isArray(m.material) ? m.material[0] : m.material) as
          | THREE.MeshStandardMaterial
          | undefined;
        const base = m.userData.baseMat as THREE.MeshStandardMaterial | undefined;
        const ghost = (mat?: THREE.MeshStandardMaterial) => !!mat?.transparent && mat.opacity < 0.5;
        if (ghost(cur) || ghost(base)) continue;
        return m;
      }
      return null;
    };
    /** Mesh vừa bấm có thể là một mảnh con của cấu trúc đã có nhãn (VD 1 thuỳ gan). */
    const resolve = (m: THREE.Mesh): { obj: THREE.Object3D; def?: SceneHotspot } => {
      let cur: THREE.Object3D | null = m;
      while (cur) {
        const normalized = sanitizeGltfName((cur.userData?.name as string | undefined) || cur.name)
          .replace(/_\d+$/, "")
          .toLowerCase();
        const def = byMesh.get(normalized);
        if (def) return { obj: cur, def };
        cur = cur.parent;
      }
      return { obj: namedNode(m) };
    };
    const onMove = (e: PointerEvent) => {
      const m = pickAt(e.clientX, e.clientY);
      setHovered(m ? resolve(m).obj.name : null);
      el.style.cursor = m ? "pointer" : "default";
    };
    const onDown = (e: PointerEvent) => { downRef.current = [e.clientX, e.clientY]; };
    const onUp = (e: PointerEvent) => {
      const d = downRef.current; downRef.current = null;
      if (!d) return;
      // Kéo để xoay mô hình thì KHÔNG tính là một cú bấm chọn.
      if (Math.abs(e.clientX - d[0]) > 5 || Math.abs(e.clientY - d[1]) > 5) return;
      const m = pickAt(e.clientX, e.clientY);
      if (!m) { setSelected(null); return; }
      const { obj, def } = resolve(m);
      // Tên gốc (còn dấu chấm phân biệt trái/phải) nằm ở userData.name.
      const raw = (obj.userData?.name as string | undefined) || obj.name;
      const payload: SelectedPart = def
        ? {
            id: obj.name,
            name: displayName(def, locale),
            latin: def.latinName ?? def.meshName.replace(/_/g, " "),
            description: def.note ? pick(def.note, locale) : undefined,
          }
        : {
            id: obj.name,
            name: cleanName(raw),
          };
      setSelected(payload);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
    };
  }, [camera, gl, raycaster, scene, byMesh, locale, setSelected, setHovered]);

  return null;
}

export default function ArmViewer({
  url = "/models/arm.glb",
  cats,
  defaultFaded,
  hotspots = [],
}: {
  url?: string;
  cats?: CatKey[]; // giới hạn lớp hiện trong bảng (mặc định: đủ 8)
  defaultFaded?: CatKey[]; // lớp mở ra ở trạng thái MỜ sẵn (vd da) để lộ chi tiết bên trong
  hotspots?: SceneHotspot[]; // nhãn đã biên soạn — để click trúng mesh nào thì hiện đúng tên tiếng Việt
}) {
  const locale = useLocale() as Loc;
  const text = VIEWER_TEXT[locale];
  const selected = useAnatomyStore((s) => s.selected);
  // Khung hình đo sẵn ở `npm run models:frames`. Model chưa có trong bảng thì
  // rơi về camera mặc định — hiện đúng một model chứ không vỡ cả trang.
  const frame = useMemo(() => modelFrame(url), [url]);
  const shown = cats ? CATS.filter((c) => cats.includes(c.key)) : CATS;
  const [layers, setLayers] = useState<LayerState>(() =>
    Object.fromEntries(
      CATS.map((c) => [c.key, { visible: true, faded: defaultFaded?.includes(c.key) ?? false }]),
    ) as LayerState,
  );

  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event("resize"));
    const raf = requestAnimationFrame(fire);
    const t1 = setTimeout(fire, 150);
    const t2 = setTimeout(fire, 500);
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const toggle = (k: CatKey, field: "visible" | "faded") =>
    setLayers((s) => ({ ...s, [k]: { ...s[k], [field]: !s[k][field] } }));

  return (
    <div className="viewer-stage" style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0.1, 2.6], fov: 40, near: 0.01, far: 100 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <hemisphereLight args={["#fff6ea", "#cbb9a0", 0.75]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 4]} intensity={1.2} color="#fff3e2" />
        <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#e7d9c4" />
        <directionalLight position={[0, -3, 2]} intensity={0.3} color="#ffffff" />
        <ArmModel url={url} layers={layers} />
        {/* Không bọc <Center>/<Bounds> nữa: mô hình giữ nguyên toạ độ thật của
            cơ thể (nhờ đó nhãn và mặt cắt vẫn đúng chỗ), còn khung hình do
            bảng khung chuẩn quyết định. */}
        {frame && <FrameCamera frame={frame} />}
        <Picker hotspots={hotspots} locale={locale} />
        {/* Đang xem một cấu trúc cụ thể thì DỪNG tự xoay — mô hình trôi dưới
            con trỏ làm việc bấm chọn từng nhánh mạch/thần kinh gần như bất khả. */}
        {/* Giới hạn zoom tính theo BÁN KÍNH model: mốc cứng 0,3–8 m khiến model
            nhỏ (nhãn cầu 3cm, xương con 4mm) không zoom vào nổi, còn model
            toàn thân 1,7 m thì không lùi ra đủ. */}
        <OrbitControls makeDefault enablePan
          minDistance={(frame?.radius ?? 0.5) * 0.35}
          maxDistance={(frame?.radius ?? 0.5) * 14}
          autoRotate={!selected} autoRotateSpeed={0.4} />
      </Canvas>

      {/* Bảng điều khiển lớp */}
      <div style={panelStyle}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, letterSpacing: ".04em" }}>
          {text.title}
        </div>
        {shown.map((c) => {
          const st = layers[c.key];
          return (
            <div key={c.key} style={rowStyle}>
              <span style={{ ...dotStyle, background: c.color }} />
              <span style={{ flex: 1, opacity: st.visible ? 1 : 0.4 }}>{text.layers[c.key]}</span>
              <button style={btnStyle(st.visible)} onClick={() => toggle(c.key, "visible")}>
                {st.visible ? text.shown : text.hidden}
              </button>
              <button style={btnStyle(!st.faded)} onClick={() => toggle(c.key, "faded")}>
                {st.faded ? text.faded : text.clear}
              </button>
            </div>
          );
        })}
      </div>

      <p style={hintStyle}>
        {selected ? selected.name : text.hint}
      </p>
    </div>
  );
}

const panelStyle: React.CSSProperties = {
  position: "absolute", top: 20, right: 20, width: 230, padding: "14px 16px", zIndex: 5,
  background: "rgba(27,25,22,.9)", border: "1px solid #3c3831", borderRadius: 10,
  boxShadow: "0 14px 36px rgba(0,0,0,.3)", fontFamily: "var(--font-sans, sans-serif)",
  color: "#eee8dc", backdropFilter: "blur(8px)",
};
const rowStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 8, padding: "5px 0", fontSize: 13.5,
};
const dotStyle: React.CSSProperties = {
  width: 12, height: 12, borderRadius: 3, flexShrink: 0, border: "1px solid rgba(0,0,0,.12)",
};
const btnStyle = (on: boolean): React.CSSProperties => ({
  fontSize: 11, padding: "3px 9px", borderRadius: 6, cursor: "pointer",
  border: "1px solid #4a453c", background: on ? "#eee8dc" : "transparent",
  color: on ? "#171512" : "#aaa195", minWidth: 40,
});
const hintStyle: React.CSSProperties = {
  position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 5,
  pointerEvents: "none", padding: "6px 16px", borderRadius: 999, fontSize: 12,
  background: "rgba(27,25,22,.9)", border: "1px solid #3c3831", color: "#ddd5c8",
  boxShadow: "0 8px 22px rgba(0,0,0,.28)", whiteSpace: "nowrap",
};

useGLTF.preload("/models/arm.glb", "/draco/");
