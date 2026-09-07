# Soma 3D — quy trình và lệnh

Bản tra cứu ngắn. Bản giải thích có sơ đồ: `docs/quy-trinh.html`.

Mọi lệnh chạy trong thư mục `Soma_Fe/` trừ khi ghi rõ khác.

---

## 0. Chạy dự án ở máy

```bash
npm install          # lần đầu
npm run dev          # web ở http://localhost:3000
```

Backend (thư mục `../soma_be`):

```bash
npm install
npm run prisma:generate
npm run prisma:deploy   # tạo/cập nhật bảng
npm run db:seed         # nạp dữ liệu bệnh lý + cấu trúc
npm run start:dev       # API ở http://localhost:3001
```

Biến môi trường:

| Tệp | Khoá | Dùng để |
|---|---|---|
| `Soma_Fe/.env.local` | `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL` | trợ lý hỏi đáp, soạn đề từ PDF |
| `soma_be/.env` | `DATABASE_URL` | PostgreSQL |

---

## 1. Nguồn dữ liệu

| Nguồn | Nằm ở | Giấy phép | Cho ra cái gì |
|---|---|---|---|
| Z-Anatomy `Startup.blend` | `../zanatomy-src/Z-Anatomy/` | CC BY-SA | gần như toàn bộ 130 mô hình 3D người |
| BodyParts3D | `../zanatomy-src/bodyparts3d/` | CC BY-SA 2.1 JP | hồi tràng, manh tràng, trực tràng (Z-Anatomy thiếu) |
| Terminologia Anatomica `TA2.csv` | `../zanatomy-src/` | — | đối chiếu tên Latin |
| Giáo trình bệnh học (PDF) | `../medical_kb/sources/` | xem `medical_kb/catalog.json` | 2829 đoạn trong `data/pathology-chunks.jsonl` + ảnh minh hoạ |
| MediaPipe HandLandmarker | `public/mediapipe/` (42 MB) | Apache 2.0 | nhận diện bàn tay, chạy trong trình duyệt |
| Giáo trình thú y | không lưu tệp | — | 38 mục viết tay trong `src/lib/vet/facts/` |
| Zenodo (bản sao Objaverse của mô hình Sketchfab CC) | `public/models/vet/` | CC BY 4.0 | 3 mẫu vật thật: sọ chó, sọ mèo, sọ ngựa |

**Vẫn không có** bộ mesh thú y nào *gắn nhãn từng bộ phận*. Ba sọ trên là mẫu vật khối liền
để quan sát, không phải bản đồ có tên. Bò, lợn, gà chưa tìm được mẫu dùng được —
danh sách đã rà nằm trong `src/lib/vet/models.ts`.

> Sửa lại kết luận cũ: Sketchfab đòi đăng nhập để tải, **nhưng** Zenodo lưu bản sao
> Objaverse 1.0 của chính các mô hình CC đó và cho tải thẳng bằng HTTP — không cần tài khoản.

---

## 2. Bốn đường ống

### A. Mô hình 3D (Blender → web)

```bash
BLENDER="C:/Program Files/Blender Foundation/Blender 5.1/blender.exe"

# 1) xem trong file .blend có những gì
"$BLENDER" --background "Startup.blend" --python scripts/blender/dump_objects.py

# 2) xuất một vùng (cấu hình hộp cắt trong scripts/blender/region_config.py)
"$BLENDER" --background "Startup.blend" \
  --python scripts/blender/export_region.py -- ten_vung public/models/ten_vung.glb

# 3) nhẹ bớt nếu quá 12 MB
"$BLENDER" --background --python scripts/blender/decimate_glb.py -- vao.glb ra.glb

# 4) chụp ảnh đại diện
node scripts/render-thumbnails.mjs
node scripts/optimize-thumbnails.mjs
```

Rồi khai báo scene trong `src/lib/scenes/*.ts` và kiểm:

```bash
npm run verify:scenes    # mọi hotspot phải trỏ tới mesh CÓ THẬT trong .glb
node scripts/verify-layers.mjs
npm run verify:models
```

### A-bis. Mô hình 3D thú y (tải về → web)

