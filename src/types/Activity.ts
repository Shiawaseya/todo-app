export interface Activity {
  id: string | null;
  name: string;
  status?: "pending" | "completed" | "missed";
  scheduledAt?: string | null;
  description: string | null;
  dueDate: string | null;
  dueDateTime: string | null;
  createdAt: string | null;
  type: "task" | "scheduledTask" | "event";
  remindBefore?: number | null;
}
