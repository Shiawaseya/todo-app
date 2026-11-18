"use client"

import { useState } from "react"
import {
  IonContent,
  IonFabButton, // Keeping this import for styling consistency if used directly or for size reference
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
} from "@ionic/react"
import {
  chevronBackOutline,
  chevronForwardOutline,
  checkmarkCircleOutline,
  timeOutline,
  flagOutline,
  closeOutline,
  add,
  create,
  todayOutline,
} from "ionicons/icons"
import { useActivities, useUpdateActivity } from "../hooks/useActivities"
import { useCalendarStore } from "../store/calendar-store"
import { useModalStore } from "../store/modal-store"
import AddScheduledOrEventModal from "./AddScheduledOrEventModal"
import { useSelectedActivityStore } from "../store/Selected-activity-store"
import { Link } from "react-router-dom"

interface Activity {
  id: string | null
  name: string
  status?: "pending" | "completed" | "missed"
  scheduledAt?: string | null
  description: string | null
  dueDate: string | null
  dueDateTime: string | null
  createdAt: string | null
  type: "task" | "scheduledTask" | "event"
}

interface DayViewProps {
  onDateChange?: (date: Date) => void
  onBackToCalendar?: () => void
}

// Custom Button Styling for the stacked FAB appearance
const fabButtonStyle: React.CSSProperties = {
  width: "56px",
  height: "56px",
  borderRadius: "50%",
  border: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 3px 5px rgba(0, 0, 0, 0.2)",
  cursor: "pointer",
  marginBottom: "10px", // Spacing between stacked buttons
  transition: "background-color 0.2s, opacity 0.2s",
};

// Function to handle custom button clicks and styling
const CustomFabButton = ({ icon, color, onClick, isVisible = true }: { icon: string, color: string, onClick: () => void, isVisible?: boolean }) => (
  <button
    onClick={onClick}
    style={{
      ...fabButtonStyle,
      width: "40px",
      height: "40px",
      backgroundColor: color,
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? 'auto' : 'none',
    }}
  >
    <IonIcon icon={icon} style={{ color: "white", fontSize: "15px" }} />
  </button>
);


