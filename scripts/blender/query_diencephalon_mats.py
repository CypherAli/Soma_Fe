"""In ten material danh sach object Gian nao + Nhan nen + He vien (scene 3)."""

import bpy

NAMES = [
    "Thalamus.l", "Thalamus.r",
    "Hypothalamus",
    "Mamillary body.l", "Mamillary body.r",
    "Optic chiasm.l", "Optic chiasm.r",
    "Optic tract.l", "Optic tract.r",
    "Lateral geniculate body.l", "Lateral geniculate body.r",
    "Medial geniculate body.l", "Medial geniculate body.r",
    "Caudate nucleus.l", "Caudate nucleus.r",
    "Putamen.l", "Putamen.r",
    "Globus pallidus.l", "Globus pallidus.r",
    "Lentiform nucleus.l", "Lentiform nucleus.r",
    "Amygdaloid body.l", "Amygdaloid body.r",
    "Hippocampus.l", "Hippocampus.r",
    "Fornix.l", "Fornix.r",
    "Septal nuclei",
    "Habenula",
    "Stria terminalis.l", "Stria terminalis.r",
    "Stria medullaris thalami.l", "Stria medullaris thalami.r",
    "Third ventricle",
]


def mat_names(obj):
    return [s.material.name if s.material else "?" for s in obj.material_slots] or ["(none)"]


def main():
    for n in NAMES:
        obj = bpy.data.objects.get(n)
        if obj is None:
            print("MISSING", n)
        else:
            print(n, "->", mat_names(obj), "verts", len(obj.data.vertices))


main()
