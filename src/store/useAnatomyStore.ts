import { create } from "zustand";

/**
 * Trạng thái toàn cục của viewer giải phẫu.
 * Ở P0 mới dùng phần chọn bộ phận + lớp hiển thị; các trường khác
 * (mesh, camera) sẽ mở rộng khi nạp model thật ở P1.
 */
export type SelectedPart = {
  id: string;
  name: string;
  latin?: string;
  description?: string;
} | null;

export type SystemKey =
  | "skeletal"
  | "muscular"
  | "nervous"
  | "cardiovascular"
  | "visceral"
  | "lymphoid"
  | "joints";

type AnatomyState = {
  selected: SelectedPart;
  hovered: string | null;
  visibleSystems: Record<SystemKey, boolean>;
  searchQuery: string;
  /** id (= tên mesh gốc glTF) đang bị Ẩn thủ công, bất kể hệ đang bật/tắt. */
  hiddenIds: Record<string, boolean>;
  /** id đang bị làm Mờ (giảm opacity) để lộ cấu trúc phía dưới. */
  fadedIds: Record<string, boolean>;
  /** id duy nhất đang Cô lập — khi set, mọi mesh khác trong scene tạm ẩn. */
  isolatedId: string | null;
  /** Lớp DA bọc ngoài toàn thân (fullbody_skin.glb) — tách riêng khỏi 7 hệ
   *  vì nó không phải một hệ cơ quan, chỉ là lớp vỏ để bóc dần vào trong. */
  /** Hệ đang được làm MỜ (khác `fadedIds` vốn theo từng mesh riêng lẻ). */
  fadedSystems: Record<SystemKey, boolean>;
  skinVisible: boolean;
  /** Da đang ở trạng thái mờ (nhìn xuyên vào các hệ bên dưới). */
  skinFaded: boolean;
  /** Mặt cắt lát (clipping plane) toàn thân. */
  clipEnabled: boolean;
  clipAxis: "x" | "y" | "z";
  /** Vị trí lát cắt, 0-100% theo chiều dài trục đã chọn của TOÀN THÂN. */
  clipPercent: number;
  /** true = giữ lại nửa dương của trục, false = giữ nửa âm. */
  clipKeepPositive: boolean;
  /** key hotspot đang active (camera đã zoom vào) — dùng chung giữa pin 3D và danh sách Labels bên panel. */
  activeHotspotKey: string | null;
  setSelected: (part: SelectedPart) => void;
  setHovered: (id: string | null) => void;
  toggleSystem: (key: SystemKey) => void;
  toggleSystemFaded: (key: SystemKey) => void;
  toggleSkin: () => void;
  toggleSkinFaded: () => void;
  setSearchQuery: (q: string) => void;
  toggleHidden: (id: string) => void;
  toggleFaded: (id: string) => void;
  toggleIsolate: (id: string) => void;
  setClipEnabled: (v: boolean) => void;
  setClipAxis: (a: "x" | "y" | "z") => void;
  setClipPercent: (v: number) => void;
  toggleClipDirection: () => void;
  setActiveHotspotKey: (key: string | null) => void;
  /** Đặt lại toàn bộ trạng thái viewer (Ẩn/Mờ/Cô lập/Mặt cắt/lựa chọn) khi vào 1 scene mới, tránh trạng thái scene trước lẫn sang. */
  resetViewer: (visibleSystems?: Partial<Record<SystemKey, boolean>>) => void;
};

const allSystems: SystemKey[] = [
  "skeletal",
  "muscular",
  "nervous",
  "cardiovascular",
  "visceral",
  "lymphoid",
  "joints",
];

export const useAnatomyStore = create<AnatomyState>((set) => ({
  selected: null,
  hovered: null,
  visibleSystems: Object.fromEntries(
    allSystems.map((s) => [s, true]),
  ) as Record<SystemKey, boolean>,
  searchQuery: "",
  hiddenIds: {},
  fadedIds: {},
  isolatedId: null,
  fadedSystems: Object.fromEntries(allSystems.map((s) => [s, false])) as Record<SystemKey, boolean>,
  skinVisible: true,
  skinFaded: false,
  clipEnabled: false,
  clipAxis: "y",
  clipPercent: 50,
  clipKeepPositive: false,
  activeHotspotKey: null,
  setSelected: (part) => set({ selected: part }),
  setHovered: (id) => set({ hovered: id }),
  toggleSystem: (key) =>
    set((state) => ({
      visibleSystems: {
        ...state.visibleSystems,
        [key]: !state.visibleSystems[key],
      },
    })),
  toggleSystemFaded: (key) =>
    set((state) => ({
      fadedSystems: { ...state.fadedSystems, [key]: !state.fadedSystems[key] },
    })),
  toggleSkin: () => set((state) => ({ skinVisible: !state.skinVisible })),
  toggleSkinFaded: () => set((state) => ({ skinFaded: !state.skinFaded })),
  setSearchQuery: (q) => set({ searchQuery: q }),
  toggleHidden: (id) =>
    set((state) => ({
      hiddenIds: { ...state.hiddenIds, [id]: !state.hiddenIds[id] },
    })),
  toggleFaded: (id) =>
    set((state) => ({
      fadedIds: { ...state.fadedIds, [id]: !state.fadedIds[id] },
    })),
  toggleIsolate: (id) =>
    set((state) => ({ isolatedId: state.isolatedId === id ? null : id })),
  setClipEnabled: (v) => set({ clipEnabled: v }),
  setClipAxis: (a) => set({ clipAxis: a }),
  setClipPercent: (v) => set({ clipPercent: Math.min(100, Math.max(0, v)) }),
  toggleClipDirection: () =>
    set((state) => ({ clipKeepPositive: !state.clipKeepPositive })),
  setActiveHotspotKey: (key) => set({ activeHotspotKey: key }),
  resetViewer: (visibleSystemsPatch) =>
    set((state) => ({
      selected: null,
      hovered: null,
      hiddenIds: {},
      fadedIds: {},
      isolatedId: null,
      clipEnabled: false,
      activeHotspotKey: null,
      visibleSystems: visibleSystemsPatch
        ? {
            ...Object.fromEntries(allSystems.map((s) => [s, false])),
            ...visibleSystemsPatch,
          } as Record<SystemKey, boolean>
        : state.visibleSystems,
    })),
}));

export const SYSTEM_KEYS = allSystems;
