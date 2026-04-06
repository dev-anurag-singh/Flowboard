"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type UpdateTaskData = {
  taskId: string;
  data: {
    title?: string;
    description?: string;
    columnId?: string;
    completed?: boolean;
  };
};

export function useUpdateTask(boardId: string) {
  const queryClient = useQueryClient();

  const { mutate: updateTask, isPending } = useMutation({
    mutationFn: async ({ taskId, data }: UpdateTaskData) => {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards", boardId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { updateTask, isPending };
}
