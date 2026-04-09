"use client";

import { useQueryClient } from "@tanstack/react-query";
import { arrayMove } from "@dnd-kit/sortable";
import { boardByIdQueryOptions, type BoardWithData } from "@/features/boards/queries";

export function useReorderColumn(boardId: string) {
  const queryClient = useQueryClient();

  const reorderColumn = (activeId: string, overId: string) => {
    const queryKey = boardByIdQueryOptions(boardId).queryKey;
    const board = queryClient.getQueryData<BoardWithData>(queryKey);
    if (!board) return;

    const oldIndex = board.columns.findIndex(c => c.id === activeId);
    const newIndex = board.columns.findIndex(c => c.id === overId);
    if (oldIndex === newIndex) return;

    queryClient.setQueryData<BoardWithData>(queryKey, old => {
      if (!old) return old;
      return { ...old, columns: arrayMove(old.columns, oldIndex, newIndex) };
    });
  };

  return { reorderColumn };
}
