# Chuẩn dựng model 3D của Soma

Tài liệu này là **luật**, không phải gợi ý. Mọi model trong `public/models/` phải
theo đúng những điều dưới đây, và `npm run verify:models` là chỗ kiểm.

Lý do có tài liệu: trước đây mỗi model xuất ra lại xem một kiểu — cùng một vùng,
dựng lại lần thứ hai là to nhỏ khác, lệch tâm khác. Nguyên nhân không nằm ở
model mà ở chỗ **không nơi nào chốt khung hình**: viewer để `<Bounds fit>` của
drei tự canh theo mesh đang mount, ảnh thumbnail thì tự tính bằng công thức
riêng trong `render_glb_preview.py`. Cả hai đều bám hộp bao TOÀN BỘ, nên chỉ cần
lần xuất sau lọt thêm một sợi thần kinh trườn ra ngoài vùng là cả mô hình bị đẩy
lệch và thu nhỏ lại.

---

## 1. Hệ trục, đơn vị, tư thế

| Điều | Chuẩn |
|---|---|
| Đơn vị | **mét**, tỉ lệ THẬT của cơ thể — không chuẩn hoá về cỡ 1 |
| Trục đứng | **+Y** (glTF Y-up) — xuất với `export_yup=True` |
| Hướng trước | **+Z** hướng về phía người xem |
| Toạ độ | **giữ nguyên toạ độ trong cơ thể** — bàn chân ở y≈0,05; đầu ở y≈1,56 |

Không được dời model về gốc toạ độ. Toạ độ thật là thứ giữ cho nhãn, mặt cắt và
các phép đo giữa các vùng còn khớp nhau; việc canh khung là việc của camera.

## 2. Khung hình chuẩn (phần cốt lõi)

Khung hình do **`src/lib/anatomy/modelFrames.json`** quyết định, sinh bằng:

```bash
npm run models:frames
```

Cách tính (ở `scripts/model-frame.mjs`):

- Hộp bao lấy theo **phân vị có trọng số**: mỗi primitive góp 8 đỉnh hộp bao của
  nó, nặng bằng số đỉnh lưới. Cắt 1% khối lượng ở mỗi đầu mỗi trục. Một sợi mạch
  lạc vài trăm đỉnh không kéo nổi khung; khối cơ hàng chục nghìn đỉnh mới quyết
  định. Hôm nay chênh lệch giữa hộp thật và khung ổn định lên tới **1,24 lần**
  (cerebellum.glb) — đó chính là phần nhảy khung.
- Thuần hình học, **không đọc tên mesh**. Luật phân lớp theo tên (`pickCat`) đã
  hai lần trôi lệch giữa viewer và trình render ảnh; khung hình không được phép
  dính vào chỗ dễ lệch đó.
- Camera bao theo **hình trụ đứng** (bề ngang = đường chéo mặt bằng, chiều cao
  giữ nguyên) chứ không phải hình cầu: model chỉ tự xoay quanh trục đứng, bao
  hình cầu đẩy camera xa thêm 40–70% và model nằm lọt thỏm giữa khung trống.
- Hướng nhìn chuẩn `VIEW_DIR = (0,18 · 0,12 · 1)`, chừa mép `VIEW_MARGIN = 1,18`,
  góc mở `fov = 40°`. Ba con số này khai ở `src/lib/anatomy/modelFrame.ts` và
  `render_glb_preview.py` đọc lại đúng chúng — **sửa một bên phải sửa cả hai**.

Hệ quả bắt buộc, đừng vô tình phá:

- **KHÔNG** bọc `<Center>` hay `<Bounds>` quanh model trong viewer.
- Bật/tắt/làm mờ một lớp **không được** đổi khung hình.
- `near`/`far` và giới hạn zoom tính theo bán kính model, không dùng số cứng:
  xương con tai giữa chỉ 4 mm, để `near = 0,01 m` là xén sạch thành khung trống
  mà không có lỗi nào để mà biết.

**Một ngoại lệ có chủ ý**: `GestureArmScene` (trang `/cu-chi`) vẫn giữ
`<Center>` BÊN TRONG nhóm biến đổi, vì ở đó cử chỉ tay xoay chính MÔ HÌNH chứ
không xoay camera — tâm xoay bắt buộc phải là tâm mô hình. Trang đó dùng một
model cố định nên không có vấn đề nhất quán giữa các scene.

