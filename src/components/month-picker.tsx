"use client"

import {
  IonDatetime,
  IonButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/react"
import { useState } from "react"
import { useAddActivityStore } from "../store/adding-activity-store"

export default function MonthPicker() {
  const [isOpen, setIsOpen] = useState(false)

  const dueDate = useAddActivityStore((state) => state.dueDate)
  const setDueDate = useAddActivityStore((state) => state.setDueDate)

  const handleChange = (e: any) => {
    const newValue = e.detail.value as string
    setDueDate(newValue)
    setIsOpen(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <IonButton expand="block" color="primary" onClick={() => setIsOpen(true)}>
        📅 Select Month:{" "}
        {new Date(dueDate ?? new Date().toISOString()).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })}
      </IonButton>

      <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Select Month</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <IonDatetime
            value={dueDate ?? new Date().toISOString()}
            onIonChange={handleChange}
            presentation="month"
            size="cover"
          />

          <IonButton expand="block" color="medium" onClick={() => setIsOpen(false)} className="mt-4">
            Close
          </IonButton>
        </IonContent>
      </IonModal>
    </div>
  )
}
