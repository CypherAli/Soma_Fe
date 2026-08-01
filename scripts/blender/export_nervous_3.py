"""Xuat scene 'Gian nao, Nhan nen & He vien' (He than kinh, dot 3).

Khong dua "Lentiform nucleus" vao export: day la ten GOP CHUNG cua Putamen +
Globus pallidus trong giai phau kinh dien (nghia la "hinh thau kinh"), Z-Anatomy
lai co san 1 mesh RIENG cho no chong len dung vi tri 2 mesh kia -> dua vao se
bi long hinh hoc (2 lop mesh trung nhau). Da ghi chu trong note cua Putamen.

    blender --background Startup.blend --python export_nervous_3.py -- <out.glb>
"""

import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from soma_export import collect, export_glb, parse_out

MESH_NAMES = [
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
    "Amygdaloid body.l", "Amygdaloid body.r",
    "Hippocampus.l", "Hippocampus.r",
    "Fornix.l", "Fornix.r",
    "Septal nuclei",
    "Habenula",
    "Stria terminalis.l", "Stria terminalis.r",
    "Stria medullaris thalami.l", "Stria medullaris thalami.r",
    "Third ventricle",
]


def main() -> None:
    out = parse_out()
    kept = collect(mesh_names=MESH_NAMES)
    export_glb(kept, out)


main()
