"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { boardByIdQueryOptions } from "@/features/boards/queries";

export function useCreateColumn(boardId: string) {
  const queryClient = useQueryClient();

  const { mutate: createColumn, isPending } = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch(`/api/boards/${boardId}/columns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: boardByIdQueryOptions(boardId).queryKey,
      });
      toast.success("Column created");
    },
    onError: (err) => toast.error(err.message),
  });

  return { createColumn, isPending };
}
