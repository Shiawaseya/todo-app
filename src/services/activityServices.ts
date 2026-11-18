import { getStorage } from "../storage";
import { Activity } from "../types/Activity";

function isActivityMissed(activity: Activity): boolean {
  if (activity.status === 'completed') {
    return false;
  }

  if (!activity.dueDate || !activity.dueDateTime) {
    return false;
  }
  const dueDateTimeString = `${activity.dueDate}T${activity.dueDateTime}:00`;
  const dueMoment = new Date(dueDateTimeString);
  const now = new Date();
  return dueMoment < now;
}

export async function getActivities(): Promise<Activity[]> {
  const activities = (await getStorage().get("activities")) || [];
  if (!Array.isArray(activities)) {
    return [];
  }
  console.log('Fetched activities from storage:', activities);
  return (activities as Activity[]).map(activity => ({
    ...activity,
    status: isActivityMissed(activity) ? "missed" : activity.status,
  })
);
}

// Save full list back to storage
async function saveActivities(list: Activity[]) {
  await getStorage().set("activities", list);
}

// Add new activity
export async function addActivity(activity: Activity) {
  const list = await getActivities();
  list.push(activity);
  await saveActivities(list);
}

// Update activity
export async function updateActivity(updatedActivity: Activity) {
  let list = await getActivities();
  list = list.map((item) => (item.id === updatedActivity.id ? updatedActivity : item));
  await saveActivities(list);
}

// Delete activity
export async function deleteActivity(id: string) {
  let list = await getActivities();
  list = list.filter((item) => item.id !== id);
  await saveActivities(list);
}

// Mark activity as completed
export async function markActivityAsCompleted(id: string) {
  let list = await getActivities();
  list = list.map((item) =>
    item.id === id ? { ...item, status: "completed" } : item
  );
  await saveActivities(list);
}

//Mark activity as incompleted
export async function markActivityAsIncompleted(id: string) {
  let list = await getActivities();
  list = list.map((item) =>
    item.id === id ? { ...item, status: "pending" } : item
  );
  await saveActivities(list);
}

//Delete all activities with specific status
export async function deleteActivitiesByStatus(status: "pending" | "completed" | "missed") {
  let list = await getActivities();
  list = list.filter((item) => item.type !== "task" || item.status !== status);
  
  await saveActivities(list);
}

//Mark all pending activities as completed
export async function markAllAsCompleted() {
  let list = await getActivities();
  list = list.map((item) =>
    item.status === "pending" && item.type === "task" ? { ...item, status: "completed" } : item
  );
  await saveActivities(list);
}

