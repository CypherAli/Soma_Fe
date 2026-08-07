"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsComp } from "@react-three/drei";
import { useLocale } from "next-intl";
import * as THREE from "three";
import { useAnatomyStore, type SelectedPart, type SystemKey } from "@/store/useAnatomyStore";
import { pick, type Loc } from "@/lib/homeContent";
import type { SceneHotspot } from "@/lib/sceneModules";

/** Tên hiển thị ưu tiên nhãn chuẩn giải phẫu (label) nếu có, không thì rơi về cleanName(meshName). */
export function displayName(h: SceneHotspot, locale: Loc): string {
  return h.label ? pick(h.label, locale) : cleanName(h.meshName);
}

type OrbitControlsImpl = React.ComponentRef<typeof OrbitControlsComp>;

/**
 * GLTFLoader tự "làm sạch" tên node lúc dựng scene runtime — xoá các ký tự
 * dành riêng ([ ] . : /) và đổi khoảng trắng thành "_" (three.js
 * PropertyBinding.sanitizeNodeName). Vì vậy "Kidney.l" trong file gốc trở
 * thành mesh.name = "Kidneyl" lúc chạy — phải áp đúng quy tắc này khi tra
 * cứu theo tên, nếu không mesh sẽ không tìm thấy (không phải do sai vị trí).
 */
export function sanitizeGltfName(raw: string): string {
  return raw.replace(/\s/g, "_").replace(/[[\].:/]/g, "");
}