export default function DayView({ onDateChange, onBackToCalendar }: DayViewProps) {
  const isAddScheduledOrEventModalOpen = useModalStore((state) => state.isAddScheduledOrEventModalOpen)
  const setIsAddScheduledOrEventModalOpen = useModalStore((state) => state.setIsAddScheduledOrEventModalOpen)
  const [type, setType] = useState<"scheduledTask" | "event">("scheduledTask")
  const [showPopover, setShowPopover] = useState(false) // For Add Task/Event
  const { data: activities = [] } = useActivities()
  const selectedDate = useCalendarStore((state) => state.selectedDate)
  const [currentDate, setCurrentDate] = useState(selectedDate ?? new Date())
  const setIsTaskDetailsModalOpen = useModalStore((state) => state.setIsTaskDetailsModalOpen)
  const setIsScheduledAndEventModalOpen = useModalStore(
    (state) => state.setIsScheduledAndEventDetailsModalOpen
  )

  const updateActivity = useUpdateActivity()

  const setSelectedActivityId = useSelectedActivityStore(
    (state) => state.setSelectedActivityId
  )

  const handlePrevDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 1)
    setCurrentDate(newDate)
    onDateChange?.(newDate)
  }

  const handleNextDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 1)
    setCurrentDate(newDate)
    onDateChange?.(newDate)
  }

  const handleToday = () => {
    const today = new Date()
    setCurrentDate(today)
    onDateChange?.(today)
  }

  const dateString = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const isToday = new Date().toDateString() === currentDate.toDateString()

  const dateStr = currentDate.toLocaleDateString("en-CA")
  const toLocalYMD = (d: string | null) => {
    if (!d) return null
    const x = new Date(d)
    return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`
  }

  const filteredActivities = activities.filter(a => {
    const raw = a.scheduledAt ?? a.dueDate
    return toLocalYMD(raw) === dateStr
  })


  const due: Activity[] = filteredActivities.filter((a) => a.status === "pending" && a.type === "task")
  const scheduledTasks: Activity[] = filteredActivities.filter((a) => a.type === "scheduledTask")
  const events: Activity[] = filteredActivities.filter((a) => a.type === "event")

  const sortByTime = (arr: Activity[]) =>
    [...arr].sort((a, b) => {
      const timeA = a.scheduledAt || a.dueDateTime || ""
      const timeB = b.scheduledAt || b.dueDateTime || ""
      return timeA.localeCompare(timeB)
    })

  return (
    <div>
      <AddScheduledOrEventModal
        type={type}
        isOpen={isAddScheduledOrEventModalOpen}
        currentDate={currentDate}
        onClose={() => {
          setIsAddScheduledOrEventModalOpen(false)
        }}
      ></AddScheduledOrEventModal>

      {/* Popover for selecting Task/Event type (Triggered by the Add Button) */}
      <IonPopover trigger="add-type-button" isOpen={showPopover} onDidDismiss={() => setShowPopover(false)} side="top" alignment="end">
        <IonContent>
          <IonList lines="none">
            <IonItem
              button
              onClick={() => {
                setType("scheduledTask")
                setIsAddScheduledOrEventModalOpen(true)
                setShowPopover(false)
              }}
            >
              <IonIcon icon={create} slot="start" color="warning"></IonIcon>
              <IonLabel>Add Task</IonLabel>
            </IonItem>
            <IonItem
              button
              onClick={() => {
                setType("event")
                setIsAddScheduledOrEventModalOpen(true)
                setShowPopover(false)
              }}
            >
              <IonIcon icon={create} slot="start" color="primary"></IonIcon>
              <IonLabel>Add Event</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonPopover>

      <div style={{ padding: "0.5rem" }}>
        {/* Header with date navigation */}
        <div
          style={{
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#f3f4f6",
            padding: "1rem",
            borderRadius: "0.5rem",
          }}
        >
          <button
            onClick={handlePrevDay}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.375rem",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <IonIcon icon={chevronBackOutline} style={{ fontSize: "1.5rem" }} />
          </button>

          <div style={{ textAlign: "center", flex: 1 }}>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                color: "#000000",
                margin: "0 0 0.25rem 0",
              }}
            >
              {dateString}
            </h2>
            {isToday && (
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#3b82f6",
                  fontWeight: "600",
                  margin: "0",
                }}
              >
                TODAY
              </p>
            )}
          </div>

          <button
            onClick={handleNextDay}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.375rem",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <IonIcon icon={chevronForwardOutline} style={{ fontSize: "1.5rem" }} />
          </button>
        </div>

        {/* Scheduled Tasks Section (Checkbox removed) */}
        {scheduledTasks.length > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "700",
                color: "#000000",
                marginBottom: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <IonIcon icon={flagOutline} style={{ fontSize: "1.25rem", color: "#f59e0b" }} />
              Scheduled Tasks ({scheduledTasks.length})
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {sortByTime(scheduledTasks).map((activity) => {
                const isCompleted = activity.status === "completed"
                const isMissed = activity.status === "missed"

                return (
                  <div
                    onClick={() => {
                      setSelectedActivityId(activity.id)
                      setIsScheduledAndEventModalOpen(true)
                    }}
                    key={activity.id}
                    style={{
                      padding: "1rem",
                      backgroundColor: isMissed ? "#fee2e2" : isCompleted ? "#ecfdf5" : "#fffbeb",
                      border: isMissed ? "1px solid #fca5a5" : isCompleted ? "1px solid #86efac" : "1px solid #fcd34d",
                      borderLeft: isMissed
                        ? "4px solid #ef4444"
                        : isCompleted
                          ? "4px solid #10b981"
                          : "4px solid #f59e0b",
                      borderRadius: "0.375rem",
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.75rem",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h4
                          style={{
                            margin: "0 0 0.5rem 0",
                            fontSize: "0.95rem",
                            fontWeight: "600",
                            color: "#000000",
                            textDecoration: isCompleted ? "line-through" : "none",
                          }}
                        >
                          {activity.name}
                        </h4>
                        <p
                          style={{
                            margin: "0",
                            fontSize: "0.875rem",
                            color: "#6b7280",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <IonIcon icon={timeOutline} style={{ fontSize: "1rem" }} />
                          {activity.scheduledAt
                            ? new Date(activity.scheduledAt).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                            : "No time set"}
                        </p>
                        {activity.status && (
                          <p
                            style={{
                              margin: "0.5rem 0 0 0",
                              fontSize: "0.75rem",
                              color: isMissed ? "#dc2626" : isCompleted ? "#059669" : "#d97706",
                              fontWeight: "600",
                              textTransform: "uppercase",
                            }}
                          >
                            {activity.status}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Events Section (UNCHANGED) */}
        {events.length > 0 && (
          <div
            style={{ marginBottom: "1.5rem" }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "700",
                color: "#000000",
                marginBottom: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: "1.25rem", color: "#3b82f6" }} />
              Events ({events.length})
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {sortByTime(events).map((activity) => {
                 const isCompleted = activity.status === "completed"
                const isMissed = activity.status === "missed"
                return ( 
                <div
                  key={activity.id}
                  style={{
                    padding: "1rem",
                    backgroundColor: "#dbeafe",
                    border: "1px solid #93c5fd",
                    borderRadius: "0.375rem",
                    borderLeft: "4px solid #3b82f6",
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setSelectedActivityId(activity.id)
                    setIsScheduledAndEventModalOpen(true)
                  }}
                >
                  <h4
                    style={{
                      margin: "0 0 0.5rem 0",
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      color: "#000000",
                    }}
                  >
                    {activity.name}
                  </h4>
                  {activity.description && (
                    <p
                      style={{
                        margin: "0 0 0.5rem 0",
                        fontSize: "0.875rem",
                        color: "#6b7280",
                      }}
                    >
                      {activity.description}
                    </p>
                  )}
                  <p
                    style={{
                      margin: "0",
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <IonIcon icon={timeOutline} style={{ fontSize: "1rem" }} />
                    {activity.scheduledAt
                      ? new Date(activity.scheduledAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : "No time set"}
                  </p>
                  {activity.status && (
                          <p
                            style={{
                              margin: "0.5rem 0 0 0",
                              fontSize: "0.75rem",
                              color: isMissed ? "#dc2626" : isCompleted ? "#059669" : "#d97706",
                              fontWeight: "600",
                              textTransform: "uppercase",
                            }}
                          >
                            {activity.status}
                          </p>
                        )}
                </div>
                ) })}
            </div>
          </div>
        )}

        {/* Due Tasks Section (UNCHANGED) */}
        {due.length > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "700",
                color: "#000000",
                marginBottom: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <IonIcon icon={flagOutline} style={{ fontSize: "1.25rem", color: "#ef4444" }} />
              Due in this day ({due.length})
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {due.map((task) => (
                <Link key={task.id} to={`/tab/home`}>
                  <div
                    style={{
                      padding: "1rem",
                      backgroundColor: "#fee2e2",
                      border: "1px solid #fca5a5",
                      borderLeft: "4px solid #ef4444",
                      borderRadius: "0.375rem",
                      marginBottom: "0.75rem",
                    }}
                    onClick={() => {
                      setSelectedActivityId(task.id)
                      setIsTaskDetailsModalOpen(true)
                    }}
                  >
                    <h4
                      style={{
                        margin: "0 0 0.5rem 0",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#000000",
                      }}
                    >
                      {task.name}
                    </h4>

                    {task.description && (
                      <p
                        style={{
                          margin: "0 0 0.5rem 0",
                          fontSize: "0.875rem",
                          color: "#6b7280",
                        }}
                      >
                        {task.description}
                      </p>
                    )}

                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <IonIcon icon={timeOutline} style={{ fontSize: "1rem" }} />
                      {task.dueDate}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty state (UNCHANGED) */}
        {due.length === 0 && scheduledTasks.length === 0 && events.length === 0 && (
          <div
            style={{
              padding: "3rem 1rem",
              textAlign: "center",
              backgroundColor: "#f9fafb",
              borderRadius: "0.375rem",
              border: "1px dashed #d1d5db",
            }}
          >
            <p
              style={{
                fontSize: "0.95rem",
                color: "#6b7280",
                margin: "0",
              }}
            >
              No tasks or events scheduled for this day
            </p>
          </div>
        )}
      </div>

      {/* NEW IMPLEMENTATION: Permanent Stacked Buttons using custom divs/buttons */}
      <div
        style={{
          position: "fixed",
          bottom: "80px",
          right: "20px",
          zIndex: 99999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Back to Calendar Button (permanently visible if available) */}
        {onBackToCalendar && (
          <CustomFabButton
            icon={closeOutline}
            color="#9ca3af" // Gray color
            onClick={onBackToCalendar}
          />
        )}

        {/* Go to Today Button (permanently visible if not today) */}
        {!isToday && (
          <CustomFabButton
            icon={todayOutline}
            color="#2563eb" // Blue color
            onClick={handleToday}
          />
        )}
        
        {/* Main Add Button (triggers popover) */}
        <button
          id="add-type-button"
          onClick={() => setShowPopover(true)}
          style={{
            ...fabButtonStyle,
            backgroundColor: "#3b82f6", // Primary blue color
            marginBottom: "0", // No margin on the last button
          }}
        >
          <IonIcon icon={add} style={{ color: "white", fontSize: "24px" }} />
        </button>
      </div>
    </div>
  )
}