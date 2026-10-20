# Tối ưu thao tác 3D — 21/10/2026

## Chẩn đoán trên máy hiện tại

- Windows chặn SWC native; Next dev dùng webpack/WASM. Trang `/vi/xem-canh-tay` mất 10,46 giây ở lần biên dịch đầu và 0,62 giây khi đã biên dịch. Không dùng hai số này để khẳng định tốc độ production.
- Backend health phản hồi 117 ms.
- RAM vật lý 15,65 GB, chỉ còn 0,79 GB trống tại thời điểm đo. `llama-server` chiếm khoảng 4,7 GB, Next dev khoảng 2 GB. GPU Intel Iris Xe dùng bộ nhớ chung.
- Picker trong ba viewer R3F raycast toàn bộ mô hình trên từng pointermove, kể cả đang kéo xoay. Hover trên viewer vùng còn cập nhật vật liệu và Zustand khi con trỏ đi qua các mesh.

## Thay đổi

- Không raycast hover khi đang nhấn nút chuột hoặc dùng cảm ứng; hover chuột tối đa 20 lần/giây. Click chọn cấu trúc vẫn raycast ngay khi nhả chuột.
- ArmViewer, ModelScene và SectionModelScene giảm DPR tạm thời còn 75% khi camera di chuyển, tối thiểu một pixel trên mỗi CSS pixel. Khôi phục DPR ban đầu khi camera ngừng chuyển động. Không đổi geometry, nhãn, vật liệu hay dữ liệu giải phẫu.
- AtlasScene đã bỏ hover lúc kéo và dựng theo dirty flag nên không cần áp lại thay đổi này.

## Đo trước/sau

Cùng Chrome headless, viewport 1280×720, DPR 1,25, cùng trang cánh tay và 50 lần di chuyển chuột khi kéo. Công cụ đo nằm ở `docs/measure-viewer.cjs` trong thư mục gốc đồ án; số liệu JSON nằm cùng thư mục đó.

| Chỉ số | Trước | Sau |
| --- | ---: | ---: |
| Xử lý sự kiện chuột trung bình | 12,19 ms | 0,28 ms |
| Xử lý sự kiện chuột p95 | 26 ms | 0,5 ms |
| Khoảng cách khung hình trung bình | 17,12 ms | 16,78 ms |
| Buffer khi xoay | 800×830 | 640×664 |
| Lỗi JavaScript trên trang | 0 | 0 |

Thời gian xử lý chuột giảm khoảng 98%; đây không phải mức tăng FPS tổng thể. Cả hai lượt đo đều gần 60 FPS trong điều kiện thử. Không suy rộng sang mọi mô hình, độ phân giải và mức tải RAM.

## Kiểm chứng bản production

- Build production, TypeScript, lint và verify:scenes đều đạt; 1.310 hotspot khớp node mô hình.
- HTTP trang cánh tay: 160 ms lần đầu, 39 ms lần kế tiếp trên server kiểm tra cục bộ. Đây là thời gian tải HTML, chưa gồm JS, model và tương tác.
- Chrome trên production: xử lý chuột trung bình 0,28 ms, khoảng cách khung hình 16,67 ms, không có lỗi JavaScript.
- Chọn cấu trúc để dừng tự xoay: buffer khôi phục từ 640×664 lên 800×830, đúng DPR ban đầu 1,25.
- Ảnh `docs/viewer-performance.png` tại thư mục gốc đồ án xác nhận mô hình và bảng thông tin hiển thị. Server/Chrome kiểm tra đã tự đóng; server dev của người dùng vẫn chạy.

## Chạy khi trình diễn

Dừng dev server bằng Ctrl+C trong terminal của nó, sau đó chạy trong `Soma_Fe`:

```powershell
npm run build
npm start
```

Production không biên dịch trang khi mở. Khi không cần AI cục bộ, đóng llama-server qua cửa sổ quản lý của nó và đóng tab không dùng để trả RAM cho trình duyệt/GPU. Không tắt Application Control.
