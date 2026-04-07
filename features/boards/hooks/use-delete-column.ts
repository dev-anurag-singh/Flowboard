"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { BoardWithColumns } from "@/features/boards/queries";

export function useDeleteColumn() {
  const queryClient = useQueryClient();

  const { mutate: deleteColumn, isPending } = useMutation({
    mutationFn: async ({ columnId }: { columnId: string; boardId: string }) => {
      const res = await fetch(`/api/columns/${columnId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json.data;
    },
    onMutate: async ({ columnId, boardId }) => {
      const queryKey = ["boards", boardId];
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<BoardWithColumns>(queryKey);

      queryClient.setQueryData<BoardWithColumns>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          columns: old.columns.filter((col) => col.id !== columnId),
        };
      });

      return { previous, boardId };
    },
    onError: (err, _, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["boards", ctx.boardId], ctx.previous);
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success("Column deleted");
    },
  });

  return { deleteColumn, isPending };
}
