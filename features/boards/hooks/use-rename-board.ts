"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { BoardWithColumns } from "@/features/boards/queries";

type Board = { id: string; name: string; [key: string]: unknown };

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
    onMutate: async ({ boardId, name }) => {
      await queryClient.cancelQueries({ queryKey: ["boards"] });
      await queryClient.cancelQueries({ queryKey: ["boards", boardId] });

      const previousList = queryClient.getQueryData<Board[]>(["boards"]);
      const previousDetail = queryClient.getQueryData<BoardWithColumns>(["boards", boardId]);

      queryClient.setQueryData<Board[]>(["boards"], (old) =>
        old?.map((b) => (b.id === boardId ? { ...b, name } : b)),
      );
      queryClient.setQueryData<BoardWithColumns>(["boards", boardId], (old) =>
        old ? { ...old, name } : old,
      );

      return { previousList, previousDetail, boardId };
    },
    onError: (err, _, ctx) => {
      if (ctx?.previousList) queryClient.setQueryData(["boards"], ctx.previousList);
      if (ctx?.previousDetail) queryClient.setQueryData(["boards", ctx.boardId], ctx.previousDetail);
      toast.error(err.message);
    },
  });

  return { renameBoard, isPending };
}
