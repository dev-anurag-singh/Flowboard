"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { BoardWithData } from "@/features/boards/queries";

export function useDeleteTask(boardId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["boards", boardId];

  const { mutate: deleteTask, isPending } = useMutation({
    mutationFn: async (taskId: string) => {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json.data;
    },
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<BoardWithData>(queryKey);

      queryClient.setQueryData<BoardWithData>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          tasks: old.tasks.filter((t) => t.id !== taskId),
        };
      });

      return { previous };
    },
    onError: (err: Error, _, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success("Task deleted");
    },
  });

  return { deleteTask, isPending };
}
