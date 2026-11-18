"use client";

import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonAccordion,
  IonAccordionGroup,
  IonGrid,
  IonRow,
  IonCol,
  IonContent,
  IonPopover,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import {
  checkmarkCircle,
  closeCircle, // Re-added
  create,
  trash,
  arrowUp,
  arrowDown,
  swapVerticalSharp,
  ellipsisVertical,
} from "ionicons/icons";
import { useActivities, useUpdateActivity } from "../hooks/useActivities"; // Keep useUpdateActivity for manual status changes
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import {
  useDeleteActivitiesByStatus,
  useMarkAllAsCompleted,
} from "../hooks/useActivities";
import { useModalStore } from "../store/modal-store";
import { useSortingConfigStore } from "../store/sorting-config-store";
import { useSelectedActivityStore } from "../store/Selected-activity-store";

// Define the structure for an Activity to ensure type safety
interface Activity {
  id: string | null;
  name: string;
  status?: "pending" | "completed" | "missed"; // Restored 'missed' status
  description: string | null;
  dueDate: string | null;
  dueDateTime: string | null;
  createdAt: string | null;
  type: "task" | "scheduledTask" | "event";
}

type Status = "pending" | "completed" | "missed" | null; // Restored 'missed' type

/**
 * Maps the activity status to Ionic colors and icons.
 * Restored 'missed' case logic.
 */
const getStatusProps = (status: Status | undefined) => {
  switch (status) {
    case "completed":
      return {
        icon: checkmarkCircle,
        iconColor: "success",
        textStyle: {
          textDecoration: 'line-through',
          color: 'var(--ion-color-medium)'
        },
        itemClass: 'status-completed',
      };
    case "missed": // Missed status restored
      return {
        icon: closeCircle,
        iconColor: "danger",
        textStyle: {
          color: 'var(--ion-color-danger-shade)'
        },
        itemClass: 'status-missed',
      };
    case "pending":
    default:
      return {
        icon: checkmarkCircle,
        iconColor: "medium",
        textStyle: {
          fontWeight: 600
        },
        itemClass: 'status-pending',
      };
  }
};

