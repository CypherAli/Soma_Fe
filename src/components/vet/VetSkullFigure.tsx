"use client";

import dynamic from "next/dynamic";

// Canvas WebGL chỉ chạy client — tắt SSR để không lỗi khi render server.
const SkullTurntable = dynamic(() => import("@/components/home/SkullTurntable"), {
  ssr: false,
  loading: () => <div className="skull-loading" aria-hidden />,
});

/**
 * Sọ mèo 3D tự xoay cho hero khu thú y — đối xứng với sọ người ở hero trang Người.
 *
 * Trước đây chỗ này là ảnh tĩnh /plates/skull-cat.jpg. Nay đã có mẫu vật thật
 * (Felis catus, CC BY 4.0, quét Artec Space Spider) nên dùng luôn mẫu ấy: hai
 * khu dùng cùng một ngôn ngữ hình ảnh, và thứ người xem thấy ở hero đúng là
 * thứ họ mở ra được ở trang Mèo.
 *
 * margin 1.06 chứ không phải 1.28 như lúc đầu. 1.28 tính theo trường hợp xấu
 * nhất của một ô dọc hẹp; ô hero thật lại nằm ngang (~920×655) nên cùng con số
 * ấy đẩy sọ ra xa và mẫu vật bé hẳn so với nửa trái. Dựng lại khung bằng
 * Blender ở đúng 920×655, fov dọc 38°: ở 1.06 sọ choán gần hết chiều cao mà
 * không chạm mép — dư 6% chiều dọc và 3% chiều ngang so với bán kính lúc xoay
 * (đo 253.450 đỉnh: nửa cạnh 0,433 × 0,500 × 0,459 sau khi chuẩn hoá).
 */
export default function VetSkullFigure() {
  return (
    <div className="human-fig human-fig-3d vet-fig-3d" aria-hidden>
      <SkullTurntable url="/models/vet/cat-cranium.glb" margin={1.06} />
    </div>
  );
}
