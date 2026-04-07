"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Board = { id: string; [key: string]: unknown };

export function useDeleteBoard() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: deleteBoard, isPending } = useMutation({
    mutationFn: async (boardId: string) => {
      const res = await fetch(`/api/boards/${boardId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json.data;
    },
    onMutate: async (boardId) => {
      await queryClient.cancelQueries({ queryKey: ["boards"] });
      const previousList = queryClient.getQueryData<Board[]>(["boards"]);

      queryClient.setQueryData<Board[]>(["boards"], (old) =>
        old?.filter((b) => b.id !== boardId),
      );

      router.push("/dashboard");
      toast.success("Board deleted");

      return { previousList };
    },
    onError: (err, _, ctx) => {
      if (ctx?.previousList) queryClient.setQueryData(["boards"], ctx.previousList);
      toast.error(err.message);
    },
  });

  return { deleteBoard, isPending };
}
