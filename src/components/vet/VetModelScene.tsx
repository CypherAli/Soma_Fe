"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bounds, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

export type SceneHotspot = { factId: string; position: [number, number, number]; label: string };

/**
 * Cảnh 3D cho một mẫu vật thú y.
 *
 * Cố ý KHÔNG dùng lại `ModelScene` bên người: cảnh đó đọc thẳng
 * `useAnatomyStore` (hệ đang bật, mesh đang ẩn/mờ/cô lập, mặt phẳng cắt) và
 * mọi thao tác của nó đều dựa trên tên mesh do Z-Anatomy gắn nhãn. Mẫu vật thú
 * y không có tên mesh dùng được — nên việc tách bộ phận ở đây làm theo TÊN VẬT
 * LIỆU, xem `VetModelPart` trong `src/lib/vet/types.ts`.
 */
function Specimen({
  url,
  hotspots,
  active,
  onPick,
  hiddenParts,
  activePart,
  onPickPart,
  onHover,
  hovered,
  showMarkers,
  tint,
}: {
  url: string;
  hotspots: SceneHotspot[];
  active: string | null;
  onPick: (factId: string) => void;
  hiddenParts: string[];
  activePart: string | null;
  onPickPart?: (material: string) => void;
  onHover?: (factId: string | null) => void;
  hovered: string | null;
  showMarkers: boolean;
  tint?: string;
}) {
  // Vỏ ngoài đã chuẩn hoá tỉ lệ — cần tham chiếu để đổi điểm bấm từ hệ toạ độ
  // thế giới về hệ của mẫu vật, mới so được với toạ độ điểm chú giải.
  const shellRef = useRef<THREE.Group>(null);

  /*
   * Uniform dùng chung cho mọi material của mẫu — giữ trong `useRef` để đổi
   * vùng sáng mà KHÔNG phải biên dịch lại shader hay dựng lại cây.
   */
  const highlight = useRef({
    point: { value: new THREE.Vector3() },
    radius: { value: 0.2 },
    on: { value: 0 },
  }).current;

  const { scene } = useGLTF(url, "/draco/");

  // Bản sao riêng cho mỗi lần gắn: `useGLTF` chia sẻ chung một cây scene giữa
  // các component, sửa material trực tiếp trên bản gốc là sửa cho cả trang.
  const { model, centre, span, byMaterial } = useMemo(() => {
    const root = scene.clone(true);

    /*
     * Gom mesh theo TÊN VẬT LIỆU — cách duy nhất tách được bộ phận trên mẫu
     * quét thú y. Tên mesh vô dụng (toàn "Object_0"…), nhưng vài mẫu gắn nhãn
     * giải phẫu ở tên vật liệu, và bước nén đã bị cấm gộp vật liệu chính vì
     * thế (xem `scripts/vet/import-vet-soft-tissue.mjs`).
     *
     * Mỗi mesh được cấp material RIÊNG trước khi gom: `useGLTF` chia sẻ
     * material giữa các mesh, chỉnh `opacity` trên bản dùng chung là làm mờ
     * luôn những mẫu vật khác đang mở trên cùng trang.
     */
    const groups = new Map<string, THREE.Mesh[]>();
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      const shared = mesh.material as THREE.Material | undefined;
      if (!shared) return;
      const key = shared.name;
      const mat = shared.clone() as THREE.MeshStandardMaterial;
      mat.name = key;
      // Mẫu quét photogrammetry hay để roughness thấp → mẫu bóng như nhựa.
      if ("roughness" in mat) {
        mat.roughness = 0.85;
        mat.metalness = 0;
        mat.side = THREE.FrontSide;
      }

      /*
       * NHUỘM MÀU THEO LỚP cho mẫu KHÔNG có ảnh bề mặt.
       *
       * Écorché mèo, cơ chi trước chó, khung chậu bò… đều là lưới trần không
       * texture, ra màn hình là một khối XÁM TRẮNG — nhìn cái nào cũng như cái
       * nào, và một khối cơ màu xương thì phản trực giác. Bên người đã có sẵn
       * bảng màu mô trong `Sidebar.tsx` (cơ đỏ nâu, xương ngà, mạch đỏ…); dùng
       * lại đúng bảng ấy để hai khu vực nói cùng một thứ ngôn ngữ màu.
       *
       * Mẫu CÓ texture (dạ cỏ bò, hệ tiêu hoá mèo) thì KHÔNG đụng vào: ảnh chụp
       * mẫu vật thật bao giờ cũng đúng màu hơn một màu ta tự gán.
       */
      /*
       * VÙNG SÁNG quanh cấu trúc đang chọn.
       *
       * Bấm vào một nhóm cơ mà mẫu vật không đổi gì thì người dùng không biết
       * mình vừa chọn chỗ nào — đúng lời phàn nàn "click xong chả biết click
       * vào phần nào". Mẫu là khối liền nên KHÔNG tô riêng được một cơ; thứ làm
       * được là hắt sáng một vùng tròn quanh toạ độ của cấu trúc ấy.
       *
       * Làm bằng `onBeforeCompile` chứ không thay hẳn material: giữ nguyên toàn
       * bộ mô hình chiếu sáng chuẩn của three, chỉ chen thêm một phép trộn màu
       * vào albedo. Tính theo toạ độ THẾ GIỚI để khỏi phụ thuộc phép biến đổi
       * riêng của từng mesh trong tệp.
       */
      mat.onBeforeCompile = (shader) => {
        shader.uniforms.uHi = highlight.point;
        shader.uniforms.uHiR = highlight.radius;
        shader.uniforms.uHiOn = highlight.on;
        const VARY = "varying vec3 vSomaWorld;";
        shader.vertexShader = shader.vertexShader
          .replace("#include <common>", "#include <common>\n" + VARY)
          .replace(
            "#include <worldpos_vertex>",
            "#include <worldpos_vertex>\nvSomaWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;",
          );
        shader.fragmentShader = shader.fragmentShader
          .replace(
            "#include <common>",
            "#include <common>\n" +
              VARY +
              "\nuniform vec3 uHi;\nuniform float uHiR;\nuniform float uHiOn;",
          )
          .replace(
            "#include <color_fragment>",
            "#include <color_fragment>\n" +
              "float somaD = distance(vSomaWorld, uHi);\n" +
              "float somaK = uHiOn * smoothstep(uHiR, uHiR * 0.25, somaD);\n" +
              "diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.96, 0.58, 0.30), somaK * 0.88);",
          )
          .replace(
            "#include <emissivemap_fragment>",
            "#include <emissivemap_fragment>" +
              // Hắt thêm một chút tự phát sáng: vùng đang chọn có thể nằm ở
              // phía khuất đèn, chỉ trộn vào albedo thì bóng đổ nuốt mất.
              "" +
              "\ntotalEmissiveRadiance += vec3(0.55, 0.26, 0.10) * somaK;",
          );
      };
      mesh.material = mat;
      const list = groups.get(key);
      if (list) list.push(mesh);
      else groups.set(key, [mesh]);
    });

    const box = new THREE.Box3().setFromObject(root);
    const c = box.getCenter(new THREE.Vector3());
    const s = Math.max(...box.getSize(new THREE.Vector3()).toArray());
    /*
     * NHUỘM MÀU THEO LỚP — chỉ cho mẫu THẬT SỰ không có màu riêng.
     *
     * Điều kiện: đúng MỘT vật liệu và vật liệu ấy không có ảnh bề mặt. Nhiều
     * vật liệu nghĩa là tác giả đã tự đặt màu cho từng bộ phận (gan nâu đỏ, ruột
     * hồng, khối máu đỏ tươi trong hệ tiêu hoá mèo) — nhuộm đè lên là xoá sạch
     * công phân biệt ấy và biến cả mẫu thành một khối hồng. Đã mắc đúng lỗi này
     * một lần.
     *
     * Pha 38% về phía ngà thay vì lấy nguyên màu bảng: màu nguyên bản đủ đậm để
     * bóng đổ nuốt hết thớ cơ, mẫu thành khối cao su một màu. Pha nhạt thì vẫn
     * đúng sắc mô mà còn dải sáng tối để đọc hình.
     */
    /*
     * Điều kiện nhuộm: KHÔNG vật liệu nào có ảnh bề mặt, và mọi vật liệu gần
     * như cùng một màu.
     *
     * Ban đầu chỉ nhuộm khi có đúng MỘT vật liệu, nhưng như thế mẫu ĐÃ CẮT VÙNG
     * (14 vật liệu, cùng một màu gốc) lại rơi vào diện không nhuộm và quay về
     * xám trắng. Xét theo "màu có khác nhau không" mới đúng bản chất: khác màu
     * nghĩa là tác giả đã tự phân biệt các bộ phận và ta không được đè lên.
     *
     * Dung sai 0.02 vì bước cắt vùng cố ý nhích màu mỗi vùng một phần nghìn để
     * `gltf-transform` khỏi gộp chúng lại.
     */
    const mats = [...groups.values()].map((m) => m[0].material as THREE.MeshStandardMaterial);
    const plain = mats.every((m) => !m.map);
    const sameColour = mats.every(
      (m) =>
        Math.abs(m.color.r - mats[0].color.r) < 0.02 &&
        Math.abs(m.color.g - mats[0].color.g) < 0.02 &&
        Math.abs(m.color.b - mats[0].color.b) < 0.02,
    );
    if (tint && plain && sameColour) {
      for (const meshes of groups.values()) {
        for (const mesh of meshes) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.color = new THREE.Color(tint).lerp(new THREE.Color("#efe6dc"), 0.38);
        }
      }
    }

    return { model: root, centre: c, span: s, byMaterial: groups };
  }, [scene, tint]);

  /*
   * Mẫu có tách được bộ phận hay không: nhiều hơn một vật liệu nghĩa là tác
   * giả có gắn nhãn giải phẫu ở tên vật liệu. Một vật liệu ("material_0",
   * "Solid") là khối quét liền — xem `VetModelPart` trong lib/vet/types.ts.
   */
  const hasNamedParts = byMaterial.size > 1;

  /*
   * Đưa vùng sáng tới cấu trúc đang chọn.
   *
   * Chạy trong `useFrame` chứ không trong thân render: ghi vào `shellRef.current`
   * lúc render là đọc ref trong pha render — React cảnh báo đúng, và ở lần render
   * đầu ref còn `null` nên vùng sáng lỡ mất một khung hình. `useFrame` chạy sau
   * khi cây đã gắn, lại bảo đảm ma trận thế giới của vỏ ngoài đã cập nhật xong.
   *
   * Không dùng `useEffect`: hiệu ứng chỉ chạy lại khi phụ thuộc đổi, mà ma trận
   * của vỏ đổi mỗi lần người dùng xoay — vùng sáng sẽ trôi khỏi chỗ cần chỉ.
   *
   * Toạ độ hotspot đo theo tâm hộp bao, còn shader so bằng toạ độ THẾ GIỚI —
   * mà cả cụm đã bị thu `1/span`, nên phải quy đổi qua ma trận của vỏ ngoài.
   */
  const lit = active ? hotspots.find((h) => h.factId === active) : undefined;
  useFrame(() => {
    const shell = shellRef.current;
    if (lit && shell) {
      highlight.point.value.set(...lit.position).applyMatrix4(shell.matrixWorld);
      // Bán kính đo trong hệ ĐÃ chuẩn hoá về hộp bao bằng 1, nên là hằng số:
      // 20% cỡ mẫu, không phụ thuộc `span` gốc.
      highlight.radius.value = 0.2;
      highlight.on.value = 1;
    } else {
      highlight.on.value = 0;
    }
  });

  /*
   * Ẩn / làm mờ theo bộ phận.
   *
   * KHÔNG dùng `useEffect` ở đây, dù đó là chỗ tự nhiên nhất. `useGLTF` treo
   * component (Suspense) ở ngay phía trên: lần render đầu dừng lại tại đó nên
   * mọi hook đứng SAU nó không chạy, lần render sau thì chạy — React thấy số
   * hook đổi giữa hai lần render và ném "Rendered more hooks than during the
   * previous render", cả khung xem trắng bóc. Đã trả giá một lần.
   *
   * Gọi thẳng trong thân render thì an toàn: đây chỉ là sửa thuộc tính của đối
   * tượng three.js chứ không phải state của React, và phép sửa là bất biến —
   * chạy lại bao nhiêu lần cũng ra đúng một kết quả.
   *
   * Không dựng lại cây trong `useMemo` theo `hiddenParts`: dựng lại là nạp lại
   * hình học và mất luôn góc nhìn người dùng đang xoay.
   *
   * Phần không được chọn thì MỜ chứ không ẩn: mờ vẫn còn thấy bộ phận ấy nằm ở
   * đâu trong con vật, ẩn hẳn là mất mốc định vị.
   */
  const hiddenSet = new Set(hiddenParts);
  byMaterial.forEach((meshes, key) => {
    const isHidden = hiddenSet.has(key);
    const dimmed = activePart !== null && activePart !== key;
    for (const mesh of meshes) {
      mesh.visible = !isHidden;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      // Bật/tắt `transparent` là ĐỔI ĐỊNH NGHĨA shader, không phải đổi một tham
      // số — three phải biên dịch lại thì độ mờ mới có hiệu lực. Thiếu
      // `needsUpdate` thì state đổi, giao diện đổi, mà hình thì đứng yên: đúng
      // triệu chứng đã gặp khi bấm "chỉ hiện phần này" mà không thấy gì.
      if (mat.transparent !== dimmed) {
        mat.transparent = dimmed;
        mat.needsUpdate = true;
      }
      mat.opacity = dimmed ? 0.1 : 1;
      mat.depthWrite = !dimmed;
    }
  });

  /*
   * Tự dời mẫu về gốc thay vì bọc <Center>.
   *
   * <Center> đo hộp bao của MỌI thứ bên trong nó, nên nhét thêm mấy quả cầu
   * hotspot vào là hộp bao đổi và cả mẫu vật xê dịch theo — điểm chú giải tự
   * đẩy chính nó ra khỏi chỗ cần chỉ. Dời bằng tâm hộp bao của riêng mẫu thì
   * toạ độ hotspot (vốn đo bằng ĐỘ LỆCH SO VỚI TÂM HỘP BAO, xem
   * scripts/vet/hotspot_probe.py) rơi đúng vào vị trí thật.
   */
  /*
   * CHUẨN HOÁ TỈ LỆ về hộp bao bằng 1.
   *
   * Mẫu vật thú y đến từ chục nguồn khác nhau nên đơn vị loạn xạ: écorché mèo
   * rộng 4 đơn vị, chi trước bò 30, gan chó 233, khung chậu bò 527. `<Bounds
   * fit>` lùi camera ra cho vừa khung, nhưng `OrbitControls maxDistance={12}`
   * kẹp lại — camera nằm LỌT TRONG mẫu vật và màn hình tối đen, không một lỗi
   * nào báo ra. Đó đúng là chuyện đã xảy ra với ba mẫu vật của bò.
   *
   * Thu cả cụm (mẫu vật + điểm chú giải) về cùng một cỡ thì giới hạn khoảng
   * cách của camera dùng chung được cho mọi mẫu. Điểm chú giải nằm TRONG cụm
   * nên vẫn khớp: toạ độ dò ra ở đơn vị gốc, co lại cùng nhau thì quan hệ giữa
   * chúng không đổi.
   */
  /**
   * Cấu trúc đã đánh dấu GẦN NHẤT với một điểm trên bề mặt mẫu vật.
   *
   * Bán kính nhận 22% cỡ mẫu: rộng hơn thì chạm vào đuôi cũng ra cơ vai, hẹp
   * hơn thì phải trỏ gần như trúng đúng toạ độ, mất hết ý nghĩa. Ngoài bán
   * kính trả `null` — thà không nói gì còn hơn chỉ sai tên.
   */
  const nearestFact = (worldPoint: THREE.Vector3) => {
    if (!hotspots.length || !shellRef.current) return null;
    const local = shellRef.current.worldToLocal(worldPoint.clone());
    let best: SceneHotspot | null = null;
    let bestD = Infinity;
    for (const h of hotspots) {
      const d = local.distanceToSquared(new THREE.Vector3(...h.position));
      if (d < bestD) {
        bestD = d;
        best = h;
      }
    }
    return bestD > (span * 0.22) ** 2 ? null : best;
  };

  return (
    <group ref={shellRef} scale={1 / span}>
      <group
        position={[-centre.x, -centre.y, -centre.z]}
        onClick={(e) => {
          /*
           * BẤM VÀO ĐÂU TRÊN MẪU CŨNG PHẢI RA MỘT CÁI TÊN.
           *
           * Mẫu CÓ tách bộ phận thì trả đúng bộ phận vừa bấm. Mẫu khối quét
           * liền (écorché mèo, dạ cỏ bò…) không có bộ phận nào để trả — trước
           * đây bấm vào là không có gì xảy ra và người dùng tưởng trang hỏng
           * — nay trả cấu trúc đã đánh dấu gần nhất. Gán theo KHOẢNG CÁCH,
           * không phải nhận diện cấu trúc, và trang nói thẳng điều đó.
           */
          const mat = (e.object as THREE.Mesh).material as THREE.Material | undefined;
          if (mat?.name && hasNamedParts) {
            e.stopPropagation();
            onPickPart?.(mat.name);
            return;
          }
          const hit = nearestFact(e.point);
          if (!hit) return;
          e.stopPropagation();
          onPick(hit.factId);
        }}
        onPointerMove={(e) => {
          /*
           * Rê chuột báo tên cấu trúc sắp bấm trúng.
           *
           * Đây là thứ THAY CHO mấy quả cầu đánh dấu. Cầu luôn hiện thì che
           * mất chính khối cơ mà người ta vào đây để nhìn; bỏ hẳn cầu đi mà
           * không có gì thay thế thì không ai biết là có nhãn để bấm. Báo tên
           * khi rê chuột giải quyết cả hai: hình sạch, mà vẫn dò ra được.
           */
          if (!onHover) return;
          e.stopPropagation();
          const hit = nearestFact(e.point);
          onHover(hit ? hit.factId : null);
        }}
        onPointerOut={() => onHover?.(null)}
      >
        <primitive object={model} />
      </group>
      {/*
        ĐIỂM ĐÁNH DẤU CHỈ HIỆN KHI ĐƯỢC BẬT.

        Mười quả cầu nổi trên mình con mèo che mất chính khối cơ mà người học
        vào đây để nhìn — kể cả một quả cho cái đang chọn cũng vướng, vì chỗ
        đang chọn lại đúng là chỗ người ta muốn nhìn kỹ nhất.

        Không mất khả năng dò: rê chuột lên mẫu là thanh dưới sân khấu hiện tên
        cấu trúc gần nhất, bấm là mở nội dung. Ai muốn xem cả bộ như một trang
        atlas đánh số thì bật "Hiện điểm đánh dấu".
      */}
      {showMarkers &&
        hotspots.map((h) => {
          const isActive = active === h.factId;
          const isHover = hovered === h.factId;
          return (
            <mesh
              key={h.factId}
              position={h.position}
              onClick={(e) => {
                e.stopPropagation();
                onPick(h.factId);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                onHover?.(h.factId);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                onHover?.(null);
                document.body.style.cursor = "";
              }}
            >
              <sphereGeometry args={[span * (isActive || isHover ? 0.017 : 0.011), 18, 14]} />
              <meshStandardMaterial
                color={isActive ? "#f0c674" : isHover ? "#e8a06a" : "#d06a50"}
                emissive={isActive ? "#7a5a1f" : "#3a140c"}
                roughness={0.4}
                transparent
                opacity={isActive || isHover ? 1 : 0.75}
              />
            </mesh>
          );
        })}
    </group>
  );
}

