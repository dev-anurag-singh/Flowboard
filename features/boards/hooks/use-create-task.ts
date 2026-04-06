"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { TCreateTaskSchema } from "@/features/boards/schemas/task";

export function useCreateTask(boardId: string) {
  const queryClient = useQueryClient();

  const { mutate: createTask, isPending } = useMutation({
    mutationFn: async (data: TCreateTaskSchema) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards", boardId] });
      toast.success("Task created");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { createTask, isPending };
}
