"use client"

import { IonItem, IonLabel, IonInput, IonTextarea } from "@ionic/react"

import { useAddActivityStore } from "../store/adding-activity-store"
interface TaskFormInputsProps {
  title: string
  description: string
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
}
import { shallow } from 'zustand/shallow'



export default function TaskFormInputs() {
  const name = useAddActivityStore((state) => state.name)
  const setName = useAddActivityStore((state) => state.setName)
  const description = useAddActivityStore((state) => state.description)
  const setDescription = useAddActivityStore((state) => state.setDescription)

  return (
    <>
      <IonItem>
        <IonLabel position="stacked">Task Name</IonLabel>
        <IonInput
          placeholder="Enter task name"
          value={name}
          onIonChange={(e) => setName(e.detail.value || "")}
          required={true}
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Description</IonLabel>
        <IonTextarea
          placeholder="Description/Optional"
          value={description ?? ''}
          onIonChange={(e) => setDescription(e.detail.value || "")}
          rows={4}
        />
      </IonItem>
    </>
  )
}
