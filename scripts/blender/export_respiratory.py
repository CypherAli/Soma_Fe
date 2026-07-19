import bpy, os, sys

# Xuất scene Hệ hô hấp — "cô lập cơ quan" (mesh khép kín sẵn, không bisect/cap),
# cùng pattern export_skeletal.py: gộp nhiều scene trong 1 lần chạy Blender.

argv = sys.argv[sys.argv.index('--') + 1:]
out_dir = argv[0]

SCENES = {
    # Phổi: 5 thuỳ thật (trái 2, phải 3) + khí quản làm đường dẫn khí trung tâm.
    "lung_anatomy": [
        "Superior lobe of left lung", "Inferior lobe of left lung",
        "Superior lobe of right lung", "Middle lobe of right lung",
        "Inferior lobe of right lung",
        "Trachea",
    ],
    # Thanh quản: khung sụn + nắp thanh môn + các cơ nội tại thanh quản.
    "larynx_anatomy": [
        "Thyroid cartilage", "Cricoid cartilage",
        "Arytenoid cartilage.l", "Arytenoid cartilage.r", "Epiglottis",
        "Posterior crico-arytenoid muscle.l", "Posterior crico-arytenoid muscle.r",
        "Lateral crico-arytenoid muscle.l", "Lateral crico-arytenoid muscle.r",
        "Transverse arytenoid muscle",
        "External part of thyro-arytenoid muscle.l", "External part of thyro-arytenoid muscle.r",
        "Thyro-epiglottic part of thyro-arytenoid muscle.l", "Thyro-epiglottic part of thyro-arytenoid muscle.r",
        "Ary-epiglottic part of oblique arytenoid muscle.l", "Ary-epiglottic part of oblique arytenoid muscle.r",
    ],
    # Cơ hoành: cơ hô hấp chính, hình vòm ngăn ngực-bụng.
    "diaphragm": [
        "Diaphragm",
    ],
}

for scene_name, names in SCENES.items():
    kept = []
    missing = []
    for nm in names:
        o = bpy.data.objects.get(nm)
        if not o or o.type != 'MESH':
            missing.append(nm)
            continue
        kept.append(o)

    for o in bpy.data.objects:
        try:
            o.select_set(False)
        except Exception:
            pass

    for o in kept:
        o.hide_viewport = False
        try:
            o.hide_set(False)
        except Exception:
            pass
        o.select_set(True)

    out_path = os.path.join(out_dir, scene_name + ".glb")
    total_tris = sum(len(o.data.polygons) for o in kept)
    print(f"SCENE {scene_name} kept={len(kept)} missing={len(missing)} tris={total_tris}")
    if missing:
        print(f"  MISSING: {missing}")
    bpy.ops.export_scene.gltf(filepath=out_path, export_format='GLB', use_selection=True,
        export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
        export_apply=False, export_yup=True)
    print(f"  DONE {out_path}")

print("ALL SCENES DONE")
