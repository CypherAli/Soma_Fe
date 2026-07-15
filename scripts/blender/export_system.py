import bpy, sys
argv = sys.argv[sys.argv.index('--')+1:]
col_name, out = argv[0], argv[1]
for o in bpy.data.objects:
    try: o.select_set(False)
    except: pass
col = bpy.data.collections.get(col_name)
if not col:
    print("ERR collection not found:", col_name); sys.exit(1)
n=0
for o in list(col.all_objects):
    if o is None:
        continue
    if o.type=='MESH':
        o.hide_viewport=False
        try: o.hide_set(False)
        except: pass
        try:
            o.select_set(True); n+=1
        except: pass
print("SELECTED", n)
bpy.ops.export_scene.gltf(
    filepath=out, export_format='GLB', use_selection=True,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
    export_apply=False, export_yup=True)
print("DONE", out)
