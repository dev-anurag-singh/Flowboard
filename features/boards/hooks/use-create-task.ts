"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreateTaskItem } from "@/schemas/task";
import type { BoardWithData } from "@/features/boards/queries";

type CreateTaskInput = {
  title: string;
  description?: string;
  columnId?: string;
  parentId?: string;
  subtasks?: { title: string }[];
};

export function useCreateTask(boardId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["boards", boardId];

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: CreateTaskItem[]) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json.data;
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<BoardWithData>(queryKey);

      queryClient.setQueryData<BoardWithData>(queryKey, (old) => {
        if (!old) return old;

        const parents = payload.filter((p) => !p.parentId);
        const subtasks = payload.filter((p) => p.parentId);
        let updatedTasks = [...old.tasks];

        for (const parent of parents) {
          const children = subtasks.filter((s) => s.parentId === parent.id);
          updatedTasks.push({
            id: parent.id,
            title: parent.title,
            description: parent.description ?? null,
            order: updatedTasks.length + 1,
            userId: "",
            columnId: parent.columnId ?? null,
            boardId: parent.boardId,
            parentId: null,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            subtasks: children.map((s, i) => ({
              id: s.id,
              title: s.title,
              description: null,
              order: i + 1,
              userId: "",
              columnId: null,
              boardId: s.boardId,
              parentId: parent.id,
              completed: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            })),
          });
        }

        const orphanSubtasks = subtasks.filter(
          (s) => !parents.some((p) => p.id === s.parentId),
        );
        for (const sub of orphanSubtasks) {
          updatedTasks = updatedTasks.map((t) => {
            if (t.id !== sub.parentId) return t;
            return {
              ...t,
              subtasks: [
                ...t.subtasks,
                {
                  id: sub.id,
                  title: sub.title,
                  description: null,
                  order: t.subtasks.length + 1,
                  userId: "",
                  columnId: null,
                  boardId: sub.boardId,
                  parentId: sub.parentId!,
                  completed: false,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
            };
          });
        }

        return { ...old, tasks: updatedTasks };
      });

      return { previous };
    },
    onError: (err: Error, _, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
      toast.error(err.message);
    },
  });

  const createTask = (data: CreateTaskInput) => {
    const taskId = crypto.randomUUID();
    const payload: CreateTaskItem[] = [
      {
        id: taskId,
        title: data.title,
        description: data.description,
        boardId,
        columnId: data.columnId,
        parentId: data.parentId,
      },
      ...(data.subtasks ?? []).map((s) => ({
        id: crypto.randomUUID(),
        title: s.title,
        boardId,
        parentId: taskId,
      })),
    ];
    mutate(payload);
  };

  return { createTask, isPending };
}
