import { queryOptions } from "@tanstack/react-query";
import type { boards, columns, tasks } from "@/lib/db/schema";

type Board = typeof boards.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type TaskWithSubtasks = Task & { subtasks: Task[] };
export type ColumnWithTasks = typeof columns.$inferSelect & { tasks: TaskWithSubtasks[] };
export type BoardWithColumns = typeof boards.$inferSelect & { columns: ColumnWithTasks[] };

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
    staleTime: Infinity,
    queryFn: async () => {
      const res = await fetch(`/api/boards/${boardId}`);
      if (!res.ok) throw new Error("Failed to fetch board");
      const json = await res.json();
      return json.data;
    },
  });
