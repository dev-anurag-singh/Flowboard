"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { arrayMove } from "@dnd-kit/sortable";
import { boardByIdQueryOptions, type BoardWithData } from "@/features/boards/queries";

export function useReorderColumn(boardId: string) {
  const queryClient = useQueryClient();
  const queryKey = boardByIdQueryOptions(boardId).queryKey;

  const { mutate } = useMutation({
    mutationFn: async ({ columnId, toIndex }: { columnId: string; toIndex: number }) => {
      const res = await fetch(`/api/columns/${columnId}/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toIndex }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json.data;
    },
    onMutate: ({ columnId, toIndex }) => {
      const previous = queryClient.getQueryData<BoardWithData>(queryKey);
      if (!previous) return { previous };

      const oldIndex = previous.columns.findIndex(c => c.id === columnId);
      queryClient.setQueryData<BoardWithData>(queryKey, old => {
        if (!old) return old;
        return { ...old, columns: arrayMove(old.columns, oldIndex, toIndex) };
      });

      return { previous };
    },
    onError: (_, __, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
    },
  });

  const reorderColumn = (activeId: string, overId: string) => {
    const board = queryClient.getQueryData<BoardWithData>(queryKey);
    if (!board) return;

    const oldIndex = board.columns.findIndex(c => c.id === activeId);
    const toIndex = board.columns.findIndex(c => c.id === overId);
    if (oldIndex === toIndex) return;

    mutate({ columnId: activeId, toIndex });
  };

  return { reorderColumn };
}
