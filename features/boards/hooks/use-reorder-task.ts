"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { boardByIdQueryOptions, type BoardWithData } from "@/features/boards/queries";

export function useReorderTask(boardId: string) {
  const queryClient = useQueryClient();
  const queryKey = boardByIdQueryOptions(boardId).queryKey;

  const { mutate } = useMutation({
    mutationFn: async ({
      taskId,
      toIndex,
      columnId,
    }: {
      taskId: string;
      toIndex: number;
      columnId: string;
    }) => {
      const res = await fetch(`/api/tasks/${taskId}/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toIndex, columnId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json.data;
    },
    onMutate: ({ taskId, toIndex, columnId }) => {
      const previous = queryClient.getQueryData<BoardWithData>(queryKey);
      if (!previous) return { previous };

      const task = previous.tasks.find(t => t.id === taskId);
      if (!task) return { previous };

      const isSameColumn = task.columnId === columnId;

      const updatedTasks = previous.tasks.filter(t => t.id !== taskId);

      const columnTasks = updatedTasks
        .filter(t => t.columnId === columnId)
        .sort((a, b) => a.order - b.order);

      columnTasks.splice(toIndex, 0, { ...task, columnId });

      const otherTasks = updatedTasks.filter(t => t.columnId !== columnId);

      if (!isSameColumn) {
        const oldColumnTasks = otherTasks
          .filter(t => t.columnId === task.columnId)
          .map((t, i) => ({ ...t, order: i }));
        const newColumnTasks = columnTasks.map((t, i) => ({ ...t, order: i }));
        const rest = otherTasks.filter(t => t.columnId !== task.columnId);
        queryClient.setQueryData<BoardWithData>(queryKey, old => ({
          ...old!,
          tasks: [...rest, ...oldColumnTasks, ...newColumnTasks],
        }));
      } else {
        const newColumnTasks = columnTasks.map((t, i) => ({ ...t, order: i }));
        queryClient.setQueryData<BoardWithData>(queryKey, old => ({
          ...old!,
          tasks: [...otherTasks, ...newColumnTasks],
        }));
      }

      return { previous };
    },
    onSuccess: () => {
      toast.success("Task moved");
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
      toast.error("Failed to move task");
    },
  });

  const reorderTask = (taskId: string, toIndex: number, columnId: string) => {
    mutate({ taskId, toIndex, columnId });
  };

  return { reorderTask };
}
