import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getActivities, addActivity, updateActivity, deleteActivity,deleteActivitiesByStatus, markAllAsCompleted, markActivityAsCompleted, markActivityAsIncompleted} from "../services/activityServices";
import { Activity } from "../types/Activity";



export function useActivities() {
  return useQuery<Activity[]>({
    queryKey: ["activities"],
    queryFn: getActivities,
  });
}

export function useAddActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addActivity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["activities"] }),
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateActivity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["activities"] }),
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["activities"] }),
  });
}

export function useDeleteActivitiesByStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteActivitiesByStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["activities"] }),
  });
}

export function useMarkAllAsCompleted() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllAsCompleted,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["activities"] }),
  });
}

export function useMarkActivityAsCompleted() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markActivityAsCompleted,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["activities"] }),
  });
}

export function useMarkActivityAsIncompleted() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markActivityAsIncompleted,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["activities"] }),
  });
}



