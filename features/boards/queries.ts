import { queryOptions } from "@tanstack/react-query";
import type { boards, columns, tasks } from "@/lib/db/schema";

type Board = typeof boards.$inferSelect;
type Task = typeof tasks.$inferSelect;
type Column = typeof columns.$inferSelect & { tasks: Task[] };
export type BoardWithColumns = typeof boards.$inferSelect & { columns: Column[] };

export const boardsQueryOptions = queryOptions<Board[]>({
  queryKey: ["boards"],
  queryFn: async () => {
    const res = await fetch("/api/boards");
    if (!res.ok) throw new Error("Failed to fetch boards");
    const json = await res.json();
    return json.data;
  },
});

export const boardByIdQueryOptions = (boardId: string) =>
  queryOptions<BoardWithColumns>({
    queryKey: ["boards", boardId],
    queryFn: async () => {
      const res = await fetch(`/api/boards/${boardId}`);
      if (!res.ok) throw new Error("Failed to fetch board");
      const json = await res.json();
      return json.data;
    },
  });
