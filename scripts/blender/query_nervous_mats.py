"""In tên material của 1 danh sách object cụ thể (scene Thân não + Dây TK sọ)."""

import bpy

NAMES = [
    "Midbrain.l", "Midbrain.r", "Pons.l", "Pons.r",
    "Medulla oblongata.l", "Medulla oblongata.r",
    "Pyramid of medulla oblongata.l", "Pyramid of medulla oblongata.r",
    "Olive.l", "Olive.r", "Base of peduncle.l", "Base of peduncle.r",
    "Interpeduncular fossa.l", "Interpeduncular fossa.r",
    "Aqueduct of midbrain", "Fourth ventricle",
    "Red nucleus.l", "Red nucleus.r",
    "Superior colliculus.l", "Superior colliculus.r",
    "Inferior colliculus.l", "Inferior colliculus.r",
    "Accessory nucleus of oculomotor nerve.l", "Accessory nucleus of oculomotor nerve.r",
    "Nucleus of oculomotor nerve.l", "Nucleus of oculomotor nerve.r",
    "Nucleus of trochlear nerve.l", "Nucleus of trochlear nerve.r",
    "Motor root of trigeminal nerve.l", "Motor root of trigeminal nerve.r",
    "Sensory root of trigeminal nerve.l", "Sensory root of trigeminal nerve.r",
    "Nucleus of abducens nerve.l", "Nucleus of abducens nerve.r",
    "Motor nucleus of facial nerve.l", "Motor nucleus of facial nerve.r",
    "Superior salivatory nucleus.l", "Superior salivatory nucleus.r",
    "Inferior salivatory nucleus.l", "Inferior salivatory nucleus.r",
    "Anterior cochlear nucleus.l", "Anterior cochlear nucleus.r",
    "Posterior cochlear nucleus.l", "Posterior cochlear nucleus.r",
    "Vestibular nuclei.l", "Vestibular nuclei.r",
    "Nucleus ambiguus.l", "Nucleus ambiguus.r",
    "Posterior nucleus of vagus nerve.l", "Posterior nucleus of vagus nerve.r",
    "Nucleus of accessory nerve.l", "Nucleus of accessory nerve.r",
    "Nucleus of hypoglossal nerve.l", "Nucleus of hypoglossal nerve.r",
    "Cochlear nerve",
]

CURVES = [
    "Olfactory nerve (I).l", "Olfactory nerve (I).r",
    "Optic nerve (II).l", "Optic nerve (II).r",
    "Oculomotor nerve (III).l", "Oculomotor nerve (III).r",
    "Trochlear nerve (IV).l", "Trochlear nerve (IV).r",
    "Trigeminal nerve (V).l", "Trigeminal nerve (V).r",
    "Abducens nerve (VI).l", "Abducens nerve (VI).r",
    "Facial nerve (VII).l", "Facial nerve (VII).r",
    "Vestibulocochlear nerve (VIII).l", "Vestibulocochlear nerve (VIII).r",
    "Vestibular nerve.l", "Vestibular nerve.r",
    "Cochlear nerve.l",
    "Glossopharyngeal nerve (IX).l", "Glossopharyngeal nerve (IX).r",
    "Vagus nerve (X).l", "Vagus nerve (X).r",
    "Accessory nerve (XI).l", "Accessory nerve (XI).r",
    "Hypoglossal nerve (XII).l", "Hypoglossal nerve (XII).r",
]


def mat_names(obj):
    return [s.material.name if s.material else "?" for s in obj.material_slots] or ["(none)"]


def main():
    print("--- MESH ---")
    for n in NAMES:
        obj = bpy.data.objects.get(n)
        if obj is None:
            print("MISSING", n)
        else:
            print(n, "->", mat_names(obj))
    print("--- CURVE ---")
    for n in CURVES:
        obj = bpy.data.objects.get(n)
        if obj is None:
            print("MISSING", n)
        else:
            print(n, "->", mat_names(obj), "bevel", obj.data.bevel_depth)


main()
