"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { boardsQueryOptions } from "@/features/boards/queries";

export function useRenameBoard() {
  const queryClient = useQueryClient();

  const { mutate: renameBoard, isPending } = useMutation({
    mutationFn: async ({ boardId, name }: { boardId: string; name: string }) => {
      const res = await fetch(`/api/boards/${boardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error);

      return json.data;
    },
    onSuccess: (_, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: boardsQueryOptions.queryKey });
      queryClient.invalidateQueries({ queryKey: ["boards", boardId] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { renameBoard, isPending };
}
