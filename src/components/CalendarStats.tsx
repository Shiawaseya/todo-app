"use client"

import { IonIcon, IonCol, IonGrid, IonRow } from "@ionic/react"
import { listOutline, pinSharp, closeCircle } from "ionicons/icons"
import { useActivities } from "../hooks/useActivities"

/**
 * A reusable component to display calendar-specific activity statistics: 
 * Scheduled Tasks, Events, and Pending/Due tasks, as responsive side-by-side cards.
 */
export default function CalendarStats() {
  const { data: tasks = [] } = useActivities();

  // Calculate statistics based on task types and status
  const scheduledTask = tasks.filter(t => t.type === "scheduledTask").length;
  const event = tasks.filter(t => t.type === "event").length;
  
  // We interpret "Due" as pending tasks (type="task" AND status="pending")
  // matching the logic from the CalendarHeader component's "Due" count (inPending).
  const due = tasks.filter(t => t.status === "pending" && t.type === "task").length;

  const stats = [
    {
      label: "Scheduled Tasks",
      count: scheduledTask,
      icon: listOutline,
      color: "success",
      style: { backgroundColor: '#e6fff0' } // Light Green
    },
    {
      label: "Events",
      count: event,
      icon: pinSharp,
      color: "warning",
      style: { backgroundColor: '#fffbe6' } // Light Yellow
    },
    {
      label: "Due",
      count: due,
      icon: closeCircle,
      color: "danger",
      style: { backgroundColor: '#ffe6e6' } // Light Red
    },
  ];

  return (
    <IonGrid style={{
      padding: '8px',
      maxWidth: '600px', 
    }}>
      <IonRow className="ion-align-items-stretch ion-justify-content-start">
        {stats.map((stat, index) => (
          <IonCol 
            // Ensure three cards always fit side-by-side (4 + 4 + 4 = 12 columns).
            size="4" 
            key={index}
          >
            {/* Card container */}
            <div style={{
              display: 'flex', 
              alignItems: 'center', 
              padding: '12px 10px', 
              margin: '4px', 
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              ...stat.style,
              height: '100%', 
              minHeight: '70px',
            }}>
              
              {/* Icon */}
              <div style={{ marginRight: '8px' }}> 
                <IonIcon icon={stat.icon} color={stat.color} size="small" />
              </div>
              
              {/* Count and Label */}
              <div>
                <h3 style={{ 
                  margin: '0', 
                  fontSize: '1.1rem', 
                  fontWeight: '700', 
                  color: '#1a1a1a' 
                }}>
                  {stat.count}
                </h3>
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.75rem', 
                  color: '#444', 
                  fontWeight: '500' 
                }}>
                  {stat.label}
                </p>
              </div>
            </div>
          </IonCol>
        ))}
      </IonRow>
    </IonGrid>
  )
}