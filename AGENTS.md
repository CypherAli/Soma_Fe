# Soma 3D — Frontend · Hướng dẫn cho AI agent

Atlas giải phẫu 3D tương tác (đồ án tốt nghiệp). Next.js 16 App Router · React Three Fiber ·
Tailwind v4 · Zustand · next-intl (vi/en/zh). Backend riêng ở `../soma_be` (NestJS + Prisma).

---

## 1. ĐỌC SKILL TRƯỚC KHI VIẾT CODE

Kho skill của dự án nằm ở **`.claude/skills/`**. Mỗi thư mục có một `SKILL.md` hướng dẫn đầy
đủ. Đây là bộ đã lọc theo `package.json` thật — dùng chúng thay vì tự suy đoán.

**Cách nạp:**
- **Claude Code** — gọi công cụ `Skill` với *tên gọi* ở cột giữa (khác tên thư mục!).
- **Agent khác (Codex, Cursor…)** — đọc thẳng `.claude/skills/<thư-mục>/SKILL.md`.

| Thư mục | Tên gọi khi invoke | Bắt buộc đọc khi… |
|---|---|---|
| `three-js` | `three-js` | Đụng BẤT KỲ thứ gì 3D: Canvas, mesh, glTF, đèn, camera, drei, tối ưu |
| `r3f-shaders` | `r3f-shaders` | Viết GLSL, `shaderMaterial`, uniforms, hiệu ứng/mặt cắt tuỳ biến |
| `nextjs-app-router-patterns-v3` | `nextjs-app-router-patterns-v3` | Thêm route, layout, server/client component, data fetching |
| `tailwind-css-rules` | `tailwind-css-rules` | Viết/sửa class Tailwind, responsive, dark mode, token |
| `state-management` | `state-management` | Thêm/sửa store Zustand, chia state server ↔ client, lỗi re-render |
| `nestjs-architecture` | `nestjs-architecture` | Làm backend: module, DI, vòng đời, kiến trúc tầng |
| `nestjs-patterns` | `nestjs-patterns` | Controller, service, DTO, pipe, guard, interceptor |
| `openapi-expert` | `openapi-expert` | Thiết kế/sửa API, tài liệu Swagger |
| `openapi-schema-validation` | `OpenAPI Schema Validation` | Kiểm tra schema OpenAPI hợp lệ |
| `output-skill` | `full-output-enforcement` | Viết/sửa file lớn — **cấm** `// ...rest of code`, cấm rút gọn |
| `image-to-code-skill` | `image-to-code` | Người dùng gửi ảnh/screenshot/mockup cần dựng thành giao diện |
| `taste-skill` | `design-taste-frontend` | Làm trang/landing mới, tránh giao diện nhìn như máy sinh |
| `soft-skill` | `high-end-visual-design` | Cần "đẹp, cao cấp, sang" — spacing, shadow, card, chuyển động |
| `redesign-skill` | `redesign-existing-projects` | Nâng cấp giao diện có sẵn mà không phá chức năng |
| `eli5` | `eli5` | Người dùng yêu cầu giải thích dễ hiểu, bỏ thuật ngữ hoặc giải thích vai trò thành phần dự án |

> Không có skill Web3/blockchain — dự án ArtCurve đã bỏ, đừng mang khái niệm đó vào đây.
> Cũng KHÔNG dùng GSAP, Framer Motion, shadcn/ui: không có trong `package.json`.

---

## 2. Lệnh

```bash
npm run dev            # dev server, cổng 3000
npm run build          # BẮT BUỘC chạy trước khi kết luận "xong"
npm run lint
npm run verify:scenes  # đối chiếu scene ↔ file model có thật
```

Xuất model từ Blender (nguồn Z-Anatomy, **không commit** file `.blend`):

```bash
BLENDER="C:/Program Files/Blender Foundation/Blender 5.1/blender.exe"
"$BLENDER" --background "../zanatomy-src/extracted/Z-Anatomy/Startup.blend" --python scripts/blender/export_forearm.py -- "public/models/forearm.glb"
```

Xem trước model **không cần trình duyệt** — cách tự kiểm tra nhanh nhất:

```bash
"$BLENDER" -b --python scripts/blender/render_glb_preview.py -- "public/models/forearm.glb" "out.png" 1.0 head "skin,muscle"
```

Tham số: file glb · ảnh xuất · độ mờ lớp da · khung ngắm (`head`/`eye`) · lớp cần ẩn.

