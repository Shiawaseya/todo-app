"use client"

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonNote,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react"
import { 
    informationCircle, 
    codeSlash, 
    documentText, 
    send, 
    logoGithub, 
    mail, 
    star,
    chevronForward,
    happy 
} from "ionicons/icons" // Imported relevant icons for a modern look
export default function AboutTab() {
  return (
    <>
    <IonHeader style={{backgroundColor: "#f0f0f0"}}>
<IonGrid>
  <IonRow className="ion-align-items-start ion-justify-content-between">
    {/* Left side - Title */}
    <IonCol size="auto">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <IonIcon icon={informationCircle} size="large" color="primary" />
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>About Taskflow</h2>
      </div>
    </IonCol>
  </IonRow>
</IonGrid>

    </IonHeader>
        <IonContent fullscreen>
            
            {/* 1. App Introduction Card */}
            <div className="ion-padding-vertical">
                <IonCard className="ion-margin-horizontal" style={{ borderRadius: '12px', boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                    <IonCardHeader>
                        <IonCardTitle className="ion-text-center">
                            <IonIcon icon={happy} color="tertiary" style={{ fontSize: '32px' }} />
                            <h2 style={{ margin: '8px 0 0 0', fontWeight: 600, color: 'var(--ion-color-dark)' }}>TaskFlow</h2>
                        </IonCardTitle>
                        <p className="ion-text-center ion-padding-top" style={{ color: 'var(--ion-color-medium)' }}>
                            Your simple, elegant, and efficient way to manage daily activities and deadlines.
                        </p>
                    </IonCardHeader>
                    
                    <IonCardContent className="ion-padding-top">
                        <IonGrid>
                            <IonRow className="ion-text-center">
                                <IonCol>
                                    <IonNote style={{ fontSize: '14px', fontWeight: 500 }}>Version</IonNote>
                                    <h3 style={{ margin: 0 }}>1.0.0</h3>
                                </IonCol>
                                <IonCol>
                                    <IonNote style={{ fontSize: '14px', fontWeight: 500 }}>Build</IonNote>
                                    <h3 style={{ margin: 0 }}>20251210</h3>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonCardContent>
                </IonCard>
            </div>

            {/* 2. Legal and Information Section */}
            <h3 className="ion-padding-start" style={{ marginTop: '20px', color: 'var(--ion-color-medium)', fontWeight: 500 }}>
                Information & Legal
            </h3>
            <IonList lines="full" className="ion-margin-vertical">
                
                {/* Terms of Service */}
                <IonItem button detail={true}>
                    <IonIcon slot="start" icon={documentText} color="medium" />
                    <IonLabel>Terms of Service</IonLabel>
                    <IonIcon slot="end" icon={chevronForward} color="medium" />
                </IonItem>

                {/* Privacy Policy */}
                <IonItem button detail={true}>
                    <IonIcon slot="start" icon={documentText} color="medium" />
                    <IonLabel>Privacy Policy</IonLabel>
                    <IonIcon slot="end" icon={chevronForward} color="medium" />
                </IonItem>
                
                {/* Open Source Licenses */}
                <IonItem button detail={true}>
                    <IonIcon slot="start" icon={codeSlash} color="medium" />
                    <IonLabel>Open Source Licenses</IonLabel>
                    <IonIcon slot="end" icon={chevronForward} color="medium" />
                </IonItem>
            </IonList>

            {/* 3. Get Involved Section */}
            <h3 className="ion-padding-start" style={{ marginTop: '20px', color: 'var(--ion-color-medium)', fontWeight: 500 }}>
                Get Involved
            </h3>
            <IonList lines="full" className="ion-margin-vertical">
                
                {/* Rate the App */}
                <IonItem button detail={false} href="#" target="_blank">
                    <IonIcon slot="start" icon={star} color="warning" />
                    <IonLabel>Rate TaskFlow</IonLabel>
                </IonItem>

                {/* Send Feedback */}
                <IonItem button detail={false} href="mailto:support@taskflow.com">
                    <IonIcon slot="start" icon={send} color="primary" />
                    <IonLabel>Send Feedback</IonLabel>
                </IonItem>
                
                {/* Contact Developer */}
                <IonItem button detail={false} href="mailto:developer@taskflow.com">
                    <IonIcon slot="start" icon={mail} color="secondary" />
                    <IonLabel>Contact Developer</IonLabel>
                </IonItem>

                {/* View on GitHub */}
                <IonItem button detail={false} href="#" target="_blank">
                    <IonIcon slot="start" icon={logoGithub} />
                    <IonLabel>View Source Code</IonLabel>
                </IonItem>
            </IonList>

            {/* Footer */}
            <div className="ion-text-center ion-padding-top">
                <IonNote>
                    Made with ❤️ and Ionic React
                </IonNote>
            </div>
            <div className="ion-padding-bottom" style={{ height: '40px' }}/> {/* Padding for the bottom tab bar */}

        </IonContent>
    </>
  )
}