"""Xuat scene 'Tieu nao' (He than kinh, dot 2).

    blender --background Startup.blend --python export_nervous_2.py -- <out.glb>
"""

import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from soma_export import collect, export_glb, parse_out

MESH_NAMES = [
    # Thuy truoc (anterior lobe)
    "Lingula of cerebellum", "Central lobule", "Wing of central lobule.l", "Wing of central lobule.r",
    "Culmen", "Anterior quadrangular lobule.l", "Anterior quadrangular lobule.r",
    # Thuy sau (posterior lobe)
    "Posterior quadrangular lobule.l", "Posterior quadrangular lobule.r",
    "Declive", "Folium of vermis", "Tuber of vermis", "Pyramis of vermis", "Uvula of vermis",
    "Superior semilunar lobule.l", "Superior semilunar lobule.r",
    "Inferior semilunar lobule.l", "Inferior semilunar lobule.r",
    "Gracile lobule.l", "Gracile lobule.r",
    "Biventral lobule.l", "Biventral lobule.r",
    "Tonsil of cerebellum.l", "Tonsil of cerebellum.r",
    # Thuy noc-cang (flocculonodular lobe)
    "Nodule of vermis", "Flocculus.l", "Flocculus.r",
    "Peduncle of flocculus.l", "Peduncle of flocculus.r",
    # Cuong tieu nao tren (fiber tract, khong phai thuy)
    "Superior cerebellar peduncle.l", "Superior cerebellar peduncle.r",
    # Rai não bề mặt (khe/rãnh) - giữ để thấy ranh giới thuỳ tự nhiên
    "Lat_Fis-ant-Horizont.l", "Lat_Fis-ant-Horizont.r",
    "Lat_Fis-ant-Vertical.l", "Lat_Fis-ant-Vertical.r",
    "Lat_Fis-post.l", "Lat_Fis-post.r",
    "Sulcus interm_prim-Jensen.l", "Sulcus interm_prim-Jensen.r",
]


def main() -> None:
    out = parse_out()
    kept = collect(mesh_names=MESH_NAMES)
    export_glb(kept, out)


main()
