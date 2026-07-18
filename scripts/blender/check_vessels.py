import bpy

names = ["Abdominal aorta", "Inferior vena cava (abdominal part)"]
for nm in names:
    o = bpy.data.objects.get(nm)
    if not o:
        print("NOTFOUND", nm)
        continue
    d = o.data
    print("CURVEINFO", o.name,
          "bevel_mode", d.bevel_mode,
          "bevel_depth", d.bevel_depth,
          "bevel_object", d.bevel_object.name if d.bevel_object else None,
          "extrude", d.extrude,
          "dimensions", tuple(round(x,4) for x in o.dimensions),
          "scale", tuple(round(x,4) for x in o.scale))
    if d.bevel_object:
        bo = d.bevel_object
        print("BEVELOBJ", bo.name, "dimensions", tuple(round(x,4) for x in bo.dimensions),
              "scale", tuple(round(x,4) for x in bo.scale))
