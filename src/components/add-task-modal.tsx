"use client";

import { useState } from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonChip,
  IonSelect,
  IonSelectOption,
  IonNote, // Imported for error messages
} from "@ionic/react";
import { close } from "ionicons/icons";
import TaskFormInputs from "./task-form-inputs";
import DatePickerModal from "./date-picker-modal";
import { useModalStore } from "../store/modal-store";
import { useAddActivityStore } from "../store/adding-activity-store";
import { format } from "date-fns";
import { useAddActivity } from "../hooks/useActivities";

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

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: TaskData) => void;
}

interface TaskData {
  title: string;
  description: string;
  date: string;
  time: string;
}

export default function AddTaskModal({
  isOpen,
  onClose,
  onSave,
}: AddTaskModalProps) {
  const [nameError, setNameError] = useState(false); // State for name validation error
  
  const isDatePickerOpen = useModalStore((state) => state.isDatePickerOpen);
  const setIsDatePickerOpen = useModalStore(
    (state) => state.setIsDatePickerOpen
  );
  const setIsAddTaskModalOpen = useModalStore(
    (state) => state.setIsAddTaskModalOpen
  );
  
  // Get required fields from store to perform validation
  const name = useAddActivityStore((state) => state.name);
  const dueDate = useAddActivityStore((state) => state.dueDate);
  const dueDateTime = useAddActivityStore((state) => state.dueDateTime);
  const remindBefore = useAddActivityStore((state) => state.remindBefore);
  const setType = useAddActivityStore((state) => state.setType);
  
  // NOTE: Corrected the setter function name based on common patterns.
  // Original: setReimindBefore (likely a typo in the provided code)
  const setRemindBefore = useAddActivityStore( 
    (state) => state.setReimindBefore // Assuming this is the correct setter name in your store
  );

  const generateActivity = useAddActivityStore(
    (state) => state.generateActivity
  );
  const reset = useAddActivityStore((state) => state.reset);
  const addActivity = useAddActivity();

  // Logic to format the due date and time
  let formatted = "No due date";
  if (dueDate && dueDateTime) {
    const combined = new Date(`${dueDate}T${dueDateTime}`);
    formatted = format(combined, "MMM d, yyyy • hh:mm a");
  } else if (dueDate) {
    formatted = format(new Date(dueDate), "MMM d, yyyy");
  }

  const handleSave = async () => {
    // --- VALIDATION: Name is required ---
    if (!name || name.trim() === "") {
      setNameError(true);
      // Optional: Add a simple vibration/haptic feedback here if using a native wrapper like Capacitor/Cordova
      return; // Stop saving
    }

    // Validation passed
    setNameError(false);
    setType("task");
    
    await addActivity.mutateAsync(generateActivity());
    
    setIsAddTaskModalOpen(false);
    console.log("Task saved and modal closed.");
    reset();
  };
  
  // Determine if the Save button should be disabled
  const isSaveDisabled = !name || name.trim() === '';

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
        zIndex: 10000, // High z-index to ensure it sits on top
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      // Optional: Close modal when clicking the backdrop
      onClick={(e) => {
        // Only close if the click is directly on the backdrop div, not its children
        if (e.target === e.currentTarget) {
          setIsAddTaskModalOpen(false);
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
          overflow: "hidden", // Ensures content stays within the rounded corners
        }}
      >
        {/* Header (using Ionic components for consistent look) */}
        <IonHeader
          style={{
            boxShadow: 'none', // Remove shadow if the container has a shadow
            borderBottom: '1px solid #ccc',
          }}
        >
          <IonToolbar>
            <IonTitle>Add Task</IonTitle>
            <IonButtons slot="start">
              <IonButton onClick={() => setIsAddTaskModalOpen(false)}>
                <IonIcon icon={close} slot="icon-only" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        {/* Content Area (HTML div replacing IonContent) */}
        <div
          style={{
            flexGrow: 1,
            overflowY: "auto", // Allow content scrolling
          }}
        >
          <div className="ion-padding" style={{ padding: "16px" }}>
            {/* TaskFormInputs must handle the required NAME input 
              and should ideally communicate the error state if needed.
              We assume it uses the 'name' state from the store.
              We rely on the TaskFormInputs structure but provide feedback here.
            */}
            <TaskFormInputs />
            
            {/* Name Validation Feedback (if TaskFormInputs doesn't show it) */}
            {nameError && (
              <IonNote color="danger" style={{ display: 'block', margin: '8px 0 16px' }}>
                Task Name is required.
              </IonNote>
            )}

            {/* Due Date Item (using IonItem for styling) */}
            <IonItem button onClick={() => setIsDatePickerOpen(true)} style={{'--padding-start': '0', '--inner-padding-end': '0'}}>
              <IonLabel>
                <div>Due date</div>
                <IonChip>
                  <IonLabel>{formatted}</IonLabel>
                </IonChip>
              </IonLabel>
            </IonItem>

            {/* Remind Before Dropdown (using IonItem/IonSelect) */}
            <IonItem style={{'--padding-start': '0', '--inner-padding-end': '0'}}>
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

            <DatePickerModal
              isOpen={isDatePickerOpen}
              onClose={() => setIsDatePickerOpen(false)}
            />
          </div>
        </div>

        {/* Footer (using Ionic components for consistent look) */}
        <div
            style={{
                borderTop: '1px solid #ccc',
                padding: '10px 16px',
            }}
        >
            <IonButton 
              expand="block" 
              color="primary" 
              onClick={handleSave}
              disabled={isSaveDisabled} // Disable if Name is empty
            >
              Save Task
            </IonButton>
        </div>
      </div>
    </div>
    // --- END CUSTOM MODAL STRUCTURE ---
  );
}