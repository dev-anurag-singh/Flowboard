import type { TaskWithSubtasks } from "@/features/boards/queries";

export function tasksForColumn(tasks: TaskWithSubtasks[], columnId: string): TaskWithSubtasks[] {
  return tasks.filter(t => t.columnId === columnId).sort((a, b) => a.order - b.order);
}
