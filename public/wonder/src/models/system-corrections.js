// Exact IDs only: cerebral ventricles were filed under cardiac in this atlas.
// Preserve source metadata and geometry; never reclassify mixed system groups.
const VENTRICLES = new Set(['FJ1730','FJ1731','FJ1752','FJ1767','FJ1814']);
export function correctSystem(group, parts) {
  if (group.system !== 'cardiac') return group;
  const exact = VENTRICLES.has(group.id);
  const members = parts.filter(part => part.system === 'cardiac');
  const aggregate = (group.id === 'cardiac' || group.label === 'Tim') && members.length > 0 && members.every(part => VENTRICLES.has(part.id));
  if (!exact && !aggregate) return group;
  return {...group, system:'nervous', sourceSystem:group.system,
    correctionReference:'https://meshb.nlm.nih.gov/record/ui?dcmsLinks=true&ui=D002552',
    ...(aggregate ? {label:'Hệ não thất',info:'Hệ não thất'} : {})};
}
