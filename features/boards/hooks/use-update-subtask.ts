"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { BoardWithData } from "@/features/boards/queries";

type UpdateSubtaskData = {
  subtaskId: string;
  data: { title?: string; completed?: boolean };
};

export function useUpdateSubtask(boardId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["boards", boardId];

  const { mutate: updateSubtask, isPending } = useMutation({
    mutationFn: async ({ subtaskId, data }: UpdateSubtaskData) => {
      const res = await fetch(`/api/tasks/${subtaskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json.data;
    },
    onMutate: async ({ subtaskId, data }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<BoardWithData>(queryKey);

      queryClient.setQueryData<BoardWithData>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          tasks: old.tasks.map((t) => ({
            ...t,
            subtasks: t.subtasks.map((s) =>
              s.id === subtaskId ? { ...s, ...data } : s,
            ),
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

  return { updateSubtask, isPending };
}
