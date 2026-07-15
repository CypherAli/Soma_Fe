# Blender export pipeline

Xuất từng hệ cơ quan từ Z-Anatomy (`Startup.blend`) ra glTF nén Draco cho web.

```bash
BLENDER="C:/Program Files/Blender Foundation/Blender 5.1/blender.exe"
"$BLENDER" --background "Startup.blend" \
  --python scripts/blender/export_system.py -- "5: Cardiovascular system" "public/models/cardiovascular.glb"
```

- Giữ nguyên tên mesh (tên giải phẫu), nén Draco level 6.
- Nguồn model: Z-Anatomy (CC-BY-SA) — không commit file .blend (nặng).
