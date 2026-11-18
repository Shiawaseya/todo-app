"use client"

import { IonCard, IonCardHeader, IonCardContent, IonIcon, IonBadge, IonGrid, IonRow, IonCol, IonHeader } from "@ionic/react"
import { checkmarkCircle, timeOutline, closeCircle, listOutline, checkmark, checkmarkOutline } from "ionicons/icons"
import { useActivities } from "../hooks/useActivities"



export default function TaskHeader() {
  return (
    <IonHeader style={{backgroundColor: "#f0f0f0"}}>
<IonGrid>
  <IonRow className="ion-align-items-start ion-justify-content-between">
    {/* Left side - Title */}
    <IonCol size="auto">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <IonIcon icon={checkmarkOutline} size="large" color="primary" />
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Tasks</h2>
      </div>
    </IonCol>
  </IonRow>
</IonGrid>

    </IonHeader>
  )
}
