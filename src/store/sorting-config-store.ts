import { create } from "zustand";

export interface SortingConfigStore {
  sortBy: "dueDate" | "creationDate";
  sortOrder: "asc" | "desc";
  setSortBy: (sortBy: "dueDate" | "creationDate") => void;
  setSortOrder: (sortOrder: "asc" | "desc") => void;
}
export const useSortingConfigStore = create<SortingConfigStore>((set) => ({
  sortBy: "dueDate",
  sortOrder: "asc",
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
}));

