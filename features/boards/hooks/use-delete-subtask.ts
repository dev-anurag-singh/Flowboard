"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteSubtask(boardId: string) {
  const queryClient = useQueryClient();

  const { mutate: deleteSubtask, isPending } = useMutation({
    mutationFn: async (subtaskId: string) => {
      const res = await fetch(`/api/tasks/${subtaskId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards", boardId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { deleteSubtask, isPending };
}
