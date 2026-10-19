---
name: vision-ai
description: Luật của trang Vision AI (/cu-chi) — quét vật thật + điều khiển mô hình 3D bằng cử chỉ tay qua webcam. Dùng khi đụng BẤT KỲ thứ gì của trang này: nghi thức tia quét, reveal, overlay X-quang, pose, gesture, nhận diện, giọng nói. Đọc trước khi viết code cho trang này.
---

# Vision AI — luật của trang `/cu-chi`

Trang duy nhất trong đồ án học giải phẫu **không chạm chuột**: một camera, hai chế
độ (Quét / Điều khiển), bộ cử chỉ tay, nhận diện hai tầng, điều khiển giọng nói.

## 1. Kiến trúc một trang, một camera

- File trang: `src/app/[locale]/cu-chi/page.tsx` (~2000 dòng, client component).
- **MỘT thẻ `<video>` duy nhất** cho cả hai chế độ — chỉ đổi lớp CSS. Chuyển nó sang
  chỗ khác trong cây React là dựng lại phần tử, MẤT luồng camera, buộc xin quyền lại.
- Tách trang là xin quyền camera hai lần + hai luồng webcam + tab sau "camera bận".
- Đổi mô hình (`fireTarget("control:<slug>")`) nạp ngay tại chỗ, **không điều hướng**,
  không tải lại trang — webcam không hề ngắt.

## 2. Ba nguyên tắc cử chỉ (đừng phá)

1. **Mỗi việc một cử chỉ riêng**: 1 tay trỏ / xoè xoay / nắm kéo; zoom CHỈ bằng hai
   tay cùng chụm. Trộn cử chỉ là thứ từng làm trang "cực kì khó kiểm soát".
2. **Neo + vùng chết**: vào chế độ nào cũng chốt mốc tại chỗ (`anchorsRef`), bỏ qua
   lệch nhỏ (`PAN_DEAD`, `ROT_DEAD`, `TILT_DEAD`). Tay run không làm model nhúc nhích.
3. **Con trỏ có lực hút**: gần nút thì dính vào tâm (`MAGNET_PX`), dwell 1,2s;
   "Vứt" là hành động phá huỷ nên dwell 2,5s + đếm ngược, không cho bấm nhanh.

## 3. Luật vòng lặp thời gian thực (sống còn trên Iris Xe)

- **CẤM `setState` mỗi khung hình** → "Maximum update depth" + tụt FPS. Mọi dữ liệu
  mỗi-khung đi qua **ref + callback** (`transformRef`, `cursorRef`, `revealRef`,
  `ritualRef`); state chỉ đổi ở sự kiện thật (~mốc đếm, quét xong, chọn vùng).
- Raycast con trỏ ~30 lần/giây là đủ (nhận diện tay chỉ ~25 Hz).
- Làm mượt theo **thời gian thật** (`1 - exp(-delta/0.06)`), không theo số khung hình
  — kẻo 144 Hz chạy nhanh gấp 2,4 lần 60 Hz.
- Biến đổi cộng dồn (pan) phải **kẹp giới hạn**, ngưỡng tay chuẩn hoá theo cỡ bàn tay.
- `<Center>` phải nằm BÊN TRONG nhóm biến đổi; `<Bounds>`: không `observe` (giành
  zoom), không `clip` (cắt model lúc xoay). Margin 1.02 = cắt gọn.
- `Suspense` NẰM TRONG `<Canvas>`: `useGLTF` treo giữa phiên mà không có ranh giới là
  React gỡ cả cây — kể cả thẻ `<video>` — camera tắt, xin quyền lại.

## 4. Render 3D phải giống viewer (đã trả giá 2 lần)

- `dpr={[1, 2]}`, `toneMappingExposure = 1.12` (trong `onCreated`), antialias bật.
- **IBL bắt buộc**: `scene.environment` từ PMREM + `RoomEnvironment` nội bộ
  (`src/lib/humanAtlas/roomEnvironment.ts`, offline được). Không env thì
  `MeshStandardMaterial` bẹt, chết sáng — nhìn khác hẳn viewer dù cùng dữ liệu.
