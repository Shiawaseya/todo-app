import { create } from "zustand";

export interface SelectedActivityStore {
  selectedActivityId: string | null;
  setSelectedActivityId: (id: string | null) => void;
  clearSelectedActivity: () => void;
}
export const useSelectedActivityStore = create<SelectedActivityStore>((set) => ({
  selectedActivityId: null,
  setSelectedActivityId: (id) => set({ selectedActivityId: id }),
  clearSelectedActivity: () => set({ selectedActivityId: null }),
}));