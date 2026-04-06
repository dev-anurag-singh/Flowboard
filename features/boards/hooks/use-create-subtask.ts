"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type CreateSubtaskData = {
  title: string;
  taskId: string;
  columnId: string;
};

export function useCreateSubtask(boardId: string) {
  const queryClient = useQueryClient();

  const { mutate: createSubtask, isPending } = useMutation({
    mutationFn: async ({ title, taskId, columnId }: CreateSubtaskData) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, columnId, boardId, parentId: taskId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards", boardId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { createSubtask, isPending };
}
