import { LocalNotifications } from '@capacitor/local-notifications';
import { Activity } from './types/Activity';

/** Notification payload */
export interface LocalNotificationPayload {
  title: string;
  body: string;
  id: number;
  schedule: {
    at: Date;
    allowWhileIdle: boolean;
  };
  extra: {
    activityId: string | null | undefined;
    activityType: 'task' | 'scheduledTask' | 'event';
  };
}

/** Show pending notifications (for debugging) */
export const showScheduledNotifications = async () => {
  const pending = await LocalNotifications.getPending();
  console.log('Pending notifications:', pending);
  return pending;
};

// --- FIX START: Stable ID Generation ---

/**
 * Stable, collision-safe unique ID per activity.
 *
 * This function converts the string activityId (e.g., UUID) into a stable
 * integer ID required by Capacitor using a simple hash algorithm (DJB2).
 * This ensures that the ID used to schedule a notification is the exact
 * same ID used to cancel/update it later.
 */
const getStableNotificationId = (activityId: string): number => {
  // Use a string hash to generate a unique, stable integer ID
  let hash = 0;
  for (let i = 0; i < activityId.length; i++) {
    const char = activityId.charCodeAt(i);
    // DJB2 hash algorithm variant: hash * 31 + char
    hash = (hash << 5) - hash + char; 
    // Convert to a 32bit integer
    hash |= 0; 
  }
  // Return the absolute value modulo a large prime to fit within safe integer limits
  // (2,147,483,647 is the max signed 32-bit int, a good safe maximum for IDs)
  return Math.abs(hash) % 2147483647; 
};

// Remove the old notificationCounter and getNotificationId function
// --- FIX END ---


/** Call ONCE on app start */
export const initNotifications = async () => {
  const perm = await LocalNotifications.requestPermissions();
  if (!perm.display || perm.display === 'denied') {
    console.warn('Notifications permission not granted');
    return;
  }

  await LocalNotifications.createChannel({
    id: 'activity-reminders',
    name: 'Activity Reminders',
    importance: 5,
  });
};

/** Schedule activity notifications */
export const scheduleNotifications = async (activities: Activity[]) => {
  const notifications: LocalNotificationPayload[] = [];
  
  // 1. --- CANCELLATION FIX ---
  // Before scheduling new reminders, we must cancel any existing reminders 
  // for these activities to prevent duplicates. We use the *stable* ID.
  const idsToCancel = activities
    .filter(a => a.id)
    .map(a => ({ id: getStableNotificationId(a.id!) }));

  if (idsToCancel.length > 0) {
    try {
      await LocalNotifications.cancel({ notifications: idsToCancel });
    } catch (e) {
      console.error('Failed to cancel existing notifications:', e);
    }
  }
  // --- END CANCELLATION FIX ---
  await LocalNotifications.createChannel({
    id: 'activity-reminders',
    name: 'Activity Reminders',
    importance: 5,
  });
  for (const activity of activities) {
    let referenceTimeStr: string | null = null;

    if (activity.type === 'task' && activity.dueDate && activity.dueDateTime) {
      referenceTimeStr = `${activity.dueDate}T${activity.dueDateTime}:00`;
    } else if (
      (activity.type === 'scheduledTask' || activity.type === 'event') &&
      activity.scheduledAt
    ) {
      referenceTimeStr = activity.scheduledAt;
    }

    // Must have a valid ID to schedule a cancellable notification
    if (!activity.id || !referenceTimeStr || activity.remindBefore == null) continue;

    const referenceDate = new Date(referenceTimeStr);
    if (isNaN(referenceDate.getTime())) continue;

    // Calculate notification time in the past (in milliseconds)
    const notificationTime = new Date(
      referenceDate.getTime() - activity.remindBefore * 60 * 1000
    );

    // Skip notifications scheduled in the past
    if (notificationTime.getTime() <= Date.now()) continue;

    notifications.push({
      // 2. --- SCHEDULING FIX ---
      // Use the new, stable ID function here as well
      id: getStableNotificationId(activity.id),
      // --- END SCHEDULING FIX ---
      title:
        activity.remindBefore === 0
          ? `It's time for: ${activity.name}`
          : `Reminder: ${activity.name}`,
      body: activity.description || 'Time to get started!',
      schedule: {
        at: notificationTime,
        allowWhileIdle: true,
      },
      extra: {
        activityId: activity.id,
        activityType: activity.type,
      },
    });
  }

  if (!notifications.length) return;

  await LocalNotifications.schedule({
    notifications: notifications.map(n => ({
      ...n,
      channelId: 'activity-reminders',
    })),
  });

  // Show scheduled notifications in console
  await showScheduledNotifications();
};