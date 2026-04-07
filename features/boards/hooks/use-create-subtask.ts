"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { BoardWithColumns } from "@/features/boards/queries";

type CreateSubtaskData = {
  title: string;
  taskId: string;
  columnId: string;
};

export function useCreateSubtask(boardId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["boards", boardId];

  const { mutate: createSubtask, isPending } = useMutation({
    mutationFn: async ({ title, taskId, columnId, id }: CreateSubtaskData & { id: string }) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, columnId, boardId, parentId: taskId, id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json.data;
    },
    onMutate: async ({ title, taskId, columnId, id }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<BoardWithColumns>(queryKey);

      queryClient.setQueryData<BoardWithColumns>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          columns: old.columns.map((col) => ({
            ...col,
            tasks: col.tasks.map((t) => {
              if (t.id !== taskId) return t;
              const tempSubtask = {
                id,
                title,
                description: null,
                completed: false,
                order: t.subtasks.length,
                userId: "",
                boardId,
                columnId,
                parentId: taskId,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              return { ...t, subtasks: [...t.subtasks, tempSubtask] };
            }),
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

  const createSubtaskWithId = (
    data: CreateSubtaskData,
    options?: Parameters<typeof createSubtask>[1],
  ) => {
    createSubtask({ ...data, id: crypto.randomUUID() }, options);
  };

  return { createSubtask: createSubtaskWithId, isPending };
}
