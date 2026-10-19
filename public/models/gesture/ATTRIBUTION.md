# Anatomical regions used by Vision AI

Derived from Z-Anatomy, the libre 3D atlas of anatomy (CC BY-SA 4.0), including BodyParts3D, The Database Center for Life Science (CC BY-SA 2.1 Japan).

Original model: Kousaku Okubo. Z-Anatomy anatomy and 3D design: Gauthier Kervyn. Additional contributors and component-specific credits/licenses are listed in the [upstream license](https://github.com/Z-Anatomy/Models-of-human-anatomy/blob/master/License.txt), including brain references, cranial nerves, and inner ear models. Preserve these upstream component notices when redistributing these assets; the atlas is not a claim that every component has identical terms.

Changes in this project: select anatomical systems, clip four regions, cap cut surfaces, export Y-up Draco GLB, classify tissues, and derive surface triangles for WonderSnap. No synthetic skin was added. Source SHA-256 and region boundaries are recorded in manifest.json. Binary surface assets under /wonder/assets/regions are derived from these GLBs.

Regenerate GLBs with scripts/blender/export_gesture_regions.py, then run:

    node --import ./scripts/ts-resolve.mjs scripts/export-wonder-regions.ts

These are educational atlas derivatives; the cut regions are display sections rather than complete clinical segmentation of every individual structure.
