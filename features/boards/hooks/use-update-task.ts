"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { BoardWithColumns } from "@/features/boards/queries";

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
      const previous = queryClient.getQueryData<BoardWithColumns>(queryKey);

      queryClient.setQueryData<BoardWithColumns>(queryKey, (old) => {
        if (!old) return old;

        if (!data.columnId) {
          return {
            ...old,
            columns: old.columns.map((col) => ({
              ...col,
              tasks: col.tasks.map((t) =>
                t.id === taskId ? { ...t, ...data } : t,
              ),
            })),
          };
        }

        const task = old.columns.flatMap((c) => c.tasks).find((t) => t.id === taskId);
        if (!task) return old;

        return {
          ...old,
          columns: old.columns.map((col) => {
            if (col.id === task.columnId) {
              return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
            }
            if (col.id === data.columnId) {
              return { ...col, tasks: [...col.tasks, { ...task, ...data }] };
            }
            return col;
          }),
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
