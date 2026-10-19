# Kiểm tra chất lượng mô hình — 07/10/2026

Dùng cùng atlas đóng gói với /viewer. Không giảm lưới thêm khi xuất vùng. Gói nguồn đã qua meshoptimizer; không có texture/UV mô thật để phục hồi. Vật liệu bổ sung chỉ giúp đọc hình khối.

## Bàn tay và cổ tay

- 106 cấu trúc nguồn mỗi vùng; chọn cấu trúc riêng được.
- Giữ nguyên tam giác nguồn của 14 đốt ngón và 8 xương cổ tay.
- Cổ tay giữ bàn tay và đoạn cuối cẳng tay làm ngữ cảnh; không cắt xuyên nền bàn tay như trước.
- Mặt cắt kỹ thuật có màu nâu riêng; triangulation giữ lỗ bên trong. Chỉ đóng contour khép kín.
- Không có cấu trúc thần kinh được phân loại nervous trong hai vùng; sensory không đồng nghĩa dây thần kinh ngoại biên. Không tự tạo mô hình dây thần kinh hoặc gân riêng nếu nguồn gộp vào cơ.

## Các vùng khác

Màu nguồn giữ nguyên. Vật liệu theo hệ, chế độ quan sát và mặt cắt được áp dụng chung. Các vùng ngoài mẫu bàn tay/cổ tay vẫn cần nghiệm thu phạm vi và giải phẫu riêng.

| Vùng | Cấu trúc | Tam giác (gồm mặt cắt) | Contour đóng | Contour chưa giải quyết |
|---|---:|---:|---:|---:|
| arm | 56 | 24612 | 58 | 8 |
| body | 2234 | 2288268 | 0 | 0 |
| brain | 144 | 213438 | 1 | 0 |
| bust | 1620 | 1704060 | 141 | 8 |
| ear | 1 | 1350 | 0 | 0 |
| eye | 11 | 44698 | 0 | 0 |
| fingers | 101 | 45736 | 34 | 0 |
| forearm | 58 | 31979 | 64 | 4 |
| gut | 65 | 40274 | 0 | 0 |
| hand | 106 | 50834 | 34 | 0 |
| head | 551 | 668924 | 77 | 0 |
| heart | 18 | 38778 | 0 | 0 |
| index-finger | 10 | 2750 | 1 | 0 |
| kidney | 2 | 2992 | 0 | 0 |
| little-finger | 10 | 3112 | 0 | 0 |
| liver | 9 | 7419 | 0 | 0 |
| lungs | 6 | 15098 | 0 | 0 |
| middle-finger | 7 | 2186 | 0 | 0 |
| muscles | 402 | 656120 | 0 | 0 |
| neck | 216 | 171862 | 231 | 21 |
| pancreas | 17 | 14354 | 0 | 0 |
| ring-finger | 7 | 1912 | 0 | 0 |
| skeleton | 296 | 338056 | 0 | 0 |
| skull | 67 | 102848 | 12 | 0 |
| stomach | 1 | 1686 | 0 | 0 |
| thorax | 1062 | 942337 | 268 | 8 |
| thumb | 14 | 5486 | 5 | 0 |
| tooth | 1 | 1606 | 0 | 0 |
| upper-limb | 152 | 91883 | 32 | 16 |
| wrist | 106 | 53506 | 32 | 0 |

## Kiểm tra

`node scripts/test-inspection-quality.mjs` kiểm tra hướng normals mặt cắt, lỗ contour, xương nhỏ nguyên vẹn, không trộn bên phải và bộ lọc hệ. `node --import ./scripts/ts-resolve.mjs scripts/test-wonder-regions.mjs` kiểm tra tất cả 30 mô hình, màu nguồn, normals, dữ liệu hữu hạn và các hệ tách không đè nhau ở góc trước.

Không xác nhận 98/100: chưa có nghiệm thu giải phẫu bởi chuyên môn hoặc phép đo webcam thực tế trên máy người dùng.

## Cập nhật camera và cấu trúc chi tiết 07/10/2026
Camera stream được giữ độc lập với phần tử video ở Quét. Chuyển Điều khiển mượn cùng stream; quay lại Quét gắn stream vào video mới. Test xác nhận quyền sở hữu và ánh xạ; chưa kiểm chứng webcam thật trong môi trường trình duyệt tự động.
Đầu/cổ đổi từ group theo hệ sang 551/216 nhóm cấu trúc nguồn. Nhãn rất nhỏ không bị bỏ chỉ vì hạt hiệu ứng không lấy mẫu. Đầu/cổ khi tách lớp vẫn theo hệ để giữ liên hệ giải phẫu.
70 cấu trúc trong các vùng có ghi chú được nối bằng đúng một mã FJ với tài nguyên scene có sẵn; tên gốc và mã nguồn vẫn giữ. Ô tìm kiếm hỗ trợ tên tiếng Việt không dấu, tên gốc, Latin và mã FJ. Không khẳng định mọi cấu trúc đã được dịch hoặc có mô tả.
Không có thêm texture/micro-detail mới: đây là tăng khả năng kiểm tra dữ liệu mesh nguồn, không tạo thêm dữ liệu giải phẫu.

## Cập nhật chọn bề mặt và ghi chú nhóm 07/10/2026
Cánh tay/cẳng tay/toàn bộ chi trên lần lượt có 56/58/151 nhóm cấu trúc riêng; giữ theo hệ khi tách. Dữ liệu bề mặt vẫn là mesh gốc đã đóng mặt cắt, không thêm texture giả.
Nhấp chuột trên mô hình đặc dùng raycast vào bề mặt đang nhìn thấy, bỏ mesh ẩn và vùng mặt cắt bị loại. Cử chỉ trỏ tay vẫn chọn theo anchor hiện tại.
Metadata có 118 ghi chú ánh xạ đúng một mã nguồn và ghi chú nhóm được tách riêng trong bảng mở rộng. Có 18 tên đối xứng tái dùng khi atlas chỉ có đúng cặp trái/phải cùng tên chuẩn hóa. Không sao chép ghi chú một bên sang bên kia.
Kiểm tra test-wonder-label-provenance.mjs đối chiếu 118 ghi chú cá thể và 2410 liên kết ghi chú nhóm với mã nguồn thực trong các scene. Số liên kết có thể lặp giữa nhiều vùng; không phải 2410 cấu trúc độc lập mới.
