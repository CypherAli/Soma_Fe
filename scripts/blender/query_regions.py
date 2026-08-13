import bpy, collections

sysmap = {}
for col in bpy.data.collections:
    if col.name[:1].isdigit():
        for o in col.all_objects:
            sysmap.setdefault(o.name, col.name)

# Các vùng cơ thể ứng viên cho model "nhiều lớp"
CANDIDATES = [
    "Right lower limb", "Left lower limb", "Right upper limb",
    "Head", "Neck", "Trunk", "Thorax", "Abdomen", "Pelvis", "Back",
    "Free part of right lower limb", "Thigh", "Leg", "Foot", "Hand",
]
print("=== VUNG CO SAN ===")
for name in CANDIDATES:
    c = bpy.data.collections.get(name)
    if not c:
        continue
    cnt = collections.Counter()
    for o in c.all_objects:
        s = sysmap.get(o.name, "?").split(":")[0]
        if o.type == "MESH" and len(o.data.vertices) >= 20:
            cnt[s] += 1
        elif o.type == "CURVE":
            cnt["curve" + s] += 1
    bone = cnt.get("1", 0); mus = cnt.get("4", 0)
    ves = cnt.get("curve5", 0); ner = cnt.get("curve7", 0)
    org = cnt.get("8", 0); lym = cnt.get("6", 0)
    print(f"  {name}: xuong={bone} co={mus} mach={ves} tk={ner} tang={org} hach={lym}")