/** Bỏ hậu tố .l/.r/.j và ngoặc trong tên mesh Z-Anatomy gốc → tên hiển thị gọn. */
export function cleanName(raw: string): string {
  // ".001": hậu tố Blender tự thêm khi nhân bản, không thuộc tên giải phẫu.
  let n = raw.replace(/\.\d{3,}$/, "").replace(/_/g, " ");
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

type CamAnim = {
  fromPos: THREE.Vector3;
  toPos: THREE.Vector3;
  fromTarget: THREE.Vector3;
  toTarget: THREE.Vector3;
  t0: number;
  duration: number;
};

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function Hotspots({
  controlsRef,
  hotspots,
  requiredSystems,
  autoFocusOnLoad = false,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  hotspots: SceneHotspot[];
  /** Hotspot chỉ render khi TẤT CẢ các hệ này đang bật (tránh pin nổi khi hệ chứa nó đã tắt). */
  requiredSystems: SystemKey[];
  /** Tự động zoom camera vào gộp toàn bộ hotspot khi vào scene lần đầu (dùng cho trang scene riêng). */
  autoFocusOnLoad?: boolean;
}) {
  const { camera, scene } = useThree();
  const locale = useLocale() as Loc;
  const visibleSystems = useAnatomyStore((s) => s.visibleSystems);
  const setSelected = useAnatomyStore((s) => s.setSelected);
  const activeHotspotKey = useAnatomyStore((s) => s.activeHotspotKey);
  const systemsReady = requiredSystems.every((k) => visibleSystems[k]);

  const homeRef = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  const animRef = useRef<CamAnim | null>(null);
  const prevActiveKeyRef = useRef<string | null>(null);
  const didAutoFocusRef = useRef(false);

  useFrame(() => {
    const controls = controlsRef.current;
    const anim = animRef.current;
    if (!anim || !controls) return;
    const t = Math.min(1, (performance.now() - anim.t0) / anim.duration);
    const e = easeOutCubic(t);
    camera.position.lerpVectors(anim.fromPos, anim.toPos, e);
    controls.target.lerpVectors(anim.fromTarget, anim.toTarget, e);
    controls.update();
    if (t >= 1) animRef.current = null;
  });

  // Chỉ tìm object thật trong scene đã nạp — không khớp tên (vd hệ đang
  // tắt/chưa nạp xong) thì KHÔNG render pin đó, tránh pin lơ lửng sai vị trí.
  // Chấp nhận cả Group (VD "Vertebra_T12"/"Liver" là node cha chứa nhiều
  // mesh con — đốt sống có thân+cung, gan có nhiều thuỳ rải rác không đều).
  // Bbox tâm hình học thô của cả Group dễ rơi vào "khoảng trống" giữa các
  // thuỳ lệch nhau (VD gan hình chữ L) → dùng tâm TRỌNG SỐ THEO THỂ TÍCH
  // từng mesh con, thiên về khối thịt lớn nhất thay vì trung điểm bbox.
  const groupCenter = (obj: THREE.Object3D): THREE.Vector3 => {
    const sum = new THREE.Vector3();
    let weight = 0;
    obj.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const b = new THREE.Box3().setFromObject(mesh);
      if (b.isEmpty()) return;
      const size = b.getSize(new THREE.Vector3());
      const w = Math.max(size.x * size.y * size.z, 1e-6);
      sum.addScaledVector(b.getCenter(new THREE.Vector3()), w);
      weight += w;
    });
    return weight > 0 ? sum.divideScalar(weight) : new THREE.Box3().setFromObject(obj).getCenter(new THREE.Vector3());
  };

  const resolved = useMemo(() => {
    if (!systemsReady) return [];
    return hotspots.map((h) => {
      const obj = scene.getObjectByName(sanitizeGltfName(h.meshName));
      if (!obj) return null;
      const box = new THREE.Box3().setFromObject(obj);
      if (box.isEmpty()) return null;
      const center = groupCenter(obj);
      const radius = box.getSize(new THREE.Vector3()).length() / 2;
      return { def: h, obj, center, radius };
    }).filter((x): x is NonNullable<typeof x> => x !== null);
    // scene.children.length như một proxy để re-chạy khi model nạp xong.
  }, [systemsReady, hotspots, scene, scene.children.length]);

  const focus = (
    center: THREE.Vector3,
    radius: number,
    controls: OrbitControlsImpl,
    distanceMultiplier = 2.8,
  ) => {
    if (!homeRef.current) {
      homeRef.current = { pos: camera.position.clone(), target: controls.target.clone() };
    }
    const dir = camera.position.clone().sub(controls.target).normalize();
    const dist = Math.max(radius * distanceMultiplier, 0.12);
    const toPos = center.clone().add(dir.multiplyScalar(dist));
    animRef.current = {
      fromPos: camera.position.clone(),
      toPos,
      fromTarget: controls.target.clone(),
      toTarget: center.clone(),
      t0: performance.now(),
      duration: 650,
    };
  };

  // Tự động zoom vào gộp toàn bộ hotspot khi mới vào scene (1 lần duy nhất),
  // dùng đúng bbox thật của các mesh đã resolve — không đoán camera cố định.
  useEffect(() => {
    if (!autoFocusOnLoad || didAutoFocusRef.current) return;
    if (resolved.length !== hotspots.length) return;
    const controls = controlsRef.current;
    if (!controls) return;
    didAutoFocusRef.current = true;
    const box = new THREE.Box3();
    resolved.forEach((r) => box.expandByObject(r.obj));
    const center = box.getCenter(new THREE.Vector3());
    const radius = box.getSize(new THREE.Vector3()).length() / 2;
    // Multiplier lớn hơn zoom 1 điểm — gộp nhiều mesh cách xa nhau (VD đốt
    // sống ở sau lưng + tạng ở phía trước) cần lùi camera đủ xa để cả cụm
    // còn nằm trong khung hình, tránh điểm rìa bị rơi ra sau lưng camera.
    focus(center, radius, controls, 4.5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocusOnLoad, resolved, hotspots.length, controlsRef]);

  // Toggle active hotspot đến từ CẢ pin 3D lẫn danh sách Labels bên panel
  // (cùng ghi vào store.activeHotspotKey) — effect này phản ứng chung 1 chỗ.
  useEffect(() => {
    // Theo yêu cầu người dùng: click chọn CHỈ hiện thông tin, KHÔNG kéo
    // camera đi đâu cả — tránh hẳn mọi kiểu giật/zoom rồi bật lại vị trí cũ.
    if (activeHotspotKey === prevActiveKeyRef.current) return;
    if (activeHotspotKey === null) {
      prevActiveKeyRef.current = null;
      setSelected(null);
      return;
    }
    const item = resolved.find((r) => r.def.key === activeHotspotKey);
    if (item) {
      // CHỈ đánh dấu "đã xử lý" khi thực sự tìm thấy — nếu model/hotspot
      // CHƯA kịp resolve xong lúc effect này chạy (resolved rỗng/thiếu),
      // để prevActiveKeyRef nguyên vậy hiệu ứng sẽ TỰ THỬ LẠI ngay khi
      // `resolved` cập nhật xong (đã có trong dependency), thay vì coi như
      // đã xử lý xong rồi bỏ luôn.
      prevActiveKeyRef.current = activeHotspotKey;
      const payload: SelectedPart = {
        id: item.obj.name,
        name: displayName(item.def, locale),
        latin: item.def.latinName ?? item.def.meshName.replace(/_/g, " "),
      };
      setSelected(payload);
      return;
    }
    // activeHotspotKey không khớp Nhãn định sẵn nào → đến từ click trực tiếp
    // lên 1 mesh bất kỳ trên mô hình (Picker).
    const obj = scene.getObjectByName(activeHotspotKey);
    if (!obj) return;
    prevActiveKeyRef.current = activeHotspotKey;
    // tên GỐC ở userData.name — obj.name đã bị GLTFLoader sanitize mất dấu chấm
    // nên cleanName không tách được hậu tố bên (xem rawName trong ModelScene).
    const raw = (obj.userData?.name as string | undefined) || obj.name;
    setSelected({ id: obj.name, name: cleanName(raw), latin: raw.replace(/\.\d{3,}$/, "").replace(/_/g, " ") });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHotspotKey, resolved, scene]);

  // Đã BỎ HẲN pin "+"/đường nối nổi trên mô hình 3D theo yêu cầu người dùng
  // (vị trí pin hay lệch, gây rối mắt) — chọn cấu trúc giờ chỉ qua danh
  // sách Nhãn bên panel hoặc click trực tiếp lên mô hình (Picker).
  // ĐÃ BỎ tính năng tô sáng (emissive) toàn bộ mesh khi chọn — verify thật
  // cho thấy nó lan màu ra cả vùng KHÔNG liên quan (VD chọn động mạch chủ
  // bụng làm cả mảng da/mạc phía trước bị nhuộm xanh), tốn công tìm nguyên
  // nhân trong khi nút "Cô lập" (đã verify hoạt động đúng, sạch) đã đủ để
  // biết "nó nằm ở đâu" — không cần thêm cơ chế tô sáng song song nữa.

  return null;
}
