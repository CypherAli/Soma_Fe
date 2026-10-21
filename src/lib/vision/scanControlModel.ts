import { ATLAS_PRESETS } from '../../../public/wonder/src/models/atlas-presets.js';
export const DEFAULT_VISION_SLUG = 'toan-than';
export function isScanControlModel(id: unknown): id is string {
  return typeof id === 'string' && ATLAS_PRESETS.some(model=>model.id===id);
}
/** Use the same display name as the actual model opened in Vision. */
export function scanControlModelName(slug: string, part: string | null = null): string {
  const id=scanControlModel(slug,part);
  return ATLAS_PRESETS.find(model=>model.id===id)?.name||id;
}
/** Match a scan lesson to an available solid anatomical model. */
export function scanControlModel(slug: string, part: string | null = null): string {
  const exact: Record<string,string> = {
    'nua-than-tren':'bust','toan-than':'body','dai-vai-chi-tren':'upper-limb',
    'giai-phau-cang-tay':'forearm','giai-phau-canh-tay':'arm',
    'giai-phau-dai-vai':'upper-limb','giai-phau-dau':'head',
    'giai-phau-co':'neck','giai-phau-than':'thorax',
  };
  if(exact[slug]) return exact[slug];
  const rules: [RegExp,string][] = [
    [/co-tay/,'wrist'],[/ban-tay/,'hand'],[/cang-tay/,'forearm'],[/canh-tay/,'arm'],
    [/nao/,'brain'],[/hoc-mat|bo-phan-mat|giai-phau-mat/,'eye'],[/bo-phan-so|so-nen/,'skull'],
  ];
  for(const [pattern,id] of rules) if(pattern.test(slug)) return id;
  const parts: Record<string,string> = {head:'head',face:'head',eye:'eye',ear:'ear',mouth:'head',neck:'neck',shoulder:'upper-limb','upper-arm':'arm',elbow:'forearm',forearm:'forearm',wrist:'wrist',hand:'hand',chest:'thorax',abdomen:'thorax'};
  if(part==='whole-body') return 'body';
  if(part==='upper-body') return 'bust';
  return (part && parts[part]) || 'body';
}
