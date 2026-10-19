# Nâng chi tiết nguồn — 2026-10-07

13 vùng dùng OBJ chính thức BodyParts3D 4.0 ISA (99), không giản lược meshopt thêm. Màu, tên gốc, ID và trục tọa độ giữ theo atlas dự án. Archive đã giảm polygon ở nhà cung cấp và không có texture mô thật. Thân trên/bán thân và các vùng khác vẫn dùng nguồn hiện có.

| Vùng | Cấu trúc | Tam giác gồm mặt cắt | Biên nguồn chưa khép |
|---|---:|---:|---:|
| arm | 56 | 78773 | 8 |
| forearm | 58 | 108792 | 4 |
| upper-limb | 151 | 278283 | 14 |
| hand | 106 | 134634 | 0 |
| wrist | 106 | 143532 | 0 |
| fingers | 101 | 116872 | 0 |
| thumb | 14 | 8884 | 0 |
| index-finger | 10 | 5842 | 0 |
| middle-finger | 7 | 4202 | 0 |
| ring-finger | 7 | 3584 | 0 |
| little-finger | 10 | 6308 | 0 |
| head | 551 | 1717720 | 0 |
| neck | 216 | 437355 | 22 |

Bàn tay: 50.834 → 134.634 tam giác. Cổ tay: 53.506 → 143.532. Giữ trọn 14 đốt ngón và 8 xương cổ tay. WebGL2 bật khử răng cưa, DPR tối đa desktop 2/mobile 1.5.

Tag có từ điển tên cơ chi trên, giữ tên English và ID; mô tả riêng chỉ từ cảnh có đúng một ID, ghi chú nhóm vẫn ghi rõ phạm vi nhóm. Không tự tạo chức năng/bám tận/chi phối chưa có nguồn. Tìm không dấu hỗ trợ đ → d.

## Tái tạo

Trong Soma_Fe: đặt WONDER_OBJ_ZIP=.cache/bodyparts3d/isa_BP3D_4.0_obj_99.zip. Chạy node --experimental-strip-types scripts/export-wonder-atlas-regions.mjs với 13 ID trong bảng, rồi node scripts/enrich-wonder-labels.mjs. Archive là đầu vào build, không tải trong runtime. Không ghi đè các vùng bằng exporter packed mặc định. Manifest ghi archive SHA-256 và số sourceTriangles/packedTriangles.

## Nghiệm thu webcam thật

Trình duyệt kiểm tra không có webcam. Test ownership không thay cho nghiệm thu camera thật. Trên máy người dùng: bật Quét → chọn kết quả → Điều khiển: camera tiếp tục sáng, mô hình hiện ngay, không yêu cầu bật lại. Trở về Quét: preview tiếp tục. Đưa tay trái/phải: mốc bám đúng và không phản chiếu hai lần. Xoay/mở tay liên tục 30 giây, ghi inference/FPS khi camera bật. Không kết luận từ FPS camera tắt.

Nguồn: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/data-7.html
License: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html

## Kết quả kiểm tra

Build thành công; lint tệp thay đổi sạch; lint toàn dự án vẫn 34 errors/969 warnings như baseline. verify:scenes: 1.310 hotspot khớp node thật. 30 mô hình vượt kiểm tra asset/hình học/particle budget. Test source xác minh hash archive, face count và normal index của 809 OBJ; kiểm tra chọn mặt/che khuất, tag đúng ID, phản chiếu camera và ownership Scan–Control đều qua. Đã quan sát bàn tay và đầu trên /en/cu-chi. Không nghiệm thu webcam thật.
