import type { TaskWithSubtasks } from "@/features/boards/queries";

/** Stable string for comparing full task layout (column + order) without reference equality. */
export function tasksLayoutSignature(tasks: TaskWithSubtasks[]): string {
  return [...tasks]
    .sort(
      (a, b) =>
        (a.columnId ?? "").localeCompare(b.columnId ?? "") ||
        a.order - b.order ||
        a.id.localeCompare(b.id),
    )
    .map(t => `${t.id}:${t.columnId ?? ""}:${t.order}`)
    .join("|");
}