```bash
node scripts/vet/import-vet-model.mjs duong-dan.glb   --species dog --slug dog-skull   --license "CC BY 4.0" --by "Tên tác giả" --url https://zenodo.org/records/...
```

Script tự giảm lưới, nén Draco, chép vào `public/models/vet/`, **từ chối giấy phép ND**,
rồi in ra đoạn mã cần dán vào `src/lib/vet/models.ts`. Ba trường `license`, `attribution`,
`sourceUrl` là bắt buộc — thiếu là `npm run test:vet-kb` báo lỗi.

### B. Ảnh và nội dung bệnh lý (PDF → web)

```bash
python scripts/kb/ocr_pdf.py            # PDF -> text
python scripts/kb/build_atlas_shots.py  # cắt hình trong sách
python scripts/kb/mask_atlas_labels.py  # che nhãn để ra đề
node scripts/render_all_lesions.mjs     # chụp vị trí tổn thương trên model
npm run verify:lesions                  # mốc tổn thương phải trỏ đúng mesh
```

### C. Tri thức chữ (không cần công cụ ngoài)

Sửa thẳng tệp TypeScript rồi chạy kiểm thử:

| Muốn thêm | Sửa tệp | Kiểm bằng |
|---|---|---|
| nhãn/ghi chú giải phẫu người | `src/lib/scenes/*.ts` | `npm run verify:scenes` |
| mục giải phẫu thú y | `src/lib/vet/facts/*.ts` | `npm run test:vet-kb` |
| hiểu biết về chính trang web | `src/lib/site/siteKnowledge.ts` | `npm run test:site-kb` |
| kiến thức tổng quan | `src/lib/anatomy/generalFacts.ts` | `npm run build` |

Câu hỏi trắc nghiệm **tự sinh** từ các kho trên — không có ngân hàng câu hỏi chép tay.

### D. Điều khiển bằng cử chỉ

Không có bước xử lý ngoại tuyến; mô hình và WASM đã nằm sẵn trong `public/mediapipe/`.

```bash
npm run test:gestures    # kiểm phép toán cử chỉ, không cần webcam
```

---

## 3. Bảng lệnh

| Việc | Lệnh |
|---|---|
| Chạy web | `npm run dev` |
| Dựng bản phát hành | `npm run build` |
| Bắt lỗi kiểu | `npx tsc --noEmit` |
| Bắt lỗi phong cách | `npx eslint src scripts` |
| Hotspot ↔ mesh | `npm run verify:scenes` |
| Lớp giải phẫu | `node scripts/verify-layers.mjs` |
| Mô hình quá nặng | `npm run verify:models` |
| Mốc tổn thương | `npm run verify:lesions` |
| Ngân hàng đề | `npm run verify:quiz-bank` · `npm run verify:quiz-text` |
| Kho thú y | `npm run test:vet-kb` |
| Kho hệ thống | `npm run test:site-kb` |
| Cử chỉ tay | `npm run test:gestures` |
| Liệt kê mesh trong .glb | `npm run meshes` |

---

## 4. Trước khi nộp hoặc đưa lên mạng

```bash
npx tsc --noEmit && npx eslint src scripts
npm run verify:scenes && node scripts/verify-layers.mjs && npm run verify:models
npm run verify:lesions && npm run test:vet-kb && npm run test:site-kb && npm run test:gestures
npm run build
```

Đưa lên mạng bằng **Render** (không dùng Railway):

- Frontend: Web Service, `npm run build` → `npm start`, đặt `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`.
- Backend: Web Service, `npm run build` → `npm run start:prod`, đặt `DATABASE_URL`; chạy `npm run prisma:deploy` rồi `npm run db:seed` một lần sau khi deploy.

---

## 5. Ba quy tắc dữ liệu

1. **Không bịa.** Thư viện không có thì nói chưa có — áp dụng cho cả trợ lý lẫn nội dung trang.
2. **Mọi nhãn phải verify được.** Hotspot trỏ tới mesh không tồn tại là lỗi chặn build, không phải chuyện nhỏ.
3. **Mọi tài nguyên ngoài phải nói được nguồn gốc và giấy phép**, hiện ngay trên trang dùng nó.
