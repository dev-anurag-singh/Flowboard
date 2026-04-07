"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { TCreateTaskSchema } from "@/features/boards/schemas/task";
import type { BoardWithColumns } from "@/features/boards/queries";

type CreateTaskData = TCreateTaskSchema & { id: string };

export function useCreateTask(boardId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["boards", boardId];

  const { mutate } = useMutation({
    mutationFn: async (data: CreateTaskData) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json.data;
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<BoardWithColumns>(queryKey);

      queryClient.setQueryData<BoardWithColumns>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          columns: old.columns.map((col) => {
            if (col.id !== data.columnId) return col;
            const tempTask = {
              id: data.id,
              title: data.title,
              description: data.description ?? null,
              order: col.tasks.length,
              userId: "",
              columnId: data.columnId,
              boardId: data.boardId,
              parentId: null,
              completed: false,
              createdAt: new Date(),
              updatedAt: new Date(),
              subtasks: (data.subtasks ?? []).map((s, i) => ({
                id: crypto.randomUUID(),
                title: s.title,
                description: null,
                order: i,
                userId: "",
                columnId: data.columnId,
                boardId: data.boardId,
                parentId: data.id,
                completed: false,
                createdAt: new Date(),
                updatedAt: new Date(),
              })),
            };
            return { ...col, tasks: [...col.tasks, tempTask] };
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

  const createTask = (data: TCreateTaskSchema) => {
    mutate({ ...data, id: crypto.randomUUID() });
  };

  return { createTask };
}
