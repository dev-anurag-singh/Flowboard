import { queryOptions } from "@tanstack/react-query";
import type { boards, columns, tasks } from "@/lib/db/schema";

export type DashboardBoard = typeof boards.$inferSelect & {
  columnCount: number;
  taskCount: number;
};

export type Column = typeof columns.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type TaskWithSubtasks = Task & { subtasks: Task[] };
export type BoardWithData = typeof boards.$inferSelect & {
  columns: Column[];
  tasks: TaskWithSubtasks[];
};

export const dashboardQueryOptions = queryOptions<DashboardBoard[]>({
  queryKey: ["dashboard"],
  staleTime: Infinity,
  queryFn: async () => {
    const res = await fetch("/api/dashboard");
    if (!res.ok) throw new Error("Failed to fetch dashboard");
    const json = await res.json();
    return json.data;
  },
});

export const boardsQueryOptions = queryOptions<(typeof boards.$inferSelect)[]>({
  queryKey: ["boards"],
  queryFn: async () => {
    const res = await fetch("/api/boards");
    if (!res.ok) throw new Error("Failed to fetch boards");
    const json = await res.json();
    return json.data;
  },
});

export const boardByIdQueryOptions = (boardId: string) =>
  queryOptions<BoardWithData>({
    queryKey: ["boards", boardId],
    staleTime: Infinity,
    queryFn: async () => {
      const res = await fetch(`/api/boards/${boardId}`);
      if (!res.ok) throw new Error("Failed to fetch board");
      const json = await res.json();
      return json.data;
    },
  });