export default function TaskList() {
  // Retained useUpdateActivity in case it is used elsewhere for manual updates
  // or if you add a manual "Mark as Missed" button later.
  // const updateActivityMutation = useUpdateActivity(); 

  const setIsTaskDetailsModalOpen = useModalStore(
    (state) => state.setIsTaskDetailsModalOpen
  );
  const setSelectedActivityId = useSelectedActivityStore(
    (state) => state.setSelectedActivityId
  );

  // Confirmation modal state
  const [open, setOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [confirmationFn, setConfirmationFn] = useState<() => void>(() => {});

  const { data: tasksData = [] } = useActivities();
  const tasks = tasksData ?? [];

  // Task filtering - 'missedTasks' restored
  const pendingTasks = tasks.filter(
    (t: Activity) => t.status === "pending" && t.type === "task"
  ) as Activity[];
  const completedTasks = tasks.filter(
    (t: Activity) => t.status === "completed" && t.type === "task"
  ) as Activity[];
  const missedTasks = tasks.filter( // Restored missed tasks filtering
    (t: Activity) => t.status === "missed" && t.type === "task"
  ) as Activity[];

  const [showMenu, setShowMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Mutation hooks
  const deleteActivitiesByStatus = useDeleteActivitiesByStatus();
  const markAllAsCompleted = useMarkAllAsCompleted();

  // Restored 'missed' status for deleteItem
  const deleteItem = (status: "pending" | "completed" | "missed") => {
    deleteActivitiesByStatus.mutate(status);
  };

  // Sorting store
  const sortBy = useSortingConfigStore((state) => state.sortBy);
  const sortOrder = useSortingConfigStore((state) => state.sortOrder);
  const setSortBy = useSortingConfigStore((state) => state.setSortBy);
  const setSortOrder = useSortingConfigStore((state) => state.setSortOrder);

  // ⚠️ REMOVED: The useEffect hook that auto-updated status to 'missed' 
  // and caused continuous re-renders is REMOVED as requested.

  // In-component sorting logic for Pending Tasks
  pendingTasks.sort((a, b) => {
    let dateA = 0;
    let dateB = 0;

    if (sortBy === "dueDate") {
      const dateAVal = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateBVal = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;

      if (sortOrder === "asc") {
        return dateAVal - dateBVal;
      } else {
        if (dateAVal === Infinity) return 1;
        if (dateBVal === Infinity) return -1;
        return dateBVal - dateAVal;
      }
    } else if (sortBy === "creationDate") {
      dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    }

    if (sortBy === "creationDate") {
      if (sortOrder === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    }
    return 0;
  });


  // --- Component Render ---
  return (
    <div>
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={open}
        message={confirmationMessage}
        onConfirm={() => {
          confirmationFn();
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />

      {/* Utility Menu Popover - Restored 'missed' deletion option */}
      <IonPopover
        trigger="menu-button"
        isOpen={showMenu}
        onDidDismiss={() => setShowMenu(false)}
      >
        <IonContent>
          <IonList>
            <IonItem
              button
              onClick={() => {
                setConfirmationMessage(
                  "Are you sure you want to mark all pending tasks as completed?"
                );
                setConfirmationFn(() => () => markAllAsCompleted.mutate());
                setOpen(true);
                setShowMenu(false);
              }}
            >
              <IonIcon icon={create} slot="start" color="success"></IonIcon>
              <IonLabel color="success">Mark all as completed</IonLabel>
            </IonItem>
            <IonItem
              button
              onClick={() => {
                setConfirmationMessage(
                  "Are you sure you want to delete all pending tasks?"
                );
                setConfirmationFn(() => () => deleteItem("pending"));
                setOpen(true);
                setShowMenu(false);
              }}
            >
              <IonIcon icon={trash} slot="start" color="danger"></IonIcon>
              <IonLabel color="danger">Delete all pending</IonLabel>
            </IonItem>
            <IonItem
              button
              onClick={() => {
                setConfirmationMessage(
                  "Are you sure you want to delete all completed tasks?"
                );
                setConfirmationFn(() => () => deleteItem("completed"));
                setOpen(true);
                setShowMenu(false);
              }}
            >
              <IonIcon icon={trash} slot="start" color="danger"></IonIcon>
              <IonLabel color="danger">Delete all completed</IonLabel>
            </IonItem>
            <IonItem
              button
              onClick={() => { // Missed deletion option restored
                setConfirmationMessage(
                  "Are you sure you want to delete all missed tasks?"
                );
                setConfirmationFn(() => () => deleteItem("missed"));
                setOpen(true);
                setShowMenu(false);
              }}
            >
              <IonIcon icon={trash} slot="start" color="danger"></IonIcon>
              <IonLabel color="danger">Delete all missed</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonPopover>

      {/* Sort Menu Popover (Unchanged) */}
      <IonPopover
        trigger="sort-button"
        isOpen={showSortMenu}
        onDidDismiss={() => setShowSortMenu(false)}
      >
        <IonContent className="ion-padding">
          <div className="ion-padding-bottom">
            <IonLabel>Sort By</IonLabel>
            <IonSegment
              value={sortBy}
              onIonChange={(e) =>
                setSortBy(e.detail.value as "dueDate" | "creationDate")
              }
            >
              <IonSegmentButton value="dueDate">
                <IonLabel>Due Date</IonLabel>
              </IonSegmentButton>

              <IonSegmentButton value="creationDate">
                <IonLabel>Date Added</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </div>

          <div className="ion-padding-top">
            <IonLabel>Order</IonLabel>
            <IonSegment
              value={sortOrder}
              onIonChange={(e) =>
                setSortOrder(e.detail.value as "asc" | "desc")
              }
            >
              <IonSegmentButton value="asc">
                <IonIcon icon={arrowUp} />
              </IonSegmentButton>

              <IonSegmentButton value="desc">
                <IonIcon icon={arrowDown} />
              </IonSegmentButton>
            </IonSegment>
          </div>
        </IonContent>
      </IonPopover>

      {/* Main Tasks Card */}
      <div className="ion-padding">
        <IonCard style={{padding:0}}>
          <IonCardHeader>
            <IonGrid style={{ padding: 0, width: "100%" }}>
              <IonRow style={{ alignItems: "center" }}>
                <IonCol style={{ textAlign: "start" }}>
                </IonCol>
                <IonCol style={{ textAlign: "end" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "8px",
                    }}
                  >
                    <IonIcon
                      icon={swapVerticalSharp}
                      color="medium"
                      id="sort-button"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowSortMenu(true)}
                    />
                    <IonIcon
                      icon={ellipsisVertical}
                      color="medium"
                      id="menu-button"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowMenu(true)}
                    />
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardHeader>

          <IonCardContent style={{ maxHeight: "500px", overflowY: "auto", padding: 0 }}>
            {/* Subheader Row */}
            {pendingTasks.length > 0 && (
                <IonGrid style={{ width: "100%", padding: "0 12px 8px 12px" }}>
                  <IonRow
                    style={{
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <IonCol size="auto">
                      <IonLabel
                        style={{ fontSize: "14px", fontWeight: 600, color: "gray" }}
                      >
                        Name
                      </IonLabel>
                    </IonCol>
                    <IonCol size="auto" style={{ textAlign: "right" }}>
                      <IonLabel
                        style={{ fontSize: "14px", fontWeight: 600, color: "gray" }}
                      >
                        Due Date
                      </IonLabel>
                    </IonCol>
                  </IonRow>
                </IonGrid>
            )}

            {/* Pending Task List */}
            <IonList lines="inset">
              {pendingTasks.length === 0 ? (
                completedTasks.length === 0 ? 
                (<IonItem lines="none">
                    <IonLabel color="medium">No tasks available. Add some tasks to get started!</IonLabel>
                </IonItem>)
                :(
                
                <IonItem lines="none">
                    <IonLabel color="medium">No pending tasks. Keep up the good work!</IonLabel>
                </IonItem>
                )
              ) : (
                pendingTasks.map((task) => {
                  const props = getStatusProps(task.status);
                  return (
                    <IonItem
                      key={task.id}
                      
                      button
                      onClick={() => {
                        setSelectedActivityId(task.id);
                        setIsTaskDetailsModalOpen(true);
                      }}
                      detail={true}
                    >
                      {/* Using an empty space for alignment with completed/missed tasks */}
                      
                      <IonGrid style={{ width: "100%", padding: 0 }}>
                        <IonRow
                          style={{
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <IonCol style={{testAlign: "left"}}>
                            <IonLabel>
                              <h3 style={{ margin: 0,}}>
                                {task.name}
                              </h3>
                            </IonLabel>
                          </IonCol>
                          <IonCol size="auto" style={{ textAlign: "right" }}>
                            <p
                              style={{
                                fontSize: "14px",
                                margin: 0,
                                color: "var(--ion-color-medium)",
                              }}
                            >
                              {task.dueDate}
                            </p>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonItem>
                  );
                })
              )}
            </IonList>
          </IonCardContent>
        </IonCard>
      </div>

      {/* Expandable Sections */}
      <IonAccordionGroup style={{ borderRadius: "12px", boxShadow: "none" }}>

        {/* Completed Section */}
        <IonAccordion value="completed" color="success">
          <IonItem slot="header" color="success" >
            <IonLabel style={{ fontWeight: 600, fontSize: "16px" }}>
              Completed
            </IonLabel>
          </IonItem>
          <div slot="content" style={{ padding: "4px 12px" }}>
            <IonList lines="none">
              {completedTasks.length === 0 ? (
                <IonItem>
                    <IonLabel color="medium">No completed tasks yet.</IonLabel>
                </IonItem>
              ) : (
                completedTasks.map((task) => {
                  const props = getStatusProps(task.status);
                  return (
                    <IonItem
                      key={task.id}
                      lines="inset"
                      button
                      className={props.itemClass}
                      onClick={() => {
                        setSelectedActivityId(task.id);
                        setIsTaskDetailsModalOpen(true);
                      }}
                      detail={true}
                    >
                      <IonIcon slot="start" icon={props.icon} color={props.iconColor} />
                      <IonLabel>
                        <h3 style={{ margin: 0, ...props.textStyle }}>{task.name}</h3>
                      </IonLabel>
                      <div slot="end">
                        <p
                          style={{
                            fontSize: "14px",
                            color: "var(--ion-color-medium)",
                            margin: 0,
                          }}
                        >
                          {task.dueDate}
                        </p>
                      </div>
                    </IonItem>
                  );
                })
              )}
            </IonList>
          </div>
        </IonAccordion>

        {/* Missed Section - Restored */}
        <IonAccordion value="missed">
          <IonItem slot="header" className="status-missed-header" color="danger">
            <IonLabel style={{ fontWeight: 600, fontSize: "16px",color: "light" }} color={"light"}>
              <div style={{color:"light"}}>
                  Missed
</div>
            </IonLabel>
          </IonItem>
          <div slot="content" style={{ padding: "4px 12px" }}>
            <IonList lines="none">
              {missedTasks.length === 0 ? (
                <IonItem>
                    <IonLabel color="medium">No missed tasks. Phew!</IonLabel>
                </IonItem>
              ) : (
                missedTasks.map((task) => {
                  const props = getStatusProps(task.status);
                  return (
                    <IonItem
                      key={task.id}
                      lines="inset"
                      button
                      className={props.itemClass}
                      onClick={() => {
                        setSelectedActivityId(task.id);
                        setIsTaskDetailsModalOpen(true);
                      }}
                      detail={true}
                    >
                      <IonIcon slot="start" icon={props.icon} color={props.iconColor} />
                      <IonLabel>
                        <h3 style={{ margin: 0, ...props.textStyle }}>{task.name}</h3>
                      </IonLabel>
                      <div slot="end">
                        <p
                          style={{
                            fontSize: "14px",
                            color: "var(--ion-color-medium)",
                            margin: 0,
                          }}
                        >
                          {task.dueDate}
                        </p>
                      </div>
                    </IonItem>
                  );
                })
              )}
                      </IonList>
          </div>
        </IonAccordion>
      </IonAccordionGroup>
    </div>
  );
}