"""In ten material cua danh sach object Tieu nao (scene 2)."""

import bpy

NAMES = [
    "Anterior quadrangular lobule.l", "Anterior quadrangular lobule.r",
    "Posterior quadrangular lobule.l", "Posterior quadrangular lobule.r",
    "Biventral lobule.l", "Biventral lobule.r",
    "Gracile lobule.l", "Gracile lobule.r",
    "Inferior semilunar lobule.l", "Inferior semilunar lobule.r",
    "Superior semilunar lobule.l", "Superior semilunar lobule.r",
    "Tonsil of cerebellum.l", "Tonsil of cerebellum.r",
    "Flocculus.l", "Flocculus.r",
    "Peduncle of flocculus.l", "Peduncle of flocculus.r",
    "Wing of central lobule.l", "Wing of central lobule.r",
    "Superior cerebellar peduncle.l", "Superior cerebellar peduncle.r",
    "Lat_Fis-ant-Horizont.l", "Lat_Fis-ant-Horizont.r",
    "Lat_Fis-ant-Vertical.l", "Lat_Fis-ant-Vertical.r",
    "Lat_Fis-post.l", "Lat_Fis-post.r",
    "Sulcus interm_prim-Jensen.l", "Sulcus interm_prim-Jensen.r",
    "Central lobule", "Culmen", "Declive",
    "Folium of vermis", "Nodule of vermis", "Pyramis of vermis",
    "Tuber of vermis", "Uvula of vermis", "Lingula of cerebellum",
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
