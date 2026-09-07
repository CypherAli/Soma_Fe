# Vision AI — quét bộ phận thật qua camera

Chuỗi xử lý đầy đủ:

```
webcam 1280×720 ──┬─► thu nhỏ 480 px ─► MediaPipe Hands ─┬─ 1 tay: ô tự bám bàn tay ─► giữ yên
                  │                                    └─ 2 tay: ô ngắm ─► chụm giữ ─► đếm ngược
                  │                                                                    │
                  └─────────────────── cắt VUÔNG 336 px từ khung hình GỐC ◄─────────────┘
                                                   │
                             cổng chất lượng (nét / sáng / đủ lớn) — chạy trên máy
                                                   │
       ┌─ TẦNG 1 (trên máy, ~0 ms mạng): Pose chạy MỘT LẦN trên cả khung hình
       │  vừa chụp → xét ô đã ngắm trùng đoạn xương nào (IoU) → top-3 vùng.
       │  IoU ≥ 0,28 thì dừng ở đây, KHÔNG gọi GPU.
       │
       └─ TẦNG 2 (lưới an toàn): POST /api/vision/identify ──► service.py (GPU)
          Chờ tối đa 800 ms; quá hạn thì hiện kết quả tầng 1 trước, kết quả
          mạng về muộn chỉ được nhận nếu người dùng chưa chọn gì.
                                                   │
                                      người dùng dwell chọn ─► mở scene
```

## 1. Chạy dịch vụ trên máy GPU

```bash
pip install fastapi uvicorn torch open_clip_torch pillow numpy
export SOMA_VISION_KEY="chuoi-bi-mat-tu-dat"
python scripts/vision/service.py --port 8000
curl localhost:8000/health
```

`/health` cho biết đang chạy chế độ `knn` (đã có ảnh mẫu) hay `zero-shot`.

## 2. Trỏ web sang dịch vụ

`.env.local` của Next.js:

```
SOMA_VISION_URL=https://<máy-gpu>/           # đúng địa chỉ POST của service.py
SOMA_VISION_KEY=chuoi-bi-mat-tu-dat
```

Không đặt hai biến này thì route trả `vision-offline`, trang `/quet` vẫn chạy
bình thường và chuyển sang cho người dùng tự chọn vùng — **không** hiện lỗi đỏ.

## 2b. Vì sao GPU chỉ là lưới an toàn

Ảnh webcam một mảng da rất khó cho mô hình thị giác, nhưng vị trí các mốc giải
phẫu thì MediaPipe đã cho sẵn. `src/lib/vision/bodyRegions.ts` dựng ô tham chiếu
cho từng vùng (mắt, tai, miệng, mặt, cổ, vai, cánh tay, khuỷu, cẳng tay, cổ tay,
bàn tay, ngực, bụng, gối, bàn chân) rồi so IoU với ô người dùng ngắm. Cách này
giải thích được từng con số và không phụ thuộc dữ liệu huấn luyện.

GPU chỉ vào cuộc khi mốc không đủ — hay gặp nhất là đưa bàn tay sát camera nên
Pose không thấy thân người.

## 3. Nâng độ chính xác bằng ảnh mẫu

Zero-shot đủ để demo nhưng yếu ở những cặp dễ lẫn (cẳng tay ↔ cánh tay, cổ tay ↔
bàn tay). Cách sửa rẻ nhất là chụp ảnh mẫu bằng chính webcam đó:

```bash
# refs/<tên-vùng>/*.jpg  — tên thư mục trùng VisionPartKey ở src/lib/vision/parts.ts
python scripts/vision/build_index.py --refs scripts/vision/refs
# rồi khởi động lại service.py
```

Yêu cầu chụp ảnh mẫu ghi ở đầu `build_index.py` — đọc trước khi chụp, vì bộ ảnh
sai quy cách còn tệ hơn không có ảnh.

**Cách thu ảnh mẫu rẻ nhất:** dùng trang như bình thường; lần nào máy đoán sai
thì bấm **"lưu làm ảnh mẫu"** ở thẻ kết quả. Ảnh tải thẳng về máy với tên đã gắn
nhãn vùng (`forearm-1725300000000.jpg`), chỉ việc bỏ vào `refs/<nhãn>/`. Không
tấm nào tự gửi đi đâu.

## 4. Điều đã đo và những giới hạn phải sống chung

| Vấn đề của camera | Cách đã xử lý trong mã |
|---|---|
| Cắt 25% khung 480×360 chỉ còn ~200 px | Camera mở 720p, MediaPipe vẫn chỉ nhận ảnh thu nhỏ 480 px (`detectWidth`) |
| Webcam lấy nét cố định, gần hơn ~20 cm là nhoè | Cổng chất lượng đo phương sai Laplacian, chặn và bảo "đưa xa ra" |
| Ngược sáng / phòng tối | Chặn theo độ sáng trung bình, gợi ý chỉnh đèn |
| Ảnh xem trước bị lật gương | `boxToSourceRect` lật ngược trục x trước khi cắt — trái/phải không đảo |
| Hai tay bận ngắm thì không quét được chính bàn tay mình | Giơ MỘT tay → ô tự bám 21 landmark của chính bàn tay đó, kéo dài xuống cẳng tay, giữ yên là chụp |
| Ô ngắm tự do không vuông, mà mô hình cần ảnh vuông | Cắt đúng ô rồi VIỀN XÁM cho vừa khung vuông (`fitContain`), không kéo giãn |
| Không có chiều sâu, không biết tỉ lệ thật | Top-3 chứ không tự quyết; câu nhắc bảo lấy kèm một khớp làm mốc |
| Máy yếu (Iris Xe) | Nhận diện ảnh là hành động RỜI RẠC, mỗi lần quét một lần; không chạy nền |

## 5. Riêng tư

Chỉ mẩu ảnh vuông đã cắt được gửi đi, và chỉ sau khi người dùng bấm đồng ý
(lựa chọn được nhớ ở `localStorage`, khoá `soma.vision.consent`). Dịch vụ không
ghi ảnh xuống đĩa. Người dùng từ chối thì toàn bộ trang vẫn dùng được ở chế độ
tự chọn vùng.
