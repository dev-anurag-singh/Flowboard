"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { BoardWithColumns } from "@/features/boards/queries";

export function useDeleteSubtask(boardId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["boards", boardId];

  const { mutate: deleteSubtask, isPending } = useMutation({
    mutationFn: async (subtaskId: string) => {
      const res = await fetch(`/api/tasks/${subtaskId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json.data;
    },
    onMutate: async (subtaskId) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<BoardWithColumns>(queryKey);

      queryClient.setQueryData<BoardWithColumns>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          columns: old.columns.map((col) => ({
            ...col,
            tasks: col.tasks.map((t) => ({
              ...t,
              subtasks: t.subtasks.filter((s) => s.id !== subtaskId),
            })),
          })),
        };
      });

      return { previous };
    },
    onError: (err: Error, _, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
      toast.error(err.message);
    },
  });

  return { deleteSubtask, isPending };
}
