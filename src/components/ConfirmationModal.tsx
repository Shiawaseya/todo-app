import { IonAlert } from "@ionic/react";

type Props = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
};

export default function ConfirmationAlert({
  isOpen,
  onConfirm,
  onCancel,
  message,
}: Props) {
  return (
    <IonAlert
      isOpen={isOpen}
      onDidDismiss={onCancel} // Dismissal is handled by the alert when a button is clicked
      header={"Confirm Action"}
      message={message}
      buttons={[
        {
          text: "Cancel",
          role: "cancel", // Standard role for Ionic alert buttons
          cssClass: "alert-button-cancel", // Optional class for styling
          handler: onCancel,
        },
        {
          text: "Confirm",
          role: "destructive", // Use 'destructive' role for the confirmation action (often styled with red)
          cssClass: "alert-button-confirm", // Optional class for styling
          handler: onConfirm,
        },
      ]}
    />
  );
}