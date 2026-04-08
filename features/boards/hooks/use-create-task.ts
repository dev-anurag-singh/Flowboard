"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { TCreateTaskSchema } from "@/features/boards/schemas/task";
import type { BoardWithData } from "@/features/boards/queries";

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
      const previous = queryClient.getQueryData<BoardWithData>(queryKey);

      queryClient.setQueryData<BoardWithData>(queryKey, (old) => {
        if (!old) return old;
        const tempTask = {
          id: data.id,
          title: data.title,
          description: data.description ?? null,
          order: old.tasks.length + 1,
          userId: "",
          columnId: data.columnId ?? null,
          boardId: data.boardId,
          parentId: null,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          subtasks: (data.subtasks ?? []).map((s, i) => ({
            id: s.id!,
            title: s.title,
            description: null,
            order: i + 1,
            userId: "",
            columnId: data.columnId ?? null,
            boardId: data.boardId,
            parentId: data.id,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
        };
        return { ...old, tasks: [...old.tasks, tempTask] };
      });

      return { previous };
    },
    onError: (err: Error, _, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
      toast.error(err.message);
    },
  });

  const createTask = (data: TCreateTaskSchema) => {
    mutate({
      ...data,
      id: crypto.randomUUID(),
      subtasks: (data.subtasks ?? []).map((s) => ({ ...s, id: crypto.randomUUID() })),
    });
  };

  return { createTask };
}
