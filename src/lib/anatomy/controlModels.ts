import type { T3 } from "@/lib/homeContent";
// Ghi rõ "/index": node (npm run test:vision) không nhận import thư mục.
import { atlasScenes } from "@/lib/humanAtlas/scenes/index";
import { wholeBodyScene } from "@/lib/humanAtlas/scenes/wholeBody";
import { upperBodyScene } from "@/lib/humanAtlas/scenes/upperBody";

/**
 * Scene chỉ dùng cho trang Vision AI (quét + điều khiển bằng cử chỉ), không
 * đăng ký vào atlasScenes để khỏi lọt sang thư viện.
 */
const VISION_ONLY: Record<string, { title: T3; scene: AtlasSceneDef }> = Object.fromEntries(
  [wholeBodyScene, upperBodyScene].map((s) => [s.slug, { title: s.title, scene: s }]),
);
import type { AtlasSceneDef } from "@/lib/humanAtlas/scenes/types";
import { getLayeredModel, type LayeredModel } from "./layeredModels";

/**
 * MÔ HÌNH ĐIỀU KHIỂN ĐƯỢC BẰNG CỬ CHỈ — nguồn tra duy nhất của trang Vision AI.
 *
 * Hai loại:
 *   • `atlas` — scene chuyên đề dựng trên atlas BodyParts3D (kể cả 27 bài bộ
 *     phận học theo lớp). ĐƯỢC ƯU TIÊN: thư viện đã hiện tên, ảnh bìa và nội
 *     dung của bài atlas cho những slug này, nên trang cử chỉ cũng phải nạp
 *     đúng bài đó. Trước đây nó nạp .glb cũ cùng slug — nút ghi "Khớp khuỷu:
 *     xương, cơ vận động và vòng nối mạch" mà mô hình hiện ra là bài khác.
 *   • `glb` — mô hình Z-Anatomy cắt sẵn, chỉ còn là đường lui cho slug nào
 *     chưa có trên atlas.
 *
 * Luật đã chốt với người dùng: mô hình LUÔN hiện ngay trong trang Vision AI,
 * không bao giờ chuyển sang trang mô hình của thư viện (camera sẽ tắt).
 */
export type ControlModel =
  | ({ kind: "glb" } & LayeredModel)
  | { kind: "atlas"; slug: string; title: T3; scene: AtlasSceneDef };

export function getControlModel(slug: string): ControlModel | undefined {
  // Toàn thân / nửa thân trên chỉ dùng cho trang Vision AI: thư viện đã có
  // trang toàn thân riêng với mặt cắt, tách rời đầy đủ.
  const only = VISION_ONLY[slug];
  if (only) return { kind: "atlas", slug, title: only.title, scene: only.scene };
  const scene = atlasScenes[slug];
  if (scene) return { kind: "atlas", slug, title: scene.title, scene };
  const glb = getLayeredModel(slug);
  return glb ? { kind: "glb", ...glb } : undefined;
}

/**
 * Bản .glb đủ lớp da–cơ–xương của một slug, BỎ QUA bài atlas cùng tên.
 *
 * Dùng khi atlas không có mặt ngoài của vùng (đầu/mặt toàn sọ–não): quét mặt
 * mà mở bài sọ thì sai kỳ vọng, trong khi bản Z-Anatomy có đủ da, cơ mặt, mắt.
 * Đây là cùng bản mà trang thư viện `/xem-dau` đang hiện — không phải mô hình lạ.
 */
export function getGlbModel(slug: string): ControlModel | undefined {
  const glb = getLayeredModel(slug);
  return glb ? { kind: "glb", ...glb } : undefined;
}

/** Một "lớp" bật/tắt được trong bảng lớp của chế độ điều khiển. */
export type AtlasLayerDef = { key: string; name: T3; groups: string[]; on: boolean };

/**
 * Lớp của một scene atlas. Bài bộ phận có sẵn `layers`; bài chuyên đề cũ thì
 * không, nên mỗi nhóm cấu trúc thành một lớp — vẫn bóc được từng phần.
 */
export function atlasLayerDefs(scene: AtlasSceneDef): AtlasLayerDef[] {
  if (scene.layers?.length) {
    return scene.layers.map((l) => ({ key: l.key, name: l.name, groups: l.groups, on: !!l.on }));
  }
  return scene.groups.map((g) => ({ key: g.key, name: g.name, groups: [g.key], on: true }));
}

export type AtlasLayerState = Record<string, { visible: boolean; faded: boolean }>;

/** Trạng thái lớp lúc mở: đúng như trang thư viện — chỉ lớp `on` bật sẵn. */
export function initAtlasLayers(scene: AtlasSceneDef): AtlasLayerState {
  const faded = new Set(scene.fadedGroups ?? []);
  return Object.fromEntries(
    atlasLayerDefs(scene).map((l) => [
      l.key,
      // Lớp chỉ gồm nhóm "làm mờ sẵn" (xương làm nền cho mạch…) thì mở ở dạng mờ.
      { visible: l.on, faded: l.groups.length > 0 && l.groups.every((g) => faded.has(g)) },
    ]),
  );
}

/**
 * Trạng thái hiện/mờ của TỪNG NHÓM, gộp từ trạng thái lớp.
 * Nhóm không thuộc lớp nào thì luôn hiện (đúng quy ước của AtlasSceneDef).
 */
export function groupVisibility(
  scene: AtlasSceneDef,
  layers: AtlasLayerState,
): Map<string, { visible: boolean; faded: boolean }> {
  const out = new Map<string, { visible: boolean; faded: boolean }>();
  const fadedAtStart = new Set(scene.fadedGroups ?? []);
  for (const g of scene.groups) out.set(g.key, { visible: true, faded: false });
  for (const l of atlasLayerDefs(scene)) {
    const st = layers[l.key];
    if (!st) continue;
    for (const key of l.groups) out.set(key, { visible: st.visible, faded: st.faded });
  }
  // Nhóm mờ sẵn nhưng không nằm trong lớp nào: vẫn phải mờ như trang thư viện.
  for (const key of fadedAtStart) {
    const cur = out.get(key);
    if (cur && !atlasLayerDefs(scene).some((l) => l.groups.includes(key))) cur.faded = true;
  }
  return out;
}
