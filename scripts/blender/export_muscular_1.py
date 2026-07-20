import bpy, os, sys

argv = sys.argv[sys.argv.index('--') + 1:]
out_dir = argv[0]

SCENES = {
    "facial_muscles": [
        "Frontalis muscle.l", "Frontalis muscle.r",
        "Orbital part of orbicularis oculi.l", "Orbital part of orbicularis oculi.r",
        "Palpebral part of orbicularis oculi.l", "Palpebral part of orbicularis oculi.r",
        "Corrugator supercilii.l", "Corrugator supercilii.r",
        "Procerus muscle.l", "Procerus muscle.r",
        "Nasalis muscle.l", "Nasalis muscle.r",
        "Depressor septi nasi.l", "Depressor septi nasi.r",
        "Orbicularis oris muscle.l", "Orbicularis oris muscle.r",
        "Levator labii superioris.l", "Levator labii superioris.r",
        "Levator anguli oris.l", "Levator anguli oris.r",
        "Zygomaticus major muscle.l", "Zygomaticus major muscle.r",
        "Zygomaticus minor muscle.l", "Zygomaticus minor muscle.r",
        "Risorius muscle.l", "Risorius muscle.r",
        "Depressor anguli oris.l", "Depressor anguli oris.r",
        "Depressor labii inferioris.l", "Depressor labii inferioris.r",
        "Mentalis muscle.l", "Mentalis muscle.r",
        "Bucinator.l", "Bucinator.r",
        "Platysma.l", "Platysma.r",
        "Temporoparietalis muscle.l", "Temporoparietalis muscle.r",
        # Xương nền làm mốc tham chiếu điểm bám của các cơ mặt vùng dưới.
        # Thiếu mesh này thì nhãn "Xương hàm dưới (nền)" trong scene co-mat
        # không khớp được với vật thể nào (phát hiện qua verify-scenes.mjs).
        "Mandible",
    ],
    "thigh_gluteal_muscles": [
        "Gluteus maximus muscle.l", "Gluteus maximus muscle.r",
        "Gluteus medius muscle.l", "Gluteus medius muscle.r",
        "Gluteus minimus muscle.l", "Gluteus minimus muscle.r",
        "Iliacus muscle.l", "Iliacus muscle.r",
        "Psoas major.l", "Psoas major.r",
        "Rectus femoris muscle.l", "Rectus femoris muscle.r",
        "Vastus lateralis muscle.l", "Vastus lateralis muscle.r",
        "Vastus medialis muscle.l", "Vastus medialis muscle.r",
        "Vastus intermedius muscle.l", "Vastus intermedius muscle.r",
        "Sartorius muscle.l", "Sartorius muscle.r",
        "Gracilis muscle.l", "Gracilis muscle.r",
        "Pectineus muscle.l", "Pectineus muscle.r",
        "Adductor brevis.l", "Adductor brevis.r",
        "Adductor longus.l", "Adductor longus.r",
        "Adductor magnus.l", "Adductor magnus.r",
        "Tensor fasciae latae.l", "Tensor fasciae latae.r",
        "Long head of biceps femoris.l", "Long head of biceps femoris.r",
        "Short head of biceps femoris.l", "Short head of biceps femoris.r",
        "Semitendinosus muscle.l", "Semitendinosus muscle.r",
        "Semimembranosus muscle.l", "Semimembranosus muscle.r",
        "Femur.l", "Femur.r", "Hip bone.l", "Hip bone.r",
    ],
    "arm_muscles": [
        "Long head of biceps brachii.l", "Long head of biceps brachii.r",
        "Short head of biceps brachii.l", "Short head of biceps brachii.r",
        "Long head of triceps brachii.l", "Long head of triceps brachii.r",
        "Lateral head of triceps brachii.l", "Lateral head of triceps brachii.r",
        "Medial head of triceps brachii.l", "Medial head of triceps brachii.r",
        "Brachialis muscle.l", "Brachialis muscle.r",
        "Brachioradialis muscle.l", "Brachioradialis muscle.r",
        "Coracobrachialis muscle.l", "Coracobrachialis muscle.r",
        "Humerus.l", "Humerus.r", "Radius.l", "Radius.r", "Ulna.l", "Ulna.r",
    ],
    "abdominal_wall_muscles": [
        "Rectus abdominis muscle.l", "Rectus abdominis muscle.r",
        "External abdominal oblique muscle.l", "External abdominal oblique muscle.r",
        "Internal abdominal oblique muscle.l", "Internal abdominal oblique muscle.r",
        "Transversus abdominis muscle.l", "Transversus abdominis muscle.r",
        "Pyramidalis muscle.l", "Pyramidalis muscle.r",
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
