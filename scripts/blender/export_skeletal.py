import bpy, os, sys

# Xuất toàn bộ scene Hệ xương trong 1 lần chạy — mỗi scene là "cô lập cơ quan"
# (mesh khép kín sẵn, không cần bisect/cap), dùng đúng kỹ thuật export_organ.py
# nhưng gộp nhiều scene vào 1 script để tránh quote tên qua CLI nhiều lần.

argv = sys.argv[sys.argv.index('--') + 1:]
out_dir = argv[0]

SCENES = {
    "skull_anatomy": [
        "Frontal bone", "Parietal bone.l", "Parietal bone.r", "Occipital bone",
        "Temporal bone.l", "Temporal bone.r", "Sphenoid bone", "Ethmoid bone",
        "Anterior cells of ethmoid bone.l", "Anterior cells of ethmoid bone.r",
        "Middle cells of ethmoid bone.l", "Middle cells of ethmoid bone.r",
        "Posterior cells of ethmoid bone.l", "Posterior cells of ethmoid bone.r",
        "Maxilla.l", "Maxilla.r", "Zygomatic bone.l", "Zygomatic bone.r",
        "Nasal bone.l", "Nasal bone.r", "Lacrimal bone.l", "Lacrimal bone.r",
        "Palatine bone.l", "Palatine bone.r", "Vomer", "Mandible", "Hyoid bone",
        "Sinus of frontal bone", "Sinus of sphenoid bone",
    ],
    "ear_ossicles": [
        "Malleus.l", "Malleus.r", "Incus.l", "Incus.r", "Stapes.l", "Stapes.r",
    ],
    "vertebral_column": [
        "Atlas (C1)", "Axis (C2)", "Vertebra C3", "Vertebra C4", "Vertebra C5",
        "Vertebra C6", "Vertebra C7",
        "Vertebra T1", "Vertebra T2", "Vertebra T3", "Vertebra T4", "Vertebra T5",
        "Vertebra T6", "Vertebra T7", "Vertebra T8", "Vertebra T9", "Vertebra T10",
        "Vertebra T11", "Vertebra T12",
        "Vertebra L1", "Vertebra L2", "Vertebra L3", "Vertebra L4", "Vertebra L5",
        "Sacrum", "Coccyx",
    ],
    "thoracic_cage": [
        "First rib.l", "First rib.r", "Second rib.l", "Second rib.r",
        "Third rib.l", "Third rib.r", "Fourth rib.l", "Fourth rib.r",
        "Fifth rib.l", "Fifth rib.r", "Sixth rib.l", "Sixth rib.r",
        "Seventh rib.l", "Seventh rib.r", "Eighth rib.l", "Eighth rib.r",
        "Ninth rib.l", "Ninth rib.r", "Tenth rib.l", "Tenth rib.r",
        "Eleventh rib.l", "Eleventh rib.r", "Twelfth rib.l", "Twelfth rib.r",
        "Costal cartilage of first rib.l", "Costal cartilage of first rib.r",
        "Costal cartilage of second rib.l", "Costal cartilage of second rib.r",
        "Costal cartilage of third rib.l", "Costal cartilage of third rib.r",
        "Costal cartilage of fourth rib.l", "Costal cartilage of fourth rib.r",
        "Costal cartilage of fifth rib.l", "Costal cartilage of fifth rib.r",
        "Costal cartilage of sixth rib.l", "Costal cartilage of sixth rib.r",
        "Costal cartilage of seventh rib.l", "Costal cartilage of seventh rib.r",
        "Costal cartilage of eighth rib.l", "Costal cartilage of eighth rib.r",
        "Costal cartilage of ninth rib.l", "Costal cartilage of ninth rib.r",
        "Costal cartilage of tenth rib.l", "Costal cartilage of tenth rib.r",
        "Manubrium of sternum", "Body of sternum", "Xiphoid process",
        "Vertebra T1", "Vertebra T2", "Vertebra T3", "Vertebra T4", "Vertebra T5",
        "Vertebra T6", "Vertebra T7", "Vertebra T8", "Vertebra T9", "Vertebra T10",
        "Vertebra T11", "Vertebra T12",
    ],
    "pelvis_anatomy": [
        "Hip bone.l", "Hip bone.r", "Sacrum", "Coccyx",
    ],
    "shoulder_upper_limb": [
        "Clavicle.l", "Clavicle.r", "Scapula.l", "Scapula.r",
        "Humerus.l", "Humerus.r", "Radius.l", "Radius.r", "Ulna.l", "Ulna.r",
    ],
    "hand_bones": [
        "Scaphoid bone.l", "Scaphoid bone.r", "Lunate bone.l", "Lunate bone.r",
        "Triquetrum bone.l", "Triquetrum bone.r", "Pisiform bone.l", "Pisiform bone.r",
        "Trapezium bone.l", "Trapezium bone.r", "Trapezoid bone.l", "Trapezoid bone.r",
        "Capitate bone.l", "Capitate bone.r", "Hamate bone.l", "Hamate bone.r",
        "First metacarpal bone.l", "First metacarpal bone.r",
        "Second metacarpal bone.l", "Second metacarpal bone.r",
        "Third metacarpal bone.l", "Third metacarpal bone.r",
        "Fourth metacarpal bone.l", "Fourth metacarpal bone.r",
        "Fifth metacarpal bone.l", "Fifth metacarpal bone.r",
        "Proximal phalanx of first finger of hand.l", "Proximal phalanx of first finger of hand.r",
        "Distal phalanx of first finger of hand.l", "Distal phalanx of first finger of hand.r",
        "Proximal phalanx of second finger of hand.l", "Proximal phalanx of second finger of hand.r",
        "Middle phalanx of second finger of hand.l", "Middle phalanx of second finger of hand.r",
        "Distal phalanx of second finger of hand.l", "Distal phalanx of second finger of hand.r",
        "Proximal phalanx of third finger of hand.l", "Proximal phalanx of third finger of hand.r",
        "Middle phalanx of third finger of hand.l", "Middle phalanx of third finger of hand.r",
        "Distal phalanx of third finger of hand.l", "Distal phalanx of third finger of hand.r",
        "Proximal phalanx of fourth finger of hand.l", "Proximal phalanx of fourth finger of hand.r",
        "Middle phalanx of fourth finger of hand.l", "Middle phalanx of fourth finger of hand.r",
        "Distal phalanx of fourth finger of hand.l", "Distal phalanx of fourth finger of hand.r",
        "Proximal phalanx of fifth finger of hand.l", "Proximal phalanx of fifth finger of hand.r",
        "Middle phalanx of fifth finger of hand.l", "Middle phalanx of fifth finger of hand.r",
        "Distal phalanx of fifth finger of hand.l", "Distal phalanx of fifth finger of hand.r",
    ],
    "lower_limb_bones": [
        "Femur.l", "Femur.r", "Patella.l", "Patella.r",
        "Tibia.l", "Tibia.r", "Fibula.l", "Fibula.r",
    ],
    "foot_bones": [
        "Talus.l", "Talus.r", "Calcaneus.l", "Calcaneus.r",
        "Navicular bone.l", "Navicular bone.r", "Cuboid bone.l", "Cuboid bone.r",
        "Medial cuneiform bone.l", "Medial cuneiform bone.r",
        "Intermediate cuneiform bone.l", "Intermediate cuneiform bone.r",
        "Lateral cuneiform bone.l", "Lateral cuneiform bone.r",
        "Sesamoid bones of foot.l", "Sesamoid bones of foot.r",
        "First metatarsal bone.l", "First metatarsal bone.r",
        "Second metatarsal bone.l", "Second metatarsal bone.r",
        "Third metatarsal bone.l", "Third metatarsal bone.r",
        "Fourth metatarsal bone.l", "Fourth metatarsal bone.r",
        "Fifth metatarsal bone.l", "Fifth metatarsal bone.r",
        "Proximal phalanx of first finger of foot.l", "Proximal phalanx of first finger of foot.r",
        "Distal phalanx of first finger of foot.l", "Distal phalanx of first finger of foot.r",
        "Proximal phalanx of second finger of foot.l", "Proximal phalanx of second finger of foot.r",
        "Middle phalanx of second finger of foot.l", "Middle phalanx of second finger of foot.r",
        "Distal phalanx of second finger of foot.l", "Distal phalanx of second finger of foot.r",
        "Proximal phalanx of third finger of foot.l", "Proximal phalanx of third finger of foot.r",
        "Middle phalanx of third finger of foot.l", "Middle phalanx of third finger of foot.r",
        "Distal phalanx of third finger of foot.l", "Distal phalanx of third finger of foot.r",
        "Proximal phalanx of fourth finger of foot.l", "Proximal phalanx of fourth finger of foot.r",
        "Middle phalanx of fourth finger of foot.l", "Middle phalanx of fourth finger of foot.r",
        "Distal phalanx of fourth finger of foot.l", "Distal phalanx of fourth finger of foot.r",
        "Proximal phalanx of fifth finger of foot.l", "Proximal phalanx of fifth finger of foot.r",
        "Middle phalanx of fifth finger of foot.l", "Middle phalanx of fifth finger of foot.r",
        "Distal phalanx of fifth finger of foot.l", "Distal phalanx of fifth finger of foot.r",
    ],
    "dentition": [
        "Upper medial incisor.l", "Upper medial incisor.r",
        "Upper lateral incisor.l", "Upper lateral incisor.r",
        "Upper canine.l", "Upper canine.r",
        "Upper first premolar.l", "Upper first premolar.r",
        "Upper second premolar.l", "Upper second premolar.r",
        "Upper first molar tooth.l", "Upper first molar tooth.r",
        "Upper second molar tooth.l", "Upper second molar tooth.r",
        "Lower medial incisor.l", "Lower medial incisor.r",
        "Lower lateral incisor.l", "Lower lateral incisor.r",
        "Lower canine.l", "Lower canine.r",
        "Lower first premolar.l", "Lower first premolar.r",
        "Lower second premolar.l", "Lower second premolar.r",
        "Lower first molar tooth.l", "Lower first molar tooth.r",
        "Lower second molar tooth.l", "Lower second molar tooth.r",
        "Mandible", "Maxilla.l", "Maxilla.r",
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
