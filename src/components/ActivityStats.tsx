"use client"

import { IonIcon, IonCol, IonGrid, IonRow } from "@ionic/react"
import { closeCircle, checkmarkCircle, timeOutline } from "ionicons/icons"
import { useActivities } from "../hooks/useActivities"

/**
 * A reusable component to display core activity completion statistics (Completed, Pending, and Missed)
 * as responsive, side-by-side cards, fixed to display in a single row on mobile.
 */
export default function ActivityStats() {
  const { data: tasks = [] } = useActivities();

  // Calculate statistics
  const completed = tasks.filter(t => t.status === "completed" && t.type === "task").length;
  const inPending = tasks.filter(t => t.status === "pending" && t.type === "task").length;
  const missed = tasks.filter(t => t.status === "missed" && t.type === "task").length;

  const stats = [
    {
      label: "Completed",
      count: completed,
      icon: checkmarkCircle,
      color: "success",
      style: { backgroundColor: '#e6fff0' }
    },
    {
      label: "Pending",
      count: inPending,
      icon: timeOutline,
      color: "warning",
      style: { backgroundColor: '#fffbe6' }
    },
    {
      label: "Missed",
      count: missed,
      icon: closeCircle,
      color: "danger",
      style: { backgroundColor: '#ffe6e6' }
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
            // FIX: Set size to 4 for all screens (default, xs, sm, md, lg) 
            // to ensure three cards always fit side-by-side (4 + 4 + 4 = 12 columns).
            size="4" 
            key={index}
          >
            {/* The "Card" container with styling */}
            <div style={{
              display: 'flex', 
              alignItems: 'center', 
              padding: '12px 10px', // Slightly reduced padding for tight fit
              margin: '4px', 
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              ...stat.style,
              height: '100%', 
              minHeight: '70px',
            }}>
              
              {/* Icon (Left side) */}
              <div style={{ marginRight: '8px' }}> {/* Reduced margin here too */}
                <IonIcon icon={stat.icon} color={stat.color} size="small" />
              </div>
              
              {/* Count and Label (Right side - stacked) */}
              <div>
                {/* Count */}
                <h3 style={{ 
                  margin: '0', 
                  fontSize: '1.1rem', // Slightly smaller font for better fit
                  fontWeight: '700', 
                  color: '#1a1a1a' 
                }}>
                  {stat.count}
                </h3>
                
                {/* Label */}
                <p style={{ 
                  margin: '0', 
                  fontSize: '0.75rem', // Slightly smaller font for better fit
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