---

## 3. Bản đồ mã nguồn

| Vùng | Nơi để |
|---|---|
| Trang | `src/app/[locale]/` — đa ngữ vi/en/zh |
| Phân lớp giải phẫu | `src/lib/anatomy/layers.ts` — **nguồn DUY NHẤT** cho màu + `pickCat` |
| Điều khiển cử chỉ | `src/lib/gesture/` + `src/components/gesture/` |
| Dữ liệu scene | `src/lib/scenes/` → gom ở `sceneModules.ts` → tra cứu qua `catalog.ts` |
| Model 3D | `public/models/*.glb` (Draco, decoder ở `public/draco/`) |

Trang model nhiều lớp: `/xem-canh-tay` · `/xem-dau` · `/xem-co` · `/xem-than` ·
`/cu-chi` (điều khiển bằng cử chỉ tay qua webcam) — dùng chung `ArmScenePage` + `ArmViewer`.

---

## 4. Bẫy đã dính — đừng lặp lại

**Three.js / R3F**

- KHÔNG ép `material.side = DoubleSide` toàn cục → GPU tích hợp (Iris Xe) mất WebGL context,
  màn hình trắng xoá. Script Blender đã `recalc_face_normals` nên `FrontSide` là đủ.
- KHÔNG gộp mesh theo tên material: Z-Anatomy **dùng chung tên material giữa các cơ quan
  không liên quan** (quả tim mang material tên "Trapezius") → gộp là sai giải phẫu.
- `<Center>` phải nằm **bên trong** nhóm áp biến đổi; đặt ngoài thì tâm xoay rơi vào gốc toạ
  độ Blender ở xa, mô hình văng khỏi khung ngay khi xoay/zoom.
- `<Bounds>`: `clip` cắt mất mô hình lúc xoay; `observe` căn lại khung mỗi lần zoom.
- Tên mesh glTF bị đổi khoảng trắng thành `_` lúc chạy — so khớp phải theo tên **đã sanitize**.

**Vòng lặp thời gian thực (webcam, `useFrame`)**

- KHÔNG `setState` mỗi khung hình → "Maximum update depth" và tụt FPS. Dữ liệu đi qua ref +
  callback; state chỉ đổi khi có sự kiện thật (~2 lần/giây).
- Ngưỡng nhận tư thế tay phải **chuẩn hoá theo cỡ bàn tay**, không thì tay xa/gần là sai hết.
- Biến đổi cộng dồn (pan) phải **kẹp giới hạn**, không thì mô hình trôi mất không có đường về.

**Tự kiểm chứng không cần webcam**: `/cu-chi` expose `window.somaGesture`; Canvas bật
`preserveDrawingBuffer` nên vẽ được canvas WebGL sang canvas 2D rồi **đếm % điểm ảnh khác màu
nền** để biết mô hình còn trong khung hay đã trôi.

---

## 5. Quy tắc nội dung & quy trình

- Dữ liệu giải phẫu: Z-Anatomy (CC-BY-SA), thuật ngữ Terminologia Anatomica, đối chiếu giáo
  trình ĐH Y Hà Nội. **Thiếu dữ liệu thì ghi rõ là thiếu, KHÔNG bịa.** Đã xác nhận Z-Anatomy
  không có: manh tràng, trực tràng, ống hậu môn, bóng Vater, mesh da người.
  Tra thêm ngày 13/08/2026 (bằng `query_bbox.py`), cũng KHÔNG có: cơ bìu, cơ hành xốp,
  cơ ngồi hang, cơ thắt niệu đạo, cơ ngang đáy chậu, thừng tinh, bìu, màng nhện. Có nhưng
  dễ tưởng là không vì mesh rất nhỏ: 4 tuyến cận giáp (9 đỉnh — phải hạ `min_verts`),
  thuỳ trước/sau tuyến yên (tên `Adenohypophysis`/`Neurohypophysis`, không phải "pituitary").
- Git: **tạo nhánh trước, merge `main` sau** (`--no-ff`). Commit tách theo từng chức năng.
  Không thêm logo hay `Co-Authored-By` của công cụ vào commit.
- Div nào cần cuộn bằng con lăn chuột thì thêm `data-lenis-prevent`.
- Làm xong dứt điểm từng phần, không để trạng thái "chạy tạm rồi quay lại sau".

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
