import { queryOptions } from "@tanstack/react-query";
import type { boards } from "@/lib/db/schema";

type Board = typeof boards.$inferSelect;

export const boardsQueryOptions = queryOptions<Board[]>({
  queryKey: ["boards"],
  queryFn: async () => {
    const res = await fetch("/api/boards");
    if (!res.ok) throw new Error("Failed to fetch boards");
    const json = await res.json();
    return json.data;
  },
});
