"use client";
import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { Activity } from "../types/Activity";


export interface AddingActivityStore extends Activity {
  setId: (id: string | null) => void;
  setName: (name: string) => void;
  setDescription: (description: string | null) => void;
  setDueDate: (dueDate: string | null) => void;
  setDueDateTime: (dueDateTime: string | null) => void;
  setFromDatetimePicker: (datetime: string | null) => void;
  setCreatedAt: (createdAt: string | null) => void;
  setType: (type: Activity["type"]) => void;
  setStatus: (status: Activity["status"]) => void;
  setScheduledAt: (scheduledAt: string | null) => void;
  setReimindBefore: (remindBefore: number | null) => void;
  reset: () => void;
  generateActivity: () => Activity;
}

export const useAddActivityStore = create<AddingActivityStore>((set, get) => ({
  id: null,
  name: "",
  description: null,
  dueDate: null,
  dueDateTime: null,
  createdAt: null,
  type: "task",
  scheduledAt: null,
  remindBefore: null,
  setId: (id) => set({ id }),
  setName: (name) => set({ name }),
  setDescription: (description) => set({ description }),
  setDueDate: (date) => set({ dueDate: date }),
  setDueDateTime: (time) => set({ dueDateTime: time }),
  setScheduledAt: (scheduledAt) => set({ scheduledAt }),
  setReimindBefore: (remindBefore) => set({ remindBefore }),
  setFromDatetimePicker: (datetime) => {
    if (!datetime) {
      set({ dueDate: null, dueDateTime: null });
      return;
    }

    const d = new Date(datetime);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const datePart = `${yyyy}-${mm}-${dd}`;

    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    const timePart = `${hh}:${min}`;

    set({ dueDate: datePart, dueDateTime: timePart });
  },

  setCreatedAt: (createdAt) => set({ createdAt }),
  setType: (type) => set({ type }),
  setStatus: (status) => set({ status }),

  reset: () =>
    set({
      id: null,
      name: "",
      description: null,
      dueDate: null,
      dueDateTime: null,
      createdAt: null,
      type: "task",
      scheduledAt: null,
    }),

  generateActivity: () => {
    const state = get(); // one call, not six
    return {
      id: state.id ?? uuid(),
      name: state.name,
      status: state.status ?? "pending",
      scheduledAt: state.scheduledAt,
      description: state.description,
      dueDate: state.dueDate,
      dueDateTime: state.dueDateTime,
      createdAt: state.createdAt ?? new Date().toISOString(),
      type: state.type,
      remindBefore: state.remindBefore ?? null,
    };
  },
}));
