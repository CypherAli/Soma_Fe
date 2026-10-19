# BodyParts3D sections used by WonderSnap

Fifteen runtime selections are derived directly from `/human-atlas/atlas.json` and the packed chunks used by `/viewer`. The four head/neck/upper-body selections do not use the older Z-Anatomy GLBs in `/models/gesture`.

Upper-limb selections use the left side in atlas coordinates. Wrist and hand regions retain the original carpal bones, metacarpals, phalanges and available soft tissues. Individual finger selections are filtered by original anatomical part names and grouped per part, preserving the two thumb phalanges and three phalanges of each other finger. Only closed intersection contours receive technical caps; open/non-manifold source contours remain reported; no joint articulation or animated flexion is implied.

The lung and liver selections use the project's existing `/models/lung_anatomy.glb` and `/models/liver_anatomy.glb`, retaining original part names and smooth normals. They supply the organ surfaces absent from the packed atlas. Their metadata records those actual source paths; they are not attributed to the packed atlas.

BodyParts3D, © The Database Center for Life Science, CC Attribution 4.0 International. See the complete dataset attribution at [/human-atlas/ATTRIBUTION.md](/human-atlas/ATTRIBUTION.md).

Project adaptations: clipping head, neck, thorax and upper body regions; interpolating and normalizing original vertex normals at cut boundaries; grouping by the original atlas system; copying the atlas SYSTEMS palette; gzip surface buffers for local loading. Original part identifiers, source manifest SHA-256, region bounds, and output geometry SHA-256 are retained in each region JSON.

Rebuild with `node --import ./scripts/ts-resolve.mjs scripts/export-wonder-atlas-regions.mjs`, then `node --import ./scripts/ts-resolve.mjs scripts/export-wonder-organ-surfaces.mjs`. Do not run the historical Z-Anatomy exporters or `record-gesture-assets.mjs` over these files.

The display uses Three.js (MIT; license in /wonder/vendor/THREE-LICENSE.txt), the viewer's PBR material, room environment, hemisphere/key/rim lights, sRGB output and ACES tone mapping. Exposure is adjusted for the larger model on the webcam stage. Technical caps are marked separately; unresolved source contours remain open; no invented skin or anatomy is added.

## Higher-detail source subsets (2026-10-07)

Arm, forearm, upper limb, wrist, hand, all finger selections, head and neck now use the official BodyParts3D 4.0 ISA OBJ archive (99), without the additional meshopt simplification applied to the packed viewer atlas. This archive is itself a polygon-reduced official dataset; it has no tissue textures. Names, IDs, coordinate transform and system colors still come from the project atlas.

Source: https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_BP3D_4.0_obj_99.zip

BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International. License: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html

Each subset records the archive SHA-256, original/packed triangle counts and unresolved source contours. To reproduce, set WONDER_OBJ_ZIP to the locally downloaded official archive and pass explicit region IDs to export-wonder-atlas-regions.mjs, then run enrich-wonder-labels.mjs. The archive is a build input under .cache, not a runtime download.
