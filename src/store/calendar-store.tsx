import {create} from "zustand"
import { Activity } from "../types/Activity"

export interface CalendarStore {
  selectedDate: Date | null
  setSelectedDate: (date: Date | null) => void
}
export const useCalendarStore = create<CalendarStore>((set) => ({
  selectedDate: null,
  setSelectedDate: (date) => set({ selectedDate: date }),
}))