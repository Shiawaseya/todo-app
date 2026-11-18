import { create } from "zustand";

export interface ModalStore {
  isAddTaskModalOpen: boolean;
  isDatePickerOpen: boolean;
  isTimePickerOpen: boolean;
  isTaskDetailsModalOpen: boolean;
  isDayViewOpen: boolean;
  isAddScheduledOrEventModalOpen: boolean;
  isScheduledAndEventDetailsModalOpen: boolean;

  setIsAddTaskModalOpen: (isOpen: boolean) => void;
  setIsDatePickerOpen: (isOpen: boolean) => void;
  setIsTimePickerOpen: (isOpen: boolean) => void;
  setIsTaskDetailsModalOpen: (isOpen: boolean) => void;
  setIsDayViewOpen: (isOpen: boolean) => void;
  setIsAddScheduledOrEventModalOpen: (isOpen: boolean) => void;
  setIsScheduledAndEventDetailsModalOpen: (isOpen: boolean) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isAddTaskModalOpen: false,
  isDatePickerOpen: false,
  isTimePickerOpen: false,
  isTaskDetailsModalOpen: false,
  isDayViewOpen: false,
  isAddScheduledOrEventModalOpen: false,
  isScheduledAndEventDetailsModalOpen: false,

  setIsAddTaskModalOpen: (isOpen) => set({ isAddTaskModalOpen: isOpen }),
  setIsDatePickerOpen: (isOpen) => set({ isDatePickerOpen: isOpen }),
  setIsTimePickerOpen: (isOpen) => set({ isTimePickerOpen: isOpen }), 
  setIsTaskDetailsModalOpen: (isOpen) => set({ isTaskDetailsModalOpen: isOpen }),
  setIsDayViewOpen: (isOpen) => set({ isDayViewOpen: isOpen }),
  setIsAddScheduledOrEventModalOpen: (isOpen) => set({ isAddScheduledOrEventModalOpen: isOpen }),
  setIsScheduledAndEventDetailsModalOpen: (isOpen) => set({ isScheduledAndEventDetailsModalOpen: isOpen }),
}));