- Giàn đèn copy nguyên atlas viewer: hemi `#ffffff/#a7acb2` 1.05, key `#fffaf4`
  2.3 ở `(-2,4,3)`, rim `#e9f0ff` 1.8 ở `(2,2,-3)`. Không đổi đèn theo theme, chỉ
  đổi màu nền (`useStageDark()` đọc `data-theme` trên `<html>`).
- Màu mesh atlas: `g.tint ?? màu hệ` — scene nào không tint thì ra đúng màu viewer.
  Ô màu trong bảng lớp phải dùng CÙNG công thức, không thì swatch lệch màu 3D.

## 5. Mô hình điều khiển (`src/lib/anatomy/controlModels.ts`)

- Hai loại: `atlas` (scene BodyParts3D, ưu tiên) và `glb` (Z-Anatomy, đường lui).
- `getControlModel(slug)` là nguồn tra duy nhất. Scene chỉ-Vision-AI
  (`toan-than`, `nua-than-tren`) KHÔNG đăng ký vào `atlasScenes` (kẻo lọt sang thư
  viện) — khai trong `VISION_ONLY` tại đây.
- Scene sinh tự động (`wholeBody.ts`, `upperBody.ts`): ghi rõ nguồn + "đừng sửa tay".
  Muốn đổi vùng quét thì sửa script gen trong `C:\Users\trinh\AppData\Local\Temp\opencode\gen-*.cjs`
  rồi sinh lại, không sửa file sinh.

## 6. Nghi thức tia quét tầng 1 (gương X-quang)

- Bật camera → `startRitual()`: nạp `nua-than-tren` (457 mảnh), reset view, đếm
  ngược 3-2-1 (700ms/số, overlay trong khung video), rồi laser quét 3,2s.
- Tia laser vẽ thẳng lên `camCanvasRef` trong `handleFrame` (đọc `ritualRef`).
- Reveal 3D: `revealRef = { active, progress }` → `GestureAtlasScene` → mặt cắt
  ngang trượt đỉnh→đáy bằng **clipping plane** (renderer đã bật `localClipping`).
  Gán/gỡ plane đúng một lần khi bật/tắt; mỗi khung chỉ đổi `constant`. Không đụng
  opacity vật liệu nên không xung đột bảng lớp/mờ/vứt.
- Tắt cam giữa chừng: phase về `idle`, rAF tự dừng (kiểm tra phase trong tick),
  timers bị clear. Mọi đường thoát sớm đều phải dọn — thiếu một chỗ là kẹt.
- Nút `↻ Quét lại` (header, chỉ khi đã bật cam) chạy lại nghi thức.
- Tia laser ÔM KHÍT người bằng MASK từng pixel (`personMask.ts`, model
  `selfie_multiclass_256x256.tflite` tự host): bbox pose là hình chữ nhật nên
  hai bên đầu/vai vẫn dính nền — chỉ mask mới ôm khít.
- Segment MỘT lần trên khung VUÔNG giữa video lúc đếm ngược (512px); khung
  vuông là hệ quy chiếu cố định để ánh xạ mask→canvas khớp mọi tỉ lệ
  (`mX`/`mY` trong `handleFrame`). Người = pixel khác background, không phụ
  thuộc mã nhãn model. Ít hơn 1% khung hình là người → coi như không thấy ai.
- Render ritual NỀN ĐEN TUYỆT ĐỐI (spec stage 1 bước 2): canvas trung gian
  (`compRef`, cỡ bằng canvas hiển thị) dựng video cover → `destination-in`
  silhouette → chi tiết (Sobel + glow + lưới) chỉ trong vùng đã quét (clip theo
  hàng tia) → đặt lên nền `#000`. Nền phòng BIẾN MẤT HẲN. Khung xương tay và
  tia vẽ sau nên vẫn nổi bên trên.
- Chi tiết bề mặt (`buildDetailMaps`, chạy MỘT lần trên khung vuông 512px):
  Sobel giữ biên vừa (nếp/vân, bỏ nhiễu và biên gắt) + glow mờ pseudo-depth +
  lưới laze ~9px `source-atop` (chỉ dính lên người). Đây là tăng cường hiển thị
  từ webcam, KHÔNG phải đo nanomet — cấm ghi nhãn "nanomet" trong UI y khoa.
