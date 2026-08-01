"""Xuất scene 'Than nao & 12 doi day than kinh so' (He than kinh, dot 1).

    blender --background Startup.blend --python export_nervous_1.py -- <out.glb>
"""

import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from soma_export import collect, export_glb, parse_out

MESH_NAMES = [
    "Midbrain.l", "Midbrain.r",
    "Pons.l", "Pons.r",
    "Medulla oblongata.l", "Medulla oblongata.r",
    "Pyramid of medulla oblongata.l", "Pyramid of medulla oblongata.r",
    "Olive.l", "Olive.r",
    "Base of peduncle.l", "Base of peduncle.r",
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

CURVE_NAMES = [
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


def main() -> None:
    out = parse_out()
    kept = collect(mesh_names=MESH_NAMES, curve_names=CURVE_NAMES)
    export_glb(kept, out)


main()
