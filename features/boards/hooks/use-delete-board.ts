"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { boardsQueryOptions } from "@/features/boards/queries";

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardsQueryOptions.queryKey });
      router.push("/dashboard");
      toast.success("Board deleted");
    },
    onError: (err) => toast.error(err.message),
  });

  return { deleteBoard, isPending };
}
