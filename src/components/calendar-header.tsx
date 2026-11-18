"use client"

import { IonCard, IonCardHeader, IonCardContent, IonIcon, IonBadge, IonGrid, IonRow, IonCol, IonHeader } from "@ionic/react"
import { checkmarkCircle, timeOutline, closeCircle, listOutline, calendar, pinSharp } from "ionicons/icons"
import { useActivities } from "../hooks/useActivities"



export default function CalendarHeader() {

  const { data: tasks = [] } = useActivities();
  const completed = tasks.filter(t => t.status === "completed").length;
  const inPending = tasks.filter(t => t.status === "pending" && t.type === "task").length;
  const missed = tasks.filter(t => t.status === "missed").length;
  const scheduledTask = tasks.filter(t => t.type === "scheduledTask").length;
  const event = tasks.filter(t => t.type === "event").length;

  return (
    <IonHeader style={{backgroundColor: "#f0f0f0"}}>
<IonGrid>
  <IonRow className="ion-align-items-start ion-justify-content-between">
    {/* Left side - Title */}
    <IonCol size="auto">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <IonIcon icon={calendar} size="large" color="primary" />
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Calendar</h2>
      </div>
    </IonCol>
  </IonRow>
</IonGrid>

    </IonHeader>
  )
}
