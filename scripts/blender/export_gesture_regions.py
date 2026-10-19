"""Four consistent Z-Anatomy sections for /cu-chi. Never writes the source blend.
blender -b Startup.blend --python export_gesture_regions.py -- public/models/gesture
Coordinates are source metres, Z up; glTF exports Y up. No synthetic skin.
"""
import bpy, sys, os, re, json, hashlib
from mathutils import Vector
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from clip_box import clip_box

OUT = os.path.abspath(sys.argv[sys.argv.index('--') + 1])
os.makedirs(OUT, exist_ok=True)
SOURCE = bpy.data.filepath
REGIONS = {
    'head': (1.490, 1.800),
    'neck': (1.425, 1.575),
    'thorax': (1.200, 1.425),
    'bust': (1.200, 1.800),
}
requested = next((a.split('=',1)[1].split(',') for a in sys.argv if a.startswith('--regions=')), list(REGIONS))
neck_names = {o.name for o in bpy.data.collections['Neck'].all_objects}
systems = {}
for col in bpy.data.collections:
    if re.match(r'^[1345678]:', col.name):
        for obj in col.all_objects:
            systems.setdefault(obj.name, col.name)

def bounds(obj):
    points = [obj.matrix_world @ Vector(c) for c in obj.bound_box]
    return [min(v[k] for v in points) for k in range(3)], [max(v[k] for v in points) for k in range(3)]

def intersects(lo, hi, z0, z1):
    return hi[2] >= z0 and lo[2] <= z1 and hi[0] >= -.27 and lo[0] <= .27 and hi[1] >= -.23 and lo[1] <= .23

# Evaluate curves once, with existing anatomical calibre where supplied.
base = []
candidates = []
for obj in list(bpy.data.objects):
    if obj.name not in systems or obj.type not in {'MESH', 'CURVE'}:
        continue
    if re.search(r'\.(?:j|t|g|i|o[lr]|e[lr]|a[lr])$', obj.name) or 'profile' in obj.name.lower():
        continue
    lo, hi = bounds(obj)
    if not intersects(lo, hi, 1.2, 1.8):
        continue
    if obj.type == 'MESH' and len(obj.data.polygons) == 0:
        continue
    if obj.type == 'CURVE':
        obj.data = obj.data.copy()
        if obj.data.bevel_depth == 0 and obj.data.bevel_object is None:
            obj.data.bevel_depth = .00065 if systems[obj.name].startswith('7:') else .0008
            obj.data.bevel_resolution = 1
        # Hidden source collections must be evaluated before export.
        obj.hide_viewport = False
        obj.hide_set(False)
    candidates.append((obj, lo, hi))
graph = bpy.context.evaluated_depsgraph_get()
for obj, lo, hi in candidates:
    mesh = obj.data.copy() if obj.type == 'MESH' else bpy.data.meshes.new_from_object(obj.evaluated_get(graph))
    if not mesh or not len(mesh.polygons):
        continue
    mesh.materials.clear()
    base.append((obj.name, systems[obj.name], mesh, obj.matrix_world.copy(), lo, hi))
print('BASE', len(base), flush=True)
result = {'source': os.path.basename(SOURCE), 'sourceSha256': hashlib.sha256(open(SOURCE,'rb').read()).hexdigest(),
          'license': 'CC-BY-SA 4.0; Z-Anatomy / BodyParts3D contributors',
          'units': 'metres; source Z up; output glTF Y up',
          'boundsXY': [-.27,.27,-.23,.23], 'skin': 'Not generated. Anatomical tissues only.', 'regions': {}}
manifest_path = os.path.join(OUT,'manifest.json')
if len(requested) < len(REGIONS) and os.path.exists(manifest_path):
    with open(manifest_path,encoding='utf-8') as f:
        result['regions'] = json.load(f)['regions']
for key, (z0,z1) in REGIONS.items():
    if key not in requested:
        continue
    bpy.ops.object.select_all(action='DESELECT')
    objects = []
    records = []
    for name, system, mesh, matrix, lo, hi in base:
        if key == 'neck' and name not in neck_names:
            continue
        if not intersects(lo, hi, z0, z1):
            continue
        obj = bpy.data.objects.new(name + '__gesture', mesh.copy())
        bpy.context.scene.collection.objects.link(obj)
        obj.matrix_world = matrix
        clip_box(obj, -.27, .27, -.23, .23, z0,z1)
        if not obj.data.polygons:
            bpy.data.objects.remove(obj, do_unlink=True)
            continue
        for face in obj.data.polygons:
            face.use_smooth = True
        obj['anatomyName'] = name
        obj['anatomySystem'] = system
        obj.select_set(True)
        objects.append(obj)
        records.append({'name':name, 'system':system, 'vertices':len(obj.data.vertices), 'polygons':len(obj.data.polygons)})
    if not objects:
        raise RuntimeError('Empty region: ' + key)
    file = os.path.join(OUT, key + '.glb')
    bpy.ops.export_scene.gltf(filepath=file, export_format='GLB', use_selection=True,
        export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6,
        export_apply=False, export_yup=True, export_extras=True, export_materials='NONE')
    result['regions'][key] = {'zRange':[z0,z1], 'meshes':len(objects), 'parts':records,
                              'bytes':os.path.getsize(file),'sha256':hashlib.sha256(open(file,'rb').read()).hexdigest()}
    print('EXPORTED', key, len(objects), os.path.getsize(file), flush=True)
    with open(manifest_path,'w',encoding='utf-8') as f:
        json.dump(result,f,ensure_ascii=False,indent=2)
    bpy.data.batch_remove(ids=objects + [o.data for o in objects])
print('DONE',OUT,flush=True)
