"use client";

import { useRef } from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonDatetime,
  IonButtons,
  IonButton,
} from "@ionic/react";
import { useAddActivityStore } from "../store/adding-activity-store";

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DatePickerModal({
  isOpen,
  onClose,
}: DatePickerModalProps) {
  // We no longer need dateModalRef since we aren't using IonModal, 
  // but keeping the minimal dependencies.
  
  const mindate = new Date().toISOString();
  
  // Get both date and time from store
  const dueDate = useAddActivityStore((state) => state.dueDate);
  const dueDateTime = useAddActivityStore((state) => state.dueDateTime);
  const setFromDatetimePicker = useAddActivityStore((state) => state.setFromDatetimePicker);

  // Combine for IonDatetime value: format is "YYYY-MM-DDTHH:mm:ss"
  const combinedValue = dueDate && dueDateTime ? `${dueDate}T${dueDateTime}` : undefined;

  if (!isOpen) {
    return null;
  }

  // --- START CUSTOM MODAL STRUCTURE (replacing IonModal) ---

  return (
    // Backdrop / Overlay Container
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark semi-transparent background
        zIndex: 10000, // High z-index
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      // Close modal when clicking the backdrop
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Modal Content Container */}
      <div
        style={{
          width: "90%",
          maxWidth: "500px",
          maxHeight: "90%",
          backgroundColor: "white",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header (using Ionic components) */}
        <IonHeader
          style={{
            boxShadow: 'none',
            borderBottom: '1px solid #ccc',
            flexShrink: 0, // Ensure header doesn't shrink
          }}
        >
          <IonToolbar>
            <IonTitle>Select Date & Time</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={onClose} color="primary">Done</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        {/* Content Area (HTML div replacing IonContent) */}
        <div
          style={{
            flexGrow: 1,
            overflowY: "auto", // Allow content scrolling
            padding: "16px",
            display: 'flex', // Use flex to center the Datetime component
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* IonDatetime component */}
          <IonDatetime
            style={{ 
                // Ensure IonDatetime takes up space without stretching the container excessively
                maxWidth: '100%', 
            }}
            value={combinedValue} // use combined date + time
            onIonChange={(e) => setFromDatetimePicker(e.detail.value as string | null)}
            presentation="date-time" // Allows selection of both date and time
            min={mindate} // Minimum date is today
          />
        </div>
      </div>
    </div>
    // --- END CUSTOM MODAL STRUCTURE ---
  );
}