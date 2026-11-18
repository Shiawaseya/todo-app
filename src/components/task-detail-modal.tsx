"use client"

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonButtons,
  IonPopover,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
} from "@ionic/react"
import { chevronBack, ellipsisVertical, trash, checkmarkDone, refreshCircle } from "ionicons/icons"
import { useState } from "react"
import { format } from "date-fns"
import { useActivities } from "../hooks/useActivities"
import { useSelectedActivityStore } from "../store/Selected-activity-store"
import ConfirmationModal from "./ConfirmationModal"
import { useDeleteActivity, useMarkActivityAsCompleted, useMarkActivityAsIncompleted,useUpdateActivity } from "../hooks/useActivities"

interface Activity {
  id: string | null
  name: string
  status?: "pending" | "completed" | "missed"
  description: string | null
  dueDate: string | null
  dueDateTime: string | null
  createdAt: string | null
  type: "task" | "scheduledTask" | "event"
}

type Status = "pending" | "completed" | "missed" | null

interface TaskDetailModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit?: (activity: Activity) => void
  onDelete?: (activityId: string) => void
}

export default function TaskDetailModal({ isOpen, onClose, onEdit, onDelete }: TaskDetailModalProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [editableName, setEditableName] = useState("")
  const [editableDescription, setEditableDescription] = useState("")
  const [editableDueDate, setEditableDueDate] = useState("")
  const [editableDueTime, setEditableDueTime] = useState("")

  const selectedActivityId = useSelectedActivityStore((state) => state.selectedActivityId)
  const { data: activities = [] } = useActivities()
  const selectedActivity = activities.find((activity) => activity.id === selectedActivityId) as Activity | undefined

  //Confirmation modal state
  const [open, setOpen] = useState(false)
  const [confirmationMessage, setConfirmationMessage] = useState("")
  const [confirmationFn, setConfirmationFn] = useState<() => void>(() => {})
  const [confirmationTaskStatus, setConfirmationTaskStatus] = useState<Status>(null)

  const deleteActivity = useDeleteActivity()
  const markActivityAsCompleted = useMarkActivityAsCompleted()
  const markActivityAsIncompleted = useMarkActivityAsIncompleted()
  const updateActivity = useUpdateActivity()

  if (!selectedActivityId || !selectedActivity) {
    return null
  }

  if (editableName === "" && selectedActivity.name) {
    setEditableName(selectedActivity.name)
  }
  if (editableDescription === "" && selectedActivity.description) {
    setEditableDescription(selectedActivity.description)
  }
  if (editableDueDate === "" && selectedActivity.dueDate) {
    setEditableDueDate(selectedActivity.dueDate)
  }
  if (editableDueTime === "" && selectedActivity.dueDateTime) {
    setEditableDueTime(selectedActivity.dueDateTime)
  }

  const handleChange = (data: Activity) => {
    console.log(data);
    updateActivity.mutate(data);
  };
  return (
    <>
      {isOpen && (
        <>
          <ConfirmationModal
            isOpen={open}
            message={confirmationMessage}
            onConfirm={() => {
              confirmationFn()
              setOpen(false)
            }}
            onCancel={() => setOpen(false)}
          />
          <IonHeader style={{ overFlow: "hidden", padding:0}}>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={onClose}>
                  <IonIcon icon={chevronBack}></IonIcon>
                </IonButton>
              </IonButtons>
              <IonTitle>Details</IonTitle>
              <IonButtons slot="end">
                <IonButton id="menu-button" onClick={() => setShowMenu(true)}>
                  <IonIcon icon={ellipsisVertical}></IonIcon>
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          
          <IonContent fullscreen  className="ion-padding ion-safe-area-top ion-safe-area-bottom "  scrollY={false}>
            <div style={{ padding: "16px", overflowY: "hidden" }}>
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "600", color: "#666" }}>Name</h3>
                <IonInput
                  disabled={selectedActivity.status === "missed"}
                  value={selectedActivity.name }
                  onIonChange={(e) => 
                    handleChange(
                      {...selectedActivity, name: String(e.detail.value)}
                    )
                  }
                  placeholder="Enter task name"
                  style={{
                    fontSize: "16px",
                    borderRadius: "4px",
                    padding: "8px 12px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "600", color: "#666" }}>Description</h3>
                <IonTextarea
                  disabled={selectedActivity.status === "missed"}
                  value={selectedActivity.description }
                  onIonChange={(e) => 
                    handleChange(
                      {...selectedActivity, description: String(e.detail.value)}
                    )
                  }
                  placeholder="Enter description"
                  rows={4}
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "600", color: "#666" }}>Due Date</h3>
                <IonInput
                  disabled={selectedActivity.status === "missed"}
                  type="date"
                  value={selectedActivity.dueDate || editableDueDate}
                  onIonChange={
                    (e) => {
                      handleChange(
                        {...selectedActivity, dueDate: String(e.detail.value)}
                      )
                    }
                  }
                  placeholder="Select due date"
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    borderRadius: "4px",
                    padding: "8px 12px",
                  }}
                />
                <IonInput
                  disabled={selectedActivity.status === "missed"}
                  type="time"
                  value={selectedActivity.dueDateTime || editableDueTime}
                  onIonChange={(e) => 
                    handleChange(
                      {...selectedActivity, dueDateTime: String(e.detail.value)}
                    )
                  }
                  placeholder="Select due time"
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    borderRadius: "4px",
                    padding: "8px 12px",
                  }}
                />
              </div>

              {selectedActivity.createdAt && (
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "600", color: "#666" }}>Created</h3>
                  <p style={{ margin: "0", fontSize: "16px", color: "#000" }}>
                    {format(new Date(selectedActivity.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
              )}
            </div>
          </IonContent>

          <IonPopover trigger="menu-button" isOpen={showMenu} onDidDismiss={() => setShowMenu(false)}>
            <IonContent>
              <IonList>
                <IonItem
                  button
                  onClick={() => {
                    setConfirmationMessage("Are you sure you want to delete this activity?")
                    setConfirmationFn(() => () => {
                      deleteActivity.mutate(selectedActivity.id!)
                      onClose()
                    })
                    setOpen(true)
                    setShowMenu(false)
                  }}
                >
                  <IonIcon icon={trash} slot="start"></IonIcon>
                  <IonLabel>Delete</IonLabel>
                </IonItem>
                {selectedActivity.status !== "completed" && selectedActivity.id && selectedActivity.status !== "missed" && (
                  <IonItem
                    button
                    onClick={() => {
                      setConfirmationMessage("Are you sure you want to mark this activity as completed?");
                      setConfirmationFn(() => () => {
                        markActivityAsCompleted.mutate(selectedActivity.id!);
                        onClose();
                      });
                      setOpen(true);
                      setShowMenu(false);
                    }}
                  >
                    <IonIcon icon={checkmarkDone} slot="start" />
                    <IonLabel>Mark as completed</IonLabel>
                  </IonItem>
                )}

                {selectedActivity.status === "completed" &&
                selectedActivity.id && (
                  <IonItem
                    button
                    onClick={() => {
                      setConfirmationMessage("Are you sure you want to mark this activity as pending?");
                      setConfirmationFn(() => () => {
                        markActivityAsIncompleted.mutate(selectedActivity.id!);
                        onClose();
                      });
                      setOpen(true);
                      setShowMenu(false);
                    }}
                  >
                    <IonIcon icon={refreshCircle} slot="start" />
                    <IonLabel>Mark as pending</IonLabel>
                  </IonItem>
                )}

              </IonList>
            </IonContent>
          </IonPopover>
        </>
      )}
    </>
  )
}
