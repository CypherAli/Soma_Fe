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
  /** Mặt cắt lát (clipping plane) toàn thân. */
  clipEnabled: boolean;
  clipAxis: "x" | "y" | "z";
  /** Vị trí lát cắt, 0-100% theo chiều dài trục đã chọn của TOÀN THÂN. */
  clipPercent: number;
  /** true = giữ lại nửa dương của trục, false = giữ nửa âm. */
  clipKeepPositive: boolean;
  setSelected: (part: SelectedPart) => void;
  setHovered: (id: string | null) => void;
  toggleSystem: (key: SystemKey) => void;
  setSearchQuery: (q: string) => void;
  toggleHidden: (id: string) => void;
  toggleFaded: (id: string) => void;
  toggleIsolate: (id: string) => void;
  setClipEnabled: (v: boolean) => void;
  setClipAxis: (a: "x" | "y" | "z") => void;
  setClipPercent: (v: number) => void;
  toggleClipDirection: () => void;
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
  clipEnabled: false,
  clipAxis: "y",
  clipPercent: 50,
  clipKeepPositive: false,
  setSelected: (part) => set({ selected: part }),
  setHovered: (id) => set({ hovered: id }),
  toggleSystem: (key) =>
    set((state) => ({
      visibleSystems: {
        ...state.visibleSystems,
        [key]: !state.visibleSystems[key],
      },
    })),
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
}));

export const SYSTEM_KEYS = allSystems;
