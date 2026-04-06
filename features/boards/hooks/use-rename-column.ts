"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useRenameColumn() {
  const queryClient = useQueryClient();

  const { mutate: renameColumn, isPending } = useMutation({
    mutationFn: async ({
      columnId,
      boardId,
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
      return { ...json.data, boardId };
    },
    onSuccess: ({ boardId }) => {
      queryClient.invalidateQueries({ queryKey: ["boards", boardId] });
      toast.success("Column renamed");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { renameColumn, isPending };
}
