"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type UpdateSubtaskData = {
  subtaskId: string;
  data: { title?: string; completed?: boolean };
};

export function useUpdateSubtask(boardId: string) {
  const queryClient = useQueryClient();

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards", boardId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { updateSubtask, isPending };
}
