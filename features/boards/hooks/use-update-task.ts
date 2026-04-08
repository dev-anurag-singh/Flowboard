"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { BoardWithData } from "@/features/boards/queries";

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
  const queryKey = ["boards", boardId];

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
    onMutate: async ({ taskId, data }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<BoardWithData>(queryKey);

      queryClient.setQueryData<BoardWithData>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          tasks: old.tasks.map((t) =>
            t.id === taskId ? { ...t, ...data } : t,
          ),
        };
      });

      return { previous };
    },
    onError: (err: Error, _, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
      toast.error(err.message);
    },
  });

  return { updateTask, isPending };
}
