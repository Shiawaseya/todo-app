"use client";

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonNote, // Import IonNote for error messages
} from "@ionic/react";
import { close } from "ionicons/icons";
import { format, isValid } from "date-fns";
import { useAddActivityStore } from "../store/adding-activity-store";
import { useAddActivity } from "../hooks/useActivities";
import { useState } from "react";

// Define standard reminder options in minutes
const REMINDER_OPTIONS = [
  { value: 5, label: "5 minutes before" },
  { value: 15, label: "15 minutes before" },
  { value: 30, label: "30 minutes before" },
  { value: 60, label: "1 hour before" },
  { value: 120, label: "2 hours before" },
  { value: 1440, label: "1 day before" }, // 24 hours * 60 minutes
  { value: null, label: "No reminder" },
];

interface ModalProps {
  type: "scheduledTask" | "event";
  isOpen: boolean;
  currentDate: Date;
  onClose: () => void;
}

export default function AddScheduledOrEventModal({
  type,
  isOpen,
  currentDate,
  onClose,
}: ModalProps) {
  const currentDateString = format(currentDate, "yyyy-MM-dd");

  const name = useAddActivityStore((s) => s.name);
  const setName = useAddActivityStore((s) => s.setName);

  const description = useAddActivityStore((s) => s.description);
  const setDescription = useAddActivityStore((s) => s.setDescription);

  // Store setters for due/end date/time
  const setDueDate = useAddActivityStore((s) => s.setDueDate);
  const setScheduledAt = useAddActivityStore((s) => s.setScheduledAt);
  // Renamed setDueTime to setDueDateTime in the store context, using the correct setter here
  const setDueDateTime = useAddActivityStore((s) => s.setDueDateTime); 

  const remindBefore = useAddActivityStore((s) => s.remindBefore);
  const setRemindBefore = useAddActivityStore((s) => s.setReimindBefore); 

  const [scheduledTime, setScheduledTime] = useState("");
  
  // --- NEW STATE FOR END DATE/TIME ---
  const [endDate, setEndDate] = useState<string | null>(currentDateString); // Initialize with the start date
  const [endTime, setEndTime] = useState<string | null>("");
  // --- END NEW STATE ---
  
  // --- NEW STATE FOR VALIDATION ---
  const [nameError, setNameError] = useState(false);
  const [timeError, setTimeError] = useState(false);

  const setType = useAddActivityStore((s) => s.setType);
  const generateActivity = useAddActivityStore((s) => s.generateActivity);
  const reset = useAddActivityStore((s) => s.reset);
  const addActivity = useAddActivity();

  const displayScheduledDate = format(currentDate, "MMM d, yyyy");

  const handleSave = async () => {
    // 1. Validation Check
    let hasError = false;

    if (!name || name.trim() === "") {
      setNameError(true);
      hasError = true;
    } else {
      setNameError(false);
    }

    if (!scheduledTime || scheduledTime.trim() === "") {
      setTimeError(true);
      hasError = true;
    } else {
      setTimeError(false);
    }
    
    if (hasError) {
      return; // Stop saving if any required field is empty
    }
    
    // 2. Data Preparation
    setType(type);
    
    // Set Start Time
    const combinedScheduledAt = `${currentDateString}T${scheduledTime}:00`;
    setScheduledAt(combinedScheduledAt);
    
    // Set End Date/Time (Due Date/Time)
    if (endDate && endTime) {
      const combinedDueDateTime = `${endDate}T${endTime}:00`;
      // Validate if the generated date is a valid date
      if (isValid(new Date(combinedDueDateTime))) {
        setDueDate(endDate); // Store the due date part
        setDueDateTime(endTime); // Store the full due date/time
      } else {
        console.error("Invalid Due Date/Time generated:", combinedDueDateTime);
        setDueDate(null);
        setDueDateTime(null);
      }
    } else {
      // Reset due date/time if not provided (e.g., for simple tasks)
      setDueDate(null);
      setDueDateTime(null);
    }

    // 3. Save
    await addActivity.mutateAsync(generateActivity());

    // 4. Cleanup
    reset();
    onClose();
  };

  // Determine if the Save button should be disabled
  const isSaveDisabled = !name || name.trim() === '' || !scheduledTime || scheduledTime.trim() === '';


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
          }}
        >
          <IonToolbar>
            <IonTitle>
              {type === "scheduledTask" ? "Add Scheduled Task" : "Add Event"}
            </IonTitle>
            <IonButtons slot="start">
              <IonButton onClick={onClose}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        {/* Content Area (HTML div replacing IonContent) */}
        <div
          style={{
            flexGrow: 1,
            overflowY: "auto",
            padding: "16px 0", // Add vertical padding to the inner scrollable content
          }}
        >
          {/* Inner padding for items */}
          <div style={{ padding: "0 16px" }}>
            {/* Name - REQUIRED FIELD */}
            <IonItem style={{ '--padding-start': '0', '--inner-padding-end': '0' }} color={nameError ? "danger" : undefined}>
              <IonLabel position="stacked">
                {type === "event" ? "Event Name" : "Task Name"}
                <span style={{ color: 'red' }}> *</span>
              </IonLabel>
              <IonInput
                placeholder="Enter name (required)"
                value={name}
                // Clear error on input change
                onIonChange={(e) => {
                  setName(e.detail.value || "");
                  if (nameError) setNameError(false);
                }}
              />
              {nameError && (
                <IonNote slot="helper" color="danger">
                  {type === "event" ? "Event Name" : "Task Name"} is required.
                </IonNote>
              )}
            </IonItem>

            {/* Description */}
            <IonItem style={{ '--padding-start': '0', '--inner-padding-end': '0' }}>
              <IonLabel position="stacked">Description</IonLabel>
              <IonTextarea
                placeholder="Optional"
                value={description ?? ""}
                onIonChange={(e) => setDescription(e.detail.value || "")}
                rows={4}
              />
            </IonItem>

            {/* --- START TIME/DATE SECTION --- */}

            {/* Start Date (auto-filled from calendar) */}
            <IonItem style={{ '--padding-start': '0', '--inner-padding-end': '0' }}>
              <IonLabel position="stacked">Start Date</IonLabel>
              <IonInput value={displayScheduledDate} readonly />
            </IonItem>

            {/* Start Time Input - REQUIRED FIELD */}
            <IonItem style={{ '--padding-start': '0', '--inner-padding-end': '0' }} color={timeError ? "danger" : undefined}>
              <IonLabel position="stacked">Start Time<span style={{ color: 'red' }}> *</span></IonLabel>
              <IonInput
                type="time"
                value={scheduledTime}
                onIonChange={(e) => {
                  setScheduledTime(e.detail.value || "");
                  if (timeError) setTimeError(false);
                }}
              />
              {timeError && (
                <IonNote slot="helper" color="danger">
                  Start Time is required.
                </IonNote>
              )}
            </IonItem>
			
            {/* --- END TIME/DATE SECTION (New) --- */}

            {/* End Date Input */}
            <IonItem style={{ '--padding-start': '0', '--inner-padding-end': '0' }}>
              <IonLabel position="stacked">End Date (Optional)</IonLabel>
              <IonInput
                type="date"
                value={endDate}
                min={currentDateString} // Prevent selecting a date before the start date
                onIonChange={(e) => setEndDate(e.detail.value || null)}
              />
              <IonNote slot="helper">Only required for multi-day events or a specific end time.</IonNote>
            </IonItem>

            {/* End Time Input */}
            <IonItem style={{ '--padding-start': '0', '--inner-padding-end': '0' }}>
              <IonLabel position="stacked">End Time (Optional)</IonLabel>
              <IonInput
                type="time"
                value={endTime}
                onIonChange={(e) => setEndTime(e.detail.value || null)}
              />
            </IonItem>

            {/* Remind Before Dropdown */}
            <IonItem style={{ '--padding-start': '0', '--inner-padding-end': '0' }}>
              <IonLabel>Remind me</IonLabel>
              <IonSelect
                aria-label="Reminder time"
                interface="action-sheet"
                placeholder="Select a reminder"
                value={remindBefore}
                onIonChange={(e) => setRemindBefore(e.detail.value)}
              >
                {REMINDER_OPTIONS.map((option) => (
                  <IonSelectOption key={option.label} value={option.value}>
                    {option.label}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          </div>
        </div>

        {/* Footer (HTML div replacing IonFooter/IonToolbar) */}
        <div
          style={{
            borderTop: '1px solid #ccc',
            padding: '10px 16px',
            flexShrink: 0,
          }}
        >
          <IonButton 
            expand="block" 
            color="primary" 
            onClick={handleSave}
            disabled={isSaveDisabled} // Button disabled when required fields are empty
          >
            Save
          </IonButton>
        </div>
      </div>
    </div>
    // --- END CUSTOM MODAL STRUCTURE ---
  );
}