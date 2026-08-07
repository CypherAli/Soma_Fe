# Blender export pipeline

Xuất từng hệ cơ quan từ Z-Anatomy (`Startup.blend`) ra glTF nén Draco cho web.

```bash
BLENDER="C:/Program Files/Blender Foundation/Blender 5.1/blender.exe"
"$BLENDER" --background "Startup.blend" \
  --python scripts/blender/export_system.py -- "5: Cardiovascular system" "public/models/cardiovascular.glb"
```

- Giữ nguyên tên mesh (tên giải phẫu), nén Draco level 6.
- Nguồn model: Z-Anatomy (CC-BY-SA) — không commit file .blend (nặng).

## Bù dữ liệu thiếu từ BodyParts3D

Z-Anatomy không có **hồi tràng, manh tràng, trực tràng** — ruột đứt đoạn giữa
hỗng tràng và đại tràng lên. Ba đoạn này lấy từ **BodyParts3D** (Database Center
for Life Science, **CC BY-SA 2.1 JP**), giữ nguyên trong file riêng
`public/models/visceral_gut_bp3d.glb` để truy được nguồn và giấy phép.

```bash
"$BLENDER" --background "Startup.blend" \
  --python scripts/blender/import_bp3d_gut.py -- <thư_mục_obj_bp3d> public/models/visceral_gut_bp3d.glb
```

Căn khớp **đo được**, không chỉnh tay: hai bộ dữ liệu cùng tỉ lệ (chỉ đổi
mm→m), lệch gốc `X ≈ 0 · Y ≈ +0,101 · Z ≈ +0,064` (mét). Đo trên 4 tạng có ở cả
hai nguồn (dạ dày, gan, tá tràng, đại tràng lên), bốn mốc lệch nhau tối đa 7mm.
Script tự đo lại mỗi lần chạy và cảnh báo nếu các mốc không đồng thuận.

`query_coverage.py` đếm xem mỗi bộ lọc của `export_region.py` loại mất bao nhiêu
object — dùng khi một hệ ra ít cấu trúc hơn hẳn số có trong Startup.blend.
