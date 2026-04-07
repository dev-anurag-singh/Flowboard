"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { BoardWithColumns } from "@/features/boards/queries";

export function useCreateColumn(boardId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["boards", boardId];

  const { mutate: createColumn, isPending } = useMutation({
    mutationFn: async ({ name, id }: { name: string; id: string }) => {
      const res = await fetch(`/api/boards/${boardId}/columns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json.data;
    },
    onMutate: async ({ name, id }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<BoardWithColumns>(queryKey);

      queryClient.setQueryData<BoardWithColumns>(queryKey, (old) => {
        if (!old) return old;
        const lastOrder = old.columns.at(-1)?.order ?? -1;
        const tempColumn = {
          id,
          name,
          boardId,
          userId: "",
          order: lastOrder + 1,
          tasks: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return { ...old, columns: [...old.columns, tempColumn] };
      });

      return { previous };
    },
    onError: (err, _, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success("Column created");
    },
  });

  // Generate ID on the client and pass it to mutate
  const createColumnWithId = (name: string, options?: Parameters<typeof createColumn>[1]) => {
    createColumn({ name, id: crypto.randomUUID() }, options);
  };

  return { createColumn: createColumnWithId, isPending };
}
