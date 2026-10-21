// The exporter concatenates source surfaces within each system, followed by
// that system's technical cut faces. Recover both ranges without re-meshing.
export function sourceDisplayName(group,names){
  const translated=names[group.id];
  // A lesson/group placeholder is not the name of this individual structure.
  return translated&&!/^Cấu trúc\b|[·—]\s*FJ\d/u.test(translated)?translated:group.label;
}
export function sourceGroups(manifest) {
  const groups = [], overview = [];
  for (const [parentIndex,parent] of manifest.groups.entries()) {
    const parts = manifest.parts.filter(part => part.system === parent.system);
    const total = parts.reduce((sum, part) => sum + (part.triangles + (part.capTriangles || 0)) * 9, 0);
    const aggregate = parts.length > 1 && manifest.groups.filter(g => g.system === parent.system).length === 1 && total === parent.count;
    if (!aggregate) { groups.push({...parent,parentIndex,parentId:parent.id,ranges: [{start:parent.start,count:parent.count,capCount:parent.capCount||0}]}); continue; }
    overview.push({...parent});
    let main = parent.start, cap = parent.start + parent.count - (parent.capCount || 0);
    for (const part of parts) {
      const count = part.triangles * 9, caps = (part.capTriangles || 0) * 9;
      const ranges = [{start:main,count,capCount:0}];
      if (caps) ranges.push({start:cap,count:caps,capCount:caps});
      groups.push({...parent,parentIndex,parentId:parent.id,id:part.id,sourceId:part.id,sourceName:part.name,label:part.name,info:part.name,
        ranges,start:main,count:count+caps,capCount:caps,description:'',descriptionEn:'',latin:'',reference:'',learningNotes:[]});
      main += count; cap += caps;
    }
    if (main !== parent.start + parent.count - (parent.capCount || 0) || cap !== parent.start + parent.count) throw Error('Invalid source ranges: '+parent.system);
  }
  return {groups, overview};
}
