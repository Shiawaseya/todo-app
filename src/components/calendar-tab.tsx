"use client";

import { useState } from "react";
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import CalendarHeader from "./calendar-header";
import InteractiveCalendar from "./interactive-calendar";
import ScheduledAndEventDetailModal from "./scheduledAndEventDetails";
import { useModalStore } from "../store/modal-store";
import { useCalendarStore } from "../store/calendar-store";
import { set } from "date-fns";
import DayView from "./day-view";
import CalendarStats from "./CalendarStats";
export default function CalendarTab() {
  const isDayViewOpen = useModalStore((state) => state.isDayViewOpen);
  const setIsDayViewOpen = useModalStore((state) => state.setIsDayViewOpen);
  const selectedDate = useCalendarStore((state) => state.selectedDate);
  const setSelectedDate = useCalendarStore((state) => state.setSelectedDate);
  
  const isScheduleAndAddEventOpen = useModalStore(
    (state) => state.isScheduledAndEventDetailsModalOpen
  );
  const setIsScheduleAndEventModalOpen = useModalStore(
    (state) => state.setIsScheduledAndEventDetailsModalOpen
  );

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsDayViewOpen(true);
    console.log("Selected date:", date.toLocaleDateString());
  };

  const handleCloseModal = () => {
    setIsDayViewOpen(true);
    setIsScheduleAndEventModalOpen(false);
  };

  return (
    <>
      <CalendarHeader></CalendarHeader>
      <IonContent fullscreen>
        <div >
          <div >
            {isDayViewOpen ? (
              isScheduleAndAddEventOpen ? (
                <ScheduledAndEventDetailModal
                  isOpen={isScheduleAndAddEventOpen}
                  onClose={() => handleCloseModal()}>
                </ScheduledAndEventDetailModal>
              ): (
                <DayView onBackToCalendar={() => setIsDayViewOpen(false)} />
              )
            ) : (
              <>
              <CalendarStats></CalendarStats>
              <InteractiveCalendar
                events={[]}
                onDateSelect={handleDateSelect}
                />
                </>
            )}
          </div>
        </div>
      </IonContent>
    </>
  );
}
