"use client";

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import { add } from "ionicons/icons";
import TaskHeader from "./task-header";
import TaskList from "./task-list";
import TaskDetailModal from "./task-detail-modal";
import AddTaskModal from "./add-task-modal";
import { useModalStore } from "../store/modal-store";
import ConfirmationModal from "./ConfirmationModal";
import { useState } from "react";
import { useDeleteActivitiesByStatus } from "../hooks/useActivities";
import { useAddActivityStore } from "../store/adding-activity-store";
import ActivityStats from "./ActivityStats";
export default function HomeTab() {
  const isAddTaskModalOpen = useModalStore((state) => state.isAddTaskModalOpen);
  const setIsAddTaskModalOpen = useModalStore(
    (state) => state.setIsAddTaskModalOpen
  );
  const isTaskDetailsModalOpen = useModalStore(
    (state) => state.isTaskDetailsModalOpen
  );
  const setIsTaskDetailsModalOpen = useModalStore(
    (state) => state.setIsTaskDetailsModalOpen
  );

  const [open, setOpen] = useState(false);
  const deleteActivitiesByStatus = useDeleteActivitiesByStatus();

  const deleteItem = (status: "pending" | "completed" | "missed") => {
    deleteActivitiesByStatus.mutate(status);
  };

  const reset = useAddActivityStore((state) => state.reset);
  return (
    <>
      <IonContent fullscreen>
        <ConfirmationModal
          isOpen={open}
          message="Delete this item?"
          onConfirm={() => {
            deleteItem("pending");
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
        <div>
          <TaskHeader />
          {isTaskDetailsModalOpen ? (
            <TaskDetailModal
              isOpen={isTaskDetailsModalOpen}
              onClose={() => setIsTaskDetailsModalOpen(false)}
            />
          ) : (
            <>
            <ActivityStats></ActivityStats>
            <TaskList></TaskList>
            </>
          )}
        </div>

        <AddTaskModal
          isOpen={isAddTaskModalOpen}
          onClose={() => setIsAddTaskModalOpen(false)}
          onSave={() => {
            // Handle save task
            setIsAddTaskModalOpen(false);
          }}
        />

        <div
          style={{
            position: "fixed",
            bottom: "80px", // raise/lower this depending on footer height
            right: "20px",
            zIndex: 99999,
            opacity: 0.8,
          }}
        >
          <IonFab slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton
              color="primary"
              onClick={() => {
                reset();
                setIsAddTaskModalOpen(true)}
              }
            >
              <IonIcon icon={add}></IonIcon>
            </IonFabButton>
          </IonFab>
        </div>
      </IonContent>
    </>
  );
}