- Tia chỉ vẽ trên các đoạn người của đúng hàng đang quét (`personRuns`); tầm
  quét dọc = hàng trên/dưới cùng có người trong mask. Chưa có mask → lui về
  bbox pose (`bodyBoxRef`), rồi lui nữa về toàn khung. Luôn có đường lui.
- Snapshot sau quét: bbox mask (+8px) → video gốc → PNG nền trong suốt
  (`ritualShot`, thumbnail góc phải dưới + log console). Ảnh gửi GPU
  (`capture()`): segment mẩu vuông → người lên nền đen → crop khít → đặt lại
  khung vuông (fitContain, không kéo giãn) → cổng chất lượng → consent → GPU
  như cũ. Hỏng thì giữ ảnh xám cũ — pipeline dưới không đổi.

## 7. Hồ sơ song sinh tầng 2 (`bodyMeasure.ts` + card sidebar)

- Đo từ ĐÚNG lần pose lúc đếm ngược (không detect thêm): mũi (0), vai (11,12),
  khuỷu (13,14), cổ tay (15,16), hông (23,24) — thiếu/mờ một mốc là bỏ, không
  đoán. Đơn vị là pixel video + tỉ lệ tương đối, CẤM ghi "cm" ở UI.
- Auto-zoom toàn trong không gian màn hình: chiều cao người (đỉnh đầu ước lượng
  = mũi − 0.5·đầu, tới hông) qua phép object-cover, chia cho chiều cao model mặc
  định (~74% khung), kẹp 0.5–1.6. Không đổi ra đơn vị thế giới nên không bịa.
- Hồ sơ `{ m, zoom }` lưu `localStorage soma-twin/v1`, card "Song sinh số" hiện
  khi có số đo. Số đo này là đầu vào neo từng đoạn xương của overlay tầng 4.

## 8. Nhận diện quét (chế độ Quét)

- Hai tầng qua `lib/vision/recognise.ts`: mốc giải phẫu trên máy trước, GPU sau.
- Ảnh gửi đi chỉ khi có consent (`consentStore`); pose chạy ĐÚNG MỘT LẦN lúc chụp
  (`poseOnce.ts`, IMAGE mode) — chạy nền liên tục là ăn hết FPS của tay.
- Mọi kết quả bất đồng bộ mang số hiệu phiên (`scanGenRef`): khác phiên là bỏ.
- Ảnh gửi đi phải lật lại đúng chiều thật (ảnh xem trước là ảnh gương).
- Hook tự kiểm chứng dev: `window.somaScan.capture(...)`, `window.somaHandWorker()`.

## 9. Giọng nói + đa ngữ

- Mọi lệnh qua `useVoiceActions("vision-ai", ...)` — người dùng bận cả hai tay nên
  giọng nói phải làm được mọi thứ (quét, mở model, bật lớp, zoom, hoàn tác).
- Chữ nghĩa gom ở `gestureText.ts` + `visionText.ts` (vi/en/zh). Thêm label là thêm
  cả ba thứ tiếng, không viết chết tiếng Việt.
- Lệnh "BẬT" là bật (không đảo trạng thái như nút bấm); "bậc/tắc" vẫn nhận.

## 10. Lệnh kiểm chứng sau mỗi tầng

```bash
npm run build        # BẮT BUỘC pass trước khi báo xong
npm run lint         # lỗi cũ có sẵn ở file khác thì kệ, file mình sửa phải sạch
npm run verify:scenes
```

## 11. Bẫy đã dính — đừng lặp lại

- `material.side = DoubleSide` toàn cục → Iris Xe mất WebGL context, trắng màn hình.
- Gộp mesh theo tên material → sai giải phẫu (Z-Anatomy dùng chung tên material).
- Tên mesh glTF bị đổi khoảng trắng thành `_` — so khớp theo tên đã sanitize.
- Div cần cuộn con lăn thì thêm `data-lenis-prevent`.
- Nút huỷ diệt (Vứt) không bao giờ cho bấm nhanh bằng pinch — bắt giữ đủ dwell.