Kiểm nhanh khung hình đang chạy: mở một trang `/xem/<slug>` rồi gõ
`window.somaFrame` trong console (chỉ có ở bản dev) — nó in ra tâm, kích thước,
khoảng cách camera và mặt phẳng cắt thật sự đang dùng.

## 3. Ngân sách và độ chi tiết

| Điều | Chuẩn |
|---|---|
| Tam giác mỗi model | ≤ **1,8 triệu** trong .glb |
| Nén | Draco bật, mức 6 |
| `min_verts` | 10 cho vùng thường, **4** cho vùng chi tiết (bàn tay, cổ tay — dây chằng gian cốt và đĩa sụn tam giác chỉ 4–11 đỉnh) |

Cẩn thận khi đọc log Blender: `len(o.data.polygons)` đếm **polygon**, mà lưới
Z-Anatomy phần lớn là tứ giác — một polygon thành hai tam giác khi xuất glTF.
`TRI_BUDGET = 900_000` trong `export_region.py` là polygon, tương đương 1,8 triệu
tam giác ở đây.

## 4. Đặt tên và phân lớp

Tên node trong .glb giữ nguyên tên Z-Anatomy (kể cả hậu tố `.r`/`.l`/`.001`).
Viewer tô màu bằng `pickCat` trong `src/lib/anatomy/layers.ts` — thêm luật mới ở
đó thì **phải chép sang `render_glb_preview.py`**, nếu không ảnh thumbnail và
trang xem sẽ tô khác nhau (đã xảy ra hai lần: dây chằng, móng tay).

## 4b. Màu trong ảnh render

Bảng `COL` trong `render_glb_preview.py` chép mã màu của viewer, mà mã màu web là
**sRGB**, còn ô "Base Color" của Blender nhận giá trị **TUYẾN TÍNH**. Nhét thẳng
số sRGB vào đó là mọi màu sáng lên một bậc: tim đỏ sẫm ra hồng cá hồi, gan nâu ra
be — cả bảng màu theo mô bệt thành một sắc hồng nhạt như nhau, mất luôn ý nghĩa
phân biệt mô. Đã sửa bằng `_srgb_to_linear()`; **đừng bỏ hàm đó khi thêm màu mới**.

Cùng lý do, `view_transform` đặt `Standard` (không dùng AgX/Filmic) và tổng năng
lượng đèn hạ xuống — bộ chuyển màn hình mặc định kéo tương phản và làm nhạt sắc
nên màu render không còn khớp màu trong viewer.

Render lại toàn bộ ảnh thumbnail: `node scripts/render-thumbnails.mjs`
(thêm `--resume` để chạy tiếp mẻ dở), rồi `node scripts/optimize-thumbnails.mjs`.
Script tự chọn chụp cả model hay chỉ nửa phải: chỉ cắt nửa khi model có cả chùm
`.l` lẫn `.r` VÀ khối lượng ở đường giữa dưới 10% — cột sống, sọ, hàm răng có
phần giữa thật nên luôn chụp nguyên.

## 5. Việc phải làm sau MỖI lần xuất model

```bash
npm run models:frames     # đo lại khung hình
npm run verify:models     # soát hình học + khung + scene trỏ đúng file
npm run verify:scenes     # soát tên mesh trong nhãn
```

`verify:models` báo **✗ (hỏng, chặn)** khi: model chưa có khung, khung cũ hơn file
.glb, scene trỏ tới file không tồn tại, hộp bao rỗng. Báo **! (cảnh báo)** khi:
quá ngân sách tam giác, nghi lật trục, hoặc hộp bao rộng hơn khung quá 1,35 lần
(dấu hiệu có cấu trúc trườn ra ngoài vùng — soát lại hộp cắt trong
`region_config.py`).

Bỏ bước `models:frames` là lỗi hay gặp nhất: file .glb mới, bảng khung cũ, viewer
canh theo số đo của bản xuất trước — đúng cái cảm giác "dựng lại xem khác".
