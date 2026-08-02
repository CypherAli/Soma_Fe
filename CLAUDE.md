@AGENTS.md

# Soma 3D — Frontend

Atlas giải phẫu 3D tương tác (đồ án tốt nghiệp). Người trước, thú y sau.
Backend riêng ở `../soma_be` (NestJS + Prisma + PostgreSQL).

## Lệnh

```bash
npm run dev            # dev server, cổng 3000
npm run build          # build production — CHẠY TRƯỚC KHI KẾT LUẬN "xong"
npm run lint
npm run verify:scenes  # đối chiếu scene ↔ file model có thật
```

Xuất model từ Blender (Z-Anatomy, không commit file `.blend`):

```bash
BLENDER="C:/Program Files/Blender Foundation/Blender 5.1/blender.exe"
"$BLENDER" --background "../zanatomy-src/extracted/Z-Anatomy/Startup.blend" --python scripts/blender/export_forearm.py -- "public/models/forearm.glb"
```

Xem trước model không cần trình duyệt (rất hữu ích để tự kiểm tra):

```bash
"$BLENDER" -b --python scripts/blender/render_glb_preview.py -- "public/models/forearm.glb" "out.png" 1.0 head "skin,muscle"
```

Tham số lần lượt: file glb · ảnh xuất · độ mờ lớp da · khung ngắm (`head`/`eye`) · lớp cần ẩn.

## Kiến trúc

| Vùng | Nơi để |
|---|---|
| Trang | `src/app/[locale]/` — đa ngữ vi/en/zh qua `next-intl` |
| Phân lớp giải phẫu | `src/lib/anatomy/layers.ts` — **nguồn duy nhất** cho màu + `pickCat` |
| Điều khiển cử chỉ | `src/lib/gesture/` + `src/components/gesture/` |
| Dữ liệu scene | `src/lib/scenes/`, gom ở `sceneModules.ts`, tra cứu qua `catalog.ts` |
| Model 3D | `public/models/*.glb` (nén Draco, decoder ở `public/draco/`) |

Model flagship nhiều lớp: `/xem-canh-tay` · `/xem-dau` · `/xem-co` · `/xem-than` ·
`/cu-chi` (điều khiển bằng cử chỉ) — tất cả dùng chung `ArmScenePage` + `ArmViewer`.

## Bẫy đã dính, đừng lặp lại

**Three.js / R3F**

- KHÔNG ép `material.side = DoubleSide` toàn cục → GPU tích hợp (Iris Xe) mất WebGL context,
  màn hình trắng xoá. Script Blender đã `recalc_face_normals` nên `FrontSide` là đủ.
- KHÔNG gộp mesh theo tên material: Z-Anatomy **dùng chung tên material giữa các cơ quan
  không liên quan** (tim mang material tên "Trapezius") → gộp là sai giải phẫu.
- `<Center>` phải nằm **bên trong** nhóm áp biến đổi, nếu không tâm xoay rơi vào gốc toạ độ
  Blender ở xa và mô hình văng khỏi khung khi xoay/zoom.
- `<Bounds>`: `clip` cắt mất mô hình lúc xoay, `observe` căn lại khung mỗi lần zoom.
- Tên mesh trong glTF bị đổi khoảng trắng thành `_` lúc runtime — so khớp phải theo tên
  **đã sanitize**.

**Vòng lặp thời gian thực (webcam, useFrame)**

- KHÔNG `setState` mỗi khung hình → "Maximum update depth" và tụt FPS. Dữ liệu đi qua ref +
  callback; state chỉ đổi khi có sự kiện thật (~2 lần/giây).
- Ngưỡng nhận tư thế tay phải **chuẩn hoá theo cỡ bàn tay**, nếu không tay xa/gần camera là sai.
- Mọi biến đổi cộng dồn (pan) phải kẹp giới hạn, nếu không mô hình trôi mất không có đường về.

**Kiểm chứng không cần webcam**: trang `/cu-chi` expose `window.somaGesture`; Canvas bật
`preserveDrawingBuffer` nên có thể vẽ canvas WebGL sang canvas 2D rồi **đếm % điểm ảnh khác
màu nền** để biết mô hình còn trong khung hay đã trôi.

## Nguyên tắc nội dung

Dữ liệu giải phẫu lấy từ Z-Anatomy (CC-BY-SA), thuật ngữ theo Terminologia Anatomica, đối
chiếu giáo trình ĐH Y Hà Nội. **Thiếu dữ liệu thì ghi rõ là thiếu, không bịa** — Z-Anatomy
xác nhận KHÔNG có: manh tràng, trực tràng, ống hậu môn, bóng Vater, mesh da người.
