"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { BoardWithColumns } from "@/features/boards/queries";

export function useRenameColumn() {
  const queryClient = useQueryClient();

  const { mutate: renameColumn, isPending } = useMutation({
    mutationFn: async ({
      columnId,
      name,
    }: {
      columnId: string;
      boardId: string;
      name: string;
    }) => {
      const res = await fetch(`/api/columns/${columnId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json.data;
    },
    onMutate: async ({ columnId, boardId, name }) => {
      const queryKey = ["boards", boardId];
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<BoardWithColumns>(queryKey);

      queryClient.setQueryData<BoardWithColumns>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          columns: old.columns.map((col) =>
            col.id === columnId ? { ...col, name } : col,
          ),
        };
      });

      return { previous, boardId };
    },
    onError: (err, _, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["boards", ctx.boardId], ctx.previous);
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success("Column renamed");
    },
  });

  return { renameColumn, isPending };
}
