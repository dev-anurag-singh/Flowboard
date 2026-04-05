"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { boardsQueryOptions } from "@/features/boards/queries";
import type { TCreateBoardSchema } from "@/features/boards/schemas/board";

export function useCreateBoard() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: createBoard, isPending } = useMutation({
    mutationFn: async (data: TCreateBoardSchema) => {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error);

      return json.data;
    },
    onSuccess: (board) => {
      queryClient.invalidateQueries({ queryKey: boardsQueryOptions.queryKey });
      router.push(`/board/${board.id}`);
      toast.success("Board created");
    },
    onError: (err) => toast.error(err.message),
  });

  return { createBoard, isPending };
}
