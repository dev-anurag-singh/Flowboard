"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteColumn() {
  const queryClient = useQueryClient();

  const { mutate: deleteColumn, isPending } = useMutation({
    mutationFn: async ({
      columnId,
      boardId,
    }: {
      columnId: string;
      boardId: string;
    }) => {
      const res = await fetch(`/api/columns/${columnId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return { ...json.data, boardId };
    },
    onSuccess: ({ boardId }) => {
      queryClient.invalidateQueries({ queryKey: ["boards", boardId] });
      toast.success("Column deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { deleteColumn, isPending };
}