export default function VetModelScene({
  url,
  hotspots = [],
  active = null,
  onPick,
  refitKey,
  hiddenParts = [],
  activePart = null,
  onPickPart,
  onHover,
  showMarkers = false,
  tint,
}: {
  url: string;
  hotspots?: SceneHotspot[];
  active?: string | null;
  onPick?: (factId: string) => void;
  /**
   * Đổi giá trị này thì <Bounds> gắn lại và ngắm lại khung cho mẫu mới.
   *
   * Cố ý KHÔNG đặt key lên chính <Canvas>: làm thế là dựng lại ngữ cảnh WebGL
   * mỗi lần đổi xương, mà trình duyệt chỉ cho giữ khoảng 16 ngữ cảnh — bấm qua
   * vài chục cái xương là cảnh trắng bóc và không có lỗi nào báo ra. Gắn lại
   * phần bên trong thì ngữ cảnh giữ nguyên.
   */
  refitKey?: string;
  /** Tên vật liệu của những bộ phận đang bị tắt. */
  hiddenParts?: string[];
  /** Bộ phận đang xem riêng — các phần còn lại mờ đi. */
  activePart?: string | null;
  onPickPart?: (material: string) => void;
  /** Báo cấu trúc đang rê chuột tới, để thanh gợi ý hiện tên. */
  onHover?: (factId: string | null) => void;
  /** Hiện toàn bộ điểm đánh dấu như một trang atlas đánh số. */
  showMarkers?: boolean;
  /** Màu mô để nhuộm mẫu KHÔNG có ảnh bề mặt — xem `VET_LAYER_SWATCH`. */
  tint?: string;
}) {
  // Giữ ở đây chứ không ở `Specimen`: `Specimen` bị treo bởi Suspense của
  // `useGLTF`, đặt state trong đó là lặp lại đúng lỗi thứ tự hook đã trả giá.
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    /* Camera đặt ở MẶT BÊN, không phải chính diện.

       Bên người mặc định nhìn chính diện là đúng, vì người đứng thẳng và mặt
       phẳng trán là mặt phẳng quen thuộc. Thú bốn chân thì ngược lại: mọi
       atlas thú y vẽ ở mặt bên, và nhìn chính diện một con mèo thì thân nó
       thu vào một khối ngắn, các điểm chú giải dồn chồng lên nhau hết.

       <Bounds fit> giữ nguyên HƯỚNG nhìn và chỉ chỉnh khoảng cách, nên đặt
       hướng ở đây là đủ. Nhích nhẹ theo Y và Z cho ra góc chếch, tránh hình
       chiếu phẳng lì mất chiều sâu. */
    <Canvas camera={{ position: [3, 0.55, 0.9], fov: 40 }} dpr={[1, 2]} gl={{ antialias: true }}>
      {/* KHÔNG tô nền trong cảnh. Nền do CSS lo: khung xem thú y dùng lại lớp
          `.viewer-stage` của bên người (nền lưới kiểu Blender), tô nền ở đây là
          phủ kín mất. Chỗ nào cần nền phẳng thì phần tử bọc tự đặt màu. */}
      {/* Ba nguồn sáng thay vì một: mẫu xương nhiều hốc, một đèn thì hốc mắt và
          xoang mũi đen kịt, không đọc được hình. */}
      <hemisphereLight intensity={0.55} groundColor="#1a1d22" />
      <directionalLight position={[3, 4, 5]} intensity={1.5} />
      <directionalLight position={[-4, -1, -3]} intensity={0.6} />
      <Suspense fallback={null}>
        <Bounds key={refitKey} fit clip observe margin={1.15}>
          <Specimen
            url={url}
            hotspots={hotspots}
            active={active}
            onPick={(id) => onPick?.(id)}
            hiddenParts={hiddenParts}
            activePart={activePart}
            onPickPart={onPickPart}
            onHover={(id) => {
              setHovered(id);
              onHover?.(id);
            }}
            hovered={hovered}
            showMarkers={showMarkers}
            tint={tint}
          />
        </Bounds>
      </Suspense>
      <OrbitControls makeDefault enablePan={false} minDistance={0.6} maxDistance={12} />
    </Canvas>
  );
}
