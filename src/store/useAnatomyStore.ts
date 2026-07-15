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
  | "digestive"
  | "respiratory";

type AnatomyState = {
  selected: SelectedPart;
  hovered: string | null;
  visibleSystems: Record<SystemKey, boolean>;
  searchQuery: string;
  setSelected: (part: SelectedPart) => void;
  setHovered: (id: string | null) => void;
  toggleSystem: (key: SystemKey) => void;
  setSearchQuery: (q: string) => void;
};

const allSystems: SystemKey[] = [
  "skeletal",
  "muscular",
  "nervous",
  "cardiovascular",
  "digestive",
  "respiratory",
];

export const useAnatomyStore = create<AnatomyState>((set) => ({
  selected: null,
  hovered: null,
  visibleSystems: Object.fromEntries(
    allSystems.map((s) => [s, true]),
  ) as Record<SystemKey, boolean>,
  searchQuery: "",
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
}));

export const SYSTEM_KEYS = allSystems;
