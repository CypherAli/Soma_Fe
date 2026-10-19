import type { CatKey } from './layers';

export const GESTURE_REGIONS = [
  { id: 'head', name: 'Đầu đầy đủ', latin: 'Caput', detail: 'Sọ, cơ mặt, mắt, não, mạch và thần kinh — cả hai bên.' },
  { id: 'neck', name: 'Cổ', latin: 'Collum', detail: 'Đoạn cổ giữa nền đầu và đai vai, với cơ, đốt sống, mạch và thần kinh.' },
  { id: 'thorax', name: 'Thân trên', latin: 'Thorax', detail: 'Ngực, lưng trên, hai vai và gốc cánh tay; không gồm đầu và cổ.' },
  { id: 'bust', name: 'Đầu · cổ · thân trên', latin: 'Caput · Collum · Thorax', detail: 'Bán thân liền khối, giữ hai vai và gốc cánh tay, cắt ngang dưới ngực.' },
] as const;
export type GestureRegion = typeof GESTURE_REGIONS[number]['id'];
export type RegionPose = { yaw: number; pitch: number; zoom: number; explode: number };
export const regionPose = (): RegionPose => ({ yaw: 0, pitch: 0, zoom: 1, explode: 0 });
export const REGION_OFFSETS: Record<CatKey, [number, number, number]> = {
  skin: [0, 0, .65], muscle: [-.65, 0, .15], bone: [0, 0, -.2],
  brain: [0, .35, .25], organ: [0, 0, .55], eye: [0, 0, .4],
  artery: [.6, 0, .1], vein: [.9, 0, -.1], nerve: [-1, 0, -.1], lymph: [.45, -.2, .4],
};
